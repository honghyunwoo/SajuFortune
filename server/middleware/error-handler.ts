/**
 * 중앙화된 에러 핸들러
 * PRD 에러 코드 E1001~E5002 준수
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { BusinessError, SystemError, AuthError } from '@shared/errors';
import { log } from '../logger';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    userMessage: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * PRD 준수 에러 응답 생성
 */
function createErrorResponse(
  code: string,
  message: string,
  userMessage: string,
  details?: any
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      userMessage,
      ...(details && { details })
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * 통합 에러 핸들러
 */
export function handleApiError(error: any, req: Request, res: Response, next: NextFunction) {
  // 이미 응답이 전송되었으면 다음 핸들러로
  if (res.headersSent) {
    return next(error);
  }

  // Zod 검증 에러 (E1000번대: 입력 검증)
  if (error instanceof ZodError) {
    log.warn('Validation Error', {
      path: req.path,
      errors: error.errors
    });

    return res.status(400).json(
      createErrorResponse(
        'E1004',
        'Validation failed',
        '입력값이 올바르지 않습니다.',
        error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      )
    );
  }

  // 비즈니스 로직 에러 (E2000번대)
  if (error instanceof BusinessError) {
    log.warn('Business Error', {
      path: req.path,
      code: error.code,
      message: error.message
    });

    return res.status(422).json(
      createErrorResponse(
        error.code,
        error.message,
        error.userMessage || error.message
      )
    );
  }

  // 인증/인가 에러 (E3000번대)
  if (error instanceof AuthError) {
    log.warn('Auth Error', {
      path: req.path,
      code: error.code,
      message: error.message
    });

    const statusCode = error.code === 'E3001' ? 401 : 403;
    return res.status(statusCode).json(
      createErrorResponse(
        error.code,
        error.message,
        error.userMessage || error.message
      )
    );
  }

  // 시스템 에러 (E4000번대)
  if (error instanceof SystemError) {
    log.error('System Error', error, {
      path: req.path,
      code: error.code
    });

    return res.status(500).json(
      createErrorResponse(
        error.code,
        'Internal server error',
        '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      )
    );
  }

  // Rate Limit 에러 (E5000번대)
  if (error.status === 429 || error.message?.includes('Too many requests')) {
    log.warn('Rate Limit Exceeded', {
      path: req.path,
      ip: req.ip
    });

    return res.status(429).json(
      createErrorResponse(
        'E5001',
        'Rate limit exceeded',
        'API 호출 한도를 초과했습니다. 15분 후에 다시 시도해주세요.',
        { retryAfter: 900 }
      )
    );
  }

  // 알 수 없는 에러 (기본 처리)
  log.error('Unhandled Error', error, {
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  return res.status(500).json(
    createErrorResponse(
      'E4001',
      'Internal server error',
      '서버 오류가 발생했습니다.'
    )
  );
}

/**
 * Not Found 핸들러 (404)
 */
export function notFoundHandler(req: Request, res: Response) {
  log.warn('404 Not Found', {
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json(
    createErrorResponse(
      'E4004',
      'Not found',
      '요청한 리소스를 찾을 수 없습니다.'
    )
  );
}

/**
 * 에러를 던지는 헬퍼 함수들
 */
export const throwError = {
  invalidInput: (field: string, message: string) => {
    throw new BusinessError('E1001', message, `Invalid ${field}`);
  },

  notFound: (resource: string) => {
    throw new BusinessError('E2004', `${resource}를 찾을 수 없습니다.`, `${resource} not found`);
  },

  unauthorized: () => {
    throw new AuthError('E3001', 401, '인증이 필요합니다.', 'Unauthorized');
  },

  forbidden: () => {
    throw new AuthError('E3002', 403, '접근 권한이 없습니다.', 'Forbidden');
  },

  databaseError: (message: string) => {
    throw new SystemError('E4001', '데이터베이스 오류가 발생했습니다.', message, false);
  },

  cacheError: (message: string) => {
    throw new SystemError('E4002', '캐시 오류가 발생했습니다.', message, true);
  }
};

