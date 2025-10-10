/**
 * 구조화된 로깅 시스템
 * PRD 9.6: Winston 기반 구조화된 로그
 */

import winston from 'winston';
import path from 'path';

// 로그 포맷 정의
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  winston.format.json()
);

// 개발 환경용 컬러 포맷
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
  })
);

// Transports 설정
const transports: winston.transport[] = [];

// 개발 환경: 콘솔 출력 (컬러)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: devFormat,
      level: 'debug'
    })
  );
}

// 프로덕션 환경: 파일 저장 (JSON)
if (process.env.NODE_ENV === 'production') {
  // 에러 로그 (별도 파일)
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      tailable: true
    })
  );

  // 전체 로그
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: logFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 30,
      tailable: true
    })
  );

  // 콘솔 출력 (간단한 포맷)
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
      level: process.env.LOG_LEVEL || 'info'
    })
  );
}

// Winston logger 생성
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports
});

// 로그 헬퍼 함수
export const log = {
  /**
   * 디버그 로그 (개발 환경에서만)
   */
  debug: (message: string, metadata?: Record<string, any>) => {
    logger.debug(message, metadata);
  },

  /**
   * 정보 로그
   */
  info: (message: string, metadata?: Record<string, any>) => {
    logger.info(message, metadata);
  },

  /**
   * 경고 로그
   */
  warn: (message: string, metadata?: Record<string, any>) => {
    logger.warn(message, metadata);
  },

  /**
   * 에러 로그
   */
  error: (message: string, error?: Error | any, metadata?: Record<string, any>) => {
    logger.error(message, {
      ...metadata,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
  },

  /**
   * HTTP 요청 로그
   */
  request: (req: any, metadata?: Record<string, any>) => {
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      ...metadata
    });
  },

  /**
   * HTTP 응답 로그
   */
  response: (req: any, res: any, duration: number, metadata?: Record<string, any>) => {
    logger.info('HTTP Response', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      ...metadata
    });
  },

  /**
   * 사주 계산 로그
   */
  sajuCalculation: (readingId: string, birthData: any, duration: number, cached: boolean) => {
    logger.info('사주 계산 완료', {
      readingId,
      birthYear: birthData.birthYear,
      gender: birthData.gender,
      calendarType: birthData.calendarType,
      duration: `${duration}ms`,
      cached
    });
  },

  /**
   * 결제 로그
   */
  payment: (event: string, paymentIntentId: string, amount?: number, metadata?: Record<string, any>) => {
    logger.info(`Payment ${event}`, {
      paymentIntentId,
      amount,
      currency: 'KRW',
      ...metadata
    });
  },

  /**
   * 캐시 로그
   */
  cache: (action: 'hit' | 'miss' | 'set' | 'del', key: string, metadata?: Record<string, any>) => {
    logger.debug(`Cache ${action}`, {
      key,
      ...metadata
    });
  }
};

// 개발 환경 시작 메시지
if (process.env.NODE_ENV !== 'test') {
  logger.info('📝 Logger initialized', {
    environment: process.env.NODE_ENV || 'development',
    level: process.env.LOG_LEVEL || 'info'
  });
}

export default logger;

