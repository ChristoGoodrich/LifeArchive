# Life Archive v1.12.0 ·「立体维度四件套 + 语音备注」实现文档（独立可执行）

> 下一阶段主线 = **充分记录生活**。v1.11 已把地基铺好（导入/恢复 + IndexedDB v2 `blobs` 仓 + `Store.putBlob/getBlob/deleteBlob` + `commit.media[]` 约定）。
> 本版提速，把原计划的 **v1.12（立体维度四件套：人物 / 心情 / 标签 / 自定义主体）** 和 **v1.13（语音备注）** 合并发布。
> 本文档自带所有改动点、可粘贴代码、文件锚点（基于当前 **1.11.0** 代码）与坑，照着做即可。

> 🧭 **北极星**：别的 App 加这些只是「字段」；在 Life Archive 里，每多记录一个维度 = 多一条**可对比 / 可时光历程 / 可回顾**的版本轴。人物/心情/标签是轻字段（搭现有 commit 顺风车），语音是第一个真用上 v1.11 blob 仓的媒体类型。

---

## 0. 总览

### 0.1 本版做五件事

1. **人物**：`commit.people[]`，记「和谁」。轻字段。
2. **心情**：`commit.mood`，记「当时感觉」。轻字段，天然能画情绪走势。
3. **标签**：`commit.tags[]`，跨场景自由标签（#旅行 #生日）。轻字段，接进搜索/筛选。
4. **自定义主体**：用户自建要长期盯住的场景（不止 20 个预设）。**同步集合**（跟 commits/branches 一起进云）。
5. **语音备注**：录一段音 → 存进 v1.11 的 `blobs` 仓，挂到 `commit.media[]`；详情页可回放。

> 前三件是「搭顺风车」的轻字段（`addCommit`/`updateCommit` 整对象写入，自动持久化+随云走，跟当年加 `remindAt` 一样）。**自定义主体**和**语音**是本版仅有的两块「重活」（碰 store 集合 / 碰原生权限）。

### 0.2 验收闭环（做完用它端到端验收）

新建存档 → 选一个自定义主体「阳台的花」→ 录一段 8 秒语音 → 选心情😄、加人物「妈妈」、打标签 #周末 → 存档 → 详情页能回放语音、显示人物/心情/标签 → 时间线点 #周末 chip 能筛出它 → 换台设备登录同账号，自定义主体和这条存档都同步过来。
**这条链顺畅 = 立体维度柱成立。**

### 0.3 代码地图（当前 1.11.0 真实锚点）


| 位置                                          | 行号                                                          | 作用                                                                                         |
| ------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `I18N.zh` / `en`                            | 新键插在 `saved_value_prefix` 前（zh **155** / en **302**）        | 文案                                                                                         |
| `mergeData(a,b)`                            | 934                                                         | **加 `customScenes` 并集**（自定义主体随云同步）                                                         |
| `commitMatches(c,q)`                        | 1272                                                        | **扩到 people/tags**（搜索命中）                                                                   |
| `tlScene` / chips / `renderList`            | 1255 / 1393 / 1402                                          | 标签筛选 chip 接这里                                                                              |
| `renderDetail(v)`                           | 1725                                                        | 人物/心情/标签展示 + 语音播放（items 区 1759、files 1786、notes 1818 之间插）                                  |
| `renderCommitForm(v)`                       | 1884                                                        | 表单：draft 变量 1877–1880、`moreDetails` 2341、`doSave` payload 2359、`photoTools` 2419、表单装配 2425 |
| 场景选择器                                       | 1909（按 group 过滤）/ 1933（切 group）/ 1903–1904（默认/lastScene 校验） | `**Store.SCENES` → `Store.allScenes()`** + 「自定义」入口                                         |
| `sceneTag` / `sceneIconSVG` / `SCENE_ICONS` | 1166 / 1147 / 1116                                          | 自定义主体用 emoji 占 `.scene-ic`                                                                 |
| `sceneName` / `sceneLabel`                  | 1164 / 308                                                  | 复用，customs 也走它                                                                             |
| diff/growth/rollback 场景列表                   | 3041(diff) / 2977(growth) / 3463(rollback)                  | `**Store.SCENES` → `Store.allScenes()**` 让 customs 进对比/历程                                  |
| `RELEASE_NOTES`                             | 4572                                                        | 发版加一条                                                                                      |


**store.js 锚点（当前）**：`KEY_`*/`IDB_*` 常量(约 12–18)、`persist`(96)、`init`(215)、`SCENES`(169)、`sceneById`(200)、`isMealScene`(195)、`addCommit`/`updateCommit`、`deleteCommit`(326，已回收 media blob)、`putBlob/getBlob/deleteBlob`(410–421)、`exportRaw`(424)、`replaceAll`(428)、`meta/setMeta`(376)、`uid`(95 区)。

