/* Assemble the Capacitor web-assets folder (www/) from the source app.
   Keeps www/ a disposable build output instead of a duplicated source tree. */
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync } from 'node:fs';

rmSync('www', { recursive: true, force: true });
mkdirSync('www', { recursive: true });
cpSync('index.html', 'www/index.html');
cpSync('css', 'www/css', { recursive: true });
cpSync('js', 'www/js', { recursive: true });

// keep the in-app version in sync with package.json
const v = JSON.parse(readFileSync('package.json', 'utf8')).version;
writeFileSync('www/js/version.js', "window.APP_VERSION = '" + v + "';\n");
console.log('www/ built; version.js -> ' + v);
