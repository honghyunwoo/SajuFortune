# 보안 아키텍처 설계 (Security Architecture)

## 프로젝트: SajuFortune
**작성일**: 2025-10-03
**작성자**: Claude (Senior Developer)

---

## 보안 위협 모델 (Threat Model)

### OWASP Top 10 대응

| 위협 | 대응 방안 | 구현 상태 |
|------|-----------|-----------|
| A01 Broken Access Control | 세션 기반 인증, RBAC | ✅ |
| A02 Cryptographic Failures | HTTPS, bcrypt, 환경변수 | ✅ |
| A03 Injection | Drizzle ORM 파라미터화 | ✅ |
| A04 Insecure Design | 보안 설계 리뷰 | 🔄 |
| A05 Security Misconfiguration | 보안 헤더, CORS | ✅ |
| A06 Vulnerable Components | npm audit, 정기 업데이트 | ⚠️ |
| A07 Auth Failures | Rate limiting, 세션 보안 | ✅ |
| A08 Software Integrity | 코드 서명, HTTPS | ✅ |
| A09 Logging Failures | 구조화된 로깅 | ✅ |
| A10 SSRF | 입력 검증, 화이트리스트 | ✅ |

---

## 인증 및 인가

### 세션 보안
```typescript
// server/index.ts

const PgSession = connectPGSimple(session);

app.use(session({
  store: new PgSession({
    pool: db,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // 기본 이름 변경 (보안)
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    httpOnly: true,                               // XSS 방지
    maxAge: 1000 * 60 * 60 * 24,                 // 24시간
    sameSite: 'strict'                           // CSRF 방지
  }
}));
```

### 비밀번호 해싱
```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

---

## CSRF 방어

### CSRF 토큰 생성 및 검증
```typescript
// server/middleware/csrf.ts

import { randomBytes } from 'crypto';

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

export function csrfProtection(req, res, next) {
  // GET 요청은 토큰 생성만
  if (req.method === 'GET') {
    req.session.csrfToken = generateCsrfToken();
    return next();
  }

  // POST/PUT/DELETE는 토큰 검증
  const token = req.headers['x-csrf-token'];
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'E3004',
        message: 'CSRF token mismatch',
        userMessage: '요청이 거부되었습니다. 페이지를 새로고침해주세요.'
      }
    });
  }

  next();
}
```

---

## XSS 방어

### 1. Content Security Policy
```typescript
// server/security.ts

import helmet from 'helmet';

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"], // Vite HMR용
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.stripe.com"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  }
}));
```

### 2. 출력 데이터 이스케이프
```typescript
// client/src/lib/sanitize.ts

import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
}

// 사용 예시
<div dangerouslySetInnerHTML={{
  __html: sanitizeHtml(userInput)
}} />
```

---

## SQL Injection 방어

### Drizzle ORM 파라미터화 쿼리
```typescript
// ❌ 나쁜 예 (SQL Injection 취약)
db.execute(sql`SELECT * FROM users WHERE email = '${email}'`);

// ✅ 좋은 예 (안전)
db.select()
  .from(users)
  .where(eq(users.email, email)); // 파라미터화됨
```

---

## Rate Limiting

### API Rate Limiting
```typescript
// server/security.ts

import rateLimit from 'express-rate-limit';

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100,                  // 100 requests
  message: {
    success: false,
    error: {
      code: 'E5001',
      message: 'Too many requests',
      userMessage: 'API 호출 한도를 초과했습니다. 15분 후 다시 시도해주세요.'
    }
  },
  standardHeaders: true, // RateLimit-* 헤더
  legacyHeaders: false,
  keyGenerator: (req) => {
    // 인증된 사용자는 user ID 사용
    if (req.session?.userId) {
      return `user:${req.session.userId}`;
    }
    // 익명 사용자는 IP 사용
    return req.ip || 'unknown';
  }
});

// 엔드포인트별 커스텀 제한
export const fortuneAnalysisLimit = rateLimit({
  windowMs: 60 * 1000,  // 1분
  max: 5,                // 5 requests
  message: {
    success: false,
    error: {
      code: 'E5002',
      message: 'Too many fortune analysis requests',
      userMessage: '사주 분석 요청이 너무 많습니다. 1분 후 다시 시도해주세요.'
    }
  }
});
```

---

## 개인정보 보호

### 1. 데이터 마스킹
```typescript
// server/utils/privacy.ts

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local}@${domain}`;

  return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

export function maskBirthDate(birthDate: string): string {
  // 1990-05-15 → 1990-**-**
  return birthDate.replace(/(\d{4})-\d{2}-\d{2}/, '$1-**-**');
}

// 로깅 시 사용
logger.info({
  event: 'user_login',
  email: maskEmail(user.email),
  ip: maskIp(req.ip)
});
```

