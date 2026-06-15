# Life Archive v1.16.0 ·「云端媒体桶 — 多媒体跨设备真同步」实现文档（独立可执行）

> 表层闭环已完整：七维捕获（v1.12–1.13）→ 时间线消费（v1.14）→ 导航收敛（v1.15）。**唯一的结构性欠债**：语音/视频 Blob 至今**不进云**——`cloudSync`(994) 只推 `exportRaw()` 的 jsonb（commits/branches/customScenes/tombstones），`media[].blobId` 这个**引用**同步过去了，但 Blob 本体只在录制设备的 IndexedDB 里，换台设备 `getBlob` 取不到 → 详情页"文件缺失"占位。
> 对一个叫 **Life Archive / 数据可托付** 的 App，这是对核心承诺最伤的一处静默数据丢失。本版用 **Supabase Storage 桶**补上它。
> 基于当前 **1.15.0** 真实代码，自带建桶 SQL、可粘贴代码、文件锚点与坑。

> 🧭 **北极星**：媒体 Blob 进**私有桶**，地址 = `${uid}/${blobId}`（uid 由账号决定、全设备同一个；blobId 已随 jsonb 同步）。**不改同步的 jsonb 形状、不改 store 数据结构**——上传搭 `cloudSync` 顺风车，下载按需懒拉。**`Cloud` 适配器是可插拔的，桶干净地挂上去。**

---

## 0. 总览

### 0.1 关键设计：地址可重建，**不往同步 jsonb 里加任何字段**
- 云同步是**按账号**的（RLS `auth.uid()=user_id`，一个账号一行存档），所以**所有设备共享同一个 `uid`**。
- 桶对象路径 = **`${uid}/${blobId}`**。`blobId` 已经在 `media[].blobId` 里、随 jsonb 同步到每台设备。
- ⇒ 设备 B 看到 `media[].blobId` 就能**重建路径**去下载，**无需在 commit 上存 path 或 `up` 标记**。这样：① 同步 jsonb 形状零改动；② 不引发"标记变更→updatedAt 抖动→反复 re-sync"；③ 老版本设备完全无感（顶多继续显示缺失占位）。
- 唯一新增的本地状态：一份**本设备已确认上传**的 blobId 集合（存 meta，**不同步**），纯属省流量优化（避免每次 sync 重传）。`upsert:true` 保证即便重传也幂等。

### 0.2 三条流（全部 best-effort、失败不阻断主同步）
1. **上传**：`cloudSync` 推完 jsonb 后，扫本地 `media[].blobId` 中"未确认上传"的，`getBlob` 取到就 `uploadBlob(${uid}/${blobId})`，成功后本地标记。失败留到下次 sync 重试。
2. **按需下载（修"文件缺失"）**：详情页 `getBlob(blobId)` 取不到时 → `downloadBlob(${uid}/${blobId})`；拿到就 `putBlob` 缓存进本地仓再播；404/离线 → 沿用现有缺失占位。
3. **删除回收**：删带媒体的 commit 时，除本地 `deleteBlob`（store 已做），再 `removeBlob` 桶对象（在线 best-effort）。

### 0.3 ⚠️ 边界 / 不做
- ❌ **不改 `store.js` 数据结构**、不改 `exportRaw`/`mergeData`/jsonb 表结构。媒体引用照旧在 commit 里随 jsonb 走。
- ❌ **不往 commit/media[] 加同步字段**（path/up 都不加）——地址可重建（§0.1）。
- ❌ **不把 Blob 塞进 jsonb 行**（会爆 Postgres 行上限）——这正是要桶的原因。
- ❌ 不做媒体的实时双向推送/冲突合并：Blob 内容不可变（blobId 唯一），只有"有/无"，无需 merge。
- ✅ **向后兼容**：≤v1.15 设备不认桶，行为不变（缺失占位）；本版设备能上传+按需下载。
- ✅ 备份 `collectBackupBlobs`(4837 区，base64 进 `data.blobs`) **保留不动**，作为离线可移植兜底，与桶不冲突。

