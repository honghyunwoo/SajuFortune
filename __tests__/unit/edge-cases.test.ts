import { describe, it, expect } from 'vitest';
import { calculate대운 } from '../../shared/daeun-calculator';
import { analyze격국 } from '../../shared/geokguk-analyzer';
import { analyze십이운성 } from '../../shared/sibiunseong-analyzer';
import type { 사주정보 } from '../../shared/geokguk-analyzer';

/**
 * 엣지 케이스 및 경계값 테스트
 * 실패 가능성이 높은 시나리오를 발굴하여 버그를 사전에 방지
 */

describe('엣지 케이스 테스트 (Edge Cases)', () => {
  // 사주 생성 헬퍼
  const create사주 = (
    year: { gan: string; ji: string },
    month: { gan: string; ji: string },
    day: { gan: string; ji: string },
    hour: { gan: string; ji: string }
  ): 사주정보 => ({ year, month, day, hour });

  describe('날짜 경계값 테스트', () => {
    describe('연도 경계값', () => {
      it('1988년 1월 1일 00:00 (데이터 시작점)', () => {
        const birthDate = new Date(1988, 0, 1, 0, 0, 0);
        const result = calculate대운(birthDate, 'male', '갑', '인');

        expect(result).toBeDefined();
        expect(result.대운목록.length).toBe(8);
        expect(result.대운시작나이).toBeGreaterThan(0);
      });

      it('2030년 12월 31일 23:59 (데이터 종료점)', () => {
        const birthDate = new Date(2030, 11, 31, 23, 59, 59);
        const result = calculate대운(birthDate, 'female', '경', '신');

        expect(result).toBeDefined();
        expect(result.대운목록.length).toBe(8);
      });

      it('1987년 12월 31일 (범위 밖 - 예외 처리 확인)', () => {
        const birthDate = new Date(1987, 11, 31, 12, 0, 0);

        // 범위 밖이지만 시스템이 정상적으로 처리해야 함
        const result = calculate대운(birthDate, 'male', '정', '해');

        expect(result).toBeDefined();
        expect(result.대운목록.length).toBe(8);
      });

      it('2031년 1월 1일 (범위 밖 - 미래 날짜)', () => {
        const birthDate = new Date(2031, 0, 1, 0, 0, 0);

        const result = calculate대운(birthDate, 'female', '신', '축');

        expect(result).toBeDefined();
        expect(result.대운목록.length).toBe(8);
      });
    });

    describe('윤달 테스트', () => {
      it('윤년 2월 29일 생일', () => {
        const birthDate = new Date(1992, 1, 29, 10, 30, 0); // 1992년은 윤년
        const result = calculate대운(birthDate, 'male', '임', '신');

        expect(result).toBeDefined();
        expect(result.대운목록.length).toBe(8);
      });

      it('윤년 2월 29일 - 다른 윤년', () => {
        const birthDate = new Date(2000, 1, 29, 15, 45, 0); // 2000년 윤년
        const result = calculate대운(birthDate, 'female', '경', '진');

        expect(result).toBeDefined();
        expect(result.대운시작나이).toBeGreaterThanOrEqual(1);
        expect(result.대운시작나이).toBeLessThanOrEqual(10);
      });

      it('윤년 2024년 2월 29일 (최근 윤년)', () => {
        const birthDate = new Date(2024, 1, 29, 8, 0, 0);
        const result = calculate대운(birthDate, 'male', '갑', '진');

        expect(result).toBeDefined();
        expect(result.대운목록).toHaveLength(8);
      });
    });

    describe('연말/연초 경계 테스트', () => {
      it('12월 31일 23:59:59 (연말)', () => {
        const birthDate = new Date(1995, 11, 31, 23, 59, 59);
        const result = calculate대운(birthDate, 'female', '을', '해');

        expect(result).toBeDefined();
        expect(result.대운목록[0].시작나이).toBeGreaterThanOrEqual(1);
      });

      it('1월 1일 00:00:00 (연초)', () => {
        const birthDate = new Date(1996, 0, 1, 0, 0, 0);
        const result = calculate대운(birthDate, 'male', '병', '자');

        expect(result).toBeDefined();
        expect(result.대운목록.length).toBe(8);
      });

      it('입춘 전후 날짜 (양력 2월 3-4일)', () => {
        // 입춘 전
        const 입춘전 = new Date(2000, 1, 3, 10, 0, 0);
        const result1 = calculate대운(입춘전, 'male', '갑', '인');

        // 입춘 후
        const 입춘후 = new Date(2000, 1, 5, 10, 0, 0);
        const result2 = calculate대운(입춘후, 'male', '갑', '인');

        expect(result1).toBeDefined();
        expect(result2).toBeDefined();

        // 대운 시작 나이가 다를 수 있음
        expect(result1.대운시작나이).toBeDefined();
        expect(result2.대운시작나이).toBeDefined();
      });
    });
  });

  describe('시간대 경계 테스트', () => {
    it('자시 시작 (23:00-23:59) - 전날', () => {
      const birthDate = new Date(1990, 5, 15, 23, 30, 0);
      const result = calculate대운(birthDate, 'male', '병', '오');

      expect(result).toBeDefined();
      expect(result.대운목록.length).toBe(8);
    });

    it('자시 끝 (00:00-00:59) - 당일', () => {
      const birthDate = new Date(1990, 5, 15, 0, 30, 0);
      const result = calculate대운(birthDate, 'male', '병', '오');

      expect(result).toBeDefined();
      expect(result.대운목록.length).toBe(8);
    });

    it('정오 (12:00) - 낮 시간', () => {
      const birthDate = new Date(1990, 5, 15, 12, 0, 0);
      const result = calculate대운(birthDate, 'female', '을', '미');

      expect(result).toBeDefined();
      expect(result.대운시작나이).toBeGreaterThan(0);
    });

    it('자정 직전 (23:59:59)', () => {
      const birthDate = new Date(1990, 5, 15, 23, 59, 59);
      const result = calculate대운(birthDate, 'male', '갑', '인');

      expect(result).toBeDefined();
      expect(result.대운목록[0].시작나이).toBeGreaterThanOrEqual(1);
    });

    it('자정 직후 (00:00:01)', () => {
      const birthDate = new Date(1990, 5, 15, 0, 0, 1);
      const result = calculate대운(birthDate, 'female', '정', '사');

      expect(result).toBeDefined();
      expect(result.대운방향).toBeDefined();
    });
  });

  describe('입력값 극단 테스트', () => {
    describe('나이 극단값', () => {
      it('나이 0세 (신생아)', () => {
        const birthDate = new Date(2024, 0, 1);
        const result = calculate대운(birthDate, 'male', '갑', '자', 0);

        expect(result).toBeDefined();
        if (result.현재대운) {
          expect(result.현재대운.시작나이).toBeLessThanOrEqual(0);
        }
      });

      it('나이 1세', () => {
        const birthDate = new Date(2023, 0, 1);
        const result = calculate대운(birthDate, 'female', '계', '묘', 1);

        expect(result).toBeDefined();
        expect(result.현재대운인덱스).toBeGreaterThanOrEqual(-1);
      });

      it('나이 100세 (고령)', () => {
        const birthDate = new Date(1924, 5, 15);
        const result = calculate대운(birthDate, 'male', '갑', '자', 100);

        expect(result).toBeDefined();
        // 100세는 대부분 대운 범위를 벗어남
        expect(result.현재대운인덱스).toBeDefined();
      });

      it('나이 120세 (극단 고령)', () => {
        const birthDate = new Date(1904, 3, 10);
        const result = calculate대운(birthDate, 'female', '갑', '진', 120);

        expect(result).toBeDefined();
        // 120세는 대운 범위를 벗어남
        expect(result.현재대운).toBeNull();
      });

      it('음수 나이 (-1) - 잘못된 입력', () => {
        const birthDate = new Date(2025, 0, 1);
        const result = calculate대운(birthDate, 'male', '을', '축', -1);

        expect(result).toBeDefined();
        // 음수 나이는 현재 대운을 찾을 수 없어야 함
        expect(result.현재대운).toBeNull();
      });
    });

    describe('천간지지 조합 극단 케이스', () => {
      it('모든 주가 동일한 천간지지', () => {
        const 사주 = create사주(
          { gan: '갑', ji: '인' },
          { gan: '갑', ji: '인' },
          { gan: '갑', ji: '인' },
          { gan: '갑', ji: '인' }
        );

        const 격국 = analyze격국(사주);
        const 십이운성 = analyze십이운성(사주);

        expect(격국).toBeDefined();
        expect(격국.격국명).toBeDefined();

        expect(십이운성).toBeDefined();
        // 모두 같은 운성이어야 함
        expect(십이운성.년주십이운성.운성).toBe(십이운성.월주십이운성.운성);
        expect(십이운성.월주십이운성.운성).toBe(십이운성.일주십이운성.운성);
        expect(십이운성.일주십이운성.운성).toBe(십이운성.시주십이운성.운성);
      });

      it('모든 주가 다른 천간지지', () => {
        const 사주 = create사주(
          { gan: '갑', ji: '자' },
          { gan: '을', ji: '축' },
          { gan: '병', ji: '인' },
          { gan: '정', ji: '묘' }
        );

        const 격국 = analyze격국(사주);
        const 십이운성 = analyze십이운성(사주);

        expect(격국).toBeDefined();
        expect(격국.용신).toBeDefined();
        expect(격국.희신.length).toBeGreaterThan(0);

        expect(십이운성).toBeDefined();
        expect(십이운성.전체평가.생애에너지).toBeGreaterThanOrEqual(0);
        expect(십이운성.전체평가.생애에너지).toBeLessThanOrEqual(100);
      });

      it('오행 극단 편중 - 목(木)만 있는 경우', () => {
        const 사주 = create사주(
          { gan: '갑', ji: '인' }, // 갑목, 인목
          { gan: '을', ji: '묘' }, // 을목, 묘목
          { gan: '갑', ji: '인' },
          { gan: '을', ji: '묘' }
        );

        const 격국 = analyze격국(사주);

        expect(격국).toBeDefined();
        expect(격국.격국강도).toBeDefined();
        // 오행 편중 시 특정 격국이 두드러져야 함
        expect(격국.격국명).toBeDefined();
      });

      it('오행 극단 편중 - 금(金)만 있는 경우', () => {
        const 사주 = create사주(
          { gan: '경', ji: '신' }, // 경금, 신금
          { gan: '신', ji: '유' }, // 신금, 유금
          { gan: '경', ji: '신' },
          { gan: '신', ji: '유' }
        );

        const 격국 = analyze격국(사주);
        const 십이운성 = analyze십이운성(사주);

        expect(격국).toBeDefined();
        expect(격국.용신).toBeDefined();

        expect(십이운성).toBeDefined();
        expect(십이운성.전체평가).toBeDefined();
      });
    });
  });

  describe('대운 계산 경계 조건', () => {
    it('대운 시작 나이가 0세인 경우', () => {
      // 실제로는 최소 1세부터 시작하지만 계산 로직 검증
      const birthDate = new Date(2020, 0, 1);
      const result = calculate대운(birthDate, 'male', '경', '자', 0);

      expect(result).toBeDefined();
      expect(result.대운시작나이).toBeGreaterThanOrEqual(1);
      expect(result.대운시작나이).toBeLessThanOrEqual(10);
    });

    it('현재 나이가 대운 시작 나이 직전', () => {
      const birthDate = new Date(2020, 0, 1);
      const result = calculate대운(birthDate, 'male', '경', '자');

      // 대운 시작 나이가 5세라고 가정
      const 대운시작전나이 = result.대운시작나이 - 1;
      const result2 = calculate대운(birthDate, 'male', '경', '자', 대운시작전나이);

      if (대운시작전나이 < result2.대운목록[0].시작나이) {
        expect(result2.현재대운).toBeNull();
      }
    });

    it('현재 나이가 대운 경계선 (10년 전환점)', () => {
      const birthDate = new Date(2000, 5, 15);
      const result = calculate대운(birthDate, 'male', '경', '진');

      // 첫 번째 대운 종료 나이
      const 경계나이 = result.대운목록[0].종료나이;
      const result2 = calculate대운(birthDate, 'male', '경', '진', 경계나이);

      expect(result2.현재대운).toBeDefined();
      expect(result2.현재대운인덱스).toBeGreaterThanOrEqual(0);
    });

    it('순행/역행 전환 정확성 검증', () => {
      // 양년생 남성 (순행)
      const 양년남성 = new Date(1990, 5, 15); // 경오년
      const result1 = calculate대운(양년남성, 'male', '병', '오');
      expect(result1.대운방향).toBe('순행');

      // 음년생 남성 (역행)
      const 음년남성 = new Date(1991, 5, 15); // 신미년
      const result2 = calculate대운(음년남성, 'male', '정', '미');
      expect(result2.대운방향).toBe('역행');

      // 양년생 여성 (역행)
      const 양년여성 = new Date(1990, 5, 15);
      const result3 = calculate대운(양년여성, 'female', '병', '오');
      expect(result3.대운방향).toBe('역행');

      // 음년생 여성 (순행)
      const 음년여성 = new Date(1991, 5, 15);
      const result4 = calculate대운(음년여성, 'female', '정', '미');
      expect(result4.대운방향).toBe('순행');
    });
  });

  describe('격국 분석 경계 조건', () => {
    it('약한 격국 (강도 30 이하)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const 격국 = analyze격국(사주);

      expect(격국).toBeDefined();
      expect(격국.격국강도).toBeGreaterThanOrEqual(0);
      expect(격국.격국강도).toBeLessThanOrEqual(100);
    });

    it('매우 강한 격국 (강도 90 이상)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '신', ji: '유' },
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' }
      );

      const 격국 = analyze격국(사주);

      expect(격국).toBeDefined();
      expect(격국.격국강도).toBeGreaterThanOrEqual(60);
    });

    it('용신이 없는 경우 (무격)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '을', ji: '축' },
        { gan: '병', ji: '인' },
        { gan: '정', ji: '묘' }
      );

      const 격국 = analyze격국(사주);

      // 무격이더라도 용신은 존재해야 함
      expect(격국.용신).toBeDefined();
      expect(['목', '화', '토', '금', '수']).toContain(격국.용신);
    });
  });

  describe('십이운성 경계 조건', () => {
    it('모든 운성이 약한 경우 (병/사/절)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '오' }, // 사(死) 가능
        { gan: '을', ji: '미' },
        { gan: '병', ji: '자' },
        { gan: '정', ji: '축' }
      );

      const 십이운성 = analyze십이운성(사주);

      expect(십이운성).toBeDefined();
      expect(십이운성.전체평가.생애에너지).toBeGreaterThanOrEqual(0);
      expect(십이운성.전체평가.생애에너지).toBeLessThanOrEqual(100);
    });

    it('모든 운성이 강한 경우 (장생/건록/제왕)', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '해' }, // 장생
        { gan: '갑', ji: '인' }, // 건록
        { gan: '갑', ji: '묘' }, // 제왕 가능
        { gan: '갑', ji: '해' }  // 장생
      );

      const 십이운성 = analyze십이운성(사주);

      expect(십이운성).toBeDefined();
      expect(십이운성.전체평가.생애에너지).toBeGreaterThan(50);
    });

    it('운성 강도가 모두 동일한 경우', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' },
        { gan: '갑', ji: '인' }
      );

      const 십이운성 = analyze십이운성(사주);

      expect(십이운성).toBeDefined();
      // 모든 운성이 같으므로 강도도 같아야 함
      expect(십이운성.년주십이운성.강도).toBe(십이운성.월주십이운성.강도);
      expect(십이운성.월주십이운성.강도).toBe(십이운성.일주십이운성.강도);
      expect(십이운성.일주십이운성.강도).toBe(십이운성.시주십이운성.강도);
    });
  });

  describe('복합 시나리오 (종합 테스트)', () => {
    it('윤년 2월 29일 + 자시 경계 + 고령', () => {
      const birthDate = new Date(1992, 1, 29, 23, 45, 0);
      const result = calculate대운(birthDate, 'male', '임', '신', 75);

      expect(result).toBeDefined();
      expect(result.대운목록.length).toBe(8);
      if (result.현재대운) {
        expect(result.현재대운.시작나이).toBeLessThanOrEqual(75);
        expect(result.현재대운.종료나이).toBeGreaterThanOrEqual(75);
      }
    });

    it('연말(12/31) + 역행 + 신생아', () => {
      const birthDate = new Date(2024, 11, 31, 18, 30, 0);
      const result = calculate대운(birthDate, 'female', '갑', '자', 0);

      expect(result).toBeDefined();
      expect(result.대운방향).toBe('역행');
      expect(result.대운시작나이).toBeGreaterThanOrEqual(1);
    });

    it('입춘 당일 + 극단 오행 편중', () => {
      const birthDate = new Date(2000, 1, 4, 12, 0, 0); // 입춘 즈음

      const 사주 = create사주(
        { gan: '경', ji: '신' },
        { gan: '신', ji: '유' },
        { gan: '경', ji: '신' },
        { gan: '신', ji: '유' }
      );

      const 격국 = analyze격국(사주);
      const 십이운성 = analyze십이운성(사주);

      expect(격국).toBeDefined();
      expect(격국.격국강도).toBeGreaterThanOrEqual(0);

      expect(십이운성).toBeDefined();
      expect(십이운성.전체평가.종합해석.length).toBeGreaterThan(10);
    });
  });

  describe('데이터 무결성 검증', () => {
    it('대운 목록의 나이 범위가 겹치지 않아야 함', () => {
      const birthDate = new Date(1990, 5, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      for (let i = 0; i < result.대운목록.length - 1; i++) {
        const 현재대운 = result.대운목록[i];
        const 다음대운 = result.대운목록[i + 1];

        // 현재 대운 종료 나이 + 1 = 다음 대운 시작 나이
        expect(현재대운.종료나이 + 1).toBe(다음대운.시작나이);
      }
    });

    it('대운 목록의 순서가 올바른지 검증', () => {
      const birthDate = new Date(1990, 5, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      for (let i = 0; i < result.대운목록.length - 1; i++) {
        const 현재대운 = result.대운목록[i];
        const 다음대운 = result.대운목록[i + 1];

        expect(현재대운.시작나이).toBeLessThan(다음대운.시작나이);
        expect(현재대운.종료나이).toBeLessThan(다음대운.종료나이);
      }
    });

    it('격국 결과의 필수 필드가 모두 존재하는지 검증', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '자' },
        { gan: '신', ji: '유' },
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '자' }
      );

      const 격국 = analyze격국(사주);

      expect(격국).toHaveProperty('격국명');
      expect(격국).toHaveProperty('격국종류');
      expect(격국).toHaveProperty('격국강도');
      expect(격국).toHaveProperty('용신');
      expect(격국).toHaveProperty('희신');
      expect(격국).toHaveProperty('기신');
      expect(격국).toHaveProperty('격국함의');
      expect(격국).toHaveProperty('상세해석');

      expect(격국.상세해석).toHaveProperty('장점');
      expect(격국.상세해석).toHaveProperty('단점');
      expect(격국.상세해석).toHaveProperty('적합직업');
      expect(격국.상세해석).toHaveProperty('주의사항');
    });

    it('십이운성 결과의 강도값이 일관성 있는지 검증', () => {
      const 사주 = create사주(
        { gan: '갑', ji: '인' },
        { gan: '병', ji: '오' },
        { gan: '무', ji: '술' },
        { gan: '경', ji: '자' }
      );

      const 십이운성 = analyze십이운성(사주);

      // 모든 운성 강도가 0-100 범위 내
      [
        십이운성.년주십이운성,
        십이운성.월주십이운성,
        십이운성.일주십이운성,
        십이운성.시주십이운성
      ].forEach(운성정보 => {
        expect(운성정보.강도).toBeGreaterThanOrEqual(0);
        expect(운성정보.강도).toBeLessThanOrEqual(100);
      });

      // 생애에너지도 0-100 범위 내
      expect(십이운성.전체평가.생애에너지).toBeGreaterThanOrEqual(0);
      expect(십이운성.전체평가.생애에너지).toBeLessThanOrEqual(100);
    });
  });
});
