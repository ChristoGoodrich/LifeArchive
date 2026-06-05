# Life Archive v1.7 ·「引擎层」实现文档（独立可执行）

> 目标：让产品从「被动档案馆」变成「会主动叫你回来、首存就有价值、价值能带走」的工具。
> 本版**不加新场景、不换后端**，只做三件打通闭环的事。
> 本文档自带所有改动点、代码骨架、文件锚点与坑，照着做即可，不需要额外解释。

---

## 0. 总览

### 0.1 三大工作流（建议按此顺序做）
1. **回返循环 = 本地通知**（核心 0→1）：新建存档时可设「N 天后提醒我复查」，到点推送 → 点通知直接进现实对比、把这条存档预选为 base。
2. **可分享凭证**：对比卡片盖时间戳水印；单条存档也能导出；接原生分享。
3. **首存即有值 + 引导**：保存后给「本场景第 N 次 · 距上次 X 天 · M 件物品」微反馈 + 一键设复查提醒；空状态改 3 步引导。

### 0.2 验收闭环（做完用它端到端验收，测试时用 1 分钟代替 N 天）
新建存档 → 设「1 分钟后复查」→ 收到通知 → 点通知进 diff（base 已是这条）→ 跑对比 → 导出带时间戳凭证 → 分享。
**这条链能顺畅跑通 = 引擎层成立。**

### 0.3 代码地图（只有这几个源文件，全部在仓库根）
| 文件 | 职责 | 本版要动的关键锚点 |
|---|---|---|
| `js/store.js` | 本地仓库层（IndexedDB + 内存缓存 + 云同步原始数据） | `addCommit`(231)、`updateCommit`(248)、`exportRaw`(376)、`replaceAll`(380) |
| `js/app.js` | UI / 路由 / i18n / 各页面渲染 / 适配器（AI、Cloud） | 见下表 |
| `js/diff.js` | 像素对比引擎 | 本版基本不动 |
| `css/styles.css` | 样式 | 加少量提醒/引导/水印按钮样式 |
| `capacitor.config.ts` | 原生插件配置 | 可选加 LocalNotifications 配置 |
| `scripts/set-android-version.mjs` | CI 里给安卓工程打补丁 | **加 POST_NOTIFICATIONS 权限**（仿照 CAMERA） |

**js/app.js 关键锚点（动手前先打开看一眼）：**
- `I18N`：`zh` = 行 10–94，`en` = 行 95–182，`t(key)` = 行 183。**新增文案都加到这两个字典。**
- 适配器范式：`apiPost`(348)、`AI`(365)、`Cloud`(450) —— **新增的 `Notify` 适配块照抄它们的写法**（对象字面量、native 守卫、Promise）。
- `pendingDiff`(2060)，在 `renderDiff` 里被消费（2068–2099）：形状 `{ sceneId, commitId, baseId }`，会自动预选「场景 / base / compare」。通知深链就复用它。
- 新建/编辑表单 `renderCommitForm`(1222)，保存逻辑 `doSave`(1638)，payload 在 1644–1657。
- 空状态：`renderTimeline`(807) 里 809–822 的 `.empty` 块。
- 对比卡片导出：`exportCard`(2231) → `buildDiffCardCanvas`(2001) → `showImageModal`。
- 应用内更新日志数据：`RELEASE_NOTES`(3456)，形状见 §8。
- boot：`DOMContentLoaded`(4501) → `initNative`(4223)/`initKeyboard`/`initBackButton` → `Store.init().then(render…)`(4518)。

### 0.4 适配器范式（务必遵守）
所有原生能力都要像 `AI`/`Cloud` 那样封进一个对象，**桌面端（Electron）没有 Capacitor 插件，每个方法必须用 `window.Capacitor.isNativePlatform()` 守卫并安全降级**，调用方不分平台。**这是最容易忘、忘了桌面端必崩的点。**

---

## 1. 公共前置：给存档加「提醒」字段（三个工作流都依赖，先做）

不需要改 store 的方法签名，也不需要改云同步逻辑或 Supabase 表结构。原因：

