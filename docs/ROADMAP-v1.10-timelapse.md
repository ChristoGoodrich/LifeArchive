# Life Archive v1.10.0 ·「时光对比 / 时光历程」实现文档（独立可执行）

> 三柱的**第③柱（收官）**：让用户**看见同一个东西随时间的改变**——这是「给人生做版本管理」独有的、别的相册/日记做不到的招牌动作。
> 本文档自带所有改动点、可粘贴代码、文件锚点（基于当前 **1.9.0** 代码）与坑，照着做即可。

> ⚠️ **版本号注意**：`1.10.0` 在语义化版本里**大于** `1.9.0`（次版本 10 > 9），electron-updater 用 semver 判断，自动更新正常。但人眼/字符串会误以为"1.10 < 1.9"——别在任何地方用字符串/浮点比较版本。详见 §9。

---

## 0. 总览

### 0.1 先厘清：和现有功能不重复
现状已有两块相关功能，**本版不要重做它们**：
- **现实对比（diff 页）**：选两版 → 像素差异 + 物品增减。是"两版之间"的分析。
- **场景趋势与洞察**：diff 页里 `renderTrend()`(3028) 用 `sceneTrend()`(2679) 画的 churn 火花线 + "最常消失/最稳定"。是**数字分析**。

**第③柱要补的是缺的那一半——"看见照片随时间变化"的视觉/情感体验**：
1. **时光历程页**：选一个主体（场景）→ 它**所有版本的照片**按时间从旧到新铺成一条 filmstrip，一眼看完进化史；可点任意一张看详情。
2. **一键时光回顾片**：把该主体的照片按时间拼成一张可分享的图（带时间戳 + 水印），发朋友圈/给家人。
3. **首尾对比**：最早 ↔ 最新 一键进现实对比（复用现成 diff）。

### 0.2 验收闭环
某场景存了 ≥3 张 → 从详情或时间线点"📈 时光历程" → 看到照片从旧到新铺开 + "N 次 · 跨度 X" → 点"首尾对比"看变化 → 点"导出时光回顾片"得到一张拼图 → 分享。
**这条链顺畅 = 时光对比柱成立，三柱收官。**

### 0.3 代码地图（当前 1.9.0 真实锚点）
| 位置 | 行号 | 作用 |
|---|---|---|
| `I18N.zh` / `en` / `t()` | …/… / 该区 | 新键插在 `saved_value_prefix` 前（zh 134 / en 260） |
| `routes` / `ROUTE_DEPTH` / `TAB_ROUTES` | 953 / 962 / — | **加 `'growth'`**（routes + ROUTE_DEPTH，**不进 TAB_ROUTES**） |
| `render()` 分发 | 1197（…review…） | **加 `else if (current==='growth') renderGrowth(v)`** |
| `renderTimeline` 场景过滤 | chips 1312–1338 / list 1345 | 过滤到单场景时**在 renderList 顶部插入历程入口** |
| `renderDetail(v)` / `detail-actions` | 1661 / 1776、1788 | **主入口**：加"📈 看该场景历程"按钮 |
| `renderDiff` / `renderTrend` | 2846 / 3028 | 次入口：trend 卡里加按钮（可选） |
| `pendingDiff`（{sceneId,commitId,baseId}） | 2845 | 首尾对比复用它 |
| `sceneTrend(sceneId)` | 2679 | 复用：count、mostStable/Disappeared/Added、oldest→newest |
| 画布基建 | — | `loadImgEl`(2697)、`drawContain`(2703)、`drawImageStamp`(2713)、`drawWatermark`(2724) |
| `buildCommitCardCanvas` | 2777 | **仿它写 `buildGrowthMontageCanvas`** |
| `showImageModal` / `ShareOut.shareDataUrl` | 2819 / 806 | 显示 + 分享回顾片 |
| `RELEASE_NOTES` | 4255 | 发版加一条 |

**确认存在、会用到的真实助手**（别另造）：`realCommitsForScene`(386)、`notPlanned`(383)、`commitThumbSrc`(337)、`commitImageEntries`(344)、`fmtDate`(294)、`dayLabel`、`sceneName`(896)、`sceneLabel`、`sceneIconSVG`、`noticeCard`、`toast`、`el/$`。

