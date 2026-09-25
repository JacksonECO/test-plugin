import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(import.meta.dirname, './src'),
      test: path.resolve(import.meta.dirname, './test'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./test/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['lcov'],
      include: ['src/**/*.{ts,js}'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/test/**', 'src/**/main.ts'],
    },
  },
});
