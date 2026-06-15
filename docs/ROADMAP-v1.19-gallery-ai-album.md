# Life Archive v1.19.0 ·「滑动大图 + AI 回忆图集 + 澎湃质感」实现文档

> 存储架构在 v1.18 闭环后，这一版回到**体验层**：把 toast 改细腻、给画廊一个流畅的左右滑动大图、用现有 AI 自动攒一本「回忆图集」、再撒一层澎湃风格的微动画与小巧思。
> 基于当前 **1.18.0** 真实代码（锚点：`toast`/`toastAction` 492/500、CSS `.toast` 890、`showImageModal` 3748、`AI._chat`/`analyze` 711/689、`commitImageEntries` 413、`resolveMediaBlob` 1025、画廊渲染 detail 区）。

> 🧭 北极星：**不增加"维度/功能柱"，只让已有内容更好看、更好翻、更有情绪。** 复用现成：photo-media 的 `thumb`(即时) + `blobId`(全图 resolve)、`AI._chat`（文本叙事）/`analyze`（看图）、review/resurface 的候选选择、montage 导出。

---

## 0. 总览（四件事）
1. **Part A · toast 澎湃化**：现状是「纯色反差大药丸」(CSS 890 `background:var(--text);color:var(--bg)` + `font-weight:700`)，生硬。改成**磨砂玻璃 + 语义色点 + 图标 + 弹性进场**，分 success/warn/info 三态（消息本就带 ✅/⚠/☁ 前缀，顺势分色）。
2. **Part B · 滑动大图查看器**：现 `showImageModal`(3748) 只能看单张。新增 `openGallery(entries, startIndex)`——**手势左右滑动、回弹、惯性、键盘 ←/→、缩略点、双击放大**，thumb 先上屏、`resolveMediaBlob` 换全图。详情画廊 / 封面 / 回忆图集都用它。
3. **Part C · AI 回忆图集**：在「回顾」页一键「✨ 生成回忆图集」——按时间窗/人物/地点选一组照片，用 `AI._chat` 起标题 + 写一两句叙事 + 排序 + 配短句，渲染成可滑动的图集（复用 Part B），可导出长图。无 Key 时用启发式（按时间/星标）降级，AI 只是锦上添花。
4. **Part D · 细腻动画 & 小巧思**：卡片按压回弹、星标爆点、列表错峰入场、streak 数字滚动、回忆卡微视差、下拉回弹——**只用 transform/opacity，尊重 `prefers-reduced-motion`**。

### 0.1 边界
- ❌ 不改数据结构 / 云 / 桶。纯展示 + 一个 AI 文本调用。
- ❌ AI 图集不**生成**像素（不画图），只**挑选 + 起名 + 叙事 + 排版**已有照片。
- ✅ 全部对无 AI Key、离线、跨设备缺全图**优雅降级**。

---

## 1. Part A —— toast 澎湃化

### 1.1 函数：带类型（toast 492 / toastAction 500）
```js
// 消息前缀已隐含语义：✅成功 / ⚠警告 / ☁同步 / 📌计划。给个轻量推断 + 可显式传 type。
function toastType(msg, explicit) {
  if (explicit) return explicit;
  if (/^⚠|失败|错误|不足/.test(msg)) return 'warn';
  if (/^✅|已|完成|成功/.test(msg)) return 'ok';
  return 'info';
}
function toast(msg, type) {
  var node = $('#toast');
  node.className = 'toast';                 // 重置变体
  node.classList.add('t-' + toastType(msg, type));
  node.textContent = msg;
  requestAnimationFrame(function () { node.classList.add('show'); });
  clearTimeout(node._t);
  node._t = setTimeout(function () { node.classList.remove('show'); }, 2200);
}
```
> `toastAction`(500) 同样加 `node.classList.add('t-info')`；其余逻辑不动。

