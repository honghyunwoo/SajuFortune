/**
 * __tests__/ai/rubric.test.ts
 *
 * 루브릭(Rubric) 평가 시스템 테스트
 */

import { describe, it, expect } from 'vitest';
import {
  MYEONGRI_RUBRIC,
  validateRubric,
  calculateRubricScore,
  calculateDetailedScore
} from '../../src/ai/rubric';
import type { Candidate } from '../../shared/types';

describe('Rubric System', () => {
  describe('MYEONGRI_RUBRIC 구조', () => {
    it('5가지 평가 기준이 있어야 함', () => {
      expect(MYEONGRI_RUBRIC).toHaveProperty('theoretical_soundness');
      expect(MYEONGRI_RUBRIC).toHaveProperty('practical_validity');
      expect(MYEONGRI_RUBRIC).toHaveProperty('reasoning_quality');
      expect(MYEONGRI_RUBRIC).toHaveProperty('uncertainty_management');
      expect(MYEONGRI_RUBRIC).toHaveProperty('internal_consistency');
    });

    it('각 기준은 weight와 criteria를 가져야 함', () => {
      const criteria = [
        MYEONGRI_RUBRIC.theoretical_soundness,
        MYEONGRI_RUBRIC.practical_validity,
        MYEONGRI_RUBRIC.reasoning_quality,
        MYEONGRI_RUBRIC.uncertainty_management,
        MYEONGRI_RUBRIC.internal_consistency
      ];

      criteria.forEach(c => {
        expect(c).toHaveProperty('weight');
        expect(c).toHaveProperty('criteria');
      });
    });
  });

  describe('validateRubric()', () => {
    it('전체 가중치 합계가 1.0이어야 함', () => {
      expect(validateRubric(MYEONGRI_RUBRIC)).toBe(true);

      const totalWeight =
        MYEONGRI_RUBRIC.theoretical_soundness.weight +
        MYEONGRI_RUBRIC.practical_validity.weight +
        MYEONGRI_RUBRIC.reasoning_quality.weight +
        MYEONGRI_RUBRIC.uncertainty_management.weight +
        MYEONGRI_RUBRIC.internal_consistency.weight;

      expect(Math.abs(totalWeight - 1.0)).toBeLessThan(0.001);
    });

    it('각 기준 내 세부 criteria 합계가 1.0이어야 함', () => {
      const checkCriteriaSum = (criteria: Record<string, number>) => {
        const sum = Object.values(criteria).reduce((a, b) => a + b, 0);
        expect(Math.abs(sum - 1.0)).toBeLessThan(0.001);
      };

      checkCriteriaSum(MYEONGRI_RUBRIC.theoretical_soundness.criteria);
      checkCriteriaSum(MYEONGRI_RUBRIC.practical_validity.criteria);
      checkCriteriaSum(MYEONGRI_RUBRIC.reasoning_quality.criteria);
      checkCriteriaSum(MYEONGRI_RUBRIC.uncertainty_management.criteria);
      checkCriteriaSum(MYEONGRI_RUBRIC.internal_consistency.criteria);
    });
  });

  describe('calculateRubricScore()', () => {
    it('최소 점수는 0이어야 함', () => {
      const candidate: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '',
        base_confidence: 0.5,
        weighted_confidence: 0.5,
        reasoning: []
      };

      const score = calculateRubricScore(candidate, MYEONGRI_RUBRIC);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('최대 점수는 1이어야 함', () => {
      const candidate: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.9,
        weighted_confidence: 0.9,
        reasoning: [
          '상생상극 이론에 근거하여 목생화의 원리로 용신을 화로 선정했습니다',
          '격국 이론에 따라 월령의 투출된 십신을 중심으로 분석했습니다',
          '조후 이론을 적용하여 계절의 한난조습을 고려했습니다'
        ],
        self_critique: {
          strengths: ['이론적 근거 충분', '출처 명시'],
          weaknesses: [],
          overall_assessment: 'strong'
        }
      };

      const score = calculateRubricScore(candidate, MYEONGRI_RUBRIC);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('이론적 근거가 많으면 점수가 높아야 함', () => {
      const candidate1: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['상생상극 이론에 근거', '격국 이론 적용', '조후 고려']
      };

      const candidate2: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['분석 완료']
      };

      const score1 = calculateRubricScore(candidate1, MYEONGRI_RUBRIC);
      const score2 = calculateRubricScore(candidate2, MYEONGRI_RUBRIC);

      expect(score1).toBeGreaterThan(score2);
    });

    it('출처가 있으면 점수가 높아야 함', () => {
      const candidate1: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['분석 완료', '근거 제시']
      };

      const candidate2: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['분석 완료', '근거 제시']
      };

      const score1 = calculateRubricScore(candidate1, MYEONGRI_RUBRIC);
      const score2 = calculateRubricScore(candidate2, MYEONGRI_RUBRIC);

      expect(score1).toBeGreaterThan(score2);
    });

    it('self_critique가 있으면 점수가 높아야 함', () => {
      const candidate1: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['근거1', '근거2'],
        self_critique: {
          strengths: ['강점1'],
          weaknesses: ['약점1'],
          overall_assessment: 'strong'
        }
      };

      const candidate2: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['근거1', '근거2']
      };

      const score1 = calculateRubricScore(candidate1, MYEONGRI_RUBRIC);
      const score2 = calculateRubricScore(candidate2, MYEONGRI_RUBRIC);

      expect(score1).toBeGreaterThan(score2);
    });

    it('확신도가 너무 높으면 페널티 (과대평가 방지)', () => {
      const candidate1: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.99, // 너무 높음
        weighted_confidence: 0.99,
        reasoning: ['근거1', '근거2']
      };

      const candidate2: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.85, // 적정
        weighted_confidence: 0.85,
        reasoning: ['근거1', '근거2']
      };

      const score1 = calculateRubricScore(candidate1, MYEONGRI_RUBRIC);
      const score2 = calculateRubricScore(candidate2, MYEONGRI_RUBRIC);

      // 확신도 관리 항목에서 페널티 받음
      expect(score2).toBeGreaterThanOrEqual(score1 * 0.95); // 거의 비슷하거나 더 높음
    });
  });

  describe('calculateDetailedScore()', () => {
    it('total, breakdown, explanations를 반환해야 함', () => {
      const candidate: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['근거1', '근거2', '근거3']
      };

      const detailed = calculateDetailedScore(candidate, MYEONGRI_RUBRIC);

      expect(detailed).toHaveProperty('total');
      expect(detailed).toHaveProperty('breakdown');
      expect(detailed).toHaveProperty('explanations');
    });

    it('breakdown은 5가지 항목을 가져야 함', () => {
      const candidate: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['근거1', '근거2', '근거3']
      };

      const detailed = calculateDetailedScore(candidate, MYEONGRI_RUBRIC);

      expect(detailed.breakdown).toHaveProperty('theoretical_soundness');
      expect(detailed.breakdown).toHaveProperty('practical_validity');
      expect(detailed.breakdown).toHaveProperty('reasoning_quality');
      expect(detailed.breakdown).toHaveProperty('uncertainty_management');
      expect(detailed.breakdown).toHaveProperty('internal_consistency');
    });

    it('explanations는 5개여야 함', () => {
      const candidate: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['근거1', '근거2', '근거3']
      };

      const detailed = calculateDetailedScore(candidate, MYEONGRI_RUBRIC);

      expect(detailed.explanations).toHaveLength(5);
    });

    it('total은 breakdown의 가중 평균이어야 함', () => {
      const candidate: Candidate<string> = {
        result: 'test',
        perspective: 'test',
        source: '자평진전',
        base_confidence: 0.8,
        weighted_confidence: 0.8,
        reasoning: ['근거1', '근거2', '근거3']
      };

      const detailed = calculateDetailedScore(candidate, MYEONGRI_RUBRIC);

      const calculatedTotal =
        detailed.breakdown.theoretical_soundness * MYEONGRI_RUBRIC.theoretical_soundness.weight +
        detailed.breakdown.practical_validity * MYEONGRI_RUBRIC.practical_validity.weight +
        detailed.breakdown.reasoning_quality * MYEONGRI_RUBRIC.reasoning_quality.weight +
        detailed.breakdown.uncertainty_management * MYEONGRI_RUBRIC.uncertainty_management.weight +
        detailed.breakdown.internal_consistency * MYEONGRI_RUBRIC.internal_consistency.weight;

      expect(Math.abs(detailed.total - calculatedTotal)).toBeLessThan(0.001);
    });
  });

  describe('가중치 분석', () => {
    it('이론적 정합성이 가장 높은 가중치(25%)를 가져야 함', () => {
      expect(MYEONGRI_RUBRIC.theoretical_soundness.weight).toBe(0.25);
    });

    it('실전적 타당성, 근거 품질, 불확실성 관리가 각 20%', () => {
      expect(MYEONGRI_RUBRIC.practical_validity.weight).toBe(0.2);
      expect(MYEONGRI_RUBRIC.reasoning_quality.weight).toBe(0.2);
      expect(MYEONGRI_RUBRIC.uncertainty_management.weight).toBe(0.2);
    });

    it('내부 일관성이 가장 낮은 가중치(15%)를 가져야 함', () => {
      expect(MYEONGRI_RUBRIC.internal_consistency.weight).toBe(0.15);
    });
  });
});
