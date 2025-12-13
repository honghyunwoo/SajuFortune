/**
 * src/ai/perspectives.ts
 *
 * 명리학 다관점(Multi-Perspective) 분석 시스템
 *
 * CLAUDE.md 규범: Best-of-N 토너먼트를 위한 5가지 관점 정의
 */

import type { Perspective } from '../../shared/types';
import type { 사주정보 } from '../../shared/geokguk-analyzer';

// ============================================
// 관점 정의 (Perspectives)
// ============================================

/**
 * 5가지 명리학 관점
 *
 * 각 관점은 다른 명리학 유파/이론을 대표합니다.
 */
export const PERSPECTIVES: Perspective[] = [
  {
    name: '격국용신론',
    source: '자평진전 (子平眞詮)',
    weight: 0.3,
    approach: '격국을 먼저 확정하고, 격국에 맞는 용신을 찾는 방식. 월령의 투출된 십신을 중시.'
  },
  {
    name: '조후용신론',
    source: '적천수 (滴天髓)',
    weight: 0.25,
    approach: '계절(월령)의 한난조습을 조절하는 오행을 용신으로 삼음. 일간의 조화와 균형 중시.'
  },
  {
    name: '통변론',
    source: '명리정종 (命理正宗)',
    weight: 0.2,
    approach: '사주 전체의 오행 균형을 보고 부족한 것을 채우거나 과한 것을 설하는 방식.'
  },
  {
    name: '보수파',
    source: '자평진전 원전',
    weight: 0.15,
    approach: '엄격한 전통 기준 적용. 격국 성립 조건이 까다로우며, 무격(無格) 판정이 많음.'
  },
  {
    name: '현대파',
    source: '현대 명리학',
    weight: 0.1,
    approach: '전통 이론에 현대적 해석을 더함. 격국 기준이 상대적으로 느슨하고 실용적.'
  }
];

/**
 * 관점별 가중치 합계 검증
 *
 * 모든 관점의 가중치 합이 1.0이어야 함
 */
export function validatePerspectives(): boolean {
  const totalWeight = PERSPECTIVES.reduce((sum, p) => sum + p.weight, 0);
  const isValid = Math.abs(totalWeight - 1.0) < 0.001;

  if (!isValid) {
    console.warn(`⚠️ 관점 가중치 합계: ${totalWeight} (1.0이어야 함)`);
  }

  return isValid;
}

// ============================================
// 관점별 분석 인터페이스
// ============================================

/**
 * 관점별 분석 결과
 */
export interface PerspectiveAnalysisResult<T> {
  /** 관점 */
  perspective: Perspective;

  /** 분석 결과 */
  result: T;

  /** 이 관점에서의 확신도 */
  confidence: number;

  /** 판단 근거 */
  reasoning: string[];

  /** 강점 */
  strengths: string[];

  /** 약점 */
  weaknesses: string[];
}

/**
 * 관점별 분석기 인터페이스
 *
 * 각 관점에서 사주를 분석하는 함수 타입
 */
export type PerspectiveAnalyzer<T> = (
  사주: 사주정보,
  격국: string,
  perspective: Perspective
) => PerspectiveAnalysisResult<T>;

// ============================================
// 관점 선택 유틸리티
// ============================================

/**
 * 특정 관점 가져오기
 */
export function getPerspective(name: string): Perspective | undefined {
  return PERSPECTIVES.find(p => p.name === name);
}

/**
 * 가중치 기준 상위 N개 관점 선택
 */
export function getTopPerspectives(n: number): Perspective[] {
  return [...PERSPECTIVES]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n);
}

/**
 * 모든 관점 가져오기
 */
export function getAllPerspectives(): Perspective[] {
  return [...PERSPECTIVES];
}

// ============================================
// 관점별 특화 로직 플래그
// ============================================

/**
 * 관점별 특화 설정
 */
export interface PerspectiveConfig {
  /** 격국 성립 기준 엄격도 (0-1, 높을수록 까다로움) */
  strictness: number;

  /** 조후(계절 조화) 중요도 (0-1) */
  seasonal_importance: number;

  /** 오행 균형 중요도 (0-1) */
  balance_importance: number;

  /** 월령 중요도 (0-1) */
  monthly_pillar_importance: number;
}

/**
 * 관점별 설정 맵
 */
export const PERSPECTIVE_CONFIGS: Record<string, PerspectiveConfig> = {
  '격국용신론': {
    strictness: 0.6,
    seasonal_importance: 0.3,
    balance_importance: 0.4,
    monthly_pillar_importance: 0.9
  },
  '조후용신론': {
    strictness: 0.5,
    seasonal_importance: 0.9,
    balance_importance: 0.6,
    monthly_pillar_importance: 0.7
  },
  '통변론': {
    strictness: 0.5,
    seasonal_importance: 0.5,
    balance_importance: 0.9,
    monthly_pillar_importance: 0.5
  },
  '보수파': {
    strictness: 0.9,
    seasonal_importance: 0.4,
    balance_importance: 0.5,
    monthly_pillar_importance: 0.8
  },
  '현대파': {
    strictness: 0.3,
    seasonal_importance: 0.6,
    balance_importance: 0.7,
    monthly_pillar_importance: 0.6
  }
};

/**
 * 관점 설정 가져오기
 */
export function getPerspectiveConfig(perspectiveName: string): PerspectiveConfig {
  return PERSPECTIVE_CONFIGS[perspectiveName] || {
    strictness: 0.5,
    seasonal_importance: 0.5,
    balance_importance: 0.5,
    monthly_pillar_importance: 0.5
  };
}

// ============================================
// 초기화 및 검증
// ============================================

// 모듈 로드 시 자동 검증
if (!validatePerspectives()) {
  throw new Error('❌ 관점 가중치 합계가 1.0이 아닙니다!');
}
