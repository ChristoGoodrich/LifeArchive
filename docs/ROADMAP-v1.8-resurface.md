# Life Archive v1.8.0 ·「重温 / 回返」实现文档（独立可执行）

> 这是三根柱子的**第①柱**：让用户进 App 就遇见过去、被温柔地叫回来重温。
> 定位回到名字本身——**生活存档 = 记录点滴 + 回档重温**，本柱专做"重温/回返"。
> 本文档自带所有改动点、可粘贴代码、文件锚点（基于当前 **1.7.0** 代码）与坑，照着做即可。
> ②轻松记录、③时光对比放后续版本（v1.9 / v2.0）。

---

## 0. 总览

### 0.1 本版做三件事
1. **时间线「那年今日」横幅**：进 App 第一眼，若今天有"周年记忆"就浮一条横幅 → 点进回顾页。
2. **新增「回顾」页（route `review`）**：那年今日 / 往月今日 / 随机翻牌 / 本月统计，全部复用现有卡片。
3. **情感化通知**：复用 v1.7 的 `Notify`，把冷冰冰的"复查提醒"升级出一类温暖的"那年今日"推送，点开直达回顾页。

### 0.2 验收闭环（做完用它端到端验收，测试用 §8 的 demo 数据制造"去年今天"）
进 App → 看到「🕰 那年今日 · N 个瞬间」横幅 → 点进回顾页看到去年/往月的存档卡片 → 点卡片进详情重温 → 返回；手机端到点收到「N 年前的今天你记录了…」通知 → 点通知直达回顾页。
**这条链顺畅 = 重温柱成立。**

### 0.3 代码地图（当前 1.7.0 的真实锚点，动手前先打开看）
| 位置 | 行号 | 作用 |
|---|---|---|
| `I18N.zh` / `I18N.en` / `t()` | 10–105 / 106–201 / 205 | 加文案；新键插在 `saved_value_prefix` 前 |
| `routes` 数组 | 736 | **加 `'review'`** |
| `TAB_ROUTES` | 742 | **不要加** review（它是子页，不是底部 tab） |
| `ROUTE_DEPTH` | 745 | **加 `review: 1`**（子页，push/pop 动画） |
| `go(route)` | 766 | 现成导航，review 直接能用 |
| `handleNotifyIntent(ex)` | 787 | **加 `review` 路由分支** |
| `renderNav()` | 918 | 底部导航（4 tab + 新建），本版不动 |
| `render()` 分发 | 939–966 | **加 `else if (current==='review') renderReview(v)`** |
| `renderTimeline(v)` | 996 | 空状态 998–1028；正文从 1030 起，**横幅插在 1030 之后** |
| `commitCard(c)` | 1162 | **回顾页直接复用它**（点卡片→详情已内建） |
| `dayKey/dayLabel/fmtTime` | 1141/1145/1157 | 日期助手 |
| `Notify` 适配块 | 555 | 复用 `Notify.scheduleAt` |
| `scheduleRecheckForCommit` | 648 | 仿照它写 `scheduleMemoryNotifs` |
| boot `Store.init().then` | 4894 | `Notify.syncAll()` 在 4897，**memory 排程接在它后面** |

**确认存在、片段会用到的真实助手**（不要另造）：
`notPlanned(c)`(323)、`realCommitsForScene(id)`(326)、`toast(msg)`(327)、`sceneName(scene)`(896)、`sceneTag`(897)、`noticeCard(text)`(3644)、`el()/$()`、`{n}` 替换用 `.replace('{n}', x)`（与 1615 行一致）。

---

## 1. 设计：记忆挑选算法（本版最关键，先想清楚）

**最大的坑：绝大多数用户用了不到一年，"去年今天"几乎总是空的，功能会像坏的。** 所以横幅必须有**降级链**，从第一周就有东西可看：

> 优先级（取第一个非空的）：
> 1. **那年今日**：与今天「月+日」相同、但**年份更早**的存档（真·周年）。
> 2. **往月今日**：与今天「日」相同、但在更早的月（用满 1 个月就有）。
> 3. **随机翻牌**：≥7 天前的旧存档里随机抽几条。
> 4. 都没有 → 不显示横幅（新用户头几天，靠 onboarding 和正常时间线即可）。

回顾页则把这几类都列成分区（去重：往月今日要排除已在"那年今日"出现的）。

