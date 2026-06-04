# 发布新版本 / 自动更新指南

Life Archive 桌面版用 **electron-updater + GitHub Releases** 做云端自动更新。
用户安装的版本每次启动会自动检查 GitHub 上有没有更高版本号的发布，有就后台下载、
弹窗提示「立即重启更新」。你要做的只是「发一个新 Release」。

## 一次性准备（只做一次）

1. GitHub 仓库为 `ChristoGoodrich/LifeArchive`。
2. `package.json` 里的 `build.publish` 已填好 `owner: ChristoGoodrich` / `repo: LifeArchive`。
3. 在 GitHub 生成一个有 `repo` 权限的 Personal Access Token
   （Settings → Developer settings → Tokens）。

## ⭐⭐ 发版铁律（强制 · 任何人发版都必须照做）

> 这一节是**硬性规范**。少做任何一条，都算「发版未完成」，必须补齐后才能宣布发布。
> 顺序不能跳：先改全版本号 → 写说明 → 构建两端 → 发布并设置说明 → 自检。

### 铁律 1：版本号必须**同步**改这 5 处（缺一不可）

版本号只在一处对、别处忘了改，会导致自动更新不触发、缓存不刷新、应用内显示错版本。
每次发版务必把新版本号同时写进：

1. `package.json` 的 `"version"`
2. `js/version.js` 的 `window.APP_VERSION`
3. `index.html` 里 `version.js?v=<版本>` 的查询串（缓存刷新用，必须一起改）
4. `js/app.js` 顶部 `RELEASE_NOTES` 数组**新增一条**（应用内「更新日志」页读取它）
5. `CHANGELOG.md` 顶部**新增一节**

> 版本号必须**严格大于**上一版（语义化版本），否则 electron-updater 不会推送更新。

### 铁律 2：必须写**详细**的更新说明（中文为主，逐条列出改动 / 修复 / 注意事项）

- 内容要具体：改了什么、修了什么、影响哪些平台、有什么注意事项（如 appId 变更会断更）。
- `CHANGELOG.md`、应用内 `RELEASE_NOTES`、GitHub Release 三处内容必须**一致**。
- **GitHub Release 的标题只能是纯版本号**（例如 `1.4.1`，不带 `v`、不带描述）——所有细节只放在正文。

设置 Release 说明的命令（先把正文写进一个 UTF-8 文件再传）：

```powershell
gh release edit v1.4.1 --repo ChristoGoodrich/LifeArchive `
  --title "1.4.1" --notes-file 你的说明.md
```

### 铁律 3：两个平台都要出包并发布

- **Windows**：`electron-builder --win --publish always`（产出并上传 `*.exe` / `latest.yml` / `*.blockmap`）。
- **安卓 APK**：跑 `android.yml` 工作流，下载 `LifeArchive-debug.apk` 并 `gh release upload` 到同一个 Release。
- 只发一端 = 发版未完成。

### 铁律 4：发布后自检清单（逐条打勾）

- [ ] 5 处版本号都已改、且 `git grep` 不到旧版本号
- [ ] `CHANGELOG.md` / `RELEASE_NOTES` / GitHub Release 三处说明一致
- [ ] GitHub Release 标题是纯版本号，正文非空且详细
- [ ] Release 里同时挂着 Windows 安装包 + `latest.yml` + `*.blockmap` + 安卓 `LifeArchive-debug.apk`
- [ ] 已在安卓真机装新包，验证本次改动涉及的交互（尤其是输入框 / 键盘 / 导航相关改动）

> 双击 `发布新版本.bat` 发版时，它会**自动弹出记事本让你写本次更新说明**，写完保存关闭即可，脚本会把它设到 Release 上。但 `.bat` 不会替你改 `js/version.js` / `index.html` / `RELEASE_NOTES` / `CHANGELOG.md`——这几处仍需按铁律 1、2 手动同步。

## 每次发版（重复这几步）

1. 改完代码后，按上面**铁律 1** 把新版本号同步改到那 5 处（`package.json`、`js/version.js`、
   `index.html?v=`、`js/app.js` 的 `RELEASE_NOTES`、`CHANGELOG.md`）。
   **版本号必须比上一版高，自动更新才会触发。**
2. 在项目目录执行（PowerShell）：

   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   $env:GH_TOKEN = "你的_GitHub_Token"
   $env:CSC_IDENTITY_AUTO_DISCOVERY = "false"   # 不做代码签名
   npx electron-builder --win --publish always
   ```

   这条命令会构建安装包，并自动把
   `LifeArchive-Setup-<版本>.exe`、`latest.yml`、`.blockmap`
   上传到 GitHub Releases 并发布。
3. 完成。所有已安装用户下次开 App 就会自动收到更新。
   因为带了 `.blockmap`，更新是**增量下载**，只下变化的部分，不是整包 70 MB。

> 也可以直接双击项目里的 `发布新版本.bat`，它会自动完成「改版本号 → 构建 → 上传发布」。

## 安卓 APK

安卓不在本地构建（本地 Gradle 在这台机器上有回环连接问题），改用云端：
GitHub 仓库 → **Actions** 标签 → 左侧 **Build Android APK** → 右侧 **Run workflow**。
构建完在该次运行的 Artifacts 里下载 `LifeArchive-debug.apk`。

## 注意事项

- **Windows 只发布安装版**（`LifeArchive-Setup-<版本>.exe`），这是唯一支持自动更新的主路径；不再发布免安装 portable 包。
- 没有代码签名，用户首次运行会有 SmartScreen「未知发布者」提示，属正常。
- 开发时 `npm start`（`electron .`）不会触发更新检查（代码里用 `app.isPackaged` 挡住了）。
- 想换成自建服务器/OSS 而不用 GitHub：把 `publish` 的 `provider` 改成
  `generic` 并填 `url`，然后把构建产物里的 3 个文件
  （`*.exe` / `latest.yml` / `*.blockmap`）传到那个地址即可。
