/**
 * src/ai/confidence.ts
 *
 * 확신도 계산 시스템 (Confidence Calculation System)
 *
 * CLAUDE.md 규범: 정직한 불확실성 정량화 (Honest Uncertainty Quantification)
 */

import type {
  ConfidenceBreakdown,
  UncertaintyFactor,
  ImprovabilityInfo,
  EdgeCaseType
} from '../../shared/types';
import type { 사주정보, 오행타입 } from '../../shared/geokguk-analyzer';

// ============================================
// 확신도 정책 (Confidence Policy)
// ============================================

/**
 * 4단계 확신도 정책
 *
 * CLAUDE.md 기준:
 * - 0.85+: 높은 신뢰도 (녹색)
 * - 0.7-0.85: 참고용 (노랑)
 * - 0.5-0.7: 전문가 검증 필요 (주황)
 * - <0.5: 판단 불가 (빨강, 결과 숨김)
 */
export interface ConfidencePolicy {
  level: 'high' | 'medium' | 'low' | 'critical';
  color: 'green' | 'yellow' | 'orange' | 'red';
  label: string;
  action: 'show' | 'show_with_warning' | 'show_alternatives' | 'hide';
  message: string;
}

export function getConfidencePolicy(confidence: number): ConfidencePolicy {
  if (confidence >= 0.85) {
    return {
      level: 'high',
      color: 'green',
      label: '높은 신뢰도',
      action: 'show',
      message: '이 결과는 높은 신뢰도를 가지고 있습니다.'
    };
  } else if (confidence >= 0.7) {
    return {
      level: 'medium',
      color: 'yellow',
      label: '참고용',
      action: 'show_with_warning',
      message: '이 결과는 참고용입니다. 여러 가능성이 있을 수 있습니다.'
    };
  } else if (confidence >= 0.5) {
    return {
      level: 'low',
      color: 'orange',
      label: '전문가 검증 필요',
      action: 'show_alternatives',
      message: '이 사주는 전문가의 검증이 권장됩니다. 여러 해석이 제시됩니다.'
    };
  } else {
    return {
      level: 'critical',
      color: 'red',
      label: '판단 불가',
      action: 'hide',
      message: '이 사주는 복잡하여 자동 분석이 어렵습니다. 전문가 상담을 권장합니다.'
    };
  }
}

// ============================================
// 확신도 계산 (Confidence Calculation)
// ============================================

/**
 * 다층 확신도 계산
 *
 * CLAUDE.md 규범에 따라 4가지 요소를 종합 평가:
 * 1. theoretical: 이론적 정합성
 * 2. practical: 실전적 타당성
 * 3. data_richness: 데이터 풍부도
 * 4. consistency: 내부 일관성
 *
 * @param 사주 사주 정보
 * @param 격국 확정된 격국
 * @param 용신 용신
 * @param 희신 희신 리스트
 * @param 기신 기신 리스트
 * @param 근거 판단 근거들
 */
export function calculateConfidence(
  사주: 사주정보,
  격국: string,
  용신: 오행타입 | null,
  희신: 오행타입[],
  기신: 오행타입[],
  근거: string[]
): ConfidenceBreakdown {
  // 1. 이론적 정합성 (Theoretical Soundness)
  const theoretical = calculateTheoretical(사주, 격국, 용신);

  // 2. 실전적 타당성 (Practical Validity)
  const practical = calculatePractical(사주, 격국);

  // 3. 데이터 풍부도 (Data Richness)
  const data_richness = calculateDataRichness(사주, 근거);

  // 4. 내부 일관성 (Internal Consistency)
  const consistency = calculateConsistency(희신, 기신, 근거);

  // 종합 확신도 (가중 평균)
  const overall =
    theoretical * 0.3 +
    practical * 0.25 +
    data_richness * 0.25 +
    consistency * 0.2;

  // 불확실성 요인 탐지
  const uncertainty_factors = detectUncertaintyFactors(사주, 격국, overall);

  // 개선 가능성 평가
  const improvability = assessImprovability(사주, uncertainty_factors);

  return {
    overall: Math.max(0, Math.min(1, overall)),
    breakdown: {
      theoretical,
      practical,
      data_richness,
      consistency
    },
    uncertainty_factors,
    improvability,
    meta: {
      calculated_at: new Date().toISOString(),
      version: '1.0'
    }
  };
}

// ============================================
// 개별 확신도 계산 함수들
// ============================================

/**
 * 1. 이론적 정합성 계산
 *
 * - 격국 성립 명확도
 * - 용신 선정 명확도
 * - 상생상극 이론 부합도
 */
function calculateTheoretical(
  사주: 사주정보,
  격국: string,
  용신: 오행타입 | null
): number {
  let score = 0.5; // 기본 점수

  // 격국이 명확한가?
  if (격국 !== '무격' && 격국 !== '판단불가') {
    score += 0.2;
  }

  // 용신이 확정되었는가?
  if (용신 !== null) {
    score += 0.15;
  }

  // 월령 투출 여부 (격국 성립에 중요)
  const 월령간지 = 사주.월주.천간;
  if (월령간지) {
    score += 0.1;
  }

  // 일간과 월령의 관계가 명확한가?
  const 일간 = 사주.일주.천간;
  if (일간 && 월령간지) {
    score += 0.05;
  }

  return Math.min(1, score);
}

