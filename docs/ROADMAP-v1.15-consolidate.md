# Life Archive v1.15.0 ·「导航收敛 + 打磨」实现文档（独立可执行）

> 前 5 个版本一直在**加**：七维输入（v1.12–1.13）、回看消费（v1.14）。功能齐了，但底部导航还是「**5 个并列 tab 的工具箱**」——而你（主用户）只用时间线 + 新建。
> 本版**一个新能力都不加**，只做一件事：把 App 从"工具箱"收成**两个日常闭环（记录 / 回看）+ 进阶工具收纳**，并顺手打磨由此引出的细节。
> 基于当前 **1.14.0** 真实代码，自带改动点、可粘贴代码、文件锚点与坑。

> 🧭 **北极星**：底栏只留你**天天用**的；`现实对比 / 回滚 / 分支决策`这三件套**功能全部保留、一行逻辑不删**，只是从"一级 tab"挪进它们本来就有的上下文入口 / 设置里。**0 行 store 改动、0 数据迁移、0 功能删除。**

---

## 0. 总览

### 0.1 现状（当前 1.14.0）
- **底部导航**（`renderNav` **1238**）：一个 `.nav-group` 药丸装 4 个浏览 tab —— `[timeline, diff, rollback, branch]`，外加 `commit` 作为中间 FAB。
- `TAB_ROUTES`（**1032**）= `['timeline', 'diff', 'commit', 'rollback', 'branch']`；`ROUTE_DEPTH`（**1035**）里 diff/rollback/branch 都是 0（顶层 tab）。
- **三件套其实早有上下文入口**（降级后不失联）：
  - **现实对比 diff**：详情页「🔍 与上一版对比」（**2060–2065**）、时光历程 `openGrowthForScene`→`go('diff')`（**3524**）。
  - **回滚 rollback**：详情页「⏮️ 回滚」（**2069–2070**）。
  - **分支决策 branch**：详情页 `c.fromBranchId`→`branch-detail`（**1920**）、到期通知深链→`branch-detail`（**949**）。**但 branch 的「列表页」目前唯一顶层入口就是那个 nav tab**——降级必须给它安新家（§2）。
- **顶栏**已有 `设置`(settings) 和 `统计`(stats) 图标（**6300/6302**），不在底栏。

### 0.2 本版做三件事
1. **Part A 收敛底栏**：浏览 tab 从 `[timeline, diff, rollback, branch]` → `[timeline, review]`，`commit` 仍是 FAB。即底栏 = **时间线 · 回顾 ·（＋新建）**。把 v1.14 投入的「回顾」从"藏在按钮后"提升为**一级 tab**，让回看真正有家。
2. **Part B 安置降级功能（不失联 + 不丢信号）**：diff/rollback 只靠现有详情入口；branch 列表页挪进**设置**；**保留 branch 的「待决策」徽标信号**（原在底栏，别弄丢）；给变成子页的 diff/rollback/branch **补返回按钮**。
3. **Part C 打磨**：2-tab 底栏的居中/间距、子页返回样式统一、删冗余入口——都是收敛**直接引出**的小修，稳。

### 0.3 ⚠️ 边界 / 不做
- ❌ 不删除 diff/rollback/branch **任何功能逻辑**，只挪入口。它们仍在 `routes`(1026) 里，hash 深链 `#diff`/`#branch` 仍有效。
- ❌ 不动 `store.js` / 数据结构 / 云 / 备份。
- ❌ 本版不加任何新能力（这是"减法版"）。
- ❌ 不动顶栏的 设置/统计 图标。

### 0.4 验收闭环（端到端）
打开 App → 底栏只剩 **时间线 · 回顾 ·（＋）** 三个 → 点「回顾」直达 Memories 页（无返回按钮、是 tab）→ 进任意存档详情，「🔍 与上一版对比」「⏮️ 回滚」照常可用，且对比/回滚页**左上有返回**能回详情 → 设置页出现「分支决策」菜单项（有待决策时带数字徽标），点进是分支列表、左上可返回 → 到期通知点开仍直达 branch-detail → 全程底栏在子页不误高亮。
**这条链顺 = 本版达成。**