### 0.4 验收闭环（端到端，需两台设备 / 两个登录）
设备 A（手机）录一段语音 + 一段视频 → 存档 → 点「☁ 立即同步」（jsonb 推送 + 媒体上传）→ 设备 B（桌面）同账号登录 → 同步 → 时间线出现该 commit、封面 + ▶ → 进详情：**语音/视频能播**（B 本地原本没有 Blob，是从桶按需下载并缓存的）→ 在 A 删除该 commit 并同步 → 桶对象被回收（Supabase 控制台 Storage 里 `${uid}/vd_*`、`${uid}/au_*` 消失）→ B 再同步，该 commit 因 tombstone 消失。
**这条链顺 = 七维多媒体跨设备可信同步达成。**

### 0.5 代码地图（当前 1.15.0 真实锚点）
| 位置 | 行号 | 改动 |
|---|---|---|
| `Cloud` 适配器对象 | **734–796**（pull 783 / push 787 之后） | **加 `uploadBlob/downloadBlob/removeBlob` + `mediaPath`** |
| `cloudSync` | **994–1004** | push 后追加 `syncMediaUp()`（best-effort），仍 return merged |
| `deleteCommitWithCleanup` | **952–956** | 删前抓 `media[].blobId`，删后 `removeBlob` 桶对象 |
| 详情 audio 播放块 | **1964–1976**（`getBlob` 1970、缺失 1971） | `if(!b)` 改为先试桶下载 |
| 详情 video 播放块 | **1977–1996**（`getBlob` 1985、缺失 1986） | 同上 |
| `accountCard` 已登录态 | **5811–5836** | 加「媒体同步」状态行 +（可选）手动「上传媒体」 |
| i18n `voice_missing`/`video_missing` | 158/162（zh）· 317/321（en） | 新增下载中/失败文案 |
| `SUPABASE-SETUP.md` | 全文 | 追加「6. 建媒体桶 + 权限」SQL 段 |
| `RELEASE_NOTES` | 5019 区 | 顶部加 1.16.0 |
| 版本号 | package.json 3 / version.js 3 / index.html 11/41/42/43/44 | 1.15.0→1.16.0 |

**复用的真实接口**：`Cloud.client()`(748)、`Cloud.currentUser()`(747)、`Store.putBlob/getBlob/deleteBlob`(store.js 434–445)、`Store.commits()`(store.js 271)、`Store.meta/setMeta`(store.js 400)、`Store.getCommit`(store.js 280)。**store.js 本版 0 改动。**

---

## 1. 建桶 + 权限（SUPABASE-SETUP.md 追加「第 6 步」）

> 用户需在自己的 Supabase 项目 SQL Editor 跑一次。私有桶 + RLS：每人只能读写自己 `uid/` 前缀下的对象。

```sql
-- 6) 媒体桶：存语音/视频 Blob（私有；路径前缀 = 用户 id）
insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;

-- 可选：单文件大小上限（按需，示例 200MB）。免费版总容量约 1GB。
-- update storage.buckets set file_size_limit = 209715200 where id = 'media';

-- RLS：只能操作自己 uid/ 前缀下的对象（先删后建，可重复执行）
drop policy if exists "own media - select" on storage.objects;
drop policy if exists "own media - insert" on storage.objects;
drop policy if exists "own media - update" on storage.objects;
drop policy if exists "own media - delete" on storage.objects;

create policy "own media - select" on storage.objects for select
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own media - insert" on storage.objects for insert
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own media - update" on storage.objects for update
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own media - delete" on storage.objects for delete
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
```
> `storage.foldername(name)[1]` = 路径第一段（即我们的 `uid`）。这保证 A 用户取不到 B 用户的对象。
> **文案提示**（写进 SUPABASE-SETUP）：免费版 Storage 约 1GB；视频很占空间，量大时考虑只在 Wi-Fi 上传（§6 可选开关）或升级。

---

## 2. 适配器：`Cloud` 加三方法 + 路径助手（734–796，push 787 之后）

