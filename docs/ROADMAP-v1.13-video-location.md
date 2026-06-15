# Life Archive v1.13.0 ·「视频 + 定位」实现文档（独立可执行）

> 主线仍是 **充分记录生活**。v1.11 铺了媒体地基（`blobs` 仓 + `media[]`），v1.12 上了立体维度四件套 + 语音。
> 本版收尾你最初圈定的维度集合：**视频（video）** + **定位（location）**。做完后「location, voice, video, people, mood, tags, custom_subject」**七维全部落地**。
> 本文档自带改动点、可粘贴代码、文件锚点（基于当前 **1.12.0** 代码）与坑，照着做即可。

> 🧭 **北极星**：视频是「会动的记忆」，定位是「在哪发生」。视频复用 v1.12 语音那套 `media[]` + `blobs` 管道（几乎对称），定位是搭 commit 顺风车的轻字段。**这版几乎不需要新原生权限**（拍视频用已声明的 CAMERA/RECORD_AUDIO；桌面录制用已就位的 Electron `media` 回调）。

---

## 0. 总览

### 0.1 本版做两件事
1. **视频**：表单里加一段视频（拍/选）→ 存进 v1.11 的 `blobs` 仓 → commit 上挂 `media[kind:'video']`（带 `poster` 封面帧、`dur`、`w/h`）。时间线显示封面 + ▶ 角标，详情页可播放。
2. **定位**：`commit.location = {lat,lng,label}`，轻字段。可「📍取当前位置」或手填地点名；详情可点开地图。

> 视频 = v1.12 语音的「放大版」：同样的 `draft* → putBlob → media[] → getBlob 回放 → deleteCommit 自动回收` 闭环，只是多了**封面帧抽取**和**体积护栏**。定位 = v1.12 人物/心情那样的纯字段，`addCommit/updateCommit` 整对象写入即随云走。

### 0.2 ⚠️ 一条必须先讲清的边界：大媒体不走云，只走备份
当前云同步 `cloudSync`(978) 推的是 `Store.exportRaw()`（commits/branches/tombstones/customScenes），**不含 `blobs` 仓的 Blob 本体**。所以：
- **语音（v1.12）和视频（本版）的 Blob 不通过云在设备间同步**——跨设备只同步到 `media[]` 引用，另一台机 `getBlob` 取不到就显示「文件缺失」占位。
- Blob 真正的搬运通道是 **v1.11 的备份导出/导入**（`collectBackupBlobs` 打成 base64 进 `data.blobs`）。
- 视频体积大，**不要**幻想塞进 Supabase 单行 `jsonb`（会爆行上限）。真正的「云端媒体」要等 **Supabase Storage 桶**（v1.11 已写设计，仍 deferred）——这才是维度收官后的**下一根柱**（见 §8）。

> 本版照实现：视频/语音在**本机**完整可用、可备份恢复；**跨设备靠备份文件**。详情页对缺失 Blob 必须优雅占位，不能崩。

### 0.3 验收闭环（端到端）
新建存档 → 拍/选一段 12 秒视频（自动出封面帧）→「📍取当前位置」或填「外婆家」→ 存档 → 时间线卡显示视频封面 + ▶ → 点开详情能播放、能看到 📍地点（可点开地图）→ 编辑可重选/删除视频 → 删除该 commit 后 `blobs` 仓里视频 Blob 被回收 → 导出备份再导入空库，视频可播、定位还在。
**这条链顺畅 = 七维收官。**

### 0.4 代码地图（当前 1.12.0 真实锚点）
| 位置 | 行号 | 作用 |
|---|---|---|
| `I18N.zh` / `en` | 新键插在 `saved_value_prefix` 前（zh **161** / en **314**） | 文案 |
| `commitThumbSrc` / `commitImageEntries` / `commitCoverDims` / `timelineMediaAttrs` | 391 / 398 / 411 / 416 | **视频封面帧接进时间线封面** |
| `fmtDur(s)` | 1167（顶层助手） | 复用，显示视频时长 |
| `commitMatches(c,q)` | 1292（已含 people/tags） | **扩到 location.label** |
| 时间线卡封面 | `thumbSrc` 1550 / `media` 构建 1572–1608 / 装配 1659 | **▶ 角标 + 视频封面** |
| `renderDetail` 媒体区 | files 1840–1871、**audio 1872–1884**、notes 1885 | **video 块插在 audio 后、location 插在 notes 后** |
| `renderCommitForm` | draft 区 1951、`moreDetails` 2560–2568、`persistDraftMedia` 2574–2593、`doSave` payload 2605–2624、`photoTools` 2668、表单装配 2674–2694 | 视频/定位 UI + 落仓 |
| `makeRecorder` | 2498 | （可选）in-app 录像复用此模式 |
| `RELEASE_NOTES` | 4829 | 发版加一条 |
| `collectBackupBlobs` | 4547 | 已打包所有 `media[].blobId` → 视频自动进备份（**注意体积**） |
| `Cloud.pull/push` / `cloudSync` | 766 / 770 / 978 | 只同步 `exportRaw`（无 Blob）——边界见 §0.2 |

