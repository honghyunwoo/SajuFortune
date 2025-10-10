/**
 * 구독 관리 API (간소화 버전)
 * TODO: DB 통합 후 subscription.ts로 교체
 */

import type { Express } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-08-27.basil',
});

// 프리미엄 플랜 정의
const PREMIUM_PLANS = {
  monthly: {
    name: '프리미엄 월간 구독',
    price: 9900,
    priceId: process.env.STRIPE_PRICE_ID_MONTHLY || 'price_dummy',
    interval: 'month' as const,
  },
  yearly: {
    name: '프리미엄 연간 구독',
    price: 99000,
    priceId: process.env.STRIPE_PRICE_ID_YEARLY || 'price_dummy',
    interval: 'year' as const,
  },
};

/**
 * 구독 라우트 등록 (간소화 버전)
 */
export function registerSubscriptionRoutes(app: Express) {
  // 구독 플랜 정보 조회
  app.get('/api/subscription/plans', (req, res) => {
    res.json({
      plans: [
        {
          id: 'monthly',
          name: PREMIUM_PLANS.monthly.name,
          price: PREMIUM_PLANS.monthly.price,
          interval: 'month',
          features: [
            '무제한 사주 분석',
            '무제한 궁합 분석',
            '무제한 월별 운세',
            'PDF 다운로드',
            '광고 없음',
          ],
        },
        {
          id: 'yearly',
          name: PREMIUM_PLANS.yearly.name,
          price: PREMIUM_PLANS.yearly.price,
          interval: 'year',
          savings: '2개월 무료',
          features: [
            '월간 플랜 모든 혜택',
            '2개월 무료 (연 99,000원)',
            '우선 지원',
          ],
        },
      ],
    });
  });

  // 구독 생성 (Checkout Session)
  app.post('/api/subscription/create-checkout', async (req, res) => {
    try {
      const { planType, userId, email } = req.body;

      if (!planType || !userId || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const plan = PREMIUM_PLANS[planType as keyof typeof PREMIUM_PLANS];
      if (!plan) {
        return res.status(400).json({ error: 'Invalid plan type' });
      }

      // Stripe Checkout Session 생성
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        customer_email: email,
        client_reference_id: userId,
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}/subscription/cancel`,
        metadata: {
          userId,
          planType,
        },
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error('[Subscription] Create checkout error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // 구독 상태 조회 (간소화 - 항상 무료 사용자로 응답)
  app.get('/api/subscription/status', async (req, res) => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      // TODO: DB에서 실제 구독 상태 조회
      res.json({
        isPremium: false,
        usage: {
          sajuReadings: {
            used: 0,
            limit: 3,
            remaining: 3,
          },
          compatibility: {
            used: 0,
            limit: 1,
            remaining: 1,
          },
          monthlyFortune: {
            used: 0,
            limit: 1,
            remaining: 1,
          },
        },
      });
    } catch (error) {
      console.error('[Subscription] Status error:', error);
      res.status(500).json({ error: 'Failed to fetch subscription status' });
    }
  });

  // 사용량 증가 (간소화 - 항상 허용)
  app.post('/api/subscription/increment-usage', async (req, res) => {
    try {
      const { userId, feature } = req.body;

      if (!userId || !feature) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // TODO: DB에서 실제 사용량 체크 및 업데이트
      res.json({
        allowed: true,
        isPremium: false,
        remaining: 2,
      });
    } catch (error) {
      console.error('[Subscription] Increment usage error:', error);
      res.status(500).json({ error: 'Failed to increment usage' });
    }
  });

  // 구독 취소 (간소화)
  app.post('/api/subscription/cancel', async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      // TODO: DB에서 구독 취소 처리
      res.json({ success: true });
    } catch (error) {
      console.error('[Subscription] Cancel error:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  });

  // Stripe Webhook
  app.post('/api/subscription/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy'
      );

      // TODO: 이벤트 처리 (구독 생성/갱신/취소 등)
      console.log('[Subscription] Webhook event:', event.type);

      res.json({ received: true });
    } catch (error) {
      console.error('[Subscription] Webhook error:', error);
      res.status(400).json({ error: 'Webhook error' });
    }
  });
}