**main.js**：`createWindow`(64) / `app.whenReady`(85)——桌面录音要加权限回调。
**scripts/set-android-version.mjs**：CAMERA(227)/POST_NOTIFICATIONS(231) 注入段——仿照加 RECORD_AUDIO。

**确认存在、会用到的真实助手**（别另造）：`el/$`、`toast`(413 区)、`labeled`(2457)/`labeledBlock`(2462)、`choiceSelect`(2469)、`segmented`、`actionSheet`、`sceneName`/`sceneLabel`/`sceneTag`/`sceneIconSVG`、`Store.putBlob/getBlob/deleteBlob`、`commit.media[]` 约定（v1.11）。

### 0.4 commit 形状（本版新增的键）

```js
// 一条 commit 新增 4 个键（都可选，缺省不破坏老数据）：
{
  // ...已有: scene, message, createdAt, photo, items, files, notes, planned, remindAt, starred...
  people: ['妈妈', '阿强'],          // 人物（轻字段，随 commit 顺风车）
  mood:   'great',                  // 心情 id：great|good|meh|down|bad（轻字段）
  tags:   ['周末', '旅行'],          // 标签（轻字段，去掉前导 #）
  media:  [                          // v1.11 已约定；本版第一次真用上（语音）
    { kind: 'audio', blobId: 'au_x9', mime: 'audio/webm', size: 81234, dur: 8.4 }
  ]
}
```

- 这 4 个键全是**纯数据**，`Store.addCommit/updateCommit` 整对象写入 IndexedDB、`exportRaw` 已 `slice()` 整条带走、`mergeData` 按 id 整条同步——**人物/心情/标签 0 行 store 改动**。
- 唯一例外是 **media 里的 Blob 本体**：不进 commit JSON，单独躺在 `blobs` 仓，按 `blobId` 取。删 commit 时 `deleteCommit`(326) 已自动回收。备份导出由 v1.11 的 `collectBackupBlobs` 自动打包成 base64（已实现，本版无需再碰）。
- **自定义主体**走另一条路（见 §2）：它不是 commit 上的字段，而是一份要跨设备复用的「场景定义表」，所以必须进同步集合。

---

## 1. 自定义主体（store.js 同步集合 + 选择器接入）

> 这是本版**最该先做**的一块——它改 store 形状、改 `mergeData`、改场景选择器，做完后人物/心情/标签/语音都只在它之上叠加 UI。

### 1.1 设计：为什么是「同步集合」而不是「commit 上的字段」

预设 20 个场景写死在 `Store.SCENES`(169)，`sceneById(id)`(200) 按 id 查、查不到落回 `'other'`。
自定义主体（如「阳台的花」「健身进度」）必须满足：

- **按 id 可解析**：`sceneById('cs_xxx')` 在任何展示点都要能拿到 emoji+名字（时间线卡、详情、diff、时光历程都靠它）。
- **跨设备**：在手机建的主体，登录同账号的桌面也要认得，否则那台机上这条 commit 显示成「📦 其他」。

→ 结论：自定义主体存成**和 commits/branches 平级的同步集合** `customScenes`。`sceneById` 既查预设也查它，所有展示点零改动。代价是 store 的 5 个管道（`cache`/`persist`/`init`/`exportRaw`/`replaceAll`）+ `mergeData` 各加一行。

> **v1.12 不做删除自定义主体**（只建+用）。删除会让引用它的 commit 落回「其他」，且要给场景上 tombstone——留到以后。先把「建得出、用得上、同步得过去」跑通。

### 1.2 store.js 改动

**(a) 常量 + cache（顶部常量区约 12–18 加一行；`cache` 在 95）**

```js
var KEY_SCENES = 'lifearchive.scenes';      // 与 KEY_COMMITS 等并列
// ...
var cache = { commits: [], branches: [], tombstones: {}, customScenes: [] };
```

**(b) `persist()`（96）——多存一格**

```js
function persist() {
  if (idb) {
    idbSet(KEY_COMMITS, cache.commits);
    idbSet(KEY_BRANCHES, cache.branches);
    idbSet(KEY_TOMBSTONES, cache.tombstones);
    idbSet(KEY_SCENES, cache.customScenes);          // ← 新增
    return true;
  }
  var a = lsWrite(KEY_COMMITS, cache.commits);
  lsWrite(KEY_BRANCHES, cache.branches);
  lsWrite(KEY_TOMBSTONES, cache.tombstones);
  lsWrite(KEY_SCENES, cache.customScenes);           // ← 新增
  return a;
}
```

