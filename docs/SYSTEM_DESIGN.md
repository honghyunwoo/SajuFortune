# 🏗️ SajuFortune 시스템 설계 문서

**작성일**: 2025-10-24
**버전**: 1.0
**상태**: Production Ready

---

## 📋 목차

1. [시스템 개요](#시스템-개요)
2. [아키텍처 설계](#아키텍처-설계)
3. [API 설계](#api-설계)
4. [데이터베이스 설계](#데이터베이스-설계)
5. [컴포넌트 설계](#컴포넌트-설계)
6. [데이터 흐름](#데이터-흐름)
7. [보안 설계](#보안-설계)
8. [성능 최적화](#성능-최적화)
9. [배포 아키텍처](#배포-아키텍처)

---

## 시스템 개요

### 프로젝트 정보
- **프로젝트명**: 운명의 해답 (SajuFortune)
- **타입**: Full-stack Web Application
- **목적**: AI 기반 사주풀이 서비스
- **언어**: TypeScript (100%)
- **아키텍처**: Monolithic (SSR + API Server)

### 기술 스택

#### Frontend
```
React 18.3.1          # UI 라이브러리
Vite 5.4.20           # 빌드 도구
Wouter 3.3.5          # 라우팅 (경량)
Radix UI 2.x          # 접근성 컴포넌트
TanStack Query 5.x    # 서버 상태 관리
Tailwind CSS 3.4      # 스타일링
i18next 25.5          # 다국어 지원
```

#### Backend
```
Express 4.21          # 웹 프레임워크
PostgreSQL 16         # 데이터베이스
Drizzle ORM 0.39      # TypeScript ORM
NeonDB (Serverless)   # DB 호스팅
Winston 3.18          # 로깅
```

#### External Services
```
Stripe 18.5           # 결제 처리
Redis/NodeCache       # 캐싱 (선택)
Google Analytics      # 분석 (선택)
Sentry               # 에러 추적 (선택)
```

---

## 아키텍처 설계

### 시스템 아키텍처 다이어그램

```
┌──────────────────────────────────────────────────────────────┐
│                         Client Layer                          │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Browser                                                       │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐        │
│  │   React    │──│ TanStack   │──│ Service Workers │        │
│  │    SPA     │  │   Query    │  │   (선택)        │        │
│  └────────────┘  └────────────┘  └─────────────────┘        │
│         │               │                                      │
└─────────┼───────────────┼──────────────────────────────────────┘
          │               │
          ▼               ▼
┌──────────────────────────────────────────────────────────────┐
│                      Application Layer                        │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Express Server (Node.js 22)                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware Stack                                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌────────┐ │   │
│  │  │ Security │─│  Logger  │─│   Cache   │─│  CORS  │ │   │
│  │  └──────────┘ └──────────┘ └───────────┘ └────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes                                            │   │
│  │  ┌────────────┐ ┌────────────┐ ┌─────────────────┐  │   │
│  │  │ Fortune    │ │  Payment   │ │  Admin/Blog     │  │   │
│  │  │ Readings   │ │ (Stripe)   │ │  Routes         │  │   │
│  │  └────────────┘ └────────────┘ └─────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Business Logic                                        │   │
│  │  ┌────────────┐ ┌────────────┐ ┌─────────────────┐  │   │
│  │  │   Saju     │ │  Premium   │ │  Analysis       │  │   │
│  │  │ Calculator │ │ Calculator │ │  Engine         │  │   │
│  │  └────────────┘ └────────────┘ └─────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                    │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                       Data Layer                              │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL  │  │  Redis Cache │  │  Session Store   │  │
│  │   (NeonDB)   │  │  (Optional)  │  │  (PostgreSQL)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    External Services                          │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Stripe  │  │  Sentry  │  │ Google   │  │  Kakao   │    │
│  │ Payments │  │  Error   │  │ Analytics│  │  Share   │    │
│  │          │  │ Tracking │  │          │  │          │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### 계층별 책임 (Layer Responsibilities)

#### 1. Client Layer
**책임**:
- UI 렌더링 및 사용자 인터랙션
- 폼 검증 및 입력 처리
- 라우팅 및 네비게이션
- 클라이언트 사이드 상태 관리
- API 요청 및 캐싱

**주요 기술**:
- React (UI)
- Wouter (Routing)
- TanStack Query (Server State)
- Zod (Validation)

#### 2. Application Layer
**책임**:
- API 엔드포인트 제공
- 비즈니스 로직 실행
- 인증 및 권한 부여
- 요청 검증 및 에러 핸들링
- 로깅 및 모니터링

**주요 기술**:
- Express (Framework)
- Winston (Logging)
- Helmet (Security)
- Express-rate-limit (DDoS Prevention)

#### 3. Data Layer
**책임**:
- 데이터 영속성
- 트랜잭션 관리
- 데이터 무결성
- 캐싱 및 세션 관리

**주요 기술**:
- Drizzle ORM
- PostgreSQL
- Redis/NodeCache
- connect-pg-simple (Session)

#### 4. External Services
**책임**:
- 결제 처리 (Stripe)
- 에러 추적 (Sentry)
- 분석 (Google Analytics)
- 소셜 공유 (Kakao)

---

## API 설계

### RESTful API 명세

#### 1. 사주 계산 API

##### POST /api/fortune-readings
**목적**: 새로운 사주 계산 요청

**Request**:
```typescript
{
  gender: "male" | "female",
  birthYear: number,     // 1900 ~ 현재
  birthMonth: number,    // 1 ~ 12
  birthDay: number,      // 1 ~ 31
  birthHour: number,     // 0 ~ 23
  birthMinute: number,   // 0 ~ 59
  calendarType: "solar" | "lunar",
  serviceType: "free" | "premium",
  isPaid: boolean
}
```

**Response** (200 OK):
```typescript
{
  readingId: string,      // UUID
  cached: boolean         // 캐시 히트 여부
}
```

**보안**:
- Rate Limiting: 10 requests / 15분
- 익명 세션 ID 생성 (SHA-256)
- XSS/SQL Injection 방지

**캐싱**:
- Cache Key: `${year}:${month}:${day}:${hour}:${minute}:${calendarType}`
- TTL: 2시간
- Storage: Redis (prod) / NodeCache (dev)

---

##### GET /api/fortune-readings/:id
**목적**: 사주 계산 결과 조회

**Response** (200 OK):
```typescript
{
  id: string,
  sajuData: {
    pillars: [
      { heavenly: string, earthly: string, element: string }
    ],
    elements: {
      wood: number,
      fire: number,
      earth: number,
      metal: number,
      water: number
    },
    dayMaster: string,
    strength: "strong" | "medium" | "weak"
  },
  analysisResult: {
    personality: string,
    todayFortune: {...},
    detailedAnalysis: {...},
    geokguk?: {...},        // 격국 분석
    daeun?: {...},          // 대운
    sibiunseong?: {...}     // 십이운성
  },
  createdAt: string
}
```

**에러**:
- 404: Reading not found
- 500: Server error

---

#### 2. 후원 API

##### POST /api/create-donation
**목적**: Stripe 결제 인텐트 생성

**Request**:
```typescript
{
  readingId: string,
  amount: number,        // 최소 1,000 KRW
  donorName?: string,
  message?: string
}
```

**Response** (200 OK):
```typescript
{
  clientSecret: string,  // Stripe Client Secret
  donationId: string     // UUID
}
```

**보안**:
- Rate Limiting: 5 requests / 15분
- Amount Validation: 1,000 ~ 1,000,000 KRW
- Stripe Signature Verification

---

##### POST /api/stripe-webhook
**목적**: Stripe Webhook 이벤트 처리

**Events**:
- `charge.succeeded`: 결제 성공
- `charge.failed`: 결제 실패
- `charge.refunded`: 환불 처리

**Request**:
```typescript
{
  type: string,
  data: {
    object: {
      payment_intent: string,
      amount: number,
      // ... Stripe Event Data
    }
  }
}
```

**Response**: 200 OK (빈 응답)

**보안**:
- Stripe Signature Verification (STRIPE_WEBHOOK_SECRET)
- Idempotency (중복 이벤트 방지)

---

##### GET /api/donations/:readingId
**목적**: 특정 Reading의 후원 내역 조회

**Response** (200 OK):
```typescript
{
  donations: [
    {
      id: string,
      amount: number,
      donorName: string,
      message: string,
      isPaid: boolean,
      isRefunded: boolean,
      createdAt: string
    }
  ]
}
```

---

#### 3. 기타 API

##### POST /api/contact
**목적**: 고객 문의 이메일 전송

**Request**:
```typescript
{
  name: string,
  email: string,
  subject: string,
  message: string
}
```

**Response**: 200 OK

---

##### GET /api/admin/cache/stats
**목적**: 캐시 통계 조회 (관리자)

**Response**:
```typescript
{
  type: "redis" | "memory",
  keys: number,
  hits: number,
  misses: number,
  hitRate: number
}
```

---

##### DELETE /api/admin/cache/:key
**목적**: 특정 캐시 키 삭제

**Response**: 200 OK

---

##### DELETE /api/admin/cache
**목적**: 모든 캐시 삭제

**Response**: 200 OK

---

##### GET /api/blog/posts
**목적**: 블로그 포스트 목록 조회

**Response**:
```typescript
{
  posts: [
    {
      slug: string,
      title: string,
      excerpt: string,
      date: string,
      author: string
    }
  ]
}
```

---

##### GET /api/blog/posts/:slug
**목적**: 블로그 포스트 상세 조회

**Response**:
```typescript
{
  post: {
    title: string,
    content: string,    // Markdown
    date: string,
    author: string
  }
}
```

---

### API 설계 원칙

1. **RESTful 규칙 준수**
   - HTTP Method 의미 일관성
   - Status Code 정확한 사용
   - Resource 기반 URL 설계

2. **보안 우선**
   - Rate Limiting (DDoS 방지)
   - Input Validation (XSS/SQL Injection 방지)
   - CORS 화이트리스트
   - HTTPS 강제 (프로덕션)

3. **성능 최적화**
   - 캐싱 전략 (Redis/NodeCache)
   - Lazy Loading
   - Gzip 압축

4. **에러 핸들링**
   - 표준화된 에러 응답
   - 상세한 에러 로깅
   - 프로덕션 환경 스택 트레이스 숨김

---

## 데이터베이스 설계

### Entity-Relationship Diagram (ERD)

```
┌─────────────────────────┐
│        users            │
├─────────────────────────┤
│ id (PK)                 │─┐
│ username (UNIQUE)       │ │
│ email (UNIQUE)          │ │
│ password                │ │
│ stripe_customer_id      │ │
│ created_at              │ │
└─────────────────────────┘ │
                            │
                            │ 1
                            │
                            │ N
                            │
┌─────────────────────────┐ │
│  fortune_readings       │ │
├─────────────────────────┤ │
│ id (PK)                 │ │
│ user_id (FK)            │─┘ (nullable)
│ session_id              │   (익명 사용자)
│ gender                  │
│ birth_year              │
│ birth_month             │
│ birth_day               │
│ birth_hour              │
│ birth_minute            │
│ calendar_type           │
│ service_type            │
│ is_paid                 │
│ saju_data (JSONB)       │
│ analysis_result (JSONB) │
│ created_at              │
└─────────────────────────┘
          │
          │ 1
          │
          │ N
          │
┌─────────────────────────┐
│      donations          │
├─────────────────────────┤
│ id (PK)                 │
│ reading_id (FK)         │─┘
│ amount                  │
│ donor_name              │
│ message                 │
│ payment_intent_id       │
│ is_paid                 │
│ is_refunded             │
│ refunded_at             │
│ refund_reason           │
│ created_at              │
└─────────────────────────┘
```

### 테이블 명세

#### 1. users 테이블
**목적**: 사용자 계정 정보 (향후 확장용)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR | PK, UUID | 사용자 ID |
| username | TEXT | UNIQUE, NOT NULL | 사용자명 |
| email | TEXT | UNIQUE, NOT NULL | 이메일 |
| password | TEXT | NOT NULL | 해시된 비밀번호 |
| stripe_customer_id | TEXT | NULLABLE | Stripe 고객 ID |
| created_at | TIMESTAMP | DEFAULT now() | 생성 시간 |

**인덱스**:
- PRIMARY KEY (id)
- UNIQUE INDEX (username)
- UNIQUE INDEX (email)

---

#### 2. fortune_readings 테이블
**목적**: 사주 계산 결과 저장

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR | PK, UUID | Reading ID |
| user_id | VARCHAR | FK, NULLABLE | 사용자 ID (로그인 시) |
| session_id | VARCHAR | NOT NULL | 세션 ID (익명 사용자) |
| gender | TEXT | NOT NULL | 성별 ('male'/'female') |
| birth_year | INTEGER | NOT NULL | 출생년도 |
| birth_month | INTEGER | NOT NULL | 출생월 |
| birth_day | INTEGER | NOT NULL | 출생일 |
| birth_hour | INTEGER | NOT NULL | 출생시 |
| birth_minute | INTEGER | NOT NULL | 출생분 |
| calendar_type | TEXT | NOT NULL | 달력 ('solar'/'lunar') |
| service_type | TEXT | DEFAULT 'free' | 서비스 타입 |
| is_paid | BOOLEAN | DEFAULT false | 결제 여부 |
| saju_data | JSONB | NOT NULL | 사주 데이터 |
| analysis_result | JSONB | NOT NULL | 분석 결과 |
| created_at | TIMESTAMP | DEFAULT now() | 생성 시간 |

**인덱스**:
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (session_id)
- INDEX (created_at DESC)

**JSONB 구조**:
```typescript
// saju_data
{
  pillars: [
    { heavenly: "갑", earthly: "자", element: "木" }
  ],
  elements: { wood: 3, fire: 1, earth: 2, metal: 1, water: 1 },
  dayMaster: "갑",
  strength: "strong"
}

// analysis_result
{
  personality: "...",
  todayFortune: {...},
  detailedAnalysis: {...},
  geokguk: {...},
  daeun: {...},
  sibiunseong: {...}
}
```

---

#### 3. donations 테이블
**목적**: 후원 결제 정보

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR | PK, UUID | Donation ID |
| reading_id | VARCHAR | FK, NOT NULL | Reading ID |
| amount | INTEGER | NOT NULL | 후원 금액 (KRW) |
| donor_name | TEXT | NULLABLE | 후원자 이름 |
| message | TEXT | NULLABLE | 후원 메시지 |
| payment_intent_id | TEXT | NULLABLE | Stripe Payment Intent ID |
| is_paid | BOOLEAN | DEFAULT false | 결제 완료 여부 |
| is_refunded | BOOLEAN | DEFAULT false | 환불 여부 |
| refunded_at | TIMESTAMP | NULLABLE | 환불 시간 |
| refund_reason | TEXT | NULLABLE | 환불 사유 |
| created_at | TIMESTAMP | DEFAULT now() | 생성 시간 |

**인덱스**:
- PRIMARY KEY (id)
- INDEX (reading_id)
- INDEX (payment_intent_id)
- INDEX (created_at DESC)

---

### 데이터베이스 설계 원칙

1. **정규화** (3NF)
   - 데이터 중복 최소화
   - 업데이트 이상 방지
   - 참조 무결성 유지

2. **확장성**
   - UUID 사용 (분산 환경 대응)
   - JSONB 활용 (유연한 스키마)
   - 파티셔닝 고려 (created_at 기준)

3. **성능**
   - 적절한 인덱싱
   - JSONB GIN 인덱스 (필요 시)
   - Connection Pooling (NeonDB)

4. **마이그레이션**
   - Drizzle Kit 사용
   - 버전 관리 (migrations/)
   - 롤백 가능 (scripts/rollback.ts)

---

## 컴포넌트 설계

### Frontend 컴포넌트 구조

```
client/src/
├── pages/                      # 페이지 컴포넌트 (16개)
│   ├── home.tsx               # 메인 페이지
│   ├── results.tsx            # 사주 결과 페이지
│   ├── premium.tsx            # 프리미엄 구독
│   ├── monthly-fortune.tsx    # 월별 운세
│   ├── compatibility.tsx      # 궁합 분석
│   ├── checkout.tsx           # 결제 페이지
│   ├── blog/
│   │   ├── index.tsx          # 블로그 목록
│   │   └── post.tsx           # 블로그 포스트
│   ├── faq.tsx                # FAQ
│   ├── contact.tsx            # 문의하기
│   ├── privacy-policy.tsx     # 개인정보처리방침
│   ├── terms-of-service.tsx   # 이용약관
│   ├── cookie-policy.tsx      # 쿠키 정책
│   ├── disclaimer.tsx         # 면책조항
│   ├── refund-policy.tsx      # 환불 정책
│   └── not-found.tsx          # 404 페이지
│
├── components/
│   ├── organisms/             # 복합 컴포넌트 (8개)
│   │   ├── FortuneDetailedCard.tsx
│   │   ├── SajuPillarsCard.tsx
│   │   ├── PersonalityCard.tsx
│   │   ├── TodayFortuneCard.tsx
│   │   ├── DetailedAnalysisCard.tsx
│   │   ├── GeokgukCard.tsx
│   │   ├── DaeunCard.tsx
│   │   └── SibiunseongCard.tsx
│   │
│   ├── features/              # 기능 컴포넌트 (11개)
│   │   ├── fortune-form.tsx
│   │   ├── result-display.tsx
│   │   ├── donation.tsx
│   │   ├── premium-gate.tsx
│   │   ├── social-share.tsx
│   │   ├── pdf-generator.tsx
│   │   ├── pdf-template-selector.tsx
│   │   ├── pdf-cover-customizer.tsx
│   │   ├── language-switcher.tsx
│   │   ├── privacy-consent.tsx
│   │   └── legal-warning-banner.tsx
│   │
│   ├── ui/                    # UI 컴포넌트 (20개)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   ├── accordion.tsx
│   │   ├── tabs.tsx
│   │   ├── progress.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   ├── skeleton.tsx
│   │   ├── separator.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio-group.tsx
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   ├── tooltip.tsx
│   │   ├── sheet.tsx
│   │   └── dropdown-menu.tsx
│   │
│   └── seo-head.tsx           # SEO 메타 태그
│
├── hooks/                     # Custom Hooks
│   ├── use-toast.ts
│   └── use-mobile.tsx
│
└── lib/                       # 유틸리티
    ├── queryClient.ts         # TanStack Query 설정
    ├── utils.ts               # 공통 유틸
    ├── analytics.ts           # GA4 통합
    ├── kakao-share.ts         # 카카오톡 공유
    ├── pdf-generator.ts       # PDF 생성
    └── pdf-templates.ts       # PDF 템플릿
```

### 컴포넌트 설계 원칙

#### 1. Atomic Design Pattern
```
Atoms (UI)
  → Molecules (Features)
    → Organisms (복합 기능)
      → Pages (라우트)
```

#### 2. 책임 분리
- **UI 컴포넌트**: 순수 표현 (Radix UI 기반)
- **Feature 컴포넌트**: 비즈니스 로직 포함
- **Organism 컴포넌트**: 복합 기능 조합
- **Pages**: 라우팅 및 레이아웃

#### 3. 상태 관리
- **Server State**: TanStack Query
- **Local State**: React useState
- **Form State**: Controlled Components
- **Global State**: Context API (최소화)

#### 4. 성능 최적화
- **Code Splitting**: Route-based
- **Lazy Loading**: PDF, Canvas, i18n
- **Memoization**: React.memo, useMemo
- **Virtual Scrolling**: 긴 목록 (필요 시)

---

## 데이터 흐름

### 사주 계산 플로우

```
[1] 사용자 입력
    └─> FortuneForm (client/src/components/fortune-form.tsx)
         └─> 폼 검증 (Zod)
              └─> POST /api/fortune-readings

[2] 서버 처리
    └─> Rate Limiting 체크
         └─> 캐시 확인 (Redis/NodeCache)
              ├─> HIT: 캐시된 readingId 반환
              └─> MISS:
                   └─> createSeoulDate() (타임존 변환)
                        └─> calculatePremiumSaju() (사주 계산)
                             └─> 격국, 대운, 십이운성 분석
                                  └─> DB 저장
                                       └─> 캐시 저장
                                            └─> readingId 반환

[3] 결과 조회
    └─> GET /api/fortune-readings/:id
         └─> DB 조회
              └─> 결과 반환 (SajuData + AnalysisResult)

[4] 결과 표시
    └─> ResultDisplay (client/src/components/result-display.tsx)
         ├─> SajuPillarsCard
         ├─> PersonalityCard
         ├─> TodayFortuneCard
         ├─> DetailedAnalysisCard
         ├─> GeokgukCard
         ├─> DaeunCard
         └─> SibiunseongCard
```

### 후원 결제 플로우

```
[1] 후원 시작
    └─> Donation Component (client/src/components/donation.tsx)
         └─> POST /api/create-donation
              └─> Stripe Payment Intent 생성
                   └─> DB에 donation 레코드 생성 (is_paid: false)
                        └─> Client Secret 반환

[2] 결제 진행
    └─> Stripe Elements (client)
         └─> 카드 정보 입력
              └─> stripe.confirmCardPayment()
                   └─> Stripe 서버로 결제 요청

[3] Webhook 처리
    └─> POST /api/stripe-webhook
         ├─> charge.succeeded:
         │    └─> DB 업데이트 (is_paid: true)
         │         └─> 로그 기록
         ├─> charge.failed:
         │    └─> 로그 기록
         └─> charge.refunded:
              └─> DB 업데이트 (is_refunded: true)

[4] 결과 표시
    └─> 결제 성공 토스트
         └─> 후원 내역 표시
```

---

## 보안 설계

### 1. 인증 및 권한

#### 세션 관리
```typescript
// connect-pg-simple 사용
{
  store: new (require('connect-pg-simple')(session))({
    pool: pgPool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET,  // 64자 이상
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // HTTPS only
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000  // 30일
  }
}
```

#### 익명 사용자
- SHA-256 해시 기반 세션 ID
- IP, User-Agent, Timestamp 조합
- 예측 불가능성 보장

### 2. API 보안

#### Rate Limiting
```typescript
// 사주 계산: 10 requests / 15분
const sajuCalculationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests"
});

// 후원: 5 requests / 15분
const donationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});
```

#### Input Validation
- Zod 스키마 검증
- XSS 방지 (입력 이스케이프)
- SQL Injection 방지 (Drizzle ORM)
- CSRF 방지 (SameSite Cookie)

#### Security Headers
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));
```

### 3. Stripe Webhook 보안

```typescript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
// Signature 검증 실패 시 에러
```

### 4. 환경변수 보안

```bash
# .gitignore
.env
.env.*
!.env.example

# 프로덕션 환경변수는 Railway에서 관리
# 로컬 개발 환경변수는 .env 파일 사용
```

---

## 성능 최적화

### 1. 캐싱 전략

#### Multi-tier Caching
```
Level 1: Browser Cache (Service Worker)
    └─> TTL: 1시간
         └─> 정적 파일 (JS, CSS, Images)

Level 2: Redis/NodeCache (Server)
    └─> TTL: 2시간
         └─> 사주 계산 결과

Level 3: CDN (Optional)
    └─> TTL: 무제한
         └─> Content-hashed 파일
```

#### 캐시 키 전략
```typescript
const cacheKey = `saju:${year}:${month}:${day}:${hour}:${minute}:${calendarType}`;
// 버전 기반 무효화
const versionedKey = `${cacheKey}:v${CALCULATOR_VERSION}`;
```

### 2. 번들 최적화

#### Code Splitting
- **Vendor Chunking**: vendor, react, ui, pdf, canvas
- **Route-based Splitting**: 페이지별 청크
- **Lazy Loading**: PDF, Canvas, i18n, Stripe

#### Tree Shaking
- ES Module 사용
- Side-effects 명시 (package.json)
- Terser 최소화

### 3. 데이터베이스 최적화

#### 인덱싱
```sql
-- Reading 조회 최적화
CREATE INDEX idx_fortune_readings_user_id ON fortune_readings(user_id);
CREATE INDEX idx_fortune_readings_session_id ON fortune_readings(session_id);
CREATE INDEX idx_fortune_readings_created_at ON fortune_readings(created_at DESC);

-- Donation 조회 최적화
CREATE INDEX idx_donations_reading_id ON donations(reading_id);
CREATE INDEX idx_donations_payment_intent_id ON donations(payment_intent_id);
```

#### Connection Pooling
```typescript
// NeonDB Serverless
const sql = neon(process.env.DATABASE_URL);
// 자동으로 Connection Pooling 관리
```

### 4. 프론트엔드 최적화

#### Lazy Loading
```typescript
const PDFGenerator = lazy(() => import('./components/pdf-generator'));
const Canvas = lazy(() => import('html2canvas'));
const i18n = lazy(() => import('./i18n/config'));
```

#### Image Optimization
- WebP 포맷 사용 (향후)
- Responsive Images
- Lazy Loading

---

## 배포 아키텍처

### Railway 배포 구조

```
┌──────────────────────────────────────────────────────────┐
│                      Railway Platform                     │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Application Container                               │ │
│  │  ┌─────────────────────────────────────────────┐    │ │
│  │  │  Node.js 22 Runtime                         │    │ │
│  │  │  ├─ Express Server (PORT=5000)              │    │ │
│  │  │  │  ├─ API Routes                           │    │ │
│  │  │  │  └─ Static File Serving (dist/public)    │    │ │
│  │  │  └─ Health Check (/health)                  │    │ │
│  │  └─────────────────────────────────────────────┘    │ │
│  │                                                       │ │
│  │  Environment Variables:                              │ │
│  │  - NODE_ENV=production                               │ │
│  │  - DATABASE_URL                                      │ │
│  │  - SESSION_SECRET                                    │ │
│  │  - STRIPE_SECRET_KEY                                 │ │
│  │  - STRIPE_WEBHOOK_SECRET                             │ │
│  └─────────────────────────────────────────────────────┘ │
│                           │                               │
└───────────────────────────┼───────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│      NeonDB PostgreSQL   │  │    Stripe API            │
│      (Serverless)        │  │    (External)            │
├──────────────────────────┤  ├──────────────────────────┤
│  - Connection Pooling    │  │  - Payment Processing    │
│  - Auto-scaling          │  │  - Webhook Events        │
│  - 10GB Storage (Free)   │  │  - Refund Management     │
└──────────────────────────┘  └──────────────────────────┘
```

### 배포 프로세스

#### 1. 빌드 단계 (railway.json)
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run db:generate && npm run build"
  }
}
```

**실행 순서**:
1. `npm install` - 의존성 설치
2. `npm run db:generate` - Drizzle 마이그레이션 파일 생성
3. `npm run build` - Frontend + Backend 빌드

#### 2. 배포 단계
```json
{
  "deploy": {
    "startCommand": "npm run db:migrate && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**실행 순서**:
1. `npm run db:migrate` - DB 마이그레이션 실행
2. `npm start` - 서버 시작 (node dist/index.js)
3. Health Check: `/health` 엔드포인트 확인

#### 3. 모니터링
```typescript
// Health Check Endpoint
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    stripe: await checkStripe()
  };

  const status = Object.values(checks).every(c => c.status === 'ok')
    ? 'healthy'
    : 'degraded';

  res.status(status === 'healthy' ? 200 : 503).json({
    status,
    checks,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
```

---

## 📚 참고 자료

### 기술 문서
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Stripe API](https://stripe.com/docs/api)
- [NeonDB](https://neon.tech/docs)

### 설계 패턴
- [RESTful API Design](https://restfulapi.net/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Atomic Design](https://atomicdesign.bradfrost.com/)

### 보안 가이드
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Stripe Security](https://stripe.com/docs/security/guide)

---

**작성자**: SuperClaude (Design Agent)
**작성일**: 2025-10-24
**버전**: 1.0
**상태**: Production Ready
