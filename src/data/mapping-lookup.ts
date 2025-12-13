/**
 * 희신/기신 매핑 조회 시스템
 *
 * Phase 3.2: 80개 기본 매핑 테이블을 조회하고 예외상황을 처리하는 시스템
 *
 * 설계 원칙:
 * 1. 기본 매핑 우선 조회
 * 2. Context 기반 예외상황 자동 감지
 * 3. 확신도 동적 조정
 * 4. 명확한 설명 제공
 */

import { BASIC_MAPPINGS } from './basic-mappings';
import type { 오행타입 } from '../../shared/astro-data';
import type { 기본매핑, SourceInfo } from '../../shared/types';

// ============================================
// 타입 정의
// ============================================

/**
 * 조회 컨텍스트
 * 사주 전체 정보를 기반으로 예외상황 판단
 */
export interface LookupContext {
  /** 일간 강약 (태왕/왕/중화/약/극약) */
  일간강약?: '태왕' | '왕' | '중화' | '약' | '극약';

  /** 월령 투출 천간 */
  월령천간?: string;

  /** 오행 분포 (목/화/토/금/수 각각 개수) */
  오행분포?: Record<오행타입, number>;

  /** 투출된 천간 목록 */
  투출천간?: string[];

  /** 비겁 개수 */
  비겁개수?: number;

  /** 식상 개수 */
  식상개수?: number;

  /** 재성 개수 */
  재성개수?: number;

  /** 관성 개수 */
  관성개수?: number;

  /** 인성 개수 */
  인성개수?: number;
}

/**
 * 조회 결과
 */
export interface LookupResult {
  /** 희신 오행 목록 */
  희신: 오행타입[];

  /** 기신 오행 목록 */
  기신: 오행타입[];

  /** 확신도 (0-1) */
  확신도: number;

  /** 적용된 규칙 (기본/예외) */
  적용규칙: '기본' | '예외';

  /** 적용된 예외상황 설명 (예외인 경우만) */
  예외상황설명?: string;

  /** 상세 설명 */
  설명: string;

  /** 근거 */
  근거: string[];

  /** 출처 정보 */
  출처: SourceInfo;
}

// ============================================
// 내부 유틸리티 함수
// ============================================

/**
 * 오행 문자열을 오행타입으로 변환
 */
function to오행타입(오행: string): 오행타입 {
  const map: Record<string, 오행타입> = {
    '목': '목',
    '화': '화',
    '토': '토',
    '금': '금',
    '수': '수'
  };
  return map[오행] || '목'; // fallback
}

/**
 * 일간 강약 판단
 * Context에 명시되지 않은 경우 오행분포로 추정
 */
function infer일간강약(context: LookupContext): '태왕' | '왕' | '중화' | '약' | '극약' {
  if (context.일간강약) {
    return context.일간강약;
  }

  // 비겁과 인성 개수로 추정
  const 생조개수 = (context.비겁개수 || 0) + (context.인성개수 || 0);

  if (생조개수 >= 5) return '태왕';
  if (생조개수 >= 4) return '왕';
  if (생조개수 >= 2) return '중화';
  if (생조개수 >= 1) return '약';
  return '극약';
}

/**
 * 특정 천간이 투출되었는지 확인
 */
function is투출(천간: string, context: LookupContext): boolean {
  return context.투출천간?.includes(천간) || false;
}

/**
 * 예외상황 조건 평가
 *
 * 예외상황 condition 문자열을 파싱하여 현재 context와 비교
 */
function evaluate예외조건(condition: string, 일간: string, context: LookupContext): boolean {
  // 1. 일간 강약 관련
  if (condition.includes('태왕') || condition.includes('太旺')) {
    return infer일간강약(context) === '태왕';
  }
  if (condition.includes('극약') || condition.includes('極弱')) {
    return infer일간강약(context) === '극약';
  }

  // 2. 재다신약 (재성이 많고 일간이 약함)
  if (condition.includes('재다신약') || condition.includes('財多身弱')) {
    return (context.재성개수 || 0) >= 3 && ['약', '극약'].includes(infer일간강약(context));
  }

  // 3. 특정 천간 투출 확인
  // 예: "병화(丙火) 투출", "계수(식신) 투출"
  const 천간매칭 = condition.match(/([갑을병정무기경신임계])(?:목|화|토|금|수)?/);
  if (천간매칭) {
    const 천간 = 천간매칭[1];
    if (condition.includes('투출')) {
      return is투출(천간, context);
    }
  }

  // 4. 개수 관련
  if (condition.includes('비겁') && condition.includes('태과')) {
    return (context.비겁개수 || 0) >= 3;
  }
  if (condition.includes('식신이 너무 많아') || condition.includes('설기 과다')) {
    return (context.식상개수 || 0) >= 3;
  }
  if (condition.includes('인수가 너무 많아')) {
    return (context.인성개수 || 0) >= 3;
  }

  // 5. 상관견관
  if (condition.includes('상관견관')) {
    // 상관격에서 관성이 있는 경우
    return (context.관성개수 || 0) >= 1;
  }

  // 6. 도식 (편인이 식신을 극함)
  if (condition.includes('도식') || condition.includes('倒食')) {
    // 편인과 식신이 동시에 있는 경우
    return (context.인성개수 || 0) >= 1 && (context.식상개수 || 0) >= 1;
  }

  // 7. 합화 조건
  if (condition.includes('합화') || condition.includes('合化')) {
    // 임정합목, 을기합화토 등
    // Context에 특정 천간 조합이 있는지 확인
    // 복잡하므로 일단 false (향후 확장)
    return false;
  }

  // 기본값: 조건을 판단할 수 없으면 false
  return false;
}