**store.js（当前）**：`putBlob/getBlob/deleteBlob`(410–421)、`deleteCommit`(326，按 `media[].blobId` 回收 → 视频自动)、`exportRaw`(424，已带 customScenes)、`addCommit/updateCommit`（整对象写入 → location 自动持久化）。**本版 store.js 0 改动。**

**main.js**：`setPermissionRequestHandler`(88–90，已放行 `media`/`audioCapture`)——**定位加一个 `geolocation`**。
**scripts/set-android-version.mjs**：CAMERA(227)、RECORD_AUDIO(235) 已注入（视频无需新增）——**定位加 ACCESS_FINE/COARSE_LOCATION**。

### 0.5 commit 形状（本版新增/复用的键）
```js
{
  // ...已有: scene, message, photo, items, files, notes, mood, people, tags...
  media: [
    { kind: 'audio', blobId: 'au_x', mime: 'audio/webm', size: 81234, dur: 8.4 },   // v1.12
    { kind: 'video', blobId: 'vd_y', mime: 'video/mp4',  size: 5_400_000,           // ← 本版
      dur: 12.3, w: 1080, h: 1920, poster: 'data:image/jpeg;base64,...' }           // poster=小封面帧
  ],
  location: { lat: 31.23, lng: 121.47, acc: 18, label: '外婆家', at: 1733600000000 } // ← 本版（任意子集，可仅 label）
}
```
- `media[kind:'video']`：Blob 进 `blobs` 仓，commit 只存引用 + **小封面帧 `poster`（内联 dataURL，几 KB）**，时间线不必取 Blob 就能画封面。
- `location`：纯字段，搭 commit 顺风车，**0 行 store 改动**；任意子集合法（只填了地点名就只有 `label`）。

**确认存在、会用到的真实助手**（别另造）：`el/$`、`toast`、`labeled`/`labeledBlock`(2706/2711)、`fmtDur`(1167)、`fmtBytes`、`Store.putBlob/getBlob/deleteBlob`、`Store.uid`、`commit.media[]`/`persistDraftMedia` 模式（v1.12）、`commitThumbSrc`/`commitCoverDims`。

---

## 1. 视频（v1.12 语音管道的放大版）

> 拍/选视频 → 抽封面帧 + 元数据 → 存 `blobs` 仓 → `media[kind:'video']`。时间线显示封面 + ▶，详情播放。**baseline 用文件输入 `<input capture>`**（三端通吃、零额外权限、自动用系统相机编码），in-app 录像列为可选（§1.7）。

### 1.1 为什么 baseline 选「文件输入 capture」而不是 in-app `MediaRecorder`
| 方案 | Android(APK) | 桌面 Electron | 风险 |
|---|---|---|---|
| `<input type=file accept=video/* capture>` | 直接唤起系统相机录像/选取，mp4、自动处理旋转 | 弹文件选择器（选已有视频） | **低**，复用现成 file input 模式 |
| in-app `getUserMedia`+`MediaRecorder` | 需实时预览 UI + 处理朝向；webm | 可录，webm | 中高（朝向/预览/兼容） |

→ baseline = 文件输入；想要「应用内录像」体验再加 §1.7（可收缩）。封面帧/元数据/落仓逻辑两条路径**完全共用**。

