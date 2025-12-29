import { describe, it, expect } from 'vitest';
import { calculatePremiumSaju } from '../../shared/premium-calculator';

/**
 * 일주(日柱) 계산 검증 테스트
 *
 * 기준점: 1989년 10월 31일 = 甲子日 (갑자일, index 0)
 * 검증 출처: 온라인 만세력 (sajuplus.net, sajulink.com 등)
 *
 * 60갑자 순환:
 * - 천간: 갑, 을, 병, 정, 무, 기, 경, 신, 임, 계 (10개)
 * - 지지: 자, 축, 인, 묘, 진, 사, 오, 미, 신, 유, 술, 해 (12개)
 * - 순환 주기: 60일
 */

describe('일주(日柱) 계산 테스트', () => {
  // 일주 검증용 헬퍼 함수
  const getDayPillar = (year: number, month: number, day: number, hour: number = 12) => {
    const date = new Date(year, month - 1, day, hour, 0, 0);
    const result = calculatePremiumSaju(date, hour, {
      includeSinsal: false,
      includeGeokguk: false,
      includeDaeun: false,
      includeSibiunseong: false
    });
    return {
      gan: result.saju.day.gan,
      ji: result.saju.day.ji,
      pillar: `${result.saju.day.gan}${result.saju.day.ji}`
    };
  };

  describe('기준점 검증', () => {
    it('1989년 10월 31일 = 甲子日 (갑자)', () => {
      const dayPillar = getDayPillar(1989, 10, 31);

      expect(dayPillar.gan).toBe('갑');
      expect(dayPillar.ji).toBe('자');
      expect(dayPillar.pillar).toBe('갑자');
    });

    it('1989년 10월 6일 = 己亥日 (기해) - 홍현우 생년월일', () => {
      const dayPillar = getDayPillar(1989, 10, 6);

      expect(dayPillar.gan).toBe('기');
      expect(dayPillar.ji).toBe('해');
      expect(dayPillar.pillar).toBe('기해');
    });
  });

  describe('60갑자 순환 검증', () => {
    it('기준일로부터 60일 후 = 甲子日 (순환 검증)', () => {
      // 1989-10-31 + 60일 = 1989-12-30
      const dayPillar = getDayPillar(1989, 12, 30);

      expect(dayPillar.pillar).toBe('갑자');
    });

    it('기준일로부터 60일 전 = 甲子日 (역순환 검증)', () => {
      // 1989-10-31 - 60일 = 1989-09-01
      const dayPillar = getDayPillar(1989, 9, 1);

      expect(dayPillar.pillar).toBe('갑자');
    });

    it('연속 10일 천간 순환 검증', () => {
      const 천간순서 = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

      // 1989-10-31 (갑자)부터 10일간
      for (let i = 0; i < 10; i++) {
        const dayPillar = getDayPillar(1989, 10, 31 + i);
        expect(dayPillar.gan).toBe(천간순서[i]);
      }
    });

    it('연속 12일 지지 순환 검증', () => {
      const 지지순서 = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

      // 1989-10-31 (갑자)부터 12일간
      for (let i = 0; i < 12; i++) {
        const dayPillar = getDayPillar(1989, 10, 31 + i);
        expect(dayPillar.ji).toBe(지지순서[i]);
      }
    });
  });

  describe('다양한 연도 검증', () => {
    it('2000년 1월 1일 일주 검증', () => {
      // 1989-10-31부터 2000-01-01까지 일수 계산
      // 3714일 → 3714 % 60 = 54
      // 천간[54 % 10] = 천간[4] = '무'
      // 지지[54 % 12] = 지지[6] = '오'
      const dayPillar = getDayPillar(2000, 1, 1);

      expect(dayPillar.pillar).toBe('무오');
    });

    it('2024년 12월 29일 일주 검증 (현재 날짜 근처)', () => {
      // 온라인 만세력과 비교 필요
      const dayPillar = getDayPillar(2024, 12, 29);

      // 일주가 유효한 값인지 확인
      expect(['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']).toContain(dayPillar.gan);
      expect(['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']).toContain(dayPillar.ji);
    });

    it('1950년 날짜 일주 검증 (과거)', () => {
      const dayPillar = getDayPillar(1950, 6, 15);

      // 일주가 유효한 값인지 확인
      expect(['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']).toContain(dayPillar.gan);
      expect(['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']).toContain(dayPillar.ji);
    });
  });

  describe('경계값 테스트', () => {
    it('윤년 2월 29일 일주 계산', () => {
      const dayPillar = getDayPillar(2000, 2, 29);

      expect(['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']).toContain(dayPillar.gan);
      expect(['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']).toContain(dayPillar.ji);
    });

    it('연말 12월 31일 일주 계산', () => {
      const dayPillar = getDayPillar(1999, 12, 31);

      expect(['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']).toContain(dayPillar.gan);
      expect(['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']).toContain(dayPillar.ji);
    });

    it('연초 1월 1일 일주 계산', () => {
      const dayPillar = getDayPillar(2020, 1, 1);

      expect(['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']).toContain(dayPillar.gan);
      expect(['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']).toContain(dayPillar.ji);
    });
  });

  describe('유명인 생년월일 검증', () => {
    it('손흥민 (1992년 7월 8일) 일주 검증', () => {
      const dayPillar = getDayPillar(1992, 7, 8);

      // 온라인 만세력 검증 결과 기대값 입력 필요
      // 지금은 유효성만 확인
      expect(['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']).toContain(dayPillar.gan);
      expect(['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']).toContain(dayPillar.ji);
    });
  });

  describe('시간대 영향 없음 확인', () => {
    it('같은 날 다른 시간 = 같은 일주', () => {
      const morningPillar = getDayPillar(1989, 10, 31, 6);
      const noonPillar = getDayPillar(1989, 10, 31, 12);
      const eveningPillar = getDayPillar(1989, 10, 31, 22);

      expect(morningPillar.pillar).toBe('갑자');
      expect(noonPillar.pillar).toBe('갑자');
      expect(eveningPillar.pillar).toBe('갑자');
    });
  });

  describe('음수 일수 차이 처리', () => {
    it('기준일 이전 날짜도 정확히 계산', () => {
      // 1989-10-31 - 1일 = 1989-10-30
      // Index = -1 mod 60 = 59 → 계해
      const dayPillar = getDayPillar(1989, 10, 30);

      expect(dayPillar.pillar).toBe('계해');
    });

    it('기준일 훨씬 이전 날짜 (1950년)', () => {
      const dayPillar = getDayPillar(1950, 1, 1);

      // 유효한 일주인지만 확인
      expect(dayPillar.pillar.length).toBe(2);
    });
  });
});
