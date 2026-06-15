# Life Archive v1.14.0 ·「内联回忆卡 + 时间线维度透镜」实现文档（独立可执行）

> 主线从「**记什么**」转向「**用起来 / 回看兑现**」。v1.13 七维收官（location/voice/video/people/mood/tags/custom_subject），输入侧齐了；**但你作为真实用户只用时间线**——因为别的功能要么只收不发（七维只写不读），要么要你专门进二级页（Memories/回顾）。
> 本版不造新柱、不开新页：把**记忆**和**七维**搬进你唯一会回来的那块屏——**时间线**。
> 本文档自带改动点、可粘贴代码、文件锚点（基于当前 **1.13.0** 真实代码）与坑，照着做即可。

> 🧭 **北极星**：让"过去记下的东西"在你下一次打开 App 时**主动还给你**（内联回忆卡），让"七维"在你本来就住着的时间线里**变成可点的透镜**（人物/心情/地点筛选）。**0 行 store 改动、0 新路由、0 新权限。**

---

## 0. 总览

### 0.1 本版做两件事
1. **内联回忆卡（Part A）**：把时间线顶部现有的 `resurface-banner`(1383) 从"点了跳走到 Memories 页"的横幅，升级成**就地展示**的回忆卡——直接显示当时的封面图 + 一句话 + 「N 年前的今天」+ 场景/地点，点卡进详情，旁边留「查看全部」去 Memories 页，可✕本次收起。**复用现成 `pickResurface`，逻辑一行不重写。**
2. **维度透镜（Part B）**：时间线已能按 **场景 / 标签 / 星标** 筛（`renderChips` 1426）。本版补上**人物 / 心情 / 地点**三维：
   - 详情页的人物 chip、心情、地点变成**可点**→ 跳回时间线并按该维筛选（**完全照搬标签现有的 1837 行 `tlTag` 跳转模式**）。
   - 时间线顶部出现一枚**可清除的「当前透镜」pill**（如 `👥张三 ✕`），让用户知道在筛什么、一键清掉。
   - 三个新筛选键接进 `renderList` 的过滤断言。

> 一句话：**A 让记忆主动找你，B 让七维在时间线里可消费。** 两件事都只动 `app.js`（+ 一点 CSS / i18n），都强化你已经在用的那个习惯。

### 0.2 ⚠️ 边界 / 不做
- ❌ **不开新路由、不进底部 tab**（`TAB_ROUTES` 1032 不动）。回忆卡和透镜都长在 `renderTimeline`(1320) 内。
- ❌ **不动 store.js / 数据结构 / Supabase / 备份**。本版纯展示层 + 筛选状态。
- ❌ **不引地图/逆地理**。地点透镜按 `location.label` 字符串聚合（无 label 的纯坐标 commit 不进地点透镜，符合离线优先）。
- ❌ 人物/地点**不**默认全量铺成 chip（可能爆行）。本版默认走「详情页点 → 时间线筛 + 顶部 pill」路径；把"全量 chip"列为 §6 可收缩选项。
- ✅ 心情/人物/地点筛选与现有 场景/标签/星标 筛选**可叠加共存**（和 tag+scene 现状一致）。

### 0.3 验收闭环（端到端）
打开 App → 时间线顶部出现「那年今日 · 2 年前」**回忆卡**（带当时封面 + 一句话），点卡直接进当年详情；卡右上 ✕ 可收起本次 → 进任意一条带人物的详情 → 点人物 chip「外婆」→ 自动回到时间线、顶部出现 `👥外婆 ✕` pill、列表只剩和外婆有关的存档 → 点 pill 的 ✕ 清除 → 同理点详情页心情😄 / 地点📍「外婆家」也能筛 → 退出重进，透镜清空、回忆卡按当天重新计算。
**这条链顺 = 本版达成。**

