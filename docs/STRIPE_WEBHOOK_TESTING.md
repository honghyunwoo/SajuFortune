# Stripe Webhook 테스트 가이드

**작성일**: 2025-10-10
**목적**: Stripe Webhook 이벤트 로컬 테스트 및 검증

---

## 📋 사전 준비

### 1. Stripe CLI 설치

**Windows**:
```bash
# Scoop 사용
scoop install stripe

# 또는 직접 다운로드
https://github.com/stripe/stripe-cli/releases/latest
```

**macOS**:
```bash
brew install stripe/stripe-cli/stripe
```

**Linux**:
```bash
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

### 2. Stripe CLI 로그인

```bash
stripe login
```

브라우저가 열리면 Stripe 계정으로 로그인하고 권한을 부여합니다.

### 3. 환경변수 설정

`.env` 파일에 다음 변수들이 설정되어 있는지 확인:

```bash
# Stripe API 키
STRIPE_SECRET_KEY=sk_test_...

# Webhook 서명 검증 키 (로컬 테스트용)
STRIPE_WEBHOOK_SECRET=whsec_...

# 서버 포트
PORT=5000
```

---

## 🚀 로컬 Webhook 테스트

### 1. 개발 서버 시작

```bash
npm run dev
```

서버가 `http://localhost:5000`에서 실행됩니다.

### 2. Stripe CLI Webhook 포워딩

**새 터미널을 열고**:

```bash
stripe listen --forward-to localhost:5000/api/stripe-webhook
```

출력 예시:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef (^C to quit)
```

이 `whsec_...` 값을 `.env` 파일의 `STRIPE_WEBHOOK_SECRET`에 복사합니다.

### 3. Webhook 이벤트 트리거

**또 다른 터미널을 열고**:

#### 결제 성공 이벤트
```bash
stripe trigger payment_intent.succeeded
```

예상 로그 (서버):
```
✅ [Payment] succeeded | pi_xxx | 1000 | {"type":"donation"}
```

#### 결제 실패 이벤트
```bash
stripe trigger payment_intent.payment_failed
```

예상 로그 (서버):
```
❌ [Payment] failed | pi_xxx | 1000 | {"error":"Card declined"}
```

#### 환불 이벤트
```bash
stripe trigger charge.refunded
```

예상 로그 (서버):
```
♻️  [Payment] refunded | pi_xxx | 1000 | {"refundReason":"requested_by_customer"}
```

---

## 🧪 E2E 테스트 시나리오

### 시나리오 1: 후원 결제 전체 플로우

1. **후원 요청 생성**:
```bash
curl -X POST http://localhost:5000/api/create-donation \
  -H "Content-Type: application/json" \
  -d '{
    "readingId": "test-reading-123",
    "amount": 5000,
    "donorName": "테스트 후원자",
    "message": "응원합니다!"
  }'
```

응답:
```json
{
  "clientSecret": "pi_xxx_secret_yyy",
  "donationId": "donation-123"
}
```

2. **Stripe CLI로 결제 성공 시뮬레이션**:
```bash
stripe trigger payment_intent.succeeded
```

3. **DB 확인**:
```bash
curl http://localhost:5000/api/donations/test-reading-123
```

예상 응답:
```json
[
  {
    "id": "donation-123",
    "isPaid": true,
    "amount": 5000,
    "donorName": "테스트 후원자"
  }
]
```

### 시나리오 2: 결제 실패 처리

1. 결제 실패 이벤트 트리거:
```bash
stripe trigger payment_intent.payment_failed
```

2. 서버 로그 확인:
```
❌ [Payment] failed | pi_xxx | 1000 | {"error":"..."}
```

### 시나리오 3: 환불 처리

1. 환불 이벤트 트리거:
```bash
stripe trigger charge.refunded
```

2. 서버 로그 확인:
```
♻️  [Payment] refunded | pi_xxx | 1000 | {"refundReason":"..."}
```

---

## 🔍 Webhook 서명 검증 테스트

### 유효한 서명 테스트

Stripe CLI를 통해 전송된 이벤트는 자동으로 유효한 서명을 포함합니다.

```bash
stripe listen --forward-to localhost:5000/api/stripe-webhook
stripe trigger payment_intent.succeeded
```

예상 결과:
```
✅ Webhook 이벤트 수신 성공
✅ 서명 검증 통과
✅ DB 업데이트 완료
```

### 무효한 서명 테스트

잘못된 서명으로 직접 요청 전송:

```bash
curl -X POST http://localhost:5000/api/stripe-webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: invalid_signature" \
  -d '{
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_test_123",
        "amount": 5000
      }
    }
  }'
