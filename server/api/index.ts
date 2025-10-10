/**
 * B2B API 엔드포인트
 * RESTful API for external developers
 */

import type { Express, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
// import { db } from '../../db';
// import { apiKeys, apiUsageLogs, apiUsageDaily } from '../../db/schema/api-keys';
// import { eq, and, sql } from 'drizzle-orm';

// 임시: DB 통합 전까지 메모리 저장소 사용
const API_KEYS_STORE = new Map<string, {
  userId: string;
  email: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  dailyLimit: number;
  monthlyLimit: number;
  isActive: boolean;
  usageToday: number;
  usageThisMonth: number;
}>();

// 티어별 제한
const TIER_LIMITS = {
  free: { daily: 100, monthly: 3000, price: 0 },
  basic: { daily: 1000, monthly: 30000, price: 50000 },
  pro: { daily: 10000, monthly: 300000, price: 300000 },
  enterprise: { daily: 100000, monthly: 3000000, price: 0 }, // 별도 협의
};

/**
 * API 키 검증 미들웨어
 */
function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: {
        code: 'MISSING_API_KEY',
        message: 'API key is required. Include it in the X-API-Key header.',
      },
    });
  }

  // TODO: DB에서 API 키 조회
  const keyData = API_KEYS_STORE.get(apiKey);

  if (!keyData) {
    return res.status(401).json({
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key.',
      },
    });
  }

  if (!keyData.isActive) {
    return res.status(403).json({
      error: {
        code: 'INACTIVE_API_KEY',
        message: 'API key has been deactivated.',
      },
    });
  }

  // Rate limiting 체크
  if (keyData.usageToday >= keyData.dailyLimit) {
    return res.status(429).json({
      error: {
        code: 'DAILY_RATE_LIMIT_EXCEEDED',
        message: `Daily rate limit exceeded. Limit: ${keyData.dailyLimit} requests/day.`,
        limit: keyData.dailyLimit,
        usage: keyData.usageToday,
      },
    });
  }

  if (keyData.usageThisMonth >= keyData.monthlyLimit) {
    return res.status(429).json({
      error: {
        code: 'MONTHLY_RATE_LIMIT_EXCEEDED',
        message: `Monthly rate limit exceeded. Limit: ${keyData.monthlyLimit} requests/month.`,
        limit: keyData.monthlyLimit,
        usage: keyData.usageThisMonth,
      },
    });
  }

  // 사용량 증가
  keyData.usageToday++;
  keyData.usageThisMonth++;

  // 요청 객체에 키 정보 추가
  (req as any).apiKey = apiKey;
  (req as any).apiKeyData = keyData;

  next();
}

/**
 * API 요청 로깅 미들웨어
 */
function logApiRequest(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const apiKey = (req as any).apiKey;

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // TODO: DB에 로그 저장
    console.log(`[API] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms) - Key: ${apiKey?.slice(0, 10)}...`);
  });

  next();
}

/**
 * API 라우트 등록
 */
