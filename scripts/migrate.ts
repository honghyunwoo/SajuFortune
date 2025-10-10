/**
 * 데이터베이스 마이그레이션 스크립트
 * PRD 6.1: 프로덕션 배포 전 필수 실행
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL 환경변수가 설정되지 않았습니다.');
  console.error('   .env 파일에 DATABASE_URL을 추가해주세요.');
  process.exit(1);
}

async function main() {
  console.log('🚀 데이터베이스 마이그레이션 시작...\n');
  console.log(`📍 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  데이터베이스: ${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'unknown'}\n`);

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  try {
    console.log('📦 마이그레이션 파일 적용 중...');
    
    await migrate(db, { migrationsFolder: './migrations' });
    
    console.log('\n✅ 마이그레이션 완료!');
    console.log('   모든 테이블이 성공적으로 생성/업데이트되었습니다.');
    
    // 마이그레이션 히스토리 확인
    console.log('\n📋 적용된 마이그레이션:');
    const result = await sql`
      SELECT * FROM drizzle.__drizzle_migrations 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    
    result.forEach((row: any, index: number) => {
      console.log(`   ${index + 1}. ${row.hash} - ${new Date(row.created_at).toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('\n❌ 마이그레이션 실패:', error);
    console.error('\n해결 방법:');
    console.error('   1. DATABASE_URL이 올바른지 확인');
    console.error('   2. 데이터베이스가 실행 중인지 확인');
    console.error('   3. 네트워크 연결 확인 (NeonDB의 경우)');
    process.exit(1);
  }

  process.exit(0);
}

main();

