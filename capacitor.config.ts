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
    // Let the IME shrink the WebView so the focused field stays visible.
    // Pairs with Android's Activity windowSoftInputMode="adjustResize"
    // (scripts/set-android-version.mjs); 'native' resizes the whole web view.
    Keyboard: { resize: 'native' as any }
  }
};

export default config;