### 1.2 草稿态 + 元数据/封面帧抽取（renderCommitForm，draft 区 1951 附近）
```js
var draftVideo = null;          // 新选: {_blob, mime, size, dur, w, h, poster}；编辑沿用: {blobId,...同字段}
var videoDeletedBlobId = null;  // 编辑时删除旧视频 → 存档时回收
(function seedVideo() {
  var v0 = src && (src.media || []).filter(function (x) { return x.kind === 'video'; })[0];
  if (v0) draftVideo = { blobId: v0.blobId, mime: v0.mime, size: v0.size, dur: v0.dur, w: v0.w, h: v0.h, poster: v0.poster };
})();

var VIDEO_WARN_BYTES = 60 * 1024 * 1024;   // >60MB 提醒（IndexedDB 放得下，但备份会很大）

// 从一个视频 Blob 抽 {dur,w,h,poster}。poster 缩到 ≤640 宽的 jpeg dataURL（几 KB）。
function probeVideo(blob) {
  return new Promise(function (resolve) {
    var url = URL.createObjectURL(blob);
    var vid = document.createElement('video');
    vid.preload = 'metadata'; vid.muted = true; vid.playsInline = true; vid.src = url;
    var done = false;
    function finish(meta) { if (done) return; done = true; URL.revokeObjectURL(url); resolve(meta); }
    vid.onloadedmetadata = function () {
      var dur = isFinite(vid.duration) ? Math.round(vid.duration * 10) / 10 : 0;
      var w = vid.videoWidth || 0, h = vid.videoHeight || 0;
      // 跳到 ~0.1s 抓一帧当封面（0 帧常是黑场）
      var seekTo = Math.min(0.1, (vid.duration || 1) / 2);
      vid.onseeked = function () {
        try {
          var scale = w ? Math.min(1, 640 / w) : 1;
          var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
          var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
          cv.getContext('2d').drawImage(vid, 0, 0, cw, ch);
          finish({ dur: dur, w: w, h: h, poster: cv.toDataURL('image/jpeg', 0.7) });
        } catch (e) { finish({ dur: dur, w: w, h: h, poster: '' }); }   // 跨域/受保护帧 → 无封面
      };
      try { vid.currentTime = seekTo; } catch (e) { finish({ dur: dur, w: w, h: h, poster: '' }); }
    };
    vid.onerror = function () { finish({ dur: 0, w: 0, h: 0, poster: '' }); };
    setTimeout(function () { finish({ dur: 0, w: 0, h: 0, poster: '' }); }, 8000); // 兜底，别卡死保存
  });
}
```

### 1.3 选取/拍摄 UI（放进 `moreDetails`，紧挨语音 `audioBox` 2566）
一个隐藏文件输入 + 三态盒子（未选 / 处理中 / 已选带封面+时长+删除）：
```js
var videoBox = el('div', { class: 'video-box' });
var videoInput = el('input', { type: 'file', accept: 'video/*', capture: 'environment',
  class: 'hidden-file' });          // 复用 .hidden-file（与照片 fileInput 同款隐藏样式）
videoInput.addEventListener('change', function () {
  var f = videoInput.files && videoInput.files[0];
  videoInput.value = '';            // 允许重选同一文件
  if (!f) return;
  if (f.size > VIDEO_WARN_BYTES) toast('⚠ ' + t('video_big'));
  renderVideo('busy');
  probeVideo(f).then(function (meta) {
    draftVideo = { _blob: f, mime: f.type || 'video/mp4', size: f.size,
      dur: meta.dur, w: meta.w, h: meta.h, poster: meta.poster };
    renderVideo('done');
  });
});
function renderVideo(state) {
  videoBox.innerHTML = '';
  videoBox.appendChild(videoInput);
  if (state === 'busy') { videoBox.appendChild(el('span', { class: 'video-busy', text: t('video_processing') })); return; }
  if (draftVideo) {
    var thumb = el('div', { class: 'video-thumb' + (draftVideo.poster ? '' : ' no-poster') });
    if (draftVideo.poster) thumb.style.backgroundImage = 'url(' + draftVideo.poster + ')';
    thumb.appendChild(el('span', { class: 'video-play', text: '▶' }));
    var del = el('button', { class: 'btn ghost tiny', type: 'button', text: '🗑 ' + t('video_delete') });
    del.addEventListener('click', function () {
      if (draftVideo && draftVideo.blobId && !draftVideo._blob) videoDeletedBlobId = draftVideo.blobId;
      draftVideo = null; renderVideo('idle');
    });
    videoBox.appendChild(el('div', { class: 'video-done' }, [thumb,
      el('span', { class: 'video-meta', text: fmtDur(draftVideo.dur || 0) + ' · ' + fmtBytes(draftVideo.size || 0) }), del]));
    return;
  }
  var pick = el('button', { class: 'btn ghost', type: 'button', text: '🎬 ' + t('video_add') });
  pick.addEventListener('click', function () { videoInput.click(); });
  videoBox.appendChild(pick);
}
renderVideo('idle');
// 装进 moreDetails（语音那行下面）：labeledBlock('🎬 ' + t('video'), videoBox)
```

