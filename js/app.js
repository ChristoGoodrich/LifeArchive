/* Life Archive — UI, routing, and feature wiring. Vanilla JS, no build step. */
(function () {
  'use strict';

  var Store = window.RG_STORE;
  var Diff = window.RG_DIFF;

  /* ---------------- i18n ---------------- */
  var I18N = {
    zh: {
      brand: '生活存档',
      tagline: '给现实生活装一个 Git',
      nav_timeline: '时间线', nav_commit: '新建存档', nav_diff: '现实对比',
      nav_rollback: '回滚', nav_branch: '分支决策',
      empty_title: '还没有任何生活存档',
      empty_sub: '在出门、收拾、写作业之前，先给现实拍一张「commit」。',
      empty_cta: '创建第一个存档', empty_seed: '载入示例数据',
      scene: '场景', message: 'Commit message（一句话说明）', photo: '拍照 / 上传照片',
      items: '物品 / 清单', notes: '备注', files: '文件 / 图片',
      add_item: '+ 添加一项', item_name: '物品名', item_qty: '数量',
      save_commit: '提交存档', cancel: '取消',
      commit_placeholder: '例如：出门去学校前，带电脑和充电器',
      latest: '最新', base: '旧版本 (base)', compare: '新版本 (compare)',
      run_diff: '对比', changed: '画面变化', heat_hint: '变化最明显的区域',
      added: '多了', removed: '少了', changed_qty: '数量变化', kept: '保持不变',
      no_change: '两个版本几乎一致 👍',
      rollback_pick: '选择要恢复到的存档', rollback_version: '时间描述', rollback_steps: '恢复步骤',
      rollback_intro: '按下面的步骤，把现状恢复到这个存档：',
      step_remove: '拿走 / 移除', step_add: '放回 / 补上', step_check: '确认仍在',
      done: '完成', branch_q: '你在纠结什么？',
      branch_q_ph: '例如：今晚写作业 还是 出去玩？',
      branch_a: '分支 A', branch_b: '分支 B', branch_name: '这个选择是…',
      outcome: '可能的结果（每行一条）', create_branch: '生成分支',
      choose: '选这条', chosen: '已选择', followup: '复盘',
      rate: '结果如何？', repeat: '下次还选同样的路？',
      yes: '会', no: '不会', save_followup: '保存复盘',
      branch_empty: '还没有决策分支。纠结的时候，让现实也开个 branch。',
      delete: '删除', confirm_delete: '确定删除这个存档？',
      commit_id: '存档号', add_file: '＋ 添加文件 / 图片',
      confirm_delete_branch: '确定删除这个分支决策？',
      new_branch: '新建分支决策', edit_branch: '编辑分支',
      save_branch: '保存分支', add_option: '＋ 添加选项', remove_option: '删除选项',
      reference: '目标参考图', current_state: '当前状态',
      no_photo: '（无照片）', items_count: '项', files_label: '文件',
      seed_done: '已载入示例数据', export: '导出 JSON', clear: '清空全部',
      confirm_clear: '确定清空全部数据？此操作不可撤销。',
      need_two: '该场景至少需要两个存档才能对比。',
      branch_pending: '等待复盘', branch_reviewed: '已复盘',
      would_repeat_yes: '👍 下次还这么选', would_repeat_no: '👎 下次换个选择',
      parent: '基于', root: '初始存档', commits_in: '个存档',
      group_meal: '饮食', group_item: '物品场景', meals_count: '餐',
      meal_placeholder: '例如：午饭 黄焖鸡 + 一杯奶茶',
      ate_what: '吃了什么', add_meal: '＋ 添加食物 / 备注（可选）',
      choose_option: '请选择', choice_title: '选择一个选项', choice_close: '取消',
      branch_due_at: '复盘到期日', branch_no_due: '不设到期',
      branch_confidence: '决策把握', confidence_low: '低', confidence_mid: '中', confidence_high: '高',
      branch_tags: '标签', branch_tags_ph: '例如：学习 健康 预算',
      branch_search_ph: '搜索问题 / 选项 / 标签 / 复盘…',
      branch_all: '全部', branch_unselected: '未选择', branch_pending: '待复盘',
      branch_due: '已到期', branch_reviewed_chip: '已复盘',
      branch_insights: '洞察', branch_total: '总数', branch_avg_rating: '平均评分',
      branch_repeat_rate: '会重选率', branch_hit_rate: '预测命中率',
      branch_detail: '分支详情', context_commit: '关联存档',
      no_context: '不关联存档', actual_result: '实际结果',
      predicted_vs_actual: '预测 vs 实际', hit: '命中', miss: '未命中',
      extra_actual: '补充实际结果（每行一条）', merge_to_commit: '生成复盘存档',
      merged_commit: '已生成存档', from_branch: '来自分支',
      load_more: '加载更多', open_detail: '查看详情'
    },
    en: {
      brand: 'Life Archive',
      tagline: 'Version control for real life',
      nav_timeline: 'Timeline', nav_commit: 'New commit', nav_diff: 'Reality diff',
      nav_rollback: 'Rollback', nav_branch: 'Branches',
      empty_title: 'No life commits yet',
      empty_sub: 'Before you head out, tidy up, or start homework — commit reality first.',
      empty_cta: 'Create first commit', empty_seed: 'Load demo data',
      scene: 'Scene', message: 'Commit message', photo: 'Photo',
      items: 'Items / checklist', notes: 'Notes', files: 'Files / images',
      add_item: '+ Add item', item_name: 'Item', item_qty: 'Qty',
      save_commit: 'Commit', cancel: 'Cancel',
      commit_placeholder: 'e.g. Leaving for school — laptop + charger packed',
      latest: 'latest', base: 'Old version (base)', compare: 'New version (compare)',
      run_diff: 'Diff', changed: 'pixels changed', heat_hint: 'Hottest change zones',
      added: 'Added', removed: 'Missing', changed_qty: 'Qty changed', kept: 'Unchanged',
      no_change: 'The two versions look nearly identical 👍',
      rollback_pick: 'Pick the commit to restore to', rollback_version: 'Time & description', rollback_steps: 'Restore steps',
      rollback_intro: 'Follow these steps to restore the current state to this commit:',
      step_remove: 'Remove', step_add: 'Put back / add', step_check: 'Confirm present',
      done: 'Done', branch_q: 'What are you torn between?',
      branch_q_ph: 'e.g. Do homework tonight, or go out?',
      branch_a: 'Branch A', branch_b: 'Branch B', branch_name: 'This choice is…',
      outcome: 'Likely outcomes (one per line)', create_branch: 'Create branches',
      choose: 'Choose this', chosen: 'Chosen', followup: 'Review',
      rate: 'How did it go?', repeat: 'Take the same path next time?',
      yes: 'Yes', no: 'No', save_followup: 'Save review',
      branch_empty: 'No decision branches yet. When torn, let reality branch too.',
      delete: 'Delete', confirm_delete: 'Delete this commit?',
      commit_id: 'Archive ID', add_file: '+ Add files / images',
      confirm_delete_branch: 'Delete this decision branch?',
      new_branch: 'New decision branch', edit_branch: 'Edit branch',
      save_branch: 'Save branch', add_option: '+ Add option', remove_option: 'Remove option',
      reference: 'Target reference', current_state: 'Current state',
      no_photo: '(no photo)', items_count: 'items', files_label: 'Files',
      seed_done: 'Demo data loaded', export: 'Export JSON', clear: 'Clear all',
      confirm_clear: 'Clear all data? This cannot be undone.',
      need_two: 'This scene needs at least two commits to diff.',
      branch_pending: 'Awaiting review', branch_reviewed: 'Reviewed',
      would_repeat_yes: '👍 Would repeat', would_repeat_no: '👎 Would change',
      parent: 'based on', root: 'initial commit', commits_in: 'commits',
      group_meal: 'Meals', group_item: 'Things', meals_count: 'meals',
      meal_placeholder: 'e.g. Lunch — braised chicken rice + milk tea',
      ate_what: 'What you ate', add_meal: '＋ Add food / notes (optional)',
      choose_option: 'Choose', choice_title: 'Choose an option', choice_close: 'Cancel',
      branch_due_at: 'Review due date', branch_no_due: 'No due date',
      branch_confidence: 'Confidence', confidence_low: 'Low', confidence_mid: 'Medium', confidence_high: 'High',
      branch_tags: 'Tags', branch_tags_ph: 'e.g. study health budget',
      branch_search_ph: 'Search question / options / tags / review…',
      branch_all: 'All', branch_unselected: 'Unchosen', branch_pending: 'To review',
      branch_due: 'Overdue', branch_reviewed_chip: 'Reviewed',
      branch_insights: 'Insights', branch_total: 'Total', branch_avg_rating: 'Avg rating',
      branch_repeat_rate: 'Repeat rate', branch_hit_rate: 'Prediction hit rate',
      branch_detail: 'Branch detail', context_commit: 'Context commit',
      no_context: 'No context commit', actual_result: 'Actual result',
      predicted_vs_actual: 'Predicted vs actual', hit: 'Hit', miss: 'Miss',
      extra_actual: 'Extra actual results (one per line)', merge_to_commit: 'Create review commit',
      merged_commit: 'Merged commit', from_branch: 'From branch',
      load_more: 'Load more', open_detail: 'Open detail'
    }
  };

  var lang = (Store.meta().lang) || 'zh';
  function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.zh[key] || key; }
  function sceneLabel(s) { return s.emoji + ' ' + (lang === 'zh' ? s.zh : s.en); }

  /* ---------------- small DOM helpers ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!attrs.hasOwnProperty(k)) continue;
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2), attrs[k]);
        } else node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m];
    });
  }
  function fmtDate(ts) {
    var d = new Date(ts);
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function fmtBytes(n) {
    if (!n) return '0 B';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(0) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  }
  function pct(n, d) { return d ? Math.round((n / d) * 100) + '%' : '—'; }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function fmtDateOnly(s) {
    if (!s) return '';
    var p = String(s).split('-');
    if (p.length < 3) return String(s);
    return lang === 'zh' ? (p[0] + '年' + Number(p[1]) + '月' + Number(p[2]) + '日') : (p[1] + '/' + p[2] + '/' + p[0]);
  }
  function shortId(id) { return (id || '').split('_').pop().slice(0, 6); }
  function isImageFile(f) { return !!(f && /^image\//.test(f.type || '') && f.data); }
  function firstImageFile(files) {
    for (var i = 0; i < (files || []).length; i++) {
      if (isImageFile(files[i])) return files[i];
    }
    return null;
  }
  function commitThumbSrc(c) {
    var img = firstImageFile(c.files);
    return c.photo || (img && img.data) || '';
  }
  function toast(msg) {
    var node = $('#toast');
    node.textContent = msg;
    node.classList.add('show');
    clearTimeout(node._t);
    node._t = setTimeout(function () { node.classList.remove('show'); }, 2200);
  }

  /* ---------------- image downscale (keep stored photos small) ----------------
     Both the file picker and the native camera funnel through downscaleSrc so every
     stored photo is a compact JPEG, regardless of source. */
  var PHOTO_MAX = 1000, PHOTO_Q = 0.72;
  function downscaleSrc(src, maxW, quality) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var w = img.width, h = img.height, mw = maxW || PHOTO_MAX;
        if (w > mw) { h = Math.round(h * mw / w); w = mw; }
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', quality || PHOTO_Q));
      };
      img.onerror = reject;
      img.src = src;
    });
  }
  function downscale(file, maxW) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { downscaleSrc(reader.result, maxW).then(resolve, reject); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* POST JSON and get parsed JSON back. On native Android the Zhipu API is
     CORS-less, so route ONLY this through CapacitorHttp.request(); everything
     else (incl. Supabase) uses normal fetch so auth headers stay intact. */
  function apiPost(url, headers, bodyObj) {
    var Cap = window.Capacitor;
    if (Cap && Cap.isNativePlatform && Cap.isNativePlatform() && Cap.Plugins && Cap.Plugins.CapacitorHttp) {
      return Cap.Plugins.CapacitorHttp.request({ method: 'POST', url: url, headers: headers, data: bodyObj })
        .then(function (res) {
          var d = res && res.data;
          if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) {} }
          return d;
        });
    }
    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(bodyObj) })
      .then(function (r) { return r.json(); });
  }

  /* ---------------- AI photo scan (free: Zhipu GLM-4V-Flash) ----------------
     Uses the user's own free key (bigmodel.cn), stored only in localStorage.
     No server, no cost. Endpoint/model kept here so they're easy to swap. */
  var AI = {
    LS: 'lifearchive.ai_key',
    ENDPOINT: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    MODEL: 'glm-4v-flash',
    getKey: function () { return (localStorage.getItem(this.LS) || '').trim(); },
    setKey: function (k) { localStorage.setItem(this.LS, (k || '').trim()); },
    analyze: function (dataUrl) {
      var key = this.getKey();
      if (!key) return Promise.reject(new Error('NO_KEY'));
      var b64 = dataUrl.indexOf(',') > -1 ? dataUrl.split(',')[1] : dataUrl;
      var body = {
        model: this.MODEL,
        temperature: 0.2,
        messages: [{ role: 'user', content: [
          { type: 'image_url', image_url: { url: b64 } },
          { type: 'text', text: '识别这张照片。严格只返回 JSON，不要解释、不要 markdown。格式：{"summary":"一句话中文描述，15字内","scene":"从以下场景里挑最贴切的一个的英文id（' + Store.SCENES.map(function (x) { return x.id + '=' + x.zh; }).join('，') + '）","items":[{"name":"物品名","qty":数量整数}]}。若是食物/饮品照片，scene 选对应餐次，items 填每样食物名。' }
        ] }]
      };
      return apiPost(this.ENDPOINT, { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }, body).then(function (j) {
        if (!j) throw new Error('无返回');
        if (j.error) throw new Error(j.error.message || JSON.stringify(j.error));
        var txt = (((j.choices || [])[0] || {}).message || {}).content || '';
        var m = txt.match(/\{[\s\S]*\}/);
        if (!m) throw new Error('返回无法解析：' + txt.slice(0, 80));
        return JSON.parse(m[0]);
      });
    }
  };

  /* ---------------- Cloud sync (Supabase — pluggable backend) ----------------
     Swappable adapter: the rest of the app only touches Cloud.* and cloudSync().
     Config (project URL + anon key) is stored locally and entered in Settings.
     To switch backends later, only this block changes. */
  var _supaSDK = null;
  function loadSupabaseSDK() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve(window.supabase);
    if (_supaSDK) return _supaSDK;
    _supaSDK = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = function () { resolve(window.supabase); };
      s.onerror = function () { _supaSDK = null; reject(new Error('无法加载云服务 SDK（请检查网络）')); };
      document.head.appendChild(s);
    });
    return _supaSDK;
  }

  var Cloud = {
    URL_LS: 'lifearchive.cloud_url', KEY_LS: 'lifearchive.cloud_key',
    _client: null, _user: null,
    getCfg: function () {
      return { url: (localStorage.getItem(this.URL_LS) || '').trim(),
               key: (localStorage.getItem(this.KEY_LS) || '').trim() };
    },
    setCfg: function (url, key) {
      localStorage.setItem(this.URL_LS, (url || '').trim());
      localStorage.setItem(this.KEY_LS, (key || '').trim());
      this._client = null; this._user = null;
    },
    configured: function () { var c = this.getCfg(); return !!(c.url && c.key); },
    currentUser: function () { return this._user; },
    client: function () {
      var self = this;
      if (self._client) return Promise.resolve(self._client);
      var c = self.getCfg();
      if (!c.url || !c.key) return Promise.reject(new Error('NO_CFG'));
      return loadSupabaseSDK().then(function (sb) {
        self._client = sb.createClient(c.url, c.key, {
          auth: { persistSession: true, autoRefreshToken: true, storageKey: 'lifearchive.supa.auth' }
        });
        return self._client;
      });
    },
    _ck: function (r) { if (r && r.error) throw new Error(r.error.message || String(r.error)); return r; },
    refreshUser: function () {
      var self = this;
      if (!self.configured()) { self._user = null; return Promise.resolve(null); }
      return self.client().then(function (c) { return c.auth.getUser(); })
        .then(function (r) { self._user = (r && r.data && r.data.user) || null; return self._user; })
        .catch(function () { self._user = null; return null; });
    },
    signUp: function (email, pw) {
      var self = this;
      return self.client().then(function (c) { return c.auth.signUp({ email: email, password: pw }); })
        .then(function (r) { self._ck(r); self._user = (r.data && r.data.user) || null; return r; });
    },
    signIn: function (email, pw) {
      var self = this;
      return self.client().then(function (c) { return c.auth.signInWithPassword({ email: email, password: pw }); })
        .then(function (r) { self._ck(r); self._user = (r.data && r.data.user) || null; return r; });
    },
    signOut: function () {
      var self = this;
      return self.client().then(function (c) { return c.auth.signOut(); })
        .then(function () { self._user = null; });
    },
    pull: function () {
      return this.client().then(function (c) { return c.from('archives').select('data').maybeSingle(); })
        .then(function (r) { if (r.error) throw new Error(r.error.message); return r.data ? r.data.data : null; });
    },
    push: function (blob) {
      var self = this;
      return self.client().then(function (c) {
        var uid = self._user && self._user.id;
        if (!uid) throw new Error('未登录');
        return c.from('archives').upsert(
          { user_id: uid, data: blob, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      }).then(function (r) { if (r.error) throw new Error(r.error.message); return true; });
    }
  };

  function mergeData(a, b) {
    a = a || { commits: [], branches: [] }; b = b || { commits: [], branches: [] };
    function union(x, y) {
      var m = {}; (x || []).concat(y || []).forEach(function (it) { if (it && it.id) m[it.id] = it; });
      return Object.keys(m).map(function (k) { return m[k]; });
    }
    return { commits: union(a.commits, b.commits), branches: union(a.branches, b.branches) };
  }

  function cloudSync() {
    var local = Store.exportRaw();
    return Cloud.pull().then(function (remote) {
      var merged = mergeData(local, remote);
      Store.replaceAll(merged);
      return Cloud.push(merged).then(function () { return merged; });
    });
  }

  /* ---------------- routing ---------------- */
  var routes = ['timeline', 'commit', 'diff', 'rollback', 'branch', 'branch-detail', 'settings', 'changelog', 'detail'];
  var current = 'timeline';
  // nav depth drives the open/back slide direction (deeper route = slide in from right)
  var ROUTE_DEPTH = { timeline: 0, diff: 0, rollback: 0, branch: 0, 'branch-detail': 1, commit: 1, detail: 1, settings: 1, changelog: 2 };
  var prevDepth = 0;

  function go(route) {
    current = route;
    location.hash = route;
    renderNav();
    render();
  }

  window.addEventListener('hashchange', function () {
    var r = location.hash.slice(1);
    if (routes.indexOf(r) >= 0 && r !== current) { current = r; renderNav(); render(); }
  });

  /* flat line icons (inherit currentColor, tint to accent when active) */
  var NAV_ICONS = (function () {
    function s(inner) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
        + 'stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    }
    return {
      timeline: s('<circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/><path d="M12 6.7v3.6M12 13.7v3.6"/>'),
      commit: s('<circle cx="12" cy="12" r="8"/><path d="M12 8.5v7M8.5 12h7"/>'),
      diff: s('<circle cx="11" cy="11" r="6"/><path d="m20 20-3.6-3.6"/>'),
      rollback: s('<path d="M3.5 12a8.5 8.5 0 1 0 2.8-6.3L3.2 8"/><path d="M3 3.7V8h4.3"/>'),
      branch: s('<circle cx="6.5" cy="6" r="2"/><circle cx="6.5" cy="18" r="2"/><circle cx="17.5" cy="7.5" r="2"/><path d="M6.5 8v8"/><path d="M17.5 9.5c0 3.6-2.7 4.5-5.6 5"/>')
    };
  })();

  /* flat scene icons (unified line style, matching the nav) */
  var SCENE_ICONS = (function () {
    function s(inner) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
        + 'stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    }
    return {
      bag: s('<path d="M6 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M9 5V4.5a3 3 0 0 1 6 0V5"/><path d="M9 12h6"/>'),
      desk: s('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
      room: s('<path d="M3 18v-3h18v3M3 18v2M21 18v2M5 15v-2a3 3 0 0 1 3-3h11a2 2 0 0 1 2 2v3"/><path d="M8 10V8.5A1.5 1.5 0 0 1 9.5 7h2A1.5 1.5 0 0 1 13 8.5V10"/>'),
      kitchen: s('<path d="M7 3v7M5 3v3a2 2 0 0 0 2 2M9 3v3a2 2 0 0 1-2 2M7 10v11"/><path d="M16 3c-1.7 0-3 2.3-3 5.2 0 2.4 1.2 3.7 3 4V21"/>'),
      fridge: s('<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 10h12M10 6v2M10 13v3"/>'),
      closet: s('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 3v18M9.5 9v2M14.5 9v2"/>'),
      luggage: s('<rect x="5" y="7" width="14" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M12 11v5"/><path d="M9 20v1M15 20v1"/>'),
      homework: s('<path d="M6 3h11a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a2 2 0 0 1 0-4h11"/><path d="M9 7h6M9 10.5h4"/>'),
      group: s('<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.3a3 3 0 0 1 0 5.4M16.5 14.3a5.5 5.5 0 0 1 4 5.2"/>'),
      car: s('<path d="M5 11l1.6-4.1A2 2 0 0 1 8.5 6h7a2 2 0 0 1 1.9 1.3L19 11"/><path d="M3 16v-3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3h-3M7 16H3"/><path d="M9 16h6"/><circle cx="7" cy="16.5" r="1.6"/><circle cx="17" cy="16.5" r="1.6"/>'),
      wallet: s('<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10.5h18"/><circle cx="16.5" cy="14" r="1.3"/>'),
      drawer: s('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16M10 8h4M10 16h4"/>'),
      other: s('<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'),
      /* 饭迹 / 饮食 */
      breakfast: s('<path d="M4 8h13a4 4 0 0 1 0 8h-1"/><path d="M4 8v6a4 4 0 0 0 4 4h5a4 4 0 0 0 4-4V8z"/><path d="M8 3c-.6.8-.6 1.7 0 2.5M12 3c-.6.8-.6 1.7 0 2.5"/>'),
      lunch: s('<path d="M3.5 11a8.5 8.5 0 0 0 17 0z"/><path d="M3 11h18"/><path d="M9 4c-.7.7-.7 1.8 0 2.5M13 4c-.7.7-.7 1.8 0 2.5"/>'),
      dinner: s('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/>'),
      latenight: s('<path d="M19 14.8A7.5 7.5 0 1 1 9.2 5a6 6 0 0 0 9.8 9.8z"/>'),
      snack: s('<path d="M7 8h10l-1 11a2 2 0 0 1-2 1.8H10A2 2 0 0 1 8 19z"/><path d="M6 8h12"/><path d="M14 8 16 3"/>')
    };
  })();
  function sceneIconSVG(id) { return SCENE_ICONS[id] || SCENE_ICONS.other; }

  /* flat line icons for the in-app photo-source sheet + file rows */
  var UI_ICONS = (function () {
    function s(inner) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
        + 'stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    }
    return {
      camera: s('<path d="M4 9a2 2 0 0 1 2-2h1.4l.9-1.5A1 1 0 0 1 9.1 5h5.8a1 1 0 0 1 .8.5l.9 1.5H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.2"/>'),
      album: s('<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8.5" cy="10" r="1.6"/><path d="M4.5 17.5l4.4-4.1a1.5 1.5 0 0 1 2 0l3.1 3M14 14.5l1.4-1.3a1.5 1.5 0 0 1 2 0l2.1 2"/>'),
      file: s('<path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><path d="M13 3v6h6"/>'),
      screenshot: s('<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><rect x="8.5" y="8.5" width="7" height="7" rx="1.4"/>'),
      paste: s('<rect x="6" y="4.5" width="12" height="15.5" rx="2"/><path d="M9 4.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4.5V6H9z"/><path d="M9.5 11.5h5M9.5 14.5h3"/>')
    };
  })();

  function sceneName(scene) { return lang === 'zh' ? scene.zh : scene.en; }
  function sceneTag(scene) {
    var ic = el('span', { class: 'scene-ic' }); ic.innerHTML = sceneIconSVG(scene.id);
    return el('span', { class: 'commit-scene' }, [ic, el('span', { text: sceneName(scene) })]);
  }

  function navButton(route, label, isCreate) {
    var icon = el('span', { class: 'nav-ic' });
    icon.innerHTML = NAV_ICONS[route];
    var kids = [icon, el('span', { class: 'nav-label', text: label })];
    if (route === 'branch') {
      var pending = branchPendingCount();
      if (pending > 0) kids.push(el('span', { class: 'nav-badge', text: pending > 9 ? '9+' : String(pending) }));
    }
    // the label is always in the DOM; CSS hides it for the mobile "+" FAB
    return el('button', {
      class: 'nav-btn' + (isCreate ? ' nav-btn-create' : '') + (current === route ? ' active' : ''),
      'data-route': route, 'aria-label': label, title: label,
      onclick: function () { go(route); }
    }, kids);
  }

  function renderNav() {
    var nav = $('#nav');
    nav.innerHTML = '';
    // The four browse tabs live in a pill; "新建存档" is a separate action button.
    // Desktop: the pill sits left, the create button detaches to the right.
    // Mobile: the pill flattens (display:contents) and CSS re-orders the create
    //         button into the center as a floating "+" FAB.
    var group = el('div', { class: 'nav-group' });
    [['timeline', t('nav_timeline')], ['diff', t('nav_diff')],
     ['rollback', t('nav_rollback')], ['branch', t('nav_branch')]
    ].forEach(function (it) { group.appendChild(navButton(it[0], it[1], false)); });
    nav.appendChild(group);
    nav.appendChild(navButton('commit', t('nav_commit'), true));
  }

  /* ---------------- main render switch ---------------- */
  var view = function () { return $('#view'); };

  // a page may register a teardown (e.g. the commit form's document-level paste
  // listener); it runs right before the next page renders so nothing leaks.
  var viewCleanup = null;
  function render() {
    if (viewCleanup) { try { viewCleanup(); } catch (e) {} viewCleanup = null; }
    var v = view();
    v.innerHTML = '';
    v.scrollTop = 0;
    if (current === 'timeline') renderTimeline(v);
    else if (current === 'commit') renderCommitForm(v);
    else if (current === 'diff') renderDiff(v);
    else if (current === 'rollback') renderRollback(v);
    else if (current === 'branch') renderBranch(v);
    else if (current === 'branch-detail') renderBranchDetail(v);
    else if (current === 'settings') renderSettings(v);
    else if (current === 'changelog') renderChangelog(v);
    else if (current === 'detail') renderDetail(v);
    // directional entrance animation: push (deeper), pop (back), or fade (sibling tab)
    var d = ROUTE_DEPTH[current] || 0;
    var anim = d > prevDepth ? 'anim-push' : (d < prevDepth ? 'anim-pop' : 'anim-fade');
    prevDepth = d;
    v.classList.remove('anim-push', 'anim-pop', 'anim-fade');
    void v.offsetWidth; // restart the CSS animation
    v.classList.add(anim);
  }

  /* ---------------- Timeline ---------------- */
  var tlQuery = '';     // timeline search text (persists across renders this session)
  var tlScene = null;   // timeline scene filter (null = all scenes)
  var TL_PAGE_SIZE = 24;
  var tlVisible = TL_PAGE_SIZE;
  function commitMatches(c, q) {
    if (!q) return true;
    q = q.toLowerCase();
    var sc = Store.sceneById(c.scene);
    var hay = [c.message || '', c.notes || '', sc.zh, sc.en]
      .concat((c.items || []).map(function (it) { return it.name; }))
      .join(' ').toLowerCase();
    return hay.indexOf(q) >= 0;
  }

  function renderTimeline(v) {
    var commits = Store.commits();
    if (!commits.length) {
      v.appendChild(el('div', { class: 'empty' }, [
        el('div', { class: 'empty-emoji', text: '🌱' }),
        el('h2', { text: t('empty_title') }),
        el('p', { text: t('empty_sub') }),
        el('div', { class: 'empty-actions' }, [
          el('button', { class: 'btn primary', text: t('empty_cta'),
            onclick: function () { go('commit'); } }),
          el('button', { class: 'btn ghost', text: t('empty_seed'),
            onclick: function () { seedDemo(); go('timeline'); } })
        ])
      ]));
      return;
    }

    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_timeline') })]));

    // ---- search + scene filter (only the list is rebuilt on change, so the
    //      search box keeps focus while typing) ----
    var scenesPresent = [];
    commits.forEach(function (c) { if (scenesPresent.indexOf(c.scene) < 0) scenesPresent.push(c.scene); });
    if (tlScene && scenesPresent.indexOf(tlScene) < 0) tlScene = null; // stale filter -> reset

    var searchInput = el('input', { class: 'field tl-search-input', type: 'search',
      placeholder: lang === 'zh' ? '搜索描述 / 物品 / 备注…' : 'Search message / items / notes…' });
    searchInput.value = tlQuery;
    searchInput.addEventListener('input', function () { tlQuery = searchInput.value; tlVisible = TL_PAGE_SIZE; renderList(); });

    var chipsRow = el('div', { class: 'tl-chips' });
    function chipBtn(id, label, withIcon) {
      var on = id === tlScene || (id === null && tlScene === null);
      var kids = [];
      if (withIcon) { var ic = el('span', { class: 'scene-ic' }); ic.innerHTML = sceneIconSVG(id); kids.push(ic); }
      kids.push(el('span', { text: label }));
      var b = el('button', { type: 'button', class: 'tl-chip' + (on ? ' active' : '') }, kids);
      b.addEventListener('click', function () { tlScene = id; tlVisible = TL_PAGE_SIZE; renderChips(); renderList(); });
      return b;
    }
    function renderChips() {
      chipsRow.innerHTML = '';
      chipsRow.appendChild(chipBtn(null, lang === 'zh' ? '全部' : 'All', false));
      scenesPresent.forEach(function (id) { chipsRow.appendChild(chipBtn(id, sceneName(Store.sceneById(id)), true)); });
    }
    renderChips();

    v.appendChild(el('div', { class: 'tl-search' }, [searchInput, chipsRow]));

    var listWrap = el('div', { class: 'tl-list' });
    v.appendChild(listWrap);

    function renderList() {
      listWrap.innerHTML = '';
      var filtered = commits.filter(function (c) {
        return (tlScene === null || c.scene === tlScene) && commitMatches(c, tlQuery);
      });
      if (!filtered.length) {
        listWrap.appendChild(el('div', { class: 'tl-empty' }, [
          el('div', { class: 'tl-empty-ic', text: '🔍' }),
          el('div', { text: lang === 'zh' ? '没有匹配的存档' : 'No matching commits' })
        ]));
        return;
      }
      var shown = filtered.slice(0, tlVisible);
      // group by day, newest first (commits already sorted desc)
      var groups = [], map = {};
      shown.forEach(function (c) {
        var k = dayKey(c.createdAt);
        if (!map[k]) { map[k] = { label: dayLabel(c.createdAt), items: [] }; groups.push(map[k]); }
        map[k].items.push(c);
      });
      groups.forEach(function (g) {
        var sec = el('section', { class: 'date-group' });
        var mealCount = g.items.filter(function (c) { return Store.isMealScene(c.scene); }).length;
        var headRight = [el('span', { class: 'date-count', text: g.items.length + ' ' + t('commits_in') })];
        if (mealCount > 0) {
          headRight.unshift(el('span', { class: 'date-meals', text: '🍽 ' + mealCount + ' ' + t('meals_count') }));
        }
        sec.appendChild(el('div', { class: 'date-head' }, [
          el('span', { class: 'date-label', text: g.label }),
          el('span', { class: 'date-head-right' }, headRight)
        ]));
        var rail = el('div', { class: 'commit-rail' });
        g.items.forEach(function (c) { rail.appendChild(commitCard(c)); });
        sec.appendChild(rail);
        listWrap.appendChild(sec);
      });
      if (filtered.length > shown.length) {
        listWrap.appendChild(el('button', { class: 'btn ghost load-more', text: t('load_more') + ' · ' + shown.length + ' / ' + filtered.length,
          onclick: function () { tlVisible += TL_PAGE_SIZE; renderList(); } }));
      }
    }
    renderList();
  }

  function dayKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function dayLabel(ts) {
    var d = new Date(ts), now = new Date();
    function midnight(x) { var y = new Date(x); y.setHours(0, 0, 0, 0); return y.getTime(); }
    var diff = Math.round((midnight(now) - midnight(d)) / 86400000);
    if (diff === 0) return lang === 'zh' ? '今天' : 'Today';
    if (diff === 1) return lang === 'zh' ? '昨天' : 'Yesterday';
    if (diff === 2) return lang === 'zh' ? '前天' : '2 days ago';
    var sameYear = d.getFullYear() === now.getFullYear();
    if (lang === 'zh') return (sameYear ? '' : d.getFullYear() + '年') + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
    return mon + ' ' + d.getDate() + (sameYear ? '' : ', ' + d.getFullYear());
  }
  function fmtTime(ts) {
    var d = new Date(ts);
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  function commitCard(c) {
    var isRoot = !c.parentId;
    var thumbSrc = commitThumbSrc(c);
    var thumb = thumbSrc
      ? el('div', { class: 'commit-thumb', style: 'background-image:url(' + thumbSrc + ')' })
      : el('div', { class: 'commit-thumb noimg', text: t('no_photo') });

    var meta = el('div', { class: 'commit-meta' }, [
      el('div', { class: 'commit-msg', text: c.message || '(no message)' }),
      el('div', { class: 'commit-sub' }, [
        sceneTag(Store.sceneById(c.scene)),
        el('span', { class: 'commit-dot', text: '·' }),
        el('span', { text: fmtTime(c.createdAt) }),
        el('span', { class: 'commit-dot', text: '·' }),
        el('span', { text: (c.items ? c.items.length : 0) + ' ' + t('items_count') }),
        (c.files && c.files.length) ? el('span', { class: 'commit-dot', text: '·' }) : null,
        (c.files && c.files.length) ? el('span', { class: 'commit-files', text: '📎 ' + c.files.length }) : null
      ])
    ]);

    var chips = el('div', { class: 'commit-chips' });
    if (isRoot) chips.appendChild(el('span', { class: 'chip root', text: t('root') }));
    if (c.fromBranchId) chips.appendChild(el('span', { class: 'chip branch-link', text: t('from_branch') + ' ' + shortId(c.fromBranchId) }));
    (c.items || []).slice(0, 6).forEach(function (it) {
      chips.appendChild(el('span', { class: 'chip',
        text: it.name + (it.qty > 1 ? ' ×' + it.qty : '') }));
    });
    if ((c.items || []).length > 6) {
      chips.appendChild(el('span', { class: 'chip more', text: '+' + (c.items.length - 6) }));
    }

    var body = el('div', { class: 'commit-body' }, [meta, chips,
      c.notes ? el('div', { class: 'commit-notes', text: c.notes }) : null]);
    var card = el('div', { class: 'commit-card tappable' }, [thumb, body,
      el('span', { class: 'commit-chevron', text: '›' })]);
    card.addEventListener('click', function () { pendingDetail = c.id; go('detail'); });
    return card;
  }

  /* ---------------- Commit detail ---------------- */
  var pendingDetail = null;
  function renderDetail(v) {
    var c = pendingDetail ? Store.getCommit(pendingDetail) : null;
    if (!c) { go('timeline'); return; }
    var L = lang === 'zh';

    var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (L ? '返回' : 'Back') });
    back.addEventListener('click', function () { go('timeline'); });
    v.appendChild(el('div', { class: 'view-head' }, [back]));

    var card = el('div', { class: 'detail-card' });
    if (c.photo) card.appendChild(el('div', { class: 'detail-photo', style: 'background-image:url(' + c.photo + ')' }));
    card.appendChild(el('div', { class: 'detail-title', text: c.message || '(no message)' }));
    card.appendChild(el('div', { class: 'detail-sub' }, [
      el('span', { class: 'commit-scene', text: sceneLabel(Store.sceneById(c.scene)) }),
      el('span', { class: 'commit-dot', text: '·' }),
      el('span', { text: fmtDate(c.createdAt) }),
      el('span', { class: 'commit-dot', text: '·' }),
      el('span', { class: 'commit-hash', text: t('commit_id') + ' ' + shortId(c.id) })
    ]));
    if (c.items && c.items.length) {
      card.appendChild(el('div', { class: 'detail-section-title',
        text: Store.isMealScene(c.scene) ? t('ate_what') : (L ? '物品清单' : 'Items') }));
      var list = el('div', { class: 'detail-items' });
      c.items.forEach(function (it) {
        list.appendChild(el('div', { class: 'detail-item' }, [
          el('span', { text: it.name }),
          el('span', { class: 'detail-qty', text: '×' + (it.qty || 1) })
        ]));
      });
      card.appendChild(list);
    }
    if (c.fromBranchId) {
      var linkedBranch = Store.getBranch(c.fromBranchId);
      if (linkedBranch) {
        card.appendChild(el('div', { class: 'detail-section-title', text: t('from_branch') }));
        card.appendChild(el('button', { class: 'btn ghost detail-link-btn', text: '🔀 ' + linkedBranch.question,
          onclick: function () { pendingBranchDetail = linkedBranch.id; go('branch-detail'); } }));
      }
    }
    if (c.files && c.files.length) {
      card.appendChild(el('div', { class: 'detail-section-title', text: L ? '文件' : 'Files' }));
      var imgs = (c.files || []).filter(isImageFile);
      if (imgs.length) {
        var gallery = el('div', { class: 'detail-gallery' });
        imgs.slice(0, 12).forEach(function (f) {
          gallery.appendChild(el('a', {
            class: 'detail-image',
            href: f.data,
            download: f.name,
            style: 'background-image:url(' + f.data + ')',
            title: f.name
          }));
        });
        if (imgs.length > 12) gallery.appendChild(el('div', { class: 'detail-image-more',
          text: '+' + (imgs.length - 12) }));
        card.appendChild(gallery);
      }
      var fl = el('div', { class: 'detail-files' });
      c.files.forEach(function (f) {
        var ic = el('span', { class: 'file-ic' }); ic.innerHTML = UI_ICONS.file;
        fl.appendChild(el('a', { class: 'detail-file', href: f.data, download: f.name }, [
          ic,
          el('div', { class: 'file-meta' }, [
            el('span', { class: 'file-name', text: f.name }),
            el('span', { class: 'file-size', text: fmtBytes(f.size) })
          ]),
          el('span', { class: 'file-dl', text: '⤓' })
        ]));
      });
      card.appendChild(fl);
    }
    if (c.notes) {
      card.appendChild(el('div', { class: 'detail-section-title', text: L ? '备注' : 'Notes' }));
      card.appendChild(el('div', { class: 'commit-notes', text: c.notes }));
    }
    v.appendChild(card);

    v.appendChild(el('div', { class: 'detail-actions' }, [
      el('button', { class: 'btn primary', text: '✏️ ' + (L ? '编辑' : 'Edit'),
        onclick: function () { pendingEdit = c.id; go('commit'); } }),
      el('button', { class: 'btn', text: '🔍 ' + t('nav_diff'),
        onclick: function () { go('diff'); } }),
      el('button', { class: 'btn', text: '⏮️ ' + t('nav_rollback'),
        onclick: function () { pendingRollback = c.id; go('rollback'); } }),
      el('button', { class: 'btn danger', text: '🗑 ' + t('delete'),
        onclick: function () { if (confirm(t('confirm_delete'))) { Store.deleteCommit(c.id); go('timeline'); } } })
    ]));
  }

  /* ---------------- New / edit commit form ---------------- */
  var draftPhoto = null;
  var draftFiles = [];
  var pendingEdit = null;
  function renderCommitForm(v) {
    draftPhoto = null;
    draftFiles = [];
    var editing = pendingEdit ? Store.getCommit(pendingEdit) : null;
    pendingEdit = null;
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', {
      text: editing ? (lang === 'zh' ? '编辑存档' : 'Edit commit') : t('nav_commit') })]));

    var selectedScene = (editing && editing.scene) || Store.SCENES[0].id;
    var scenePicker = el('div', { class: 'scene-picker' });
    var selectedGroup = Store.isMealScene(selectedScene) ? 'meal' : 'item';
    function buildSceneGrid(group) {
      var grid = el('div', { class: 'scene-grid' });
      Store.SCENES.filter(function (sc) { return sc.group === group; }).forEach(function (sc) {
        var ic = el('span', { class: 'scene-ic' }); ic.innerHTML = sceneIconSVG(sc.id);
        var opt = el('button', { type: 'button',
          class: 'scene-opt' + (sc.id === selectedScene ? ' active' : '') },
          [ic, el('span', { class: 'scene-opt-label', text: sceneName(sc) })]);
        opt.addEventListener('click', function () {
          selectedScene = sc.id; renderScenePicker(); syncMealUI();
        });
        grid.appendChild(opt);
      });
      return grid;
    }
    function renderScenePicker() {
      scenePicker.innerHTML = '';
      var switcher = el('div', { class: 'scene-kind-switch', role: 'tablist' });
      [['meal', '🍽', t('group_meal')], ['item', '📦', t('group_item')]].forEach(function (it) {
        var group = it[0];
        switcher.appendChild(el('button', {
          type: 'button', role: 'tab', 'aria-selected': group === selectedGroup ? 'true' : 'false',
          class: 'scene-kind-btn' + (group === selectedGroup ? ' active' : ''),
          onclick: function () {
            if (selectedGroup === group) return;
            selectedGroup = group;
            if (Store.sceneById(selectedScene).group !== group) {
              selectedScene = Store.SCENES.filter(function (sc) { return sc.group === group; })[0].id;
            }
            renderScenePicker(); syncMealUI();
          }
        }, [el('span', { text: it[1] }), el('span', { text: it[2] })]));
      });
      scenePicker.appendChild(switcher);
      scenePicker.appendChild(buildSceneGrid(selectedGroup));
    }
    renderScenePicker();

    // food-aware wording: when a meal scene is selected, the form talks about food
    function syncMealUI() {
      var meal = Store.isMealScene(selectedScene);
      msgInput.placeholder = meal ? t('meal_placeholder') : t('commit_placeholder');
      if (itemsLabelText) itemsLabelText.textContent = meal ? t('ate_what') : t('items');
      if (moreSummary) moreSummary.textContent = meal
        ? (lang === 'zh' ? '＋ 添加食物 / 文件 / 备注（可选）' : '＋ Add food / files / notes (optional)')
        : (lang === 'zh' ? '＋ 添加物品 / 文件 / 备注（可选）' : '＋ Add items / files / notes (optional)');
    }

    var msgInput = el('input', { class: 'field', type: 'text', placeholder: t('commit_placeholder') });
    if (editing && editing.message && editing.message !== '(no message)') msgInput.value = editing.message;
    var notesInput = el('textarea', { class: 'field', rows: '2' });
    if (editing && editing.notes) notesInput.value = editing.notes;

    var preview = el('div', { class: 'photo-drop' }, [
      el('span', { class: 'photo-hint', text: '📷 ' + t('photo') })
    ]);
    function setPhoto(dataUrl) {
      draftPhoto = dataUrl;
      preview.innerHTML = '';
      preview.style.backgroundImage = 'url(' + dataUrl + ')';
      preview.classList.add('has-photo');
    }
    var fileInput = el('input', { type: 'file', accept: 'image/*', style: 'display:none' });
    fileInput.addEventListener('change', function () {
      if (!fileInput.files || !fileInput.files[0]) return;
      downscale(fileInput.files[0]).then(setPhoto);
      fileInput.value = '';
    });

    // ---- photo sources, all funneled through the in-app action sheet so the UI
    //      is consistent across Android / desktop (no bare native OS picker) ----
    function nativeCamera(source) {
      window.Capacitor.Plugins.Camera.getPhoto({ resultType: 'dataUrl', source: source, quality: 80, width: 1200, correctOrientation: true })
        .then(function (photo) { if (photo && photo.dataUrl) downscaleSrc(photo.dataUrl).then(setPhoto); })
        .catch(function () { /* cancelled */ });
    }
    function desktopScreenshot() {
      if (!(window.electronAPI && window.electronAPI.captureScreen)) {
        toast(lang === 'zh' ? '当前环境不支持截图' : 'Screenshot not supported here'); return;
      }
      toast(lang === 'zh' ? '正在截图…' : 'Capturing…');
      window.electronAPI.captureScreen().then(function (dataUrl) {
        if (!dataUrl) { toast(lang === 'zh' ? '截图失败' : 'Screenshot failed'); return; }
        downscaleSrc(dataUrl, 1600, 0.85).then(setPhoto);
      }).catch(function (e) { toast('⚠ ' + (e && e.message || e)); });
    }
    function pasteImageFromClipboard() {
      if (navigator.clipboard && navigator.clipboard.read) {
        navigator.clipboard.read().then(function (items) {
          for (var i = 0; i < items.length; i++) {
            var imgType = (items[i].types || []).filter(function (ty) { return /^image\//.test(ty); })[0];
            if (imgType) { items[i].getType(imgType).then(function (blob) { downscale(blob).then(setPhoto); }); return; }
          }
          toast(lang === 'zh' ? '剪贴板里没有图片' : 'No image in clipboard');
        }).catch(function () { toast(lang === 'zh' ? '无法读取剪贴板（可直接 Ctrl+V）' : 'Clipboard blocked — try Ctrl+V'); });
      } else {
        toast(lang === 'zh' ? '请直接按 Ctrl+V 粘贴' : 'Press Ctrl+V to paste');
      }
    }
    function openPhotoSource() {
      var Cap = window.Capacitor;
      var native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform() && Cap.Plugins && Cap.Plugins.Camera);
      var L = lang === 'zh';
      if (native) {
        actionSheet(L ? '添加照片' : 'Add photo', [
          { icon: UI_ICONS.camera, label: L ? '拍照' : 'Take photo', onClick: function () { nativeCamera('CAMERA'); } },
          { icon: UI_ICONS.album, label: L ? '从相册选择' : 'Choose from album', onClick: function () { nativeCamera('PHOTOS'); } }
        ]);
      } else {
        var acts = [{ icon: UI_ICONS.file, label: L ? '选择图片文件' : 'Choose image file', onClick: function () { fileInput.click(); } }];
        if (window.electronAPI && window.electronAPI.captureScreen) {
          acts.push({ icon: UI_ICONS.screenshot, label: L ? '截取当前屏幕' : 'Capture screen', onClick: desktopScreenshot });
        }
        acts.push({ icon: UI_ICONS.paste, label: L ? '从剪贴板粘贴' : 'Paste from clipboard', onClick: pasteImageFromClipboard });
        actionSheet(L ? '添加照片' : 'Add photo', acts);
      }
    }
    preview.addEventListener('click', openPhotoSource);

    // drag an image file onto the dropzone -> photo (desktop convenience)
    preview.addEventListener('dragover', function (e) { e.preventDefault(); preview.classList.add('drag-over'); });
    preview.addEventListener('dragleave', function () { preview.classList.remove('drag-over'); });
    preview.addEventListener('drop', function (e) {
      e.preventDefault(); preview.classList.remove('drag-over');
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && /^image\//.test(f.type)) downscale(f).then(setPhoto);
    });

    // Ctrl+V anywhere pastes an image as the photo — registered on the document so
    // it works before any field is focused, and torn down by viewCleanup on nav.
    function onPasteImg(e) {
      var items = (e.clipboardData && e.clipboardData.items) || [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && /^image\//.test(items[i].type)) {
          var f = items[i].getAsFile();
          if (f) { e.preventDefault(); downscale(f).then(setPhoto); toast(lang === 'zh' ? '已粘贴图片' : 'Image pasted'); return; }
        }
      }
    }
    document.addEventListener('paste', onPasteImg);
    viewCleanup = function () { document.removeEventListener('paste', onPasteImg); };

    if (editing && editing.photo) setPhoto(editing.photo);

    // dynamic item rows
    var itemsWrap = el('div', { class: 'items-wrap' });
    function addItemRow(name, qty) {
      var nameI = el('input', { class: 'field item-name', type: 'text',
        placeholder: t('item_name'), value: name || '' });
      var qtyI = el('input', { class: 'field item-qty', type: 'number', min: '1',
        value: qty || 1 });
      var row = el('div', { class: 'item-row' }, [nameI, qtyI,
        el('button', { class: 'btn tiny danger-ghost', text: '✕',
          onclick: function () { row.remove(); } })]);
      itemsWrap.appendChild(row);
    }
    if (editing && editing.items && editing.items.length) {
      editing.items.forEach(function (it) { addItemRow(it.name, it.qty || 1); });
    } else {
      addItemRow();
    }

    // ---- file attachments (stored inline in IndexedDB) ----
    // Makes coursework / study archives meaningful: keep the actual report,
    // rubric, slides, etc. with the snapshot, not just their names.
    if (editing && editing.files && editing.files.length) draftFiles = editing.files.slice();
    var filesList = el('div', { class: 'files-list' });
    function renderFilesList() {
      filesList.innerHTML = '';
      draftFiles.forEach(function (f, idx) {
        var ic = el('span', { class: 'file-ic' }); ic.innerHTML = UI_ICONS.file;
        filesList.appendChild(el('div', { class: 'file-row' }, [
          ic,
          el('div', { class: 'file-meta' }, [
            el('span', { class: 'file-name', text: f.name }),
            el('span', { class: 'file-size', text: fmtBytes(f.size) })
          ]),
          el('button', { class: 'btn tiny danger-ghost', type: 'button', text: '✕',
            onclick: function () { draftFiles.splice(idx, 1); renderFilesList(); } })
        ]));
      });
    }
    renderFilesList();
    var fileAttachInput = el('input', { type: 'file', multiple: '', style: 'display:none' });
    function addFiles(fileLike) {
      Array.prototype.slice.call(fileLike || []).forEach(function (file) {
        if (file.size > 50 * 1024 * 1024) { toast((lang === 'zh' ? '文件过大（>50MB）：' : 'Too large (>50MB): ') + file.name); return; }
        var reader = new FileReader();
        reader.onload = function () {
          draftFiles.push({ id: Store.uid('f'), name: file.name, type: file.type || '', size: file.size, data: reader.result });
          renderFilesList();
          if (moreDetails) moreDetails.open = true;
        };
        reader.readAsDataURL(file);
      });
    }
    fileAttachInput.addEventListener('change', function () { addFiles(fileAttachInput.files); fileAttachInput.value = ''; });
    var filesBlock = el('div', { class: 'files-block' }, [
      filesList,
      el('button', { class: 'btn tiny ghost', type: 'button',
        text: t('add_file'),
        onclick: function () { fileAttachInput.click(); } }),
      fileAttachInput
    ]);
    // drag files onto the block to attach them (desktop)
    filesBlock.addEventListener('dragover', function (e) { e.preventDefault(); filesBlock.classList.add('drag-over'); });
    filesBlock.addEventListener('dragleave', function () { filesBlock.classList.remove('drag-over'); });
    filesBlock.addEventListener('drop', function (e) {
      e.preventDefault(); filesBlock.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });

    // AI photo scan: take a photo -> auto-fill description + items (free Zhipu key)
    var aiBtn = el('button', { class: 'btn ghost ai-btn', type: 'button',
      text: '✨ ' + (lang === 'zh' ? 'AI 识别照片' : 'AI scan photo') });
    aiBtn.addEventListener('click', function () {
      if (!draftPhoto) { toast(lang === 'zh' ? '请先拍照 / 选一张照片' : 'Take a photo first'); return; }
      if (!AI.getKey()) {
        var k = window.prompt(lang === 'zh'
          ? '粘贴你的智谱AI API Key（bigmodel.cn 免费申请，仅存手机本地、不上传）：'
          : 'Paste your Zhipu API Key (free at bigmodel.cn, stored locally):');
        if (!k) return;
        AI.setKey(k);
      }
      aiBtn.disabled = true;
      aiBtn.textContent = '⏳ ' + (lang === 'zh' ? '识别中…' : 'analyzing…');
      AI.analyze(draftPhoto).then(function (res) {
        if (res.summary && !msgInput.value.trim()) msgInput.value = res.summary;
        if (res.items && res.items.length) {
          itemsWrap.innerHTML = '';
          res.items.forEach(function (it) { addItemRow(it.name, parseInt(it.qty, 10) || 1); });
          moreDetails.open = true;
        }
        if (res.scene && Store.SCENES.some(function (x) { return x.id === res.scene; })) {
          selectedScene = res.scene;
          selectedGroup = Store.isMealScene(selectedScene) ? 'meal' : 'item';
          renderScenePicker(); syncMealUI();
        }
        toast('✨ ' + (lang === 'zh' ? 'AI 识别完成' : 'Done'));
      }).catch(function (e) {
        if (e && e.message === 'NO_KEY') return;
        var msg = (e && e.message) || String(e);
        if (/401|apikey|api key|令牌|token|鉴权|invalid|unauthorized/i.test(msg)) AI.setKey('');
        toast('⚠ ' + (lang === 'zh' ? 'AI 失败：' : 'AI failed: ') + msg);
      }).then(function () {
        aiBtn.disabled = false;
        aiBtn.textContent = '✨ ' + (lang === 'zh' ? 'AI 识别照片' : 'AI scan photo');
      });
    });

    // keep the fast path simple: photo + one line. Items/notes are optional & collapsed.
    var moreSummary = el('summary', { class: 'more-summary',
      text: (lang === 'zh' ? '＋ 添加物品 / 文件 / 备注（可选）' : '＋ Add items / files / notes (optional)') });
    var itemsLabel = labeled(t('items'), el('div', {}, [itemsWrap,
      el('button', { class: 'btn tiny ghost', text: t('add_item'),
        onclick: function () { addItemRow(); } })]));
    var itemsLabelText = $('.label-text', itemsLabel);
    var moreDetails = el('details', { class: 'more-details' }, [
      moreSummary, itemsLabel,
      labeledBlock(lang === 'zh' ? '文件' : 'Files', filesBlock),
      labeled(t('notes'), notesInput)
    ]);
    if (editing && ((editing.items && editing.items.length) || (editing.files && editing.files.length))) moreDetails.open = true;

    var form = el('div', { class: 'form-card' }, [
      // NOT a <label> (a file input inside a label fires twice -> re-opens picker)
      el('div', { class: 'labeled' }, [
        el('span', { class: 'label-text', text: '📷 ' + t('photo') }),
        el('div', {}, [preview, fileInput, aiBtn])
      ]),
      labeled(t('message'), msgInput),
      labeledBlock(t('scene'), scenePicker),
      moreDetails,
      el('div', { class: 'form-actions' }, [
        el('button', { class: 'btn ghost', text: t('cancel'),
          onclick: function () { go('timeline'); } }),
        el('button', { class: 'btn primary', text: t('save_commit'), onclick: function () {
          var items = [];
          itemsWrap.querySelectorAll('.item-row').forEach(function (r) {
            var n = $('.item-name', r).value.trim();
            if (n) items.push({ name: n, qty: parseInt($('.item-qty', r).value, 10) || 1 });
          });
          var payload = {
            scene: selectedScene,
            message: msgInput.value.trim() || '(no message)',
            photo: draftPhoto,
            items: items,
            files: draftFiles.slice(),
            notes: notesInput.value.trim()
          };
          if (editing) {
            Store.updateCommit(editing.id, payload);
            toast('✅ ' + (lang === 'zh' ? '已保存修改' : 'Saved'));
            go('timeline');
            return;
          }
          var ok = Store.addCommit(payload);
          if (!ok) { toast('⚠ ' + (lang === 'zh' ? '存储空间不足，请删除旧照片' : 'Storage full')); return; }
          toast('✅ ' + t('save_commit'));
          go('timeline');
        } })
      ])
    ]);
    v.appendChild(form);
    syncMealUI(); // set initial food-aware wording (esp. when editing a meal commit)
  }

  function labeled(label, control) {
    return el('label', { class: 'labeled' }, [
      el('span', { class: 'label-text', text: label }), control]);
  }

  function labeledBlock(label, control) {
    return el('div', { class: 'labeled' }, [
      el('span', { class: 'label-text', text: label }), control]);
  }

  /* App-owned selector. Native <select> opens an oversized Android radio dialog,
     so every option picker uses the same compact bottom sheet instead. */
  function choiceSelect(options, selectedValue, extraClass) {
    var root = el('div', { class: 'choice-select' + (extraClass ? ' ' + extraClass : '') });
    var trigger = el('button', {
      type: 'button', class: 'choice-trigger', 'aria-haspopup': 'listbox',
      onclick: function () { openChoiceSheet(root); }
    });
    root.appendChild(trigger);
    root._choices = [];
    root._value = '';
    root._onChange = null;
    root.getValue = function () { return root._value; };
    root.setOptions = function (next, preferredValue) {
      root._choices = (next || []).map(function (it) {
        return { value: String(it.value), text: String(it.text) };
      });
      var wanted = preferredValue == null ? root._value : String(preferredValue);
      if (!root._choices.some(function (it) { return it.value === wanted; })) {
        wanted = root._choices.length ? root._choices[0].value : '';
      }
      root._value = wanted;
      updateChoiceTrigger();
    };
    root.setValue = function (value, notify) {
      value = String(value);
      if (!root._choices.some(function (it) { return it.value === value; })) return;
      var changed = root._value !== value;
      root._value = value;
      updateChoiceTrigger();
      if (changed && notify && root._onChange) root._onChange();
    };
    root.onChange = function (fn) { root._onChange = fn; };
    function updateChoiceTrigger() {
      var picked = root._choices.find(function (it) { return it.value === root._value; });
      trigger.innerHTML = '';
      trigger.appendChild(el('span', { class: 'choice-trigger-text', text: picked ? picked.text : t('choose_option') }));
      trigger.appendChild(el('span', { class: 'choice-chevron', text: '⌄' }));
    }
    root.setOptions(options, selectedValue);
    return root;
  }

  function openChoiceSheet(select) {
    var old = $('.choice-sheet-mask');
    if (old) old.remove();
    var mask = el('div', { class: 'choice-sheet-mask' });
    var sheet = el('section', { class: 'choice-sheet', role: 'dialog', 'aria-modal': 'true' }, [
      el('div', { class: 'choice-sheet-head' }, [
        el('strong', { text: t('choice_title') }),
        el('button', { type: 'button', class: 'choice-sheet-close', text: t('choice_close') })
      ])
    ]);
    select._choices.forEach(function (it) {
      var active = it.value === select.getValue();
      sheet.appendChild(el('button', {
        type: 'button', role: 'option', 'aria-selected': active ? 'true' : 'false',
        class: 'choice-option' + (active ? ' active' : ''),
        onclick: function () { select.setValue(it.value, true); close(); }
      }, [
        el('span', { class: 'choice-option-text', text: it.text }),
        el('span', { class: 'choice-check', text: active ? '✓' : '' })
      ]));
    });
    function close() {
      mask.classList.remove('open');
      setTimeout(function () { if (mask.parentNode) mask.remove(); }, 180);
    }
    $('.choice-sheet-close', sheet).addEventListener('click', close);
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    mask.appendChild(sheet);
    document.body.appendChild(mask);
    requestAnimationFrame(function () { mask.classList.add('open'); });
  }

  /* App-owned action sheet (same frosted bottom-sheet look as the choice sheet).
     `actions` = [{ icon (svg html), label, onClick }]. Used for the photo source
     picker so 拍照/相册/截图/粘贴 match the rest of the app instead of the bare
     native OS sheet. */
  function actionSheet(title, actions) {
    var old = $('.choice-sheet-mask');
    if (old) old.remove();
    var mask = el('div', { class: 'choice-sheet-mask' });
    var sheet = el('section', { class: 'choice-sheet action-sheet', role: 'dialog', 'aria-modal': 'true' }, [
      el('div', { class: 'choice-sheet-head' }, [
        el('strong', { text: title }),
        el('button', { type: 'button', class: 'choice-sheet-close', text: t('choice_close') })
      ])
    ]);
    function close() {
      mask.classList.remove('open');
      setTimeout(function () { if (mask.parentNode) mask.remove(); }, 180);
    }
    actions.forEach(function (a) {
      var ic = el('span', { class: 'action-ic' }); ic.innerHTML = a.icon || '';
      var row = el('button', { type: 'button', class: 'choice-option action-option' },
        [ic, el('span', { class: 'choice-option-text', text: a.label })]);
      row.addEventListener('click', function () { close(); setTimeout(a.onClick, 170); });
      sheet.appendChild(row);
    });
    $('.choice-sheet-close', sheet).addEventListener('click', close);
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    mask.appendChild(sheet);
    document.body.appendChild(mask);
    requestAnimationFrame(function () { mask.classList.add('open'); });
  }

  /* ---------------- Reality Diff ---------------- */
  function renderDiff(v) {
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_diff') })]));
    var commits = Store.commits();
    if (commits.length < 2) {
      v.appendChild(noticeCard(t('need_two')));
      return;
    }

    // scene picker, defaulting to a scene with >=2 commits
    var scenesWith2 = Store.SCENES.filter(function (s) {
      return Store.commitsForScene(s.id).length >= 2;
    });
    if (!scenesWith2.length) { v.appendChild(noticeCard(t('need_two'))); return; }
    var sceneSel = choiceSelect(scenesWith2.map(function (s) {
      return { value: s.id, text: sceneLabel(s) };
    }));
    var baseSel = choiceSelect([]);
    var compSel = choiceSelect([]);

    function fillVersionSelects() {
      var list = Store.commitsForScene(sceneSel.getValue()); // newest first
      var choices = list.map(function (c) {
        return { value: c.id, text: fmtDate(c.createdAt) + ' · ' + (c.message || shortId(c.id)) };
      });
      // default: base = older (second item), compare = newest
      compSel.setOptions(choices, choices[0] && choices[0].value);
      baseSel.setOptions(choices, choices[Math.min(1, choices.length - 1)] && choices[Math.min(1, choices.length - 1)].value);
    }
    fillVersionSelects();
    sceneSel.onChange(function () { fillVersionSelects(); runDiff(); });

    var controls = el('div', { class: 'diff-controls' }, [
      labeledBlock(t('scene'), sceneSel),
      labeledBlock(t('base'), baseSel),
      labeledBlock(t('compare'), compSel),
      el('button', { class: 'btn primary', text: '🔍 ' + t('run_diff'), onclick: function () { runDiff(); } })
    ]);
    v.appendChild(controls);

    var result = el('div', { class: 'diff-result' });
    v.appendChild(result);

    baseSel.onChange(runDiff);
    compSel.onChange(runDiff);

    function runDiff() {
      var base = Store.getCommit(baseSel.getValue());
      var comp = Store.getCommit(compSel.getValue());
      if (!base || !comp) return;
      result.innerHTML = '';

      // ----- visual heatmap -----
      var photos = el('div', { class: 'diff-photos' }, [
        photoCol(t('base'), base),
        photoCol(t('compare'), comp)
      ]);
      var heatCanvas = el('canvas', { class: 'heat-canvas' });
      var heatWrap = el('div', { class: 'heat-wrap' }, [
        el('div', { class: 'heat-title', text: '🔥 ' + t('changed') }),
        heatCanvas,
        el('div', { class: 'heat-stats', id: 'heat-stats' })
      ]);

      result.appendChild(photos);
      if (base.photo && comp.photo) {
        result.appendChild(heatWrap);
        Diff.imageDiff(base.photo, comp.photo, heatCanvas, {}).then(function (r) {
          var stats = $('#heat-stats');
          if (!r.ok) { stats.textContent = t('no_photo'); return; }
          stats.innerHTML = '';
          stats.appendChild(el('span', { class: 'big-pct',
            text: r.changedPct.toFixed(1) + '% ' + t('changed') }));
          if (r.blocks.length) {
            var zones = r.blocks.map(function (b) {
              return lang === 'zh' ? b.zoneZh : b.zone;
            }).join(' · ');
            stats.appendChild(el('span', { class: 'heat-zones',
              text: t('heat_hint') + '：' + zones }));
          }
        });
      }

      // ----- semantic item diff -----
      var d = Diff.itemDiff(base.items, comp.items);
      var anyChange = d.added.length || d.removed.length || d.changed.length;
      var sem = el('div', { class: 'sem-diff' });
      if (!anyChange) {
        sem.appendChild(noticeCard(t('no_change')));
      } else {
        if (d.removed.length) sem.appendChild(diffList('removed', t('removed'), d.removed.map(function (x) {
          return x.name + (x.qty > 1 ? ' ×' + x.qty : '');
        })));
        if (d.added.length) sem.appendChild(diffList('added', t('added'), d.added.map(function (x) {
          return x.name + (x.qty > 1 ? ' ×' + x.qty : '');
        })));
        if (d.changed.length) sem.appendChild(diffList('changed', t('changed_qty'), d.changed.map(function (x) {
          return x.name + ': ' + x.from + ' → ' + x.to;
        })));
        if (d.kept.length) sem.appendChild(diffList('kept', t('kept'), d.kept.map(function (x) {
          return x.name + (x.qty > 1 ? ' ×' + x.qty : '');
        })));
      }
      result.appendChild(sem);
    }
    runDiff();
  }

  function photoCol(label, c) {
    var img = c.photo
      ? el('div', { class: 'diff-photo', style: 'background-image:url(' + c.photo + ')' })
      : el('div', { class: 'diff-photo noimg', text: t('no_photo') });
    return el('div', { class: 'diff-photo-col' }, [
      el('div', { class: 'diff-photo-label', text: label }),
      img,
      el('div', { class: 'diff-photo-msg', text: c.message || shortId(c.id) })
    ]);
  }

  function diffList(kind, title, lines) {
    var ul = el('ul', { class: 'diff-ul' });
    lines.forEach(function (l) { ul.appendChild(el('li', { text: l })); });
    var sign = { removed: '−', added: '+', changed: '~', kept: '=' }[kind];
    return el('div', { class: 'diff-block ' + kind }, [
      el('div', { class: 'diff-block-head' }, [
        el('span', { class: 'diff-sign', text: sign }),
        el('span', { text: title + ' (' + lines.length + ')' })
      ]), ul]);
  }

  /* ---------------- Rollback ---------------- */
  var pendingRollback = null;
  function renderRollback(v) {
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_rollback') })]));
    var commits = Store.commits();
    if (!commits.length) { v.appendChild(noticeCard(t('empty_title'))); return; }

    var initialCommit = Store.getCommit(pendingRollback) || commits[0];
    pendingRollback = null;
    var scenes = Store.SCENES.filter(function (s) {
      return Store.commitsForScene(s.id).length > 0;
    });
    var sceneSel = choiceSelect(scenes.map(function (s) {
      return { value: s.id, text: sceneLabel(s) };
    }), initialCommit.scene);
    var sel = choiceSelect([]);

    function fillCommitSelect(preferredId) {
      var choices = Store.commitsForScene(sceneSel.getValue()).map(function (c) {
        return { value: c.id, text: fmtDate(c.createdAt) + ' · ' + (c.message || shortId(c.id)) };
      });
      sel.setOptions(choices, preferredId);
    }
    fillCommitSelect(initialCommit.id);

    v.appendChild(el('div', { class: 'rollback-controls' }, [
      labeledBlock(t('scene'), sceneSel),
      labeledBlock(t('rollback_version'), sel)
    ]));
    var out = el('div', { class: 'rollback-out' });
    v.appendChild(out);

    function changeScene() {
      fillCommitSelect();
      build();
    }
    sceneSel.onChange(changeScene);
    sel.onChange(build);

    function build() {
      var target = Store.getCommit(sel.getValue());
      if (!target) return;
      out.innerHTML = '';

      // current state = latest commit in the same scene
      var sceneCommits = Store.commitsForScene(target.scene); // newest first
      var currentC = sceneCommits[0];
      var d = Diff.itemDiff(currentC.items, target.items);

      out.appendChild(el('p', { class: 'rollback-intro', text: t('rollback_intro') }));

      // reference photo
      if (target.photo) {
        out.appendChild(el('div', { class: 'rollback-ref' }, [
          el('div', { class: 'ref-label', text: '🎯 ' + t('reference') + ' · ' + (target.message || '') }),
          el('div', { class: 'ref-photo', style: 'background-image:url(' + target.photo + ')' })
        ]));
      }

      // To get FROM current TO target:
      //  - items in target but missing now  => add back
      //  - items present now but not in target => remove
      var steps = [];
      d.removed.forEach(function (x) { // in current(before) not in target(after) => remove
        steps.push({ kind: 'remove', text: x.name + (x.qty > 1 ? ' ×' + x.qty : '') });
      });
      d.added.forEach(function (x) {  // in target(after) not in current => add back
        steps.push({ kind: 'add', text: x.name + (x.qty > 1 ? ' ×' + x.qty : '') });
      });
      d.changed.forEach(function (x) {
        steps.push({ kind: 'add', text: x.name + ': ' + x.from + ' → ' + x.to });
      });
      if (!steps.length) {
        // already matches — just confirm the items
        (target.items || []).forEach(function (x) {
          steps.push({ kind: 'check', text: x.name + (x.qty > 1 ? ' ×' + x.qty : '') });
        });
      }

      out.appendChild(el('h3', { class: 'rollback-steps-h', text: t('rollback_steps') }));
      var ol = el('ol', { class: 'rollback-steps' });
      var doneCount = 0;
      steps.forEach(function (s) {
        var label = { remove: '🗑️ ' + t('step_remove'), add: '📥 ' + t('step_add'),
          check: '✔️ ' + t('step_check') }[s.kind];
        var cb = el('input', { type: 'checkbox' });
        var li = el('li', { class: 'rollback-step ' + s.kind }, [
          el('label', {}, [cb,
            el('span', { class: 'step-action', text: label }),
            el('span', { class: 'step-item', text: s.text })])
        ]);
        cb.addEventListener('change', function () {
          li.classList.toggle('done', cb.checked);
          doneCount += cb.checked ? 1 : -1;
          $('#rb-progress').textContent = doneCount + ' / ' + steps.length;
        });
        ol.appendChild(li);
      });
      out.appendChild(ol);
      out.appendChild(el('div', { class: 'rb-progress-bar' }, [
        el('span', { text: t('done') + ': ' }),
        el('strong', { id: 'rb-progress', text: '0 / ' + steps.length })
      ]));
    }
    build();
  }

  /* ---------------- Branch (decisions) ---------------- */
  var branchEditingId = null;
  var pendingBranchDetail = null;
  var branchQuery = '';
  var branchStatusFilter = 'all';
  var branchTagFilter = null;
  var BRANCH_PAGE_SIZE = 18;
  var branchVisible = BRANCH_PAGE_SIZE;
  var BRANCH_LETTERS = ['A', 'B', 'C', 'D'];
  function branchLabel(idx) { return BRANCH_LETTERS[idx] || String(idx + 1); }
  function branchTone(idx) { return ['a', 'b', 'c', 'd'][idx] || 'a'; }
  function normalizedBranches(b) {
    var list = (b && b.branches && b.branches.length ? b.branches : []).slice(0, 4);
    while (list.length < 2) list.push({ name: '', predicted: [] });
    return list.map(function (br, idx) {
      return {
        name: br && br.name || ((lang === 'zh' ? '选项 ' : 'Option ') + branchLabel(idx)),
        predicted: (br && br.predicted || []).slice()
      };
    });
  }
  function splitLines(s) {
    return (s || '').split('\n').map(function (x) { return x.trim(); })
      .filter(function (x) { return x; });
  }
  function parseTags(s) {
    var seen = {};
    return (s || '').split(/[,\s，、#]+/).map(function (x) { return x.trim(); })
      .filter(function (x) {
        var k = x.toLowerCase();
        if (!x || seen[k]) return false;
        seen[k] = true; return true;
      }).slice(0, 8);
  }
  function branchStatusKey(b) {
    if (b && b.followup) return 'reviewed';
    if (!b || b.chosenIndex == null) return 'unselected';
    if (b.dueAt && String(b.dueAt) <= todayKey()) return 'due';
    return 'pending';
  }
  function branchStatusText(key) {
    return {
      all: t('branch_all'),
      unselected: t('branch_unselected'),
      pending: t('branch_pending'),
      due: t('branch_due'),
      reviewed: t('branch_reviewed_chip')
    }[key] || key;
  }
  function branchPendingCount() {
    try {
      return Store.branches().filter(function (b) {
        var s = branchStatusKey(b);
        return s === 'pending' || s === 'due';
      }).length;
    } catch (e) { return 0; }
  }
  function branchConfidenceText(c) {
    return ({ low: t('confidence_low'), medium: t('confidence_mid'), high: t('confidence_high') })[c || ''] || '—';
  }
  function branchActual(b) {
    return (b && b.followup && b.followup.actual) || (b && b.actual) || [];
  }
  function branchHits(b) {
    return (b && b.followup && b.followup.hits) || (b && b.hits) || [];
  }
  function branchHitText(b) {
    var hits = branchHits(b);
    if (!hits.length) return '—';
    var ok = hits.filter(Boolean).length;
    return ok + '/' + hits.length;
  }
  function branchContextCommit(b) {
    return b && b.contextCommitId ? Store.getCommit(b.contextCommitId) : null;
  }
  function branchMatches(b, q) {
    if (!q) return true;
    q = q.toLowerCase();
    var parts = [b.question || '', b.dueAt || '', branchStatusText(branchStatusKey(b)), branchConfidenceText(b.confidence)]
      .concat(b.tags || [])
      .concat(branchActual(b))
      .concat(b.followup && b.followup.note ? [b.followup.note] : []);
    normalizedBranches(b).forEach(function (br) {
      parts.push(br.name || '');
      parts = parts.concat(br.predicted || []);
    });
    var ctx = branchContextCommit(b);
    if (ctx) parts.push(ctx.message || '', shortId(ctx.id));
    return parts.join(' ').toLowerCase().indexOf(q) >= 0;
  }
  function allBranchTags(list) {
    var seen = {}, out = [];
    list.forEach(function (b) {
      (b.tags || []).forEach(function (tag) {
        var k = tag.toLowerCase();
        if (!seen[k]) { seen[k] = true; out.push(tag); }
      });
    });
    return out.slice(0, 12);
  }
  function branchStats(list) {
    var reviewed = list.filter(function (b) { return !!b.followup; });
    var pending = list.filter(function (b) {
      var s = branchStatusKey(b);
      return s === 'pending' || s === 'due';
    });
    var ratingSum = 0, repeat = 0, hitOk = 0, hitTotal = 0;
    reviewed.forEach(function (b) {
      ratingSum += parseInt(b.followup.rating, 10) || 0;
      if (b.followup.wouldRepeat) repeat++;
      branchHits(b).forEach(function (h) { hitTotal++; if (h) hitOk++; });
    });
    return {
      total: list.length,
      pending: pending.length,
      reviewed: reviewed.length,
      avgRating: reviewed.length ? (ratingSum / reviewed.length).toFixed(1) : '—',
      repeatRate: pct(repeat, reviewed.length),
      hitRate: pct(hitOk, hitTotal)
    };
  }

  function renderBranch(v) {
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_branch') })]));

    var editing = branchEditingId ? Store.getBranch(branchEditingId) : null;
    v.appendChild(branchForm(editing));

    var list = Store.branches();
    if (!list.length) { v.appendChild(noticeCard(t('branch_empty'))); return; }
    v.appendChild(branchInsights(list));

    var searchInput = el('input', { class: 'field tl-search-input', type: 'search',
      placeholder: t('branch_search_ph') });
    searchInput.value = branchQuery;
    var chipsRow = el('div', { class: 'tl-chips branch-filter-chips' });
    var listWrap = el('div', { class: 'branch-list' });

    searchInput.addEventListener('input', function () {
      branchQuery = searchInput.value;
      branchVisible = BRANCH_PAGE_SIZE;
      renderBranchList();
    });
    v.appendChild(el('div', { class: 'tl-search branch-search' }, [searchInput, chipsRow]));
    v.appendChild(listWrap);

    function chip(key, label, tag) {
      var on = tag ? branchTagFilter === tag : branchStatusFilter === key;
      var b = el('button', { type: 'button', class: 'tl-chip' + (on ? ' active' : ''), text: label });
      b.addEventListener('click', function () {
        if (tag) branchTagFilter = branchTagFilter === tag ? null : tag;
        else branchStatusFilter = key;
        branchVisible = BRANCH_PAGE_SIZE;
        renderBranchChips(); renderBranchList();
      });
      return b;
    }
    function renderBranchChips() {
      chipsRow.innerHTML = '';
      ['all', 'unselected', 'pending', 'due', 'reviewed'].forEach(function (s) {
        chipsRow.appendChild(chip(s, branchStatusText(s)));
      });
      allBranchTags(list).forEach(function (tag) {
        chipsRow.appendChild(chip('tag', '#' + tag, tag));
      });
    }
    function activeBranches() {
      return list.filter(function (b) {
        var statusOk = branchStatusFilter === 'all' || branchStatusKey(b) === branchStatusFilter;
        var tagOk = !branchTagFilter || (b.tags || []).some(function (tag) { return tag.toLowerCase() === branchTagFilter.toLowerCase(); });
        return statusOk && tagOk && branchMatches(b, branchQuery);
      });
    }
    function renderBranchList() {
      listWrap.innerHTML = '';
      var filtered = activeBranches();
      if (!filtered.length) {
        listWrap.appendChild(el('div', { class: 'tl-empty' }, [
          el('div', { class: 'tl-empty-ic', text: '🔍' }),
          el('div', { text: lang === 'zh' ? '没有匹配的分支' : 'No matching branches' })
        ]));
        return;
      }
      var shown = filtered.slice(0, branchVisible);
      shown.forEach(function (b) { listWrap.appendChild(branchCard(b)); });
      if (filtered.length > shown.length) {
        listWrap.appendChild(el('button', { class: 'btn ghost load-more', text: t('load_more') + ' · ' + shown.length + ' / ' + filtered.length,
          onclick: function () { branchVisible += BRANCH_PAGE_SIZE; renderBranchList(); } }));
      }
    }
    renderBranchChips();
    renderBranchList();
  }

  function branchInsights(list) {
    var s = branchStats(list);
    var cards = [
      [t('branch_total'), s.total],
      [t('branch_pending'), s.pending],
      [t('branch_reviewed_chip'), s.reviewed],
      [t('branch_avg_rating'), s.avgRating],
      [t('branch_repeat_rate'), s.repeatRate],
      [t('branch_hit_rate'), s.hitRate]
    ];
    return el('section', { class: 'branch-insights', 'aria-label': t('branch_insights') },
      cards.map(function (c) {
        return el('div', { class: 'branch-insight' }, [
          el('span', { class: 'branch-insight-label', text: c[0] }),
          el('strong', { text: String(c[1]) })
        ]);
      }));
  }

  function branchForm(editing) {
    var isEdit = !!editing;
    var details = el('details', { class: 'branch-form form-card' });
    if (isEdit) details.setAttribute('open', '');
    details.appendChild(el('summary', { class: 'more-summary branch-summary',
      text: isEdit ? t('edit_branch') : t('new_branch') }));

    var qInput = el('input', { class: 'field', type: 'text', placeholder: t('branch_q_ph'),
      value: (editing && editing.question) || '' });
    var dueInput = el('input', { class: 'field', type: 'date', value: (editing && editing.dueAt) || '' });
    var confSel = choiceSelect([
      { value: '', text: '—' },
      { value: 'low', text: t('confidence_low') },
      { value: 'medium', text: t('confidence_mid') },
      { value: 'high', text: t('confidence_high') }
    ], (editing && editing.confidence) || '', 'tiny-choice');
    var tagsInput = el('input', { class: 'field', type: 'text', placeholder: t('branch_tags_ph'),
      value: (editing && editing.tags || []).join(' ') });
    var contextChoices = [{ value: '', text: t('no_context') }].concat(Store.commits().slice(0, 80).map(function (c) {
      return { value: c.id, text: fmtDate(c.createdAt) + ' · ' + (c.message || shortId(c.id)) };
    }));
    var contextSel = choiceSelect(contextChoices, (editing && editing.contextCommitId) || '');
    var optionRows = el('div', { class: 'branch-options' });
    var branches = normalizedBranches(editing);

    function optionEditor(br, idx) {
      var name = el('input', { class: 'field', type: 'text',
        placeholder: (lang === 'zh' ? '选项 ' : 'Option ') + branchLabel(idx),
        value: br && br.name || '' });
      var out = el('textarea', { class: 'field', rows: '3', placeholder: t('outcome'),
        value: (br && br.predicted || []).join('\n') });
      var row = el('div', { class: 'branch-col ' + branchTone(idx) });
      row.appendChild(el('div', { class: 'branch-col-head' }, [
        el('span', { class: 'branch-tag', text: branchLabel(idx) }),
        el('span', { class: 'branch-name', text: (lang === 'zh' ? '选项 ' : 'Option ') + branchLabel(idx) })
      ]));
      row.appendChild(labeled(t('branch_name'), name));
      row.appendChild(labeled(t('outcome'), out));
      if (idx > 1) {
        row.appendChild(el('button', { class: 'btn tiny danger-ghost', type: 'button',
          text: t('remove_option'), onclick: function () { row.remove(); renumberOptions(); } }));
      }
      row._name = name; row._out = out;
      return row;
    }

    function renumberOptions() {
      Array.prototype.slice.call(optionRows.children).forEach(function (row, idx) {
        row.className = 'branch-col ' + branchTone(idx);
        $('.branch-tag', row).textContent = branchLabel(idx);
        $('.branch-name', row).textContent = (lang === 'zh' ? '选项 ' : 'Option ') + branchLabel(idx);
      });
      addBtn.disabled = optionRows.children.length >= 4;
    }

    branches.forEach(function (br, idx) { optionRows.appendChild(optionEditor(br, idx)); });
    var addBtn = el('button', { class: 'btn tiny ghost', type: 'button', text: t('add_option'), onclick: function () {
      if (optionRows.children.length >= 4) return;
      optionRows.appendChild(optionEditor({ name: '', predicted: [] }, optionRows.children.length));
      renumberOptions();
    } });
    renumberOptions();

    details.appendChild(labeled(t('branch_q'), qInput));
    details.appendChild(el('div', { class: 'branch-meta-grid' }, [
      labeled(t('branch_due_at'), dueInput),
      labeledBlock(t('branch_confidence'), confSel),
      labeled(t('branch_tags'), tagsInput),
      labeledBlock(t('context_commit'), contextSel)
    ]));
    details.appendChild(optionRows);
    details.appendChild(el('div', { class: 'form-actions branch-form-actions' }, [
      addBtn,
      isEdit ? el('button', { class: 'btn ghost', type: 'button', text: t('cancel'), onclick: function () {
        branchEditingId = null; render();
      } }) : null,
      el('button', { class: 'btn primary', type: 'button', text: isEdit ? t('save_branch') : t('create_branch'), onclick: function () {
        if (!qInput.value.trim()) { toast('⚠ ' + t('branch_q')); return; }
        var nextBranches = Array.prototype.slice.call(optionRows.children).map(function (row, idx) {
          return {
            name: row._name.value.trim() || ((lang === 'zh' ? '选项 ' : 'Option ') + branchLabel(idx)),
            predicted: splitLines(row._out.value)
          };
        }).slice(0, 4);
        var patch = {
          question: qInput.value.trim(),
          branches: nextBranches,
          dueAt: dueInput.value || null,
          confidence: confSel.getValue() || '',
          tags: parseTags(tagsInput.value),
          contextCommitId: contextSel.getValue() || null
        };
        if (isEdit) {
          if (editing.chosenIndex != null && editing.chosenIndex >= nextBranches.length) {
            patch.chosenIndex = null; patch.followup = null; patch.actual = []; patch.hits = [];
          }
          Store.updateBranch(editing.id, patch);
          branchEditingId = null;
          toast('✅ ' + t('save_branch'));
        } else {
          Store.addBranch({
            question: patch.question, branches: patch.branches, dueAt: patch.dueAt,
            confidence: patch.confidence, tags: patch.tags, contextCommitId: patch.contextCommitId,
            chosenIndex: null, followup: null, actual: [], hits: []
          });
          toast('✅ ' + t('create_branch'));
        }
        renderNav();
        render();
      } })
    ]));
    return details;
  }

  function branchStatusBadge(b) {
    var s = branchStatusKey(b);
    return el('span', { class: 'branch-status ' + s, text: branchStatusText(s) });
  }

  function branchCard(b) {
    var ctx = branchContextCommit(b);
    var chosen = b.chosenIndex != null ? normalizedBranches(b)[b.chosenIndex] : null;
    var chips = el('div', { class: 'branch-mini-meta' }, [
      b.dueAt ? el('span', { class: 'branch-mini-chip due', text: fmtDateOnly(b.dueAt) }) : null,
      b.confidence ? el('span', { class: 'branch-mini-chip', text: t('branch_confidence') + ' ' + branchConfidenceText(b.confidence) }) : null,
      b.followup ? el('span', { class: 'branch-mini-chip', text: t('branch_hit_rate') + ' ' + branchHitText(b) }) : null,
      b.mergedCommitId ? el('span', { class: 'branch-mini-chip merged', text: t('merged_commit') }) : null
    ].concat((b.tags || []).map(function (tag) { return el('span', { class: 'branch-mini-chip tag', text: '#' + tag }); })));
    var children = [
      el('div', { class: 'branch-head' }, [
        el('span', { class: 'branch-q', text: '🔀 ' + b.question }),
        branchStatusBadge(b)
      ]),
      chips,
      chosen ? el('div', { class: 'branch-chosen-line', text: '✓ ' + t('chosen') + ' · ' + chosen.name }) :
        el('div', { class: 'branch-chosen-line muted', text: t('branch_unselected') }),
      ctx ? el('div', { class: 'branch-context-mini' }, [
        el('span', { class: 'commit-hash', text: t('context_commit') }),
        el('span', { text: ctx.message || shortId(ctx.id) })
      ]) : null
    ];
    var card = el('div', { class: 'branch-card slim tappable', role: 'button', tabindex: '0' }, children);
    function open() { pendingBranchDetail = b.id; go('branch-detail'); }
    card.addEventListener('click', open);
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    return card;
  }

  function renderBranchDetail(v) {
    var b = pendingBranchDetail ? Store.getBranch(pendingBranchDetail) : null;
    if (!b) { go('branch'); return; }
    var L = lang === 'zh';
    var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (L ? '分支' : 'Branches'),
      onclick: function () { go('branch'); } });
    v.appendChild(el('div', { class: 'view-head' }, [back]));

    var card = el('div', { class: 'detail-card branch-detail-card' });
    card.appendChild(el('div', { class: 'branch-detail-top' }, [
      el('div', {}, [
        el('div', { class: 'detail-title', text: b.question }),
        el('div', { class: 'detail-sub' }, [
          el('span', { text: fmtDate(b.createdAt || Date.now()) }),
          el('span', { class: 'commit-dot', text: '·' }),
          el('span', { class: 'commit-hash', text: shortId(b.id) })
        ])
      ]),
      branchStatusBadge(b)
    ]));
    card.appendChild(branchMetaRows(b));
    card.appendChild(branchOptionsDetail(b));
    card.appendChild(branchFollowupBlock(b));
    card.appendChild(branchMergeBlock(b));
    v.appendChild(card);

    v.appendChild(el('div', { class: 'detail-actions' }, [
      el('button', { class: 'btn primary', text: '✏️ ' + t('edit_branch'), onclick: function () {
        branchEditingId = b.id; go('branch');
      } }),
      el('button', { class: 'btn danger', text: '🗑 ' + t('delete'), onclick: function () {
        if (confirm(t('confirm_delete_branch'))) { Store.deleteBranch(b.id); pendingBranchDetail = null; renderNav(); go('branch'); }
      } })
    ]));
  }

  function branchMetaRows(b) {
    var ctx = branchContextCommit(b);
    var rows = el('div', { class: 'branch-meta-rows' });
    rows.appendChild(el('div', { class: 'branch-meta-row' }, [
      el('span', { text: t('branch_due_at') }),
      el('strong', { text: b.dueAt ? fmtDateOnly(b.dueAt) : t('branch_no_due') })
    ]));
    rows.appendChild(el('div', { class: 'branch-meta-row' }, [
      el('span', { text: t('branch_confidence') }),
      el('strong', { text: branchConfidenceText(b.confidence) })
    ]));
    if (b.tags && b.tags.length) rows.appendChild(el('div', { class: 'branch-meta-row' }, [
      el('span', { text: t('branch_tags') }),
      el('strong', { text: b.tags.map(function (x) { return '#' + x; }).join(' ') })
    ]));
    if (ctx) {
      rows.appendChild(el('button', { class: 'branch-meta-row as-button', onclick: function () {
        pendingDetail = ctx.id; go('detail');
      } }, [
        el('span', { text: t('context_commit') }),
        el('strong', { text: ctx.message || shortId(ctx.id) })
      ]));
    }
    return rows;
  }

  function branchOptionsDetail(b) {
    var cols = el('div', { class: 'branch-cols detail-branch-cols' });
    normalizedBranches(b).forEach(function (br, idx) {
      var chosen = b.chosenIndex === idx;
      var preds = el('ul', { class: 'pred-ul' });
      (br.predicted || []).forEach(function (p) { preds.appendChild(el('li', { text: p })); });
      if (!preds.children.length) preds.appendChild(el('li', { text: lang === 'zh' ? '未填写预期结果' : 'No predicted outcome yet' }));
      cols.appendChild(el('div', { class: 'branch-col ' + branchTone(idx) + (chosen ? ' chosen' : '') }, [
        el('div', { class: 'branch-col-head' }, [
          el('span', { class: 'branch-tag', text: branchLabel(idx) }),
          el('span', { class: 'branch-name', text: br.name })
        ]),
        preds,
        b.chosenIndex == null
          ? el('button', { class: 'btn tiny primary', text: t('choose'), onclick: function () {
              Store.updateBranch(b.id, { chosenIndex: idx, chosenAt: Date.now() });
              renderNav(); render();
            } })
          : (chosen ? el('span', { class: 'chosen-badge', text: '✓ ' + t('chosen') }) : null)
      ]));
    });
    return el('section', {}, [
      el('div', { class: 'detail-section-title', text: t('nav_branch') }),
      cols
    ]);
  }

  function branchFollowupBlock(b) {
    if (b.chosenIndex == null) return noticeCard(lang === 'zh' ? '先选择一条分支，再回来复盘。' : 'Choose a branch first, then review it.');
    if (b.followup) {
      return el('section', { class: 'branch-review' }, [
        el('div', { class: 'detail-section-title', text: t('followup') }),
        el('div', { class: 'followup-done' }, [
          el('span', { class: 'rating', text: '⭐ ' + b.followup.rating + '/5' }),
          el('span', { class: 'repeat ' + (b.followup.wouldRepeat ? 'yes' : 'no'),
            text: b.followup.wouldRepeat ? t('would_repeat_yes') : t('would_repeat_no') }),
          b.followup.note ? el('span', { class: 'fu-note', text: '“' + b.followup.note + '”' }) : null
        ]),
        branchPredictionReview(b)
      ]);
    }

    var chosen = normalizedBranches(b)[b.chosenIndex];
    var predicted = (chosen.predicted && chosen.predicted.length ? chosen.predicted : [chosen.name]);
    var rows = [];
    var reviewRows = el('div', { class: 'review-rows' });
    predicted.forEach(function (p) {
      var cb = el('input', { type: 'checkbox' });
      var actual = el('input', { class: 'field tiny-field', type: 'text', placeholder: t('actual_result'), value: p });
      rows.push({ predicted: p, hit: cb, actual: actual });
      reviewRows.appendChild(el('label', { class: 'review-row' }, [
        cb,
        el('span', { class: 'review-pred', text: p }),
        actual
      ]));
    });
    var extra = el('textarea', { class: 'field', rows: '2', placeholder: t('extra_actual') });
    var rate = choiceSelect([5, 4, 3, 2, 1].map(function (n) {
      return { value: n, text: '⭐ ' + n };
    }), '5', 'tiny-choice');
    var note = el('input', { class: 'field', type: 'text', placeholder: t('followup') });
    var rep = choiceSelect([
      { value: '1', text: t('yes') }, { value: '0', text: t('no') }
    ], '1', 'tiny-choice');
    return el('div', { class: 'followup-form' }, [
      el('div', { class: 'fu-title', text: '📋 ' + t('followup') }),
      el('div', { class: 'fu-row' }, [
        labeledBlock(t('rate'), rate), labeledBlock(t('repeat'), rep), labeled(t('notes'), note)
      ]),
      el('div', { class: 'detail-section-title', text: t('predicted_vs_actual') }),
      reviewRows,
      labeled(t('actual_result'), extra),
      el('button', { class: 'btn tiny primary', text: t('save_followup'), onclick: function () {
        var actual = [], hits = [];
        rows.forEach(function (row) {
          actual.push(row.actual.value.trim() || row.predicted);
          hits.push(!!row.hit.checked);
        });
        actual = actual.concat(splitLines(extra.value));
        Store.updateBranch(b.id, {
          actual: actual,
          hits: hits,
          followup: {
            rating: parseInt(rate.getValue(), 10),
            wouldRepeat: rep.getValue() === '1',
            note: note.value.trim(),
            actual: actual,
            hits: hits,
            recordedAt: Date.now()
          }
        });
        renderNav(); render();
      } })
    ]);
  }

  function branchPredictionReview(b) {
    var chosen = normalizedBranches(b)[b.chosenIndex] || {};
    var predicted = chosen.predicted && chosen.predicted.length ? chosen.predicted : [chosen.name || ''];
    var actual = branchActual(b);
    var hits = branchHits(b);
    if (!actual.length && !hits.length) return null;
    var rows = el('div', { class: 'prediction-review' });
    predicted.forEach(function (p, idx) {
      rows.appendChild(el('div', { class: 'prediction-row' }, [
        el('span', { class: 'prediction-pred', text: p }),
        el('span', { class: 'prediction-actual', text: actual[idx] || '—' }),
        el('span', { class: 'prediction-hit ' + (hits[idx] ? 'yes' : 'no'),
          text: hits[idx] ? t('hit') : t('miss') })
      ]));
    });
    if (actual.length > predicted.length) {
      actual.slice(predicted.length).forEach(function (a) {
        rows.appendChild(el('div', { class: 'prediction-row extra' }, [
          el('span', { class: 'prediction-pred', text: '—' }),
          el('span', { class: 'prediction-actual', text: a }),
          el('span', { class: 'prediction-hit', text: '' })
        ]));
      });
    }
    return el('div', {}, [
      el('div', { class: 'detail-section-title', text: t('predicted_vs_actual') + ' · ' + branchHitText(b) }),
      rows
    ]);
  }

  function branchMergeBlock(b) {
    if (!b.followup) return el('span', {});
    if (b.mergedCommitId) {
      var existing = Store.getCommit(b.mergedCommitId);
      return el('div', { class: 'branch-merge-box' }, [
        el('span', { text: t('merged_commit') + (existing ? ' · ' + (existing.message || shortId(existing.id)) : '') }),
        existing ? el('button', { class: 'btn tiny ghost', text: t('open_detail'), onclick: function () {
          pendingDetail = existing.id; go('detail');
        } }) : null
      ]);
    }
    return el('div', { class: 'branch-merge-box' }, [
      el('span', { text: lang === 'zh' ? '把这次复盘写入时间线，形成一条 commit。' : 'Write this review into the timeline as a commit.' }),
      el('button', { class: 'btn tiny primary', text: t('merge_to_commit'), onclick: function () { createMergedCommit(b); } })
    ]);
  }

  function createMergedCommit(b) {
    var ctx = branchContextCommit(b);
    var chosen = normalizedBranches(b)[b.chosenIndex] || {};
    var actual = branchActual(b);
    var lines = actual.length ? actual : (chosen.predicted && chosen.predicted.length ? chosen.predicted : [chosen.name]);
    var commit = Store.addCommit({
      scene: ctx ? ctx.scene : 'other',
      message: (lang === 'zh' ? '分支复盘：' : 'Branch review: ') + b.question,
      items: lines.slice(0, 20).map(function (line) { return { name: line, qty: 1 }; }),
      notes: [
        (lang === 'zh' ? '选择：' : 'Chosen: ') + (chosen.name || ''),
        (lang === 'zh' ? '评分：' : 'Rating: ') + (b.followup && b.followup.rating || '—') + '/5',
        b.followup && b.followup.note ? b.followup.note : ''
      ].filter(Boolean).join('\n'),
      fromBranchId: b.id
    });
    if (!commit) { toast('⚠ ' + (lang === 'zh' ? '存储空间不足' : 'Storage full')); return; }
    Store.updateBranch(b.id, { mergedCommitId: commit.id });
    pendingDetail = commit.id;
    renderNav();
    go('detail');
  }

  /* ---------------- shared bits ---------------- */
  function noticeCard(text) { return el('div', { class: 'notice-card', text: text }); }

  function exportData() {
    var blob = new Blob([Store.exportJSON()], { type: 'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: 'lifearchive-export.json' });
    document.body.appendChild(a); a.click(); a.remove();
  }
  function clearAll() {
    if (confirm(t('confirm_clear'))) { Store.clearAll(); render(); toast('🧹'); }
  }

  /* ---------------- demo seed ---------------- */
  /* Draw a top-down desk as a dataURL. Background (desk, lamp, keyboard, and the
     3 base books) is identical in both versions; the messy version only ADDS
     clutter on the right/bottom-right, so the heatmap lights up exactly there. */
  function deskPhoto(messy) {
    var w = 480, h = 360, c = document.createElement('canvas');
    c.width = w; c.height = h;
    var x = c.getContext('2d');
    x.fillStyle = '#6b4f34'; x.fillRect(0, 0, w, h);              // desk surface
    x.strokeStyle = 'rgba(0,0,0,0.07)';
    for (var i = 0; i < h; i += 14) { x.beginPath(); x.moveTo(0, i); x.lineTo(w, i + 6); x.stroke(); }
    // lamp — same spot in both (stays cold on the heatmap)
    x.fillStyle = '#d8d2c4'; x.beginPath(); x.moveTo(70, 40); x.lineTo(110, 40); x.lineTo(125, 80); x.lineTo(55, 80); x.closePath(); x.fill();
    x.fillStyle = '#3a3a3a'; x.fillRect(86, 80, 8, 70); x.fillRect(60, 148, 60, 8);
    // keyboard/notebook — shared anchor center
    x.fillStyle = '#2b2b2b'; x.fillRect(180, 150, 160, 90);
    var books = ['#c0392b', '#27ae60', '#2980b9', '#8e44ad', '#d35400', '#16a085'];
    function book(bx, by, bw, bh, col) { x.fillStyle = col; x.fillRect(bx, by, bw, bh); x.strokeStyle = 'rgba(0,0,0,0.3)'; x.strokeRect(bx, by, bw, bh); }
    book(40, 250, 120, 22, books[0]); book(45, 228, 110, 22, books[1]); book(50, 206, 100, 22, books[2]); // 3 base books (both)
    if (messy) {
      book(150, 300, 90, 20, books[3]); book(360, 90, 80, 22, books[4]); book(380, 130, 70, 20, books[5]); // +3 scattered
      x.fillStyle = '#e8d8a0'; x.fillRect(330, 250, 80, 70); x.strokeStyle = '#a0813f'; x.strokeRect(330, 250, 80, 70); // takeout
      x.fillRect(360, 205, 70, 55); x.strokeRect(360, 205, 70, 55);
      function bottle(bx, by) { x.fillStyle = 'rgba(120,180,200,0.85)'; x.fillRect(bx, by, 16, 58); x.fillStyle = '#5a8aa0'; x.fillRect(bx + 4, by - 10, 8, 12); }
      bottle(300, 150); bottle(330, 170); bottle(425, 175); // 3 empty bottles
    }
    return c.toDataURL('image/jpeg', 0.7);
  }
  /* Top-down open backpack. Laptop / card / keys are constant; the "before"
     version also holds a charger + water bottle that go missing on the way home. */
  function bagPhoto(full) {
    var w = 480, h = 360, c = document.createElement('canvas');
    c.width = w; c.height = h;
    var x = c.getContext('2d');
    x.fillStyle = '#2f3640'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#3d4450'; x.fillRect(20, 20, 440, 320);
    x.fillStyle = '#1b1f27'; x.fillRect(60, 90, 180, 140); x.strokeStyle = '#0a0c10'; x.strokeRect(60, 90, 180, 140); // laptop
    x.fillStyle = '#cfd6e0'; x.fillRect(95, 150, 110, 8);
    x.fillStyle = '#e1b12c'; x.fillRect(330, 60, 100, 64); x.fillStyle = '#9c7a16'; x.fillRect(340, 100, 80, 8); // student card
    x.fillStyle = '#bdc3c7'; x.beginPath(); x.arc(90, 290, 16, 0, 7); x.fill(); x.fillRect(104, 284, 40, 8);     // keys
    if (full) {
      x.fillStyle = '#111418'; x.fillRect(300, 230, 90, 70); x.strokeStyle = '#000'; x.strokeRect(300, 230, 90, 70); // charger
      x.strokeStyle = '#111'; x.lineWidth = 4; x.beginPath(); x.moveTo(390, 260); x.bezierCurveTo(445, 260, 445, 325, 400, 330); x.stroke(); x.lineWidth = 1;
      x.fillStyle = '#0097e6'; x.fillRect(360, 120, 40, 105); x.fillStyle = '#273c75'; x.fillRect(366, 108, 28, 16); // bottle
    }
    return c.toDataURL('image/jpeg', 0.7);
  }

  function seedDemo() {
    var now = Date.now();
    var day = 86400000;
    // Go-bag: two versions, something missing on return
    Store.addCommit({ scene: 'bag', createdAt: now - 2 * day, photo: bagPhoto(true),
      message: lang === 'zh' ? '出门去学校前，带电脑和充电器' : 'Leaving for school — laptop + charger',
      items: [{ name: lang === 'zh' ? '笔记本电脑' : 'Laptop', qty: 1 },
        { name: lang === 'zh' ? '充电器' : 'Charger', qty: 1 },
        { name: lang === 'zh' ? '学生卡' : 'Student card', qty: 1 },
        { name: lang === 'zh' ? '水杯' : 'Water bottle', qty: 1 },
        { name: lang === 'zh' ? '钥匙' : 'Keys', qty: 1 }] });
    Store.addCommit({ scene: 'bag', createdAt: now - 1.2 * day, photo: bagPhoto(false),
      message: lang === 'zh' ? '回到家，清点包里东西' : 'Back home — checking the bag',
      items: [{ name: lang === 'zh' ? '笔记本电脑' : 'Laptop', qty: 1 },
        { name: lang === 'zh' ? '学生卡' : 'Student card', qty: 1 },
        { name: lang === 'zh' ? '钥匙' : 'Keys', qty: 1 }] });
    // Desk: tidy -> messy
    Store.addCommit({ scene: 'desk', createdAt: now - 3 * day, photo: deskPhoto(false),
      message: lang === 'zh' ? '今天桌面整理完成状态' : 'Desk cleaned up today',
      items: [{ name: lang === 'zh' ? '书本' : 'Books', qty: 3 },
        { name: lang === 'zh' ? '台灯' : 'Lamp', qty: 1 }] });
    Store.addCommit({ scene: 'desk', createdAt: now - 6 * 3600000, photo: deskPhoto(true),
      message: lang === 'zh' ? '三天后的桌面' : 'Desk three days later',
      items: [{ name: lang === 'zh' ? '书本' : 'Books', qty: 6 },
        { name: lang === 'zh' ? '台灯' : 'Lamp', qty: 1 },
        { name: lang === 'zh' ? '外卖盒' : 'Takeout boxes', qty: 2 },
        { name: lang === 'zh' ? '空水瓶' : 'Empty bottles', qty: 3 }] });
    // Homework
    Store.addCommit({ scene: 'homework', createdAt: now - 4 * day,
      message: 'MKTG report start version',
      items: [{ name: 'rubric.png', qty: 1 }, { name: 'report_v1.docx', qty: 1 },
        { name: 'chart_sales.png', qty: 1 }, { name: 'refs.txt', qty: 1 }] });
    // 饭迹 / 饮食 — today's meals
    Store.addCommit({ scene: 'breakfast', createdAt: now - 9 * 3600000,
      message: lang === 'zh' ? '豆浆 + 鸡蛋灌饼' : 'Soy milk + egg pancake',
      items: lang === 'zh'
        ? [{ name: '豆浆', qty: 1 }, { name: '鸡蛋灌饼', qty: 1 }]
        : [{ name: 'Soy milk', qty: 1 }, { name: 'Egg pancake', qty: 1 }] });
    Store.addCommit({ scene: 'lunch', createdAt: now - 4 * 3600000,
      message: lang === 'zh' ? '黄焖鸡米饭 + 一杯奶茶' : 'Braised chicken rice + milk tea',
      items: lang === 'zh'
        ? [{ name: '黄焖鸡米饭', qty: 1 }, { name: '奶茶', qty: 1 }]
        : [{ name: 'Braised chicken rice', qty: 1 }, { name: 'Milk tea', qty: 1 }] });
    // a decision branch
    Store.addBranch({
      question: lang === 'zh' ? '今晚写作业 还是 出去玩？' : 'Homework tonight, or go out?',
      branches: [
        { name: lang === 'zh' ? '今晚写作业' : 'Do homework', predicted: [
          lang === 'zh' ? '明天轻松' : 'Easier tomorrow',
          lang === 'zh' ? '今晚有点无聊' : 'Boring tonight',
          lang === 'zh' ? '压力下降' : 'Less stress'] },
        { name: lang === 'zh' ? '出去玩' : 'Go out', predicted: [
          lang === 'zh' ? '今晚开心' : 'Fun tonight',
          lang === 'zh' ? '明天赶工' : 'Crunch tomorrow',
          lang === 'zh' ? '睡眠变差' : 'Worse sleep'] },
        { name: lang === 'zh' ? '先写一小时再出门' : 'Study one hour, then go out', predicted: [
          lang === 'zh' ? '两边都不落空' : 'Both sides get some time',
          lang === 'zh' ? '需要严格看时间' : 'Needs a hard time limit',
          lang === 'zh' ? '明天压力适中' : 'Moderate stress tomorrow'] }
      ],
      dueAt: new Date(now + 2 * day).toISOString().slice(0, 10),
      confidence: 'medium',
      tags: lang === 'zh' ? ['学习', '时间'] : ['study', 'time'],
      contextCommitId: null,
      chosenIndex: null,
      followup: null,
      actual: [],
      hits: []
    });
    toast(t('seed_done'));
  }

  /* ---------------- Settings ---------------- */
  function verCmp(a, b) {
    var pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
    for (var i = 0; i < 3; i++) {
      if ((pa[i] || 0) > (pb[i] || 0)) return 1;
      if ((pa[i] || 0) < (pb[i] || 0)) return -1;
    }
    return 0;
  }

  function checkUpdate(btn) {
    var cur = window.APP_VERSION || '0.0.0';
    var orig = btn.textContent; btn.disabled = true;
    btn.textContent = (lang === 'zh' ? '检查中…' : 'checking…');
    fetch('https://api.github.com/repos/ChristoGoodrich/LifeArchive/releases/latest',
      { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var latest = (j.tag_name || '').replace(/^v/, '');
        if (!latest) throw new Error('no release');
        if (verCmp(latest, cur) > 0) {
          if (window.confirm((lang === 'zh' ? '发现新版本 v' : 'New version v') + latest +
              (lang === 'zh' ? '，前往下载页？' : ' — open download page?'))) {
            window.open(j.html_url || 'https://github.com/ChristoGoodrich/LifeArchive/releases/latest', '_blank');
          }
        } else {
          toast((lang === 'zh' ? '已是最新版本 · v' : 'Up to date · v') + cur);
        }
      })
      .catch(function (e) { toast((lang === 'zh' ? '检查失败：' : 'Check failed: ') + (e && e.message || e)); })
      .then(function () { btn.disabled = false; btn.textContent = orig; });
  }

  function settingsCard(title, children) {
    return el('section', { class: 'set-card' },
      [el('div', { class: 'set-card-title', text: title })].concat(children));
  }

  var RELEASE_NOTES = [
    ['1.3.0', '2026-06-03', '移动端卡死修复 + 分支复盘闭环升级',
      'Mobile freeze fixes and branch review loop upgrades',
      ['修复大数据手机端卡死风险：存储用量不再同步 JSON.stringify 全部照片/附件，时间线和分支列表改为分段渲染，详情页图片预览限制首屏解码数量。',
       '键盘兜底滚动改为节流且非平滑，避免 Android 键盘事件连续触发时排队滚动、拖慢 WebView 主线程。',
       '分支支持复盘到期日、待复盘角标、未选择/待复盘/已到期/已复盘状态、决策把握和标签。',
       '分支页新增搜索、状态/标签筛选和洞察卡，可查看总数、待复盘、已复盘、平均评分、会重选率和预测命中率。',
       '新增分支详情页：选择、复盘、编辑、删除都进入二级页；复盘可逐条记录预测命中和实际结果。',
       '复盘后的分支可以生成一条时间线存档，并在分支与存档详情之间双向跳转。',
       'Android 打包同步更完整：Java MainActivity 包路径、string resources、Gradle appId/version 和 manifest 行为统一到 com.lifearchive.app。'],
      ['Fix mobile freeze risks: Settings no longer synchronously stringifies all photos/files, timeline and branch lists render in pages, and detail image previews limit first-pass decoding.',
       'Throttle keyboard visibility nudges and switch them away from smooth scrolling to avoid queued Android WebView scroll work.',
       'Branches now support review due dates, pending badges, unchosen/to-review/overdue/reviewed states, confidence, and tags.',
       'Add branch search, status/tag filters, and insight cards for totals, pending/reviewed counts, average rating, repeat rate, and prediction hit rate.',
       'Add a branch detail page: choice, review, edit, and delete live on the second-level page, with per-prediction actuals and hit tracking.',
       'Reviewed branches can create timeline commits, with two-way links between branch and commit details.',
       'Harden Android packaging by syncing MainActivity Java package, string resources, Gradle appId/version, and manifest behavior to com.lifearchive.app.']],
    ['1.2.3', '2026-06-03', '移动端版本同步 + 多图附件 + 分支决策增强',
      'Android version sync, multi-image attachments, and branch upgrades',
      ['修复 Android 原生工程里残留旧 appId/版本信息的风险，打包脚本会同步 appId、versionName、versionCode 和 www 资源。',
       '存档附件升级为「文件 / 图片」：单个存档可保存多个文件或图片，详情页会直接展示图片附件预览。',
       '存档号显示为明确的「存档号 okc08」，避免误以为是地点、标签或分类。',
       '分支决策支持 2 到 4 个选项，创建表单默认收起，可编辑已有分支，删除前需要确认。',
       'README 截图和说明重新生成，展示当前版本的分支页与多附件能力。'],
      ['Harden Android packaging by syncing appId, versionName, versionCode, and www assets.',
       'Upgrade attachments to files / images: one commit can keep multiple files or pictures, with image previews in details.',
       'Show short hashes as explicit archive IDs, e.g. "Archive ID okc08".',
       'Branches now support 2 to 4 options, a collapsed create form, editing, and delete confirmation.',
       'Refresh README screenshots and copy for the current branch and attachment experience.']],
    ['1.2.2', '2026-06-03', '桌面存档增强 + 移动端交互打磨',
      'Desktop archive upgrades + mobile interaction polish',
      ['桌面端「新建存档」从 tab 组中独立出来，固定为右侧单独按钮，移动端仍保留中间悬浮加号。',
       '新建存档支持真实文件附件存储，可保存作业、资料、报告等文件，并可在详情页下载。',
       '桌面端新增截取当前屏幕、拖拽图片、直接粘贴剪贴板图片，实时存档不再每次翻文件。',
       '再次修复移动端键盘：启用 Android 全屏键盘 workaround，并用键盘高度驱动页面底部空间。',
       '重做移动端加号、照片来源面板、筛选栏阴影和图标底色，整体更干净统一。'],
      ['Detach the desktop New commit action to its own right-side button while keeping the centered mobile FAB.',
       'Store real file attachments with commits and download them from the detail page.',
       'Add desktop screen capture, drag-and-drop images, and direct clipboard image paste for faster real-time commits.',
       'Harden the mobile keyboard fix with Android resizeOnFullScreen plus keyboard-height driven page spacing.',
       'Redesign the mobile FAB, photo-source sheet, filter-bar shadow, and icon background for a cleaner finish.']],
    ['1.2.1', '2026-06-03', '键盘根因修复 + 液态玻璃图标 + 侧滑返回与动效',
      'Root-cause keyboard fix, liquid-glass icon, back-swipe + page transitions',
      ['从根因修复安卓聚焦输入框顶飞整页：edge-to-edge 下系统会忽略 adjustResize，改用网页层 interactive-widget=resizes-content + 有界兜底。',
       '图标换回卡片堆造型并加入液态玻璃光影，配色更通透。',
       '底栏「新建」按钮去掉文字，改为悬浮玻璃「＋」。',
       '设置 / 更新日志 / 详情等二级页支持系统侧滑返回，并加入进入/返回的丝滑动效。'],
      ['Fix (at the root) the Android page being shoved off-screen on input focus — edge-to-edge ignores native adjustResize, so we now use the web-layer interactive-widget=resizes-content with a bounded safety net.',
       'Switch the icon back to the card-stack shape with a liquid-glass finish and a more luminous palette.',
       'Make the center create button an icon-only floating glass "+".',
       'Add system back-swipe for subpages (settings / release notes / detail) plus silky open/back transitions.']],
    ['1.2.0', '2026-06-03', '时间线搜索 + 照片存储升级 + 安卓键盘修复 + 全新档案图标',
      'Timeline search, IndexedDB photo storage, Android keyboard fix, and a new archive icon',
      ['时间线新增搜索框和场景筛选，存档多了也能快速找到。',
       '照片存储迁移到 IndexedDB，摆脱约 5MB 上限；旧数据首次启动自动迁移、不丢，设置里新增存储用量。',
       '彻底修复安卓聚焦输入框时整页被顶到看不见（改用系统 adjustResize）。',
       'App 图标与 Logo 重构成更有档案感的「归档文件夹」。'],
      ['Add timeline search and scene filters so commits stay easy to find.',
       'Move photo storage to IndexedDB (no more ~5MB cap); existing data migrates automatically, and Settings now shows storage used.',
       'Fix the Android page being pushed off-screen when focusing an input (now uses native adjustResize).',
       'Redesign the app icon and logo into an archive-folder mark.']],
    ['1.1.2', '2026-06-02', '移动端布局稳定 + 更新日志收纳 + 回滚整理 + 图标提亮',
      'Mobile layout stability, release notes, rollback cleanup, brighter icon',
      ['修复现实对比长描述撑宽页面的问题，底栏不再跟随横向滑动。',
       '设置内新增可折叠的更新日志二级页，支持系统侧滑返回设置。',
       '回滚入口改为左侧场景、右侧时间描述，旧存档更容易定位。',
       'App icon 保留卡片堆造型，整体换成更明亮的蓝紫配色。'],
      ['Prevent long Reality Diff labels from widening the page or shifting the tab bar.',
       'Add a collapsible release-notes subpage under Settings with system back navigation.',
       'Split Rollback selection into scene and time-description controls.',
       'Keep the card-stack icon while switching to a brighter blue-purple palette.']],
    ['1.1.1', '2026-06-02', '移动端交互焕新 + 安卓键盘原生修复',
      'Mobile interaction refresh and native Android keyboard fix',
      ['安卓键盘弹出时不再重排整个 WebView。', '底栏新增中央大号新建按钮，并统一应用内选择面板。'],
      ['Stop Android keyboard display from rearranging the whole WebView.', 'Add the central create button and unified in-app option sheets.']],
    ['1.1.0', '2026-06-02', '饭迹：饮食生活档案',
      'Meal archive',
      ['新增早餐、午餐、晚餐、夜宵和零食饮品场景。', '时间线显示每日餐数，AI 识别可自动填写餐次和食物。'],
      ['Add meal scenes for breakfast, lunch, dinner, late-night food, and snacks.', 'Show daily meal counts and let AI photo scan fill meal details.']],
    ['1.0.14', '2026-06-02', '相机 + 场景选择器重做 + AI 识别场景',
      'Camera, scene picker rebuild, and AI scene recognition',
      ['安卓支持直接拍照或从相册选择。', '场景选择器改成统一图标网格，AI 可自动选择场景。'],
      ['Support camera capture or gallery selection on Android.', 'Replace the scene picker with an icon grid and add AI scene selection.']],
    ['1.0.13', '2026-06-02', '顶栏粘性 + 时间线细节统一',
      'Sticky top bar and timeline polish',
      ['修复顶栏下滑时消失，恢复左侧蓝色时间线。', '移动端移除卡片右侧桌面专用指示符。'],
      ['Fix the top bar disappearing while scrolling and restore the blue timeline rail.', 'Remove the desktop-only card chevron on mobile.']],
    ['1.0.12', '2026-06-02', '详情页 + 时间线分栏 + 磨砂顶栏',
      'Details page, date groups, and frosted top bar',
      ['新增存档详情页，集中编辑、对比、回滚和删除。', '时间线按日期分栏，低频数据操作移入设置。'],
      ['Add a commit details page for edit, diff, rollback, and delete actions.', 'Group timeline entries by date and move low-frequency data actions into Settings.']],
    ['1.0.11', '2026-06-02', '体验修复：编辑存档 + 输入法 + 桌面对齐',
      'Editable commits, keyboard fixes, and desktop alignment',
      ['存档支持预填表单编辑。', '改善输入法弹出布局和桌面端导航对齐。'],
      ['Allow editing commits with a prefilled form.', 'Improve keyboard layout handling and desktop navigation alignment.']],
    ['1.0.10', '2026-06-02', '修复安卓云同步失败',
      'Fix Android cloud sync',
      ['仅让智谱 AI 请求走原生网络，保留 Supabase 登录令牌。'],
      ['Route only Zhipu AI requests through native networking so Supabase auth headers remain intact.']],
    ['1.0.9', '2026-06-02', '账号与云同步',
      'Accounts and cloud sync',
      ['新增 Supabase 邮箱注册、登录和多设备同步。'],
      ['Add Supabase email accounts and multi-device sync.']],
    ['1.0.8', '2026-06-02', '全面屏安全区 + 设置整合',
      'Safe-area support and consolidated settings',
      ['适配全面屏安全区，在设置内集中管理语言和主题。'],
      ['Support full-screen safe areas and consolidate language and theme controls in Settings.']],
    ['1.0.7', '2026-06-02', '设置页 + 固定签名 + 状态栏',
      'Settings, stable signing, and status bar',
      ['新增设置页、检查更新和固定 Android 签名。'],
      ['Add Settings, update checks, and stable Android signing.']],
    ['1.0.6', '2026-06-02', 'AI 拍照识别',
      'AI photo scan',
      ['用智谱 GLM-4V-Flash 从照片自动生成描述和物品清单。'],
      ['Use Zhipu GLM-4V-Flash to generate descriptions and item lists from photos.']],
    ['1.0.5', '2026-06-02', '状态栏 + 更新安装 + 新建简化',
      'Status bar, update installs, and simpler commits',
      ['简化新建存档，并改善状态栏与 Android 覆盖安装。'],
      ['Simplify new commits and improve status-bar handling and Android update installs.']],
    ['1.0.4', '2026-06-02', '安全区 + 扁平图标 + 新 Logo',
      'Safe areas, flat icons, and new logo',
      ['加入顶部安全区、统一扁平标签图标和卡片堆 Logo。'],
      ['Add top safe-area spacing, flat tab icons, and the card-stack logo.']],
    ['1.0.3', '2026-06-02', 'HyperOS 风格界面重做',
      'HyperOS-style UI rebuild',
      ['重做亮暗主题、卡片布局、移动端底栏和桌面导航。'],
      ['Rebuild light and dark themes, card layouts, the mobile tab bar, and desktop navigation.']],
    ['1.0.2', '2026-06-01', '移动端体验重做 + 彻底改名',
      'Mobile redesign and full rename',
      ['重做移动端底栏和触摸区域，统一更名为 Life Archive。'],
      ['Rebuild mobile tabs and touch targets, and rename the app to Life Archive.']],
    ['1.0.1', '2026-06-01', 'Life Archive 定名 + 安卓首发',
      'Life Archive rename and Android launch',
      ['正式定名 Life Archive，加入新图标和首个 Android APK。'],
      ['Rename the app to Life Archive, add the new icon, and ship the first Android APK.']],
    ['1.0.0', '2026-06-01', '首个发布版本',
      'Initial release',
      ['发布时间线、现实对比、回滚和分支决策四项核心能力。'],
      ['Ship Timeline, Reality Diff, Rollback, and Branch Decisions.']]
  ];

  function renderChangelog(v) {
    var L = lang === 'zh';
    var back = el('button', {
      type: 'button', class: 'subpage-back', text: '‹ ' + (L ? '设置' : 'Settings'),
      onclick: function () { window.history.back(); }
    });
    v.appendChild(el('div', { class: 'subpage-head' }, [
      back, el('h1', { text: L ? '更新日志' : 'Release notes' })
    ]));
    v.appendChild(el('p', { class: 'subpage-hint',
      text: L ? '点击版本即可展开或收起。系统侧滑返回也会回到设置。'
        : 'Tap a version to expand or collapse it. System back returns to Settings.' }));
    var list = el('div', { class: 'release-list' });
    RELEASE_NOTES.forEach(function (r, idx) {
      var notes = L ? r[4] : r[5];
      var details = el('details', { class: 'release-note' }, [
        el('summary', { class: 'release-summary' }, [
          el('span', { class: 'release-summary-main' }, [
            el('span', { class: 'release-version', text: 'v' + r[0] }),
            el('span', { class: 'release-title', text: L ? r[2] : r[3] }),
            el('span', { class: 'release-date', text: r[1] })
          ]),
          el('span', { class: 'release-chevron', text: '›' })
        ]),
        el('ul', { class: 'release-notes' }, notes.map(function (note) {
          return el('li', { text: note });
        }))
      ]);
      if (idx === 0) details.setAttribute('open', '');
      list.appendChild(details);
    });
    v.appendChild(list);
  }

  function segmented(options, currentVal, onPick) {
    return el('div', { class: 'seg' }, options.map(function (o) {
      var b = el('button', { class: 'seg-btn' + (o[0] === currentVal ? ' active' : ''), text: o[1] });
      b.addEventListener('click', function () { onPick(o[0]); });
      return b;
    }));
  }

  function accountCard() {
    var L = lang === 'zh';
    var title = L ? '账号与云同步' : 'Account & sync';

    // 1) not configured -> ask for Supabase project URL + anon key
    if (!Cloud.configured()) {
      var urlI = el('input', { class: 'field', type: 'text', placeholder: 'Supabase URL（https://xxx.supabase.co）' });
      var keyI = el('input', { class: 'field', type: 'text', placeholder: 'Supabase anon key' });
      var saveB = el('button', { class: 'btn primary tiny', text: L ? '保存配置' : 'Save' });
      saveB.addEventListener('click', function () {
        if (!urlI.value.trim() || !keyI.value.trim()) { toast(L ? '请填写 URL 和 anon key' : 'Fill both fields'); return; }
        Cloud.setCfg(urlI.value, keyI.value); toast(L ? '已保存配置' : 'Saved'); render();
      });
      return settingsCard(title, [
        el('p', { class: 'set-hint', text: L
          ? '用 Supabase 免费后端做多设备云同步。填入你的项目地址和 anon key（公开可用、可放心填）。'
          : 'Multi-device sync via Supabase (free). Paste your project URL + anon key (safe to embed).' }),
        urlI, keyI, el('div', { class: 'set-actions' }, [saveB])
      ]);
    }

    var reconf = el('button', { class: 'btn ghost tiny', text: L ? '重新配置' : 'Reconfigure' });
    reconf.addEventListener('click', function () {
      if (confirm(L ? '清除 Supabase 配置？' : 'Clear Supabase config?')) { Cloud.setCfg('', ''); render(); }
    });

    // 2) configured + signed in
    var u = Cloud.currentUser();
    if (u) {
      var syncB = el('button', { class: 'btn primary tiny', text: '☁ ' + (L ? '立即同步' : 'Sync now') });
      syncB.addEventListener('click', function () {
        syncB.disabled = true; var o = syncB.textContent; syncB.textContent = L ? '同步中…' : 'syncing…';
        cloudSync().then(function () { toast('☁ ' + (L ? '同步完成' : 'Synced')); render(); })
          .catch(function (e) { toast('⚠ ' + (L ? '同步失败：' : 'Sync failed: ') + (e && e.message || e)); })
          .then(function () { syncB.disabled = false; syncB.textContent = o; });
      });
      var outB = el('button', { class: 'btn ghost tiny', text: L ? '退出登录' : 'Log out' });
      outB.addEventListener('click', function () { Cloud.signOut().then(function () { toast(L ? '已退出' : 'Logged out'); render(); }); });
      return settingsCard(title, [
        el('div', { class: 'set-row' }, [
          el('span', { class: 'set-label', text: L ? '已登录' : 'Signed in' }),
          el('span', { class: 'set-value', text: u.email || u.id })
        ]),
        el('p', { class: 'set-hint', text: L
          ? '「立即同步」会把本机存档与云端合并，登录其他设备即可共享。'
          : 'Sync merges this device with the cloud; sign in elsewhere to share.' }),
        el('div', { class: 'set-actions' }, [syncB, outB, reconf])
      ]);
    }

    // 3) configured + signed out -> email/password
    var emailI = el('input', { class: 'field', type: 'email', placeholder: L ? '邮箱' : 'Email' });
    var pwI = el('input', { class: 'field', type: 'password', placeholder: L ? '密码（至少 6 位）' : 'Password (min 6)' });
    function doAuth(kind) {
      var fn = kind === 'up' ? Cloud.signUp.bind(Cloud) : Cloud.signIn.bind(Cloud);
      fn(emailI.value.trim(), pwI.value).then(function (r) {
        if (kind === 'up' && r && r.data && r.data.user && !r.data.session) {
          toast(L ? '注册成功，请到邮箱确认后再登录' : 'Sign-up ok — confirm via email, then log in'); render(); return;
        }
        toast(L ? '登录成功，正在同步…' : 'Signed in, syncing…');
        return cloudSync().then(function () { toast('☁ ' + (L ? '已同步' : 'Synced')); render(); });
      }).catch(function (e) { toast('⚠ ' + (e && e.message || e)); render(); });
    }
    var loginB = el('button', { class: 'btn primary tiny', text: L ? '登录' : 'Log in' });
    loginB.addEventListener('click', function () { doAuth('in'); });
    var regB = el('button', { class: 'btn tiny', text: L ? '注册' : 'Sign up' });
    regB.addEventListener('click', function () { doAuth('up'); });
    return settingsCard(title, [
      el('p', { class: 'set-hint', text: L ? '登录后即可多设备云同步。' : 'Log in to sync across devices.' }),
      emailI, pwI, el('div', { class: 'set-actions' }, [loginB, regB, reconf])
    ]);
  }

  function renderSettings(v) {
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: lang === 'zh' ? '设置' : 'Settings' })]));

    var updBtn = el('button', { class: 'btn', text: lang === 'zh' ? '检查更新' : 'Check for updates' });
    updBtn.addEventListener('click', function () { checkUpdate(updBtn); });
    var logsBtn = el('button', { class: 'set-menu-link',
      onclick: function () { go('changelog'); } }, [
      el('span', { text: lang === 'zh' ? '更新日志' : 'Release notes' }),
      el('span', { class: 'set-menu-chevron', text: '›' })
    ]);
    var about = settingsCard(lang === 'zh' ? '关于' : 'About', [
      el('div', { class: 'set-row' }, [
        el('span', { class: 'set-label', text: lang === 'zh' ? '当前版本' : 'Version' }),
        el('span', { class: 'set-value', text: 'v' + (window.APP_VERSION || '?') })
      ]),
      logsBtn,
      el('div', { class: 'set-actions' }, [updBtn])
    ]);

    var keyInput = el('input', { class: 'field', type: 'text',
      placeholder: lang === 'zh' ? '粘贴智谱 API Key' : 'Zhipu API Key', value: AI.getKey() });
    var saveKey = el('button', { class: 'btn primary tiny', text: lang === 'zh' ? '保存' : 'Save' });
    saveKey.addEventListener('click', function () { AI.setKey(keyInput.value); toast(lang === 'zh' ? '已保存' : 'Saved'); });
    var clrKey = el('button', { class: 'btn ghost tiny', text: lang === 'zh' ? '清除' : 'Clear' });
    clrKey.addEventListener('click', function () { AI.setKey(''); keyInput.value = ''; toast(lang === 'zh' ? '已清除' : 'Cleared'); });
    var ai = settingsCard(lang === 'zh' ? 'AI 拍照识别' : 'AI photo scan', [
      el('p', { class: 'set-hint', text: lang === 'zh'
        ? '免费：到 bigmodel.cn 注册领取 API Key（智谱 GLM-4V-Flash），仅保存在本机、不上传。'
        : 'Free: get a key at bigmodel.cn. Stored on this device only.' }),
      keyInput,
      el('div', { class: 'set-actions' }, [saveKey, clrKey])
    ]);

    var account = accountCard();

    var expBtn = el('button', { class: 'btn ghost tiny', text: lang === 'zh' ? '导出 JSON' : 'Export JSON' });
    expBtn.addEventListener('click', exportData);
    var clrBtn = el('button', { class: 'btn danger-ghost tiny', text: lang === 'zh' ? '清空全部' : 'Clear all' });
    clrBtn.addEventListener('click', clearAll);
    var onIdb = Store.backend() === 'indexeddb';
    var data = settingsCard(lang === 'zh' ? '数据' : 'Data', [
      el('div', { class: 'set-row' }, [
        el('span', { class: 'set-label', text: lang === 'zh' ? '存储用量' : 'Storage used' }),
        el('span', { class: 'set-value', text: fmtBytes(Store.usage()) + ' · ' + (onIdb ? 'IndexedDB' : (lang === 'zh' ? '本地' : 'localStorage')) })
      ]),
      el('p', { class: 'set-hint', text: lang === 'zh'
        ? (onIdb ? '照片现在存在 IndexedDB（容量随设备可用空间，通常数百 MB～数 GB），不再受旧版约 5MB 限制。'
                 : '当前回退到本地存储（约 5MB 上限），照片较多时可能存不下。')
        : (onIdb ? 'Photos are stored in IndexedDB (hundreds of MB to GBs) — no longer capped at the old ~5MB limit.'
                 : 'Falling back to localStorage (~5MB cap); many photos may not fit.') }),
      el('div', { class: 'set-actions' }, [expBtn, clrBtn])
    ]);

    var appearance = settingsCard(lang === 'zh' ? '外观与语言' : 'Appearance & language', [
      el('div', { class: 'set-row' }, [
        el('span', { class: 'set-label', text: lang === 'zh' ? '语言' : 'Language' }),
        segmented([['zh', '中文'], ['en', 'English']], lang, function (l) { setLang(l); })
      ]),
      el('div', { class: 'set-row' }, [
        el('span', { class: 'set-label', text: lang === 'zh' ? '主题' : 'Theme' }),
        segmented([
          ['system', lang === 'zh' ? '跟随系统' : 'System'],
          ['light', lang === 'zh' ? '浅色' : 'Light'],
          ['dark', lang === 'zh' ? '深色' : 'Dark']
        ], getTheme(), function (p) { setTheme(p); render(); })
      ])
    ]);

    v.appendChild(el('div', { class: 'settings-wrap' }, [appearance, about, ai, account, data]));
  }

  /* ---------------- theme (light/dark; follows system or manual override) ---------------- */
  var THEME_LS = 'lifearchive.theme';
  function getTheme() { return localStorage.getItem(THEME_LS) || 'system'; }
  function themeIsDark() {
    var p = getTheme();
    if (p === 'dark') return true;
    if (p === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function applyTheme() {
    var p = getTheme(), root = document.documentElement;
    if (p === 'light' || p === 'dark') root.setAttribute('data-theme', p);
    else root.removeAttribute('data-theme');
  }
  function setTheme(p) { localStorage.setItem(THEME_LS, p); applyTheme(); initNative(); }
  applyTheme();

  /* ---------------- native: safe-area insets + system bar colors ----------------
     @capacitor-community/safe-area reads the real window insets and injects
     --safe-area-inset-* CSS vars, so the top bar clears the status bar on every
     full-screen phone (the old edge-to-edge opt-out was ignored on HyperOS). */
  function initNative() {
    try {
      var Cap = window.Capacitor;
      if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
      var SA = Cap.Plugins && Cap.Plugins.SafeArea;
      if (!SA || !SA.enable) return;
      var dark = themeIsDark();
      SA.enable({ config: {
        customColorsForSystemBars: true,
        statusBarColor: '#00000000', statusBarContent: dark ? 'light' : 'dark',
        navigationBarColor: '#00000000', navigationBarContent: dark ? 'light' : 'dark'
      } }).catch(function () {});
    } catch (e) {}
  }
  try {
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function () { if (getTheme() === 'system') initNative(); });
  } catch (e) {}

  /* ---------------- native: keyboard (Android, edge-to-edge safe) ----------------
     ROOT CAUSE of the recurring "focusing an input shoves the whole page off-screen":
     this app is edge-to-edge (for @capacitor-community/safe-area insets), and Android
     IGNORES windowSoftInputMode adjustResize/adjustNothing in edge-to-edge mode — it
     falls back to adjustPan and pans the whole window (top bar and all) up behind the
     keyboard. So no native soft-input mode could fix it.

     Fix at the WEB layer: the viewport meta sets interactive-widget=resizes-content
     (index.html), so the IME shrinks the LAYOUT viewport — the page reflows, the sticky
     top bar stays put, and the browser keeps the focused field visible. @capacitor/keyboard
     is resize:'none' so it doesn't fight this. Here we only (1) hide the bottom tab bar and
     (2) as a safety net, nudge the focused field into the visual viewport — BOUNDED, via
     window.visualViewport (true CSS px), so it can NEVER fling the page off-screen. */
  function isTextField(n) { return !!(n && n.tagName && /^(INPUT|TEXTAREA)$/.test(n.tagName)); }
  // How many px the keyboard overlaps the content. If interactive-widget=resizes-content
  // took effect, the LAYOUT viewport shrank too (innerHeight ≈ visualViewport.height) so
  // this is ~0 and we must NOT scroll — the browser already keeps the field visible.
  // Only when the keyboard overlays (pan/overlay fallback) is this large, and we nudge.
  function kbOverlayPx() {
    var vv = window.visualViewport;
    return vv ? Math.max(0, window.innerHeight - vv.height) : 0;
  }
  function keyboardInsetPx() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue('--keyboard-inset') || '0';
    return parseFloat(raw) || 0;
  }
  function setKeyboardInset(px) {
    document.documentElement.style.setProperty('--keyboard-inset', Math.max(0, px || 0) + 'px');
  }
  var kbEnsureTimer = null;
  function scheduleEnsureFieldVisible(ms) {
    clearTimeout(kbEnsureTimer);
    kbEnsureTimer = setTimeout(ensureFieldVisible, ms || 60);
  }
  function ensureFieldVisible() {
    var vv = window.visualViewport, node = document.activeElement;
    if (!vv || !isTextField(node)) return;
    var inset = keyboardInsetPx();
    if (kbOverlayPx() < 120 && inset < 80) return;
    var r = node.getBoundingClientRect();
    var visibleBottom = Math.min(vv.offsetTop + vv.height, window.innerHeight - inset);
    var over = r.bottom - (visibleBottom - 16);
    if (over > 4) window.scrollBy({ top: Math.min(over, Math.max(0, r.top - 8)), behavior: 'auto' });
  }
  function initKeyboard() {
    var vv = window.visualViewport;
    if (vv) vv.addEventListener('resize', function () { scheduleEnsureFieldVisible(70); });
    document.addEventListener('focusin', function (e) {
      if (isTextField(e.target)) scheduleEnsureFieldVisible(120);
    });
    try {
      var Cap = window.Capacitor;
      if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
      var KB = Cap.Plugins && Cap.Plugins.Keyboard;
      if (!KB || !KB.addListener) return;
      var show = function (info) {
        document.body.classList.add('kb-open');
        setKeyboardInset(info && info.keyboardHeight ? info.keyboardHeight : kbOverlayPx());
        scheduleEnsureFieldVisible(80);
      };
      var hide = function () {
        document.body.classList.remove('kb-open');
        setKeyboardInset(0);
      };
      KB.addListener('keyboardWillShow', show);
      KB.addListener('keyboardDidShow', show);
      KB.addListener('keyboardWillHide', hide);
      KB.addListener('keyboardDidHide', hide);
    } catch (e) {}
  }

  /* ---------------- language ---------------- */
  function setLang(l) {
    if (l !== 'zh' && l !== 'en') return;
    lang = l;
    Store.setMeta({ lang: lang });
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh' : 'en');
    $('#tagline').textContent = t('tagline');
    var _brand = document.querySelector('.brand-name'); if (_brand) _brand.textContent = t('brand');
    renderNav(); render();
  }

  /* ---------------- native: Android hardware / gesture back ----------------
     Make the system back button + edge-swipe pop a subpage to its parent (instead of
     exiting or doing nothing). Needs @capacitor/app. go(parent) re-renders with the
     "pop" slide because the parent route has a lower depth. */
  function initBackButton() {
    var Cap = window.Capacitor;
    if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
    var App = Cap.Plugins && Cap.Plugins.App;
    if (!App || !App.addListener) return;
    var PARENT = { settings: 'timeline', changelog: 'settings', detail: 'timeline', 'branch-detail': 'branch',
      commit: 'timeline', diff: 'timeline', rollback: 'timeline', branch: 'timeline' };
    App.addListener('backButton', function () {
      if (current !== 'timeline' && PARENT[current]) go(PARENT[current]);
      else App.exitApp();
    });
  }

  /* ---------------- boot ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('#tagline').textContent = t('tagline');
    var _brand = document.querySelector('.brand-name'); if (_brand) _brand.textContent = t('brand');
    var _set = document.getElementById('settings-btn');
    if (_set) _set.addEventListener('click', function () { go('settings'); });
    initNative();
    initKeyboard();
    initBackButton();
    var r = location.hash.slice(1);
    if (routes.indexOf(r) >= 0) current = r;
    renderNav();
    // Hydrate the store (IndexedDB) before the first content render.
    Store.init().then(function () {
      render();
      if (Cloud.configured()) Cloud.refreshUser().then(function () { if (current === 'settings') render(); });
    });
  });
})();
