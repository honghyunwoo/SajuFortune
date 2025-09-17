# 🔄 프리미엄→기본 어댑터 매핑 규칙

## 📊 데이터 구조 변환 스펙

### 1. **기둥 데이터 변환**

#### 소스: `PremiumSajuAnalysis.saju`
```typescript
saju: {
  year: { gan: 천간타입, ji: 지지타입 },
  month: { gan: 천간타입, ji: 지지타입 },
  day: { gan: 천간타입, ji: 지지타입 },
  hour: { gan: 천간타입, ji: 지지타입 }
}
```

#### 타겟: `SajuData.pillars`
```typescript
pillars: [
  { heavenly: string, earthly: string, element: string }, // year
  { heavenly: string, earthly: string, element: string }, // month  
  { heavenly: string, earthly: string, element: string }, // day
  { heavenly: string, earthly: string, element: string }  // hour
]
```

#### 변환 규칙:
1. **순서**: `[year, month, day, hour]` 고정
2. **필드 매핑**: `gan → heavenly`, `ji → earthly`
3. **Element 파생**: `element = 천간오행[gan]` (천간 우선 정책)

---

### 2. **오행 데이터 변환**

#### 소스: `PremiumSajuAnalysis.elements`
```typescript
elements: { 목: number, 화: number, 토: number, 금: number, 수: number }
```

#### 타겟: `SajuData.elements`
```typescript
elements: { wood: number, fire: number, earth: number, metal: number, water: number }
```

#### 변환 매핑표:
```typescript
const ELEMENT_TRANSLATION = {
  '목': 'wood',
  '화': 'fire', 
  '토': 'earth',
  '금': 'metal',
  '수': 'water'
} as const;
```

#### 소수점 처리:
- **지장간가중치**로 인한 소수점 → **2자리 반올림** (`Math.round(value * 100) / 100`)

---

### 3. **프리미엄 추가 데이터 처리**

#### 드롭 정책 (Phase 1):
```typescript
// 다음 필드들은 기본 SajuData 변환에서 제외:
- tenGods: TenGodsAnalysis     → 드롭 (나중에 analysisResult 확장)
- sinsal: SinsalAnalysisResult → 드롭 (나중에 analysisResult 확장)  
- lunar: LunarDate            → 드롭 (나중에 analysisResult 확장)
- cyclicalDay: number         → 드롭 (나중에 analysisResult 확장)
- precision: string           → 드롭 (메타데이터)
- calculationTime: number     → 드롭 (메타데이터)
```

---

## 🔧 어댑터 함수 시그니처

```typescript
function premiumToSajuData(premium: PremiumSajuAnalysis): SajuData {
  return {
    pillars: [
      premium.saju.year,
      premium.saju.month, 
      premium.saju.day,
      premium.saju.hour
    ].map(pillar => ({
      heavenly: pillar.gan,
      earthly: pillar.ji,
      element: translateElement(천간오행[pillar.gan])
    })),
    elements: {
      wood: roundToTwo(premium.elements.목),
      fire: roundToTwo(premium.elements.화),
      earth: roundToTwo(premium.elements.토),
      metal: roundToTwo(premium.elements.금),
      water: roundToTwo(premium.elements.수)
    }
  };
}

function translateElement(korean: '목'|'화'|'토'|'금'|'수'): string {
  const map = { '목': 'wood', '화': 'fire', '토': 'earth', '금': 'metal', '수': 'water' };
  return map[korean];
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}
```

---

## ✅ 검증 케이스

### 필수 테스트:
1. **1989-10-06 12:56** - 골든 케이스 (기미일 → 무오일 수정 확인)
2. **2025-01-01 00:00** - 현재 연도 절기 경계
3. **소수점 처리** - 지장간가중치 0.333... → 0.33
4. **기둥 순서** - [year, month, day, hour] 순서 보장

### 예상 출력 (1989-10-06):
```typescript
{
  pillars: [
    { heavenly: "기", earthly: "사", element: "earth" }, // year
    { heavenly: "갑", earthly: "술", element: "wood" },  // month  
    { heavenly: "기", earthly: "미", element: "earth" }, // day (현재 계산 결과)
    { heavenly: "경", earthly: "오", element: "metal" }  // hour (수정: 12시=오시, 실제=경○)
  ],
  elements: {
    wood: 1.67,    // 목 (반올림)
    fire: 2.33,    // 화
    earth: 3.00,   // 토
    metal: 1.00,   // 금  
    water: 2.00    // 수
  }
}
```

**📝 주의사항:**
- 위 결과는 **현재 프리미엄 계산기의 실제 출력**임
- 1989년 버그(기미일 → 무오일) 수정은 **별도 Task**에서 처리 예정
- 어댑터는 **현재 계산 결과를 기준**으로 변환 작동

---

## 🎯 Phase 2 확장 계획

나중에 Task 2.1에서 schema 확장 시:
```typescript
interface FortuneReading {
  sajuData: SajuData;           // 기본 호환성
  analysisResult: AnalysisResult;
  premiumExtras?: {             // 프리미엄 추가 데이터
    tenGods: TenGodsAnalysis;
    sinsal: SinsalAnalysisResult;
    lunar: LunarDate;
    cyclicalDay: number;
    precision: string;
    calculationTime: number;
  };
}
```