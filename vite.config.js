import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Для unit-тестів
  test: {
    exclude: ['**/node_modules/**', '**/tests/*.e2e.test.js'],
  },

  // Сервер та проксі
  server: {
    proxy: {
      '/ingest': {
        target: 'https://us.i.posthog.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ingest/, ''),
      },
    },
  },

  build: {
    sourcemap: true
  },

  plugins: [sentryVitePlugin({
    org: "oleksii-4v",
    project: "javascript"
  })]
});