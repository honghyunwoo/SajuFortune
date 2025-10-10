/**
 * 인증/인가 에러 클래스들
 * AppError 직접 정의 (순환 참조 방지)
 */

/**
 * 기본 애플리케이션 에러 (로컬 복사)
 */
abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  abstract readonly userMessage: string;
  abstract readonly isOperational: boolean;

  readonly timestamp: Date;
  readonly technicalDetails?: Record<string, any>;

  constructor(message: string, technicalDetails?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.technicalDetails = technicalDetails;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 인증 에러 베이스 클래스
 */
export class AuthError extends AppError {
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

/**
 * 인증되지 않은 요청
 */
export class UnauthorizedError extends AuthError {
  constructor(message = '인증이 필요합니다.') {
    super('E3001', 401, message, message);
  }
}

/**
 * 권한 없음
 */
export class ForbiddenError extends AuthError {
  constructor(message = '접근 권한이 없습니다.') {
    super('E3002', 403, message, message);
  }
}

/**
 * 세션 만료
 */
export class SessionExpiredError extends AuthError {
  constructor() {
    super('E3003', 401, '세션이 만료되었습니다.', '세션이 만료되었습니다. 다시 로그인해주세요.');
  }
}

/**
 * CSRF 토큰 불일치
 */
export class CsrfTokenMismatchError extends AuthError {
  constructor() {
    super('E3004', 403, 'CSRF token mismatch', 'CSRF 토큰이 일치하지 않습니다.');
  }
}

/**
 * 잘못된 API 키
 */
export class InvalidApiKeyError extends AuthError {
  constructor() {
    super('E3005', 401, 'Invalid API key', 'API 키가 유효하지 않습니다.');
  }
}
