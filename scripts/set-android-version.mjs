/* Patch the Capacitor-generated Android project in CI (android/ is regenerated
   each build, so these tweaks must be re-applied every time):
   1. Sync versionName/versionCode from package.json (Capacitor hardcodes 1.0 / 1).
   2. Opt out of Android 15 forced edge-to-edge so the status bar doesn't overlap
      the web content (the WebView doesn't reliably expose safe-area insets). */
import { readFileSync, writeFileSync } from 'node:fs';

// --- 1) version ---
const version = JSON.parse(readFileSync('package.json', 'utf8')).version; // "1.0.5"
const [maj, min, pat] = version.split('.').map(Number);
const code = maj * 10000 + min * 100 + pat;                              // 1.0.5 -> 10005
const gradlePath = 'android/app/build.gradle';
let g = readFileSync(gradlePath, 'utf8');
g = g.replace(/versionCode\s+\d+/, 'versionCode ' + code)
     .replace(/versionName\s+"[^"]*"/, 'versionName "' + version + '"');

// --- fixed signing: point debug builds at the committed keystore so every APK
//     shares ONE signature and installs as an update (copying to ~/.android does
//     NOT work on the GH runner — it redirects the debug-keystore location). ---
if (!g.includes('signingConfigs')) {
  const inject =
    '    signingConfigs {\n' +
    '        debug {\n' +
    '            storeFile file("$rootDir/../keystore/debug.keystore")\n' +
    '            storePassword "android"\n' +
    '            keyAlias "androiddebugkey"\n' +
    '            keyPassword "android"\n' +
    '        }\n' +
    '    }\n' +
    '    buildTypes {\n' +
    '        debug {\n' +
    '            signingConfig signingConfigs.debug\n' +
    '        }';
  g = g.replace(/buildTypes\s*\{/, inject);
}
writeFileSync(gradlePath, g);
console.log(`Android version -> versionName "${version}", versionCode ${code}; debug signingConfig -> committed keystore`);

// --- 2) status-bar / edge-to-edge opt-out ---
const stylesPath = 'android/app/src/main/res/values/styles.xml';
let s = readFileSync(stylesPath, 'utf8');
if (!s.includes('windowOptOutEdgeToEdgeEnforcement')) {
  s = s.replace(
    /(<style name="AppTheme\.NoActionBar"[^>]*>)/,
    '$1\n        <item name="android:windowOptOutEdgeToEdgeEnforcement">true</item>\n        <item name="android:fitsSystemWindows">true</item>'
  );
  writeFileSync(stylesPath, s);
  console.log('Android theme -> edge-to-edge opt-out + fitsSystemWindows (status bar no longer overlaps)');
}
