import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Ігнор файлів з назвою .e2e.test.js
    exclude: ['**/node_modules/**', '**/tests/*.e2e.test.js'],
  },
});