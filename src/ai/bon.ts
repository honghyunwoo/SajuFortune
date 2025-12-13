/**
 * src/ai/bon.ts
 *
 * Best-of-N 토너먼트 시스템 (Tournament Selection)
 *
 * CLAUDE.md 규범: 확신도 < 0.7 시 필수 적용
 * 5가지 관점에서 N개 후보를 생성하고, 루브릭으로 평가하여 최선을 선택
 */

import type {
  Candidate,
  Rubric,
  Perspective,
  TournamentResult,
  CritiqueResult
} from '../../shared/types';
import type { 사주정보 } from '../../shared/geokguk-analyzer';
import { PERSPECTIVES, getPerspectiveConfig } from './perspectives';
import { MYEONGRI_RUBRIC, calculateRubricScore } from './rubric';
import { calculateConfidence } from './confidence';

// ============================================
// Best-of-N 토너먼트 메인 함수
// ============================================

/**
 * Best-of-N 토너먼트 실행
 *
 * @param 사주 사주 정보
 * @param candidateGenerator 후보 생성 함수 (각 관점별로 실행)
 * @param rubric 평가 루브릭 (기본값: MYEONGRI_RUBRIC)
 * @param perspectives 사용할 관점들 (기본값: 모든 관점)
 * @returns 토너먼트 결과 (승자 + 상세 정보)
 */
export async function runBestOfN<T>(
  사주: 사주정보,
  격국: string,
  candidateGenerator: (사주: 사주정보, 격국: string, perspective: Perspective) => Candidate<T>,
  rubric: Rubric = MYEONGRI_RUBRIC,
  perspectives: Perspective[] = PERSPECTIVES
): Promise<TournamentResult<T>> {
  // 1. 각 관점별로 후보 생성
  const candidates = perspectives.map(perspective =>
    candidateGenerator(사주, 격국, perspective)
  );

  // 2. 각 후보에 대해 자기 비평 수행
  const candidatesWithCritique = candidates.map(candidate =>
    addSelfCritique(candidate)
  );

  // 3. 루브릭 점수 계산
  const candidatesWithScore = candidatesWithCritique.map(candidate => ({
    ...candidate,
    rubric_score: calculateRubricScore(candidate, rubric, 사주)
  }));

  // 4. 가중 확신도 계산 (base_confidence × 관점 weight)
  const candidatesWithWeightedConfidence = candidatesWithScore.map(candidate => {
    const perspective = perspectives.find(p => p.name === candidate.perspective);
    const weight = perspective?.weight || 0.2;

    return {
      ...candidate,
      weighted_confidence: candidate.base_confidence * weight
    };
  });

  // 5. 최종 점수 계산 (루브릭 점수 70% + 가중 확신도 30%)
  const candidatesWithFinalScore = candidatesWithWeightedConfidence.map(candidate => ({
    ...candidate,
    final_score: (candidate.rubric_score || 0) * 0.7 + candidate.weighted_confidence * 0.3
  }));

  // 6. 점수 기준으로 정렬 (내림차순)
  const sortedCandidates = candidatesWithFinalScore.sort(
    (a, b) => b.final_score - a.final_score
  );

  // 7. 승자 선정
  const winner = sortedCandidates[0];

  // 8. 대안 후보들 (상위 3개)
  const alternatives = sortedCandidates.slice(1, 3);

  // 9. 토너먼트 메타데이터
  const metadata = {
    total_candidates: candidates.length,
    perspectives_used: perspectives.map(p => p.name),
    average_confidence:
      sortedCandidates.reduce((sum, c) => sum + c.base_confidence, 0) / sortedCandidates.length,
    score_spread: sortedCandidates[0].final_score - sortedCandidates[sortedCandidates.length - 1].final_score,
    rubric_name: 'MYEONGRI_RUBRIC',
    tournament_date: new Date().toISOString()
  };

  return {
    winner,
    alternatives,
    all_candidates: sortedCandidates,
    metadata
  };
}

// ============================================
// 후보 생성 헬퍼
// ============================================

/**
 * 간단한 후보 생성 헬퍼
 *
 * 실제 사용 시 이 함수를 래핑하여 도메인 로직 추가
 */
