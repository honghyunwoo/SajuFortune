# 오류 로그 (Error Log)

## 프로젝트: SajuFortune
**수석 개발자**: Claude
**작성일**: 2025-10-02

---

## 오류 기록 형식
```
### 오류 #N: [오류 제목]
- **발생일**: YYYY-MM-DD
- **파일**: 경로/파일명.ts:라인번호
- **심각도**: 🔴 Critical | 🟡 Warning | 🟢 Info
- **오류 메시지**:
- **원인 분석**:
- **해결 방법**:
- **재발 방지**:
- **관련 커밋**:
```

---

## 구현 단계별 오류 기록

### 오류 #1: 타입 정의 누락 - AnalysisResult
- **발생일**: 2025-10-02
- **파일**: `client/src/components/result-display.tsx:215`
- **심각도**: 🔴 Critical (TypeScript 컴파일 실패)
- **오류 메시지**:
```
Property 'geokguk' does not exist on type 'AnalysisResult'.
Property 'daeun' does not exist on type 'AnalysisResult'.
Property 'sibiunseong' does not exist on type 'AnalysisResult'.
```

- **원인 분석**:
  1. `shared/schema.ts`의 `AnalysisResult` 인터페이스에 새로운 필드 미정의
  2. 격국/대운/십이운성 기능 추가 시 스키마 업데이트 누락
  3. UI 컴포넌트는 이미 새 필드를 참조하고 있었으나 타입 정의가 뒤쳐짐

- **해결 방법**:
```typescript
// shared/schema.ts
export interface AnalysisResult {
  personality: string;
  todayFortune: TodayFortune;
  detailedAnalysis: DetailedAnalysis;
  compatibility: Compatibility;
  monthlyFortune: MonthlyFortuneItem[];
  advice: Advice;
  geokguk?: any; // 격국 분석 결과 - ADDED
  daeun?: any; // 대운 결과 - ADDED
  sibiunseong?: any; // 십이운성 결과 - ADDED
}
```

- **재발 방지**:
  1. 새 기능 추가 시 스키마 업데이트를 최우선으로 진행
  2. 타입 정의 → 구현 → UI 순서 준수
  3. `npm run check` (tsc) 자동화

- **관련 커밋**: feat: Complete premium saju analysis system

---

### 오류 #2: 타입 이름 불일치 - 절기타입
- **발생일**: 2025-10-02
- **파일**: `shared/daeun-calculator.ts:85`
- **심각도**: 🔴 Critical (TypeScript 컴파일 실패)
- **오류 메시지**:
```
Cannot find name '절기타입'.
```

- **원인 분석**:
  1. `solar-terms.ts`에서 export하는 타입명이 `SolarTermName`
  2. `daeun-calculator.ts`에서 `절기타입`으로 잘못 참조
  3. 한글/영문 타입명 혼용으로 인한 불일치

- **해결 방법**:
```typescript
// 잘못된 코드
import { get절기 } from './solar-terms';
function get절기명For월(월: number): 절기타입 { ... }

// 수정된 코드
import { get절기, type SolarTermName } from './solar-terms';
function get절기명For월(월: number): SolarTermName { ... }
```

- **재발 방지**:
  1. Import 시 타입 정의 함께 확인
  2. IDE의 자동완성 활용
  3. 타입 명명 규칙 정리 (한글 vs 영문)

- **관련 커밋**: feat: Complete premium saju analysis system

---

### 오류 #3: 배열 인덱스 타입 추론 실패 - 십신표
- **발생일**: 2025-10-02
- **파일**: `shared/geokguk-analyzer.ts:142`
- **심각도**: 🔴 Critical (TypeScript 컴파일 실패)
- **오류 메시지**:
```
Element implicitly has an 'any' type because expression of type 'number'
can't be used to index type '{ [key: string]: 십신타입[] }'.
```

- **원인 분석**:
  1. `십신표` 객체가 문자열 키를 가지지만 배열 인덱스로 접근 시도
  2. TypeScript가 `천간.indexOf(월간)` 반환값을 숫자로 추론하지 못함
  3. 이중 인덱싱 `십신표[일간][천간.indexOf(월간)]`의 타입 안전성 문제

