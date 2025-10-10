import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      '__tests__/**/*.test.ts',
      '__tests__/**/*.test.tsx',
      '__tests__/**/*.spec.ts',
      '__tests__/**/*.spec.tsx'
    ],
    exclude: [
      '**/node_modules/**',
      '**/.bun/**',
      '**/.cursor/**',
      '**/dist/**',
      '**/coverage/**',
      '**/e2e/**',  // Playwright E2E 테스트 제외
      '**/saju-project/**',  // 외부 프로젝트 제외
      '**/bojang/**'  // 외부 프로젝트 제외
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/',
        'dist/',
        'coverage/',
        '**/*.config.ts',
        '**/*.d.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@server': path.resolve(__dirname, './server')
    }
  }
});
