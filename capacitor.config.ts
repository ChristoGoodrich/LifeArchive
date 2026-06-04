import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifearchive.app',
  appName: 'Life Archive',
  webDir: 'www',
  // Do NOT globally patch fetch/XHR: it strips Supabase's auth (JWT) header on
  // Android, breaking cloud sync (RLS denies the write). Supabase sends proper
  // CORS headers so normal fetch works. Only the (CORS-less) Zhipu AI call uses
  // CapacitorHttp.request() explicitly (see apiPost() in app.js).
  plugins: {
    CapacitorHttp: { enabled: false },
    // Android reads resizeOnFullScreen, not resize. With edge-to-edge/safe-area system
    // bars, adjustResize can be ignored unless this workaround resizes the WebView child.
    // Keep resize:'native' for iOS, but the Android fix is resizeOnFullScreen + manifest
    // adjustResize + the bounded visualViewport/native-height fallback in initKeyboard().
    Keyboard: { resize: 'native' as any, resizeOnFullScreen: true }
  }
};

export default config;
