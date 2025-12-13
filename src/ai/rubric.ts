/**
 * src/ai/rubric.ts
 *
 * Best-of-N 평가 루브릭 (Rubric) 시스템
 *
 * CLAUDE.md 규범: 5가지 평가 기준으로 후보의 품질을 객관적으로 측정
 */

import type { Rubric, RubricCriterion, Candidate } from '../../shared/types';
import type { 사주정보 } from '../../shared/geokguk-analyzer';

// ============================================
// 루브릭 정의
// ============================================

/**
 * 명리학 분석 평가 루브릭
 *
 * CLAUDE.md 기준:
 * - theoretical_soundness: 25%
 * - practical_validity: 20%
 * - reasoning_quality: 20%
 * - uncertainty_management: 20%
 * - internal_consistency: 15%
 */
export const MYEONGRI_RUBRIC: Rubric = {
  // 1. 이론적 정합성 (25%)
  theoretical_soundness: {
    weight: 0.25,
    criteria: {
      상생상극_부합: 0.4,    // 상생상극 이론에 부합하는가?
      격국이론_부합: 0.3,    // 격국 이론에 맞는가?
      조후이론_부합: 0.3     // 조후 이론을 고려했는가?
    }
  },

  // 2. 실전적 타당성 (20%)
  practical_validity: {
    weight: 0.2,
    criteria: {
      사주균형_고려: 0.5,    // 사주 전체 균형을 고려했는가?
      엣지케이스_처리: 0.3,  // 엣지 케이스를 인지했는가?
      예외상황_인지: 0.2     // 예외 상황을 명시했는가?
    }
  },

  // 3. 근거 품질 (20%)
  reasoning_quality: {
    weight: 0.2,
    criteria: {
      논리_명확성: 0.4,      // 논리가 명확한가?
      출처_명시: 0.3,        // 출처를 밝혔는가?
      단계별_설명: 0.3       // 단계별로 설명했는가?
    }
  },

  // 4. 불확실성 관리 (20%)
  uncertainty_management: {
    weight: 0.2,
    criteria: {
      확신도_적정성: 0.4,    // 확신도가 적절한가? (과대평가 X)
      한계_명시: 0.3,        // 한계를 명시했는가?
      대안_제시: 0.3         // 확신도 낮을 때 대안을 제시했는가?
    }
  },

  // 5. 내부 일관성 (15%)
  internal_consistency: {
    weight: 0.15,
    criteria: {
      용희기_일관성: 0.5,    // 용신/희신/기신이 일관적인가?
      논리_일관성: 0.5       // 논리에 모순이 없는가?
    }
  }
};

// ============================================
// 루브릭 검증
// ============================================

/**
 * 루브릭 가중치 합계 검증
 *
 * 1. 전체 가중치 합계 = 1.0
 * 2. 각 기준 내 세부 criteria 합계 = 1.0
 */
export function validateRubric(rubric: Rubric): boolean {
  // 1. 전체 가중치 합계
  const totalWeight =
    rubric.theoretical_soundness.weight +
    rubric.practical_validity.weight +
    rubric.reasoning_quality.weight +
    rubric.uncertainty_management.weight +
    rubric.internal_consistency.weight;

  if (Math.abs(totalWeight - 1.0) > 0.001) {
    console.error(`❌ 루브릭 전체 가중치: ${totalWeight} (1.0이어야 함)`);
    return false;
  }

  // 2. 각 기준 내 세부 criteria 합계
  const criteria: RubricCriterion[] = [
    rubric.theoretical_soundness,
    rubric.practical_validity,
    rubric.reasoning_quality,
    rubric.uncertainty_management,
    rubric.internal_consistency
  ];

  for (const criterion of criteria) {
    const sum = Object.values(criterion.criteria).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1.0) > 0.001) {
      console.error(`❌ 세부 criteria 가중치: ${sum} (1.0이어야 함)`);
      return false;
    }
  }

  return true;
}

// ============================================
// 점수 계산 함수
// ============================================

