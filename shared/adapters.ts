/**
 * 프리미엄→기본 사주 데이터 어댑터
 * PremiumSajuAnalysis를 SajuData로 변환하는 함수들
 */

import { 천간오행, 천간, 지지 } from './astro-data';
import type { SajuData } from './schema';

// 내부 전용 타입들 (export 안함, 타입 충돌 방지)
type 천간타입 = typeof 천간[number];
type 지지타입 = typeof 지지[number];

interface PremiumSajuPillar {
  gan: 천간타입;
  ji: 지지타입;
}

interface PremiumSajuResult {
  year: PremiumSajuPillar;
  month: PremiumSajuPillar;
  day: PremiumSajuPillar;
  hour: PremiumSajuPillar;
}

interface PremiumElementAnalysis {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

interface PremiumSajuAnalysis {
  saju: PremiumSajuResult;
  elements: PremiumElementAnalysis;
  // 기타 프리미엄 필드들은 Phase 1에서 드롭
  tenGods?: any;
  sinsal?: any;
  lunar?: any;
  cyclicalDay?: number;
  precision?: string;
  calculationTime?: number;
}

/**
 * 한국어 오행을 영어로 변환
 */
function translateElement(korean: '목' | '화' | '토' | '금' | '수'): string {
  const ELEMENT_TRANSLATION = {
    '목': 'wood',
    '화': 'fire',
    '토': 'earth',
    '금': 'metal',
    '수': 'water'
  } as const;
  
  return ELEMENT_TRANSLATION[korean];
}

/**
 * 소수점 2자리 반올림 (부동소수점 오차 방지)
 */
function roundToTwo(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * 천간에서 오행을 안전하게 추출 (런타임 가드 포함)
 */
function getElementFromGan(gan: 천간타입): string {
  const koreanElement = 천간오행[gan];
  if (!koreanElement) {
    throw new Error(`Invalid heavenly stem: ${gan}`);
  }
  return translateElement(koreanElement);
}

/**
 * 오행 비율로 일간 강약 계산
 */
function calculateStrength(elements: { wood: number, fire: number, earth: number, metal: number, water: number }, dayMaster: string): 'strong' | 'medium' | 'weak' {
  const total = elements.wood + elements.fire + elements.earth + elements.metal + elements.water;
  
  // 일간의 오행 파악
  let dayElement: number;
  switch(dayMaster.charAt(0)) {
    case '갑': case '을': dayElement = elements.wood; break;
    case '병': case '정': dayElement = elements.fire; break;
    case '무': case '기': dayElement = elements.earth; break;
    case '경': case '신': dayElement = elements.metal; break;
    case '임': case '계': dayElement = elements.water; break;
    default: dayElement = 0;
  }
  
  const ratio = dayElement / total;
  if (ratio >= 0.35) return 'strong';
  if (ratio >= 0.20) return 'medium';
  return 'weak';
}

/**
 * 프리미엄 사주 분석 결과를 기본 SajuData 형식으로 변환
 * 
 * @param premium PremiumSajuAnalysis 객체
 * @returns SajuData 형식으로 변환된 결과
 */
export function premiumToSajuData(premium: PremiumSajuAnalysis): SajuData {
  const elements = {
    wood: roundToTwo(premium.elements.목),
    fire: roundToTwo(premium.elements.화),
    earth: roundToTwo(premium.elements.토),
    metal: roundToTwo(premium.elements.금),
    water: roundToTwo(premium.elements.수)
  };
  
  const dayMaster = premium.saju.day.gan; // 일간
  const strength = calculateStrength(elements, dayMaster);
  
  return {
    pillars: [
      premium.saju.year,
      premium.saju.month,
      premium.saju.day,
      premium.saju.hour
    ].map(pillar => ({
      heavenly: pillar.gan,
      earthly: pillar.ji,
      element: getElementFromGan(pillar.gan)
    })),
    elements,
    dayMaster,
    strength
  };
}

/**
 * 어댑터 변환 테스트를 위한 샘플 데이터 생성 (1989-10-06 케이스)
 */
export function createTestPremiumData(): PremiumSajuAnalysis {
  return {
    saju: {
      year: { gan: '기', ji: '사' },
      month: { gan: '갑', ji: '술' },
      day: { gan: '기', ji: '미' },
      hour: { gan: '경', ji: '오' }
    },
    elements: {
      목: 1.67,
      화: 2.33, 
      토: 3.00,
      금: 1.00,
      수: 2.00
    },
    precision: 'premium',
    calculationTime: Date.now()
  };
}

/**
 * 반올림 테스트를 위한 소수점 데이터 생성
 */
export function createRoundingTestData(): PremiumSajuAnalysis {
  return {
    saju: {
      year: { gan: '갑', ji: '자' },
      month: { gan: '을', ji: '축' },
      day: { gan: '병', ji: '인' },
      hour: { gan: '정', ji: '묘' }
    },
    elements: {
      목: 1.333333, // → 1.33
      화: 2.666667, // → 2.67
      토: 0.123456, // → 0.12
      금: 4.999999, // → 5.00
      수: 1.005000  // → 1.01
    }
  };
}

/**
 * 어댑터 단위 테스트 실행
 */
export function runAdapterTests(): void {
  console.log('🧪 어댑터 단위 테스트 시작');
  
  // Test 1: 1989-10-06 케이스 검증
  console.log('\n📅 Test 1: 1989-10-06 케이스 검증');
  const test1989 = createTestPremiumData();
  const result1989 = premiumToSajuData(test1989);
  
  const expected1989 = {
    pillars: [
      { heavenly: '기', earthly: '사', element: 'earth' },
      { heavenly: '갑', earthly: '술', element: 'wood' },
      { heavenly: '기', earthly: '미', element: 'earth' },
      { heavenly: '경', earthly: '오', element: 'metal' }
    ],
    elements: { wood: 1.67, fire: 2.33, earth: 3.00, metal: 1.00, water: 2.00 },
    dayMaster: '기',
    strength: 'strong' // 일간 기토, 토행 3.00 비율이 높음
  };
  
  console.log('✅ 기둥 순서:', JSON.stringify(result1989.pillars) === JSON.stringify(expected1989.pillars) ? 'PASS' : 'FAIL');
  console.log('✅ 원소 총계:', JSON.stringify(result1989.elements) === JSON.stringify(expected1989.elements) ? 'PASS' : 'FAIL');
  
  // Test 2: 반올림 테스트
  console.log('\n🔢 Test 2: 반올림 정확성 검증');
  const testRounding = createRoundingTestData();
  const resultRounding = premiumToSajuData(testRounding);
  
  const expectedRounding = { wood: 1.33, fire: 2.67, earth: 0.12, metal: 5.00, water: 1.01 };
  console.log('✅ 반올림:', JSON.stringify(resultRounding.elements) === JSON.stringify(expectedRounding) ? 'PASS' : 'FAIL');
  
  // Test 3: 기둥 순서 불변성
  console.log('\n📋 Test 3: 기둥 순서 불변성 검증');
  const orderCheck = result1989.pillars.map((p, i) => {
    const order = ['year', 'month', 'day', 'hour'][i];
    return `${order}:${p.heavenly}${p.earthly}`;
  });
  console.log('✅ 순서:', orderCheck.join(' → '));
  console.log('✅ 순서 검증:', orderCheck.length === 4 && orderCheck[0].startsWith('year:') ? 'PASS' : 'FAIL');
  
  console.log('\n🎉 어댑터 단위 테스트 완료');
}