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
    // resize the WebView when the keyboard opens, so the fixed bottom tab bar
    // sits just above the keyboard (no mid-screen floating, no vanishing).
    Keyboard: { resize: 'native' as any }
  }
};

export default config;
