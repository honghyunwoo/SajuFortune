import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import crypto from "crypto";
import { storage } from "./storage";
import { createFortuneReadingSchema, createDonationSchema } from "@shared/schema";
import { calculatePremiumSaju } from "@/lib/premium-calculator";
import { premiumToSajuData } from "@shared/adapters";
import { analyzeFortune } from "@/lib/saju-calculator";
import { sajuCalculationRateLimit, donationRateLimit } from "./security";
import { cacheService } from "./cache";
import { sendContactFormEmail, sendAutoReplyEmail } from "./email";
import { log } from "./logger";
import { throwError } from "./middleware/error-handler";

/**
 * 보안 강화된 세션 ID 생성
 * DoS 공격 방어: 예측 불가능한 세션 ID 생성
 */
function generateSecureSessionId(req: Request): string {
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const ip = req.ip || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  // SHA256 해시로 예측 불가능한 ID 생성
  const hash = crypto
    .createHash('sha256')
    .update(`${timestamp}-${randomBytes}-${ip}-${userAgent}`)
    .digest('hex');

  return `session_${hash.substring(0, 32)}`;
}

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'test') {
  console.warn('⚠️  Warning: STRIPE_SECRET_KEY not found. Payment functionality will be disabled.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Create fortune reading (Rate Limiting 적용)
  app.post("/api/fortune-readings", sajuCalculationRateLimit, async (req, res) => {
    try {
      const validatedData = createFortuneReadingSchema.parse(req.body);
      
      // Generate session ID for anonymous users (보안 강화)
      const sessionId = (req as any).sessionID || generateSecureSessionId(req);
      
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
        log.cache('hit', `saju:${cacheKey.year}:${cacheKey.month}:${cacheKey.day}`);
        return res.json({ 
          readingId: cachedResult.readingId,
          cached: true
        });
      }
      
      log.cache('miss', `saju:${cacheKey.year}:${cacheKey.month}:${cacheKey.day}`);
      
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
        includeGeokguk: true,
        includeDaeun: true,
        includeSibiunseong: true,
        includeLoveFortune: true,
        includeWealthFortune: true,
        includeHealthFortune: true,
        includeCareerFortune: true,
        currentAge: validatedData.birthYear ? new Date().getFullYear() - validatedData.birthYear : undefined,
        gender: validatedData.gender,
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
  app.get("/api/fortune-readings/:id", async (req, res, next) => {
    try {
      const reading = await storage.getFortuneReading(req.params.id);
      if (!reading) {
        throwError.notFound('Fortune reading');
        return; // TypeScript 타입 가드
      }

      // 캐시에서 premiumResult 가져오기
      const cacheKey = {
        year: reading.birthYear,
        month: reading.birthMonth,
        day: reading.birthDay,
        hour: reading.birthHour,
        minute: reading.birthMinute,
        calendarType: reading.calendarType
      };

      const cachedResult = await cacheService.getCachedSajuResult(cacheKey);
      const premiumResult = cachedResult?.premiumResult;

      res.json({
        ...reading,
        premiumResult // 캐시된 premiumResult 추가
      });
    } catch (error) {
      next(error);
    }
  });

  // Create donation payment intent (Rate Limiting 적용)
  app.post("/api/create-donation", donationRateLimit, async (req, res, next) => {
    if (!stripe) {
      return next(throwError.databaseError('Stripe service not configured'));
    }

    try {
      const validatedData = createDonationSchema.parse(req.body);
      const { readingId, amount, donorName, message } = validatedData;
      
      const reading = await storage.getFortuneReading(readingId);
      if (!reading) {
        throwError.notFound('Fortune reading');
        return; // TypeScript 타입 가드
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

      log.payment('created', paymentIntent.id, amount, { readingId, donorName });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        donationId: donation.id
      });
    } catch (error) {
      next(error);
    }
  });

  // Webhook to handle successful donations
  app.post("/api/stripe-webhook", async (req, res, next) => {
    if (!stripe) {
      return next(throwError.databaseError('Stripe service not configured'));
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

      // 결제 성공 처리
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const { type } = paymentIntent.metadata;
        
        if (type === 'donation') {
          await storage.updateDonationPayment(paymentIntent.id);
          log.payment('succeeded', paymentIntent.id, paymentIntent.amount, { type });
        }
      }

      // 결제 실패 처리 (PRD 요구사항 추가)
      if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;
        log.payment('failed', paymentIntent.id, paymentIntent.amount, { 
          error: paymentIntent.last_payment_error?.message 
        });
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  });

  // Get donations for a reading
  app.get("/api/donations/:readingId", async (req, res, next) => {
    try {
      const donations = await storage.getDonationsByReadingId(req.params.readingId);
      res.json(donations);
    } catch (error) {
      next(error);
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res, next) => {
    try {
      const { name, email, category, subject, message } = req.body;

      // 유효성 검사
      if (!name || !email || !category || !subject || !message) {
        throwError.invalidInput('contact form', '모든 필수 항목을 입력해주세요.');
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throwError.invalidInput('email', '올바른 이메일 주소를 입력해주세요.');
      }

      // 관리자에게 문의 이메일 전송
      const emailResult = await sendContactFormEmail({
        name,
        email,
        category,
        subject,
        message
      });

      if (!emailResult.success) {
        throw new Error(emailResult.error || "이메일 전송 실패");
      }

      // 사용자에게 자동 응답 이메일 전송
      await sendAutoReplyEmail(email, name, category);

      res.json({
        success: true,
        message: "문의가 성공적으로 접수되었습니다.",
        messageId: emailResult.messageId
      });

    } catch (error) {
      next(error);
    }
  });

  // ========================================
  // 캐시 관리 API (관리자용)
  // PRD 6.2: 캐시 무효화 지원
  // ========================================
  
  /**
   * 캐시 통계 조회
   * GET /api/admin/cache/stats
   */
  app.get("/api/admin/cache/stats", async (req, res) => {
    try {
      const stats = await cacheService.getStats();
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "캐시 통계 조회 실패: " + error.message
      });
    }
  });

  /**
   * 특정 캐시 키 삭제
   * DELETE /api/admin/cache/:key
   */
  app.delete("/api/admin/cache/:key", async (req, res) => {
    try {
      const deleted = await cacheService.delete(req.params.key);
      res.json({
        success: true,
        message: deleted ? 'Cache key deleted' : 'Cache key not found',
        key: req.params.key
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "캐시 삭제 실패: " + error.message
      });
    }
  });

  /**
   * 패턴 기반 캐시 삭제
   * DELETE /api/admin/cache/pattern/:pattern
   * 예: DELETE /api/admin/cache/pattern/saju:v1.0.0:*
   */
  app.delete("/api/admin/cache/pattern/:pattern", async (req, res) => {
    try {
      const pattern = decodeURIComponent(req.params.pattern);
      const deletedCount = await cacheService.deletePattern(pattern);
      res.json({
        success: true,
        message: `${deletedCount} cache keys deleted`,
        pattern,
        deletedCount
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "패턴 캐시 삭제 실패: " + error.message
      });
    }
  });

  /**
   * 전체 캐시 초기화
   * DELETE /api/admin/cache
   * ⚠️ 주의: 모든 캐시 데이터가 삭제됩니다!
   */
  app.delete("/api/admin/cache", async (req, res) => {
    try {
      const flushed = await cacheService.flush();
      res.json({
        success: true,
        message: flushed ? 'All cache flushed' : 'Cache flush failed'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "전체 캐시 초기화 실패: " + error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
