# Railway 배포 가이드 (초보자용)

**작성일**: 2025-10-24
**예상 소요 시간**: 30분
**월 비용**: $5 (Railway Hobby Plan)

---

## 🎯 배포 전 준비사항

### 1. 필요한 계정 (모두 무료 가입)

- ✅ **GitHub 계정** - 코드 저장용 ([github.com](https://github.com))
- ✅ **Railway 계정** - 서버 호스팅용 ([railway.app](https://railway.app))
- ✅ **NeonDB 계정** - 데이터베이스용 ([neon.tech](https://neon.tech))
- ✅ **Stripe 계정** - 결제 처리용 ([stripe.com](https://stripe.com))

### 2. 필요한 정보 (미리 준비)

- 📧 이메일 주소
- 💳 신용카드 (Railway $5/월 결제용)

---

## 📋 배포 단계별 가이드

### STEP 1: GitHub에 코드 업로드 (5분)

**목적**: 코드를 안전하게 저장하고 Railway와 연결

1. **GitHub에서 새 저장소 생성**
   - [github.com/new](https://github.com/new) 접속
   - Repository name: `sajufortune` (원하는 이름)
   - Private 선택 (코드 비공개)
   - Create repository 클릭

2. **코드 업로드**
   ```bash
   # Windows PowerShell에서 프로젝트 폴더로 이동
   cd "C:\Users\hynoo\OneDrive\바탕 화면\SajuFortune\SajuFortune"

   # Git 초기화 (처음 한 번만)
   git init
   git add .
   git commit -m "Initial commit"

   # GitHub 연결 (YOUR_USERNAME를 본인 계정으로 변경)
   git remote add origin https://github.com/YOUR_USERNAME/sajufortune.git
   git branch -M main
   git push -u origin main
   ```

3. **업로드 확인**
   - GitHub 저장소 페이지에서 파일들이 보이는지 확인

---

### STEP 2: NeonDB 데이터베이스 생성 (5분)

**목적**: PostgreSQL 데이터베이스를 클라우드에 생성

1. **NeonDB 회원가입**
   - [neon.tech](https://neon.tech) 접속
   - Sign up with GitHub (GitHub 계정으로 가입)
   - 이메일 인증

2. **데이터베이스 생성**
   - Create a Project 클릭
   - Project name: `sajufortune-db` (원하는 이름)
   - Region: `AWS / US East (Ohio)` 선택 (한국과 가까움)
   - PostgreSQL version: `16` 선택
   - Create Project 클릭

3. **연결 정보 복사**
   - Connection string 섹션에서 **"Pooled connection"** 선택
   - `postgresql://username:password@...` 형식의 URL 복사
   - 메모장에 저장 (나중에 Railway에서 사용)

---

### STEP 3: Stripe 설정 (10분)

**목적**: 후원 결제 기능 활성화

#### 3.1 Stripe 계정 생성

1. [stripe.com](https://stripe.com) 접속
2. Start now → Sign up 클릭
3. 이메일, 비밀번호 입력 후 계정 생성
4. 비즈니스 정보 입력 (개인 사업자 선택 가능)

#### 3.2 API 키 발급

1. Stripe 대시보드 → **Developers** 클릭
2. **API keys** 탭 클릭
3. **Viewing test data** 토글을 **OFF** (프로덕션 모드로 전환)
4. 두 개의 키 복사 (메모장에 저장):
   - `Publishable key` (pk_live_로 시작)
   - `Secret key` (sk_live_로 시작, Show 클릭 후 복사)

#### 3.3 Webhook 설정

1. Stripe 대시보드 → **Developers** → **Webhooks** 클릭
2. **Add endpoint** 클릭
3. **Endpoint URL** 입력:
   ```
   https://YOUR_APP_NAME.up.railway.app/api/webhook/stripe
   ```
   (YOUR_APP_NAME은 나중에 Railway에서 받을 주소, 일단 임시로 입력)

4. **Select events** 클릭 후 다음 3개 선택:
   - `charge.succeeded`
   - `charge.failed`
   - `charge.refunded`

5. **Add endpoint** 클릭
6. **Signing secret** 복사 (whsec_로 시작, 메모장에 저장)

---

### STEP 4: Railway 배포 (10분)

**목적**: 웹사이트를 인터넷에 공개

#### 4.1 Railway 회원가입

1. [railway.app](https://railway.app) 접속
2. **Login with GitHub** 클릭
3. Railway에 GitHub 액세스 권한 부여

#### 4.2 프로젝트 생성

1. **New Project** 클릭
2. **Deploy from GitHub repo** 선택
3. 방금 만든 `sajufortune` 저장소 선택
4. **Deploy Now** 클릭

#### 4.3 환경변수 설정

1. 배포된 프로젝트 클릭
2. **Variables** 탭 클릭
3. **RAW Editor** 클릭 (오른쪽 상단)
4. 다음 내용을 붙여넣기 (값들은 미리 준비한 정보로 변경):

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=여기에_64자_이상의_랜덤_문자열_입력
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
FRONTEND_URL=https://your-app-name.up.railway.app
LOG_LEVEL=info
```

**SESSION_SECRET 생성 방법**:
```powershell
# Windows PowerShell에서 실행
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

5. **Update Variables** 클릭

#### 4.4 도메인 확인

1. **Settings** 탭 클릭
2. **Public Networking** 섹션에서 **Generate Domain** 클릭
3. 생성된 URL 복사 (예: `https://sajufortune-production.up.railway.app`)
4. **Variables** 탭으로 돌아가서 `FRONTEND_URL` 값을 방금 복사한 URL로 변경

#### 4.5 Stripe Webhook URL 업데이트

1. Stripe 대시보드 → **Webhooks** 탭
2. 방금 만든 Webhook 클릭
3. **Endpoint URL** 편집:
   ```
   https://sajufortune-production.up.railway.app/api/webhook/stripe
   ```
   (실제 Railway 도메인으로 변경)
4. **Update endpoint** 클릭

---

### STEP 5: 배포 확인 (5분)

#### 5.1 서버 상태 확인

1. Railway 대시보드에서 **Deployments** 탭 확인
2. 최신 배포가 **SUCCESS** 상태인지 확인
3. 다음 URL 접속하여 확인:
   ```
   https://your-app-name.up.railway.app/health
   ```

   **정상 응답 예시**:
   ```json
   {
     "status": "healthy",
     "version": "1.0.0",
     "checks": {
       "database": { "status": "ok" },
       "stripe": { "status": "ok" }
     }
   }
   ```

#### 5.2 웹사이트 접속

1. Railway 도메인으로 접속:
   ```
   https://your-app-name.up.railway.app
   ```

2. 사주 계산 기능 테스트:
   - 생년월일 입력
   - 사주풀이 시작하기 클릭
   - 결과가 정상적으로 표시되는지 확인

#### 5.3 Stripe Webhook 테스트

1. Stripe 대시보드 → **Webhooks** → 등록한 Webhook 클릭
2. **Send test event** 클릭
3. `charge.succeeded` 이벤트 선택
4. **Send test event** 클릭
5. **Response** 탭에서 `200 OK` 확인

---

## 💰 비용 안내

### Railway 요금제

- **Hobby Plan**: $5/월
  - 500시간/월 서버 실행 시간
  - $0.000231/분 (초과 시)
  - 8GB RAM, 8 vCPU
  - 100GB 대역폭/월

### NeonDB 요금제

- **Free Tier**: $0/월 (충분함)
  - 10GB 저장공간
  - 100시간/월 컴퓨팅 시간
  - 무제한 프로젝트

### Stripe 수수료

- **국내 카드**: 3.6% + 50원/건
- **해외 카드**: 4.3% + 50원/건
- 월 사용료 없음 (거래당 수수료만 부과)

**예상 월 비용**: $5 (Railway만 유료)

---

## 🔧 문제 해결 (Troubleshooting)

### Q1: 배포가 실패했어요 (Deploy Failed)

**원인**: 환경변수 누락 또는 오타

**해결**:
1. Railway → **Deployments** → 실패한 배포 클릭
2. **Logs** 탭에서 에러 메시지 확인
3. `DATABASE_URL`, `SESSION_SECRET` 등이 올바른지 확인
4. Variables 탭에서 수정 후 **Redeploy** 클릭

---

### Q2: /health 접속 시 503 에러

**원인**: 데이터베이스 연결 실패

**해결**:
1. NeonDB 대시보드에서 데이터베이스가 **Active** 상태인지 확인
2. `DATABASE_URL`이 정확한지 확인 (복사 시 공백 없는지)
3. Railway → Variables → `DATABASE_URL` 재입력 후 Redeploy

---

### Q3: Stripe Webhook이 작동하지 않아요

**원인**: Webhook URL 오류 또는 Secret 불일치

**해결**:
1. Stripe 대시보드 → Webhooks 확인
2. Endpoint URL이 Railway 도메인과 정확히 일치하는지 확인
3. `STRIPE_WEBHOOK_SECRET`이 정확한지 확인
4. Stripe에서 **Send test event** 재전송

---

### Q4: 사주 계산이 안 돼요

**원인**: 데이터베이스 마이그레이션 미실행

**해결**:
1. Railway 대시보드 → 프로젝트 선택
2. **Deployments** → 최신 배포의 **Logs** 확인
3. "마이그레이션 완료" 메시지가 있는지 확인
4. 없으면 Redeploy 클릭 (마이그레이션 자동 실행)

---

### Q5: 커스텀 도메인을 연결하고 싶어요

**방법**:
1. 도메인 구매 (가비아, AWS Route 53 등)
2. Railway → Settings → Custom Domains
3. **Add Custom Domain** 클릭
4. 도메인 입력 (예: `sajufortune.com`)
5. Railway가 제공하는 CNAME 레코드를 도메인 DNS 설정에 추가
6. 5-10분 후 SSL 인증서 자동 발급 완료

---

## ✅ 배포 완료 체크리스트

배포 후 다음 항목들을 모두 확인하세요:

- [ ] Railway 도메인 접속 가능
- [ ] `/health` 엔드포인트 응답 정상 (200 OK)
- [ ] 사주 계산 기능 작동
- [ ] 후원하기 버튼 클릭 시 Stripe 결제 창 표시
- [ ] Stripe Webhook 테스트 성공 (200 OK)
- [ ] 데이터베이스 연결 정상 (health check에서 확인)
- [ ] 로그에 에러 없음 (Railway Logs 확인)

---

## 🚀 다음 단계 (선택사항)

### 1. Redis 캐싱 추가 (성능 향상)

**효과**: 응답 속도 2-3배 향상

**방법**:
1. Railway 대시보드 → **Add Plugin** → **Redis**
2. Redis 플러그인 클릭 → **Variables** 탭
3. `REDIS_URL` 복사
4. 메인 프로젝트 → Variables → `REDIS_URL` 추가

**비용**: +$1-2/월

---

### 2. Google Analytics 연동

**효과**: 방문자 통계 확인

**방법**:
1. [analytics.google.com](https://analytics.google.com) 접속
2. 계정 생성 → 속성 만들기
3. Measurement ID 복사 (G-XXXXXXXXXX)
4. Railway → Variables → `VITE_GA_MEASUREMENT_ID` 추가

**비용**: 무료

---

### 3. 카카오톡 공유하기 기능

**효과**: 사용자가 결과를 카톡으로 공유 가능

**방법**:
1. [developers.kakao.com](https://developers.kakao.com) 접속
2. 앱 만들기 → JavaScript 키 복사
3. Railway → Variables → `VITE_KAKAO_JS_KEY` 추가

**비용**: 무료

---

## 📞 지원

배포 중 문제가 발생하면:

1. **Railway 커뮤니티**: [discord.gg/railway](https://discord.gg/railway)
2. **NeonDB 문서**: [neon.tech/docs](https://neon.tech/docs)
3. **Stripe 지원**: [support.stripe.com](https://support.stripe.com)

---

**작성자**: SuperClaude
**최종 업데이트**: 2025-10-24
**난이도**: ⭐⭐☆☆☆ (초보자 가능)