### 1.2 CSS（替换 890–896 整段）
```css
/* ---- toast · HyperOS 磨砂质感 ---- */
.toast{
  position:fixed; left:50%; bottom:30px; transform:translateX(-50%) translateY(14px) scale(.98);
  display:inline-flex; align-items:center; gap:9px; max-width:min(86vw,420px);
  padding:12px 18px; border-radius:18px;
  background:color-mix(in srgb, var(--card) 78%, transparent);
  -webkit-backdrop-filter:saturate(1.6) blur(22px); backdrop-filter:saturate(1.6) blur(22px);
  border:1px solid color-mix(in srgb, var(--line) 70%, transparent);
  color:var(--text); font-weight:600; font-size:14px; letter-spacing:.01em;
  box-shadow:0 12px 34px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.10);
  opacity:0; pointer-events:none; z-index:50;
  transition:opacity .26s ease, transform .42s cubic-bezier(.2,.9,.25,1.08);  /* 轻微回弹 */
}
.toast.show{opacity:1; transform:translateX(-50%) translateY(0) scale(1)}
/* 左侧语义色点（细腻、不抢戏） */
.toast::before{content:""; width:7px; height:7px; border-radius:50%; flex:0 0 auto;
  background:var(--accent); box-shadow:0 0 0 4px color-mix(in srgb, var(--accent) 22%, transparent)}
.toast.t-ok::before{background:#34c759; box-shadow:0 0 0 4px rgba(52,199,89,.22)}
.toast.t-warn::before{background:#ff9f0a; box-shadow:0 0 0 4px rgba(255,159,10,.22)}
.toast.t-info::before{background:var(--accent)}
.toast.with-action{padding:10px 12px 10px 18px}
.toast-action{border:none;border-radius:999px;
  background:color-mix(in srgb, var(--accent) 16%, transparent); color:var(--accent);
  padding:8px 14px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;white-space:nowrap;
  transition:transform .15s ease}
.toast-action:active{transform:scale(.94)}
@media (prefers-reduced-motion:reduce){ .toast{transition:opacity .2s} }
```
> 要点：从"实心反差块"→"磨砂卡片 + 语义色点 + 弹性"，与全 App 玻璃卡一致；字重 700→600 不再笨重。`color-mix` 在 Electron/现代 WebView 均支持；老 Android 兜底见 §5。

---

## 2. Part B —— 滑动大图查看器 `openGallery`

### 2.1 数据形状（复用 commitImageEntries 413）
`commitImageEntries(c)` 返回 `[{thumb|data, blobId?, name, w, h, cover?}]`。查看器吃这个数组 + 起始索引。

