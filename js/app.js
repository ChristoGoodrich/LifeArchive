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
      archive_time: '存档时间',
      items: '物品 / 清单', notes: '备注', files: '文件 / 图片',
      add_item: '+ 添加一项', item_name: '物品名', item_qty: '数量',
      save_commit: '存档', cancel: '取消',
      commit_placeholder: '例如：出门去学校前，带电脑和充电器',
      latest: '最新', base: '旧版本 (base)', compare: '新版本 (compare)',
      run_diff: '对比', changed: '画面变化', heat_hint: '变化最明显的区域',
      added: '多了', removed: '少了', changed_qty: '数量变化', kept: '保持不变',
      no_change: '两个版本几乎一致 👍',
      rollback_pick: '选择要恢复到的存档', rollback_version: '时间描述', rollback_steps: '恢复步骤',
      rollback_intro: '按下面的步骤，把现状恢复到这个存档：',
      rollback_target_state: '目标状态', rollback_current_state: '当前状态',
      rollback_diff_summary: '恢复差异', rollback_no_steps: '当前已经和目标存档一致，可以直接确认或生成一条恢复存档。',
      rollback_create_commit: '生成恢复存档', rollback_commit_created: '已生成恢复存档',
      rollback_reset_progress: '重置进度', rollback_progress_saved: '回滚进度已保存',
      rollback_resume: '已恢复上次进度',
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
      group_meal: '饮食', group_item: '物品', group_ticket: '票据', meals_count: '餐',
      stats_title: '存档热力图', stats_open: '存档热力图 / 日历',
      stats_total: '总存档', stats_active_days: '活跃天数', stats_streak: '连续天数',
      stats_busiest: '单日最多', stats_legend_less: '少', stats_legend_more: '多',
      stats_empty: '还没有存档，先去记录第一笔吧。', stats_archives_unit: '个存档',
      stats_starred: '星标存档', stats_no_starred: '这天没有星标存档', stats_pick_month: '切换月份 / 年份',
      stats_range_year: '近一年', stats_range_6m: '近半年', stats_range_3m: '近三月',
      stats_weekday: ['日', '一', '二', '三', '四', '五', '六'],
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
      load_more: '加载更多', open_detail: '查看详情',
      star: '标记重要', unstar: '取消标记', starred_filter: '重要',
      star_added: '已标记为重要', star_removed: '已取消标记',
      detail_star: '☆ 标记重要', detail_starred: '★ 已标记重要',
      planned_save: '预存档', planned_badge: '预存档', planned_section: '预存档',
      planned_section_sub: '还没真正发生 · 存档后会转为正式存档',
      planned_saved: '已存为预存档，完成后记得标记', planned_empty: '没有匹配的预存档',
      mark_done: '存档', mark_done_full: '✅ 标记为已完成（转为正式存档）',
      planned_done: '已完成 · 已转为正式存档', planned_tag: '📌 这是一条预存档',
      replicate: '照着再记一笔', replicate_now: '立即记一笔',
      replicate_meal_hint: '饮食记录无需回滚。你可以照着这一餐，快速再记一笔，或先存一条预存档（想吃／要点的），真正吃到后再标记完成。',
      replicate_item_hint: '也可以照着这个版本，把要补齐的东西先存成一条预存档，备齐后再标记完成。',
      pick_multi: '选择多张图片', album_multi: '从相册选择多张', photos_added: '已添加 {n} 张图片'
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
      archive_time: 'Archive time',
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
      rollback_target_state: 'Target state', rollback_current_state: 'Current state',
      rollback_diff_summary: 'Restore diff', rollback_no_steps: 'Current state already matches the target. Confirm it or create a restore commit.',
      rollback_create_commit: 'Create restore commit', rollback_commit_created: 'Restore commit created',
      rollback_reset_progress: 'Reset progress', rollback_progress_saved: 'Rollback progress saved',
      rollback_resume: 'Previous progress restored',
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
      group_meal: 'Meals', group_item: 'Things', group_ticket: 'Tickets', meals_count: 'meals',
      stats_title: 'Archive heatmap', stats_open: 'Archive heatmap / calendar',
      stats_total: 'Archives', stats_active_days: 'Active days', stats_streak: 'Streak',
      stats_busiest: 'Busiest day', stats_legend_less: 'Less', stats_legend_more: 'More',
      stats_empty: 'No archives yet — go log your first one.', stats_archives_unit: 'archives',
      stats_starred: 'Starred', stats_no_starred: 'No starred archives this day', stats_pick_month: 'Pick month / year',
      stats_range_year: '1 year', stats_range_6m: '6 months', stats_range_3m: '3 months',
      stats_weekday: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
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
      load_more: 'Load more', open_detail: 'Open detail',
      star: 'Star', unstar: 'Unstar', starred_filter: 'Starred',
      star_added: 'Marked important', star_removed: 'Unmarked',
      detail_star: '☆ Star', detail_starred: '★ Starred',
      planned_save: 'Pre-save', planned_badge: 'Draft', planned_section: 'Drafts',
      planned_section_sub: 'Not yet — archive it to turn into a real commit',
      planned_saved: 'Saved as a draft — mark it done later', planned_empty: 'No matching drafts',
      mark_done: 'Archive', mark_done_full: '✅ Mark as done (turn into a real commit)',
      planned_done: 'Done · archived', planned_tag: '📌 This is a draft (pre-saved)',
      replicate: 'Log it again', replicate_now: 'Log now',
      replicate_meal_hint: 'Meals don’t need a rollback. Log this one again, or save it as a plan (what you want / will order) and mark it done once you actually have it.',
      replicate_item_hint: 'You can also save this version as a plan for what to restock, then mark it done once everything is back.',
      pick_multi: 'Pick multiple images', album_multi: 'Pick multiple from album', photos_added: 'Added {n} image(s)'
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
  function datetimeLocalValue(ts) {
    var d = new Date(ts || Date.now());
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function parseDatetimeLocal(value, fallback) {
    var m = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (!m) return fallback || Date.now();
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), 0, 0);
    return isNaN(d.getTime()) ? (fallback || Date.now()) : d.getTime();
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
  function imageFiles(c) {
    return (c && c.files || []).filter(isImageFile);
  }
  function commitImageEntries(c) {
    var out = [];
    if (!c) return out;
    if (c.photo) out.push({ data: c.photo, name: c.message || 'cover.jpg',
      w: c.photoW || null, h: c.photoH || null, cover: true });
    imageFiles(c).forEach(function (f) {
      out.push({ data: f.data, name: f.name || 'image.jpg', w: f.w || null, h: f.h || null, file: f });
    });
    return out;
  }
  // Pixel size of whatever image commitThumbSrc shows, so timeline/detail can reserve its
  // box (no decode-time "pop"). Cover photo first; else the first image attachment (e.g. a
  // multi-photo archive whose cover was removed). Legacy commits without stored dims → null.
  function commitCoverDims(c) {
    if (c.photo) return (c.photoW && c.photoH) ? { w: c.photoW, h: c.photoH } : null;
    var img = firstImageFile(c.files);
    return (img && img.w && img.h) ? { w: img.w, h: img.h } : null;
  }
  function timelineMediaAttrs(dims) {
    var attrs = { class: 'commit-media' };
    if (dims && dims.w && dims.h && dims.h / dims.w > 1.35) {
      // Timeline previews are intentionally compact for tall screenshots/long photos;
      // detail view still shows the original aspect ratio.
      attrs.class += ' is-clamped';
      attrs.style = '--media-ratio:' + dims.w + '/' + Math.round(dims.w * 1.28);
    }
    return attrs;
  }
  function cloneItems(items) {
    return (items || []).map(function (it) { return { name: it.name, qty: it.qty || 1 }; });
  }
  function cloneFiles(files) {
    return (files || []).map(function (f) {
      var copy = {};
      for (var k in f) { if (f.hasOwnProperty(k)) copy[k] = f[k]; }
      copy.id = Store.uid('f');
      return copy;
    });
  }
  function notPlanned(c) { return !c.planned; }
  // real (non-planned) commits in a scene, newest first — used by diff / rollback so
  // a not-yet-happened 计划 never shows up as a comparable/rollbackable version.
  function realCommitsForScene(id) { return Store.commitsForScene(id).filter(notPlanned); }
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
  // Resolves { data, w, h } — the downscaled JPEG dataURL plus its final pixel size.
  // Reporting w/h here means every add path (camera, gallery multi-pick, paste, drag,
  // screenshot) knows the cover/thumbnail dimensions up-front, so timeline cards can
  // reserve the image box without waiting on a preview <img> onload (no decode-time "pop").
  function downscaleSrc(src, maxW, quality) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var w = img.width, h = img.height, mw = maxW || PHOTO_MAX;
        if (w > mw) { h = Math.round(h * mw / w); w = mw; }
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve({ data: c.toDataURL('image/jpeg', quality || PHOTO_Q), w: w, h: h });
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
    },
    _b64: function (u) { return u && u.indexOf(',') > -1 ? u.split(',')[1] : u; },
    _chat: function (content) {
      var key = this.getKey();
      if (!key) return Promise.reject(new Error('NO_KEY'));
      var body = { model: this.MODEL, temperature: 0.2, messages: [{ role: 'user', content: content }] };
      return apiPost(this.ENDPOINT, { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }, body).then(function (j) {
        if (!j) throw new Error('无返回');
        if (j.error) throw new Error(j.error.message || JSON.stringify(j.error));
        var txt = (((j.choices || [])[0] || {}).message || {}).content || '';
        var m = txt.match(/\{[\s\S]*\}/);
        if (!m) throw new Error('返回无法解析：' + txt.slice(0, 80));
        return JSON.parse(m[0]);
      });
    },
    // Phase 3 — send BOTH photos (旧版 + 新版) and get a natural-language reading of what
    // changed, plus structured added / removed / moved lists.
    analyzeDiff: function (baseUrl, compUrl) {
      return this._chat([
        { type: 'image_url', image_url: { url: this._b64(baseUrl) } },
        { type: 'image_url', image_url: { url: this._b64(compUrl) } },
        { type: 'text', text: '这是同一个场景的两张照片：第一张是【旧版/之前】，第二张是【新版/之后】。对比两张图，找出发生了什么变化。严格只返回 JSON，不要解释、不要 markdown。格式：{"summary":"一句话中文总结变化，30字内，例如：书桌上少了水杯，多了一本书，台灯挪到了右侧","added":["新增/多出来的物品"],"removed":["消失/少了的物品"],"moved":["位置发生移动的物品"]}。数组里只放物品名，没有变化就给空数组。' }
      ]).then(function (r) {
        return { summary: r.summary || '', added: r.added || [], removed: r.removed || [], moved: r.moved || [] };
      });
    },
    // Phase 4 (饮食专属，可选) — rough calorie / nutrition estimate from a food-name list.
    nutrition: function (foods) {
      return this._chat([
        { type: 'text', text: '估算这一餐的总热量和营养，食物清单：' + foods.join('、') + '。严格只返回 JSON，不要解释：{"kcal":整数总热量大卡,"note":"一句话营养点评，25字内"}。' }
      ]).then(function (r) { return { kcal: parseInt(r.kcal, 10) || 0, note: r.note || '' }; });
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
    a = a || {}; b = b || {};
    function stamp(it) { return (it && (it.updatedAt || it.createdAt)) || 0; }
    // Merge deletion tombstones: id -> latest deletedAt across both sides. A delete on any
    // device thus propagates to all, instead of the cloud copy resurrecting it on the next sync.
    var tombs = {};
    function addTombs(map) {
      if (!map) return;
      Object.keys(map).forEach(function (id) {
        var v = map[id] || 0; if (!tombs[id] || v > tombs[id]) tombs[id] = v;
      });
    }
    addTombs(a.tombstones); addTombs(b.tombstones);
    // Union by id; on conflict keep the most recently modified copy (updatedAt, falling
    // back to createdAt). This stops a stale remote record from clobbering a fresh local
    // edit/star — and vice-versa across devices — without losing either side's new rows.
    // Then drop any record a tombstone marks deleted at/after its last change (an edit made
    // AFTER the delete has a larger stamp and survives — deliberate "edit beats stale delete").
    function union(x, y) {
      var m = {};
      function add(it) { if (it && it.id && (!m[it.id] || stamp(it) >= stamp(m[it.id]))) m[it.id] = it; }
      (x || []).forEach(add); (y || []).forEach(add);
      return Object.keys(m).filter(function (id) {
        var d = tombs[id] || 0; return !(d && d >= stamp(m[id]));
      }).map(function (id) { return m[id]; });
    }
    return { commits: union(a.commits, b.commits), branches: union(a.branches, b.branches),
             tombstones: tombs };
  }

  function cloudSync() {
    var local = Store.exportRaw();
    return Cloud.pull().then(function (remote) {
      var merged = mergeData(local, remote);
      Store.replaceAll(merged);
      return Cloud.push(merged).then(function () { return merged; });
    });
  }

  /* Auto-sync: fire-and-forget cloud sync after the user mutates an archive (new
     commit / edit / star), if cloud is configured + signed in + online. Debounced so
     rapid changes coalesce into one round-trip. Only the explicit "new archive" path
     surfaces a toast; background syncs stay quiet (manual sync is always available). */
  var _autoSyncTimer = null;
  function autoSync(showToast) {
    if (!Cloud.configured() || !Cloud.currentUser()) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      if (showToast) toast('⚠ ' + (lang === 'zh' ? '离线，已存本地，联网后可同步' : 'Offline — saved locally'));
      return;
    }
    clearTimeout(_autoSyncTimer);
    _autoSyncTimer = setTimeout(function () {
      cloudSync().then(function () {
        if (showToast) toast('☁ ' + (lang === 'zh' ? '已自动同步到云端' : 'Auto-synced to cloud'));
      }).catch(function () {
        if (showToast) toast('⚠ ' + (lang === 'zh' ? '自动同步失败，可稍后手动同步' : 'Auto-sync failed — try manual sync'));
      });
    }, 1000);
  }

  /* ---------------- routing ---------------- */
  var routes = ['timeline', 'commit', 'diff', 'rollback', 'branch', 'branch-detail', 'settings', 'changelog', 'detail', 'stats'];
  var current = 'timeline';
  // Bottom-nav routes are real peer tabs. Switching among them replaces the current
  // browser history entry, so Android edge-back does not treat Timeline as their parent.
  var TAB_ROUTES = ['timeline', 'diff', 'commit', 'rollback', 'branch'];
  function isTabRoute(route) { return TAB_ROUTES.indexOf(route) >= 0; }
  // nav depth drives page animation (tabs fade; subpages push/pop)
  var ROUTE_DEPTH = { timeline: 0, diff: 0, commit: 0, rollback: 0, branch: 0, 'branch-detail': 1, detail: 1, settings: 1, changelog: 2, stats: 1 };
  var prevDepth = 0;
  // Subpage return stack for hardware/gesture back. Tabs never go here; they are peers.
  var navStack = [];
  var NAV_STACK_MAX = 16;
  var routeWriteLock = false;

  function writeRouteHash(route, replace) {
    var hash = '#' + route;
    if (location.hash === hash) return;
    routeWriteLock = true;
    if (replace && window.history && window.history.replaceState) {
      window.history.replaceState({ route: route }, '', hash);
    } else if (window.history && window.history.pushState) {
      window.history.pushState({ route: route }, '', hash);
    } else {
      location.hash = route;
    }
    routeWriteLock = false;
  }

  function go(route, viaBack) {
    if (route === current) return;          // already here — don't re-push or re-render
    closePopover();
    var toTab = isTabRoute(route);
    if (!viaBack && toTab) {
      navStack = [];
    } else if (!viaBack && !isTabRoute(route) && navStack[navStack.length - 1] !== current) {
      navStack.push(current);
      if (navStack.length > NAV_STACK_MAX) navStack.shift();
    }
    current = route;
    writeRouteHash(route, viaBack || toTab);
    renderNav();
    render();
  }

  // Pop history until we reach a route we're not already on. Returns false when there's
  // nothing to go back to (so the caller can exit the app). Drives the Android back button.
  function goBack() {
    if (isTabRoute(current)) return false;
    while (navStack.length) {
      var prev = navStack.pop();
      if (prev !== current) { go(prev, true); return true; }
    }
    return false;
  }

  function syncRouteFromLocation() {
    if (routeWriteLock) return;
    var r = location.hash.slice(1);
    if (routes.indexOf(r) >= 0 && r !== current) {
      current = r;
      if (isTabRoute(r)) navStack = [];
      renderNav();
      render();
    }
  }
  window.addEventListener('hashchange', syncRouteFromLocation);
  window.addEventListener('popstate', syncRouteFromLocation);

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
      snack: s('<path d="M7 8h10l-1 11a2 2 0 0 1-2 1.8H10A2 2 0 0 1 8 19z"/><path d="M6 8h12"/><path d="M14 8 16 3"/>'),
      /* 票据 / 票根 */
      ticket: s('<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5v2a1.8 1.8 0 0 0 0 3.4v2A1.5 1.5 0 0 1 18.5 17h-13A1.5 1.5 0 0 1 4 15.5v-2a1.8 1.8 0 0 0 0-3.4z"/><path d="M14 7v10" stroke-dasharray="1.6 2"/>'),
      receipt: s('<path d="M6 3.5h12v17l-2.2-1.5-2 1.5-1.8-1.5-1.8 1.5-2-1.5L6 20.5z"/><path d="M9 8h6M9 11.5h6M9 15h4"/>'),
      invoice: s('<path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><path d="M13 3v6h6"/><path d="M9 13h6M9 16.5h4"/>')
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
    v.classList.remove('view-commit');
    v.classList.toggle('view-commit', current === 'commit');
    if (current === 'timeline') renderTimeline(v);
    else if (current === 'commit') renderCommitForm(v);
    else if (current === 'diff') renderDiff(v);
    else if (current === 'rollback') renderRollback(v);
    else if (current === 'branch') renderBranch(v);
    else if (current === 'branch-detail') renderBranchDetail(v);
    else if (current === 'settings') renderSettings(v);
    else if (current === 'changelog') renderChangelog(v);
    else if (current === 'stats') renderStats(v);
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
  var tlStarOnly = false; // when true, show only starred (important) commits
  var TL_PAGE_SIZE = 24;
  var tlVisible = TL_PAGE_SIZE;
  var tlRerender = null;       // set to the current renderList() so card actions can refresh it
  var tlRerenderChips = null;  // set to renderChips() so starring a card can reveal the filter

  // a single star glyph; CSS fills it gold when the card/commit is starred
  function starSVG() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 17.6l-5.2 2.81.99-5.79-4.21-4.1 5.82-.85z"/></svg>';
  }

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
            onclick: function () { seedDemo(); renderNav(); render(); } })
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
    function starChip() {
      var ic = el('span', { class: 'tl-chip-star-ic' }); ic.innerHTML = starSVG();
      var b = el('button', { type: 'button', class: 'tl-chip tl-chip-star' + (tlStarOnly ? ' active' : '') },
        [ic, el('span', { text: t('starred_filter') })]);
      b.addEventListener('click', function () {
        tlStarOnly = !tlStarOnly; tlVisible = TL_PAGE_SIZE; renderChips(); renderList();
      });
      return b;
    }
    function renderChips() {
      chipsRow.innerHTML = '';
      // only surface the "important" filter once something is starred (keeps it clean)
      if (tlStarOnly || commits.some(function (c) { return c.starred; })) chipsRow.appendChild(starChip());
      chipsRow.appendChild(chipBtn(null, lang === 'zh' ? '全部' : 'All', false));
      scenesPresent.forEach(function (id) { chipsRow.appendChild(chipBtn(id, sceneName(Store.sceneById(id)), true)); });
    }
    renderChips();

    v.appendChild(el('div', { class: 'tl-search' }, [searchInput, chipsRow]));

    var listWrap = el('div', { class: 'tl-list' });
    v.appendChild(listWrap);

    function renderList() {
      listWrap.innerHTML = '';
      var matched = commits.filter(function (c) {
        return (!tlStarOnly || c.starred) && (tlScene === null || c.scene === tlScene) && commitMatches(c, tlQuery);
      });
      var plannedList = matched.filter(function (c) { return c.planned; });
      var realList = matched.filter(notPlanned);
      if (!matched.length) {
        listWrap.appendChild(el('div', { class: 'tl-empty' }, [
          el('div', { class: 'tl-empty-ic', text: tlStarOnly ? '⭐' : '🔍' }),
          el('div', { text: tlStarOnly ? (lang === 'zh' ? '还没有标记重要的存档' : 'No starred commits yet')
            : (lang === 'zh' ? '没有匹配的存档' : 'No matching commits') })
        ]));
        return;
      }

      // ---- 计划中 (planned drafts) float to the top, like a to-do list ----
      if (plannedList.length) {
        var psec = el('section', { class: 'planned-group' });
        psec.appendChild(el('div', { class: 'planned-head' }, [
          el('span', { class: 'planned-head-title', text: '📌 ' + t('planned_section') + ' · ' + plannedList.length }),
          el('span', { class: 'planned-head-sub', text: t('planned_section_sub') })
        ]));
        var prail = el('div', { class: 'planned-rail' });
        plannedList.forEach(function (c) { prail.appendChild(commitCard(c)); });
        psec.appendChild(prail);
        listWrap.appendChild(psec);
      }

      // ---- real commits, grouped by day, newest first ----
      var shown = realList.slice(0, tlVisible);
      var groups = [], map = {};
      shown.forEach(function (c) {
        var k = dayKey(c.createdAt);
        if (!map[k]) { map[k] = { label: dayLabel(c.createdAt), items: [] }; groups.push(map[k]); }
        map[k].items.push(c);
      });
      var stream = el('div', { class: 'timeline-stream' });
      groups.forEach(function (g) {
        var sec = el('section', { class: 'date-group' });
        var mealCount = g.items.filter(function (c) { return Store.isMealScene(c.scene); }).length;
        var headRight = [el('span', { class: 'date-count', text: g.items.length + ' ' + t('commits_in') })];
        if (mealCount > 0) {
          headRight.unshift(el('span', { class: 'date-meals', text: '🍽 ' + mealCount + ' ' + t('meals_count') }));
        }
        sec.appendChild(el('div', { class: 'date-head' }, [
          el('span', { class: 'date-pill date-label', text: g.label }),
          el('span', { class: 'date-pill date-head-right' }, headRight)
        ]));
        var rail = el('div', { class: 'commit-rail' });
        g.items.forEach(function (c) { rail.appendChild(commitCard(c)); });
        sec.appendChild(rail);
        stream.appendChild(sec);
      });
      if (groups.length) listWrap.appendChild(stream);
      if (realList.length > shown.length) {
        listWrap.appendChild(el('button', { class: 'btn ghost load-more', text: t('load_more') + ' · ' + shown.length + ' / ' + realList.length,
          onclick: function () { tlVisible += TL_PAGE_SIZE; renderList(); } }));
      }
    }
    tlRerender = renderList;
    tlRerenderChips = renderChips;
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

    // quick star toggle. stopPropagation so it never opens the detail page. It rides
    // the photo corner when there's an image, or the card corner otherwise.
    var starBtn = el('button', { type: 'button', class: 'star-btn' + (c.starred ? ' starred' : ''),
      'aria-label': c.starred ? t('unstar') : t('star'), title: c.starred ? t('unstar') : t('star') });
    starBtn.innerHTML = starSVG();
    starBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var now = Store.toggleStar(c.id); c.starred = now;
      starBtn.classList.toggle('starred', now);
      card.classList.toggle('is-starred', now);
      starBtn.setAttribute('aria-label', now ? t('unstar') : t('star'));
      starBtn.title = now ? t('unstar') : t('star');
      toast(now ? ('⭐ ' + t('star_added')) : t('star_removed'));
      autoSync(false);
      if (tlRerenderChips) tlRerenderChips();             // reveal/hide the "important" filter
      if (tlStarOnly && !now && tlRerender) tlRerender(); // drop it from the starred-only view
    });

    // photo-first: a real <img> at its natural aspect ratio (no cropping), so cards
    // grow to fit each picture and the timeline reads as a vertical waterfall.
    var media = null, thumbStrip = null;
    if (thumbSrc) {
      var imageEntries = commitImageEntries(c);
      if (!imageEntries.length) imageEntries = [{ data: thumbSrc, name: c.message || '' }];
      var coverDims = commitCoverDims(c);
      var img = el('img', { class: 'commit-img', src: thumbSrc, alt: c.message || '',
        loading: 'lazy', decoding: 'async' });
      // reserve the image's box from its stored pixel size so the card doesn't grow/“放大”
      // when a freshly added photo finishes decoding (CSS keeps width:100%;height:auto).
      // commitCoverDims covers multi-photo archives too (incl. cover-removed → file image).
      if (coverDims) { img.setAttribute('width', coverDims.w); img.setAttribute('height', coverDims.h); }
      media = el('div', timelineMediaAttrs(coverDims), [img, starBtn]);
      if (imageEntries.length > 1) {
        media.appendChild(el('span', { class: 'commit-img-count', text: '🖼 ' + imageEntries.length }));
      }

      // multi-photo: a horizontal thumbnail strip UNDER the cover shows the extra images
      // right on the timeline (cover first, extras after). Tapping anywhere still opens the
      // full gallery in the detail page.
      var extras = imageEntries.slice(1);
      if (extras.length) {
        thumbStrip = el('div', { class: 'commit-thumbs' });
        var MAXT = 8;
        extras.slice(0, MAXT).forEach(function (entry) {
          var thumbAttrs = { class: 'commit-thumb-img', src: entry.data, alt: '',
            loading: 'lazy', decoding: 'async' };
          if (entry.w && entry.h) { thumbAttrs.width = entry.w; thumbAttrs.height = entry.h; }
          thumbStrip.appendChild(el('div', { class: 'commit-thumb' }, [
            el('img', thumbAttrs)
          ]));
        });
        if (extras.length > MAXT) {
          thumbStrip.appendChild(el('div', { class: 'commit-thumb commit-thumb-more-tile',
            text: '+' + (extras.length - MAXT) }));
        }
      }
    }

    var subKids = [
      sceneTag(Store.sceneById(c.scene)),
      el('span', { class: 'commit-dot', text: '·' }),
      el('span', { text: fmtTime(c.createdAt) }),
      el('span', { class: 'commit-dot', text: '·' }),
      el('span', { text: (c.items ? c.items.length : 0) + ' ' + t('items_count') })
    ];
    if (c.files && c.files.length) {
      subKids.push(el('span', { class: 'commit-dot', text: '·' }));
      subKids.push(el('span', { class: 'commit-files', text: '📎 ' + c.files.length }));
    }

    var titleRow = el('div', { class: 'commit-title-row' }, [
      el('div', { class: 'commit-msg', text: c.message || '(no message)' }),
      c.planned ? el('span', { class: 'commit-plan-pill', text: '📌 ' + t('planned_badge') }) : null
    ]);

    var chips = el('div', { class: 'commit-chips' });
    if (isRoot && !c.planned) chips.appendChild(el('span', { class: 'chip root', text: t('root') }));
    if (c.fromBranchId) chips.appendChild(el('span', { class: 'chip branch-link', text: t('from_branch') + ' ' + shortId(c.fromBranchId) }));
    if (c.rollbackTargetId) chips.appendChild(el('span', { class: 'chip rollback-link',
      text: (lang === 'zh' ? '回滚自 ' : 'Restored from ') + shortId(c.rollbackTargetId) }));
    (c.items || []).slice(0, 6).forEach(function (it) {
      chips.appendChild(el('span', { class: 'chip',
        text: it.name + (it.qty > 1 ? ' ×' + it.qty : '') }));
    });
    if ((c.items || []).length > 6) {
      chips.appendChild(el('span', { class: 'chip more', text: '+' + (c.items.length - 6) }));
    }

    var bodyKids = [titleRow, el('div', { class: 'commit-sub' }, subKids), chips,
      c.notes ? el('div', { class: 'commit-notes', text: c.notes }) : null];

    // a planned draft carries a quick "✅ 完成" footer so it can be fulfilled right
    // from the timeline — it then drops into the real date timeline at "now".
    if (c.planned) {
      var doneBtn = el('button', { type: 'button', class: 'commit-done-btn', text: '✅ ' + t('mark_done') });
      doneBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        Store.fulfillCommit(c.id);
        toast('✅ ' + t('planned_done'));
        autoSync(false);
        render(); // full re-render so it leaves 计划中 and re-sorts into today's group
      });
      bodyKids.push(doneBtn);
    }

    var body = el('div', { class: 'commit-body' }, bodyKids);
    var cardKids;
    if (media) { cardKids = [media]; if (thumbStrip) cardKids.push(thumbStrip); cardKids.push(body); }
    else { cardKids = [body, starBtn]; }
    var card = el('div', { class: 'commit-card tappable'
      + (c.starred ? ' is-starred' : '') + (c.planned ? ' is-planned' : '') + (media ? '' : ' no-media') }, cardKids);
    card.addEventListener('click', function () { pendingDetail = c.id; go('detail'); });
    return card;
  }

  /* ---------------- Commit detail ---------------- */
  var pendingDetail = null;
  function previousCommitFor(c) {
    return c && c.parentId ? Store.getCommit(c.parentId) : null;
  }
  function renderDetail(v) {
    var c = pendingDetail ? Store.getCommit(pendingDetail) : null;
    if (!c) { go('timeline'); return; }
    var L = lang === 'zh';

    var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (L ? '返回' : 'Back') });
    back.addEventListener('click', function () { if (!goBack()) go('timeline'); });
    var starToggle = el('button', { class: 'btn tiny star-toggle' + (c.starred ? ' starred' : ''),
      text: c.starred ? t('detail_starred') : t('detail_star') });
    starToggle.addEventListener('click', function () {
      c.starred = Store.toggleStar(c.id);
      starToggle.textContent = c.starred ? t('detail_starred') : t('detail_star');
      starToggle.classList.toggle('starred', c.starred);
      toast(c.starred ? ('⭐ ' + t('star_added')) : t('star_removed'));
      autoSync(false);
    });
    v.appendChild(el('div', { class: 'view-head' }, [back, starToggle]));

    var card = el('div', { class: 'detail-card' + (c.planned ? ' is-planned' : '') });
    if (c.planned) card.appendChild(el('div', { class: 'detail-plan-banner', text: t('planned_tag') }));
    // photo at its natural aspect ratio (no cropping), matching the timeline cards
    if (c.photo) {
      var detailPhoto = el('img', { class: 'detail-photo', src: c.photo, alt: c.message || '', decoding: 'async' });
      if (c.photoW && c.photoH) { detailPhoto.setAttribute('width', c.photoW); detailPhoto.setAttribute('height', c.photoH); }
      card.appendChild(detailPhoto);
    }
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
    if (c.rollbackTargetId) {
      var linkedTarget = Store.getCommit(c.rollbackTargetId);
      card.appendChild(el('div', { class: 'detail-section-title', text: L ? '回滚来源' : 'Restore source' }));
      card.appendChild(el('button', { class: 'btn ghost detail-link-btn',
        text: '↩︎ ' + (linkedTarget ? (linkedTarget.message || shortId(linkedTarget.id)) : shortId(c.rollbackTargetId)),
        onclick: function () { if (linkedTarget) { pendingDetail = linkedTarget.id; go('detail'); } } }));
    }
    if (c.files && c.files.length) {
      card.appendChild(el('div', { class: 'detail-section-title', text: L ? '文件' : 'Files' }));
      var imgs = (c.files || []).filter(isImageFile);
      if (imgs.length) {
        var gallery = el('div', { class: 'detail-gallery' });
        imgs.slice(0, 12).forEach(function (f) {
          var imageAttrs = { class: 'detail-image', src: f.data, alt: f.name,
            loading: 'lazy', decoding: 'async' };
          if (f.w && f.h) { imageAttrs.width = f.w; imageAttrs.height = f.h; }
          gallery.appendChild(el('a', { class: 'detail-image-link', href: f.data,
            download: f.name, title: f.name }, [
            el('img', imageAttrs)
          ]));
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

    // a planned draft: the headline action is "mark done" (it becomes a real commit);
    // diff/rollback don't apply to something that hasn't happened yet.
    if (c.planned) {
      var fulfillBtn = el('button', { class: 'btn primary detail-fulfill', text: t('mark_done_full') });
      fulfillBtn.addEventListener('click', function () {
        Store.fulfillCommit(c.id);
        toast('✅ ' + t('planned_done'));
        autoSync(false);
        go('timeline');
      });
      v.appendChild(fulfillBtn);
      v.appendChild(el('div', { class: 'detail-actions' }, [
        el('button', { class: 'btn', text: '✏️ ' + (L ? '编辑' : 'Edit'),
          onclick: function () { pendingEdit = c.id; go('commit'); } }),
        el('button', { class: 'btn danger', text: '🗑 ' + t('delete'),
          onclick: function () { if (confirm(t('confirm_delete'))) { Store.deleteCommit(c.id); go('timeline'); } } })
      ]));
      return;
    }

    var previous = previousCommitFor(c);
    v.appendChild(el('div', { class: 'detail-actions' }, [
      el('button', { class: 'btn primary', text: '✏️ ' + (L ? '编辑' : 'Edit'),
        onclick: function () { pendingEdit = c.id; go('commit'); } }),
      previous ? el('button', { class: 'btn', text: L ? '🔍 与上一版对比' : 'Compare previous',
        onclick: function () {
          pendingDiff = { sceneId: c.scene, commitId: c.id, baseId: previous.id };
          go('diff');
        } }) : el('button', { class: 'btn', text: '🔍 ' + t('nav_diff'),
        onclick: function () { pendingDiff = { sceneId: c.scene, commitId: c.id }; go('diff'); } }),
      el('button', { class: 'btn', text: '⏮️ ' + t('nav_rollback'),
        onclick: function () { pendingRollback = c.id; go('rollback'); } }),
      el('button', { class: 'btn danger', text: '🗑 ' + t('delete'),
        onclick: function () { if (confirm(t('confirm_delete'))) { Store.deleteCommit(c.id); go('timeline'); } } })
    ]));
  }

  /* ---------------- New / edit commit form ---------------- */
  var draftPhoto = null;
  var draftPhotoDims = null; // {w,h} of the cover, so timeline cards can reserve its box
  var draftFiles = [];
  var pendingEdit = null;
  var pendingTemplate = null; // a commit to copy from for "照着再记一笔" (new commit, not an edit)
  function renderCommitForm(v) {
    draftPhoto = null;
    draftPhotoDims = null;
    draftFiles = [];
    var editing = pendingEdit ? Store.getCommit(pendingEdit) : null;
    pendingEdit = null;
    var template = (!editing && pendingTemplate) ? pendingTemplate : null;
    pendingTemplate = null;
    var src = editing || template; // where prefilled values come from (edit OR replicate)
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', {
      text: editing ? (lang === 'zh' ? '编辑存档' : 'Edit commit') : t('nav_commit') })]));
    if (template) v.appendChild(el('div', { class: 'form-template-hint',
      text: '↩︎ ' + (lang === 'zh' ? '已照着上一条带入内容，可改后「存档」或「预存档」。' : 'Copied from a previous entry — edit, then Archive or Pre-save.') }));

    var selectedScene = (src && src.scene) || Store.SCENES[0].id;
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
      [['meal', '🍽', t('group_meal')], ['item', '📦', t('group_item')], ['ticket', '🎫', t('group_ticket')]].forEach(function (it) {
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
    if (src && src.message && src.message !== '(no message)') msgInput.value = src.message;
    var createdAtInput = el('input', { class: 'field', type: 'datetime-local',
      value: datetimeLocalValue(editing ? editing.createdAt : Date.now()) });
    var notesInput = el('textarea', { class: 'field', rows: '2' });
    if (src && src.notes) notesInput.value = src.notes;

    var preview = el('div', { class: 'photo-drop' }, [
      el('span', { class: 'photo-hint', text: '📷 ' + t('photo') })
    ]);
    var photoTools = null;
    function syncPhotoTools() {
      if (photoTools) photoTools.classList.toggle('is-hidden', !draftPhoto);
    }
    function setPhoto(dataUrl, dims) {
      draftPhoto = dataUrl;
      // prefer dims known up-front (from downscale) so a fast save never loses them; the
      // onload below is only a fallback for paths that didn't supply a size (e.g. edit).
      draftPhotoDims = (dims && dims.w && dims.h) ? { w: dims.w, h: dims.h } : null;
      preview.innerHTML = '';
      preview.style.backgroundImage = 'none';
      // show the cover at its natural aspect ratio (no cropping) — the dropzone grows
      // to fit, matching how the timeline now displays photos
      var coverImg = el('img', { class: 'photo-drop-img', src: dataUrl, alt: '' });
      // remember the cover's pixel size so saved commits carry it and timeline cards can
      // reserve the image box up-front (no decode-time "pop"/enlarge — see commitCard)
      coverImg.addEventListener('load', function () {
        if (!draftPhotoDims && coverImg.naturalWidth && coverImg.naturalHeight) {
          draftPhotoDims = { w: coverImg.naturalWidth, h: coverImg.naturalHeight };
        }
      });
      preview.appendChild(coverImg);
      preview.appendChild(el('button', { class: 'photo-remove-btn', type: 'button',
        'aria-label': lang === 'zh' ? '删除照片' : 'Remove photo',
        title: lang === 'zh' ? '删除照片' : 'Remove photo',
        text: '×',
        onclick: function (e) { e.stopPropagation(); clearPhoto(); } }));
      preview.classList.add('has-photo');
      syncPhotoTools();
    }
    function clearPhoto() {
      draftPhoto = null;
      draftPhotoDims = null;
      preview.innerHTML = '';
      preview.appendChild(el('span', { class: 'photo-hint', text: '📷 ' + t('photo') }));
      preview.classList.remove('has-photo');
      preview.style.backgroundImage = 'none';
      syncPhotoTools();
    }
    function imageEntryFromFile(file) {
      return downscale(file).then(function (res) {
        return { data: res.data, name: (file && file.name) || '', type: 'image/jpeg',
          size: Math.round(((res.data && res.data.length) || 0) * 0.75), w: res.w, h: res.h };
      });
    }
    function imageFileName(entry) {
      var n = (entry && entry.name) || ('image_' + (draftFiles.length + 1) + '.jpg');
      return /\.[a-z0-9]+$/i.test(n) ? n : (n + '.jpg');
    }
    // Add one or more images at once. A single-image pick replaces the cover; multi
    // picks keep the first image as cover only when there is no cover yet, then add
    // the rest as image attachments. Every path (desktop, native, paste, drag/drop)
    // lands here so multi-image behavior stays consistent.
    function addImageDataUrls(entries, opts) {
      entries = (entries || []).map(function (x) {
        return typeof x === 'string' ? { data: x } : x;
      }).filter(function (x) { return x && x.data; });
      if (!entries.length) return;
      var replaceCover = !!(opts && opts.replaceCover);
      var extras = 0;
      entries.forEach(function (entry, idx) {
        var dims = (entry.w && entry.h) ? { w: entry.w, h: entry.h } : null;
        if (!draftPhoto || (replaceCover && idx === 0)) { setPhoto(entry.data, dims); return; }
        // store each image attachment's pixel size too, so a multi-photo archive whose
        // cover is later removed still reserves the box for the first image (commitCoverDims)
        draftFiles.push({ id: Store.uid('f'), name: imageFileName(entry),
          type: 'image/jpeg', size: entry.size || Math.round((entry.data.length || 0) * 0.75),
          data: entry.data, w: entry.w || null, h: entry.h || null });
        extras++;
      });
      if (extras) { renderFilesList(); if (moreDetails) moreDetails.open = true; }
      if (entries.length > 1 || extras) toast(t('photos_added').replace('{n}', entries.length));
    }
    var fileInput = el('input', { type: 'file', accept: 'image/*', multiple: '', style: 'display:none' });
    fileInput.addEventListener('change', function () {
      var picked = Array.prototype.slice.call(fileInput.files || [])
        .filter(function (f) { return /^image\//.test(f.type); });
      fileInput.value = '';
      if (!picked.length) return;
      Promise.all(picked.map(imageEntryFromFile)).then(function (entries) {
        addImageDataUrls(entries, { replaceCover: picked.length === 1 });
      });
    });

    // ---- photo sources, all funneled through the in-app action sheet so the UI
    //      is consistent across Android / desktop (no bare native OS picker) ----
    function nativeCamera(source) {
      window.Capacitor.Plugins.Camera.getPhoto({ resultType: 'dataUrl', source: source, quality: 80, width: 1200, correctOrientation: true })
        .then(function (photo) {
          if (photo && photo.dataUrl) downscaleSrc(photo.dataUrl).then(function (res) {
            addImageDataUrls([{ data: res.data, name: 'photo.jpg', w: res.w, h: res.h }], { replaceCover: true });
          });
        })
        .catch(function () { /* cancelled */ });
    }
    // multi-select straight from the gallery (Android). pickImages returns webPaths,
    // so fetch each, downscale, then funnel through addImageDataUrls.
    function nativePickMulti() {
      var Cam = window.Capacitor.Plugins.Camera;
      if (!Cam || !Cam.pickImages) { nativeCamera('PHOTOS'); return; }
      Cam.pickImages({ quality: 80, width: 1200, correctOrientation: true }).then(function (res) {
        var photos = (res && res.photos) || [];
        if (!photos.length) return;
        return Promise.all(photos.map(function (p, idx) {
          return fetch(p.webPath || p.path).then(function (r) { return r.blob(); }).then(function (b) {
            return downscale(b).then(function (res) {
              return { data: res.data, name: (p && p.name) || ('album_' + (idx + 1) + '.jpg'), w: res.w, h: res.h };
            });
          });
        })).then(addImageDataUrls);
      }).catch(function (e) { if (e && e.message) toast('⚠ ' + e.message); });
    }
    function desktopScreenshot() {
      if (!(window.electronAPI && window.electronAPI.captureScreen)) {
        toast(lang === 'zh' ? '当前环境不支持截图' : 'Screenshot not supported here'); return;
      }
      toast(lang === 'zh' ? '正在截图…' : 'Capturing…');
      window.electronAPI.captureScreen().then(function (dataUrl) {
        if (!dataUrl) { toast(lang === 'zh' ? '截图失败' : 'Screenshot failed'); return; }
        downscaleSrc(dataUrl, 1600, 0.85).then(function (res) {
          addImageDataUrls([{ data: res.data, name: 'screenshot.jpg', w: res.w, h: res.h }], { replaceCover: true });
        });
      }).catch(function (e) { toast('⚠ ' + (e && e.message || e)); });
    }
    function pasteImageFromClipboard() {
      if (navigator.clipboard && navigator.clipboard.read) {
        navigator.clipboard.read().then(function (items) {
          for (var i = 0; i < items.length; i++) {
            var imgType = (items[i].types || []).filter(function (ty) { return /^image\//.test(ty); })[0];
            if (imgType) {
              items[i].getType(imgType).then(function (blob) {
                downscale(blob).then(function (res) {
                  addImageDataUrls([{ data: res.data, name: 'clipboard.jpg', w: res.w, h: res.h }], { replaceCover: true });
                });
              });
              return;
            }
          }
          toast(lang === 'zh' ? '剪贴板里没有图片' : 'No image in clipboard');
        }).catch(function () { toast(lang === 'zh' ? '无法读取剪贴板（可直接 Ctrl+V）' : 'Clipboard blocked — try Ctrl+V'); });
      } else {
        toast(lang === 'zh' ? '请直接按 Ctrl+V 粘贴' : 'Press Ctrl+V to paste');
      }
    }
    // the menu drops from the exact tap point (点哪弹哪), falling back to the dropzone
    function tapAnchor(e) {
      var x = e && e.clientX, y = e && e.clientY;
      if (x == null || (x === 0 && y === 0)) return preview;
      return { getBoundingClientRect: function () {
        return { left: x, right: x, top: y, bottom: y, width: 0, height: 0 }; } };
    }
    function openPhotoSource(e) {
      var Cap = window.Capacitor;
      var native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform() && Cap.Plugins && Cap.Plugins.Camera);
      var L = lang === 'zh';
      var anchor = tapAnchor(e);
      if (native) {
        actionSheet(L ? '添加照片' : 'Add photo', [
          { icon: UI_ICONS.camera, label: L ? '拍照' : 'Take photo', onClick: function () { nativeCamera('CAMERA'); } },
          { icon: UI_ICONS.album, label: L ? '从相册选择' : 'Choose from album', onClick: nativePickMulti }
        ], anchor);
      } else {
        var acts = [{ icon: UI_ICONS.file, label: L ? '选择图片（可多选）' : 'Choose images (multi)', onClick: function () { fileInput.click(); } }];
        if (window.electronAPI && window.electronAPI.captureScreen) {
          acts.push({ icon: UI_ICONS.screenshot, label: L ? '截取当前屏幕' : 'Capture screen', onClick: desktopScreenshot });
        }
        acts.push({ icon: UI_ICONS.paste, label: L ? '从剪贴板粘贴' : 'Paste from clipboard', onClick: pasteImageFromClipboard });
        actionSheet(L ? '添加照片' : 'Add photo', acts, anchor);
      }
    }
    function openMultiPhotoPicker() {
      var Cap = window.Capacitor;
      var native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform() && Cap.Plugins && Cap.Plugins.Camera);
      if (native) nativePickMulti();
      else fileInput.click();
    }
    preview.addEventListener('click', openPhotoSource);

    // drag an image file onto the dropzone -> photo (desktop convenience)
    preview.addEventListener('dragover', function (e) { e.preventDefault(); preview.classList.add('drag-over'); });
    preview.addEventListener('dragleave', function () { preview.classList.remove('drag-over'); });
    preview.addEventListener('drop', function (e) {
      e.preventDefault(); preview.classList.remove('drag-over');
      var files = Array.prototype.slice.call(e.dataTransfer && e.dataTransfer.files || [])
        .filter(function (f) { return /^image\//.test(f.type); });
      if (files.length) {
        Promise.all(files.map(imageEntryFromFile)).then(function (entries) {
          addImageDataUrls(entries, { replaceCover: files.length === 1 });
        });
      }
    });

    // Ctrl+V anywhere pastes an image as the photo — registered on the document so
    // it works before any field is focused, and torn down by viewCleanup on nav.
    function onPasteImg(e) {
      var items = (e.clipboardData && e.clipboardData.items) || [];
      var imgs = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && /^image\//.test(items[i].type)) {
          var f = items[i].getAsFile();
          if (f) imgs.push(f);
        }
      }
      if (imgs.length) {
        e.preventDefault();
        Promise.all(imgs.map(imageEntryFromFile)).then(function (entries) {
          addImageDataUrls(entries, { replaceCover: imgs.length === 1 });
          if (imgs.length === 1) toast(lang === 'zh' ? '已粘贴图片' : 'Image pasted');
        });
      }
    }
    document.addEventListener('paste', onPasteImg);
    viewCleanup = function () { document.removeEventListener('paste', onPasteImg); };

    if (src && src.photo) {
      setPhoto(src.photo);
      // adopt the stored size immediately (don't wait for the re-decode) so re-saving an
      // existing commit keeps its dimensions even if the user saves fast
      if (src.photoW && src.photoH) draftPhotoDims = { w: src.photoW, h: src.photoH };
    }

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
    if (src && src.items && src.items.length) {
      src.items.forEach(function (it) { addItemRow(it.name, it.qty || 1); });
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
    if ((src && src.items && src.items.length) || (src && src.files && src.files.length)) moreDetails.open = true;

    // collect + persist. `planned` only matters for NEW commits; editing preserves the
    // commit's existing planned/real state.
    function doSave(planned) {
      var items = [];
      itemsWrap.querySelectorAll('.item-row').forEach(function (r) {
        var n = $('.item-name', r).value.trim();
        if (n) items.push({ name: n, qty: parseInt($('.item-qty', r).value, 10) || 1 });
      });
      var payload = {
        scene: selectedScene,
        message: msgInput.value.trim() || '(no message)',
        createdAt: parseDatetimeLocal(createdAtInput.value, editing ? editing.createdAt : Date.now()),
        photo: draftPhoto,
        // cover pixel size → timeline/detail reserve the image box so a freshly added
        // archive doesn't visibly "pop"/enlarge when its photo finishes decoding
        photoW: draftPhoto && draftPhotoDims ? draftPhotoDims.w : null,
        photoH: draftPhoto && draftPhotoDims ? draftPhotoDims.h : null,
        items: items,
        files: draftFiles.slice(),
        notes: notesInput.value.trim(),
        planned: !!planned
      };
      if (editing) {
        payload.planned = !!editing.planned;
        Store.updateCommit(editing.id, payload);
        toast('✅ ' + (lang === 'zh' ? '已保存修改' : 'Saved'));
        autoSync(false);
        go('timeline');
        return;
      }
      var ok = Store.addCommit(payload);
      if (!ok) { toast('⚠ ' + (lang === 'zh' ? '存储空间不足，请删除旧照片' : 'Storage full')); return; }
      if (planned) { toast('📌 ' + t('planned_saved')); autoSync(false); }
      else { toast('✅ ' + t('save_commit')); autoSync(true); } // auto-sync real archives to cloud
      go('timeline');
    }

    photoTools = el('div', { class: 'photo-tools' }, [
      el('button', { class: 'btn ghost photo-extra-btn', type: 'button',
        text: '＋ ' + t('pick_multi'), onclick: openMultiPhotoPicker })
    ]);
    syncPhotoTools();

    var form = el('div', { class: 'form-card' }, [
      // NOT a <label> (a file input inside a label fires twice -> re-opens picker)
      el('div', { class: 'labeled' }, [
        el('span', { class: 'label-text', text: '📷 ' + t('photo') }),
        el('div', {}, [preview, fileInput, photoTools, aiBtn])
      ]),
      labeled(t('message'), msgInput),
      labeled(t('archive_time'), createdAtInput),
      labeledBlock(t('scene'), scenePicker),
      moreDetails,
      el('div', { class: 'form-actions' }, [
        el('button', { class: 'btn ghost', text: t('cancel'),
          onclick: function () { go('timeline'); } }),
        // "预存档" only for NEW commits — it saves a 预存档/draft to fulfill later
        editing ? null : el('button', { class: 'btn plan-btn', text: t('planned_save'),
          onclick: function () { doSave(true); } }),
        el('button', { class: 'btn primary', text: t('save_commit'),
          onclick: function () { doSave(false); } })
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
    var hideChevron = extraClass && /\bno-chevron\b/.test(extraClass);
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
      if (!hideChevron) trigger.appendChild(el('span', { class: 'choice-chevron', text: '⌄' }));
    }
    root.setOptions(options, selectedValue);
    return root;
  }

  /* Close any open anchored menu. */
  function closePopover() {
    var old = $('.popover-mask');
    if (old && !old._closing) {
      old._closing = true;
      old.classList.remove('open');
      setTimeout(function () { if (old.parentNode) old.remove(); }, 150);
    }
  }

  /* ---- Anchored dropdown menu (replaces the old bottom sheet) ----
     Pops a floating panel right at the trigger you tapped — drops below it, or flips
     above when there's no room — instead of always sliding up from the screen bottom
     (which felt 不符合直觉). Used by the app-owned <select> and the photo-source picker.
     opts: { title, options:[{value,text,active}], onPick(value) }  // select-style
        or { title, actions:[{icon,label,onClick}] }                // action menu
     `anchor` is the element to position against (null → centered fallback). */
  function openAnchoredMenu(anchor, opts) {
    closePopover();
    opts = opts || {};
    var mask = el('div', { class: 'popover-mask' });
    var panel = el('div', { class: 'popover-menu', role: 'menu' });
    if (opts.title) panel.appendChild(el('div', { class: 'popover-title', text: opts.title }));
    var listWrap = el('div', { class: 'popover-list' });
    panel.appendChild(listWrap);
    // custom content (e.g. the calendar day-detail panel): an arbitrary node, no options
    if (opts.content) listWrap.appendChild(opts.content);

    function close() {
      mask.classList.remove('open');
      setTimeout(function () { if (mask.parentNode) mask.remove(); }, 150);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    }

    (opts.options || []).forEach(function (it) {
      var row = el('button', {
        type: 'button', role: 'menuitemradio', 'aria-checked': it.active ? 'true' : 'false',
        class: 'popover-option' + (it.active ? ' active' : '')
      }, [
        el('span', { class: 'popover-option-text', text: it.text }),
        el('span', { class: 'popover-check', text: it.active ? '✓' : '' })
      ]);
      row.addEventListener('click', function () { close(); if (opts.onPick) opts.onPick(it.value); });
      listWrap.appendChild(row);
    });
    (opts.actions || []).forEach(function (a) {
      var ic = el('span', { class: 'popover-ic' }); ic.innerHTML = a.icon || '';
      var row = el('button', { type: 'button', role: 'menuitem', class: 'popover-option popover-action' },
        [ic, el('span', { class: 'popover-option-text', text: a.label })]);
      row.addEventListener('click', function () { close(); setTimeout(a.onClick, 130); });
      listWrap.appendChild(row);
    });

    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    mask.appendChild(panel);
    document.body.appendChild(mask);

    function place() {
      panel.style.maxHeight = '';
      var vw = window.innerWidth, vh = window.innerHeight, margin = 10, gap = 6;
      var aRect = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
      var minW = aRect ? aRect.width : 240;
      panel.style.maxWidth = Math.min(vw - margin * 2, 440) + 'px';
      panel.style.minWidth = Math.max(190, Math.min(minW, vw - margin * 2)) + 'px';
      var pw = panel.offsetWidth, ph = panel.offsetHeight, left, top, origin;
      if (!aRect) {
        left = (vw - pw) / 2; top = (vh - ph) / 2; origin = 'center';
      } else {
        left = Math.max(margin, Math.min(aRect.left, vw - margin - pw));
        var spaceBelow = vh - aRect.bottom - gap - margin;
        var spaceAbove = aRect.top - gap - margin;
        if (ph <= spaceBelow || spaceBelow >= spaceAbove) {
          top = aRect.bottom + gap; origin = 'top';
          if (ph > spaceBelow) panel.style.maxHeight = Math.max(120, spaceBelow) + 'px';
        } else {
          if (ph > spaceAbove) panel.style.maxHeight = Math.max(120, spaceAbove) + 'px';
          top = Math.max(margin, aRect.top - gap - Math.min(ph, spaceAbove)); origin = 'bottom';
        }
      }
      panel.style.left = Math.round(left) + 'px';
      panel.style.top = Math.round(top) + 'px';
      panel.style.transformOrigin = origin === 'bottom' ? 'left bottom'
        : (origin === 'center' ? 'center' : 'left top');
    }
    place();
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    requestAnimationFrame(function () { mask.classList.add('open'); place(); });
    return { close: close };
  }

  function openChoiceSheet(select) {
    var anchor = (select.querySelector && select.querySelector('.choice-trigger')) || select;
    openAnchoredMenu(anchor, {
      title: t('choice_title'),
      options: select._choices.map(function (it) {
        return { value: it.value, text: it.text, active: it.value === select.getValue() };
      }),
      onPick: function (val) { select.setValue(val, true); }
    });
  }

  /* App-owned action menu. `actions` = [{ icon (svg html), label, onClick }]. Used for
     the photo source picker so 拍照/相册/截图/粘贴 match the rest of the app instead of
     the bare native OS sheet; anchored to whatever element opened it. */
  function actionSheet(title, actions, anchor) {
    openAnchoredMenu(anchor || null, { title: title, actions: actions });
  }

  /* ---------------- Reality Diff helpers (Phase 3/4/5) ---------------- */

  // Light, always-on "AI-ish" item matching (Phase 3): treat a removed + added pair whose
  // names overlap (一个名字包含另一个，如 可乐/可口可乐) as the SAME item renamed, instead
  // of one disappearing and a different one appearing.
  function namesSimilar(a, b) {
    a = String(a || '').toLowerCase().trim(); b = String(b || '').toLowerCase().trim();
    if (!a || !b) return false;
    if (a === b) return true;
    return (a.length >= 2 && b.length >= 2 && (a.indexOf(b) >= 0 || b.indexOf(a) >= 0));
  }
  function reconcileFuzzy(d) {
    var removed = d.removed.slice(), added = d.added.slice(), renamed = [];
    for (var i = removed.length - 1; i >= 0; i--) {
      for (var j = added.length - 1; j >= 0; j--) {
        if (namesSimilar(removed[i].name, added[j].name)) {
          renamed.push({ from: removed[i].name, to: added[j].name });
          removed.splice(i, 1); added.splice(j, 1); break;
        }
      }
    }
    return { added: added, removed: removed, changed: d.changed, kept: d.kept, renamed: renamed };
  }

  // Phase 4 — a scene's history as a churn timeline + which items vanish vs. stay.
  function sceneTrend(sceneId) {
    var list = realCommitsForScene(sceneId).slice().reverse(); // oldest → newest
    var steps = [], disappear = {}, stable = {}, appear = {};
    for (var i = 1; i < list.length; i++) {
      var dd = Diff.itemDiff(list[i - 1].items, list[i].items);
      steps.push({ ts: list[i].createdAt, churn: dd.added.length + dd.removed.length + dd.changed.length,
        base: list[i - 1], comp: list[i], changedPct: null });
      dd.removed.forEach(function (x) { disappear[x.name] = (disappear[x.name] || 0) + 1; });
      dd.added.forEach(function (x) { appear[x.name] = (appear[x.name] || 0) + 1; });
      dd.kept.forEach(function (x) { stable[x.name] = (stable[x.name] || 0) + 1; });
    }
    function top(map) {
      return Object.keys(map).map(function (k) { return { name: k, count: map[k] }; })
        .sort(function (a, b) { return b.count - a.count; }).slice(0, 3);
    }
    return { steps: steps, count: list.length, mostDisappeared: top(disappear), mostStable: top(stable), mostAdded: top(appear) };
  }

  function loadImgEl(src) {
    return new Promise(function (resolve) {
      if (!src) { resolve(null); return; }
      var im = new Image(); im.onload = function () { resolve(im); }; im.onerror = function () { resolve(null); }; im.src = src;
    });
  }
  function drawContain(ctx, img, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = '#0d1426'; ctx.fillRect(x, y, w, h);
    if (img) {
      var r = Math.min(w / img.width, h / img.height);
      var dw = img.width * r, dh = img.height * r;
      ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    }
    ctx.restore();
  }
  // Compose a before/after share card (Phase 5): two photos + change list + change %.
  function buildDiffCardCanvas(base, comp, d, changedPct) {
    var L = lang === 'zh';
    return Promise.all([loadImgEl(base.photo), loadImgEl(comp.photo)]).then(function (imgs) {
      var W = 1080, pad = 48, gap = 28, imgW = (W - pad * 2 - gap) / 2, imgH = Math.round(imgW * 0.75);
      var lines = [];
      function push(label, arr) { if (arr.length) lines.push(label + arr.map(function (x) { return x.name + (x.qty > 1 ? '×' + x.qty : ''); }).join('、')); }
      push(L ? '少了：' : 'Removed: ', d.removed);
      push(L ? '多了：' : 'Added: ', d.added);
      if (d.changed.length) lines.push((L ? '数量变化：' : 'Qty: ') + d.changed.map(function (x) { return x.name + ' ' + x.from + '→' + x.to; }).join('、'));
      if (d.renamed && d.renamed.length) lines.push((L ? '可能同一物品：' : 'Likely same item: ')
        + d.renamed.map(function (x) { return x.from + '≈' + x.to; }).join('、'));
      var listTop = pad + 70 + imgH + 40 + 84;
      var H = listTop + Math.max(1, lines.length) * 46 + pad;
      var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      var ctx = cv.getContext('2d');
      ctx.fillStyle = '#0b1020'; ctx.fillRect(0, 0, W, H);
      // header
      ctx.fillStyle = '#8ea2ff'; ctx.font = '700 30px sans-serif'; ctx.textBaseline = 'top';
      ctx.fillText('Life Archive · ' + (L ? '现实对比' : 'Reality diff'), pad, pad);
      ctx.fillStyle = '#9aa6c4'; ctx.font = '400 22px sans-serif';
      ctx.fillText(fmtDate(base.createdAt) + '  →  ' + fmtDate(comp.createdAt), pad, pad + 38);
      // photos
      var iy = pad + 70;
      drawContain(ctx, imgs[0], pad, iy, imgW, imgH);
      drawContain(ctx, imgs[1], pad + imgW + gap, iy, imgW, imgH);
      ctx.fillStyle = '#cdd6f4'; ctx.font = '600 22px sans-serif';
      ctx.fillText(L ? '旧版' : 'Base', pad + 6, iy + 8);
      ctx.fillText(L ? '新版' : 'Compare', pad + imgW + gap + 6, iy + 8);
      // big change %
      var by = iy + imgH + 36;
      ctx.fillStyle = '#ff5a7a'; ctx.font = '800 56px sans-serif';
      ctx.fillText((changedPct != null ? changedPct.toFixed(1) : '—') + '%', pad, by);
      ctx.fillStyle = '#9aa6c4'; ctx.font = '400 24px sans-serif';
      ctx.fillText(L ? '画面变化' : 'pixels changed', pad + 200, by + 22);
      // change list
      ctx.font = '500 26px sans-serif';
      if (!lines.length) { ctx.fillStyle = '#7fd6a0'; ctx.fillText(L ? '两个版本几乎一致 👍' : 'Nearly identical 👍', pad, listTop); }
      else lines.forEach(function (ln, i) { ctx.fillStyle = '#e6e9f5'; ctx.fillText(ln, pad, listTop + i * 46); });
      return cv;
    });
  }
  // Show a generated image with save options (works on desktop + long-press on mobile).
  function showImageModal(dataUrl) {
    var L = lang === 'zh';
    closePopover();
    var mask = el('div', { class: 'img-modal' });
    var img = el('img', { class: 'img-modal-img', src: dataUrl, alt: '' });
    var dl = el('a', { class: 'btn primary tiny', text: L ? '下载图片' : 'Download',
      href: dataUrl, download: 'life-archive-diff.png' });
    var hint = el('div', { class: 'img-modal-hint', text: L ? '长按图片可保存 / 分享' : 'Long-press the image to save / share' });
    var closeB = el('button', { type: 'button', class: 'img-modal-close', text: '✕', onclick: function () { mask.remove(); } });
    mask.addEventListener('click', function (e) { if (e.target === mask) mask.remove(); });
    mask.appendChild(closeB);
    mask.appendChild(el('div', { class: 'img-modal-body' }, [img, el('div', { class: 'img-modal-actions' }, [dl]), hint]));
    document.body.appendChild(mask);
    requestAnimationFrame(function () { mask.classList.add('open'); });
  }

  /* ---------------- Reality Diff ---------------- */
  var pendingDiff = null;
  function renderDiff(v) {
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_diff') })]));
    var allReal = Store.commits().filter(notPlanned);
    if (allReal.length < 2) { v.appendChild(noticeCard(t('need_two'))); return; }

    var scenesWith2 = Store.SCENES.filter(function (s) { return realCommitsForScene(s.id).length >= 2; });
    var L = lang === 'zh';
    var diffContext = pendingDiff;
    pendingDiff = null;
    var initialScene = (diffContext && scenesWith2.some(function (s) { return s.id === diffContext.sceneId; }))
      ? diffContext.sceneId : (scenesWith2[0] && scenesWith2[0].id);
    var crossScene = !initialScene;   // no same-scene pair → start in cross-scene mode
    var diffMode = 'heat';
    var diffThreshold = 38;
    var diffRunId = 0;
    var trendRunId = 0;
    var lastDiff = null;              // {base, comp, d, changedPct} reused by AI / export

    var sceneSel = choiceSelect(scenesWith2.map(function (s) {
      return { value: s.id, text: sceneLabel(s) };
    }), initialScene);
    var baseSel = choiceSelect([]);
    var compSel = choiceSelect([]);

    function fillVersionSelects() {
      // same-scene: that scene's real commits; cross-scene: every real commit (Phase 4)
      var list = crossScene ? allReal : realCommitsForScene(sceneSel.getValue());
      var choices = list.map(function (c) {
        var sc = Store.sceneById(c.scene);
        return { value: c.id, text: (crossScene ? sc.emoji + ' ' : '') + fmtDate(c.createdAt) + ' · ' + (c.message || shortId(c.id)) };
      });
      var compDefault = choices[0] && choices[0].value;
      var baseDefault = choices[Math.min(1, choices.length - 1)] && choices[Math.min(1, choices.length - 1)].value;
      if (!crossScene && diffContext && diffContext.sceneId === sceneSel.getValue()) {
        var wantedComp = diffContext.commitId;
        var wantedBase = diffContext.baseId || (Store.getCommit(wantedComp) || {}).parentId;
        if (choices.some(function (x) { return x.value === wantedComp; })) compDefault = wantedComp;
        if (choices.some(function (x) { return x.value === wantedBase; })) baseDefault = wantedBase;
      }
      // default: base = older (second item), compare = newest
      compSel.setOptions(choices, compDefault);
      baseSel.setOptions(choices, baseDefault);
    }

    var sceneBlock = labeledBlock(t('scene'), sceneSel);
    // Phase 4 — 同场景 / 跨场景 任意两版对比 (lifts the "must be same scene" restriction)
    var scopeToggle = segmented([
      ['scene', L ? '同场景' : 'Same scene'],
      ['cross', L ? '跨场景' : 'Cross-scene']
    ], crossScene ? 'cross' : 'scene', function (m) {
      crossScene = (m === 'cross'); diffContext = null;
      sceneBlock.style.display = crossScene ? 'none' : '';
      fillVersionSelects(); runDiff(); renderTrend();
    });
    sceneBlock.style.display = crossScene ? 'none' : '';
    fillVersionSelects();
    sceneSel.onChange(function () { diffContext = null; fillVersionSelects(); runDiff(); renderTrend(); });

    v.appendChild(el('div', { class: 'diff-scope' }, [
      el('span', { class: 'diff-scope-label', text: L ? '对比范围' : 'Scope' }), scopeToggle
    ]));
    var controls = el('div', { class: 'diff-controls' }, [
      sceneBlock,
      labeledBlock(t('base'), baseSel),
      labeledBlock(t('compare'), compSel),
      el('button', { class: 'btn primary', text: '🔍 ' + t('run_diff'), onclick: function () { runDiff(); } })
    ]);
    v.appendChild(controls);

    var modeControl = segmented([
      ['heat', L ? '热力图' : 'Heatmap'],
      ['slider', L ? '左右滑块' : 'Slider'],
      ['blink', L ? '淡入闪烁' : 'Blink']
    ], diffMode, function (m) { diffMode = m; runDiff(); });
    // Sensitivity slider removed (it confused more than it helped) — the image diff just
    // uses a sensible fixed threshold (diffThreshold) under the hood.
    v.appendChild(el('div', { class: 'diff-tuning' }, [
      labeledBlock(L ? '显示模式' : 'View mode', modeControl)
    ]));

    // Phase 3 AI reading + Phase 5 export. (The "复制文本" button was removed — it duplicated
    // the export card and added little; the two actions below read as a clean pair.)
    v.appendChild(el('div', { class: 'diff-action-bar' }, [
      el('button', { class: 'btn ai-diff-btn', text: '✨ ' + (L ? 'AI 解读变化' : 'AI read changes'),
        onclick: function () { runAIDiff(); } }),
      el('button', { class: 'btn ghost diff-export-btn', text: '🖼 ' + (L ? '导出对比卡片' : 'Export card'),
        onclick: function () { exportCard(); } })
    ]));

    var aiResult = el('div', { class: 'diff-ai-result' });
    v.appendChild(aiResult);
    var result = el('div', { class: 'diff-result' });
    v.appendChild(result);
    var trendWrap = el('div', { class: 'diff-trend' });
    v.appendChild(trendWrap);

    baseSel.onChange(function () { runDiff(); });
    compSel.onChange(function () { runDiff(); });

    function qtyLabel(x) { return x.name + (x.qty > 1 ? ' ×' + x.qty : ''); }

    // Phase 4 — meal scenes: foods that appear in BOTH meals + optional AI calorie estimate
    function mealExtras(base, comp, d) {
      var box = el('div', { class: 'meal-repeat' });
      if (d.kept && d.kept.length) {
        box.appendChild(el('div', { class: 'meal-repeat-head', text: '🔁 ' + (L ? '两餐都有' : 'In both meals') }));
        var chips = el('div', { class: 'meal-chips' });
        d.kept.forEach(function (x) { chips.appendChild(el('span', { class: 'meal-chip', text: x.name })); });
        box.appendChild(chips);
      }
      var foods = (comp.items || []).map(function (it) { return it.name; }).filter(Boolean);
      if (foods.length) {
        var nutBtn = el('button', { class: 'btn tiny ghost', text: '🔥 ' + (L ? 'AI 估算这餐热量' : 'AI estimate calories') });
        var nutOut = el('span', { class: 'meal-nut' });
        nutBtn.addEventListener('click', function () {
          if (!AI.getKey()) { toast(L ? '请先在设置里填入免费 AI key' : 'Add your free AI key in Settings'); return; }
          nutBtn.disabled = true; var o = nutBtn.textContent; nutBtn.textContent = L ? '估算中…' : 'estimating…';
          AI.nutrition(foods).then(function (r) { nutOut.textContent = '≈ ' + r.kcal + ' kcal · ' + (r.note || ''); })
            .catch(function (e) { toast('⚠ ' + (e && e.message || e)); })
            .then(function () { nutBtn.disabled = false; nutBtn.textContent = o; });
        });
        box.appendChild(el('div', { class: 'meal-nut-row' }, [nutBtn, nutOut]));
      }
      return box;
    }

    // Phase 3 — AI reads BOTH photos and explains the change in natural language.
    function runAIDiff() {
      var base = Store.getCommit(baseSel.getValue());
      var comp = Store.getCommit(compSel.getValue());
      aiResult.innerHTML = '';
      if (!base || !comp) return;
      if (!base.photo || !comp.photo) { toast(L ? '两个版本都要有照片，AI 才能解读' : 'Both versions need a photo'); return; }
      if (!AI.getKey()) {
        aiResult.appendChild(noticeCard(L
          ? '先在「设置」里填入你自己的免费 AI key（智谱 GLM-4V）即可用 AI 解读；没有 key 时下面的本地对比照常可用。'
          : 'Add your own free AI key (Zhipu GLM-4V) in Settings to use AI reading. The local diff below works without it.'));
        return;
      }
      function head() { return el('div', { class: 'ai-card-head', text: '✨ ' + (L ? 'AI 解读变化' : 'AI reading') }); }
      var card = el('div', { class: 'ai-card' }, [head(),
        el('div', { class: 'ai-loading', text: L ? 'AI 正在对比两张照片…' : 'AI is comparing the two photos…' })]);
      aiResult.appendChild(card);
      AI.analyzeDiff(base.photo, comp.photo).then(function (r) {
        card.innerHTML = ''; card.appendChild(head());
        if (r.summary) card.appendChild(el('p', { class: 'ai-summary', text: r.summary }));
        function chipRow(label, arr, kind) {
          if (!arr.length) return;
          var row = el('div', { class: 'ai-chips ' + kind }, [el('span', { class: 'ai-chip-label', text: label })]);
          arr.forEach(function (n) { row.appendChild(el('span', { class: 'ai-chip', text: n })); });
          card.appendChild(row);
        }
        chipRow(L ? '多了' : 'Added', r.added, 'added');
        chipRow(L ? '少了' : 'Removed', r.removed, 'removed');
        chipRow(L ? '移动' : 'Moved', r.moved, 'moved');
        if (!r.summary && !r.added.length && !r.removed.length && !r.moved.length)
          card.appendChild(el('p', { class: 'ai-summary', text: L ? 'AI 没看出明显变化。' : 'AI saw no clear change.' }));
      }).catch(function (e) {
        card.innerHTML = ''; card.appendChild(head());
        card.appendChild(el('p', { class: 'ai-error', text: '⚠ ' + (e && e.message || e) }));
      });
    }

    // Phase 5 — compose a before/after share card.
    function exportCard() {
      var base = lastDiff && lastDiff.base, comp = lastDiff && lastDiff.comp;
      if (!base || !comp) return;
      var d = lastDiff.d || Diff.itemDiff(base.items, comp.items);
      function make(pct) { buildDiffCardCanvas(base, comp, d, pct).then(function (cv) { showImageModal(cv.toDataURL('image/png')); }); }
      if (lastDiff.changedPct != null || !(base.photo && comp.photo)) make(lastDiff.changedPct);
      else Diff.imageDiff(base.photo, comp.photo, document.createElement('canvas'), { threshold: diffThreshold })
        .then(function (r) { make(r.ok ? r.changedPct : null); });
    }
    // Phase 4 — per-scene churn timeline + "最常消失 / 最稳定" insight cards.
    function renderTrend() {
      var thisTrend = ++trendRunId;
      trendWrap.innerHTML = '';
      if (crossScene) return;
      var tr = sceneTrend(sceneSel.getValue());
      if (tr.count < 2) return;
      if (!tr.steps.length && !tr.mostDisappeared.length && !tr.mostStable.length) return;
      var card = el('section', { class: 'set-card trend-card' });
      card.appendChild(el('div', { class: 'trend-head', text: '📈 ' + (L ? '场景趋势与洞察' : 'Scene trend & insights') }));
      if (tr.steps.length) {
        var spark = el('div', { class: 'trend-spark' });
        var trendCap = el('div', { class: 'trend-spark-cap' });
        function metric(s) { return s.changedPct != null ? s.changedPct : s.churn; }
        function metricLabel(s) {
          return s.changedPct != null
            ? (s.changedPct.toFixed(1) + '% changedPct')
            : ((L ? '清单变化 ' : 'Item churn ') + s.churn);
        }
        function paintSpark() {
          spark.innerHTML = '';
          var maxCh = Math.max.apply(null, tr.steps.map(metric).concat([1]));
          tr.steps.forEach(function (s) {
            spark.appendChild(el('span', { class: 'spark-bar',
              style: 'height:' + Math.round(6 + (metric(s) / maxCh) * 46) + 'px',
              title: fmtDate(s.ts) + ' · ' + metricLabel(s) }));
          });
          var visualCount = tr.steps.filter(function (s) { return s.changedPct != null; }).length;
          trendCap.textContent = visualCount
            ? (L ? '相邻存档照片 changedPct 曲线（无双图的点用清单变化兜底）'
                 : 'Photo changedPct across adjacent archives (item churn fallback where photos are missing)')
            : (L ? '每次存档的清单变化量（越高变化越大）' : 'Item change size per archive');
        }
        paintSpark();
        card.appendChild(el('div', { class: 'trend-spark-wrap' }, [spark,
          trendCap]));
        var photoSteps = tr.steps.filter(function (s) { return s.base.photo && s.comp.photo; });
        if (photoSteps.length) {
          Promise.all(photoSteps.map(function (s) {
            return Diff.imageDiff(s.base.photo, s.comp.photo, document.createElement('canvas'), { threshold: diffThreshold })
              .then(function (r) { if (r && r.ok) s.changedPct = r.changedPct; });
          })).then(function () {
            if (thisTrend !== trendRunId || crossScene) return;
            paintSpark();
          });
        }
      }
      function insight(icon, label, arr) {
        if (!arr.length) return null;
        return el('div', { class: 'insight-row' }, [
          el('span', { class: 'insight-ic', text: icon }),
          el('span', { class: 'insight-label', text: label }),
          el('span', { class: 'insight-vals', text: arr.map(function (x) { return x.name + '·' + x.count; }).join('   ') })
        ]);
      }
      var rows = el('div', { class: 'insight-list' });
      [insight('🌀', L ? '最常消失' : 'Most disappeared', tr.mostDisappeared),
       insight('🪨', L ? '最稳定' : 'Most stable', tr.mostStable),
       insight('➕', L ? '最常新增' : 'Most added', tr.mostAdded)].forEach(function (r) { if (r) rows.appendChild(r); });
      if (rows.childNodes.length) card.appendChild(rows);
      trendWrap.appendChild(card);
    }

    function bgStyle(src) {
      return 'background-image:url(' + src + ')';
    }
    function sliderCompare(base, comp) {
      var afterLayer = el('div', { class: 'diff-slider-layer diff-slider-after', style: bgStyle(comp.photo) + ';clip-path:inset(0 50% 0 0)' });
      var handle = el('div', { class: 'diff-slider-handle', style: 'left:50%' });
      var range = el('input', { class: 'diff-slider-range', type: 'range', min: '0', max: '100', value: '50' });
      range.addEventListener('input', function () {
        afterLayer.style.clipPath = 'inset(0 ' + (100 - parseInt(range.value, 10)) + '% 0 0)';
        handle.style.left = range.value + '%';
      });
      return el('div', { class: 'heat-wrap diff-mode-card' }, [
        el('div', { class: 'heat-title', text: L ? '↔ 左右滑块对比' : '↔ Before / after slider' }),
        el('div', { class: 'diff-slider-frame' }, [
          el('img', { class: 'diff-slider-spacer', src: comp.photo, alt: '' }),
          el('div', { class: 'diff-slider-layer', style: bgStyle(base.photo) }),
          afterLayer,
          handle
        ]),
        range,
        el('div', { class: 'diff-mode-hint', text: L ? '拖动滑杆查看旧版与新版的边界。' : 'Drag to reveal the boundary between base and compare.' })
      ]);
    }
    function blinkCompare(base, comp) {
      return el('div', { class: 'heat-wrap diff-mode-card' }, [
        el('div', { class: 'heat-title', text: L ? '✨ 淡入闪烁对比' : '✨ Fade / blink compare' }),
        el('div', { class: 'diff-blink-frame' }, [
          el('img', { class: 'diff-slider-spacer', src: comp.photo, alt: '' }),
          el('div', { class: 'diff-slider-layer', style: bgStyle(base.photo) }),
          el('div', { class: 'diff-slider-layer diff-blink-after', style: bgStyle(comp.photo) })
        ]),
        el('div', { class: 'diff-mode-hint', text: L ? '新版会定时淡入淡出，最适合快速看出物体增减。' : 'The compare image pulses over the base image so added or removed objects stand out.' })
      ]);
    }

    function runDiff() {
      var base = Store.getCommit(baseSel.getValue());
      var comp = Store.getCommit(compSel.getValue());
      aiResult.innerHTML = '';                 // a new pair invalidates the old AI reading
      if (!base || !comp) { result.innerHTML = ''; return; }
      var thisRun = ++diffRunId;
      result.innerHTML = '';
      lastDiff = { base: base, comp: comp, d: null, changedPct: null };

      // ----- visual compare -----
      var photos = el('div', { class: 'diff-photos' }, [
        photoCol(t('base'), base),
        photoCol(t('compare'), comp)
      ]);

      result.appendChild(photos);
      if (base.photo && comp.photo) {
        if (diffMode === 'slider') {
          result.appendChild(sliderCompare(base, comp));
        } else if (diffMode === 'blink') {
          result.appendChild(blinkCompare(base, comp));
        } else {
          var heatCanvas = el('canvas', { class: 'heat-canvas' });
          var heatWrap = el('div', { class: 'heat-wrap' }, [
            el('div', { class: 'heat-title', text: '🔥 ' + t('changed') }),
            heatCanvas,
            el('div', { class: 'heat-stats', id: 'heat-stats' })
          ]);
          result.appendChild(heatWrap);
          Diff.imageDiff(base.photo, comp.photo, heatCanvas, { threshold: diffThreshold }).then(function (r) {
            if (thisRun !== diffRunId) return;
            if (r.ok && lastDiff) lastDiff.changedPct = r.changedPct;  // cache for export/share
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
      }

      // ----- semantic item diff (+ light fuzzy item matching, Phase 3) -----
      var raw = Diff.itemDiff(base.items, comp.items);
      var d = reconcileFuzzy(raw);
      lastDiff.d = d;
      var anyChange = d.added.length || d.removed.length || d.changed.length || d.renamed.length;
      var sem = el('div', { class: 'sem-diff' });
      if (!anyChange) {
        sem.appendChild(noticeCard(t('no_change')));
      } else {
        if (d.removed.length) sem.appendChild(diffList('removed', t('removed'), d.removed.map(qtyLabel)));
        if (d.added.length) sem.appendChild(diffList('added', t('added'), d.added.map(qtyLabel)));
        if (d.changed.length) sem.appendChild(diffList('changed', t('changed_qty'), d.changed.map(function (x) {
          return x.name + ': ' + x.from + ' → ' + x.to;
        })));
        if (d.renamed.length) sem.appendChild(diffList('renamed', (L ? '可能同一物品' : 'Likely the same'),
          d.renamed.map(function (x) { return x.from + ' ≈ ' + x.to; })));
        if (d.kept.length) sem.appendChild(diffList('kept', t('kept'), d.kept.map(qtyLabel)));
      }
      result.appendChild(sem);

      // ----- Phase 4: meal scenes get repeated-food + AI calorie extras -----
      if (Store.isMealScene(base.scene) && Store.isMealScene(comp.scene)) {
        result.appendChild(mealExtras(base, comp, d));
      }
    }
    runDiff();
    renderTrend();
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
    var sign = { removed: '−', added: '+', changed: '~', kept: '=', renamed: '≈' }[kind];
    return el('div', { class: 'diff-block ' + kind }, [
      el('div', { class: 'diff-block-head' }, [
        el('span', { class: 'diff-sign', text: sign }),
        el('span', { text: title + ' (' + lines.length + ')' })
      ]), ul]);
  }

  /* ---------------- Rollback / 照着再记一笔 ---------------- */
  var pendingRollback = null;
  // copy an existing commit into the new-commit form as a fresh entry (the user then
  // chooses 存档 or 预存档). Powers "照着再记一笔" for meals and items alike.
  function replicateCommit(c) {
    pendingTemplate = {
      scene: c.scene, message: c.message,
      items: (c.items || []).map(function (it) { return { name: it.name, qty: it.qty || 1 }; }),
      photo: c.photo || null, notes: ''
    };
    go('commit');
  }
  var ROLLBACK_PROGRESS_KEY = 'lifearchive.rollback.progress.v1';
  function readRollbackProgress() {
    try { return JSON.parse(localStorage.getItem(ROLLBACK_PROGRESS_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function rollbackProgress(id) {
    var all = readRollbackProgress();
    var list = all[id] || [];
    var m = {};
    list.forEach(function (k) { m[k] = true; });
    return m;
  }
  function saveRollbackProgress(id, keys) {
    var all = readRollbackProgress();
    if (keys && keys.length) all[id] = keys;
    else delete all[id];
    try { localStorage.setItem(ROLLBACK_PROGRESS_KEY, JSON.stringify(all)); } catch (e) {}
  }
  function rollbackStepKey(s) { return s.kind + '|' + s.text; }

  function renderRollback(v) {
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_rollback') })]));
    var commits = Store.commits().filter(notPlanned);
    if (!commits.length) { v.appendChild(noticeCard(t('empty_title'))); return; }

    var pre = Store.getCommit(pendingRollback);
    var initialCommit = (pre && !pre.planned) ? pre : commits[0];
    pendingRollback = null;
    var scenes = Store.SCENES.filter(function (s) {
      return realCommitsForScene(s.id).length > 0;
    });
    // 'no-chevron' hides the dropdown caret on the rollback pickers (the user found the
    // ⌄ glyphs ugly here); they're still tappable popover triggers, just cleaner-looking.
    var sceneSel = choiceSelect(scenes.map(function (s) {
      return { value: s.id, text: sceneLabel(s) };
    }), initialCommit.scene, 'no-chevron');
    var sel = choiceSelect([], null, 'no-chevron');

    function fillCommitSelect(preferredId) {
      var choices = realCommitsForScene(sceneSel.getValue()).map(function (c) {
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

    function replicateButton(primary) {
      var b = el('button', { class: 'btn replicate-btn' + (primary ? ' primary' : ''), text: '↩︎ ' + t('replicate') });
      b.addEventListener('click', function () { var tgt = Store.getCommit(sel.getValue()); if (tgt) replicateCommit(tgt); });
      return b;
    }

    function imageGallery(c) {
      var imgs = commitImageEntries(c);
      if (!imgs.length) return el('div', { class: 'rollback-no-photo', text: t('no_photo') });
      var first = imgs[0];
      var mainAttrs = { class: 'ref-photo-img', src: first.data, alt: first.name || '' };
      if (first.w && first.h) { mainAttrs.width = first.w; mainAttrs.height = first.h; }
      var kids = [el('img', mainAttrs)];
      if (imgs.length > 1) {
        var strip = el('div', { class: 'rollback-gallery-strip' });
        imgs.slice(1, 10).forEach(function (entry) {
          var attrs = { class: 'rollback-gallery-thumb-img', src: entry.data, alt: '',
            loading: 'lazy', decoding: 'async' };
          if (entry.w && entry.h) { attrs.width = entry.w; attrs.height = entry.h; }
          strip.appendChild(el('span', { class: 'rollback-gallery-thumb' }, [el('img', attrs)]));
        });
        if (imgs.length > 10) strip.appendChild(el('span', { class: 'rollback-gallery-thumb more', text: '+' + (imgs.length - 10) }));
        kids.push(strip);
      }
      return el('div', { class: 'rollback-gallery' }, kids);
    }

    function stateCard(title, c, tone) {
      var card = el('div', { class: 'rollback-state-card ' + tone });
      card.appendChild(el('div', { class: 'rollback-state-title', text: title }));
      card.appendChild(imageGallery(c));
      card.appendChild(el('div', { class: 'rollback-state-message', text: c.message || shortId(c.id) }));
      card.appendChild(el('div', { class: 'detail-sub' }, [
        sceneTag(Store.sceneById(c.scene)),
        el('span', { class: 'commit-dot', text: '·' }),
        el('span', { text: fmtDate(c.createdAt) })
      ]));
      if (c.items && c.items.length) {
        var chips = el('div', { class: 'commit-chips' });
        c.items.slice(0, 10).forEach(function (it) {
          chips.appendChild(el('span', { class: 'chip', text: it.name + (it.qty > 1 ? ' ×' + it.qty : '') }));
        });
        if (c.items.length > 10) chips.appendChild(el('span', { class: 'chip more', text: '+' + (c.items.length - 10) }));
        card.appendChild(chips);
      }
      return card;
    }

    function createRestoreCommit(target, currentC) {
      var L = lang === 'zh';
      var msg = L
        ? '回滚到：' + (target.message || shortId(target.id))
        : 'Restored to: ' + (target.message || shortId(target.id));
      var note = (target.notes ? target.notes + '\n\n' : '') + (L
        ? '由回滚工作台生成。目标存档：' + shortId(target.id) + '；恢复前状态：' + shortId(currentC && currentC.id)
        : 'Created from Rollback Workbench. Target: ' + shortId(target.id) + '; before restore: ' + shortId(currentC && currentC.id));
      var ok = Store.addCommit({
        scene: target.scene,
        message: msg,
        createdAt: Date.now(),
        photo: target.photo || null,
        photoW: target.photoW || null,
        photoH: target.photoH || null,
        items: cloneItems(target.items),
        files: cloneFiles(target.files),
        notes: note,
        rollbackTargetId: target.id,
        rollbackFromId: currentC && currentC.id
      });
      if (!ok) { toast('⚠ ' + (L ? '存储空间不足，无法生成恢复存档' : 'Storage full; restore commit not created')); return; }
      saveRollbackProgress(target.id, []);
      toast('✅ ' + t('rollback_commit_created'));
      autoSync(true);
      go('timeline');
    }

    function build() {
      var target = Store.getCommit(sel.getValue());
      if (!target) return;
      out.innerHTML = '';

      // ----- meal scenes: a rollback is meaningless; offer "照着再记一笔 / 预存档" -----
      if (Store.isMealScene(target.scene)) {
        out.appendChild(el('p', { class: 'rollback-intro', text: t('replicate_meal_hint') }));
        var mealCard = el('div', { class: 'rollback-ref replicate-card' });
        mealCard.appendChild(imageGallery(target));
        mealCard.appendChild(el('div', { class: 'replicate-card-title', text: '🍽 ' + (target.message || shortId(target.id)) }));
        if (target.items && target.items.length) {
          var ml = el('div', { class: 'commit-chips' });
          target.items.forEach(function (it) { ml.appendChild(el('span', { class: 'chip', text: it.name + (it.qty > 1 ? ' ×' + it.qty : '') })); });
          mealCard.appendChild(ml);
        }
        out.appendChild(mealCard);
        out.appendChild(el('div', { class: 'replicate-actions' }, [replicateButton(true)]));
        return;
      }

      var sceneCommits = realCommitsForScene(target.scene); // newest first
      var currentC = sceneCommits[0] || target;
      var d = Diff.itemDiff(currentC.items, target.items);
      var steps = [];
      d.removed.forEach(function (x) {
        steps.push({ kind: 'remove', text: x.name + (x.qty > 1 ? ' ×' + x.qty : '') });
      });
      d.added.forEach(function (x) {
        steps.push({ kind: 'add', text: x.name + (x.qty > 1 ? ' ×' + x.qty : '') });
      });
      d.changed.forEach(function (x) {
        steps.push({ kind: 'add', text: x.name + ': ' + x.from + ' → ' + x.to });
      });
      if (!steps.length) {
        (target.items || []).forEach(function (x) {
          steps.push({ kind: 'check', text: x.name + (x.qty > 1 ? ' ×' + x.qty : '') });
        });
      }
      steps.forEach(function (s) { s.key = rollbackStepKey(s); });

      var saved = rollbackProgress(target.id);
      var hadSaved = Object.keys(saved).length > 0;
      if (hadSaved) out.appendChild(el('div', { class: 'rollback-resume', text: '↺ ' + t('rollback_resume') }));
      out.appendChild(el('p', { class: 'rollback-intro', text: t('rollback_intro') }));
      out.appendChild(el('div', { class: 'rollback-state-grid' }, [
        stateCard(t('rollback_current_state'), currentC, 'current'),
        stateCard(t('rollback_target_state'), target, 'target')
      ]));

      out.appendChild(el('div', { class: 'rollback-diff-summary' }, [
        el('span', { text: '− ' + d.removed.length + ' ' + t('removed') }),
        el('span', { text: '+ ' + d.added.length + ' ' + t('added') }),
        el('span', { text: '~ ' + d.changed.length + ' ' + t('changed_qty') })
      ]));
      if (!d.removed.length && !d.added.length && !d.changed.length) {
        out.appendChild(el('p', { class: 'replicate-hint', text: t('rollback_no_steps') }));
      }

      out.appendChild(el('h3', { class: 'rollback-steps-h', text: t('rollback_steps') }));
      var ol = el('ol', { class: 'rollback-steps' });
      var progressText = el('strong', { id: 'rb-progress', text: '0 / ' + steps.length });
      var meterFill = el('span', { class: 'rb-progress-fill' });
      var checks = [];
      var doneCount = 0;
      function syncProgress(showToast) {
        var keys = [];
        doneCount = 0;
        checks.forEach(function (entry) {
          entry.li.classList.toggle('done', entry.cb.checked);
          if (entry.cb.checked) { doneCount++; keys.push(entry.key); }
        });
        progressText.textContent = doneCount + ' / ' + steps.length;
        meterFill.style.width = steps.length ? Math.round(doneCount * 100 / steps.length) + '%' : '0%';
        saveRollbackProgress(target.id, keys);
        if (showToast) toast(t('rollback_progress_saved'));
      }
      steps.forEach(function (s) {
        var label = { remove: '🗑️ ' + t('step_remove'), add: '📥 ' + t('step_add'),
          check: '✔️ ' + t('step_check') }[s.kind];
        var cb = el('input', { type: 'checkbox' });
        cb.checked = !!saved[s.key];
        var li = el('li', { class: 'rollback-step ' + s.kind }, [
          el('label', {}, [cb,
            el('span', { class: 'step-action', text: label }),
            el('span', { class: 'step-item', text: s.text })])
        ]);
        checks.push({ cb: cb, li: li, key: s.key });
        cb.addEventListener('change', function () { syncProgress(true); });
        ol.appendChild(li);
      });
      out.appendChild(ol);
      out.appendChild(el('div', { class: 'rb-progress-bar' }, [
        el('span', { text: t('done') + ': ' }),
        progressText,
        el('span', { class: 'rb-progress-track' }, [meterFill])
      ]));
      var resetBtn = el('button', { class: 'btn ghost', text: t('rollback_reset_progress') });
      resetBtn.addEventListener('click', function () {
        checks.forEach(function (entry) { entry.cb.checked = false; });
        syncProgress(false);
      });
      var createBtn = el('button', { class: 'btn primary', text: '↩︎ ' + t('rollback_create_commit') });
      createBtn.addEventListener('click', function () { createRestoreCommit(target, currentC); });
      out.appendChild(el('p', { class: 'replicate-hint', text: t('replicate_item_hint') }));
      out.appendChild(el('div', { class: 'replicate-actions' }, [replicateButton(false), resetBtn, createBtn]));
      syncProgress(false);
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
    var contextChoices = [{ value: '', text: t('no_context') }].concat(Store.commits().filter(notPlanned).slice(0, 80).map(function (c) {
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
    // title may be null when the card sits under a settings group header (which titles it)
    var head = title ? [el('div', { class: 'set-card-title', text: title })] : [];
    return el('section', { class: 'set-card' }, head.concat(children));
  }

  var RELEASE_NOTES = [
    ['1.6.0', '2026-06-04', '回滚工作台 + 开屏动画 + 移动端体验收口',
      'Rollback Workbench, splash animation, and mobile experience hardening',
      ['回滚页升级为「回滚工作台」：同时展示当前状态与目标状态，给出恢复差异摘要，恢复步骤支持勾选并自动保存进度，退出后再回来可以继续。',
       '新增「生成恢复存档」：回滚不覆盖历史，而是把目标状态写成一条新的正式存档，并标记来源存档，时间线和详情页都能看到它来自哪次回滚。',
       '多图目标存档在回滚页可直接查看封面与缩略图，不再只靠单张参考图判断；饮食类仍保留「照着再记一笔」而不套用物品回滚。',
       '时间线多图展示继续增强：长截图 / 竖向长图在时间线会压成紧凑预览，避免一张图撑满整屏；详情页仍按原比例完整查看，缩略图也带尺寸信息以减少跳变。',
       '继续收口移动端新建 / 编辑存档页宽度和输入框聚焦：手机上表单更贴近可用宽度，物品行、底部按钮和键盘弹出时的焦点滚动更稳定，并清理 Android WebView 偶发横向漂移。',
       '新增应用开屏动画：保留原生启动图的无白屏冷启动，再用 Web 首屏短动画完成品牌过渡；开启减少动态效果时会自动降级为快速淡出。'],
      ['Rollback is now a workbench: current state and target state are shown together, restore diffs are summarized, checklist progress is saved, and users can resume later.',
       'Add Create restore commit: rollback never overwrites history; it writes the target state as a new real commit and marks the restore source in timeline/detail.',
       'Rollback targets with multiple images now show the cover plus thumbnails; meal scenes still use the log-it-again flow instead of fake item restoration.',
       'Timeline multi-image rendering is more practical: tall screenshots are compact previews in the timeline while the detail page still shows the full original ratio.',
       'Harden mobile new/edit archive width and input focus behavior, including item rows, action buttons, focused-field scrolling, and Android WebView horizontal drift cleanup.',
       'Add a short app splash animation after the native launch image, with reduced-motion fallback.']],
    ['1.5.3', '2026-06-04', '移动端新建存档与现实对比 / 回滚体验修复',
      'Mobile new-archive, Reality Diff, rollback, and timeline polish',
      ['修复移动端新建 / 编辑存档页的卡片和输入框宽度：手机上表单内边距更紧凑，输入框不再显得被挤窄，照片、按钮和场景选择都能更自然地吃满卡片宽度。',
       '继续加固移动端输入框聚焦：滚动兜底会把顶部栏高度算进可视区，时间线搜索、新建存档说明、时间等靠上的输入框不会再被顶到顶部栏下面。',
       '整理现实对比控件排布：删除低价值的“复制文本”按钮，只保留“AI 解读变化”和“导出对比卡片”；导出按钮和 AI 按钮高度统一，手机上不再掉到难看的第二行。',
       '移除面向普通用户意义不大的“敏感度”滑杆：视觉对比继续使用内部固定阈值，显示模式控件独占一行，界面更清爽。',
       '清理回滚页的场景和时间下拉箭头：保留可点选的弹出菜单，但去掉蓝色小箭头，回滚选择区更干净。',
       '修复新存档添加后时间线画面比例/跳变问题：所有拍照、相册、多图、截图、粘贴入口都会记录缩放后的图片尺寸，多图首图兜底也能预留正确比例，时间线不再等图片解码后突然放大。'],
      ['Tighten the mobile new/edit archive form so cards and inputs use the available phone width more naturally.',
       'Harden input focus scrolling by accounting for the top bar when keeping focused fields visible.',
       'Clean up Reality Diff actions by removing Copy text and keeping AI reading plus Export card as the two primary actions.',
       'Remove the user-facing sensitivity slider while keeping a fixed internal image-diff threshold.',
       'Hide rollback picker chevrons while preserving the same tappable anchored menus.',
       'Store downscaled image dimensions across camera, album, multi-photo, screenshot, paste, and fallback-cover paths so new timeline cards reserve the right aspect ratio immediately.']],
    ['1.5.2', '2026-06-04', '删除可彻底同步 + 时间线放大修复 + 多图缩略图 + 设置分组 + 扁平图标',
      'True cloud delete + no timeline pop + photo strip + grouped settings + flat icon',
      ['☁️ 彻底修复「删了又被云端拉回来」：新增删除墓碑并参与云同步——本机删除存档后会在所有已登录设备和云端一起删除，不再因为云端还存着而被重新下载；「清空全部」同样会同步清空云端。云端上比删除更新的编辑仍会保留（编辑优先于过期删除）。',
       '🖼 修复「新建存档后时间线上的存档会放大」：保存封面图时记录其尺寸，时间线 / 详情页据此提前预留图片高度，照片解码完成时卡片不再从小突然撑大。旧存档再次编辑保存后同样生效。',
       '🧩 多图存档在时间线上新增「封面下缩略图条」：封面下方多出一排可横滑的小缩略图，直接看到这条存档的其他照片（超过 8 张显示 +N）；点卡片仍进入详情看完整图库。',
       '📐 修复新建 / 编辑存档页面宽度：桌面端不再把输入框拉到近 1000px 宽，改为更舒适的居中宽度（约 680px），手机端不受影响。',
       '⚙️ 设置界面重新分组、重新排序：账号与云同步置顶，关于（版本 / 检查更新 / 更新日志）置底，中间按「通用（外观语言、AI 识别）」「数据」分组，并加上分组小标题，层次更清晰。',
       '⌨️ 继续加固移动端输入框：在系统视口事件之外再监听 window resize，并补一个较晚的回正帧，键盘弹出动画较慢的机型也能把当前输入框滚动到可见区。',
       '🎨 应用图标底色改为扁平纯色：去掉斜向渐变 + 高光 + 暗角，换成干净的蓝紫纯色底，卡片玻璃质感保留；桌面与安卓图标、启动图已重新生成。']],
    ['1.5.1', '2026-06-04', '新建存档体验整理 + 热力图去下拉符号',
      'New archive polish and a cleaner heatmap title',
      ['顶栏毛玻璃底部的细线已移除，滚动内容和顶部模糊层之间不再有割裂感。',
       '新建 / 编辑存档页面在桌面端会使用更宽的响应式内容宽度，不再被全局阅读宽度压得偏窄，手机端仍保持单列适配。',
       '照片预览右上角新增删除按钮，选错封面图时可以直接清空后重选；「选择多张图片」按钮调整为和「AI 识别照片」同级的大按钮。',
       '新建 / 编辑存档新增「存档时间」字段，允许补录真实发生时间；新增存档的同场景链路会按填写的存档时间寻找上一条正式存档。',
       '新建存档底部的「预存档」按钮去掉图钉表情，只保留干净文字。',
       '存档热力图保留左右切换月份箭头，但删除月份标题下方的下拉符号，日历头部更干净。'],
      ['Removed the thin divider under the frosted top bar so scrolling content blends cleanly into the blur.',
       'The new/edit archive page now uses a wider responsive desktop width while keeping the mobile single-column layout.',
       'The selected cover photo now has a top-right remove button, and the multi-image picker button now matches the AI scan button size.',
       'New/edit archive now includes an Archive time field for backfilling the real timestamp; new archive parent links use that archive time.',
       'The Pre-save button no longer includes the pin emoji.',
       'The Archive heatmap keeps the left/right month arrows, but removes the dropdown glyph under the month title.']],
    ['1.5.0', '2026-06-04', '五项同级导航 + 输入框顶飞修复 + 顶栏模糊回归 + 纯月历热力图 + 现实对比 AI/趋势/导出',
      'Peer tabs, keyboard-pan fix, frosted top bar, pure month-calendar heatmap, and Reality Diff AI / trends / export',
      ['底栏五项（时间线 / 现实对比 / 新建 / 回滚 / 分支）现在完全同级：tab 之间切换不再写入可侧滑返回的页面历史，安卓返回/侧滑只处理设置、详情、热力图等子页面。',
       '修复安卓「点输入框时顶栏和整页被顶飞出屏幕」：Android 改用 Keyboard.resizeOnFullScreen + manifest adjustResize 的可生效路径，并移除会和它打架的 interactive-widget；若可视区没有缩小，则用原生键盘高度做有界兜底。',
       '顶栏毛玻璃模糊回归并加强：之前底层几乎不透明又被遮罩裁没了，现在是更通透的磨砂玻璃（更强模糊 + 底部羽化 + 细发丝高光）；原生端让内容从栏下滚过，模糊真正生效。',
       '「存档热力图」改成纯日历：一次只展示一个月、铺满整屏；用 ‹ › 翻月、点月份标题可快速选年/月；有存档的日子圆点可点，弹出当天存档数量和当天的星标存档。',
       '现实对比按规划全面增强：✨AI 解读变化（把旧版+新版两张照片交给免费 AI，给出「少了/多了/挪到哪」的自然语言总结和清单，无 key 时本地对比照常用）；跨场景任意两版对比（解除「必须同场景」限制）；场景趋势与洞察（相邻存档照片 changedPct 曲线，缺照片时用清单变化兜底 +「最常消失/最稳定/最常新增」）；饮食专属（两餐都有的食物高亮，可选 AI 估算热量）；导出/分享（生成 before/after 对比卡片图或复制对比文本）；近似物品自动归并（「可乐/可口可乐」识别为同一物品，导出也同步归并结果）。',
       '文案统一：新建存档的「存为计划」改为「预存档」、「提交存档」改为「存档」、「物品场景」改为「物品」，与其他场景对齐。',
       '热力图入口按钮里的小方块改成小圆点，呼应日历圆点风格。'],
      ['The five bottom tabs (Timeline / Reality diff / New / Rollback / Branches) are now true peers: tab switches replace history instead of creating swipe-back pages; Back only pops sub-pages such as Settings, Detail, and Heatmap.',
       'Fixed the Android bug where focusing an input flung the whole page and top bar off-screen: Android now uses Keyboard.resizeOnFullScreen + manifest adjustResize, removes the conflicting interactive-widget, and falls back to native keyboard height only when the visual viewport does not shrink.',
       'The frosted top-bar blur is back and stronger: the old layer was nearly opaque and masked away; it is now lighter glass (more blur + a feathered bottom edge + a hairline highlight), and on native the content scrolls under the bar so the blur actually shows.',
       'The Archive heatmap is now a pure calendar: one month at a time, filling the screen; page months with ‹ ›, tap the month title to jump to any year/month, and tap a day-dot to see that day\'s archive count and its starred archives.',
       'Reality Diff got the full planned upgrade: ✨ AI reads the change (both photos go to the free AI for a natural-language "gone / added / moved" summary + lists; local diff still works without a key); cross-scene compare of any two archives; an adjacent-photo changedPct sparkline with item-churn fallback plus "most disappeared / most stable / most added" insights; meal scenes highlight foods present in both, with optional AI calorie estimate; export a before/after card image or copy a text summary; and near-duplicate items (e.g. 可乐 / 可口可乐) are merged as the same item in the UI and exports.',
       'Unified wording in the new-archive form (Chinese): 「存为计划」→「预存档」, 「提交存档」→「存档」, 「物品场景」→「物品」.',
       'The heatmap button\'s little squares are now little circles, echoing the calendar dots.']],
    ['1.4.2', '2026-06-04', '热力图改月历 + 时间线扁平化 + 日期吸顶完全贴合',
      'Calendar heatmap, flat timeline, and a perfectly flush date handoff',
      ['「存档热力图」改成真正的月历：每个月一块日历，用圆点深浅表示当天存档多少；7 列正好铺满手机屏幕，再也不会显示不全、需要左右拖动。今天有高亮圈，未来日期淡显，每月还标注存档数。',
       '左侧时间线整体扁平化重做、更规整：主线收细成一条柔和直线（去掉发光），节点改为干净的纯色实心圆点（去掉高光 / 光晕和多余的连接小线），主线、日期圆点与卡片节点统一对齐到同一条竖线。',
       '日期吸顶衔接彻底重做：滚到下一天时，新日期会完全贴合着旧日期把它顶替出去（紧贴、零缝隙、零重叠），交接随手指顺滑推进，不再有旧版「不丝滑」的跳变或中间露出空隙的瑕疵。',
       '顺手修复：给 styles.css / app.js 等静态资源都加上版本号，确保每次更新后缓存一定刷新，不会再加载到旧样式或旧脚本。'],
      ['The Archive heatmap is now a real month calendar: one calendar block per month, with each day a circle shaded by that day\'s archive count. Seven columns always fit the phone width, so nothing is cut off or needs horizontal scrolling. Today is ringed, future days are dimmed, and each month shows its total.',
       'The left timeline got a flat, more orderly redesign: a thinner calm spine (no glow), clean solid-color commit dots (no gloss/halo or extra connector stub), with the spine, date dots, and card nodes all aligned to one vertical line.',
       'The sticky date handoff was completely reworked: scrolling into a new day, the new date pill sits perfectly flush against the previous one and pushes it out (touching, zero gap, zero overlap), tracking your finger smoothly — no more janky jumps or a gap opening up mid-swap.',
       'Also fixed: all static assets (styles.css, app.js, etc.) now carry a version query string so the cache always refreshes after an update and never serves stale styles or scripts.']],
    ['1.4.1', '2026-06-04', '底栏归位 + 锚定下拉 + 时间线美化 + 票据存档 + 日历热力图',
      'Bottom bar restored, anchored menus, prettier timeline, ticket archives, and a calendar heatmap',
      ['导航栏移回底部（中间是扁平加号），不再占用顶部空间；输入时底栏自动隐藏，避免挡住键盘。',
       '所有选项弹框（场景、版本等）改为「锚定下拉菜单」：点哪儿就在哪儿展开，不再从屏幕底部弹出。',
       '日期标题改为轻盈的悬浮胶囊，吸顶时不再突兀，日期之间的交接更顺滑。',
       '左侧时间线重新美化：渐变主线带柔光、两端淡出，节点是带高光的渐变圆点，更精致。',
       '新增「票据」场景分组：票根票券、购物小票、发票账单，方便归档电影票、车票、小票等。',
       '新增「存档热力图」：点击顶栏左侧的九宫格按钮，按日历用圆点深浅展示每天的存档数量，并附总数 / 活跃天数 / 连续天数 / 单日最多等统计。'],
      ['Move the navigation bar back to the bottom (with a flat centered create button); it hides while typing so it never covers the keyboard.',
       'All option popups (scene, version, etc.) are now anchored dropdowns that open right at the control you tapped instead of sliding up from the screen bottom.',
       'Date headers are now light floating pills — less abrupt when pinned, with a smoother day-to-day handoff while scrolling.',
       'Repolish the left timeline: a softer glowing gradient spine that fades at both ends, and glossy gradient commit dots.',
       'Add a Tickets scene group (ticket stubs, shopping receipts, invoices) for logging movie/transit tickets and receipts.',
       'Add an Archive heatmap: tap the grid button in the top bar to see daily archive counts as a calendar of shaded dots, plus total / active-days / streak / busiest-day stats.']],
    ['1.4.0', '2026-06-03', '顶部导航 + 连续时间轴 + 现实对比增强',
      'Top tabs, connected timeline, and Reality Diff upgrades',
      ['新建存档的原生照片来源只保留「拍照 / 相册」，相册默认多选；额外「选择多张图片」入口会在选中封面后才出现。',
       '移动端导航从底部移到顶部粘性标签栏，避免和键盘/手势区域冲突；顶部毛玻璃在键盘打开时保持可见。',
       '时间线改为连续左侧主线，日期标题粘顶并随日期段自然替换，滚动时始终知道当前存档日期。',
       '输入框聚焦兜底继续加固：即使 WebView 已经 resize，也会用当前滚动容器把焦点字段带回可见区。',
       '现实对比支持详情页「与上一版对比」入口，并新增热力图、左右滑块、淡入闪烁三种视觉模式。',
       '热力图敏感度可调，清单对比会归一化大小写、全半角和尾随数量/单位，减少「牛奶」和「牛奶1盒」这类误报。'],
      ['Native photo source now keeps only Take photo / Album; Album defaults to multi-select, and the extra multi-image control appears after a cover exists.',
       'Move mobile navigation from the bottom to a sticky top tab rail, avoiding keyboard and gesture-area conflicts while preserving the frosted top bar.',
       'Make the timeline rail continuous across day groups; sticky date headers hand off naturally while scrolling.',
       'Harden input focus again by nudging the active field inside the real scroll container even when the WebView already resized.',
       'Reality Diff now has a detail-page Compare previous entry plus heatmap, before/after slider, and fade/blink visual modes.',
       'Add an adjustable heatmap sensitivity slider and normalize item names so casing, full/half-width forms, and trailing quantities/units do not create noisy diffs.']],
    ['1.3.2', '2026-06-03', '时间线瀑布流 + 多图存档 + 饮食计划 + 输入框再加固',
      'Timeline waterfall, multi-image commits, meal plans, and keyboard hardening',
      ['时间线卡片统一为图片在上、内容在下的单列瀑布流；左侧日期节点、连接短线和竖向轨道更清晰。',
       '存档卡片、详情主图、回滚参考图和新建预览都按原图比例展示，不再裁切横图或竖图。',
       '新建存档新增「选择多张图片」按钮，文件选择器支持多选；第一张作封面，其余作为图片附件。',
       '新增「存为计划」：计划浮在时间线顶部，不参与对比 / 回滚 / 真实链路，完成后转为正式存档。',
       '饮食和零食饮品类回滚改为「照着再记一笔」，也可先存为想吃 / 要点的计划。',
       'Android 原生环境锁住 document，只让内容区滚动，进一步避免输入框聚焦时顶栏或整页被输入法推飞。'],
      ['Unify timeline cards into a single-column waterfall with photo-first cards and a stronger left rail.',
       'Show commit photos, detail heroes, rollback references, and form previews at their natural aspect ratio.',
       'Add a dedicated multi-image picker; the first image becomes the cover and the rest become image attachments.',
       'Add planned commits: they float above the timeline, stay out of diff/rollback/history, and become real commits when marked done.',
       'Meal and snack rollback now offers "log it again" or save as a plan instead of fake restore steps.',
       'On native Android, lock document scrolling and let only the content view scroll to reduce input-focus page flinging.']],
    ['1.3.1', '2026-06-03', '键盘根因再修 + 新建即自动同步 + 星标存档 + 扁平加号 + 图标提质',
      'Keyboard hardening, auto-sync, starred commits, flatter create button, and icon polish',
      ['统一只用 visualViewport 处理键盘避让，并把 @capacitor/keyboard resize 改为 none，避免重复缩放布局。',
       '新建存档后自动尝试云同步；编辑、星标等后台变更静默同步。',
       '新增星标存档和重要筛选，重要卡片拥有金色节点。',
       '移动底栏中间加号改为更克制的扁平按钮。',
       '图标与应用内 Logo 统一为更通透的蓝紫层叠卡片。'],
      ['Use visualViewport as the single keyboard-avoidance source and disable Capacitor body resizing.',
       'Auto-sync newly created commits, with quiet background sync for edits and stars.',
       'Add starred commits plus an important filter and amber timeline nodes.',
       'Flatten the centered mobile create button.',
       'Polish the icon and in-app logo with the blue-purple card-stack mark.']],
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

  /* ---------------- Stats: month calendar (日历格式) ----
     A heatmap of how many archives land on each day, drawn as a REAL month calendar:
     one block per month (newest on top), each day a circle (圆形) shaded by that day's
     archive count (分颜色深浅). 7 columns always fit the phone width, so nothing is cut
     off. Reached from the topbar grid button, left of the settings gear. */
  // The month the heatmap calendar is currently showing (persists across renders this
  // session). null until first opened → defaults to the current month.
  var statsView = null;
  function dayCountMap() {
    var map = {};
    Store.commits().filter(notPlanned).forEach(function (c) {
      var k = dayKey(c.createdAt);
      map[k] = (map[k] || 0) + 1;
    });
    return map;
  }
  function heatLevel(n) {
    if (!n) return 0;
    if (n >= 6) return 4;
    if (n >= 4) return 3;
    if (n >= 2) return 2;
    return 1;
  }
  // real (non-planned) commits archived on a given day timestamp, newest first
  function commitsOnDay(ts) {
    var k = dayKey(ts);
    return Store.commits().filter(notPlanned).filter(function (c) { return dayKey(c.createdAt) === k; });
  }
  function renderStats(v) {
    var L = lang === 'zh';
    var back = el('button', {
      type: 'button', class: 'subpage-back', text: '‹ ' + t('nav_timeline'),
      onclick: function () { window.history.back(); }
    });
    v.appendChild(el('div', { class: 'subpage-head' }, [back, el('h1', { text: t('stats_title') })]));

    var counts = dayCountMap();
    var keys = Object.keys(counts);
    if (!keys.length) {
      v.appendChild(el('div', { class: 'tl-empty' }, [
        el('div', { class: 'tl-empty-ic', text: '📅' }),
        el('div', { text: t('stats_empty') })
      ]));
      return;
    }

    // ---- summary tiles: total / active days / current streak / busiest day ----
    var total = 0, busiest = 0;
    keys.forEach(function (k) { total += counts[k]; if (counts[k] > busiest) busiest = counts[k]; });
    var activeDays = keys.length;
    // current streak: consecutive days (ending today or yesterday) with >=1 archive
    var streak = 0;
    (function () {
      var d = new Date(); d.setHours(0, 0, 0, 0);
      if (!counts[dayKey(d.getTime())]) d.setDate(d.getDate() - 1); // allow "yesterday" to keep a streak alive
      while (counts[dayKey(d.getTime())]) { streak++; d.setDate(d.getDate() - 1); }
    })();
    function tile(label, value) {
      return el('div', { class: 'stat-tile' }, [
        el('span', { class: 'stat-tile-val', text: String(value) }),
        el('span', { class: 'stat-tile-label', text: label })
      ]);
    }
    v.appendChild(el('div', { class: 'stat-tiles' }, [
      tile(t('stats_total'), total),
      tile(t('stats_active_days'), activeDays),
      tile(t('stats_streak'), streak),
      tile(t('stats_busiest'), busiest)
    ]));

    var monthsEn = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    var monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var weekdayLabels = t('stats_weekday'); // ['日','一',…] / ['S','M',…], week starts Sunday

    if (!statsView) { var nd = new Date(); statsView = { year: nd.getFullYear(), month: nd.getMonth() }; }

    // ---- single-month calendar (pure 日历样式), paged by month/year ----
    var card = el('section', { class: 'set-card cal-card' });
    var calWrap = el('div', { class: 'cal-wrap' });
    card.appendChild(calWrap);

    // legend: 少 ○○○○○ 多 (circles)
    var legend = el('div', { class: 'cal-legend' });
    legend.appendChild(el('span', { class: 'cal-legend-cap', text: t('stats_legend_less') }));
    for (var lv = 0; lv <= 4; lv++) legend.appendChild(el('span', { class: 'cal-dot lvl-' + lv }));
    legend.appendChild(el('span', { class: 'cal-legend-cap', text: t('stats_legend_more') }));
    card.appendChild(legend);
    v.appendChild(card);

    function stepMonth(delta) {
      var d = new Date(statsView.year, statsView.month + delta, 1);
      statsView = { year: d.getFullYear(), month: d.getMonth() };
      drawCal();
    }

    // Compact month/year picker (tap the title). A year stepper + a 12-month grid.
    function openMonthPicker(anchor) {
      var pickYear = statsView.year;
      var wrap = el('div', { class: 'mp' });
      function build() {
        wrap.innerHTML = '';
        wrap.appendChild(el('div', { class: 'mp-year' }, [
          el('button', { type: 'button', class: 'mp-arrow', text: '‹',
            onclick: function () { pickYear--; build(); } }),
          el('span', { class: 'mp-year-val', text: L ? (pickYear + '年') : String(pickYear) }),
          el('button', { type: 'button', class: 'mp-arrow', text: '›',
            onclick: function () { pickYear++; build(); } })
        ]));
        var grid = el('div', { class: 'mp-grid' });
        for (var m = 0; m < 12; m++) {
          (function (m) {
            var active = pickYear === statsView.year && m === statsView.month;
            grid.appendChild(el('button', {
              type: 'button', class: 'mp-month' + (active ? ' active' : ''),
              text: L ? (m + 1) + '月' : monthsShort[m],
              onclick: function () { statsView = { year: pickYear, month: m }; closePopover(); drawCal(); }
            }));
          })(m);
        }
        wrap.appendChild(grid);
      }
      build();
      openAnchoredMenu(anchor, { content: wrap });
    }

    // Tap a day-dot → its archive count + that day's starred archives.
    function openDayPanel(anchor, ts) {
      var dayCommits = commitsOnDay(ts);
      var starred = dayCommits.filter(function (c) { return c.starred; });
      var content = el('div', { class: 'day-panel' });
      content.appendChild(el('div', { class: 'day-panel-head' }, [
        el('span', { class: 'day-panel-date', text: dayLabel(ts) }),
        el('span', { class: 'day-panel-count', text: dayCommits.length + ' ' + t('stats_archives_unit') })
      ]));
      if (starred.length) {
        content.appendChild(el('div', { class: 'day-panel-sub', text: '⭐ ' + t('stats_starred') }));
        var list = el('div', { class: 'day-panel-list' });
        starred.forEach(function (c) {
          var sc = Store.sceneById(c.scene);
          var ic = el('span', { class: 'scene-ic' }); ic.innerHTML = sceneIconSVG(sc.id);
          list.appendChild(el('button', {
            type: 'button', class: 'day-panel-item',
            onclick: function () { closePopover(); pendingDetail = c.id; go('detail'); }
          }, [
            ic,
            el('span', { class: 'day-panel-msg', text: c.message || sceneName(sc) }),
            el('span', { class: 'day-panel-time', text: fmtTime(c.createdAt) })
          ]));
        });
        content.appendChild(list);
      } else {
        content.appendChild(el('div', { class: 'day-panel-empty', text: t('stats_no_starred') }));
      }
      openAnchoredMenu(anchor, { content: content });
    }

    // Draw exactly one month (statsView): a month-nav header + weekday row + day circles.
    function drawCal() {
      calWrap.innerHTML = '';
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var todayKeyStr = dayKey(today.getTime());
      var year = statsView.year, month = statsView.month;
      var firstDow = new Date(year, month, 1).getDay();   // 0 = Sunday
      var daysIn = new Date(year, month + 1, 0).getDate();

      var monthTotal = 0;
      for (var d0 = 1; d0 <= daysIn; d0++) monthTotal += counts[dayKey(new Date(year, month, d0).getTime())] || 0;

      var titleBtn = el('button', { type: 'button', class: 'cal-title-btn',
        'aria-label': t('stats_pick_month'), onclick: function () { openMonthPicker(titleBtn); } }, [
        el('span', { class: 'cal-title-main',
          text: L ? (year + '年' + (month + 1) + '月') : (monthsEn[month] + ' ' + year) }),
        el('span', { class: 'cal-title-sub',
          text: (monthTotal ? monthTotal : 0) + ' ' + t('stats_archives_unit') })
      ]);
      var nav = el('div', { class: 'cal-nav' }, [
        el('button', { type: 'button', class: 'cal-nav-btn', 'aria-label': L ? '上个月' : 'Previous month',
          text: '‹', onclick: function () { stepMonth(-1); } }),
        titleBtn,
        el('button', { type: 'button', class: 'cal-nav-btn', 'aria-label': L ? '下个月' : 'Next month',
          text: '›', onclick: function () { stepMonth(1); } })
      ]);

      var wdRow = el('div', { class: 'cal-weekhead' });
      for (var i = 0; i < 7; i++) wdRow.appendChild(el('span', { class: 'cal-wd', text: weekdayLabels[i] }));

      var grid = el('div', { class: 'cal-grid' });
      for (var b = 0; b < firstDow; b++) grid.appendChild(el('span', { class: 'cal-cell cal-blank' }));
      for (var day = 1; day <= daysIn; day++) {
        var dt = new Date(year, month, day);
        var k = dayKey(dt.getTime());
        var future = dt.getTime() > today.getTime();
        var n = counts[k] || 0;
        var clickable = !future && n > 0;
        var cls = 'cal-cell cal-day lvl-' + heatLevel(n)
          + (future ? ' is-future' : '') + (k === todayKeyStr ? ' is-today' : '')
          + (clickable ? ' is-clickable' : '');
        var cell = el('span', { class: cls,
          title: (year + '-' + (month + 1) + '-' + day) + (future ? '' : ' · ' + n + ' ' + t('stats_archives_unit')) },
          [el('span', { class: 'cal-num', text: String(day) })]);
        if (clickable) (function (ts, anchor) {
          anchor.addEventListener('click', function () { openDayPanel(anchor, ts); });
        })(dt.getTime(), cell);
        grid.appendChild(cell);
      }

      calWrap.appendChild(el('div', { class: 'cal-month' }, [nav, wdRow, grid]));
    }
    drawCal();
  }

  function segmented(options, currentVal, onPick) {
    var root = el('div', { class: 'seg' }, options.map(function (o) {
      var b = el('button', { class: 'seg-btn' + (o[0] === currentVal ? ' active' : ''),
        text: o[1], 'data-value': o[0] });
      b.addEventListener('click', function () {
        root.querySelectorAll('.seg-btn').forEach(function (x) {
          x.classList.toggle('active', x === b);
        });
        onPick(o[0]);
      });
      return b;
    }));
    return root;
  }

  function accountCard() {
    var L = lang === 'zh';
    // titled by its settings group header (see renderSettings) — no in-card title

    // 1) not configured -> ask for Supabase project URL + anon key
    if (!Cloud.configured()) {
      var urlI = el('input', { class: 'field', type: 'text', placeholder: 'Supabase URL（https://xxx.supabase.co）' });
      var keyI = el('input', { class: 'field', type: 'text', placeholder: 'Supabase anon key' });
      var saveB = el('button', { class: 'btn primary tiny', text: L ? '保存配置' : 'Save' });
      saveB.addEventListener('click', function () {
        if (!urlI.value.trim() || !keyI.value.trim()) { toast(L ? '请填写 URL 和 anon key' : 'Fill both fields'); return; }
        Cloud.setCfg(urlI.value, keyI.value); toast(L ? '已保存配置' : 'Saved'); render();
      });
      return settingsCard(null, [
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
      return settingsCard(null, [
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
    var about = settingsCard(null, [
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
    var data = settingsCard(null, [
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

    // grouped + reordered: account on top, about at the bottom (conventional settings order),
    // with section headers clustering related cards.
    var L = lang === 'zh';
    function setGroup(zh, en, cards) {
      return el('section', { class: 'set-group' },
        [el('h2', { class: 'set-group-title', text: L ? zh : en })].concat(cards));
    }
    v.appendChild(el('div', { class: 'settings-wrap' }, [
      setGroup('账号与云同步', 'Account & sync', [account]),
      setGroup('通用', 'General', [appearance, ai]),
      setGroup('数据', 'Data', [data]),
      setGroup('关于', 'About', [about])
    ]));
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
  // Measure the topbar's real height into --topbar-h so the native shell can pad .view
  // below the (now absolutely-positioned, content-scrolls-under) frosted bar. Safe-area
  // insets land async, so this is re-run after boot + on resize.
  function syncTopbarHeight() {
    var tb = document.querySelector('.topbar');
    if (tb) document.documentElement.style.setProperty('--topbar-h', tb.offsetHeight + 'px');
  }

  function initNative() {
    try {
      var Cap = window.Capacitor;
      if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
      // lock the document to the visual viewport and scroll ONLY the content area
      // (CSS `body.native`), so the Android IME can't pan the topbar off-screen.
      document.body.classList.add('native');
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
     SYMPTOM (user-reported, recurring): focusing an input flings the WHOLE page + topbar
     off-screen. CAUSE: the app is edge-to-edge (for safe-area insets); with the keyboard
     plugin set to resize:'none', Android is free to adjustPan and it pans the entire
     WebView surface up behind the keyboard — CSS can't stop an OS-level window pan, so the
     topbar goes with it. The previous "web-layer only" fix (viewport interactive-widget=
     resizes-content + visualViewport) relied on the WebView honoring interactive-widget;
     on the user's device it did NOT, so the pan still happened.

     PRIMARY FIX (v1.5.0): Android uses @capacitor/keyboard resizeOnFullScreen:true
     plus manifest adjustResize. Capacitor's `resize` option is iOS-only, so the Android
     path must use resizeOnFullScreen; it resizes the WebView child in fullscreen/
     edge-to-edge cases where plain adjustResize can be ignored. We removed
     interactive-widget=resizes-content so the browser does not also shrink the layout.

     BACKUP: visualViewport remains the first source of truth. If it visibly shrank, we
     trust it. If it did NOT shrink but Android native keyboard events report a height,
     we use that height as a bounded fallback for bottom padding + field visibility. */
  function isTextField(n) { return !!(n && n.tagName && /^(INPUT|TEXTAREA)$/.test(n.tagName)); }
  var nativeKeyboardPx = 0;
  var keyboardInsetPx = 0;
  var keyboardInsetMode = 'none'; // 'visual' or 'native-fallback'
  var kbBaselineHeight = window.innerHeight || 0;
  // px the keyboard overlaps the content, straight from the visual viewport.
  function kbOverlayPx() {
    var vv = window.visualViewport;
    return vv ? Math.max(0, window.innerHeight - vv.height) : 0;
  }
  function nativeKeyboardHeight(info) {
    return Math.max(0, parseInt(info && info.keyboardHeight, 10) || 0);
  }
  function setKeyboardInset(px, mode) {
    keyboardInsetPx = Math.max(0, px || 0);
    keyboardInsetMode = keyboardInsetPx > 0 ? (mode || 'visual') : 'none';
    document.documentElement.style.setProperty('--keyboard-inset', keyboardInsetPx + 'px');
  }
  var kbEnsureTimer = null;
  function scheduleEnsureFieldVisible(ms) {
    clearTimeout(kbEnsureTimer);
    kbEnsureTimer = setTimeout(ensureFieldVisible, ms || 0);
  }
  function scheduleEnsureFieldVisibleBurst() {
    scheduleEnsureFieldVisible(0);
    setTimeout(ensureFieldVisible, 90);
    setTimeout(ensureFieldVisible, 240);
    setTimeout(ensureFieldVisible, 420);
    setTimeout(ensureFieldVisible, 700); // one late tick for slow IME open animations
  }
  function fieldScrollHost(node) {
    if (!node || !node.closest) return null;
    var sheet = node.closest('.choice-sheet');
    if (sheet) return sheet;
    var view = document.getElementById('view');
    if (view && view.contains(node) && (document.body.classList.contains('native') ||
        window.matchMedia('(max-width:720px)').matches)) return view;
    return null;
  }
  function resetHorizontalDrift() {
    try {
      var view = document.getElementById('view');
      if (view) view.scrollLeft = 0;
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
    } catch (e) {}
  }
  function ensureFieldVisible() {
    var vv = window.visualViewport, node = document.activeElement;
    if (!vv || !isTextField(node)) return;
    resetHorizontalDrift();
    var r = node.getBoundingClientRect();
    // floor the "visible top" at the bottom of the (absolute/sticky) topbar, so a focused
    // field near the top of the page is never left tucked behind the bar (see the timeline
    // search box). getBoundingClientRect().bottom works for both native-absolute & sticky.
    var tb = document.querySelector('.topbar');
    var topbarBottom = tb ? Math.max(0, tb.getBoundingClientRect().bottom) : 0;
    var visibleTop = Math.max(vv.offsetTop + 12, topbarBottom + 10);
    var nativeFallback = keyboardInsetMode === 'native-fallback' ? keyboardInsetPx : 0;
    var visibleBottom = vv.offsetTop + vv.height - nativeFallback - 18;
    var delta = 0;
    if (r.bottom > visibleBottom) delta = r.bottom - visibleBottom;
    else if (r.top < visibleTop) delta = r.top - visibleTop;
    if (Math.abs(delta) <= 4) return;
    // native shell locks the document (overflow:hidden), so the scroller is .view;
    // elsewhere the document itself scrolls. Either way the nudge stays bounded.
    var nudge = Math.max(-600, Math.min(600, delta));
    var sc = fieldScrollHost(node);
    if (sc) sc.scrollTop += nudge;
    else window.scrollBy({ top: nudge, behavior: 'auto' });
    resetHorizontalDrift();
  }
  // Reconcile inset + nav-hide from visualViewport first, then native keyboard height
  // only when the viewport did not shrink. This avoids both known failures: no fallback
  // on old Android, or double-padding when modern WebView already resized correctly.
  function syncKeyboardState() {
    var overlap = kbOverlayPx();
    var vv = window.visualViewport;
    var viewportHeight = vv ? vv.height : window.innerHeight;
    var viewportShrank = (kbBaselineHeight - viewportHeight) > 80;
    var useNativeFallback = !viewportShrank && overlap < 40 && nativeKeyboardPx > 80;
    setKeyboardInset(useNativeFallback ? nativeKeyboardPx : overlap,
      useNativeFallback ? 'native-fallback' : 'visual');
    document.body.classList.toggle('kb-open', overlap > 80 || nativeKeyboardPx > 80);
    if (!document.body.classList.contains('kb-open')) {
      kbBaselineHeight = window.innerHeight || kbBaselineHeight;
    }
    scheduleEnsureFieldVisibleBurst();
  }
  function initKeyboard() {
    var vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', syncKeyboardState);
      vv.addEventListener('scroll', function () { scheduleEnsureFieldVisible(0); });
    }
    // Some Android WebViews fire window 'resize' (the resizeOnFullScreen child resize) but
    // not always visualViewport 'resize' — reconcile on both so the inset/nav-hide and the
    // field-into-view nudge never get stuck because one event didn't fire.
    window.addEventListener('resize', syncKeyboardState);
    document.addEventListener('focusin', function (e) {
      if (isTextField(e.target)) {
        resetHorizontalDrift();
        scheduleEnsureFieldVisibleBurst();
      }
    });
    try {
      var Cap = window.Capacitor;
      if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
      var KB = Cap.Plugins && Cap.Plugins.Keyboard;
      if (!KB || !KB.addListener) return;
      // Native events hide the nav promptly and provide the Android fallback height.
      KB.addListener('keyboardWillShow', function (info) {
        nativeKeyboardPx = nativeKeyboardHeight(info);
        document.body.classList.add('kb-open');
        scheduleEnsureFieldVisibleBurst();
      });
      KB.addListener('keyboardDidShow', function (info) {
        nativeKeyboardPx = nativeKeyboardHeight(info) || nativeKeyboardPx;
        syncKeyboardState();
      });
      KB.addListener('keyboardWillHide', function () {
        nativeKeyboardPx = 0;
        document.body.classList.remove('kb-open');
      });
      KB.addListener('keyboardDidHide', function () {
        nativeKeyboardPx = 0;
        setKeyboardInset(0);
        document.body.classList.remove('kb-open');
        setTimeout(function () { kbBaselineHeight = window.innerHeight || kbBaselineHeight; }, 50);
      });
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
     Back walks the real navigation history (navStack), so the 4 browse tabs behave as
     PEERS: pressing back returns to whichever tab you came from, never force-snapping to
     the timeline (the old behavior that made the other tabs feel like timeline subpages).
     Subpages pop back to their opener via the same stack. Exits only when history is empty.
     Needs @capacitor/app. */
  function initBackButton() {
    var Cap = window.Capacitor;
    if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
    var App = Cap.Plugins && Cap.Plugins.App;
    if (!App || !App.addListener) return;
    App.addListener('backButton', function () {
      // close an open popover/menu first if one is up
      if ($('.popover-mask')) { closePopover(); return; }
      if (!goBack()) App.exitApp();
    });
  }

  function hideSplash(bootStartedAt) {
    var splash = $('#splash-screen');
    if (!splash) return;
    var elapsed = Date.now() - (bootStartedAt || Date.now());
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var wait = reduce ? 80 : Math.max(120, 850 - elapsed);
    setTimeout(function () {
      splash.classList.add('is-done');
      setTimeout(function () { if (splash && splash.parentNode) splash.parentNode.removeChild(splash); }, reduce ? 160 : 520);
    }, wait);
  }

  /* ---------------- boot ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var bootStartedAt = Date.now();
    $('#tagline').textContent = t('tagline');
    var _brand = document.querySelector('.brand-name'); if (_brand) _brand.textContent = t('brand');
    var _set = document.getElementById('settings-btn');
    if (_set) _set.addEventListener('click', function () { go('settings'); });
    var _stats = document.getElementById('stats-btn');
    if (_stats) _stats.addEventListener('click', function () { go('stats'); });
    initNative();
    initKeyboard();
    initBackButton();
    var r = location.hash.slice(1);
    if (routes.indexOf(r) >= 0) current = r;
    renderNav();
    syncTopbarHeight();
    window.addEventListener('resize', syncTopbarHeight);
    // Hydrate the store (IndexedDB) before the first content render.
    Store.init().then(function () {
      render();
      hideSplash(bootStartedAt);
      // re-measure once layout + async safe-area insets have settled
      syncTopbarHeight();
      setTimeout(syncTopbarHeight, 300);
      if (Cloud.configured()) Cloud.refreshUser().then(function () { if (current === 'settings') render(); });
    });
  });
})();
