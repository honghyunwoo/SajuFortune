# API 명세서 (API Specification)

## 프로젝트: SajuFortune
**버전**: 1.0.0
**작성일**: 2025-10-03
**작성자**: Claude (Senior Developer)

---

## 📋 목차
1. [개요](#개요)
2. [인증 및 보안](#인증-및-보안)
3. [공통 규칙](#공통-규칙)
4. [API 엔드포인트](#api-엔드포인트)
5. [에러 코드](#에러-코드)
6. [Rate Limiting](#rate-limiting)

---

## 개요

### Base URL
- **개발 환경**: `http://localhost:5000/api`
- **프로덕션**: `https://api.sajufortune.com/api`

### API 버전
- **현재 버전**: v1
- **버전 관리 방식**: URL 경로 기반 (`/api/v1/*`)

### 프로토콜
- **HTTP Method**: `GET`, `POST`, `PUT`, `DELETE`
- **Content-Type**: `application/json`
- **Character Encoding**: `UTF-8`

---

## 인증 및 보안

### 세션 기반 인증
```http
Cookie: connect.sid=s%3A<session-id>
```

### CSRF 보호
```http
X-CSRF-Token: <csrf-token>
```

### CORS 정책
```javascript
{
  origin: process.env.NODE_ENV === 'production'
    ? 'https://sajufortune.com'
    : 'http://localhost:5000',
  credentials: true
}
```

---

## 공통 규칙

### 요청 헤더
```http
Content-Type: application/json
Accept: application/json
User-Agent: <client-info>
```

### 응답 형식

#### 성공 응답
```json
{
  "success": true,
  "data": {},
  "timestamp": "2025-10-03T12:00:00.000Z"
}
```

#### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "E1001",
    "message": "Invalid birth date",
    "userMessage": "생년월일이 올바르지 않습니다",
    "details": {}
  },
  "timestamp": "2025-10-03T12:00:00.000Z"
}
```

### 페이지네이션
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## API 엔드포인트

### 1. 사주 분석 (Fortune Analysis)

#### 1.1 사주 계산 및 분석
```http
POST /api/fortune/analyze
```

**Request Body**:
```json
{
  "birthDate": "1990-05-15T12:30:00Z",
  "gender": "male",
  "timezone": "Asia/Seoul",
  "precision": "premium"
}
```

**Request Parameters**:
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| birthDate | ISO 8601 string | ✅ | 생년월일 및 시간 |
| gender | "male" \| "female" | ✅ | 성별 |
| timezone | string | ❌ | 시간대 (기본: "Asia/Seoul") |
| precision | "basic" \| "premium" | ❌ | 분석 정밀도 (기본: "basic") |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "birthDate": "1990-05-15T12:30:00Z",
    "gender": "male",
    "saju": {
      "year": { "heavenly": "경", "earthly": "오" },
      "month": { "heavenly": "신", "earthly": "사" },
      "day": { "heavenly": "갑", "earthly": "인" },
      "hour": { "heavenly": "경", "earthly": "오" }
    },
    "analysis": {
      "personality": "리더십과 추진력이 강한 성격...",
      "todayFortune": {
        "rating": 8.5,
        "overall": "좋음",
        "description": "오늘은 새로운 기회가..."
      },
      "detailedAnalysis": {
        "love": { "score": 85, "level": "좋음", "description": "..." },
        "career": { "score": 90, "level": "매우 좋음", "description": "..." },
        "health": { "score": 75, "level": "보통", "description": "..." },
        "money": { "score": 80, "level": "좋음", "description": "..." }
      },
      "geokguk": {
        "격국명": "정관격",
        "격국종류": "정격",
        "격국강도": 85,
        "용신": "금",
        "희신": ["수", "금"],
        "상세해석": {
          "장점": ["정직하고 성실함", "리더십"],
          "단점": ["융통성 부족"],
          "적합직업": ["공무원", "교육자"],
          "주의사항": ["과욕 금물"]
        }
      },
      "daeun": {
        "대운방향": "순행",
        "대운시작나이": 10,
        "대운목록": [
          {
            "간": "신",
            "지": "유",
            "시작나이": 10,
            "종료나이": 19,
            "오행": "금",
            "해석": "학업 및 진로 결정의 시기"
          }
        ],
        "현재대운": {
          "간": "신",
          "지": "유",
          "나이범위": "30-39세"
        }
      },
      "sibiunseong": {
        "년주십이운성": { "운성": "장생", "강도": 100 },
        "월주십이운성": { "운성": "관대", "강도": 70 },
        "일주십이운성": { "운성": "건록", "강도": 90 },
        "시주십이운성": { "운성": "제왕", "강도": 95 },
        "평균강도": 88.75
      }
    },
    "createdAt": "2025-10-03T12:00:00.000Z"
  },
  "timestamp": "2025-10-03T12:00:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: 잘못된 요청 파라미터
- `422 Unprocessable Entity`: 유효하지 않은 생년월일
- `429 Too Many Requests`: Rate limit 초과
- `500 Internal Server Error`: 서버 내부 오류

---

#### 1.2 사주 결과 조회
```http
GET /api/fortune/{id}
```

**Path Parameters**:
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 사주 분석 결과 ID |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    // 1.1과 동일한 구조
  }
}
```

**Error Responses**:
- `404 Not Found`: 결과를 찾을 수 없음
- `403 Forbidden`: 접근 권한 없음

---

#### 1.3 사용자 사주 목록 조회
```http
GET /api/fortune/history?page=1&pageSize=20
```

**Query Parameters**:
| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| page | integer | 1 | 페이지 번호 |
| pageSize | integer | 20 | 페이지 크기 (최대 100) |
| sortBy | string | "createdAt" | 정렬 기준 |
| order | "asc" \| "desc" | "desc" | 정렬 순서 |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "birthDate": "1990-05-15T12:30:00Z",
      "gender": "male",
      "precision": "premium",
      "createdAt": "2025-10-03T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 2. 결제 (Payment)

#### 2.1 Stripe Checkout 세션 생성
```http
POST /api/payment/create-checkout-session
```

**Request Body**:
```json
{
  "priceId": "price_premium_saju",
  "fortuneReadingId": "uuid",
  "successUrl": "https://sajufortune.com/success",
  "cancelUrl": "https://sajufortune.com/cancel"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

---

#### 2.2 후원하기 세션 생성
```http
POST /api/payment/create-donation-session
```

**Request Body**:
```json
{
  "amount": 5000,
  "currency": "KRW",
  "donorName": "홍길동",
  "message": "감사합니다"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

---

#### 2.3 Webhook 처리
```http
POST /api/payment/webhook
```

**Headers**:
```http
Stripe-Signature: t=...,v1=...,v0=...
```

**Request Body**: Stripe Event Object

**Response (200 OK)**:
```json
{
  "received": true
}
```

---

### 3. 헬스 체크 및 모니터링

#### 3.1 헬스 체크
```http
GET /health
```

**Response (200 OK)**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600,
  "timestamp": "2025-10-03T12:00:00.000Z"
}
```

---

#### 3.2 메트릭스
```http
GET /metrics
```

**Response (200 OK)**: Prometheus 형식
```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1234
```

---

## 에러 코드

### 1000번대: 입력 검증 에러
| 코드 | 메시지 | 설명 |
|------|--------|------|
| E1001 | Invalid birth date | 생년월일 형식 오류 |
| E1002 | Invalid gender | 성별 값 오류 |
| E1003 | Invalid timezone | 시간대 오류 |
| E1004 | Missing required field | 필수 필드 누락 |
| E1005 | Invalid date range | 날짜 범위 오류 (1900-2100) |

### 2000번대: 비즈니스 로직 에러
| 코드 | 메시지 | 설명 |
|------|--------|------|
| E2001 | Calculation failed | 사주 계산 실패 |
| E2002 | Invalid saju data | 잘못된 사주 데이터 |
| E2003 | Premium feature required | 프리미엄 기능 필요 |

### 3000번대: 인증/인가 에러
| 코드 | 메시지 | 설명 |
|------|--------|------|
| E3001 | Unauthorized | 인증 필요 |
| E3002 | Forbidden | 권한 없음 |
| E3003 | Session expired | 세션 만료 |

### 4000번대: 시스템 에러
| 코드 | 메시지 | 설명 |
|------|--------|------|
| E4001 | Database error | 데이터베이스 오류 |
| E4002 | Cache error | 캐시 오류 |
| E4003 | External service error | 외부 서비스 오류 |

### 5000번대: Rate Limiting
| 코드 | 메시지 | 설명 |
|------|--------|------|
| E5001 | Rate limit exceeded | API 호출 한도 초과 |
| E5002 | Too many requests | 너무 많은 요청 |

---

## Rate Limiting

### 정책
- **기본 제한**: 100 requests / 15분 / IP
- **인증된 사용자**: 200 requests / 15분 / 사용자
- **프리미엄 사용자**: 500 requests / 15분 / 사용자

### 응답 헤더
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696320000
```

### Rate Limit 초과 시
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 900

{
  "success": false,
  "error": {
    "code": "E5001",
    "message": "Rate limit exceeded",
    "userMessage": "API 호출 한도를 초과했습니다. 15분 후에 다시 시도해주세요.",
    "retryAfter": 900
  }
}
```

---

## API 버저닝

### 전략
- URL 경로 기반 버저닝: `/api/v1/*`, `/api/v2/*`
- 하위 호환성 유지 기간: 6개월
- Deprecation 공지: 3개월 전

### Deprecation 헤더
```http
Deprecation: true
Sunset: Wed, 11 Nov 2025 11:11:11 GMT
Link: <https://docs.sajufortune.com/api/v2>; rel="alternate"
```

---

## 보안 고려사항

### 1. HTTPS 필수
- 프로덕션 환경에서 모든 요청은 HTTPS를 통해서만 허용

### 2. CORS 정책
- 허용된 origin에서만 API 호출 가능
- Credentials 포함 요청 지원

### 3. CSRF 보호
- POST, PUT, DELETE 요청 시 CSRF 토큰 필수

### 4. SQL Injection 방어
- Drizzle ORM의 파라미터화된 쿼리 사용
- 모든 사용자 입력 검증

### 5. XSS 방어
- 모든 출력 데이터 이스케이프 처리
- Content-Security-Policy 헤더 설정

---

## 성능 최적화

### 1. 캐싱
- **사주 계산 결과**: 2시간 캐싱 (동일 입력)
- **정적 데이터**: 7일 캐싱

### 2. Compression
- Gzip/Brotli 압축 지원
- 최소 크기: 1KB

### 3. 응답 시간 목표
- **사주 계산** (캐시 미스): < 2초
- **사주 계산** (캐시 히트): < 100ms
- **결과 조회**: < 50ms

---

## 변경 이력

### v1.0.0 (2025-10-03)
- 초기 API 명세 작성
- 사주 분석 엔드포인트
- 결제 엔드포인트
- 헬스 체크 엔드포인트

---

**문서 작성자**: Claude (Senior Developer)
**마지막 업데이트**: 2025-10-03
**문의**: API 관련 문의는 GitHub Issues로 등록해주세요
