# 컴포넌트 아키텍처 설계 (Component Architecture)

## 프로젝트: SajuFortune
**작성일**: 2025-10-03
**작성자**: Claude (Senior Developer)

---

## 📋 목차
1. [현재 구조 분석](#현재-구조-분석)
2. [Atomic Design 패턴 적용](#atomic-design-패턴-적용)
3. [컴포넌트 분리 계획](#컴포넌트-분리-계획)
4. [상태 관리 전략](#상태-관리-전략)
5. [코드 스플리팅 전략](#코드-스플리팅-전략)

---

## 현재 구조 분석

### 문제점
1. **result-display.tsx**: 567 lines - 단일 컴포넌트 과대
2. **Props Drilling**: 5-6 레벨의 깊은 props 전달
3. **재사용성 부족**: 격국/대운/십이운성 카드 중복 로직
4. **성능 이슈**: 불필요한 전체 리렌더링

### 목표
- 컴포넌트 크기: 200 lines 이하
- Props 깊이: 3 레벨 이하
- 재사용 가능한 작은 단위 컴포넌트
- React.memo로 렌더링 최적화

---

## Atomic Design 패턴 적용

### 계층 구조
```
Atoms (원자)
  └─> Molecules (분자)
       └─> Organisms (유기체)
            └─> Templates (템플릿)
                 └─> Pages (페이지)
```

### 컴포넌트 분류

#### 1. Atoms (기본 단위)
```typescript
// client/src/components/ui/atoms/
- Badge.tsx          // 격국 종류, 운세 등급 뱃지
- ProgressBar.tsx    // 십이운성 강도 표시
- StatChip.tsx       // 점수, 평점 칩
- InfoIcon.tsx       // 정보 아이콘 + 툴팁
```

#### 2. Molecules (조합 단위)
```typescript
// client/src/components/ui/molecules/
- ScoreCard.tsx           // 점수 + 레벨 + 설명
- FortuneRating.tsx       // 운세 평점 + 별점
- ElementBadge.tsx        // 오행 배지 (색상 포함)
- TimePeriodChip.tsx      // 대운 기간 칩
```

#### 3. Organisms (기능 단위)
```typescript
// client/src/components/organisms/
- GeokgukCard.tsx         // 격국 분석 카드 (200 lines)
- DaeunTimeline.tsx       // 대운 타임라인 (180 lines)
- SibiunseongChart.tsx    // 십이운성 차트 (150 lines)
- PersonalitySection.tsx  // 성격 분석 섹션 (120 lines)
- FortuneSection.tsx      // 오늘의 운세 섹션 (100 lines)
- DetailedAnalysis.tsx    // 상세 분석 (4영역) (150 lines)
```

---

## 컴포넌트 분리 계획

### 기존: result-display.tsx (567 lines)
```
ResultDisplay (567 lines)
├─ 성격 분석 (50 lines)
├─ 오늘의 운세 (60 lines)
├─ 상세 분석 (4영역) (80 lines)
├─ 격국 카드 (120 lines)
├─ 대운 타임라인 (150 lines)
├─ 십이운성 차트 (107 lines)
```

### 개선: 7개 컴포넌트 분리
```
ResultDisplay (100 lines) - 레이아웃만
├─ PersonalitySection (120 lines)
├─ FortuneSection (100 lines)
├─ DetailedAnalysis (150 lines)
├─ GeokgukCard (200 lines)
├─ DaeunTimeline (180 lines)
└─ SibiunseongChart (150 lines)
```

---

### 1. GeokgukCard 컴포넌트
**위치**: `client/src/components/organisms/GeokgukCard.tsx`

**Props**:
```typescript
interface GeokgukCardProps {
  geokguk: 격국결과;
  compact?: boolean; // 간략 보기 모드
}
```

**구조**:
```tsx
export function GeokgukCard({ geokguk, compact = false }: GeokgukCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant={geokguk.격국종류}>
            {geokguk.격국종류}
          </Badge>
          <h3>{geokguk.격국명}</h3>
        </div>
        <ProgressBar value={geokguk.격국강도} max={100} />
      </CardHeader>

      <CardContent>
        {/* 용신/희신 */}
        <div className="grid grid-cols-2 gap-4">
          <ElementBadge element={geokguk.용신} label="용신" />
          <ElementBadge elements={geokguk.희신} label="희신" />
        </div>

        {!compact && (
          <>
            {/* 장점 */}
            <Section title="장점" items={geokguk.상세해석.장점} />

            {/* 단점 */}
            <Section title="단점" items={geokguk.상세해석.단점} />

            {/* 적합 직업 */}
            <Section title="적합 직업" items={geokguk.상세해석.적합직업} />

            {/* 주의사항 */}
            <Section title="주의사항" items={geokguk.상세해석.주의사항} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### 2. DaeunTimeline 컴포넌트
**위치**: `client/src/components/organisms/DaeunTimeline.tsx`

**Props**:
```typescript
interface DaeunTimelineProps {
  daeun: 대운결과;
  currentAge?: number; // 현재 나이 (하이라이트)
}
```

**구조**:
```tsx
export function DaeunTimeline({ daeun, currentAge }: DaeunTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <h3>대운 (大運)</h3>
        <Badge>{daeun.대운방향}</Badge>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {daeun.대운목록.map((daun, index) => (
            <DaeunPeriod
              key={index}
              daeun={daun}
              isCurrent={daeun.현재대운 === daun}
              isActive={
                currentAge >= daun.시작나이 &&
                currentAge <= daun.종료나이
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 하위 컴포넌트
function DaeunPeriod({ daeun, isCurrent, isActive }) {
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      isActive && "bg-primary/10 border-primary",
      isCurrent && "ring-2 ring-primary"
    )}>
      <div className="flex items-center justify-between">
        <TimePeriodChip
          start={daeun.시작나이}
          end={daeun.종료나이}
        />
        <ElementBadge element={daeun.오행} />
      </div>

      <p className="mt-2 text-sm">{daeun.해석}</p>
    </div>
  );
}
```

---

### 3. SibiunseongChart 컴포넌트
**위치**: `client/src/components/organisms/SibiunseongChart.tsx`

**Props**:
```typescript
interface SibiunseongChartProps {
  sibiunseong: 십이운성결과;
  showAverage?: boolean;
}
```

**구조**:
```tsx
export function SibiunseongChart({ sibiunseong, showAverage = true }: SibiunseongChartProps) {
  const pillars = [
    { label: '년주', data: sibiunseong.년주십이운성 },
    { label: '월주', data: sibiunseong.월주십이운성 },
    { label: '일주', data: sibiunseong.일주십이운성 },
    { label: '시주', data: sibiunseong.시주십이운성 }
  ];

  return (
    <Card>
      <CardHeader>
        <h3>십이운성 (十二運星)</h3>
        {showAverage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">평균 강도</span>
            <StatChip value={sibiunseong.평균강도} />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map(({ label, data }) => (
            <SibiunseongPillar
              key={label}
              label={label}
              unsung={data.운성}
              strength={data.강도}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 상태 관리 전략

### 1. TanStack Query (서버 상태)
```typescript
// client/src/hooks/useFortune.ts

export function useFortune(id: string) {
  return useQuery({
    queryKey: ['fortune', id],
    queryFn: () => api.getFortune(id),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30    // 30분
  });
}

export function useAnalyzeFortune() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FortuneRequest) => api.analyzeFortune(data),
    onSuccess: (result) => {
      queryClient.setQueryData(['fortune', result.id], result);
    }
  });
}
```

### 2. React Context (UI 상태)
```typescript
// client/src/contexts/FortuneDisplayContext.tsx

interface FortuneDisplayState {
  expandedSections: Set<string>;
  compactMode: boolean;
  showTechnicalDetails: boolean;
}

const FortuneDisplayContext = createContext<{
  state: FortuneDisplayState;
  toggleSection: (section: string) => void;
  setCompactMode: (compact: boolean) => void;
}>null!);

export function FortuneDisplayProvider({ children }) {
  const [state, setState] = useState<FortuneDisplayState>({
    expandedSections: new Set(['geokguk', 'daeun']),
    compactMode: false,
    showTechnicalDetails: false
  });

  const toggleSection = (section: string) => {
    setState(prev => {
      const expanded = new Set(prev.expandedSections);
      if (expanded.has(section)) {
        expanded.delete(section);
      } else {
        expanded.add(section);
      }
      return { ...prev, expandedSections: expanded };
    });
  };

  return (
    <FortuneDisplayContext.Provider value={{ state, toggleSection, ... }}>
      {children}
    </FortuneDisplayContext.Provider>
  );
}
```

---

## 코드 스플리팅 전략

### 1. Route-based Splitting
```typescript
// client/src/App.tsx

import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/home'));
const ResultsPage = lazy(() => import('./pages/results'));
const CheckoutPage = lazy(() => import('./pages/checkout'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Router>
        <Route path="/" component={HomePage} />
        <Route path="/results/:id" component={ResultsPage} />
        <Route path="/checkout" component={CheckoutPage} />
      </Router>
    </Suspense>
  );
}
```

### 2. Component-based Splitting
```typescript
// client/src/pages/results.tsx

const GeokgukCard = lazy(() => import('@/components/organisms/GeokgukCard'));
const DaeunTimeline = lazy(() => import('@/components/organisms/DaeunTimeline'));
const SibiunseongChart = lazy(() => import('@/components/organisms/SibiunseongChart'));

export default function ResultsPage() {
  const { data } = useFortune(id);

  return (
    <div className="space-y-6">
      <PersonalitySection data={data.personality} />

      <Suspense fallback={<CardSkeleton />}>
        {data.geokguk && <GeokgukCard geokguk={data.geokguk} />}
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        {data.daeun && <DaeunTimeline daeun={data.daeun} />}
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        {data.sibiunseong && <SibiunseongChart sibiunseong={data.sibiunseong} />}
      </Suspense>
    </div>
  );
}
```

---

## 성능 최적화

### 1. React.memo 적용
```typescript
export const GeokgukCard = React.memo(function GeokgukCard({ geokguk }) {
  // ...
}, (prevProps, nextProps) => {
  // 격국 데이터가 변경되지 않으면 리렌더링 방지
  return prevProps.geokguk === nextProps.geokguk;
});
```

### 2. useMemo/useCallback 활용
```typescript
function DaeunTimeline({ daeun, currentAge }) {
  const sortedDaeun = useMemo(
    () => daeun.대운목록.sort((a, b) => a.시작나이 - b.시작나이),
    [daeun.대운목록]
  );

  const handleExpand = useCallback((index: number) => {
    setExpanded(prev => prev === index ? null : index);
  }, []);

  return <div>{/* ... */}</div>;
}
```

---

## 디렉토리 구조

```
client/src/
├── components/
│   ├── ui/
│   │   ├── atoms/           # 기본 UI 컴포넌트
│   │   │   ├── Badge.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StatChip.tsx
│   │   │   └── InfoIcon.tsx
│   │   ├── molecules/       # 조합 컴포넌트
│   │   │   ├── ScoreCard.tsx
│   │   │   ├── FortuneRating.tsx
│   │   │   ├── ElementBadge.tsx
│   │   │   └── TimePeriodChip.tsx
│   │   └── ...radix-ui...
│   ├── organisms/           # 기능 단위 컴포넌트
│   │   ├── GeokgukCard.tsx
│   │   ├── DaeunTimeline.tsx
│   │   ├── SibiunseongChart.tsx
│   │   ├── PersonalitySection.tsx
│   │   ├── FortuneSection.tsx
│   │   └── DetailedAnalysis.tsx
│   └── ...existing...
├── contexts/                # React Context
│   └── FortuneDisplayContext.tsx
├── hooks/                   # Custom Hooks
│   ├── useFortune.ts
│   └── useFortuneDisplay.ts
└── pages/                   # 페이지 컴포넌트
    ├── home.tsx
    ├── results.tsx
    └── checkout.tsx
```

---

## 마이그레이션 계획

### Phase 1: Atoms/Molecules 생성 (1-2일)
1. UI 기본 컴포넌트 추출
2. Storybook 설정 및 문서화
3. Unit tests 작성

### Phase 2: Organisms 분리 (3-4일)
1. result-display.tsx에서 6개 컴포넌트 분리
2. Props 인터페이스 정의
3. 각 컴포넌트 독립 테스트

### Phase 3: 상태 관리 적용 (2-3일)
1. TanStack Query 훅 구현
2. Context API 적용
3. Props drilling 제거

### Phase 4: 성능 최적화 (2일)
1. React.memo 적용
2. Code splitting 적용
3. 렌더링 성능 측정

---

**예상 효과**:
- 컴포넌트 평균 크기: 567 lines → 150 lines (73% 감소)
- Props 깊이: 5-6 레벨 → 2-3 레벨
- 번들 크기: 805KB → 600KB 예상 (25% 감소)
- 초기 로딩 속도: 2.5초 → 1.5초 예상 (40% 개선)

---

**문서 작성자**: Claude (Senior Developer)
**마지막 업데이트**: 2025-10-03