### 0.4 代码地图（当前 1.13.0 真实锚点）
| 位置 | 行号 | 作用 |
|---|---|---|
| `I18N.zh` / `en` 新键 | 插在 `saved_value_prefix` 前（zh **166** / en **324**） | 文案 |
| 时间线筛选状态 `tlQuery/tlScene/tlStarOnly/tlTag` | **1289–1296** | **加 `tlPerson/tlMood/tlPlace`** |
| `commitMatches` | 1307 | 搜索已含 people/location（无需改）；心情可选加 |
| `resurface-banner` 横幅 | **1383–1394** | **Part A：替换为内联回忆卡** |
| `renderChips` | **1426–1441** | **Part B：尾部追加「当前透镜」pill** |
| `renderList` 过滤断言 | **1451–1454** | **Part B：断言里加 person/mood/place** |
| `commitCard` subKids | 1627–1637 | （可选）卡上显示 📍地点 / 👥人物小标 |
| `renderDetail` 心情块 | **1820–1825** | **Part B：心情可点 → 筛** |
| `renderDetail` 人物块 | **1826–1831** | **Part B：人物 chip 可点 → 筛（`static`→`tap`）** |
| `renderDetail` 标签块（**参照样板**） | 1832–1841 | 已是「点标签→`tlTag`→go('timeline')」，照抄 |
| `renderDetail` 地点块 | **1927–1938** | **Part B：补一枚「在时间线看此地点」按钮** |
| `RELEASE_NOTES` | **5019** | 顶部加 1.14.0 |
| 版本号 `?v=` | index.html **11/41/42/43/44** + `js/version.js` **3** + `package.json` **3** | 1.13.0 → 1.14.0 |

**复用、别另造的真实助手**：`el`、`go`、`t`、`lang`、`toast`、`Store.sceneById`/`sceneName`/`sceneTag`、`commitThumbSrc`(1566 用)、`commitCoverDims`、`fmtTime`(1559)、`pickResurface`(1720)、`startOfToday`(1685)、`pendingDetail`(1770)。

### 0.5 新增的会话级状态（都是渲染期变量，不落库）
```js
// 与 tlQuery/tlScene/tlStarOnly/tlTag 并列（1289–1296 区）
var tlPerson = null;   // 人物透镜（null = 不筛）
var tlMood   = null;   // 心情透镜
var tlPlace  = null;   // 地点透镜（按 location.label 精确匹配）
var resurfaceDismissed = false;  // 本次会话是否收起了回忆卡
```
> 这些和现有 `tlTag` 一样是模块级渲染状态，刷新/重进自然清空——**不进 store、不进云、不进备份**。

---

## 1. Part A —— 内联回忆卡（替换 resurface 横幅）

### 1.1 现状
`renderTimeline`(1320) 在 1383–1394 已经调 `pickResurface(startOfToday())`，拿到 `{kind:'year'|'month'|'random', commits:[...], years?}`，但只渲染了一条**纯文字横幅**，点击 `go('review')` 跳走。我们把这段换成**就地回忆卡**。

### 1.2 替换 1383–1394 整段
把现有这段：
```js
var resurface = pickResurface(startOfToday());
if (resurface) {
  var L = lang === 'zh';
  var label = resurface.kind === 'year' ? ... ;
  v.appendChild(el('button', { type: 'button', class: 'resurface-banner',
    text: label, onclick: function () { go('review'); } }));
}
```
换成：
```js
var resurface = resurfaceDismissed ? null : pickResurface(startOfToday());
if (resurface) {
  var L = lang === 'zh';
  // 取最具代表性的一条：年度优先挑最老那条（跨度最大、最戳人）
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

  // 收起 ✕（本次会话内不再出现；下次冷启动按当天重算）
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

  // 多条时给「查看全部」去 Memories 页（保留旧入口的价值，不丢）
  if (resurface.commits.length > 1) {
    body.appendChild(el('button', { type: 'button', class: 'resurface-more btn ghost tiny',
      text: (L ? '查看全部 ' : 'See all ') + resurface.commits.length,
      onclick: function (e) { e.stopPropagation(); go('review'); } }));
  }

  var card = el('div', { class: 'resurface-card tappable' + (cover ? '' : ' no-cover') },
    cover ? [cover, body, dismiss] : [body, dismiss]);
  // 点卡主体 → 直接进这条记忆的详情（比跳 Memories 列表更近一步）
  card.addEventListener('click', function () { pendingDetail = lead.id; go('detail'); });
  v.appendChild(card);
}
```
> 关键复用：`pickResurface` / `commitThumbSrc` / `commitCoverDims` / `sceneTag` / `pendingDetail` 全是现成。**新增逻辑只有"挑 lead + 排版 + ✕收起"。**