### 2.2 查看器（新增；可替换/并存 showImageModal 3748）
```js
function openGallery(entries, startIndex, opts) {
  entries = (entries || []).filter(Boolean);
  if (!entries.length) return;
  var L = lang === 'zh', i = Math.max(0, Math.min(startIndex || 0, entries.length - 1));
  closePopover && closePopover();
  var mask = el('div', { class: 'gal-mask' });
  var track = el('div', { class: 'gal-track' });
  var slides = entries.map(function (e) {
    var img = el('img', { class: 'gal-img', src: e.thumb || e.data || '', alt: e.name || '', draggable: 'false' });
    if (e.blobId) resolveMediaBlob(e.blobId).then(function (b) { if (b) { var u = URL.createObjectURL(b); img.src = u; } });
    return el('div', { class: 'gal-slide' }, [img]);
  });
  slides.forEach(function (s) { track.appendChild(s); });
  // 缩略圆点
  var dots = el('div', { class: 'gal-dots' }, entries.map(function (_, k) {
    return el('span', { class: 'gal-dot' + (k === i ? ' on' : '') });
  }));
  var caption = el('div', { class: 'gal-cap' });
  var closeB = el('button', { class: 'gal-close', text: '✕', onclick: function () { close(); } });
  mask.appendChild(closeB); mask.appendChild(track); mask.appendChild(dots); mask.appendChild(caption);
  document.body.appendChild(mask);

  var W = function () { return mask.clientWidth; };
  function layout(animate) {
    track.style.transition = animate ? 'transform .42s cubic-bezier(.2,.9,.25,1.04)' : 'none';
    track.style.transform = 'translateX(' + (-i * W()) + 'px)';
    dots.querySelectorAll('.gal-dot').forEach(function (d, k) { d.classList.toggle('on', k === i); });
    var e = entries[i]; caption.textContent = (opts && opts.captions && opts.captions[i]) || e.name || ('' + (i + 1) + ' / ' + entries.length);
  }
  function go(n) { i = Math.max(0, Math.min(n, entries.length - 1)); layout(true); }
  function close() { mask.classList.remove('open'); setTimeout(function () { mask.remove(); }, 260); }

  // —— 手势：拖动跟手 + 阈值/惯性翻页 + 边缘回弹 ——
  var startX = 0, dx = 0, dragging = false, t0 = 0;
  function down(x) { dragging = true; startX = x; dx = 0; t0 = Date.now(); track.style.transition = 'none'; }
  function move(x) { if (!dragging) return; dx = x - startX;
    var damp = (i === 0 && dx > 0) || (i === entries.length - 1 && dx < 0) ? .35 : 1;  // 边缘阻尼
    track.style.transform = 'translateX(' + (-i * W() + dx * damp) + 'px)'; }
  function up() { if (!dragging) return; dragging = false;
    var dt = Date.now() - t0, vx = dx / Math.max(1, dt);
    if (dx < -W() * .22 || vx < -.5) go(i + 1);
    else if (dx > W() * .22 || vx > .5) go(i - 1);
    else layout(true); }
  track.addEventListener('touchstart', function (e) { down(e.touches[0].clientX); }, { passive: true });
  track.addEventListener('touchmove', function (e) { move(e.touches[0].clientX); }, { passive: true });
  track.addEventListener('touchend', up);
  track.addEventListener('mousedown', function (e) { e.preventDefault(); down(e.clientX);
    var mm = function (ev) { move(ev.clientX); }, mu = function () { up(); document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); };
    document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu); });
  // 双击放大（简单 2x toggle）
  slides.forEach(function (s) { s.addEventListener('dblclick', function () { s.firstChild.classList.toggle('zoom'); }); });
  // 键盘
  function onKey(e) { if (e.key === 'ArrowRight') go(i + 1); else if (e.key === 'ArrowLeft') go(i - 1); else if (e.key === 'Escape') close(); }
  document.addEventListener('keydown', onKey);
  mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
  window.addEventListener('resize', function () { layout(false); });
  var _rm = mask.remove.bind(mask); mask.remove = function () { document.removeEventListener('keydown', onKey); _rm(); };

  requestAnimationFrame(function () { mask.classList.add('open'); layout(false); });
}
```
### 2.3 接进详情画廊
画廊每张缩略 `<img>` 的点击由"下载/单图模态"改为：
```js
imgEl.style.cursor = 'zoom-in';
imgEl.addEventListener('click', function (e) { e.preventDefault(); openGallery(commitImageEntries(c), idx); });
```
> 封面大图同理可点开（startIndex=0）。导出/对比仍走原全图 resolve，不受影响。

### 2.4 CSS
```css
.gal-mask{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.92);
  opacity:0;transition:opacity .26s ease;display:flex;align-items:center;justify-content:center;overflow:hidden;touch-action:pan-y}
.gal-mask.open{opacity:1}
.gal-track{display:flex;height:100%;width:100%;will-change:transform}
.gal-slide{flex:0 0 100%;height:100%;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}
.gal-img{max-width:100%;max-height:100%;border-radius:10px;user-select:none;
  transition:transform .3s cubic-bezier(.2,.9,.25,1)}
.gal-img.zoom{transform:scale(2)}
.gal-dots{position:absolute;bottom:calc(20px + var(--safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);
  display:flex;gap:7px}
.gal-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.34);transition:.25s}
.gal-dot.on{background:#fff;width:18px;border-radius:3px}
.gal-cap{position:absolute;top:calc(18px + var(--safe-area-inset-top,0px));left:0;right:0;text-align:center;
  color:rgba(255,255,255,.86);font-size:13px;pointer-events:none}
.gal-close{position:absolute;top:calc(14px + var(--safe-area-inset-top,0px));right:14px;z-index:2;
  width:38px;height:38px;border-radius:50%;border:none;color:#fff;font-size:16px;
  background:rgba(255,255,255,.16);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);cursor:pointer}
```

---

## 3. Part C —— AI 回忆图集