- `addCommit`/`updateCommit` 是**整对象写入**（`for k in patch` 拷贝所有字段，见 store.js 248–256），所以给 payload 多加字段会**自动持久化**。
- 云同步是**整 blob 上传 + 按 id 合并、取 `updatedAt` 新者**（`exportRaw`/`replaceAll` + app.js 的 `mergeData`），commit 对象里多出的字段会**自动随云走**，无需改表、无需改合并代码。

**新增 commit 字段（约定）：**
| 字段 | 类型 | 含义 |
|---|---|---|
| `remindAt` | number(epoch ms) \| null | 复查提醒的触发时间；null=不提醒 |
| `remindDays` | number \| null | 用户选的「N 天后」（仅用于 UI 回显，可不存） |
| `remindFired` | bool | 是否已触发过（避免开机重排时重复排程） |

**坑：**
- `updateCommit` 每次都会刷新 `updatedAt`（252 行）。把 `remindFired` 置 true 时会顺带 bump `updatedAt` —— 无害，但要知道它会让这条在云同步里「变新」。
- **`planned`（预存档/计划）的存档不进真实链**（`parentId=null`，store.js 240），**不要给它们设复查提醒**（没有可对比的上一版）。设提醒前判断 `!commit.planned`。
- 删除走 tombstone（store.js 294–298），删存档时**要一并 `Notify.cancelFor(id)`** 取消它的待触发通知（否则通知到点还在，点进去存档已不存在）。

---

## 2. 工作流 1：本地通知 / 回返循环（核心，先做）

### 2.1 安装插件
```bash
npm i @capacitor/local-notifications@^8
```
（版本跟随现有 `@capacitor/*` 的 ^8。装完 `package.json` 会多一行依赖；CI 安卓构建会自动 `cap sync`。桌面 Electron 不用这个插件。）

### 2.2 新增 `Notify` 适配块（粘到 app.js，紧挨 `Cloud` 之后，约 530 行附近）

```js
/* ---------------- Local notifications (return loop) ----------------
   Pluggable like AI / Cloud. NATIVE ONLY: on desktop/web every method is a
   safe no-op so callers never branch on platform. */
var Notify = {
  _p: function () {
    var Cap = window.Capacitor;
    if (Cap && Cap.isNativePlatform && Cap.isNativePlatform() &&
        Cap.Plugins && Cap.Plugins.LocalNotifications) return Cap.Plugins.LocalNotifications;
    return null;
  },
  available: function () { return !!this._p(); },
  // commit/branch ids are STRINGS; LocalNotifications needs a 32-bit int id.
  // Stable string->positive-int hash: same key always maps to the same id (so
  // cancel/reschedule are idempotent). `kind` salts it so a commit's recheck
  // and (future) other reminders don't collide.
  idFor: function (key, kind) {
    var s = (kind || '') + '|' + String(key || '');
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return Math.abs(h) % 2000000000 + 1; // 1..~2e9, never 0
  },
  ensurePermission: function () {
    var p = this._p();
    if (!p) return Promise.resolve(false);
    return p.checkPermissions().then(function (r) {
      if (r && r.display === 'granted') return true;
      return p.requestPermissions().then(function (q) { return q && q.display === 'granted'; });
    }).catch(function () { return false; });
  },
  scheduleAt: function (key, kind, whenMs, title, body, extra) {
    var p = this._p();
    if (!p || !whenMs || whenMs <= Date.now()) return Promise.resolve(false);
    var id = this.idFor(key, kind);
    return this.ensurePermission().then(function (ok) {
      if (!ok) return false;
      return p.schedule({ notifications: [{
        id: id, title: title, body: body,
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
  // Re-register every future reminder from the store on boot. Idempotent because
  // scheduleAt uses a deterministic id (re-scheduling the same id just replaces it).
  syncAll: function () {
    var p = this._p();
    if (!p) return Promise.resolve();
    var self = this, now = Date.now(), jobs = [];
    Store.commits().forEach(function (c) {
      if (c.remindAt && !c.remindFired && !c.planned && c.remindAt > now) {
        jobs.push(self.scheduleAt(c.id, 'recheck', c.remindAt,
          t('notif_recheck_title'),
          Store.sceneById(c.scene).zh + ' · ' + (c.message || ''),
          { kind: 'recheck', route: 'diff', sceneId: c.scene, commitId: c.id }));
      }
    });
    return Promise.all(jobs);
  },
  // Register the tap handler. `onIntent(extra)` gets the notification's `extra`.
  initClickRouting: function (onIntent) {
    var p = this._p();
    if (!p) return;
    p.addListener('localNotificationActionPerformed', function (ev) {
      var ex = ev && ev.notification && ev.notification.extra;
      if (ex) onIntent(ex);
    });
  }
};
```

