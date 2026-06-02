/* Life Archive — local "repository" layer.
   Everything lives in localStorage so the app runs from file:// with no server.
   Two collections: commits (life snapshots) and branches (decision forks). */
(function (global) {
  'use strict';

  var KEY_COMMITS = 'lifearchive.commits.v1';
  var KEY_BRANCHES = 'lifearchive.branches.v1';
  var KEY_META = 'lifearchive.meta.v1';

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('store.read failed for', key, e);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      // Most likely the 5MB quota — photos are the usual culprit.
      console.error('store.write failed (quota?)', e);
      return false;
    }
  }

  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + '_' +
      Math.random().toString(36).slice(2, 7);
  }

  /* ---- Scenes: the preset "repos" a commit can belong to ---- */
  var SCENES = [
    { id: 'bag',     emoji: '🎒', zh: '出门包',   en: 'Go-bag' },
    { id: 'desk',    emoji: '🖥️', zh: '书桌',     en: 'Desk' },
    { id: 'room',    emoji: '🛏️', zh: '房间',     en: 'Room' },
    { id: 'kitchen', emoji: '🍳', zh: '厨房',     en: 'Kitchen' },
    { id: 'fridge',  emoji: '🧊', zh: '冰箱',     en: 'Fridge' },
    { id: 'closet',  emoji: '👕', zh: '衣柜',     en: 'Closet' },
    { id: 'luggage', emoji: '🧳', zh: '行李箱',   en: 'Luggage' },
    { id: 'homework',emoji: '📚', zh: '作业资料', en: 'Coursework' },
    { id: 'group',   emoji: '👥', zh: '小组分工', en: 'Group task' },
    { id: 'car',     emoji: '🚗', zh: '车',       en: 'Car' },
    { id: 'wallet',  emoji: '💳', zh: '钱包预算', en: 'Wallet' },
    { id: 'drawer',  emoji: '🗄️', zh: '抽屉',     en: 'Drawer' },
    { id: 'other',   emoji: '📦', zh: '其他',     en: 'Other' }
  ];

  function sceneById(id) {
    for (var i = 0; i < SCENES.length; i++) {
      if (SCENES[i].id === id) return SCENES[i];
    }
    return SCENES[SCENES.length - 1];
  }

  var Store = {
    SCENES: SCENES,
    sceneById: sceneById,
    uid: uid,

    /* ---------- Commits ---------- */
    commits: function () {
      var list = read(KEY_COMMITS, []);
      // newest first
      list.sort(function (a, b) { return b.createdAt - a.createdAt; });
      return list;
    },

    commitsForScene: function (sceneId) {
      return this.commits().filter(function (c) { return c.scene === sceneId; });
    },

    getCommit: function (id) {
      var all = read(KEY_COMMITS, []);
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) return all[i];
      }
      return null;
    },

    addCommit: function (commit) {
      var all = read(KEY_COMMITS, []);
      // parent = previous latest commit in the same scene (forms a chain)
      var sameScene = all.filter(function (c) { return c.scene === commit.scene; });
      sameScene.sort(function (a, b) { return b.createdAt - a.createdAt; });
      commit.id = commit.id || uid('c');
      commit.parentId = sameScene.length ? sameScene[0].id : null;
      commit.createdAt = commit.createdAt || Date.now();
      all.push(commit);
      var ok = write(KEY_COMMITS, all);
      return ok ? commit : null;
    },

    updateCommit: function (id, patch) {
      var all = read(KEY_COMMITS, []);
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) {
          for (var k in patch) { if (patch.hasOwnProperty(k)) all[i][k] = patch[k]; }
          write(KEY_COMMITS, all);
          return all[i];
        }
      }
      return null;
    },

    deleteCommit: function (id) {
      var all = read(KEY_COMMITS, []).filter(function (c) { return c.id !== id; });
      write(KEY_COMMITS, all);
    },

    /* ---------- Branches (decisions) ---------- */
    branches: function () {
      var list = read(KEY_BRANCHES, []);
      list.sort(function (a, b) { return b.createdAt - a.createdAt; });
      return list;
    },

    getBranch: function (id) {
      var all = read(KEY_BRANCHES, []);
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) return all[i];
      }
      return null;
    },

    addBranch: function (branch) {
      var all = read(KEY_BRANCHES, []);
      branch.id = branch.id || uid('b');
      branch.createdAt = branch.createdAt || Date.now();
      all.push(branch);
      write(KEY_BRANCHES, all);
      return branch;
    },

    updateBranch: function (id, patch) {
      var all = read(KEY_BRANCHES, []);
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) {
          for (var k in patch) { if (patch.hasOwnProperty(k)) all[i][k] = patch[k]; }
          write(KEY_BRANCHES, all);
          return all[i];
        }
      }
      return null;
    },

    deleteBranch: function (id) {
      var all = read(KEY_BRANCHES, []).filter(function (b) { return b.id !== id; });
      write(KEY_BRANCHES, all);
    },

    /* ---------- Meta / preferences ---------- */
    meta: function () { return read(KEY_META, { lang: 'zh' }); },
    setMeta: function (patch) {
      var m = this.meta();
      for (var k in patch) { if (patch.hasOwnProperty(k)) m[k] = patch[k]; }
      write(KEY_META, m);
      return m;
    },

    /* ---------- Demo seed ---------- */
    isEmpty: function () { return read(KEY_COMMITS, []).length === 0; },

    clearAll: function () {
      localStorage.removeItem(KEY_COMMITS);
      localStorage.removeItem(KEY_BRANCHES);
    },

    exportJSON: function () {
      return JSON.stringify(this.exportRaw(), null, 2);
    },

    /* ---------- Cloud sync helpers (raw data in/out) ---------- */
    exportRaw: function () {
      return { commits: read(KEY_COMMITS, []), branches: read(KEY_BRANCHES, []) };
    },
    replaceAll: function (data) {
      data = data || {};
      write(KEY_COMMITS, data.commits || []);
      write(KEY_BRANCHES, data.branches || []);
    }
  };

  global.RG_STORE = Store;
})(window);
