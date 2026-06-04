/* Patch the Capacitor-generated Android project in CI (android/ is regenerated
   each build, so these tweaks must be re-applied every time):
   1. Sync versionName/versionCode from package.json (Capacitor hardcodes 1.0 / 1).
   2. Keep the manifest on adjustResize; capacitor.config.ts enables Keyboard
      resizeOnFullScreen, and the web layer has a bounded fallback. */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

// --- 1) version ---
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const version = pkg.version; // "1.0.5"
const [maj, min, pat] = version.split('.').map(Number);
const code = maj * 10000 + min * 100 + pat;                              // 1.0.5 -> 10005
const appId = 'com.lifearchive.app';
const appIdPath = appId.replace(/\./g, '/');
const gradlePath = 'android/app/build.gradle';
let g = readFileSync(gradlePath, 'utf8');
g = g.replace(/versionCode\s+\d+/, 'versionCode ' + code)
     .replace(/versionName\s+"[^"]*"/, 'versionName "' + version + '"')
     .replace(/namespace\s*=\s*"[^"]*"/, 'namespace = "' + appId + '"')
     .replace(/applicationId\s+"[^"]*"/, 'applicationId "' + appId + '"');

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
console.log(`Android appId "${appId}", versionName "${version}", versionCode ${code}; debug signingConfig -> committed keystore`);

// --- Java package + Android string resources ---
const mainActivityPath = `android/app/src/main/java/${appIdPath}/MainActivity.java`;
mkdirSync(`android/app/src/main/java/${appIdPath}`, { recursive: true });
writeFileSync(mainActivityPath,
  `package ${appId};\n\nimport com.getcapacitor.BridgeActivity;\n\npublic class MainActivity extends BridgeActivity {}\n`);
if (existsSync('android/app/src/main/java/com/realitygit')) {
  rmSync('android/app/src/main/java/com/realitygit', { recursive: true, force: true });
}

const stringsPath = 'android/app/src/main/res/values/strings.xml';
let strings = readFileSync(stringsPath, 'utf8');
strings = strings.replace(/<string name="package_name">[^<]*<\/string>/, `<string name="package_name">${appId}</string>`)
                 .replace(/<string name="custom_url_scheme">[^<]*<\/string>/, `<string name="custom_url_scheme">${appId}</string>`);
writeFileSync(stringsPath, strings);
console.log(`Android Java package + string resources -> "${appId}"`);

// --- Android manifest: camera permission + stable IME viewport ---
const manifestPath = 'android/app/src/main/AndroidManifest.xml';
let m = readFileSync(manifestPath, 'utf8');
if (!m.includes('android.permission.CAMERA')) {
  m = m.replace('</manifest>', '    <uses-permission android:name="android.permission.CAMERA" />\n</manifest>');
  console.log('AndroidManifest -> added CAMERA permission');
}
if (/android:windowSoftInputMode="[^"]*"/.test(m)) {
  m = m.replace(/android:windowSoftInputMode="[^"]*"/, 'android:windowSoftInputMode="adjustResize"');
} else {
  m = m.replace(/<activity\b/, '<activity android:windowSoftInputMode="adjustResize"');
}
writeFileSync(manifestPath, m);
console.log('AndroidManifest -> Activity windowSoftInputMode="adjustResize" (pairs with Keyboard.resizeOnFullScreen)');

// Status-bar overlap is handled at runtime by @capacitor-community/safe-area
// (reads real window insets, injects --safe-area-inset-* CSS vars) — see initNative().
