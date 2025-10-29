import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gigabase.app',
  appName: 'Gigabase',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
