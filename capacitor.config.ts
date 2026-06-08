import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.axomai.app',
  appName: 'Axom AI',
  webDir: 'out',
  server: {
    url: 'https://axom-ai-bonapart07s-projects.vercel.app',
    cleartext: true
  }
};

export default config;
