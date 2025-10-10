/**
 * 구독(Subscription) 테이블 스키마
 */

import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * 구독 테이블
 */
export const subscriptions = pgTable("subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  // 사용자 정보
  userId: varchar("user_id", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),

  // 구독 정보
  planType: varchar("plan_type", { length: 50 }).notNull().default('monthly'), // 'monthly' | 'yearly'
  status: varchar("status", { length: 50 }).notNull().default('active'), // 'active' | 'cancelled' | 'expired' | 'payment_failed'

  // Stripe 정보
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),

  // 결제 정보
  amount: integer("amount").notNull(), // 원 단위 (9900 = 9,900원)
  currency: varchar("currency", { length: 10 }).notNull().default('KRW'),

  // 구독 기간
  startDate: timestamp("start_date").notNull().defaultNow(),
  currentPeriodStart: timestamp("current_period_start").notNull().defaultNow(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelledAt: timestamp("cancelled_at"),
  endedAt: timestamp("ended_at"),

  // 자동 갱신
  autoRenew: boolean("auto_renew").notNull().default(true),

  // 타임스탬프
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 결제 내역 테이블
 */
export const payments = pgTable("payments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  // 구독 정보
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  userId: varchar("user_id", { length: 255 }).notNull(),

  // Stripe 정보
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 }),

  // 결제 정보
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default('KRW'),
  status: varchar("status", { length: 50 }).notNull(), // 'succeeded' | 'pending' | 'failed' | 'refunded'

  // 결제 방법
  paymentMethod: varchar("payment_method", { length: 50 }), // 'card' | 'bank_transfer' | etc.

  // 영수증
  receiptUrl: text("receipt_url"),

  // 타임스탬프
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 사용 내역 테이블 (무료 사용자 제한 추적)
 */
export const usageLimits = pgTable("usage_limits", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  // 사용자 정보
  userId: varchar("user_id", { length: 255 }).notNull().unique(),

  // 사용 카운트 (월별 리셋)
  sajuReadingsCount: integer("saju_readings_count").notNull().default(0),
  compatibilityCount: integer("compatibility_count").notNull().default(0),
  monthlyFortuneCount: integer("monthly_fortune_count").notNull().default(0),

  // 마지막 리셋 날짜
  lastResetDate: timestamp("last_reset_date").notNull().defaultNow(),

  // 타임스탬프
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 타입 추출
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type UsageLimit = typeof usageLimits.$inferSelect;
export type InsertUsageLimit = typeof usageLimits.$inferInsert;
