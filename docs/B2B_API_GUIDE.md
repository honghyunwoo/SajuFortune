# 🔌 운명의 해답 B2B API 가이드

한국천문연구원 24절기 데이터 기반 정확한 사주팔자 분석 API

**Base URL**: `https://sajufortune.com/api/v1/b2b`
**Version**: 1.0.0
**인증 방식**: API Key (X-API-Key header)

---

## 📋 목차

1. [인증](#인증)
2. [Rate Limiting](#rate-limiting)
3. [에러 코드](#에러-코드)
4. [API 엔드포인트](#api-엔드포인트)
   - [사주 분석](#1-사주-분석-api)
   - [궁합 분석](#2-궁합-분석-api)
   - [월별 운세](#3-월별-운세-api)
   - [API 상태 조회](#4-api-상태-조회)
5. [Tier별 제한](#tier별-제한)
6. [예제 코드](#예제-코드)

---

## 🔑 인증

모든 API 요청에는 **X-API-Key** 헤더가 필요합니다.

```http
GET /api/v1/b2b/status HTTP/1.1
Host: sajufortune.com
X-API-Key: sk_live_YOUR_API_KEY
```

### API 키 발급

1. [운명의 해답 대시보드](https://sajufortune.com/dashboard)에 로그인
2. **API 설정** 메뉴에서 새 API 키 생성
3. API 키를 안전하게 보관 (재발급 불가)

---

## ⏱️ Rate Limiting

API 사용량은 **일일 제한**과 **월간 제한** 모두 적용됩니다.

### 응답 헤더

모든 API 응답에 포함됩니다:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 756
X-RateLimit-Reset: 2025-10-11T00:00:00.000Z
```

### Rate Limit 초과 시

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "API rate limit exceeded",
  "limit": 1000,
  "remaining": 0,
  "resetAt": "2025-10-11T00:00:00.000Z"
}
```

---

## ❌ 에러 코드

| 코드 | 설명 | HTTP Status |
|------|------|-------------|
| `UNAUTHORIZED` | API 키가 누락되거나 유효하지 않음 | 401 |
| `RATE_LIMIT_EXCEEDED` | Rate limit 초과 | 429 |
| `INVALID_INPUT` | 필수 입력값 누락 또는 잘못된 형식 | 400 |
| `CALCULATION_ERROR` | 사주 계산 중 내부 오류 발생 | 500 |

---

## 📡 API 엔드포인트

### 1. 사주 분석 API

정확한 한국천문연구원 24절기 데이터 기반 사주팔자 분석

**Endpoint**: `POST /api/v1/b2b/saju`

#### Request Body

```json
{
  "birthYear": 1990,
  "birthMonth": 5,
  "birthDay": 15,
  "birthHour": 14,
  "birthMinute": 30,
  "gender": "male"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `birthYear` | number | ✅ | 출생 연도 (1900~2100) |
| `birthMonth` | number | ✅ | 출생 월 (1~12) |
| `birthDay` | number | ✅ | 출생 일 (1~31) |
| `birthHour` | number | ✅ | 출생 시간 (0~23) |
| `birthMinute` | number | ❌ | 출생 분 (0~59, default: 0) |
| `gender` | string | ✅ | 성별 (`"male"` or `"female"`) |

#### Response

```json
{
  "success": true,
  "data": {
    "birthInfo": {
      "year": 1990,
      "month": 5,
      "day": 15,
      "hour": 14,
      "minute": 30,
      "gender": "male"
    },
    "saju": {
      "year": { "gan": "경", "ji": "오" },
      "month": { "gan": "신", "ji": "사" },
      "day": { "gan": "갑", "ji": "자" },
      "hour": { "gan": "신", "ji": "미" }
    },
    "geokguk": {
      "type": "정관격",
      "description": "정관격은 책임감이 강하고..."
    },
    "daeun": [
      {
        "startAge": 5,
        "endAge": 14,
        "gan": "경",
        "ji": "오",
        "description": "..."
      }
    ],
    "sibiunseong": {
      "year": "건록",
      "month": "양인",
      "day": "장생",
      "hour": "목욕"
    },
    "elements": {
      "wood": 2,
      "fire": 3,
      "earth": 1,
      "metal": 3,
      "water": 1
    }
  }
}
```

---

### 2. 궁합 분석 API

두 사람의 사주팔자 궁합 분석

**Endpoint**: `POST /api/v1/b2b/compatibility`

#### Request Body

```json
{
  "person1": {
    "birthYear": 1990,
    "birthMonth": 5,
    "birthDay": 15,
    "birthHour": 14,
    "birthMinute": 30,
    "gender": "male"
  },
  "person2": {
    "birthYear": 1992,
    "birthMonth": 8,
    "birthDay": 20,
    "birthHour": 10,
    "birthMinute": 0,
    "gender": "female"
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "person1": {
      "saju": {
        "year": { "heavenlyStem": "경", "earthlyBranch": "오" },
        "month": { "heavenlyStem": "신", "earthlyBranch": "사" },
        "day": { "heavenlyStem": "갑", "earthlyBranch": "자" },
        "hour": { "heavenlyStem": "신", "earthlyBranch": "미" }
      }
    },
    "person2": {
      "saju": {
        "year": { "heavenlyStem": "임", "earthlyBranch": "신" },
        "month": { "heavenlyStem": "무", "earthlyBranch": "신" },
        "day": { "heavenlyStem": "병", "earthlyBranch": "술" },
        "hour": { "heavenlyStem": "계", "earthlyBranch": "사" }
      }
    },
    "compatibility": {
      "overallScore": 85,
      "detailedScores": {
        "cheongganHap": 90,
        "jijiHap": 80,
        "ohaengBalance": 85,
        "geokgukComplementarity": 88
      },
      "strengths": [
        "천간합이 있어 서로 보완적입니다.",
        "오행 균형이 잘 맞습니다."
      ],
      "weaknesses": [
        "지지충이 일부 있어 갈등 가능성이 있습니다."
      ],
      "advice": [
        "소통을 통해 차이를 이해하세요.",
        "서로의 강점을 인정하고 존중하세요."
      ]
    }
  }
}
```

---

### 3. 월별 운세 API

12개월 운세 분석

**Endpoint**: `POST /api/v1/b2b/monthly-fortune`

#### Request Body

```json
{
  "birthYear": 1990,
  "birthMonth": 5,
  "birthDay": 15,
  "birthHour": 14,
  "birthMinute": 30,
  "gender": "male"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "birthInfo": {
      "year": 1990,
      "month": 5,
      "day": 15,
      "hour": 14,
      "minute": 30,
      "gender": "male"
    },
    "saju": {
      "year": { "heavenlyStem": "경", "earthlyBranch": "오" },
      "month": { "heavenlyStem": "신", "earthlyBranch": "사" },
      "day": { "heavenlyStem": "갑", "earthlyBranch": "자" },
      "hour": { "heavenlyStem": "신", "earthlyBranch": "미" }
    },
    "monthlyFortune": {
      "currentYear": 2025,
      "months": [
        {
          "month": 1,
          "monthlyPillar": {
            "heavenlyStem": "무",
            "earthlyBranch": "인"
          },
          "overallScore": 75,
          "loveScore": 80,
          "wealthScore": 70,
          "healthScore": 75,
          "careerScore": 78,
          "advice": "..."
        }
      ]
    }
  }
}
```

---

### 4. API 상태 조회

현재 API 키의 사용량 및 제한 확인

**Endpoint**: `GET /api/v1/b2b/status`

#### Response

```json
{
  "success": true,
  "data": {
    "tier": "basic",
    "usage": {
      "daily": {
        "used": 245,
        "limit": 1000,
        "remaining": 755
      },
      "monthly": {
        "used": 5430,
        "limit": 30000,
        "remaining": 24570
      }
    },
    "apiKey": {
      "name": "My Production API Key",
      "createdAt": "2025-09-01T00:00:00.000Z",
      "expiresAt": null
    }
  }
}
```

---

## 💰 Tier별 제한

| Tier | 일일 제한 | 월간 제한 | 가격 (월) |
|------|-----------|-----------|-----------|
| **Free** | 100 req/day | 3,000 req/month | 무료 |
| **Basic** | 1,000 req/day | 30,000 req/month | 50,000원 |
| **Pro** | 10,000 req/day | 300,000 req/month | 300,000원 |
| **Enterprise** | 100,000 req/day | 3,000,000 req/month | 별도 문의 |

---

## 💻 예제 코드

### Node.js (Axios)

```javascript
const axios = require('axios');

const API_KEY = 'sk_live_YOUR_API_KEY';
const BASE_URL = 'https://sajufortune.com/api/v1/b2b';

async function analyzeSaju() {
  try {
    const response = await axios.post(
      `${BASE_URL}/saju`,
      {
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        birthHour: 14,
        birthMinute: 30,
        gender: 'male'
      },
      {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('사주 분석 결과:', response.data);
  } catch (error) {
    console.error('API 오류:', error.response?.data || error.message);
  }
}

analyzeSaju();
```

### Python (requests)

```python
import requests

API_KEY = 'sk_live_YOUR_API_KEY'
BASE_URL = 'https://sajufortune.com/api/v1/b2b'

def analyze_saju():
    headers = {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }

    data = {
        'birthYear': 1990,
        'birthMonth': 5,
        'birthDay': 15,
        'birthHour': 14,
        'birthMinute': 30,
        'gender': 'male'
    }

    response = requests.post(
        f'{BASE_URL}/saju',
        json=data,
        headers=headers
    )

    if response.status_code == 200:
        print('사주 분석 결과:', response.json())
    else:
        print('API 오류:', response.json())

analyze_saju()
```

### cURL

```bash
curl -X POST https://sajufortune.com/api/v1/b2b/saju \
  -H "X-API-Key: sk_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "birthYear": 1990,
    "birthMonth": 5,
    "birthDay": 15,
    "birthHour": 14,
    "birthMinute": 30,
    "gender": "male"
  }'
```

---

## 📞 지원

- **이메일**: api-support@sajufortune.com
- **문서**: https://docs.sajufortune.com
- **대시보드**: https://sajufortune.com/dashboard

**Powered by 한국천문연구원 24절기 데이터**
