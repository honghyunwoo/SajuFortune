/**
 * __tests__/ai/confidence.test.ts
 *
 * 확신도 계산 시스템 테스트
 */

import { describe, it, expect } from 'vitest';
import {
  getConfidencePolicy,
  calculateConfidence,
  detectUncertaintyFactors,
  assessImprovability
} from '../../src/ai/confidence';
import type { 사주정보 } from '../../shared/geokguk-analyzer';

// 테스트용 사주 데이터
const mockSaju: 사주정보 = {
  연주: { 천간: '갑', 지지: '자' },
  월주: { 천간: '을', 지지: '축' },
  일주: { 천간: '병', 지지: '인' },
  시주: { 천간: '정', 지지: '묘' },
  일간: '병',
  월령: '축',
  계절: '겨울'
};

describe('Confidence System', () => {
  describe('getConfidencePolicy()', () => {
    it('확신도 0.85+ = 높은 신뢰도 (녹색)', () => {
      const policy = getConfidencePolicy(0.9);

      expect(policy.level).toBe('high');
      expect(policy.color).toBe('green');
      expect(policy.label).toBe('높은 신뢰도');
      expect(policy.action).toBe('show');
    });

    it('확신도 0.7-0.85 = 참고용 (노랑)', () => {
      const policy = getConfidencePolicy(0.75);

      expect(policy.level).toBe('medium');
      expect(policy.color).toBe('yellow');
      expect(policy.label).toBe('참고용');
      expect(policy.action).toBe('show_with_warning');
    });

    it('확신도 0.5-0.7 = 전문가 검증 필요 (주황)', () => {
      const policy = getConfidencePolicy(0.6);

      expect(policy.level).toBe('low');
      expect(policy.color).toBe('orange');
      expect(policy.label).toBe('전문가 검증 필요');
      expect(policy.action).toBe('show_alternatives');
    });

    it('확신도 0.5 미만 = 판단 불가 (빨강)', () => {
      const policy = getConfidencePolicy(0.4);

      expect(policy.level).toBe('critical');
      expect(policy.color).toBe('red');
      expect(policy.label).toBe('판단 불가');
      expect(policy.action).toBe('hide');
    });

    it('경계값 테스트: 0.85', () => {
      const policy1 = getConfidencePolicy(0.85);
      const policy2 = getConfidencePolicy(0.849);

      expect(policy1.level).toBe('high');
      expect(policy2.level).toBe('medium');
    });

    it('경계값 테스트: 0.7', () => {
      const policy1 = getConfidencePolicy(0.7);
      const policy2 = getConfidencePolicy(0.699);

      expect(policy1.level).toBe('medium');
      expect(policy2.level).toBe('low');
    });

    it('경계값 테스트: 0.5', () => {
      const policy1 = getConfidencePolicy(0.5);
      const policy2 = getConfidencePolicy(0.499);

      expect(policy1.level).toBe('low');
      expect(policy2.level).toBe('critical');
    });
  });

  describe('calculateConfidence()', () => {
    it('4가지 breakdown 항목을 반환해야 함', () => {
      const confidence = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'],
        ['근거1', '근거2', '근거3']
      );

      expect(confidence.breakdown).toHaveProperty('theoretical');
      expect(confidence.breakdown).toHaveProperty('practical');
      expect(confidence.breakdown).toHaveProperty('data_richness');
      expect(confidence.breakdown).toHaveProperty('consistency');
    });

    it('overall은 0-1 사이여야 함', () => {
      const confidence = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'],
        ['근거1', '근거2']
      );

      expect(confidence.overall).toBeGreaterThanOrEqual(0);
      expect(confidence.overall).toBeLessThanOrEqual(1);
    });

    it('불확실성 요인 배열을 포함해야 함', () => {
      const confidence = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'],
        ['근거1']
      );

      expect(confidence.uncertainty_factors).toBeDefined();
      expect(Array.isArray(confidence.uncertainty_factors)).toBe(true);
    });

    it('개선 가능성 정보를 포함해야 함', () => {
      const confidence = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'],
        ['근거1']
      );

      expect(confidence.improvability).toBeDefined();
      expect(confidence.improvability).toHaveProperty('improvable');
      expect(confidence.improvability).toHaveProperty('potential_gain');
      expect(confidence.improvability).toHaveProperty('suggestions');
    });

    it('메타 정보를 포함해야 함', () => {
      const confidence = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'],
        ['근거1']
      );

      expect(confidence.meta).toBeDefined();
      expect(confidence.meta?.calculated_at).toBeDefined();
      expect(confidence.meta?.version).toBe('1.0');
    });

    it('근거가 많으면 확신도가 높아야 함', () => {
      const confidence1 = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'],
        ['근거1', '근거2', '근거3', '근거4']
      );

      const confidence2 = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'],
        ['근거1']
      );

      expect(confidence1.overall).toBeGreaterThan(confidence2.overall);
    });

    it('희신/기신이 겹치면 확신도가 낮아야 함 (논리 오류)', () => {
      const confidence1 = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'], // 겹치지 않음
        ['근거1', '근거2']
      );

      const confidence2 = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['화', '금'], // '화'가 겹침
        ['근거1', '근거2']
      );

      expect(confidence1.overall).toBeGreaterThan(confidence2.overall);
    });

    it('무격이면 확신도가 낮아야 함', () => {
      const confidence1 = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'],
        ['근거1', '근거2']
      );

      const confidence2 = calculateConfidence(
        mockSaju,
        '무격',
        null,
        ['목', '화'],
        ['금', '수'],
        ['근거1', '근거2']
      );

      expect(confidence1.overall).toBeGreaterThan(confidence2.overall);
    });
  });

  describe('detectUncertaintyFactors()', () => {
    it('무격이면 no_pattern 요인 감지', () => {
      const factors = detectUncertaintyFactors(mockSaju, '무격', 0.4);

      const hasNoPattern = factors.some(f => f.type === 'no_pattern');
      expect(hasNoPattern).toBe(true);
    });

    it('특수격이면 special_pattern 요인 감지', () => {
      const factors1 = detectUncertaintyFactors(mockSaju, '종강격', 0.6);
      const factors2 = detectUncertaintyFactors(mockSaju, '화격', 0.6);

      const hasSpecial1 = factors1.some(f => f.type === 'special_pattern');
      const hasSpecial2 = factors2.some(f => f.type === 'special_pattern');

      expect(hasSpecial1).toBe(true);
      expect(hasSpecial2).toBe(true);
    });

    it('각 요인은 type, severity, description, impact를 가져야 함', () => {
      const factors = detectUncertaintyFactors(mockSaju, '무격', 0.4);

      if (factors.length > 0) {
        factors.forEach(f => {
          expect(f).toHaveProperty('type');
          expect(f).toHaveProperty('severity');
          expect(f).toHaveProperty('description');
          expect(f).toHaveProperty('impact');
        });
      }
    });

    it('impact는 항상 음수여야 함 (확신도 감소)', () => {
      const factors = detectUncertaintyFactors(mockSaju, '무격', 0.4);

      factors.forEach(f => {
        expect(f.impact).toBeLessThanOrEqual(0);
      });
    });
  });

  describe('assessImprovability()', () => {
    it('시주가 없으면 improvable = true', () => {
      const sajuNoTime = {
        ...mockSaju,
        시주: { 천간: '', 지지: '' }
      };

      const improvability = assessImprovability(sajuNoTime, []);

      expect(improvability.improvable).toBe(true);
      expect(improvability.suggestions).toContain('정확한 출생 시간 확인');
      expect(improvability.potential_gain).toBeGreaterThan(0);
    });

    it('엣지 케이스가 있으면 improvable = true', () => {
      const factors = [
        {
          type: 'edge_case' as const,
          severity: 'high' as const,
          description: '테스트',
          impact: -0.1
        }
      ];

      const improvability = assessImprovability(mockSaju, factors);

      expect(improvability.improvable).toBe(true);
      expect(improvability.suggestions.length).toBeGreaterThan(0);
    });

    it('특수격이면 전문가 검증 권장', () => {
      const factors = [
        {
          type: 'special_pattern' as const,
          severity: 'medium' as const,
          description: '테스트',
          impact: -0.1
        }
      ];

      const improvability = assessImprovability(mockSaju, factors);

      expect(improvability.suggestions).toContain('특수격 전문가의 상세 분석');
    });

    it('문제 없으면 improvable = false', () => {
      const improvability = assessImprovability(mockSaju, []);

      expect(improvability.improvable).toBe(false);
      expect(improvability.suggestions).toContain('추가 분석 불필요');
      expect(improvability.potential_gain).toBe(0);
    });

    it('potential_gain은 0.3 이하여야 함', () => {
      const sajuNoTime = {
        ...mockSaju,
        시주: { 천간: '', 지지: '' }
      };

      const factors = [
        {
          type: 'edge_case' as const,
          severity: 'high' as const,
          description: '테스트',
          impact: -0.15
        },
        {
          type: 'special_pattern' as const,
          severity: 'medium' as const,
          description: '테스트',
          impact: -0.12
        }
      ];

      const improvability = assessImprovability(sajuNoTime, factors);

      expect(improvability.potential_gain).toBeLessThanOrEqual(0.3);
    });
  });

  describe('통합 시나리오', () => {
    it('고품질 분석 = 높은 확신도', () => {
      const confidence = calculateConfidence(
        mockSaju,
        '정관격',
        '목',
        ['목', '화'],
        ['금', '수'],
        [
          '정관격의 이론에 근거하여 용신을 목으로 선정했습니다',
          '월령의 투출된 정관을 활용하는 것이 유리합니다',
          '조후를 고려하여 계절의 한기를 보완할 수 있습니다'
        ]
      );

      expect(confidence.overall).toBeGreaterThan(0.6);

      const policy = getConfidencePolicy(confidence.overall);
      expect(policy.action).not.toBe('hide');
    });

    it('저품질 분석 = 낮은 확신도', () => {
      const sajuNoTime = {
        ...mockSaju,
        시주: { 천간: '', 지지: '' }
      };

      const confidence = calculateConfidence(
        sajuNoTime,
        '무격',
        null,
        ['목'], // 희신 1개만
        ['금', '수', '목'], // 기신에 희신 중복
        ['분석 완료'] // 근거 1개만
      );

      expect(confidence.overall).toBeLessThan(0.7);

      const policy = getConfidencePolicy(confidence.overall);
      expect(['show_alternatives', 'hide']).toContain(policy.action);
    });
  });
});