---

## 1. 新路由 + 时光历程页

### 1.1 注册路由（三处）
- `routes`(953) 末尾加 `'growth'`。
- `ROUTE_DEPTH`(962) 加 `growth: 1`（子页 push/pop 动画）。
- **不要**进 `TAB_ROUTES`（子页，返回回到来处）。
- `render()` 分发（1197 那串 else if 里）加：`else if (current === 'growth') renderGrowth(v);`

### 1.2 标志位 + 采样助手（粘到 `pendingDiff`(2845) 附近）
```js
var pendingGrowth = null; // sceneId

// 从 arr 里均匀取 n 个（必含首、末），用于回顾片/缩略，避免几十张全画爆内存
function sampleEvenly(arr, n) {
  if (arr.length <= n) return arr.slice();
  var out = [], step = (arr.length - 1) / (n - 1);
  for (var i = 0; i < n; i++) out.push(arr[Math.round(i * step)]);
  return out;
}
// 跨度文案：天/月
function spanLabel(oldestTs, newestTs) {
  var days = Math.max(0, Math.round((newestTs - oldestTs) / 86400000));
  if (lang === 'zh') return days >= 60 ? (Math.round(days / 30) + ' 个月') : (days + ' 天');
  return days >= 60 ? (Math.round(days / 30) + ' months') : (days + ' days');
}
```

### 1.3 `renderGrowth(v)`（粘到画布函数附近或 renderDiff 之后）
```js
function renderGrowth(v) {
  v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_growth') })]));

  // 可选场景：有 ≥2 条真实存档的场景
  var scenes = Store.SCENES.filter(function (s) { return realCommitsForScene(s.id).length >= 2; });
  if (!scenes.length) { v.appendChild(noticeCard(t('growth_need_two'))); return; }

  var sceneId = pendingGrowth && scenes.some(function (s) { return s.id === pendingGrowth; })
    ? pendingGrowth : scenes[0].id;
  pendingGrowth = null;

  // 场景选择器（复用 choiceSelect）
  var sel = choiceSelect(scenes.map(function (s) { return { value: s.id, text: sceneLabel(s) }; }), sceneId);
  sel.onChange(function () { pendingGrowth = sel.getValue(); routeOrRefresh('growth'); });
  v.appendChild(el('div', { class: 'labeled' }, [
    el('span', { class: 'label-text', text: t('growth_pick_scene') }), sel
  ]));

  var list = realCommitsForScene(sceneId).slice().reverse(); // oldest → newest
  var oldest = list[0], newest = list[list.length - 1];

  // 概要
  v.appendChild(el('div', { class: 'growth-summary',
    text: t('growth_count_span').replace('{n}', list.length).replace('{span}', spanLabel(oldest.createdAt, newest.createdAt)) }));

  // 动作：首尾对比 + 导出回顾片
  v.appendChild(el('div', { class: 'growth-actions' }, [
    el('button', { class: 'btn', text: '🔍 ' + t('growth_first_last'), onclick: function () {
      pendingDiff = { sceneId: sceneId, commitId: newest.id, baseId: oldest.id };
      go('diff');
    } }),
    el('button', { class: 'btn primary', text: '🖼 ' + t('growth_export'), onclick: function () {
      toast(lang === 'zh' ? '生成中…' : 'Building…');
      buildGrowthMontageCanvas(list, sceneId).then(function (cv) {
        showImageModal(cv.toDataURL('image/png'), 'life-archive-growth-' + sceneId + '.png');
      });
    } })
  ]));

  // filmstrip：旧 → 新
  var strip = el('div', { class: 'growth-strip' });
  list.forEach(function (c, i) {
    var frame = el('div', { class: 'growth-frame tappable' });
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

  // 复用 sceneTrend 的洞察（最稳定 / 最常消失 / 最常出现）——纯文字，便宜
  var tr = sceneTrend(sceneId);
  function chips(label, arr) {
    if (!arr || !arr.length) return null;
    return el('div', { class: 'growth-insight-row' }, [
      el('span', { class: 'growth-insight-label', text: label }),
      el('span', { text: arr.map(function (x) { return x.name + '×' + x.count; }).join('  ') })
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
```
**坑：**
- `commitThumbSrc(c)` 可能为空（无图存档），已用 `📷` 占位兜底。
- `sceneTrend` 依赖物品清单（items）；纯照片无清单时洞察为空——已用 `filter(Boolean)` 兜底，不报错。
- 场景切换用 `pendingGrowth = sel.getValue(); routeOrRefresh('growth')` 触发整页重渲染（最简，不必做局部刷新）。

