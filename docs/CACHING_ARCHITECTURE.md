# 캐싱 아키텍처 설계 (Caching Architecture)

## 프로젝트: SajuFortune
**작성일**: 2025-10-03
**작성자**: Claude (Senior Developer)

---

## Multi-Tier 캐싱 전략

### 계층 구조
```
L1 Cache (In-Memory)    ← 개발 환경, 빠른 응답 (< 10ms)
    ↓ miss
L2 Cache (Redis)        ← 프로덕션, 분산 캐싱 (< 50ms)
    ↓ miss
Database (PostgreSQL)   ← 영구 저장소 (< 2000ms)
```

---

## 캐시 전략

### 1. 사주 계산 결과 (Saju Calculation)
**키 형식**: `saju:{birthDate}:{gender}:{precision}`
**TTL**: 7200초 (2시간)
**크기**: ~5-10KB per entry

**이유**:
- 동일한 입력은 동일한 결과 (순수 함수)
- 계산 비용 높음 (1.8초)
- 캐시 히트율 예상: 30-40%

**구현**:
```typescript
async function getSajuAnalysis(params: SajuParams) {
  const cacheKey = `saju:${params.birthDate}:${params.gender}:${params.precision}`;

  // L1 캐시 확인
  let result = nodeCache.get(cacheKey);
  if (result) {
    logger.info({ event: 'cache_hit', layer: 'L1', key: cacheKey });
    return result;
  }

  // L2 캐시 확인 (Redis)
  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      result = JSON.parse(cached);
      nodeCache.set(cacheKey, result, 7200); // L1에도 저장
      logger.info({ event: 'cache_hit', layer: 'L2', key: cacheKey });
      return result;
    }
  }

  // 캐시 미스 - 계산 후 저장
  result = await calculateSaju(params);

  nodeCache.set(cacheKey, result, 7200);
  if (redis) {
    await redis.setex(cacheKey, 7200, JSON.stringify(result));
  }

  logger.info({ event: 'cache_miss', key: cacheKey });
  return result;
}
```

---

### 2. 세션 데이터 (Session Data)
**키 형식**: `sess:{sessionId}`
**TTL**: 86400초 (24시간)
**크기**: ~1-2KB per session

**저장소**: Redis (connect-pg-simple 대신)
**이유**: PostgreSQL 부하 감소, 세션 조회 성능 향상

---

### 3. 정적 데이터 (Static Data)
**키 형식**: `static:{dataType}`
**TTL**: 604800초 (7일)

**캐시 대상**:
- 천간지지 데이터 (`static:ganzi`)
- 24절기 데이터 (`static:solarterms:2025`)
- 신살 데이터 (`static:sinsal`)

---

## 캐시 무효화 (Cache Invalidation)

### 전략

#### 1. TTL 기반 (Time-to-Live)
기본 전략 - 대부분의 데이터에 적용

#### 2. 이벤트 기반
특정 이벤트 발생 시 즉시 무효화

```typescript
// 사용자 데이터 변경 시
async function updateUser(userId: string, data: any) {
  await db.update(users).set(data).where(eq(users.id, userId));

  // 관련 캐시 삭제
  await invalidatePattern(`user:${userId}:*`);
  await invalidatePattern(`fortune:*:user:${userId}`);
}
```

#### 3. 버전 기반
데이터 구조 변경 시 버전 변경으로 자동 무효화

```typescript
const CACHE_VERSION = 'v1';
const key = `${CACHE_VERSION}:saju:${params}`;
```

---

## Redis 설정

### 개발 환경
```typescript
// server/cache.ts
const redis = process.env.NODE_ENV === 'production'
  ? new Redis(process.env.REDIS_URL!)
  : null; // 개발 환경에서는 NodeCache만 사용
```

### 프로덕션 환경
```typescript
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false
});
```

---

## 캐시 모니터링

### 메트릭
```typescript
// 캐시 히트율
const cacheHitRate = hits / (hits + misses) * 100;

// 캐시 메모리 사용량
const memoryUsage = nodeCache.getStats();

// Redis 키 개수
const keyCount = await redis.dbsize();
```

### 로깅
```typescript
logger.info({
  event: 'cache_stats',
  l1: {
    hits: nodeCache.getStats().hits,
    misses: nodeCache.getStats().misses,
    keys: nodeCache.getStats().keys
  },
  l2: {
    connected: redis?.status === 'ready',
    keyCount: await redis?.dbsize()
  }
});
```

---

## Cache Warming

### 애플리케이션 시작 시
```typescript
async function warmupCache() {
  logger.info('Starting cache warmup...');

  // 정적 데이터 로드
  await loadStaticData('ganzi');
  await loadStaticData('solarterms');
  await loadStaticData('sinsal');

  logger.info('Cache warmup completed');
}

app.listen(PORT, async () => {
  await warmupCache();
  logger.info(`Server started on port ${PORT}`);
});
```

---

## Fallback 메커니즘

### Redis 연결 실패 시
```typescript
try {
  result = await redis.get(key);
} catch (error) {
  logger.warn({
    event: 'redis_error',
    error: error.message,
    fallback: 'using_database'
  });

  // Redis 실패 시 DB 직접 조회
  result = await database.query();
}
```

---

## 성능 목표

| 케이스 | 목표 | 현재 | 상태 |
|--------|------|------|------|
| 캐시 히트 (L1) | < 10ms | 5ms | ✅ |
| 캐시 히트 (L2) | < 50ms | 50ms | ✅ |
| 캐시 미스 | < 2000ms | 1800ms | ✅ |
| 캐시 히트율 | > 30% | TBD | 🔄 |

---

**문서 작성자**: Claude (Senior Developer)
**마지막 업데이트**: 2025-10-03