```js
// 放进 Cloud 对象，紧跟 push 之后（796 的 } 之前加逗号续写）
uploadBlob: function (path, blob) {
  return this.client().then(function (c) {
    return c.storage.from('media').upload(path, blob, {
      upsert: true, contentType: (blob && blob.type) || 'application/octet-stream'
    });
  }).then(function (r) { if (r && r.error) throw new Error(r.error.message); return true; });
},
downloadBlob: function (path) {
  return this.client().then(function (c) { return c.storage.from('media').download(path); })
    .then(function (r) { return (r && !r.error && r.data) ? r.data : null; });  // data 是 Blob
},
removeBlob: function (path) {
  return this.client().then(function (c) { return c.storage.from('media').remove([path]); })
    .then(function () { return true; }).catch(function () { return false; });
}
```
**路径助手 + 本地"已上传"标记**（放在 `cloudSync` 上方，与之同作用域）：
```js
function mediaPathFor(blobId) {
  var u = Cloud.currentUser();
  return (u && blobId) ? (u.id + '/' + blobId) : null;
}
// 本设备已确认进桶的 blobId 集合（存 meta，不同步；纯省流量）
function uploadedSet() { return Store.meta().mediaUp || {}; }
function markUploaded(blobId, on) {
  var m = Store.meta().mediaUp || {};
  if (on === false) delete m[blobId]; else m[blobId] = 1;
  Store.setMeta({ mediaUp: m });
}
```
> ⚠ **CapacitorHttp 坑回顾**：项目里 `CapacitorHttp.enabled=false`（否则 patch 全局 fetch 会吞掉 Supabase 的 `Authorization` 头）。Storage 上传/下载走 supabase-js 自己的 fetch，与现有 auth 一致——**别**为它再开 CapacitorHttp。Android 上大二进制 upload 走 WebView fetch，列入真机验收（§5）。

---

## 3. 上传：`cloudSync` 推完 jsonb 后挂 `syncMediaUp`（994）

```js
function syncMediaUp() {
  var u = Cloud.currentUser();
  if (!u) return Promise.resolve();
  var up = uploadedSet();
  var ids = [];
  Store.commits().forEach(function (c) {
    (c.media || []).forEach(function (m) {
      if (m && m.blobId && !up[m.blobId] && ids.indexOf(m.blobId) < 0) ids.push(m.blobId);
    });
  });
  // 串行，避免一次性并发把手机网络/内存打爆（视频大）
  return ids.reduce(function (p, blobId) {
    return p.then(function () {
      return Store.getBlob(blobId).then(function (b) {
        if (!b) return;                              // 本机没有（来自别的设备）→ 无需上传
        return Cloud.uploadBlob(u.id + '/' + blobId, b)
          .then(function () { markUploaded(blobId, true); })
          .catch(function () { /* 失败留到下次 sync 重试 */ });
      });
    });
  }, Promise.resolve());
}
```
**改 `cloudSync`（994）**——在 push 后、return 前挂上（媒体失败不拖垮主同步）：
```js
function cloudSync() {
  var local = Store.exportRaw();
  return Cloud.pull().then(function (remote) {
    var merged = mergeData(local, remote);
    Store.replaceAll(merged);
    return Cloud.push(merged).then(function () {
      Store.setMeta({ lastSyncAt: Date.now() });
      return syncMediaUp().catch(function () {}).then(function () { return merged; }); // ← 新增
    });
  });
}
```
> `autoSync`(1011) 不动——它本就调 `cloudSync()`，于是新存档自动 sync 时也会顺带上传媒体。

---

## 4. 按需下载：详情页缺失 → 先试桶（audio 1964–1976 / video 1977–1996）

抽一个公共助手（放 `renderDetail` 内或顶层皆可），把"本地取不到就拉桶、拉到就缓存"封装：
```js
// 返回 Promise<Blob|null>：先本地，后桶（并回填本地缓存）
function resolveMediaBlob(blobId) {
  return Store.getBlob(blobId).then(function (b) {
    if (b) return b;
    var path = mediaPathFor(blobId);
    if (!path) return null;                          // 未登录 → 没法拉
    return Cloud.downloadBlob(path).then(function (db) {
      if (db) { Store.putBlob(blobId, db); }         // 缓存，下次直接本地命中
      return db || null;
    }).catch(function () { return null; });
  });
}
```
**audio 块（1970 的 `Store.getBlob(...)` 改为）：**
```js
var slot = el('div', { class: 'detail-voice' }, [player,
  el('span', { class: 'file-size', text: fmtDur(audioM.dur || 0) + ' · ' + fmtBytes(audioM.size || 0) })]);
card.appendChild(slot);
player.replaceWith(el('div', { class: 'media-loading', text: '… ' + t('media_fetching') }));  // 拉取中占位
var holder = slot.firstChild;
resolveMediaBlob(audioM.blobId).then(function (b) {
  if (!b) { holder.replaceWith(el('div', { class: 'commit-notes', text: t('voice_missing') })); return; }
  var url = URL.createObjectURL(b);
  player.src = url; player.addEventListener('emptied', function () { URL.revokeObjectURL(url); });
  holder.replaceWith(player);
});
```
**video 块（1985 同理）**：把 `Store.getBlob(videoM.blobId)` 换成 `resolveMediaBlob(videoM.blobId)`，`if(!b)` 分支保留现有 `video-missing`（封面 + 文案）；拿到 Blob 时照旧 `vp.src=url`。
> 体验：本机有就秒播；跨设备首播多一次桶下载（显示「拉取中…」），下载完缓存，**第二次起就本地秒播**。离线/404 仍优雅占位，不崩。

