/**
 * 월별 운세 API 라우트
 * 실제 사주 계산 통합
 */

import type { Express } from 'express';
import { calculateMonthlyFortune } from '../shared/monthly-fortune-calculator';
import type { HeavenlyStem, EarthlyBranch } from '../shared/compatibility-calculator';
import { calculatePremiumSaju } from '@shared/premium-calculator';
import { log } from './logger';

interface BirthInput {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
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

      // 사주 계산
      const birthDate = new Date(
        birthData.birthYear,
        birthData.birthMonth - 1,
        birthData.birthDay,
        birthData.birthHour,
        birthData.birthMinute || 0
      );

      // Premium 사주 계산
      const sajuData = calculatePremiumSaju(birthDate, birthData.birthHour, {
        gender: birthData.gender,
        precision: 'premium',
      });

      // 사주 데이터를 월별 운세 계산용 형식으로 변환
      const sajuPillars = {
        year: {
          heavenlyStem: sajuData.saju.year.gan as HeavenlyStem,
          earthlyBranch: sajuData.saju.year.ji as EarthlyBranch,
        },
        month: {
          heavenlyStem: sajuData.saju.month.gan as HeavenlyStem,
          earthlyBranch: sajuData.saju.month.ji as EarthlyBranch,
        },
        day: {
          heavenlyStem: sajuData.saju.day.gan as HeavenlyStem,
          earthlyBranch: sajuData.saju.day.ji as EarthlyBranch,
        },
        hour: {
          heavenlyStem: sajuData.saju.hour.gan as HeavenlyStem,
          earthlyBranch: sajuData.saju.hour.ji as EarthlyBranch,
        },
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

      log.info(`[MonthlyFortune] Calculated for ${birthData.name}`);

      res.json({
        ...monthlyFortuneResult,
        name: birthData.name,
        saju: sajuPillars,
      });
    } catch (error: any) {
      log.error('[MonthlyFortune] API error:', error);
      res.status(500).json({
        error: 'CALCULATION_ERROR',
        message: '월별 운세 계산 중 오류가 발생했습니다.',
      });
    }
  });
}
