# Life Archive v1.17.0 ·「照片进桶 + 同步瘦身」实现文档（独立可执行）

> v1.16 把语音/视频搬进了桶，但**照片没有**：`c.photo`（封面）和 `c.files[].data`（多图）仍是**内联 base64**，活在 `cache.commits` 里。而 `cloudSync`(994) 每次把**整个存档（含所有照片 base64）当成一行 jsonb 推上去**——存档越多，单行 jsonb 越大、内存越吃紧、最终撞 Postgres 行/性能上限。**照片是当前真正的扩展悬崖。**
> 本版把照片纳入 v1.16 的 `media[]` 管道：**缩略图内联（几 KB，即时渲染）+ 全图进 blob 仓 + 桶**。同步的 jsonb 从此只带轻引用，体积骤降。
> 基于当前 **1.16.0** 真实代码。**这是迄今最大的一版**，因此采用**渐进、可回退、每个读取点带 legacy 兜底**的迁移，不做大爆炸。

> 🧭 **北极星**：照片复用 v1.16 已铺好的 `${uid}/${blobId}` 管道——`syncMediaUp`(1036) 上传、`resolveMediaBlob`(1025) 按需下载、删除回收(975)、`removeBlob`(807) **全部已按 `media[].blobId` 工作，照片纳入 `media[]` 即自动获得这一切**。本版的真正工作量在「**捕获产出新形状 + 所有读取点认新形状（带旧兜底）+ 旧照片渐进迁移**」。

---

## 0. 总览

### 0.1 新模型：照片 = `media[{kind:'photo'}]`，缩略内联、全图进桶
```js
media: [
  { kind:'photo', blobId:'ph_x', thumb:'data:image/jpeg;base64,…(≤640px,几KB)',
    w:3024, h:4032, mime:'image/jpeg', size:2_300_000, name:'cover.jpg', cover:true },
  { kind:'photo', blobId:'ph_y', thumb:'…', w:…, h:…, cover:false },   // 多图
  { kind:'audio', … }, { kind:'video', … }                            // v1.12/13 原样
]
```
- **`thumb`**（内联小图，~20–50KB jpeg）：时间线封面、缩略条、画廊缩略**全用它**，无需取 blob → 即时渲染、**这就是同步瘦身的关键**（jsonb 只带 thumb，不带全图）。
- **`blobId`**（全图 Blob，本机 `blobs` 仓 + 桶）：详情大图、画廊点开、现实对比、导出画布、AI 解读、下载——需要全分辨率时用 `resolveMediaBlob(blobId)`（本机→桶→缓存）。
- **`cover:true`** 标记封面（取代 `c.photo`）；其余为附加图（取代 `c.files` 里的图片）。

### 0.2 为什么纳入 media[] 而不是另起字段
v1.16 的 **上传/下载/删除回收/桶清理** 全部遍历 `media[].blobId`。照片一旦是 `media[kind:'photo']`：
- `syncMediaUp`(1036) **自动**上传照片全图（它只看 `m.blobId`，不看 kind）。
- `resolveMediaBlob`(1025) **自动**支持照片按需下载。
- `deleteCommitWithCleanup`(952) 的本机回收（store.js `deleteCommit` 350 按 `media[].blobId`）+ 桶 `removeBlob`(975) **自动**清照片。
- `collectBackupBlobs`(备份，按 `media[].blobId` 打包) **自动**把照片全图纳入备份。
→ **云/备份/删除生命周期零新增**。这是选 media[] 的决定性理由。

### 0.3 ⚠️ 渐进迁移（不做大爆炸、可回退）
- **新照片**：立即用新形状（thumb+blob+media）。
- **旧内联照片**（`c.photo`/`c.files[].data` 全图在 jsonb 里）：**不**在启动时一次性迁移（会卡）。改为 **机会式 + 限流后台**：① 编辑/保存某 commit 时顺手迁移它；② 一个**空闲分批**任务（每隔 idle 处理 N 条），把旧照片转 thumb+blob、剥掉内联 `data`。未迁移的旧照片**继续可用**（读取点带 legacy 兜底），只是暂时仍占 jsonb，直到被触及。
- **可回退**：迁移只是"全图从 jsonb 挪到 blob/桶 + 留 thumb"。任一步失败则保留旧内联，不丢图。**任何时候 thumb 缺失就回落旧 `data`/`photo`**。