export function registerApiRoutes(app: Express) {
  // API 키 검증 미들웨어 (모든 /api/v1/* 경로에 적용)
  app.use('/api/v1', validateApiKey);
  app.use('/api/v1', logApiRequest);

  // ============================================================
  // GET /api/v1/saju - 사주 계산
  // ============================================================
  app.post('/api/v1/saju', async (req, res) => {
    try {
      const { birthDate, birthTime, gender, solarLunar } = req.body;

      // 입력값 검증
      if (!birthDate || !birthTime || !gender) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required fields: birthDate, birthTime, gender.',
          },
        });
      }

      // TODO: 실제 사주 계산 로직 연동
      const result = {
        input: {
          birthDate,
          birthTime,
          gender,
          solarLunar: solarLunar || 'solar',
        },
        pillars: {
          year: { heavenlyStem: '갑', earthlyBranch: '자' },
          month: { heavenlyStem: '병', earthlyBranch: '인' },
          day: { heavenlyStem: '무', earthlyBranch: '진' },
          hour: { heavenlyStem: '경', earthlyBranch: '오' },
        },
        analysis: {
          overallScore: 75,
          geokguk: '정관격',
          daeun: [],
          sibiunseong: '건록',
        },
      };

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('[API] Saju calculation error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error.',
        },
      });
    }
  });

  // ============================================================
  // POST /api/v1/compatibility - 궁합 분석
  // ============================================================
  app.post('/api/v1/compatibility', async (req, res) => {
    try {
      const { person1, person2 } = req.body;

      if (!person1 || !person2) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required fields: person1, person2.',
          },
        });
      }

      // TODO: 실제 궁합 분석 로직 연동
      const result = {
        person1,
        person2,
        compatibilityScore: 85,
        analysis: {
          strengths: ['천간합이 있어 서로 보완적입니다.'],
          weaknesses: ['지지충이 있어 갈등 가능성이 있습니다.'],
          advice: ['소통을 통해 차이를 이해하세요.'],
        },
      };

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('[API] Compatibility error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error.',
        },
      });
    }
  });

  // ============================================================
  // POST /api/v1/monthly-fortune - 월별 운세
  // ============================================================
  app.post('/api/v1/monthly-fortune', async (req, res) => {
    try {
      const { birthDate, birthTime, gender, startYear, startMonth } = req.body;

      if (!birthDate || !birthTime || !gender) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required fields: birthDate, birthTime, gender.',
          },
        });
      }

      // TODO: 실제 월별 운세 로직 연동
      const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        overallScore: Math.floor(Math.random() * 40) + 60,
        loveScore: Math.floor(Math.random() * 40) + 60,
        wealthScore: Math.floor(Math.random() * 40) + 60,
        healthScore: Math.floor(Math.random() * 40) + 60,
        careerScore: Math.floor(Math.random() * 40) + 60,
      }));

      res.json({
        success: true,
        data: {
          months,
          currentMonthIndex: (new Date().getMonth()),
        },
      });
    } catch (error: any) {
      console.error('[API] Monthly fortune error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error.',
        },
      });
    }
  });

  // ============================================================
  // GET /api/v1/usage - 사용량 조회
  // ============================================================
  app.get('/api/v1/usage', async (req, res) => {
    try {
      const apiKeyData = (req as any).apiKeyData;

      res.json({
        success: true,
        data: {
          tier: apiKeyData.tier,
          limits: {
            daily: apiKeyData.dailyLimit,
            monthly: apiKeyData.monthlyLimit,
          },
          usage: {
            today: apiKeyData.usageToday,
            thisMonth: apiKeyData.usageThisMonth,
          },
          remaining: {
            today: apiKeyData.dailyLimit - apiKeyData.usageToday,
            thisMonth: apiKeyData.monthlyLimit - apiKeyData.usageThisMonth,
          },
        },
      });
    } catch (error: any) {
      console.error('[API] Usage error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error.',
        },
      });
    }
  });

  // ============================================================
  // GET /api/v1/health - Health Check
  // ============================================================
  app.get('/api/v1/health', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  });
}

/**
 * 테스트용 API 키 생성 (개발 환경)
 */
export function initializeTestApiKeys() {
  // Free tier test key
  API_KEYS_STORE.set('sk_test_free_1234567890abcdef', {
    userId: 'test-user-1',
    email: 'test@example.com',
    tier: 'free',
    dailyLimit: TIER_LIMITS.free.daily,
    monthlyLimit: TIER_LIMITS.free.monthly,
    isActive: true,
    usageToday: 0,
    usageThisMonth: 0,
  });

  // Basic tier test key
  API_KEYS_STORE.set('sk_test_basic_abcdef1234567890', {
    userId: 'test-user-2',
    email: 'basic@example.com',
    tier: 'basic',
    dailyLimit: TIER_LIMITS.basic.daily,
    monthlyLimit: TIER_LIMITS.basic.monthly,
    isActive: true,
    usageToday: 0,
    usageThisMonth: 0,
  });

  console.log('[API] Test API keys initialized');
  console.log('  - Free:  sk_test_free_1234567890abcdef');
  console.log('  - Basic: sk_test_basic_abcdef1234567890');
}
