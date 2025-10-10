# 🧹 프로젝트 정리 계획

**생성일**: 2025-10-03
**목표**: 코드베이스 정리 및 최적화

---

## 📊 현황 분석

### 프로젝트 규모
- **소스 파일**: 110개 (TS/TSX/JS/JSX)
- **문서 파일**: 26개 → 7개로 정리 완료 ✅
- **UI 컴포넌트**: 47개 (28개 미사용 - 60%)
- **Console.log**: 89개 발견
- **TODO/FIXME**: 2개

### 사용하지 않는 Dependencies
```json
{
  "dependencies": [
    "winston",
    "winston-daily-rotate-file"
  ],
  "devDependencies": [
    "@types/winston",
    "@vitest/coverage-v8",
    "autoprefixer",
    "cross-env",
    "postcss"
  ]
}
```

---

## 🎯 정리 우선순위

### Phase 1: 안전한 정리 (즉시 실행 가능)
1. ✅ 문서 정리 (완료)
   - 26개 → 7개 핵심 문서
   - 아카이브: 10개
   - 삭제: 9개

2. ⏳ 미사용 UI 컴포넌트 제거 (28개)
   - 사용중: 19개 유지
   - 제거 대상:
     ```
     alert-dialog.tsx, aspect-ratio.tsx, avatar.tsx, breadcrumb.tsx,
     calendar.tsx, carousel.tsx, chart.tsx, collapsible.tsx, command.tsx,
     context-menu.tsx, drawer.tsx, dropdown-menu.tsx, form.tsx,
     hover-card.tsx, input-otp.tsx, menubar.tsx, navigation-menu.tsx,
     pagination.tsx, popover.tsx, progress.tsx, resizable.tsx,
     scroll-area.tsx, sidebar.tsx, slider.tsx, switch.tsx, table.tsx,
     tabs.tsx, toggle-group.tsx
     ```

3. ⏳ 사용하지 않는 Dependencies 제거
   ```bash
   npm uninstall winston winston-daily-rotate-file
   npm uninstall -D @types/winston @vitest/coverage-v8 autoprefixer cross-env postcss
   ```

### Phase 2: Console.log 정리 (검토 후 실행)
- **총 89개 발견**
- 전략:
  - 개발용 로그: 주석 처리 또는 환경변수 조건 추가
  - 에러 로그: 구조화된 로깅으로 교체
  - 디버그 로그: 삭제

**주요 위치:**
- server/email.ts: 28개
- shared/adapters.ts: 10개
- client/src/lib/premium-calculator.ts: 10개
- server/cache.ts: 8개
- shared/timezone-utils.ts: 6개

### Phase 3: TODO/FIXME 해결
1. **shared/solar-terms.ts:183**
   - TODO: 1992-2023, 2026-2030년 절기 데이터 포팅
   - 우선순위: P0 (배포 전 필수)

2. **server/email.ts**
   - TODO: 프로덕션 이메일 서비스 통합
   - 우선순위: P1 (배포 직후)

---

## 🔧 실행 계획

### Step 1: 미사용 UI 컴포넌트 제거
```bash
# 28개 파일 삭제
cd client/src/components/ui
rm alert-dialog.tsx aspect-ratio.tsx avatar.tsx breadcrumb.tsx \
   calendar.tsx carousel.tsx chart.tsx collapsible.tsx command.tsx \
   context-menu.tsx drawer.tsx dropdown-menu.tsx form.tsx \
   hover-card.tsx input-otp.tsx menubar.tsx navigation-menu.tsx \
   pagination.tsx popover.tsx progress.tsx resizable.tsx \
   scroll-area.tsx sidebar.tsx slider.tsx switch.tsx table.tsx \
   tabs.tsx toggle-group.tsx
```

### Step 2: Dependencies 정리
```bash
# 미사용 패키지 제거
npm uninstall winston winston-daily-rotate-file
npm uninstall -D @types/winston @vitest/coverage-v8 autoprefixer cross-env postcss

# package.json 정리 확인
npm run build  # 빌드 성공 확인
npm test       # 테스트 통과 확인
```

### Step 3: Console.log 정리
```typescript
// Before
console.log('디버그 정보:', data);

// After (Option 1: 환경변수 조건)
if (process.env.NODE_ENV === 'development') {
  console.log('디버그 정보:', data);
}

// After (Option 2: 구조화 로깅)
logger.debug('디버그 정보', { data });

// After (Option 3: 삭제)
// 불필요한 로그는 완전 삭제
```

---

## 📈 예상 효과

### 파일 크기 감소
- UI 컴포넌트 28개 제거: ~150KB 감소
- Dependencies 정리: node_modules 크기 감소
- 빌드 속도 개선: 불필요한 파일 번들링 제거

### 코드 품질 향상
- Console.log 정리: 프로덕션 로그 최적화
- TODO 해결: 기술 부채 감소
- 구조 개선: 유지보수성 향상

### 배포 준비도 향상
- 불필요한 코드 제거로 보안 위험 감소
- 번들 크기 최적화로 성능 개선
- 깨끗한 코드베이스로 유지보수 용이

---

## ✅ 검증 체크리스트

### 정리 후 필수 확인
- [ ] `npm run build` 성공
- [ ] `npm test` 전체 통과
- [ ] `npm run typecheck` 에러 없음
- [ ] 애플리케이션 수동 테스트
- [ ] Git diff 검토

### 롤백 준비
```bash
# 정리 전 백업 브랜치 생성
git checkout -b backup/before-cleanup
git add .
git commit -m "backup: before cleanup"

# 정리 작업
git checkout -b feature/cleanup
# ... 정리 작업 수행 ...

# 문제 발생 시 롤백
git checkout backup/before-cleanup
```

---

## 🚨 주의사항

### 제거 금지 항목
- 실제 사용중인 UI 컴포넌트 (19개)
- 프로덕션 필수 Dependencies
- 에러 핸들링 관련 코드
- 테스트 커버리지 유지에 필요한 파일

### 안전 수칙
1. 단계별 검증: 각 단계 후 빌드/테스트 확인
2. Git 커밋: 단계별로 커밋하여 롤백 가능하게
3. 점진적 접근: 한번에 너무 많은 변경 금지
4. 문서화: 변경사항 CHANGELOG 기록

---

**실행 권한**: 검토 후 승인 필요
**예상 소요시간**: 1-2시간
**위험도**: Low (안전한 정리 작업)
