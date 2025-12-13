/**
 * scripts/validate-mappings.ts
 *
 * 기본 매핑 테이블 검증 스크립트
 */

import {
  BASIC_MAPPINGS,
  getMappingCount,
  getMappingCountByGan,
  getMappingCountByGeokguk,
  validateMappings
} from '../src/data/basic-mappings';

console.log('='.repeat(60));
console.log('📊 기본 매핑 테이블 검증');
console.log('='.repeat(60));
console.log();

// 1. 개수 확인
console.log('1️⃣  매핑 개수');
console.log(`   총 매핑: ${getMappingCount()}개 / 80개`);
console.log(`   진행률: ${((getMappingCount() / 80) * 100).toFixed(1)}%`);
console.log();

// 2. 일간별 분포
console.log('2️⃣  일간별 매핑 분포');
const byGan = getMappingCountByGan();
Object.entries(byGan).forEach(([gan, count]) => {
  const bar = '█'.repeat(count);
  const empty = '░'.repeat(8 - count);
  console.log(`   ${gan}: ${bar}${empty} ${count}/8`);
});
console.log();

// 3. 격국별 분포
console.log('3️⃣  격국별 매핑 분포');
const byGeokguk = getMappingCountByGeokguk();
Object.entries(byGeokguk).forEach(([geokguk, count]) => {
  const expected = 10; // 10천간
  const bar = '█'.repeat(Math.min(count, 10));
  const empty = '░'.repeat(Math.max(0, 10 - count));
  console.log(`   ${geokguk.padEnd(8, ' ')}: ${bar}${empty} ${count}/${expected}`);
});
console.log();

// 4. 유효성 검증
console.log('4️⃣  유효성 검증');
const validation = validateMappings();

if (validation.errors.length > 0) {
  console.log(`   ❌ 오류: ${validation.errors.length}개`);
  validation.errors.forEach(err => console.log(`      - ${err}`));
} else {
  console.log(`   ✅ 오류 없음`);
}

if (validation.warnings.length > 0) {
  console.log(`   ⚠️  경고: ${validation.warnings.length}개`);
  validation.warnings.forEach(warn => console.log(`      - ${warn}`));
}
console.log();

// 5. 샘플 매핑 출력
console.log('5️⃣  샘플 매핑 (갑일간 + 정관격)');
const sample = BASIC_MAPPINGS[0];
if (sample) {
  console.log(`   일간: ${sample.일간}`);
  console.log(`   격국: ${sample.격국}`);
  console.log(`   용신: ${sample.용신}`);
  console.log(`   희신: ${sample.희신.join(', ')}`);
  console.log(`   기신: ${sample.기신.join(', ')}`);
  console.log(`   확신도: ${sample.기본확신도}`);
  console.log(`   근거 개수: ${sample.근거.length}개`);
  console.log(`   출처: ${sample.출처.primary}`);
  console.log(`   예외상황: ${sample.예외상황.length}개`);
}
console.log();

// 6. 종합 결과
console.log('='.repeat(60));
if (validation.valid) {
  console.log('✅ 검증 통과!');
} else {
  console.log('❌ 검증 실패 - 오류를 수정하세요');
  process.exit(1);
}
console.log('='.repeat(60));
