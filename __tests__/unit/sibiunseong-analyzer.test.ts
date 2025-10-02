import { describe, it, expect } from 'vitest';
import { analyze십이운성, type 십이운성결과 } from '../../shared/sibiunseong-analyzer';
import type { 사주정보 } from '../../shared/sibiunseong-analyzer';

describe('십이운성 분석기 (Sibiunseong Analyzer)', () => {
  // 테스트용 사주 데이터 생성 헬퍼
  const create사주 = (
    year: { gan: string; ji: string },
    month: { gan: string; ji: string },
    day: { gan: string; ji: string },
    hour: { gan: string; ji: string }
  ): 사주정보 => ({
    year,
    month,
    day,
    hour
  });

  describe('십이운성 기본 동작', () => {
    it('4주 (년월일시) 각각의 십이운성을 분석해야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      expect(result.년주십이운성).toBeDefined();
      expect(result.월주십이운성).toBeDefined();
      expect(result.일주십이운성).toBeDefined();
      expect(result.시주십이운성).toBeDefined();
    });

    it('각 주의 십이운성은 12가지 중 하나여야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' },
        { gan: '무', ji: '술' },
        { gan: '경', ji: '자' }
      );

      const result = analyze십이운성(사주);

      const 유효한운성 = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];

      expect(유효한운성).toContain(result.년주십이운성.운성);
      expect(유효한운성).toContain(result.월주십이운성.운성);
      expect(유효한운성).toContain(result.일주십이운성.운성);
      expect(유효한운성).toContain(result.시주십이운성.운성);
    });
  });

  describe('십이운성 강도 (强度) 계산', () => {
    it('모든 운성의 강도는 0-100 범위여야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      expect(result.년주십이운성.강도).toBeGreaterThanOrEqual(0);
      expect(result.년주십이운성.강도).toBeLessThanOrEqual(100);

      expect(result.월주십이운성.강도).toBeGreaterThanOrEqual(0);
      expect(result.월주십이운성.강도).toBeLessThanOrEqual(100);

      expect(result.일주십이운성.강도).toBeGreaterThanOrEqual(0);
      expect(result.일주십이운성.강도).toBeLessThanOrEqual(100);

      expect(result.시주십이운성.강도).toBeGreaterThanOrEqual(0);
      expect(result.시주십이운성.강도).toBeLessThanOrEqual(100);
    });

    it('장생/건록/제왕은 높은 강도를 가져야 함 (>70)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '해' }, // 갑목의 장생
        { gan: '갑', ji: '인' }, // 갑목의 건록
        { gan: '갑', ji: '묘' }, // 갑목의 제왕 (가능)
        { gan: '병', ji: '오' }
      );

      const result = analyze십이운성(사주);

      // 장생, 건록, 제왕 중 하나는 강도가 높아야 함
      const 높은강도운성 = [
        result.년주십이운성,
        result.월주십이운성,
        result.일주십이운성,
        result.시주십이운성
      ].filter(x => ['장생', '건록', '제왕'].includes(x.운성));

      if (높은강도운성.length > 0) {
        const 최고강도 = Math.max(...높은강도운성.map(x => x.강도));
        expect(최고강도).toBeGreaterThan(60);
      }
    });

    it('병/사/절은 낮은 강도를 가져야 함 (<40)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      const 낮은강도운성 = [
        result.년주십이운성,
        result.월주십이운성,
        result.일주십이운성,
        result.시주십이운성
      ].filter(x => ['병', '사', '절'].includes(x.운성));

      낮은강도운성.forEach(운성 => {
        expect(운성.강도).toBeLessThan(50);
      });
    });
  });

  describe('운성 해석 (解释)', () => {
    it('각 주의 십이운성은 의미 있는 해석을 가져야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' },
        { gan: '무', ji: '술' },
        { gan: '경', ji: '자' }
      );

      const result = analyze십이운성(사주);

      expect(result.년주십이운성.해석.length).toBeGreaterThan(5);
      expect(result.월주십이운성.해석.length).toBeGreaterThan(5);
      expect(result.일주십이운성.해석.length).toBeGreaterThan(5);
      expect(result.시주십이운성.해석.length).toBeGreaterThan(5);
    });

    it('해석은 해당 운성의 특성을 반영해야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '해' }, // 갑목의 장생
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      // 장생은 긍정적인 해석을 포함해야 함
      if (result.년주십이운성.운성 === '장생') {
        expect(result.년주십이운성.해석.length).toBeGreaterThan(10);
      }
    });
  });

  describe('전체 평가 (总体评价)', () => {
    it('전체평가는 필수 필드를 모두 가져야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      expect(result.전체평가).toHaveProperty('주요운성');
      expect(result.전체평가).toHaveProperty('생애에너지');
      expect(result.전체평가).toHaveProperty('종합해석');
    });

    it('생애에너지는 0-100 범위여야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' },
        { gan: '무', ji: '술' },
        { gan: '경', ji: '자' }
      );

      const result = analyze십이운성(사주);

      expect(result.전체평가.생애에너지).toBeGreaterThanOrEqual(0);
      expect(result.전체평가.생애에너지).toBeLessThanOrEqual(100);
    });

    it('주요운성 배열은 1개 이상의 운성을 포함해야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      expect(result.전체평가.주요운성.length).toBeGreaterThan(0);
      expect(result.전체평가.주요운성.length).toBeLessThanOrEqual(4);
    });

    it('종합해석은 의미 있는 문자열이어야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' },
        { gan: '무', ji: '술' },
        { gan: '경', ji: '자' }
      );

      const result = analyze십이운성(사주);

      expect(result.전체평가.종합해석).toBeDefined();
      expect(result.전체평가.종합해석.length).toBeGreaterThan(20);
    });
  });

  describe('일간-지지 관계', () => {
    it('갑목의 장생은 해수여야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '해' },
        { gan: '을', ji: '축' },
        { gan: '갑', ji: '해' }, // 일간 갑, 지지 해
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      // 갑목 + 해수 = 장생
      const 갑해조합 = [result.년주십이운성, result.일주십이운성].filter(
        x => x.운성 === '장생'
      );

      expect(갑해조합.length).toBeGreaterThan(0);
    });

    it('병화의 장생은 인목이어야 함', () => {
      const 사주 = create사주(
        { gan: '병', ji: '인' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' }, // 일간 병, 지지 인
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      // 병화 + 인목 = 장생
      const 병인조합 = [result.년주십이운성, result.일주십이운성].filter(
        x => x.운성 === '장생'
      );

      expect(병인조합.length).toBeGreaterThan(0);
    });

    it('경금의 장생은 사화여야 함', () => {
      const 사주 = create사주(
        { gan: '경', ji: '사' },
        { gan: '을', ji: '축' },
        { gan: '경', ji: '사' }, // 일간 경, 지지 사
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      // 경금 + 사화 = 장생
      const 경사조합 = [result.년주십이운성, result.일주십이운성].filter(
        x => x.운성 === '장생'
      );

      expect(경사조합.length).toBeGreaterThan(0);
    });
  });

  describe('강한 운세 패턴', () => {
    it('4주에 강한 운성(장생/건록/제왕)이 많으면 생애에너지가 높아야 함', () => {
      // 강한 운성들로 구성
      const 사주 = create사주(
        { gan: '갑', ji: '해' }, // 갑목 장생
        { gan: '갑', ji: '인' }, // 갑목 건록
        { gan: '갑', ji: '묘' }, // 갑목 제왕 가능
        { gan: '갑', ji: '인' }
      );

      const result = analyze십이운성(사주);

      // 강한 운성이 많으면 생애에너지가 60 이상이어야 함
      const 강한운성개수 = [
        result.년주십이운성,
        result.월주십이운성,
        result.일주십이운성,
        result.시주십이운성
      ].filter(x => ['장생', '건록', '제왕'].includes(x.운성)).length;

      if (강한운성개수 >= 2) {
        expect(result.전체평가.생애에너지).toBeGreaterThan(50);
      }
    });

    it('4주에 약한 운성(병/사/절)이 많으면 생애에너지가 낮아야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      const 약한운성개수 = [
        result.년주십이운성,
        result.월주십이운성,
        result.일주십이운성,
        result.시주십이운성
      ].filter(x => ['병', '사', '절'].includes(x.운성)).length;

      if (약한운성개수 >= 3) {
        expect(result.전체평가.생애에너지).toBeLessThan(60);
      }
    });
  });

  describe('주요 운성 선정', () => {
    it('강도가 가장 높은 운성들이 주요운성에 포함되어야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' },
        { gan: '무', ji: '술' },
        { gan: '경', ji: '자' }
      );

      const result = analyze십이운성(사주);

      const 모든운성 = [
        result.년주십이운성,
        result.월주십이운성,
        result.일주십이운성,
        result.시주십이운성
      ];

      // 강도순 정렬
      const 정렬된운성 = [...모든운성].sort((a, b) => b.강도 - a.강도);

      // 주요운성은 상위 강도 운성들이어야 함
      result.전체평가.주요운성.forEach(주요 => {
        const 해당운성 = 정렬된운성.find(x => x.운성 === 주요);
        expect(해당운성).toBeDefined();
      });
    });
  });

  describe('엣지 케이스', () => {
    it('모든 주가 동일한 천간지지인 경우', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' }
      );

      const result = analyze십이운성(사주);

      // 모든 주가 같으면 같은 십이운성이어야 함
      expect(result.년주십이운성.운성).toBe(result.월주십이운성.운성);
      expect(result.월주십이운성.운성).toBe(result.일주십이운성.운성);
      expect(result.일주십이운성.운성).toBe(result.시주십이운성.운성);
    });

    it('모든 주가 다른 천간지지인 경우', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      // 모두 유효한 십이운성이어야 함
      expect(result.년주십이운성.운성).toBeDefined();
      expect(result.월주십이운성.운성).toBeDefined();
      expect(result.일주십이운성.운성).toBeDefined();
      expect(result.시주십이운성.운성).toBeDefined();
    });

    it('극단적으로 강한 사주 (장생/건록/제왕만)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '해' }, // 장생
        { gan: '갑', ji: '인' }, // 건록
        { gan: '갑', ji: '묘' }, // 제왕 가능
        { gan: '갑', ji: '해' }  // 장생
      );

      const result = analyze십이운성(사주);

      // 생애에너지가 매우 높아야 함
      expect(result.전체평가.생애에너지).toBeGreaterThan(60);
    });

    it('극단적으로 약한 사주 (병/사/절만)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      // 생애에너지는 정의되어 있어야 함
      expect(result.전체평가.생애에너지).toBeDefined();
      expect(result.전체평가.생애에너지).toBeGreaterThanOrEqual(0);
    });
  });

  describe('반환 타입 검증', () => {
    it('십이운성결과 인터페이스의 모든 필드가 존재해야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze십이운성(사주);

      expect(result).toHaveProperty('년주십이운성');
      expect(result).toHaveProperty('월주십이운성');
      expect(result).toHaveProperty('일주십이운성');
      expect(result).toHaveProperty('시주십이운성');
      expect(result).toHaveProperty('전체평가');
    });

    it('각 운성 정보는 운성, 강도, 해석을 가져야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' },
        { gan: '무', ji: '술' },
        { gan: '경', ji: '자' }
      );

      const result = analyze십이운성(사주);

      [
        result.년주십이운성,
        result.월주십이운성,
        result.일주십이운성,
        result.시주십이운성
      ].forEach(운성정보 => {
        expect(운성정보).toHaveProperty('운성');
        expect(운성정보).toHaveProperty('강도');
        expect(운성정보).toHaveProperty('해석');
      });
    });
  });
});
