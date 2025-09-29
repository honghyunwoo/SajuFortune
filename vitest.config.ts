import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config'; // Import your vite.config.ts
import path from 'path'; // Import path module

export default mergeConfig(
  viteConfig, // Merge with your existing Vite config
  defineConfig({
    test: {
      include: ['**/*.test.ts'],
      root: path.resolve(__dirname, './'),
      globals: true, // Enable global APIs like describe, it, expect
      environment: 'node', // Use Node.js environment for tests // Explicitly set Vitest's root to project root
    },
  })
);
