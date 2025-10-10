/**
 * 에러 코드 상수 및 메시지 매핑
 */

export const ERROR_CODES = {
  // E1xxx: 입력 검증 에러
  E1001: 'INVALID_BIRTH_DATE',
  E1002: 'DATE_OUT_OF_RANGE',
  E1003: 'LUNAR_CONVERSION_FAILED',
  E1004: 'VALIDATION_FAILED',

  // E2xxx: 비즈니스 로직 에러
  E2001: 'SOLAR_TERM_DATA_MISSING',
  E2002: 'GEOKGUK_ANALYSIS_FAILED',
  E2003: 'DAEUN_CALCULATION_FAILED',

  // E3xxx: 인증/인가 에러
  E3001: 'UNAUTHORIZED',
  E3002: 'FORBIDDEN',
  E3003: 'SESSION_EXPIRED',
  E3004: 'CSRF_TOKEN_MISMATCH',
  E3005: 'INVALID_API_KEY',

  // E4xxx: 시스템 에러
  E4001: 'DATABASE_ERROR',
  E4002: 'CACHE_ERROR',
  E4003: 'CONFIGURATION_ERROR',

  // E5xxx: Rate Limiting
  E5001: 'RATE_LIMIT_EXCEEDED',
  E5002: 'TOO_MANY_SAJU_REQUESTS',

  // E6xxx: 결제 에러
  E6001: 'PAYMENT_PROCESSING_FAILED',
  E6002: 'STRIPE_WEBHOOK_VERIFICATION_FAILED',

  // E7xxx: 데이터 무결성 에러
  E7001: 'FILE_PROCESSING_ERROR',
  E7002: 'DATA_INTEGRITY_VIOLATION',

  // E8xxx: 외부 서비스 에러
  E8001: 'EXTERNAL_API_ERROR',
  E8002: 'EMAIL_SERVICE_ERROR',

  // E9xxx: 알 수 없는 에러
  E9000: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

/**
 * 에러 코드별 사용자 메시지 (한국어)
 */
export const ERROR_USER_MESSAGES: Record<ErrorCode, string> = {
  E1001: '생년월일이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.',
  E1002: '지원하지 않는 연도입니다. 1900-2100년 범위에서 입력해주세요.',
  E1003: '음력 변환이 불가능한 날짜입니다. (1900-2100년만 지원)',
  E1004: '입력 정보를 확인해주세요.',

  E2001: '해당 연도의 절기 데이터가 없습니다. 1988-2030년만 정밀 계산이 가능합니다.',
  E2002: '격국 분석을 완료할 수 없습니다. 사주 데이터를 확인해주세요.',
  E2003: '대운 계산을 완료할 수 없습니다. 생년월일을 확인해주세요.',

  E3001: '로그인이 필요합니다.',
  E3002: '접근 권한이 없습니다.',
  E3003: '세션이 만료되었습니다. 다시 로그인해주세요.',
  E3004: '요청이 거부되었습니다. 페이지를 새로고침해주세요.',
  E3005: 'API 키가 올바르지 않습니다.',

  E4001: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  E4002: '데이터를 불러오는 중 오류가 발생했습니다.',
  E4003: '서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.',

  E5001: 'API 호출 한도를 초과했습니다. 15분 후 다시 시도해주세요.',
  E5002: '사주 분석 요청이 너무 많습니다. 1분 후 다시 시도해주세요.',

  E6001: '결제 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요.',
  E6002: '결제 검증에 실패했습니다.',

  E7001: '파일 처리 중 오류가 발생했습니다.',
  E7002: '데이터 무결성 오류가 발생했습니다.',

  E8001: '외부 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
  E8002: '이메일 발송에 실패했습니다.',

  E9000: '예상하지 못한 오류가 발생했습니다. 관리자에게 문의해주세요.',
};

/**
 * 에러 코드로 사용자 메시지 조회
 */
export function getUserMessage(code: ErrorCode): string {
  return ERROR_USER_MESSAGES[code] || ERROR_USER_MESSAGES.E9000;
}

/**
 * HTTP 상태 코드로 기본 메시지 반환
 */
export function getDefaultMessageByStatus(statusCode: number): string {
  switch (statusCode) {
    case 400: return '요청이 올바르지 않습니다.';
    case 401: return '로그인이 필요합니다.';
    case 403: return '접근 권한이 없습니다.';
    case 404: return '요청한 정보를 찾을 수 없습니다.';
    case 422: return '입력 정보를 확인해주세요.';
    case 429: return 'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
    case 500: return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    case 503: return '서비스가 일시적으로 사용 불가능합니다.';
    default: return '알 수 없는 오류가 발생했습니다.';
  }
}

