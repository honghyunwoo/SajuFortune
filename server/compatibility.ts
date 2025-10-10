/**
 * 궁합 분석 API 라우트
 * 실제 사주 계산 통합
 */

import type { Express } from 'express';
import { calculateCompatibility } from '../shared/compatibility-calculator';
import type { HeavenlyStem, EarthlyBranch } from '../shared/compatibility-calculator';
import { calculatePremiumSaju } from '@shared/premium-calculator';
import { createSeoulDate } from '@shared/timezone-utils';
import { log } from './logger';

interface PersonInput {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  calendarType: 'solar' | 'lunar';
  isLeapMonth?: boolean;
}

/**
 * 궁합 분석 라우트 등록
 */
export function registerCompatibilityRoutes(app: Express) {
  // 궁합 계산
  app.post('/api/compatibility', async (req, res) => {
    try {
      const { person1, person2 } = req.body as {
        person1: PersonInput;
        person2: PersonInput;
      };

      // 입력 검증
      if (!person1 || !person2) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: '두 사람의 정보를 모두 입력해주세요.',
        });
      }

      if (!person1.name || !person2.name) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: '이름을 입력해주세요.',
        });
      }

      // 각 사람의 사주 계산 (Asia/Seoul 타임존 기준)
      const person1BirthDate = createSeoulDate(
        person1.birthYear,
        person1.birthMonth,
        person1.birthDay,
        person1.birthHour,
        person1.birthMinute
      );

      const person2BirthDate = createSeoulDate(
        person2.birthYear,
        person2.birthMonth,
        person2.birthDay,
        person2.birthHour,
        person2.birthMinute
      );

      // Premium 사주 계산
      const person1SajuData = calculatePremiumSaju(person1BirthDate, person1.birthHour, {
        gender: person1.gender,
        precision: 'premium',
      });

      const person2SajuData = calculatePremiumSaju(person2BirthDate, person2.birthHour, {
        gender: person2.gender,
        precision: 'premium',
      });

      // 사주 데이터를 궁합 계산용 형식으로 변환
      const person1Saju = {
        year: {
          heavenlyStem: person1SajuData.saju.year.gan as HeavenlyStem,
          earthlyBranch: person1SajuData.saju.year.ji as EarthlyBranch,
        },
        month: {
          heavenlyStem: person1SajuData.saju.month.gan as HeavenlyStem,
          earthlyBranch: person1SajuData.saju.month.ji as EarthlyBranch,
        },
        day: {
          heavenlyStem: person1SajuData.saju.day.gan as HeavenlyStem,
          earthlyBranch: person1SajuData.saju.day.ji as EarthlyBranch,
        },
        hour: {
          heavenlyStem: person1SajuData.saju.hour.gan as HeavenlyStem,
          earthlyBranch: person1SajuData.saju.hour.ji as EarthlyBranch,
        },
      };

      const person2Saju = {
        year: {
          heavenlyStem: person2SajuData.saju.year.gan as HeavenlyStem,
          earthlyBranch: person2SajuData.saju.year.ji as EarthlyBranch,
        },
        month: {
          heavenlyStem: person2SajuData.saju.month.gan as HeavenlyStem,
          earthlyBranch: person2SajuData.saju.month.ji as EarthlyBranch,
        },
        day: {
          heavenlyStem: person2SajuData.saju.day.gan as HeavenlyStem,
          earthlyBranch: person2SajuData.saju.day.ji as EarthlyBranch,
        },
        hour: {
          heavenlyStem: person2SajuData.saju.hour.gan as HeavenlyStem,
          earthlyBranch: person2SajuData.saju.hour.ji as EarthlyBranch,
        },
      };

      // 궁합 계산
      const compatibilityResult = calculateCompatibility(person1Saju, person2Saju);

      log.info(`[Compatibility] Calculated for ${person1.name} & ${person2.name}: ${compatibilityResult.overallScore}`);

      // 응답에 사주 정보도 포함
      res.json({
        ...compatibilityResult,
        person1: {
          name: person1.name,
          saju: person1Saju,
        },
        person2: {
          name: person2.name,
          saju: person2Saju,
        },
      });
    } catch (error: any) {
      log.error('[Compatibility] API error:', error);
      res.status(500).json({
        error: 'CALCULATION_ERROR',
        message: '궁합 계산 중 오류가 발생했습니다.',
      });
    }
  });
}
