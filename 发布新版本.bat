@echo off
cd /d "%~dp0"
title RealityGit Release
setlocal enabledelayedexpansion
echo ============================================
echo     RealityGit  发布新版本
echo ============================================
echo.
for /f "delims=" %%v in ('node -p "require('./package.json').version"') do set CUR=%%v
echo 当前版本号: !CUR!
echo.
set /p NEW=请输入新版本号(例 1.0.1)，直接回车=自动加1: 
if "!NEW!"=="" (
  for /f "delims=" %%v in ('node -p "var v=require('./package.json').version.split('.');v[2]=+v[2]+1;v.join('.')"') do set NEW=%%v
)
echo.
echo 即将发布版本: !NEW!
echo.
node -e "var f='./package.json',p=require(f);p.version='!NEW!';require('fs').writeFileSync(f,JSON.stringify(p,null,2)+String.fromCharCode(10))"
if errorlevel 1 ( echo [错误] 写入版本号失败 & pause & exit /b 1 )
for /f "delims=" %%i in ('gh auth token 2^>nul') do set GH_TOKEN=%%i
if "!GH_TOKEN!"=="" ( echo [错误] 未登录 GitHub，请先运行  gh auth login & pause & exit /b 1 )
set CSC_IDENTITY_AUTO_DISCOVERY=false
echo 正在构建并上传到 GitHub Releases，请耐心等待几分钟...
echo.
call npx electron-builder --win --publish always
if errorlevel 1 ( echo. & echo [发布失败] 请把上面的报错发给 Claude & pause & exit /b 1 )
echo.
echo 同步版本号到 GitHub 仓库...
git add package.json
git commit -m "Release v!NEW!" >nul 2>&1
git push >nul 2>&1
echo.
echo ============================================
echo  发布成功! 版本 !NEW! 已上线
echo  用户下次打开 App 会自动收到更新
echo  发布页: https://github.com/ChristoGoodrich/RealityGit/releases
echo ============================================
pause
