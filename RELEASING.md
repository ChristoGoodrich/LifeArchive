# 发布新版本 / 自动更新指南

Life Archive 桌面版用 **electron-updater + GitHub Releases** 做云端自动更新。
用户安装的版本每次启动会自动检查 GitHub 上有没有更高版本号的发布，有就后台下载、
弹窗提示「立即重启更新」。你要做的只是「发一个新 Release」。

## 一次性准备（只做一次）

1. GitHub 仓库为 `ChristoGoodrich/LifeArchive`。
2. `package.json` 里的 `build.publish` 已填好 `owner: ChristoGoodrich` / `repo: LifeArchive`。
3. 在 GitHub 生成一个有 `repo` 权限的 Personal Access Token
   （Settings → Developer settings → Tokens）。

## 每次发版（重复这几步）

1. 改完代码后，把 `package.json` 里的 `version` 往上加一位
   （例如 `1.0.1` → `1.0.2`）。**版本号必须比上一版高，自动更新才会触发。**
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

- **自动更新只对「安装版」(`LifeArchive-Setup.exe`) 生效**。
  免安装的 `LifeArchive-portable.exe` 不会自更新——那个只适合临时拷给别人试用。
- 没有代码签名，用户首次运行会有 SmartScreen「未知发布者」提示，属正常。
- 开发时 `npm start`（`electron .`）不会触发更新检查（代码里用 `app.isPackaged` 挡住了）。
- 想换成自建服务器/OSS 而不用 GitHub：把 `publish` 的 `provider` 改成
  `generic` 并填 `url`，然后把构建产物里的 3 个文件
  （`*.exe` / `latest.yml` / `*.blockmap`）传到那个地址即可。