### 0.4 边界 / 不做
- ❌ **本版只搬图片**（封面 + 图片附件）。`c.files` 里的**非图片附件**（PDF/文档）也内联 base64，但本版不动（同样模式，列 §11 后续）。
- ❌ 不改 store.js 数据结构 / `exportRaw`/`mergeData`/jsonb 表结构（照片引用照旧在 commit 里随 jsonb 走，只是从"全图"变"thumb+blobId"）。
- ❌ 不引第三方图片库/CDN 变换；缩略图用现成 `downscale()` 思路本地生成。
- ✅ 向后兼容：≤v1.16 设备读不到新照片全图（只看 thumb 当封面，详情大图取不到时回落 thumb）——不崩；新设备完整。

### 0.5 验收闭环（端到端）
新建带封面 + 3 张图的存档 → 时间线即时显示封面 + 缩略条（全用 thumb，无 blob 取数）→ 同步：Supabase Storage `${uid}/ph_*` 出现全图对象；**`archives.data` jsonb 体积相比旧版骤降**（不再含全图 base64）→ 详情：封面先显 thumb、随即换全图（resolveMediaBlob），画廊点开看全图 → 现实对比/导出图/AI 解读拿到全分辨率 → 换设备同账号登录 → 详情按需下载全图、缓存秒开 → 删除该 commit → 本机 blob + 桶对象回收 → 旧的内联照片存档被编辑或被空闲任务处理后，其 jsonb 同样瘦身。
**这条链顺 = 照片进桶 + 同步瘦身达成。**