### 3.1 候选选择（复用 review 基础设施）
入口放「回顾」页顶部一颗「✨ 生成回忆图集」。候选池 = 一个范围内**有照片**的 commit：
```js
function albumCandidates(opts) {
  // opts: {kind:'recent'|'year'|'person'|'place'|'scene', value?, sinceDays?}
  var all = Store.commits().filter(notPlanned).filter(function (c) { return photoMedia(c).length || (c.files||[]).some(isImageFile); });
  if (opts.kind === 'recent') { var cut = Date.now() - (opts.sinceDays||90)*86400000; all = all.filter(function(c){return c.createdAt>=cut;}); }
  else if (opts.kind === 'person') all = all.filter(function(c){return (c.people||[]).indexOf(opts.value)>=0;});
  else if (opts.kind === 'place') all = all.filter(function(c){return c.location && c.location.label===opts.value;});
  else if (opts.kind === 'scene') all = all.filter(function(c){return c.scene===opts.value;});
  // 星标优先 + 时间升序，最多 N 张（控制 AI 成本/长图长度）
  var entries = [];
  all.sort(function(a,b){return a.createdAt-b.createdAt;}).forEach(function(c){
    var e = commitImageEntries(c)[0]; if (e) entries.push({ e:e, c:c, starred:!!c.starred, at:c.createdAt });
  });
  entries.sort(function(a,b){ return (b.starred?1:0)-(a.starred?1:0) || a.at-b.at; });
  return entries.slice(0, opts.max || 12);
}
```

### 3.2 AI 起标题 + 叙事 + 配文（`AI._chat` 711，发 thumb）
```js
function aiAlbum(cands) {
  // 无 Key/失败 → 启发式：标题用时间跨度，叙事留空，按时间排
  function heuristic() {
    var span = spanLabel(cands[0].at, cands[cands.length-1].at);
    return { title: (lang==='zh'?'这段时间 · ':'A while · ') + span, subtitle:'', captions: cands.map(function(x){ return x.c.message||''; }) };
  }
  if (!AI.getKey()) return Promise.resolve(heuristic());
  var content = [{ type:'text', text:
    '下面是我相册里按时间排列的若干生活照片缩略图。请为它们生成一本"回忆图集"。严格只返回 JSON：{"title":"温暖的图集标题，12字内","subtitle":"一句副标题/引言，20字内","captions":["每张图一句中文短句，12字内，与图对应"]}。captions 数量必须等于图片数量。' }];
  cands.forEach(function (x) { content.push({ type:'image_url', image_url:{ url: AI._b64(x.e.thumb || x.e.data) } }); });
  return AI._chat(content).then(function (r) {
    var caps = Array.isArray(r.captions) ? r.captions : [];
    return { title: r.title || heuristic().title, subtitle: r.subtitle || '',
      captions: cands.map(function (x, k) { return caps[k] || x.c.message || ''; }) };
  }).catch(heuristic);
}
```
> 发**缩略图**（thumb，几 KB）控制流量；GLM-4V-Flash 免费、多图可接受。失败/超时一律回落 heuristic，不卡用户。

### 3.3 渲染：标题页 + 可滑动图集（复用 Part B）+ 导出
```js
function openMemoryAlbum(opts) {
  var cands = albumCandidates(opts || { kind:'recent', sinceDays:90, max:12 });
  if (cands.length < 2) { toast(lang==='zh'?'照片太少，攒不出图集':'Not enough photos yet'); return; }
  toast('✨ ' + (lang==='zh'?'正在生成回忆图集…':'Building your album…'));
  aiAlbum(cands).then(function (al) {
    // 用 Part B 查看器：在 entries 头部插一张"标题卡"（纯文字 slide），captions 传 al.captions
    var entries = cands.map(function (x) { return x.e; });
    openGallery(entries, 0, { captions: al.captions, title: al.title, subtitle: al.subtitle, exportable: true });
    // 顶部叠标题；右下"导出长图"→ 复用 montage（sampleEvenly + canvas 拼图，见 growth 导出）
  });
}
```
> **导出长图**复用现有 montage 思路（`sampleEvenly` 3775 + 画布拼图 + 时间戳/水印）；标题/副标题印在顶部。AI 图集 = 候选选择 + 文本生成 + 已有查看器/导出，**不新建渲染引擎**。

### 3.4 入口 UI（renderReview 顶部）
```js
var albumBtn = el('button', { class:'btn primary album-cta', text:'✨ ' + (L?'生成回忆图集':'AI memory album') });
albumBtn.addEventListener('click', function () { openMemoryAlbum({ kind:'recent', sinceDays:90, max:12 }); });
// 可选：让用户选范围（最近90天 / 那年今日 / 某人 / 某地）——用现成 openAnchoredMenu
```

---

