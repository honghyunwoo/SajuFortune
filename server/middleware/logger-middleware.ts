/**
 * HTTP 요청/응답 로깅 미들웨어
 * PRD 9.6: 모든 API 요청 로깅
 */

import { Request, Response, NextFunction } from 'express';
import { log } from '../logger';

/**
 * 요청/응답 로깅 미들웨어
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // 요청 로그
  log.request(req, {
    body: req.method === 'POST' || req.method === 'PUT' ? sanitizeBody(req.body) : undefined
  });

  // 응답 완료 시 로그
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    log.response(req, res, duration);
  });

  next();
};

/**
 * 민감 정보 제거 (비밀번호, 카드 정보 등)
 */
function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'cardNumber', 'cvv', 'ssn', 'pin'];

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  }

  return sanitized;
}

/**
 * 에러 로깅 미들웨어
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  log.error('Unhandled Error', err, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  next(err);
};

