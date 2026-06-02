import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifearchive.app',
  appName: 'Life Archive',
  webDir: 'www',
  // route fetch/XHR through native so the AI photo-scan can call the
  // (CORS-less) Zhipu API directly from the WebView without CORS errors.
  plugins: { CapacitorHttp: { enabled: true } }
};

export default config;
