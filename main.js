/* Life Archive desktop shell — loads the existing static app inside Electron.
   No app logic lives here; the web files (index.html / css / js) are untouched. */
const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

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
    backgroundColor: '#0b0e16',
    autoHideMenuBar: true,
    title: 'Life Archive · 生活存档',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(function () {
  Menu.setApplicationMenu(null); // no native menu bar; the app has its own nav
  createWindow();
  setupAutoUpdate();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