**坑（逐条）：**
- **通知 id 必须是整数**（Java int）。commit id 是字符串 → 上面 `idFor` 做稳定哈希。不要直接把字符串 id 传进去。
- **Android 13+（API 33+）需要 POST_NOTIFICATIONS 运行时权限**。`requestPermissions()` 会弹窗，但**前提是 manifest 里声明了该权限** → 见 §6 改 `set-android-version.mjs`。不声明则永远拿不到权限、静默失败。
- **不要用精确闹钟（exact alarm）**。复查提醒对「差几分钟」不敏感，用默认（inexact）即可，省去 Android 12+ 的 `SCHEDULE_EXACT_ALARM` 特殊申请。`allowWhileIdle:true` 足够。
- **桌面端 `available()` 返回 false**，所有方法 no-op；§4 的「设提醒」UI 在桌面端要么隐藏，要么提示「仅手机端推送」。

### 2.3 新建存档时设「N 天后复查」
**UI 挂载点**：`renderCommitForm` 的 `moreDetails`（app.js 1629–1633）里，紧跟「存档时间」之后加一个选择控件。值：无 / 7 / 30 / 90 / 自定义天数。用页面里现成的 `choiceSelect` 或 `segmented` 组件（搜索它们的定义照用）。

**写入**：在 `doSave`(1638) 的 `payload`(1644) 里加：
```js
var remindDays = /* 从你的提醒控件读取，整数或 null */;
payload.remindDays = remindDays || null;
payload.remindAt = remindDays ? (payload.createdAt + remindDays * 86400000) : null;
payload.remindFired = false;
```
**保存后排程**（紧接 `Store.addCommit(payload)` 成功之后，1666–1669 之间）：
```js
if (ok && payload.remindAt && !payload.planned) {
  Notify.scheduleAt(ok.id, 'recheck', payload.remindAt,
    t('notif_recheck_title'),
    Store.sceneById(ok.scene).zh + ' · ' + (ok.message || ''),
    { kind: 'recheck', route: 'diff', sceneId: ok.scene, commitId: ok.id });
}
```
> 注意 `addCommit` 返回的是带 `id` 的 commit 对象（store.js 245），用 `ok.id` 而不是 payload（payload 没 id）。
> 编辑分支（1658–1665）若改了 `remindAt`：先 `Notify.cancelFor(editing.id,'recheck')` 再按新值重排。

### 2.4 点击通知 → 深链进现实对比（base 预选）
**复用 `pendingDiff`**（已确认：`renderDiff` 2068–2099 会据 `{sceneId, commitId, baseId}` 预选场景、把 `commitId` 设为 compare、`baseId`(或其 parentId) 设为 base）。

在 boot 里接线（见 §2.5 一起做）：
```js
function handleNotifyIntent(ex) {
  if (!ex || !ex.route) return;
  if (ex.route === 'diff') {
    // 把目标存档设为对比对象；base 留空→renderDiff 自动取它的 parentId 作为 base
    pendingDiff = { sceneId: ex.sceneId, commitId: ex.commitId };
    var c = Store.getCommit(ex.commitId);
    // 兜底：同场景真实存档不足 2 条，diff 无意义 → 落到详情页提示「再拍一张当前状态」
    var enough = c && Store.commitsForScene(ex.sceneId).filter(function (x){return !x.planned;}).length >= 2;
    go(enough ? 'diff' : 'detail');
    if (!enough && c) pendingDetail = ex.commitId; // 让详情页可引导用户新建对比版本
  }
}
```
**坑：**
- **冷启动时序**：点通知可能直接拉起 app。`Store` 还没 hydrate 时不能 `Store.getCommit`。解决：监听器很早就注册（`initNative` 里），若 `Store` 未就绪先把 `ex` 暂存到 `pendingDeepLink`，在 `Store.init().then(render)` 回调末尾再 `handleNotifyIntent(pendingDeepLink)`。
- `go()` 若目标 === 当前路由会 early-return 不重渲染（604 行）——冷启动时 current 多半不是 diff，没问题；热点击时若已在 diff，需要手动 `render()`。

