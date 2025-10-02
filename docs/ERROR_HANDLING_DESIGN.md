# 에러 처리 설계 (Error Handling Design)

## 프로젝트: SajuFortune
**작성일**: 2025-10-03
**작성자**: Claude (Senior Developer)

---

## 📋 목차
1. [개요](#개요)
2. [에러 분류 체계](#에러-분류-체계)
3. [에러 클래스 계층](#에러-클래스-계층)
4. [에러 코드 체계](#에러-코드-체계)
5. [에러 처리 플로우](#에러-처리-플로우)
6. [로깅 전략](#로깅-전략)
7. [구현 가이드](#구현-가이드)

---

## 개요

### 목표
- **일관된 에러 처리**: 모든 레이어에서 통일된 에러 처리
- **사용자 친화적**: 기술적 디테일 숨기고 명확한 메시지 제공
- **디버깅 용이성**: 충분한 컨텍스트 정보 제공
- **복구 가능성**: 재시도 가능한 에러 구분

### 설계 원칙
1. **명확한 에러 분류**: 비즈니스 에러 vs 시스템 에러
2. **사용자 메시지 분리**: 기술 메시지 vs 사용자 친화 메시지
3. **구조화된 로깅**: 검색 및 분석 가능한 로그
4. **자동 복구**: 재시도 가능한 에러 자동 처리

---

## 에러 분류 체계

### 1. 비즈니스 에러 (Business Errors)
비즈니스 로직 검증 실패로 발생하는 에러

**특징**:
- 사용자 입력 문제로 발생
- HTTP 4xx 상태 코드
- 재시도해도 실패 (입력 수정 필요)
- 사용자에게 명확한 메시지 제공

**예시**:
- 잘못된 생년월일 형식
- 허용되지 않는 성별 값
- 필수 필드 누락
- 유효하지 않은 날짜 범위

---

### 2. 시스템 에러 (System Errors)
시스템 레벨의 문제로 발생하는 에러

**특징**:
- 시스템 리소스 또는 외부 의존성 문제
- HTTP 5xx 상태 코드
- 재시도 시 성공 가능
- 개발팀 알림 필요

**예시**:
- 데이터베이스 연결 실패
- Redis 캐시 연결 실패
- 외부 API 호출 실패
- Out of Memory

---

### 3. 검증 에러 (Validation Errors)
입력 데이터 검증 실패

**특징**:
- Zod 스키마 검증 실패
- HTTP 422 상태 코드
- 필드별 상세 에러 정보
- 즉시 사용자에게 피드백

**예시**:
- 이메일 형식 오류
- 비밀번호 강도 부족
- 날짜 형식 오류
- 숫자 범위 초과

---

### 4. 인증/인가 에러 (Auth Errors)
보안 관련 에러

**특징**:
- HTTP 401/403 상태 코드
- 보안 로그 기록
- 브루트 포스 공격 탐지
- Rate limiting 트리거

**예시**:
- 세션 만료
- 권한 부족
- CSRF 토큰 불일치
- API 키 무효

---

## 에러 클래스 계층

### 클래스 구조
```typescript
/**
 * 기본 애플리케이션 에러 클래스
 */
abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  abstract readonly userMessage: string;
  abstract readonly isOperational: boolean;

  readonly timestamp: Date;
  readonly technicalDetails?: Record<string, any>;
  readonly stack?: string;

  constructor(message: string, technicalDetails?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.technicalDetails = technicalDetails;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

---

### 1. BusinessError (비즈니스 에러)
```typescript
class BusinessError extends AppError {
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(
    public readonly code: string,
    public readonly userMessage: string,
    message: string,
    technicalDetails?: Record<string, any>
  ) {
    super(message, technicalDetails);
  }
}

// 사용 예시
class InvalidBirthDateError extends BusinessError {
  constructor(birthDate: string) {
    super(
      'E1001',
      '생년월일이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.',
      `Invalid birth date format: ${birthDate}`,
      { birthDate, expectedFormat: 'YYYY-MM-DD' }
    );
  }
}
```

---

### 2. ValidationError (검증 에러)
```typescript
class ValidationError extends AppError {
  readonly statusCode = 422;
  readonly code = 'E1004';
  readonly isOperational = true;

  constructor(
    public readonly userMessage: string,
    public readonly fields: Array<{
      field: string;
      message: string;
      value?: any;
    }>,
    message: string
  ) {
    super(message, { fields });
  }
}

// 사용 예시
throw new ValidationError(
  '입력 정보를 확인해주세요.',
  [
    { field: 'birthDate', message: '필수 항목입니다', value: undefined },
    { field: 'gender', message: '올바른 값이 아닙니다', value: 'unknown' }
  ],
  'Validation failed: birthDate, gender'
);
```

---

### 3. SystemError (시스템 에러)
```typescript
class SystemError extends AppError {
  readonly statusCode = 500;
  readonly isOperational = true;

  constructor(
    public readonly code: string,
    public readonly userMessage: string,
    message: string,
    public readonly retryable: boolean = true,
    technicalDetails?: Record<string, any>
  ) {
    super(message, technicalDetails);
  }
}

// 하위 클래스들
class DatabaseError extends SystemError {
  constructor(operation: string, error: Error) {
    super(
      'E4001',
      '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      `Database operation failed: ${operation}`,
      true,
      { operation, originalError: error.message }
    );
  }
}

class CacheError extends SystemError {
  constructor(operation: string, error: Error) {
    super(
      'E4002',
      '데이터를 불러오는 중 오류가 발생했습니다.',
      `Cache operation failed: ${operation}`,
      true,
      { operation, originalError: error.message }
    );
  }
}
```

---

### 4. AuthError (인증/인가 에러)
```typescript
class AuthError extends AppError {
  readonly isOperational = true;

  constructor(
    public readonly code: string,
    public readonly statusCode: 401 | 403,
    public readonly userMessage: string,
    message: string,
    technicalDetails?: Record<string, any>
  ) {
    super(message, technicalDetails);
  }
}

// 하위 클래스들
class UnauthorizedError extends AuthError {
  constructor(reason: string) {
    super(
      'E3001',
      401,
      '로그인이 필요합니다.',
      `Unauthorized: ${reason}`,
      { reason }
    );
  }
}

class ForbiddenError extends AuthError {
  constructor(resource: string) {
    super(
      'E3002',
      403,
      '접근 권한이 없습니다.',
      `Forbidden access to: ${resource}`,
      { resource }
    );
  }
}
```

---

## 에러 코드 체계

### 구조
```
E + [카테고리] + [시퀀스]
E   1           001
│   │           └── 고유 번호 (001-999)
│   └── 카테고리 (1000단위)
└── Error prefix
```

### 카테고리별 범위

| 범위 | 카테고리 | 설명 |
|------|----------|------|
| E1xxx | 입력 검증 | 사용자 입력 데이터 검증 실패 |
| E2xxx | 비즈니스 로직 | 비즈니스 규칙 위반 |
| E3xxx | 인증/인가 | 보안 및 권한 관련 |
| E4xxx | 시스템 | 시스템 리소스 및 외부 의존성 |
| E5xxx | Rate Limiting | API 호출 한도 관련 |
| E6xxx | 결제 | Stripe 결제 관련 |
| E7xxx | 데이터 | 데이터 무결성 및 상태 |
| E8xxx | 외부 서비스 | 제3자 서비스 연동 |
| E9xxx | 알 수 없는 에러 | 예상하지 못한 에러 |

---

## 에러 처리 플로우

### Frontend 에러 처리
```typescript
// client/src/lib/error-handler.ts

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    userMessage: string;
    details?: any;
  };
  timestamp: string;
}

export function handleApiError(error: any): string {
  // 네트워크 에러
  if (!error.response) {
    return '네트워크 연결을 확인해주세요.';
  }

  const { data } = error.response as { data: ErrorResponse };

  // API 에러 응답
  if (data?.error?.userMessage) {
    return data.error.userMessage;
  }

  // HTTP 상태 코드별 기본 메시지
  switch (error.response.status) {
    case 400:
      return '요청이 올바르지 않습니다.';
    case 401:
      return '로그인이 필요합니다.';
    case 403:
      return '접근 권한이 없습니다.';
    case 404:
      return '요청한 정보를 찾을 수 없습니다.';
    case 429:
      return 'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
}

// React Query 에러 핸들러
export const queryErrorHandler = (error: any) => {
  const message = handleApiError(error);
  toast.error(message);

  // 로그 전송 (프로덕션)
  if (process.env.NODE_ENV === 'production') {
    logErrorToService(error);
  }
};
```

---

### Backend 에러 처리
```typescript
// server/middleware/error-handler.ts

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // AppError 인스턴스 처리
  if (err instanceof AppError) {
    logger.error({
      code: err.code,
      message: err.message,
      userMessage: err.userMessage,
      statusCode: err.statusCode,
      stack: err.stack,
      technicalDetails: err.technicalDetails,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userId: req.session?.userId
    });

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        userMessage: err.userMessage,
        details: process.env.NODE_ENV === 'development'
          ? err.technicalDetails
          : undefined
      },
      timestamp: new Date().toISOString()
    });
  }

  // 예상하지 못한 에러
  logger.error({
    code: 'E9000',
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'E9000',
      message: 'Internal server error',
      userMessage: '예상하지 못한 오류가 발생했습니다. 관리자에게 문의해주세요.'
    },
    timestamp: new Date().toISOString()
  });
};
```

---

### Async 에러 처리 래퍼
```typescript
// server/utils/async-handler.ts

import type { Request, Response, NextFunction } from 'express';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 사용 예시
app.post('/api/fortune/analyze', asyncHandler(async (req, res) => {
  const result = await analyzeSaju(req.body);
  res.json({ success: true, data: result });
}));
```

---

## 로깅 전략

### 로그 레벨
```typescript
enum LogLevel {
  ERROR = 'error',   // 시스템 에러, 예외 상황
  WARN = 'warn',     // 경고, 잠재적 문제
  INFO = 'info',     // 일반 정보
  DEBUG = 'debug'    // 디버깅 정보
}
```

### 구조화된 로그
```typescript
interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  code?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  duration?: number;
  technicalDetails?: Record<string, any>;
  stack?: string;
}
```

### 로거 구현
```typescript
// server/utils/logger.ts