---

## 5. 删除回收：`deleteCommitWithCleanup`（952）补桶清理

```js
function deleteCommitWithCleanup(id) {
  Notify.cancelFor(id, 'recheck');
  var c = Store.getCommit(id);
  var blobIds = (c && c.media ? c.media : []).map(function (m) { return m && m.blobId; }).filter(Boolean);
  Store.deleteCommit(id);   // store 内已回收本机 Blob + 落 tombstone（store.js 350）
  autoSync(false);
  // best-effort 桶清理（在线 + 已登录）；失败不打断
  var u = Cloud.currentUser();
  if (u) blobIds.forEach(function (bid) {
    Cloud.removeBlob(u.id + '/' + bid); markUploaded(bid, false);
  });
}
```
> **已知小泄漏（可接受）**：曾在设备 B 上"按需下载缓存过"的 Blob，B 上的副本不会因 A 的删除而自动清（B 只通过 tombstone 让 commit 消失，不跑 deleteCommit）。这是**孤儿本地 Blob**，不影响正确性、不上云。可选 §7 的本地 GC 清理。桶对象由 A 的 `removeBlob` 释放（这才是省云空间的关键）。

---

## 6. 设置 UI：账号卡加「媒体同步」状态（accountCard 已登录态 5811–5836）

在已登录分支的 `settingsCard([...])` 里，`last_sync` 行之后插一行状态 + 一颗手动上传按钮：
```js
// 统计待上传数量（本机有 Blob 但未标记上传）
var pend = 0;
Store.commits().forEach(function (c) { (c.media || []).forEach(function (m) {
  if (m && m.blobId && !(Store.meta().mediaUp || {})[m.blobId]) pend++;
}); });
var mediaBtn = el('button', { class: 'btn ghost tiny',
  text: '☁ ' + (L ? '上传媒体' : 'Upload media') + (pend ? ' · ' + pend : '') });
mediaBtn.addEventListener('click', function () {
  mediaBtn.disabled = true; var o = mediaBtn.textContent; mediaBtn.textContent = L ? '上传中…' : 'uploading…';
  syncMediaUp().then(function () { toast('☁ ' + (L ? '媒体已上传' : 'Media uploaded')); render(); })
    .catch(function () { toast('⚠ ' + (L ? '部分媒体上传失败，可重试' : 'Some media failed — retry')); })
    .then(function () { mediaBtn.disabled = false; mediaBtn.textContent = o; });
});
// 装进已登录卡片的 set-actions（与 syncB/outB/reconf 同行或新起一行）
```
> 说明文案补一句：「语音/视频通过私有桶在设备间同步；其它存档走云同步。」
> **（可选）仅 Wi-Fi 上传**：移动端 `navigator.connection && navigator.connection.type === 'cellular'` 时跳过自动 `syncMediaUp`（手动按钮仍可强制）。`connection` API 在 WebView 不稳，列为 §7 可收缩。

---

## 7. i18n（zh 158 / en 317 区，媒体相关键旁）
```js
// zh
media_fetching: '拉取媒体…', media_missing_cloud: '云端也没有这段媒体',
media_upload: '上传媒体', media_uploaded: '媒体已上传',
// en
media_fetching: 'Fetching media…', media_missing_cloud: 'Media not in cloud either',
media_upload: 'Upload media', media_uploaded: 'Media uploaded',
```
> `voice_missing`(158/317)、`video_missing`(162/321) 保留作为最终兜底文案。

---

## 8. CSS（少量；styles.css 新增）
```css
.media-loading { font-size: 13px; opacity: .7; padding: 8px 0; }
```
> 其余复用 `.detail-voice/.detail-videowrap/.video-missing/.commit-notes` 现有样式，无新布局。

---

