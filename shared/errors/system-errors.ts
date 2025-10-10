/**
 * 시스템 레벨 에러 클래스들
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
 * 시스템 에러 베이스 클래스
 */
export class SystemError extends AppError {
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

/**
 * 데이터베이스 에러
 */
export class DatabaseError extends SystemError {
  constructor(message: string, userMessage = '데이터베이스 오류가 발생했습니다.') {
    super('E4001', userMessage, message, false);
  }
}

/**
 * 캐시 에러
 */
export class CacheError extends SystemError {
  constructor(message: string) {
    super('E4002', '캐시 오류가 발생했습니다.', message, true);
  }
}

/**
 * 외부 API 에러
 */
export class ExternalAPIError extends SystemError {
  constructor(service: string, message: string) {
    super('E4003', `외부 서비스(${service}) 오류가 발생했습니다.`, message, true, { service });
  }
}

/**
 * 결제 처리 에러
 */
export class PaymentError extends SystemError {
  constructor(message: string) {
    super('E4004', '결제 처리 중 오류가 발생했습니다.', message, true);
  }
}

/**
 * 파일 처리 에러
 */
export class FileProcessingError extends SystemError {
  constructor(filename: string, message: string) {
    super('E4005', '파일 처리 중 오류가 발생했습니다.', message, true, { filename });
  }
}

/**
 * 환경 변수 설정 에러
 */
export class ConfigurationError extends SystemError {
  constructor(envVar: string) {
    super(
      'E4006',
      '서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.',
      `Missing required environment variable: ${envVar}`,
      false,
      { envVar }
    );
  }
}

/**
 * 이메일 발송 에러
 */
export class EmailError extends SystemError {
  constructor(recipient: string, error: Error) {
    super(
      'E4007',
      '이메일 발송에 실패했습니다.',
      `Email send failed to: ${recipient}`,
      true,
      { recipient, originalError: error.message }
    );
  }
}