- **해결 방법**:
```typescript
// 잘못된 코드
const 월간십신 = 십신표[일간][천간.indexOf(월간)];

// 수정된 코드 (방법 1: 직접 접근)
const 월간십신 = 십신표[일간][월간];

// 십신표 구조 변경
export const 십신표: { [key in 천간타입]: { [key in 천간타입]: 십신타입 } } = {
    '갑': { '갑': '비견', '을': '겁재', '병': '식신', ... },
    ...
};
```

- **재발 방지**:
  1. 객체 구조 설계 시 접근 패턴 고려
  2. 이중 인덱싱보다 객체 키 직접 접근 선호
  3. 타입 단언보다 구조 개선 우선

- **관련 커밋**: feat: Complete premium saju analysis system

---

### 오류 #4: 모듈 import 경로 오류
- **발생일**: 2025-10-02
- **파일**: `shared/sibiunseong-analyzer.ts:1`
- **심각도**: 🔴 Critical (모듈 해석 실패)
- **오류 메시지**:
```
Cannot find module './types' or its corresponding type declarations.
```

- **원인 분석**:
  1. 존재하지 않는 `./types` 모듈 import 시도
  2. 타입 정의가 실제로는 `./astro-data.ts`에 위치
  3. 개발 중 모듈 구조 변경 후 import 경로 미업데이트

- **해결 방법**:
```typescript
// 잘못된 코드
import type { 천간타입, 지지타입, 오행타입 } from './types';

// 수정된 코드
import type { 천간타입, 지지타입, 오행타입 } from './astro-data';

// 또는 필요시 로컬 인터페이스 정의
export interface 사주정보 {
  year: { gan: 천간타입; ji: 지지타입 };
  month: { gan: 천간타입; ji: 지지타입 };
  day: { gan: 천간타입; ji: 지지타입 };
  hour: { gan: 천간타입; ji: 지지타입 };
}
```

- **재발 방지**:
  1. 모듈 구조 변경 시 전체 프로젝트 검색 (`Ctrl+Shift+F`)
  2. Import 경로는 상대경로보다 절대경로 선호 (`@shared/...`)
  3. IDE의 자동 import 기능 활용

- **관련 커밋**: feat: Complete premium saju analysis system

---

### 오류 #5: 의존성 패키지 누락
- **발생일**: 2025-10-02
- **파일**: `server/cache.ts:6-7`
- **심각도**: 🟡 Warning (런타임 에러 가능)
- **오류 메시지**:
```
Cannot find module 'node-cache'
Cannot find module 'ioredis'
```

- **원인 분석**:
  1. 캐싱 시스템 구현 시 새로운 npm 패키지 필요
  2. `package.json`에 패키지 추가 누락
  3. TypeScript 컴파일은 성공하지만 런타임 에러 발생 가능

- **해결 방법**:
```bash
# 패키지 설치
npm install node-cache ioredis

# package.json에 자동 추가됨
{
  "dependencies": {
    "node-cache": "^5.1.2",
    "ioredis": "^5.3.2"
  }
}
```

- **재발 방지**:
  1. 새 패키지 사용 전 설치 확인
  2. `npm run build` 로컬 테스트 필수
  3. CI/CD 파이프라인에서 의존성 체크

- **관련 커밋**: feat: Complete premium saju analysis system

---

## 논리 오류 및 버그 (Logic Errors)

### 버그 #1: 대운 순행/역행 계산 검증 필요
- **발견일**: 2025-10-02 (코드 리뷰 중)
- **파일**: `shared/daeun-calculator.ts:120-145`
- **심각도**: 🟡 Warning (명리학 정확도)
- **설명**:
  - 대운 순행/역행 로직이 구현되어 있으나 실제 명리학 규칙과 100% 일치 검증 필요
  - 양년생/음년생 판단 로직이 천간 기준인지 지지 기준인지 명확화 필요

- **현재 구현**:
```typescript
function is양년(year: number): boolean {
    const 년간 = getYearGan(year);
    const 양간 = ['갑', '병', '무', '경', '임'];
    return 양간.includes(년간);
}

const 순행 = (gender === 'male' && is양년(birthYear)) ||
             (gender === 'female' && !is양년(birthYear));
```

