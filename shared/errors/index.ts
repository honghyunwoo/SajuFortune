/**
 * 중앙 집중식 에러 처리 시스템
 * 
 * @module shared/errors
 * @see docs/ERROR_HANDLING_DESIGN.md
 */

/**
 * 기본 애플리케이션 에러 클래스
 */
export abstract class AppError extends Error {
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

  /**
   * JSON 형식으로 에러 정보 반환
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      technicalDetails: process.env.NODE_ENV === 'development' 
        ? this.technicalDetails 
        : undefined
    };
  }
}

/**
 * 검증 에러 (HTTP 422)
 */
export class ValidationError extends AppError {
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

/**
 * 리소스 없음 에러 (HTTP 404)
 */
export class NotFoundError extends AppError {
  readonly code = 'E404';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(
    public readonly userMessage: string,
    message: string,
    public readonly resource?: string
  ) {
    super(message, { resource });
  }
}

/**
 * Rate Limit 에러 (HTTP 429)
 */
export class RateLimitError extends AppError {
  readonly code = 'E5001';
  readonly statusCode = 429;
  readonly isOperational = true;

  constructor(
    public readonly userMessage: string,
    message: string,
    public readonly retryAfter: number = 900
  ) {
    super(message, { retryAfter });
  }
}

// Re-export sub-classes
export { 
  BusinessError,
  InvalidBirthDateError, 
  DateRangeError, 
  LunarConversionError, 
  SolarTermDataMissingError,
  GeokgukAnalysisError,
  DaeunCalculationError
} from './business-errors';

export { 
  SystemError,
  DatabaseError, 
  CacheError, 
  ExternalAPIError, 
  PaymentError, 
  FileProcessingError,
  ConfigurationError,
  EmailError
} from './system-errors';

export { 
  AuthError,
  UnauthorizedError, 
  ForbiddenError, 
  SessionExpiredError, 
  CsrfTokenMismatchError, 
  InvalidApiKeyError 
} from './auth-errors';

