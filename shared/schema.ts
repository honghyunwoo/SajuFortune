import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  serviceType: text("service_type").notNull(), // 'free' | 'premium'
  isPaid: boolean("is_paid").default(false),
  paymentIntentId: text("payment_intent_id"),
  sajuData: jsonb("saju_data").notNull(), // Contains calculated saju pillars
  analysisResult: jsonb("analysis_result").notNull(), // Contains fortune analysis
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
  birthYear: z.number().min(1900).max(2024),
  birthMonth: z.number().min(1).max(12),
  birthDay: z.number().min(1).max(31),
  birthHour: z.number().min(0).max(23),
  birthMinute: z.number().min(0).max(59),
  calendarType: z.enum(["solar", "lunar"]),
  serviceType: z.enum(["free", "premium"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFortuneReading = z.infer<typeof insertFortuneReadingSchema>;
export type FortuneReading = typeof fortuneReadings.$inferSelect;
export type CreateFortuneReading = z.infer<typeof createFortuneReadingSchema>;
