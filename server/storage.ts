import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import {
  type User,
  type InsertUser,
  type FortuneReading,
  type InsertFortuneReading,
  type Donation,
  type InsertDonation,
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStripeCustomerId(
    userId: string,
    stripeCustomerId: string,
  ): Promise<User>;

  createFortuneReading(
    reading: InsertFortuneReading,
  ): Promise<FortuneReading>;
  getFortuneReading(id: string): Promise<FortuneReading | undefined>;
  getFortuneReadingBySessionId(
    sessionId: string,
  ): Promise<FortuneReading | undefined>;

  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonationsByReadingId(readingId: string): Promise<Donation[]>;
  updateDonationPayment(paymentIntentId: string): Promise<Donation>;
}

export class DrizzleStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return users[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    return users[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return users[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await db.insert(schema.users).values(insertUser).returning();
    return users[0];
  }

  async updateStripeCustomerId(
    userId: string,
    stripeCustomerId: string,
  ): Promise<User> {
    const users = await db
      .update(schema.users)
      .set({ stripeCustomerId })
      .where(eq(schema.users.id, userId))
      .returning();
    return users[0];
  }

  async createFortuneReading(
    insertReading: InsertFortuneReading,
  ): Promise<FortuneReading> {
    const readings = await db
      .insert(schema.fortuneReadings)
      .values(insertReading)
      .returning();
    return readings[0] as FortuneReading;
  }

  async getFortuneReading(id: string): Promise<FortuneReading | undefined> {
    const readings = await db
      .select()
      .from(schema.fortuneReadings)
      .where(eq(schema.fortuneReadings.id, id))
      .limit(1);
    return readings[0] as FortuneReading | undefined;
  }

  async getFortuneReadingBySessionId(
    sessionId: string,
  ): Promise<FortuneReading | undefined> {
    const readings = await db
      .select()
      .from(schema.fortuneReadings)
      .where(eq(schema.fortuneReadings.sessionId, sessionId))
      .limit(1);
    return readings[0] as FortuneReading | undefined;
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const donations = await db
      .insert(schema.donations)
      .values(insertDonation)
      .returning();
    return donations[0] as Donation;
  }

  async getDonationsByReadingId(readingId: string): Promise<Donation[]> {
    return db
      .select()
      .from(schema.donations)
      .where(eq(schema.donations.readingId, readingId)) as Promise<Donation[]>;
  }

  async updateDonationPayment(paymentIntentId: string): Promise<Donation> {
    const donations = await db
      .update(schema.donations)
      .set({ isPaid: true })
      .where(eq(schema.donations.paymentIntentId, paymentIntentId))
      .returning();
    return donations[0] as Donation;
  }
}

export const storage = new DrizzleStorage();