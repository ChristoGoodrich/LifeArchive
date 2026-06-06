# Life Archive v1.11.0 ·「数据可托付 + 媒体存储地基」实现文档（独立可执行）

> 下一阶段主线是**充分记录生活**（位置 / 语音 / 视频 / 人物 / 心情 / 标签 / 自定义主体），把版本管理的独特性做爽、暂不追增长。
> 但在往里灌音视频之前，必须先解决两件**地基**：① 数据能不能托付（有导入/恢复，丢了能回来）；② 媒体怎么存（视频不能再塞进一行 jsonb）。本版只做这两件，**为 v1.12（轻维度）/ v1.13（语音）/ v1.14（视频）铺路**。
> 本文档自带所有改动点、可粘贴代码、文件锚点（基于当前 **1.10.0** 代码）与坑，照着做即可。

> ⚠️ **版本号注意**：`1.11.0` 在语义化版本里**大于** `1.10.0`（次版本 11 > 10），electron-updater 用 semver 判断，自动更新正常。别在任何地方用字符串/浮点比较版本（仓库里没有这种比较，保持现状）。

---

## 0. 总览

### 0.1 本版做两件事（一条主、一条铺路）

**Part A ·「数据可托付」（本版核心价值，必做、低风险、零 schema 改动）**
1. **导入 / 恢复备份**：选一个 Life Archive 导出的 JSON → **合并**回本机（复用现成 `mergeData`，同一条取较新者、带墓碑，**绝不删除你已有的存档**）。补上 `exportData`(4247) 一直缺的另一半。
2. **导出升级为带版本信封**：导出文件带 `app/schema/version/exportedAt`，文件名带日期；导入**同时兼容**旧的裸格式和新信封。
3. **云同步状态可见**：成功同步后记 `lastSyncAt`，账号卡显示「上次同步：X」，让用户确信数据已在云端。

**Part B ·「媒体存储地基」（为 v1.13/v1.14 铺路，可同版或紧随，见 §8 范围可收缩）**
4. **IndexedDB 升到 v2 + 新增 `blobs` 仓**：存真正的 `Blob`（不是 dataURL 字符串），`Store.putBlob/getBlob/deleteBlob`。
5. **媒体引用约定**：新媒体走 `commit.media[]`（`{kind, blobId, mime, size, ...}`），**不动**现有 `commit.photo` / `commit.files[]` 内联 dataURL（读兼容）。
6. **备份带媒体**：信封里预留 `data.blobs`，导出会把 `media[]` 引用的 blob base64 进去、导入会还原——v1.11 没有媒体时这段是空跑，但路径建好，v1.13 语音直接用。
7. **云端媒体（Supabase Storage）只做设计、不实现**：本版无媒体可传，给出 bucket + RLS 设计草案，留给 v1.13/v1.14。

### 0.2 验收闭环（做完用它端到端验收）
设置 →「导出备份」得到 `lifearchive-backup-YYYY-MM-DD.json` → 「清空全部」→ 「导入 / 恢复备份」选刚才那个文件 → 存档**原样回来**、计数正确、且不丢任何更新；登录云同步后账号卡显示「上次同步」时间。
**这条链顺畅 = 数据可托付柱成立。**

### 0.3 代码地图（当前 1.10.0 真实锚点）
| 位置 | 行号 | 作用 |
|---|---|---|
| `I18N.zh` / `en` / `t()` | …/… | 新键插在 `saved_value_prefix` 前（zh **147** / en **286**） |
| `Cloud` 适配块 / `pull` / `push` | 689 / 738 / 742 | 单行 `archives.data` jsonb；本版**不改** |
| `mergeData(a,b)` | 918 | **核心复用**：按 id 取并集、`updatedAt` 新者胜、墓碑感知。导入直接用它 |
| `cloudSync()` | 948 | pull→merge→replaceAll→push；**加 `lastSyncAt`** |
| `autoSync(showToast)` | 962 | 变更后防抖同步；导入后调用它把合并结果推上云 |
| `exportData()` / `clearAll()` | 4247 / 4252 | **升级 export 信封 + 旁边加 importData** |
| `accountCard()` 已登录分支 | 5058–5080 | **加「上次同步」行** |
| 数据卡 `expBtn`/`clrBtn`/`var data` | 5153 / 5155 / 5158 | **set-actions(5168) 里加「导入」按钮** |
| `settingsCard(title, children)` | 4418 | 复用 |
| `RELEASE_NOTES` | 4424 | 发版加一条（形状见 §7） |
| `commit.photo` / `photoW/H` / `files[]` | 2329–2346（doSave payload） | 现有内联媒体形状，**读兼容、不迁移** |
| `commitThumbSrc` / `commitImageEntries` | 363 / 370 | 现有取图助手；v1.13/v1.14 在此扩展 media |

