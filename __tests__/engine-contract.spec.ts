/**
 * Engine 계약 검증 테스트
 * shared/engine/analysis.ts의 buildAnalysisResult 반환 스키마 형태 검증
 */

import { describe, it, expect } from 'vitest';
import { buildAnalysisResult, type SajuData, type FortuneAnalysis } from '@shared/engine/analysis';

describe('Engine 계약 검증 (Contract Validation)', () => {
  const testSajuData: SajuData = {
    pillars: [
      { heavenly: '갑', earthly: '자', element: 'wood' },
      { heavenly: '을', earthly: '축', element: 'wood' },
      { heavenly: '병', earthly: '인', element: 'fire' },
      { heavenly: '정', earthly: '묘', element: 'fire' },
    ],
    elements: {
      wood: 2,
      fire: 2,
      earth: 1,
      metal: 2,
      water: 1,
    },
    dayMaster: '병',
    strength: 'medium' as const,
  };

  let result: FortuneAnalysis;

  beforeEach(() => {
    result = buildAnalysisResult(testSajuData, 'male');
  });

  describe('FortuneAnalysis 필수 필드', () => {
    it('personality 필드 존재 및 타입 검증', () => {
      expect(result).toHaveProperty('personality');
      expect(typeof result.personality).toBe('string');
      expect(result.personality.length).toBeGreaterThan(0);
    });

    it('todayFortune 필드 존재 및 구조 검증', () => {
      expect(result).toHaveProperty('todayFortune');
      expect(result.todayFortune).toHaveProperty('rating');
      expect(result.todayFortune).toHaveProperty('overall');
      expect(result.todayFortune).toHaveProperty('description');
      expect(result.todayFortune).toHaveProperty('love');
      expect(result.todayFortune).toHaveProperty('career');
      expect(result.todayFortune).toHaveProperty('money');

      // 타입 검증
      expect(typeof result.todayFortune.rating).toBe('number');
      expect(typeof result.todayFortune.overall).toBe('string');
      expect(typeof result.todayFortune.description).toBe('string');
      expect(typeof result.todayFortune.love).toBe('string');
      expect(typeof result.todayFortune.career).toBe('string');
      expect(typeof result.todayFortune.money).toBe('string');
    });

    it('todayFortune.rating 범위 검증 (1-5)', () => {
      expect(result.todayFortune.rating).toBeGreaterThanOrEqual(1);
      expect(result.todayFortune.rating).toBeLessThanOrEqual(5);
    });

    it('detailedAnalysis 필드 존재 및 구조 검증', () => {
      expect(result.detailedAnalysis).toBeDefined();
      expect(result.detailedAnalysis).toHaveProperty('love');
      expect(result.detailedAnalysis).toHaveProperty('career');
      expect(result.detailedAnalysis).toHaveProperty('health');
      expect(result.detailedAnalysis).toHaveProperty('money');

      // 각 항목 구조 검증
      const categories = ['love', 'career', 'health', 'money'] as const;
      categories.forEach(category => {
        const item = result.detailedAnalysis?.[category];
        expect(item).toHaveProperty('score');
        expect(item).toHaveProperty('level');
        expect(item).toHaveProperty('description');

        expect(typeof item?.score).toBe('number');
        expect(typeof item?.level).toBe('string');
        expect(typeof item?.description).toBe('string');
      });
    });

    it('detailedAnalysis 점수 범위 검증 (0-100)', () => {
      const categories = ['love', 'career', 'health', 'money'] as const;
      categories.forEach(category => {
        const score = result.detailedAnalysis?.[category].score;
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('선택적 필드 (Optional Fields)', () => {
    it('compatibility 필드 구조 검증', () => {
      expect(result.compatibility).toBeDefined();
      expect(result.compatibility).toHaveProperty('zodiac');
      expect(result.compatibility).toHaveProperty('saju');
      expect(result.compatibility).toHaveProperty('element');

      // 각 항목 구조
      expect(result.compatibility?.zodiac).toHaveProperty('compatibility');
      expect(result.compatibility?.zodiac).toHaveProperty('description');
      expect(result.compatibility?.saju).toHaveProperty('compatibility');
      expect(result.compatibility?.saju).toHaveProperty('description');
      expect(result.compatibility?.element).toHaveProperty('compatibility');
      expect(result.compatibility?.element).toHaveProperty('description');
    });

    it('monthlyFortune 배열 길이 12', () => {
      expect(result.monthlyFortune).toBeDefined();
      expect(Array.isArray(result.monthlyFortune)).toBe(true);
      expect(result.monthlyFortune).toHaveLength(12);
    });

    it('monthlyFortune 각 월 구조 검증', () => {
      result.monthlyFortune?.forEach((monthData, index) => {
        expect(monthData).toHaveProperty('month');
        expect(monthData).toHaveProperty('rating');
        expect(monthData).toHaveProperty('description');

        expect(monthData.month).toBe(index + 1); // 1-12
        expect(typeof monthData.rating).toBe('number');
        expect(typeof monthData.description).toBe('string');

        // 점수 범위
        expect(monthData.rating).toBeGreaterThanOrEqual(1);
        expect(monthData.rating).toBeLessThanOrEqual(5);
      });
    });

    it('advice 필드 구조 검증', () => {
      expect(result.advice).toBeDefined();
      expect(result.advice).toHaveProperty('general');
      expect(result.advice).toHaveProperty('career');
      expect(result.advice).toHaveProperty('relationship');
      expect(result.advice).toHaveProperty('health');

      // 각 항목이 문자열 배열인지 검증
      expect(Array.isArray(result.advice?.general)).toBe(true);
      expect(Array.isArray(result.advice?.career)).toBe(true);
      expect(Array.isArray(result.advice?.relationship)).toBe(true);
      expect(Array.isArray(result.advice?.health)).toBe(true);

      // 배열이 비어있지 않은지 검증
      expect(result.advice?.general.length).toBeGreaterThan(0);
      expect(result.advice?.career.length).toBeGreaterThan(0);
      expect(result.advice?.relationship.length).toBeGreaterThan(0);
      expect(result.advice?.health.length).toBeGreaterThan(0);
    });
  });

  describe('데이터 품질 검증', () => {
    it('모든 문자열 필드가 비어있지 않음', () => {
      expect(result.personality.trim().length).toBeGreaterThan(0);
      expect(result.todayFortune.description.trim().length).toBeGreaterThan(0);
      expect(result.detailedAnalysis?.love.description.trim().length).toBeGreaterThan(0);
    });

    it('점수 필드가 유효한 숫자', () => {
      const scores = [
        result.todayFortune.rating,
        result.detailedAnalysis?.love.score,
        result.detailedAnalysis?.career.score,
        result.detailedAnalysis?.health.score,
        result.detailedAnalysis?.money.score,
      ];

      scores.forEach(score => {
        expect(Number.isFinite(score)).toBe(true);
        expect(Number.isNaN(score)).toBe(false);
      });
    });

    it('배열 필드의 요소가 모두 유효', () => {
      result.monthlyFortune?.forEach(month => {
        expect(month.month).toBeGreaterThan(0);
        expect(month.month).toBeLessThanOrEqual(12);
        expect(Number.isInteger(month.month)).toBe(true);
      });

      result.advice?.general.forEach(advice => {
        expect(typeof advice).toBe('string');
        expect(advice.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('다양한 입력에 대한 계약 준수', () => {
    it('강한 일간 (strong) 케이스', () => {
      const strongCase: SajuData = {
        ...testSajuData,
        strength: 'strong',
      };

      const result = buildAnalysisResult(strongCase, 'male');
      expect(result).toHaveProperty('personality');
      expect(result.todayFortune.rating).toBeGreaterThanOrEqual(1);
      expect(result.monthlyFortune).toHaveLength(12);
    });

    it('약한 일간 (weak) 케이스', () => {
      const weakCase: SajuData = {
        ...testSajuData,
        strength: 'weak',
      };

      const result = buildAnalysisResult(weakCase, 'female');
      expect(result).toHaveProperty('personality');
      expect(result.detailedAnalysis?.love).toBeDefined();
    });

    it('극단적 오행 불균형 케이스', () => {
      const extremeCase: SajuData = {
        ...testSajuData,
        elements: {
          wood: 8,
          fire: 0,
          earth: 0,
          metal: 0,
          water: 0,
        },
      };

      const result = buildAnalysisResult(extremeCase, 'male');
      expect(result).toHaveProperty('personality');
      expect(result.detailedAnalysis?.love.score).toBeGreaterThanOrEqual(0);
      expect(result.detailedAnalysis?.love.score).toBeLessThanOrEqual(100);
    });
  });
});

function beforeEach(fn: () => void) {
  fn();
}
