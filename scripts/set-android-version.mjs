/* Patch the Capacitor-generated Android project in CI (android/ is regenerated
   each build, so these tweaks must be re-applied every time):
   1. Sync versionName/versionCode from package.json (Capacitor hardcodes 1.0 / 1).
   2. Keep the manifest on adjustResize; the native layer injects safe-area CSS
      vars but lets Android/WebView own the IME resize.
   3. Install LifeArchiveWebView to disable IME extract/fullscreen panels that can
      cover app content with a blank white layer above the keyboard.
   4. Keep the WebView and its parent container in the same resized frame, then
      explicitly invalidate the native view tree while the IME is animating. */
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
const lifeArchiveWebViewPath = `android/app/src/main/java/${appIdPath}/LifeArchiveWebView.java`;
const bridgeLayoutPath = 'android/app/src/main/res/layout/capacitor_bridge_layout_main.xml';
mkdirSync(`android/app/src/main/java/${appIdPath}`, { recursive: true });
mkdirSync('android/app/src/main/res/layout', { recursive: true });
writeFileSync(mainActivityPath,
  `package ${appId};\n\n` +
  `import android.view.View;\n` +
  `import android.view.ViewGroup;\n` +
  `import android.view.ViewParent;\n` +
  `import android.webkit.WebView;\n` +
  `import androidx.core.graphics.Insets;\n` +
  `import androidx.core.view.ViewCompat;\n` +
  `import androidx.core.view.WindowInsetsCompat;\n` +
  `import com.getcapacitor.BridgeActivity;\n\n` +
  `public class MainActivity extends BridgeActivity {\n` +
  `    @Override\n` +
  `    protected void load() {\n` +
  `        super.load();\n` +
  `        installImeInsetBridge();\n` +
  `    }\n\n` +
  `    private void installImeInsetBridge() {\n` +
  `        WebView webView = getBridge() != null ? getBridge().getWebView() : null;\n` +
  `        if (webView == null) return;\n\n` +
  `        disableAncestorClipping(webView);\n` +
  `        webView.setWillNotDraw(false);\n\n` +
  `        ViewCompat.setOnApplyWindowInsetsListener(webView, (View v, WindowInsetsCompat insets) -> {\n` +
  `            applyImeInsets(webView, insets);\n` +
  `            return insets;\n` +
  `        });\n` +
  `        webView.post(() -> {\n` +
  `            WindowInsetsCompat insets = ViewCompat.getRootWindowInsets(webView);\n` +
  `            if (insets != null) applyImeInsets(webView, insets);\n` +
  `            ViewCompat.requestApplyInsets(webView);\n` +
  `        });\n` +
  `    }\n\n` +
  `    private void applyImeInsets(WebView webView, WindowInsetsCompat insets) {\n` +
  `        boolean imeVisible = insets.isVisible(WindowInsetsCompat.Type.ime());\n` +
  `        Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());\n` +
  `        int targetHeight = ViewGroup.LayoutParams.MATCH_PARENT;\n\n` +
  `        if (imeVisible && ime.bottom > 0) {\n` +
  `            int screenHeight = getResources().getDisplayMetrics().heightPixels;\n` +
  `            int candidate = screenHeight - ime.bottom;\n` +
  `            int minUsefulHeight = Math.round(280 * getResources().getDisplayMetrics().density);\n` +
  `            if (candidate > minUsefulHeight) targetHeight = candidate;\n` +
  `        }\n\n` +
  `        applyCssSafeAreaVars(webView, insets, imeVisible);\n\n` +
  `        ViewParent parent = webView.getParent();\n` +
  `        if (parent instanceof View) applyLayoutHeight((View) parent, targetHeight);\n` +
  `        applyLayoutHeight(webView, targetHeight);\n` +
  `        forceWebViewRedraw(webView);\n` +
  `    }\n` +
  `\n` +
  `    private void applyLayoutHeight(View view, int targetHeight) {\n` +
  `        ViewGroup.LayoutParams lp = view.getLayoutParams();\n` +
  `        if (lp != null && lp.height != targetHeight) {\n` +
  `            lp.height = targetHeight;\n` +
  `            view.setLayoutParams(lp);\n` +
  `        }\n` +
  `        view.requestLayout();\n` +
  `    }\n\n` +
  `    private void forceWebViewRedraw(WebView webView) {\n` +
  `        invalidateTree(webView);\n` +
  `        webView.post(() -> invalidateTree(webView));\n` +
  `        webView.postDelayed(() -> invalidateTree(webView), 80);\n` +
  `        webView.postDelayed(() -> invalidateTree(webView), 180);\n` +
  `        webView.postDelayed(() -> invalidateTree(webView), 360);\n` +
  `    }\n\n` +
  `    private void invalidateTree(View view) {\n` +
  `        view.invalidate();\n` +
  `        view.postInvalidateOnAnimation();\n` +
  `        ViewParent parent = view.getParent();\n` +
  `        if (parent instanceof View) {\n` +
  `            View parentView = (View) parent;\n` +
  `            parentView.invalidate();\n` +
  `            parentView.postInvalidateOnAnimation();\n` +
  `        }\n` +
  `    }\n\n` +
  `    private void disableAncestorClipping(View view) {\n` +
  `        ViewParent parent = view.getParent();\n` +
  `        while (parent instanceof ViewGroup) {\n` +
  `            ViewGroup group = (ViewGroup) parent;\n` +
  `            group.setClipChildren(false);\n` +
  `            group.setClipToPadding(false);\n` +
  `            parent = group.getParent();\n` +
  `        }\n` +
  `    }\n\n` +
  `    private void applyCssSafeAreaVars(WebView webView, WindowInsetsCompat insets, boolean imeVisible) {\n` +
  `        Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());\n` +
  `        int top = toCssPx(bars.top);\n` +
  `        int bottom = imeVisible ? 0 : toCssPx(bars.bottom);\n` +
  `        String js = \"(() => { const s = document.documentElement.style;\" +\n` +
  `            \"s.setProperty('--safe-area-inset-top','\" + top + \"px');\" +\n` +
  `            \"s.setProperty('--safe-area-inset-bottom','\" + bottom + \"px');\" +\n` +
  `            \"window.dispatchEvent(new Event('resize')); })();\";\n` +
  `        webView.evaluateJavascript(js, null);\n` +
  `    }\n` +
  `\n` +
  `    private int toCssPx(int px) {\n` +
  `        float density = getResources().getDisplayMetrics().density;\n` +
  `        if (density <= 0) return px;\n` +
  `        return Math.round(px / density);\n` +
  `    }\n` +
  `}\n`);