### 2.5 开机重新注册 + 注册点击监听
在 `initNative`(4223) 末尾、native 分支内加：
```js
Notify.initClickRouting(function (ex) {
  if (storeReady) handleNotifyIntent(ex); else pendingDeepLink = ex;
});
```
在 boot 的 `Store.init().then(...)`(4518) 回调里、`render()` 之后加：
```js
storeReady = true;
Notify.syncAll();                       // 按本机所有未来提醒重排（重启后保险）
if (pendingDeepLink) { handleNotifyIntent(pendingDeepLink); pendingDeepLink = null; }
```
（在文件顶部声明 `var storeReady = false, pendingDeepLink = null;`。）
**坑：** `syncAll` 用确定性 id，重排同一条只是替换、不会重复——前提是 `idFor` 的 `kind` 一致（都用 `'recheck'`）。

### 2.6 到期提醒（把分支 `dueAt` 升级成真推送）—— 放最后，最便宜
分支已有 `dueAt`（store.js 119、app.js 2733 仅作角标，不推送）。在 `Notify.syncAll` 里补一段：遍历 `Store.branches()`，对未复盘且 `dueAt` 在未来的，`scheduleAt(b.id,'due', 当天9点ms, …, {route:'branch-detail', branchId:b.id})`。
**坑：** 先确认 `dueAt` 的存储格式（看 `addBranch`/表单，疑似 `YYYY-MM-DD`），按格式 `new Date(b.dueAt+'T09:00:00').getTime()` 转 ms。`handleNotifyIntent` 里 `branch-detail` 的深链，**照抄 branch-detail 路由现有的 pending 变量名**（在 `renderBranchDetail` 3057 附近找它读哪个变量）。

---

## 3. 工作流 2：可分享凭证（导出升级）

### 3.1 对比卡片盖时间戳水印
改 `buildDiffCardCanvas`(2001)：在每张图角落 `ctx.fillText` 画该存档 `createdAt` 的时间戳（用页面里现成的 `fmtDate`），底部加一行水印页脚，例如 `Life Archive · 生成于 <now>`。
**坑：** 卡片里图片是 dataURL，必须 `img.onload` 后再 `drawImage`（该函数已有载图模式，照它来，别在未解码时画）。时间戳=可信度，是这个工作流的灵魂，别省。

### 3.2 单条存档导出 `buildCommitCardCanvas`（新函数）
仿 `buildDiffCardCanvas`，输入单条 commit：封面图 + 场景标签 + `createdAt` 时间戳 + 物品清单（`c.items`）+ 底部水印 → canvas → `showImageModal(cv.toDataURL('image/png'))`。
**挂载点**：详情页 `renderDetail`（搜索 `function renderDetail`，操作区现有 编辑/对比/回滚/删除）加一个「导出此存档」按钮。这样**不必先有 diff 也能导出凭证**（押金入住单张、验货单张都用得上）。

### 3.3 原生分享（次要，可二期）
```bash
npm i @capacitor/share@^8 @capacitor/filesystem@^8
```
导出成图后，native 端弹系统分享面板。
**坑（关键）：** Capacitor `Share` 在 Android **不能直接分享 dataURL**。稳妥路径：先用 `Filesystem.writeFile` 把 PNG 写到 `Directory.Cache` 拿到 `uri`，再 `Share.share({ files:[uri] })`。桌面端没有 Share 插件 → **保留现有「长按图片保存/分享」**（`showImageModal` 已有该提示，2050 行）。
> 若想压缩范围：3.3 可以不做，仅做 3.1+3.2，凭证一样成立（用户长按保存/截图分享）。