### 2. 민감 정보 제외
```typescript
// server/routes.ts

app.get('/api/user/profile', async (req, res) => {
  const user = await db.select({
    id: users.id,
    username: users.username,
    email: users.email
    // password는 절대 반환하지 않음
  })
  .from(users)
  .where(eq(users.id, req.session.userId!));

  res.json({ success: true, data: user });
});
```

---

## 보안 헤더

### Helmet 설정
```typescript
// server/security.ts

import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    // CSP 설정 (위 참조)
  },
  hsts: {
    maxAge: 31536000,      // 1년
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'         // Clickjacking 방지
  },
  noSniff: true,           // MIME 타입 스니핑 방지
  xssFilter: true,         // XSS 필터 활성화
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));
```

---

## CORS 정책

```typescript
// server/security.ts

import cors from 'cors';

export const corsOptions = cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? ['https://sajufortune.com', 'https://www.sajufortune.com']
      : ['http://localhost:5000', 'http://localhost:5173'];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
});
```

---

## 입력 검증

### Zod 스키마 검증
```typescript
// shared/validation.ts

import { z } from 'zod';

export const fortuneRequestSchema = z.object({
  birthDate: z.string()
    .datetime()
    .refine(
      (date) => {
        const d = new Date(date);
        return d >= new Date('1900-01-01') && d <= new Date('2100-12-31');
      },
      { message: '생년월일은 1900-2100 범위여야 합니다' }
    ),
  gender: z.enum(['male', 'female']),
  timezone: z.string().default('Asia/Seoul'),
  precision: z.enum(['basic', 'premium']).default('basic')
});

// 사용
app.post('/api/fortune/analyze', async (req, res, next) => {
  try {
    const validated = fortuneRequestSchema.parse(req.body);
    // ...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'E1004',
          message: 'Validation failed',
          userMessage: '입력 정보를 확인해주세요',
          details: error.errors
        }
      });
    }
    next(error);
  }
});
```

---

## 보안 로깅

### 보안 이벤트 로깅
```typescript
// server/utils/security-logger.ts

export function logSecurityEvent(event: {
  type: 'auth_failure' | 'csrf_violation' | 'rate_limit' | 'suspicious_activity';
  userId?: string;
  ip: string;
  userAgent: string;
  details?: any;
}) {
  logger.warn({
    category: 'security',
    ...event,
    timestamp: new Date().toISOString()
  });

  // 심각한 이벤트는 알림
  if (event.type === 'csrf_violation' || event.type === 'suspicious_activity') {
    notifySecurityTeam(event);
  }
}
```

---

## 환경 변수 보안

### .env 파일 관리
```bash
# .env (절대 커밋 X)
DATABASE_URL=postgresql://...
SESSION_SECRET=random-64-char-secret
STRIPE_SECRET_KEY=sk_live_...
REDIS_PASSWORD=...
```

### dotenv-safe 사용
```typescript
// server/config.ts

import dotenv from 'dotenv';

dotenv.config();

// 필수 환경 변수 검증
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'STRIPE_SECRET_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

---

## 보안 체크리스트

### 배포 전 검증
- [ ] HTTPS 설정 완료
- [ ] 모든 보안 헤더 적용
- [ ] CSRF 보호 활성화
- [ ] Rate limiting 설정
- [ ] 환경 변수 암호화
- [ ] 민감 정보 로깅 제외
- [ ] SQL Injection 취약점 검사
- [ ] XSS 취약점 검사
- [ ] npm audit 실행 및 해결
- [ ] 보안 테스트 수행

### 정기 점검 (월 1회)
- [ ] npm audit 실행
- [ ] 의존성 업데이트
- [ ] 보안 로그 리뷰
- [ ] Rate limit 통계 분석
- [ ] 비정상 트래픽 패턴 탐지

---

## 사고 대응 계획

### 1단계: 탐지
- 보안 로그 모니터링
- 비정상 트래픽 패턴 감지
- 사용자 신고 접수

### 2단계: 격리
- 의심 IP 차단
- 영향받은 세션 무효화
- 서비스 일시 중단 (필요 시)

### 3단계: 분석
- 공격 벡터 파악
- 영향 범위 조사
- 데이터 유출 여부 확인

### 4단계: 복구
- 취약점 패치
- 데이터 복구
- 서비스 재개

### 5단계: 사후 조치
- 사고 보고서 작성
- 재발 방지 대책 수립
- 영향받은 사용자 통지

---

**보안 우선순위**:
1. 🔴 **긴급**: CSRF, XSS, SQL Injection 방어
2. 🟡 **중요**: Rate limiting, 보안 헤더
3. 🟢 **권장**: 보안 로깅, 모니터링

---

**문서 작성자**: Claude (Senior Developer)
**마지막 업데이트**: 2025-10-03
