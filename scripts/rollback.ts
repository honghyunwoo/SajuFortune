/**
 * 데이터베이스 마이그레이션 롤백 스크립트
 * 마지막 마이그레이션을 되돌립니다
 */

import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import * as readline from 'readline';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function confirmRollback(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\n⚠️  정말로 마지막 마이그레이션을 되돌리시겠습니까? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  console.log('🔄 마이그레이션 롤백 도구\n');
  console.log(`📍 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  데이터베이스: ${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'unknown'}\n`);

  try {
    // 현재 적용된 마이그레이션 확인
    console.log('📋 현재 적용된 마이그레이션:');
    const migrations = await sql`
      SELECT * FROM drizzle.__drizzle_migrations 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    if (migrations.length === 0) {
      console.log('   적용된 마이그레이션이 없습니다.');
      process.exit(0);
    }

    migrations.forEach((row: any, index: number) => {
      console.log(`   ${index + 1}. ${row.hash} - ${new Date(row.created_at).toLocaleString()}`);
    });

    console.log(`\n🎯 롤백 대상: ${migrations[0].hash}`);
    
    // 사용자 확인
    const confirmed = await confirmRollback();
    
    if (!confirmed) {
      console.log('\n❌ 롤백 취소됨.');
      process.exit(0);
    }

    // 롤백 실행
    console.log('\n🔄 롤백 실행 중...');
    
    // 마지막 마이그레이션 제거
    await sql`
      DELETE FROM drizzle.__drizzle_migrations 
      WHERE hash = ${migrations[0].hash}
    `;

    console.log('✅ 롤백 완료!');
    console.log('   ⚠️  주의: 스키마 변경은 수동으로 되돌려야 합니다.');
    console.log('   마이그레이션 SQL 파일을 확인하여 DROP TABLE 등을 수동 실행하세요.');
    
  } catch (error) {
    console.error('\n❌ 롤백 실패:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();

