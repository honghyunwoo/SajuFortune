/**
 * Import 경계 검사 테스트
 * 서버 코드에서 @/lib/* (클라이언트 경로) import가 없는지 정적 검사
 */

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

describe('Import 경계 검사 (Layer Boundary)', () => {
  it('서버 코드에서 @/lib/* import 없음', async () => {
    const serverFiles = await glob('server/**/*.{ts,tsx,js,jsx}', {
      ignore: ['**/node_modules/**', '**/dist/**'],
      cwd: process.cwd(),
    });

    const violations: Array<{ file: string; line: number; content: string }> = [];

    for (const file of serverFiles) {
      const fullPath = path.join(process.cwd(), file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // @/lib/* 패턴 탐지
        if (line.match(/from\s+['"]@\/lib\/[^'"]+['"]/)) {
          violations.push({
            file,
            line: index + 1,
            content: line.trim(),
          });
        }
        // @/lib 단독 패턴 탐지
        if (line.match(/from\s+['"]@\/lib['"]/)) {
          violations.push({
            file,
            line: index + 1,
            content: line.trim(),
          });
        }
      });
    }

    if (violations.length > 0) {
      console.error('\n❌ 서버 → 클라이언트 레이어 경계 위반 발견:');
      violations.forEach(v => {
        console.error(`  ${v.file}:${v.line}`);
        console.error(`    ${v.content}`);
      });
      console.error('\n💡 해결: @/lib/* → @shared/* 로 변경하세요\n');
    }

    expect(violations).toEqual([]);
  });

  it('서버 코드에서 ../client/src/* 상대경로 import 없음', async () => {
    const serverFiles = await glob('server/**/*.{ts,tsx,js,jsx}', {
      ignore: ['**/node_modules/**', '**/dist/**'],
      cwd: process.cwd(),
    });

    const violations: Array<{ file: string; line: number; content: string }> = [];

    for (const file of serverFiles) {
      const fullPath = path.join(process.cwd(), file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // ../client/src/* 패턴 탐지
        if (line.match(/from\s+['"](\.\.\/)+client\/src\/[^'"]+['"]/)) {
          violations.push({
            file,
            line: index + 1,
            content: line.trim(),
          });
        }
      });
    }

    if (violations.length > 0) {
      console.error('\n❌ 서버 → 클라이언트 상대경로 import 발견:');
      violations.forEach(v => {
        console.error(`  ${v.file}:${v.line}`);
        console.error(`    ${v.content}`);
      });
    }

    expect(violations).toEqual([]);
  });

  it('@shared/* 경로는 서버/클라이언트 양쪽에서 사용 가능', async () => {
    const allFiles = await glob('{server,client/src}/**/*.{ts,tsx}', {
      ignore: ['**/node_modules/**', '**/dist/**'],
      cwd: process.cwd(),
    });

    let sharedImportCount = 0;

    for (const file of allFiles) {
      const fullPath = path.join(process.cwd(), file);
      const content = fs.readFileSync(fullPath, 'utf-8');

      // @shared/* 사용 횟수 카운트
      const matches = content.match(/from\s+['"]@shared\/[^'"]+['"]/g);
      if (matches) {
        sharedImportCount += matches.length;
      }
    }

    console.log(`\n✅ @shared/* import 사용 횟수: ${sharedImportCount}`);
    expect(sharedImportCount).toBeGreaterThan(0);
  });

  it('클라이언트 코드에서 @/lib/* 사용은 허용', async () => {
    const clientFiles = await glob('client/src/**/*.{ts,tsx}', {
      ignore: ['**/node_modules/**', '**/dist/**'],
      cwd: process.cwd(),
    });

    let clientLibImportCount = 0;

    for (const file of clientFiles) {
      const fullPath = path.join(process.cwd(), file);
      const content = fs.readFileSync(fullPath, 'utf-8');

      const matches = content.match(/from\s+['"]@\/lib\/[^'"]+['"]/g);
      if (matches) {
        clientLibImportCount += matches.length;
      }
    }

    console.log(`\n✅ 클라이언트 @/lib/* import 사용 횟수: ${clientLibImportCount}`);
    // 클라이언트에서는 사용 가능 (0이 아닐 수 있음)
    expect(clientLibImportCount).toBeGreaterThanOrEqual(0);
  });

  it('ESLint 규칙 파일 존재 확인', () => {
    const eslintConfigPath = path.join(process.cwd(), '.eslintrc.cjs');
    const exists = fs.existsSync(eslintConfigPath);

    expect(exists).toBe(true);

    if (exists) {
      const content = fs.readFileSync(eslintConfigPath, 'utf-8');
      expect(content).toContain('no-restricted-imports');
      expect(content).toContain('@/lib');
      console.log('\n✅ ESLint 경계 보호 규칙 설정됨');
    }
  });
});
