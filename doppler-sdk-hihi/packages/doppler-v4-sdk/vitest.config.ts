import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    sequence: {
      shuffle: false,
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    retry: 0,
    testTimeout: 100000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
