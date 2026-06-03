/* Life Archive desktop preload — exposes a tiny, audited bridge to the renderer.
   contextIsolation is on, so the web app only sees window.electronAPI (no Node).
   Only used on desktop (Electron); on Android/web window.electronAPI is undefined
   and the app falls back to its web code paths. */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // capture the current screen and return a PNG data URL (used by the
  // new-commit form's "截取当前屏幕" photo source)
  captureScreen: function () { return ipcRenderer.invoke('capture-screen'); }
});
