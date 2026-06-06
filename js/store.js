/* Life Archive — local "repository" layer.
   commits + branches live in IndexedDB (large quota; photos are inline dataURLs and
   would blow past localStorage's ~5MB cap). They are mirrored in an in-memory cache
   so the rest of the app can read synchronously; Store.init() hydrates the cache
   (migrating any old localStorage data on first run) before the first render.
   Small preferences (meta) stay in localStorage so they're available synchronously
   at module load. If IndexedDB is unavailable (private mode, etc.) we transparently
   fall back to localStorage. */
(function (global) {
  'use strict';

  var KEY_COMMITS = 'lifearchive.commits.v1';
  var KEY_BRANCHES = 'lifearchive.branches.v1';
  var KEY_TOMBSTONES = 'lifearchive.tombstones.v1';
  var KEY_META = 'lifearchive.meta.v1';
  var IDB_NAME = 'lifearchive';
  var IDB_STORE = 'kv';
  var IDB_BLOBS = 'blobs';

  /* ---- localStorage (meta + fallback when IndexedDB is unavailable) ---- */
  function lsRead(key, fallback) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { console.warn('store.lsRead failed for', key, e); return fallback; }
  }
  function lsWrite(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { console.error('store.lsWrite failed (quota?)', e); return false; }
  }

  /* ---- IndexedDB (a tiny key/value store for the big collections) ---- */
  var idb = null;
  function openIDB() {
    return new Promise(function (resolve) {
      try {
        if (!global.indexedDB) return resolve(null);
        var req = indexedDB.open(IDB_NAME, 2);
        req.onupgradeneeded = function () {
          var db = req.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
          if (!db.objectStoreNames.contains(IDB_BLOBS)) db.createObjectStore(IDB_BLOBS);
        };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { resolve(null); };
        req.onblocked = function () { resolve(null); };
      } catch (e) { resolve(null); }
    });
  }
  function idbGet(key) {
    return new Promise(function (resolve) {
      try {
        var r = idb.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get(key);
        r.onsuccess = function () { resolve(r.result); };
        r.onerror = function () { resolve(undefined); };
      } catch (e) { resolve(undefined); }
    });
  }
  function idbSet(key, value) {
    try { idb.transaction(IDB_STORE, 'readwrite').objectStore(IDB_STORE).put(value, key); }
    catch (e) { console.error('store.idbSet failed', e); }
  }
  function idbGetBlob(key) {
    return new Promise(function (resolve) {
      try {
        var r = idb.transaction(IDB_BLOBS, 'readonly').objectStore(IDB_BLOBS).get(key);
        r.onsuccess = function () { resolve(r.result); };
        r.onerror = function () { resolve(undefined); };
      } catch (e) { resolve(undefined); }
    });
  }
  function idbPutBlob(key, blob) {
    return new Promise(function (resolve) {
      try {
        var tx = idb.transaction(IDB_BLOBS, 'readwrite');
        tx.objectStore(IDB_BLOBS).put(blob, key);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      } catch (e) { resolve(false); }
    });
  }
  function idbDelBlob(key) {
    return new Promise(function (resolve) {
      try {
        var tx = idb.transaction(IDB_BLOBS, 'readwrite');
        tx.objectStore(IDB_BLOBS).delete(key);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(true); };
      } catch (e) { resolve(true); }
    });
  }

  /* ---- in-memory cache (authoritative after init) ---- */
  // tombstones: { id: deletedAtMs } — a record of what was deleted, so the deletion
  // survives a cloud round-trip. Without them the id-union merge would re-download a
  // locally-deleted commit from the cloud and "un-delete" it. Synced like the rest.
  var cache = { commits: [], branches: [], tombstones: {} };
  function persist() {
    if (idb) {
      idbSet(KEY_COMMITS, cache.commits);
      idbSet(KEY_BRANCHES, cache.branches);
      idbSet(KEY_TOMBSTONES, cache.tombstones);
      return true;
    }
    var a = lsWrite(KEY_COMMITS, cache.commits);
    var b = lsWrite(KEY_BRANCHES, cache.branches);
    lsWrite(KEY_TOMBSTONES, cache.tombstones);
    return a && b;
  }

  /* mark an id as deleted (now). The timestamp lets a later edit/restore win over an
     older deletion, and lets the cloud merge drop the record on every device. */
  function tombstone(id) { if (id) cache.tombstones[id] = Date.now(); }
  function copyMap(m) {
    var o = {};
    for (var k in m) { if (m.hasOwnProperty(k)) o[k] = m[k]; }
    return o;
  }
  function recStamp(it) { return (it && (it.updatedAt || it.createdAt)) || 0; }
  // Drop any cached record a tombstone says was deleted at/after its last change. A record
  // edited AFTER its deletion (larger stamp) survives — deliberate "edit beats stale delete".
  function applyTombstones() {
    var t = cache.tombstones || {};
    function keep(it) { var d = t[it.id] || 0; return !(d && d >= recStamp(it)); }
    cache.commits = cache.commits.filter(keep);
    cache.branches = cache.branches.filter(keep);
  }

  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + '_' +
      Math.random().toString(36).slice(2, 7);
  }

  function strBytes(s) { return s ? String(s).length : 0; }
  function itemBytes(it) {
    if (!it) return 0;
    return strBytes(it.name) + 8;
  }
  function fileBytes(f) {
    if (!f) return 0;
    return strBytes(f.name) + strBytes(f.type) + 16 + (f.size || strBytes(f.data));
  }
  function commitBytes(c) {
    if (!c) return 0;
    var n = 96 + strBytes(c.id) + strBytes(c.parentId) + strBytes(c.scene) +
      strBytes(c.message) + strBytes(c.notes) + strBytes(c.photo) + strBytes(c.fromBranchId);
    (c.items || []).forEach(function (it) { n += itemBytes(it); });
    (c.files || []).forEach(function (f) { n += fileBytes(f); });
    return n;
  }
  function branchBytes(b) {
    if (!b) return 0;
    var n = 96 + strBytes(b.id) + strBytes(b.question) + strBytes(b.dueAt) +
      strBytes(b.confidence) + strBytes(b.contextCommitId) + strBytes(b.mergedCommitId);
    (b.tags || []).forEach(function (tag) { n += strBytes(tag); });
    (b.actual || []).forEach(function (line) { n += strBytes(line); });
    (b.branches || []).forEach(function (br) {
      n += strBytes(br && br.name);
      ((br && br.predicted) || []).forEach(function (line) { n += strBytes(line); });
    });
    if (b.followup) {
      n += strBytes(b.followup.note) + 32;
      (b.followup.actual || []).forEach(function (line) { n += strBytes(line); });
    }
    return n;
  }

  /* ---- Scenes: the preset "repos" a commit can belong to ----
     group 'meal' = 饭迹/饮食 records, 'item' = the original物品场景.
     IMPORTANT: keep 'other' as the LAST element — sceneById() falls back to it. */
  var SCENES = [
    { id: 'bag',     emoji: '🎒', zh: '出门包',   en: 'Go-bag',     group: 'item' },
    { id: 'desk',    emoji: '🖥️', zh: '书桌',     en: 'Desk',       group: 'item' },
    { id: 'room',    emoji: '🛏️', zh: '房间',     en: 'Room',       group: 'item' },
    { id: 'kitchen', emoji: '🍳', zh: '厨房',     en: 'Kitchen',    group: 'item' },
    { id: 'fridge',  emoji: '🧊', zh: '冰箱',     en: 'Fridge',     group: 'item' },
    { id: 'closet',  emoji: '👕', zh: '衣柜',     en: 'Closet',     group: 'item' },
    { id: 'luggage', emoji: '🧳', zh: '行李箱',   en: 'Luggage',    group: 'item' },
    { id: 'homework',emoji: '📚', zh: '作业资料', en: 'Coursework', group: 'item' },
    { id: 'group',   emoji: '👥', zh: '小组分工', en: 'Group task', group: 'item' },
    { id: 'car',     emoji: '🚗', zh: '车',       en: 'Car',        group: 'item' },
    { id: 'wallet',  emoji: '💳', zh: '钱包预算', en: 'Wallet',     group: 'item' },
    { id: 'drawer',  emoji: '🗄️', zh: '抽屉',     en: 'Drawer',     group: 'item' },
    /* 饭迹 / 饮食 */
    { id: 'breakfast', emoji: '🥣', zh: '早餐',     en: 'Breakfast',       group: 'meal' },
    { id: 'lunch',     emoji: '🍚', zh: '午餐',     en: 'Lunch',           group: 'meal' },
    { id: 'dinner',    emoji: '🍽️', zh: '晚餐',     en: 'Dinner',          group: 'meal' },
    { id: 'latenight', emoji: '🌙', zh: '夜宵',     en: 'Late-night',      group: 'meal' },
    { id: 'snack',     emoji: '🧋', zh: '零食饮品', en: 'Snacks & drinks', group: 'meal' },
    /* 票据 / 票根 — 购物小票、电影票、车票、发票等 */
    { id: 'ticket',  emoji: '🎫', zh: '票根票券', en: 'Tickets',    group: 'ticket' },
    { id: 'receipt', emoji: '🧾', zh: '购物小票', en: 'Receipts',   group: 'ticket' },
    { id: 'invoice', emoji: '📃', zh: '发票账单', en: 'Invoices',   group: 'ticket' },
    { id: 'other',   emoji: '📦', zh: '其他',     en: 'Other',      group: 'item' }
  ];

  function isMealScene(id) {
    var s = sceneById(id);
    return !!(s && s.group === 'meal');
  }

  function sceneById(id) {
    for (var i = 0; i < SCENES.length; i++) {
      if (SCENES[i].id === id) return SCENES[i];
    }
    return SCENES[SCENES.length - 1];
  }

  var Store = {
    SCENES: SCENES,
    sceneById: sceneById,
    isMealScene: isMealScene,
    uid: uid,

    /* Hydrate the cache from IndexedDB (migrating old localStorage data on first
       run). Resolves before the app renders. */
    init: function () {
      return openIDB().then(function (db) {
        idb = db;
        if (!idb) {
          cache.commits = lsRead(KEY_COMMITS, []);
          cache.branches = lsRead(KEY_BRANCHES, []);
          cache.tombstones = lsRead(KEY_TOMBSTONES, {}) || {};
          return;
        }
        return Promise.all([idbGet(KEY_COMMITS), idbGet(KEY_BRANCHES), idbGet(KEY_TOMBSTONES)]).then(function (res) {
          if (res[0] === undefined && res[1] === undefined) {
            // first run on IDB — migrate anything already saved in localStorage
            cache.commits = lsRead(KEY_COMMITS, []);
            cache.branches = lsRead(KEY_BRANCHES, []);
            cache.tombstones = lsRead(KEY_TOMBSTONES, {}) || {};
            if (cache.commits.length || cache.branches.length || Object.keys(cache.tombstones).length) {
              persist();
              try {
                localStorage.removeItem(KEY_COMMITS); localStorage.removeItem(KEY_BRANCHES);
                localStorage.removeItem(KEY_TOMBSTONES);
              } catch (e) {}
            }
          } else {
            cache.commits = res[0] || [];
            cache.branches = res[1] || [];
            cache.tombstones = res[2] || {};
          }
        });
      });
    },

    /* ---------- Commits ---------- */
    commits: function () {
      // newest first; return a copy so callers can't mutate the cache
      return cache.commits.slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    },

    commitsForScene: function (sceneId) {
      return this.commits().filter(function (c) { return c.scene === sceneId; });
    },

    getCommit: function (id) {
      for (var i = 0; i < cache.commits.length; i++) {
        if (cache.commits[i].id === id) return cache.commits[i];
      }
      return null;
    },

    addCommit: function (commit) {
      commit.createdAt = commit.createdAt || Date.now();
      // parent = previous latest REAL commit before this archive time (forms a chain).
      // Planned drafts (预存档/计划) never join the chain, so real history stays clean.
      var sameScene = cache.commits.filter(function (c) {
        return c.scene === commit.scene && !c.planned && (c.createdAt || 0) <= commit.createdAt;
      });
      sameScene.sort(function (a, b) { return b.createdAt - a.createdAt; });
      commit.id = commit.id || uid('c');
      commit.parentId = commit.planned ? null : (sameScene.length ? sameScene[0].id : null);
      // updatedAt drives conflict resolution on cloud sync (newest wins) so a fresh
      // local change is never clobbered by a stale remote copy of the same commit.
      commit.updatedAt = commit.updatedAt || commit.createdAt;
      cache.commits.push(commit);
      return persist() ? commit : null;
    },

    updateCommit: function (id, patch) {
      for (var i = 0; i < cache.commits.length; i++) {
        if (cache.commits[i].id === id) {
          for (var k in patch) { if (patch.hasOwnProperty(k)) cache.commits[i][k] = patch[k]; }
          cache.commits[i].updatedAt = Date.now();
          persist();
          return cache.commits[i];
        }
      }
      return null;
    },

    // Flag/unflag a commit as important (starred). Returns the new starred state.
    toggleStar: function (id) {
      for (var i = 0; i < cache.commits.length; i++) {
        if (cache.commits[i].id === id) {
          cache.commits[i].starred = !cache.commits[i].starred;
          cache.commits[i].updatedAt = Date.now();
          persist();
          return cache.commits[i].starred;
        }
      }
      return false;
    },

    // Turn a planned (预存档 / 计划) commit into a real one: it "happens" now, joins
    // the scene's real chain, and stops showing in the 计划中 section.
    fulfillCommit: function (id) {
      for (var i = 0; i < cache.commits.length; i++) {
        if (cache.commits[i].id === id) {
          var c = cache.commits[i];
          var sameScene = cache.commits.filter(function (x) {
            return x.scene === c.scene && !x.planned && x.id !== id;
          });
          sameScene.sort(function (a, b) { return b.createdAt - a.createdAt; });
          c.planned = false;
          c.parentId = sameScene.length ? sameScene[0].id : null;
          c.createdAt = Date.now();
          c.updatedAt = Date.now();
          persist();
          return c;
        }
      }
      return null;
    },

    deleteCommit: function (id) {
      var c = this.getCommit(id);
      if (c && c.media && idb) {
        c.media.forEach(function (m) { if (m && m.blobId) idbDelBlob(m.blobId); });
      }
      cache.commits = cache.commits.filter(function (c) { return c.id !== id; });
      tombstone(id);
      persist();
    },

    /* ---------- Branches (decisions) ---------- */
    branches: function () {
      return cache.branches.slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    },

    getBranch: function (id) {
      for (var i = 0; i < cache.branches.length; i++) {
        if (cache.branches[i].id === id) return cache.branches[i];
      }
      return null;
    },

    addBranch: function (branch) {
      branch.id = branch.id || uid('b');
      branch.createdAt = branch.createdAt || Date.now();
      branch.updatedAt = branch.updatedAt || branch.createdAt;
      cache.branches.push(branch);
      persist();
      return branch;
    },

    updateBranch: function (id, patch) {
      for (var i = 0; i < cache.branches.length; i++) {
        if (cache.branches[i].id === id) {
          for (var k in patch) { if (patch.hasOwnProperty(k)) cache.branches[i][k] = patch[k]; }
          cache.branches[i].updatedAt = Date.now();
          persist();
          return cache.branches[i];
        }
      }
      return null;
    },

    deleteBranch: function (id) {
      cache.branches = cache.branches.filter(function (b) { return b.id !== id; });
      tombstone(id);
      persist();
    },

    /* ---------- Meta / preferences (localStorage — tiny, needed at load) ---------- */
    meta: function () { return lsRead(KEY_META, { lang: 'zh' }); },
    setMeta: function (patch) {
      var m = this.meta();
      for (var k in patch) { if (patch.hasOwnProperty(k)) m[k] = patch[k]; }
      lsWrite(KEY_META, m);
      return m;
    },

    /* ---------- Misc ---------- */
    isEmpty: function () { return cache.commits.length === 0; },

    clearAll: function () {
      // tombstone everything so a "clear all" also clears the cloud copy on next sync,
      // instead of the cloud re-seeding the wiped archive back onto this device.
      cache.commits.forEach(function (c) { tombstone(c.id); });
      cache.branches.forEach(function (b) { tombstone(b.id); });
      cache.commits = []; cache.branches = []; persist();
    },

    exportJSON: function () { return JSON.stringify(this.exportRaw(), null, 2); },

    /* approx bytes used by the archive (photos dominate) + which backend is active.
       Keep this linear and non-JSON-stringifying: on phones, stringifying a large
       photo/file archive just to open Settings can monopolize the WebView thread. */
    usage: function () {
      try {
        var n = 0;
        cache.commits.forEach(function (c) { n += commitBytes(c); });
        cache.branches.forEach(function (b) { n += branchBytes(b); });
        return n;
      }
      catch (e) { return 0; }
    },
    backend: function () { return idb ? 'indexeddb' : 'localstorage'; },
    putBlob: function (id, blob) {
      if (!idb) return Promise.resolve(false);
      return idbPutBlob(id, blob);
    },
    getBlob: function (id) {
      if (!idb) return Promise.resolve(null);
      return idbGetBlob(id).then(function (b) { return b || null; });
    },
    deleteBlob: function (id) {
      if (!idb) return Promise.resolve(true);
      return idbDelBlob(id);
    },

    /* ---------- Cloud sync helpers (raw data in/out) ---------- */
    exportRaw: function () {
      return { commits: cache.commits.slice(), branches: cache.branches.slice(),
               tombstones: copyMap(cache.tombstones) };
    },
    replaceAll: function (data) {
      data = data || {};
      cache.commits = data.commits || [];
      cache.branches = data.branches || [];
      // keep local tombstones if the incoming blob predates the feature (old backup),
      // otherwise adopt the merged set; then enforce them so nothing deleted lingers.
      if (data.tombstones) cache.tombstones = data.tombstones;
      applyTombstones();
      persist();
    }
  };

  global.RG_STORE = Store;
})(window);