---

## 2. 时光回顾片导出 `buildGrowthMontageCanvas`

**仿照 `buildCommitCardCanvas`(2777) 写，复用全部画布助手。** 粘到它旁边：
```js
function buildGrowthMontageCanvas(commitsOldToNew, sceneId) {
  var L = lang === 'zh';
  var picks = sampleEvenly(commitsOldToNew, 9);   // 最多 9 格，必含首尾
  var sc = Store.sceneById(sceneId);
  return Promise.all(picks.map(function (c) { return loadImgEl(commitThumbSrc(c)); })).then(function (imgs) {
    var W = 1080, pad = 48, cols = 3;
    var rows = Math.ceil(picks.length / cols);
    var gap = 18, cellW = Math.floor((W - pad * 2 - gap * (cols - 1)) / cols);
    var cellH = Math.round(cellW * 0.75), capH = 30;
    var headH = 86, footH = 64;
    var H = headH + rows * (cellH + capH + gap) - gap + footH;
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = '#0b1020'; ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = 'top';
    // 标题
    ctx.fillStyle = '#8ea2ff'; ctx.font = '700 30px sans-serif';
    ctx.fillText('Life Archive · ' + sceneLabel(sc) + ' · ' + (L ? '时光历程' : 'Time-lapse'), pad, pad);
    ctx.fillStyle = '#9aa6c4'; ctx.font = '400 22px sans-serif';
    ctx.fillText(t('growth_count_span').replace('{n}', commitsOldToNew.length)
      .replace('{span}', spanLabel(commitsOldToNew[0].createdAt, commitsOldToNew[commitsOldToNew.length - 1].createdAt)),
      pad, pad + 38);
    // 网格
    picks.forEach(function (c, i) {
      var r = Math.floor(i / cols), col = i % cols;
      var x = pad + col * (cellW + gap), y = headH + r * (cellH + capH + gap);
      ctx.fillStyle = '#141a30'; ctx.fillRect(x, y, cellW, cellH);
      if (imgs[i]) drawContain(ctx, imgs[i], x, y, cellW, cellH);
      drawImageStamp(ctx, fmtDate(c.createdAt), x + 8, y + cellH - 38);
      ctx.fillStyle = '#9aa6c4'; ctx.font = '500 18px sans-serif';
      var tag = i === 0 ? (L ? '最早' : 'first') : (i === picks.length - 1 ? (L ? '最新' : 'latest') : '');
      ctx.fillText(fmtDate(c.createdAt) + (tag ? ' · ' + tag : ''), x + 2, y + cellH + 6);
    });
    drawWatermark(ctx, 'Life Archive · ' + (L ? '生成于 ' : 'Generated ') + fmtDate(Date.now()), pad, H - 24);
    return cv;
  });
}
```
**坑：**
- **内存**：照片是 dataURL，一次画 9 张已不小；用 `commitThumbSrc`（封面）而非原图，且 `sampleEvenly` 封顶 9 张。别去掉这个上限。
- `drawImageStamp(ctx, text, x, y)` / `drawWatermark(ctx, text, x, y)` 签名见 2713/2724；`drawContain(ctx, img, x, y, w, h)` 见 2703——都已用同款。
- `showImageModal` 自带"下载 / 系统分享（native 走 `ShareOut`）"，无需你再写分享。

---

## 3. 入口（三处，detail 为主）

