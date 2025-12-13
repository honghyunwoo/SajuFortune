/**
 * __tests__/ai/perspectives.test.ts
 *
 * 관점(Perspectives) 시스템 테스트
 */

import { describe, it, expect } from 'vitest';
import {
  PERSPECTIVES,
  validatePerspectives,
  getPerspective,
  getTopPerspectives,
  getAllPerspectives,
  getPerspectiveConfig
} from '../../src/ai/perspectives';

describe('Perspectives System', () => {
  describe('PERSPECTIVES 상수', () => {
    it('5가지 관점이 정의되어 있어야 함', () => {
      expect(PERSPECTIVES).toHaveLength(5);
    });

    it('각 관점은 name, source, weight, approach를 가져야 함', () => {
      PERSPECTIVES.forEach(p => {
        expect(p).toHaveProperty('name');
        expect(p).toHaveProperty('source');
        expect(p).toHaveProperty('weight');
        expect(p).toHaveProperty('approach');
      });
    });

    it('모든 관점의 name이 고유해야 함', () => {
      const names = PERSPECTIVES.map(p => p.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('모든 weight가 0과 1 사이여야 함', () => {
      PERSPECTIVES.forEach(p => {
        expect(p.weight).toBeGreaterThan(0);
        expect(p.weight).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('validatePerspectives()', () => {
    it('관점 가중치 합계가 1.0이어야 함', () => {
      expect(validatePerspectives()).toBe(true);

      const totalWeight = PERSPECTIVES.reduce((sum, p) => sum + p.weight, 0);
      expect(Math.abs(totalWeight - 1.0)).toBeLessThan(0.001);
    });
  });

  describe('getPerspective()', () => {
    it('존재하는 관점을 이름으로 찾을 수 있어야 함', () => {
      const perspective = getPerspective('격국용신론');
      expect(perspective).toBeDefined();
      expect(perspective?.name).toBe('격국용신론');
    });

    it('존재하지 않는 관점은 undefined 반환', () => {
      const perspective = getPerspective('존재하지않는관점');
      expect(perspective).toBeUndefined();
    });
  });

  describe('getTopPerspectives()', () => {
    it('가중치 기준 상위 N개를 반환해야 함', () => {
      const top3 = getTopPerspectives(3);
      expect(top3).toHaveLength(3);

      // 가중치 내림차순 정렬 확인
      for (let i = 0; i < top3.length - 1; i++) {
        expect(top3[i].weight).toBeGreaterThanOrEqual(top3[i + 1].weight);
      }
    });

    it('첫 번째는 격국용신론(weight 0.3)이어야 함', () => {
      const top = getTopPerspectives(1);
      expect(top[0].name).toBe('격국용신론');
      expect(top[0].weight).toBe(0.3);
    });
  });

  describe('getAllPerspectives()', () => {
    it('모든 관점을 반환해야 함', () => {
      const all = getAllPerspectives();
      expect(all).toHaveLength(5);
    });

    it('원본 배열을 수정하지 않아야 함 (immutable)', () => {
      const all = getAllPerspectives();
      all.push({
        name: '테스트',
        source: '테스트',
        weight: 0.1,
        approach: '테스트'
      });

      expect(PERSPECTIVES).toHaveLength(5); // 원본 유지
    });
  });

  describe('getPerspectiveConfig()', () => {
    it('각 관점에 대한 설정을 반환해야 함', () => {
      const config = getPerspectiveConfig('격국용신론');

      expect(config).toHaveProperty('strictness');
      expect(config).toHaveProperty('seasonal_importance');
      expect(config).toHaveProperty('balance_importance');
      expect(config).toHaveProperty('monthly_pillar_importance');
    });

    it('모든 설정값이 0-1 사이여야 함', () => {
      const config = getPerspectiveConfig('격국용신론');

      expect(config.strictness).toBeGreaterThanOrEqual(0);
      expect(config.strictness).toBeLessThanOrEqual(1);

      expect(config.seasonal_importance).toBeGreaterThanOrEqual(0);
      expect(config.seasonal_importance).toBeLessThanOrEqual(1);

      expect(config.balance_importance).toBeGreaterThanOrEqual(0);
      expect(config.balance_importance).toBeLessThanOrEqual(1);

      expect(config.monthly_pillar_importance).toBeGreaterThanOrEqual(0);
      expect(config.monthly_pillar_importance).toBeLessThanOrEqual(1);
    });

    it('격국용신론은 monthly_pillar_importance가 높아야 함', () => {
      const config = getPerspectiveConfig('격국용신론');
      expect(config.monthly_pillar_importance).toBeGreaterThan(0.8);
    });

    it('조후용신론은 seasonal_importance가 높아야 함', () => {
      const config = getPerspectiveConfig('조후용신론');
      expect(config.seasonal_importance).toBeGreaterThan(0.8);
    });

    it('통변론은 balance_importance가 높아야 함', () => {
      const config = getPerspectiveConfig('통변론');
      expect(config.balance_importance).toBeGreaterThan(0.8);
    });

    it('보수파는 strictness가 높아야 함', () => {
      const config = getPerspectiveConfig('보수파');
      expect(config.strictness).toBeGreaterThan(0.8);
    });

    it('현대파는 strictness가 낮아야 함', () => {
      const config = getPerspectiveConfig('현대파');
      expect(config.strictness).toBeLessThan(0.5);
    });

    it('존재하지 않는 관점은 기본 설정 반환', () => {
      const config = getPerspectiveConfig('존재하지않는관점');

      expect(config.strictness).toBe(0.5);
      expect(config.seasonal_importance).toBe(0.5);
      expect(config.balance_importance).toBe(0.5);
      expect(config.monthly_pillar_importance).toBe(0.5);
    });
  });

  describe('관점별 특성', () => {
    it('격국용신론: 가장 높은 가중치', () => {
      const p = getPerspective('격국용신론');
      expect(p?.weight).toBe(0.3);
    });

    it('조후용신론: 두 번째로 높은 가중치', () => {
      const p = getPerspective('조후용신론');
      expect(p?.weight).toBe(0.25);
    });

    it('통변론: 세 번째 가중치', () => {
      const p = getPerspective('통변론');
      expect(p?.weight).toBe(0.2);
    });

    it('보수파: 네 번째 가중치', () => {
      const p = getPerspective('보수파');
      expect(p?.weight).toBe(0.15);
    });

    it('현대파: 가장 낮은 가중치', () => {
      const p = getPerspective('현대파');
      expect(p?.weight).toBe(0.1);
    });

    it('모든 관점의 source가 명시되어 있어야 함', () => {
      PERSPECTIVES.forEach(p => {
        expect(p.source).toBeTruthy();
        expect(p.source.length).toBeGreaterThan(0);
      });
    });

    it('모든 관점의 approach가 명시되어 있어야 함', () => {
      PERSPECTIVES.forEach(p => {
        expect(p.approach).toBeTruthy();
        expect(p.approach.length).toBeGreaterThan(10); // 최소 10자 이상
      });
    });
  });
});
