/* Dev-only: render the app in Electron and save PNG screenshots for the README.
   Run with:  npx electron scripts/shoot.js   (quits itself when done) */
const { app, BrowserWindow, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Use a throwaway profile so screenshots always seed fresh demo data and never
// touch (or capture) the real desktop app's archive.
const SHOT_PROFILE = path.join(os.tmpdir(), 'life-archive-shoot');
try { fs.rmSync(SHOT_PROFILE, { recursive: true, force: true }); } catch (e) {}
app.setPath('userData', SHOT_PROFILE);

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const W = 1240, H = 840;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  nativeTheme.themeSource = 'light'; // capture the HyperOS light theme
  const win = new BrowserWindow({
    width: W, height: H, show: true, skipTaskbar: true,
    backgroundColor: '#f2f3f5',
    webPreferences: { backgroundThrottling: false }
  });
  await win.loadFile(path.join(ROOT, 'index.html'));
  await win.webContents.insertCSS(`
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  `);
  await wait(600);

  // start from a clean archive so the demo dataset is always current + complete
  await win.webContents.executeJavaScript(`(function(){ try { if (window.RG_STORE) window.RG_STORE.clearAll(); } catch (e) {} return true; })();`);
  await win.webContents.reload();
  await wait(700);

  // load demo data from the empty-state seed button
  await win.webContents.executeJavaScript(`(function(){
    location.hash = '#timeline';
    var b = Array.from(document.querySelectorAll('main button'))
      .find(function (x) { return x.textContent.indexOf('示例') > -1; });
    if (b) b.click();
    return window.RG_STORE ? window.RG_STORE.commits().length : 0;
  })();`);
  await wait(2800); // let the demo data settle

  // Remove the toast, then park on another route. The first shot (timeline) is then
  // a real route change -> full re-render -> the hidden window repaints WITHOUT the
  // "demo loaded" pill (a hidden window won't repaint a bare DOM removal on its own).
  await win.webContents.executeJavaScript(`(function(){ var t=document.getElementById('toast'); if(t&&t.parentNode){ t.parentNode.removeChild(t); } location.hash='#commit'; return true; })();`);
  await wait(300);

  // Warm-up capture (discarded): the very FIRST capturePage on a hidden window can
  // retain the seed toast's compositor layer; throwing one away makes every real shot clean.
  await win.webContents.capturePage();
  await wait(150);

  const shots = [
    { hash: '#timeline', name: '1-timeline' },
    { hash: '#growth', name: '5-growth' },
    { hash: '#diff', name: '2-diff', pre: `
        var s = document.querySelector('main .choice-select');
        if (s && s._choices && s._choices.length) {
          var pick = s._choices[Math.min(1, s._choices.length - 1)]; // 桌面 (richer heatmap)
          s.setValue(pick.value, true);
        }
      `, after: `
        var c = document.querySelector('main canvas');
        if (c) c.scrollIntoView({ block: 'center' });
        window.scrollBy(0, -150);
      ` },
    { hash: '#rollback', name: '3-rollback' },
    { hash: '#branch', name: '4-branch' }
  ];

  for (const sh of shots) {
    await win.webContents.executeJavaScript(`(function(){
      var btn = document.querySelector('.nav-btn[data-route="${sh.hash.slice(1)}"]');
      if (btn) btn.click();
      else location.hash='${sh.hash}';
      window.scrollTo(0, 0);
      return location.hash;
    })();`);
    await wait(600);
    if (sh.pre) {
      await win.webContents.executeJavaScript(`(function(){ ${sh.pre} ; return true; })();`);
      await wait(1000); // let the heatmap canvas finish drawing
    }
    if (sh.after) {
      await win.webContents.executeJavaScript(`(function(){ ${sh.after} ; return true; })();`);
      await wait(400);
    }
    win.webContents.invalidate(); // force a repaint on the hidden window so the capture is current
    await wait(150);
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(OUT, sh.name + '.png'), img.toPNG());
    console.log('saved', sh.name + '.png');
  }
  app.quit();
}

app.whenReady().then(run).catch((e) => { console.error(e); app.quit(); });