### 3.1 详情页（主入口 · 最稳）
`renderDetail`(1661) 的 `detail-actions`（1776、1788 两处，对应不同状态）里、"导出此存档"按钮旁加：
```js
el('button', { class: 'btn', text: t('growth_open'), onclick: function () {
  if (realCommitsForScene(c.scene).length < 2) { toast(t('growth_need_two')); return; }
  pendingGrowth = c.scene; go('growth');
} }),
```
> `c` 是详情页当前 commit，`c.scene` 即主体。每条存档都能一键看它所在场景的历程。

### 3.2 时间线过滤到单场景时（次入口）
`renderList`(1345) 里、空判断（1352–1359）之后、计划组（1361）之前插入：
```js
if (tlScene !== null && realList.length >= 2) {
  var gscene = tlScene;
  listWrap.appendChild(el('button', { class: 'btn ghost growth-entry',
    text: t('growth_open') + ' · ' + sceneName(Store.sceneById(gscene)),
    onclick: function () { pendingGrowth = gscene; go('growth'); } }));
}
```
> 放在 `renderList` 内 → 切换场景 chip 时会跟着出现/消失（renderList 每次过滤都重建）。

### 3.3 现实对比 trend 卡（可选）
`renderTrend`(3028) 组装 `card` 时（3036 头部之后）加一个按钮：`pendingGrowth = sceneSel.getValue(); go('growth');`。可做可不做。

---

## 4. i18n 新增键

**zh：插在第 134 行 `saved_value_prefix` 之前**：
```js
nav_growth: '时光历程', growth_open: '📈 时光历程',
growth_pick_scene: '选择场景',
growth_need_two: '这个场景至少要有两个存档，才能看时光历程。',
growth_count_span: '{n} 次存档 · 跨度 {span}',
growth_first_last: '首尾对比', growth_export: '导出时光回顾片',
growth_oldest: '最早', growth_newest: '最新',
growth_insights: '历程洞察',
growth_most_stable: '最稳定', growth_most_gone: '最常消失', growth_most_added: '最常出现',
```
**en：插在第 260 行 `saved_value_prefix` 之前**：
```js
nav_growth: 'Time-lapse', growth_open: '📈 Time-lapse',
growth_pick_scene: 'Pick a scene',
growth_need_two: 'This scene needs at least two archives to show a time-lapse.',
growth_count_span: '{n} archives · {span} span',
growth_first_last: 'First vs latest', growth_export: 'Export time-lapse card',
growth_oldest: 'first', growth_newest: 'latest',
growth_insights: 'Trend insights',
growth_most_stable: 'Most stable', growth_most_gone: 'Most gone', growth_most_added: 'Most added',
```
> `{n}` / `{span}` 用链式 `.replace('{n}',x).replace('{span}',y)`；缺键回退中文/键名不崩，但请成对补齐。

---

## 5. CSS（`css/styles.css` 末尾追加）

```css
.growth-summary{margin:10px 2px;color:var(--muted,#8a93a6);font-size:.9rem}
.growth-actions{display:flex;gap:10px;margin:6px 0 14px}
.growth-actions .btn{flex:1}
.growth-strip{display:flex;gap:12px;overflow-x:auto;padding:4px 2px 12px;-webkit-overflow-scrolling:touch}
.growth-frame{flex:0 0 auto;width:150px;cursor:pointer}
.growth-frame-img{width:150px;height:112px;object-fit:cover;border-radius:12px;display:block;background:#141a30}
.growth-frame-noimg{width:150px;height:112px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:30px;background:#141a30}
.growth-frame-cap{margin-top:6px;font-size:.72rem;color:var(--muted,#8a93a6);line-height:1.3}
.growth-entry{width:100%;margin:0 0 12px}
.growth-insights{margin-top:16px}
.growth-insights-head{font-weight:600;margin-bottom:8px}
.growth-insight-row{display:flex;gap:8px;font-size:.86rem;padding:3px 0}
.growth-insight-label{flex:0 0 auto;color:var(--muted,#8a93a6);min-width:64px}
```
> filmstrip 用横向滚动；移动端注意别让它撑破页宽（`overflow-x:auto` + `flex:0 0 auto` 已处理）。

---

## 6. 验收清单（逐条打勾）