export function createCandidate<T>(
  result: T,
  perspective: Perspective,
  source: string,
  confidence: number,
  reasoning: string[]
): Candidate<T> {
  return {
    result,
    perspective: perspective.name,
    source,
    base_confidence: confidence,
    weighted_confidence: confidence * perspective.weight,
    reasoning,
    rubric_score: 0, // 나중에 계산됨
    self_critique: undefined // 나중에 추가됨
  };
}

// ============================================
// 자기 비평 (Self-Critique)
// ============================================

/**
 * 후보에 대한 자기 비평 추가
 *
 * CLAUDE.md 규범: 모든 결과는 스스로의 강점/약점을 명시해야 함
 */
function addSelfCritique<T>(candidate: Candidate<T>): Candidate<T> {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // 1. 확신도 기반 평가
  if (candidate.base_confidence >= 0.85) {
    strengths.push('높은 확신도를 가진 분석입니다');
  } else if (candidate.base_confidence < 0.6) {
    weaknesses.push('확신도가 낮아 다른 해석이 가능합니다');
  }

  // 2. 근거 개수 평가
  if (candidate.reasoning.length >= 3) {
    strengths.push('충분한 근거를 제시했습니다');
  } else if (candidate.reasoning.length < 2) {
    weaknesses.push('근거가 부족할 수 있습니다');
  }

  // 3. 출처 명시 여부
  if (candidate.source && candidate.source.length > 0) {
    strengths.push('명확한 출처를 제시했습니다');
  } else {
    weaknesses.push('출처가 명시되지 않았습니다');
  }

  // 4. 관점별 특성
  const perspectiveStrengths = getPerspectiveStrengths(candidate.perspective);
  const perspectiveWeaknesses = getPerspectiveWeaknesses(candidate.perspective);

  strengths.push(...perspectiveStrengths);
  weaknesses.push(...perspectiveWeaknesses);

  const critique: CritiqueResult = {
    strengths,
    weaknesses,
    overall_assessment:
      candidate.base_confidence >= 0.8
        ? 'strong'
        : candidate.base_confidence >= 0.6
        ? 'moderate'
        : 'weak'
  };

  return {
    ...candidate,
    self_critique: critique
  };
}

/**
 * 관점별 강점
 */
function getPerspectiveStrengths(perspectiveName: string): string[] {
  switch (perspectiveName) {
    case '격국용신론':
      return ['격국 이론에 충실한 분석', '월령 중심의 체계적 접근'];
    case '조후용신론':
      return ['계절 조화를 고려한 분석', '일간의 조화 중시'];
    case '통변론':
      return ['오행 균형을 고려한 분석', '전체적 관점'];
    case '보수파':
      return ['엄격한 전통 기준 적용', '신중한 판단'];
    case '현대파':
      return ['실용적 접근', '유연한 해석'];
    default:
      return [];
  }
}

/**
 * 관점별 약점
 */
function getPerspectiveWeaknesses(perspectiveName: string): string[] {
  switch (perspectiveName) {
    case '격국용신론':
      return ['조후를 간과할 수 있음'];
    case '조후용신론':
      return ['격국 구조를 간과할 수 있음'];
    case '통변론':
      return ['월령의 중요성을 간과할 수 있음'];
    case '보수파':
      return ['너무 엄격하여 무격 판정이 많을 수 있음'];
    case '현대파':
      return ['전통 이론을 충분히 고려하지 않을 수 있음'];
    default:
      return [];
  }
}

// ============================================
// 토너먼트 결과 분석
// ============================================

/**
 * 토너먼트 결과 요약
 */
export function summarizeTournament<T>(result: TournamentResult<T>): string {
  const { winner, alternatives, metadata } = result;

  let summary = `🏆 Best-of-N 토너먼트 결과\n\n`;

  // 승자 정보
  summary += `승자: ${winner.perspective}\n`;
  summary += `확신도: ${(winner.base_confidence * 100).toFixed(0)}%\n`;
  summary += `루브릭 점수: ${((winner.rubric_score || 0) * 100).toFixed(0)}%\n`;
  summary += `최종 점수: ${(winner.final_score * 100).toFixed(0)}%\n\n`;

  // 주요 근거
  summary += `주요 근거:\n`;
  winner.reasoning.forEach((r, i) => {
    summary += `  ${i + 1}. ${r}\n`;
  });
  summary += `\n`;

  // 대안 후보
  if (alternatives.length > 0) {
    summary += `대안 해석 (${alternatives.length}개):\n`;
    alternatives.forEach((alt, i) => {
      summary += `  ${i + 1}. ${alt.perspective} (확신도 ${(alt.base_confidence * 100).toFixed(0)}%)\n`;
    });
    summary += `\n`;
  }

  // 메타데이터
  summary += `총 후보: ${metadata.total_candidates}개\n`;
  summary += `평균 확신도: ${(metadata.average_confidence * 100).toFixed(0)}%\n`;
  summary += `점수 편차: ${(metadata.score_spread * 100).toFixed(1)}%\n`;

  return summary;
}

