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
    // @capacitor-community/safe-area owns the edge-to-edge inset math. Let it
    // pass the real insets through to CSS instead of Capacitor's SystemBars shim
    // applying a second handling layer.
    SystemBars: { insetsHandling: 'disable' as any },
    // Android/WebView owns the IME resize through manifest adjustResize. The web
    // layer only reconciles viewport/native keyboard events for focused-field
    // visibility and bottom padding.
    Keyboard: { resize: 'native' as any }
  }
};

export default config;