**store.js 锚点**：`openIDB`(31，version **1**，建 `kv`)、`idbGet`(45)/`idbSet`(54)、`persist`(64)、`exportRaw`(376)、`replaceAll`(380)、`exportJSON`(359)、`KEY_*`/`IDB_NAME`/`IDB_STORE`(12–17)、`meta`/`setMeta`(340)、`uid`(95)。

**确认存在、会用到的真实助手**（别另造）：`el/$`、`toast`(413)、`noticeCard`(4245)、`fmtBytes`(338)、`fmtDate`(320，吃 epoch ms)、`settingsCard`(4418)、`Store.exportRaw/replaceAll`、`mergeData`(918)。

---

## 1. Part A · 数据可托付

### 1.1 导出升级为带版本信封（改 `exportData` 4247）

把现在这版：
```js
function exportData() {
  var blob = new Blob([Store.exportJSON()], { type: 'application/json' });
  var a = el('a', { href: URL.createObjectURL(blob), download: 'lifearchive-export.json' });
  document.body.appendChild(a); a.click(); a.remove();
}
```
改成：
```js
var BACKUP_SCHEMA = 1;

// 走 media[] 的 blob 引用，把它们 base64 进信封，让备份是“完整”的（含媒体）。
// v1.11 还没有 media → 这里基本是空跑；v1.13 语音落地后自动生效。
function collectBackupBlobs() {
  var ids = {};
  Store.commits().forEach(function (c) {
    (c.media || []).forEach(function (m) { if (m && m.blobId) ids[m.blobId] = 1; });
  });
  var keys = Object.keys(ids);
  if (!keys.length || !Store.getBlob) return Promise.resolve(null);
  var out = {};
  return keys.reduce(function (p, id) {
    return p.then(function () {
      return Store.getBlob(id).then(function (b) { return b ? blobToBase64(b) : null; })
        .then(function (b64) { if (b64 != null) out[id] = b64; });
    });
  }, Promise.resolve()).then(function () { return out; });
}

function exportData() {
  toast(lang === 'zh' ? '正在打包备份…' : 'Packing backup…');
  collectBackupBlobs().then(function (blobs) {
    var data = Store.exportRaw();              // { commits, branches, tombstones }
    if (blobs) data.blobs = blobs;             // 仅在有媒体时附带
    var envelope = {
      app: 'life-archive', schema: BACKUP_SCHEMA,
      version: window.APP_VERSION || '', exportedAt: Date.now(), data: data
    };
    var name = 'lifearchive-backup-' + ymd(new Date()) + '.json';
    var blob = new Blob([JSON.stringify(envelope)], { type: 'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    Store.setMeta({ lastBackupAt: Date.now() });   // 设备偏好，不进云同步
    toast('✅ ' + t('backup_done'));
  });
}
```
配套两个小助手（粘在 `exportData` 上面；若仓库已有同名 `ymd`/`blobToBase64` 则复用、别重复定义）：
```js
function ymd(d) {
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
function blobToBase64(blob) {
  return new Promise(function (resolve, reject) {
    var r = new FileReader();
    r.onload = function () { resolve(String(r.result).split(',')[1] || ''); };
    r.onerror = reject; r.readAsDataURL(blob);
  });
}
function base64ToBlob(b64, mime) {
  var bin = atob(b64 || ''), n = bin.length, u8 = new Uint8Array(n);
  for (var i = 0; i < n; i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], { type: mime || 'application/octet-stream' });
}
```
**坑：** `Store.exportJSON()`（裸格式）保持不变——它和**云同步**无关（云走 `exportRaw`），但别处可能引用，不要动它。信封只在“导出到文件”这条路上用。

