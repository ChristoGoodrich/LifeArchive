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
      pick_multi: '选择多张图片', album_multi: '从相册选择多张', photos_added: '已添加 {n} 张图片',
      notif_recheck_title: '复查提醒', notif_due_title: '决策复盘到期',
      remind_label: '复查提醒', remind_none: '不提醒',
      remind_7: '7 天后', remind_30: '30 天后', remind_90: '90 天后',
      remind_custom: '自定义天数', remind_custom_ph: '输入天数',
      remind_native_only: '手机端会推送通知；桌面端会保存提醒时间并安全降级。',
      remind_set_cta: '30 天后提醒我复查？', remind_set_done: '已设置复查提醒',
      export_commit: '导出此存档', share_image: '系统分享',
      onboard_step1_title: '选一个要盯住的东西', onboard_step1_text: '房间、冰箱、押金房况、行李箱都可以。',
      onboard_step2_title: '拍第一张存档', onboard_step2_text: '照片、清单、文件会一起留在本机仓库。',
      onboard_step3_title: '设一个复查提醒', onboard_step3_text: '到点回来看变化，直接进入现实对比。',
      nav_review: '回顾',
      review_open: '回顾',
      review_empty: '还没有可重温的存档，先去记录一些生活吧。',
      review_on_this_day: '那年今日',
      review_this_day_months: '往月的今天',
      review_random: '随机翻牌重温',
      review_month_count: '本月你已经记录了 {n} 个瞬间',
      notif_memory_title: '生活存档 · 那年今日',
      photo_time: '图片时间',
      photo_time_empty: '先选择一张带拍摄时间的照片',
      photo_time_set: '已使用图片拍摄时间',
      time_pick_title: '选择存档时间',
      time_pick_sub: '用真实发生时间组织生活存档',
      time_date_label: '日期',
      time_time_label: '时间',
      time_now: '现在',
      time_done: '完成',
      quick_capture: '快速记录',
      streak_none: '✅ 记录今天，开启连续打卡',
      streak_keep: '🔥 连续 {n} 天 · 记录今天保持连续',
      streak_done: '🔥 连续 {n} 天 · 今天已记录 ✅',
      streak_done0: '✅ 今天已记录',
      nudge_label: '每日记录提醒',
      nudge_on: '已开启每日提醒',
      nudge_off: '已关闭每日提醒',
      nudge_hint: '当天还没有记录时，晚上 20:30 轻轻提醒一次。仅手机端推送，桌面端不发送。',
      notif_nudge_title: '记录一下今天吧',
      notif_nudge_body: '今天还没有存档 · 花 10 秒，给现在拍一张 →',
      on: '开',
      off: '关',
      nav_growth: '时光历程',
      growth_open: '📈 时光历程',
      growth_pick_scene: '选择场景',
      growth_need_two: '这个场景至少要有两个真实存档，才能查看时光历程。',
      growth_count_span: '{n} 次存档 · 跨度 {span}',
      growth_first_last: '首尾对比',
      growth_export: '导出时光回顾片',
      growth_oldest: '最早',
      growth_newest: '最新',
      growth_insights: '历程洞察',
      growth_most_stable: '最稳定',
      growth_most_gone: '最常消失',
      growth_most_added: '最常出现',
      import_restore: '导入 / 恢复备份',
      backup_done: '已导出备份文件',
      import_working: '导入中...',
      import_done: '已导入 · 共 {n} 条存档',
      import_bad: '文件无法识别，请选择 Life Archive 导出的备份',
      last_sync: '上次同步',
      last_sync_never: '从未',
      backup_nudge: '还没有云同步，先导出一份本地备份更安心',
      mood: '心情', people: '人物', tags: '标签',
      mood_great: '很棒', mood_good: '不错', mood_meh: '一般', mood_down: '低落', mood_bad: '糟糕',
      people_ph: '和谁？回车添加', tags_ph: '#标签，回车添加',
      voice: '语音', voice_record: '录语音', voice_stop: '停止', voice_delete: '删除',       voice_missing: '语音文件丢失',       media_fetching: '拉取媒体…', media_upload: '上传媒体', media_uploaded: '媒体已上传',
      photo_save_fail: '照片保存失败', photo_fetching: '加载原图…', photo_need_online: '原图需联网或在录制设备查看',
      file_need_online: '文件需联网或在原设备下载',
      voice_unsupported: '此设备不支持录音', voice_denied: '麦克风权限被拒', voice_save_fail: '语音保存失败',
      custom_scene_add: '＋ 自定义主体', custom_scene_emoji: '主体图标（一个 emoji）', custom_scene_name: '主体名字',
      video: '视频', video_add: '加视频', video_delete: '删除', video_processing: '处理中…',
      video_missing: '视频文件缺失（仅在录制设备上，或用备份恢复）', video_save_fail: '视频保存失败',
      video_big: '视频较大，备份文件会显著变大',
      location: '地点', loc_ph: '在哪？填地点名', loc_use: '取当前位置', loc_locating: '定位中…',
      loc_got: '已记录位置', loc_denied: '定位失败，可手填地点名', loc_unsupported: '此设备不支持定位',
      lens_clear: '清除筛选', resurface_see_all: '查看全部', resurface_dismiss: '收起',
      saved_value_prefix: '已存档'
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
      pick_multi: 'Pick multiple images', album_multi: 'Pick multiple from album', photos_added: 'Added {n} image(s)',
      notif_recheck_title: 'Re-check reminder', notif_due_title: 'Decision review due',
      remind_label: 'Re-check reminder', remind_none: 'Off',
      remind_7: 'In 7 days', remind_30: 'In 30 days', remind_90: 'In 90 days',
      remind_custom: 'Custom days', remind_custom_ph: 'Enter days',
      remind_native_only: 'Mobile sends the notification; desktop saves the reminder time and degrades safely.',
      remind_set_cta: 'Remind me to re-check in 30 days?', remind_set_done: 'Re-check reminder set',
      export_commit: 'Export this archive', share_image: 'Share',
      onboard_step1_title: 'Pick something to watch', onboard_step1_text: 'A room, fridge, deposit condition, or packed bag all work.',
      onboard_step2_title: 'Take the first archive', onboard_step2_text: 'Photo, checklist, and files stay together in the local repo.',
      onboard_step3_title: 'Set a re-check reminder', onboard_step3_text: 'Come back on time and jump straight into Reality Diff.',
      nav_review: 'Memories',
      review_open: 'Memories',
      review_empty: 'Nothing to resurface yet - go capture some life first.',
      review_on_this_day: 'On this day',
      review_this_day_months: 'This day, earlier months',
      review_random: 'Random resurface',
      review_month_count: 'You have logged {n} moments this month',
      notif_memory_title: 'Life Archive · On this day',
      photo_time: 'Photo time',
      photo_time_empty: 'Choose a photo with shooting time first',
      photo_time_set: 'Photo shooting time applied',
      time_pick_title: 'Pick archive time',
      time_pick_sub: 'Use when it really happened',
      time_date_label: 'Date',
      time_time_label: 'Time',
      time_now: 'Now',
      time_done: 'Done',
      quick_capture: 'Quick capture',
      streak_none: '✅ Log today, start a streak',
      streak_keep: '🔥 {n}-day streak · log today to keep it',
      streak_done: '🔥 {n}-day streak · logged today ✅',
      streak_done0: '✅ Logged today',
      nudge_label: 'Daily nudge',
      nudge_on: 'Daily nudge on',
      nudge_off: 'Daily nudge off',
      nudge_hint: 'A gentle 8:30pm nudge on days you have not logged. Mobile push only.',
      notif_nudge_title: 'Capture today',
      notif_nudge_body: 'Nothing archived today · 10 seconds, snap one now →',
      on: 'On',
      off: 'Off',
      nav_growth: 'Time-lapse',
      growth_open: '📈 Time-lapse',
      growth_pick_scene: 'Pick a scene',
      growth_need_two: 'This scene needs at least two real archives to show a time-lapse.',
      growth_count_span: '{n} archives · {span} span',
      growth_first_last: 'First vs latest',
      growth_export: 'Export time-lapse card',
      growth_oldest: 'first',
      growth_newest: 'latest',
      growth_insights: 'Timeline insights',
      growth_most_stable: 'Most stable',
      growth_most_gone: 'Most gone',
      growth_most_added: 'Most added',
      import_restore: 'Import / restore',
      backup_done: 'Backup file exported',
      import_working: 'Importing...',
      import_done: 'Imported · {n} archives total',
      import_bad: 'Unrecognized file - pick a Life Archive backup',
      last_sync: 'Last synced',
      last_sync_never: 'Never',
      backup_nudge: 'No cloud sync yet - export a local backup to be safe',
      mood: 'Mood', people: 'People', tags: 'Tags',
      mood_great: 'Great', mood_good: 'Good', mood_meh: 'Meh', mood_down: 'Down', mood_bad: 'Bad',
      people_ph: 'Who with? Enter to add', tags_ph: '#tag, Enter to add',
      voice: 'Voice', voice_record: 'Record', voice_stop: 'Stop', voice_delete: 'Delete',       voice_missing: 'Voice file missing',       media_fetching: 'Fetching media…', media_upload: 'Upload media', media_uploaded: 'Media uploaded',
      photo_save_fail: 'Photo save failed', photo_fetching: 'Loading full image…', photo_need_online: 'Full image needs network or the original device',
      file_need_online: 'File needs network or the original device',
      voice_unsupported: 'Recording not supported here', voice_denied: 'Microphone permission denied', voice_save_fail: 'Voice save failed',
      custom_scene_add: '＋ Custom subject', custom_scene_emoji: 'Icon (one emoji)', custom_scene_name: 'Subject name',
      video: 'Video', video_add: 'Add video', video_delete: 'Delete', video_processing: 'Processing…',
      video_missing: 'Video file missing (only on the recording device, or restore from backup)', video_save_fail: 'Video save failed',
      video_big: 'Large video — your backup file will grow a lot',
      location: 'Location', loc_ph: 'Where? Add a place name', loc_use: 'Use current location', loc_locating: 'Locating…',
      loc_got: 'Location saved', loc_denied: 'Location failed — type a place instead', loc_unsupported: 'Location not supported here',
      lens_clear: 'Clear filter', resurface_see_all: 'See all', resurface_dismiss: 'Dismiss',
      saved_value_prefix: 'Saved'
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
  function videoMedia(c) { return (c && c.media || []).filter(function (m) { return m.kind === 'video'; })[0] || null; }
  function photoMedia(c) { return (c && c.media || []).filter(function (m) { return m.kind === 'photo'; }); }
  function coverPhoto(c) { var ps = photoMedia(c); return ps.filter(function (m) { return m.cover; })[0] || ps[0] || null; }

  var THUMB_MAX = 640;
  function makeThumb(blobOrFile) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(blobOrFile);
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth || 0, h = img.naturalHeight || 0;
        var scale = w ? Math.min(1, THUMB_MAX / w) : 1;
        var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
        var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
        try {
          cv.getContext('2d').drawImage(img, 0, 0, cw, ch);
          resolve({ thumb: cv.toDataURL('image/jpeg', 0.7), w: w, h: h });
        } catch (e) { resolve({ thumb: '', w: w, h: h }); }
        URL.revokeObjectURL(url);
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve({ thumb: '', w: 0, h: 0 }); };
      img.src = url;
    });
  }
  function dataUrlToBlob(dataUrl) {
    return fetch(dataUrl).then(function (r) { return r.blob(); });
  }

  function commitThumbSrc(c) {
    var cv = coverPhoto(c);
    if (cv && cv.thumb) return cv.thumb;
    var img = firstImageFile(c.files);
    var v = videoMedia(c);
    return c.photo || (img && img.data) || (v && v.poster) || '';
  }
  function imageFiles(c) {
    return (c && c.files || []).filter(isImageFile);
  }
  function commitImageEntries(c) {
    var out = [];
    if (!c) return out;
    photoMedia(c).forEach(function (m) {
      out.push({ thumb: m.thumb, blobId: m.blobId, name: m.name || 'image.jpg', w: m.w, h: m.h, cover: !!m.cover });
    });
    if (!out.length) {
      if (c.photo) out.push({ data: c.photo, name: c.message || 'cover.jpg', w: c.photoW || null, h: c.photoH || null, cover: true });
      imageFiles(c).forEach(function (f) {
        out.push({ data: f.data, name: f.name || 'image.jpg', w: f.w || null, h: f.h || null, file: f });
      });
    }
    return out;
  }
  function commitCoverDims(c) {
    var cv = coverPhoto(c); if (cv && cv.w && cv.h) return { w: cv.w, h: cv.h };
    if (c.photo) return (c.photoW && c.photoH) ? { w: c.photoW, h: c.photoH } : null;
    var img = firstImageFile(c.files);
    if (img && img.w && img.h) return { w: img.w, h: img.h };
    var v = videoMedia(c);
    return (v && v.w && v.h) ? { w: v.w, h: v.h } : null;
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
  function toastType(msg, explicit) {
    if (explicit) return explicit;
    if (/^⚠|失败|错误|不足|无法|denied|fail/i.test(msg)) return 'warn';
    if (/^✅|^⭐|已|完成|成功|saved|synced/i.test(msg)) return 'ok';
    return 'info';
  }
  function toast(msg, type) {
    var node = $('#toast');
    var s = String(msg == null ? '' : msg);
    if (s.length > 220) s = s.slice(0, 220) + '…';      // toasts are glanceable; cap runaway error text
    node.className = 'toast t-' + toastType(s, type);
    node.textContent = s;
    node.scrollTop = 0;
    requestAnimationFrame(function () { node.classList.add('show'); });
    clearTimeout(node._t);
    var dur = Math.min(6000, 2200 + Math.max(0, s.length - 30) * 45);  // longer text → more reading time
    node._t = setTimeout(function () { node.classList.remove('show'); }, dur);
  }
  function toastAction(msg, label, onClick) {
    var node = $('#toast');
    node.innerHTML = '';
    node.className = 'toast with-action t-info';
    node.appendChild(el('span', { text: msg }));
    node.appendChild(el('button', { type: 'button', class: 'toast-action', text: label,
      onclick: function (e) {
        e.stopPropagation();
        node.classList.remove('show', 'with-action');
        if (onClick) onClick();
      } }));
    node.classList.add('show');
    clearTimeout(node._t);
    node._t = setTimeout(function () { node.classList.remove('show', 'with-action'); }, 5200);
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

  function parseExifDateString(value, offset) {
    if (value == null) return null;
    if (typeof value === 'number' && isFinite(value)) {
      var ms = value > 100000000000 ? value : value * 1000;
      return ms > 0 ? ms : null;
    }
    var raw = String(value).trim().replace(/\0/g, '');
    var m = raw.match(/^(\d{4})[:\-](\d{1,2})[:\-](\d{1,2})[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
    if (!m) {
      var parsed = Date.parse(raw);
      return isNaN(parsed) ? null : parsed;
    }
    var pad = function (n) { n = Number(n); return n < 10 ? '0' + n : '' + n; };
    var tz = offset && /^[-+]\d{2}:?\d{2}$/.test(String(offset).trim())
      ? String(offset).trim().replace(/^([-+]\d{2})(\d{2})$/, '$1:$2') : '';
    if (tz) {
      var iso = m[1] + '-' + pad(m[2]) + '-' + pad(m[3]) + 'T' +
        pad(m[4]) + ':' + pad(m[5]) + ':' + pad(m[6] || 0) + tz;
      var withTz = Date.parse(iso);
      if (!isNaN(withTz)) return withTz;
    }
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]),
      Number(m[4]), Number(m[5]), Number(m[6] || 0), 0);
    return isNaN(d.getTime()) ? null : d.getTime();
  }

  function parseExifFromArrayBuffer(buf) {
    if (!buf || buf.byteLength < 12) return null;
    var v = new DataView(buf);
    if (v.getUint8(0) !== 0xff || v.getUint8(1) !== 0xd8) return null;
    function ascii(start, len) {
      var s = '';
      for (var i = 0; i < len && start + i < v.byteLength; i++) s += String.fromCharCode(v.getUint8(start + i));
      return s;
    }
    function parseTiff(base, end) {
      if (base + 8 > end) return null;
      var endian = v.getUint16(base, false);
      var little = endian === 0x4949;
      if (!little && endian !== 0x4d4d) return null;
      function u16(pos) { return pos + 2 <= end ? v.getUint16(pos, little) : 0; }
      function u32(pos) { return pos + 4 <= end ? v.getUint32(pos, little) : 0; }
      if (u16(base + 2) !== 42) return null;
      function readAscii(entry) {
        var type = u16(entry + 2), count = u32(entry + 4);
        if (type !== 2 || !count || count > 128) return null;
        var start = count <= 4 ? entry + 8 : base + u32(entry + 8);
        if (start < base || start + count > end) return null;
        return ascii(start, count).replace(/\0+$/, '').trim();
      }
      function readIfd(ifdPos) {
        var out = {}, entries, entry, tag, n;
        if (!ifdPos || ifdPos + 2 > end) return out;
        entries = u16(ifdPos);
        for (n = 0; n < entries; n++) {
          entry = ifdPos + 2 + n * 12;
          if (entry + 12 > end) break;
          tag = u16(entry);
          if (tag === 0x0132 || tag === 0x9003 || tag === 0x9004 ||
              tag === 0x9010 || tag === 0x9011 || tag === 0x9012) {
            out[tag] = readAscii(entry);
          } else if (tag === 0x8769) {
            out.exifIfd = base + u32(entry + 8);
          }
        }
        return out;
      }
      var ifd0 = readIfd(base + u32(base + 4));
      var exif = ifd0.exifIfd ? readIfd(ifd0.exifIfd) : {};
      var stamp = exif[0x9003] || exif[0x9004] || ifd0[0x0132];
      var off = exif[0x9011] || exif[0x9012] || exif[0x9010];
      return parseExifDateString(stamp, off);
    }
    var pos = 2;
    while (pos + 4 <= v.byteLength) {
      if (v.getUint8(pos) !== 0xff) break;
      var marker = v.getUint8(pos + 1);
      pos += 2;
      if (marker === 0xda || marker === 0xd9) break;
      if (pos + 2 > v.byteLength) break;
      var len = v.getUint16(pos, false);
      if (len < 2 || pos + len > v.byteLength) break;
      var start = pos + 2, end = pos + len;
      if (marker === 0xe1 && len >= 10 && ascii(start, 6) === 'Exif\0\0') {
        return parseTiff(start + 6, end);
      }
      pos += len;
    }
    return null;
  }

  function imageTakenAtFromFile(file) {
    if (!file || !file.arrayBuffer) return Promise.resolve(null);
    return file.arrayBuffer().then(parseExifFromArrayBuffer).catch(function () { return null; });
  }

  function imageTakenAtFromNativePhoto(photo) {
    var exif = photo && photo.exif;
    if (!exif) return null;
    function find(names) {
      var keys = Object.keys(exif || {});
      for (var i = 0; i < names.length; i++) {
        if (exif[names[i]] != null) return exif[names[i]];
        var wanted = names[i].toLowerCase();
        for (var k = 0; k < keys.length; k++) {
          if (String(keys[k]).toLowerCase() === wanted) return exif[keys[k]];
        }
      }
      return null;
    }
    return parseExifDateString(find(['DateTimeOriginal', 'DateTimeDigitized', 'DateTime', 'CreateDate', 'ModifyDate',
      'dateTimeOriginal', 'dateTimeDigitized', 'dateTime']),
      find(['OffsetTimeOriginal', 'OffsetTimeDigitized', 'OffsetTime', 'offsetTimeOriginal']));
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
      // Pinned to an exact, immutable, package-published file (NOT the floating @2 alias —
      // jsDelivr re-minifies that on the fly and explicitly says not to SRI those dynamic
      // files). integrity + crossOrigin let the browser reject a tampered / MITM'd SDK before
      // it runs, which matters because the renderer can read the local archive. When bumping
      // supabase-js, update BOTH the version in the URL and the integrity hash together.
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.107.0/dist/umd/supabase.js';
      s.integrity = 'sha384-CQbEv3UOeYwlaBLdPF5KqEagCP39Q1KpvJC6Gwa3UGjZAwMvpA+0TFxSSnrgb4MX';
      s.crossOrigin = 'anonymous';
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
    },
    uploadBlob: function (path, blob) {
      return this.client().then(function (c) {
        return c.storage.from('media').upload(path, blob, {
          upsert: true, contentType: (blob && blob.type) || 'application/octet-stream'
        });
      }).then(function (r) { if (r && r.error) throw new Error(r.error.message); return true; });
    },
    downloadBlob: function (path) {
      return this.client().then(function (c) { return c.storage.from('media').download(path); })
        .then(function (r) { return (r && !r.error && r.data) ? r.data : null; });
    },
    removeBlob: function (path) {
      return this.client().then(function (c) { return c.storage.from('media').remove([path]); })
        .then(function () { return true; }).catch(function () { return false; });
    }
  };

  /* ---------------- Local notifications (native return loop) ----------------
     Kept pluggable like AI / Cloud. Desktop and web safely no-op so callers do
     not branch on platform for every reminder action. */
  var Notify = {
    _p: function () {
      var Cap = window.Capacitor;
      if (Cap && Cap.isNativePlatform && Cap.isNativePlatform() &&
          Cap.Plugins && Cap.Plugins.LocalNotifications) return Cap.Plugins.LocalNotifications;
      return null;
    },
    available: function () { return !!this._p(); },
    idFor: function (key, kind) {
      var s = (kind || '') + '|' + String(key || '');
      var h = 5381;
      for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
      return Math.abs(h) % 2000000000 + 1;
    },
    ensurePermission: function () {
      var p = this._p();
      if (!p) return Promise.resolve(false);
      return p.checkPermissions().then(function (r) {
        if (r && r.display === 'granted') return true;
        return p.requestPermissions().then(function (q) { return !!(q && q.display === 'granted'); });
      }).catch(function () { return false; });
    },
    scheduleAt: function (key, kind, whenMs, title, body, extra) {
      var p = this._p();
      if (!p || !whenMs || whenMs <= Date.now()) return Promise.resolve(false);
      var id = this.idFor(key, kind);
      return this.ensurePermission().then(function (ok) {
        if (!ok) return false;
        return p.schedule({ notifications: [{
          id: id,
          title: title,
          body: body,
          schedule: { at: new Date(whenMs), allowWhileIdle: true },
          extra: extra || {}
        }] }).then(function () { return true; });
      }).catch(function () { return false; });
    },
    cancelFor: function (key, kind) {
      var p = this._p();
      if (!p) return Promise.resolve();
      return p.cancel({ notifications: [{ id: this.idFor(key, kind) }] }).catch(function () {});
    },
    syncAll: function () {
      var p = this._p();
      if (!p) return Promise.resolve();
      var jobs = [];
      Store.commits().forEach(function (c) {
        if (c.remindAt && !c.remindFired && !c.planned && c.remindAt > Date.now()) {
          jobs.push(scheduleRecheckForCommit(c));
        }
      });
      Store.branches().forEach(function (b) {
        if (branchDueMs(b) > Date.now() && !b.followup) jobs.push(scheduleDueForBranch(b));
      });
      return Promise.all(jobs);
    },
    initClickRouting: function (onIntent) {
      var p = this._p();
      if (!p || !p.addListener) return;
      p.addListener('localNotificationActionPerformed', function (ev) {
        var ex = ev && ev.notification && ev.notification.extra;
        if (ex) onIntent(ex);
      });
    }
  };

  var ShareOut = {
    _p: function () {
      var Cap = window.Capacitor;
      if (Cap && Cap.isNativePlatform && Cap.isNativePlatform() && Cap.Plugins &&
          Cap.Plugins.Share && Cap.Plugins.Filesystem) {
        return { share: Cap.Plugins.Share, fs: Cap.Plugins.Filesystem };
      }
      return null;
    },
    available: function () { return !!this._p(); },
    shareDataUrl: function (dataUrl, filename) {
      var p = this._p();
      if (!p || !dataUrl) return Promise.resolve(false);
      var b64 = String(dataUrl).split(',')[1] || '';
      var name = filename || ('life-archive-' + Date.now() + '.png');
      return p.fs.writeFile({ path: name, data: b64, directory: 'CACHE' })
        .then(function (r) {
          var fileRef = (r && (r.uri || r.path)) || name;
          return p.share.share({ title: 'Life Archive', files: [fileRef] }).then(function () { return true; });
        }).catch(function () { return false; });
    }
  };

  function reminderBodyForCommit(c) {
    var sc = Store.sceneById(c && c.scene);
    return (sc ? sceneName(sc) : t('brand')) + ' · ' + ((c && c.message) || '');
  }
  function scheduleRecheckForCommit(c) {
    if (!c || !c.remindAt || c.planned) return Promise.resolve(false);
    return Notify.scheduleAt(c.id, 'recheck', c.remindAt, t('notif_recheck_title'),
      reminderBodyForCommit(c), { kind: 'recheck', route: 'diff', sceneId: c.scene, commitId: c.id });
  }
  function scheduleMemoryNotifs() {
    if (!Notify.available()) return Promise.resolve();
    var jobs = [], base = startOfToday(), L = lang === 'zh';
    for (var i = 0; i < 14; i++) {
      var day = new Date(base.getTime() + i * 86400000);
      var hits = anniversaryCommits(day);
      if (!hits.length) continue;
      var when = new Date(day); when.setHours(20, 0, 0, 0);
      if (when.getTime() <= Date.now()) continue;
      var sample = hits.reduce(function (a, b) { return a.createdAt < b.createdAt ? a : b; });
      var years = day.getFullYear() - new Date(sample.createdAt).getFullYear();
      var what = sample.message || sceneName(Store.sceneById(sample.scene));
      var body = L ? (years + ' 年前的今天，你记录了「' + what + '」，点开看看 →')
                   : (years + 'y ago today you logged "' + what + '" - take a look');
      var dateKey = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
      jobs.push(Notify.scheduleAt('memory:' + dateKey, 'memory', when.getTime(),
        t('notif_memory_title'), body, { kind: 'memory', route: 'review' }));
    }
    return Promise.all(jobs);
  }
  function captureNudgeEnabled() { return Store.meta().captureNudge === true; }
  function reconcileCaptureNudge() {
    var base = startOfToday();
    var cancels = [];
    for (var i = 0; i < 3; i++) {
      cancels.push(Notify.cancelFor('nudge:' + dayKey(base.getTime() + i * 86400000), 'nudge'));
    }
    return Promise.all(cancels).then(function () {
      if (!Notify.available() || !captureNudgeEnabled()) return [];
      var jobs = [];
      for (var j = 0; j < 3; j++) {
        var day = new Date(base.getTime() + j * 86400000);
        if (j === 0 && hasCommitToday()) continue;
        var when = new Date(day);
        when.setHours(20, 30, 0, 0);
        if (when.getTime() <= Date.now()) continue;
        jobs.push(Notify.scheduleAt('nudge:' + dayKey(day.getTime()), 'nudge', when.getTime(),
          t('notif_nudge_title'), t('notif_nudge_body'), { kind: 'nudge', route: 'commit', quick: true }));
      }
      return Promise.all(jobs);
    });
  }
  function branchDueMs(b) {
    if (!b || !b.dueAt) return 0;
    var ts = new Date(b.dueAt + 'T09:00:00').getTime();
    return isNaN(ts) ? 0 : ts;
  }
  function scheduleDueForBranch(b) {
    var ts = branchDueMs(b);
    if (!b || !ts || b.followup) return Promise.resolve(false);
    return Notify.scheduleAt(b.id, 'due', ts, t('notif_due_title'), b.question || t('nav_branch'),
      { kind: 'due', route: 'branch-detail', branchId: b.id });
  }
  function deleteCommitWithCleanup(id) {
    Notify.cancelFor(id, 'recheck');
    var c = Store.getCommit(id);
    var blobIds = (c && c.media ? c.media : []).map(function (m) { return m && m.blobId; }).filter(Boolean);
    Store.deleteCommit(id);
    autoSync(false);
    var u = Cloud.currentUser();
    if (u && blobIds.length) {
      var allCommits = Store.commits();
      var usedElsewhere = {};
      allCommits.forEach(function (oc) {
        (oc.media || []).forEach(function (m) { if (m && m.blobId) usedElsewhere[m.blobId] = true; });
      });
      blobIds.forEach(function (bid) {
        if (!usedElsewhere[bid]) {
          Cloud.removeBlob(u.id + '/' + bid);
        }
        markUploaded(bid, false);
      });
    }
  }
  function deleteBranchWithCleanup(id) {
    Notify.cancelFor(id, 'due');
    Store.deleteBranch(id);
    autoSync(false);
  }

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
             customScenes: union(a.customScenes, b.customScenes),
             tombstones: tombs };
  }

  function mediaPathFor(blobId) {
    var u = Cloud.currentUser();
    return (u && blobId) ? (u.id + '/' + blobId) : null;
  }
  function uploadedSet() { return Store.meta().mediaUp || {}; }
  function markUploaded(blobId, on) {
    var m = Store.meta().mediaUp || {};
    if (on === false) delete m[blobId]; else m[blobId] = 1;
    Store.setMeta({ mediaUp: m });
  }
  function resolveMediaBlob(blobId) {
    return Store.getBlob(blobId).then(function (b) {
      if (b) return b;
      var path = mediaPathFor(blobId);
      if (!path) return null;
      return Cloud.downloadBlob(path).then(function (db) {
        if (db) { Store.putBlob(blobId, db); }
        return db || null;
      }).catch(function () { return null; });
    });
  }
  function syncMediaUp() {
    var u = Cloud.currentUser();
    if (!u) return Promise.resolve();
    var up = uploadedSet();
    var ids = [];
    Store.commits().forEach(function (c) {
      (c.media || []).forEach(function (m) {
        if (m && m.blobId && !up[m.blobId] && ids.indexOf(m.blobId) < 0) ids.push(m.blobId);
      });
    });
    return ids.reduce(function (p, blobId) {
      return p.then(function () {
        return Store.getBlob(blobId).then(function (b) {
          if (!b) return;
          return Cloud.uploadBlob(u.id + '/' + blobId, b)
            .then(function () { markUploaded(blobId, true); })
            .catch(function () { /* retry next sync */ });
        });
      });
    }, Promise.resolve());
  }
  function migrateCommitPhotos(c) {
    if (!c) return Promise.resolve(false);
    var jobs = [], newMedia = (c.media || []).slice();
    function addPhoto(dataUrl, dims, name, cover) {
      return dataUrlToBlob(dataUrl).then(function (blob) {
        return makeThumb(blob).then(function (tm) {
          var id = 'ph_' + Store.uid('p');
          return Store.putBlob(id, blob).then(function (ok) {
            if (ok) newMedia.push({ kind: 'photo', cover: !!cover, blobId: id, thumb: tm.thumb || '',
              w: (dims && dims.w) || tm.w, h: (dims && dims.h) || tm.h, mime: blob.type || 'image/jpeg', size: blob.size, name: name || 'image.jpg' });
          });
        });
      });
    }
    if (c.photo && !photoMedia(c).some(function (m) { return m.cover; }))
      jobs.push(addPhoto(c.photo, { w: c.photoW, h: c.photoH }, c.message || 'cover.jpg', true));
    (c.files || []).forEach(function (f) {
      if (isImageFile(f)) {
        jobs.push(addPhoto(f.data, { w: f.w, h: f.h }, f.name, false));
      } else if (f.data) {
        jobs.push(dataUrlToBlob(f.data).then(function (blob) {
          var id = 'fl_' + Store.uid('f');
          return Store.putBlob(id, blob).then(function (ok) {
            if (ok) newMedia.push({ kind: 'file', blobId: id, name: f.name, mime: f.type || blob.type, size: f.size || blob.size });
          });
        }));
      }
    });
    if (!jobs.length) return Promise.resolve(false);
    return Promise.all(jobs).then(function () {
      Store.updateCommit(c.id, { media: newMedia, photo: null, photoW: null, photoH: null, files: [] });
      return true;
    });
  }
  function migrateInlinePhotos() {
    var pending = Store.commits().filter(function (c) {
      return c.photo || (c.files || []).length > 0;
    });
    if (!pending.length) return;
    var i = 0;
    function step() {
      if (i >= pending.length) { autoSync(false); return; }
      migrateCommitPhotos(pending[i++]).then(function () {
        (window.requestIdleCallback || function (f) { setTimeout(f, 400); })(step);
      });
    }
    step();
  }
  function gcOrphanBlobs() {
    return Store.allBlobIds().then(function (keys) {
      if (!keys.length) return 0;
      var used = {};
      Store.commits().forEach(function (c) { (c.media || []).forEach(function (m) { if (m && m.blobId) used[m.blobId] = 1; }); });
      var orphans = keys.filter(function (k) { return !used[k]; });
      if (!orphans.length) return 0;
      var u = Cloud.currentUser();
      return orphans.reduce(function (p, k) {
        return p.then(function () {
          markUploaded(k, false);
          if (u) Cloud.removeBlob(u.id + '/' + k);
          return Store.deleteBlob(k);
        });
      }, Promise.resolve()).then(function () { return orphans.length; });
    });
  }
  function cloudSync() {
    var local = Store.exportRaw();
    return Cloud.pull().then(function (remote) {
      var merged = mergeData(local, remote);
      Store.replaceAll(merged);
      return Cloud.push(merged).then(function () {
        Store.setMeta({ lastSyncAt: Date.now() });
        return syncMediaUp().catch(function () {}).then(function () { return merged; });
      });
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
  var routes = ['timeline', 'commit', 'diff', 'rollback', 'branch', 'branch-detail', 'settings', 'changelog', 'detail', 'stats', 'review', 'growth'];
  var current = 'timeline';
  var storeReady = false;
  var pendingDeepLink = null;
  // Bottom-nav routes are real peer tabs. Switching among them replaces the current
  // browser history entry, so Android edge-back does not treat Timeline as their parent.
  var TAB_ROUTES = ['timeline', 'review', 'commit'];
  function isTabRoute(route) { return TAB_ROUTES.indexOf(route) >= 0; }
  // nav depth drives page animation (tabs fade; subpages push/pop)
  var ROUTE_DEPTH = { timeline: 0, review: 0, commit: 0, diff: 1, rollback: 1, branch: 1, 'branch-detail': 2, detail: 1, settings: 1, changelog: 2, stats: 1, growth: 1 };
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

  function routeOrRefresh(route) {
    if (route === current) render();
    else go(route);
  }

  function handleNotifyIntent(ex) {
    if (!ex || !ex.route) return;
    if (!storeReady) { pendingDeepLink = ex; return; }
    if (ex.route === 'review') { routeOrRefresh('review'); return; }
    if (ex.route === 'commit') {
      if (ex.quick) pendingQuick = true;
      routeOrRefresh('commit');
      return;
    }
    if (ex.route === 'diff') {
      var c = Store.getCommit(ex.commitId);
      if (!c) { routeOrRefresh('timeline'); return; }
      Store.updateCommit(c.id, { remindFired: true });
      pendingDiff = { sceneId: ex.sceneId || c.scene, commitId: c.id };
      var enough = realCommitsForScene(c.scene).length >= 2;
      if (!enough) pendingDetail = c.id;
      routeOrRefresh(enough ? 'diff' : 'detail');
      return;
    }
    if (ex.route === 'branch-detail') {
      var b = Store.getBranch(ex.branchId);
      if (!b) { routeOrRefresh('branch'); return; }
      pendingBranchDetail = b.id;
      routeOrRefresh('branch-detail');
    }
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
      branch: s('<circle cx="6.5" cy="6" r="2"/><circle cx="6.5" cy="18" r="2"/><circle cx="17.5" cy="7.5" r="2"/><path d="M6.5 8v8"/><path d="M17.5 9.5c0 3.6-2.7 4.5-5.6 5"/>'),
      review: s('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/>')
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
  function sceneIcEl(scene) {
    var span = el('span', { class: 'scene-ic' });
    if (scene && SCENE_ICONS[scene.id]) span.innerHTML = SCENE_ICONS[scene.id];
    else span.textContent = (scene && scene.emoji) || '🏷️';
    return span;
  }
  function fmtDur(s) { s = Math.max(0, Math.round(s)); return Math.floor(s/60) + ':' + ('0'+(s%60)).slice(-2); }

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
    return el('span', { class: 'commit-scene' }, [sceneIcEl(scene), el('span', { text: sceneName(scene) })]);
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
    var btn = el('button', {
      class: 'nav-btn' + (isCreate ? ' nav-btn-create' : '') + (current === route ? ' active' : ''),
      'data-route': route, 'aria-label': label, title: label,
      onclick: function () { go(route); }
    }, kids);
    if (isCreate) {
      var lpTimer = null;
      function fireQuick() {
        if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
        pendingQuick = true;
        routeOrRefresh('commit');
      }
      btn.addEventListener('touchstart', function () { lpTimer = setTimeout(fireQuick, 500); }, { passive: true });
      ['touchend', 'touchmove', 'touchcancel'].forEach(function (ev) {
        btn.addEventListener(ev, function () {
          if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
        });
      });
      btn.addEventListener('contextmenu', function (e) { e.preventDefault(); fireQuick(); });
    }
    return btn;
  }

  function renderNav() {
    var nav = $('#nav');
    nav.innerHTML = '';
    // The four browse tabs live in a pill; "新建存档" is a separate action button.
    // Desktop: the pill sits left, the create button detaches to the right.
    // Mobile: the pill flattens (display:contents) and CSS re-orders the create
    //         button into the center as a floating "+" FAB.
    var group = el('div', { class: 'nav-group' });
    [['timeline', t('nav_timeline')], ['review', t('review_open')]
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
    v.scrollLeft = 0;
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
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
    else if (current === 'review') renderReview(v);
    else if (current === 'growth') renderGrowth(v);
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
  var tlTag = null;       // timeline tag filter (null = all tags)
  var tlPerson = null;   // person lens (null = no filter)
  var tlMood = null;     // mood lens
  var tlPlace = null;    // place lens (exact location.label match)
  var resurfaceDismissed = false;  // dismissed inline memory card this session
  var TL_PAGE_SIZE = 24;
  var tlVisible = TL_PAGE_SIZE;
  var tlRerender = null;       // set to the current renderList() so card actions can refresh it
  var tlRerenderChips = null;  // set to renderChips() so starring a card can reveal the filter

  // a single star glyph; CSS fills it gold when the card/commit is starred
  function starSVG() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 17.6l-5.2 2.81.99-5.79-4.21-4.1 5.82-.85z"/></svg>';
  }
  // share / export glyph (tray with an up-arrow) — used for the Reality Diff export button
  function shareSVG() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3"/><path d="M8 7l4-4 4 4"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
  }

  function commitMatches(c, q) {
    if (!q) return true;
    q = q.toLowerCase();
    var sc = Store.sceneById(c.scene);
    var hay = [c.message || '', c.notes || '', sc.zh, sc.en]
      .concat((c.items || []).map(function (it) { return it.name; }))
      .concat(c.people || [])
      .concat((c.tags || []).map(function (t) { return '#' + t; }))
      .concat(c.location && c.location.label ? [c.location.label] : [])
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
        el('div', { class: 'empty-steps' }, [
          el('div', { class: 'empty-step' }, [
            el('span', { class: 'empty-step-num', text: '1' }),
            el('strong', { text: t('onboard_step1_title') }),
            el('span', { text: t('onboard_step1_text') })
          ]),
          el('div', { class: 'empty-step' }, [
            el('span', { class: 'empty-step-num', text: '2' }),
            el('strong', { text: t('onboard_step2_title') }),
            el('span', { text: t('onboard_step2_text') })
          ]),
          el('div', { class: 'empty-step' }, [
            el('span', { class: 'empty-step-num', text: '3' }),
            el('strong', { text: t('onboard_step3_title') }),
            el('span', { text: t('onboard_step3_text') })
          ])
        ]),
        el('div', { class: 'empty-actions' }, [
          el('button', { class: 'btn primary', text: t('empty_cta'),
            onclick: function () { go('commit'); } }),
          el('button', { class: 'btn ghost', text: t('empty_seed'),
            onclick: function () { seedDemo(); renderNav(); render(); } })
        ])
      ]));
      return;
    }

    v.appendChild(el('div', { class: 'view-head' }, [
      el('h1', { text: t('nav_timeline') })
    ]));
    (function () {
      var streak = computeStreak();
      var done = hasCommitToday();
      var label = done
        ? (streak > 0 ? t('streak_done').replace('{n}', streak) : t('streak_done0'))
        : (streak > 0 ? t('streak_keep').replace('{n}', streak) : t('streak_none'));
      v.appendChild(el('button', {
        type: 'button',
        class: 'streak-chip' + (done ? ' is-done' : ''),
        text: label,
        onclick: function () { pendingQuick = true; routeOrRefresh('commit'); }
      }));
    })();
    (function () {
      if (Cloud.configured()) return;
      var last = Store.meta().lastBackupAt || 0;
      if (Date.now() - last <= 14 * 86400000 || Store.isEmpty()) return;
      v.appendChild(el('button', {
        type: 'button',
        class: 'backup-banner',
        text: t('backup_nudge'),
        onclick: function () { go('settings'); }
      }));
    })();
    (function () {
      var bp = branchPendingCount();
      if (bp <= 0) return;
      v.appendChild(el('button', { type: 'button', class: 'branch-due-banner',
        text: (lang === 'zh' ? '🔀 有 ' + bp + ' 个决策待回顾' : '🔀 ' + bp + ' decision' + (bp > 1 ? 's' : '') + ' to review'),
        onclick: function () { go('branch'); } }));
    })();
    var resurface = resurfaceDismissed ? null : pickResurface(startOfToday());
    if (resurface) {
      var L = lang === 'zh';
      var lead = resurface.commits.reduce(function (a, b) { return a.createdAt < b.createdAt ? a : b; });
      var ago = resurface.kind === 'year'
        ? (L ? (resurface.years + ' 年前的今天') : (resurface.years + (resurface.years > 1 ? ' years' : ' year') + ' ago today'))
        : resurface.kind === 'month'
          ? (L ? '往月的今天' : 'On this day, an earlier month')
          : (L ? '随机重温' : 'A memory resurfaced');
      var headline = (resurface.kind === 'year' ? '🎂 ' : resurface.kind === 'month' ? '📅 ' : '🎲 ') + ago;

      var thumb = commitThumbSrc(lead);
      var coverDims = commitCoverDims(lead);
      var cover = null;
      if (thumb) {
        var rImg = el('img', { class: 'resurface-cover', src: thumb, alt: lead.message || '',
          loading: 'lazy', decoding: 'async' });
        if (coverDims) { rImg.setAttribute('width', coverDims.w); rImg.setAttribute('height', coverDims.h); }
        cover = el('div', { class: 'resurface-cover-wrap' }, [rImg]);
      }

      var dismiss = el('button', { type: 'button', class: 'resurface-x', 'aria-label': L ? '收起' : 'Dismiss', text: '✕' });
      dismiss.addEventListener('click', function (e) {
        e.stopPropagation();
        resurfaceDismissed = true;
        if (card.parentNode) card.parentNode.removeChild(card);
      });

      var metaBits = [sceneTag(Store.sceneById(lead.scene))];
      if (lead.location && lead.location.label) {
        metaBits.push(el('span', { class: 'commit-dot', text: '·' }));
        metaBits.push(el('span', { class: 'resurface-place', text: '📍' + lead.location.label }));
      }

      var body = el('div', { class: 'resurface-body' }, [
        el('div', { class: 'resurface-kicker', text: headline }),
        el('div', { class: 'resurface-msg', text: lead.message || (L ? '(无描述)' : '(no message)') }),
        el('div', { class: 'resurface-meta' }, metaBits)
      ]);

      if (resurface.commits.length > 1) {
        body.appendChild(el('button', { type: 'button', class: 'resurface-more btn ghost tiny',
          text: (L ? '查看全部 ' : 'See all ') + resurface.commits.length,
          onclick: function (e) { e.stopPropagation(); go('review'); } }));
      }

      var card = el('div', { class: 'resurface-card tappable' + (cover ? '' : ' no-cover') },
        cover ? [cover, body, dismiss] : [body, dismiss]);
      card.addEventListener('click', function () { pendingDetail = lead.id; go('detail'); });
      v.appendChild(card);
    }

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
      if (withIcon) { kids.push(sceneIcEl(Store.sceneById(id))); }
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
      // tag chips: collect all tags that appear in any commit
      var tagSet = {};
      commits.forEach(function (c) { (c.tags || []).forEach(function (tg) { tagSet[tg] = 1; }); });
      Object.keys(tagSet).sort().forEach(function (tg) {
        var on = tlTag === tg;
        var b = el('button', { type: 'button', class: 'tl-chip tag-chip' + (on ? ' active' : ''), text: '#' + tg });
        b.addEventListener('click', function () { tlTag = on ? null : tg; tlVisible = TL_PAGE_SIZE; renderChips(); renderList(); });
        chipsRow.appendChild(b);
      });
      function lensPill(kind, label, onClear) {
        var b = el('button', { type: 'button', class: 'tl-chip tl-lens active' },
          [el('span', { text: label }), el('span', { class: 'tl-lens-x', text: '✕' })]);
        b.addEventListener('click', function () { onClear(); tlVisible = TL_PAGE_SIZE; renderChips(); renderList(); });
        return b;
      }
      if (tlPerson) chipsRow.appendChild(lensPill('person', '👥 ' + tlPerson, function () { tlPerson = null; }));
      if (tlMood) {
        var _moodMap = { great:'😄', good:'🙂', meh:'😐', down:'😔', bad:'😣' };
        chipsRow.appendChild(lensPill('mood', (_moodMap[tlMood] || '') + ' ' + t('mood_' + tlMood), function () { tlMood = null; }));
      }
      if (tlPlace) chipsRow.appendChild(lensPill('place', '📍 ' + tlPlace, function () { tlPlace = null; }));
    }
    renderChips();

    v.appendChild(el('div', { class: 'tl-search' }, [searchInput, chipsRow]));

    var listWrap = el('div', { class: 'tl-list' });
    v.appendChild(listWrap);

    function renderList() {
      listWrap.innerHTML = '';
      var matched = commits.filter(function (c) {
        return (!tlStarOnly || c.starred)
          && (tlScene === null || c.scene === tlScene)
          && (tlTag === null || (c.tags || []).indexOf(tlTag) >= 0)
          && (tlPerson === null || (c.people || []).indexOf(tlPerson) >= 0)
          && (tlMood === null || c.mood === tlMood)
          && (tlPlace === null || (c.location && c.location.label === tlPlace))
          && commitMatches(c, tlQuery);
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

      if (tlScene !== null && realCommitsForScene(tlScene).length >= 2) {
        var gscene = tlScene;
        listWrap.appendChild(el('button', { type: 'button', class: 'btn ghost growth-entry',
          text: t('growth_open') + ' · ' + sceneName(Store.sceneById(gscene)),
          onclick: function () { openGrowthForScene(gscene); } }));
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
  function commitDayCounts() {
    var m = {};
    Store.commits().filter(notPlanned).forEach(function (c) {
      var k = dayKey(c.createdAt);
      m[k] = (m[k] || 0) + 1;
    });
    return m;
  }
  function hasCommitToday() { return !!commitDayCounts()[dayKey(Date.now())]; }
  function computeStreak() {
    var counts = commitDayCounts();
    var n = 0;
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    if (!counts[dayKey(d.getTime())]) d.setDate(d.getDate() - 1);
    while (counts[dayKey(d.getTime())]) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
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
      if (!imageEntries.length) imageEntries = [{ thumb: thumbSrc, data: thumbSrc, name: c.message || '' }];
      var coverDims = commitCoverDims(c);
      var img = el('img', { class: 'commit-img', src: thumbSrc, alt: c.message || '',
        loading: 'lazy', decoding: 'async' });
      // reserve the image's box from its stored pixel size so the card doesn't grow/“放大”
      // when a freshly added photo finishes decoding (CSS keeps width:100%;height:auto).
      // commitCoverDims covers multi-photo archives too (incl. cover-removed → file image).
      if (coverDims) { img.setAttribute('width', coverDims.w); img.setAttribute('height', coverDims.h); }
      media = el('div', timelineMediaAttrs(coverDims), [img, starBtn]);
      if (videoMedia(c)) media.appendChild(el('span', { class: 'commit-video-badge', text: '▶' }));
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
          var thumbAttrs = { class: 'commit-thumb-img', src: entry.thumb || entry.data, alt: '',
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
    if (c.location && c.location.label) {
      subKids.push(el('span', { class: 'commit-dot', text: '·' }));
      subKids.push(el('span', { class: 'commit-place', text: '📍' + c.location.label }));
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

  /* ---------------- Review / Resurface ---------------- */
  function startOfToday() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function anniversaryCommits(ref) {
    return Store.commits().filter(notPlanned).filter(function (c) {
      var d = new Date(c.createdAt);
      return d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate()
        && d.getFullYear() < ref.getFullYear();
    });
  }
  function monthlyAnniversaryCommits(ref) {
    return Store.commits().filter(notPlanned).filter(function (c) {
      var d = new Date(c.createdAt);
      if (d.getDate() !== ref.getDate()) return false;
      if (d.getFullYear() < ref.getFullYear()) return true;
      return d.getFullYear() === ref.getFullYear() && d.getMonth() < ref.getMonth();
    });
  }
  function randomOlderCommits(n) {
    var cutoff = Date.now() - 7 * 86400000;
    var pool = Store.commits().filter(notPlanned).filter(function (c) { return c.createdAt <= cutoff; });
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = pool[i]; pool[i] = pool[j]; pool[j] = x;
    }
    return pool.slice(0, n);
  }
  function thisMonthCount(ref) {
    return Store.commits().filter(notPlanned).filter(function (c) {
      var d = new Date(c.createdAt);
      return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
    }).length;
  }
  function pickResurface(ref) {
    var y = anniversaryCommits(ref);
    if (y.length) {
      var oldest = y.reduce(function (a, b) { return a.createdAt < b.createdAt ? a : b; });
      return { kind: 'year', years: ref.getFullYear() - new Date(oldest.createdAt).getFullYear(), commits: y };
    }
    var m = monthlyAnniversaryCommits(ref);
    if (m.length) return { kind: 'month', commits: m };
    var r = randomOlderCommits(3);
    if (r.length) return { kind: 'random', commits: r };
    return null;
  }
  function renderReview(v) {
    tlRerender = null;
    tlRerenderChips = null;
    var L = lang === 'zh';
    v.appendChild(el('div', { class: 'view-head review-view-head' }, [
      el('h1', { text: t('nav_review') })
    ]));
    if (Store.isEmpty()) { v.appendChild(noticeCard(t('review_empty'))); return; }
    var albumBtn = el('button', { class: 'btn primary album-cta', style: 'width:100%;margin:2px 0 14px',
      text: '✨ ' + (L ? '生成回忆图集' : 'AI memory album') });
    albumBtn.addEventListener('click', function () { openMemoryAlbum({ kind: 'recent', sinceDays: 120, max: 9 }); });
    v.appendChild(albumBtn);
    var ref = startOfToday();
    function section(title, sub, commits) {
      if (!commits || !commits.length) return;
      var head = [el('h2', { text: title })];
      if (sub) head.push(el('span', { class: 'review-sec-sub', text: sub }));
      var rail = el('div', { class: 'commit-rail review-rail' });
      commits.forEach(function (c) { rail.appendChild(commitCard(c)); });
      v.appendChild(el('section', { class: 'review-sec' }, [
        el('div', { class: 'review-sec-head' }, head),
        rail
      ]));
    }
    var anni = anniversaryCommits(ref);
    section(t('review_on_this_day'), null, anni);

    var anniIds = {};
    anni.forEach(function (c) { anniIds[c.id] = 1; });
    section(t('review_this_day_months'), null,
      monthlyAnniversaryCommits(ref).filter(function (c) { return !anniIds[c.id]; }));
    section(t('review_random'), null, randomOlderCommits(6));

    var n = thisMonthCount(ref);
    if (n) v.appendChild(el('div', { class: 'review-month-note',
      text: t('review_month_count').replace('{n}', n) }));
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
    var cv = coverPhoto(c);
    var coverThumb = cv ? cv.thumb : c.photo;
    if (coverThumb) {
      var detailPhoto = el('img', { class: 'detail-photo', src: coverThumb, alt: c.message || '', decoding: 'async' });
      var dims = commitCoverDims(c); if (dims) { detailPhoto.setAttribute('width', dims.w); detailPhoto.setAttribute('height', dims.h); }
      detailPhoto.style.cursor = 'zoom-in';
      detailPhoto.addEventListener('click', function () { openGallery(commitImageEntries(c), 0); });
      card.appendChild(detailPhoto);
      if (cv && cv.blobId) {
        resolveMediaBlob(cv.blobId).then(function (b) {
          if (b) { var u = URL.createObjectURL(b); detailPhoto.src = u; }
        });
      }
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
    if (c.mood) {
      var moodMap = { great:'😄', good:'🙂', meh:'😐', down:'😔', bad:'😣' };
      var moodBtn = el('button', { class: 'detail-mood-tap', type: 'button',
        text: (moodMap[c.mood] || '') + ' ' + t('mood_' + c.mood) });
      moodBtn.addEventListener('click', function () {
        tlMood = c.mood; tlScene = null; tlTag = null; go('timeline');
      });
      card.appendChild(el('div', { class: 'detail-sub detail-mood' }, [moodBtn]));
    }
    if (c.people && c.people.length) {
      card.appendChild(el('div', { class: 'detail-section-title', text: '👥 ' + t('people') }));
      var pw = el('div', { class: 'chip-row' });
      c.people.forEach(function (p) {
        var b = el('button', { class: 'chip-tag tap', text: p });
        b.addEventListener('click', function () { tlPerson = p; tlScene = null; tlTag = null; go('timeline'); });
        pw.appendChild(b);
      });
      card.appendChild(pw);
    }
    if (c.tags && c.tags.length) {
      card.appendChild(el('div', { class: 'detail-section-title', text: '🏷️ ' + t('tags') }));
      var tw = el('div', { class: 'chip-row' });
      c.tags.forEach(function (tg) {
        var b = el('button', { class: 'chip-tag tap', text: '#' + tg });
        b.addEventListener('click', function () { tlTag = tg; tlScene = null; go('timeline'); });
        tw.appendChild(b);
      });
      card.appendChild(tw);
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
    var allImgEntries = commitImageEntries(c);
    var imgEntries = allImgEntries.filter(function (e) { return e.thumb || e.data; });
    if (imgEntries.length) {
      card.appendChild(el('div', { class: 'detail-section-title', text: L ? '图片' : 'Photos' }));
      var gallery = el('div', { class: 'detail-gallery' });
      imgEntries.slice(0, 12).forEach(function (entry, idx) {
        var src = entry.thumb || entry.data;
        var imageAttrs = { class: 'detail-image', src: src, alt: entry.name || '', loading: 'lazy', decoding: 'async' };
        if (entry.w && entry.h) { imageAttrs.width = entry.w; imageAttrs.height = entry.h; }
        var link = el('div', { class: 'detail-image-link', title: entry.name || '' }, [
          el('img', imageAttrs)
        ]);
        link.style.cursor = 'zoom-in';
        link.addEventListener('click', function () { openGallery(imgEntries, idx); });
        gallery.appendChild(link);
      });
      if (imgEntries.length > 12) gallery.appendChild(el('div', { class: 'detail-image-more', text: '+' + (imgEntries.length - 12) }));
      card.appendChild(gallery);
    }
    var fileMedia = (c.media || []).filter(function (m) { return m.kind === 'file'; });
    var legacyFiles = (c.files || []).filter(function (f) { return !isImageFile(f); });
    if (fileMedia.length || legacyFiles.length) {
      card.appendChild(el('div', { class: 'detail-section-title', text: L ? '文件' : 'Files' }));
      var fl = el('div', { class: 'detail-files' });
      fileMedia.forEach(function (m) {
        var ic = el('span', { class: 'file-ic' }); ic.innerHTML = UI_ICONS.file;
        var row = el('a', { class: 'detail-file', href: '#', download: m.name }, [ic,
          el('div', { class: 'file-meta' }, [el('span', { class: 'file-name', text: m.name }),
            el('span', { class: 'file-size', text: fmtBytes(m.size) })]),
          el('span', { class: 'file-dl', text: '⤓' })]);
        row.addEventListener('click', function (e) {
          e.preventDefault();
          resolveMediaBlob(m.blobId).then(function (b) {
            if (!b) { toast('⚠ ' + t('file_need_online')); return; }
            var url = URL.createObjectURL(b);
            var a = document.createElement('a'); a.href = url; a.download = m.name; document.body.appendChild(a); a.click();
            a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          });
        });
        fl.appendChild(row);
      });
      legacyFiles.forEach(function (f) {
        var ic = el('span', { class: 'file-ic' }); ic.innerHTML = UI_ICONS.file;
        fl.appendChild(el('a', { class: 'detail-file', href: f.data, download: f.name }, [ic,
          el('div', { class: 'file-meta' }, [el('span', { class: 'file-name', text: f.name }),
            el('span', { class: 'file-size', text: fmtBytes(f.size) })]),
          el('span', { class: 'file-dl', text: '⤓' })]));
      });
      card.appendChild(fl);
    }
    var audioM = (c.media || []).filter(function (m) { return m.kind === 'audio'; })[0];
    if (audioM) {
      card.appendChild(el('div', { class: 'detail-section-title', text: '🎙 ' + t('voice') }));
      var player = el('audio', { controls: 'controls', class: 'detail-audio', preload: 'none' });
      var audioSlot = el('div', { class: 'detail-voice' }, [
        el('div', { class: 'media-loading', text: '… ' + t('media_fetching') }),
        el('span', { class: 'file-size', text: fmtDur(audioM.dur || 0) + ' · ' + fmtBytes(audioM.size || 0) })
      ]);
      card.appendChild(audioSlot);
      resolveMediaBlob(audioM.blobId).then(function (b) {
        if (!b) { audioSlot.firstChild.replaceWith(el('div', { class: 'commit-notes', text: t('voice_missing') })); return; }
        var url = URL.createObjectURL(b);
        player.src = url;
        player.addEventListener('emptied', function () { URL.revokeObjectURL(url); });
        audioSlot.firstChild.replaceWith(player);
      });
    }
    var videoM = (c.media || []).filter(function (m) { return m.kind === 'video'; })[0];
    if (videoM) {
      card.appendChild(el('div', { class: 'detail-section-title', text: '🎬 ' + t('video') }));
      var vp = el('video', { class: 'detail-video', controls: 'controls', preload: 'none', playsinline: 'playsinline' });
      if (videoM.poster) vp.setAttribute('poster', videoM.poster);
      if (videoM.w && videoM.h) { vp.setAttribute('width', videoM.w); vp.setAttribute('height', videoM.h); }
      var videoSlot = el('div', { class: 'detail-videowrap' }, [
        el('div', { class: 'media-loading', text: '… ' + t('media_fetching') }),
        el('span', { class: 'file-size', text: fmtDur(videoM.dur || 0) + ' · ' + fmtBytes(videoM.size || 0) })
      ]);
      card.appendChild(videoSlot);
      resolveMediaBlob(videoM.blobId).then(function (b) {
        if (!b) {
          videoSlot.firstChild.replaceWith(el('div', { class: 'video-missing' }, [
            videoM.poster ? el('img', { class: 'detail-image', src: videoM.poster, alt: '' }) : null,
            el('div', { class: 'commit-notes', text: t('video_missing') })]));
          return;
        }
        var url = URL.createObjectURL(b);
        vp.src = url;
        vp.addEventListener('emptied', function () { URL.revokeObjectURL(url); });
        videoSlot.firstChild.replaceWith(vp);
      });
    }
    function geoMapUrl(loc) {
      if (!loc || loc.lat == null) return null;
      var la = loc.lat, lo = loc.lng;
      return 'https://www.openstreetmap.org/?mlat=' + la + '&mlon=' + lo + '#map=16/' + la + '/' + lo;
    }
    if (c.location && (c.location.label || c.location.lat != null)) {
      card.appendChild(el('div', { class: 'detail-section-title', text: '📍 ' + t('location') }));
      var url = geoMapUrl(c.location);
      var locText = (c.location.label || '')
        + (c.location.lat != null ? (c.location.label ? ' · ' : '') + c.location.lat.toFixed(4) + ', ' + c.location.lng.toFixed(4) : '');
      if (url) {
        card.appendChild(el('a', { class: 'detail-link-btn btn ghost', href: url, target: '_blank',
          rel: 'noopener', text: '🗺 ' + locText }));
      } else {
        card.appendChild(el('div', { class: 'commit-notes', text: '📍 ' + locText }));
      }
      if (c.location.label) {
        var placeBtn = el('button', { class: 'btn ghost tiny detail-place-filter', type: 'button',
          text: (L ? '🔎 看「' : '🔎 See "') + c.location.label + (L ? '」的全部存档' : '"') });
        placeBtn.addEventListener('click', function () { tlPlace = c.location.label; tlScene = null; tlTag = null; go('timeline'); });
        card.appendChild(placeBtn);
      }
    }
    if (c.notes) {
      card.appendChild(el('div', { class: 'detail-section-title', text: L ? '备注' : 'Notes' }));
      card.appendChild(el('div', { class: 'commit-notes', text: c.notes }));
    }
    v.appendChild(card);
    function exportThisCommit() {
      buildCommitCardCanvas(c).then(function (cv) {
        showImageModal(cv.toDataURL('image/png'), 'life-archive-' + shortId(c.id) + '.png');
      });
    }
    function growthAction() {
      return el('button', { class: 'btn', text: t('growth_open'),
        onclick: function () { openGrowthForScene(c.scene); } });
    }

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
        el('button', { class: 'btn', text: '⤴ ' + t('export_commit'),
          onclick: exportThisCommit }),
        growthAction(),
        el('button', { class: 'btn danger', text: '🗑 ' + t('delete'),
          onclick: function () { if (confirm(t('confirm_delete'))) { deleteCommitWithCleanup(c.id); go('timeline'); } } })
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
      growthAction(),
      el('button', { class: 'btn', text: '⤴ ' + t('export_commit'),
        onclick: exportThisCommit }),
      el('button', { class: 'btn', text: '⏮️ ' + t('nav_rollback'),
        onclick: function () { pendingRollback = c.id; go('rollback'); } }),
      el('button', { class: 'btn danger', text: '🗑 ' + t('delete'),
        onclick: function () { if (confirm(t('confirm_delete'))) { deleteCommitWithCleanup(c.id); go('timeline'); } } })
    ]));
  }

  /* ---------------- New / edit commit form ---------------- */
  var draftPhoto = null;
  var draftPhotoDims = null; // {w,h} of the cover, so timeline cards can reserve its box
  var draftPhotoTakenAt = null; // shooting timestamp from image EXIF/native metadata
  var draftFiles = [];
  var draftMood = '';
  var draftPeople = [];
  var draftTags = [];
  var draftAudio = null;
  var audioDeletedBlobId = null;
  var draftVideo = null;
  var videoDeletedBlobId = null;
  var draftCover = null;
  var coverDeletedBlobId = null;
  var draftPhotos = [];
  var photoDeletedBlobIds = [];
  var draftLocation = null;
  var pendingEdit = null;
  var pendingQuick = false;
  var pendingTemplate = null; // a commit to copy from for "照着再记一笔" (new commit, not an edit)
  function renderCommitForm(v) {
    draftPhoto = null;
    draftPhotoDims = null;
    draftPhotoTakenAt = null;
    draftFiles = [];
    draftMood = '';
    draftPeople = [];
    draftTags = [];
    draftAudio = null;
    audioDeletedBlobId = null;
    draftVideo = null;
    videoDeletedBlobId = null;
    draftCover = null;
    coverDeletedBlobId = null;
    draftPhotos = [];
    photoDeletedBlobIds = [];
    draftLocation = null;
    var editing = pendingEdit ? Store.getCommit(pendingEdit) : null;
    pendingEdit = null;
    var quick = !editing && pendingQuick;
    pendingQuick = false;
    var template = (!editing && pendingTemplate) ? pendingTemplate : null;
    pendingTemplate = null;
    var src = editing || template; // where prefilled values come from (edit OR replicate)
    draftPhotoTakenAt = src && src.photoTakenAt ? Number(src.photoTakenAt) || null : null;
    if (src) {
      draftMood = src.mood || '';
      draftPeople = src.people ? src.people.slice() : [];
      draftTags = src.tags ? src.tags.slice() : [];
      var srcAudio = (src.media || []).filter(function (x) { return x.kind === 'audio'; })[0];
      if (srcAudio) draftAudio = { blobId: srcAudio.blobId, mime: srcAudio.mime, size: srcAudio.size, dur: srcAudio.dur };
      var srcVideo = (src.media || []).filter(function (x) { return x.kind === 'video'; })[0];
      if (srcVideo) draftVideo = { blobId: srcVideo.blobId, mime: srcVideo.mime, size: srcVideo.size, dur: srcVideo.dur, w: srcVideo.w, h: srcVideo.h, poster: srcVideo.poster };
      if (src.location) draftLocation = { lat: src.location.lat, lng: src.location.lng, acc: src.location.acc, label: src.location.label || '', at: src.location.at };
      var srcPhotos = (src.media || []).filter(function (m) { return m.kind === 'photo'; });
      var cov = srcPhotos.filter(function (m) { return m.cover; })[0] || srcPhotos[0] || null;
      if (cov) {
        draftCover = { blobId: cov.blobId, thumb: cov.thumb, w: cov.w, h: cov.h, mime: cov.mime, size: cov.size, name: cov.name };
        draftPhoto = cov.thumb || null;
      } else if (src.photo) {
        draftPhoto = src.photo;
        draftCover = null;
      }
      draftPhotos = srcPhotos.filter(function (m) { return m !== cov; }).map(function (m) {
        return { blobId: m.blobId, thumb: m.thumb, w: m.w, h: m.h, mime: m.mime, size: m.size, name: m.name };
      });
      var srcFiles = (src.media || []).filter(function (m) { return m.kind === 'file'; });
      draftFiles = srcFiles.map(function (m) { return { blobId: m.blobId, name: m.name, type: m.mime, size: m.size }; })
        .concat((src.files || []).filter(function (f) { return !isImageFile(f); })
          .map(function (f) { return { id: Store.uid('f'), name: f.name, type: f.type, size: f.size, data: f.data }; }));
      (src.files || []).filter(isImageFile).forEach(function (f) {
        draftPhotos.push({ data: f.data, name: f.name, w: f.w, h: f.h });
      });
    }
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', {
      text: editing ? (lang === 'zh' ? '编辑存档' : 'Edit commit') : (quick ? t('quick_capture') : t('nav_commit')) })]));
    if (template) v.appendChild(el('div', { class: 'form-template-hint',
      text: '↩︎ ' + (lang === 'zh' ? '已照着上一条带入内容，可改后「存档」或「预存档」。' : 'Copied from a previous entry — edit, then Archive or Pre-save.') }));

    var lastScene = quick && Store.meta().lastScene;
    if (lastScene && !Store.allScenes().some(function (s) { return s.id === lastScene; })) lastScene = null;
    var selectedScene = (src && src.scene) || lastScene || Store.SCENES[0].id;
    var scenePicker = el('div', { class: 'scene-picker' });
    var selectedGroup = Store.isMealScene(selectedScene) ? 'meal' : 'item';
    function buildSceneGrid(group) {
      var grid = el('div', { class: 'scene-grid' });
      Store.allScenes().filter(function (sc) { return sc.group === group; }).forEach(function (sc) {
        var opt = el('button', { type: 'button',
          class: 'scene-opt' + (sc.id === selectedScene ? ' active' : '') },
          [sceneIcEl(sc), el('span', { class: 'scene-opt-label', text: sceneName(sc) })]);
        opt.addEventListener('click', function () {
          selectedScene = sc.id; renderScenePicker(); syncMealUI();
        });
        grid.appendChild(opt);
      });
      // add custom scene entry for item group
      if (group === 'item') {
        var addBtn = el('button', { type: 'button', class: 'scene-opt scene-opt-add',
          text: '＋ ' + t('custom_scene_add') });
        addBtn.addEventListener('click', function () {
          promptCustomScene(function (id) { selectedScene = id; renderScenePicker(); syncMealUI(); });
        });
        grid.appendChild(addBtn);
      }
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
              selectedScene = Store.allScenes().filter(function (sc) { return sc.group === group; })[0].id;
            }
            renderScenePicker(); syncMealUI();
          }
        }, [el('span', { text: it[1] }), el('span', { text: it[2] })]));
      });
      scenePicker.appendChild(switcher);
      scenePicker.appendChild(buildSceneGrid(selectedGroup));
    }
    renderScenePicker();

    function promptCustomScene(onPick) {
      var emoji = (window.prompt(t('custom_scene_emoji'), '🪴') || '').trim();
      var name  = (window.prompt(t('custom_scene_name')) || '').trim();
      if (!name) return;
      var s = Store.addCustomScene({ emoji: emoji || '🏷️', zh: name, en: name });
      autoSync(false);
      onPick(s.id);
    }

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
    var createdAtInput = timeSelect(datetimeLocalValue(editing ? editing.createdAt : Date.now()),
      function () { return draftPhotoTakenAt; });
    function initialRemindDays() {
      if (!src || src.planned) return null;
      if (src.remindDays) return Number(src.remindDays) || null;
      if (src.remindAt && src.createdAt) {
        var d = Math.round((Number(src.remindAt) - Number(src.createdAt)) / 86400000);
        return d > 0 ? d : null;
      }
      return null;
    }
    var initialDays = initialRemindDays();
    var presetValues = [7, 30, 90];
    var remindPreset = initialDays && presetValues.indexOf(initialDays) < 0 ? 'custom' : String(initialDays || 0);
    var remindSelect = choiceSelect([
      { value: '0', text: t('remind_none') },
      { value: '7', text: t('remind_7') },
      { value: '30', text: t('remind_30') },
      { value: '90', text: t('remind_90') },
      { value: 'custom', text: t('remind_custom') }
    ], remindPreset);
    var remindCustom = el('input', { class: 'field remind-custom-field', type: 'number',
      min: '1', step: '1', inputmode: 'numeric', placeholder: t('remind_custom_ph') });
    if (remindPreset === 'custom' && initialDays) remindCustom.value = String(initialDays);
    var remindHint = el('div', { class: 'form-hint remind-hint', text: t('remind_native_only') });
    var remindBox = el('div', { class: 'remind-box' }, [remindSelect, remindCustom, remindHint]);
    function syncRemindCustom() {
      remindBox.classList.toggle('custom', remindSelect.getValue() === 'custom');
    }
    remindSelect.onChange(syncRemindCustom);
    syncRemindCustom();
    function readRemindDays() {
      var v = remindSelect.getValue();
      var n = v === 'custom' ? parseInt(remindCustom.value, 10) : parseInt(v, 10);
      return n > 0 ? n : null;
    }
    var notesInput = el('textarea', { class: 'field', rows: '2' });
    if (src && src.notes) notesInput.value = src.notes;

    var preview = el('div', { class: 'photo-drop' }, [
      el('span', { class: 'photo-hint', text: '📷 ' + t('photo') })
    ]);
    var photoTools = null;
    function syncPhotoTools() {
      if (photoTools) photoTools.classList.toggle('is-hidden', !draftPhoto);
    }
    function setPhoto(dataUrl, dims, takenAt) {
      draftPhoto = dataUrl;
      if (takenAt !== undefined) draftPhotoTakenAt = takenAt ? Number(takenAt) || null : null;
      draftPhotoDims = (dims && dims.w && dims.h) ? { w: dims.w, h: dims.h } : null;
      // also create draftCover for media[] pipeline
      dataUrlToBlob(dataUrl).then(function (blob) {
        return makeThumb(blob).then(function (tm) {
          draftCover = { _blob: blob, thumb: tm.thumb, w: (dims && dims.w) || tm.w, h: (dims && dims.h) || tm.h,
            mime: blob.type || 'image/jpeg', size: blob.size, name: 'cover.jpg' };
        });
      }).catch(function () {});
      preview.innerHTML = '';
      preview.style.backgroundImage = 'none';
      var coverImg = el('img', { class: 'photo-drop-img', src: dataUrl, alt: '' });
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
      if (draftCover && draftCover.blobId) coverDeletedBlobId = draftCover.blobId;
      draftPhoto = null;
      draftPhotoDims = null;
      draftPhotoTakenAt = null;
      draftCover = null;
      preview.innerHTML = '';
      preview.appendChild(el('span', { class: 'photo-hint', text: '📷 ' + t('photo') }));
      preview.classList.remove('has-photo');
      preview.style.backgroundImage = 'none';
      syncPhotoTools();
    }
    function imageEntryFromFile(file) {
      return Promise.all([downscale(file), imageTakenAtFromFile(file)]).then(function (parts) {
        var res = parts[0], takenAt = parts[1];
        return { data: res.data, name: (file && file.name) || '', type: 'image/jpeg',
          size: Math.round(((res.data && res.data.length) || 0) * 0.75), w: res.w, h: res.h,
          takenAt: takenAt || null };
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
        if (!draftPhoto || (replaceCover && idx === 0)) { setPhoto(entry.data, dims, entry.takenAt || null); return; }
        draftPhotos.push({ data: entry.data, name: imageFileName(entry),
          w: entry.w || null, h: entry.h || null, takenAt: entry.takenAt || null });
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
          var takenAt = imageTakenAtFromNativePhoto(photo);
          if (photo && photo.dataUrl) downscaleSrc(photo.dataUrl).then(function (res) {
            addImageDataUrls([{ data: res.data, name: 'photo.jpg', w: res.w, h: res.h, takenAt: takenAt }], { replaceCover: true });
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
            return Promise.all([downscale(b), imageTakenAtFromFile(b)]).then(function (parts) {
              var res = parts[0];
              return { data: res.data, name: (p && p.name) || ('album_' + (idx + 1) + '.jpg'),
                w: res.w, h: res.h, takenAt: parts[1] || null };
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
          addImageDataUrls([{ data: res.data, name: 'screenshot.jpg', w: res.w, h: res.h, takenAt: null }], { replaceCover: true });
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
                Promise.all([downscale(blob), imageTakenAtFromFile(blob)]).then(function (parts) {
                  var res = parts[0];
                  addImageDataUrls([{ data: res.data, name: 'clipboard.jpg', w: res.w, h: res.h,
                    takenAt: parts[1] || null }], { replaceCover: true });
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
        draftFiles.push({ id: Store.uid('f'), name: file.name, type: file.type || '', size: file.size, _blob: file });
        renderFilesList();
        if (moreDetails) moreDetails.open = true;
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
        if (res.scene && Store.allScenes().some(function (x) { return x.id === res.scene; })) {
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

    // ---- mood ----
    var MOODS = [
      { id: 'great', emoji: '😄' }, { id: 'good', emoji: '🙂' },
      { id: 'meh', emoji: '😐' }, { id: 'down', emoji: '😔' }, { id: 'bad', emoji: '😣' }
    ];
    var moodRow = el('div', { class: 'mood-row' });
    MOODS.forEach(function (m) {
      var b = el('button', { type: 'button', class: 'mood-chip' + (draftMood === m.id ? ' on' : ''),
        text: m.emoji, title: t('mood_' + m.id) });
      b.addEventListener('click', function () {
        draftMood = (draftMood === m.id) ? '' : m.id;
        moodRow.querySelectorAll('.mood-chip').forEach(function (x) { x.classList.remove('on'); });
        if (draftMood) b.classList.add('on');
      });
      moodRow.appendChild(b);
    });

    // ---- people / tags chips input ----
    function chipsInput(seed, placeholder) {
      var list = seed.slice();
      var wrap = el('div', { class: 'chips-input' });
      var input = el('input', { class: 'chips-text', type: 'text', placeholder: placeholder });
      function render() {
        wrap.querySelectorAll('.chip-tag').forEach(function (n) { n.remove(); });
        list.forEach(function (val, i) {
          var x = el('button', { type: 'button', class: 'chip-x', text: '×' });
          x.addEventListener('click', function () { list.splice(i, 1); render(); input.focus(); });
          wrap.insertBefore(el('span', { class: 'chip-tag static' }, [el('span', { text: val }), x]), input);
        });
      }
      function commit() {
        (input.value || '').split(/[,，]/).forEach(function (raw) {
          var v = raw.trim().replace(/^#/, '');
          if (v && list.indexOf(v) < 0 && list.length < 24) list.push(v);
        });
        input.value = ''; render();
      }
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ',' || e.key === '，') { e.preventDefault(); commit(); }
      });
      input.addEventListener('blur', commit);
      wrap.appendChild(input); render();
      return { el: wrap, get: function () { commit(); return list.slice(); } };
    }
    var peopleInput = chipsInput(draftPeople, t('people_ph'));
    var tagsInput   = chipsInput(draftTags,   t('tags_ph'));

    // ---- voice ----
    function pickAudioMime() {
      var prefs = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      for (var i = 0; i < prefs.length; i++) {
        if (window.MediaRecorder && MediaRecorder.isTypeSupported(prefs[i])) return prefs[i];
      }
      return '';
    }
    function makeRecorder(onState) {
      var rec = null, chunks = [], stream = null, t0 = 0, timer = null;
      function stopTracks() { if (stream) { stream.getTracks().forEach(function (tr) { tr.stop(); }); stream = null; } }
      return {
        start: function () {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
            toast('⚠ ' + t('voice_unsupported')); return;
          }
          navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
            stream = s; chunks = [];
            var mime = pickAudioMime();
            rec = mime ? new MediaRecorder(s, { mimeType: mime }) : new MediaRecorder(s);
            rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
            rec.onstop = function () {
              var blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
              var dur = (Date.now() - t0) / 1000;
              stopTracks(); clearInterval(timer);
              draftAudio = { _blob: blob, mime: blob.type, size: blob.size, dur: Math.round(dur * 10) / 10 };
              onState('done');
            };
            t0 = Date.now(); rec.start();
            onState('recording', 0);
            timer = setInterval(function () { onState('recording', (Date.now() - t0) / 1000); }, 200);
          }).catch(function (err) {
            toast('⚠ ' + t('voice_denied'));
            console.error('[voice] getUserMedia ' + (err && err.name));
          });
        },
        stop: function () { try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (e) {} },
        cancel: function () { try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (e) {} stopTracks(); clearInterval(timer); }
      };
    }
    var audioBox = el('div', { class: 'voice-box' });
    function renderAudio(state, elapsed) {
      audioBox.innerHTML = '';
      if (state === 'recording') {
        var stopBtn = el('button', { class: 'btn rec-stop', type: 'button',
          text: '⏹ ' + t('voice_stop') + ' · ' + fmtDur(elapsed || 0) });
        stopBtn.addEventListener('click', function () { recorder.stop(); });
        audioBox.appendChild(stopBtn);
        return;
      }
      if (draftAudio) {
        var au = el('audio', { controls: 'controls', class: 'voice-player' });
        if (draftAudio._blob) au.src = URL.createObjectURL(draftAudio._blob);
        else if (draftAudio.blobId) Store.getBlob(draftAudio.blobId).then(function (b) { if (b) au.src = URL.createObjectURL(b); });
        var del = el('button', { class: 'btn ghost tiny', type: 'button', text: '🗑 ' + t('voice_delete') });
        del.addEventListener('click', function () {
          if (draftAudio && draftAudio.blobId && !draftAudio._blob) audioDeletedBlobId = draftAudio.blobId;
          draftAudio = null; renderAudio('idle');
        });
        audioBox.appendChild(el('div', { class: 'voice-done' }, [au,
          el('span', { class: 'voice-dur', text: '· ' + fmtDur(draftAudio.dur || 0) }), del]));
        return;
      }
      var startBtn = el('button', { class: 'btn ghost', type: 'button', text: '🎙 ' + t('voice_record') });
      startBtn.addEventListener('click', function () { recorder.start(); });
      audioBox.appendChild(startBtn);
    }
    var recorder = makeRecorder(renderAudio);
    renderAudio('idle');

    // ---- video ----
    var VIDEO_WARN_BYTES = 60 * 1024 * 1024;
    function probeVideo(blob) {
      return new Promise(function (resolve) {
        var url = URL.createObjectURL(blob);
        var vid = document.createElement('video');
        vid.preload = 'metadata'; vid.muted = true; vid.playsInline = true; vid.src = url;
        var done = false;
        function finish(meta) { if (done) return; done = true; URL.revokeObjectURL(url); resolve(meta); }
        vid.onloadedmetadata = function () {
          var dur = isFinite(vid.duration) ? Math.round(vid.duration * 10) / 10 : 0;
          var w = vid.videoWidth || 0, h = vid.videoHeight || 0;
          var seekTo = Math.min(0.1, (vid.duration || 1) / 2);
          vid.onseeked = function () {
            try {
              var scale = w ? Math.min(1, 640 / w) : 1;
              var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
              var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
              cv.getContext('2d').drawImage(vid, 0, 0, cw, ch);
              finish({ dur: dur, w: w, h: h, poster: cv.toDataURL('image/jpeg', 0.7) });
            } catch (e) { finish({ dur: dur, w: w, h: h, poster: '' }); }
          };
          try { vid.currentTime = seekTo; } catch (e) { finish({ dur: dur, w: w, h: h, poster: '' }); }
        };
        vid.onerror = function () { finish({ dur: 0, w: 0, h: 0, poster: '' }); };
        setTimeout(function () { finish({ dur: 0, w: 0, h: 0, poster: '' }); }, 8000);
      });
    }
    var videoBox = el('div', { class: 'video-box' });
    var videoInput = el('input', { type: 'file', accept: 'video/*', capture: 'environment', class: 'hidden-file' });
    videoInput.addEventListener('change', function () {
      var f = videoInput.files && videoInput.files[0];
      videoInput.value = '';
      if (!f) return;
      if (f.size > VIDEO_WARN_BYTES) toast('⚠ ' + t('video_big'));
      renderVideo('busy');
      probeVideo(f).then(function (meta) {
        draftVideo = { _blob: f, mime: f.type || 'video/mp4', size: f.size,
          dur: meta.dur, w: meta.w, h: meta.h, poster: meta.poster };
        renderVideo('done');
      });
    });
    function renderVideo(state) {
      videoBox.innerHTML = '';
      videoBox.appendChild(videoInput);
      if (state === 'busy') { videoBox.appendChild(el('span', { class: 'video-busy', text: t('video_processing') })); return; }
      if (draftVideo) {
        var thumb = el('div', { class: 'video-thumb' + (draftVideo.poster ? '' : ' no-poster') });
        if (draftVideo.poster) thumb.style.backgroundImage = 'url(' + draftVideo.poster + ')';
        thumb.appendChild(el('span', { class: 'video-play', text: '▶' }));
        var del = el('button', { class: 'btn ghost tiny', type: 'button', text: '🗑 ' + t('video_delete') });
        del.addEventListener('click', function () {
          if (draftVideo && draftVideo.blobId && !draftVideo._blob) videoDeletedBlobId = draftVideo.blobId;
          draftVideo = null; renderVideo('idle');
        });
        videoBox.appendChild(el('div', { class: 'video-done' }, [thumb,
          el('span', { class: 'video-meta', text: fmtDur(draftVideo.dur || 0) + ' · ' + fmtBytes(draftVideo.size || 0) }), del]));
        return;
      }
      var pick = el('button', { class: 'btn ghost', type: 'button', text: '🎬 ' + t('video_add') });
      pick.addEventListener('click', function () { videoInput.click(); });
      videoBox.appendChild(pick);
    }
    renderVideo('idle');

    // ---- location ----
    var locLabel = el('input', { class: 'loc-label', type: 'text', placeholder: t('loc_ph'),
      value: (draftLocation && draftLocation.label) || '' });
    var locCoord = el('span', { class: 'loc-coord' });
    function renderLocCoord() {
      locCoord.textContent = (draftLocation && draftLocation.lat != null)
        ? '📍 ' + draftLocation.lat.toFixed(4) + ', ' + draftLocation.lng.toFixed(4)
          + (draftLocation.acc ? ' ±' + Math.round(draftLocation.acc) + 'm' : '')
        : '';
    }
    renderLocCoord();
    var gpsBtn = el('button', { class: 'btn ghost tiny', type: 'button', text: '📍 ' + t('loc_use') });
    gpsBtn.addEventListener('click', function () {
      if (!navigator.geolocation) { toast('⚠ ' + t('loc_unsupported')); return; }
      gpsBtn.disabled = true; gpsBtn.textContent = '… ' + t('loc_locating');
      navigator.geolocation.getCurrentPosition(function (pos) {
        draftLocation = draftLocation || {};
        draftLocation.lat = pos.coords.latitude;
        draftLocation.lng = pos.coords.longitude;
        draftLocation.acc = pos.coords.accuracy;
        draftLocation.at = Date.now();
        renderLocCoord();
        gpsBtn.disabled = false; gpsBtn.textContent = '📍 ' + t('loc_use');
        toast('📍 ' + t('loc_got'));
      }, function (err) {
        gpsBtn.disabled = false; gpsBtn.textContent = '📍 ' + t('loc_use');
        toast('⚠ ' + t('loc_denied'));
        console.warn('[loc] ' + (err && err.code) + ' ' + (err && err.message));
      }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    });
    var clearLocBtn = el('button', { class: 'btn ghost tiny', type: 'button', text: '✕' });
    clearLocBtn.addEventListener('click', function () { draftLocation = null; locLabel.value = ''; renderLocCoord(); });
    var locationBox = el('div', { class: 'loc-box' }, [locLabel,
      el('div', { class: 'loc-row' }, [gpsBtn, clearLocBtn, locCoord])]);

    var moreDetails = el('details', { class: 'more-details' }, [
      moreSummary, itemsLabel,
      labeledBlock(lang === 'zh' ? '文件' : 'Files', filesBlock),
      labeledBlock('😊 ' + t('mood'), moodRow),
      labeledBlock('👥 ' + t('people'), peopleInput.el),
      labeledBlock('🏷️ ' + t('tags'), tagsInput.el),
      labeledBlock('🎙 ' + t('voice'), audioBox),
      labeledBlock('🎬 ' + t('video'), videoBox),
      labeledBlock('📍 ' + t('location'), locationBox),
      labeled(t('notes'), notesInput)
    ]);
    if ((src && src.items && src.items.length) || (src && src.files && src.files.length) ||
        (src && (src.mood || (src.people||[]).length || (src.tags||[]).length))) moreDetails.open = true;

    // collect + persist. `planned` only matters for NEW commits; editing preserves the
    // commit's existing planned/real state.
    function persistDraftMedia(prevMedia) {
      var media = (prevMedia || []).filter(function (m) { return m.kind !== 'audio' && m.kind !== 'video' && m.kind !== 'photo' && m.kind !== 'file'; });
      var dels = [];
      if (audioDeletedBlobId) dels.push(Store.deleteBlob(audioDeletedBlobId));
      if (videoDeletedBlobId) dels.push(Store.deleteBlob(videoDeletedBlobId));
      if (coverDeletedBlobId) dels.push(Store.deleteBlob(coverDeletedBlobId));
      photoDeletedBlobIds.forEach(function (id) { dels.push(Store.deleteBlob(id)); });

      var chain = Promise.all(dels);

      // ----- audio -----
      chain = chain.then(function () {
        if (draftAudio && !draftAudio._blob && draftAudio.blobId) {
          media.push({ kind: 'audio', blobId: draftAudio.blobId, mime: draftAudio.mime, size: draftAudio.size, dur: draftAudio.dur });
          return;
        }
        if (draftAudio && draftAudio._blob) {
          var aId = 'au_' + Store.uid('a');
          return Store.putBlob(aId, draftAudio._blob).then(function (ok) {
            if (ok) media.push({ kind: 'audio', blobId: aId, mime: draftAudio.mime, size: draftAudio.size, dur: draftAudio.dur });
            else toast('⚠ ' + t('voice_save_fail'));
          });
        }
      });

      // ----- video -----
      chain = chain.then(function () {
        if (draftVideo && !draftVideo._blob && draftVideo.blobId) {
          media.push({ kind: 'video', blobId: draftVideo.blobId, mime: draftVideo.mime, size: draftVideo.size,
            dur: draftVideo.dur, w: draftVideo.w, h: draftVideo.h, poster: draftVideo.poster });
          return;
        }
        if (draftVideo && draftVideo._blob) {
          var vId = 'vd_' + Store.uid('v');
          return Store.putBlob(vId, draftVideo._blob).then(function (ok) {
            if (ok) media.push({ kind: 'video', blobId: vId, mime: draftVideo.mime, size: draftVideo.size,
              dur: draftVideo.dur, w: draftVideo.w, h: draftVideo.h, poster: draftVideo.poster });
            else toast('⚠ ' + t('video_save_fail'));
          });
        }
      });

      // ----- cover photo -----
      chain = chain.then(function () {
        if (draftCover && !draftCover._blob && draftCover.blobId) {
          media.push({ kind: 'photo', cover: true, blobId: draftCover.blobId, thumb: draftCover.thumb,
            w: draftCover.w, h: draftCover.h, mime: draftCover.mime, size: draftCover.size, name: draftCover.name });
          return;
        }
        if (draftCover && draftCover._blob) {
          var pid = 'ph_' + Store.uid('p');
          return Store.putBlob(pid, draftCover._blob).then(function (ok) {
            if (ok) media.push({ kind: 'photo', cover: true, blobId: pid, thumb: draftCover.thumb,
              w: draftCover.w, h: draftCover.h, mime: draftCover.mime, size: draftCover.size, name: draftCover.name });
            else toast('⚠ ' + t('photo_save_fail'));
          });
        }
      });

      // ----- additional photos (blobId ref / _blob new / data legacy) -----
      chain = chain.then(function () {
        return draftPhotos.reduce(function (p, dp) {
          return p.then(function () {
            if (dp.blobId && !dp._blob && !dp.data) {
              media.push({ kind: 'photo', cover: false, blobId: dp.blobId, thumb: dp.thumb, w: dp.w, h: dp.h, mime: dp.mime, size: dp.size, name: dp.name });
              return;
            }
            var blobP = dp._blob ? Promise.resolve(dp._blob) : dataUrlToBlob(dp.data);
            return blobP.then(function (blob) {
              return makeThumb(blob).then(function (tm) {
                var id = 'ph_' + Store.uid('p');
                return Store.putBlob(id, blob).then(function (ok) {
                  if (ok) media.push({ kind: 'photo', cover: false, blobId: id, thumb: dp.thumb || tm.thumb,
                    w: dp.w || tm.w, h: dp.h || tm.h, mime: blob.type || 'image/jpeg', size: blob.size, name: dp.name || 'image.jpg' });
                });
              });
            });
          });
        }, Promise.resolve());
      });

      // ----- non-image files (blobId ref / _blob new / data legacy) -----
      chain = chain.then(function () {
        return draftFiles.reduce(function (p, df) {
          return p.then(function () {
            if (df.blobId && !df._blob && !df.data) {
              media.push({ kind: 'file', blobId: df.blobId, name: df.name, mime: df.type, size: df.size });
              return;
            }
            var blobP = df._blob ? Promise.resolve(df._blob) : dataUrlToBlob(df.data);
            return blobP.then(function (blob) {
              var id = 'fl_' + Store.uid('f');
              return Store.putBlob(id, blob).then(function (ok) {
                if (ok) media.push({ kind: 'file', blobId: id, name: df.name, mime: df.type || blob.type, size: df.size || blob.size });
              });
            });
          });
        }, Promise.resolve());
      });

      return chain.then(function () { return media; });
    }

    function doSave(planned) {
      var items = [];
      itemsWrap.querySelectorAll('.item-row').forEach(function (r) {
        var n = $('.item-name', r).value.trim();
        if (n) items.push({ name: n, qty: parseInt($('.item-qty', r).value, 10) || 1 });
      });
      var createdAt = parseDatetimeLocal(createdAtInput.getValue(), editing ? editing.createdAt : Date.now());
      var remindDays = planned ? null : readRemindDays();
      var remindAt = remindDays ? (createdAt + remindDays * 86400000) : null;
      persistDraftMedia(editing ? editing.media : null).then(function (media) {
        var payload = {
          scene: selectedScene,
          message: msgInput.value.trim() || '(no message)',
          createdAt: createdAt,
          photo: null,
          photoW: null,
          photoH: null,
          photoTakenAt: null,
          items: items,
          files: [],
          notes: notesInput.value.trim(),
          mood: draftMood || null,
          people: peopleInput.get(),
          tags: tagsInput.get(),
          media: media,
          location: (function () {
            var lbl = locLabel.value.trim();
            var hasLoc = lbl || (draftLocation && draftLocation.lat != null);
            return hasLoc ? {
              label: lbl || null,
              lat: draftLocation ? draftLocation.lat : null,
              lng: draftLocation ? draftLocation.lng : null,
              acc: draftLocation ? draftLocation.acc : null,
              at: draftLocation ? draftLocation.at : null
            } : null;
          })(),
          planned: !!planned,
          remindDays: remindDays,
          remindAt: remindAt,
          remindFired: remindAt && editing && editing.remindAt === remindAt ? !!editing.remindFired : false
        };
        if (editing) {
          payload.planned = !!editing.planned;
          if (payload.planned) { payload.remindDays = null; payload.remindAt = null; payload.remindFired = false; }
          var saved = Store.updateCommit(editing.id, payload);
          Notify.cancelFor(editing.id, 'recheck').then(function () { if (saved) scheduleRecheckForCommit(saved); });
          toast('✅ ' + (lang === 'zh' ? '已保存修改' : 'Saved'));
          autoSync(false);
          go('timeline');
          return;
        }
        var ok = Store.addCommit(payload);
        if (!ok) { toast('⚠ ' + (lang === 'zh' ? '存储空间不足，请删除旧照片' : 'Storage full')); return; }
        if (ok.remindAt && !ok.planned) scheduleRecheckForCommit(ok);
        if (planned) { toast('📌 ' + t('planned_saved')); autoSync(false); }
        else {
          var mine = Store.commitsForScene(ok.scene).filter(notPlanned);
          var prev = mine.filter(function (x) { return x.id !== ok.id; })
            .sort(function (a, b) { return b.createdAt - a.createdAt; })[0];
          var gap = prev ? Math.round((ok.createdAt - prev.createdAt) / 86400000) : null;
          var savedMsg = (lang === 'zh')
            ? ('✅ ' + t('saved_value_prefix') + ' · 本场景第 ' + mine.length + ' 次'
              + (gap != null ? ' · 距上次 ' + gap + ' 天' : '') + ' · ' + ((ok.items || []).length) + ' 件物品')
            : ('✅ ' + t('saved_value_prefix') + ' · #' + mine.length + ' here'
              + (gap != null ? ' · ' + gap + 'd since last' : '') + ' · ' + ((ok.items || []).length) + ' items');
          if (!ok.remindAt) {
            toastAction(savedMsg, '📌 ' + t('remind_set_cta'), function () {
              var nextAt = ok.createdAt + 30 * 86400000;
              var updated = Store.updateCommit(ok.id, { remindAt: nextAt, remindDays: 30, remindFired: false });
              if (updated) scheduleRecheckForCommit(updated);
              autoSync(false);
              toast('📌 ' + t('remind_set_done'));
            });
          } else {
            toast(savedMsg);
          }
          autoSync(true);
          Store.setMeta({ lastScene: ok.scene });
          reconcileCaptureNudge();
        } // auto-sync real archives to cloud
        go('timeline');
      });
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
      labeledBlock(t('remind_label'), remindBox),
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
    if (quick) {
      var Cap = window.Capacitor;
      var nativeCam = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform() &&
        Cap.Plugins && Cap.Plugins.Camera);
      if (nativeCam) setTimeout(function () { nativeCamera('CAMERA'); }, 300);
      else setTimeout(function () { if (msgInput) msgInput.focus(); }, 60);
    }
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

  function timeSelect(selectedValue, photoTimeProvider) {
    var root = el('div', { class: 'choice-select time-select' });
    var trigger = el('button', {
      type: 'button', class: 'choice-trigger', 'aria-haspopup': 'dialog',
      onclick: function () { openTimePicker(root); }
    });
    root.appendChild(trigger);
    root._value = selectedValue || datetimeLocalValue(Date.now());
    root.getValue = function () { return root._value; };
    root.getPhotoTime = function () {
      return photoTimeProvider ? photoTimeProvider() : null;
    };
    root.setValue = function (value) {
      var next = String(value || '');
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(next)) return;
      var ts = parseDatetimeLocal(next, Date.now());
      root._value = datetimeLocalValue(ts);
      updateTimeTrigger();
    };
    function updateTimeTrigger() {
      var ts = parseDatetimeLocal(root._value, Date.now());
      trigger.innerHTML = '';
      trigger.appendChild(el('span', { class: 'choice-trigger-text', text: fmtDate(ts) }));
      trigger.appendChild(el('span', { class: 'choice-chevron', text: '⌄' }));
    }
    updateTimeTrigger();
    return root;
  }

  function splitDatetimeValue(value) {
    var v = String(value || datetimeLocalValue(Date.now()));
    var m = v.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/);
    if (m) return { date: m[1], time: m[2] };
    return splitDatetimeValue(datetimeLocalValue(Date.now()));
  }

  function openTimePicker(select) {
    var anchor = (select.querySelector && select.querySelector('.choice-trigger')) || select;
    var parts = splitDatetimeValue(select.getValue());
    var dateI = el('input', { class: 'field tiny-field time-field-input', type: 'date', value: parts.date });
    var timeI = el('input', { class: 'field tiny-field time-field-input', type: 'time', value: parts.time });
    var previewMain = el('div', { class: 'time-preview-main' });
    var previewSub = el('div', { class: 'time-preview-sub' });
    function selectedTs() {
      return parseDatetimeLocal((dateI.value || parts.date) + 'T' + (timeI.value || '00:00'), Date.now());
    }
    function refreshPreview() {
      var ts = selectedTs();
      previewMain.textContent = fmtTime(ts);
      previewSub.textContent = fmtDate(ts).replace(' ', ' · ');
    }
    function setTo(ts) {
      var p = splitDatetimeValue(datetimeLocalValue(ts));
      dateI.value = p.date; timeI.value = p.time;
      refreshPreview();
    }
    dateI.addEventListener('input', refreshPreview);
    timeI.addEventListener('input', refreshPreview);
    refreshPreview();
    var panel = el('div', { class: 'time-panel' }, [
      el('div', { class: 'time-hero' }, [
        el('div', { class: 'time-hero-kicker', text: t('time_pick_title') }),
        previewMain,
        previewSub,
        el('div', { class: 'time-hero-sub', text: t('time_pick_sub') })
      ]),
      el('div', { class: 'time-panel-grid' }, [
        el('label', { class: 'time-field-card' }, [
          el('span', { class: 'time-field-label', text: t('time_date_label') }), dateI
        ]),
        el('label', { class: 'time-field-card' }, [
          el('span', { class: 'time-field-label', text: t('time_time_label') }), timeI
        ])
      ]),
      el('div', { class: 'time-quick' }, [
        el('button', { type: 'button', class: 'btn tiny ghost', text: t('time_now'),
          onclick: function () { setTo(Date.now()); } }),
        el('button', { type: 'button', class: 'btn tiny ghost photo-time-btn', text: t('photo_time'),
          onclick: function () {
            var ts = select.getPhotoTime && select.getPhotoTime();
            if (!ts) { toast(t('photo_time_empty')); return; }
            setTo(ts);
            toast(t('photo_time_set'));
          } })
      ])
    ]);
    var menu = null;
    panel.appendChild(el('div', { class: 'time-panel-actions' }, [
      el('button', { type: 'button', class: 'btn tiny ghost', text: t('cancel'),
        onclick: function () { if (menu) menu.close(); } }),
      el('button', { type: 'button', class: 'btn tiny primary', text: t('time_done'),
        onclick: function () {
          select.setValue(dateI.value + 'T' + (timeI.value || '00:00'));
          if (menu) menu.close();
        } })
    ]));
    menu = openAnchoredMenu(anchor, {
      content: panel,
      compact: true,
      panelClass: 'time-popover'
    });
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
    var panel = el('div', { class: 'popover-menu' + (opts.panelClass ? ' ' + opts.panelClass : ''), role: 'menu' });
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
      var minW = opts.compact ? 240 : (aRect ? aRect.width : 240);
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
  function drawImageStamp(ctx, text, x, y) {
    ctx.save();
    ctx.font = '700 18px sans-serif';
    ctx.textBaseline = 'top';
    var tw = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(9,14,28,.74)';
    ctx.fillRect(x, y, tw + 22, 32);
    ctx.fillStyle = '#f4f7ff';
    ctx.fillText(text, x + 11, y + 7);
    ctx.restore();
  }
  function drawWatermark(ctx, text, x, y) {
    ctx.save();
    ctx.font = '600 20px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#7f8aaa';
    ctx.fillText(text, x, y);
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
      var H = listTop + Math.max(1, lines.length) * 46 + pad + 42;
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
      drawImageStamp(ctx, fmtDate(base.createdAt), pad + 12, iy + imgH - 44);
      drawImageStamp(ctx, fmtDate(comp.createdAt), pad + imgW + gap + 12, iy + imgH - 44);
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
      drawWatermark(ctx, 'Life Archive · ' + (L ? '生成于 ' : 'Generated ') + fmtDate(Date.now()), pad, H - pad);
      return cv;
    });
  }
  function buildCommitCardCanvas(c) {
    var L = lang === 'zh';
    return loadImgEl(commitThumbSrc(c)).then(function (img) {
      var W = 1080, pad = 52, imgW = W - pad * 2, imgH = Math.round(imgW * 0.62);
      var items = (c.items || []).slice(0, 10);
      var H = pad + 76 + imgH + 36 + 86 + Math.max(1, items.length) * 42 + pad + 42;
      var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      var ctx = cv.getContext('2d');
      ctx.fillStyle = '#0b1020'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#8ea2ff'; ctx.font = '700 30px sans-serif'; ctx.textBaseline = 'top';
      ctx.fillText('Life Archive · ' + (L ? '生活存档' : 'Archive proof'), pad, pad);
      ctx.fillStyle = '#9aa6c4'; ctx.font = '400 22px sans-serif';
      ctx.fillText(sceneLabel(Store.sceneById(c.scene)) + ' · ' + fmtDate(c.createdAt), pad, pad + 38);
      var iy = pad + 76;
      drawContain(ctx, img, pad, iy, imgW, imgH);
      drawImageStamp(ctx, fmtDate(c.createdAt), pad + 14, iy + imgH - 46);
      var y = iy + imgH + 34;
      ctx.fillStyle = '#f4f7ff'; ctx.font = '800 34px sans-serif';
      ctx.fillText(c.message || '(no message)', pad, y);
      y += 54;
      ctx.fillStyle = '#9aa6c4'; ctx.font = '500 24px sans-serif';
      ctx.fillText((c.items || []).length + ' ' + (Store.isMealScene(c.scene) ? (L ? '条食物/备注' : 'food item(s)') : t('items_count')), pad, y);
      y += 48;
      ctx.font = '500 26px sans-serif';
      if (!items.length) {
        ctx.fillStyle = '#7f8aaa';
        ctx.fillText(L ? '未填写清单' : 'No checklist items', pad, y);
      } else {
        items.forEach(function (it, idx) {
          ctx.fillStyle = '#e6e9f5';
          ctx.fillText('• ' + it.name + ((it.qty || 1) > 1 ? ' ×' + (it.qty || 1) : ''), pad, y + idx * 42);
        });
        if ((c.items || []).length > items.length) {
          ctx.fillStyle = '#9aa6c4';
          ctx.fillText('+ ' + ((c.items || []).length - items.length), pad, y + items.length * 42);
        }
      }
      drawWatermark(ctx, 'Life Archive · ' + (L ? '生成于 ' : 'Generated ') + fmtDate(Date.now()), pad, H - pad);
      return cv;
    });
  }
  function buildGrowthMontageCanvas(commitsOldToNew, sceneId) {
    var L = lang === 'zh';
    var picks = sampleEvenly(commitsOldToNew, 9);
    var sc = Store.sceneById(sceneId);
    return Promise.all(picks.map(function (c) { return loadImgEl(commitThumbSrc(c)); })).then(function (imgs) {
      var W = 1080, pad = 48, cols = 3;
      var rows = Math.ceil(picks.length / cols);
      var gap = 18, cellW = Math.floor((W - pad * 2 - gap * (cols - 1)) / cols);
      var cellH = Math.round(cellW * 0.75), capH = 34;
      var headH = 102, footH = 64;
      var H = headH + rows * (cellH + capH + gap) - gap + footH;
      var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      var ctx = cv.getContext('2d');
      ctx.fillStyle = '#0b1020'; ctx.fillRect(0, 0, W, H);
      ctx.textBaseline = 'top';

      ctx.fillStyle = '#8ea2ff'; ctx.font = '700 30px sans-serif';
      ctx.fillText('Life Archive · ' + sceneLabel(sc) + ' · ' + (L ? '时光历程' : 'Time-lapse'), pad, pad);
      ctx.fillStyle = '#9aa6c4'; ctx.font = '400 22px sans-serif';
      ctx.fillText(t('growth_count_span').replace('{n}', commitsOldToNew.length)
        .replace('{span}', spanLabel(commitsOldToNew[0].createdAt, commitsOldToNew[commitsOldToNew.length - 1].createdAt)),
        pad, pad + 38);

      picks.forEach(function (c, i) {
        var r = Math.floor(i / cols), col = i % cols;
        var x = pad + col * (cellW + gap), y = headH + r * (cellH + capH + gap);
        ctx.fillStyle = '#141a30'; ctx.fillRect(x, y, cellW, cellH);
        if (imgs[i]) drawContain(ctx, imgs[i], x, y, cellW, cellH);
        drawImageStamp(ctx, fmtDate(c.createdAt), x + 10, y + cellH - 42);
        ctx.fillStyle = '#9aa6c4'; ctx.font = '500 18px sans-serif';
        var tag = i === 0 ? t('growth_oldest') : (i === picks.length - 1 ? t('growth_newest') : '');
        ctx.fillText(fmtDate(c.createdAt) + (tag ? ' · ' + tag : ''), x + 2, y + cellH + 8);
      });
      drawWatermark(ctx, 'Life Archive · ' + (L ? '生成于 ' : 'Generated ') + fmtDate(Date.now()), pad, H - 28);
      return cv;
    });
  }
  // Show a generated image with save options (works on desktop + long-press on mobile).
  // Fullscreen swipeable image viewer. entries: [{thumb|data, blobId?, name, ...}].
  // opts: { captions?:[], title?, subtitle? }. thumb-first, then resolveMediaBlob → full-res.
  function openGallery(entries, startIndex, opts) {
    entries = (entries || []).filter(Boolean);
    if (!entries.length) return;
    opts = opts || {};
    var i = Math.max(0, Math.min(startIndex || 0, entries.length - 1));
    closePopover();
    var mask = el('div', { class: 'gal-mask' });
    var track = el('div', { class: 'gal-track' });
    entries.forEach(function (e) {
      var img = el('img', { class: 'gal-img', src: e.thumb || e.data || '', alt: e.name || '', draggable: 'false' });
      if (e.blobId) resolveMediaBlob(e.blobId).then(function (b) { if (b) img.src = URL.createObjectURL(b); });
      track.appendChild(el('div', { class: 'gal-slide' }, [img]));
    });
    var dots = el('div', { class: 'gal-dots' }, entries.map(function (_, k) {
      return el('span', { class: 'gal-dot' + (k === i ? ' on' : '') });
    }));
    if (entries.length < 2) dots.style.display = 'none';
    var caption = el('div', { class: 'gal-cap' });
    var header = opts.title ? el('div', { class: 'gal-head' }, [
      el('div', { class: 'gal-title', text: opts.title }),
      opts.subtitle ? el('div', { class: 'gal-sub', text: opts.subtitle }) : null
    ]) : null;
    var closeB = el('button', { class: 'gal-close', text: '✕', onclick: function () { close(); } });
    mask.appendChild(closeB);
    if (header) mask.appendChild(header);
    mask.appendChild(track);
    mask.appendChild(dots);
    mask.appendChild(caption);
    document.body.appendChild(mask);

    function W() { return mask.clientWidth; }
    function layout(animate) {
      track.style.transition = animate ? 'transform .42s cubic-bezier(.2,.9,.25,1.04)' : 'none';
      track.style.transform = 'translateX(' + (-i * W()) + 'px)';
      dots.querySelectorAll('.gal-dot').forEach(function (d, k) { d.classList.toggle('on', k === i); });
      var cap = (opts.captions && opts.captions[i]) || entries[i].name || (entries.length > 1 ? (i + 1) + ' / ' + entries.length : '');
      caption.textContent = cap;
    }
    function go(n) { i = Math.max(0, Math.min(n, entries.length - 1)); layout(true); }
    function close() { mask.classList.remove('open'); setTimeout(function () { mask.remove(); }, 260); }

    var startX = 0, dx = 0, dragging = false, t0 = 0;
    function down(x) { dragging = true; startX = x; dx = 0; t0 = Date.now(); track.style.transition = 'none'; }
    function move(x) {
      if (!dragging) return; dx = x - startX;
      var damp = ((i === 0 && dx > 0) || (i === entries.length - 1 && dx < 0)) ? 0.35 : 1;
      track.style.transform = 'translateX(' + (-i * W() + dx * damp) + 'px)';
    }
    function up() {
      if (!dragging) return; dragging = false;
      var dt = Date.now() - t0, vx = dx / Math.max(1, dt);
      if (dx < -W() * 0.22 || vx < -0.5) go(i + 1);
      else if (dx > W() * 0.22 || vx > 0.5) go(i - 1);
      else layout(true);
    }
    track.addEventListener('touchstart', function (e) { down(e.touches[0].clientX); }, { passive: true });
    track.addEventListener('touchmove', function (e) { move(e.touches[0].clientX); }, { passive: true });
    track.addEventListener('touchend', up);
    track.addEventListener('mousedown', function (e) {
      e.preventDefault(); down(e.clientX);
      function mm(ev) { move(ev.clientX); }
      function mu() { up(); document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); }
      document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
    });
    track.querySelectorAll('.gal-slide').forEach(function (s) {
      s.addEventListener('dblclick', function () { s.firstChild.classList.toggle('zoom'); });
    });
    function onKey(e) { if (e.key === 'ArrowRight') go(i + 1); else if (e.key === 'ArrowLeft') go(i - 1); else if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    var onResize = function () { layout(false); };
    window.addEventListener('resize', onResize);
    var _rm = mask.remove.bind(mask);
    mask.remove = function () { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); _rm(); };

    requestAnimationFrame(function () { mask.classList.add('open'); layout(false); });
  }

  /* ---- AI memory album: curate photos + AI title/narrative, shown in the swipe viewer ---- */
  function albumCandidates(opts) {
    opts = opts || {};
    var all = Store.commits().filter(notPlanned).filter(function (c) {
      return photoMedia(c).length || (c.files || []).some(isImageFile) || c.photo;
    });
    if (opts.kind === 'recent') { var cut = Date.now() - (opts.sinceDays || 120) * 86400000; all = all.filter(function (c) { return c.createdAt >= cut; }); }
    else if (opts.kind === 'person') all = all.filter(function (c) { return (c.people || []).indexOf(opts.value) >= 0; });
    else if (opts.kind === 'place') all = all.filter(function (c) { return c.location && c.location.label === opts.value; });
    else if (opts.kind === 'scene') all = all.filter(function (c) { return c.scene === opts.value; });
    var picked = [];
    all.forEach(function (c) {
      var e = commitImageEntries(c)[0];
      if (e) picked.push({ e: e, c: c, starred: !!c.starred, at: c.createdAt });
    });
    // starred-first to choose the most memorable N, then display in chronological order
    picked.sort(function (a, b) { return (b.starred ? 1 : 0) - (a.starred ? 1 : 0) || a.at - b.at; });
    return picked.slice(0, opts.max || 9).sort(function (a, b) { return a.at - b.at; });
  }
  function aiAlbum(cands) {
    var L = lang === 'zh';
    function heuristic() {
      var span = spanLabel(cands[0].at, cands[cands.length - 1].at);
      return { title: (L ? '这段时间 · ' : 'A while · ') + span, subtitle: '',
        captions: cands.map(function (x) { return x.c.message || ''; }) };
    }
    if (!AI.getKey()) return Promise.resolve(heuristic());
    var content = [{ type: 'text', text: '下面是我相册里按时间排列的若干生活照片缩略图。请为它们生成一本"回忆图集"。严格只返回 JSON，不要解释、不要 markdown：{"title":"温暖的图集标题，12字内","subtitle":"一句副标题/引言，20字内","captions":["每张图一句中文短句，12字内，与图一一对应"]}。captions 数量必须等于图片数量。' }];
    cands.forEach(function (x) { content.push({ type: 'image_url', image_url: { url: AI._b64(x.e.thumb || x.e.data) } }); });
    return AI._chat(content).then(function (r) {
      var caps = Array.isArray(r.captions) ? r.captions : [];
      return { title: r.title || heuristic().title, subtitle: r.subtitle || '',
        captions: cands.map(function (x, k) { return caps[k] || x.c.message || ''; }) };
    }).catch(heuristic);
  }
  function openMemoryAlbum(opts) {
    var L = lang === 'zh';
    var cands = albumCandidates(opts || { kind: 'recent', sinceDays: 120, max: 9 });
    if (cands.length < 2) { toast(L ? '照片太少，攒不出图集' : 'Not enough photos yet'); return; }
    toast('✨ ' + (L ? '正在生成回忆图集…' : 'Building your album…'));
    aiAlbum(cands).then(function (al) {
      var entries = cands.map(function (x) { return x.e; });
      openGallery(entries, 0, { captions: al.captions, title: al.title, subtitle: al.subtitle });
    });
  }

  function showImageModal(dataUrl, filename) {
    var L = lang === 'zh';
    closePopover();
    var mask = el('div', { class: 'img-modal' });
    var img = el('img', { class: 'img-modal-img', src: dataUrl, alt: '' });
    var dl = el('a', { class: 'btn primary tiny', text: L ? '下载图片' : 'Download',
      href: dataUrl, download: filename || 'life-archive-diff.png' });
    var actions = [dl];
    if (ShareOut.available()) {
      actions.push(el('button', { type: 'button', class: 'btn tiny', text: t('share_image'),
        onclick: function () {
          ShareOut.shareDataUrl(dataUrl, filename || 'life-archive.png').then(function (ok) {
            if (!ok) toast(L ? '分享失败，可先下载图片' : 'Share failed — download the image instead');
          });
        } }));
    }
    var hint = el('div', { class: 'img-modal-hint', text: L ? '长按图片可保存 / 分享' : 'Long-press the image to save / share' });
    var closeB = el('button', { type: 'button', class: 'img-modal-close', text: '✕', onclick: function () { mask.remove(); } });
    mask.addEventListener('click', function (e) { if (e.target === mask) mask.remove(); });
    mask.appendChild(closeB);
    mask.appendChild(el('div', { class: 'img-modal-body' }, [img, el('div', { class: 'img-modal-actions' }, actions), hint]));
    document.body.appendChild(mask);
    requestAnimationFrame(function () { mask.classList.add('open'); });
  }

  /* ---------------- Time-lapse ---------------- */
  var pendingGrowth = null;
  function sampleEvenly(arr, n) {
    if (!arr.length || n <= 0) return [];
    if (arr.length <= n) return arr.slice();
    if (n === 1) return [arr[0]];
    var out = [], step = (arr.length - 1) / (n - 1);
    for (var i = 0; i < n; i++) out.push(arr[Math.round(i * step)]);
    return out;
  }
  function spanLabel(oldestTs, newestTs) {
    var days = Math.max(0, Math.round((newestTs - oldestTs) / 86400000));
    if (lang === 'zh') return days >= 60 ? (Math.round(days / 30) + ' 个月') : (days + ' 天');
    return days >= 60 ? (Math.round(days / 30) + ' months') : (days + ' days');
  }
  function openGrowthForScene(sceneId) {
    if (realCommitsForScene(sceneId).length < 2) { toast(t('growth_need_two')); return; }
    pendingGrowth = sceneId;
    routeOrRefresh('growth');
  }
  function renderGrowth(v) {
    var L = lang === 'zh';
    var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (L ? '返回' : 'Back') });
    back.addEventListener('click', function () { if (!goBack()) go('timeline'); });
    v.appendChild(el('div', { class: 'view-head growth-head' }, [back, el('h1', { text: t('nav_growth') })]));

    var scenes = Store.allScenes().filter(function (s) { return realCommitsForScene(s.id).length >= 2; });
    if (!scenes.length) { v.appendChild(noticeCard(t('growth_need_two'))); return; }

    var sceneId = pendingGrowth && scenes.some(function (s) { return s.id === pendingGrowth; })
      ? pendingGrowth : scenes[0].id;
    pendingGrowth = null;

    var sel = choiceSelect(scenes.map(function (s) { return { value: s.id, text: sceneLabel(s) }; }), sceneId);
    sel.onChange(function () { pendingGrowth = sel.getValue(); routeOrRefresh('growth'); });
    v.appendChild(el('div', { class: 'labeled growth-picker' }, [
      el('span', { class: 'label-text', text: t('growth_pick_scene') }), sel
    ]));

    var list = realCommitsForScene(sceneId).slice().reverse();
    var oldest = list[0], newest = list[list.length - 1];
    v.appendChild(el('div', { class: 'growth-summary',
      text: t('growth_count_span').replace('{n}', list.length).replace('{span}', spanLabel(oldest.createdAt, newest.createdAt)) }));

    v.appendChild(el('div', { class: 'growth-actions' }, [
      el('button', { class: 'btn', text: '🔍 ' + t('growth_first_last'), onclick: function () {
        pendingDiff = { sceneId: sceneId, commitId: newest.id, baseId: oldest.id };
        go('diff');
      } }),
      el('button', { class: 'btn primary', text: '⤴ ' + t('growth_export'), onclick: function () {
        toast(L ? '正在生成…' : 'Building…');
        buildGrowthMontageCanvas(list, sceneId).then(function (cv) {
          showImageModal(cv.toDataURL('image/png'), 'life-archive-growth-' + sceneId + '.png');
        });
      } })
    ]));

    var strip = el('div', { class: 'growth-strip' });
    list.forEach(function (c, i) {
      var frame = el('button', { type: 'button', class: 'growth-frame' });
      var thumb = commitThumbSrc(c);
      if (thumb) frame.appendChild(el('img', { class: 'growth-frame-img', src: thumb, loading: 'lazy', decoding: 'async', alt: '' }));
      else frame.appendChild(el('div', { class: 'growth-frame-noimg', text: '📷' }));
      var tag = i === 0 ? t('growth_oldest') : (i === list.length - 1 ? t('growth_newest') : '');
      frame.appendChild(el('div', { class: 'growth-frame-cap',
        text: fmtDate(c.createdAt) + (tag ? ' · ' + tag : '') }));
      frame.addEventListener('click', function () { pendingDetail = c.id; go('detail'); });
      strip.appendChild(frame);
    });
    v.appendChild(strip);

    var tr = sceneTrend(sceneId);
    function chips(label, arr) {
      if (!arr || !arr.length) return null;
      return el('div', { class: 'growth-insight-row' }, [
        el('span', { class: 'growth-insight-label', text: label }),
        el('span', { class: 'growth-insight-values', text: arr.map(function (x) { return x.name + '×' + x.count; }).join('  ') })
      ]);
    }
    var ins = [chips(t('growth_most_stable'), tr.mostStable),
      chips(t('growth_most_gone'), tr.mostDisappeared),
      chips(t('growth_most_added'), tr.mostAdded)].filter(Boolean);
    if (ins.length) {
      v.appendChild(el('section', { class: 'set-card growth-insights' },
        [el('div', { class: 'growth-insights-head', text: '📈 ' + t('growth_insights') })].concat(ins)));
    }
  }

  /* ---------------- Reality Diff ---------------- */
  var pendingDiff = null;
  function renderDiff(v) {
    var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (lang === 'zh' ? '返回' : 'Back') });
    back.addEventListener('click', function () { if (!goBack()) go('timeline'); });
    v.appendChild(el('div', { class: 'view-head' }, [back, el('h1', { text: t('nav_diff') })]));
    var allReal = Store.commits().filter(notPlanned);
    if (allReal.length < 2) { v.appendChild(noticeCard(t('need_two'))); return; }

    var scenesWith2 = Store.allScenes().filter(function (s) { return realCommitsForScene(s.id).length >= 2; });
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
    // Export is now just a compact share icon next to the primary AI button (was a full
    // text button that crowded the layout); long label lives in aria-label/title.
    var exportBtn = el('button', { class: 'btn ghost diff-export-btn', type: 'button',
      'aria-label': (L ? '导出对比卡片' : 'Export comparison card'),
      title: (L ? '导出对比卡片' : 'Export comparison card'),
      onclick: function () { exportCard(); } });
    exportBtn.innerHTML = shareSVG();
    v.appendChild(el('div', { class: 'diff-action-bar' }, [
      el('button', { class: 'btn ai-diff-btn', text: '✨ ' + (L ? 'AI 解读变化' : 'AI read changes'),
        onclick: function () { runAIDiff(); } }),
      exportBtn
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
      function make(pct) { buildDiffCardCanvas(base, comp, d, pct).then(function (cv) {
        showImageModal(cv.toDataURL('image/png'), 'life-archive-diff-' + shortId(base.id) + '-' + shortId(comp.id) + '.png');
      }); }
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
      card.appendChild(el('div', { class: 'trend-head trend-head-actions' }, [
        el('span', { text: '📈 ' + (L ? '场景趋势与洞察' : 'Scene trend & insights') }),
        el('button', { type: 'button', class: 'btn tiny ghost trend-growth-btn',
          text: t('growth_open'), onclick: function () { openGrowthForScene(sceneSel.getValue()); } })
      ]));
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
    var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (lang === 'zh' ? '返回' : 'Back') });
    back.addEventListener('click', function () { if (!goBack()) go('timeline'); });
    v.appendChild(el('div', { class: 'view-head' }, [back, el('h1', { text: t('nav_rollback') })]));
    var commits = Store.commits().filter(notPlanned);
    if (!commits.length) { v.appendChild(noticeCard(t('empty_title'))); return; }

    var pre = Store.getCommit(pendingRollback);
    var initialCommit = (pre && !pre.planned) ? pre : commits[0];
    pendingRollback = null;
    var scenes = Store.allScenes().filter(function (s) {
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
    var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (lang === 'zh' ? '返回' : 'Back') });
    back.addEventListener('click', function () { if (!goBack()) go('timeline'); });
    v.appendChild(el('div', { class: 'view-head' }, [back, el('h1', { text: t('nav_branch') })]));

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
          var savedBranch = Store.updateBranch(editing.id, patch);
          Notify.cancelFor(editing.id, 'due').then(function () { if (savedBranch) scheduleDueForBranch(savedBranch); });
          branchEditingId = null;
          toast('✅ ' + t('save_branch'));
        } else {
          var newBranch = Store.addBranch({
            question: patch.question, branches: patch.branches, dueAt: patch.dueAt,
            confidence: patch.confidence, tags: patch.tags, contextCommitId: patch.contextCommitId,
            chosenIndex: null, followup: null, actual: [], hits: []
          });
          scheduleDueForBranch(newBranch);
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
        if (confirm(t('confirm_delete_branch'))) { deleteBranchWithCleanup(b.id); pendingBranchDetail = null; renderNav(); go('branch'); }
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
        Notify.cancelFor(b.id, 'due');
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

  var BACKUP_SCHEMA = 1;
  function ymd(d) {
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(String(r.result).split(',')[1] || ''); };
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }
  function base64ToBlob(b64, mime) {
    var bin = atob(b64 || ''), n = bin.length, u8 = new Uint8Array(n);
    for (var i = 0; i < n; i++) u8[i] = bin.charCodeAt(i);
    return new Blob([u8], { type: mime || 'application/octet-stream' });
  }
  function collectBackupBlobs() {
    var ids = {};
    Store.commits().forEach(function (c) {
      (c.media || []).forEach(function (m) {
        if (m && m.blobId) ids[m.blobId] = 1;
      });
    });
    var keys = Object.keys(ids);
    if (!keys.length || !Store.getBlob) return Promise.resolve(null);
    var out = {};
    return keys.reduce(function (p, id) {
      return p.then(function () {
        return Store.getBlob(id).then(function (b) {
          return b ? blobToBase64(b) : null;
        }).then(function (b64) {
          if (b64 != null) out[id] = b64;
        });
      });
    }, Promise.resolve()).then(function () { return out; });
  }
  function normalizeBackupData(raw) {
    var incoming = (raw && raw.data && Array.isArray(raw.data.commits)) ? raw.data : raw;
    if (!incoming || !Array.isArray(incoming.commits)) return null;
    return {
      commits: incoming.commits || [],
      branches: Array.isArray(incoming.branches) ? incoming.branches : [],
      tombstones: incoming.tombstones || {},
      blobs: incoming.blobs || null
    };
  }
  function exportData() {
    toast(lang === 'zh' ? '正在打包备份...' : 'Packing backup...');
    collectBackupBlobs().then(function (blobs) {
      var data = Store.exportRaw();
      if (blobs) data.blobs = blobs;
      var envelope = {
        app: 'life-archive',
        schema: BACKUP_SCHEMA,
        version: window.APP_VERSION || '',
        exportedAt: Date.now(),
        data: data
      };
      var name = 'lifearchive-backup-' + ymd(new Date()) + '.json';
      var url = URL.createObjectURL(new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' }));
      var a = el('a', { href: url, download: name });
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 0);
      Store.setMeta({ lastBackupAt: Date.now() });
      toast('✓ ' + t('backup_done'));
    }).catch(function (e) {
      toast('⚠ ' + (e && e.message || (lang === 'zh' ? '备份失败' : 'Backup failed')));
    });
  }
  function importData(file) {
    if (!file) return;
    toast(t('import_working'));
    var reader = new FileReader();
    reader.onload = function () {
      var raw, incoming;
      try {
        raw = JSON.parse(reader.result);
        incoming = normalizeBackupData(raw);
      } catch (e) {
        toast('⚠ ' + t('import_bad'));
        return;
      }
      if (!incoming) { toast('⚠ ' + t('import_bad')); return; }

      function applyData() {
        var restored = Store.isEmpty();
        var next = restored ? incoming : mergeData(Store.exportRaw(), incoming);
        Store.replaceAll(next);
        renderNav();
        render();
        autoSync(false);
        toast('✓ ' + t('import_done').replace('{n}', Store.commits().length));
        if (typeof Notify !== 'undefined' && Notify.syncAll) Notify.syncAll();
      }

      var blobs = incoming.blobs;
      if (blobs && Store.putBlob) {
        Object.keys(blobs).reduce(function (p, id) {
          return p.then(function () {
            var mime = mimeForBlobId(incoming.commits, id) || 'application/octet-stream';
            return Store.putBlob(id, base64ToBlob(blobs[id], mime));
          });
        }, Promise.resolve()).then(applyData).catch(function () { toast('⚠ ' + t('import_bad')); });
      } else {
        applyData();
      }
    };
    reader.onerror = function () { toast('⚠ ' + t('import_bad')); };
    reader.readAsText(file);
  }
  function mimeForBlobId(commits, id) {
    var hit = null;
    (commits || []).some(function (c) {
      return (c.media || []).some(function (m) {
        if (m && m.blobId === id) { hit = m.mime; return true; }
        return false;
      });
    });
    return hit;
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
    var today = new Date(); today.setHours(10, 0, 0, 0);
    var lastYear = new Date(today); lastYear.setFullYear(today.getFullYear() - 1);
    var lastMonth = new Date(today); lastMonth.setMonth(today.getMonth() - 1);
    Store.addCommit({ scene: 'desk', createdAt: lastYear.getTime(),
      message: lang === 'zh' ? '去年今天的书桌' : 'Desk on this day last year',
      items: [{ name: lang === 'zh' ? '书桌状态' : 'Desk state', qty: 1 }] });
    Store.addCommit({ scene: 'room', createdAt: lastMonth.getTime(),
      message: lang === 'zh' ? '上个月今天的房间' : 'Room on this day last month',
      items: [{ name: lang === 'zh' ? '房间状态' : 'Room state', qty: 1 }] });
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
    ['1.19.1', '2026-06-16', 'Toast 大内容修复 + 字重收敛',
      'Toast long-content fix + lighter weights',
      ['修复 toast 在内容较长时的显示问题：长字符串（如报错原文/链接）现在会优雅换行而不再横向溢出；多行时左侧色点对齐到第一行；带按钮的 toast 让文字可收缩、按钮不被挤变形；超长内容加滚动与字数上限，并按长度自动延长显示时间。',
       '字重收敛：把若干"黑体级"(900) 字重降到 700，更贴近澎湃的精致质感。',
       '存档标题/描述也加了长串换行保护。'],
      ['Fix toast rendering with longer content: long unbroken strings (error text, links) now wrap gracefully instead of overflowing; the color dot aligns to the first line on multi-line toasts; action toasts let the message shrink without squashing the button; very long content scrolls and is length-capped, with display time scaling to length.',
       'Lighter weights: dropped several "black" (900) weights to 700 for a more refined HyperOS feel.',
       'Long-string wrap protection added to archive titles/messages too.']],
    ['1.19.0', '2026-06-15', '体验层：滑动大图 + AI 回忆图集 + 澎湃质感',
      'Experience: swipeable gallery + AI memory album + HyperOS polish',
      ['Toast 改为磨砂玻璃质感 + 语义色点（成功/警告/同步自动分色）+ 轻回弹进场，更贴合澎湃美学；老 WebView 自动回退不透明底。',
       '详情图片支持全屏「左右滑动」大图查看：手势跟手 + 惯性翻页 + 边缘回弹 + 圆点指示 + 键盘 ←/→/Esc + 双击放大；缩略图先上屏、全图按需加载。',
       '新增「✨ 生成回忆图集」（回顾页）：自动挑选一段时间的照片，用 AI 起标题、写引言、配短句，做成可滑动的图集；无 AI Key 或离线时用启发式降级，不卡。',
       '细腻动画与小巧思：卡片按压回弹、时间线日期组错峰入场、星标爆点、回忆卡光泽；全部尊重「减少动态效果」无障碍设置。',
       '纯体验层改动，不动数据 / 云 / 桶；跨设备缺全图时查看器用缩略图兜底不崩。'],
      ['Toast restyled as frosted glass with a semantic color dot (success/warn/sync) and a gentle spring entrance, matching the HyperOS aesthetic; opaque fallback on老 WebViews.',
       'Detail photos open a fullscreen swipeable viewer: drag-to-follow, inertial paging, edge rebound, dot indicator, ←/→/Esc keys, double-tap zoom; thumbnail first, full image on demand.',
       'New "AI memory album" in Memories: auto-picks photos over a period and uses AI to write a title, intro, and per-photo captions into a swipeable album; falls back to a heuristic when offline or without an AI key.',
       'Delicate micro-animations: card press rebound, staggered date-group entrance, star pop, resurface-card sheen; all respect the reduce-motion setting.',
       'Experience-layer only — no data/cloud/bucket changes; the viewer falls back to thumbnails when the full image is not on this device.']],
    ['1.18.0', '2026-06-15', '存储收尾：捕获真瘦身 + 附件进桶 + 孤儿 GC',
      'Storage finish: real slimming + files to bucket + orphan cleanup',
      ['修复新建/编辑照片仍内联进云存档的问题——封面/多图/附件现在保存即只存引用（media[]），同步体积真正随存档增长而不再变重。',
       '非图片附件（PDF/文档）也进私有桶，跨设备可下载（按需 resolve + 本地缓存）。',
       '详情文件区读 media[kind:\'file\']，下载经 resolveMediaBlob；离线给提示不崩。',
       '新增「清理缓存」按钮，回收无用孤儿 blob（本机 + 桶）。',
       '删除 commit 时本机 blob 回收改为引用感知——回滚共享 blobId 不误删原图。',
       '旧数据迁移泛化：非图片附件也一并迁入 media[kind:\'file\']。',
       '不改桶/RLS/表结构；全程 legacy 兜底；可回退。'],
      ['Fix: new/edit photos were still inlined into cloud archives — cover/multiple photos/attachments now save only references (media[]) on first save, so sync size truly stays flat as archives grow.',
       'Non-image attachments (PDF/documents) also go into the private bucket, downloadable cross-device (on-demand resolve + local cache).',
       'Detail files section reads media[kind:\'file\'], downloads via resolveMediaBlob; offline shows a toast, doesn\'t crash.',
       'New "Clean up cache" button回收 orphaned blobs (local + bucket).',
       'Local blob回收 on commit delete is now reference-aware — rollbacks sharing a blobId won\'t have their originals deleted.',
       'Legacy migration generalized: non-image files also migrate into media[kind:\'file\'].',
       'No bucket/RLS/schema changes; full legacy fallback; reversible.']],
    ['1.17.0', '2026-06-15', '照片进桶：缩略图内联 + 全图进桶 + 同步瘦身',
      'Photos to bucket: inline thumbs + full images in cloud + smaller sync',
      ['照片改为「缩略图内联 + 全图进桶」模型：时间线和缩略条用内联小图（~20–50KB）即时渲染，全图存在 IndexedDB + Supabase 桶、按需下载缓存。',
       '云同步 jsonb 体积大幅下降：不再把整张照片 base64 塞进一行存档，只带轻量 thumb + blobId 引用。',
       '复用 v1.16 媒体桶管道：照片自动随 syncMediaUp 上传、resolveMediaBlob 按需下载、删除时回收桶对象。',
       '旧内联照片在后台空闲时逐步迁移（migrateInlinePhotos），期间照常可用；迁移可回退。',
       '详情页封面先显示 thumb 随即换全图（清晰）；画廊/导出/现实对比使用全分辨率。',
       '删除回收守卫：共享 blobId（回滚复制）时不会误删仍在使用的原图。'],
      ['Photos move to "inline thumbnail + full image in bucket" model: timeline/thumbnails use small inline JPEGs (~20–50KB) for instant rendering; full images stored in IndexedDB + Supabase bucket, downloaded on demand and cached.',
       'Cloud sync jsonb shrinks dramatically: no more base64 photos in the archive row — just lightweight thumb + blobId references.',
       'Reuses v1.16 media bucket pipeline: photos auto-upload via syncMediaBlob, download via resolveMediaBlob,回收 on delete.',
       'Legacy inline photos migrate gradually in the background (migrateInlinePhotos), remain usable during migration; reversible.',
       'Detail cover shows thumb first then swaps to full-res; gallery/export/reality-diff use full resolution.',
       'Shared-blobId guard: rollbacks that copy blobId references won\'t have their originals deleted prematurely.']],
    ['1.16.0', '2026-06-15', '云端媒体桶：语音/视频跨设备真同步',
      'Cloud media bucket: voice/video cross-device sync',
      ['语音/视频现在通过 Supabase 私有媒体桶跨设备同步：在一台设备录制，同账号登录另一台即可播放（按需下载、本地缓存、第二次秒播）。',
       '同步时自动上传未上传的媒体 Blob；删除存档会回收云端媒体对象；离线/缺失优雅占位不卡死。',
       '设置页账号卡新增「上传媒体」按钮，显示待上传数量，可手动触发上传。',
       '需补跑建桶 SQL（见 SUPABASE-SETUP.md 第 6 步）；不改 store 数据结构 / jsonb 表结构；备份导入路径保留。'],
      ['Voice/video now sync across devices via a private Supabase Storage bucket: record on one device, play on another (on-demand download, local cache, instant replay after first fetch).',
       'Sync auto-uploads unuploaded media blobs; deleting a commit回收 cloud objects; offline/missing gracefully degrade.',
       'Settings account card adds an "Upload media" button showing pending count for manual upload.',
       'Requires running the bucket-creation SQL (see SUPABASE-SETUP.md step 6); no store/jsonb schema changes; backup import path preserved.']],
    ['1.15.0', '2026-06-15', '导航收敛：底栏只留时间线 · 回顾 · ＋新建',
      'Nav consolidation: timeline · memories · +new',
      ['底部导航收敛为「时间线 · 回顾 ·（＋新建）」三项，把「回顾」从藏在按钮后提升为常驻一级入口，让回看真正有家。',
       '现实对比 / 回滚 / 分支决策功能全部保留、一行逻辑不删，只是挪进更顺手的位置：对比/回滚在存档详情页直接发起，分支决策移入设置页（有待决策时带数字徽标）。',
       '有到期决策时，时间线顶部出现「🔀 有 N 个决策待回顾」横幅提醒，比底栏小红点更显眼。',
       '纯导航与入口重排，不改任何数据 / 云 / 备份 / 功能逻辑。'],
      ['Bottom nav consolidates to "Timeline · Memories · (+new)" — elevates "Memories" to a permanent first-level tab so resurfacing has a real home.',
       'Reality diff / rollback / branch decisions are fully preserved (zero logic deleted), just relocated to more natural entry points: diff/rollback from the archive detail page, branch decisions in Settings (with pending-count badge).',
       'Overdue decisions now surface as a banner at the top of the timeline ("🔀 N decisions to review"), more visible than the old bottom-nav badge.',
       'Pure navigation reshuffle — no data / cloud / backup / functional logic changes.']],
    ['1.14.0', '2026-06-15', '内联回忆卡 + 时间线维度透镜',
      'Inline memory cards + timeline dimension lenses',
      ['时间线顶部把「那年今日」从横幅升级为内联回忆卡：直接显示当时封面 + 一句话 +「N 年前的今天」，点卡进当年详情，可✕收起；多条记忆保留「查看全部」入口去回顾页。',
       '时间线新增人物 / 心情 / 地点透镜：详情页点人物、心情、地点即可跳回时间线按该维筛选，顶部显示可一键清除的当前筛选 pill。',
       '时间线卡片副行新增 📍 地点小标，存档的地点信息在列表里一目了然。',
       '纯展示层与筛选状态，不改数据结构 / 云 / 备份 / 权限。'],
      ['Timeline top upgrades the "On this day" banner to an inline memory card: shows the original cover photo + message + "N years ago today"; tap to open that archive\'s detail; ✕ to dismiss for this session; "See all" preserves the Memories entry.',
       'Timeline adds person / mood / place dimension lenses: tapping a person chip, mood emoji, or place button on the detail page jumps back to the timeline filtered by that dimension, with a clearable pill at the top.',
       'Timeline cards now show a 📍 place indicator in the subtitle row when location data is present.',
       'Pure presentation and filter state — no data-structure / cloud / backup / permission changes.']],
    ['1.13.0', '2026-06-09', '七维收官：视频 + 定位',
      'Seven dimensions complete: video + location',
      ['新增「视频」：表单内可拍/选一段视频（用系统相机），自动抽取封面帧存为内联 poster，视频本体存进 IndexedDB blobs 仓，commit 上挂 media[kind:video] 引用；时间线卡显示封面 + ▶ 角标，详情页可播放。',
       '删除带视频的 commit 时自动回收视频 Blob（与语音回收同一通道）。',
       '新增「定位」：commit.location = {lat,lng,acc,label,at} 轻字段，可「📍取当前位置」（opt-in GPS）或手填地点名；详情页可点外链地图查看；桌面定位失败时静默回落手填，不打断。',
       '备份导出已支持视频 Blob（通过 v1.11 data.blobs base64），导入可完整恢复视频；注意大视频会显著增大备份文件（选超 60MB 时提醒）。',
       '定位进入搜索匹配：搜地点名可找到对应存档。',
       '桌面 Electron 加 geolocation 权限放行；Android 构建脚本注入 ACCESS_FINE/COARSE_LOCATION。',
       '至此，location / voice / video / people / mood / tags / custom_subject 七维全部落地。下一柱应转向云端媒体桶（Supabase Storage）让多媒体跨设备真同步。'],
      ['Add video: capture or pick a video using the system camera, auto-extract a poster frame, store the video blob in IndexedDB with a media[kind:video] reference; timeline card shows the poster + ▶ badge, detail page plays the video inline.',
       'Deleting a commit with video auto-recycles its blob (same cleanup path as voice).',
       'Add location: commit.location = {lat,lng,acc,label,at} as a light field; opt-in GPS via "Use current location" or type a place name; detail shows a map link (OpenStreetMap); desktop gracefully falls back to manual entry if geolocation fails.',
       'Backup export already packages video blobs via the v1.11 data.blobs base64 path so a full restore brings video back; a toast warns when selecting videos over 60MB.',
       'Location labels are indexed in search — type a place name to surface matching archives.',
       'Desktop Electron now grants geolocation; Android build injects ACCESS_FINE/COARSE_LOCATION.',
       'All seven dimensions — location, voice, video, people, mood, tags, custom subjects — are now live. Next priority: Supabase Storage for true cross-device media sync.']],
    ['1.12.0', '2026-06-09', '立体维度四件套：人物/心情/标签/自定义主体 + 语音备注',
      'Four-dimensional archive: people, mood, tags, custom subjects + voice notes',
      ['新增「自定义主体」：用户可自建长期盯住的场景（如「阳台的花」），存为同步集合随云同步，在场景选择器、时间线筛选、diff/历程/回滚中均可使用；预设 20 个场景保留不动。',
       '新增「人物」字段：commit 记录「和谁」，输入即成 chip，支持回车/逗号添加，详情页展示。',
       '新增「心情」字段：五档 emoji 单选（😄🙂😐😔😣），记录当时感受，详情页展示。',
       '新增「标签」字段：跨场景自由标签（如 #周末 #旅行），输入即成 chip；时间线新增标签筛选 chip，可点标签从详情页直接筛回时间线。',
       '人物和标签都会进入搜索框匹配范围，搜人名或 #标签 可命中对应存档。',
       '新增「语音备注」：表单内可录一段语音（最长无硬上限），录音存进 IndexedDB blobs 仓，commit 上仅挂 media 引用；详情页可回放，编辑态可重录/删除；删 commit 时自动回收语音 Blob。',
       '备份导出已包含 customScenes 集合；语音 Blob 通过 v1.11 的 data.blobs base64 路径打包，导入后可完整恢复语音。',
       '桌面端 Electron 已配置麦克风权限放行；Android 构建脚本注入 RECORD_AUDIO 权限。',
       '场景图标统一：预设场景用内联 SVG，自定义主体显示 emoji，所有展示点自动适配。'],
      ['Add custom subjects: users can create their own long-term scenes (e.g. "Balcony flowers"), stored as a synced collection alongside commits/branches; appears in scene picker, filters, diff/time-lapse/rollback. 20 presets remain unchanged.',
       'Add people field: log who you were with on a commit; type-to-chip with Enter/comma, shown on detail cards.',
       'Add mood field: five emoji choices (😄🙂😐😔😣) to capture how you felt; displayed on detail cards.',
       'Add tags field: cross-scene freeform tags (e.g. #weekend #travel) as chips; timeline adds tag filter chips; clicking a tag on detail navigates to filtered timeline.',
       'People and tags are indexed by the search box — typing a name or #tag will match relevant archives.',
       'Add voice notes: record audio in the commit form via MediaRecorder; stored in the IndexedDB blobs store with only a media[] reference on the commit; playback on detail; re-record/delete during edit; auto-cleanup on commit deletion.',
       'Backup export now includes customScenes; voice blobs are packed via v1.11\'s data.blobs base64 path so a full restore brings voice back.',
       'Desktop Electron grants microphone permission; Android build script injects RECORD_AUDIO permission.',
       'Scene icons unified: presets use inline SVG, custom subjects show emoji; all display points adapt automatically.']],
    ['1.11.0', '2026-06-06', '数据可托付：备份恢复 + 同步状态 + 媒体存储地基',
      'Trust your data: backup restore, sync status, and media-storage foundation',
      ['设置页新增「备份到文件」和「导入 / 恢复备份」：导出文件带 app、schema、version、exportedAt 信封，导入同时兼容旧裸 JSON。',
       '导入会复用现有合并逻辑：有本机数据时只合并不覆盖，空库恢复时会完整采用备份内容，避免清空后被本机删除墓碑挡掉。',
       '云同步成功后会记录本机 lastSyncAt，并在账号卡显示「上次同步」时间，让用户确认数据已经推到云端。',
       'IndexedDB 升级到 v2，新增独立 blobs 仓和 putBlob/getBlob/deleteBlob API，为之后语音、视频等大媒体落地做准备；旧照片和文件继续保持兼容。',
       '备份导出会预留 data.blobs 路径，把未来 media[] 引用的 Blob 打包成 base64；当前版本不改 Supabase 表结构，也不迁移已有内联照片。',
       '未配置云同步且超过 14 天未备份时，时间线会给出轻量本地备份提醒，点按即可进入设置页。'],
      ['Settings adds Backup to file and Import / restore. Exports now include app, schema, version, and exportedAt metadata while imports still accept old raw JSON.',
       'Import reuses the merge path when local data exists, but restores directly into an empty archive so a clear-all tombstone cannot block a backup restore.',
       'Successful cloud sync now records local lastSyncAt and shows the last synced time on the account card.',
       'IndexedDB moves to v2 with a separate blobs store plus putBlob/getBlob/deleteBlob APIs for future audio and video media; existing inline photos and files remain compatible.',
       'Backups reserve data.blobs and package future media[] Blob references as base64. This release does not change the Supabase schema or migrate existing inline photos.',
       'If cloud sync is not configured and no backup has been exported for 14 days, Timeline shows a lightweight local-backup reminder linking to Settings.']],
    ['1.10.0', '2026-06-06', '时光历程：看见同一场景的变化 + 一键时光回顾片',
      'Time-lapse: watch one scene evolve + one-tap montage',
      ['新增「时光历程」子页：选择一个场景后，会把该场景所有真实存档按时间从旧到新铺成横向 filmstrip，一眼看到同一个生活状态怎样变化。',
       '详情页、时间线单场景筛选和现实对比的场景趋势卡都新增入口；场景不足两个真实存档时会给出提示，不把预存档混入历程。',
       'filmstrip 上每张图带存档时间，首张 / 末张标注「最早 / 最新」；点击任意一张可回到对应存档详情。',
       '新增「首尾对比」：自动以最早存档为 base、最新存档为 compare，复用现有现实对比页查看变化。',
       '新增「导出时光回顾片」：最多均匀采样 9 张缩略图，生成带时间戳、水印和跨度信息的分享拼图，桌面可下载，手机端继续接入系统分享。',
       '本次不改数据结构和 Supabase 表结构，只复用现有存档照片、清单 diff、导出图片和本地路由能力。'],
      ['Add a Time-lapse subpage: pick a scene and see all real archives for that scene laid out oldest-to-newest as a horizontal filmstrip.',
       'Add entry points from archive detail, single-scene timeline filters, and the Reality Diff trend card; scenes with fewer than two real archives show a clear fallback and drafts are excluded.',
       'Each filmstrip frame shows the archive timestamp, marks the first and latest frames, and opens the original archive detail on click.',
       'Add First vs latest: the app automatically uses the oldest archive as base and the newest as compare, reusing the existing Reality Diff page.',
       'Add Export time-lapse card: up to 9 evenly sampled thumbnails become a timestamped, watermarked share montage with download on desktop and native sharing on mobile.',
       'No data model or Supabase schema change; this release reuses existing archive photos, item diff, export image, and local routing infrastructure.']],
    ['1.9.0', '2026-06-06', '轻松记录：极速拍存 + 连续打卡 + 每日记录提醒',
      'Effortless capture: quick snap-save, streaks, and a daily nudge',
      ['时间线顶部新增连续打卡 chip：显示连续天数和今天是否已记录，点击即可进入快速记录。已有记录时变为绿色完成态，继续允许追加当天的新存档。',
       '快速记录复用现有新建存档表单：手机端进入后自动打开相机，桌面端自动聚焦一句话输入；保存仍由用户确认，不新增自动保存风险。',
       '快速记录会记住上次正式存档使用的场景，下一次默认带入，减少重复选择场景的摩擦。',
       '底部新建存档按钮新增长按 / 右键快速记录入口；普通点击仍打开完整新建存档表单。',
       '设置页新增「每日记录提醒」开关，默认关闭；开启后仅手机端在当天尚未记录时于 20:30 轻提醒，保存正式存档后会自动重排并取消今天不需要的提醒。',
       'Android 构建脚本新增长按启动器图标的 Quick capture 快捷方式，冷启动或热启动都会进入快速记录。'],
      ['Add a streak chip at the top of Timeline showing the current streak and whether today has been logged; tapping it opens quick capture, while logged days show a green done state.',
       'Quick capture reuses the existing new-archive form: native mobile opens the camera automatically, desktop focuses the one-line message input, and the user still confirms save.',
       'Quick capture remembers the last scene from a real archive and uses it as the next default, cutting repeat scene-picking friction.',
       'The bottom New commit button now supports long-press / right-click quick capture while preserving the normal click path.',
       'Settings adds an opt-in Daily nudge; when enabled, mobile schedules a gentle 20:30 reminder only on days without a real archive and reconciles it after saves.',
       'Android build patching now adds a launcher Quick capture shortcut that routes cold and warm starts into the same quick form.']],
    ['1.8.0', '2026-06-05', '重温·那年今日：回顾页 + 图片时间 + HyperOS 时间面板',
      'On This Day memories, photo time, and HyperOS archive-time picker',
      ['时间线新增「回顾」入口和「那年今日 / 往月今日 / 随机重温」横幅：进 App 就能遇见过去的生活存档，点开进入回顾页继续翻看。',
       '新增回顾页：按「那年今日」「往月的今天」「随机翻牌重温」分区展示旧存档，复用现有存档卡片，点卡片可直接进入详情。',
       '手机端新增温暖的那年今日通知：有真实周年记忆时，会在接下来 14 天内为对应日期 20:00 预排提醒，点通知直达回顾页；桌面端继续用应用内横幅降级。',
       '新建 / 编辑存档的「图片时间」按钮会读取所选图片的 EXIF / 原生拍摄时间，并一键填入存档时间。',
       '存档时间选择器重做为 HyperOS 风格轻玻璃面板，替换旧的 Material 感大色块日期 / 时间样式，并移除「昨天此时」快捷按钮。',
       '示例数据加入去年今天和上个月今天的记录，方便验证「那年今日」和「往月今日」链路。'],
      ['Add a Memories entry and resurface banner on the timeline: On this day, earlier-month matches, and random older archives now bring past moments back into the first screen.',
       'Add the Memories page with On this day, earlier months, and random resurface sections, reusing the existing archive cards and detail navigation.',
       'Add warm mobile On This Day notifications: when true anniversary memories exist, the app pre-schedules the next 14 days at 20:00 and opens Memories from the notification; desktop falls back to the in-app banner.',
       'The Archive time picker now has a Photo time action that reads EXIF / native shooting time from the selected image and applies it to the archive timestamp.',
       'Restyle the Archive time picker as a HyperOS-like glass panel and replace the old Yesterday shortcut.',
       'Demo data now includes last-year-today and last-month-today archives for validating the resurface flow.']],
    ['1.7.0', '2026-06-05', '引擎层闭环：复查提醒 + 可分享凭证 + 首存反馈',
      'Engine loop: re-check reminders, shareable proof, and first-save feedback',
      ['新增本地复查提醒：新建 / 编辑存档时可设置 7 / 30 / 90 天后或自定义天数复查；Android 首次设置提醒会请求通知权限，桌面端安全降级为仅保存提醒时间。',
       '点通知会回到 Life Archive 并直接进入现实对比：同场景有两条以上正式存档时自动预选 compare 与 base；只有一条时落到详情页，方便再拍一张当前状态。',
       '可分享凭证升级：现实对比导出图现在给两张图分别盖上存档时间戳并加生成水印；详情页新增「导出此存档」，单条存档也能生成带时间戳、场景、清单和水印的图片凭证。',
       '手机端导出图片接入系统分享面板；桌面端继续保留下载 / 长按保存的降级路径。',
       '首存即有值：保存正式存档后会提示本场景第 N 次、距上次 X 天、清单物品数；未设置提醒时提供一键 30 天复查入口。',
       '空时间线改为三步引导，保留「载入示例数据」入口；分支到期日也会在手机端重排为本地提醒。'],
      ['Add local re-check reminders: new/edit archive can schedule 7 / 30 / 90 days or custom days; Android asks for notification permission the first time, while desktop safely stores the reminder time without native push.',
       'Tapping a notification returns to Life Archive and opens Reality Diff with compare/base preselected when the scene has enough real archives; otherwise it falls back to the detail page so the user can capture the next state.',
       'Shareable proof is upgraded: Reality Diff export stamps each image with its archive timestamp plus a generated watermark; detail pages now export a single archive proof image with timestamp, scene, checklist, and watermark.',
       'Native mobile image export now uses the system share sheet; desktop keeps download / long-press fallback behavior.',
       'First-save feedback now shows the scene count, days since the previous archive, and checklist size; if no reminder was set, a one-tap 30-day re-check action appears.',
       'The empty timeline is now a 3-step onboarding flow, demo data remains available, and branch due dates also re-register as native reminders on mobile.']],
    ['1.6.3', '2026-06-05', '应用图标焕新 + 开屏彻底去抖 + 键盘白色遮罩修复 + 时间线防溢出 + 存档时间统一',
      'App icon refresh, splash judder fix, keyboard white-mask fix, timeline containment, and archive-time picker',
      ['应用图标焕新：桌面 / 启动器图标改为与开屏画面一致的蓝紫渐变「卡片堆叠」标志（浅色磨砂底 + 三张由浅到深的层叠卡片），点开应用前后看到的是同一个标志。',
       '开屏彻底去抖：开屏只做淡入、不再上下位移；并且要等到安全区（状态栏高度）真正注入、顶栏高度落定后才揭开遮罩，把首屏的高度沉降全部藏在开屏下面，消除偶发的进入应用上下抖动。',
       '键盘弹出时修复输入区整片白色遮罩：Android 原生层会同步调整 WebView 与父容器高度、禁用输入法全屏抽取，并在 IME 动画帧里强制重绘，HyperOS / 搜狗键盘下搜索框和时间线卡片都能正常显示。',
       '时间线增加移动端硬约束：列表、日期组、轨道、卡片和图片容器都限制在可用宽度内；页面切换回时间线时也会清掉横向滚动漂移，避免新建存档后卡片飞出屏幕。',
       '新建 / 编辑存档的「存档时间」改成应用内统一控件：表单里显示为同款圆角按钮，点开是锚定弹层，可选日期、时间，也可一键填入现在或昨天此时。',
       'Windows 发布取消免安装便携版，只保留支持自动更新的安装版，避免用户拿到不会自更新的包。'],
      ['App icon refresh: the desktop / launcher icon now uses the same blue→violet card-stack mark as the splash screen (a light frosted tile with three stacked cards), so the icon you tap matches the frame you see on open.',
       'Splash judder fully fixed: the splash only fades (no vertical motion) and now waits until the safe-area insets have actually landed and the top bar has settled before revealing the app, so the first-paint height shift stays hidden under the splash and the open no longer jumps.',
       'Fix the white mask over the input area when the keyboard opens: Android now resizes the WebView and parent container together, disables IME fullscreen extraction, and forces redraws during IME animation so HyperOS / Sogou keeps rendering the search field and timeline cards.',
       'Timeline containment is hardened on mobile: lists, date groups, rails, cards, and media are clamped to the available width, and route renders clear horizontal scroll drift after saving a new archive.',
       'The Archive time field now uses the app-owned picker style instead of the bare native datetime-local control, with date/time fields plus Now and Yesterday shortcuts.',
       'Windows releases now ship only the auto-updating installer; the portable build target has been removed.']],
    ['1.6.2', '2026-06-04', '现实对比控件优化 + 开屏加长去抖动 + 键盘/宽度兜底',
      'Reality Diff controls, longer splash, and keyboard/width hardening',
      ['现实对比页：「AI 解读变化」与「导出对比卡片」按钮和下方对比结果之间留出了间距，不再贴在一起；「导出对比卡片」简化成一个紧凑的分享图标，操作区更清爽。',
       '开屏画面适当加长，并把首屏的安全区 / 顶栏测量沉降都收进开屏覆盖期内，进入应用时不再上下抖一下。',
       '再次修复键盘弹出时输入框下方的白块：上次只改了键盘内边距，这次发现真正的祸首是「底部安全区」——部分安卓机型在键盘弹出时会把键盘高度也算进底部安全区，于是内容区底部又被多垫了一整块。现在键盘弹出时不再叠加底部安全区（实测内容区底部内边距从 422px 降到 82px），并补了背景与重绘兜底。新建 / 编辑存档页也限制内容不超出手机宽度，减少横向漂移。'],
      ['Reality Diff: add breathing room between the “AI read changes” / export buttons and the comparison result below; the export action is now a compact share icon.',
       'Lengthen the splash and fold the first-paint settle (async safe-area insets + topbar re-measure) under it, so the app no longer jitters as it appears.',
       'Fix the blank band under the input again: last time only the keyboard inset was patched, but the real culprit is the bottom safe-area — some Android builds fold the IME height into it, so the scroller padded itself by a whole extra keyboard. The bottom safe-area is now dropped while the keyboard is open (scroller bottom padding measured 422px → 82px), with background + repaint fallbacks. New/edit form content is also constrained to the phone width.']],
    ['1.6.1', '2026-06-04', '修复键盘白屏 + 固定开屏画面 + 云 SDK 完整性校验',
      'Keyboard white-gap fix, static splash frame, and cloud SDK integrity check',
      ['修复键盘弹出时输入框下方出现一大片空白的问题：部分安卓 WebView（如 HyperOS）在系统已经把网页缩小避让键盘后，仍上报键盘弹出前的旧窗口高度，于是页面又多垫了整整一个键盘高度的内边距，看起来就像被白色遮罩盖住。现在改用布局视口的实际高度来计算键盘遮挡量，不再误判。',
       '开屏简化为一个固定的品牌画面（应用图标 + 名称 + 标语），去掉底部的加载进度条，只保留一次轻微淡入；系统开启「减少动态效果」时仍为快速淡出。',
       '云同步 SDK 加固：由浮动版本改为锁定到精确版本，并加上 SRI 完整性校验与跨域属性，浏览器会在脚本运行前拒绝被篡改或中间人注入的 SDK。'],
      ['Fix a tall blank gap under the input when the keyboard opens: some Android WebViews (e.g. HyperOS) keep reporting the pre-keyboard window height after the system already shrank the page, so the app stacked a whole keyboard-height of padding on top — looking like a white mask. Keyboard overlap is now measured from the real layout-viewport height.',
       'Simplify the splash into a static brand frame (app icon + name + tagline) with a single gentle fade-in; the loading bar is gone, and reduced-motion still fast-fades.',
       'Harden the cloud sync SDK: pin it to an exact version and add Subresource Integrity + crossorigin, so the browser rejects a tampered or MITM-injected SDK before it runs.']],
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
    return commitDayCounts();
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
    var streak = computeStreak();
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
          list.appendChild(el('button', {
            type: 'button', class: 'day-panel-item',
            onclick: function () { closePopover(); pendingDetail = c.id; go('detail'); }
          }, [
            sceneIcEl(sc),
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
      var pend = 0;
      Store.commits().forEach(function (c) { (c.media || []).forEach(function (m) {
        if (m && m.blobId && !(Store.meta().mediaUp || {})[m.blobId]) pend++;
      }); });
      var mediaBtn = el('button', { class: 'btn ghost tiny',
        text: '☁ ' + t('media_upload') + (pend ? ' · ' + pend : '') });
      mediaBtn.addEventListener('click', function () {
        mediaBtn.disabled = true; var o = mediaBtn.textContent; mediaBtn.textContent = L ? '上传中…' : 'uploading…';
        syncMediaUp().then(function () { toast('☁ ' + t('media_uploaded')); render(); })
          .catch(function () { toast('⚠ ' + (L ? '部分媒体上传失败，可重试' : 'Some media failed — retry')); })
          .then(function () { mediaBtn.disabled = false; mediaBtn.textContent = o; });
      });
      return settingsCard(null, [
        el('div', { class: 'set-row' }, [
          el('span', { class: 'set-label', text: L ? '已登录' : 'Signed in' }),
          el('span', { class: 'set-value', text: u.email || u.id })
        ]),
        el('div', { class: 'set-row' }, [
          el('span', { class: 'set-label', text: t('last_sync') }),
          el('span', { class: 'set-value', text: Store.meta().lastSyncAt
            ? fmtDate(Store.meta().lastSyncAt) : t('last_sync_never') })
        ]),
        el('p', { class: 'set-hint', text: L
          ? '「立即同步」会把本机存档与云端合并，登录其他设备即可共享。语音/视频通过私有桶跨设备同步。'
          : 'Sync merges this device with the cloud; sign in elsewhere to share. Voice/video sync via private storage bucket.' }),
        el('div', { class: 'set-actions' }, [syncB, mediaBtn, outB, reconf])
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
    var L = lang === 'zh';
    v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: lang === 'zh' ? '设置' : 'Settings' })]));

    var updBtn = el('button', { class: 'btn', text: lang === 'zh' ? '检查更新' : 'Check for updates' });
    updBtn.addEventListener('click', function () { checkUpdate(updBtn); });
    var logsBtn = el('button', { class: 'set-menu-link',
      onclick: function () { go('changelog'); } }, [
      el('span', { text: lang === 'zh' ? '更新日志' : 'Release notes' }),
      el('span', { class: 'set-menu-chevron', text: '›' })
    ]);
    var bp = branchPendingCount();
    var branchLink = el('button', { class: 'set-menu-link',
      onclick: function () { go('branch'); } }, [
      el('span', { text: t('nav_branch') }),
      el('span', { class: 'set-menu-right' }, [
        bp > 0 ? el('span', { class: 'set-menu-badge', text: bp > 9 ? '9+' : String(bp) }) : null,
        el('span', { class: 'set-menu-chevron', text: '›' })
      ])
    ]);
    var about = settingsCard(null, [
      el('div', { class: 'set-row' }, [
        el('span', { class: 'set-label', text: lang === 'zh' ? '当前版本' : 'Version' }),
        el('span', { class: 'set-value', text: 'v' + (window.APP_VERSION || '?') })
      ]),
      logsBtn,
      branchLink,
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

    var nudgeCard = settingsCard(t('nudge_label'), [
      el('div', { class: 'set-row' }, [
        el('span', { class: 'set-label', text: t('nudge_label') }),
        segmented([['on', t('on')], ['off', t('off')]], captureNudgeEnabled() ? 'on' : 'off', function (val) {
          Store.setMeta({ captureNudge: val === 'on' });
          reconcileCaptureNudge();
          toast(val === 'on' ? t('nudge_on') : t('nudge_off'));
        })
      ]),
      el('p', { class: 'set-hint', text: t('nudge_hint') })
    ]);

    var account = accountCard();

    var expBtn = el('button', { class: 'btn ghost tiny', text: lang === 'zh' ? '备份到文件' : 'Backup to file' });
    expBtn.addEventListener('click', exportData);
    var impInput = el('input', { type: 'file', accept: 'application/json,.json', style: 'display:none' });
    impInput.addEventListener('change', function () {
      var f = impInput.files && impInput.files[0];
      importData(f);
      impInput.value = '';
    });
    var impBtn = el('button', { class: 'btn ghost tiny', text: t('import_restore') });
    impBtn.addEventListener('click', function () { impInput.click(); });
    var clrBtn = el('button', { class: 'btn danger-ghost tiny', text: lang === 'zh' ? '清空全部' : 'Clear all' });
    clrBtn.addEventListener('click', clearAll);
    var onIdb = Store.backend() === 'indexeddb';
      var gcBtn = el('button', { class: 'btn ghost tiny', text: lang === 'zh' ? '清理缓存' : 'Clean up cache' });
      gcBtn.addEventListener('click', function () {
        gcBtn.disabled = true;
        gcOrphanBlobs().then(function (n) {
          toast((lang === 'zh' ? '已清理 ' : 'Cleaned ') + n + (lang === 'zh' ? ' 个无用文件' : ' orphaned blobs'));
          render();
        }).then(function () { gcBtn.disabled = false; });
      });
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
        el('div', { class: 'set-actions' }, [expBtn, impBtn, clrBtn, gcBtn]),
        impInput
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
    function setGroup(zh, en, cards) {
      return el('section', { class: 'set-group' },
        [el('h2', { class: 'set-group-title', text: L ? zh : en })].concat(cards));
    }
    v.appendChild(el('div', { class: 'settings-wrap' }, [
      setGroup('账号与云同步', 'Account & sync', [account]),
      setGroup('通用', 'General', [appearance, nudgeCard, ai]),
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

  // Splash-reveal gate. The safe-area insets (status-bar height) are injected by the
  // native plugin AFTER the first paint; when they land the topbar grows and the whole
  // page shifts DOWN. If that happens after the splash has faded, the app visibly judders
  // up/down on open ("开屏上下抖动") — and because the insets land at a different moment
  // each cold start, it only happens "sometimes". We hold the opaque splash until the
  // insets have actually settled (or a deadline) so the shift is hidden underneath it.
  var safeAreaSettled = false;
  var safeAreaWaiters = [];
  function markSafeAreaSettled() {
    if (safeAreaSettled) return;
    safeAreaSettled = true;
    var fns = safeAreaWaiters; safeAreaWaiters = [];
    fns.forEach(function (fn) { try { fn(); } catch (e) {} });
  }
  function whenSafeAreaSettled(fn) {
    if (safeAreaSettled) { fn(); return; }
    safeAreaWaiters.push(fn);
  }

  function initNative() {
    try {
      var Cap = window.Capacitor;
      // Desktop / web: env(safe-area-inset-*) is correct at first paint, nothing lands
      // async, so the gate can release immediately.
      if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) { markSafeAreaSettled(); return; }
      // lock the document to the visual viewport and scroll ONLY the content area
      // (CSS `body.native`), so the Android IME can't pan the topbar off-screen.
      document.body.classList.add('native');
      Notify.initClickRouting(function (ex) {
        if (storeReady) handleNotifyIntent(ex);
        else pendingDeepLink = ex;
      });
      var SA = Cap.Plugins && Cap.Plugins.SafeArea;
      if (!SA || !SA.enable) { markSafeAreaSettled(); return; }
      var dark = themeIsDark();
      SA.enable({ config: {
        customColorsForSystemBars: true,
        statusBarColor: '#00000000', statusBarContent: dark ? 'light' : 'dark',
        navigationBarColor: '#00000000', navigationBarContent: dark ? 'light' : 'dark'
      } }).then(function () {
        // the plugin injects --safe-area-inset-* asynchronously; re-measure the topbar the
        // moment they land so the content doesn't visibly jump as the insets settle, then
        // release the splash gate once those values have flushed to layout.
        syncTopbarHeight(); setTimeout(syncTopbarHeight, 60);
        requestAnimationFrame(function () { requestAnimationFrame(markSafeAreaSettled); });
      }).catch(function () { markSafeAreaSettled(); });
    } catch (e) { markSafeAreaSettled(); }
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

     PRIMARY FIX: Android uses manifest adjustResize and a native LifeArchiveWebView
     input connection that disables IME extract/fullscreen panels. The native layer also
     injects safe-area CSS vars from real WindowInsets, so the topbar clears HyperOS'
     status bar even when CSS env() reports 0.

     BACKUP: visualViewport remains the first source of truth. If it visibly shrank, we
     trust it. If it did NOT shrink but Android native keyboard events report a height,
     we use that height as a bounded fallback for bottom padding + field visibility. */
  function isTextField(n) { return !!(n && n.tagName && /^(INPUT|TEXTAREA)$/.test(n.tagName)); }
  var nativeKeyboardPx = 0;
  var keyboardInsetPx = 0;
  var keyboardInsetMode = 'none'; // 'visual' or 'native-fallback'
  var kbBaselineHeight = window.innerHeight || 0;
  // px the keyboard overlaps the *layout* viewport. We measure against the smaller of
  // window.innerHeight and documentElement.clientHeight: when Android's resizeOnFullScreen /
  // adjustResize shrinks the WebView, clientHeight follows, but some WebViews (seen on
  // HyperOS) leave window.innerHeight at the pre-keyboard height. Using innerHeight alone
  // then reported a whole keyboard's worth of "overlap" on an ALREADY-resized view, so the
  // --keyboard-inset padding stacked a tall white gap under the content (the "白色遮罩" bug).
  // offsetTop keeps the pinch-zoom case correct.
  function kbOverlayPx() {
    var vv = window.visualViewport;
    if (!vv) return 0;
    var de = document.documentElement;
    var layoutH = Math.min(window.innerHeight || Infinity, (de && de.clientHeight) || Infinity);
    if (!isFinite(layoutH)) layoutH = window.innerHeight || 0;
    return Math.max(0, layoutH - (vv.height + (vv.offsetTop || 0)));
  }
  function nativeKeyboardHeight(info) {
    return Math.max(0, parseInt(info && info.keyboardHeight, 10) || 0);
  }
  function setKeyboardInset(px, mode) {
    keyboardInsetPx = Math.max(0, px || 0);
    keyboardInsetMode = keyboardInsetPx > 0 ? (mode || 'visual') : 'none';
    document.documentElement.style.setProperty('--keyboard-inset', keyboardInsetPx + 'px');
  }
  function shouldGuardBottomNavForKeyboard() {
    return document.body.classList.contains('native') ||
      (window.matchMedia && window.matchMedia('(max-width:720px)').matches);
  }
  function primeKeyboardOpenUi() {
    if (!shouldGuardBottomNavForKeyboard()) return;
    document.body.classList.add('kb-preopen');
  }
  function clearKeyboardPreopenIfIdle() {
    if (document.body.classList.contains('kb-open')) return;
    if (isTextField(document.activeElement)) return;
    document.body.classList.remove('kb-preopen');
    clearEnsureFieldVisibleTimers();
  }
  function isTopTimelineSearchField(n) {
    return !!(n && n.classList && n.classList.contains('tl-search-input'));
  }
  var kbEnsureTimers = [];
  function clearEnsureFieldVisibleTimers() {
    kbEnsureTimers.forEach(clearTimeout);
    kbEnsureTimers = [];
  }
  function scheduleEnsureFieldVisible(ms) {
    clearEnsureFieldVisibleTimers();
    if (isTopTimelineSearchField(document.activeElement)) return;
    kbEnsureTimers.push(setTimeout(ensureFieldVisible, ms || 0));
  }
  function scheduleEnsureFieldVisibleBurst() {
    clearEnsureFieldVisibleTimers();
    if (isTopTimelineSearchField(document.activeElement)) return;
    [0, 90, 240, 420, 700].forEach(function (ms) {
      kbEnsureTimers.push(setTimeout(ensureFieldVisible, ms));
    });
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
    var isOpen = overlap > 80 || nativeKeyboardPx > 80;
    document.body.classList.toggle('kb-open', isOpen);
    if (isOpen) document.body.classList.remove('kb-preopen');
    else clearKeyboardPreopenIfIdle();
    if (!isOpen) {
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
        primeKeyboardOpenUi();
        resetHorizontalDrift();
        scheduleEnsureFieldVisibleBurst();
      }
    });
    document.addEventListener('focusout', function () {
      setTimeout(clearKeyboardPreopenIfIdle, 80);
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
        document.body.classList.remove('kb-preopen');
        scheduleEnsureFieldVisibleBurst();
      });
      KB.addListener('keyboardDidShow', function (info) {
        nativeKeyboardPx = nativeKeyboardHeight(info) || nativeKeyboardPx;
        syncKeyboardState();
      });
      KB.addListener('keyboardWillHide', function () {
        nativeKeyboardPx = 0;
      });
      KB.addListener('keyboardDidHide', function () {
        nativeKeyboardPx = 0;
        setKeyboardInset(0);
        document.body.classList.remove('kb-open');
        document.body.classList.remove('kb-preopen');
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

  function initQuickUrlIntent() {
    var Cap = window.Capacitor;
    if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
    var App = Cap.Plugins && Cap.Plugins.App;
    if (!App) return;
    function handleUrl(url) {
      if (!url || String(url).indexOf('//quick') < 0) return;
      if (storeReady) handleNotifyIntent({ route: 'commit', quick: true });
      else pendingDeepLink = { route: 'commit', quick: true };
    }
    if (App.getLaunchUrl) {
      App.getLaunchUrl().then(function (r) { handleUrl(r && r.url); }).catch(function () {});
    }
    if (App.addListener) {
      App.addListener('appUrlOpen', function (e) { handleUrl(e && e.url); });
    }
  }

  function hideSplash(bootStartedAt) {
    var splash = $('#splash-screen');
    if (!splash) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var t0 = bootStartedAt || Date.now();
    // Show the brand frame for at least MIN_SHOW, then reveal once the safe-area insets
    // have settled (so the topbar/content shift happens UNDER the opaque splash, killing
    // the open-time judder). MAX_WAIT is a hard cap so a device that never reports an
    // inset still proceeds.
    var MIN_SHOW = reduce ? 80 : 850;
    var MAX_WAIT = reduce ? 600 : 2200;
    var fired = false;
    function reveal() {
      if (fired) return;
      fired = true;
      syncTopbarHeight();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          splash.classList.add('is-done');
          setTimeout(function () { if (splash && splash.parentNode) splash.parentNode.removeChild(splash); }, reduce ? 160 : 520);
        });
      });
    }
    var sinceBoot = Date.now() - t0;
    setTimeout(reveal, Math.max(0, MAX_WAIT - sinceBoot));
    setTimeout(function () { whenSafeAreaSettled(reveal); }, Math.max(0, MIN_SHOW - sinceBoot));
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
    initQuickUrlIntent();
    var r = location.hash.slice(1);
    if (routes.indexOf(r) >= 0) current = r;
    renderNav();
    syncTopbarHeight();
    window.addEventListener('resize', syncTopbarHeight);
    // Hydrate the store (IndexedDB) before the first content render.
    Store.init().then(function () {
      storeReady = true;
      render();
      Notify.syncAll();
      scheduleMemoryNotifs();
      reconcileCaptureNudge();
      if (pendingDeepLink) { handleNotifyIntent(pendingDeepLink); pendingDeepLink = null; }
      hideSplash(bootStartedAt);
      migrateInlinePhotos();
      // re-measure as layout + async safe-area insets settle. These all land while the
      // splash still covers the screen (~1.1s), so the topbar/content shift isn't visible.
      syncTopbarHeight();
      setTimeout(syncTopbarHeight, 300);
      setTimeout(syncTopbarHeight, 700);
      if (Cloud.configured()) Cloud.refreshUser().then(function () { if (current === 'settings') render(); });
    });
  });
})();