---

## 4. 工作流 3：首存即有值 + 引导

### 4.1 首存微反馈
`doSave` 真实存档成功后（1669，`toast('✅ ' + t('save_commit'))` 那行）升级为带数据的 toast：
```js
var mine = Store.commitsForScene(ok.scene).filter(function (x){return !x.planned;});
var prev = mine.filter(function (x){ return x.id !== ok.id; })
               .sort(function(a,b){return b.createdAt-a.createdAt;})[0];
var gap = prev ? Math.round((ok.createdAt - prev.createdAt)/86400000) : null;
var msg = (lang==='zh')
  ? ('✅ 已存档 · 本场景第 ' + mine.length + ' 次' + (gap!=null ? ' · 距上次 '+gap+' 天' : '') + ' · ' + (ok.items?ok.items.length:0) + ' 件物品')
  : ('✅ Saved · #' + mine.length + ' here' + (gap!=null ? ' · '+gap+'d since last' : '') + ' · ' + (ok.items?ok.items.length:0) + ' items');
toast(msg);
```

### 4.2 「N 天后提醒复查？」快捷入口
若用户保存时**没设**提醒，紧接微反馈再给一个可点的 toast/chip：「📌 30 天后提醒我复查？」点了就 `Notify.scheduleAt(...)` 并 `Store.updateCommit(ok.id,{remindAt:..., remindDays:30, remindFired:false})`。把工作流 1 的价值在「第一条存档」就送到用户面前。

### 4.3 空状态改 3 步引导
改 `renderTimeline` 的 `.empty` 块（809–822）：把单个「创建第一个存档」扩成 3 步卡片——① 选你想盯住的东西（房间/冰箱/押金房况…）② 拍第一张存档 ③ 设一个复查提醒。
**坑：** 现有「载入示例数据」(`empty_seed` → `seedDemo`)**保留**为次要入口（方便用户先看效果），别删。

---

## 5. i18n 新增文案清单（集中加到 `I18N.zh` 10–94 与 `I18N.en` 95–182）

至少需要这些键（key 名可自定，保持中英成对）：
```
notif_recheck_title   复查提醒 / Re-check reminder
notif_due_title       决策复盘到期 / Decision review due
remind_label          复查提醒 / Re-check reminder
remind_none           不提醒 / Off
remind_7 / _30 / _90  7 天后 / 30 天后 / 90 天后  (in N days)
remind_custom         自定义天数 / Custom days
remind_set_cta        📌 N 天后提醒我复查？ / Remind me to re-check in N days?
export_commit         导出此存档 / Export this archive
onboard_step1/2/3     三步引导文案 / 3-step onboarding copy
```
> `t(key)` 找不到键会回退中文再回退 key 本身（183 行），所以**漏译只会显示中文/键名、不会崩**，但请补齐 en。

---

## 6. 原生工程改动（Android）—— 容易漏，单列

> **铁则：`android/` 目录每次 CI 都重建，手改会被覆盖。所有 manifest/权限改动必须写进 `scripts/set-android-version.mjs`。**

在 `set-android-version.mjs` 里、CAMERA 权限注入那段（200–203 行）旁边照抄一段加 POST_NOTIFICATIONS：
```js
if (!m.includes('android.permission.POST_NOTIFICATIONS')) {
  m = m.replace('</manifest>',
    '    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n</manifest>');
  console.log('AndroidManifest -> added POST_NOTIFICATIONS permission');
}
```
- **Android 13+ 必需**，否则 `requestPermissions()` 弹不出、提醒静默失效。
- **不要**加 `SCHEDULE_EXACT_ALARM`（§2.2 已决定用 inexact）。
- 可选：`capacitor.config.ts` 的 `plugins` 里加 `LocalNotifications: { smallIcon: 'ic_stat_icon', iconColor: '#5b6cf0' }`（不加则用默认应用图标，能用）。若加自定义小图标，需在安卓 res 放对应资源——**第一版建议不加，省事**。

