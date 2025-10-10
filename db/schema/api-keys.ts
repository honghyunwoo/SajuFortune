/**
 * API 키 관리 스키마
 * B2B API 제공을 위한 API 키 및 사용량 관리
 */

import { pgTable, integer, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';

/**
 * API 키 테이블
 */
export const apiKeys = pgTable('api_keys', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  // API 키 정보
  key: varchar('key', { length: 64 }).notNull().unique(), // API 키 (sk_live_..., sk_test_...)
  name: varchar('name', { length: 255 }).notNull(), // API 키 이름/용도

  // 사용자 정보
  userId: varchar('user_id', { length: 255 }).notNull(), // 사용자 ID
  email: varchar('email', { length: 255 }).notNull(), // 사용자 이메일
  organizationName: varchar('organization_name', { length: 255 }), // 조직/회사명

  // 플랜 정보
  tier: varchar('tier', { length: 50 }).notNull().default('free'), // free | basic | pro | enterprise

  // Rate Limiting
  dailyLimit: integer('daily_limit').notNull().default(100), // 일일 요청 제한
  monthlyLimit: integer('monthly_limit').notNull().default(3000), // 월별 요청 제한

  // 상태
  isActive: boolean('is_active').notNull().default(true),

  // 메타데이터
  lastUsedAt: timestamp('last_used_at'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'), // 만료일 (선택)
  revokedAt: timestamp('revoked_at'), // 폐기일
},
(table) => ({
  keyIdx: index('api_keys_key_idx').on(table.key),
  userIdIdx: index('api_keys_user_id_idx').on(table.userId),
  tierIdx: index('api_keys_tier_idx').on(table.tier),
}));

/**
 * API 사용량 로그 테이블
 */
export const apiUsageLogs = pgTable('api_usage_logs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  // API 키 연결
  apiKeyId: integer('api_key_id').notNull().references(() => apiKeys.id, { onDelete: 'cascade' }),

  // 요청 정보
  endpoint: varchar('endpoint', { length: 255 }).notNull(), // /api/v1/saju, /api/v1/compatibility 등
  method: varchar('method', { length: 10 }).notNull(), // GET, POST
  statusCode: integer('status_code').notNull(), // 200, 400, 429, 500 등

  // 응답 정보
  responseTime: integer('response_time'), // 응답 시간 (ms)

  // 클라이언트 정보
  ipAddress: varchar('ip_address', { length: 45 }), // IPv4 / IPv6
  userAgent: varchar('user_agent', { length: 512 }),

  // 에러 정보
  errorCode: varchar('error_code', { length: 50 }), // RATE_LIMIT_EXCEEDED, INVALID_KEY 등
  errorMessage: varchar('error_message', { length: 1024 }),

  // Timestamp
  createdAt: timestamp('created_at').notNull().defaultNow(),
},
(table) => ({
  apiKeyIdIdx: index('api_usage_logs_api_key_id_idx').on(table.apiKeyId),
  createdAtIdx: index('api_usage_logs_created_at_idx').on(table.createdAt),
  endpointIdx: index('api_usage_logs_endpoint_idx').on(table.endpoint),
}));

/**
 * API 사용량 집계 테이블 (일별)
 */
export const apiUsageDaily = pgTable('api_usage_daily', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  // API 키 연결
  apiKeyId: integer('api_key_id').notNull().references(() => apiKeys.id, { onDelete: 'cascade' }),

  // 날짜
  date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD

  // 사용량
  totalRequests: integer('total_requests').notNull().default(0),
  successfulRequests: integer('successful_requests').notNull().default(0),
  failedRequests: integer('failed_requests').notNull().default(0),
  rateLimitedRequests: integer('rate_limited_requests').notNull().default(0),

  // 엔드포인트별 사용량
  sajuRequests: integer('saju_requests').notNull().default(0),
  compatibilityRequests: integer('compatibility_requests').notNull().default(0),
  monthlyFortuneRequests: integer('monthly_fortune_requests').notNull().default(0),

  // 통계
  avgResponseTime: integer('avg_response_time'), // 평균 응답 시간 (ms)

  // Timestamps
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
},
(table) => ({
  apiKeyIdDateIdx: index('api_usage_daily_api_key_id_date_idx').on(table.apiKeyId, table.date),
  dateIdx: index('api_usage_daily_date_idx').on(table.date),
}));

/**
 * API 사용량 집계 테이블 (월별)
 */
export const apiUsageMonthly = pgTable('api_usage_monthly', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  // API 키 연결
  apiKeyId: integer('api_key_id').notNull().references(() => apiKeys.id, { onDelete: 'cascade' }),

  // 년월
  yearMonth: varchar('year_month', { length: 7 }).notNull(), // YYYY-MM

  // 사용량
  totalRequests: integer('total_requests').notNull().default(0),
  successfulRequests: integer('successful_requests').notNull().default(0),
  failedRequests: integer('failed_requests').notNull().default(0),

  // 비용 (선택)
  estimatedCost: integer('estimated_cost'), // 예상 비용 (원)

  // Timestamps
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
},
(table) => ({
  apiKeyIdYearMonthIdx: index('api_usage_monthly_api_key_id_year_month_idx').on(table.apiKeyId, table.yearMonth),
}));

/**
 * Webhook 설정 테이블
 */
export const apiWebhooks = pgTable('api_webhooks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  // API 키 연결
  apiKeyId: integer('api_key_id').notNull().references(() => apiKeys.id, { onDelete: 'cascade' }),

  // Webhook 정보
  url: varchar('url', { length: 1024 }).notNull(), // Webhook URL
  secret: varchar('secret', { length: 64 }).notNull(), // Webhook 서명 검증용

  // 이벤트 타입
  events: varchar('events', { length: 512 }).notNull(), // 쉼표로 구분된 이벤트 목록

  // 상태
  isActive: boolean('is_active').notNull().default(true),

  // 실패 정보
  failureCount: integer('failure_count').notNull().default(0),
  lastFailureAt: timestamp('last_failure_at'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
},
(table) => ({
  apiKeyIdIdx: index('api_webhooks_api_key_id_idx').on(table.apiKeyId),
}));