### 1.3 坑
- **`commitThumbSrc(lead)` 可能为空**（纯文字 commit / 跨设备缺图）：已用 `no-cover` 态降级为纯文字卡，不留空洞。
- **✕ 收起只在本次会话生效**：`resurfaceDismissed` 是渲染态，重进按当天重算——这是**预期**（每天值得再遇见一次），不要持久化它。
- `e.stopPropagation()` 必须在 ✕ 和「查看全部」上，否则会冒泡触发整卡的进详情。

---

## 2. Part B —— 时间线维度透镜（人物 / 心情 / 地点）

### 2.1 状态（1289–1296 区，紧挨 `tlTag`）
见 §0.5：加 `tlPerson / tlMood / tlPlace`。

### 2.2 过滤断言（`renderList` 1451–1454）——扩 3 个条件
现有：
```js
var matched = commits.filter(function (c) {
  return (!tlStarOnly || c.starred) && (tlScene === null || c.scene === tlScene)
    && (tlTag === null || (c.tags || []).indexOf(tlTag) >= 0) && commitMatches(c, tlQuery);
});
```
改为：
```js
var matched = commits.filter(function (c) {
  return (!tlStarOnly || c.starred)
    && (tlScene === null || c.scene === tlScene)
    && (tlTag === null || (c.tags || []).indexOf(tlTag) >= 0)
    && (tlPerson === null || (c.people || []).indexOf(tlPerson) >= 0)
    && (tlMood === null || c.mood === tlMood)
    && (tlPlace === null || (c.location && c.location.label === tlPlace))
    && commitMatches(c, tlQuery);
});
```

### 2.3 「当前透镜」pill（`renderChips` 1426–1441，尾部追加）
在 `renderChips()` 末尾、`}` 之前追加：把当前生效的人物/心情/地点透镜各渲染成一枚可清除 pill（不全量铺 chip，避免爆行）：
```js
function lensPill(kind, label, onClear) {
  var b = el('button', { type: 'button', class: 'tl-chip tl-lens active' },
    [el('span', { text: label }), el('span', { class: 'tl-lens-x', text: '✕' })]);
  b.addEventListener('click', function () { onClear(); tlVisible = TL_PAGE_SIZE; renderChips(); renderList(); });
  return b;
}
if (tlPerson) chipsRow.appendChild(lensPill('person', '👥 ' + tlPerson, function () { tlPerson = null; }));
if (tlMood) {
  var moodMap = { great:'😄', good:'🙂', meh:'😐', down:'😔', bad:'😣' };
  chipsRow.appendChild(lensPill('mood', (moodMap[tlMood] || '') + ' ' + t('mood_' + tlMood), function () { tlMood = null; }));
}
if (tlPlace) chipsRow.appendChild(lensPill('place', '📍 ' + tlPlace, function () { tlPlace = null; }));
```
> pill 复用 `.tl-chip.active` 视觉，只多一个 `✕`。点 pill 即清除该透镜。

### 2.4 详情页：让三维「可点 → 跳回时间线筛选」

**(a) 心情块（1820–1825）** —— 包一层可点：
```js
if (c.mood) {
  var moodMap = { great:'😄', good:'🙂', meh:'😐', down:'😔', bad:'😣' };
  var moodBtn = el('button', { class: 'detail-mood-tap', type: 'button',
    text: (moodMap[c.mood] || '') + ' ' + t('mood_' + c.mood) });
  moodBtn.addEventListener('click', function () {
    tlMood = c.mood; tlScene = null; tlTag = null; go('timeline');
  });
  card.appendChild(el('div', { class: 'detail-sub detail-mood' }, [moodBtn]));
}
```

**(b) 人物块（1826–1831）** —— `chip-tag static` 改成可点（照搬标签 1837 模式）：
```js
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
```