- **검증 필요 사항**:
  1. 명리학 서적과 대조 검증
  2. 다양한 생년월일 테스트 케이스
  3. 전문가 리뷰

- **상태**: ⏳ 검증 대기

---

### 버그 #2: 십이운성 강도 점수 알고리즘
- **발견일**: 2025-10-02 (코드 리뷰 중)
- **파일**: `shared/sibiunseong-analyzer.ts:230-260`
- **심각도**: 🟢 Info (개선 권장)
- **설명**:
  - 십이운성 강도를 0-100 점수로 변환하는 알고리즘이 단순 매핑
  - 실제 명리학에서는 상황에 따라 강도가 달라질 수 있음

- **현재 구현**:
```typescript
const 강도맵 = {
    '장생': 90, '건록': 85, '제왕': 95,
    '관대': 75, '목욕': 60, '쇠': 40,
    '병': 25, '사': 15, '묘': 30,
    '절': 10, '태': 50, '양': 65
};
```

- **개선 방안**:
  1. 오행 상생상극 고려한 동적 점수
  2. 일간과의 관계 반영
  3. 계절 요소 추가

- **상태**: ⏳ 개선 예정

---

### 버그 #3: 격국 판단 엣지 케이스
- **발견일**: 2025-10-02 (코드 리뷰 중)
- **파일**: `shared/geokguk-analyzer.ts:180-220`
- **심각도**: 🟡 Warning (명리학 정확도)
- **설명**:
  - 특수격 (종격, 화격) 판단 로직이 단순화되어 있음
  - 복잡한 사주에서 오판 가능성

- **현재 구현**:
```typescript
// 종격 판단: 일간 극약 + 특정 오행 압도
function check종격(사주: 사주정보, 오행분석: any): boolean {
    const 일간강도 = 오행분석[사주.day.gan];
    if (일간강도 > 2) return false;

    // 특정 오행이 7개 이상
    const 압도오행 = Object.entries(오행분석).find(([_, count]) => count >= 7);
    return !!압도오행;
}
```

- **개선 필요**:
  1. 종격 세부 분류 (종재격, 종관격 등)
  2. 가종격/진종격 구분
  3. 화격 조건 더 엄격하게

- **상태**: ⏳ 개선 예정

---

## 성능 이슈 (Performance Issues)

### 이슈 #1: 초기 번들 크기
- **발견일**: 2025-10-02
- **파일**: `client/src/*` (전체)
- **심각도**: 🟢 Info (최적화 권장)
- **측정값**:
  - 초기 번들: 805KB
  - Gzip 압축: 260KB
  - 목표: < 500KB (uncompressed)

- **원인**:
  1. Radix UI 컴포넌트 전체 import
  2. 아이콘 라이브러리 (lucide-react) 전체 포함
  3. 명리학 데이터 (astro-data.ts) 큰 객체

- **개선 방안**:
  1. Tree-shaking 최적화
  2. 동적 import로 명리학 데이터 분할
  3. 아이콘 선택적 import

- **상태**: ⏳ 최적화 예정

---

### 이슈 #2: 사주 계산 시간
- **발견일**: 2025-10-02
- **파일**: `client/src/lib/premium-calculator.ts`
- **심각도**: 🟢 Info (현재 허용 범위)
- **측정값**:
  - 캐시 미스: ~1.8초
  - 캐시 히트: ~50ms
  - 목표: < 1초 (캐시 미스)

- **원인**:
  1. 격국/대운/십이운성 순차 계산
  2. 중복 오행 분석

- **개선 방안**:
  1. 병렬 계산 가능 부분 분리
  2. 오행 분석 결과 재사용
  3. Web Worker 활용 검토

- **상태**: ⏳ 최적화 예정

---

## 보안 이슈 (Security Issues)

### 보안 #1: 환경 변수 노출 위험
- **발견일**: 2025-10-02
- **파일**: `.env.example`
- **심각도**: 🔴 Critical (프로덕션 배포 전 필수)
- **설명**:
  - `.env` 파일이 git에 포함될 위험
  - 실제 키가 예제 파일에 포함될 가능성

