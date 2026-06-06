# Life Archive v1.9.0 ·「轻松记录」实现文档（独立可执行）

> 三柱的**第②柱**：把"记录一个瞬间"的摩擦降到最低，让习惯长出来。
> 记忆类产品活不活，全看两件事——**记录够轻松（习惯）+ 回看够动人（已在 v1.8 做）**。本版主攻前者。
> 本文档自带所有改动点、可粘贴代码、文件锚点（基于当前 **1.8.0** 代码）与坑，照着做即可。
> ③时光对比放下一版（v2.0）。

---

## 0. 总览

### 0.1 本版做四件事
1. **极速记录（Quick Capture）**：一下进入"拍照→存档"，**复用现有 commit 表单**——自动开相机 + 用上次场景作默认，少点几下就存好。
2. **连续打卡 streak + 今日状态 chip**：时间线顶部显示"连续 N 天 / 今天记没记"，点一下就开始快速记录。
3. **每日记录提醒（nudge）**：可选，当天没记录时晚上轻轻提醒一次（复用 v1.7 的 `Notify`）。
4. **（Android，可选）长按图标快捷方式**："快速记录"直达。属进阶项，JS 三件已是跨端核心。

### 0.2 为什么不重建捕获/保存（关键决策）
现有 commit 表单已经很完备：相机（`nativeCamera` 1910）、AI 识别场景（`AI.analyze` 2132）、保存 + 微反馈 + 复查 CTA（`doSave` 2172）、提醒字段、云同步。**重建一套快速捕获 = 重复造轮子还容易出 bug。** 所以"极速记录"= 给表单加一个 `pendingQuick` 标志：进表单后**自动开相机**、默认**上次用过的场景**，其余 100% 复用。最低风险、最大复用。

### 0.3 验收闭环（做完用它端到端验收）
点时间线顶部"🔥 连续 N 天 · 记录今天" → 直接弹相机 → 拍 → 场景已是上次的 → 一下"存档" → 回时间线，streak +1、chip 变"今天已记录 ✓"；手机端当天没记录时，20:30 收到"记录一下今天吧"，点开直达快速记录。
**这条链顺畅 = 轻松记录柱成立。**

### 0.4 代码地图（当前 1.8.0 真实锚点）
| 位置 | 行号 | 作用 |
|---|---|---|
| `I18N.zh` / `en` / `t()` | 10–122 / 123–235 / 238 | 加文案；新键插在 `saved_value_prefix` 前（zh 121 / en 234） |
| `routes` / `TAB_ROUTES` / `ROUTE_DEPTH` | 905 / 911 / 914 | 本版**不新增路由**（复用 `commit`） |
| `handleNotifyIntent(ex)` | 957 起 | **加 `commit`（quick）分支** |
| `navButton(route,label,isCreate)` | 1072 | **给 create 键加长按 → quick** |
| `renderTimeline(v)` | 1190 左右 | view-head/回顾按钮 1204、resurface 横幅 1206–1216；**streak chip 插在这附近** |
| `commitCard` / `dayKey` | 1340 / — | `dayKey` 是日期键助手（streak 用） |
| `pendingEdit` 声明 | 1708 | **旁边加 `pendingQuick`** |
| `renderCommitForm(v)` | 1710 | 入口读 `pendingQuick`；默认场景 1726；**结尾 2267 加自动开相机** |
| `nativeCamera(source)` | 1910 | 表单内相机（quick 模式调用它） |
| `doSave(planned)` | 2172 | 保存；**实存后记 `lastScene` + 调 nudge reconcile** |
| `Notify` 适配块 / `scheduleMemoryNotifs` | 555 / 802 | 复用 `Notify.scheduleAt`，仿照写 nudge |
| `renderSettings(v)` / `settingsCard` / `segmented` | 4802 | 放 nudge 开关 |
| boot `Store.init().then` | 5230；`scheduleMemoryNotifs()` 在 5236 | **nudge reconcile 接在后面** |
| `RELEASE_NOTES` | 4138 | 发版加一条 |

**确认存在、会用到的真实助手**（别另造）：`downscaleSrc`(393)、`imageTakenAtFromNativePhoto`(513)、`autoSync`(888)、`actionSheet`(2533)、`notPlanned`(323)、`toast/toastAction`(327/335)、`sceneName`(896)、`dayKey`(1340 区)、`Store.meta()/setMeta`（store.js，存 localStorage，**不进云同步**——正合适，这是设备偏好）。已装插件：`@capacitor/camera`、`@capacitor/local-notifications`、`@capacitor/app`。

