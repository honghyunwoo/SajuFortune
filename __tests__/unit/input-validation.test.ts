import { describe, it, expect } from 'vitest';
import { createFortuneReadingSchema } from '../../shared/schema';

/**
 * 입력값 유효성 검증 테스트
 * 잘못된 입력값에 대한 시스템 견고성 검증
 */

describe('입력값 유효성 검증 테스트', () => {
  describe('생년월일 유효성 검증', () => {
    describe('연도 검증', () => {
      it('유효한 연도 (1900-현재)', () => {
        const currentYear = new Date().getFullYear();
        const validInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(validInput);
        expect(result.success).toBe(true);
      });

      it('1900년 미만 연도 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1899,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('미래 연도 거부', () => {
        const futureYear = new Date().getFullYear() + 1;
        const invalidInput = {
          gender: 'male' as const,
          birthYear: futureYear,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('연도 0 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 0,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('음수 연도 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: -1990,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });
    });

    describe('월 검증', () => {
      it('유효한 월 (1-12)', () => {
        for (let month = 1; month <= 12; month++) {
          const validInput = {
            gender: 'male' as const,
            birthYear: 1990,
            birthMonth: month,
            birthDay: 15,
            birthHour: 10,
            birthMinute: 30,
            calendarType: 'solar' as const,
          };

          const result = createFortuneReadingSchema.safeParse(validInput);
          expect(result.success).toBe(true);
        }
      });

      it('월 0 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 0,
          birthDay: 15,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('월 13 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 13,
          birthDay: 15,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('음수 월 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: -1,
          birthDay: 15,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });
    });

    describe('일 검증', () => {
      it('유효한 일 (1-31)', () => {
        for (let day = 1; day <= 31; day++) {
          const validInput = {
            gender: 'male' as const,
            birthYear: 1990,
            birthMonth: 1, // 1월은 31일까지
            birthDay: day,
            birthHour: 10,
            birthMinute: 30,
            calendarType: 'solar' as const,
          };

          const result = createFortuneReadingSchema.safeParse(validInput);
          expect(result.success).toBe(true);
        }
      });

      it('일 0 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 6,
          birthDay: 0,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('일 32 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 6,
          birthDay: 32,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('음수 일 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 6,
          birthDay: -15,
          birthHour: 10,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });
    });

    describe('시간 검증', () => {
      it('유효한 시간 (0-23)', () => {
        for (let hour = 0; hour <= 23; hour++) {
          const validInput = {
            gender: 'male' as const,
            birthYear: 1990,
            birthMonth: 6,
            birthDay: 15,
            birthHour: hour,
            birthMinute: 30,
            calendarType: 'solar' as const,
          };

          const result = createFortuneReadingSchema.safeParse(validInput);
          expect(result.success).toBe(true);
        }
      });

      it('시간 -1 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 6,
          birthDay: 15,
          birthHour: -1,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('시간 24 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 24,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('시간 25 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 25,
          birthMinute: 30,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });
    });

    describe('분 검증', () => {
      it('유효한 분 (0-59)', () => {
        const testMinutes = [0, 15, 30, 45, 59];
        testMinutes.forEach(minute => {
          const validInput = {
            gender: 'male' as const,
            birthYear: 1990,
            birthMonth: 6,
            birthDay: 15,
            birthHour: 10,
            birthMinute: minute,
            calendarType: 'solar' as const,
          };

          const result = createFortuneReadingSchema.safeParse(validInput);
          expect(result.success).toBe(true);
        });
      });

      it('분 -1 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 10,
          birthMinute: -1,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });

      it('분 60 거부', () => {
        const invalidInput = {
          gender: 'male' as const,
          birthYear: 1990,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 10,
          birthMinute: 60,
          calendarType: 'solar' as const,
        };

        const result = createFortuneReadingSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('성별 검증', () => {
    it('male 허용', () => {
      const validInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('female 허용', () => {
      const validInput = {
        gender: 'female' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('잘못된 성별 거부', () => {
      const invalidInput = {
        gender: 'other' as any,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('빈 문자열 거부', () => {
      const invalidInput = {
        gender: '' as any,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('null 거부', () => {
      const invalidInput = {
        gender: null as any,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('undefined 거부', () => {
      const invalidInput = {
        gender: undefined as any,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('달력 타입 검증', () => {
    it('solar 허용', () => {
      const validInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('lunar 허용', () => {
      const validInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'lunar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('잘못된 달력 타입 거부', () => {
      const invalidInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'gregorian' as any,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('서비스 타입 검증', () => {
    it('free 허용 (기본값)', () => {
      const validInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.serviceType).toBe('free');
      }
    });

    it('premium 허용', () => {
      const validInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
        serviceType: 'premium' as const,
      };

      const result = createFortuneReadingSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('잘못된 서비스 타입 거부', () => {
      const invalidInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
        serviceType: 'enterprise' as any,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('결제 상태 검증', () => {
    it('isPaid true 허용', () => {
      const validInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
        isPaid: true,
      };

      const result = createFortuneReadingSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('isPaid false 허용 (기본값)', () => {
      const validInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPaid).toBe(false);
      }
    });

    it('문자열 "true" 거부', () => {
      const invalidInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
        isPaid: 'true' as any,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('필수 필드 누락 검증', () => {
    it('gender 누락 거부', () => {
      const invalidInput = {
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('birthYear 누락 거부', () => {
      const invalidInput = {
        gender: 'male' as const,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('calendarType 누락 거부', () => {
      const invalidInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('모든 필드 누락 거부', () => {
      const invalidInput = {};

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('타입 불일치 검증', () => {
    it('birthYear 문자열 거부', () => {
      const invalidInput = {
        gender: 'male' as const,
        birthYear: '1990' as any,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('birthMonth 문자열 거부', () => {
      const invalidInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: '6' as any,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('birthHour 소수점 거부', () => {
      const invalidInput = {
        gender: 'male' as const,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10.5 as any,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('배열 입력 거부', () => {
      const invalidInput = {
        gender: ['male'] as any,
        birthYear: [1990] as any,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('객체 입력 거부', () => {
      const invalidInput = {
        gender: { value: 'male' } as any,
        birthYear: 1990,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('극단적 입력 조합', () => {
    it('모든 값이 최소값', () => {
      const edgeInput = {
        gender: 'male' as const,
        birthYear: 1900,
        birthMonth: 1,
        birthDay: 1,
        birthHour: 0,
        birthMinute: 0,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(edgeInput);
      expect(result.success).toBe(true);
    });

    it('모든 값이 최대값', () => {
      const currentYear = new Date().getFullYear();
      const edgeInput = {
        gender: 'female' as const,
        birthYear: currentYear,
        birthMonth: 12,
        birthDay: 31,
        birthHour: 23,
        birthMinute: 59,
        calendarType: 'lunar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(edgeInput);
      expect(result.success).toBe(true);
    });

    it('경계값 혼합 - 유효', () => {
      const edgeInput = {
        gender: 'male' as const,
        birthYear: 1900,
        birthMonth: 12,
        birthDay: 31,
        birthHour: 0,
        birthMinute: 59,
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(edgeInput);
      expect(result.success).toBe(true);
    });

    it('경계값 초과 혼합', () => {
      const invalidInput = {
        gender: 'male' as const,
        birthYear: 1899, // 범위 밖
        birthMonth: 13, // 범위 밖
        birthDay: 32, // 범위 밖
        birthHour: 24, // 범위 밖
        birthMinute: 60, // 범위 밖
        calendarType: 'solar' as const,
      };

      const result = createFortuneReadingSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