// ============================================
// 메인 조회 함수
// ============================================

/**
 * 희신/기신 조회 (기본 함수)
 *
 * @param 일간 - 일간 천간 (갑~계)
 * @param 격국 - 격국명 (정관격, 편관격 등)
 * @param context - 사주 컨텍스트 (선택)
 * @returns 희신/기신 조회 결과
 */
export function lookup희신기신(
  일간: string,
  격국: string,
  context?: LookupContext
): LookupResult | null {
  // 1. 기본 매핑 찾기
  const baseMapping = BASIC_MAPPINGS.find(
    m => m.일간 === 일간 && m.격국 === 격국
  );

  if (!baseMapping) {
    console.warn(`[lookup희신기신] 매핑을 찾을 수 없음: ${일간} + ${격국}`);
    return null;
  }

  // 2. Context가 없으면 기본 매핑 그대로 반환
  if (!context) {
    return {
      희신: baseMapping.희신.map(to오행타입),
      기신: baseMapping.기신.map(to오행타입),
      확신도: baseMapping.기본확신도,
      적용규칙: '기본',
      설명: baseMapping.근거[0] || '기본 매핑 적용',
      근거: baseMapping.근거,
      출처: baseMapping.출처
    };
  }

  // 3. 예외상황 검사
  for (const 예외 of baseMapping.예외상황 || []) {
    const 조건충족 = evaluate예외조건(예외.condition, 일간, context);

    if (조건충족) {
      // 예외상황 적용
      const 희신 = (예외.희신_변경 || baseMapping.희신).map(to오행타입);
      const 기신 = (예외.기신_변경 || baseMapping.기신).map(to오행타입);

      return {
        희신,
        기신,
        확신도: baseMapping.기본확신도 * 0.95, // 예외 적용 시 확신도 약간 감소
        적용규칙: '예외',
        예외상황설명: 예외.condition,
        설명: 예외.explanation,
        근거: [
          ...baseMapping.근거,
          `예외상황: ${예외.condition}`,
          `대응방법: ${예외.explanation}`
        ],
        출처: baseMapping.출처
      };
    }
  }

  // 4. 예외상황이 없으면 기본 매핑 반환
  return {
    희신: baseMapping.희신.map(to오행타입),
    기신: baseMapping.기신.map(to오행타입),
    확신도: baseMapping.기본확신도,
    적용규칙: '기본',
    설명: baseMapping.근거[0] || '기본 매핑 적용',
    근거: baseMapping.근거,
    출처: baseMapping.출처
  };
}

/**
 * 다중 관점 조회 (Best-of-N 통합용)
 *
 * 여러 관점에서 희신/기신을 조회하고 결과를 반환
 * 향후 Best-of-N 토너먼트에서 사용
 */
export function lookup희신기신_다중관점(
  일간: string,
  격국: string,
  context?: LookupContext
): LookupResult[] {
  const results: LookupResult[] = [];

  // 기본 관점
  const 기본결과 = lookup희신기신(일간, 격국, context);
  if (기본결과) {
    results.push(기본결과);
  }

  // 향후 확장: 다른 유파, 다른 접근법 추가 가능
  // 예: 자평파, 적천수파, 현대 명리학 등

  return results;
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 희신/기신이 올바르게 설정되었는지 검증
 */
export function validate희신기신(희신: 오행타입[], 기신: 오행타입[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 1. 희신과 기신이 겹치는지 확인
  const 겹침 = 희신.filter(h => 기신.includes(h));
  if (겹침.length > 0) {
    errors.push(`희신과 기신이 겹침: ${겹침.join(', ')}`);
  }

  // 2. 오행이 5개를 초과하는지 확인
  const 전체오행 = new Set([...희신, ...기신]);
  if (전체오행.size > 5) {
    errors.push(`오행 개수 초과: ${전체오행.size}개 (최대 5개)`);
  }

  // 3. 희신이 비어있는지 확인
  if (희신.length === 0) {
    errors.push('희신이 비어있음');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 매핑 통계 정보
 */
export function getMappingStats() {
  return {
    총매핑수: BASIC_MAPPINGS.length,
    일간별분포: countBy(BASIC_MAPPINGS, '일간'),
    격국별분포: countBy(BASIC_MAPPINGS, '격국'),
    평균확신도: average(BASIC_MAPPINGS.map(m => m.기본확신도))
  };
}

// Helper functions
function countBy<T>(arr: T[], key: keyof T): Record<string, number> {
  return arr.reduce((acc, item) => {
    const val = String(item[key]);
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function average(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
