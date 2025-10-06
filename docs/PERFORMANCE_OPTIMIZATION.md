# 성능 최적화 가이드

## 🚀 구현된 최적화 사항

### 1. 캐싱 시스템 (cache.ts)

#### 메모리 캐시 (개발환경)
- **Node-Cache** 사용
- TTL: 1시간 (3600초)
- 사주 계산 결과 2시간 캐싱

#### Redis 캐시 (프로덕션)
- 환경변수 `REDIS_URL` 설정 시 자동 활성화
- 자동 재연결 및 오류 처리
- 최대 재시도 횟수: 3회

#### 캐시 키 전략
```typescript
saju:{year}-{month}-{day}-{hour}-{minute}-{calendarType}
```

### 2. 빌드 최적화

#### 코드 스플리팅
- Vite 자동 청크 분할
- React.lazy()를 통한 동적 임포트 권장

#### 번들 크기 최적화
- Tree shaking 활성화
- 미사용 코드 제거
- Production 빌드: `npm run build`

### 3. 프론트엔드 최적화

#### React 최적화
```typescript
// useMemo로 비용이 큰 계산 캐싱
const memoizedValue = useMemo(() =>
  expensiveCalculation(data),
  [data]
);

// useCallback으로 함수 재생성 방지
const handleSubmit = useCallback(() => {
  // 처리 로직
}, [dependencies]);

// React.memo로 불필요한 리렌더링 방지
const MemoizedComponent = React.memo(Component);
```

#### 이미지 최적화
- WebP 포맷 사용 권장
- Lazy loading 적용
- 적절한 이미지 크기 설정

### 4. 백엔드 최적화

#### API 응답 시간
- 평균 응답 시간: < 500ms (캐시 히트)
- 평균 응답 시간: < 2000ms (캐시 미스)

#### 데이터베이스 쿼리
- 인덱스 활용
- 필요한 컬럼만 SELECT
- 페이지네이션 구현

#### Compression
```typescript
// gzip 압축 (server/index.ts)
import compression from 'compression';
app.use(compression());
```

### 5. 네트워크 최적화

#### HTTP/2
- 프로덕션 서버에서 HTTP/2 활성화 권장

#### CDN 사용
- 정적 에셋 CDN 배포
- 지리적으로 분산된 캐싱

## 📊 성능 벤치마크

### 목표 지표
- 페이지 로딩: < 3초
- 사주 계산 API: < 2초
- TTI (Time to Interactive): < 5초
- FCP (First Contentful Paint): < 1.5초
- LCP (Largest Contentful Paint): < 2.5초

### 측정 도구
- Lighthouse
- WebPageTest
- Chrome DevTools Performance
- Playwright 성능 테스트

## 🛠️ 추가 최적화 방안

### 1. 서버 사이드 캐싱 강화
```typescript
// 사주 계산 결과 Redis 캐싱
export async function calculateSajuWithCache(birthData: BirthData) {
  const cacheKey = cacheService.generateSajuCacheKey(birthData);

  // 캐시 확인
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    return cached;
  }

  // 계산 수행
  const result = await calculatePremiumSaju(...);

  // 캐시 저장
  await cacheService.set(cacheKey, result, 7200); // 2시간

  return result;
}
```

### 2. Database Connection Pooling
```typescript
// Drizzle ORM 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 3. 정적 리소스 캐싱
```typescript
// Express 정적 파일 캐싱
app.use(express.static('public', {
  maxAge: '1y', // 1년 캐싱
  etag: true,
  lastModified: true,
}));
```

### 4. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도하세요.'
});

app.use('/api/', limiter);
```

### 5. 백그라운드 작업
```typescript
// 무거운 계산은 백그라운드에서 처리
import { Worker } from 'worker_threads';

const worker = new Worker('./worker.js', {
  workerData: { birthData }
});

worker.on('message', (result) => {
  // 결과 처리
});
```

## 📈 모니터링

### 1. 성능 메트릭 수집
```typescript
// 응답 시간 로깅
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });

  next();
});
```

### 2. 에러 모니터링
- Sentry 통합 (이미 구현됨)
- 에러율 추적
- 성능 저하 알림

### 3. 캐시 히트율 모니터링
```typescript
const stats = await cacheService.getStats();
console.log(`Cache hit rate: ${stats.hitRate}%`);
```

## ⚡ 실행 방법

### 개발 환경
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 성능 테스트 실행
```bash
# Playwright 성능 테스트
npx playwright test e2e/saju-fortune.spec.ts --grep "성능 테스트"

# Lighthouse CI
npx lhci autorun
```

## 🔧 환경 변수

### Redis 캐싱 활성화
```env
REDIS_URL=redis://localhost:6379
```

### 프로덕션 최적화
```env
NODE_ENV=production
```

## 📝 체크리스트

- [x] 메모리 캐싱 구현 (NodeCache)
- [x] Redis 캐싱 지원
- [x] Compression 미들웨어
- [x] 번들 최적화 (Vite)
- [x] 타입스크립트 최적화
- [ ] CDN 배포
- [ ] HTTP/2 활성화
- [ ] Rate Limiting 구현
- [ ] Database Connection Pooling 최적화
- [ ] 이미지 최적화 (WebP, lazy loading)
- [ ] Service Worker (PWA)
- [ ] 백그라운드 작업 처리

## 🎯 다음 단계

1. **프로덕션 배포 전**
   - Lighthouse 점수 90+ 달성
   - 로드 테스트 수행
   - 에러율 < 0.1% 확인

2. **모니터링 설정**
   - Sentry 알림 구성
   - 성능 대시보드 구축
   - 사용자 피드백 수집

3. **지속적 개선**
   - A/B 테스트
   - 사용자 행동 분석
   - 성능 병목 지점 식별 및 개선
