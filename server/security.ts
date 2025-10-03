/**
 * 상용화를 위한 보안 미들웨어 모음
 * OWASP Top 10 대응 및 한국 개인정보보호법 준수
 */

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

// Rate Limiting 설정 (IP 기반 강화)
export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    // IP 기반 Rate Limiting (DoS 공격 방어)
    keyGenerator: (req: Request) => {
      // X-Forwarded-For 헤더 또는 실제 IP 사용
      return req.ip || req.socket.remoteAddress || 'unknown';
    },
    // 예측 불가능한 세션 ID로 보완
    skip: (req: Request) => {
      // Health check는 Rate Limiting 제외
      return req.path === '/health' || req.path === '/metrics';
    },
    handler: (req: Request, res: Response) => {
      // Rate Limiting 위반 로깅
      console.warn(`[RATE_LIMIT] IP: ${req.ip}, Path: ${req.path}, Time: ${new Date().toISOString()}`);

      res.status(429).json({
        error: message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// API Rate Limiting
export const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15분
  100, // 최대 100회 요청
  '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.'
);

// 사주 계산 Rate Limiting (더 엄격)
export const sajuCalculationRateLimit = createRateLimit(
  60 * 1000, // 1분
  10, // 최대 10회 계산
  '사주 계산 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
);

// 후원 Rate Limiting
export const donationRateLimit = createRateLimit(
  60 * 60 * 1000, // 1시간
  5, // 최대 5회 후원
  '후원 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
);

// Helmet 보안 헤더 설정
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// CORS 설정
export const corsOptions = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24시간
});

// 입력값 검증 미들웨어
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  // XSS 방지를 위한 HTML 태그 제거
  const sanitizeInput = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.replace(/<[^>]*>/g, '').trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeInput(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitizeInput(req.body);
  req.query = sanitizeInput(req.query);
  req.params = sanitizeInput(req.params);
  
  next();
};

// 개인정보 마스킹 로깅
export const privacySafeLogging = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  
  res.json = function(body: any) {
    // 민감한 정보 마스킹
    if (body && typeof body === 'object') {
      const maskedBody = { ...body };
      
      // 개인정보 필드 마스킹
      const sensitiveFields = ['email', 'phone', 'birthYear', 'birthMonth', 'birthDay'];
      sensitiveFields.forEach(field => {
        if (maskedBody[field]) {
          maskedBody[field] = '***';
        }
      });
      
      // 로깅 (개인정보 제외)
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Response:`, 
        JSON.stringify(maskedBody, null, 2));
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};

// 에러 정보 보안 처리
export const secureErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // 프로덕션에서는 상세 에러 정보 숨김
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    message: isDevelopment ? err.message : '서버 오류가 발생했습니다.',
    ...(isDevelopment && { stack: err.stack })
  };
  
  // 에러 로깅 (민감한 정보 제외)
  console.error(`[ERROR] ${req.method} ${req.path}:`, {
    message: err.message,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  res.status(err.status || 500).json(errorResponse);
};

// 세션 보안 강화
export const sessionSecurity = {
  name: 'saju-session',
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
    httpOnly: true, // XSS 방지
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
    sameSite: 'strict' as const // CSRF 방지
  },
  rolling: true // 활동 시 세션 갱신
};
