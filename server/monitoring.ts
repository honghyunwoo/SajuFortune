/**
 * 성능 모니터링 및 메트릭 수집 시스템
 * 상용화를 위한 실시간 모니터링
 */

import { Request, Response, NextFunction } from 'express';

export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  activeConnections: number;
  memoryUsage: NodeJS.MemoryUsage;
  uptime: number;
  lastUpdated: Date;
}

export interface RequestMetrics {
  method: string;
  path: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

class MonitoringService {
  private static instance: MonitoringService;
  private metrics: PerformanceMetrics;
  private requestHistory: RequestMetrics[] = [];
  private maxHistorySize = 1000;

  private constructor() {
    this.metrics = {
      requestCount: 0,
      averageResponseTime: 0,
      errorRate: 0,
      activeConnections: 0,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      lastUpdated: new Date()
    };
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * 요청 메트릭 기록
   */
  recordRequest(req: Request, res: Response, responseTime: number): void {
    const requestMetric: RequestMetrics = {
      method: req.method,
      path: req.path,
      responseTime,
      statusCode: res.statusCode,
      timestamp: new Date(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };

    // 요청 히스토리에 추가
    this.requestHistory.push(requestMetric);
    
    // 히스토리 크기 제한
    if (this.requestHistory.length > this.maxHistorySize) {
      this.requestHistory = this.requestHistory.slice(-this.maxHistorySize);
    }

    // 메트릭 업데이트
    this.updateMetrics(requestMetric);
  }

  /**
   * 메트릭 업데이트
   */
  private updateMetrics(requestMetric: RequestMetrics): void {
    this.metrics.requestCount++;
    
    // 평균 응답 시간 계산
    const totalResponseTime = this.requestHistory.reduce((sum, req) => sum + req.responseTime, 0);
    this.metrics.averageResponseTime = totalResponseTime / this.requestHistory.length;

    // 에러율 계산
    const errorCount = this.requestHistory.filter(req => req.statusCode >= 400).length;
    this.metrics.errorRate = (errorCount / this.requestHistory.length) * 100;

    // 메모리 사용량 업데이트
    this.metrics.memoryUsage = process.memoryUsage();
    this.metrics.uptime = process.uptime();
    this.metrics.lastUpdated = new Date();
  }

  /**
   * 현재 메트릭 가져오기
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 요청 히스토리 가져오기
   */
  getRequestHistory(limit: number = 100): RequestMetrics[] {
    return this.requestHistory.slice(-limit);
  }

  /**
   * 성능 경고 체크
   */
  checkPerformanceWarnings(): string[] {
    const warnings: string[] = [];
    
    if (this.metrics.averageResponseTime > 1000) {
      warnings.push(`높은 응답 시간: ${this.metrics.averageResponseTime.toFixed(2)}ms`);
    }
    
    if (this.metrics.errorRate > 5) {
      warnings.push(`높은 에러율: ${this.metrics.errorRate.toFixed(2)}%`);
    }
    
    const memoryUsageMB = this.metrics.memoryUsage.heapUsed / 1024 / 1024;
    if (memoryUsageMB > 500) {
      warnings.push(`높은 메모리 사용량: ${memoryUsageMB.toFixed(2)}MB`);
    }

    return warnings;
  }

  /**
   * API 엔드포인트별 통계
   */
  getEndpointStats(): Record<string, {
    count: number;
    averageResponseTime: number;
    errorCount: number;
  }> {
    const stats: Record<string, {
      count: number;
      totalResponseTime: number;
      errorCount: number;
    }> = {};

    this.requestHistory.forEach(req => {
      const key = `${req.method} ${req.path}`;
      if (!stats[key]) {
        stats[key] = { count: 0, totalResponseTime: 0, errorCount: 0 };
      }
      
      stats[key].count++;
      stats[key].totalResponseTime += req.responseTime;
      if (req.statusCode >= 400) {
        stats[key].errorCount++;
      }
    });

    // 평균 응답 시간 계산
    const result: Record<string, {
      count: number;
      averageResponseTime: number;
      errorCount: number;
    }> = {};

    Object.entries(stats).forEach(([endpoint, data]) => {
      result[endpoint] = {
        count: data.count,
        averageResponseTime: data.totalResponseTime / data.count,
        errorCount: data.errorCount
      };
    });

    return result;
  }
}

// 싱글톤 인스턴스
export const monitoringService = MonitoringService.getInstance();

// 성능 모니터링 미들웨어
export const performanceMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    monitoringService.recordRequest(req, res, responseTime);
  });

  next();
};

/**
 * PRD 준수 헬스체크 엔드포인트
 * PRD 9.6: DB/Redis 연결 상태 포함
 */
export const healthCheck = async (req: Request, res: Response) => {
  const metrics = monitoringService.getMetrics();
  const warnings = monitoringService.checkPerformanceWarnings();
  
  // DB 연결 확인
  let dbStatus: 'ok' | 'error' = 'ok';
  let dbLatency = 0;
  try {
    const dbStartTime = Date.now();
    // Import storage dynamically to avoid circular dependency
    const { storage } = await import('./storage');
    await storage.getUser('health-check-test'); // Dummy query
    dbLatency = Date.now() - dbStartTime;
  } catch (error) {
    dbStatus = 'error';
    warnings.push('Database connection failed');
  }

  // Redis 연결 확인
  let redisStatus: 'ok' | 'error' | 'disabled' = 'disabled';
  let redisLatency = 0;
  try {
    const redisStartTime = Date.now();
    const { cacheService } = await import('./cache');
    // Ping test - use simple get/set
    const testKey = 'health-check:test';
    await cacheService.set(testKey, { test: true }, 10);
    await cacheService.get(testKey);
    redisLatency = Date.now() - redisStartTime;
    redisStatus = 'ok';
  } catch (error) {
    if (process.env.REDIS_URL) {
      redisStatus = 'error';
      warnings.push('Redis connection failed');
    }
  }

  const overallStatus = 
    dbStatus === 'error' ? 'unhealthy' :
    warnings.length > 2 ? 'degraded' :
    warnings.length > 0 ? 'warning' :
    'healthy';
  
  const health = {
    status: overallStatus,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.round(metrics.uptime),
    checks: {
      database: {
        status: dbStatus,
        latency: dbLatency
      },
      redis: {
        status: redisStatus,
        latency: redisLatency
      }
    },
    metrics: {
      requestCount: metrics.requestCount,
      averageResponseTime: Math.round(metrics.averageResponseTime),
      errorRate: Math.round(metrics.errorRate * 100) / 100,
      memoryUsage: {
        heapUsed: Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(metrics.memoryUsage.heapTotal / 1024 / 1024),
        rss: Math.round(metrics.memoryUsage.rss / 1024 / 1024)
      }
    },
    warnings
  };

  // Kubernetes Liveness Probe: 200 반환
  // Kubernetes Readiness Probe: DB/Redis 상태 반영
  const statusCode = overallStatus === 'unhealthy' ? 503 : 200;
  res.status(statusCode).json(health);
};

// 메트릭 엔드포인트 (관리자용)
export const metricsEndpoint = (req: Request, res: Response) => {
  const metrics = monitoringService.getMetrics();
  const endpointStats = monitoringService.getEndpointStats();
  const recentRequests = monitoringService.getRequestHistory(50);
  
  res.json({
    metrics,
    endpointStats,
    recentRequests
  });
};