### 1.2 导入 / 恢复（粘在 `exportData` 之后、`clearAll`(4252) 之前）

```js
function importData(file) {
  if (!file) return;
  toast(t('import_working'));
  var reader = new FileReader();
  reader.onload = function () {
    var raw;
    try { raw = JSON.parse(reader.result); }
    catch (e) { toast('⚠ ' + t('import_bad')); return; }
    // 兼容两种：① 新信封 {app,schema,data:{...}}  ② 旧裸格式 {commits,branches,tombstones}
    var incoming = (raw && raw.data && raw.data.commits) ? raw.data : raw;
    if (!incoming || !Array.isArray(incoming.commits)) { toast('⚠ ' + t('import_bad')); return; }

    function applyMeta() {
      // 合并：union by id + updatedAt 新者胜 + 墓碑感知。绝不删除本机已有的新数据。
      var merged = mergeData(Store.exportRaw(), incoming);
      Store.replaceAll(merged);
      render();
      autoSync(false);   // 若已登录，把合并结果推上云
      toast('✅ ' + t('import_done').replace('{n}', merged.commits.length));
      // 重排本机提醒（导入可能带回设了 remindAt 的存档）
      if (typeof Notify !== 'undefined' && Notify.syncAll) Notify.syncAll();
    }

    var blobs = incoming.blobs;
    if (blobs && Store.putBlob) {
      var ids = Object.keys(blobs);
      ids.reduce(function (p, id) {
        return p.then(function () {
          // mime 从引用它的 media 里找；找不到给个兜底
          var mime = mimeForBlobId(incoming.commits, id) || 'application/octet-stream';
          return Store.putBlob(id, base64ToBlob(blobs[id], mime));
        });
      }, Promise.resolve()).then(applyMeta);
    } else {
      applyMeta();
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
```
**坑（逐条）：**
- **一律 MERGE，绝不 REPLACE 覆盖**。`mergeData` 保证导入旧备份不会把本机更新的存档冲掉；想“完全还原到备份”的用户应先「清空全部」再导入（clearAll 会给所有现存档打墓碑，导入的旧档若 stamp 更小会被墓碑挡掉——这点要在 §6 验收里专门测，避免“清空后导入空”）。
- **墓碑会传播删除**：备份里若记录了某条的删除（tombstone 更新），导入后该条在本机也会消失，这是**正确**行为（删除应跨设备/跨备份一致）。
- **大文件**：含很多照片的备份，`JSON.parse` 在手机 WebView 上较重；已加「导入中…」态。base64 媒体还原是**串行**（reduce 链）避免一次性占满内存。
- `Notify.syncAll()` 用确定性 id，重排只是替换，幂等。

### 1.3 数据卡加「导入」按钮（改 5153–5169）

在 `var clrBtn = ...`(5155) 之后、`var data = settingsCard(...)`(5158) 之前加：
```js
var impInput = el('input', { type: 'file', accept: 'application/json,.json', style: 'display:none' });
impInput.addEventListener('change', function () {
  var f = impInput.files && impInput.files[0];
  importData(f);
  impInput.value = '';   // 允许连续导入同一文件
});
var impBtn = el('button', { class: 'btn ghost tiny', text: t('import_restore') });
impBtn.addEventListener('click', function () { impInput.click(); });
```
并把 `expBtn` 文案从「导出 JSON」改为更贴切的「备份到文件」（可选），再把按钮塞进 `set-actions`(5168)：
```js
el('div', { class: 'set-actions' }, [expBtn, impBtn, clrBtn]),
impInput
```
> `impInput` 直接作为 data 卡的子节点挂上即可（隐藏）。按钮点击触发的 `impInput.click()` 与用户手势同源，WebView 能正常拉起文件选择。

### 1.4 云同步状态可见（改 `cloudSync` 948 + `accountCard` 已登录分支）

