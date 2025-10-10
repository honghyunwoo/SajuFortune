/**
 * 월별 운세 API 라우트
 */

import type { Express } from 'express';
import { calculateMonthlyFortune } from '../shared/monthly-fortune-calculator';
import type { HeavenlyStem, EarthlyBranch } from '../shared/compatibility-calculator';

interface BirthInput {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
}

/**
 * 월별 운세 라우트 등록
 */
export function registerMonthlyFortuneRoutes(app: Express) {
  // 월별 운세 계산
  app.post('/api/monthly-fortune', async (req, res) => {
    try {
      const birthData = req.body as BirthInput;

      // 입력 검증
      if (!birthData.name) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: '이름을 입력해주세요.',
        });
      }

      // 사주 계산 (임시 하드코딩 - 추후 lunar-calculator 통합 필요)
      const sajuPillars = {
        year: { heavenlyStem: '갑' as HeavenlyStem, earthlyBranch: '자' as EarthlyBranch },
        month: { heavenlyStem: '병' as HeavenlyStem, earthlyBranch: '인' as EarthlyBranch },
        day: { heavenlyStem: '무' as HeavenlyStem, earthlyBranch: '진' as EarthlyBranch },
        hour: { heavenlyStem: '경' as HeavenlyStem, earthlyBranch: '오' as EarthlyBranch },
      };

      // 월별 운세 계산
      const monthlyFortuneResult = calculateMonthlyFortune(
        {
          year: birthData.birthYear,
          month: birthData.birthMonth,
          day: birthData.birthDay,
          hour: birthData.birthHour,
          gender: birthData.gender,
        },
        sajuPillars
      );

      res.json(monthlyFortuneResult);
    } catch (error) {
      console.error('[MonthlyFortune] API error:', error);
      res.status(500).json({
        error: 'CALCULATION_ERROR',
        message: '월별 운세 계산 중 오류가 발생했습니다.',
      });
    }
  });
}
