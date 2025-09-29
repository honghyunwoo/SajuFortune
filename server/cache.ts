/**
 * 성능 최적화를 위한 캐싱 시스템
 * 사주 계산 결과 캐싱으로 응답 속도 향상
 */

import NodeCache from 'node-cache';
import Redis from 'ioredis';

// 메모리 캐시 (개발용)
const memoryCache = new NodeCache({
  stdTTL: 3600, // 1시간
  checkperiod: 600, // 10분마다 만료된 항목 정리
  useClones: false
});

// Redis 클라이언트 (프로덕션용)
let redisClient: Redis | null = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export class CacheService {
  private static instance: CacheService;
  private isRedisAvailable = false;

  private constructor() {
    if (redisClient) {
      redisClient.ping().then(() => {
        this.isRedisAvailable = true;
        console.log('✅ Redis cache connected');
      }).catch(() => {
        console.log('⚠️ Redis not available, using memory cache');
      });
    }
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * 캐시에서 값 가져오기
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isRedisAvailable && redisClient) {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        return memoryCache.get<T>(key) || null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * 캐시에 값 저장하기
   */
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<boolean> {
    try {
      if (this.isRedisAvailable && redisClient) {
        await redisClient.setex(key, ttl, JSON.stringify(value));
        return true;
      } else {
        return memoryCache.set(key, value, ttl);
      }
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * 캐시에서 값 삭제하기
   */
  async delete(key: string): Promise<boolean> {
    try {
      if (this.isRedisAvailable && redisClient) {
        const result = await redisClient.del(key);
        return result > 0;
      } else {
        return memoryCache.del(key) > 0;
      }
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * 사주 계산 결과 캐시 키 생성
   */
  generateSajuCacheKey(birthData: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    calendarType: string;
  }): string {
    return `saju:${birthData.year}-${birthData.month}-${birthData.day}-${birthData.hour}-${birthData.minute}-${birthData.calendarType}`;
  }

  /**
   * 사주 계산 결과 캐싱
   */
  async cacheSajuResult(birthData: any, result: any): Promise<void> {
    const key = this.generateSajuCacheKey(birthData);
    await this.set(key, result, 7200); // 2시간 캐시
  }

  /**
   * 캐시된 사주 계산 결과 가져오기
   */
  async getCachedSajuResult(birthData: any): Promise<any | null> {
    const key = this.generateSajuCacheKey(birthData);
    return await this.get(key);
  }

  /**
   * 캐시 통계 정보
   */
  async getStats(): Promise<{
    type: 'memory' | 'redis';
    keys: number;
    memory?: any;
  }> {
    if (this.isRedisAvailable && redisClient) {
      const keys = await redisClient.dbsize();
      return { type: 'redis', keys };
    } else {
      const stats = memoryCache.getStats();
      return { 
        type: 'memory', 
        keys: stats.keys, 
        memory: stats 
      };
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const cacheService = CacheService.getInstance();

// 캐시 미들웨어
export const cacheMiddleware = (ttl: number = 3600) => {
  return async (req: any, res: any, next: any) => {
    const cacheKey = `api:${req.method}:${req.originalUrl}:${JSON.stringify(req.body)}`;
    
    try {
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return res.json(cached);
      }
    } catch (error) {
      console.error('Cache middleware error:', error);
    }

    // 원본 응답 함수 저장
    const originalJson = res.json;
    
    // 응답을 캐시에 저장
    res.json = function(body: any) {
      cacheService.set(cacheKey, body, ttl).catch(console.error);
      return originalJson.call(this, body);
    };

    next();
  };
};