- **예방 조치**:
```bash
# .gitignore에 추가 확인
.env
.env.local
.env.production

# 환경 변수 검증 스크립트
# server/validate-env.ts
const required = ['DATABASE_URL', 'STRIPE_SECRET_KEY', 'SESSION_SECRET'];
required.forEach(key => {
    if (!process.env[key]) {
        throw new Error(`Missing required env var: ${key}`);
    }
});
```

- **상태**: ✅ 완료 (.gitignore 확인됨)

---

### 보안 #2: SQL Injection 방지
- **발견일**: 2025-10-02
- **파일**: `server/*` (DB 쿼리)
- **심각도**: 🟢 Info (Drizzle ORM 사용으로 안전)
- **설명**:
  - Drizzle ORM의 파라미터화된 쿼리 사용으로 SQL Injection 위험 낮음
  - 직접 SQL 작성 시 주의 필요

- **Best Practice**:
```typescript
// ✅ 안전 (Drizzle ORM)
await db.select().from(users).where(eq(users.id, userId));

// ❌ 위험 (직접 SQL)
await db.execute(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ 안전 (직접 SQL with 파라미터)
await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', values: [userId] });
```

- **상태**: ✅ 완료 (ORM 사용 확인됨)

---

### 보안 #3: XSS 공격 방지
- **발견일**: 2025-10-02
- **파일**: `client/src/components/*`
- **심각도**: 🟢 Info (React 기본 보호)
- **설명**:
  - React의 자동 이스케이핑으로 기본 XSS 보호
  - `dangerouslySetInnerHTML` 사용 시 주의

- **검증**:
```bash
# dangerouslySetInnerHTML 검색
grep -r "dangerouslySetInnerHTML" client/src/
# 결과: 사용 없음 ✅
```

- **상태**: ✅ 완료 (사용 없음 확인)

---

## 테스트 실패 (Test Failures)

### 테스트 실패 없음
- 현재까지 작성된 모든 E2E 테스트 통과
- Playwright 테스트 결과: ✅ 15/15 passed

---

## 알려진 제한사항 (Known Limitations)

### 제한 #1: 24절기 데이터 범위
- **설명**: 1988-2030년 실측 데이터만 사용
- **영향**: 1988년 이전 또는 2030년 이후 생년월일 입력 시 부정확할 수 있음
- **해결 방안**:
  1. 천문 계산 알고리즘 추가 (Meeus 알고리즘)
  2. NASA JPL Horizons API 연동
  3. 범위 확장 (1900-2100)

### 제한 #2: 음력 변환 정확도
- **설명**: 양력-음력 변환이 단순 알고리즘 기반
- **영향**: 윤달 처리 및 경계 날짜에서 오차 가능
- **해결 방안**:
  1. 한국천문연구원 API 연동
  2. 검증된 라이브러리 사용 (lunar-calendar)

### 제한 #3: 명리학 해석의 주관성
- **설명**: 자동 해석이 전문가 수준에 미치지 못함
- **영향**: 복잡한 사주는 해석이 단순화될 수 있음
- **해결 방안**:
  1. AI/LLM 통합 (GPT-4, Claude 등)
  2. 전문가 리뷰 시스템
  3. 사용자 피드백 학습

---

## 에러 추적 시스템 (Error Tracking)

### Sentry 통합
- **설정 파일**: `server/index.ts`, `client/src/main.tsx`
- **환경**: 프로덕션만 활성화
- **추적 항목**:
  - 런타임 에러
  - API 에러
  - 성능 저하
  - 사용자 피드백

### 모니터링 대시보드
- **URL**: https://sentry.io/organizations/.../projects/sajufortune/
- **알림**: 이메일, Slack 연동 필요
- **상태**: ⏳ 설정 대기

---

## 오류 통계

### 해결 완료: 5개
- 타입 정의 오류: 4개 ✅
- 의존성 오류: 1개 ✅

### 검증 대기: 3개
- 명리학 로직: 3개 ⏳

### 최적화 예정: 2개
- 성능 이슈: 2개 ⏳

### 보안 검토 완료: 3개 ✅

---

**마지막 업데이트**: 2025-10-02
**작성자**: Claude (수석 개발자)
**다음 검토**: 코드 리뷰 후
