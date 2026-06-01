/* Sync the Android versionName/versionCode from package.json into the
   Capacitor-generated android/app/build.gradle (Capacitor hardcodes 1.0 / 1).
   Run in CI after `cap sync android`, before the gradle build. */
import { readFileSync, writeFileSync } from 'node:fs';

const version = JSON.parse(readFileSync('package.json', 'utf8')).version; // e.g. "1.0.3"
const [maj, min, pat] = version.split('.').map(Number);
const code = maj * 10000 + min * 100 + pat;                              // 1.0.3 -> 10003 (monotonic)

const path = 'android/app/build.gradle';
let g = readFileSync(path, 'utf8');
g = g.replace(/versionCode\s+\d+/, 'versionCode ' + code)
     .replace(/versionName\s+"[^"]*"/, 'versionName "' + version + '"');
writeFileSync(path, g);
console.log(`Android version -> versionName "${version}", versionCode ${code}`);
