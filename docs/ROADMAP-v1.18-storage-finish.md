# Life Archive v1.18.0 ·「存储收尾：捕获真瘦身 + 非图片附件进桶 + 孤儿 GC」实现文档

> 本应是个小收尾版，但核查 v1.17 实装时发现一个**必须先补的真缺口**，所以范围比预想略大——仍属"收尾/夯实"，不加新面。
> 基于当前 **1.17.0** 真实代码（已逐行核实下列锚点）。

---

## 0. 先讲清楚：v1.17 的真实状态（本版要修的核心）

核查实装后确认（证据为代码行，非推测）：
- **`doSave`(3090/3095) 无条件写 `payload.photo = draftPhoto`（内联封面 dataURL）+ `payload.files = draftFiles`（内联图片/附件）**，与 `media[]` 那份**并存**。
- `setPhoto`(2423) 既设 `draftPhoto`(内联预览) 又建 `draftCover`(media 管道) → **新封面同时存内联 + 桶两份**。
- 多图走 `addImageDataUrls`(2479) push 进 `draftFiles`(2491) → 内联 `files`；**`draftPhotos`(2260) 是死代码**（从未被 push，persist 的 3058 分支拿不到数据）。
- 编辑预填(2291-2300) **未** seed 封面/照片到 media 草稿 → 靠 `src.photo` 重填预览 → **编辑保存又内联回去**。
- `migrateInlinePhotos()` 只在**开机**跑(6598)。

**净效果**：照片瘦身只对**旧数据**生效；**新建/编辑的照片仍内联进 jsonb**（封面双重存储），要等下次重启被迁移任务清掉才"最终一致"。**v1.17 的目标对新内容实际没达成。**

→ 本版 §1 先把它真正收尾（捕获/编辑只写 `media[]`，永不内联），§2 再把非图片附件用同一套搬进桶（否则附件会重蹈覆辙），§3 补孤儿回收。

### 0.1 边界 / 不做
- ❌ 不加任何用户可见新功能；纯存储/同步收尾 + 可靠性。
- ❌ 不改桶/RLS/表结构（沿用 v1.16/17）。`CapacitorHttp.enabled=false` 不动。
- ✅ 全程 legacy 兜底：旧 commit（仍有 `c.photo`/`c.files`）继续可读，靠开机迁移逐步清。
- ✅ 可回退：任一 `putBlob` 失败则不剥内联、不丢数据。

### 0.2 验收闭环
新建带封面+2 图+1 个 PDF 的存档 → **保存后立刻看 DevTools：该 commit 的 jsonb 里 `photo` 为 null、`files` 为 []，全部在 `media[]`（photo×3 + file×1，仅 thumb/引用）** → 同步：Storage 出现 `${uid}/ph_*` 与 `${uid}/fl_*` → 详情：图片可看、PDF 可下载（按需 resolve）→ 编辑该 commit 再保存：**不产生内联、不重复上传**（沿用原 blobId）→ 设置「清理缓存」：孤儿 blob 被回收、计数归零 → 删除该 commit：本机 + 桶对象回收（共享 blobId 守卫生效）。

