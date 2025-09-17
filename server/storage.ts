import { type User, type InsertUser, type FortuneReading, type InsertFortuneReading, type Donation, type InsertDonation } from "@shared/schema";
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
  
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonationsByReadingId(readingId: string): Promise<Donation[]>;
  updateDonationPayment(paymentIntentId: string): Promise<Donation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private fortuneReadings: Map<string, FortuneReading>;
  private donations: Map<string, Donation>;

  constructor() {
    this.users = new Map();
    this.fortuneReadings = new Map();
    this.donations = new Map();
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

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donation: Donation = {
      ...insertDonation,
      id,
      createdAt: new Date()
    };
    this.donations.set(id, donation);
    return donation;
  }

  async getDonationsByReadingId(readingId: string): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      (donation) => donation.readingId === readingId && donation.isPaid
    );
  }

  async updateDonationPayment(paymentIntentId: string): Promise<Donation> {
    const donation = Array.from(this.donations.values()).find(
      (d) => d.paymentIntentId === paymentIntentId
    );
    if (!donation) {
      throw new Error("Donation not found");
    }
    const updatedDonation = { 
      ...donation, 
      isPaid: true 
    };
    this.donations.set(donation.id, updatedDonation);
    return updatedDonation;
  }
}

export const storage = new MemStorage();