`cloudSync()` 成功后记一笔时间（meta 是本机偏好、不进云）：
```js
function cloudSync() {
  var local = Store.exportRaw();
  return Cloud.pull().then(function (remote) {
    var merged = mergeData(local, remote);
    Store.replaceAll(merged);
    return Cloud.push(merged).then(function () {
      Store.setMeta({ lastSyncAt: Date.now() });   // ← 新增
      return merged;
    });
  });
}
```
`accountCard()` 已登录分支（5070–5079 的 `return settingsCard(...)`）在「已登录」行后加一行：
```js
el('div', { class: 'set-row' }, [
  el('span', { class: 'set-label', text: t('last_sync') }),
  el('span', { class: 'set-value', text: Store.meta().lastSyncAt
    ? fmtDate(Store.meta().lastSyncAt) : t('last_sync_never') })
]),
```
> 放在 `el('span',{text:u.email...})` 那个 set-row 之后、`el('p',{class:'set-hint'...})` 之前。

---

## 2. Part B · 媒体存储地基（store.js）

> 目标：把「大媒体」从「整存整取的 JSON 数组」里**分离出去**，存成真正的 `Blob`，这样 v1.13 语音、v1.14 视频不必再被 dataURL 撑爆内存/存储。**本版只建地基，不迁移旧照片、不做云端媒体上传。**

### 2.1 IndexedDB 升到 v2 + 新增 `blobs` 仓（改 store.js）

顶部常量（12–17）加一个仓名：
```js
var IDB_STORE = 'kv';
var IDB_BLOBS = 'blobs';   // ← 新增：存 Blob 对象（音视频/大附件），与 kv 分离
```
`openIDB`(31) 把版本从 1 升到 2，并在升级回调里**只新建缺失的仓**（绝不动已有 `kv`）：
```js
function openIDB() {
  return new Promise(function (resolve) {
    try {
      if (!global.indexedDB) return resolve(null);
      var req = indexedDB.open(IDB_NAME, 2);   // ← 1 → 2
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
        if (!db.objectStoreNames.contains(IDB_BLOBS)) db.createObjectStore(IDB_BLOBS);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { resolve(null); };
      req.onblocked = function () { resolve(null); };
    } catch (e) { resolve(null); }
  });
}
```
**坑：** 老用户升级时 `onupgradeneeded` 以 oldVersion=1 触发，**必须用 `contains` 守卫**只补 `blobs`、不重建 `kv`，否则会清空已有存档。新装用户 oldVersion=0，两个仓都建。

### 2.2 Blob 读写 API（粘到 store.js `idbSet`(54) 之后）

```js
function idbGetBlob(key) {
  return new Promise(function (resolve) {
    try {
      var r = idb.transaction(IDB_BLOBS, 'readonly').objectStore(IDB_BLOBS).get(key);
      r.onsuccess = function () { resolve(r.result); };
      r.onerror = function () { resolve(undefined); };
    } catch (e) { resolve(undefined); }
  });
}
function idbPutBlob(key, blob) {
  return new Promise(function (resolve) {
    try {
      var tx = idb.transaction(IDB_BLOBS, 'readwrite');
      tx.objectStore(IDB_BLOBS).put(blob, key);
      tx.oncomplete = function () { resolve(true); };
      tx.onerror = function () { resolve(false); };
    } catch (e) { resolve(false); }
  });
}
function idbDelBlob(key) {
  return new Promise(function (resolve) {
    try {
      var tx = idb.transaction(IDB_BLOBS, 'readwrite');
      tx.objectStore(IDB_BLOBS).delete(key);
      tx.oncomplete = function () { resolve(true); };
      tx.onerror = function () { resolve(true); };
    } catch (e) { resolve(true); }
  });
}
```
在 `Store` 对象里挂上（放在 `uid` 附近或 Misc 区）：
```js
putBlob: function (id, blob) {
  if (!idb) return Promise.resolve(false);   // localStorage 兜底模式不支持大 blob
  return idbPutBlob(id, blob);
},
getBlob: function (id) {
  if (!idb) return Promise.resolve(null);
  return idbGetBlob(id).then(function (b) { return b || null; });
},
deleteBlob: function (id) {
  if (!idb) return Promise.resolve(true);
  return idbDelBlob(id);
},
```
**坑：**
- 存的是**真正的 `Blob`**（IndexedDB 支持结构化克隆 Blob），不是 dataURL 字符串——这正是为视频准备的关键，dataURL 存视频会把内存打爆。
- 播放时用 `URL.createObjectURL(blob)` 喂给 `<audio>/<video>/<img>`，**用完 `URL.revokeObjectURL` 释放**（v1.13/v1.14 渲染时务必成对，否则内存泄漏）。
- localStorage 兜底模式（无 IDB）下 `putBlob` 返回 false，调用方需降级（v1.13 语音在拿不到 IDB 时禁用录音入口即可）。