**(c) `init()`（215）——两个分支都 hydrate**（缺省 `[]`，老库无此键不报错）

```js
// IDB 正常分支（把 KEY_SCENES 加进 Promise.all）：
return Promise.all([idbGet(KEY_COMMITS), idbGet(KEY_BRANCHES),
                    idbGet(KEY_TOMBSTONES), idbGet(KEY_SCENES)]).then(function (res) {
  // ...已有 commits/branches/tombstones 赋值...
  cache.customScenes = res[3] || [];                 // ← 新增（含 first-run 迁移分支也补一行）
});
// 无 IDB 的 localStorage 分支：
cache.customScenes = lsRead(KEY_SCENES, []) || [];   // ← 新增
```

**(d) `sceneById`（200）——预设查不到再查自定义**

```js
function sceneById(id) {
  for (var i = 0; i < SCENES.length; i++) {
    if (SCENES[i].id === id) return SCENES[i];
  }
  for (var j = 0; j < cache.customScenes.length; j++) {   // ← 新增：自定义主体
    if (cache.customScenes[j].id === id) return cache.customScenes[j];
  }
  return SCENES[SCENES.length - 1];                        // 仍落回 'other'
}
```

**(e) Store 上新增三个方法 + `exportRaw`/`replaceAll` 带上 customScenes**

```js
// Store 对象里（SCENES/sceneById 附近）：
allScenes: function () { return SCENES.concat(cache.customScenes); },
customScenes: function () { return cache.customScenes.slice(); },
addCustomScene: function (def) {
  var s = {
    id: 'cs_' + uid('s'),
    emoji: (def.emoji || '🏷️').slice(0, 4),
    zh: (def.zh || def.name || '自定义').slice(0, 24),
    en: (def.en || def.name || 'Custom').slice(0, 24),
    group: 'item',                       // v1.12 自定义主体一律 item 组（不掺 meal 逻辑）
    createdAt: Date.now(), updatedAt: Date.now()
  };
  cache.customScenes.push(s);
  persist();
  return s;
},

// exportRaw（424）：
exportRaw: function () {
  return { commits: cache.commits.slice(), branches: cache.branches.slice(),
           tombstones: copyMap(cache.tombstones),
           customScenes: cache.customScenes.slice() };   // ← 新增
},
// replaceAll（428）：老备份无此键时保留本机已有，避免被空数组清掉
replaceAll: function (data) {
  data = data || {};
  cache.commits = data.commits || [];
  cache.branches = data.branches || [];
  if (data.customScenes) cache.customScenes = data.customScenes;   // ← 新增
  if (data.tombstones) cache.tombstones = data.tombstones;
  applyTombstones();
  persist();
},
```

### 1.3 `mergeData`（app.js 934）——并集 customScenes

自定义主体有 `id`+`updatedAt`，直接复用现成的 `union()`（它顺带过 tombstone，scene id 不在 tombs 里 → 全保留）：

```js
return { commits: union(a.commits, b.commits),
         branches: union(a.branches, b.branches),
         customScenes: union(a.customScenes, b.customScenes),   // ← 新增
         tombstones: tombs };
```

> ✅ 这样：导入备份、云 pull/push 三条路径都会带上自定义主体（`replaceAll` 已读 `data.customScenes`）。

### 1.4 场景选择器接入（renderCommitForm，1903–1933）

把列举处从 `Store.SCENES` 换成 `Store.allScenes()`，并加「＋ 自定义」入口：

```js
// 1903 lastScene 校验：用 allScenes，自定义的 lastScene 不被清掉
if (lastScene && !Store.allScenes().some(function (s) { return s.id === lastScene; })) lastScene = null;
var selectedScene = (src && src.scene) || lastScene || Store.SCENES[0].id;   // 默认仍取首个预设，OK

// 1909 / 1933 渲染某 group 的选项：Store.SCENES → Store.allScenes()
Store.allScenes().filter(function (sc) { return sc.group === group; }).forEach(function (sc) { ... });
```

在 item 组选项末尾追加一个「＋ 自定义主体」按钮，点开走 `promptCustomScene()`（emoji + 名字），建完即选中并重渲选择器：

```js
function promptCustomScene(onPick) {
  // 复用现有 actionSheet/输入弹层；最简：两个输入（emoji、名字）
  var emoji = (window.prompt(L ? '主体图标（一个 emoji）' : 'Emoji', '🪴') || '').trim();
  var name  = (window.prompt(L ? '主体名字，如「阳台的花」' : 'Name') || '').trim();
  if (!name) return;
  var s = Store.addCustomScene({ emoji: emoji || '🏷️', zh: name, en: name });
  autoSync(false);                  // 让新主体尽快上云
  onPick(s.id);
}
```