### 1.4 落仓：扩展 `persistDraftMedia`（2574）同时处理 audio + video
把现有只管 audio 的版本，泛化成「按 kind 各处理一份」：
```js
function persistDraftMedia(prevMedia) {
  // 起点：保留其它 kind（本版只有 audio/video，这样写也为将来留口）
  var media = (prevMedia || []).filter(function (m) { return m.kind !== 'audio' && m.kind !== 'video'; });
  var dels = [];
  if (audioDeletedBlobId) dels.push(Store.deleteBlob(audioDeletedBlobId));
  if (videoDeletedBlobId) dels.push(Store.deleteBlob(videoDeletedBlobId));

  var chain = Promise.all(dels);

  // ----- audio（沿用 v1.12 逻辑）-----
  chain = chain.then(function () {
    if (draftAudio && !draftAudio._blob && draftAudio.blobId) {
      media.push({ kind: 'audio', blobId: draftAudio.blobId, mime: draftAudio.mime, size: draftAudio.size, dur: draftAudio.dur });
      return;
    }
    if (draftAudio && draftAudio._blob) {
      var aId = 'au_' + Store.uid('a');
      return Store.putBlob(aId, draftAudio._blob).then(function (ok) {
        if (ok) media.push({ kind: 'audio', blobId: aId, mime: draftAudio.mime, size: draftAudio.size, dur: draftAudio.dur });
        else toast('⚠ ' + t('voice_save_fail'));
      });
    }
  });

  // ----- video（本版新增，结构对称）-----
  chain = chain.then(function () {
    if (draftVideo && !draftVideo._blob && draftVideo.blobId) {
      media.push({ kind: 'video', blobId: draftVideo.blobId, mime: draftVideo.mime, size: draftVideo.size,
        dur: draftVideo.dur, w: draftVideo.w, h: draftVideo.h, poster: draftVideo.poster });
      return;
    }
    if (draftVideo && draftVideo._blob) {
      var vId = 'vd_' + Store.uid('v');
      return Store.putBlob(vId, draftVideo._blob).then(function (ok) {
        if (ok) media.push({ kind: 'video', blobId: vId, mime: draftVideo.mime, size: draftVideo.size,
          dur: draftVideo.dur, w: draftVideo.w, h: draftVideo.h, poster: draftVideo.poster });
        else toast('⚠ ' + t('video_save_fail'));
      });
    }
  });

  return chain.then(function () { return media; });
}
```
> `doSave`(2595) 不动——它已经 `persistDraftMedia(...).then(media => payload.media = media)`。删 commit 时 `deleteCommit`(326) 按 `media[].blobId` 回收，视频 Blob 自动清，无孤儿。

### 1.5 时间线封面 + ▶ 角标
**(a) 让封面 helper 认识视频封面帧（391–414）**：
```js
function videoMedia(c) { return (c && c.media || []).filter(function (m) { return m.kind === 'video'; })[0] || null; }

function commitThumbSrc(c) {
  var img = firstImageFile(c.files);
  var v = videoMedia(c);
  return c.photo || (img && img.data) || (v && v.poster) || '';   // ← 视频封面兜底
}
function commitCoverDims(c) {
  if (c.photo) return (c.photoW && c.photoH) ? { w: c.photoW, h: c.photoH } : null;
  var img = firstImageFile(c.files);
  if (img && img.w && img.h) return { w: img.w, h: img.h };
  var v = videoMedia(c);                                            // ← 视频用其 w/h 占位
  return (v && v.w && v.h) ? { w: v.w, h: v.h } : null;
}
```
**(b) 在卡片封面叠 ▶ 角标（media 构建处 1583 之后）**：
```js
// media = el('div', timelineMediaAttrs(coverDims), [img, starBtn]); 之后：
if (videoMedia(c)) media.appendChild(el('span', { class: 'commit-video-badge', text: '▶' }));
```
> 视频与图片同用 `.commit-media` 封面框（封面帧是张 jpeg），所以排版/盒子复用、零额外布局逻辑；只多一个角标。`subKids`(1610) 也可顺手加「🎬」标记（可选）。

