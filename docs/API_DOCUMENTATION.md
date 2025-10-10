# 📘 SajuFortune API 문서

**버전**: v1.0.0
**Base URL**: `https://api.sajufortune.com/api/v1` (프로덕션)
**Base URL**: `http://localhost:5000/api/v1` (개발)

---

## 🔑 인증 (Authentication)

모든 API 요청에는 API 키가 필요합니다.

### API 키 포함 방법

HTTP 헤더에 `X-API-Key`로 API 키를 포함해야 합니다.

```bash
curl -H "X-API-Key: sk_live_your_api_key_here" \
  https://api.sajufortune.com/api/v1/saju
```

### API 키 발급

1. [SajuFortune](https://sajufortune.com)에 회원가입
2. 대시보드에서 "API 키 생성" 클릭
3. 플랜 선택 (Free / Basic / Pro / Enterprise)
4. API 키 복사 및 안전하게 보관

⚠️ **주의**: API 키는 절대 공개 저장소에 커밋하지 마세요!

---

## 📊 요금제 및 제한 (Rate Limits)

| 플랜        | 일일 한도    | 월간 한도      | 월 요금      |
|-------------|-------------|---------------|-------------|
| **Free**    | 100 req/day | 3,000 req/month | 무료        |
| **Basic**   | 1,000       | 30,000        | 50,000원    |
| **Pro**     | 10,000      | 300,000       | 300,000원   |
| **Enterprise** | 100,000+ | 3,000,000+    | 별도 협의   |

### Rate Limit 에러

한도 초과 시 `HTTP 429 Too Many Requests` 응답:

```json
{
  "error": {
    "code": "DAILY_RATE_LIMIT_EXCEEDED",
    "message": "Daily rate limit exceeded. Limit: 100 requests/day.",
    "limit": 100,
    "usage": 100
  }
}
```

---

## 📍 엔드포인트 (Endpoints)

### 1. 사주팔자 계산

**POST** `/api/v1/saju`

#### 요청 (Request)

```json
{
  "birthDate": "1990-01-01",
  "birthTime": "12:30",
  "gender": "M",
  "solarLunar": "solar"
}
```

#### 파라미터

| 필드        | 타입   | 필수 | 설명                          |
|-------------|--------|------|-------------------------------|
| birthDate   | string | ✅   | 생년월일 (YYYY-MM-DD)         |
| birthTime   | string | ✅   | 출생 시간 (HH:mm)             |
| gender      | string | ✅   | 성별 (M: 남성, F: 여성)       |
| solarLunar  | string | ❌   | 양력/음력 (solar, lunar), 기본값: solar |

#### 응답 (Response)

```json
{
  "success": true,
  "data": {
    "input": {
      "birthDate": "1990-01-01",
      "birthTime": "12:30",
      "gender": "M",
      "solarLunar": "solar"
    },
    "pillars": {
      "year": { "heavenlyStem": "갑", "earthlyBranch": "자" },
      "month": { "heavenlyStem": "병", "earthlyBranch": "인" },
      "day": { "heavenlyStem": "무", "earthlyBranch": "진" },
      "hour": { "heavenlyStem": "경", "earthlyBranch": "오" }
    },
    "analysis": {
      "overallScore": 75,
      "geokguk": "정관격",
      "daeun": [],
      "sibiunseong": "건록"
    }
  }
}
```

#### cURL 예제

```bash
curl -X POST https://api.sajufortune.com/api/v1/saju \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk_live_your_api_key" \
  -d '{
    "birthDate": "1990-01-01",
    "birthTime": "12:30",
    "gender": "M",
    "solarLunar": "solar"
  }'
```

---

### 2. 궁합 분석

**POST** `/api/v1/compatibility`

#### 요청 (Request)

```json
{
  "person1": {
    "name": "홍길동",
    "birthDate": "1990-01-01",
    "birthTime": "12:30",
    "gender": "M"
  },
  "person2": {
    "name": "김철수",
    "birthDate": "1995-05-15",
    "birthTime": "14:20",
    "gender": "M"
  }
}
```

#### 파라미터

| 필드            | 타입   | 필수 | 설명                          |
|-----------------|--------|------|-------------------------------|
| person1.name    | string | ❌   | 첫 번째 사람 이름             |
| person1.birthDate | string | ✅ | 생년월일 (YYYY-MM-DD)         |
| person1.birthTime | string | ✅ | 출생 시간 (HH:mm)             |
| person1.gender  | string | ✅   | 성별 (M: 남성, F: 여성)       |
| person2.* (동일) | -      | -    | 두 번째 사람 정보 (동일)      |

#### 응답 (Response)

```json
{
  "success": true,
  "data": {
    "person1": { /* person1 입력값 */ },
    "person2": { /* person2 입력값 */ },
    "compatibilityScore": 85,
    "analysis": {
      "strengths": ["천간합이 있어 서로 보완적입니다."],
      "weaknesses": ["지지충이 있어 갈등 가능성이 있습니다."],
      "advice": ["소통을 통해 차이를 이해하세요."]
    }
  }
}
```

#### cURL 예제

```bash
curl -X POST https://api.sajufortune.com/api/v1/compatibility \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk_live_your_api_key" \
  -d '{
    "person1": {
      "birthDate": "1990-01-01",
      "birthTime": "12:30",
      "gender": "M"
    },
    "person2": {
      "birthDate": "1995-05-15",
      "birthTime": "14:20",
      "gender": "M"
    }
  }'
```

---

### 3. 월별 운세

**POST** `/api/v1/monthly-fortune`

#### 요청 (Request)

```json
{
  "birthDate": "1990-01-01",
  "birthTime": "12:30",
  "gender": "M",
  "startYear": 2025,
  "startMonth": 1
}
```

#### 파라미터

| 필드        | 타입   | 필수 | 설명                          |
|-------------|--------|------|-------------------------------|
| birthDate   | string | ✅   | 생년월일 (YYYY-MM-DD)         |
| birthTime   | string | ✅   | 출생 시간 (HH:mm)             |
| gender      | string | ✅   | 성별 (M: 남성, F: 여성)       |
| startYear   | number | ❌   | 시작 년도 (기본값: 현재 년도) |
| startMonth  | number | ❌   | 시작 월 (기본값: 현재 월)     |

#### 응답 (Response)

```json
{
  "success": true,
  "data": {
    "months": [
      {
        "month": 1,
        "overallScore": 75,
        "loveScore": 80,
        "wealthScore": 70,
        "healthScore": 75,
        "careerScore": 72
      },
      // ... 12개월 데이터
    ],
    "currentMonthIndex": 0
  }
}
```

#### cURL 예제

```bash
curl -X POST https://api.sajufortune.com/api/v1/monthly-fortune \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk_live_your_api_key" \
  -d '{
    "birthDate": "1990-01-01",
    "birthTime": "12:30",
    "gender": "M"
  }'
```

---

### 4. 사용량 조회

**GET** `/api/v1/usage`

#### 응답 (Response)

```json
{
  "success": true,
  "data": {
    "tier": "basic",
    "limits": {
      "daily": 1000,
      "monthly": 30000
    },
    "usage": {
      "today": 245,
      "thisMonth": 5830
    },
    "remaining": {
      "today": 755,
      "thisMonth": 24170
    }
  }
}
```

#### cURL 예제

```bash
curl -H "X-API-Key: sk_live_your_api_key" \
  https://api.sajufortune.com/api/v1/usage
```

---

### 5. 헬스 체크

**GET** `/api/v1/health`

API 서버 상태 확인 (API 키 불필요)

#### 응답 (Response)

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-10-10T12:00:00.000Z",
    "version": "1.0.0"
  }
}
```

---

## ❌ 에러 코드 (Error Codes)

### 인증 에러

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `MISSING_API_KEY` | 401 | API 키가 누락됨 |
| `INVALID_API_KEY` | 401 | 유효하지 않은 API 키 |
| `INACTIVE_API_KEY` | 403 | 비활성화된 API 키 |

### Rate Limit 에러

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `DAILY_RATE_LIMIT_EXCEEDED` | 429 | 일일 요청 한도 초과 |
| `MONTHLY_RATE_LIMIT_EXCEEDED` | 429 | 월간 요청 한도 초과 |

### 요청 에러

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `INVALID_REQUEST` | 400 | 잘못된 요청 (필수 필드 누락 등) |
| `VALIDATION_ERROR` | 400 | 데이터 검증 실패 |

### 서버 에러

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `INTERNAL_ERROR` | 500 | 내부 서버 오류 |
| `SERVICE_UNAVAILABLE` | 503 | 서비스 일시적 이용 불가 |

### 에러 응답 형식

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required fields: birthDate, birthTime, gender."
  }
}
```