**(c) 地点块（1927–1938）** —— 保留现有「🗺 外链地图」，**额外**补一枚「在时间线看此地点」（仅当有 `label`）：
```js
// ...现有 if (url) {...} else {...} 之后、该 if 块结束前追加：
if (c.location.label) {
  var placeBtn = el('button', { class: 'btn ghost tiny detail-place-filter', type: 'button',
    text: (L ? '🔎 看「' : '🔎 See "') + c.location.label + (L ? '」的全部存档' : '"') });
  placeBtn.addEventListener('click', function () { tlPlace = c.location.label; tlScene = null; tlTag = null; go('timeline'); });
  card.appendChild(placeBtn);
}
```
> 三处都按"设透镜 → 清掉会冲突的 scene/tag → `go('timeline')`"，和标签现有行为一致；用户回到时间线即看到 §2.3 的 pill + 已过滤列表。

### 2.5 （可选）卡片上显示地点/人物小标（`commitCard` subKids 1627–1637）
让七维在列表里**看得见**（不只详情里）：
```js
// subKids 现有 push 之后追加（可收缩）
if (c.location && c.location.label) {
  subKids.push(el('span', { class: 'commit-dot', text: '·' }));
  subKids.push(el('span', { class: 'commit-place', text: '📍' + c.location.label }));
}
```
> 人物同理可加 `👥 + c.people.length`；列表过密就只留地点。列为 §6 可收缩。

---

## 3. i18n（新键插在 `saved_value_prefix` 前：zh **166** / en **324**）

> 注：本版多数文案在代码里就地用三元 `L ? '中' : 'En'` 写了（与现有 resurface/detail 风格一致），i18n 只需补少量复用键。下面是**可选**集中键；嫌碎可全部内联。
```js
// zh（可选，若想集中管理）
lens_clear: '清除筛选', resurface_see_all: '查看全部', resurface_dismiss: '收起',
// en
lens_clear: 'Clear filter', resurface_see_all: 'See all', resurface_dismiss: 'Dismiss',
```
> `mood_great/good/meh/down/bad`(156/314)、`people`(155)、`location`(v1.13 已加) 等键**已存在**，直接复用。

---

## 4. CSS（`css/styles.css`，新增；本版无破坏性改动）

```css
/* ---- Part A：内联回忆卡 ---- */
.resurface-card { position: relative; display: flex; gap: 12px; align-items: stretch;
  margin: 10px 0 14px; padding: 10px; border-radius: 16px; cursor: pointer;
  background: linear-gradient(135deg, rgba(124,92,255,.14), rgba(80,160,255,.10));
  border: 1px solid rgba(124,92,255,.28); }
.resurface-card.no-cover { display: block; }
.resurface-cover-wrap { flex: 0 0 96px; width: 96px; border-radius: 12px; overflow: hidden;
  background: rgba(127,127,127,.12); align-self: center; }
.resurface-cover { width: 100%; height: auto; display: block; }
.resurface-body { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.resurface-kicker { font-size: 12px; font-weight: 700; letter-spacing: .02em; opacity: .85; }
.resurface-msg { font-size: 15px; font-weight: 600; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.resurface-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; opacity: .75; flex-wrap: wrap; }
.resurface-place { white-space: nowrap; }
.resurface-more { align-self: flex-start; margin-top: 2px; }
.resurface-x { position: absolute; top: 6px; right: 8px; border: none; background: transparent;
  color: inherit; opacity: .5; font-size: 14px; line-height: 1; cursor: pointer; padding: 4px; }
.resurface-x:hover { opacity: .9; }

/* ---- Part B：当前透镜 pill + 可点维度 ---- */
.tl-chip.tl-lens { gap: 6px; }
.tl-lens-x { opacity: .7; font-size: 11px; }
.detail-mood-tap, .chip-tag.tap { cursor: pointer; }
.detail-mood-tap { border: none; background: transparent; color: inherit; font: inherit; padding: 0; }
.detail-place-filter { margin-top: 6px; }
.commit-place { white-space: nowrap; }     /* 若用了 §2.5 */
```
> `.chip-tag.tap` 现有样式（标签用的）若已具备 hover/可点观感，人物 chip 直接继承即可。

---

## 5. 验收清单（做完逐条过）