### 1.6 详情页播放（renderDetail，audio 块 1884 之后）
```js
var videoM = (c.media || []).filter(function (m) { return m.kind === 'video'; })[0];
if (videoM) {
  card.appendChild(el('div', { class: 'detail-section-title', text: '🎬 ' + t('video') }));
  var vp = el('video', { class: 'detail-video', controls: 'controls', preload: 'none', playsinline: 'playsinline' });
  if (videoM.poster) vp.setAttribute('poster', videoM.poster);
  if (videoM.w && videoM.h) { vp.setAttribute('width', videoM.w); vp.setAttribute('height', videoM.h); }
  card.appendChild(el('div', { class: 'detail-videowrap' }, [vp,
    el('span', { class: 'file-size', text: fmtDur(videoM.dur || 0) + ' · ' + fmtBytes(videoM.size || 0) })]));
  Store.getBlob(videoM.blobId).then(function (b) {
    if (!b) {                                  // 跨设备无 Blob（见 §0.2）→ 用封面 + 缺失提示，不崩
      vp.replaceWith(el('div', { class: 'video-missing' }, [
        videoM.poster ? el('img', { class: 'detail-image', src: videoM.poster, alt: '' }) : null,
        el('div', { class: 'commit-notes', text: t('video_missing') })]));
      return;
    }
    var url = URL.createObjectURL(b);
    vp.src = url;
    vp.addEventListener('emptied', function () { URL.revokeObjectURL(url); });
  });
}
```

### 1.7 （可选 / 可收缩）应用内录像
想要「不跳系统相机、应用内直接录」：复用 `makeRecorder`(2498) 模式，约束改成 `getUserMedia({ video: { facingMode:'environment' }, audio: true })`，加一个 `<video autoplay muted playsinline>` 实时预览，`MediaRecorder` 选 `video/webm;codecs=vp8,opus`，停止后同样得到 Blob → 走 §1.2 的 `probeVideo` + §1.4 落仓。**朝向/预览/老设备兼容**是坑，baseline 已能用，建议放下一版。

### 1.8 权限：本版**无新增**
- **Android**：拍视频经 `<input capture>` 唤起系统相机，用已声明的 **CAMERA**(set-android-version 227) + **RECORD_AUDIO**(235)；选取本地视频不需权限。✅ 不用动 manifest（视频部分）。
- **桌面 Electron**：选视频文件无需权限；若做 §1.7 in-app 录像，`main.js`(88) 已放行 `media`，够用。✅

### 1.9 体积护栏（务必读）
- IndexedDB 存大视频没问题，但 **v1.11 备份 `collectBackupBlobs`(4547) 会把每个视频 base64 进 `data.blobs`**——几条视频就能让备份文件到几百 MB。本版先做：选取超 `VIDEO_WARN_BYTES`(60MB) 时 toast 提醒（§1.3）。
- **建议（可选）**：设置页给个「备份时包含视频」开关，默认开；关掉时 `collectBackupBlobs` 跳过 `kind:'video'` 的 blobId，备份瘦身（视频仅留本机）。一行 filter 的事，列入可收缩。
- 云端：重申 §0.2，**视频不进云**。详情页对缺失 Blob 已优雅占位。

---

## 2. 定位（轻字段，搭 commit 顺风车）

> `commit.location = {lat,lng,acc,label,at}`，纯字段、**0 行 store 改动**。设计成「手填地点名 **或** 一键取 GPS」二选一/二者皆可——这样桌面（Electron 定位常不可用）也能用，手机能精确。

### 2.1 设计要点 & 优雅降级
- **隐私**：定位**永远 opt-in**，只在用户点「📍取当前位置」时才请求；不自动后台取。
- **离线优先**：不做联网逆地理编码（不引地图 API、不上传坐标）。`label` 由用户手填；有坐标就额外存 `lat/lng`，详情可点开外部地图。
- **桌面降级**：Electron 的 `navigator.geolocation` 常需 Google API key 才能真正定位，多半失败 → 失败时**静默回落到「手填地点名」**，不报错打断。
- 任意子集合法：只填名字 → `{label}`；只取了 GPS → `{lat,lng,acc,at}`；都做 → 全有。