```

예상 결과:
```json
{
  "error": "Webhook signature verification failed"
}
```

---

## 📊 검증 체크리스트

### Webhook 이벤트 처리

- [ ] `payment_intent.succeeded` 이벤트 수신 및 DB 업데이트
- [ ] `payment_intent.payment_failed` 이벤트 로깅
- [ ] `charge.refunded` 이벤트 로깅
- [ ] 알 수 없는 이벤트 타입 무시

### 서명 검증

- [ ] 유효한 서명으로 이벤트 수신 시 처리 성공
- [ ] 무효한 서명으로 이벤트 수신 시 거부
- [ ] `STRIPE_WEBHOOK_SECRET` 없을 때 경고 로그

### 에러 처리

- [ ] 존재하지 않는 `paymentIntentId`에 대한 graceful 처리
- [ ] DB 연결 실패 시 에러 로깅
- [ ] Stripe API 오류 시 재시도 로직 (선택)

### 로깅

- [ ] 모든 Webhook 이벤트 로깅
- [ ] 결제 성공/실패/환불 상태 로깅
- [ ] 에러 상황 상세 로깅

---

## 🛠️ 트러블슈팅

### 문제: "Webhook signing secret not found"

**원인**: `.env` 파일에 `STRIPE_WEBHOOK_SECRET` 없음

**해결**:
1. `stripe listen` 실행 시 출력되는 `whsec_...` 복사
2. `.env` 파일에 추가:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```
3. 서버 재시작

### 문제: "Connection refused to localhost:5000"

**원인**: 개발 서버가 실행 중이 아님

**해결**:
```bash
npm run dev
```

### 문제: "stripe: command not found"

**원인**: Stripe CLI 설치 안 됨

**해결**:
```bash
# Windows
scoop install stripe

# macOS
brew install stripe/stripe-cli/stripe
```

### 문제: Webhook 이벤트가 서버에 도달하지 않음

**원인**: 방화벽 또는 포트 문제

**해결**:
1. 포트 확인:
   ```bash
   netstat -an | findstr :5000  # Windows
   lsof -i :5000                 # macOS/Linux
   ```
2. 방화벽 허용 규칙 추가
3. `stripe listen` 재시작

---

## 📝 프로덕션 배포 시 주의사항

### 1. Webhook Endpoint 등록

Stripe Dashboard → Developers → Webhooks → Add endpoint

```
Endpoint URL: https://your-domain.com/api/stripe-webhook
Events to send:
  - payment_intent.succeeded
  - payment_intent.payment_failed
  - charge.refunded
```

### 2. Webhook Secret 설정

Dashboard에서 생성된 `whsec_...` 값을 프로덕션 환경변수로 설정:

```bash
STRIPE_WEBHOOK_SECRET=whsec_production_secret_here
```

### 3. HTTPS 필수

Stripe Webhook은 HTTPS 엔드포인트만 지원합니다.

---

## 🔗 참고 자료

- [Stripe CLI 문서](https://stripe.com/docs/stripe-cli)
- [Webhook 테스트 가이드](https://stripe.com/docs/webhooks/test)
- [Webhook 서명 검증](https://stripe.com/docs/webhooks/signatures)
- [이벤트 타입 목록](https://stripe.com/docs/api/events/types)

---

**다음 단계**: 실제 Stripe CLI로 로컬 테스트 수행 및 결과 검증