### 0.5 代码地图（当前 1.14.0 真实锚点）
| 位置 | 行号 | 改动 |
|---|---|---|
| `TAB_ROUTES` | **1032** | `['timeline','review','commit']` |
| `ROUTE_DEPTH` | **1035** | review→0；diff/rollback/branch→1 |
| `navButton`（含 branch 徽标） | **1206–1219** | branch 徽标随之消失，信号移到设置（§2.3） |
| `renderNav` | **1238–1251** | nav-group 改为 `[timeline, review]` |
| `NAV_ICONS` | 1208 引用 | 加 `review` 图标键 |
| timeline view-head「回顾」入口 | **1356–1357** | 删（回顾已是 tab，冗余） |
| `renderReview` 返回按钮 | **1736–1737** | 删（tab 不需要返回） |
| `renderDiff` view-head | **3568** | 加返回按钮 |
| `renderRollback` view-head | **3982** | 加返回按钮 |
| `renderBranch` view-head | **4331** | 加返回按钮 |
| `renderSettings` | **5843+** | 加「分支决策」菜单项（仿更新日志 5849–5853） |
| `RELEASE_NOTES` | **5019** | 顶部加 1.15.0 |
| 版本号 | package.json **3** / version.js **3** / index.html **11/41/42/43/44** | 1.14.0→1.15.0 |

---

## 1. Part A —— 收敛底部导航

### 1.1 路由表（1032 / 1035）
```js
// 1032
var TAB_ROUTES = ['timeline', 'review', 'commit'];
// 1035：review 提为顶层；三件套降为子页
var ROUTE_DEPTH = { timeline: 0, review: 0, commit: 0,
  diff: 1, rollback: 1, branch: 1, 'branch-detail': 2, detail: 1,
  settings: 1, changelog: 2, stats: 1, growth: 1 };
```
> 影响：`go()` 进入 diff/rollback/branch 时 `isTabRoute` 为假 → 会 `navStack.push`（1064），返回靠 `goBack()`（1108）正常工作；timeline↔review 同 depth 0 → 走 fade 动画，体验对。

### 1.2 nav-group（renderNav 1245–1250）
```js
var group = el('div', { class: 'nav-group' });
[['timeline', t('nav_timeline')], ['review', t('review_open')]
].forEach(function (it) { group.appendChild(navButton(it[0], it[1], false)); });
nav.appendChild(group);
nav.appendChild(navButton('commit', t('nav_commit'), true));
```
> `t('review_open')` 已存在（zh「回顾」/ en「Memories」，105/263）。

### 1.3 NAV_ICONS 加 review 图标（1208 引用处的图标表里）
在 `NAV_ICONS` 对象里新增一个 `review` 键（复用现成风格的内联 SVG；例：一个时钟回拨/心形）：
```js
// NAV_ICONS 里新增（与其它键同款 24x24 stroke svg）：
review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/></svg>',
```
> 没有 `NAV_ICONS[route]` 会导致图标空白——**这一步别漏**。diff/rollback/branch 的旧图标键留着无妨（不再被 nav 用）。

### 1.4 删 timeline 顶部冗余「回顾」入口（1356–1357）
回顾已是底栏 tab，view-head 里这颗按钮重复，删掉整段：
```js
// 删除：
el('button', { type: 'button', class: 'btn ghost tiny review-entry',
  text: t('review_open'), onclick: function () { go('review'); } })
```
保留 view-head 的标题 `el('h1', { text: t('nav_timeline') })`。

### 1.5 renderReview 去返回按钮（1736–1741）
review 现在是 tab（depth 0），不该有返回。把：
```js
var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (L ? '返回' : 'Back') });
back.addEventListener('click', function () { if (!goBack()) go('timeline'); });
v.appendChild(el('div', { class: 'view-head review-view-head' }, [back, el('h1', { text: t('nav_review') })]));
```
改为：
```js
v.appendChild(el('div', { class: 'view-head review-view-head' }, [el('h1', { text: t('nav_review') })]));
```
> `tlRerender = null; tlRerenderChips = null;`（1733–1734）保留不动。

---

## 2. Part B —— 安置降级功能（不失联 + 不丢信号）

### 2.1 diff / rollback：只补返回按钮（功能入口已在详情页）
两页从 tab 变子页，需要能退回来。用全 App 统一的 `goBack` 模式（同 detail 1779）。