> 若想避免 `window.prompt`（Android WebView 上样式简陋），可后续换成 `moreDetails` 同款的内联输入行；本版先用 prompt 把闭环跑通，列入「可收缩」项。

### 1.5 自定义主体的图标（emoji 占位 `.scene-ic`）

预设场景的 `.scene-ic` 用 `SCENE_ICONS`(1116) 里的内联 SVG；自定义主体没有 SVG，用它的 emoji。加一个小助手并替换 4 处展示点：

```js
// 放在 sceneIconSVG(1147) 附近：
function sceneIcEl(scene) {
  var span = el('span', { class: 'scene-ic' });
  if (scene && SCENE_ICONS[scene.id]) span.innerHTML = SCENE_ICONS[scene.id];   // 预设：SVG
  else span.textContent = (scene && scene.emoji) || '🏷️';                       // 自定义：emoji
  return span;
}
```

替换点（把手搓 `el('span',{class:'scene-ic'})+innerHTML=sceneIconSVG(...)` 换成 `sceneIcEl(scene)`）：

- `sceneTag`(1166)：时间线卡 / rollback 用
- 选择器选项(1910)
- 时间线 chip(1373)（注意它只有 id：先 `Store.sceneById(id)` 拿 scene 再传）
- 日面板(5106–5107)

> 顺带：diff/growth/rollback 的场景下拉（3041 / 2977 / 3463）把 `Store.SCENES.filter(...)` 换成 `Store.allScenes().filter(...)`，自定义主体攒够 2 条就能进对比/时光历程。AI 识图 prompt（约 635）保持只列预设——AI 不猜自定义主体。

---

## 2. 人物 / 心情 / 标签（轻字段三连）

> 三件套全是 commit 上的纯字段，**不碰 store.js**。改三处：表单收集（`moreDetails`）、`doSave` payload、详情展示；再把 people/tags 接进搜索，tags 加一排筛选 chip。

### 2.1 表单：在 `moreDetails`（2341）里加三块输入

当前 `moreDetails`（2341–2345）= 物品 + 文件 + 备注。新增心情/人物/标签三行。先在 `renderCommitForm` 顶部 draft 区（1877–1880 附近）加状态，编辑态从 `src` 回填：

```js
// draft 区（draftFiles 旁）：
var draftMood = (src && src.mood) || '';
var draftPeople = (src && src.people) ? src.people.slice() : [];
var draftTags = (src && src.tags) ? src.tags.slice() : [];
```

**心情**——一排 emoji 单选（命中即高亮，再点取消）：

```js
var MOODS = [
  { id: 'great', emoji: '😄' }, { id: 'good', emoji: '🙂' },
  { id: 'meh', emoji: '😐' }, { id: 'down', emoji: '😔' }, { id: 'bad', emoji: '😣' }
];
var moodRow = el('div', { class: 'mood-row' });
MOODS.forEach(function (m) {
  var b = el('button', { type: 'button', class: 'mood-chip' + (draftMood === m.id ? ' on' : ''),
    text: m.emoji, title: t('mood_' + m.id) });
  b.addEventListener('click', function () {
    draftMood = (draftMood === m.id) ? '' : m.id;          // 再点一下=取消
    moodRow.querySelectorAll('.mood-chip').forEach(function (x) { x.classList.remove('on'); });
    if (draftMood) b.classList.add('on');
  });
  moodRow.appendChild(b);
});
```

**人物 / 标签**——同一套「输入即成 chip」组件（回车/逗号成块，× 删）。写一个工厂复用：

```js
function chipsInput(seed, placeholder) {
  var list = seed.slice();
  var wrap = el('div', { class: 'chips-input' });
  var input = el('input', { class: 'chips-text', type: 'text', placeholder: placeholder });
  function render() {
    wrap.querySelectorAll('.chip-tag').forEach(function (n) { n.remove(); });
    list.forEach(function (val, i) {
      var x = el('button', { type: 'button', class: 'chip-x', text: '×' });
      x.addEventListener('click', function () { list.splice(i, 1); render(); });
      wrap.insertBefore(el('span', { class: 'chip-tag' }, [el('span', { text: val }), x]), input);
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
```

把三块塞进 `moreDetails`（2341，备注前后皆可）：

```js
var moreDetails = el('details', { class: 'more-details' }, [
  moreSummary, itemsLabel,
  labeledBlock(lang === 'zh' ? '文件' : 'Files', filesBlock),
  labeledBlock('😊 ' + t('mood'), moodRow),
  labeledBlock('👥 ' + t('people'), peopleInput.el),
  labeledBlock('🏷️ ' + t('tags'), tagsInput.el),
  labeled(t('notes'), notesInput)
]);
// 编辑态若已有这三者，默认展开
if ((src && src.items && src.items.length) || (src && src.files && src.files.length) ||
    (src && (src.mood || (src.people||[]).length || (src.tags||[]).length))) moreDetails.open = true;
```