### 2.2 表单 UI（放进 `moreDetails`，定位单独一行）
```js
var draftLocation = (src && src.location) ? {
  lat: src.location.lat, lng: src.location.lng, acc: src.location.acc,
  label: src.location.label || '', at: src.location.at
} : null;

var locLabel = el('input', { class: 'loc-label', type: 'text', placeholder: t('loc_ph'),
  value: (draftLocation && draftLocation.label) || '' });
var locCoord = el('span', { class: 'loc-coord' });
function renderLocCoord() {
  locCoord.textContent = (draftLocation && draftLocation.lat != null)
    ? '📍 ' + draftLocation.lat.toFixed(4) + ', ' + draftLocation.lng.toFixed(4)
      + (draftLocation.acc ? ' ±' + Math.round(draftLocation.acc) + 'm' : '')
    : '';
}
renderLocCoord();

var gpsBtn = el('button', { class: 'btn ghost tiny', type: 'button', text: '📍 ' + t('loc_use') });
gpsBtn.addEventListener('click', function () {
  if (!navigator.geolocation) { toast('⚠ ' + t('loc_unsupported')); return; }
  gpsBtn.disabled = true; gpsBtn.textContent = '… ' + t('loc_locating');
  navigator.geolocation.getCurrentPosition(function (pos) {
    draftLocation = draftLocation || {};
    draftLocation.lat = pos.coords.latitude;
    draftLocation.lng = pos.coords.longitude;
    draftLocation.acc = pos.coords.accuracy;
    draftLocation.at = Date.now();
    renderLocCoord();
    gpsBtn.disabled = false; gpsBtn.textContent = '📍 ' + t('loc_use');
    toast('📍 ' + t('loc_got'));
  }, function (err) {
    gpsBtn.disabled = false; gpsBtn.textContent = '📍 ' + t('loc_use');
    toast('⚠ ' + t('loc_denied'));     // 桌面常走到这；用户仍可手填名字
    console.warn('[loc] ' + (err && err.code) + ' ' + (err && err.message));
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
});
var clearBtn = el('button', { class: 'btn ghost tiny', type: 'button', text: '✕' });
clearBtn.addEventListener('click', function () { draftLocation = null; locLabel.value = ''; renderLocCoord(); });

var locationBox = el('div', { class: 'loc-box' }, [locLabel,
  el('div', { class: 'loc-row' }, [gpsBtn, clearBtn, locCoord])]);
// 装进 moreDetails：labeledBlock('📍 ' + t('location'), locationBox)
```

### 2.3 `doSave` payload（2605 区）——加 `location`
```js
var lbl = locLabel.value.trim();
var hasLoc = lbl || (draftLocation && draftLocation.lat != null);
var payload = {
  // ...已有字段 + media...
  location: hasLoc ? {
    label: lbl || null,
    lat: draftLocation ? draftLocation.lat : null,
    lng: draftLocation ? draftLocation.lng : null,
    acc: draftLocation ? draftLocation.acc : null,
    at: draftLocation ? draftLocation.at : null
  } : null
};
```
> `addCommit/updateCommit` 整对象写入 → 自动持久化 + 随 `exportRaw` 进云/备份。**store.js 不用动。**

### 2.4 详情页展示 + 地图链接（renderDetail，notes 块 1885 后）
```js
function geoMapUrl(loc) {
  if (!loc || loc.lat == null) return null;
  var la = loc.lat, lo = loc.lng;
  return 'https://www.openstreetmap.org/?mlat=' + la + '&mlon=' + lo + '#map=16/' + la + '/' + lo;
}
if (c.location && (c.location.label || c.location.lat != null)) {
  card.appendChild(el('div', { class: 'detail-section-title', text: '📍 ' + t('location') }));
  var url = geoMapUrl(c.location);
  var text = (c.location.label || '')
    + (c.location.lat != null ? (c.location.label ? ' · ' : '') + c.location.lat.toFixed(4) + ', ' + c.location.lng.toFixed(4) : '');
  if (url) {
    card.appendChild(el('a', { class: 'detail-link-btn btn ghost', href: url, target: '_blank',
      rel: 'noopener', text: '🗺 ' + text }));   // Capacitor 下外链走系统浏览器
  } else {
    card.appendChild(el('div', { class: 'commit-notes', text: '📍 ' + text }));
  }
}
```
> 时间线卡可选在 `subKids`(1610) 加一节 `c.location && c.location.label ? '📍'+label : null`（可收缩）。

### 2.5 搜索：`commitMatches`（1292）扩到地点名
```js
var hay = [c.message || '', c.notes || '', sc.zh, sc.en]
  .concat((c.items || []).map(function (it) { return it.name; }))
  .concat(c.people || [])
  .concat((c.tags || []).map(function (t) { return '#' + t; }))
  .concat(c.location && c.location.label ? [c.location.label] : [])   // ← 新增
  .join(' ').toLowerCase();
```

### 2.6 权限

