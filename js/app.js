/* RealityGit — UI, routing, and feature wiring. Vanilla JS, no build step. */
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
      items: '物品 / 清单', notes: '备注', files: '文件（仅记录名称）',
      add_item: '+ 添加一项', item_name: '物品名', item_qty: '数量',
      save_commit: '提交存档', cancel: '取消',
      commit_placeholder: '例如：出门去学校前，带电脑和充电器',
      latest: '最新', base: '旧版本 (base)', compare: '新版本 (compare)',
      run_diff: '对比', changed: '画面变化', heat_hint: '变化最明显的区域',
      added: '多了', removed: '少了', changed_qty: '数量变化', kept: '保持不变',
      no_change: '两个版本几乎一致 👍',
      rollback_pick: '选择要恢复到的存档', rollback_steps: '恢复步骤',
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
      reference: '目标参考图', current_state: '当前状态',
      no_photo: '（无照片）', items_count: '项', files_label: '文件',
      seed_done: '已载入示例数据', export: '导出 JSON', clear: '清空全部',
      confirm_clear: '确定清空全部数据？此操作不可撤销。',
      need_two: '该场景至少需要两个存档才能对比。',
      branch_pending: '等待复盘', branch_reviewed: '已复盘',
      would_repeat_yes: '👍 下次还这么选', would_repeat_no: '👎 下次换个选择',
      parent: '基于', root: '初始存档', commits_in: '个存档'
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
      items: 'Items / checklist', notes: 'Notes', files: 'Files (names only)',
      add_item: '+ Add item', item_name: 'Item', item_qty: 'Qty',
      save_commit: 'Commit', cancel: 'Cancel',
      commit_placeholder: 'e.g. Leaving for school — laptop + charger packed',
      latest: 'latest', base: 'Old version (base)', compare: 'New version (compare)',
      run_diff: 'Diff', changed: 'pixels changed', heat_hint: 'Hottest change zones',
      added: 'Added', removed: 'Missing', changed_qty: 'Qty changed', kept: 'Unchanged',
      no_change: 'The two versions look nearly identical 👍',
      rollback_pick: 'Pick the commit to restore to', rollback_steps: 'Restore steps',
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
      reference: 'Target reference', current_state: 'Current state',
      no_photo: '(no photo)', items_count: 'items', files_label: 'Files',
      seed_done: 'Demo data loaded', export: 'Export JSON', clear: 'Clear all',
      confirm_clear: 'Clear all data? This cannot be undone.',
      need_two: 'This scene needs at least two commits to diff.',
      branch_pending: 'Awaiting review', branch_reviewed: 'Reviewed',
      would_repeat_yes: '👍 Would repeat', would_repeat_no: '👎 Would change',
      parent: 'based on', root: 'initial commit', commits_in: 'commits'
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
  function shortId(id) { return (id || '').split('_').pop().slice(0, 6); }
  function toast(msg) {
    var node = $('#toast');
    node.textContent = msg;
    node.classList.add('show');
    clearTimeout(node._t);
    node._t = setTimeout(function () { node.classList.remove('show'); }, 2200);
  }

  /* ---------------- image downscale (keep localStorage small) ---------------- */
  function downscale(file, maxW) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var w = img.width, h = img.height;
          if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
          var c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL('image/jpeg', 0.72));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ---------------- routing ---------------- */
  var routes = ['timeline', 'commit', 'diff', 'rollback', 'branch'];
  var current = 'timeline';

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

  function renderNav() {
    var nav = $('#nav');
    nav.innerHTML = '';
    var items = [
      ['timeline', '🌳', t('nav_timeline')],
      ['commit', '➕', t('nav_commit')],
      ['diff', '🔍', t('nav_diff')],
      ['rollback', '⏮️', t('nav_rollback')],
      ['branch', '🔀', t('nav_branch')]
    ];
    items.forEach(function (it) {
      nav.appendChild(el('button', {
        class: 'nav-btn' + (current === it[0] ? ' active' : ''),
        onclick: function () { go(it[0]); }
      }, [el('span', { class: 'nav-ic', text: it[1] }), el('span', { text: it[2] })]));
    });
  }

  /* ---------------- main render switch ---------------- */
  var view = function () { return $('#view'); };

  function render() {
    var v = view();
    v.innerHTML = '';
    v.scrollTop = 0;
    if (current === 'timeline') renderTimeline(v);
    else if (current === 'commit') renderCommitForm(v);
    else if (current === 'diff') renderDiff(v);
    else if (current === 'rollback') renderRollback(v);
    else if (current === 'branch') renderBranch(v);
  }

  /* ---------------- Timeline ---------------- */
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

    // group by scene -> show each scene as a "repo branch"
    var byScene = {};
    commits.forEach(function (c) { (byScene[c.scene] = byScene[c.scene] || []).push(c); });

    var head = el('div', { class: 'view-head' }, [
      el('h1', { text: t('nav_timeline') }),
      el('div', { class: 'head-actions' }, [
        el('button', { class: 'btn tiny ghost', text: t('export'), onclick: exportData }),
        el('button', { class: 'btn tiny danger-ghost', text: t('clear'), onclick: clearAll })
      ])
    ]);
    v.appendChild(head);

    Store.SCENES.forEach(function (scene) {
      var list = byScene[scene.id];
      if (!list || !list.length) return;
      var group = el('section', { class: 'scene-group' });
      group.appendChild(el('div', { class: 'scene-head' }, [
        el('span', { class: 'scene-title', text: sceneLabel(scene) }),
        el('span', { class: 'scene-count', text: list.length + ' ' + t('commits_in') })
      ]));

      var rail = el('div', { class: 'commit-rail' });
      list.forEach(function (c, i) {
        rail.appendChild(commitCard(c, i === list.length - 1));
      });
      group.appendChild(rail);
      v.appendChild(group);
    });
  }

  function commitCard(c, isRoot) {
    var thumb = c.photo
      ? el('div', { class: 'commit-thumb', style: 'background-image:url(' + c.photo + ')' })
      : el('div', { class: 'commit-thumb noimg', text: t('no_photo') });

    var meta = el('div', { class: 'commit-meta' }, [
      el('div', { class: 'commit-msg', text: c.message || '(no message)' }),
      el('div', { class: 'commit-sub' }, [
        el('span', { class: 'commit-hash', text: shortId(c.id) }),
        el('span', { class: 'commit-dot', text: '·' }),
        el('span', { text: fmtDate(c.createdAt) }),
        el('span', { class: 'commit-dot', text: '·' }),
        el('span', { text: (c.items ? c.items.length : 0) + ' ' + t('items_count') })
      ])
    ]);

    var chips = el('div', { class: 'commit-chips' });
    if (isRoot) chips.appendChild(el('span', { class: 'chip root', text: t('root') }));
    (c.items || []).slice(0, 6).forEach(function (it) {
      chips.appendChild(el('span', { class: 'chip',
        text: it.name + (it.qty > 1 ? ' ×' + it.qty : '') }));
    });
    if ((c.items || []).length > 6) {
      chips.appendChild(el('span', { class: 'chip more', text: '+' + (c.items.length - 6) }));
    }

    var actions = el('div', { class: 'commit-actions' }, [
      el('button', { class: 'btn tiny', text: '🔍 ' + t('nav_diff'),
        onclick: function () { go('diff'); } }),
      el('button', { class: 'btn tiny', text: '⏮️ ' + t('nav_rollback'),
        onclick: function () { pendingRollback = c.id; go('rollback'); } }),
      el('button', { class: 'btn tiny danger-ghost', text: t('delete'),
        onclick: function () {
          if (confirm(t('confirm_delete'))) { Store.deleteCommit(c.id); render(); }
        } })
    ]);

    var body = el('div', { class: 'commit-body' }, [meta, chips,
      c.notes ? el('div', { class: 'commit-notes', text: c.notes }) : null, actions]);
    return el('div', { class: 'commit-card' }, [thumb, body]);
  }

  /* ---------------- New commit form ---------------- */
  var draftPhoto = null;
  function renderCommitForm(v) {
    draftPhoto = null;
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_commit') })]));

    var sceneSel = el('select', { class: 'field' });
    Store.SCENES.forEach(function (s) {
      sceneSel.appendChild(el('option', { value: s.id, text: sceneLabel(s) }));
    });

    var msgInput = el('input', { class: 'field', type: 'text', placeholder: t('commit_placeholder') });
    var notesInput = el('textarea', { class: 'field', rows: '2' });

    var preview = el('div', { class: 'photo-drop' }, [
      el('span', { class: 'photo-hint', text: '📷 ' + t('photo') })
    ]);
    var fileInput = el('input', { type: 'file', accept: 'image/*', style: 'display:none' });
    fileInput.addEventListener('change', function () {
      if (!fileInput.files || !fileInput.files[0]) return;
      downscale(fileInput.files[0], 900).then(function (dataUrl) {
        draftPhoto = dataUrl;
        preview.innerHTML = '';
        preview.style.backgroundImage = 'url(' + dataUrl + ')';
        preview.classList.add('has-photo');
      });
    });
    preview.addEventListener('click', function () { fileInput.click(); });

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
    addItemRow();

    var form = el('div', { class: 'form-card' }, [
      labeled(t('scene'), sceneSel),
      labeled(t('message'), msgInput),
      labeled(t('photo'), el('div', {}, [preview, fileInput])),
      labeled(t('items'), el('div', {}, [itemsWrap,
        el('button', { class: 'btn tiny ghost', text: t('add_item'),
          onclick: function () { addItemRow(); } })])),
      labeled(t('notes'), notesInput),
      el('div', { class: 'form-actions' }, [
        el('button', { class: 'btn ghost', text: t('cancel'),
          onclick: function () { go('timeline'); } }),
        el('button', { class: 'btn primary', text: t('save_commit'), onclick: function () {
          var items = [];
          itemsWrap.querySelectorAll('.item-row').forEach(function (r) {
            var n = $('.item-name', r).value.trim();
            if (n) items.push({ name: n, qty: parseInt($('.item-qty', r).value, 10) || 1 });
          });
          var commit = {
            scene: sceneSel.value,
            message: msgInput.value.trim() || '(no message)',
            photo: draftPhoto,
            items: items,
            notes: notesInput.value.trim()
          };
          var ok = Store.addCommit(commit);
          if (!ok) { toast('⚠ ' + (lang === 'zh' ? '存储空间不足，请删除旧照片' : 'Storage full')); return; }
          toast('✅ ' + t('save_commit'));
          go('timeline');
        } })
      ])
    ]);
    v.appendChild(form);
  }

  function labeled(label, control) {
    return el('label', { class: 'labeled' }, [
      el('span', { class: 'label-text', text: label }), control]);
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
    var sceneSel = el('select', { class: 'field' });
    var scenesWith2 = Store.SCENES.filter(function (s) {
      return Store.commitsForScene(s.id).length >= 2;
    });
    if (!scenesWith2.length) { v.appendChild(noticeCard(t('need_two'))); return; }
    scenesWith2.forEach(function (s) {
      sceneSel.appendChild(el('option', { value: s.id, text: sceneLabel(s) }));
    });

    var baseSel = el('select', { class: 'field' });
    var compSel = el('select', { class: 'field' });

    function fillVersionSelects() {
      var list = Store.commitsForScene(sceneSel.value); // newest first
      baseSel.innerHTML = ''; compSel.innerHTML = '';
      list.forEach(function (c) {
        var label = fmtDate(c.createdAt) + ' · ' + (c.message || shortId(c.id));
        baseSel.appendChild(el('option', { value: c.id, text: label }));
        compSel.appendChild(el('option', { value: c.id, text: label }));
      });
      // default: base = older (second item), compare = newest
      compSel.selectedIndex = 0;
      baseSel.selectedIndex = Math.min(1, list.length - 1);
    }
    fillVersionSelects();
    sceneSel.addEventListener('change', function () { fillVersionSelects(); runDiff(); });

    var controls = el('div', { class: 'diff-controls' }, [
      labeled(t('scene'), sceneSel),
      labeled(t('base'), baseSel),
      labeled(t('compare'), compSel),
      el('button', { class: 'btn primary', text: '🔍 ' + t('run_diff'), onclick: function () { runDiff(); } })
    ]);
    v.appendChild(controls);

    var result = el('div', { class: 'diff-result' });
    v.appendChild(result);

    baseSel.addEventListener('change', runDiff);
    compSel.addEventListener('change', runDiff);

    function runDiff() {
      var base = Store.getCommit(baseSel.value);
      var comp = Store.getCommit(compSel.value);
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

    var sel = el('select', { class: 'field' });
    commits.forEach(function (c) {
      var s = Store.sceneById(c.scene);
      sel.appendChild(el('option', { value: c.id,
        text: sceneLabel(s) + ' · ' + fmtDate(c.createdAt) + ' · ' + (c.message || shortId(c.id)) }));
    });
    if (pendingRollback) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === pendingRollback) { sel.selectedIndex = i; break; }
      }
      pendingRollback = null;
    }

    v.appendChild(labeled(t('rollback_pick'), sel));
    var out = el('div', { class: 'rollback-out' });
    v.appendChild(out);

    function build() {
      var target = Store.getCommit(sel.value);
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
    sel.addEventListener('change', build);
    build();
  }

  /* ---------------- Branch (decisions) ---------------- */
  function renderBranch(v) {
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_branch') })]));

    // create form
    var qInput = el('input', { class: 'field', type: 'text', placeholder: t('branch_q_ph') });
    var aName = el('input', { class: 'field', type: 'text', placeholder: t('branch_a') });
    var aOut = el('textarea', { class: 'field', rows: '3', placeholder: t('outcome') });
    var bName = el('input', { class: 'field', type: 'text', placeholder: t('branch_b') });
    var bOut = el('textarea', { class: 'field', rows: '3', placeholder: t('outcome') });

    var form = el('div', { class: 'form-card branch-form' }, [
      labeled(t('branch_q'), qInput),
      el('div', { class: 'branch-cols' }, [
        el('div', { class: 'branch-col a' }, [labeled(t('branch_a'), aName), labeled(t('outcome'), aOut)]),
        el('div', { class: 'branch-col b' }, [labeled(t('branch_b'), bName), labeled(t('outcome'), bOut)])
      ]),
      el('div', { class: 'form-actions' }, [
        el('button', { class: 'btn primary', text: t('create_branch'), onclick: function () {
          if (!qInput.value.trim()) { toast('⚠ ' + t('branch_q')); return; }
          Store.addBranch({
            question: qInput.value.trim(),
            branches: [
              { name: aName.value.trim() || t('branch_a'), predicted: splitLines(aOut.value) },
              { name: bName.value.trim() || t('branch_b'), predicted: splitLines(bOut.value) }
            ],
            chosenIndex: null,
            followup: null
          });
          toast('✅ ' + t('create_branch'));
          render();
        } })
      ])
    ]);
    v.appendChild(form);

    var list = Store.branches();
    if (!list.length) { v.appendChild(noticeCard(t('branch_empty'))); return; }
    list.forEach(function (b) { v.appendChild(branchCard(b)); });
  }

  function splitLines(s) {
    return (s || '').split('\n').map(function (x) { return x.trim(); })
      .filter(function (x) { return x; });
  }

  function branchCard(b) {
    var head = el('div', { class: 'branch-head' }, [
      el('span', { class: 'branch-q', text: '🔀 ' + b.question }),
      el('span', { class: 'branch-status ' + (b.followup ? 'reviewed' : 'pending'),
        text: b.followup ? t('branch_reviewed') : t('branch_pending') })
    ]);

    var cols = el('div', { class: 'branch-cols' });
    b.branches.forEach(function (br, idx) {
      var chosen = b.chosenIndex === idx;
      var preds = el('ul', { class: 'pred-ul' });
      (br.predicted || []).forEach(function (p) { preds.appendChild(el('li', { text: p })); });
      var col = el('div', { class: 'branch-col ' + (idx === 0 ? 'a' : 'b') + (chosen ? ' chosen' : '') }, [
        el('div', { class: 'branch-col-head' }, [
          el('span', { class: 'branch-tag', text: idx === 0 ? 'A' : 'B' }),
          el('span', { class: 'branch-name', text: br.name })
        ]),
        preds,
        b.chosenIndex == null
          ? el('button', { class: 'btn tiny primary', text: t('choose'), onclick: function () {
              Store.updateBranch(b.id, { chosenIndex: idx }); render();
            } })
          : (chosen ? el('span', { class: 'chosen-badge', text: '✓ ' + t('chosen') }) : null)
      ]);
      cols.appendChild(col);
    });

    var children = [head, cols];

    // follow-up / review block (only once chosen)
    if (b.chosenIndex != null) {
      if (b.followup) {
        children.push(el('div', { class: 'followup-done' }, [
          el('span', { class: 'rating', text: '⭐ ' + b.followup.rating + '/5' }),
          el('span', { class: 'repeat ' + (b.followup.wouldRepeat ? 'yes' : 'no'),
            text: b.followup.wouldRepeat ? t('would_repeat_yes') : t('would_repeat_no') }),
          b.followup.note ? el('span', { class: 'fu-note', text: '“' + b.followup.note + '”' }) : null
        ]));
      } else {
        var rate = el('select', { class: 'field tiny-field' });
        [5, 4, 3, 2, 1].forEach(function (n) { rate.appendChild(el('option', { value: n, text: '⭐ ' + n })); });
        var note = el('input', { class: 'field', type: 'text', placeholder: t('followup') });
        var rep = el('select', { class: 'field tiny-field' });
        rep.appendChild(el('option', { value: '1', text: t('yes') }));
        rep.appendChild(el('option', { value: '0', text: t('no') }));
        children.push(el('div', { class: 'followup-form' }, [
          el('div', { class: 'fu-title', text: '📋 ' + t('followup') }),
          el('div', { class: 'fu-row' }, [
            labeled(t('rate'), rate), labeled(t('repeat'), rep), labeled(t('notes'), note)
          ]),
          el('button', { class: 'btn tiny primary', text: t('save_followup'), onclick: function () {
            Store.updateBranch(b.id, { followup: {
              rating: parseInt(rate.value, 10),
              wouldRepeat: rep.value === '1',
              note: note.value.trim(),
              recordedAt: Date.now()
            } });
            render();
          } })
        ]));
      }
    }

    children.push(el('button', { class: 'btn tiny danger-ghost branch-del', text: t('delete'),
      onclick: function () { Store.deleteBranch(b.id); render(); } }));

    return el('div', { class: 'branch-card' }, children);
  }

  /* ---------------- shared bits ---------------- */
  function noticeCard(text) { return el('div', { class: 'notice-card', text: text }); }

  function exportData() {
    var blob = new Blob([Store.exportJSON()], { type: 'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: 'realitygit-export.json' });
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
          lang === 'zh' ? '睡眠变差' : 'Worse sleep'] }
      ], chosenIndex: null, followup: null
    });
    toast(t('seed_done'));
  }

  /* ---------------- language toggle ---------------- */
  function toggleLang() {
    lang = lang === 'zh' ? 'en' : 'zh';
    Store.setMeta({ lang: lang });
    $('#lang-btn').textContent = lang === 'zh' ? 'EN' : '中';
    $('#tagline').textContent = t('tagline');
    var _brand = document.querySelector('.brand-name'); if (_brand) _brand.textContent = t('brand');
    renderNav(); render();
  }

  /* ---------------- boot ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('#tagline').textContent = t('tagline');
    var _brand = document.querySelector('.brand-name'); if (_brand) _brand.textContent = t('brand');
    $('#lang-btn').textContent = lang === 'zh' ? 'EN' : '中';
    $('#lang-btn').addEventListener('click', toggleLang);
    var r = location.hash.slice(1);
    if (routes.indexOf(r) >= 0) current = r;
    renderNav();
    render();
  });
})();