### 2.2 `doSave` payload（2359）——加三个键

```js
var payload = {
  scene: selectedScene,
  // ...已有字段...
  notes: notesInput.value.trim(),
  mood: draftMood || null,
  people: peopleInput.get(),
  tags: tagsInput.get(),
  // media 见 §3（语音）
  planned: !!planned, remindDays: remindDays, remindAt: remindAt,
  remindFired: ...
};
```

> 编辑保存走 `updateCommit`、新建走 `addCommit`，两条都整对象写入，**无需再动 store**。

### 2.3 详情页展示（renderDetail，1725）

在 items 区（1759）和 files 区（1786）之间插入「心情 + 人物 + 标签」一组：

```js
if (c.mood) {
  var moodMap = { great:'😄', good:'🙂', meh:'😐', down:'😔', bad:'😣' };
  card.appendChild(el('div', { class: 'detail-sub detail-mood' }, [
    el('span', { text: (moodMap[c.mood] || '') + ' ' + t('mood_' + c.mood) })
  ]));
}
if (c.people && c.people.length) {
  card.appendChild(el('div', { class: 'detail-section-title', text: '👥 ' + t('people') }));
  var pw = el('div', { class: 'chip-row' });
  c.people.forEach(function (p) { pw.appendChild(el('span', { class: 'chip-tag static', text: p })); });
  card.appendChild(pw);
}
if (c.tags && c.tags.length) {
  card.appendChild(el('div', { class: 'detail-section-title', text: '🏷️ ' + t('tags') }));
  var tw = el('div', { class: 'chip-row' });
  c.tags.forEach(function (tg) {
    var b = el('button', { class: 'chip-tag tap', text: '#' + tg });
    b.addEventListener('click', function () { tlTag = tg; tlScene = null; go('timeline'); });  // 点标签→回时间线筛
    tw.appendChild(b);
  });
  card.appendChild(tw);
}
```

### 2.4 搜索：`commitMatches`（1272）扩到 people/tags

```js
function commitMatches(c, q) {
  if (!q) return true;
  q = q.toLowerCase();
  var sc = Store.sceneById(c.scene);
  var hay = [c.message || '', c.notes || '', sc.zh, sc.en]
    .concat((c.items || []).map(function (it) { return it.name; }))
    .concat(c.people || [])                                  // ← 新增
    .concat((c.tags || []).map(function (t) { return '#' + t; }))  // ← 新增
    .join(' ').toLowerCase();
  return hay.indexOf(q) >= 0;
}
```

### 2.5 标签筛选 chip（时间线，1393/1402）

加一个会话级筛选变量 `tlTag`（仿 `tlScene` 1256），在 `renderList`（1402）过滤里 AND 进去，并在 chips 行（1393 附近）渲一排出现过的标签：

```js
var tlTag = null;   // 顶部，仿 tlScene

// renderList 过滤（1405）：
return (!tlStarOnly || c.starred)
  && (tlScene === null || c.scene === tlScene)
  && (tlTag === null || (c.tags || []).indexOf(tlTag) >= 0)   // ← 新增
  && commitMatches(c, tlQuery);

// chips 行：收集所有出现过的 tag，渲成可点 chip（点中再点取消）
var tagSet = {};
Store.commits().forEach(function (c) { (c.tags || []).forEach(function (tg) { tagSet[tg] = 1; }); });
Object.keys(tagSet).sort().forEach(function (tg) {
  var on = tlTag === tg;
  var b = el('button', { class: 'chip tag-chip' + (on ? ' on' : ''), text: '#' + tg });
  b.addEventListener('click', function () { tlTag = on ? null : tg; tlVisible = TL_PAGE_SIZE; renderChips(); renderList(); });
  tagChipsRow.appendChild(b);
});
```

> 心情/人物**本版不单独做筛选 chip**（搜索框已能搜人物；情绪走势是 §4 的可选拓展），保持 UI 不过载。

---

## 3. 语音备注（第一个真用 v1.11 `blobs` 仓的媒体）

> 录音 = `MediaRecorder`（三端都是 Chromium：Android WebView / Electron / 浏览器，统一用 `audio/webm;codecs=opus`）。
> 录完的 Blob **不进 commit JSON**，存进 `blobs` 仓（`Store.putBlob`），commit 上只挂一条 `media` 引用。删 commit 时 `deleteCommit`(326) 已自动回收。