writeFileSync(lifeArchiveWebViewPath,
  `package ${appId};\n\n` +
  `import android.content.Context;\n` +
  `import android.util.AttributeSet;\n` +
  `import android.view.inputmethod.EditorInfo;\n` +
  `import android.view.inputmethod.InputConnection;\n` +
  `import com.getcapacitor.CapacitorWebView;\n\n` +
  `public class LifeArchiveWebView extends CapacitorWebView {\n` +
  `    public LifeArchiveWebView(Context context, AttributeSet attrs) {\n` +
  `        super(context, attrs);\n` +
  `    }\n\n` +
  `    @Override\n` +
  `    public InputConnection onCreateInputConnection(EditorInfo outAttrs) {\n` +
  `        InputConnection connection = super.onCreateInputConnection(outAttrs);\n` +
  `        if (outAttrs != null) {\n` +
  `            outAttrs.imeOptions |= EditorInfo.IME_FLAG_NO_EXTRACT_UI | EditorInfo.IME_FLAG_NO_FULLSCREEN;\n` +
  `        }\n` +
  `        return connection;\n` +
  `    }\n` +
  `}\n`);
writeFileSync(bridgeLayoutPath,
  `<?xml version="1.0" encoding="utf-8"?>\n` +
  `<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"\n` +
  `    xmlns:tools="http://schemas.android.com/tools"\n` +
  `    android:layout_width="match_parent"\n` +
  `    android:layout_height="match_parent"\n` +
  `    tools:context="${appId}.MainActivity">\n\n` +
  `    <${appId}.LifeArchiveWebView\n` +
  `        android:id="@+id/webview"\n` +
  `        android:layout_width="fill_parent"\n` +
  `        android:layout_height="fill_parent" />\n\n` +
  `</androidx.coordinatorlayout.widget.CoordinatorLayout>\n`);
if (existsSync('android/app/src/main/java/com/realitygit')) {
  rmSync('android/app/src/main/java/com/realitygit', { recursive: true, force: true });
}

