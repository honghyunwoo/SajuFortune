import { type User, type InsertUser, type FortuneReading, type InsertFortuneReading } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<User>;
  
  createFortuneReading(reading: InsertFortuneReading): Promise<FortuneReading>;
  getFortuneReading(id: string): Promise<FortuneReading | undefined>;
  getFortuneReadingBySessionId(sessionId: string): Promise<FortuneReading | undefined>;
  updateFortuneReadingPayment(id: string, paymentIntentId: string): Promise<FortuneReading>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private fortuneReadings: Map<string, FortuneReading>;

  constructor() {
    this.users = new Map();
    this.fortuneReadings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      stripeCustomerId: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, stripeCustomerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createFortuneReading(insertReading: InsertFortuneReading): Promise<FortuneReading> {
    const id = randomUUID();
    const reading: FortuneReading = {
      ...insertReading,
      userId: insertReading.userId || null,
      id,
      createdAt: new Date()
    };
    this.fortuneReadings.set(id, reading);
    return reading;
  }

  async getFortuneReading(id: string): Promise<FortuneReading | undefined> {
    return this.fortuneReadings.get(id);
  }

  async getFortuneReadingBySessionId(sessionId: string): Promise<FortuneReading | undefined> {
    return Array.from(this.fortuneReadings.values()).find(
      (reading) => reading.sessionId === sessionId,
    );
  }

  async updateFortuneReadingPayment(id: string, paymentIntentId: string): Promise<FortuneReading> {
    const reading = this.fortuneReadings.get(id);
    if (!reading) {
      throw new Error("Fortune reading not found");
    }
    const updatedReading = { 
      ...reading, 
      paymentIntentId, 
      isPaid: true 
    };
    this.fortuneReadings.set(id, updatedReading);
    return updatedReading;
  }
}

export const storage = new MemStorage();