### 3.1 录音模块（放在 renderCommitForm 内，紧邻 `nativeCamera` 2088）

草稿态用 `draftAudio` 承载，**Blob 先留内存**，存档时才落仓（取消编辑不留垃圾）：

```js
// draft 区（draftFiles 旁）：
var draftAudio = null;   // 新录: {_blob, mime, size, dur} ；编辑沿用: {blobId, mime, size, dur}
(function seedAudio() {
  var m = src && (src.media || []).filter(function (x) { return x.kind === 'audio'; })[0];
  if (m) draftAudio = { blobId: m.blobId, mime: m.mime, size: m.size, dur: m.dur };
})();

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
```

### 3.2 录音 UI（放进 `photoTools`(2419) 同排，或单独一行 labeled 块）

一颗按钮在「未录 / 录音中 / 已录」三态切换，已录显示时长 + 试听 + 删除：

```js
var audioBox = el('div', { class: 'voice-box' });
function fmtDur(s) { s = Math.max(0, Math.round(s)); return Math.floor(s/60) + ':' + ('0'+(s%60)).slice(-2); }
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
    // 新录用内存 Blob；编辑沿用的从仓里取
    if (draftAudio._blob) au.src = URL.createObjectURL(draftAudio._blob);
    else if (draftAudio.blobId) Store.getBlob(draftAudio.blobId).then(function (b) { if (b) au.src = URL.createObjectURL(b); });
    var del = el('button', { class: 'btn ghost tiny', type: 'button', text: '🗑 ' + t('voice_delete') });
    del.addEventListener('click', function () {
      if (draftAudio && draftAudio.blobId && !draftAudio._blob) audioDeletedBlobId = draftAudio.blobId; // 存档时回收
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
var audioDeletedBlobId = null;
var recorder = makeRecorder(renderAudio);
renderAudio('idle');
// 装进表单：labeledBlock('🎙 ' + t('voice'), audioBox) —— 放在 photo 块或 moreDetails 里皆可
```

### 3.3 存档时落仓（doSave，2359 区）——把同步体改成「先落 media 再写 commit」

`putBlob` 返回 Promise，所以把 `doSave` 现有主体包进 `persistDraftMedia().then(...)`：

```js
function persistDraftMedia(prevMedia) {
  // 起点：保留 commit 上的非音频 media（本版只有音频，但别误删未来的）
  var media = (prevMedia || []).filter(function (m) { return m.kind !== 'audio'; });
  // 删了旧音频
  var dels = [];
  if (audioDeletedBlobId) dels.push(Store.deleteBlob(audioDeletedBlobId));
  // 没有新音频：保留沿用的旧音频引用（若未删）
  if (draftAudio && !draftAudio._blob && draftAudio.blobId) {
    media.push({ kind: 'audio', blobId: draftAudio.blobId, mime: draftAudio.mime, size: draftAudio.size, dur: draftAudio.dur });
    return Promise.all(dels).then(function () { return media; });
  }
  // 有新录音：落仓
  if (draftAudio && draftAudio._blob) {
    var blobId = 'au_' + Store.uid('a');
    return Promise.all(dels)
      .then(function () { return Store.putBlob(blobId, draftAudio._blob); })
      .then(function (ok) {
        if (ok) media.push({ kind: 'audio', blobId: blobId, mime: draftAudio.mime, size: draftAudio.size, dur: draftAudio.dur });
        else toast('⚠ ' + t('voice_save_fail'));
        return media;
      });
  }
  return Promise.all(dels).then(function () { return media; });
}

function doSave(planned) {
  // ...原样收集 items / createdAt / remind...
  persistDraftMedia(editing ? editing.media : null).then(function (media) {
    var payload = {
      scene: selectedScene,
      /* ...已有字段 + §2 的 mood/people/tags... */
      media: media
    };
    // —— 下面整段沿用原来的 editing/新建分支、toast、autoSync、go('timeline') ——
  });
}
```

> 顺序保证：先 `putBlob` 成功才把引用写进 `media`，避免「commit 指向空仓」。删 commit 时 `deleteCommit`(326) 会按 `media[].blobId` 回收，无孤儿。

### 3.4 详情页回放（renderDetail，1725）

在 notes 区（1818）前插一段音频播放器，用 `getBlob` + `createObjectURL`，并在离开时 revoke：

