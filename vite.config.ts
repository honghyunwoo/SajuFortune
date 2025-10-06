import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React 코어
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }

          // Radix UI 컴포넌트들
          if (id.includes('@radix-ui')) {
            return 'ui-vendor';
          }

          // PDF 라이브러리 (동적 import되므로 별도 청크)
          if (id.includes('jspdf')) {
            return 'pdf-vendor';
          }

          // 아이콘
          if (id.includes('lucide-react')) {
            return 'icons';
          }

          // TanStack Query (큰 라이브러리)
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }

          // React Router
          if (id.includes('react-router')) {
            return 'router-vendor';
          }

          // DOMPurify
          if (id.includes('dompurify') || id.includes('isomorphic-dompurify')) {
            return 'purify-vendor';
          }

          // html2canvas
          if (id.includes('html2canvas')) {
            return 'canvas-vendor';
          }

          // 명리학 데이터 (큰 데이터)
          if (id.includes('@shared/astro-data') || id.includes('@shared/solar-terms') || id.includes('@shared/sinsal-data')) {
            return 'astro-data';
          }

          // 나머지 node_modules는 vendor로
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // 프로덕션에서 sourcemap 비활성화로 크기 절감
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
