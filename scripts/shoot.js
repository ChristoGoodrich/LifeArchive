/* Dev-only: render the app in Electron and save PNG screenshots for the README.
   Run with:  npx electron scripts/shoot.js   (quits itself when done) */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const W = 1240, H = 840;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  const win = new BrowserWindow({
    width: W, height: H, show: false,
    backgroundColor: '#0b0f1a',
    webPreferences: { backgroundThrottling: false }
  });
  await win.loadFile(path.join(ROOT, 'index.html'));
  await wait(500);

  // load demo data from the empty-state seed button
  await win.webContents.executeJavaScript(`(function(){
    location.hash = '#timeline';
    var b = Array.from(document.querySelectorAll('main button'))
      .find(function (x) { return x.textContent.indexOf('示例') > -1; });
    if (b) b.click();
    return true;
  })();`);
  await wait(900);

  const shots = [
    { hash: '#timeline', name: '1-timeline' },
    { hash: '#diff', name: '2-diff', pre: `
        var s = document.querySelector('main select');
        if (s) { s.selectedIndex = Math.min(1, s.options.length - 1); // 桌面 (richer heatmap)
                 s.dispatchEvent(new Event('change')); }
      `, after: `
        var c = document.querySelector('main canvas');
        if (c) c.scrollIntoView({ block: 'center' });
      ` },
    { hash: '#rollback', name: '3-rollback' },
    { hash: '#branch', name: '4-branch' }
  ];

  for (const sh of shots) {
    await win.webContents.executeJavaScript(`(function(){ location.hash='${sh.hash}'; return true; })();`);
    await wait(600);
    if (sh.pre) {
      await win.webContents.executeJavaScript(`(function(){ ${sh.pre} ; return true; })();`);
      await wait(1000); // let the heatmap canvas finish drawing
    }
    if (sh.after) {
      await win.webContents.executeJavaScript(`(function(){ ${sh.after} ; return true; })();`);
      await wait(400);
    }
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(OUT, sh.name + '.png'), img.toPNG());
    console.log('saved', sh.name + '.png');
  }
  app.quit();
}

app.whenReady().then(run).catch((e) => { console.error(e); app.quit(); });