```js
var audioM = (c.media || []).filter(function (m) { return m.kind === 'audio'; })[0];
if (audioM) {
  card.appendChild(el('div', { class: 'detail-section-title', text: '🎙 ' + t('voice') }));
  var player = el('audio', { controls: 'controls', class: 'detail-audio', preload: 'none' });
  card.appendChild(el('div', { class: 'detail-voice' }, [player,
    el('span', { class: 'file-size', text: fmtDur(audioM.dur || 0) + ' · ' + fmtBytes(audioM.size || 0) })]));
  Store.getBlob(audioM.blobId).then(function (b) {
    if (!b) { player.replaceWith(el('div', { class: 'commit-notes', text: t('voice_missing') })); return; }
    var url = URL.createObjectURL(b);
    player.src = url;
    player.addEventListener('emptied', function () { URL.revokeObjectURL(url); }); // 简易回收
  });
}
// fmtDur 若 renderDetail 作用域没有，复制 §3.2 的小函数到 app.js 顶层工具区共用。
```

> 时间线卡上**不放播放器**（只在详情播），避免列表里一堆 `<audio>` 拖慢滚动；可选：卡上加一个 `🎙` 小角标表示「这条有语音」。

### 3.5 录音权限（两端各一处，CI 注入）

**(a) Android —— `scripts/set-android-version.mjs`** 仿 CAMERA(227)/POST_NOTIFICATIONS(231) 加 RECORD_AUDIO：

```js
if (!m.includes('android.permission.RECORD_AUDIO')) {
  m = m.replace('</manifest>', '    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n</manifest>');
  console.log('AndroidManifest -> added RECORD_AUDIO permission');
}
```

> Capacitor 8 的 WebChromeClient 会把 WebView 里 `getUserMedia` 的权限请求映射到已声明的运行时权限并弹系统框。**坑**：若手机上从不弹麦克风授权，多半是该权限没注入成功——核对 CI 跑了 `set-android-version.mjs` 且 manifest 含 RECORD_AUDIO。

**(b) 桌面 Electron —— `main.js`** 默认不放行 `media` 权限，`whenReady`(85) 里加回调：

```js
const { app, BrowserWindow, Menu, dialog, nativeTheme, ipcMain, desktopCapturer, screen, session } = require('electron');
// app.whenReady().then(...) 内、createWindow() 之前：
session.defaultSession.setPermissionRequestHandler(function (wc, permission, cb) {
  cb(permission === 'media' || permission === 'audioCapture'); // 放行麦克风；其余拒绝
});
```

> Windows 还需系统「设置 → 隐私 → 麦克风」允许桌面应用访问；首次录音弹的是系统级框，非应用内。

---

## 4. 把维度接成「版本轴」（可选拓展，时间够再做）

> 这些不是发版门槛，但能体现「维度 = 可对比的版本轴」这一独特点。任意一条都能砍。

- **情绪走势**：仿 `sceneTrend`(2749)，把某场景近 N 条 commit 的 `mood`（great=2…bad=-2）画成折线/色带。入口放 growth 页或详情页「这个主体最近心情」。
- **人物聚合**：详情页人物 chip 可点 → 时间线按「含此人物」筛（仿 §2.5 的 `tlTag`，加 `tlPerson`）。
- **标签时光历程**：`renderDiff`/growth 的场景下拉旁加「按标签」模式，把同 tag 的 commit 串成一条时间线。
- **语音角标**：时间线卡含 `media[kind=audio]` 时显示 `🎙`，让「有声音的回忆」一眼可见。

---

## 5. i18n（新键插在 `saved_value_prefix` 前：zh **155** / en **302**）

```js
// zh
mood: '心情', people: '人物', tags: '标签',
mood_great: '很棒', mood_good: '不错', mood_meh: '一般', mood_down: '低落', mood_bad: '糟糕',
people_ph: '和谁？回车添加', tags_ph: '#标签，回车添加',
voice: '语音', voice_record: '录语音', voice_stop: '停止', voice_delete: '删除', voice_missing: '语音文件丢失',
voice_unsupported: '此设备不支持录音', voice_denied: '麦克风权限被拒', voice_save_fail: '语音保存失败',
custom_scene_add: '＋ 自定义主体', custom_scene_emoji: '主体图标（一个 emoji）', custom_scene_name: '主体名字',

// en
mood: 'Mood', people: 'People', tags: 'Tags',
mood_great: 'Great', mood_good: 'Good', mood_meh: 'Meh', mood_down: 'Down', mood_bad: 'Bad',
people_ph: 'Who with? Enter to add', tags_ph: '#tag, Enter to add',
voice: 'Voice', voice_record: 'Record', voice_stop: 'Stop', voice_delete: 'Delete', voice_missing: 'Voice file missing',
voice_unsupported: 'Recording not supported here', voice_denied: 'Microphone permission denied', voice_save_fail: 'Voice save failed',
custom_scene_add: '＋ Custom subject', custom_scene_emoji: 'Icon (one emoji)', custom_scene_name: 'Subject name',
```

---

## 6. CSS（`css/styles.css`，新增；本版无破坏性改动）