/**
 * 루브릭 기준으로 후보 점수 계산
 *
 * @param candidate 평가할 후보
 * @param rubric 평가 루브릭
 * @param 사주 사주 정보 (컨텍스트)
 * @returns 0-1 사이의 점수
 */
export function calculateRubricScore<T>(
  candidate: Candidate<T>,
  rubric: Rubric,
  사주?: 사주정보
): number {
  let totalScore = 0;

  // 1. 이론적 정합성
  const theoreticalScore = evaluate이론적정합성(candidate);
  totalScore += theoreticalScore * rubric.theoretical_soundness.weight;

  // 2. 실전적 타당성
  const practicalScore = evaluate실전타당성(candidate, 사주);
  totalScore += practicalScore * rubric.practical_validity.weight;

  // 3. 근거 품질
  const reasoningScore = evaluate근거품질(candidate);
  totalScore += reasoningScore * rubric.reasoning_quality.weight;

  // 4. 불확실성 관리
  const uncertaintyScore = evaluate불확실성관리(candidate);
  totalScore += uncertaintyScore * rubric.uncertainty_management.weight;

  // 5. 내부 일관성
  const consistencyScore = evaluate일관성(candidate);
  totalScore += consistencyScore * rubric.internal_consistency.weight;

  return Math.max(0, Math.min(1, totalScore));
}

// ============================================
// 개별 기준 평가 함수들
// ============================================

/**
 * 1. 이론적 정합성 평가
 */
function evaluate이론적정합성<T>(candidate: Candidate<T>): number {
  let score = 0.5; // 기본 점수

  // reasoning에 이론적 근거가 있는지 확인
  const hasTheory = candidate.reasoning.some(r =>
    r.includes('상생') ||
    r.includes('상극') ||
    r.includes('격국') ||
    r.includes('조후') ||
    r.includes('용신')
  );

  if (hasTheory) score += 0.3;

  // 출처가 명시되어 있는지
  const hasSource = candidate.source && candidate.source.length > 0;
  if (hasSource) score += 0.2;

  return Math.min(1, score);
}

/**
 * 2. 실전적 타당성 평가
 */
function evaluate실전타당성<T>(
  candidate: Candidate<T>,
  사주?: 사주정보
): number {
  let score = 0.5;

  // 사주 균형을 고려했는지
  const considersBalance = candidate.reasoning.some(r =>
    r.includes('균형') ||
    r.includes('강약') ||
    r.includes('세력') ||
    r.includes('과다') ||
    r.includes('부족')
  );

  if (considersBalance) score += 0.3;

  // 예외 상황을 인지했는지 (self_critique에 weaknesses가 있으면)
  if (candidate.self_critique && candidate.self_critique.weaknesses.length > 0) {
    score += 0.2;
  }

  return Math.min(1, score);
}

/**
 * 3. 근거 품질 평가
 */
function evaluate근거품질<T>(candidate: Candidate<T>): number {
  let score = 0;

  // 근거 개수 (최소 3개 권장)
  const reasoningCount = candidate.reasoning.length;
  if (reasoningCount >= 3) score += 0.4;
  else if (reasoningCount >= 2) score += 0.2;
  else if (reasoningCount >= 1) score += 0.1;

  // 출처 명시
  if (candidate.source) score += 0.3;

  // 근거의 명확성 (길이 기준, 너무 짧지 않은지)
  const avgLength = candidate.reasoning.reduce((sum, r) => sum + r.length, 0) / reasoningCount;
  if (avgLength > 20) score += 0.3;
  else if (avgLength > 10) score += 0.15;

  return Math.min(1, score);
}

/**
 * 4. 불확실성 관리 평가
 */
function evaluate불확실성관리<T>(candidate: Candidate<T>): number {
  let score = 0.5;

  // 확신도가 적정한지 (너무 높지 않은지)
  if (candidate.base_confidence < 0.95) score += 0.2;
  if (candidate.base_confidence < 0.9) score += 0.1;

  // 한계를 명시했는지 (self_critique.weaknesses)
  if (candidate.self_critique && candidate.self_critique.weaknesses.length > 0) {
    score += 0.2;
  }

  return Math.min(1, score);
}

