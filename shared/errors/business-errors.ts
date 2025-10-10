/**
 * 비즈니스 로직 에러 클래스들
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
 * 비즈니스 에러 베이스
 */
export class BusinessError extends AppError {
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

/**
 * 잘못된 생년월일 에러
 */
export class InvalidBirthDateError extends BusinessError {
  constructor(birthDate: string) {
    super(
      'E1001',
      '생년월일이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.',
      `Invalid birth date format: ${birthDate}`,
      { birthDate, expectedFormat: 'YYYY-MM-DD' }
    );
  }
}

/**
 * 날짜 범위 초과 에러
 */
export class DateRangeError extends BusinessError {
  constructor(year: number, minYear: number = 1900, maxYear: number = 2100) {
    super(
      'E1002',
      `생년은 ${minYear}년부터 ${maxYear}년까지만 지원됩니다.`,
      `Date out of range: ${year} (allowed: ${minYear}-${maxYear})`,
      { year, minYear, maxYear }
    );
  }
}

/**
 * 음력 변환 실패 에러
 */
export class LunarConversionError extends BusinessError {
  constructor(date: string) {
    super(
      'E1003',
      '음력 변환이 불가능한 날짜입니다. (1900-2100년만 지원)',
      `Lunar conversion failed for: ${date}`,
      { date }
    );
  }
}

/**
 * 절기 데이터 없음 에러
 */
export class SolarTermDataMissingError extends BusinessError {
  constructor(year: number) {
    super(
      'E2001',
      `${year}년의 절기 데이터가 없습니다. 1988-2030년만 정밀 계산이 가능합니다.`,
      `Solar term data missing for year: ${year}`,
      { year, availableRange: '1988-2030' }
    );
  }
}

/**
 * 격국 분석 실패 에러
 */
export class GeokgukAnalysisError extends BusinessError {
  constructor(reason: string, sajuData: any) {
    super(
      'E2002',
      '격국 분석을 완료할 수 없습니다. 사주 데이터를 확인해주세요.',
      `Geokguk analysis failed: ${reason}`,
      { reason, sajuData }
    );
  }
}

/**
 * 대운 계산 실패 에러
 */
export class DaeunCalculationError extends BusinessError {
  constructor(reason: string, birthDate: Date) {
    super(
      'E2003',
      '대운 계산을 완료할 수 없습니다. 생년월일을 확인해주세요.',
      `Daeun calculation failed: ${reason}`,
      { reason, birthDate: birthDate.toISOString() }
    );
  }
}