**把下面这组纯查询函数粘到 app.js（建议紧跟 `commitCard` 之后，约 1280 行）：**

```js
/* ---------------- Review / Resurface (重温) helpers ---------------- */
function startOfToday() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }

// 真·周年：与 ref「月+日」相同、年份更早的真实存档（新→旧）
function anniversaryCommits(ref) {
  return Store.commits().filter(notPlanned).filter(function (c) {
    var d = new Date(c.createdAt);
    return d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate()
        && d.getFullYear() < ref.getFullYear();
  });
}
// 往月今日：与 ref「日」相同、但落在更早的月份（含更早年份）
function monthlyAnniversaryCommits(ref) {
  return Store.commits().filter(notPlanned).filter(function (c) {
    var d = new Date(c.createdAt);
    if (d.getDate() !== ref.getDate()) return false;
    if (d.getFullYear() < ref.getFullYear()) return true;
    return d.getFullYear() === ref.getFullYear() && d.getMonth() < ref.getMonth();
  });
}
// 随机翻牌：≥7 天前的旧存档随机抽 n 条
function randomOlderCommits(n) {
  var cutoff = Date.now() - 7 * 86400000;
  var pool = Store.commits().filter(notPlanned).filter(function (c) { return c.createdAt <= cutoff; });
  for (var i = pool.length - 1; i > 0; i--) {        // Fisher–Yates 洗牌
    var j = Math.floor(Math.random() * (i + 1)); var x = pool[i]; pool[i] = pool[j]; pool[j] = x;
  }
  return pool.slice(0, n);
}
// 本月存了几条（用于回顾页小标题）
function thisMonthCount(ref) {
  return Store.commits().filter(notPlanned).filter(function (c) {
    var d = new Date(c.createdAt);
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
  }).length;
}
// 横幅用的"最佳重温"，带降级链。返回 {kind, years?, commits} 或 null
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
```
**坑：** 全程 `notPlanned` 过滤——预存档/计划不算记忆。用本地时间的 `getFullYear/Month/Date`（与 `dayKey` 一致），别用 UTC，否则跨零点会错位。

---

## 2. 数据层：无需改 store

重温是**纯读查询**，全部基于 `Store.commits()`（已是"新→旧排序的拷贝"，store.js 215–218）。**不新增 store 方法、不改云同步、不改字段。** 这是本版最省心的部分。

---

## 3. 新路由 + 回顾页

### 3.1 注册路由（三处，缺一不可）
- `routes`(736) 末尾加 `'review'`：
  ```js
  var routes = ['timeline','commit','diff','rollback','branch','branch-detail','settings','changelog','detail','stats','review'];
  ```
- `ROUTE_DEPTH`(745) 加 `review: 1`（子页 → push/pop 动画）。
- **不要**动 `TAB_ROUTES`（让 review 当子页：从横幅进，返回回到时间线）。
- `render()`(958 那串 else if 末尾) 加：
  ```js
  else if (current === 'review') renderReview(v);
  ```

### 3.2 `renderReview(v)`（粘到 §1 的 helpers 之后）
```js
function renderReview(v) {
  v.appendChild(el('div', { class: 'view-head' }, [el('h1', { text: t('nav_review') })]));
  if (Store.isEmpty()) { v.appendChild(noticeCard(t('review_empty'))); return; }
  var ref = startOfToday();

  function section(title, sub, commits) {
    if (!commits || !commits.length) return;
    var head = [el('h2', { text: title })];
    if (sub) head.push(el('span', { class: 'review-sec-sub', text: sub }));
    var rail = el('div', { class: 'commit-rail' });
    commits.forEach(function (c) { rail.appendChild(commitCard(c)); });
    v.appendChild(el('section', { class: 'review-sec' }, [
      el('div', { class: 'review-sec-head' }, head), rail
    ]));
  }

  var anni = anniversaryCommits(ref);
  section(t('review_on_this_day'), null, anni);

  // 往月今日：排除已在"那年今日"出现的，避免重复
  var anniIds = {}; anni.forEach(function (c) { anniIds[c.id] = 1; });
  section(t('review_this_day_months'), null,
    monthlyAnniversaryCommits(ref).filter(function (c) { return !anniIds[c.id]; }));

  section(t('review_random'), null, randomOlderCommits(6));

  var n = thisMonthCount(ref);
  if (n) v.appendChild(el('div', { class: 'review-month-note', text: t('review_month_count').replace('{n}', n) }));
}
```
**坑（复用 `commitCard` 安全性）：** `commitCard` 的星标回调里会调用 `tlRerenderChips()/tlRerender()`，它们是时间线设置的模块变量。从回顾页星标时这俩可能指向已卸载的时间线闭包——但都有 `if (...)` 守卫且只操作各自捕获的（已脱离文档的）节点，**不会崩**；真实星标状态走 `Store.toggleStar` 持久化，返回时间线会重新读取，正确。无需处理。

