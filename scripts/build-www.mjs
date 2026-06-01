/* Assemble the Capacitor web-assets folder (www/) from the source app.
   Keeps www/ a disposable build output instead of a duplicated source tree. */
import { rmSync, mkdirSync, cpSync } from 'node:fs';

rmSync('www', { recursive: true, force: true });
mkdirSync('www', { recursive: true });
cpSync('index.html', 'www/index.html');
cpSync('css', 'www/css', { recursive: true });
cpSync('js', 'www/js', { recursive: true });
console.log('www/ built from index.html + css/ + js/');