## 4. Part D —— 细腻动画 & 小巧思（只用 transform/opacity）
```css
/* 卡片按压回弹（全局 tappable） */
.tappable{transition:transform .16s cubic-bezier(.2,.9,.25,1)}
.tappable:active{transform:scale(.985)}
/* 时间线日期组错峰入场 */
@keyframes rgRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.timeline-stream .date-group{animation:rgRise .42s both cubic-bezier(.2,.9,.25,1)}
.timeline-stream .date-group:nth-child(2){animation-delay:.05s}
.timeline-stream .date-group:nth-child(3){animation-delay:.10s}
.timeline-stream .date-group:nth-child(n+4){animation-delay:.14s}
/* 星标爆点 */
@keyframes starPop{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}
.star-btn.starred svg{animation:starPop .42s cubic-bezier(.2,.9,.25,1.1)}
/* 回忆卡轻微视差光泽 */
.resurface-card{position:relative;overflow:hidden}
.resurface-card::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.10) 50%,transparent 60%);
  transform:translateX(-120%);transition:transform .9s ease}
.resurface-card:hover::after{transform:translateX(120%)}
@media (prefers-reduced-motion:reduce){ *{animation:none!important} .tappable:active{transform:none} }
```
**小巧思（JS，择优做，列可收缩）**：
- streak 数字滚动：`computeStreak` 变化时用一个 0→n 的 `requestAnimationFrame` tick。
- 保存成功：toast `t-ok` + 轻 `navigator.vibrate && navigator.vibrate(8)`（Android）。
- 删除：卡片 `scale(.9)+opacity 0` 退场后再 render。
- 下拉时间线顶部轻回弹（overscroll 视觉）。

---

## 5. 兼容 / 坑
- `color-mix()` / `backdrop-filter`：Electron(新 Chromium) + 新 Android WebView 支持；**老 Android 兜底**：toast 给一条 `background:var(--card)`（不透明）回退（放 `@supports not (backdrop-filter:blur(1px))`）。
- 查看器 `resolveMediaBlob` 跨设备无全图 → 用 thumb 顶着，不报错（thumb 已够看）。
- AI 图集：无 Key/离线/超时 → heuristic 降级，**永不卡**；发 thumb 控成本。
- 手势：`touch-action:pan-y` 防止纵向滚动与横滑打架；`mousedown` 路径桌面可拖。
- `prefers-reduced-motion`：所有动画一键关（已在 CSS 兜底）。

## 6. i18n（节选）
```js
// zh: album_cta:'生成回忆图集', album_too_few:'照片太少，攒不出图集', album_building:'正在生成回忆图集…', album_export:'导出长图'
// en: album_cta:'AI memory album', album_too_few:'Not enough photos yet', album_building:'Building your album…', album_export:'Export image'
```

## 7. 验收清单
- [ ] toast 三态（保存✅/失败⚠/同步☁）磨砂质感、色点正确、进场带轻回弹；深浅色都好看；老 WebView 有不透明兜底。
- [ ] 详情画廊点图 → 全屏查看器；左右**滑动跟手 + 回弹 + 惯性翻页**；首/尾边缘阻尼；圆点指示；←/→ 与 Esc 可用；双击放大。
- [ ] 跨设备无全图时查看器用 thumb 顶着不崩；有全图时 thumb→全图平滑替换。
- [ ] 「✨ 生成回忆图集」：有 Key 出标题+叙事+配文；无 Key/离线出启发式图集；<2 张照片给提示；可导出长图（带水印/时间）。
- [ ] 微动画：卡片按压回弹、日期组错峰入场、星标爆点、回忆卡光泽；`prefers-reduced-motion` 下全部关闭。
- [ ] 桌面 + Android 均过；无新权限。

## 8. 发版 / 可收缩
- 版本 1.18.0→1.19.0（5 处）；`RELEASE_NOTES` 写四件事；CHANGELOG。
- **可收缩**：Part D 小巧思（vibrate/数字滚动/退场）最先砍；AI 图集的"选范围菜单"可先固定"最近 90 天"；查看器双击放大可后补。**最小可发版 = Part A(toast) + Part B(滑动查看器)**，最立竿见影。
- **顺带（维护，非本版必须）**：electron-updater 6.8.9 / @capacitor 8.4.0 随手升；Electron 33→42 单独排「维护版」认真回归。

> 一句话：**v1.19 不加维度，只让翻照片更顺、回忆更有温度、每次点按都有澎湃的细腻回弹。**