---

## 4. 时间线「那年今日」横幅 + 入口

### 4.1 横幅（核心入口）
在 `renderTimeline`(996) 里，**紧跟 view-head（1030 行 `v.appendChild(el('div',{class:'view-head'}...))` 之后**插入：
```js
var res = pickResurface(startOfToday());
if (res) {
  var L = lang === 'zh';
  var label = res.kind === 'year'
      ? (L ? ('🕰 那年今日 · ' + res.commits.length + ' 个瞬间')
           : ('🕰 On this day · ' + res.commits.length + ' memories'))
    : res.kind === 'month'
      ? (L ? '🕰 往月今日 · 翻翻看' : '🕰 This day in earlier months')
      : (L ? '🕰 随机重温 · 翻一张旧存档' : '🕰 Resurface an old memory');
  var banner = el('button', { type: 'button', class: 'resurface-banner', text: label,
    onclick: function () { go('review'); } });
  v.appendChild(banner);
}
```
**坑：** 横幅**只在 `res` 非空时出现**（降级链已保证早期也有内容）；空档案在 998 行就 return 了，不会走到这里。

### 4.2 常驻入口（可选但推荐）
横幅是"今天恰好有记忆"才出现；给一个**常驻**入口，让任何时候都能进回顾页。二选一：
- **A（最简）**：在 4.1 的 view-head 那行，把标题行换成「标题 + 回顾按钮」：
  ```js
  v.appendChild(el('div', { class: 'view-head' }, [
    el('h1', { text: t('nav_timeline') }),
    el('button', { type: 'button', class: 'btn ghost tiny review-entry',
      text: t('review_open'), onclick: function () { go('review'); } })
  ]));
  ```
- **B（顶栏图标）**：在 `index.html` 的 `.topbar-actions`（第 29 行）里、`#stats-btn` 旁加一个 `#review-btn`，再到 boot（4884 附近，仿照 `_stats`）绑定 `go('review')`。

---

## 5. 情感化通知（复用 Notify）

### 5.1 为什么要"滚动预排程"
Web/Capacitor **不能在后台每天跑代码**，所以不能靠"一条循环通知动态取内容"。做法：**每次开 App 时，往后预排 14 天**——只给"那天确实有周年记忆"的日期排一条，到点本地触发。`id` 用日期 key，幂等（重排即替换）。这样：① 没历史的用户永远不会被打扰、也不会被无谓地弹权限；② 有记忆的日子准点提醒。

### 5.2 加排程函数（仿照 `scheduleRecheckForCommit` 648，粘在它附近）
```js
function scheduleMemoryNotifs() {
  if (!Notify.available()) return Promise.resolve();   // 桌面端无推送，靠 §4 横幅
  var jobs = [], base = startOfToday(), L = lang === 'zh';
  for (var i = 0; i < 14; i++) {
    var day = new Date(base.getTime() + i * 86400000);
    var hits = anniversaryCommits(day);                // 只排"真·周年"的日子
    if (!hits.length) continue;
    var when = new Date(day); when.setHours(20, 0, 0, 0); // 当天 20:00 推送
    if (when.getTime() <= Date.now()) continue;
    var sample = hits.reduce(function (a, b) { return a.createdAt < b.createdAt ? a : b; });
    var years = day.getFullYear() - new Date(sample.createdAt).getFullYear();
    var what = sample.message || sceneName(Store.sceneById(sample.scene));
    var body = L ? (years + ' 年前的今天，你记录了「' + what + '」，点开看看 →')
                 : (years + 'y ago today you logged “' + what + '” — take a look →');
    var dateKey = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
    jobs.push(Notify.scheduleAt('memory:' + dateKey, 'memory', when.getTime(),
      t('notif_memory_title'), body, { kind: 'memory', route: 'review' }));
  }
  return Promise.all(jobs);
}
```