**renderDiff（3568）** view-head 改为带返回：
```js
var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (lang === 'zh' ? '返回' : 'Back') });
back.addEventListener('click', function () { if (!goBack()) go('timeline'); });
v.appendChild(el('div', { class: 'view-head' }, [back, el('h1', { text: t('nav_diff') })]));
```
**renderRollback（3982）** 同样：
```js
var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (lang === 'zh' ? '返回' : 'Back') });
back.addEventListener('click', function () { if (!goBack()) go('timeline'); });
v.appendChild(el('div', { class: 'view-head' }, [back, el('h1', { text: t('nav_rollback') })]));
```
> 这两页本就从详情页（detail，depth 1）或时光历程进入，`navStack` 里有来路，`goBack()` 能正确回退；万一直接 hash 进入（无来路）则回 timeline 兜底。

### 2.2 branch 列表页：挪进设置 + 补返回
**(a) renderBranch（4331）** 加返回按钮（同上模式）：
```js
var back = el('button', { class: 'btn ghost tiny', text: '‹ ' + (lang === 'zh' ? '返回' : 'Back') });
back.addEventListener('click', function () { if (!goBack()) go('timeline'); });
v.appendChild(el('div', { class: 'view-head' }, [back, el('h1', { text: t('nav_branch') })]));
```
> 注意：`branch-detail` 的返回是 `go('branch')`（4576），仍有效；branch 列表的返回则回设置（来路）或 timeline。

**(b) renderSettings（5843+）** 加「分支决策」菜单项，仿"更新日志"`set-menu-link`（5849–5853），并**把待决策徽标带过来**：
```js
// 放在 about 卡片附近（更新日志 logsBtn 下方或单独成卡）
var bp = branchPendingCount();
var branchLink = el('button', { class: 'set-menu-link',
  onclick: function () { go('branch'); } }, [
  el('span', { text: t('nav_branch') }),
  el('span', { class: 'set-menu-right' }, [
    bp > 0 ? el('span', { class: 'set-menu-badge', text: bp > 9 ? '9+' : String(bp) }) : null,
    el('span', { class: 'set-menu-chevron', text: '›' })
  ])
]);
// 装进某个 settingsCard，例如把 logsBtn 那张卡扩成 [version 行, logsBtn, branchLink, 更新按钮]
```

### 2.3 别丢「待决策」信号（关键，否则收敛 = 隐藏）
原来 branch 在**底栏带数字徽标**（navButton 1210–1213：`branchPendingCount()`），是"你有 N 个决策到期"的唯一被动提醒。降级后：
- **必做**：§2.2(b) 的设置菜单项徽标（`set-menu-badge`）。
- **强烈建议**：到期分支在**时间线顶部**给一条轻提醒条（复用现成 `resurface-banner` / `backup-banner` 那种横幅样式），点击 `go('branch')`：
```js
// renderTimeline 内，backup-banner 那段附近（1372 区）：
(function () {
  var bp = branchPendingCount();
  if (bp <= 0) return;
  v.appendChild(el('button', { type: 'button', class: 'branch-due-banner',
    text: (lang === 'zh' ? '🔀 有 ' + bp + ' 个决策待回顾' : '🔀 ' + bp + ' decision' + (bp > 1 ? 's' : '') + ' to review'),
    onclick: function () { go('branch'); } }));
})();
```
> 这样信号反而比"底栏小红点"更显眼，且只在真有待决策时出现。**收敛的红线是"少打扰"，不是"藏功能/丢提醒"。**

---

## 3. Part C —— 打磨（收敛直接引出的小修）

### 3.1 2-tab 底栏的排布（CSS）
原 nav-group 装 4 个、现在 2 个，确认不会一边倒或拉伸变形：
```css
.nav-group { display: flex; gap: 4px; justify-content: center; }  /* 若原来是 space-between，2 个会拉太开 */
/* 移动端 FAB 居中逻辑（commit 那颗）保持不变；只看 timeline/review 两颗是否对称 */
```
> 真机/窄屏过一眼即可，必要时把移动端 nav-group 的两颗按钮做成等宽 `flex: 1 1 0`。

### 3.2 子页返回样式统一
diff/rollback/branch 的 view-head 现在带 `‹ 返回`，复用 detail/settings 同款 `.view-head .btn.ghost.tiny` 样式即可，无需新 CSS。检查标题与返回按钮在一行、不挤。