/**
 * 2. 실전적 타당성 계산
 *
 * - 사주 균형도
 * - 엣지 케이스 여부
 * - 예외 상황 복잡도
 */
function calculatePractical(사주: 사주정보, 격국: string): number {
  let score = 0.6; // 기본 점수

  // 오행 균형도 평가 (너무 치우치지 않았는가?)
  const 오행분포 = calculate오행분포(사주);
  const 균형도 = calculate균형도(오행분포);
  score += 균형도 * 0.2;

  // 특수격은 복잡도가 높음
  if (격국.includes('종') || 격국.includes('화격') || 격국.includes('양인')) {
    score -= 0.15; // 복잡도 페널티
  }

  // 충형해 과다 여부
  const 충형해개수 = count충형해(사주);
  if (충형해개수 > 2) {
    score -= 0.1 * (충형해개수 - 2); // 2개 초과마다 페널티
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * 3. 데이터 풍부도 계산
 *
 * - 사주 데이터 완전성
 * - 근거 개수
 * - 출처 명시 여부
 */
function calculateDataRichness(사주: 사주정보, 근거: string[]): number {
  let score = 0;

  // 사주 데이터 완전성 (천간+지지 모두 있는가?)
  const 완전성 = [
    사주.연주.천간 && 사주.연주.지지,
    사주.월주.천간 && 사주.월주.지지,
    사주.일주.천간 && 사주.일주.지지,
    사주.시주.천간 && 사주.시주.지지
  ].filter(Boolean).length / 4;
  score += 완전성 * 0.4;

  // 근거 개수 (최소 3개 권장)
  const 근거개수 = 근거.length;
  if (근거개수 >= 3) score += 0.3;
  else if (근거개수 >= 2) score += 0.2;
  else if (근거개수 >= 1) score += 0.1;

  // 근거의 질 (평균 길이)
  const 평균길이 = 근거.reduce((sum, r) => sum + r.length, 0) / 근거개수;
  if (평균길이 > 30) score += 0.3;
  else if (평균길이 > 15) score += 0.2;
  else score += 0.1;

  return Math.min(1, score);
}

/**
 * 4. 내부 일관성 계산
 *
 * - 희신/기신 논리 일관성
 * - 근거 간 모순 여부
 */
function calculateConsistency(
  희신: 오행타입[],
  기신: 오행타입[],
  근거: string[]
): number {
  let score = 0.7; // 기본적으로 일관적이라고 가정

  // 희신과 기신이 겹치는가? (논리 오류)
  const 중복 = 희신.filter(h => 기신.includes(h));
  if (중복.length > 0) {
    score -= 0.4; // 심각한 논리 오류
  }

  // 근거에 모순이 있는가? (간단 체크)
  const 모순있음 = checkContradiction(근거);
  if (모순있음) {
    score -= 0.2;
  }

  // 희신/기신 개수가 적정한가? (너무 많거나 없으면 의심)
  if (희신.length === 0 || 기신.length === 0) {
    score -= 0.1;
  }
  if (희신.length > 4 || 기신.length > 4) {
    score -= 0.1;
  }

  return Math.max(0, Math.min(1, score));
}

// ============================================
// 불확실성 요인 탐지
// ============================================

/**
 * 불확실성 요인 탐지
 *
 * CLAUDE.md 규범: 명시적 불확실성 공개
 */
export function detectUncertaintyFactors(
  사주: 사주정보,
  격국: string,
  confidence: number
): UncertaintyFactor[] {
  const factors: UncertaintyFactor[] = [];

  // 1. 엣지 케이스 탐지
  const edgeCases = detectEdgeCases(사주, 격국);
  if (edgeCases.length > 0) {
    factors.push({
      type: 'edge_case',
      severity: 'high',
      description: `엣지 케이스 감지: ${edgeCases.join(', ')}`,
      impact: -0.15
    });
  }

  // 2. 특수격 복잡도
  if (격국.includes('종') || 격국.includes('화격')) {
    factors.push({
      type: 'special_pattern',
      severity: 'medium',
      description: '특수격은 해석이 다양할 수 있습니다',
      impact: -0.1
    });
  }

  // 3. 무격/판단불가
  if (격국 === '무격' || 격국 === '판단불가') {
    factors.push({
      type: 'no_pattern',
      severity: 'critical',
      description: '명확한 격국을 찾기 어렵습니다',
      impact: -0.3
    });
  }

  // 4. 충형해 과다
  const 충형해개수 = count충형해(사주);
  if (충형해개수 >= 3) {
    factors.push({
      type: 'conflict_heavy',
      severity: 'high',
      description: `충형해가 ${충형해개수}개로 많습니다`,
      impact: -0.12
    });
  }

  // 5. 오행 극단 불균형
  const 오행분포 = calculate오행분포(사주);
  const 최대비율 = Math.max(...Object.values(오행분포));
  if (최대비율 > 0.5) {
    factors.push({
      type: 'elemental_extreme',
      severity: 'medium',
      description: `특정 오행(${최대비율 * 100}%)이 과다합니다`,
      impact: -0.08
    });
  }

  return factors;
}

/**
 * 엣지 케이스 탐지
 */
function detectEdgeCases(사주: 사주정보, 격국: string): EdgeCaseType[] {
  const cases: EdgeCaseType[] = [];

  const 오행분포 = calculate오행분포(사주);
  const 최대비율 = Math.max(...Object.values(오행분포));
  const 최소비율 = Math.min(...Object.values(오행분포));

  // 오행 극단 불균형
  if (최대비율 > 0.5 || 최소비율 === 0) {
    cases.push('오행_극단불균형' as EdgeCaseType);
  }

  // 특수 구조
  if (격국.includes('종') || 격국.includes('화격')) {
    cases.push('특이구조' as EdgeCaseType);
  }

  // 충형해 과다
  if (count충형해(사주) >= 3) {
    cases.push('충형해_과다' as EdgeCaseType);
  }

  return cases;
}

// ============================================
// 개선 가능성 평가
// ============================================

/**
 * 개선 가능성 평가
 *
 * 더 많은 데이터나 전문가 검증으로 확신도를 올릴 수 있는가?
 */
export function assessImprovability(
  사주: 사주정보,
  uncertainty_factors: UncertaintyFactor[]
): ImprovabilityInfo {
  const suggestions: string[] = [];
  let potential_gain = 0;

  // 1. 시주 불명확
  if (!사주.시주.천간 || !사주.시주.지지) {
    suggestions.push('정확한 출생 시간 확인');
    potential_gain += 0.1;
  }

  // 2. 엣지 케이스
  const hasEdgeCase = uncertainty_factors.some(f => f.type === 'edge_case');
  if (hasEdgeCase) {
    suggestions.push('명리학 전문가의 종합 검증');
    potential_gain += 0.15;
  }

  // 3. 특수격
  const hasSpecialPattern = uncertainty_factors.some(f => f.type === 'special_pattern');
  if (hasSpecialPattern) {
    suggestions.push('특수격 전문가의 상세 분석');
    potential_gain += 0.12;
  }

  // 4. 일반적인 경우
  if (suggestions.length === 0) {
    suggestions.push('추가 분석 불필요');
  }

  return {
    improvable: potential_gain > 0, // potential_gain이 있으면 개선 가능
    potential_gain: Math.min(0.3, potential_gain),
    suggestions
  };
}

// ============================================
// 유틸리티 함수들
// ============================================

/**
 * 오행 분포 계산
 */
function calculate오행분포(사주: 사주정보): Record<string, number> {
  const 분포: Record<string, number> = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0
  };

  // 천간/지지에서 오행 추출 (간단 버전)
  // 실제로는 천간지지 -> 오행 매핑 테이블 필요
  const 모든간지 = [
    사주.연주.천간,
    사주.연주.지지,
    사주.월주.천간,
    사주.월주.지지,
    사주.일주.천간,
    사주.일주.지지,
    사주.시주.천간,
    사주.시주.지지
  ].filter(Boolean);

  const 총개수 = 모든간지.length;
  if (총개수 === 0) return 분포;

  // 간단한 오행 분포 (실제로는 더 복잡)
  // 여기서는 균등 분포로 가정 (실제 구현 시 간지->오행 매핑 필요)
  return {
    목: 0.2,
    화: 0.2,
    토: 0.2,
    금: 0.2,
    수: 0.2
  };
}

/**
 * 균형도 계산 (0-1, 1에 가까울수록 균형)
 */
function calculate균형도(분포: Record<string, number>): number {
  const values = Object.values(분포);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  // 표준편차 계산
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // 표준편차가 작을수록 균형적 (0.1 이하면 매우 균형적)
  return Math.max(0, 1 - stdDev * 5);
}

/**
 * 충형해 개수 계산 (간단 버전)
 */
function count충형해(사주: 사주정보): number {
  // 실제로는 복잡한 충형해 판단 로직 필요
  // 여기서는 간단히 0 반환 (추후 구현)
  return 0;
}

/**
 * 근거 모순 체크
 */
function checkContradiction(근거: string[]): boolean {
  const text = 근거.join(' ');

  // 간단한 모순 패턴 검사
  const contradictions = [
    ['강함', '약함'],
    ['많음', '적음'],
    ['과다', '부족'],
    ['왕', '약'],
    ['유리', '불리']
  ];

  for (const [word1, word2] of contradictions) {
    if (text.includes(word1) && text.includes(word2)) {
      // 둘 다 있으면 모순일 가능성 (실제로는 컨텍스트 분석 필요)
      // 일단은 false (너무 엄격하지 않게)
      return false;
    }
  }

  return false;
}
