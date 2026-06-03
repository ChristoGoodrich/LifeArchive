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
    // resize:'none' — do NOT let the plugin resize the web view. This app is
    // edge-to-edge (safe-area plugin), and Android ignores native adjustResize in
    // edge-to-edge, so we handle the IME at the web layer instead: the viewport meta
    // interactive-widget=resizes-content (index.html) shrinks the layout viewport and
    // keeps the focused field visible. The plugin just emits show/hide events.
    Keyboard: { resize: 'none' as any }
  }
};

export default config;