---

## 7. 验收清单（做完逐条打勾）

**桌面端（Electron，`npm start`）**
- [ ] `Notify.available()` 为 false；新建/保存/导出全部正常，无报错（降级生效）。
- [ ] 单条存档导出图含时间戳水印；对比导出图含双图时间戳。

**安卓真机（装新 APK）**
- [ ] 首次设提醒时弹出通知权限请求；允许后再设不再弹。
- [ ] 新建存档设「1 分钟后复查」→ 1 分钟后收到通知。
- [ ] 点通知 → 进现实对比，compare=这条存档，base=它上一版（同场景≥2 条时）。
- [ ] 同场景只有 1 条时点通知 → 落详情页且有「再拍一张当前状态」引导，不报错。
- [ ] 杀掉 app 后点通知冷启动 → 仍能正确进 diff（验证 `pendingDeepLink` 时序）。
- [ ] 删除带提醒的存档 → 到点不再误推送（验证 `cancelFor`）。
- [ ] 首存 toast 显示「第 N 次 · 距上次 X 天 · M 件物品」。
- [ ] 空时间线显示 3 步引导；「载入示例数据」仍在。

---

## 8. 发版（照搬 `RELEASING.md` 铁律，缺一条算未完成）

**新版本号：`1.7.0`。铁律 1 —— 必须同步改这 5 处：**
1. `package.json` 的 `"version"` → `1.7.0`
2. `js/version.js` 的 `window.APP_VERSION` → `'1.7.0'`
3. `index.html` 里 5 个 `?v=` 查询串（现为 `?v=1.6.3-2`，第 11、41–44 行）→ 改成 `?v=1.7.0`
4. `js/app.js` 顶部 `RELEASE_NOTES`(3456) **新增一条**，形状：
   `['1.7.0','2026-…','中文标题','English title',[中文逐条…],[English bullets…]]`
5. `CHANGELOG.md` 顶部**新增一节**（中文为主，逐条列改动 + 注意事项：本版新增本地通知，安卓首次会请求通知权限）

> 三处说明（CHANGELOG / RELEASE_NOTES / GitHub Release 正文）内容必须一致；GitHub Release **标题只能是纯版本号** `1.7.0`。

**Windows（产出并上传 exe/latest.yml/blockmap）：**
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
$env:GH_TOKEN = "你的_GitHub_Token"
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
npx electron-builder --win --publish always
```
**安卓：** GitHub → Actions → Build Android APK → Run workflow；下载 `LifeArchive-debug.apk` → `gh release upload v1.7.0 LifeArchive-debug.apk`。
**两端都发 = 才算发完。** 发完按 `RELEASING.md` 铁律 4 自检。

---

## 9. 不要做 / 边界（防跑偏）

- ❌ **不加新场景**（已有近 20 个，摊太薄）。后续反而要在 UI 上收敛成「我常用的几个」。
- ❌ **不引第二个后端、不改 Supabase 表结构**。提醒字段 ride in 现有 data blob（§1）。
- ❌ **绝不全局 patch fetch/XHR**（`capacitor.config.ts` 注释 7–10 行有血泪教训：会丢 Supabase 的 JWT 头、断云同步）。只有智谱 AI 那一个请求走 `apiPost`/CapacitorHttp。
- ❌ **不用精确闹钟**（避免额外权限）。
- ❌ **桌面端不得硬依赖任何 Capacitor 原生插件**，一律 `isNativePlatform()` 守卫 + 降级。
- ✅ **范围可收缩**：时间紧就先做 §2（通知闭环）+ §3.1/3.2（带时间戳导出），§3.3 原生分享、§2.6 分支到期可放二期，闭环依然成立。

---

*配套背景见仓库 `CHANGELOG.md`、`RELEASING.md`、`docs/SUPABASE-SETUP.md`；产品判断与三个候选主场景见我们这次的讨论（存证 / 找得到不浪费 / 成长记录——主场景本版**故意延后**，先把引擎层做透）。*