/**
 * 승자 신뢰도 평가
 *
 * 승자의 점수가 2위와 크게 차이나면 신뢰도 높음
 */
export function assessWinnerReliability<T>(result: TournamentResult<T>): {
  reliable: boolean;
  reason: string;
  confidence_adjustment: number;
} {
  const { winner, alternatives, all_candidates } = result;

  if (all_candidates.length < 2) {
    return {
      reliable: true,
      reason: '후보가 1개뿐이므로 비교 불가',
      confidence_adjustment: 0
    };
  }

  const secondPlace = all_candidates[1];
  const scoreDiff = winner.final_score - secondPlace.final_score;

  // 점수 차이가 0.2 이상이면 신뢰할 만함
  if (scoreDiff >= 0.2) {
    return {
      reliable: true,
      reason: `승자가 2위와 ${(scoreDiff * 100).toFixed(1)}% 차이로 우위`,
      confidence_adjustment: 0.05 // 확신도 5% 상향
    };
  }

  // 점수 차이가 0.05 미만이면 신뢰도 낮음
  if (scoreDiff < 0.05) {
    return {
      reliable: false,
      reason: `승자와 2위가 ${(scoreDiff * 100).toFixed(1)}%로 근소한 차이`,
      confidence_adjustment: -0.1 // 확신도 10% 하향
    };
  }

  // 중간
  return {
    reliable: true,
    reason: `승자가 ${(scoreDiff * 100).toFixed(1)}% 차이로 우위 (보통 수준)`,
    confidence_adjustment: 0
  };
}

// ============================================
// 유틸리티: 확신도 기반 자동 Best-of-N
// ============================================

/**
 * 확신도가 낮을 때 자동으로 Best-of-N 실행
 *
 * CLAUDE.md 규범: 확신도 < 0.7이면 Best-of-N 필수
 *
 * @param initialConfidence 초기 확신도
 * @param 사주 사주 정보
 * @param candidateGenerator 후보 생성 함수
 * @returns Best-of-N 실행 여부 및 결과
 */
export async function autoRunBestOfN<T>(
  initialConfidence: number,
  사주: 사주정보,
  격국: string,
  candidateGenerator: (사주: 사주정보, 격국: string, perspective: Perspective) => Candidate<T>
): Promise<{ ran: boolean; result?: TournamentResult<T>; reason: string }> {
  // 확신도가 0.7 이상이면 Best-of-N 불필요
  if (initialConfidence >= 0.7) {
    return {
      ran: false,
      reason: `확신도 ${(initialConfidence * 100).toFixed(0)}%로 충분히 높음`
    };
  }

  // Best-of-N 실행
  const result = await runBestOfN(사주, 격국, candidateGenerator);

  return {
    ran: true,
    result,
    reason: `확신도 ${(initialConfidence * 100).toFixed(0)}%로 낮아 Best-of-N 실행`
  };
}

// ============================================
// 관점별 후보 생성 템플릿
// ============================================

/**
 * 관점별 분석 실행 템플릿
 *
 * 각 관점의 config를 적용하여 분석을 다르게 수행
 *
 * @example
 * const result = analyzeWithPerspective(사주, 격국, perspective, (사주, config) => {
 *   // config.strictness에 따라 격국 판단 엄격도 조정
 *   // config.seasonal_importance에 따라 조후 가중치 조정
 *   return { 용신: '...', 희신: [...], 기신: [...] };
 * });
 */
export function analyzeWithPerspective<T>(
  사주: 사주정보,
  격국: string,
  perspective: Perspective,
  analyzer: (사주: 사주정보, config: ReturnType<typeof getPerspectiveConfig>) => {
    result: T;
    confidence: number;
    reasoning: string[];
  }
): Candidate<T> {
  const config = getPerspectiveConfig(perspective.name);

  const { result, confidence, reasoning } = analyzer(사주, config);

  return createCandidate(result, perspective, perspective.source, confidence, reasoning);
}