import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // 콘솔 출력
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // 파일 출력 (에러만)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    // 파일 출력 (모든 레벨)
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});
```

---

## 구현 가이드

### 1. 에러 생성 및 던지기
```typescript
// ❌ 나쁜 예
throw new Error('Invalid birth date');

// ✅ 좋은 예
throw new InvalidBirthDateError(birthDate);
```

### 2. 에러 핸들링
```typescript
// ❌ 나쁜 예
try {
  await calculateSaju(birthDate);
} catch (error) {
  console.log(error);
  return null;
}

// ✅ 좋은 예
try {
  await calculateSaju(birthDate);
} catch (error) {
  if (error instanceof InvalidBirthDateError) {
    logger.warn({
      code: error.code,
      message: error.message,
      birthDate
    });
    throw error; // 상위 레이어로 전파
  }

  // 예상하지 못한 에러
  logger.error({
    message: 'Unexpected error in calculateSaju',
    error: error instanceof Error ? error.message : error
  });
  throw new SystemError(
    'E4001',
    '사주 계산 중 오류가 발생했습니다.',
    'Saju calculation failed',
    true,
    { originalError: error }
  );
}
```

### 3. Retry 로직
```typescript
// server/utils/retry.ts

interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  exponentialBackoff?: boolean;
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // SystemError이면서 retryable이 false면 즉시 실패
      if (error instanceof SystemError && !error.retryable) {
        throw error;
      }

      if (attempt < options.maxAttempts) {
        const delay = options.exponentialBackoff
          ? options.delayMs * Math.pow(2, attempt - 1)
          : options.delayMs;

        await new Promise(resolve => setTimeout(resolve, delay));
        logger.warn({
          message: 'Retrying operation',
          attempt,
          maxAttempts: options.maxAttempts,
          delay
        });
      }
    }
  }

  throw lastError!;
}

// 사용 예시
const result = await retryOperation(
  () => database.query('SELECT * FROM users'),
  { maxAttempts: 3, delayMs: 1000, exponentialBackoff: true }
);
```

---

## 모니터링 및 알림

### 알림 트리거
- **즉시 알림**: E4xxx (시스템 에러)
- **일일 요약**: E1xxx, E2xxx (누적 통계)
- **보안 알림**: E3xxx (인증/인가 실패 패턴 탐지)

### 메트릭 수집
```typescript
// 에러 발생 횟수
errorCountMetric.inc({
  code: error.code,
  type: error.constructor.name
});

// 에러 응답 시간
errorDurationMetric.observe({
  code: error.code
}, duration);
```

---

**문서 작성자**: Claude (Senior Developer)
**마지막 업데이트**: 2025-10-03