**Part A 回忆卡**
- [ ] 有「去年今天」存档时（可用 §0.3 / 示例数据），打开 App 时间线顶部出现回忆卡：封面 + 一句话 +「N 年前的今天」+ 场景（有地点则显示 📍）。
- [ ] 点卡主体 → 进入**那条**存档详情（不是 Memories 列表）。
- [ ] 多条记忆时出现「查看全部 N」→ 点它进 Memories 页（旧入口仍在）。
- [ ] ✕ 收起后本次会话不再出现；切到别的 tab 再回时间线仍收起；**完全重启** App 后按当天重新出现。
- [ ] 纯文字 commit（无封面）走 `no-cover` 文字卡，不留空白方块。

**Part B 透镜**
- [ ] 详情页点人物 chip → 回时间线、顶部 `👥name ✕` pill、列表只剩该人物存档。
- [ ] 详情页点心情 → `😄好 ✕` pill 生效；点地点「🔎 看…」→ `📍place ✕` pill 生效。
- [ ] 点 pill 的 ✕ → 清除该透镜、列表恢复；多透镜可分别清。
- [ ] 透镜与场景/标签/星标筛选叠加正常；无匹配时落到现有 `tl-empty` 提示不报错。
- [ ] 搜索框搜人名 / 地点名仍命中（`commitMatches` 现状，未回归）。
- [ ] （若做 §2.5）卡片副行显示 📍地点，不撑破移动端宽度。

**通用**
- [ ] 桌面 `npm start` 全过；Android APK 同样过（回忆卡/透镜均为纯前端，无新权限）。
- [ ] 切语言 zh/en，回忆卡 kicker、pill、详情按钮文案都正确。

---

## 6. 发版（沿用既有铁律）

1. **版本号** 1.13.0 → 1.14.0：`package.json`(3)、`js/version.js`(3)、`index.html` 4 处 `?v=`（11/41/42/43/44）。
2. **`RELEASE_NOTES`**(5019) 顶部加 1.14.0（zh/en），日期用发版当天。建议条目：
   - 时间线顶部把「那年今日」从横幅升级为**内联回忆卡**：直接显示当时封面 + 一句话 +「N 年前的今天」，点卡进当年详情，可✕收起；多条记忆保留「查看全部」入口去回顾页。
   - 时间线新增**人物 / 心情 / 地点透镜**：详情页点人物、心情、地点即可跳回时间线按该维筛选，顶部显示可一键清除的当前筛选 pill。
   - 纯展示层与筛选状态，**不改数据结构 / 云 / 备份 / 权限**。
3. **CHANGELOG.md** 加 1.14.0 段（与 RELEASE_NOTES 对应）。
4. 先桌面过 §5，再 push 触发 APK 过移动端。

---

## 7. 范围可收缩（要更快发）
按「砍了最不疼」排序：
1. **§2.5 卡片小标**——锦上添花，最先砍。
2. **回忆卡「查看全部」/ Memories 页联动**——可先只做「点卡进详情」，多条入口押后。
3. **地点透镜（§2.2 的 place 分支 + §2.4c 按钮）**——若只想先把"人物+心情"两维透镜立住，地点可单独半版再上（它依赖 label 一致性，最值得先观察真实数据）。
4. **最小可发版** = Part A 内联回忆卡（点卡进详情 + ✕收起）+ Part B 人物透镜一条链。其余都是同模式的复制粘贴扩展。

---

## 8. 写给规划：本版之后
做完 v1.14，"回看兑现"开了个头。后续两根柱（不影响本版）：
1. **地点聚合视图**：若 §2.4c 的地点透镜被你自己用上了，下一步可把它升级成「按地点分组的浏览页 / 简易地图」——但先用透镜验证你真的会按地点回看，再决定要不要建页（避免又造一个没人去的二级页）。
2. **云端媒体桶**（v1.13 §8 已点名）：audio/video Blob 进 Supabase Storage，多媒体跨设备真同步——这是"数据可信"的最大缺口，和本版"回看"是两条线，可并行规划。

> 一句话：**v1.14 把"记忆"和"七维"搬进你唯一会回来的时间线；验证哪种回看你真的会用，再决定下一根柱建在哪。**