### 3.3 设置菜单徽标样式（新增少量 CSS）
```css
.set-menu-right { display: inline-flex; align-items: center; gap: 8px; }
.set-menu-badge { min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px;
  background: #e5484d; color: #fff; font-size: 11px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center; }
.branch-due-banner { /* 复用 backup-banner 视觉；若无现成类，照 resurface-banner 简化 */ }
```

### 3.4 验证项（不改代码，跑一遍）
- 在 diff/rollback/branch 子页时，底栏**不高亮**任何 tab（`navButton` 是 `current === route` 才 `active`，子页 current 不在 `[timeline, review]` 内，自然不亮）——这是预期，确认即可。
- `go('review')` 的所有现存调用（如回忆卡「查看全部」、通知 `route:'review'` 深链 913）现在落到 tab，无返回按钮、行为正确。
- 切语言后 `renderNav` 重渲染，review 标签文案随 `lang` 正确。

---

## 4. i18n
基本零新增——`nav_timeline`(13)、`review_open`(105/263)、`nav_diff/nav_rollback/nav_branch`(13–14) 全部已存在。返回字样沿用就地 `lang === 'zh' ? '返回' : 'Back'`（与现有 detail 一致）。如需集中：
```js
// 可选：zh / en
branch_due_banner: '有 {n} 个决策待回顾' / '{n} decisions to review',
```

---

## 5. 验收清单（逐条过）
- [ ] 底栏只剩 时间线 · 回顾 ·（＋新建）三项；图标都正常显示（review 图标不空白）。
- [ ] 点「回顾」进 Memories 页：**无返回按钮**、切回时间线是淡入动画。
- [ ] 时间线 view-head 不再有重复的「回顾」小按钮。
- [ ] 详情页「🔍 与上一版对比」「⏮️ 回滚」可用；进去后**左上有返回**、能回到详情。
- [ ] 时光历程→现实对比仍可用、可返回。
- [ ] 设置页出现「分支决策」菜单项；有待决策时显示数字徽标；点进是分支列表、可返回。
- [ ] 有到期分支时，时间线顶部出现「🔀 有 N 个决策待回顾」横幅，点击进分支列表。
- [ ] 到期通知点开仍直达 branch-detail（深链未回归）。
- [ ] `#diff` / `#rollback` / `#branch` 直接改 hash 仍能打开对应页（routes 未删）。
- [ ] 在三件套子页时底栏不误高亮；切语言文案正确。
- [ ] 桌面 `npm start` 全过；Android APK 同样过。

---

## 6. 发版（沿用既有铁律）
1. **版本号** 1.14.0 → 1.15.0：`package.json`(3)、`js/version.js`(3)、`index.html` 4 处 `?v=`（11/41/42/43/44）。
2. **`RELEASE_NOTES`**(5019) 顶部加 1.15.0（zh/en），建议条目：
   - 底部导航收敛为 **时间线 · 回顾 ·（＋新建）**：把「回顾」提升为常驻一级入口，让回看有家。
   - 现实对比 / 回滚 / 分支决策**功能全部保留**，改从更顺手的位置进入：对比/回滚在存档详情页直接发起，分支决策移入设置；到期决策改在时间线顶部以横幅提醒（更显眼）。
   - 纯导航与入口重排，**不改任何数据 / 云 / 备份 / 功能逻辑**。
3. **CHANGELOG.md** 加 1.15.0 段。
4. 回归重点：**所有降级功能的可达性**（详情→diff/rollback、设置→branch、通知深链、hash 深链、待决策提醒）。先桌面过 §5，再 push 触发 APK。

---

## 7. 范围可收缩 / 之后
- **可收缩**：§2.3 的时间线到期横幅可后置（但设置徽标 §2.2b 必做，否则信号全丢）；review 图标可先用现成某个 NAV_ICON 占位。
- **最小可发版** = Part A（底栏改 2 tab + 路由表）+ diff/rollback/branch 三个返回按钮 + 设置里 branch 入口（带徽标）。
- **之后**：收敛验证「你现在是否真的会点回顾 tab」。若回顾 tab 也冷清，说明"内联回忆卡"已足够，回顾页可进一步并入时间线——继续做减法，而不是回头加法。再往后才考虑当初搁置的**云端媒体桶**（跨设备多媒体可信同步）。
