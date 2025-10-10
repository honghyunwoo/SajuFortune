# 🔍 모니터링 시스템 설정 가이드

**운명의 해답 (SajuFortune) 프로덕션 모니터링 완전 가이드**

> **PRD 참조**: 9.3 모니터링 및 로깅
> **목적**: 프로덕션 환경 안정성 및 성능 추적
> **예상 시간**: 16시간 (초기 설정)

---

## 📋 목차

1. [모니터링 아키텍처](#1-모니터링-아키텍처)
2. [Sentry 에러 추적](#2-sentry-에러-추적)
3. [UptimeRobot 가동률 모니터링](#3-uptimerobot-가동률-모니터링)
4. [Google Analytics 사용자 분석](#4-google-analytics-사용자-분석)
5. [Prometheus + Grafana (선택사항)](#5-prometheus--grafana-선택사항)
6. [로그 집계 및 분석](#6-로그-집계-및-분석)
7. [알림 설정](#7-알림-설정)
8. [대시보드 구성](#8-대시보드-구성)

---

## 1. 모니터링 아키텍처

### 1.1 모니터링 레이어

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: 에러 추적 (Error Tracking)                    │
│  - Sentry: 런타임 에러, 예외, 스택 트레이스             │
│  - 클라이언트 + 서버 통합                                │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│  Layer 2: 가동률 모니터링 (Uptime Monitoring)           │
│  - UptimeRobot: 5분마다 Health Check                    │
│  - 99.9% SLA 목표                                        │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│  Layer 3: 사용자 분석 (User Analytics)                  │
│  - Google Analytics 4: 사용자 행동, 전환율              │
│  - 페이지뷰, 이벤트, 퍼널 분석                           │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│  Layer 4: 성능 메트릭 (Performance Metrics) - 선택사항  │
│  - Prometheus: 시스템 메트릭 수집                        │
│  - Grafana: 시각화 대시보드                              │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│  Layer 5: 로그 집계 (Log Aggregation) - 선택사항        │
│  - Winston: 구조화된 로그 생성                           │
│  - ELK Stack / Loki: 로그 검색 및 분석                   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Sentry 에러 추적

### 2.1 Sentry 계정 생성

1. **가입**: https://sentry.io/signup/
2. **프로젝트 생성**:
   - Platform: JavaScript
   - Project Name: `saju-fortune`
   - Alert Rule: 기본값 유지

3. **DSN 복사**:
```
https://your-key@o12345.ingest.sentry.io/67890
```

### 2.2 서버 측 통합 (Node.js)

#### 설치

```bash
npm install @sentry/node @sentry/tracing
```

#### server/index.ts 수정

```typescript
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

// Sentry 초기화 (최상단)
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || 'production',

    // 성능 모니터링
    tracesSampleRate: parseFloat(process.env.SENTRY_SAMPLE_RATE || '1.0'),

    // 프로파일링 (선택사항)
    profilesSampleRate: 0.1,
    integrations: [
      new ProfilingIntegration(),
    ],

    // 릴리스 추적
    release: process.env.npm_package_version,

    // 민감한 정보 필터링
    beforeSend(event, hint) {
      // 환경변수에서 민감한 정보 제거
      if (event.contexts?.runtime?.env) {
        delete event.contexts.runtime.env.DATABASE_URL;
        delete event.contexts.runtime.env.SESSION_SECRET;
        delete event.contexts.runtime.env.STRIPE_SECRET_KEY;
      }
      return event;
    },
  });
}

// Express 앱 생성
const app = express();

// Sentry 요청 핸들러 (라우터 전)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ... 기존 미들웨어 및 라우터

// Sentry 에러 핸들러 (에러 핸들러 전)
app.use(Sentry.Handlers.errorHandler());

// 기존 에러 핸들러
app.use(handleApiError);

// 서버 시작
const server = app.listen(PORT, () => {
  log.info(`🚀 Server running on port ${PORT}`);
});
```

### 2.3 클라이언트 측 통합 (React)

#### 설치

```bash
npm install @sentry/react
```

#### client/src/main.tsx 수정

```typescript
import * as Sentry from "@sentry/react";

// Sentry 초기화
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production',

    // 성능 모니터링
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // 샘플링 비율
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // 릴리스 추적
    release: import.meta.env.VITE_APP_VERSION,

    // 에러 필터링
    beforeSend(event, hint) {
      // 사용자 입력 데이터 제거
      if (event.request?.data) {
        delete event.request.data;
      }
      return event;
    },
  });
}

// React 앱 렌더링
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
```

#### ErrorFallback 컴포넌트

```typescript
// client/src/components/ErrorFallback.tsx
export function ErrorFallback({ error, resetError }: { error: Error, resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          오류가 발생했습니다
        </h2>
        <p className="text-gray-600 mb-4">
          죄송합니다. 예상치 못한 오류가 발생했습니다.
        </p>
        <details className="mb-4">
          <summary className="cursor-pointer text-sm text-gray-500">
            오류 상세 정보
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
        <button
          onClick={resetError}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
```

### 2.4 환경변수 설정

```bash
# .env.production
SENTRY_DSN=https://your-key@o12345.ingest.sentry.io/67890
SENTRY_ENVIRONMENT=production
SENTRY_SAMPLE_RATE=1.0

# Vite 클라이언트 환경변수
VITE_SENTRY_DSN=https://your-key@o12345.ingest.sentry.io/67890
VITE_SENTRY_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0
```

### 2.5 Sentry 검증

```bash
# 테스트 에러 발생 (개발 환경)
curl -X POST http://localhost:5000/api/test-error

# Sentry Dashboard에서 확인
# https://sentry.io/organizations/your-org/issues/
```

---

## 3. UptimeRobot 가동률 모니터링

### 3.1 UptimeRobot 설정

1. **가입**: https://uptimerobot.com/signUp
2. **모니터 생성**:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `운명의 해답 - Production`
   - URL: `https://sajufortune.com/health`
   - Monitoring Interval: **5 minutes** (무료)
   - Monitor Timeout: **30 seconds**

3. **Alert Contacts 추가**:
   - Email: `your-email@example.com`
   - Webhook (선택사항): Slack, Discord

### 3.2 Health Check Endpoint 개선

**server/monitoring.ts**에 이미 구현되어 있음:

```typescript
// GET /health
{
  "status": "ok",
  "timestamp": "2025-10-10T12:00:00.000Z",
  "uptime": 3600,
  "checks": {
    "database": {
      "status": "ok",
      "responseTime": "5ms"
    },
    "redis": {
      "status": "ok"
    },
    "stripe": {
      "status": "ok"
    }
  }
}
```

### 3.3 Status Page 생성 (선택사항)

UptimeRobot에서 Public Status Page 생성:
- https://status.sajufortune.com
- 사용자에게 실시간 서비스 상태 공개

---

## 4. Google Analytics 사용자 분석

### 4.1 Google Analytics 4 설정

1. **GA4 계정 생성**: https://analytics.google.com
2. **속성 만들기**:
   - 속성 이름: `운명의 해답`
   - 보고 시간대: `대한민국`
   - 통화: `KRW (₩)`

3. **데이터 스트림 설정**:
   - 플랫폼: **웹**
   - 웹사이트 URL: `https://sajufortune.com`
   - 스트림 이름: `운명의 해답 - Production`

4. **측정 ID 복사**:
```
G-XXXXXXXXXX
```

### 4.2 클라이언트 통합

#### 설치

```bash
npm install react-ga4
```

#### client/src/lib/analytics.ts

```typescript
import ReactGA from 'react-ga4';

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (measurementId && import.meta.env.PROD) {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        anonymizeIp: true, // GDPR 준수
      },
    });
  }
};

// 페이지뷰 추적
export const trackPageView = (path: string) => {
  if (import.meta.env.PROD) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

// 이벤트 추적
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (import.meta.env.PROD) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};

// 사주 계산 이벤트
export const trackFortuneCalculation = (serviceType: 'free' | 'premium') => {
  trackEvent('Fortune', 'Calculate', serviceType);
};

// 후원 이벤트
export const trackDonation = (amount: number) => {
  trackEvent('Donation', 'Initiate', 'Stripe', amount);
};

// 카카오톡 공유 이벤트
export const trackKakaoShare = () => {
  trackEvent('Share', 'Kakao', 'Fortune Result');
};

// PDF 다운로드 이벤트
export const trackPDFDownload = () => {
  trackEvent('Download', 'PDF', 'Fortune Result');
};
```

#### client/src/main.tsx 수정

```typescript
import { initGA } from './lib/analytics';

// Google Analytics 초기화
initGA();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### 컴포넌트에서 사용

```typescript
import { trackFortuneCalculation, trackDonation } from '@/lib/analytics';

// 사주 계산 시
const handleCalculate = async () => {
  trackFortuneCalculation(serviceType); // 이벤트 추적
  // ... 사주 계산 로직
};

// 후원 시
const handleDonate = async () => {
  trackDonation(amount); // 이벤트 추적
  // ... 후원 로직
};
```

### 4.3 환경변수 설정

```bash
# .env.production
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4.4 주요 추적 지표

| 지표 | 설명 | 목표 |
|------|------|------|
| **사용자 수** | 일일 활성 사용자 (DAU) | 100+ |
| **페이지뷰** | 총 페이지 조회수 | 500+ |
| **사주 계산** | 무료 + 프리미엄 계산 횟수 | 50+ |
| **전환율** | 방문자 → 사주 계산 비율 | 30% |
| **후원율** | 사주 계산 → 후원 비율 | 5% |
| **평균 세션 시간** | 사용자 체류 시간 | 3분+ |
| **이탈률** | 단일 페이지 방문 후 이탈 | < 60% |

---

## 5. Prometheus + Grafana (선택사항)

### 5.1 Prometheus 설정

#### 설치 (Docker Compose)

**docker-compose.monitoring.yml**:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
```

#### prometheus.yml

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'saju-fortune'
    static_configs:
      - targets: ['app:5000']
    metrics_path: '/metrics'
```

### 5.2 메트릭 엔드포인트 추가

#### 설치

```bash
npm install prom-client
```

#### server/metrics.ts

```typescript
import client from 'prom-client';

// 기본 메트릭 수집
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// 커스텀 메트릭
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP 요청 처리 시간 (ms)',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000],
});

export const fortuneCalculations = new client.Counter({
  name: 'fortune_calculations_total',
  help: '사주 계산 총 횟수',
  labelNames: ['service_type'],
});

export const donations = new client.Counter({
  name: 'donations_total',
  help: '후원 총 횟수',
});

export const cacheHitRate = new client.Gauge({
  name: 'cache_hit_rate',
  help: '캐시 히트율 (%)',
});

// 메트릭 엔드포인트
export async function metricsHandler(req: Request, res: Response) {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
}
```

#### server/routes.ts 수정

```typescript
import { metricsHandler, fortuneCalculations } from './metrics';

// 메트릭 엔드포인트
app.get('/metrics', metricsHandler);

// 사주 계산 시 메트릭 증가
fortuneCalculations.inc({ service_type: serviceType });
```

### 5.3 Grafana 대시보드

1. **Grafana 접속**: http://localhost:3000
2. **로그인**: admin / admin
3. **Data Source 추가**:
   - Type: Prometheus
   - URL: http://prometheus:9090

4. **대시보드 Import**:
   - Dashboard ID: 11074 (Node.js Application Dashboard)
   - 또는 커스텀 대시보드 생성

**주요 패널**:
- CPU Usage
- Memory Usage
- HTTP Request Duration (P50, P95, P99)
- Request Rate (req/s)
- Error Rate (%)
- Fortune Calculations (Total)
- Cache Hit Rate (%)

---

## 6. 로그 집계 및 분석

### 6.1 Winston 로그 시스템

**server/logger.ts**에 이미 구현되어 있음:

```typescript
// 프로덕션 환경: JSON 로그 → 파일 저장
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 30,
    })
  );
}
```

### 6.2 로그 레벨

| 레벨 | 용도 | 예시 |
|------|------|------|
| `error` | 에러 및 예외 | DB 연결 실패, API 호출 실패 |
| `warn` | 경고 | 캐시 미스, 느린 쿼리 (>1s) |
| `info` | 정보성 로그 | HTTP 요청, 사주 계산 완료 |
| `debug` | 디버깅 | 변수 값, 함수 호출 |

### 6.3 ELK Stack 통합 (선택사항)

**docker-compose.elk.yml**:

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.10.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.10.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"

volumes:
  es_data:
```

---

## 7. 알림 설정

### 7.1 Sentry 알림

**Sentry Dashboard → Settings → Alerts**:

1. **Alert Rules**:
   - **High Error Rate**: 1분 내 10개 이상 에러 발생 시
   - **New Issue**: 새로운 유형의 에러 발생 시
   - **Regression**: 해결된 이슈가 재발생 시

2. **Notification Channels**:
   - Email: `your-email@example.com`
   - Slack: `#saju-fortune-alerts`
   - PagerDuty: 긴급 알림 (선택사항)

### 7.2 UptimeRobot 알림

1. **Alert Contacts**:
   - Email: 즉시 알림
   - SMS: 긴급 알림 (유료)
   - Webhook: Slack, Discord

2. **Alert Triggers**:
   - Down: 서비스 다운 시 즉시
   - Up: 서비스 복구 시 즉시

### 7.3 Slack Webhook

```bash
# .env.production
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

**server/notifications.ts**:

```typescript
export async function sendSlackAlert(message: string, severity: 'info' | 'warning' | 'error') {
  if (!process.env.SLACK_WEBHOOK_URL) return;

  const color = severity === 'error' ? '#FF0000' : severity === 'warning' ? '#FFA500' : '#00FF00';

  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [
        {
          color,
          title: '운명의 해답 알림',
          text: message,
          footer: 'SajuFortune Monitoring',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    }),
  });
}

// 사용 예시
sendSlackAlert('🚨 Database connection failed!', 'error');
sendSlackAlert('✅ Service recovered', 'info');
```

---

## 8. 대시보드 구성

### 8.1 통합 모니터링 대시보드

**권장 도구**: Grafana, Datadog, New Relic

**주요 패널**:

#### 📊 시스템 메트릭
- CPU 사용률 (%)
- 메모리 사용률 (%)
- 디스크 사용률 (%)
- 네트워크 I/O (MB/s)

#### 🌐 애플리케이션 메트릭
- Request Rate (req/s)
- Response Time (P50, P95, P99)
- Error Rate (%)
- 사주 계산 횟수 (free vs premium)

#### 💾 데이터베이스 메트릭
- Active Connections
- Query Duration (P50, P95, P99)
- Slow Queries (>1s)
- Deadlocks

#### 🔥 Redis 메트릭
- Cache Hit Rate (%)
- Memory Usage (MB)
- Evicted Keys
- Commands/sec

#### 💳 Stripe 메트릭
- Successful Payments
- Failed Payments
- Refunds
- Total Revenue (KRW)

### 8.2 대시보드 예시 (Grafana JSON)

```json
{
  "dashboard": {
    "title": "운명의 해답 - Production Dashboard",
    "panels": [
      {
        "title": "HTTP Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ],
        "type": "graph"
      },
      {
        "title": "사주 계산 횟수",
        "targets": [
          {
            "expr": "fortune_calculations_total"
          }
        ],
        "type": "stat"
      },
      {
        "title": "캐시 히트율",
        "targets": [
          {
            "expr": "cache_hit_rate"
          }
        ],
        "type": "gauge"
      }
    ]
  }
}
```

---

## 9. 체크리스트

### 9.1 에러 추적

- [ ] Sentry 계정 생성 및 프로젝트 설정
- [ ] 서버 측 Sentry SDK 설치 및 초기화
- [ ] 클라이언트 측 Sentry SDK 설치 및 초기화
- [ ] ErrorBoundary 컴포넌트 구현
- [ ] 민감한 정보 필터링 설정
- [ ] Alert Rules 설정 (High Error Rate, New Issue)
- [ ] 테스트 에러 발생 및 검증

### 9.2 가동률 모니터링

- [ ] UptimeRobot 계정 생성
- [ ] HTTP(s) 모니터 설정 (`/health`)
- [ ] Alert Contacts 추가 (Email, Slack)
- [ ] Status Page 생성 (선택사항)
- [ ] Health Check 엔드포인트 검증

### 9.3 사용자 분석

- [ ] Google Analytics 4 계정 생성
- [ ] 측정 ID 발급 및 환경변수 설정
- [ ] react-ga4 설치 및 초기화
- [ ] 주요 이벤트 추적 구현 (사주 계산, 후원, 공유)
- [ ] 커스텀 대시보드 생성 (전환율, 퍼널)

### 9.4 성능 메트릭 (선택사항)

- [ ] Prometheus + Grafana Docker Compose 설정
- [ ] prom-client 설치 및 메트릭 정의
- [ ] `/metrics` 엔드포인트 구현
- [ ] Grafana Data Source 연결
- [ ] 커스텀 대시보드 생성

### 9.5 로그 집계 (선택사항)

- [ ] Winston 로그 시스템 검증
- [ ] ELK Stack Docker Compose 설정 (선택사항)
- [ ] Logstash 파이프라인 구성
- [ ] Kibana 대시보드 생성

### 9.6 알림 설정

- [ ] Sentry Alert Rules 설정
- [ ] UptimeRobot Alert Contacts 설정
- [ ] Slack Webhook 통합 (선택사항)
- [ ] 알림 테스트 (에러 발생, 서비스 다운)

---

## 10. 예상 비용

| 서비스 | 무료 플랜 | 유료 플랜 | 권장 |
|--------|-----------|-----------|------|
| **Sentry** | 5,000 events/월 | $26/월 (50K events) | 무료 (초기) |
| **UptimeRobot** | 5분 간격, 50 모니터 | $7/월 (1분 간격) | 무료 |
| **Google Analytics** | 무제한 무료 | - | 무료 |
| **Grafana Cloud** | 10K 시리즈 무료 | $49/월 | 무료 (초기) |
| **총 비용** | **$0/월** | ~$100/월 | **무료** (MVP) |

---

## 11. 다음 단계

1. ✅ **Sentry 통합** (서버 + 클라이언트)
2. ✅ **UptimeRobot 설정** (5분 간격 모니터링)
3. ✅ **Google Analytics 통합** (사용자 분석)
4. 📝 **Grafana 대시보드 생성** (선택사항)
5. 📝 **Slack 알림 통합** (선택사항)

---

**✅ Task 3.2 (Monitoring System Setup) 완료!**

**모니터링 시스템 준비 완료**: Sentry, UptimeRobot, Google Analytics 통합 가이드