### 0.3 代码地图（当前 1.17.0 真实锚点）
| 位置 | 行号 | 改动 |
|---|---|---|
| 草稿变量 | 2247–2262 | `draftFiles` 语义改为"非图片附件草稿"；`draftPhotos` 启用 |
| 编辑/模板 seed | **2291–2300** | **新增**：从 `src.media` seed 封面/附加图/文件草稿（带 blobId 引用） |
| `setPhoto` | 2423–2456 | 保留（已建 draftCover）；`draftPhoto` 仅作预览，不再被持久化 |
| `addImageDataUrls` | **2479–2498** | 附加图改 push 进 `draftPhotos`（带 `_blob`+thumb），不再进 draftFiles |
| `addFiles` | **2692–2703** | 改存 `_blob`(File)+元数据，不再 FileReader 成内联 dataURL |
| 编辑文件列表渲染 | 2677 区 | 读 draftFiles 的 name/size（无 data 也可显示） |
| `persistDraftMedia` | **3018–3074** | 启用 draftPhotos 分支；**新增 file 分支**（media[kind:'file']） |
| `doSave` payload | **3086–3116** | **`photo:null, photoW/H:null, photoTakenAt:null, files:[]`**（全归 media[]） |
| 详情 文件区 | **2107–2123** | 读 `media[kind:'file']`(+legacy `c.files`)，下载经 `resolveMediaBlob` |
| `migrateCommitPhotos` | **1099–1122** | 泛化：非图片 `c.files` 也迁进 `media[kind:'file']`，`files:[]` |
| `migrateInlinePhotos` | **1123–1135** | 触发条件含"有非图片 files" |
| `deleteCommitWithCleanup` | **999–1019** | 桶守卫已有；**本机回收也要加引用守卫**（见 §3.2） |
| `Store.deleteCommit` | store.js **350** | 本机 blob 回收改为"引用感知"（或移到 app 层） |
| store.js | 434–445 区 | **新增 `Store.allBlobIds()`**（GC 枚举用） |
| GC（新增） | 顶层新函数 | `gcOrphanBlobs()` + 设置「清理缓存」按钮 + 空闲触发 |
| `RELEASE_NOTES` / 版本号 | 5300 区 / 5 处 | 1.17.0→1.18.0 |

---

## 1. 真正收尾照片（捕获/编辑只写 media[]，永不内联）

### 1.1 编辑/模板 seed 照片草稿（2300 后，紧跟 audio/video seed）
```js
if (src) {
  // …已有 mood/people/tags/audio/video/location seed…
  var srcPhotos = (src.media || []).filter(function (m) { return m.kind === 'photo'; });
  var cov = srcPhotos.filter(function (m) { return m.cover; })[0] || srcPhotos[0] || null;
  if (cov) {
    draftCover = { blobId: cov.blobId, thumb: cov.thumb, w: cov.w, h: cov.h, mime: cov.mime, size: cov.size, name: cov.name };
    draftPhoto = cov.thumb || null;           // 预览用 thumb（编辑界面够用；要全图可 resolve 后替换）
  } else if (src.photo) {                       // legacy 未迁移
    draftPhoto = src.photo;
    draftCover = null;                          // 走 §1.4 的 dataURL→media 转换
  }
  draftPhotos = srcPhotos.filter(function (m) { return m !== cov; }).map(function (m) {
    return { blobId: m.blobId, thumb: m.thumb, w: m.w, h: m.h, mime: m.mime, size: m.size, name: m.name };
  });
  var srcFiles = (src.media || []).filter(function (m) { return m.kind === 'file'; });
  draftFiles = srcFiles.map(function (m) { return { blobId: m.blobId, name: m.name, type: m.mime, size: m.size }; })
    .concat((src.files || []).filter(function (f) { return !isImageFile(f); })   // legacy 非图片
      .map(function (f) { return { id: Store.uid('f'), name: f.name, type: f.type, size: f.size, data: f.data }; }));
  // legacy 内联图片附件（未迁移）→ 暂存 dataURL，§1.4 在 persist 时转 media
  (src.files || []).filter(isImageFile).forEach(function (f) {
    draftPhotos.push({ data: f.data, name: f.name, w: f.w, h: f.h });   // 带 data、无 blobId → 视为"新图"
  });
}
```
> 关键：**已有照片/文件以 `blobId` 引用进草稿**（persist 时原样回写、不重传、不内联）；legacy 内联的以 `data` 进草稿（persist 时转 blob）。

### 1.2 附加图改进 draftPhotos（addImageDataUrls 2491）
把 2491 的 `draftFiles.push({…data…})` 改为产出**带 `_blob` + thumb** 的 draftPhotos 项：
```js
// entry.data 是 downscale 后的 dataURL；转 blob + thumb，纳入 media 管道
var dims = (entry.w && entry.h) ? { w: entry.w, h: entry.h } : null;
draftPhotos.push({ data: entry.data, name: imageFileName(entry), w: entry.w, h: entry.h, takenAt: entry.takenAt || null });
```
> 简化：这里仍可只放 `data`（dataURL），把"转 blob + makeThumb"统一放到 §1.4 的 persist（少改捕获路径，集中转换）。下面 §1.4 同时处理 `_blob` 和 `data` 两种来源。

