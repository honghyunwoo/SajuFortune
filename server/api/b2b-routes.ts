/**
 * B2B API 라우트
 * 파트너사를 위한 사주 분석 API 제공
 */

import type { Express, Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../api-keys';
import { calculatePremiumSaju } from '@shared/premium-calculator';
import { calculateCompatibility } from '@shared/compatibility-calculator';
import { calculateMonthlyFortune } from '@shared/monthly-fortune-calculator';
import { createSeoulDate } from '@shared/timezone-utils';
import { log } from '../logger';
import type { HeavenlyStem, EarthlyBranch } from '@shared/compatibility-calculator';

/**
 * API 키 인증 미들웨어
 */
function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'API key is required. Include X-API-Key header.',
    });
  }

  const validation = apiKeyService.validateApiKey(apiKey);
  if (!validation.valid) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: validation.error,
    });
  }

  // Rate limiting check
  const rateLimit = apiKeyService.checkRateLimit(apiKey);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'API rate limit exceeded',
      limit: rateLimit.limit,
      remaining: 0,
      resetAt: rateLimit.resetAt.toISOString(),
    });
  }

  // Rate limit 헤더 추가
  res.setHeader('X-RateLimit-Limit', rateLimit.limit.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimit.resetAt.toISOString());

  // Request에 API 키 정보 첨부
  (req as any).apiKey = validation.apiKey;

  // 사용량 증가
  apiKeyService.incrementUsage(apiKey);

  next();
}

/**
 * B2B API 라우트 등록
 */
