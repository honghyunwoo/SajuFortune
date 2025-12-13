/**
 * 공통 타입 정의
 *
 * CLAUDE.md 규범에 따른 정직한 불확실성 관리 시스템
 */

// Re-export main result types from analyzers
export type { LoveFortuneResult } from './love-fortune-analyzer';
export type { WealthFortuneResult } from './wealth-fortune-analyzer';
export type { HealthFortuneResult } from './health-fortune-analyzer';
export type { CareerFortuneResult } from './career-fortune-analyzer';

// ============================================
// 불확실성 관리 (Uncertainty Management)
// ============================================

/**
 * 불확실성 요인
 */
export interface UncertaintyFactor {
  /** 요인 이름 */
  factor: string;
  /** 확신도 감소량 (0-1) */
  impact: number;
  /** 설명 */
  explanation: string;
  /** 심각도 */
  severity: 'low' | 'medium' | 'high';
}

/**
 * 개선 가능성 정보
 */
export interface ImprovabilityInfo {
  /** 개선 가능 여부 */
  can_improve: boolean;
  /** 개선 방법들 */
  how_to_improve: string[];
  /** 예상 확신도 증가량 */
  expected_gain: number;
  /** 전문가 필요 여부 */
  requires_expert: boolean;
}

/**
 * 다층 확신도 시스템
 *
 * 정직한 불확실성 표현을 위한 핵심 타입
 */
export interface ConfidenceBreakdown {
  /** 전체 확신도 (0-1) */
  overall: number;

  /** 세부 확신도 */
  breakdown: {
    /** 이론적 확신도: 명리학 이론에 부합하는가? */
    theoretical: number;
    /** 실전적 확신도: 실전에 적용 가능한가? */
    practical: number;
    /** 데이터 확신도: 충분한 데이터/선례가 있는가? */
    data_richness: number;
    /** 일관성 확신도: 내부 논리가 일관적인가? */
    consistency: number;
  };

  /** 불확실성 요인들 */
  uncertainty_factors: UncertaintyFactor[];

  /** 개선 가능성 */
  improvability: ImprovabilityInfo;

  /** 메타 정보 */
  meta?: {
    computation_method: string;
    last_updated: Date;
    version: string;
  };
}

// ============================================
// Best-of-N 토너먼트
// ============================================

/**
 * 관점 (Perspective)
 */
export interface Perspective {
  name: string;
  source: string;
  weight: number;
  approach: string;
}

/**
 * 후보 (Candidate)
 */
export interface Candidate<T> {
  result: T;
  perspective: string;
  source: string;
  base_confidence: number;
  weighted_confidence: number;
  reasoning: string[];
  rubric_score?: number;
  self_critique?: CritiqueResult;
}

/**
 * 자체 비판 결과
 */
export interface CritiqueResult {
  strengths: string[];
  weaknesses: string[];
  confidence_adjustment: number;
}

/**
 * 루브릭 기준
 */
export interface RubricCriterion {
  weight: number;
  criteria: {
    [key: string]: number;
  };
}

/**
 * 루브릭 (평가 기준)
 */
export interface Rubric {
  theoretical_soundness: RubricCriterion;
  practical_validity: RubricCriterion;
  reasoning_quality: RubricCriterion;
  uncertainty_management: RubricCriterion;
  internal_consistency: RubricCriterion;
}

// ============================================
// 엣지 케이스 (Edge Cases)
// ============================================

/**
 * 엣지 케이스 타입
 */
export enum EdgeCaseType {
  ELEMENTAL_EXTREME = '오행_극단불균형',
  PATTERN_BOUNDARY = '격국_경계선',
  CONFLICT_HEAVY = '충형해_과다',
  SPECIAL_STRUCTURE = '특이구조',
  SEASONAL_EXTREME = '계절_극단',
  DAYMASTER_EXTREME = '일간_극단',
  MULTIPLE_SPECIAL = '다중특수격',
  YINYANG_EXTREME = '음양_극단'
}

/**
 * 엣지 케이스 정보
 */
export interface EdgeCase {
  type: EdgeCaseType;
  severity: 'low' | 'medium' | 'high';
  confidence_impact: number;
  warning: string;
  description: string;
  recommendations: string[];
}

// ============================================
// 대안 (Alternatives)
// ============================================

/**
 * 대안 해석
 */
export interface Alternative<T = any> {
  perspective: string;
  result: T;
  confidence: number;
  reasoning: string[];
  difference_explanation?: string;
}

// ============================================
// UI 제어
// ============================================

/**
 * 배지 정보
 */
export interface BadgeInfo {
  text: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
  icon: string;
}

/**
 * 경고 레벨
 */
export type WarningLevel = 'none' | 'info' | 'warning' | 'danger';

// ============================================
// 확신도 정책
// ============================================

/**
 * 확신도 정책
 */
export interface ConfidencePolicy {
  threshold: number;
  action: 'display' | 'display_with_warning' | 'display_with_strong_warning' | 'hide_or_refuse';
  badge: BadgeInfo;
  message?: string;
  warning_level: WarningLevel;
  show_alternatives?: boolean;
  hide_result?: boolean;
}

// ============================================
// 기본 매핑 테이블
// ============================================

/**
 * 출처 정보
 */
export interface SourceInfo {
  primary: string;
  secondary?: string[];
  consensus_level?: 'high' | 'medium' | 'low' | 'disputed';
  page?: string; // 출처 페이지 정보
  confidence?: number; // 확신도 (0-1)
}

/**
 * 예외 상황
 */
export interface ExceptionCase {
  condition: string;
  희신_변경?: string[];
  기신_변경?: string[];
  explanation: string;
}

/**
 * 유파별 차이
 */
export interface SchoolDifference {
  자평파?: Partial<any>;
  적천수파?: Partial<any>;
  차이점설명: string;
}

/**
 * 기본 매핑
 */
export interface 기본매핑 {
  일간: string;
  격국: string;
  용신: string;
  희신: string[];
  기신: string[];
  근거: string[];
  출처: SourceInfo;
  기본확신도: number;
  전제조건: string[];
  예외상황: ExceptionCase[];
  유파별차이?: SchoolDifference;
}

// ============================================
// 메타 분석
// ============================================

/**
 * 메타 분석 결과
 */
export interface MetaAnalysis {
  perspectives_considered: number;
  agreement_level: number;
  controversy?: string[];
  confidence_range?: {
    min: number;
    max: number;
    std: number;
  };
  alternatives?: Alternative[];
}

// ============================================
// 확장 결과 타입
// ============================================

/**
 * 확장 가능한 결과 타입
 *
 * CLAUDE.md 규범을 따르는 모든 결과는 이 인터페이스를 확장해야 함
 */
export interface ExtendedResult<T> {
  result: T;
  confidence: ConfidenceBreakdown;
  reasoning: string[];
  assumptions: string[];
  limitations: string[];
  alternatives?: Alternative<T>[];
  next_questions: string[];
  ui_control: {
    show_result: boolean;
    warning_level: WarningLevel;
    badge: BadgeInfo;
  };
  meta?: MetaAnalysis;
}
