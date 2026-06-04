<h1 align="center">Life Archive · 生活存档</h1>

<p align="center">
  <b>给现实生活装一个 Git —— 存档、对比、回滚、分支。</b><br>
  <i>Version control for everyday life — commit, diff, rollback, branch.</i>
</p>

<p align="center">
  <a href="https://github.com/ChristoGoodrich/LifeArchive/releases/latest"><img alt="下载最新版" src="https://img.shields.io/github/v/release/ChristoGoodrich/LifeArchive?label=%E4%B8%8B%E8%BD%BD%20Download&style=for-the-badge"></a>
  &nbsp;<img alt="platform" src="https://img.shields.io/badge/Windows-10%2F11-0b0f1a?style=for-the-badge&logo=windows">
  &nbsp;<img alt="android" src="https://img.shields.io/badge/Android-APK-3ddc84?style=for-the-badge&logo=android&logoColor=white">
</p>

<p align="center"><img src="docs/screenshots/1-timeline.png" width="80%"></p>

---

## 这是什么

现实生活最大的问题是：**很多事发生后才发现乱了，但你已经不知道怎么恢复。**
房间不知不觉乱了、出门忘带东西、作业改着改着改偏了、小组分工没人记得最初答应了什么……

普通 App 只是提醒你「要做什么」。**Life Archive 换了个思路：像管理代码一样管理生活状态。**
你可以给现实拍一个「存档点（commit）」，过几天对比「之前 / 现在」哪里变了，再按旧版本一步步把秩序「回滚」回来。

> 别人管理*任务*，它管理*生活状态*；别人帮你*计划未来*，它帮你*保存过去、对比现在、恢复秩序*。

---

## 下载

👉 **[前往 Releases 页面下载最新版](https://github.com/ChristoGoodrich/LifeArchive/releases/latest)**

| 文件 | 平台 | 说明 |
|------|------|------|
| `LifeArchive-Setup-x.x.x.exe` | Windows | **安装版（推荐）**——进开始菜单，**支持自动更新** |
| `LifeArchive-debug.apk` | Android | 手机浏览器打开下载页直接装（需允许"未知来源"） |

> Windows 首次运行可能提示「未知发布者」，点 **更多信息 → 仍要运行** 即可（应用未做代码签名，属正常）。
> 数据全部保存在本地，离线即可使用，无需注册、无需联网。

---

## 五个功能

### 🔍 现实对比（核心）
拍「之前」和「现在」两张照片，自动告诉你哪里变了：**①像素热力图 / 滑块 / 闪烁**标出画面变化，**②语义清单 diff**列出少了什么 / 多了什么 / 数量变化，**③可选 AI 解读**用你自己的免费智谱 key 总结“新增 / 消失 / 移动”。也可以跨场景任意两条存档对比，并导出 before/after 卡片或复制文字总结。

<p align="center"><img src="docs/screenshots/2-diff.png" width="85%"></p>

### 🌳 时间线
按日期整理的 git 式生活存档，每条 commit 都有场景、时间、清单和一句 commit message。当天有饮食记录时，还会显示「🍽 N 餐」徽标。顶部支持**搜索**（描述 / 物品 / 备注）和**按场景一键筛选**，存档再多也能秒找到。

### ⏮️ 回滚
选一个旧存档当目标，自动生成「恢复到这个状态」的分步清单（拿走 X、放回 Y），可逐项打勾。

<p align="center"><img src="docs/screenshots/3-rollback.png" width="85%"></p>

### 🔀 分支决策
纠结时开 2～4 个 branch，写下每条路的预期结果，选一条，事后回来复盘评分。已有分支可继续编辑，删除前会二次确认，慢慢攒出你自己的「生活决策版本库」。

<p align="center"><img src="docs/screenshots/4-branch.png" width="85%"></p>

### ➕ 新建存档
底部正中间的大号「＋」是最快入口。拍照 / 上传照片 + 写一句 commit message，生成一个生活存档点；清单、文件 / 图片附件和备注按需展开。一个存档可保存多个文件或图片，详情页可预览图片并下载原文件。场景先用左右选框区分「🍽 饮食 / 📦 物品 / 🎫 票据」，再选择具体分类，可快速记录早餐、午餐、晚餐、夜宵、零食饮品和票据。

---

## 技术 & 设计

- **核心是一个纯前端、零依赖、可离线的网页 App**（`index.html` + `css/` + `js/`），直接双击就能跑。
- **数据存在本地 IndexedDB**（照片、图片附件和文件以内联数据保存），不再受旧版 localStorage 约 5MB 限制；升级后旧数据自动迁移。也可选填自己的 Supabase 做多设备云同步。
- 桌面版用 **Electron** 套壳打包成 Windows 安装包；**electron-updater + GitHub Releases** 实现云端自动更新。
- 安卓版用 **Capacitor** 套壳，在 **GitHub Actions** 云端构建出 APK；输入法弹出时使用 `adjustResize` + `Keyboard.resizeOnFullScreen`，并由网页层做有界兜底，自动保持焦点输入框可见。
- **Diff 不强依赖 AI，但可以用 AI 增强。** 图像 diff（`js/diff.js` 逐像素求差 + 3×3 网格定位）告诉你**哪里**变了；清单 diff（结构化集合比较）告诉你**什么**变了；可选 AI 负责把两张图的变化翻译成自然语言总结。

```
index.html        外壳 + 顶栏 + 导航
css/styles.css    暗色「git 客户端」主题
js/store.js       本地仓库层（IndexedDB，自动迁移旧数据）
js/diff.js        Reality Diff 引擎（热力图 + 清单对比）
js/app.js         UI / 路由 / 中英双语 / 各页面渲染
main.js           Electron 桌面外壳 + 自动更新
```

---

## 本地开发 / 发布

```bash
# 浏览器里跑（开发）
直接双击 index.html，或用任意静态服务器打开

# 桌面版（需要 Node.js）
npm install
npm start                   # 以 Electron 桌面应用启动
npx electron-builder --win  # 构建 Windows 安装包到 dist/

# 安卓 APK：GitHub 仓库 → Actions → "Build Android APK" → Run workflow
# 打包脚本会同步 www/、appId、versionName/versionCode；安装后可在设置页确认版本号
```

Windows 发布新版本 = 双击项目里的 **`发布新版本.bat`**（改版本号 → 自动构建 → 上传 GitHub Release）。
详细步骤见 [RELEASING.md](RELEASING.md)。

---

<p align="center"><sub>Life Archive · MIT License</sub></p>