export function registerB2BRoutes(app: Express) {
  const API_PREFIX = '/api/v1/b2b';

  // ===========================================
  // 1. 사주 분석 API
  // ===========================================

  /**
   * POST /api/v1/b2b/saju
   * 사주팔자 분석
   */
  app.post(`${API_PREFIX}/saju`, authenticateApiKey, async (req, res) => {
    try {
      const { birthYear, birthMonth, birthDay, birthHour, birthMinute = 0, gender } = req.body;

      // 입력 검증
      if (!birthYear || !birthMonth || !birthDay || birthHour === undefined || !gender) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: 'Required fields: birthYear, birthMonth, birthDay, birthHour, gender',
        });
      }

      // 사주 계산 (Asia/Seoul 타임존 기준)
      const birthDate = createSeoulDate(birthYear, birthMonth, birthDay, birthHour, birthMinute);
      const sajuData = calculatePremiumSaju(birthDate, birthHour, {
        gender: gender as 'male' | 'female',
        precision: 'premium',
      });

      log.info(`[B2B API] Saju calculation for ${birthYear}-${birthMonth}-${birthDay}`);

      res.json({
        success: true,
        data: {
          birthInfo: {
            year: birthYear,
            month: birthMonth,
            day: birthDay,
            hour: birthHour,
            minute: birthMinute,
            gender,
          },
          saju: sajuData.saju,
          geokguk: sajuData.geokguk,
          daeun: sajuData.daeun,
          sibiunseong: sajuData.sibiunseong,
          elements: sajuData.elements,
        },
      });
    } catch (error: any) {
      log.error('[B2B API] Saju calculation error:', error);
      res.status(500).json({
        error: 'CALCULATION_ERROR',
        message: '사주 계산 중 오류가 발생했습니다.',
      });
    }
  });

  // ===========================================
  // 2. 궁합 분석 API
  // ===========================================

  /**
   * POST /api/v1/b2b/compatibility
   * 두 사람의 사주 궁합 분석
   */
  app.post(`${API_PREFIX}/compatibility`, authenticateApiKey, async (req, res) => {
    try {
      const { person1, person2 } = req.body;

      // 입력 검증
      if (!person1 || !person2) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: 'Required fields: person1, person2 (each with birth info)',
        });
      }

      // Person 1 사주 계산 (Asia/Seoul 타임존 기준)
      const person1BirthDate = createSeoulDate(
        person1.birthYear,
        person1.birthMonth,
        person1.birthDay,
        person1.birthHour,
        person1.birthMinute || 0
      );
      const person1SajuData = calculatePremiumSaju(person1BirthDate, person1.birthHour, {
        gender: person1.gender,
        precision: 'premium',
      });

      // Person 2 사주 계산 (Asia/Seoul 타임존 기준)
      const person2BirthDate = createSeoulDate(
        person2.birthYear,
        person2.birthMonth,
        person2.birthDay,
        person2.birthHour,
        person2.birthMinute || 0
      );
      const person2SajuData = calculatePremiumSaju(person2BirthDate, person2.birthHour, {
        gender: person2.gender,
        precision: 'premium',
      });

      // 사주 데이터를 궁합 계산 형식으로 변환
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

      log.info('[B2B API] Compatibility calculation complete');

      res.json({
        success: true,
        data: {
          person1: { saju: person1Saju },
          person2: { saju: person2Saju },
          compatibility: compatibilityResult,
        },
      });
    } catch (error: any) {
      log.error('[B2B API] Compatibility calculation error:', error);
      res.status(500).json({
        error: 'CALCULATION_ERROR',
        message: '궁합 계산 중 오류가 발생했습니다.',
      });
    }
  });

  // ===========================================
  // 3. 월별 운세 API
  // ===========================================

  /**
   * POST /api/v1/b2b/monthly-fortune
   * 12개월 운세 분석
   */
  app.post(`${API_PREFIX}/monthly-fortune`, authenticateApiKey, async (req, res) => {
    try {
      const { birthYear, birthMonth, birthDay, birthHour, birthMinute = 0, gender } = req.body;

      // 입력 검증
      if (!birthYear || !birthMonth || !birthDay || birthHour === undefined || !gender) {
        return res.status(400).json({
          error: 'INVALID_INPUT',
          message: 'Required fields: birthYear, birthMonth, birthDay, birthHour, gender',
        });
      }

      // 사주 계산 (Asia/Seoul 타임존 기준)
      const birthDate = createSeoulDate(birthYear, birthMonth, birthDay, birthHour, birthMinute);
      const sajuData = calculatePremiumSaju(birthDate, birthHour, {
        gender: gender as 'male' | 'female',
        precision: 'premium',
      });

      // 사주 데이터를 월별 운세 계산 형식으로 변환
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
        { year: birthYear, month: birthMonth, day: birthDay, hour: birthHour, gender },
        sajuPillars
      );

      log.info('[B2B API] Monthly fortune calculation complete');

      res.json({
        success: true,
        data: {
          birthInfo: {
            year: birthYear,
            month: birthMonth,
            day: birthDay,
            hour: birthHour,
            minute: birthMinute,
            gender,
          },
          saju: sajuPillars,
          monthlyFortune: monthlyFortuneResult,
        },
      });
    } catch (error: any) {
      log.error('[B2B API] Monthly fortune calculation error:', error);
      res.status(500).json({
        error: 'CALCULATION_ERROR',
        message: '월별 운세 계산 중 오류가 발생했습니다.',
      });
    }
  });

  // ===========================================
  // 4. API 상태 확인
  // ===========================================

  /**
   * GET /api/v1/b2b/status
   * API 상태 및 사용량 확인
   */
  app.get(`${API_PREFIX}/status`, authenticateApiKey, (req, res) => {
    const apiKey = req.headers['x-api-key'] as string;
    const usage = apiKeyService.getUsageStats(apiKey);
    const apiKeyInfo = apiKeyService.getApiKeyInfo(apiKey);

    res.json({
      success: true,
      data: {
        tier: usage.tier,
        usage: {
          daily: {
            used: usage.daily,
            limit: apiKeyInfo?.dailyLimit || 0,
            remaining: Math.max(0, (apiKeyInfo?.dailyLimit || 0) - usage.daily),
          },
          monthly: {
            used: usage.monthly,
            limit: apiKeyInfo?.monthlyLimit || 0,
            remaining: Math.max(0, (apiKeyInfo?.monthlyLimit || 0) - usage.monthly),
          },
        },
        apiKey: {
          name: apiKeyInfo?.name,
          createdAt: apiKeyInfo?.createdAt,
          expiresAt: apiKeyInfo?.expiresAt,
        },
      },
    });
  });

  log.info('[B2B API] Routes registered at /api/v1/b2b');
}