**(a) Android —— `scripts/set-android-version.mjs`** 仿 CAMERA/RECORD_AUDIO(227/235) 加定位（粗+细）：
```js
if (!m.includes('android.permission.ACCESS_FINE_LOCATION')) {
  m = m.replace('</manifest>',
    '    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n' +
    '    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />\n</manifest>');
  console.log('AndroidManifest -> added location permissions');
}
```
> Capacitor 的 WebChromeClient 实现了 `onGeolocationPermissionsShowPrompt`，声明权限后 WebView 里的 `navigator.geolocation` 会弹系统授权框。**坑**：若手机上从不弹定位授权，多半是权限没注入成功，或需改用 `@capacitor/geolocation` 插件——baseline 先用浏览器 API，插件列为后备。

**(b) 桌面 Electron —— `main.js`(88)** 现有回调放行 `media`，加上 `geolocation`：
```js
session.defaultSession.setPermissionRequestHandler(function (wc, permission, cb) {
  cb(permission === 'media' || permission === 'audioCapture' || permission === 'geolocation');
});
```
> 即便放行，Electron 实际定位常因无 Google API key 而失败 → 走 §2.1 的「手填地点名」降级，**这是预期行为，不是 bug**。

---

## 3. i18n（新键插在 `saved_value_prefix` 前：zh **161** / en **314**）

```js
// zh
video: '视频', video_add: '加视频', video_delete: '删除', video_processing: '处理中…',
video_missing: '视频文件缺失（仅在录制设备上，或用备份恢复）', video_save_fail: '视频保存失败',
video_big: '视频较大，备份文件会显著变大',
location: '地点', loc_ph: '在哪？填地点名', loc_use: '取当前位置', loc_locating: '定位中…',
loc_got: '已记录位置', loc_denied: '定位失败，可手填地点名', loc_unsupported: '此设备不支持定位',

// en
video: 'Video', video_add: 'Add video', video_delete: 'Delete', video_processing: 'Processing…',
video_missing: 'Video file missing (only on the recording device, or restore from backup)', video_save_fail: 'Video save failed',
video_big: 'Large video — your backup file will grow a lot',
location: 'Location', loc_ph: 'Where? Add a place name', loc_use: 'Use current location', loc_locating: 'Locating…',
loc_got: 'Location saved', loc_denied: 'Location failed — type a place instead', loc_unsupported: 'Location not supported here',
```

---

## 4. CSS（`css/styles.css`，新增；本版无破坏性改动）

```css
/* 视频：表单缩略 + 时间线角标 + 详情播放器 */
.video-box { display: flex; flex-direction: column; gap: 6px; }
.video-done { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.video-thumb { position: relative; width: 96px; height: 64px; border-radius: 10px;
  background: #000 center/cover no-repeat; flex: 0 0 auto; }
.video-thumb.no-poster { background: rgba(127,127,127,.18); }
.video-thumb .video-play, .commit-video-badge { position: absolute; }
.video-thumb .video-play { inset: 0; display: grid; place-items: center; color: #fff;
  font-size: 22px; text-shadow: 0 1px 4px rgba(0,0,0,.6); }
.video-busy, .video-meta { font-size: 13px; opacity: .75; }

.commit-media { position: relative; }   /* 若已有定位属性可省 */
.commit-video-badge { left: 8px; bottom: 8px; width: 30px; height: 30px; border-radius: 50%;
  display: grid; place-items: center; color: #fff; font-size: 13px;
  background: rgba(0,0,0,.55); backdrop-filter: blur(2px); pointer-events: none; }

.detail-videowrap { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
.detail-video { max-width: 100%; border-radius: 12px; background: #000; }
.video-missing { display: flex; flex-direction: column; gap: 6px; }

/* 定位 */
.loc-box { display: flex; flex-direction: column; gap: 6px; }
.loc-label { width: 100%; padding: 8px 10px; border-radius: 10px; border: 1px solid var(--border, rgba(127,127,127,.25));
  background: var(--card-2, rgba(127,127,127,.08)); color: inherit; font-size: 14px; }
.loc-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.loc-coord { font-size: 13px; opacity: .7; }
```

---

## 5. 验收清单（做完逐条过）

