/**
 * 매핑 조회 시스템 테스트
 */

import { lookup희신기신, lookup희신기신_다중관점, validate희신기신, getMappingStats } from '../src/data/mapping-lookup';
import type { LookupContext } from '../src/data/mapping-lookup';

console.log('============================================================');
console.log('매핑 조회 시스템 테스트');
console.log('============================================================\n');

// 1. 통계 정보
console.log('1️⃣  통계 정보');
const stats = getMappingStats();
console.log(`   총 매핑 수: ${stats.총매핑수}개`);
console.log(`   평균 확신도: ${stats.평균확신도.toFixed(2)}\n`);

// 2. 기본 조회 테스트 (Context 없음)
console.log('2️⃣  기본 조회 테스트 (갑일간 + 정관격, Context 없음)');
const 기본결과 = lookup희신기신('갑', '정관격');
if (기본결과) {
  console.log(`   희신: ${기본결과.희신.join(', ')}`);
  console.log(`   기신: ${기본결과.기신.join(', ')}`);
  console.log(`   확신도: ${기본결과.확신도}`);
  console.log(`   적용규칙: ${기본결과.적용규칙}`);
  console.log(`   설명: ${기본결과.설명}\n`);
} else {
  console.log('   ❌ 조회 실패\n');
}

// 3. 예외상황 테스트 (일간 태왕)
console.log('3️⃣  예외상황 테스트 (갑일간 + 정관격, 일간 태왕)');
const context태왕: LookupContext = {
  일간강약: '태왕',
  비겁개수: 4,
  인성개수: 2
};
const 예외결과 = lookup희신기신('갑', '정관격', context태왕);
if (예외결과) {
  console.log(`   희신: ${예외결과.희신.join(', ')}`);
  console.log(`   기신: ${예외결과.기신.join(', ')}`);
  console.log(`   확신도: ${예외결과.확신도}`);
  console.log(`   적용규칙: ${예외결과.적용규칙}`);
  if (예외결과.예외상황설명) {
    console.log(`   예외상황: ${예외결과.예외상황설명}`);
  }
  console.log(`   설명: ${예외결과.설명}\n`);
} else {
  console.log('   ❌ 조회 실패\n');
}

// 4. 음간 테스트 (을일간 + 정관격)
console.log('4️⃣  음간 테스트 (을일간 + 정관격)');
const 을일간결과 = lookup희신기신('을', '정관격');
if (을일간결과) {
  console.log(`   희신: ${을일간결과.희신.join(', ')}`);
  console.log(`   기신: ${을일간결과.기신.join(', ')}`);
  console.log(`   확신도: ${을일간결과.확신도}`);
  console.log(`   설명: ${을일간결과.설명}\n`);
}

// 5. 정화 + 정관격 (임정합목 고려)
console.log('5️⃣  특수 케이스 (정일간 + 정관격)');
const 정일간결과 = lookup희신기신('정', '정관격');
if (정일간결과) {
  console.log(`   희신: ${정일간결과.희신.join(', ')}`);
  console.log(`   기신: ${정일간결과.기신.join(', ')}`);
  console.log(`   확신도: ${정일간결과.확신도}`);
  console.log(`   근거 수: ${정일간결과.근거.length}개\n`);
}

// 6. 검증 테스트
console.log('6️⃣  희신/기신 검증 테스트');
if (기본결과) {
  const validation = validate희신기신(기본결과.희신, 기본결과.기신);
  console.log(`   Valid: ${validation.valid ? '✅' : '❌'}`);
  if (!validation.valid) {
    console.log(`   Errors: ${validation.errors.join(', ')}`);
  }
}
console.log();

// 7. 다중 관점 조회
console.log('7️⃣  다중 관점 조회 (경일간 + 편관격)');
const 다중결과 = lookup희신기신_다중관점('경', '편관격');
console.log(`   관점 수: ${다중결과.length}개`);
다중결과.forEach((결과, idx) => {
  console.log(`   [${idx + 1}] 희신: ${결과.희신.join(', ')}, 확신도: ${결과.확신도}`);
});
console.log();

// 8. 재다신약 테스트
console.log('8️⃣  재다신약 예외 테스트 (무일간 + 편재격)');
const context재다신약: LookupContext = {
  일간강약: '약',
  재성개수: 4,
  비겁개수: 0,
  인성개수: 1
};
const 재다신약결과 = lookup희신기신('무', '편재격', context재다신약);
if (재다신약결과) {
  console.log(`   희신: ${재다신약결과.희신.join(', ')}`);
  console.log(`   기신: ${재다신약결과.기신.join(', ')}`);
  console.log(`   적용규칙: ${재다신약결과.적용규칙}`);
  if (재다신약결과.예외상황설명) {
    console.log(`   예외: ${재다신약결과.예외상황설명}`);
  }
}

console.log('\n============================================================');
console.log('✅ 테스트 완료!');
console.log('============================================================');
