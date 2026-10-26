import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [react(), VitePWA({ registerType: 'autoUpdate', includeAssets: ['favicon.svg'], manifest: { name: 'Vanta JSON Workbench', short_name: 'Vanta', description: 'A local workspace for inspecting and comparing JSON payloads.', theme_color: '#10110f', background_color: '#10110f', display: 'standalone', start_url: '/', icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }] }, workbox: { globPatterns: ['**/*.{js,css,html,svg,woff2}'] } })],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', css: true }
});
