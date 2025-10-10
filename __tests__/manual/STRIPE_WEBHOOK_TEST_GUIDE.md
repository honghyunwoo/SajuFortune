# Stripe Webhook 수동 테스트 가이드

**목적**: PRD API-004 요구사항 검증  
**소요 시간**: 30분  
**필수 도구**: Stripe CLI

---

## 📋 사전 준비

### 1. Stripe CLI 설치

```bash
# Windows (Scoop)
scoop install stripe

# macOS (Homebrew)
brew install stripe/stripe-cli/stripe

# 수동 설치
https://github.com/stripe/stripe-cli/releases
```

### 2. Stripe CLI 로그인

```bash
stripe login
# 브라우저가 열리며 인증 진행
```

### 3. 환경변수 확인

```bash
# .env 파일에 다음 값 설정
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # (선택, 로컬 테스트 시 자동 생성)
```

---

## 🧪 테스트 시나리오

### Test 1: payment_intent.succeeded 이벤트

**목표**: 결제 성공 시 DB 업데이트 확인

```bash
# Terminal 1: 개발 서버 시작
npm run dev

# Terminal 2: Webhook 리스닝
stripe listen --forward-to localhost:5000/api/stripe-webhook

# ✅ 출력 확인:
# > Ready! Your webhook signing secret is whsec_xxx (^C to quit)
```

**테스트 실행**:
```bash
# Terminal 3: 결제 성공 이벤트 트리거
stripe trigger payment_intent.succeeded --add payment_intent:metadata[type]=donation --add payment_intent:metadata[readingId]=test-123

# ✅ 기대 결과:
# 1. Terminal 2에 "[200] POST /api/stripe-webhook" 표시
# 2. 서버 로그에 "Payment succeeded" 로그 출력
# 3. DB donations 테이블에서 isPaid = true 확인
```

**DB 확인**:
```bash
npm run db:studio
# Drizzle Studio 열림 → donations 테이블 → isPaid 컬럼 확인
```

---

### Test 2: payment_intent.payment_failed 이벤트

**목표**: 결제 실패 시 로그 기록 확인

```bash
stripe trigger payment_intent.payment_failed

# ✅ 기대 결과:
# 1. Terminal 2에 "[200] POST /api/stripe-webhook" 표시
# 2. 서버 로그에 "Payment failed" 로그 출력
# 3. 에러 메시지 포함 로그 확인
```

---

### Test 3: 잘못된 서명 (보안 검증)

**목표**: Webhook 서명 불일치 시 400 에러 반환

```bash
# STRIPE_WEBHOOK_SECRET 설정 후
# 잘못된 서명으로 직접 요청

curl -X POST http://localhost:5000/api/stripe-webhook \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: wrong-signature" \
  -d '{"type": "payment_intent.succeeded"}'

# ✅ 기대 결과:
# HTTP 400 Bad Request
# {"success": false, "error": {"code": "E4xxx", "message": "..."}}
```

---

## ✅ 체크리스트

- [ ] Stripe CLI 설치 완료
- [ ] `stripe listen` 실행 성공
- [ ] `payment_intent.succeeded` 트리거 → DB 업데이트 확인
- [ ] `payment_intent.payment_failed` 트리거 → 로그 확인
- [ ] 잘못된 서명 → 400 에러 확인
- [ ] 서버 로그에 Winston 구조화 로그 출력 확인
- [ ] Drizzle Studio에서 donations 테이블 확인

---

## 📝 테스트 결과 기록

### payment_intent.succeeded
- [ ] 이벤트 수신: ⬜ Success / ⬜ Fail
- [ ] DB 업데이트: ⬜ isPaid = true / ⬜ 변경 없음
- [ ] 로그 출력: ⬜ Success / ⬜ 없음

### payment_intent.payment_failed
- [ ] 이벤트 수신: ⬜ Success / ⬜ Fail
- [ ] 로그 출력: ⬜ 에러 메시지 포함 / ⬜ 없음

### 서명 검증
- [ ] 잘못된 서명: ⬜ 400 에러 / ⬜ 통과됨 (보안 문제!)

---

## 🐛 문제 발생 시

### 문제 1: "webhook signing secret not set"
**해결**: 
```bash
# Terminal 2의 whsec_xxx 값을 .env에 추가
STRIPE_WEBHOOK_SECRET=whsec_xxx
# 서버 재시작
```

### 문제 2: "Connection refused"
**해결**:
```bash
# 서버가 5000 포트에서 실행 중인지 확인
curl http://localhost:5000/health
```

### 문제 3: "DB 업데이트 안 됨"
**해결**:
```bash
# updateDonationPayment 함수 확인
# storage.ts에서 로직 검증
```

---

**작성자**: AI Lead Developer  
**다음 단계**: E2E 자동화 테스트 작성

