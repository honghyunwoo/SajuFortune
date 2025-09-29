import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { createFortuneReadingSchema, createDonationSchema } from "@shared/schema";
import { calculatePremiumSaju } from "@/lib/premium-calculator";
import { premiumToSajuData } from "@shared/adapters";
import { analyzeFortune } from "@/lib/saju-calculator";
import { sajuCalculationRateLimit, donationRateLimit } from "./security";
import { cacheService } from "./cache";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY not found. Payment functionality will be disabled.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Create fortune reading (Rate Limiting 적용)
  app.post("/api/fortune-readings", sajuCalculationRateLimit, async (req, res) => {
    try {
      const validatedData = createFortuneReadingSchema.parse(req.body);
      
      // Generate session ID for anonymous users  
      const sessionId = (req as any).sessionID || `session_${Date.now()}_${Math.random()}`;
      
      // 캐시된 결과 확인
      const cacheKey = {
        year: validatedData.birthYear,
        month: validatedData.birthMonth,
        day: validatedData.birthDay,
        hour: validatedData.birthHour,
        minute: validatedData.birthMinute,
        calendarType: validatedData.calendarType
      };
      
      const cachedResult = await cacheService.getCachedSajuResult(cacheKey);
      if (cachedResult) {
        console.log('✅ 캐시된 사주 결과 사용');
        return res.json({ 
          readingId: cachedResult.readingId,
          cached: true
        });
      }
      
      // Calculate saju pillars using premium engine
      const birthDate = new Date(
        validatedData.birthYear, 
        validatedData.birthMonth - 1, 
        validatedData.birthDay, 
        validatedData.birthHour, 
        validatedData.birthMinute
      );
      
      const premiumResult = calculatePremiumSaju(birthDate, validatedData.birthHour, {
        includeSinsal: true,
        includeLunar: true,
        precision: 'premium'
      });
      
      // Convert premium result to basic SajuData format
      const sajuData = premiumToSajuData(premiumResult);

      // Generate fortune analysis (all features are now free)
      const analysisResult = analyzeFortune(sajuData, validatedData.gender);

      const reading = await storage.createFortuneReading({
        userId: null,
        sessionId,
        gender: validatedData.gender,
        birthYear: validatedData.birthYear,
        birthMonth: validatedData.birthMonth,
        birthDay: validatedData.birthDay,
        birthHour: validatedData.birthHour,
        birthMinute: validatedData.birthMinute,
        calendarType: validatedData.calendarType,
        serviceType: 'free', // 🎯 무료 론칭 기간: 모든 서비스 강제 무료
        isPaid: false,       // 🎯 무료 론칭 기간: 모든 결제 상태 false
        sajuData,
        analysisResult
      });

      // 결과를 캐시에 저장
      await cacheService.cacheSajuResult(cacheKey, {
        readingId: reading.id,
        sajuData,
        analysisResult,
        premiumResult
      });

      res.json({ 
        readingId: reading.id,
        cached: false
      });
    } catch (error: any) {
      res.status(400).json({ message: "Error creating fortune reading: " + error.message });
    }
  });

  // Get fortune reading
  app.get("/api/fortune-readings/:id", async (req, res) => {
    try {
      const reading = await storage.getFortuneReading(req.params.id);
      if (!reading) {
        return res.status(404).json({ message: "Fortune reading not found" });
      }

      res.json(reading);
    } catch (error: any) {
      res.status(500).json({ message: "Error retrieving fortune reading: " + error.message });
    }
  });

  // Create donation payment intent (Rate Limiting 적용)
  app.post("/api/create-donation", donationRateLimit, async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Payment service not available" });
    }

    try {
      const validatedData = createDonationSchema.parse(req.body);
      const { readingId, amount, donorName, message } = validatedData;
      
      const reading = await storage.getFortuneReading(readingId);
      if (!reading) {
        return res.status(404).json({ message: "Fortune reading not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: "krw",
        metadata: {
          readingId: reading.id,
          type: "donation",
          donorName: donorName || "익명",
          message: message || ""
        }
      });

      // Create donation record
      const donation = await storage.createDonation({
        readingId: reading.id,
        amount,
        donorName,
        message,
        paymentIntentId: paymentIntent.id,
        isPaid: false
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        donationId: donation.id
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating donation: " + error.message });
    }
  });

  // Webhook to handle successful donations
  app.post("/api/stripe-webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Payment service not available" });
    }

    try {
      const sig = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;
      
      if (endpointSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } else {
        event = req.body;
      }

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const { type } = paymentIntent.metadata;
        
        if (type === 'donation') {
          await storage.updateDonationPayment(paymentIntent.id);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ message: "Webhook error: " + error.message });
    }
  });

  // Get donations for a reading
  app.get("/api/donations/:readingId", async (req, res) => {
    try {
      const donations = await storage.getDonationsByReadingId(req.params.readingId);
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ message: "Error retrieving donations: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