### 5.3 开机调用
boot 的 `Store.init().then`(4894) 里、`Notify.syncAll();`(4897) 之后加一行：
```js
scheduleMemoryNotifs();
```

### 5.4 点通知 → 回顾页
`handleNotifyIntent(ex)`(787) 里、`if (!storeReady)...` 之后加一个分支（放在 diff/branch-detail 判断之前或之后都行）：
```js
if (ex.route === 'review') { routeOrRefresh('review'); return; }
```
（冷启动时序已被 v1.7 的 `pendingDeepLink` 机制覆盖：未就绪先存，`storeReady` 后在 4898 消费——无需新增。）

**坑：**
- `Notify.scheduleAt` 内部会 `ensurePermission()`（可能弹权限）。因为 `scheduleMemoryNotifs` 只在**有周年记忆**时才进入排程，所以**不会对无历史用户弹窗**。若想更克制，可在调用前 `Notify._p().checkPermissions()` 只在已授权时排程（可选）。
- `'memory'` 这个 `kind` 与 `'recheck'/'due'` 不同，`idFor` 已用 kind 加盐，**不会和复查/到期通知撞 id**。
- POST_NOTIFICATIONS 权限 v1.7 已在 `set-android-version.mjs` 注入，本版**无需再改原生工程**。

---

## 6. i18n 新增键

**zh：插在第 104 行 `saved_value_prefix` 之前**（`I18N.zh` 内）：
```js
nav_review: '回顾',
review_open: '🕰 回顾',
review_empty: '还没有可重温的存档，先去记录一些生活吧。',
review_on_this_day: '那年今日',
review_this_day_months: '往月的今天',
review_random: '随机翻牌重温',
review_month_count: '本月你已经记录了 {n} 个瞬间',
notif_memory_title: '生活存档 · 那年今日',
```
**en：插在第 200 行 `saved_value_prefix` 之前**（`I18N.en` 内）：
```js
nav_review: 'Memories',
review_open: '🕰 Memories',
review_empty: 'Nothing to resurface yet — go capture some life first.',
review_on_this_day: 'On this day',
review_this_day_months: 'This day, earlier months',
review_random: 'Random resurface',
review_month_count: 'You\'ve logged {n} moments this month',
notif_memory_title: 'Life Archive · On this day',
```
> `t()` 找不到键会回退中文/键名、不崩（205 行），但请中英成对补齐。

---

## 7. CSS（`css/styles.css` 末尾追加）

需要的新类：`.resurface-banner`、`.review-sec`、`.review-sec-head`、`.review-sec-sub`、`.review-month-note`、`.review-entry`（若用 4.2-A）。建议风格与品牌一致（开屏/图标的蓝→紫渐变）：
```css
.resurface-banner{display:block;width:100%;margin:8px 0 4px;padding:12px 14px;border:0;border-radius:14px;
  background:linear-gradient(135deg,#5b6cf0,#8b5cf6);color:#fff;font-weight:600;text-align:left;
  cursor:pointer;box-shadow:0 4px 14px rgba(91,108,240,.25)}
.resurface-banner:active{transform:scale(.99)}
.review-sec{margin:18px 0}
.review-sec-head{display:flex;align-items:baseline;gap:8px;margin:0 2px 8px}
.review-sec-head h2{font-size:1.05rem;margin:0}
.review-sec-sub,.review-month-note{color:var(--muted,#888);font-size:.85rem}
.review-month-note{margin:16px 2px}
```
回顾页的卡片轨道直接复用现有 `.commit-rail` 样式（`commitCard` 自带）。横幅放在时间线"搜索框之上"最显眼，符合"进 App 第一眼遇见过去"。

---

## 8. demo 数据：让"那年今日"可测（改 `seedDemo` 3703）

否则你今天打开很可能没有周年记忆，测不出来。在 `seedDemo()` 里加 1–2 条 `createdAt` 正好是**去年今天**和**上个月今天**的存档：
```js
var today = new Date(); today.setHours(10, 0, 0, 0);
var lastYear = new Date(today); lastYear.setFullYear(today.getFullYear() - 1);
var lastMonth = new Date(today); lastMonth.setMonth(today.getMonth() - 1);
Store.addCommit({ scene: 'desk', createdAt: lastYear.getTime(), message: '去年今天的书桌', items: [] });
Store.addCommit({ scene: 'room', createdAt: lastMonth.getTime(), message: '上个月今天的房间', items: [] });
```
（仅用于演示/自测；正式用户靠真实积累。）