### 0.6 代码地图（当前 1.16.0 真实锚点）
| 位置 | 行号 | 改动 |
|---|---|---|
| `isImageFile`/`firstImageFile` | 396/397 | 保留（legacy 兜底用） |
| `commitThumbSrc` | **405–409** | 优先 photo-media 的 `thumb`，再回落 `c.photo`/`files.data`/video poster |
| `imageFiles`/`commitImageEntries` | 410/**413–422** | 合并 photo-media（用 thumb）+ legacy `c.files` 图片 |
| `commitCoverDims` | **426–432** | 先 photo-media(w/h)，再 legacy |
| `renderDetail` 封面 | **1926–1927** | thumb 先上屏 → `resolveMediaBlob` 换全图 |
| `renderDetail` 画廊（files 图片块，audio 1964 之上） | ~1940 区 | 画廊缩略用 thumb，点开 `resolveMediaBlob` 全图 |
| `setPhoto`/`clearPhoto`/`imageEntryFromFile` | **2318/2345/2355** | 产出 thumb + 暂存全图 `_blob`（草稿态） |
| 表单 prefill `src.photo` | **2537–2538** | 兼容从 photo-media 预填封面 |
| `persistDraftMedia` | **2820–2861** | 扩展：与 audio/video 并列处理 `photo`（落 blob + 写 media[kind:photo]） |
| `doSave` payload | ~2872 | 不再写 `photo`/图片进 `files`；改由 persistDraftMedia 产 media[] |
| `buildCommitCardCanvas`（导出图） | **3446** | 改 async：先 `resolveMediaBlob` 拿全图再画 |
| 现实对比照片 | **4003–4004**（背景图）、**3780**（AI 需全图） | 改 async resolve 全图 |
| 回滚复制照片 | **4032/4158** | 复制 media[kind:photo] 引用（同一 blobId，不复制像素） |
| **复用 v1.16**（零改动，自动支持照片） | `syncMediaUp` 1036 / `resolveMediaBlob` 1025 / `removeBlob` 975 / `mediaPathFor` 1015 / `collectBackupBlobs` | — |
| 迁移任务（新增） | 顶层新函数 | `migrateInlinePhotos()`：机会式 + 空闲分批 |
| `RELEASE_NOTES` / 版本号 | 5019 区 / 5 处 | 1.16.0→1.17.0 |

**store.js 本版 0 改动**（照片仍是 commit 内字段 → 随 exportRaw 走；全图走 putBlob/getBlob，与 v1.16 媒体同仓）。

---

## 1. 缩略图生成助手（thumb）
照片需要一张内联小图。复用现有 `downscale()`（imageEntryFromFile 2356 已用它做附件压缩）的思路，再加一个**更小的 thumb 版**：
```js
// 从一个图片 Blob/File 生成 {thumb, w, h}：thumb ≤ THUMB_MAX 宽的 jpeg dataURL（几 KB）
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
// 把一个 dataURL 转回 Blob（迁移旧内联照片 + 草稿全图入仓时用）
function dataUrlToBlob(dataUrl) {
  return fetch(dataUrl).then(function (r) { return r.blob(); });  // WebView/Electron 均支持
}
```

---

## 2. 捕获：表单产出 photo-media（thumb 内联 + 全图入 blob）

### 2.1 草稿态（renderCommitForm 顶部，与 draftAudio/draftVideo 并列）
```js
// 封面草稿：{_blob?, thumb, w, h, mime, size, name, blobId?}
// 新拍/选 → _blob + thumb；编辑沿用 → blobId + thumb（无 _blob）
var draftCover = null;
var coverDeletedBlobId = null;
// 多图草稿：数组，元素同形状
var draftPhotos = [];
var photoDeletedBlobIds = [];
```
> 编辑预填：从 `src.media` 取 `kind:'photo'` 的项，`cover:true` → `draftCover`，其余 → `draftPhotos`；**legacy 兼容**：若 `src.photo`/`src.files` 还在（未迁移），转成草稿（见 §5 的 `commitToDrafts`）。

### 2.2 `setPhoto` 改造（2318）——存全图 Blob + 生成 thumb，不再把全图塞进 draftPhoto 字符串
新选封面时：拿到 File/dataURL → `makeThumb` → `draftCover = {_blob, thumb, w, h, mime, size, name}`；预览用 thumb（或本地 objectURL 全图，体验更清晰）。`clearPhoto`(2345) 置 `draftCover=null`，若原有 blobId 记入 `coverDeletedBlobId`。
> `imageEntryFromFile`(2355) 产出多图时，除现有 downscale，**额外** `makeThumb` 出 thumb、保留全图 `_blob`，push 进 `draftPhotos`。

### 2.3 `persistDraftMedia` 扩展（2820）——加 photo 分支（与 audio/video 同构）
```js
// 起点保留其它 kind；本版把 photo 也纳入管理
var media = (prevMedia || []).filter(function (m) { return m.kind !== 'audio' && m.kind !== 'video' && m.kind !== 'photo'; });
// …audio/video 分支原样…
// 删除旧封面/旧图 blob
if (coverDeletedBlobId) dels.push(Store.deleteBlob(coverDeletedBlobId));
photoDeletedBlobIds.forEach(function (id) { dels.push(Store.deleteBlob(id)); });

// ----- 封面 photo -----
chain = chain.then(function () {
  if (draftCover && !draftCover._blob && draftCover.blobId) {           // 编辑沿用
    media.push({ kind:'photo', cover:true, blobId:draftCover.blobId, thumb:draftCover.thumb,
      w:draftCover.w, h:draftCover.h, mime:draftCover.mime, size:draftCover.size, name:draftCover.name });
    return;
  }
  if (draftCover && draftCover._blob) {                                  // 新图入仓
    var pid = 'ph_' + Store.uid('p');
    return Store.putBlob(pid, draftCover._blob).then(function (ok) {
      if (ok) media.push({ kind:'photo', cover:true, blobId:pid, thumb:draftCover.thumb,
        w:draftCover.w, h:draftCover.h, mime:draftCover.mime, size:draftCover.size, name:draftCover.name });
      else toast('⚠ ' + t('photo_save_fail'));
    });
  }
});
// ----- 附加 photos（draftPhotos 串行入仓）-----
chain = chain.then(function () {
  return draftPhotos.reduce(function (p, dp) {
    return p.then(function () {
      if (!dp._blob && dp.blobId) { media.push({ kind:'photo', cover:false, blobId:dp.blobId, thumb:dp.thumb, w:dp.w, h:dp.h, mime:dp.mime, size:dp.size, name:dp.name }); return; }
      if (dp._blob) {
        var id = 'ph_' + Store.uid('p');
        return Store.putBlob(id, dp._blob).then(function (ok) {
          if (ok) media.push({ kind:'photo', cover:false, blobId:id, thumb:dp.thumb, w:dp.w, h:dp.h, mime:dp.mime, size:dp.size, name:dp.name });
        });
      }
    });
  }, Promise.resolve());
});
```
### 2.4 `doSave`（~2872）
payload **不再**写 `photo`/`photoW/H`，**不再**把图片塞进 `files`（非图片附件仍走 files）；封面/多图全部由 `persistDraftMedia` 产出的 `media[]` 承载。`photoTakenAt` 可挪到封面 media 项里（可选）。

---

## 3. 读取点改造（全部带 legacy 兜底）

> 原则：**先看 photo-media，再回落 legacy `c.photo`/`c.files`**。这样新旧数据共存期一切正常。

### 3.1 时间线助手（396–432）
```js
function photoMedia(c) { return (c && c.media || []).filter(function (m) { return m.kind === 'photo'; }); }
function coverPhoto(c) { var ps = photoMedia(c); return ps.filter(function (m){return m.cover;})[0] || ps[0] || null; }

function commitThumbSrc(c) {                       // 时间线封面：只要 thumb，绝不取 blob
  var cv = coverPhoto(c);
  if (cv && cv.thumb) return cv.thumb;
  var img = firstImageFile(c.files);               // legacy
  var v = videoMedia(c);
  return c.photo || (img && img.data) || (v && v.poster) || '';
}
function commitImageEntries(c) {                    // 画廊：合并 photo-media + legacy
  var out = [];
  photoMedia(c).forEach(function (m) {
    out.push({ thumb:m.thumb, blobId:m.blobId, name:m.name||'image.jpg', w:m.w, h:m.h, cover:!!m.cover });
  });
  if (!out.length) {                                // legacy 兜底（未迁移的旧 commit）
    if (c.photo) out.push({ data:c.photo, name:c.message||'cover.jpg', w:c.photoW, h:c.photoH, cover:true });
    imageFiles(c).forEach(function (f){ out.push({ data:f.data, name:f.name, w:f.w, h:f.h, file:f }); });
  }
  return out;
}
function commitCoverDims(c) {
  var cv = coverPhoto(c); if (cv && cv.w && cv.h) return { w:cv.w, h:cv.h };
  if (c.photo) return (c.photoW && c.photoH) ? { w:c.photoW, h:c.photoH } : null;
  var img = firstImageFile(c.files); if (img && img.w && img.h) return { w:img.w, h:img.h };
  var v = videoMedia(c); return (v && v.w && v.h) ? { w:v.w, h:v.h } : null;
}
```
> `commitCard`(时间线卡) 调 `commitThumbSrc`/`commitImageEntries`/`commitCoverDims`——改完即生效，**卡片用 `entry.thumb||entry.data`** 做 `<img src>`（缩略条同理）。

### 3.2 详情封面（1926–1927）——thumb 先上屏，全图异步换
```js
var cv = coverPhoto(c);
var coverThumb = cv ? cv.thumb : c.photo;          // legacy 回落
if (coverThumb) {
  var detailPhoto = el('img', { class:'detail-photo', src: coverThumb, alt: c.message||'', decoding:'async' });
  var dims = commitCoverDims(c); if (dims) { detailPhoto.setAttribute('width',dims.w); detailPhoto.setAttribute('height',dims.h); }
  card.appendChild(detailPhoto);
  if (cv && cv.blobId) resolveMediaBlob(cv.blobId).then(function (b) {   // 换全图（清晰）
    if (!b) return; var u = URL.createObjectURL(b);
    detailPhoto.src = u; detailPhoto.addEventListener('load', function once(){ /* keep */ });
  });
}
```
### 3.3 详情画廊（files 图片块）——缩略用 thumb，点开 `resolveMediaBlob` 全图
把画廊每格 `<img src=f.data>` 改为 `src = entry.thumb || entry.data`；点击/下载时 `resolveMediaBlob(entry.blobId)` 拿全图生成 objectURL（legacy 项无 blobId 则直接用 data）。

### 3.4 需要全分辨率的三处 → 改 async
- **导出画布 `buildCommitCardCanvas`(3446)**：画封面/图前 `resolveMediaBlob(cv.blobId)` 拿全图（legacy 用 data）。该函数本就返回 Promise（detail 的 exportThisCommit `.then`），把图加载并进 await 链即可。
- **现实对比(4003–4004)**：`background-image:url(thumb)` 先占位，`resolveMediaBlob` 拿全图后替换；**像素级 imageDiff 必须用全图**（3780 的 AI 解读同样），所以 diff 计算前 await 两边全图。
- 这三处**没有 blob 时**（跨设备未下载、离线）：导出/对比用 thumb 兜底并提示"为获得清晰结果请联网/在录制设备操作"。

### 3.5 回滚复制照片（4032/4158）
回滚生成新 commit 时，**复制 media[kind:photo] 引用（同一 blobId，不复制像素）**，而非复制 `photo` 字符串。同一 blobId 被多 commit 引用是安全的——**注意**：删除 commit 回收 blob 时，需确认无其它 commit 仍引用该 blobId（见 §6 坑）。

---

## 4. 同步瘦身——天然达成（验证为主）
照片不再内联 → `exportRaw()`（store.js 448，返回 `cache.commits`）里每个 commit 只剩 `media[].thumb`（小）+ `blobId`（短串），**不含全图 base64** → `Cloud.push` 的 jsonb 体积骤降。上传由 `syncMediaUp`(1036) **已自动**处理（遍历 `media[].blobId`，照片同样命中）。**本节无新代码，重在 §9 验证 jsonb 体积下降 + 照片确实进桶。**

---

## 5. 旧内联照片迁移（机会式 + 空闲分批，可回退）

### 5.1 单条迁移
```js
// 把一条 commit 的 legacy 内联照片转成 photo-media（全图入 blob + thumb 内联 + 剥 data）
function migrateCommitPhotos(c) {
  if (!c) return Promise.resolve(false);
  var jobs = [], newMedia = (c.media || []).slice();
  function addPhoto(dataUrl, dims, name, cover) {
    return dataUrlToBlob(dataUrl).then(function (blob) {
      return makeThumb(blob).then(function (tm) {
        var id = 'ph_' + Store.uid('p');
        return Store.putBlob(id, blob).then(function (ok) {
          if (ok) newMedia.push({ kind:'photo', cover:!!cover, blobId:id, thumb:tm.thumb||'',
            w:(dims&&dims.w)||tm.w, h:(dims&&dims.h)||tm.h, mime:blob.type||'image/jpeg', size:blob.size, name:name||'image.jpg' });
        });
      });
    });
  }
  if (c.photo && !photoMedia(c).some(function(m){return m.cover;}))
    jobs.push(addPhoto(c.photo, { w:c.photoW, h:c.photoH }, c.message||'cover.jpg', true));
  (c.files || []).filter(isImageFile).forEach(function (f) { jobs.push(addPhoto(f.data, { w:f.w, h:f.h }, f.name, false)); });
  if (!jobs.length) return Promise.resolve(false);
  return Promise.all(jobs).then(function () {
    var keepFiles = (c.files || []).filter(function (f) { return !isImageFile(f); }); // 非图片附件保留
    Store.updateCommit(c.id, { media:newMedia, photo:null, photoW:null, photoH:null, files:keepFiles });
    return true;
  });
}
```
### 5.2 空闲分批驱动
```js
function migrateInlinePhotos() {
  var pending = Store.commits().filter(function (c) {
    return c.photo || (c.files || []).some(isImageFile);   // 还有内联图片的
  });
  if (!pending.length) return;
  var i = 0;
  function step() {
    if (i >= pending.length) { autoSync(false); return; }   // 全部迁完再同步一次（推瘦身后的 jsonb）
    migrateCommitPhotos(pending[i++]).then(function () {
      (window.requestIdleCallback || function (f){ setTimeout(f, 400); })(step);
    });
  }
  step();
}
// boot 后台跑（render 之后、低优先级）；编辑保存某 commit 时也顺手 migrateCommitPhotos(它)
```
> **可回退/安全**：任一步 `putBlob` 失败则该 commit 不剥 `data`（updateCommit 不执行），保留旧内联，下次再试。迁移**不删图**，只搬位置。

---

## 6. 坑（务必读）
- **共享 blobId（回滚 §3.5）**：删 commit 时 store.js `deleteCommit`(350) 无条件回收其 `media[].blobId`。若回滚复制了同一 blobId，删原图会让副本失图。**对策**：回收前在 app 层 `deleteCommitWithCleanup`(952) 过滤掉"仍被其它 commit 引用"的 blobId（遍历 `Store.commits()` 的 media）；桶 `removeBlob` 同样加这层守卫。**本版必须加**。
- **thumb 必须够小**：THUMB_MAX=640、quality 0.7，单图 thumb ~20–50KB。多图存档的 jsonb = Σthumb，仍远小于旧全图；但别把 THUMB_MAX 调太大，否则瘦身打折。
- **导出/对比缺全图**：跨设备未下载或离线时，全图 `resolveMediaBlob` 返回 null → 用 thumb 兜底并提示，**不要**让导出/对比抛错。
- **CapacitorHttp**：沿用 v1.16，`enabled=false` 不动（Storage 走 supabase-js fetch）。
- **迁移与编辑并发**：空闲迁移与用户编辑同一 commit 可能撞车。`migrateCommitPhotos` 用 `Store.updateCommit`（按 id 局部 patch）降低风险；编辑保存路径优先，迁移失败重试即可。

---

## 7. i18n（zh 158 区 / en 317 区，媒体键旁）
```js
// zh
photo_save_fail: '照片保存失败', photo_fetching: '加载原图…', photo_need_online: '原图需联网或在录制设备查看',
// en
photo_save_fail: 'Photo save failed', photo_fetching: 'Loading full image…', photo_need_online: 'Full image needs network or the original device',
```

## 8. CSS
复用现有 `.detail-photo/.detail-gallery/.detail-image/.commit-img/.commit-thumb`；缩略图换源即可，无新布局。可加 `.detail-photo.is-thumb{filter:blur(0)}`（占位态可选）。

---

## 9. 验收清单（逐条过）

**新照片**
- [ ] 新建带封面 + 3 图：时间线即时显示（DevTools Network 无 blob 读取阻塞；全用 thumb）。
- [ ] 同步后：Supabase Storage `${uid}/ph_*` 出现全图；`archives.data` 行体积相比旧版**显著下降**（建一条含大图的存档对比迁移前后字节）。
- [ ] 详情封面先 thumb 后换全图（清晰）；画廊点开看全图；导出图为全分辨率。
- [ ] 现实对比/AI 解读：拿到全图、结果正常。

**跨设备**
- [ ] B 同账号登录同步：详情按需下载全图、缓存后秒开；时间线封面靠 thumb 即时（无需先下全图）。
- [ ] B 不同账号：取不到（RLS），详情大图回落 thumb、不报错。

**旧数据迁移**
- [ ] 含旧内联照片的存档：后台空闲任务跑完后，其 `media` 出现 photo 项、`photo/files(图)` 被剥、图仍可看；jsonb 瘦身。
- [ ] 迁移中途断电/失败：旧内联保留、图不丢，重启后继续迁。

**回收/共享**
- [ ] 删带图 commit：本机 blob + 桶对象回收。
- [ ] 回滚复制图后删原 commit：副本仍能看（共享 blobId 守卫生效，未误删）。

**回归/兼容**
- [ ] 未配置云：照片纯本地（blob 仓）可看、可导出、可备份恢复（`collectBackupBlobs` 含 photo blob）。
- [ ] ≤v1.16 老设备读新数据：封面 thumb 能显示，详情大图取不到时不崩。
- [ ] 桌面 `npm start` + Android APK 均过。

---

## 10. 发版（沿用既有铁律）
1. 版本号 1.16.0→1.17.0（package.json 3 / version.js 3 / index.html 11/41/42/43/44）。
2. `RELEASE_NOTES`(5019) 顶部加 1.17.0（zh/en）：
   - 照片改为「缩略图内联 + 全图进桶」：时间线即时显示，全图按需下载/缓存，**云同步体积大幅下降**（不再把整本相册塞进一行 jsonb）。
   - 复用 v1.16 媒体桶管道；旧照片在后台空闲时逐步迁移、期间照常可用；删除回收云端原图；回滚共享原图不重复占空间。
   - 不改表结构；备份导入完整含原图。
3. CHANGELOG.md 加 1.17.0。
4. 重点回归：§9 全表，尤其**共享 blobId 守卫**、**迁移可回退**、**跨设备/离线全图兜底**。先桌面双账号过，再 APK 真机。

---

## 11. 范围可收缩 / 之后
- **可收缩**（按"砍了最不疼"）：
  1. §3.4 导出/对比缺全图的兜底提示——先用 thumb 兜底即可，文案后补。
  2. **旧照片迁移（§5）**——可先只让**新照片**走新模型 + 所有读取点带 legacy 兜底（旧照片原样留 jsonb，体积不降但不坏）。迁移作为 v1.17.1 补。这能把首发风险降到最低。
  3. **最小可发版** = §1 thumb + §2 捕获新模型 + §3.1–3.3 读取（带兜底）+ §6 共享 blobId 守卫。瘦身对**新照片**即时生效；旧数据迁移随后。
- **之后**：① 非图片附件（PDF/文档）同样进桶（§0.4）；② 备份与桶收敛——备份可选"仅元数据 + thumb"（原图由桶做真相源），进一步缩小备份文件；③ 这之后 App 的捕获/消费/收敛/可信/可扩展全闭环，建议转入真实使用观察，不再加面。

> 一句话：**v1.16 让媒体跨得了设备，v1.17 让照片也卸下 jsonb 的包袱——同步从此随存档增长而不再变重。**