const stringsPath = 'android/app/src/main/res/values/strings.xml';
let strings = readFileSync(stringsPath, 'utf8');
strings = strings.replace(/<string name="package_name">[^<]*<\/string>/, `<string name="package_name">${appId}</string>`)
                 .replace(/<string name="custom_url_scheme">[^<]*<\/string>/, `<string name="custom_url_scheme">${appId}</string>`);
if (!strings.includes('name="shortcut_quick_capture"')) {
  strings = strings.replace('</resources>',
    `    <string name="shortcut_quick_capture">Quick capture</string>\n` +
    `    <string name="shortcut_quick_capture_long">Quick capture in Life Archive</string>\n` +
    `</resources>`);
}
writeFileSync(stringsPath, strings);
console.log(`Android Java package + string resources -> "${appId}"`);
console.log('Android WebView -> LifeArchiveWebView layout + IME no-extract flags');

// --- Android launcher shortcut: long-press app icon -> quick capture ---
const shortcutsPath = 'android/app/src/main/res/xml/shortcuts.xml';
mkdirSync('android/app/src/main/res/xml', { recursive: true });
writeFileSync(shortcutsPath,
  `<?xml version="1.0" encoding="utf-8"?>\n` +
  `<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">\n` +
  `    <shortcut\n` +
  `        android:shortcutId="quick"\n` +
  `        android:enabled="true"\n` +
  `        android:icon="@mipmap/ic_launcher"\n` +
  `        android:shortcutShortLabel="@string/shortcut_quick_capture"\n` +
  `        android:shortcutLongLabel="@string/shortcut_quick_capture_long">\n` +
  `        <intent\n` +
  `            android:action="android.intent.action.VIEW"\n` +
  `            android:targetPackage="${appId}"\n` +
  `            android:targetClass="${appId}.MainActivity"\n` +
  `            android:data="${appId}://quick" />\n` +
  `    </shortcut>\n` +
  `</shortcuts>\n`);
console.log('Android shortcuts -> quick capture launcher shortcut');

// --- Android manifest: camera permission + stable IME viewport ---
const manifestPath = 'android/app/src/main/AndroidManifest.xml';
let m = readFileSync(manifestPath, 'utf8');
if (!m.includes('android.permission.CAMERA')) {
  m = m.replace('</manifest>', '    <uses-permission android:name="android.permission.CAMERA" />\n</manifest>');
  console.log('AndroidManifest -> added CAMERA permission');
}
if (!m.includes('android.permission.POST_NOTIFICATIONS')) {
  m = m.replace('</manifest>', '    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n</manifest>');
  console.log('AndroidManifest -> added POST_NOTIFICATIONS permission');
}
if (!m.includes('android.permission.RECORD_AUDIO')) {
  m = m.replace('</manifest>', '    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n</manifest>');
  console.log('AndroidManifest -> added RECORD_AUDIO permission');
}
if (/android:windowSoftInputMode="[^"]*"/.test(m)) {
  m = m.replace(/android:windowSoftInputMode="[^"]*"/, 'android:windowSoftInputMode="adjustResize"');
} else {
  m = m.replace(/<activity\b/, '<activity android:windowSoftInputMode="adjustResize"');
}
if (!m.includes('android.app.shortcuts')) {
  m = m.replace(/\n\s*<\/activity>/,
    `            <meta-data android:name="android.app.shortcuts" android:resource="@xml/shortcuts" />\n` +
    `        </activity>`);
}
if (!m.includes(`android:scheme="${appId}"`)) {
  m = m.replace(/\n\s*<\/activity>/,
    `            <intent-filter>\n` +
    `                <action android:name="android.intent.action.VIEW" />\n` +
    `                <category android:name="android.intent.category.DEFAULT" />\n` +
    `                <category android:name="android.intent.category.BROWSABLE" />\n` +
    `                <data android:scheme="${appId}" android:host="quick" />\n` +
    `            </intent-filter>\n` +
    `        </activity>`);
}
writeFileSync(manifestPath, m);
console.log('AndroidManifest -> Activity windowSoftInputMode="adjustResize" (Android/WebView owns IME resize)');

// Status-bar overlap is handled at runtime by @capacitor-community/safe-area
// (reads real window insets, injects --safe-area-inset-* CSS vars) — see initNative().
