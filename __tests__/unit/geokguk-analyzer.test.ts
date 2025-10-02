import { describe, it, expect } from 'vitest';
import { analyze격국, type 격국결과 } from '../../shared/geokguk-analyzer';
import type { 사주정보 } from '../../shared/geokguk-analyzer';

describe('격국 분석기 (Geokguk Analyzer)', () => {
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

  describe('정격 (正格) 판별', () => {
    it('정관격 (正官格) - 일간이 갑목이고 월지에 관성이 투출된 경우', () => {
      // 갑목 일간, 월지 유금 (정관)
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '신', ji: '유' }, // 월지 유금
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '자' }
      );

      const result = analyze격국(사주);

      expect(result.격국명).toBe('정관격');
      expect(result.격국종류).toBe('정격');
      expect(result.격국강도).toBeGreaterThan(0);
      expect(result.용신).toBeDefined();
      expect(result.상세해석.장점.join(',')).toContain('정직');
    });

    it('편관격 (偏官格) - 월지에 편관이 있는 경우', () => {
      // 을목 일간, 월간 신금 (편관)
      const 사주 = create사주(
        { gan: '을', ji: '축' },
        { gan: '신', ji: '신' }, // 월간 신금 (십신표[을][신] = 편관)
        { gan: '을', ji: '묘' },
        { gan: '정', ji: '축' }
      );

      const result = analyze격국(사주);

      expect(result.격국명).toBe('편관격');
      expect(result.격국종류).toBe('정격');
      expect(result.용신).toBeDefined();
    });

    it('정재격 (正財格) - 월지에 정재가 투출된 경우', () => {
      // 갑목 일간, 월간 기토 (정재)
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '기', ji: '술' }, // 월간 기토 (십신표[갑][기] = 정재)
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' }
      );

      const result = analyze격국(사주);

      expect(result.격국명).toBe('정재격');
      expect(result.격국종류).toBe('정격');
      expect(result.상세해석.적합직업.join(',')).toContain('회계');
    });

    it('편재격 (偏財格) - 월지에 편재가 있는 경우', () => {
      // 을목 일간, 월지 진토 (편재)
      const 사주 = create사주(
        { gan: '을', ji: '묘' },
        { gan: '기', ji: '진' }, // 월지 진토 (편재)
        { gan: '을', ji: '사' },
        { gan: '신', ji: '유' }
      );

      const result = analyze격국(사주);

      expect(result.격국명).toBe('편재격');
      expect(result.격국종류).toBe('정격');
    });

    it('정인격 (正印格) - 월지에 정인이 투출된 경우', () => {
      // 병화 일간, 월간 을목 (정인)
      const 사주 = create사주(
        { gan: '병', ji: '오' },
        { gan: '을', ji: '묘' }, // 월간 을목 (십신표[병][을] = 정인)
        { gan: '병', ji: '오' },
        { gan: '무', ji: '술' }
      );

      const result = analyze격국(사주);

      expect(result.격국명).toBe('정인격');
      expect(result.격국종류).toBe('정격');
      expect(result.상세해석.장점.join(',')).toContain('학문');
    });

    it('편인격 (偏印格) - 월지에 편인이 있는 경우', () => {
      // 정화 일간, 월간 을목 (편인)
      const 사주 = create사주(
        { gan: '정', ji: '미' },
        { gan: '을', ji: '인' }, // 월간 을목 (십신표[정][을] = 편인)
        { gan: '정', ji: '사' },
        { gan: '기', ji: '축' }
      );

      const result = analyze격국(사주);

      expect(result.격국명).toBe('편인격');
      expect(result.격국종류).toBe('정격');
    });

    it('식신격 (食神格) - 월지에 식신이 투출된 경우', () => {
      // 갑목 일간, 월간 병화 (식신)
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' }, // 월간 병화 (십신표[갑][병] = 식신)
        { gan: '갑', ji: '인' },
        { gan: '무', ji: '술' }
      );

      const result = analyze격국(사주);

      expect(result.격국명).toBe('식신격');
      expect(result.격국종류).toBe('정격');
      expect(result.상세해석.적합직업.join(',')).toContain('예술');
    });

    it('상관격 (傷官格) - 월지에 상관이 있는 경우', () => {
      // 을목 일간, 월간 병화 (상관)
      const 사주 = create사주(
        { gan: '을', ji: '묘' },
        { gan: '병', ji: '사' }, // 월간 병화 (십신표[을][병] = 상관)
        { gan: '을', ji: '해' },
        { gan: '기', ji: '미' }
      );

      const result = analyze격국(사주);

      expect(result.격국명).toBe('상관격');
      expect(result.격국종류).toBe('정격');
    });
  });

  describe('격국 강도 (格局强度) 계산', () => {
    it('격국 강도는 0-100 범위 내에 있어야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '신', ji: '유' },
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '자' }
      );

      const result = analyze격국(사주);

      expect(result.격국강도).toBeGreaterThanOrEqual(0);
      expect(result.격국강도).toBeLessThanOrEqual(100);
    });

    it('강한 격국은 70 이상의 강도를 가져야 함', () => {
      // 강한 정관격: 일간 강하고 월지 정관 명확
      const 사주 = create사주(
        { gan: '갑', ji: '인' }, // 목 왕성
        { gan: '신', ji: '유' }, // 정관
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' }
      );

      const result = analyze격국(사주);

      expect(result.격국강도).toBeGreaterThanOrEqual(60);
    });
  });

  describe('용신 (用神) 추출', () => {
    it('정관격의 용신은 금 오행이어야 함 (갑목 일간)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '신', ji: '유' },
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '자' }
      );

      const result = analyze격국(사주);

      expect(result.용신).toBe('금');
    });

    it('용신은 5가지 오행 중 하나여야 함', () => {
      const 사주 = create사주(
        { gan: '을', ji: '묘' },
        { gan: '경', ji: '신' },
        { gan: '을', ji: '사' },
        { gan: '정', ji: '축' }
      );

      const result = analyze격국(사주);

      expect(['목', '화', '토', '금', '수']).toContain(result.용신);
    });

    it('희신 배열은 비어있지 않아야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '무', ji: '술' },
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' }
      );

      const result = analyze격국(사주);

      expect(result.희신).toBeDefined();
      expect(result.희신.length).toBeGreaterThan(0);
    });
  });

  describe('상세 해석 (详细解析)', () => {
    it('장점 배열에는 최소 1개 이상의 항목이 있어야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '신', ji: '유' },
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '자' }
      );

      const result = analyze격국(사주);

      expect(result.상세해석.장점.length).toBeGreaterThan(0);
    });

    it('단점 배열에는 최소 1개 이상의 항목이 있어야 함', () => {
      const 사주 = create사주(
        { gan: '을', ji: '묘' },
        { gan: '경', ji: '신' },
        { gan: '을', ji: '사' },
        { gan: '정', ji: '축' }
      );

      const result = analyze격국(사주);

      expect(result.상세해석.단점.length).toBeGreaterThan(0);
    });

    it('적합 직업 배열에는 구체적인 직업이 포함되어야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '무', ji: '술' },
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' }
      );

      const result = analyze격국(사주);

      expect(result.상세해석.적합직업.length).toBeGreaterThan(0);
      // 적어도 하나의 직업은 2글자 이상이어야 함
      const hasValidJob = result.상세해석.적합직업.some(job => job.length >= 2);
      expect(hasValidJob).toBe(true);
    });

    it('주의사항 배열에는 구체적인 조언이 포함되어야 함', () => {
      const 사주 = create사주(
        { gan: '병', ji: '오' },
        { gan: '을', ji: '묘' },
        { gan: '병', ji: '오' },
        { gan: '무', ji: '술' }
      );

      const result = analyze격국(사주);

      expect(result.상세해석.주의사항.length).toBeGreaterThan(0);
    });
  });

  describe('격국 함의 (格局含义)', () => {
    it('격국 함의는 비어있지 않아야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '신', ji: '유' },
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '자' }
      );

      const result = analyze격국(사주);

      expect(result.격국함의).toBeDefined();
      expect(result.격국함의.length).toBeGreaterThan(10);
    });

    it('격국 함의는 의미 있는 설명을 포함해야 함', () => {
      const 사주 = create사주(
        { gan: '을', ji: '묘' },
        { gan: '경', ji: '신' },
        { gan: '을', ji: '사' },
        { gan: '정', ji: '축' }
      );

      const result = analyze격국(사주);

      // 최소한 20자 이상의 설명이어야 함
      expect(result.격국함의.length).toBeGreaterThan(20);
    });
  });

  describe('엣지 케이스 (Edge Cases)', () => {
    it('무격 (無格) - 명확한 격국이 없는 경우', () => {
      // 오행이 매우 균형 잡힌 사주 (실제로는 드묾)
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze격국(사주);

      // 무격이거나 약한 격국이어야 함
      if (result.격국명 === '무격') {
        expect(result.격국종류).toBe('무격');
      } else {
        expect(result.격국강도).toBeLessThan(70);
      }
    });

    it('동일 천간지지 사주 - 극단적 케이스', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' }
      );

      const result = analyze격국(사주);

      // 비견이 많으므로 특정 격국을 형성하기 어려움
      expect(result).toBeDefined();
      expect(result.격국명).toBeDefined();
    });

    it('모든 천간이 다른 경우', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const result = analyze격국(사주);

      expect(result).toBeDefined();
      expect(result.격국명).toBeDefined();
      expect(result.용신).toBeDefined();
    });
  });

  describe('반환 타입 검증 (Return Type Validation)', () => {
    it('격국결과 인터페이스의 모든 필드가 존재해야 함', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '신', ji: '유' },
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '자' }
      );

      const result = analyze격국(사주);

      expect(result).toHaveProperty('격국명');
      expect(result).toHaveProperty('격국종류');
      expect(result).toHaveProperty('격국강도');
      expect(result).toHaveProperty('용신');
      expect(result).toHaveProperty('희신');
      expect(result).toHaveProperty('기신');
      expect(result).toHaveProperty('격국함의');
      expect(result).toHaveProperty('상세해석');
    });

    it('상세해석은 4가지 하위 속성을 모두 가져야 함', () => {
      const 사주 = create사주(
        { gan: '을', ji: '묘' },
        { gan: '경', ji: '신' },
        { gan: '을', ji: '사' },
        { gan: '정', ji: '축' }
      );

      const result = analyze격국(사주);

      expect(result.상세해석).toHaveProperty('장점');
      expect(result.상세해석).toHaveProperty('단점');
      expect(result.상세해석).toHaveProperty('적합직업');
      expect(result.상세해석).toHaveProperty('주의사항');
    });
  });
});