---

## 1. 极速记录（Quick Capture）

### 1.1 加 `pendingQuick` 标志
在 `var pendingEdit = null;`(1708) 旁加：
```js
var pendingQuick = false;
```

### 1.2 进表单时消费它（renderCommitForm 顶部）
在 `pendingEdit = null;`(1716) 之后加：
```js
var quick = pendingQuick; pendingQuick = false;
```

### 1.3 快速模式默认"上次用过的场景"
把默认场景那行（1726）：
```js
var selectedScene = (src && src.scene) || Store.SCENES[0].id;
```
改成：
```js
var lastScene = quick && Store.meta().lastScene;
if (lastScene && !Store.SCENES.some(function (s) { return s.id === lastScene; })) lastScene = null; // 防脏值
var selectedScene = (src && src.scene) || lastScene || Store.SCENES[0].id;
```

### 1.4 表单渲染完，快速模式自动开相机
在 `renderCommitForm` 结尾 `syncMealUI();`(2267) 之后、函数闭合 `}`(2268) 之前加：
```js
if (quick) {
  var Cap = window.Capacitor;
  var nativeCam = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform() && Cap.Plugins && Cap.Plugins.Camera);
  // 原生：直接弹相机（最少点按）；桌面/网页：聚焦一句话输入，让用户拖图/粘贴/选图
  if (nativeCam) setTimeout(function () { nativeCamera('CAMERA'); }, 300);
  else setTimeout(function () { if (msgInput) msgInput.focus(); }, 60);
}
```
`nativeCamera`、`msgInput`、`selectedScene` 都在同一闭包内，可直接调用。
**坑：** 用户在相机里按取消 → 仍停在表单（可改去相册/手填），不会卡死。延时 300ms 是等页面切换动画落定再弹相机，避免动画与原生弹窗打架。

### 1.5 保存后记住场景 + 触发 nudge 重排（doSave 内）
在 `doSave` 的**实存分支**里，`autoSync(true);`(2234) 之后加：
```js
Store.setMeta({ lastScene: ok.scene });   // 下次快速记录默认这个场景
reconcileCaptureNudge();                  // 今天记了 → 取消今天的提醒（§3）
```
> 编辑分支（2199–2208）不用动；`lastScene` 只在新建实存时更新最自然。

---

## 2. 连续打卡 streak + 今日状态 chip

### 2.1 模块级助手（粘到 `dayKey` 附近，约 1345 行；逻辑与 renderStats 4554–4558 一致）
```js
function commitDayCounts() {
  var m = {};
  Store.commits().filter(notPlanned).forEach(function (c) {
    var k = dayKey(c.createdAt); m[k] = (m[k] || 0) + 1;
  });
  return m;
}
function hasCommitToday() { return !!commitDayCounts()[dayKey(Date.now())]; }
function computeStreak() {
  var counts = commitDayCounts(), n = 0, d = new Date(); d.setHours(0, 0, 0, 0);
  if (!counts[dayKey(d.getTime())]) d.setDate(d.getDate() - 1); // 允许"昨天"续上连续
  while (counts[dayKey(d.getTime())]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
```
> 可选：把 `renderStats`(4554–4558) 里的内联 streak 改成 `var streak = computeStreak();` 去重，非必须。

### 2.2 时间线 streak chip（renderTimeline）
在 `renderTimeline` 里、**view-head 之后、resurface 横幅（`var resurface = pickResurface(...)` 1206）之前**插入：
```js
(function () {
  var streak = computeStreak(), done = hasCommitToday(), L = lang === 'zh';
  var label = done
    ? (streak > 0 ? t('streak_done').replace('{n}', streak) : t('streak_done0'))
    : (streak > 0 ? t('streak_keep').replace('{n}', streak) : t('streak_none'));
  var chip = el('button', { type: 'button', class: 'streak-chip' + (done ? ' is-done' : ''),
    text: label, onclick: function () { pendingQuick = true; go('commit'); } });
  v.appendChild(chip);
})();
```
行为：点一下 → 直接进快速记录（即便今天已记，也允许再记一笔，chip 只反映状态）。
**坑：** 这是时间线非空分支（空档案在前面已 return）才会执行，无需额外判空。

---

## 3. 每日记录提醒（capture nudge）

### 3.1 机制：开机/保存时"对账"
Web/Capacitor 没有可靠后台，沿用 v1.8 的"开机滚动预排"：每次开 App / 存档后，把**今天起 3 天**的 nudge 先全 cancel 再按需 schedule——今天若已记录就跳过今天。`id` 用日期 key，幂等。只在**用户开启**且**手机端**时才排。