### 2.3 删除存档时回收它的 blob（改 store.js `deleteCommit` 294）

现在 `deleteCommit` 只删 commit + 打墓碑。媒体落地后要顺手回收 blob，避免孤儿占空间：
```js
deleteCommit: function (id) {
  var c = this.getCommit(id);
  if (c && c.media && idb) {
    c.media.forEach(function (m) { if (m && m.blobId) idbDelBlob(m.blobId); });
  }
  cache.commits = cache.commits.filter(function (x) { return x.id !== id; });
  tombstone(id);
  persist();
},
```
**坑：** 这里**只删本机 blob**；不要把 blobId 也写进 tombstones（墓碑是给 commit/branch 的 id 用的，blob 没有跨设备合并语义）。云端媒体回收等 §2.5 落地时单独处理。

### 2.4 媒体引用约定（给 v1.13/v1.14 定标准，本版不写 UI）

新媒体一律挂在 commit 的**新字段 `media[]`**，**不碰**现有 `photo`/`files[]`：
```
commit.media: [
  { kind: 'audio', blobId: 'blob_xxx', mime: 'audio/webm', size: 12345, dur: 8.2 },
  { kind: 'video', blobId: 'blob_yyy', mime: 'video/mp4',  size: 998877, dur: 12,
    w: 1080, h: 1920, poster: '<小尺寸 dataURL 封面帧>' }   // poster 内联，用于时间线缩略，便宜
]
```
约定：
- `blobId` 用 `Store.uid('blob')` 生成；`Store.addCommit`/`updateCommit` 是整对象写入，`media[]` 会**自动持久化**（和当年加 `remindAt` 一样，无需改 store 方法签名）。
- **video 的 `poster`** 用一张小 dataURL 封面帧（≤几十 KB），让时间线/详情不必解码整段视频就能显示缩略；正片走 blob。
- v1.13/v1.14 在 `commitThumbSrc`(363)/`commitImageEntries`(370) 里**追加** media 分支（视频用 poster、音频用图标占位），不重写现有逻辑。

### 2.5 云端媒体（Supabase Storage）——本版只设计、不实现

现状：云同步是把 `exportRaw()` 整个塞进 **一行 `archives.data` jsonb**（`Cloud.push` 742）。**视频绝不能进 jsonb 行**。目标设计（留给 v1.13/v1.14）：

- 建一个**私有 bucket** `media`，路径 `media/{user_id}/{blobId}`，用 Storage RLS 限定只能读写自己 `user_id` 前缀：
  ```sql
  insert into storage.buckets (id, name, public) values ('media','media', false)
    on conflict (id) do nothing;
  create policy "own media - all" on storage.objects for all
    using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text)
    with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
  ```
- 同步时：jsonb 行只存 `media[]` 的**引用**（已是现状，引用很小）；额外一步「上传/下载**缺失的** blob」——按 blobId 比对本地 `blobs` 仓与远端 bucket，只传差量。
- **坑（提前记下）**：① 现有**内联照片**已经在撑大 jsonb 行，本版不追溯迁移（见 §8）；②大 blob base64 进 §1 信封在视频时代会过大，届时 §1 备份要评估改 zip（见 §8）。

> **本版到此为止**：地基（v2 仓 + blob API + media 约定 + 备份带 blob 的空跑路径）建好，云端 Storage 与 UI 录制留给后续版本，照本节设计接即可。

---

## 3. i18n 新增键

**zh：插在第 147 行 `saved_value_prefix` 之前**：
```js
import_restore: '导入 / 恢复备份',
backup_done: '已导出备份文件',
import_working: '导入中…',
import_done: '已导入 · 共 {n} 条存档',
import_bad: '文件无法识别，请选择 Life Archive 导出的备份',
last_sync: '上次同步', last_sync_never: '从未',
backup_nudge: '⛅ 还没设置云同步，导一份本地备份更安心 →',  // §5 可选用
```
**en：插在第 286 行 `saved_value_prefix` 之前**：
```js
import_restore: 'Import / restore',
backup_done: 'Backup file exported',
import_working: 'Importing…',
import_done: 'Imported · {n} archives total',
import_bad: 'Unrecognized file — pick a Life Archive backup',
last_sync: 'Last synced', last_sync_never: 'Never',
backup_nudge: '⛅ No cloud sync yet — export a local backup to be safe →',
```
> `{n}` 用 `.replace('{n}', x)`（与现有 `import_done` 一致）；缺键回退中文/键名不崩，但请成对补齐。