## 9. 验收清单（逐条过）

**单机（先保证不回归）**
- [ ] 未配置/未登录云：录语音/视频 → 详情本机直接播（不触发桶、无报错）。
- [ ] 删带媒体 commit：本机 IndexedDB `blobs` 仓对应 `au_*/vd_*` 被回收（DevTools 确认）。

**跨设备（核心）**
- [ ] 跑了 §1 建桶 SQL；A 录语音+视频 → 同步 → Supabase 控制台 Storage `media/${uid}/` 下出现 `au_*`、`vd_*` 对象。
- [ ] B 同账号登录 → 同步 → 进详情：语音/视频显示「拉取媒体…」后**能播**；再次进入**秒播**（已缓存本地）。
- [ ] B 在另一账号登录：取不到 A 的对象（RLS 生效，显示缺失占位、不报错也不串号）。
- [ ] A 删除该 commit 并同步 → 桶里对象消失；B 同步后 commit 消失。
- [ ] 离线时进详情缺失媒体：显示缺失占位、不卡死；联网后再进可拉到。
- [ ] 大视频（>60MB）：上传有进度感（按钮 disabled），不冻 UI；同步 jsonb 不受影响。

**稳健性**
- [ ] Storage 报错（如桶没建）时：主 jsonb 同步**仍成功**（媒体失败被 catch），toast 不误报"同步失败"。
- [ ] 设置卡「上传媒体 · N」计数正确；上传后 N 归零。
- [ ] Android APK：上传/下载真机过（WebView fetch + 大二进制）；未给 CapacitorHttp 开例外。
- [ ] ≤v1.15 老设备同账号：不认桶，行为同旧版（缺失占位），不被新数据搞坏。

---

## 10. 发版（沿用既有铁律）
1. **版本号** 1.15.0→1.16.0：package.json(3)、js/version.js(3)、index.html 4 处 `?v=`（11/41/42/43/44）。
2. **`SUPABASE-SETUP.md`** 加「6. 建媒体桶 + 权限」（§1），并提示老用户**需补跑这段 SQL** 才有跨设备媒体。
3. **`RELEASE_NOTES`**(5019) 顶部加 1.16.0（zh/en），建议条目：
   - 语音/视频现在通过 **Supabase 私有媒体桶**跨设备同步：在一台设备录制，同账号登录另一台即可播放（按需下载、本地缓存）。
   - 同步时自动上传未上传的媒体；删除存档会回收云端媒体对象；离线/缺失优雅占位。
   - **需补跑建桶 SQL**（见 SUPABASE-SETUP.md 第 6 步）；不改其它数据/表结构；备份导入路径保留。
4. **CHANGELOG.md** 加 1.16.0 段。
5. 先桌面双账号过 §9 跨设备清单，再 push 触发 APK 过真机。

---

## 11. 不要做 / 范围可收缩
- ❌ 不把 Blob 写进 `archives.data` jsonb；不改 store 数据结构；不给 media[] 加同步字段。
- ❌ 不做媒体内容的双向 merge（Blob 不可变，只有有/无）。
- **可收缩**（按"砍了最不疼"）：
  1. §6「仅 Wi-Fi」开关 / `navigator.connection` 判断——最先砍。
  2. §6 手动「上传媒体」按钮——自动随 sync 上传已够，按钮只是给掌控感。
  3. §7 本地孤儿 Blob GC——小泄漏、不影响正确性，可后置。
  4. **最小可发版** = §1 建桶 + §2 适配器 + §3 上传 + §4 按需下载 + §5 删除回收。设置状态行、文案润色都可后补。

---

## 12. 之后（写给规划）
本版填平"数据可托付"最后的结构性缺口后，App 的**捕获 / 消费 / 收敛 / 可信**四件都齐了。再往后不建议继续堆功能，而是：
1. **可信度收尾**：备份与桶的关系收敛（备份是否还需 base64 打包视频？可改为"备份仅元数据 + 桶做媒体真相源"）；同步冲突/大库性能压测。
2. **回看深化（v1.14 的延长线）**：地点聚合页 / 年度回顾片 / 跨维度回看——但先用真实使用验证"你是否真的会回看"，再决定是否建页（延续 v1.15 的克制）。

> 一句话：**v1.16 让七维多媒体真正"放得住、带得走、跨得了设备"——把 Life Archive 的名字坐实。**