**桌面端（`npm start`）**
- [ ] 给某场景存 3+ 张不同照片 → 详情页点"📈 时光历程"进页面。
- [ ] filmstrip 从旧到新铺开，首/末标注"最早/最新"，点任意一张进详情。
- [ ] 概要显示"N 次 · 跨度 X（天/月）"。
- [ ] "首尾对比" → 进现实对比，base=最早、compare=最新。
- [ ] "导出时光回顾片" → 弹出拼图（最多 9 格，含首尾），每格带时间戳 + 底部水印；可下载。
- [ ] 时间线点某场景 chip → 列表顶部出现"📈 时光历程 · 场景名"入口；切到"全部"入口消失。
- [ ] 场景选择器切换 → 整页换成另一个场景的历程。
- [ ] 无清单（纯照片）的场景 → 洞察区为空但不报错。

**安卓真机（装新 APK）**
- [ ] 同上流程跑通；导出回顾片后"系统分享"能把图分享出去（走 `ShareOut`）。
- [ ] filmstrip 横向滑动顺畅、不撑破屏宽。

---

## 7. 发版（照搬 `RELEASING.md` 铁律 · 缺一条算未完成）

> ⚠️ **`1.10.0` 是合法且大于 `1.9.0` 的 semver**（10 > 9）。electron-updater/`?v=` 都没问题；只要别在代码里用 `parseFloat('1.10')` 或字符串大小比较版本即可（仓库里没有这种比较，保持现状）。

**新版本号 `1.10.0`。铁律 1 —— 同步改 5 处：**
1. `package.json` `"version"` → `1.10.0`
2. `js/version.js` `window.APP_VERSION` → `'1.10.0'`
3. `index.html` 5 个 `?v=`（11、41–44 行，现为 `?v=1.9.0`）→ `?v=1.10.0`
4. `js/app.js` `RELEASE_NOTES`(4255) **顶部新增一条**（插在 `var RELEASE_NOTES = [` 与 `['1.9.0',…]` 之间）：
   `['1.10.0','2026-…','时光历程：看见同一场景的变化 + 一键时光回顾片','Time-lapse: watch one scene change + one-tap montage',[中文逐条…],[EN bullets…]]`
5. `CHANGELOG.md` 顶部**新增一节**（中文为主：时光历程页 / filmstrip / 首尾对比 / 时光回顾片导出 / 三处入口）

> 三处说明一致；GitHub Release **标题纯版本号** `1.10.0`。

**Windows：**
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
$env:GH_TOKEN = "你的_GitHub_Token"
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
npx electron-builder --win --publish always
```
**安卓：** Actions → Build Android APK → Run workflow → 下载 `LifeArchive-debug.apk` → `gh release upload v1.10.0 LifeArchive-debug.apk`。两端都发才算完，发完按铁律 4 自检。

---

## 8. 不要做 / 边界（防跑偏）

- ❌ **不重做现实对比 / 场景趋势洞察**——它们已存在（diff 页 + `sceneTrend`）。本版只补"看见照片随时间变化"的视觉/情感那半。
- ❌ **不做动图 GIF**——静态拼图回顾片已可分享、零依赖。GIF 需引 `gif.js` 之类，留作未来 stretch。
- ❌ **主体先只按"场景"**——不引入 per-人/物 标签系统（那是更大工程）。用户想专盯一个东西，就固定用一个场景即可。"场景内关键词细分"可作未来增强。
- ❌ **回顾片别去掉 9 格上限**——dataURL 照片很占内存，`sampleEvenly` 封顶是护栏。
- ❌ **growth 不进底部 tab**——子页，从 detail / 时间线过滤 / diff 进，返回回来处。
- ❌ **不改 store / 云同步 / 字段**——时光历程是纯读 + 纯画布，零数据层改动。
- ✅ **这是三柱收官**：①重温（遇见过去）+②轻松记录（养成习惯）+③时光对比（看见改变）= 记录→重温→看见改变 的完整情感闭环，也是"给人生做版本管理"真正区别于相册/日记的地方。

---

*配套：v1.7 引擎层、v1.8 重温、v1.9 轻松记录文档均在 `docs/`。三柱做完后，下一步可考虑：把近 20 个场景在 UI 上收敛成"我常用的几个"、或按用户真实使用数据决定深化方向。*
