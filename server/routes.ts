import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { createFortuneReadingSchema } from "@shared/schema";
import { calculateSaju, analyzeFortune } from "@/lib/saju-calculator";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY not found. Payment functionality will be disabled.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Create fortune reading
  app.post("/api/fortune-readings", async (req, res) => {
    try {
      const validatedData = createFortuneReadingSchema.parse(req.body);
      
      // Generate session ID for anonymous users  
      const sessionId = (req as any).sessionID || `session_${Date.now()}_${Math.random()}`;
      
      // Calculate saju pillars
      const sajuData = calculateSaju({
        year: validatedData.birthYear,
        month: validatedData.birthMonth,
        day: validatedData.birthDay,
        hour: validatedData.birthHour,
        minute: validatedData.birthMinute,
        gender: validatedData.gender,
        calendarType: validatedData.calendarType
      });

      // Generate fortune analysis
      const analysisResult = analyzeFortune(sajuData, validatedData.serviceType);

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
        serviceType: validatedData.serviceType,
        isPaid: validatedData.serviceType === 'free',
        paymentIntentId: null,
        sajuData,
        analysisResult
      });

      res.json({ 
        readingId: reading.id,
        needsPayment: validatedData.serviceType === 'premium'
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

      // Check if premium service requires payment
      if (reading.serviceType === 'premium' && !reading.isPaid) {
        return res.status(402).json({ message: "Payment required for premium service" });
      }

      res.json(reading);
    } catch (error: any) {
      res.status(500).json({ message: "Error retrieving fortune reading: " + error.message });
    }
  });

  // Stripe payment route for premium fortune readings
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Payment service not available" });
    }

    try {
      const { readingId } = req.body;
      
      const reading = await storage.getFortuneReading(readingId);
      if (!reading) {
        return res.status(404).json({ message: "Fortune reading not found" });
      }

      if (reading.serviceType !== 'premium') {
        return res.status(400).json({ message: "Payment not required for free service" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 29000 * 100, // 29,000 KRW in cents
        currency: "krw",
        metadata: {
          readingId: reading.id,
          serviceType: reading.serviceType
        }
      });

      // Update reading with payment intent ID
      await storage.updateFortuneReadingPayment(reading.id, paymentIntent.id);

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Webhook to handle successful payments
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
        const readingId = paymentIntent.metadata.readingId;
        
        if (readingId) {
          await storage.updateFortuneReadingPayment(readingId, paymentIntent.id);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ message: "Webhook error: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