---

## 4. CSS

Part A/B 全部复用现有 `.set-actions / .btn.ghost.tiny / .set-row / .set-label / .set-value / .set-hint`，**无需新增样式**。隐藏文件输入用内联 `style:'display:none'`，也不进 CSS。

（§5 可选横幅若要做，再加 `.backup-banner`，样式见 §5。）

---

## 5.（可选）未备份轻提醒（防数据焦虑，桌面+手机都生效）

> 纯属锦上添花，**不做也不影响本版成立**。给**既没配云同步、又很久没导出备份**的用户，在时间线顶部浮一条提示。不用通知（桌面也能看到、零权限）。

在 `renderTimeline` 的 streak chip 之后（v1.9 加的那段附近）插：
```js
(function () {
  if (Cloud.configured()) return;                 // 配了云同步就不催
  var last = Store.meta().lastBackupAt || 0;
  var stale = Date.now() - last > 14 * 86400000;  // 14 天没备份
  if (!stale || Store.isEmpty()) return;
  var b = el('button', { type: 'button', class: 'backup-banner',
    text: t('backup_nudge'), onclick: function () { go('settings'); } });
  v.appendChild(b);
})();
```
配套 CSS（`css/styles.css` 末尾）：
```css
.backup-banner{display:block;width:100%;margin:8px 0 4px;padding:11px 14px;border:0;border-radius:14px;
  background:linear-gradient(135deg,#3a4a6b,#5b6cf0);color:#fff;font-weight:600;text-align:left;
  cursor:pointer;box-shadow:0 4px 14px rgba(91,108,240,.2)}
.backup-banner:active{transform:scale(.99)}
```
**坑：** `lastBackupAt` 在 §1.1 导出成功时已写；配了云同步直接 return（云本身就是备份）。别做成每次进 App 都弹的骚扰。

---

## 6. 验收清单（逐条打勾）

**桌面端（`npm start`）· Part A**
- [ ] 设置 →「备份到文件」下载 `lifearchive-backup-YYYY-MM-DD.json`，打开是 `{app,schema,version,exportedAt,data:{commits,branches,tombstones}}`。
- [ ] 改一条存档 / 加一颗星 →「备份到文件」→「导入 / 恢复备份」选它 → 数据一致，toast「已导入 · 共 N 条」。
- [ ] **合并不丢新数据**：导出备份 → 再新建一条存档 → 导入刚才的旧备份 → 新建那条**仍在**（mergeData 取并集）。
- [ ] **完整还原**：「清空全部」→「导入」刚才的备份 → 存档原样回来（验证 clearAll 墓碑不会把导入挡掉：因导入档 stamp 早于清空时刻，需确认仍能恢复——若被墓碑挡掉，说明该走「先清配置再导入」或在 import 里对 clearAll 场景特判，见 §8）。
- [ ] 导入一个**乱七八糟的 .txt / 半个 JSON** → 友好报错「文件无法识别」，不崩、不清数据。
- [ ] 导入**旧裸格式**（手造一个 `{commits:[...],branches:[],tombstones:{}}`）→ 仍能导入（兼容分支生效）。

**桌面端 · Part B**
- [ ] 装新版后**已有存档全在**（IDB v1→v2 升级未清 `kv`）。
- [ ] 控制台 `RG_STORE.putBlob('t', new Blob(['hi'])).then(()=>RG_STORE.getBlob('t')).then(b=>b.text()).then(console.log)` → 打印 `hi`（blob 仓读写通）。
- [ ] 云同步成功后，账号卡显示「上次同步：<日期>」。