### 1.3 `addFiles`（非图片附件，2692）——存 File，不内联
```js
function addFiles(fileLike) {
  Array.prototype.slice.call(fileLike || []).forEach(function (file) {
    if (file.size > 50 * 1024 * 1024) { toast((lang==='zh'?'文件过大（>50MB）：':'Too large (>50MB): ') + file.name); return; }
    draftFiles.push({ id: Store.uid('f'), name: file.name, type: file.type || '', size: file.size, _blob: file });
    renderFilesList();
    if (moreDetails) moreDetails.open = true;
  });
}
```
> `renderFilesList`(2677) 显示 name/size 即可（不依赖 data）。

### 1.4 `persistDraftMedia`——统一产出 photo/file media（3018–3074 重写后半段）
封面 `draftCover` 分支保留（3041–3056）。把**死的 draftPhotos 分支**(3058) 改为同时吃 `_blob` / `data` / `blobId`，并**新增 file 分支**：
```js
// ----- 附加 photos（draftPhotos：blobId 引用 / _blob 新 File / data 旧内联）-----
chain = chain.then(function () {
  return draftPhotos.reduce(function (p, dp) {
    return p.then(function () {
      if (dp.blobId && !dp._blob && !dp.data) {                 // 既有引用，原样回写
        media.push({ kind:'photo', cover:false, blobId:dp.blobId, thumb:dp.thumb, w:dp.w, h:dp.h, mime:dp.mime, size:dp.size, name:dp.name });
        return;
      }
      var blobP = dp._blob ? Promise.resolve(dp._blob) : dataUrlToBlob(dp.data);
      return blobP.then(function (blob) {
        return makeThumb(blob).then(function (tm) {
          var id = 'ph_' + Store.uid('p');
          return Store.putBlob(id, blob).then(function (ok) {
            if (ok) media.push({ kind:'photo', cover:false, blobId:id, thumb:dp.thumb||tm.thumb,
              w:dp.w||tm.w, h:dp.h||tm.h, mime:blob.type||'image/jpeg', size:blob.size, name:dp.name||'image.jpg' });
          });
        });
      });
    });
  }, Promise.resolve());
});

// ----- 非图片附件 file（draftFiles：blobId 引用 / _blob 新 File / data 旧内联）-----
chain = chain.then(function () {
  var media2 = media.filter(function (m) { return m.kind !== 'file'; });
  // 注意：起点 media 的 filter 也要把 'file' 排除（见下 prevMedia filter）
  return draftFiles.reduce(function (p, df) {
    return p.then(function () {
      if (df.blobId && !df._blob && !df.data) {
        media.push({ kind:'file', blobId:df.blobId, name:df.name, mime:df.type, size:df.size });
        return;
      }
      var blobP = df._blob ? Promise.resolve(df._blob) : dataUrlToBlob(df.data);
      return blobP.then(function (blob) {
        var id = 'fl_' + Store.uid('f');
        return Store.putBlob(id, blob).then(function (ok) {
          if (ok) media.push({ kind:'file', blobId:id, name:df.name, mime:df.type||blob.type, size:df.size||blob.size });
        });
      });
    });
  }, Promise.resolve());
});
```
> **起点 filter 同步更新**（3019 区）：`prevMedia.filter(m => m.kind!=='audio'&&m.kind!=='video'&&m.kind!=='photo'&&m.kind!=='file')`。删除草稿用 `coverDeletedBlobId`/`photoDeletedBlobIds`（已有）+ 文件删除同理记 id。

### 1.5 `doSave`——停止内联（3090–3095）
```js
photo: null, photoW: null, photoH: null, photoTakenAt: null,   // 封面归 media[kind:photo]
// …
files: [],                                                     // 附件归 media[kind:file]
```
> `photoTakenAt` 若仍想保留，挪进封面 media 项的 `takenAt`。`draftPhoto` 仅供表单预览，**不再进 payload**。

---