### 3.2 加函数（仿照 `scheduleMemoryNotifs` 802，粘在它附近）
```js
function captureNudgeEnabled() { return Store.meta().captureNudge === true; }

function reconcileCaptureNudge() {
  var base = new Date(); base.setHours(0, 0, 0, 0);
  // 先无条件清掉未来 3 天的 nudge（对账基线，幂等）
  for (var i = 0; i < 3; i++) Notify.cancelFor('nudge:' + dayKey(base.getTime() + i * 86400000), 'nudge');
  if (!Notify.available() || !captureNudgeEnabled()) return Promise.resolve();
  var jobs = [];
  for (var j = 0; j < 3; j++) {
    var day = new Date(base.getTime() + j * 86400000);
    if (j === 0 && hasCommitToday()) continue;          // 今天已记录 → 不提醒
    var when = new Date(day); when.setHours(20, 30, 0, 0); // 当天 20:30
    if (when.getTime() <= Date.now()) continue;
    jobs.push(Notify.scheduleAt('nudge:' + dayKey(day.getTime()), 'nudge', when.getTime(),
      t('notif_nudge_title'), t('notif_nudge_body'), { kind: 'nudge', route: 'commit', quick: true }));
  }
  return Promise.all(jobs);
}
```
> 明天/后天先排上；若那天用户开了 App 或记了录，reconcile 会把它取消——若一直没开，提醒正好把人叫回来，这正是目的。

### 3.3 开机调用
boot 的 `Store.init().then` 里、`scheduleMemoryNotifs();`(5236) 之后加：
```js
reconcileCaptureNudge();
```

### 3.4 点通知 → 快速记录（handleNotifyIntent 957 起加分支）
在 `if (ex.route === 'review') {...}`(959) 旁加：
```js
if (ex.route === 'commit') { if (ex.quick) pendingQuick = true; routeOrRefresh('commit'); return; }
```
（冷启动时序由 v1.7 的 `pendingDeepLink` 覆盖，无需新增。`'nudge'` 的 kind 与 recheck/due/memory 不撞 id——`idFor` 已用 kind 加盐。）

### 3.5 设置开关（renderSettings 4802）
新建一张 settingsCard，并加入页面的设置分组（仿照 `appearance` 卡的加入方式，放进某个 `setGroup(...)` 的数组里）：
```js
var nudgeCard = settingsCard(L ? '记录提醒' : 'Capture reminder', [
  el('div', { class: 'set-row' }, [
    el('span', { class: 'set-label', text: L ? '每日记录提醒' : 'Daily nudge' }),
    segmented([['on', t('on')], ['off', t('off')]], captureNudgeEnabled() ? 'on' : 'off', function (val) {
      Store.setMeta({ captureNudge: val === 'on' });
      reconcileCaptureNudge();
      toast(val === 'on' ? t('nudge_on') : t('nudge_off'));
    })
  ]),
  el('p', { class: 'set-hint', text: t('nudge_hint') })
]);
```
**坑：** `captureNudge` 默认 `undefined`（=关）。想默认开就把 `captureNudgeEnabled` 改成 `Store.meta().captureNudge !== false`——但默认推送有被嫌烦/卸载风险，**建议默认关、由用户开**。

---

## 4. 长按 FAB 快速记录（次要入口）

`navButton`(1072) 把 `return el('button', {...}, kids);` 改成先存引用再加长按：
```js
var btn = el('button', {
  class: 'nav-btn' + (isCreate ? ' nav-btn-create' : '') + (current === route ? ' active' : ''),
  'data-route': route, 'aria-label': label, title: label,
  onclick: function () { go(route); }
}, kids);
if (isCreate) {
  var lpTimer = null;
  function fireQuick() { pendingQuick = true; go('commit'); }
  btn.addEventListener('touchstart', function () { lpTimer = setTimeout(fireQuick, 500); }, { passive: true });
  ['touchend', 'touchmove', 'touchcancel'].forEach(function (ev) {
    btn.addEventListener(ev, function () { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } });
  });
  btn.addEventListener('contextmenu', function (e) { e.preventDefault(); fireQuick(); }); // 桌面右键
}
return btn;
```
普通点击 = 完整表单；长按 = 快速记录。
**坑：** 长按已 `go('commit')` 后，touchend 触发的 click 再 `go('commit')` 会因"已在该路由"early-return（766），不会重复弹相机。

---