**安卓真机（装新 APK）**
- [ ] 同上导入/导出链路跑通；大备份（含多张照片）导入有「导入中…」、不卡死。
- [ ] 升级安装后存档不丢（IDB 升级在真机也安全）。
- [ ]（若做了 §5）没配云同步且 14 天没备份时，时间线顶部出现备份提示；点它进设置。

---

## 7. 发版（照搬 `RELEASING.md` 铁律 · 缺一条算未完成）

> ⚠️ `1.11.0` 是合法且大于 `1.10.0` 的 semver（11 > 10），自动更新正常；别用字符串/浮点比较版本。

**新版本号 `1.11.0`。铁律 1 —— 同步改 5 处：**
1. `package.json` `"version"` → `1.11.0`
2. `js/version.js` `window.APP_VERSION` → `'1.11.0'`
3. `index.html` 5 个 `?v=`（第 11、41–44 行，现为 `?v=1.10.0`）→ `?v=1.11.0`
4. `js/app.js` `RELEASE_NOTES`(4424) **顶部新增一条**（插在 `var RELEASE_NOTES = [` 与 `['1.10.0',…]` 之间）：
   `['1.11.0','2026-…','数据可托付：导入/恢复备份 + 同步状态 + 媒体存储地基','Trust your data: import/restore backups, sync status, media-storage foundation',[中文逐条…],[EN bullets…]]`
5. `CHANGELOG.md` 顶部**新增一节**（中文为主：导入/恢复备份、带版本信封的导出、上次同步显示、IndexedDB 升 v2 + blob 仓地基；注意事项：升级会做一次 IDB 迁移、数据不丢；本版不改 Supabase 表结构）

> 三处说明一致；GitHub Release **标题纯版本号** `1.11.0`。

**Windows：**
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
$env:GH_TOKEN = "你的_GitHub_Token"
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
npx electron-builder --win --publish always
```
**安卓：** Actions → Build Android APK → Run workflow → 下载 `LifeArchive-debug.apk` → `gh release upload v1.11.0 LifeArchive-debug.apk`。两端都发才算完，发完按铁律 4 自检。

---

## 8. 不要做 / 边界（防跑偏）

- ❌ **不迁移已有内联照片到 blob**——读兼容即可，迁移无即时收益、风险高（要动所有存档）。video 时代再评估。
- ❌ **不引 zip / 第三方库**——保持「零依赖、双击即跑」。本版 blob 备份走内联 base64；待 v1.14 视频让内联过大时，再单独评估 zip 方案。
- ❌ **本版不做云端 Storage 媒体上传**——没有媒体可传，只在 §2.5 给设计与 SQL 草案，v1.13/v1.14 实现。
- ❌ **导入一律 MERGE，绝不无确认 REPLACE 覆盖**。要「完全还原到某个备份」的语义，走「先清空全部 → 再导入」；若验收 §6 发现 clearAll 墓碑把导入挡掉，二选一兜底：① 文案明确「导入是合并」；② 给一个「危险：用备份完全替换」入口，内部直接 `Store.replaceAll(incoming)`（跳过 merge），并二次确认。**默认仍用合并**。
- ❌ **不改 `mergeData` / `replaceAll` / `Cloud.pull/push` 语义**——直接复用，云同步路径保持现状。
- ❌ **`lastSyncAt` / `lastBackupAt` 不进云同步**——设备偏好，存 `meta`(localStorage)。
- ❌ **IDB 升级回调里别重建/清空 `kv`**——只 `contains` 守卫补 `blobs`，否则清空老用户存档（最严重的坑）。
- ✅ **范围可收缩**：Part A 独立成版就是完整的「数据可托付」，可先发；Part B（媒体地基）能同版、也能紧跟下一版。时间紧就先发 Part A。
- ✅ **这是下一阶段的地基**：先让「丢了能回来」「视频有处可放」，再在 v1.12 加轻维度（人物/心情/标签/自定义主体）、v1.13 语音、v1.14 视频、v1.15 位置——每加一个维度都自动多一条可对比/可回看的版本轴。

---

*配套：v1.7 引擎层、v1.8 重温、v1.9 轻松记录、v1.10 时光历程文档均在 `docs/`。下一版 v1.12「立体维度」（人物 + 心情 + 标签 + 自定义主体，全是轻字段、搭现有 commit 顺风车）落地时，同目录再开一份。*