## 2. 详情：读 media 文件 + 下载（2107–2123）
```js
var fileMedia = (c.media || []).filter(function (m) { return m.kind === 'file'; });
var legacyFiles = (c.files || []).filter(function (f) { return !isImageFile(f); });   // 未迁移兜底
if (fileMedia.length || legacyFiles.length) {
  card.appendChild(el('div', { class: 'detail-section-title', text: L ? '文件' : 'Files' }));
  var fl = el('div', { class: 'detail-files' });
  fileMedia.forEach(function (m) {
    var ic = el('span', { class: 'file-ic' }); ic.innerHTML = UI_ICONS.file;
    var row = el('a', { class: 'detail-file', href: '#', download: m.name }, [ic,
      el('div', { class: 'file-meta' }, [el('span', { class:'file-name', text:m.name }),
        el('span', { class:'file-size', text:fmtBytes(m.size) })]),
      el('span', { class: 'file-dl', text: '⤓' })]);
    row.addEventListener('click', function (e) {
      e.preventDefault();
      resolveMediaBlob(m.blobId).then(function (b) {
        if (!b) { toast('⚠ ' + t('file_need_online')); return; }
        var url = URL.createObjectURL(b);
        var a = el('a', { href: url, download: m.name }); document.body.appendChild(a); a.click();
        a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      });
    });
    fl.appendChild(row);
  });
  legacyFiles.forEach(function (f) { /* 现有 href:f.data 的渲染原样保留 */ });
  card.appendChild(fl);
}
```

---

## 3. 孤儿 Blob 回收（GC）+ 本机回收引用守卫

### 3.1 store.js 新增枚举（434–445 区）
```js
allBlobIds: function () {
  if (!idb) return Promise.resolve([]);
  return new Promise(function (resolve) {
    try {
      var r = idb.transaction(IDB_BLOBS, 'readonly').objectStore(IDB_BLOBS).getAllKeys();
      r.onsuccess = function () { resolve(r.result || []); };
      r.onerror = function () { resolve([]); };
    } catch (e) { resolve([]); }
  });
}
```

### 3.2 本机回收引用守卫（修 v1.17 残留）
`Store.deleteCommit`(store.js 350) 当前**无条件** `idbDelBlob(m.blobId)`——若回滚共享了 blobId，删原 commit 会误删本机副本。改为引用感知：
```js
deleteCommit: function (id) {
  var c = this.getCommit(id);
  cache.commits = cache.commits.filter(function (x) { return x.id !== id; });   // 先移除
  if (c && c.media && idb) {
    var used = {};
    cache.commits.forEach(function (oc) { (oc.media||[]).forEach(function (m){ if(m&&m.blobId) used[m.blobId]=1; }); });
    c.media.forEach(function (m) { if (m && m.blobId && !used[m.blobId]) idbDelBlob(m.blobId); });
  }
  tombstone(id);
  persist();
}
```

### 3.3 GC sweep（app 层新增）
```js
function gcOrphanBlobs() {
  return Store.allBlobIds().then(function (keys) {
    if (!keys.length) return 0;
    var used = {};
    Store.commits().forEach(function (c) { (c.media||[]).forEach(function (m){ if(m&&m.blobId) used[m.blobId]=1; }); });
    var orphans = keys.filter(function (k) { return !used[k]; });
    // 桶里也清（在线+登录），并清掉 mediaUp 标记
    var u = Cloud.currentUser();
    return orphans.reduce(function (p, k) {
      return p.then(function () {
        markUploaded(k, false);
        if (u) Cloud.removeBlob(u.id + '/' + k);
        return Store.deleteBlob(k);
      });
    }, Promise.resolve()).then(function () { return orphans.length; });
  });
}
```
> **触发**：① 设置页「清理缓存」按钮（显示回收数）；② 迁移任务 `migrateInlinePhotos` 跑完后顺手调一次。**保守**：只在 `Store.init()` 完成、且非迁移进行中时跑，避免误删正在写入的 blob。

### 3.4 设置「清理缓存」按钮（accountCard 或数据卡）
```js
var gcBtn = el('button', { class: 'btn ghost tiny', text: L ? '清理缓存' : 'Clean up cache' });
gcBtn.addEventListener('click', function () {
  gcBtn.disabled = true; gcOrphanBlobs().then(function (n) {
    toast((L?'已清理 ':'Cleaned ') + n + (L?' 个无用文件':' orphaned blobs')); render();
  }).then(function(){ gcBtn.disabled = false; });
});
```