## 5. （Android，可选 · 进阶）长按图标快捷方式

> 这是全文**最重的、唯一碰原生**的部分，且 `android/` 每次 CI 重建 → 必须写进 `scripts/set-android-version.mjs`。**不做也不影响本版成立**（§1–4 已是跨端核心）。要做就照下面，并充分自测冷启动。

思路：静态快捷方式（长按桌面图标弹"快速记录"）用 `VIEW` intent 打开自定义 scheme `com.lifearchive.app://quick`（scheme 已在 strings.xml 设好），用 `@capacitor/app` 接收。

1. **在 `set-android-version.mjs` 注入**（仿照 CAMERA/POST_NOTIFICATIONS 注入段）：
   - `res/xml/shortcuts.xml`：一个 `<shortcut>`，`shortcutId="quick"`，`<intent android:action="android.intent.action.VIEW" android:data="com.lifearchive.app://quick" .../>`。
   - `MainActivity` 的 `<activity>` 加 `<meta-data android:name="android.app.shortcuts" android:resource="@xml/shortcuts" />`，并加一个 `<intent-filter>` 监听该 scheme。
2. **JS 接收**（boot 里）：
   ```js
   var App = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
   if (App) {
     function handleUrl(url) { if (url && url.indexOf('//quick') >= 0) { pendingQuick = true; routeOrRefresh('commit'); } }
     App.getLaunchUrl().then(function (r) { if (storeReady) handleUrl(r && r.url); else pendingDeepLink = { route: 'commit', quick: true }; }).catch(function(){});
     App.addListener('appUrlOpen', function (e) { handleUrl(e && e.url); });
   }
   ```
   `handleNotifyIntent` 已能处理 `{route:'commit', quick:true}`，冷启动用同样的 `pendingDeepLink` 暂存。
**坑：** 自定义 scheme 的 intent-filter 写错会导致点快捷方式打不开或重复开 Activity；务必真机冷启动 + 热启动都测。**拿不准就先不做这节。**

> 更强的"分享到 App"（从相册/相机分享一张图给生活存档→直接进快速记录）需要 SEND intent-filter + 读取共享图，属更大工程，留作未来 stretch，不在本版。

---

## 6. i18n 新增键

**zh：插在第 121 行 `saved_value_prefix` 之前**：
```js
quick_capture: '快速记录',
streak_none: '✨ 记录今天，开启连续打卡',
streak_keep: '🔥 连续 {n} 天 · 记录今天保持连续',
streak_done: '🔥 连续 {n} 天 · 今天已记录 ✓',
streak_done0: '✓ 今天已记录',
nudge_label: '每日记录提醒', nudge_on: '已开启每日提醒', nudge_off: '已关闭每日提醒',
nudge_hint: '当天还没记录时，晚上 20:30 轻轻提醒一次。仅手机端推送，桌面端不发。',
notif_nudge_title: '记录一下今天吧',
notif_nudge_body: '今天还没有存档 · 花 10 秒，给现在拍一张 →',
on: '开', off: '关',
```
**en：插在第 234 行 `saved_value_prefix` 之前**：
```js
quick_capture: 'Quick capture',
streak_none: '✨ Log today, start a streak',
streak_keep: '🔥 {n}-day streak · log today to keep it',
streak_done: '🔥 {n}-day streak · logged today ✓',
streak_done0: '✓ Logged today',
nudge_label: 'Daily nudge', nudge_on: 'Daily nudge on', nudge_off: 'Daily nudge off',
nudge_hint: 'A gentle 8:30pm nudge on days you haven\'t logged. Mobile push only.',
notif_nudge_title: 'Capture today',
notif_nudge_body: 'Nothing archived today — 10 seconds, snap one now →',
on: 'On', off: 'Off',
```
> `{n}` 用 `.replace('{n}', x)`（与现有 `photos_added` 一致）；缺键回退中文/键名不崩，但请成对补齐。

---

## 7. CSS（`css/styles.css` 末尾追加）

```css
.streak-chip{display:block;width:100%;margin:8px 0 4px;padding:11px 14px;border:0;border-radius:14px;
  background:linear-gradient(135deg,#ff8a4c,#ff5e7e);color:#fff;font-weight:600;text-align:left;
  cursor:pointer;box-shadow:0 4px 14px rgba(255,94,126,.22)}
.streak-chip.is-done{background:linear-gradient(135deg,#34d399,#10b981);box-shadow:0 4px 14px rgba(16,185,129,.18)}
.streak-chip:active{transform:scale(.99)}
```
nudge 开关复用现有 `.set-row/.set-label/.set-hint` + `segmented`，无需新样式。

