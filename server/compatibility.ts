/**
 * 궁합 분석 API 라우트
 */

import type { Express } from 'express';
import { calculateCompatibility } from '../shared/compatibility-calculator';
import type { HeavenlyStem, EarthlyBranch } from '../shared/compatibility-calculator';

interface PersonInput {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  isLeapMonth: boolean;
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

      // 각 사람의 사주 계산 (임시로 하드코딩 - 추후 lunar-calculator 통합 필요)
      const person1Saju = {
        year: { heavenlyStem: '갑' as HeavenlyStem, earthlyBranch: '자' as EarthlyBranch },
        month: { heavenlyStem: '병' as HeavenlyStem, earthlyBranch: '인' as EarthlyBranch },
        day: { heavenlyStem: '무' as HeavenlyStem, earthlyBranch: '진' as EarthlyBranch },
        hour: { heavenlyStem: '경' as HeavenlyStem, earthlyBranch: '오' as EarthlyBranch },
      };

      const person2Saju = {
        year: { heavenlyStem: '을' as HeavenlyStem, earthlyBranch: '축' as EarthlyBranch },
        month: { heavenlyStem: '정' as HeavenlyStem, earthlyBranch: '묘' as EarthlyBranch },
        day: { heavenlyStem: '기' as HeavenlyStem, earthlyBranch: '사' as EarthlyBranch },
        hour: { heavenlyStem: '신' as HeavenlyStem, earthlyBranch: '미' as EarthlyBranch },
      };

      // 궁합 계산
      const compatibilityResult = calculateCompatibility(person1Saju, person2Saju);

      res.json(compatibilityResult);
    } catch (error) {
      console.error('[Compatibility] API error:', error);
      res.status(500).json({
        error: 'CALCULATION_ERROR',
        message: '궁합 계산 중 오류가 발생했습니다.',
      });
    }
  });
}
