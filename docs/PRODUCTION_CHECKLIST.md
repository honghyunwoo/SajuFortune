# 🚀 프로덕션 배포 체크리스트

**운명의 해답 (SajuFortune) MVP 프로덕션 배포 완전 가이드**

> **PRD 참조**: 9.1 배포 전략, 10.1 품질 보증
> **목적**: 안전하고 체계적인 프로덕션 배포 절차 수립
> **예상 시간**: 4-6시간 (초기 배포 기준)

---

## 📋 목차

1. [배포 전 필수 점검 (Pre-Deployment)](#1-배포-전-필수-점검-pre-deployment)
2. [환경 변수 설정 (Environment Variables)](#2-환경-변수-설정-environment-variables)
3. [데이터베이스 설정 (Database Setup)](#3-데이터베이스-설정-database-setup)
4. [Redis 캐싱 설정 (Redis Configuration)](#4-redis-캐싱-설정-redis-configuration)
5. [Stripe 결제 설정 (Stripe Payment)](#5-stripe-결제-설정-stripe-payment)
6. [빌드 및 배포 (Build & Deploy)](#6-빌드-및-배포-build--deploy)
7. [배포 후 검증 (Post-Deployment Validation)](#7-배포-후-검증-post-deployment-validation)
8. [모니터링 설정 (Monitoring Setup)](#8-모니터링-설정-monitoring-setup)
9. [롤백 절차 (Rollback Procedure)](#9-롤백-절차-rollback-procedure)

---

## 1. 배포 전 필수 점검 (Pre-Deployment)

### 1.1 코드베이스 품질 검증

```bash
# TypeScript 타입 체크
npm run check

# 빌드 테스트 (에러 없어야 함)
npm run build

# 단위 테스트 실행 (모두 통과해야 함)
npm test

# E2E 테스트 실행 (모두 통과해야 함)
npx playwright test

# 보안 취약점 점검
npm audit --production
```

**✅ 통과 기준**:
- TypeScript 에러: 0개
- 빌드 에러: 0개
- 단위 테스트: 100% 통과 (228/228)
- E2E 테스트: 100% 통과 (32/32)
- 보안 취약점: High/Critical 0개

### 1.2 Git 상태 확인

```bash
# 모든 변경사항이 커밋되었는지 확인
git status

# 최신 main 브랜치로 동기화
git checkout main
git pull origin main

# 배포 태그 생성 (버전 관리)
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0
```

### 1.3 문서 완성도 검증

- [ ] README.md: 프로젝트 설명, 설치 방법, 사용법
- [ ] .env.example: 모든 환경변수 문서화
- [ ] docs/E2E_TESTING_GUIDE.md: 테스트 실행 가이드
- [ ] docs/STRIPE_WEBHOOK_TESTING.md: Stripe 통합 가이드
- [ ] 이 문서 (PRODUCTION_CHECKLIST.md): 배포 절차서

---

## 2. 환경 변수 설정 (Environment Variables)

### 2.1 필수 환경 변수 (🔴 CRITICAL)

프로덕션 서버에서 다음 환경변수를 설정하세요:

```bash
# 1. 환경 설정
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# 2. 데이터베이스 (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# 3. 세션 암호화 키 (⚠️ 반드시 변경!)
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# 4. Stripe 결제 (⚠️ Live 키 사용!)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# 5. Redis 캐싱 (프로덕션 필수)
REDIS_URL=rediss://default:password@host:port
CACHE_TTL=7200
```

### 2.2 선택 환경 변수 (권장)

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS 설정
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 로그 레벨
LOG_LEVEL=info

# Google Analytics (권장)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Kakao 공유하기 (권장)
VITE_KAKAO_JS_KEY=your_kakao_javascript_key

# Sentry 에러 추적 (권장)
SENTRY_DSN=https://your-key@sentry.io/your-project-id
SENTRY_ENVIRONMENT=production
SENTRY_SAMPLE_RATE=1.0
```

### 2.3 환경변수 검증 스크립트

```bash
# 환경변수 설정 확인
node -e "
const required = ['NODE_ENV', 'DATABASE_URL', 'SESSION_SECRET', 'STRIPE_SECRET_KEY'];
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('❌ Missing required env vars:', missing);
  process.exit(1);
}
console.log('✅ All required environment variables are set');
"
```

### 2.4 보안 체크리스트

- [ ] `SESSION_SECRET`는 64자 이상의 강력한 랜덤 문자열인가?
- [ ] `STRIPE_SECRET_KEY`는 `sk_live_`로 시작하는가? (테스트 키 아님)
- [ ] `DATABASE_URL`에는 `sslmode=require`가 포함되어 있는가?
- [ ] `.env` 파일은 `.gitignore`에 포함되어 Git에 커밋되지 않는가?
- [ ] 프로덕션 환경변수는 Kubernetes Secret / AWS Parameter Store 등 안전한 곳에 저장되어 있는가?

---

## 3. 데이터베이스 설정 (Database Setup)

### 3.1 PostgreSQL 프로비저닝

**권장 서비스**: NeonDB, Supabase, AWS RDS, Azure Database

```bash
# NeonDB 예시 (무료 플랜 500MB)
# 1. https://neon.tech 가입
# 2. 새 프로젝트 생성: saju-fortune-prod
# 3. Connection String 복사
# 형식: postgresql://user:password@ep-xxxxx.region.aws.neon.tech/database?sslmode=require
```

### 3.2 데이터베이스 마이그레이션 실행

```bash
# 1. DATABASE_URL 환경변수 설정 확인
echo $DATABASE_URL

# 2. 연결 테스트
psql $DATABASE_URL -c "SELECT version();"

# 3. 마이그레이션 실행 (테이블 생성)
npm run db:migrate

# 예상 출력:
# Applying migration: 0000_mixed_lily_hollister.sql
# ✅ Migration completed
```

### 3.3 데이터베이스 스키마 검증

```bash
# 테이블 존재 확인
psql $DATABASE_URL -c "
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
"

# 예상 결과:
# table_name
# ----------------
# users
# fortune_readings
# donations
# (3 rows)
```

### 3.4 백업 설정

```bash
# 자동 백업 활성화 (서비스별로 다름)
# - NeonDB: 자동 백업 기본 활성화 (Point-in-Time Recovery)
# - AWS RDS: 자동 백업 활성화 (7-35일 보관)
# - Supabase: 자동 백업 활성화

# 수동 백업 스크립트 (선택사항)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## 4. Redis 캐싱 설정 (Redis Configuration)

### 4.1 Redis 프로비저닝

**권장 서비스**: Upstash Redis, AWS ElastiCache, Redis Cloud

```bash
# Upstash Redis 예시 (무료 플랜 10,000 commands/day)
# 1. https://upstash.com 가입
# 2. Redis 데이터베이스 생성
# 3. Connection String 복사
# 형식: rediss://default:password@xxxxx.upstash.io:6379
```

### 4.2 Redis 연결 테스트

```bash
# Redis CLI 설치 (로컬)
# Windows: https://github.com/microsoftarchive/redis/releases
# macOS: brew install redis
# Linux: sudo apt-get install redis-tools

# 연결 테스트
redis-cli -u $REDIS_URL ping
# 예상 출력: PONG
```

### 4.3 캐시 동작 검증

프로덕션 배포 후:

```bash
# 1. 사주 계산 요청 (캐시 미스)
curl -X POST https://yourdomain.com/api/fortune \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "남성",
    "birthYear": 1990,
    "birthMonth": 5,
    "birthDay": 15,
    "birthHour": 14,
    "birthMinute": 30,
    "calendarType": "solar"
  }'

# 2. 동일한 요청 (캐시 히트 - 빠름)
# 응답 시간 비교: 첫 요청 > 두 번째 요청

# 3. 캐시 통계 확인 (Admin API)
curl https://yourdomain.com/api/admin/cache/stats
```

---

## 5. Stripe 결제 설정 (Stripe Payment)

### 5.1 Stripe Live Mode 전환

```bash
# 1. Stripe Dashboard 접속
# https://dashboard.stripe.com

# 2. Live Mode로 전환 (우측 상단 토글)

# 3. API Keys 복사
# - Publishable key: pk_live_xxxxxxxxxxxxx
# - Secret key: sk_live_xxxxxxxxxxxxx

# 4. 환경변수 업데이트
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

### 5.2 Webhook Endpoint 등록

```bash
# 1. Stripe Dashboard → Developers → Webhooks
# 2. "Add endpoint" 클릭
# 3. Endpoint URL 입력: https://yourdomain.com/api/webhooks/stripe
# 4. 이벤트 선택:
#    - payment_intent.succeeded
#    - payment_intent.payment_failed
#    - charge.refunded
# 5. Webhook Signing Secret 복사: whsec_xxxxxxxxxxxxx
# 6. 환경변수 업데이트
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 5.3 Stripe 연결 테스트

```bash
# Health Check 엔드포인트로 Stripe 상태 확인
curl https://yourdomain.com/health

# 예상 출력:
# {
#   "status": "ok",
#   "checks": {
#     "database": { "status": "ok" },
#     "redis": { "status": "ok" },
#     "stripe": { "status": "ok" }  ← 확인
#   }
# }
```

### 5.4 테스트 결제 실행

```bash
# 1. 프론트엔드에서 후원 버튼 클릭
# 2. Stripe Checkout으로 리다이렉트
# 3. 테스트 카드 번호 사용 (Live Mode에서는 실제 카드 필요):
#    - 번호: 4242 4242 4242 4242
#    - 만료일: 미래 날짜 (예: 12/25)
#    - CVC: 아무 3자리 (예: 123)
# 4. 결제 완료 후 DB 확인:
psql $DATABASE_URL -c "SELECT * FROM donations WHERE is_paid = true LIMIT 1;"
```

---

## 6. 빌드 및 배포 (Build & Deploy)

### 6.1 프로덕션 빌드

```bash
# 1. 의존성 설치 (프로덕션만)
npm ci --production=false

# 2. 프로덕션 빌드
npm run build

# 3. 빌드 결과 확인
ls -lh dist/
# 예상 출력:
# drwxr-xr-x  public/     (정적 파일)
# -rw-r--r--  index.js    (서버 번들)
# -rw-r--r--  index.html  (클라이언트 진입점)
```

### 6.2 배포 방법별 가이드

#### Option A: Replit Deployment

```bash
# 1. Replit에서 프로젝트 열기
# 2. Secrets 탭에서 환경변수 설정
# 3. "Deploy" 버튼 클릭
# 4. 커스텀 도메인 설정 (선택사항)
```

#### Option B: Vercel Deployment

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 로그인
vercel login

# 3. 프로젝트 배포
vercel --prod

# 4. 환경변수 설정 (Vercel Dashboard)
# Settings → Environment Variables
```

#### Option C: Docker + AWS/Azure/GCP

```bash
# 1. Dockerfile 생성 (아래 참조)
# 2. 이미지 빌드
docker build -t saju-fortune:v1.0.0 .

# 3. 이미지 푸시 (예: Docker Hub)
docker tag saju-fortune:v1.0.0 yourusername/saju-fortune:v1.0.0
docker push yourusername/saju-fortune:v1.0.0

# 4. 프로덕션 서버에서 실행
docker run -d \
  --name saju-fortune \
  -p 5000:5000 \
  --env-file .env.production \
  yourusername/saju-fortune:v1.0.0
```

**Dockerfile 예시**:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

#### Option D: VPS (Ubuntu 22.04)

```bash
# 1. SSH 접속
ssh user@your-server-ip

# 2. Node.js 20 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. PM2 프로세스 매니저 설치
sudo npm install -g pm2

# 4. 프로젝트 클론
git clone https://github.com/yourusername/saju-fortune.git
cd saju-fortune

# 5. 의존성 설치 및 빌드
npm ci
npm run build

# 6. 환경변수 설정
nano .env.production
# (위의 환경변수 입력)

# 7. PM2로 실행
pm2 start dist/index.js --name saju-fortune --env production

# 8. PM2 자동 시작 설정
pm2 startup
pm2 save

# 9. Nginx 리버스 프록시 설정 (선택사항)
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/saju-fortune
```

**Nginx 설정 예시**:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6.3 SSL 인증서 설정 (HTTPS)

```bash
# Let's Encrypt 무료 SSL 인증서
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 자동 갱신 설정 (90일마다)
sudo certbot renew --dry-run
```

---

## 7. 배포 후 검증 (Post-Deployment Validation)

### 7.1 서비스 상태 확인

```bash
# 1. Health Check
curl https://yourdomain.com/health

# 예상 출력:
# {
#   "status": "ok",
#   "timestamp": "2025-10-10T12:00:00.000Z",
#   "uptime": 3600,
#   "checks": {
#     "database": { "status": "ok", "responseTime": "5ms" },
#     "redis": { "status": "ok" },
#     "stripe": { "status": "ok" }
#   }
# }
```

### 7.2 핵심 기능 테스트

```bash
# 1. 무료 사주 계산 (FREE)
curl -X POST https://yourdomain.com/api/fortune \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "남성",
    "birthYear": 1990,
    "birthMonth": 5,
    "birthDay": 15,
    "birthHour": 14,
    "birthMinute": 30,
    "calendarType": "solar",
    "serviceType": "free"
  }'

# 예상 출력: 200 OK + 사주 데이터

# 2. 프리미엄 사주 계산 (PREMIUM)
curl -X POST https://yourdomain.com/api/fortune \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "여성",
    "birthYear": 1995,
    "birthMonth": 3,
    "birthDay": 20,
    "birthHour": 10,
    "birthMinute": 0,
    "calendarType": "lunar",
    "serviceType": "premium"
  }'

# 예상 출력: 200 OK + 프리미엄 사주 데이터 (격국, 대운, 십이운성 포함)
```

### 7.3 브라우저 테스트

1. **홈페이지 접속**: `https://yourdomain.com`
   - [ ] 페이지 로딩 정상
   - [ ] 디자인 깨짐 없음
   - [ ] 콘솔 에러 없음

2. **무료 사주 계산**:
   - [ ] 생년월일 입력
   - [ ] "무료 사주 보기" 클릭
   - [ ] 결과 화면 표시 (기본 사주)

3. **프리미엄 사주 계산**:
   - [ ] "프리미엄 사주 보기" 클릭
   - [ ] 결과 화면 표시 (격국, 대운, 십이운성)

4. **후원 기능**:
   - [ ] "후원하기" 버튼 클릭
   - [ ] Stripe Checkout 리다이렉트
   - [ ] 결제 완료 후 감사 메시지

5. **카카오톡 공유하기**:
   - [ ] "카카오톡 공유" 버튼 클릭
   - [ ] 카카오톡 공유 팝업 표시
   - [ ] 공유 메시지 전송 성공

### 7.4 성능 테스트

```bash
# 1. 응답 시간 측정
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/

# curl-format.txt 내용:
# time_namelookup:  %{time_namelookup}\n
# time_connect:     %{time_connect}\n
# time_appconnect:  %{time_appconnect}\n
# time_pretransfer: %{time_pretransfer}\n
# time_starttransfer: %{time_starttransfer}\n
# time_total:       %{time_total}\n

# 예상 결과:
# time_total: < 1초 (TTFB: Time To First Byte)

# 2. Lighthouse 스코어 측정
# Chrome DevTools → Lighthouse → "Generate report"
# 목표:
# - Performance: > 90
# - Accessibility: > 95
# - Best Practices: > 90
# - SEO: > 90
```

### 7.5 로그 모니터링

```bash
# 1. 프로덕션 로그 확인 (PM2)
pm2 logs saju-fortune --lines 100

# 2. 에러 로그 확인
tail -f logs/error.log

# 3. 전체 로그 확인
tail -f logs/combined.log

# 예상 로그:
# 2025-10-10 12:00:00 [INFO]: 📝 Logger initialized
# 2025-10-10 12:00:05 [INFO]: 🚀 Server running on port 5000
# 2025-10-10 12:01:00 [INFO]: HTTP Request { method: 'POST', path: '/api/fortune' }
# 2025-10-10 12:01:02 [INFO]: 사주 계산 완료 { readingId: '...', duration: '1234ms' }
```

---

## 8. 모니터링 설정 (Monitoring Setup)

### 8.1 Uptime 모니터링

**권장 서비스**: UptimeRobot (무료), Pingdom, StatusCake

```bash
# UptimeRobot 설정:
# 1. https://uptimerobot.com 가입
# 2. "Add New Monitor" 클릭
# 3. Monitor Type: HTTP(s)
# 4. URL: https://yourdomain.com/health
# 5. Monitoring Interval: 5 minutes
# 6. Alert Contacts: 이메일 추가
```

### 8.2 Error Tracking (Sentry)

```bash
# 1. Sentry 설치
npm install @sentry/node @sentry/tracing

# 2. 환경변수 설정
SENTRY_DSN=https://your-key@sentry.io/your-project-id
SENTRY_ENVIRONMENT=production

# 3. server/index.ts에 Sentry 초기화 코드 추가 (선택사항)
```

### 8.3 Google Analytics

```bash
# 1. Google Analytics 4 계정 생성
# https://analytics.google.com

# 2. 측정 ID 복사 (G-XXXXXXXXXX)

# 3. 환경변수 설정
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# 4. 재빌드 및 재배포
npm run build
```

### 8.4 Custom Metrics Dashboard

```bash
# Admin Cache API로 캐시 통계 확인
curl https://yourdomain.com/api/admin/cache/stats

# 예상 출력:
# {
#   "keys": 42,
#   "hits": 156,
#   "misses": 18,
#   "hitRate": "89.7%"
# }
```

---

## 9. 롤백 절차 (Rollback Procedure)

### 9.1 긴급 롤백 (Critical Issue)

```bash
# Option A: Git 태그로 롤백
git checkout v1.0.0  # 이전 안정 버전
npm ci
npm run build
pm2 restart saju-fortune

# Option B: Docker 이미지 롤백
docker pull yourusername/saju-fortune:v1.0.0
docker stop saju-fortune
docker rm saju-fortune
docker run -d --name saju-fortune \
  -p 5000:5000 \
  --env-file .env.production \
  yourusername/saju-fortune:v1.0.0

# Option C: Vercel 롤백
# Vercel Dashboard → Deployments → 이전 배포 선택 → "Promote to Production"
```

### 9.2 데이터베이스 롤백

```bash
# 1. 현재 상태 백업
pg_dump $DATABASE_URL > backup_before_rollback.sql

# 2. 마이그레이션 롤백 (Drizzle는 자동 롤백 미지원)
# 수동으로 이전 스키마로 복원:
psql $DATABASE_URL < backup_previous_version.sql

# 3. 애플리케이션 재시작
pm2 restart saju-fortune
```

### 9.3 롤백 후 검증

```bash
# 1. Health Check
curl https://yourdomain.com/health

# 2. 기본 기능 테스트
# (7.2 핵심 기능 테스트 재실행)

# 3. 로그 확인
pm2 logs saju-fortune --lines 50
```

---

## 10. 최종 체크리스트 (Final Checklist)

### 배포 전 (Pre-Deployment)

- [ ] 모든 테스트 통과 (228 unit + 32 E2E)
- [ ] TypeScript 빌드 에러 0개
- [ ] 보안 취약점 High/Critical 0개
- [ ] Git 태그 생성 (v1.0.0)
- [ ] 문서 완성도 검증

### 환경 설정 (Environment)

- [ ] `NODE_ENV=production` 설정
- [ ] `DATABASE_URL` 설정 및 연결 테스트
- [ ] `SESSION_SECRET` 64자 이상 랜덤 키
- [ ] `STRIPE_SECRET_KEY` Live 키 (`sk_live_`)
- [ ] `REDIS_URL` 설정 및 연결 테스트

### 데이터베이스 (Database)

- [ ] PostgreSQL 프로비저닝 완료
- [ ] DB 마이그레이션 실행 성공
- [ ] 3개 테이블 생성 확인 (users, fortune_readings, donations)
- [ ] 자동 백업 활성화

### 결제 시스템 (Payment)

- [ ] Stripe Live Mode 전환
- [ ] Webhook Endpoint 등록 (`/api/webhooks/stripe`)
- [ ] 3개 이벤트 선택 (succeeded, failed, refunded)
- [ ] Health Check에서 Stripe 상태 `ok`

### 배포 (Deployment)

- [ ] 프로덕션 빌드 성공
- [ ] 배포 방법 선택 및 실행
- [ ] SSL 인증서 설정 (HTTPS)
- [ ] 커스텀 도메인 연결

### 검증 (Validation)

- [ ] Health Check 응답 정상 (`/health`)
- [ ] 무료 사주 계산 동작
- [ ] 프리미엄 사주 계산 동작
- [ ] 후원 기능 동작 (Stripe Checkout)
- [ ] 카카오톡 공유하기 동작
- [ ] Lighthouse 스코어 > 90

### 모니터링 (Monitoring)

- [ ] Uptime 모니터링 설정 (UptimeRobot)
- [ ] Error Tracking 설정 (Sentry, 선택사항)
- [ ] Google Analytics 설정 (선택사항)
- [ ] 로그 수집 확인 (Winston)

---

## 11. 트러블슈팅 (Troubleshooting)

### 문제 1: "Database connection failed"

**원인**: `DATABASE_URL` 환경변수 미설정 또는 잘못된 형식

**해결책**:
```bash
# 1. 환경변수 확인
echo $DATABASE_URL

# 2. 형식 검증 (sslmode=require 필수)
# postgresql://user:password@host:port/database?sslmode=require

# 3. 수동 연결 테스트
psql $DATABASE_URL -c "SELECT 1;"
```

### 문제 2: "Stripe webhook signature verification failed"

**원인**: `STRIPE_WEBHOOK_SECRET` 불일치

**해결책**:
```bash
# 1. Stripe Dashboard → Developers → Webhooks
# 2. Endpoint 클릭 → "Signing secret" 확인
# 3. 환경변수 업데이트
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# 4. 서버 재시작
pm2 restart saju-fortune
```

### 문제 3: "Redis connection timeout"

**원인**: Redis 서비스 다운 또는 잘못된 URL

**해결책**:
```bash
# 1. Redis 연결 테스트
redis-cli -u $REDIS_URL ping

# 2. Redis URL 형식 확인
# rediss://default:password@host:port (TLS 사용 시 rediss://)

# 3. Fallback: NodeCache 사용 (Redis 없이도 동작)
# 개발 환경처럼 In-Memory 캐시로 자동 전환됨
```

### 문제 4: "502 Bad Gateway (Nginx)"

**원인**: Node.js 서버가 실행되지 않음

**해결책**:
```bash
# 1. PM2 상태 확인
pm2 status

# 2. 서버 로그 확인
pm2 logs saju-fortune --lines 50

# 3. 서버 재시작
pm2 restart saju-fortune

# 4. Nginx 설정 확인
sudo nginx -t
sudo systemctl restart nginx
```

---

## 12. 추가 리소스 (Additional Resources)

### 공식 문서

- **PostgreSQL**: https://www.postgresql.org/docs/
- **Redis**: https://redis.io/docs/
- **Stripe**: https://stripe.com/docs
- **Playwright**: https://playwright.dev/
- **Winston**: https://github.com/winstonjs/winston
- **Drizzle ORM**: https://orm.drizzle.team/

### 프로젝트 내부 문서

- [E2E Testing Guide](./E2E_TESTING_GUIDE.md)
- [Stripe Webhook Testing](./STRIPE_WEBHOOK_TESTING.md)
- [PRD Compliance Task Plan](./PRD_COMPLIANCE_TASK_PLAN.md)

### 지원

- **이슈 리포팅**: GitHub Issues
- **보안 취약점**: security@yourdomain.com

---

## 13. 변경 이력 (Change Log)

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2025-10-10 | 초기 프로덕션 체크리스트 작성 |

---

**✅ 이 체크리스트를 모두 완료하면 프로덕션 배포가 완료됩니다!**

**🎉 축하합니다! 운명의 해답 MVP가 프로덕션에 성공적으로 배포되었습니다!**
