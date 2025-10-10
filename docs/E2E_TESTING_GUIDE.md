# E2E 테스트 실행 가이드

**작성일**: 2025-10-10
**목적**: Playwright E2E 테스트 32개 실행 및 검증

---

## 📋 사전 준비

### 1. Playwright 설치 확인

```bash
npx playwright --version
```

예상 출력: `Version 1.x.x`

### 2. 브라우저 설치

```bash
npx playwright install
```

chromium, firefox, webkit 브라우저가 설치됩니다.

### 3. 환경변수 설정

`.env` 파일에 다음 필수 환경변수가 설정되어 있는지 확인:

```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key-here
```

---

## 🚀 E2E 테스트 실행

### 방법 1: 개발 서버 + E2E 테스트 (권장)

**터미널 1** - 개발 서버 시작:
```bash
npm run dev
```

서버가 `http://localhost:5000`에서 실행되길 기다립니다.

**터미널 2** - E2E 테스트 실행:
```bash
npx playwright test
```

### 방법 2: 한 번에 실행 (package.json 스크립트 추가 권장)

`package.json`에 추가:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

실행:
```bash
npm run test:e2e
```

---

## 📊 테스트 목록 (32 tests)

### 🔥 Smoke Tests (2 tests)
- `e2e/smoke.spec.ts`:
  - ✅ has title
  - ✅ has form elements

### 🎯 사주풀이 전체 플로우 (27 tests)
- `e2e/saju-fortune.spec.ts`:
  - ✅ 홈페이지 로딩 및 기본 요소 확인
  - ✅ 사주 입력 폼 유효성 검사
  - ✅ 완전한 사주 정보 입력 및 결과 조회
  - ✅ 사주 결과 페이지 - 기본 정보 표시 확인
  - ✅ 사주 결과 페이지 - 격국 분석 표시 확인
  - ✅ 사주 결과 페이지 - 대운 타임라인 표시 확인
  - ✅ 사주 결과 페이지 - 십이운성 분석 표시 확인
  - ✅ 사주 결과 페이지 - 오행 균형 분석 확인
  - ✅ PDF 다운로드 기능 확인
  - ✅ 반응형 디자인 - 모바일 뷰 확인
  - ✅ 에러 처리 - 잘못된 날짜 입력
  - ✅ 뒤로 가기 후 폼 상태 유지
  - ✅ 다양한 생년월일 조합 테스트
  - ✅ 성능: 페이지 로딩 성능
  - ✅ 성능: 사주 계산 응답 시간
  - ✅ 접근성: 키보드 네비게이션
  - ✅ 접근성: ARIA 레이블 확인

### 🔌 API 통합 테스트 (13 tests)
- `e2e/api-integration.spec.ts`:
  - ✅ POST /api/fortune-readings - 사주 계산 API 정상 동작
  - ✅ POST /api/fortune-readings - 격국 분석 포함 확인
  - ✅ POST /api/fortune-readings - 대운 계산 포함 확인
  - ✅ POST /api/fortune-readings - 십이운성 분석 포함 확인
  - ✅ POST /api/fortune-readings - 잘못된 날짜 에러 처리
  - ✅ POST /api/fortune-readings - 필수 필드 누락 에러
  - ✅ POST /api/fortune-readings - 성능 테스트 (응답 시간)
  - ✅ POST /api/fortune-readings - 음력 변환 정상 동작
  - ✅ POST /api/fortune-readings - 다양한 연도 테스트
  - ✅ GET /api/fortune-readings/:id - 저장된 사주 조회
  - ✅ 사주 데이터 구조 검증
  - ✅ 동시 요청 처리 (부하 테스트)
  - ✅ 동일한 사주 요청 시 빠른 응답 (캐싱)

---

## 🎨 테스트 실행 모드

### Headless 모드 (기본)
```bash
npx playwright test
```

브라우저 창이 보이지 않고 백그라운드에서 실행됩니다.

### Headed 모드 (브라우저 보이기)
```bash
npx playwright test --headed
```

실제 브라우저 창을 열어서 테스트 과정을 확인할 수 있습니다.

### UI 모드 (권장 - 인터랙티브)
```bash
npx playwright test --ui
```