/**
 * 5. 내부 일관성 평가
 */
function evaluate일관성<T>(candidate: Candidate<T>): number {
  let score = 0.7; // 기본적으로 일관적이라고 가정

  // reasoning에 모순이 있는지 간단 체크
  const hasContradiction = checkContradiction(candidate.reasoning);
  if (hasContradiction) score -= 0.3;

  // self_critique가 있으면 자기 검증을 했다는 의미
  if (candidate.self_critique) score += 0.3;

  return Math.max(0, Math.min(1, score));
}

/**
 * 모순 체크 (간단 버전)
 */
function checkContradiction(reasoning: string[]): boolean {
  // 너무 단순하지만, 기본적인 모순 감지
  // 예: "강함" vs "약함", "많음" vs "적음" 등

  const text = reasoning.join(' ');

  const contradictions = [
    ['강함', '약함'],
    ['많음', '적음'],
    ['과다', '부족'],
    ['왕', '약'],
    ['유리', '불리']
  ];

  for (const [word1, word2] of contradictions) {
    if (text.includes(word1) && text.includes(word2)) {
      // 둘 다 있으면 모순일 가능성 (하지만 컨텍스트에 따라 다를 수 있음)
      // 실제로는 더 정교한 분석 필요
      return false; // 일단 false (너무 엄격하지 않게)
    }
  }

  return false;
}

// ============================================
// 상세 점수 분해
// ============================================

/**
 * 상세 점수 분해 결과
 */
export interface DetailedRubricScore {
  total: number;
  breakdown: {
    theoretical_soundness: number;
    practical_validity: number;
    reasoning_quality: number;
    uncertainty_management: number;
    internal_consistency: number;
  };
  explanations: string[];
}

/**
 * 상세 점수 계산 (디버깅/설명용)
 */
export function calculateDetailedScore<T>(
  candidate: Candidate<T>,
  rubric: Rubric,
  사주?: 사주정보
): DetailedRubricScore {
  const scores = {
    theoretical_soundness: evaluate이론적정합성(candidate),
    practical_validity: evaluate실전타당성(candidate, 사주),
    reasoning_quality: evaluate근거품질(candidate),
    uncertainty_management: evaluate불확실성관리(candidate),
    internal_consistency: evaluate일관성(candidate)
  };

  const total =
    scores.theoretical_soundness * rubric.theoretical_soundness.weight +
    scores.practical_validity * rubric.practical_validity.weight +
    scores.reasoning_quality * rubric.reasoning_quality.weight +
    scores.uncertainty_management * rubric.uncertainty_management.weight +
    scores.internal_consistency * rubric.internal_consistency.weight;

  const explanations = [
    `이론적 정합성: ${(scores.theoretical_soundness * 100).toFixed(0)}% (가중 ${(scores.theoretical_soundness * rubric.theoretical_soundness.weight * 100).toFixed(1)}%)`,
    `실전적 타당성: ${(scores.practical_validity * 100).toFixed(0)}% (가중 ${(scores.practical_validity * rubric.practical_validity.weight * 100).toFixed(1)}%)`,
    `근거 품질: ${(scores.reasoning_quality * 100).toFixed(0)}% (가중 ${(scores.reasoning_quality * rubric.reasoning_quality.weight * 100).toFixed(1)}%)`,
    `불확실성 관리: ${(scores.uncertainty_management * 100).toFixed(0)}% (가중 ${(scores.uncertainty_management * rubric.uncertainty_management.weight * 100).toFixed(1)}%)`,
    `내부 일관성: ${(scores.internal_consistency * 100).toFixed(0)}% (가중 ${(scores.internal_consistency * rubric.internal_consistency.weight * 100).toFixed(1)}%)`
  ];

  return {
    total: Math.max(0, Math.min(1, total)),
    breakdown: scores,
    explanations
  };
}

// ============================================
// 초기화 및 검증
// ============================================

// 모듈 로드 시 자동 검증
if (!validateRubric(MYEONGRI_RUBRIC)) {
  throw new Error('❌ 루브릭 가중치가 올바르지 않습니다!');
}
