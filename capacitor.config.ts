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
    // Android uses resizeOnFullScreen; the web layer also consumes keyboardHeight
    // as a fallback for WebViews that ignore interactive-widget.
    Keyboard: { resize: 'body' as any, resizeOnFullScreen: true }
  }
};

export default config;