---

## 8. 验收清单（逐条打勾）

**桌面端（`npm start`）**
- [ ] 时间线顶部显示 streak chip；今天没记 → 橙红"连续/开始"，记过 → 绿色"已记录 ✓"。
- [ ] 点 chip → 进 commit 表单（桌面自动聚焦一句话输入），存一条 → 回时间线，streak/chip 即时更新。
- [ ] 连续两天各记一条 → streak 显示 2；隔一天不记 → 断回。
- [ ] 设置里"每日记录提醒"开关存在，切换有 toast；桌面端不真正推送、不报错。

**安卓真机（装新 APK）**
- [ ] 点 streak chip / 长按底部"＋" → **直接弹相机**；拍完场景已是上次用的 → 一下"存档"成功。
- [ ] 相机里按取消 → 停在表单可改相册/手填，不卡。
- [ ] 开启"每日记录提醒" + 当天不记 → 20:30 收到"记录一下今天吧"；点通知 → 直达快速记录（热/冷启动都测）。
- [ ] 当天先记了一条 → 当天不再收到 nudge（验证 reconcile）。
- [ ] 关闭开关 → 不再有 nudge。
- [ ] （若做了§5）长按桌面图标 → "快速记录" → 冷启动直达相机。

---

## 9. 发版（照搬 `RELEASING.md` 铁律 · 缺一条算未完成）

**新版本号 `1.9.0`。铁律 1 —— 同步改 5 处：**
1. `package.json` `"version"` → `1.9.0`
2. `js/version.js` `window.APP_VERSION` → `'1.9.0'`
3. `index.html` 5 个 `?v=`（11、41–44 行，现为 `?v=1.8.0`）→ `?v=1.9.0`
4. `js/app.js` `RELEASE_NOTES`(4138) **顶部新增一条**（插在 `var RELEASE_NOTES = [` 与现有 `['1.8.0',…]` 之间）：
   `['1.9.0','2026-…','轻松记录：极速拍存 + 连续打卡 + 每日记录提醒','Effortless capture: quick snap-save, streaks, and a daily nudge',[中文逐条…],[EN bullets…]]`
5. `CHANGELOG.md` 顶部**新增一节**（中文为主：streak chip / 长按＋快速记录 / 自动开相机+记住场景 / 每日记录提醒可选；注意：提醒仅手机端，默认关）

> 三处说明一致；GitHub Release **标题纯版本号** `1.9.0`；版本号必须严格大于上一版。

**Windows：**
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
$env:GH_TOKEN = "你的_GitHub_Token"
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
npx electron-builder --win --publish always
```
**安卓：** Actions → Build Android APK → Run workflow → 下载 `LifeArchive-debug.apk` → `gh release upload v1.9.0 LifeArchive-debug.apk`。两端都发才算完，发完按铁律 4 自检。

---

## 10. 不要做 / 边界（防跑偏）

- ❌ **不重建捕获/保存**——"极速记录"就是给现有表单加 `pendingQuick`（自动开相机 + 记住场景），其余全复用。
- ❌ **不无确认直接自动存**——保持用户可控（停在表单，拍完一下存）。若你确实想要更激进的"拍完即存、toast 撤销"，可在 §1.4 把"开相机"换成"开相机→拿到照片直接 `Store.addCommit` + toast 带撤销"，但**不建议本版做**，先验证轻表单路径。
- ❌ **不为快速记录新增路由**——复用 `commit`，省一套路由/动画/返回逻辑。
- ❌ **nudge 不许变骚扰**：默认关、仅当天没记录、仅手机端、开机+保存都对账、`id` 按日期幂等。
- ❌ **不把 `lastScene/captureNudge` 同步到云**——它们是设备偏好，存 `meta`（localStorage）正合适，别塞进 commit/blob。
- ❌ **§5 Android 快捷方式拿不准就不做**——JS 三件（极速记录/streak/nudge）已是跨端核心；快捷方式是锦上添花且唯一碰原生，风险最高。
- ✅ **习惯靠"看得见 + 摩擦低"**：streak chip 让坚持可见，快速记录把成本压到几秒——两者合起来才形成回返。

---

*配套：v1.7 引擎层 `docs/ROADMAP-v1.7-engine.md`、v1.8 重温 `docs/ROADMAP-v1.8-resurface.md`。下一版 v2.0 做③时光对比（同一场景/人/物的成长时间线 + 自动 before→after 回顾片），届时同目录再开一份。*