---

## 4. 迁移泛化（migrateCommitPhotos 1099）——非图片也搬
把 1115/1118 改为：图片→media[photo]、**非图片→media[file]**，最后 `files:[]`：
```js
(c.files || []).forEach(function (f) {
  if (isImageFile(f)) { jobs.push(addPhoto(f.data, { w:f.w, h:f.h }, f.name, false)); }
  else { jobs.push(dataUrlToBlob(f.data).then(function (blob) {
    var id = 'fl_' + Store.uid('f');
    return Store.putBlob(id, blob).then(function (ok) {
      if (ok) newMedia.push({ kind:'file', blobId:id, name:f.name, mime:f.type||blob.type, size:f.size||blob.size }); });
  })); }
});
// …updateCommit(c.id, { media:newMedia, photo:null, photoW:null, photoH:null, files:[] });
```
`migrateInlinePhotos` 触发条件(1124-1125)改为：`return c.photo || (c.files||[]).length;`（有任何内联 files 即迁）。

---

## 5. i18n / CSS
```js
// zh：file_need_online: '文件需联网或在原设备下载',  cache_clean: '清理缓存'
// en：file_need_online: 'File needs network or the original device',  cache_clean: 'Clean up cache'
```
CSS 复用 `.detail-files/.detail-file`，无新布局。

## 6. 验收清单
- [ ] **新建**带封面+2图+1 PDF：保存后 jsonb 中 `photo===null && files.length===0`，全部在 `media[]`（DevTools 确认）。
- [ ] 同步后 Storage 出现 `ph_*`(图) 与 `fl_*`(文件)；jsonb 行体积仅 thumb/引用级。
- [ ] **编辑**该 commit 再保存：不产生内联、`media` 里照片/文件沿用原 blobId（无重复上传，看 mediaUp 计数不暴涨）。
- [ ] 详情：图片可看、PDF 点击按需下载（离线给 `file_need_online`，不崩）。
- [ ] 旧 commit（带 c.photo/c.files）开机后被迁移：变 media、`photo/files` 清空、图与文件仍可用。
- [ ] 「清理缓存」：制造一个孤儿（删 commit 后留缓存的跨设备 blob 或失败迁移残留）→ 点按回收、计数正确、桶对象也清。
- [ ] 回滚共享 blobId 后删原 commit：副本仍可看（本机+桶守卫均生效）。
- [ ] 备份导出/导入：媒体（图/文件）经 `collectBackupBlobs`(media[].blobId) 完整往返。
- [ ] 桌面 + Android 均过；≤v1.17 老设备读新数据不崩。

## 7. 发版
1. 版本 1.17.0→1.18.0（package.json 3 / version.js 3 / index.html 4 处）。
2. `RELEASE_NOTES`：① 修复新建/编辑照片仍内联进云存档的问题——现在封面/多图/附件**保存即只存引用**，同步体积真正随存档增长而不再变重；② 非图片附件（PDF/文档）也进私有桶、跨设备可下载；③ 新增「清理缓存」回收无用文件；④ 回滚共享原图删除守卫。
3. CHANGELOG.md。
4. 回归重点：§6 全表，尤其**编辑不再内联**、**共享 blobId 双守卫**、**GC 不误删**。

## 8. 范围可收缩
1. §3 GC 的"桶侧清理"可后置（先只清本机孤儿）。
2. §2 文件下载的"离线提示"文案可后补。
3. **最小可发版** = §1（捕获/编辑只写 media、doSave 停内联）+ §2（文件读取）+ §4（迁移泛化）。GC（§3）可作 v1.18.1。这一刀下去，「同步瘦身」才对**新内容**真正成立——这是本版的真正价值。

> 一句话：**v1.17 把照片搬上了桶但忘了拔掉内联那根管子；v1.18 拔掉它、再把最后的附件也收进来、顺手扫掉孤儿——存储/同步架构到此真正闭环。**