Playwright UI가 열려서 테스트를 하나씩 실행하고 결과를 확인할 수 있습니다.

### Debug 모드 (디버깅)
```bash
npx playwright test --debug
```

Playwright Inspector가 열려서 각 단계를 디버깅할 수 있습니다.

### 특정 테스트만 실행
```bash
# 특정 파일
npx playwright test e2e/smoke.spec.ts

# 특정 테스트 이름
npx playwright test -g "has title"

# 특정 브라우저
npx playwright test --project=chromium
```

---

## 📈 테스트 리포트

### HTML 리포트 생성
```bash
npx playwright test --reporter=html
```

테스트 완료 후 자동으로 HTML 리포트가 생성됩니다.

### 리포트 보기
```bash
npx playwright show-report
```

브라우저에서 상세한 테스트 결과를 확인할 수 있습니다.

### JSON 리포트 생성
```bash
npx playwright test --reporter=json --output=test-results/results.json
```

CI/CD 파이프라인에서 활용할 수 있습니다.

---

## ⚠️ 주의사항

### 1. 서버가 실행 중이어야 함

E2E 테스트는 실제 서버(`http://localhost:5000`)에 요청을 보냅니다.

테스트 전에 반드시:
```bash
npm run dev
```

### 2. DATABASE_URL 필수

API 통합 테스트는 실제 DB에 데이터를 저장하고 조회합니다.

`.env` 파일에 `DATABASE_URL` 설정 필수:
```bash
DATABASE_URL=postgresql://user:password@host/database
```

### 3. 포트 충돌 주의

다른 프로세스가 포트 5000을 사용 중이면 테스트가 실패합니다.

확인:
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

### 4. 테스트 데이터 정리

E2E 테스트는 DB에 테스트 데이터를 생성합니다.

정기적으로 정리 권장:
```sql
DELETE FROM fortune_readings WHERE session_id LIKE 'test-%';
DELETE FROM donations WHERE reading_id LIKE 'test-%';
```

---

## 🔍 트러블슈팅

### 문제: "Timeout 30000ms exceeded"

**원인**: 서버 응답이 느리거나 서버가 실행 중이 아님

**해결**:
1. 서버가 실행 중인지 확인: `curl http://localhost:5000/health`
2. Timeout 시간 증가:
   ```javascript
   // playwright.config.ts
   timeout: 60000 // 60초로 증가
   ```

### 문제: "Navigation failed because page crashed"

**원인**: 브라우저 충돌

**해결**:
```bash
# 브라우저 재설치
npx playwright install --force
```

### 문제: "Target page, context or browser has been closed"

**원인**: 테스트 중 페이지가 닫힘

**해결**:
```javascript
// 테스트 코드에서 await 누락 확인
await page.click('button'); // ✅
page.click('button'); // ❌ await 누락
```

### 문제: "locator.click: Target closed"

**원인**: 요소가 클릭되기 전에 페이지 이동

**해결**:
```javascript
// 명시적 대기 추가
await page.waitForSelector('button[type="submit"]', { state: 'visible' });
await page.click('button[type="submit"]');
```

### 문제: "DATABASE_URL is not set"

**원인**: 환경변수 누락

**해결**:
```bash
# .env 파일 확인
cat .env | grep DATABASE_URL

# .env 파일이 없으면 생성
cp .env.example .env
# DATABASE_URL 설정
```

---

## 📝 CI/CD 통합

### GitHub Actions 예시

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Start server
        run: npm run dev &
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          SESSION_SECRET: ${{ secrets.SESSION_SECRET }}

      - name: Wait for server
        run: npx wait-on http://localhost:5000/health

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🎯 성공 기준

### 모든 테스트 통과
```bash
npx playwright test
```

예상 출력:
```
Running 32 tests using 1 worker

  ✓  32 passed (1m 30s)
```

### 성능 기준 달성
- 페이지 로딩: < 2초
- 사주 계산 API: < 1초
- PDF 다운로드: < 3초

### 접근성 기준 통과
- 키보드 네비게이션 작동
- ARIA 레이블 존재
- 스크린 리더 호환

---

## 📚 참고 자료

- [Playwright 공식 문서](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

**다음 단계**: 실제 E2E 테스트 실행 및 결과 검증
