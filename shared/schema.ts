import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { 격국결과 } from "./geokguk-analyzer";
import type { 대운결과 } from "./daeun-calculator";
import type { 십이운성결과 } from "./sibiunseong-analyzer";

// Saju Data Interfaces
export interface SajuPillar {
  heavenly: string;
  earthly: string;
  element: string;
}

export interface SajuData {
  pillars: SajuPillar[];
  elements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  dayMaster: string;
  strength: 'strong' | 'medium' | 'weak';
}

export interface TodayFortune {
  rating: number;
  overall: string;
  description: string;
  love: string;
  career: string;
  money: string;
}

export interface DetailedAnalysisItem {
  score: number;
  level: string;
  description: string;
}

export interface DetailedAnalysis {
  love: DetailedAnalysisItem;
  career: DetailedAnalysisItem;
  health: DetailedAnalysisItem;
  money: DetailedAnalysisItem;
}

export interface CompatibilityItem {
  compatibility: string;
  description: string;
}

export interface Compatibility {
  zodiac: CompatibilityItem;
  saju: CompatibilityItem;
  element: CompatibilityItem;
}

export interface MonthlyFortuneItem {
  month: number;
  rating: number;
  description: string;
}

export interface Advice {
  general: string[];
  career: string[];
  relationship: string[];
  health: string[];
}

export interface AnalysisResult {
  personality: string;
  todayFortune: TodayFortune;
  detailedAnalysis: DetailedAnalysis;
  compatibility: Compatibility;
  monthlyFortune: MonthlyFortuneItem[];
  advice: Advice;
  geokguk?: 격국결과; // 격국 분석 결과
  daeun?: 대운결과; // 대운 결과
  sibiunseong?: 십이운성결과; // 십이운성 결과
}

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const fortuneReadings = pgTable("fortune_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  sessionId: varchar("session_id").notNull(), // For anonymous users
  gender: text("gender").notNull(), // 'male' | 'female'
  birthYear: integer("birth_year").notNull(),
  birthMonth: integer("birth_month").notNull(),
  birthDay: integer("birth_day").notNull(),
  birthHour: integer("birth_hour").notNull(),
  birthMinute: integer("birth_minute").notNull(),
  calendarType: text("calendar_type").notNull(), // 'solar' | 'lunar'
  serviceType: text("service_type").notNull().default('free'), // 'free' | 'premium'
  isPaid: boolean("is_paid").notNull().default(false), // Payment status for premium service
  sajuData: jsonb("saju_data").notNull(), // Contains calculated saju pillars
  analysisResult: jsonb("analysis_result").notNull(), // Contains fortune analysis
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  readingId: varchar("reading_id").notNull(),
  amount: integer("amount").notNull(), // Amount in KRW
  donorName: text("donor_name"),
  message: text("message"),
  paymentIntentId: text("payment_intent_id"),
  isPaid: boolean("is_paid").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertFortuneReadingSchema = createInsertSchema(fortuneReadings).omit({
  id: true,
  createdAt: true,
});

export const createFortuneReadingSchema = z.object({
  gender: z.enum(["male", "female"]),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()),
  birthMonth: z.number().int().min(1).max(12),
  birthDay: z.number().int().min(1).max(31),
  birthHour: z.number().int().min(0).max(23),
  birthMinute: z.number().int().min(0).max(59),
  calendarType: z.enum(["solar", "lunar"]),
  serviceType: z.enum(["free", "premium"]).default("free"),
  isPaid: z.boolean().default(false),
});

export const createDonationSchema = z.object({
  readingId: z.string(),
  amount: z.number().min(1000), // Minimum 1,000 KRW
  donorName: z.string().optional(),
  message: z.string().optional(),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFortuneReading = z.infer<typeof insertFortuneReadingSchema>;
export type FortuneReading = typeof fortuneReadings.$inferSelect & {
  sajuData: SajuData;
  analysisResult: AnalysisResult;
};
export type CreateFortuneReading = z.infer<typeof createFortuneReadingSchema>;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type CreateDonation = z.infer<typeof createDonationSchema>;