**桌面 / 浏览器**
- [ ] 新建：加一段视频 → 表单出现封面缩略 + 时长；填地点名「外婆家」→ 保存。
- [ ] 时间线：该卡显示视频封面 + ▶ 角标（无照片时也成立）。
- [ ] 详情：视频可播放；显示 📍地点；有坐标时「🗺」可点开地图。
- [ ] 编辑：视频可删除/重选；地点名可改、可✕清空并保存。
- [ ] 删除该 commit：`blobs` 仓里 `vd_*` 被回收（DevTools → Application → IndexedDB 无残留）。
- [ ] 导出备份 → 导入空库：视频可播、定位还在（走 §0.2 base64 路径）。
- [ ] 桌面点「📍取当前位置」失败时给 `loc_denied` toast，**不打断**，仍能手填名字保存。
- [ ] 超大视频（>60MB）保存时弹 `video_big` 提醒但仍可存。

**Android（APK）**
- [ ] 「🎬加视频」唤起系统相机/选取；录完回到表单出封面。
- [ ] 「📍取当前位置」首次弹系统定位授权；授权后详情显示坐标。
- [ ] 同一条 commit 里 视频 + 语音 + 照片 + 定位 可共存。
- [ ] 跨设备（同账号云同步）：另一台只显示视频封面 + 「视频文件缺失」占位（符合 §0.2），不崩。

---

## 6. 发版（沿用既有铁律）

1. **版本号**：`package.json`、`js/version.js`、`index.html` 5 处 `?v=` 全部 **1.12.0 → 1.13.0**（CSS 1 + version/store/diff/app 4）。
2. **RELEASE_NOTES**(4829) 顶部加 1.13.0（zh/en）：视频 + 定位，七维收官。
3. **CHANGELOG.md** 加 1.13.0 段。
4. **Android 权限**：确认 CI 跑 `set-android-version.mjs` 注入了 ACCESS_FINE/COARSE_LOCATION（§2.6a）；视频复用已有 CAMERA/RECORD_AUDIO，无新增。
5. **桌面权限**：`main.js`(88) 回调补 `geolocation`（§2.6b）。
6. 先 `npm start` 桌面过 §5 桌面清单，再 push 触发 APK 过 Android 清单。

---

## 7. 不要做 / 边界

- ❌ 不动 Supabase 表结构（仍单行 `jsonb`）。**视频/语音 Blob 不进云**，靠备份搬运（§0.2）。
- ❌ 不引地图/逆地理编码/上传坐标的第三方服务——离线优先，地点名手填，地图用外链。
- ❌ baseline 不做应用内录像（§1.7 为可选拓展）。
- ❌ 不在时间线列表里塞 `<video>`（只详情播；列表只用封面帧 + ▶ 角标）。
- ❌ 不引第三方视频/上传库；`<input capture>` + `Store.putBlob` 足够。
- ❌ store.js / `mergeData` 不动（视频是 Blob+引用、定位是 commit 字段，都走现成管道）。

### 范围可收缩（要更快发）
按「砍了最不疼」排序：
1. **§1.7 应用内录像**——baseline 用系统相机已可用，最先砍（本就没在 baseline 里）。
2. **§1.9 备份排除视频开关 / §2.4 时间线地点小行 / §1.5b 的 🎬 子标记**——锦上添花，可下版。
3. **定位（§2 整块）**——若只想先把「视频」这根柱立住，可单发「视频版」，定位押后半个版本。但定位很轻、且是七维最后一块，建议留住一起收官。
4. 最小可发版 = **视频（拍/选 + 封面 + 详情播放 + 删除回收）**；定位 = 锦上添花的轻字段。

---

## 8. 维度收官 & 下一根柱（写给规划，不影响本版实现）

做完本版，你最初圈的七维 **location / voice / video / people / mood / tags / custom_subject 全部落地**。「充分记录生活」的**输入侧**基本齐了。建议下一阶段重心从「**记得更多**」转向「**用起来 + 真正可信**」：

1. **云端媒体桶（最该做的下一柱）**：把 §0.2 的边界填上——Supabase Storage 桶存 audio/video Blob，`media[]` 存桶内 path，跨设备真同步。v1.11 文档已写设计与建桶 SQL，届时直接落地。**这是当前最大的「数据可信」缺口**（多媒体目前只在本机+备份）。
2. **跨维度回顾（独特性变现）**：把这些维度接成「版本轴」的消费面——按地点聚合（地图/地点时间线）、情绪走势、人物年度回顾、「那年今日」带语音/视频回放。维度的价值在「回看」时才兑现。
3. **AI 顺手用上新维度**：识图时一并猜 mood/tags、给语音转写文字（便于搜索）等。

> 一句话：**本版把「记什么」补齐到七维收官；下一柱该解决「多媒体跨设备可信同步」，再往后是把维度接成可回看的版本轴。**