---

## 9. 验收清单（逐条打勾）

**桌面端（`npm start`）**
- [ ] 载入 demo（含 §8 周年数据）→ 时间线顶部出现「🕰 那年今日 · N」横幅。
- [ ] 点横幅 → 进回顾页，"那年今日"区有去年的卡片，"往月今日"有上月的卡片且不重复。
- [ ] 点回顾页卡片 → 进详情；返回 → 回到回顾页；再返回 → 回到时间线。
- [ ] 清掉周年 demo、只留近期数据 → 横幅降级为"随机重温"或不显示，不报错。
- [ ] `Notify.available()` 为 false，无推送、无报错（降级正常）。

**安卓真机（装新 APK）**
- [ ] 有周年记忆时，当天 20:00 收到「N 年前的今天你记录了…」通知。
- [ ] 点通知 → 直达回顾页（热启动 & 杀后台冷启动都验证）。
- [ ] 无任何历史的新账号 → 不弹通知权限、不报错。
- [ ] 回顾页/横幅文案中英都正常（切换语言验证）。

---

## 10. 发版（照搬 `RELEASING.md` 铁律 · 缺一条算未完成）

**新版本号 `1.8.0`。铁律 1 —— 同步改 5 处：**
1. `package.json` `"version"` → `1.8.0`
2. `js/version.js` `window.APP_VERSION` → `'1.8.0'`
3. `index.html` 5 个 `?v=`（第 11、41–44 行，现为 `?v=1.7.0`）→ `?v=1.8.0`
4. `js/app.js` 的 `RELEASE_NOTES`(3814) **顶部新增一条**（插在 `var RELEASE_NOTES = [` 与现有 `['1.7.0',…]` 之间），形状：
   `['1.8.0','2026-…','重温·那年今日：进 App 遇见过去 + 回顾页 + 情感化提醒','On This Day memories: resurface page + warm reminders',[中文逐条…],[EN bullets…]]`
5. `CHANGELOG.md` 顶部**新增一节**（中文为主：新增"那年今日"横幅、回顾页、那年今日通知；注意事项：通知需手机端，桌面端走应用内横幅）

> 三处说明（CHANGELOG / RELEASE_NOTES / GitHub Release 正文）内容一致；GitHub Release **标题只能是纯版本号** `1.8.0`。版本号必须严格大于上一版，自动更新才会触发。

**Windows：**
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
$env:GH_TOKEN = "你的_GitHub_Token"
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
npx electron-builder --win --publish always
```
**安卓：** GitHub → Actions → Build Android APK → Run workflow → 下载 `LifeArchive-debug.apk` → `gh release upload v1.8.0 LifeArchive-debug.apk`。两端都发才算完，发完按铁律 4 自检。

---

## 11. 不要做 / 边界（防跑偏）

- ❌ **本版不做②轻松记录、③时光对比**——一根柱子一版，做透再下一根。
- ❌ **不把 review 加进 `TAB_ROUTES`**（底部已 4 tab + FAB，再加会挤；review 当子页更顺，返回逻辑也对）。
- ❌ **不改 store、不改云同步、不改字段**——重温是纯查询。
- ❌ **不用重复/循环通知去"动态取内容"**——用 §5 的滚动预排程（Web/Capacitor 没有可靠后台）。
- ❌ **不对无历史用户弹通知权限**——`scheduleMemoryNotifs` 仅在有周年记忆时排程。
- ❌ **桌面端不得依赖原生推送**——靠应用内"那年今日"横幅，已天然降级。
- ✅ **降级链是灵魂**：没有"去年今天"也要有"往月今日/随机翻牌"，否则功能在用户用满一年前都像坏的。

---

*配套：v1.7 引擎层文档见 `docs/ROADMAP-v1.7-engine.md`；产品三柱（①重温 / ②轻松记录 / ③时光对比）的定位讨论见本次对话。下一版（v1.9）做②轻松记录时，可在本页同目录另开一份。*
