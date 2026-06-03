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
    // resize:'none' — the plugin must NOT resize the body/webview. The web layer owns
    // keyboard avoidance (viewport interactive-widget=resizes-content + a bounded
    // visualViewport safety net in app.js). 'body'/'native' fought that and double-shrank
    // the layout, which is what kept the focused field misbehaving. See initKeyboard().
    Keyboard: { resize: 'none' as any }
  }
};

export default config;
