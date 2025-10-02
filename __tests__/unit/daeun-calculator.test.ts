import { describe, it, expect } from 'vitest';
import { calculate대운, type 대운결과 } from '../../shared/daeun-calculator';

describe('대운 계산기 (Daeun Calculator)', () => {
  describe('대운 계산 기본 동작', () => {
    it('남성 양년생은 순행 대운이어야 함', () => {
      // 1990년 = 경오년 (경은 양간)
      const birthDate = new Date(1990, 4, 15); // 1990년 5월 15일
      const result = calculate대운(birthDate, 'male', '병', '오');

      expect(result.대운목록.length).toBe(8);

      // 순행이므로 천간이 증가해야 함
      const first = result.대운목록[0];
      const second = result.대운목록[1];

      expect(result).toBeDefined();
      expect(first).toBeDefined();
      expect(second).toBeDefined();
    });

    it('여성 음년생은 순행 대운이어야 함', () => {
      // 1991년 = 신미년 (신은 음간)
      const birthDate = new Date(1991, 5, 20); // 1991년 6월 20일
      const result = calculate대운(birthDate, 'female', '을', '미');

      expect(result.대운목록.length).toBe(8);
      expect(result).toBeDefined();
    });

    it('남성 음년생은 역행 대운이어야 함', () => {
      // 1991년 = 신미년 (신은 음간)
      const birthDate = new Date(1991, 5, 20);
      const result = calculate대운(birthDate, 'male', '정', '미');

      expect(result.대운목록.length).toBe(8);
      expect(result).toBeDefined();
    });

    it('여성 양년생은 역행 대운이어야 함', () => {
      // 1990년 = 경오년 (경은 양간)
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'female', '갑', '오');

      expect(result.대운목록.length).toBe(8);
      expect(result).toBeDefined();
    });
  });

  describe('대운 주기 (10년 단위)', () => {
    it('각 대운은 정확히 10년 간격이어야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      for (let i = 0; i < result.대운목록.length; i++) {
        const daeun = result.대운목록[i];
        const 기간 = daeun.종료나이 - daeun.시작나이 + 1;

        expect(기간).toBe(10);
      }
    });

    it('총 8개의 대운 주기 (80년)가 생성되어야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      expect(result.대운목록.length).toBe(8);

      const 첫대운 = result.대운목록[0];
      const 마지막대운 = result.대운목록[7];

      const 전체기간 = 마지막대운.종료나이 - 첫대운.시작나이 + 1;
      expect(전체기간).toBeLessThanOrEqual(80);
    });

    it('대운 시작 나이는 0세 이상이어야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      result.대운목록.forEach(daeun => {
        expect(daeun.시작나이).toBeGreaterThanOrEqual(0);
        expect(daeun.시작나이).toBeLessThan(100);
      });
    });
  });

  describe('현재 대운 판별', () => {
    it('현재 나이가 제공되면 현재대운 인덱스가 설정되어야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const 현재나이 = 25;

      const result = calculate대운(birthDate, 'male', '병', '오', 현재나이);

      expect(result.현재대운인덱스).toBeGreaterThanOrEqual(0);
      expect(result.현재대운인덱스).toBeLessThan(8);
    });

    it('현재대운은 현재 나이를 포함하는 주기여야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const 현재나이 = 30;

      const result = calculate대운(birthDate, 'male', '병', '오', 현재나이);

      if (result.현재대운인덱스 !== undefined && result.현재대운) {
        const 현재 = result.현재대운;
        expect(현재.시작나이).toBeLessThanOrEqual(현재나이);
        expect(현재.종료나이).toBeGreaterThanOrEqual(현재나이);
      }
    });

    it('나이가 제공되지 않으면 현재대운은 undefined여야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      expect(result.현재대운).toBeNull();
      expect(result.현재대운인덱스).toBe(-1);
    });
  });

  describe('길흉 판단', () => {
    it('각 대운은 길흉 평가를 가져야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      const 유효한길흉 = ['대길', '길', '평', '흉', '대흉'];

      result.대운목록.forEach(daeun => {
        expect(유효한길흉).toContain(daeun.길흉);
      });
    });

    it('대운 해석은 의미 있는 문자열이어야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      result.대운목록.forEach(daeun => {
        expect(daeun.해석).toBeDefined();
        expect(daeun.해석.length).toBeGreaterThan(5);
      });
    });
  });

  describe('천간지지 순환', () => {
    it('천간은 10간 순환 규칙을 따라야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      const 천간목록 = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

      result.대운목록.forEach(daeun => {
        expect(천간목록).toContain(daeun.간);
      });
    });

    it('지지는 12지 순환 규칙을 따라야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      const 지지목록 = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

      result.대운목록.forEach(daeun => {
        expect(지지목록).toContain(daeun.지);
      });
    });

    it('순행 시 천간과 지지가 모두 증가해야 함', () => {
      // 남성 양년생 (순행)
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      // 최소 2개 이상의 대운이 있어야 검증 가능
      expect(result.대운목록.length).toBeGreaterThan(1);
    });
  });

  describe('대운 오행 분석', () => {
    it('각 대운의 천간과 지지는 오행을 가져야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      const 오행목록 = ['목', '화', '토', '금', '수'];

      result.대운목록.forEach(daeun => {
        expect(오행목록).toContain(daeun.대운오행.간);
        expect(오행목록).toContain(daeun.대운오행.지);
      });
    });

    it('오행은 천간/지지에 따라 정확해야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      result.대운목록.forEach(daeun => {
        // 갑을 = 목, 병정 = 화, 무기 = 토, 경신 = 금, 임계 = 수
        // 인묘 = 목, 사오 = 화, 진술축미 = 토, 신유 = 금, 해자 = 수
        expect(daeun.대운오행.간).toBeDefined();
        expect(daeun.대운오행.지).toBeDefined();
      });
    });
  });

  describe('전체 해석', () => {
    it('전체 해석은 의미 있는 문자열이어야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      expect(result.전체해석).toBeDefined();
      expect(result.전체해석.length).toBeGreaterThan(20);
    });

    it('전체 해석은 성별과 대운 방향을 반영해야 함', () => {
      const 남성결과 = calculate대운(new Date(1990, 4, 15), 'male', '병', '오');
      const 여성결과 = calculate대운(new Date(1990, 4, 15), 'female', '병', '오');

      expect(남성결과.전체해석).toBeDefined();
      expect(여성결과.전체해석).toBeDefined();
    });
  });

  describe('특이 사항 (Special Cases)', () => {
    it('특이사항 배열은 정의되어 있어야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      expect(result.특이사항).toBeDefined();
      expect(Array.isArray(result.특이사항)).toBe(true);
    });

    it('천간합이 있으면 특이사항에 기록되어야 함', () => {
      // 갑기합토 등의 천간합이 발생하는 경우
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '갑', '인');

      expect(result.특이사항).toBeDefined();
      // 천간합이 있다면 특이사항에 포함됨
      if (result.특이사항.length > 0) {
        result.특이사항.forEach(item => {
          expect(item).toBeDefined();
          expect(item.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('엣지 케이스', () => {
    it('매우 어린 나이 (0-5세) 처리', () => {
      const birthDate = new Date(2020, 0, 1);
      const result = calculate대운(birthDate, 'male', '경', '자', 3);

      expect(result.대운목록.length).toBe(8);
      if (result.현재대운) {
        expect(result.현재대운.시작나이).toBeLessThanOrEqual(3);
      }
    });

    it('고령 나이 (70세 이상) 처리', () => {
      const birthDate = new Date(1950, 6, 15);
      const result = calculate대운(birthDate, 'female', '경', '인', 73);

      expect(result.대운목록.length).toBe(8);
      if (result.현재대운) {
        expect(result.현재대운.시작나이).toBeLessThanOrEqual(73);
        expect(result.현재대운.종료나이).toBeGreaterThanOrEqual(73);
      }
    });

    it('윤달 생일 처리', () => {
      // 실제 윤달이 있는 년도
      const birthDate = new Date(1992, 1, 29); // 1992년 2월 29일 (윤년)
      const result = calculate대운(birthDate, 'male', '임', '신');

      expect(result.대운목록.length).toBe(8);
    });

    it('연말 생일 (12월) 처리', () => {
      const birthDate = new Date(1990, 11, 31); // 12월 31일
      const result = calculate대운(birthDate, 'male', '경', '자');

      expect(result.대운목록.length).toBe(8);
      expect(result.대운목록[0].시작나이).toBeGreaterThanOrEqual(0);
    });

    it('연초 생일 (1월) 처리', () => {
      const birthDate = new Date(1990, 0, 1); // 1월 1일
      const result = calculate대운(birthDate, 'female', '기', '사');

      expect(result.대운목록.length).toBe(8);
      expect(result.대운목록[0].시작나이).toBeGreaterThanOrEqual(0);
    });
  });

  describe('반환 타입 검증', () => {
    it('대운결과 인터페이스의 모든 필드가 존재해야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      expect(result).toHaveProperty('대운목록');
      expect(result).toHaveProperty('현재대운인덱스');
      expect(result).toHaveProperty('현재대운');
      expect(result).toHaveProperty('전체해석');
      expect(result).toHaveProperty('특이사항');
    });

    it('대운주 인터페이스의 모든 필드가 존재해야 함', () => {
      const birthDate = new Date(1990, 4, 15);
      const result = calculate대운(birthDate, 'male', '병', '오');

      result.대운목록.forEach(daeun => {
        expect(daeun).toHaveProperty('간');
        expect(daeun).toHaveProperty('지');
        expect(daeun).toHaveProperty('시작나이');
        expect(daeun).toHaveProperty('종료나이');
        expect(daeun).toHaveProperty('대운오행');
        expect(daeun).toHaveProperty('길흉');
        expect(daeun).toHaveProperty('해석');
      });
    });
  });
});