---

## 🛠️ SDK 및 라이브러리

### JavaScript / TypeScript

```bash
npm install @sajufortune/sdk
```

```typescript
import SajuFortune from '@sajufortune/sdk';

const client = new SajuFortune({
  apiKey: 'sk_live_your_api_key',
});

const result = await client.saju.calculate({
  birthDate: '1990-01-01',
  birthTime: '12:30',
  gender: 'M',
});

console.log(result.pillars);
```

### Python

```bash
pip install sajufortune
```

```python
from sajufortune import Client

client = Client(api_key='sk_live_your_api_key')

result = client.saju.calculate(
    birth_date='1990-01-01',
    birth_time='12:30',
    gender='M'
)

print(result['pillars'])
```

---

## 📝 예제 코드

### Node.js (Fetch API)

```javascript
const response = await fetch('https://api.sajufortune.com/api/v1/saju', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'sk_live_your_api_key',
  },
  body: JSON.stringify({
    birthDate: '1990-01-01',
    birthTime: '12:30',
    gender: 'M',
  }),
});

const data = await response.json();
console.log(data);
```

### Python (Requests)

```python
import requests

url = 'https://api.sajufortune.com/api/v1/saju'
headers = {
    'Content-Type': 'application/json',
    'X-API-Key': 'sk_live_your_api_key',
}
data = {
    'birthDate': '1990-01-01',
    'birthTime': '12:30',
    'gender': 'M',
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

---

## 🔒 보안 권장사항

1. **API 키 보안**
   - 환경변수로 관리 (`process.env.SAJU_API_KEY`)
   - 절대 코드에 하드코딩하지 마세요
   - 공개 저장소에 커밋하지 마세요

2. **HTTPS 사용**
   - 프로덕션에서는 반드시 HTTPS 사용
   - 민감한 정보 (생년월일 등) 암호화 전송

3. **Rate Limiting 준수**
   - 429 에러 시 재시도 간격 조정 (Exponential Backoff)
   - 캐싱으로 불필요한 요청 최소화

4. **에러 처리**
   - 모든 API 호출에 try-catch 적용
   - 사용자에게 친절한 에러 메시지 제공

---

## 📞 지원 및 문의

- **이메일**: api-support@sajufortune.com
- **문서**: https://docs.sajufortune.com
- **상태 페이지**: https://status.sajufortune.com
- **GitHub 이슈**: https://github.com/sajufortune/api/issues

---

## 📜 변경 로그 (Changelog)

### v1.0.0 (2025-10-10)
- 🎉 초기 API 출시
- ✅ 사주팔자 계산 엔드포인트
- ✅ 궁합 분석 엔드포인트
- ✅ 월별 운세 엔드포인트
- ✅ API 키 인증 시스템
- ✅ Rate Limiting 구현

---

## 📖 추가 리소스

- [API 시작하기 가이드](https://docs.sajufortune.com/quickstart)
- [명리학 용어 사전](https://docs.sajufortune.com/glossary)
- [Webhook 통합 가이드](https://docs.sajufortune.com/webhooks)
- [Best Practices](https://docs.sajufortune.com/best-practices)
