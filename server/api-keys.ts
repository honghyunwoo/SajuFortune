/**
 * API 키 관리 시스템
 * B2B API 파트너를 위한 인증 및 권한 관리
 */

import crypto from 'crypto';
import { log } from './logger';

export type ApiTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface ApiKey {
  key: string;
  name: string;
  tier: ApiTier;
  dailyLimit: number;
  monthlyLimit: number;
  createdAt: Date;
  expiresAt: Date | null;
  isActive: boolean;
}

export interface ApiUsage {
  key: string;
  date: string; // YYYY-MM-DD
  count: number;
  monthlyCount: number; // Current month total
}

/**
 * API Tier 별 제한
 */
export const API_TIER_LIMITS: Record<ApiTier, { daily: number; monthly: number; price: number }> = {
  free: { daily: 100, monthly: 3000, price: 0 },
  basic: { daily: 1000, monthly: 30000, price: 50000 },
  pro: { daily: 10000, monthly: 300000, price: 300000 },
  enterprise: { daily: 100000, monthly: 3000000, price: 2000000 },
};

class ApiKeyService {
  private apiKeys: Map<string, ApiKey> = new Map();
  private usage: Map<string, ApiUsage> = new Map();

  constructor() {
    // 개발 환경용 테스트 API 키 생성
    if (process.env.NODE_ENV === 'development') {
      this.createTestApiKeys();
    }
  }

  /**
   * 테스트용 API 키 생성 (개발 환경)
   */
  private createTestApiKeys() {
    const testKeys: Array<{ name: string; tier: ApiTier }> = [
      { name: 'Test Free Tier', tier: 'free' },
      { name: 'Test Basic Tier', tier: 'basic' },
      { name: 'Test Pro Tier', tier: 'pro' },
    ];

    testKeys.forEach(({ name, tier }) => {
      const key = this.generateApiKey(name, tier, null);
      log.info(`[API Keys] Created test key: ${key.substring(0, 16)}... (${tier})`);
    });
  }

  /**
   * API 키 생성
   */
  generateApiKey(name: string, tier: ApiTier, expiresAt: Date | null = null): string {
    // 안전한 랜덤 키 생성: saju_prod_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const randomBytes = crypto.randomBytes(24);
    const prefix = process.env.NODE_ENV === 'production' ? 'saju_prod' : 'saju_dev';
    const key = `${prefix}_${randomBytes.toString('hex')}`;

    const limits = API_TIER_LIMITS[tier];
    const apiKey: ApiKey = {
      key,
      name,
      tier,
      dailyLimit: limits.daily,
      monthlyLimit: limits.monthly,
      createdAt: new Date(),
      expiresAt,
      isActive: true,
    };

    this.apiKeys.set(key, apiKey);
    log.info(`[API Keys] Generated new API key for ${name} (${tier})`);

    return key;
  }

  /**
   * API 키 검증
   */
  validateApiKey(key: string): { valid: boolean; apiKey?: ApiKey; error?: string } {
    const apiKey = this.apiKeys.get(key);

    if (!apiKey) {
      return { valid: false, error: 'Invalid API key' };
    }

    if (!apiKey.isActive) {
      return { valid: false, error: 'API key is inactive' };
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return { valid: false, error: 'API key has expired' };
    }

    return { valid: true, apiKey };
  }

  /**
   * 사용량 확인 (Rate Limiting)
   */
  checkRateLimit(key: string): { allowed: boolean; limit: number; remaining: number; resetAt: Date } {
    const apiKey = this.apiKeys.get(key);
    if (!apiKey) {
      return { allowed: false, limit: 0, remaining: 0, resetAt: new Date() };
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const usageKey = `${key}:${today}`;
    const usage = this.usage.get(usageKey) || { key, date: today, count: 0, monthlyCount: 0 };

    // Daily limit check
    const dailyAllowed = usage.count < apiKey.dailyLimit;
    const dailyRemaining = Math.max(0, apiKey.dailyLimit - usage.count);

    // Monthly limit check
    const monthlyAllowed = usage.monthlyCount < apiKey.monthlyLimit;

    // Reset time (다음 날 00:00 UTC)
    const resetAt = new Date(today);
    resetAt.setDate(resetAt.getDate() + 1);
    resetAt.setUTCHours(0, 0, 0, 0);

    return {
      allowed: dailyAllowed && monthlyAllowed,
      limit: apiKey.dailyLimit,
      remaining: dailyRemaining,
      resetAt,
    };
  }

  /**
   * 사용량 증가
   */
  incrementUsage(key: string) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const usageKey = `${key}:${today}`;
    const usage = this.usage.get(usageKey) || { key, date: today, count: 0, monthlyCount: 0 };

    usage.count += 1;
    usage.monthlyCount += 1;
    this.usage.set(usageKey, usage);

    log.info(`[API Usage] ${key.substring(0, 16)}...: ${usage.count}/${this.apiKeys.get(key)?.dailyLimit}`);
  }

  /**
   * API 키 비활성화
   */
  deactivateApiKey(key: string): boolean {
    const apiKey = this.apiKeys.get(key);
    if (!apiKey) return false;

    apiKey.isActive = false;
    this.apiKeys.set(key, apiKey);
    log.info(`[API Keys] Deactivated API key: ${key.substring(0, 16)}...`);
    return true;
  }

  /**
   * API 키 정보 조회
   */
  getApiKeyInfo(key: string): ApiKey | null {
    return this.apiKeys.get(key) || null;
  }

  /**
   * 사용 통계 조회
   */
  getUsageStats(key: string): { daily: number; monthly: number; tier: ApiTier } {
    const apiKey = this.apiKeys.get(key);
    if (!apiKey) {
      return { daily: 0, monthly: 0, tier: 'free' };
    }

    const today = new Date().toISOString().split('T')[0];
    const usageKey = `${key}:${today}`;
    const usage = this.usage.get(usageKey) || { key, date: today, count: 0, monthlyCount: 0 };

    return {
      daily: usage.count,
      monthly: usage.monthlyCount,
      tier: apiKey.tier,
    };
  }

  /**
   * 모든 API 키 목록 조회 (관리자용)
   */
  getAllApiKeys(): ApiKey[] {
    return Array.from(this.apiKeys.values());
  }
}

export const apiKeyService = new ApiKeyService();
