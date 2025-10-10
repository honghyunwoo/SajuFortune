/**
 * 성능 최적화를 위한 캐싱 시스템
 * 사주 계산 결과 캐싱으로 응답 속도 향상
 */

import NodeCache from 'node-cache';
import Redis from 'ioredis';

// 메모리 캐시 (개발용) - LRU 방식으로 메모리 누수 방지
const memoryCache = new NodeCache({
  stdTTL: 3600, // 1시간
  checkperiod: 600, // 10분마다 만료된 항목 정리
  useClones: false,
  maxKeys: 1000, // 최대 1000개 키 저장 (메모리 누수 방지)
  deleteOnExpire: true // 만료된 항목 자동 삭제
});

// Redis 클라이언트 (프로덕션용)
let redisClient: Redis | null = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisClient.on('error', (err) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Redis connection error:', err);
    }
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
        if (process.env.NODE_ENV !== 'test') {
          console.log('✅ Redis cache connected');
        }
      }).catch(() => {
        if (process.env.NODE_ENV !== 'test') {
          console.log('⚠️ Redis not available, using memory cache');
        }
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Cache get error:', error);
    }
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Cache set error:', error);
    }
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Cache delete error:', error);
    }
    return false;
  }
  }

  /**
   * 패턴에 매칭되는 모든 키 삭제 (캐시 무효화)
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      if (this.isRedisAvailable && redisClient) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          const result = await redisClient.del(...keys);
          return result;
        }
        return 0;
      } else {
        // Memory cache의 경우 모든 키를 순회하며 패턴 매칭
        const allKeys = memoryCache.keys();
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        const matchedKeys = allKeys.filter(key => regex.test(key));
        return memoryCache.del(matchedKeys);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Cache deletePattern error:', error);
      }
      return 0;
    }
  }

  /**
   * 전체 캐시 초기화
   */
  async flush(): Promise<boolean> {
    try {
      if (this.isRedisAvailable && redisClient) {
        await redisClient.flushdb();
        return true;
      } else {
        memoryCache.flushAll();
        return true;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Cache flush error:', error);
      }
      return false;
    }
  }

  /**
   * 사주 계산 결과 캐시 키 생성
   * PRD 6.2: 버전 기반 캐시 키로 업그레이드
   */
  generateSajuCacheKey(birthData: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    calendarType: string;
  }): string {
    const VERSION = '1.0.0'; // 알고리즘 버전 (변경 시 모든 캐시 무효화)
    return `saju:v${VERSION}:${birthData.year}:${birthData.month}:${birthData.day}:${birthData.hour}:${birthData.minute}:${birthData.calendarType}`;
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
    const result = await this.get(key);
    
    if (result) {
      this.recordCacheHit();
    } else {
      this.recordCacheMiss();
    }
    
    return result;
  }

  /**
   * 캐시 통계 정보 (PRD 6.2: Hit Rate 포함)
   */
  private cacheHits = 0;
  private cacheMisses = 0;

  recordCacheHit(): void {
    this.cacheHits++;
  }

  recordCacheMiss(): void {
    this.cacheMisses++;
  }

  async getStats(): Promise<{
    type: 'memory' | 'redis';
    keys: number;
    hits: number;
    misses: number;
    hitRate: number;
    memory?: any;
  }> {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;

    if (this.isRedisAvailable && redisClient) {
      const keys = await redisClient.dbsize();
      return { 
        type: 'redis', 
        keys,
        hits: this.cacheHits,
        misses: this.cacheMisses,
        hitRate: Math.round(hitRate * 100) / 100
      };
    } else {
      const stats = memoryCache.getStats();
      return { 
        type: 'memory', 
        keys: stats.keys,
        hits: this.cacheHits,
        misses: this.cacheMisses,
        hitRate: Math.round(hitRate * 100) / 100,
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Cache middleware error:', error);
      }
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
