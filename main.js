/* Life Archive desktop shell — loads the existing static app inside Electron.
   No app logic lives here; the web files (index.html / css / js) are untouched. */
const { app, BrowserWindow, Menu, dialog, nativeTheme, ipcMain, desktopCapturer, screen, session } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

/* ---- Screenshot capture for the new-commit form ----
   The renderer asks (via the preload bridge) to grab the screen the window is on.
   We briefly hide our own window so the shot captures what's behind it, take a
   full-resolution frame with desktopCapturer, then restore the window. */
function setupScreenshot() {
  ipcMain.handle('capture-screen', async function () {
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    const wasVisible = win && win.isVisible();
    try {
      if (win && wasVisible) { win.hide(); await new Promise(function (r) { setTimeout(r, 280); }); }
      const display = win ? screen.getDisplayMatching(win.getBounds()) : screen.getPrimaryDisplay();
      const sf = display.scaleFactor || 1;
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: Math.round(display.size.width * sf), height: Math.round(display.size.height * sf) }
      });
      let src = sources[0];
      if (sources.length > 1) {
        const match = sources.find(function (s) { return String(s.display_id) === String(display.id); });
        if (match) src = match;
      }
      return src && src.thumbnail ? src.thumbnail.toDataURL() : null;
    } catch (e) {
      console.error('[capture-screen] ' + (e && e.message || e));
      return null;
    } finally {
      if (win && wasVisible) win.show();
    }
  });
}

/* ---- Cloud auto-update (electron-updater + GitHub Releases) ----
   On launch the packaged app checks the configured GitHub repo for a newer
   release, downloads it in the background, and offers to restart-and-install.
   Skipped in dev (`electron .`) because there's nothing to update against. */
function setupAutoUpdate() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.on('update-downloaded', function (info) {
    dialog.showMessageBox({
      type: 'info',
      buttons: ['立即重启更新', '稍后'],
      defaultId: 0,
      title: 'Life Archive 有新版本',
      message: '已下载新版本 ' + info.version + '，重启后即可使用。',
      detail: '你也可以稍后手动重启应用来完成更新。'
    }).then(function (res) {
      if (res.response === 0) autoUpdater.quitAndInstall();
    });
  });
  autoUpdater.on('error', function (err) {
    // never block the app on update failures (e.g. offline) — just log
    console.error('[auto-update] ' + (err == null ? 'unknown' : (err.message || err)));
  });
  autoUpdater.checkForUpdatesAndNotify();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 720,
    minHeight: 560,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#0b0b0d' : '#f2f3f5',
    autoHideMenuBar: true,
    title: 'Life Archive · 生活存档',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      // app loads only local files; this lets the user-initiated AI photo-scan
      // call the (CORS-less) Zhipu API directly from the renderer.
      webSecurity: false
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(function () {
  Menu.setApplicationMenu(null); // no native menu bar; the app has its own nav
  // grant microphone access so voice notes work on desktop
  session.defaultSession.setPermissionRequestHandler(function (wc, permission, cb) {
    cb(permission === 'media' || permission === 'audioCapture' || permission === 'geolocation');
  });
  setupScreenshot();
  createWindow();
  setupAutoUpdate();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