```css
/* 心情一排 */
.mood-row { display: flex; gap: 8px; }
.mood-chip { font-size: 22px; line-height: 1; padding: 6px 8px; border-radius: 12px;
  background: var(--card-2, rgba(127,127,127,.08)); border: 1px solid transparent; }
.mood-chip.on { border-color: var(--accent, #4f8bff); background: rgba(79,139,255,.14); }

/* 人物 / 标签 输入块 + chip */
.chips-input { display: flex; flex-wrap: wrap; gap: 6px; align-items: center;
  padding: 6px; border-radius: 12px; background: var(--card-2, rgba(127,127,127,.08)); }
.chips-text { flex: 1; min-width: 90px; border: 0; background: transparent; outline: none; color: inherit; font-size: 14px; }
.chip-tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px;
  background: rgba(79,139,255,.14); font-size: 13px; }
.chip-tag.static { background: rgba(127,127,127,.14); }
.chip-tag.tap { cursor: pointer; }
.chip-x { border: 0; background: transparent; cursor: pointer; font-size: 14px; opacity: .6; }
.chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 2px; }
.tag-chip.on { background: var(--accent, #4f8bff); color: #fff; }

/* 语音 */
.voice-box { display: flex; flex-direction: column; gap: 6px; }
.voice-done { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.voice-player, .detail-audio { max-width: 100%; }
.rec-stop { animation: recPulse 1.1s ease-in-out infinite; }
@keyframes recPulse { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
.detail-voice { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
```

---

## 7. 验收清单（做完逐条过）

**桌面 / 浏览器**

- [ ] 新建存档：选自定义主体「阳台的花」→ 录 8 秒语音 → 心情😄 + 人物「妈妈」+ 标签 #周末 → 保存。
- [ ] 详情页：语音可回放，心情/人物/标签都显示，标签可点回时间线。
- [ ] 时间线：#周末 chip 能筛出它；搜「妈妈」能命中。
- [ ] 编辑这条：语音保留、可删除/重录；心情/人物/标签可改并保存。
- [ ] 删除这条：`blobs` 仓里对应音频被回收（DevTools → Application → IndexedDB 看不到残留）。
- [ ] 导出备份 JSON：包含 `customScenes`，且语音 Blob 以 base64 进 `data.blobs`（v1.11 路径）。导入到空库能完整恢复（含语音可放）。
- [ ] Electron 首次录音弹系统麦克风框；拒绝后给 `voice_denied` toast，不崩。

**Android（APK）**

- [ ] 首次录音弹系统麦克风授权；授权后能录、能回放。
- [ ] 自定义主体在手机建好后，登录同账号的另一台设备能同步看到，且引用它的 commit 不显示成「📦 其他」。
- [ ] 录音 + 拍照可共存于同一条 commit。

---

## 8. 发版（沿用既有铁律）

1. **版本号**：`package.json`、`js/version.js`(`window.APP_VERSION`)、`index.html` 5 处 `?v=` 全部 **1.11.0 → 1.12.0**（CSS 1 处 + version/store/diff/app 4 处）。
2. **RELEASE_NOTES**(4572) 顶部加一条 1.12.0（zh/en）：立体维度四件套 + 语音备注。
3. **CHANGELOG.md** 加 1.12.0 段。
4. **Android 权限**：确认 CI 的 `set-android-version.mjs` 注入了 RECORD_AUDIO（§3.5a），否则 APK 录音无声/无框。
5. **桌面权限**：`main.js` 的 `setPermissionRequestHandler`（§3.5b）已加。
6. 先 `npm start` 桌面过一遍 §7 桌面清单，再 push 触发 APK 构建过 Android 清单。

---

## 9. 不要做 / 边界

- ❌ 不动 Supabase 表结构（仍单行 `jsonb`）。语音 Blob 走 v1.11 既定的「备份 base64」路径上云/落盘；**云端大媒体桶留到后续版本**（v1.11 文档已写设计）。
- ❌ 不做视频（下一柱）。不做自定义主体的**删除/改名**（只建+用，避免 tombstone 复杂度）。
- ❌ 不在时间线列表里塞 `<audio>` 播放器（只详情播），不给人物/心情单独做筛选 chip。
- ❌ 不引第三方录音/上传库；`MediaRecorder` + 现有 `Store.putBlob` 足够。
- ❌ 不改 `mergeData` 的冲突语义（仍「updatedAt 大者胜」），只多并一个 `customScenes`。



> 一句话：**人物/心情/标签是顺风车（先落、最稳），自定义主体和语音是两块硬骨头（store 集合 / 原生权限）。把 §1 和 §3 啃下来，这一版的「独特性」就立住了。**

