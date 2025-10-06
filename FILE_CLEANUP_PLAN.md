# 📁 파일 정리 계획

**작성일**: 2025-10-06
**목적**: 프로젝트 루트 디렉토리 정리 및 문서 구조 개선

---

## 📊 현재 상태

### 루트 디렉토리 파일 (9개 .md)
```
README.md                    ✅ 유지
BUSINESS_MODEL.md            ⚠️ 이동 검토
DEPLOYMENT.md                ✅ 유지 (배포 가이드)
E2E_TEST_REPORT.md           ⚠️ 이동
OPTIMIZATION_SUMMARY.md      ⚠️ 이동
PERFORMANCE_OPTIMIZATION.md  ⚠️ 이동
PRD_SajuFortune.md          ⚠️ 이동
PRODUCTION_CHECKLIST.md      ✅ 유지 (중요)
SYSTEM_INTEGRATION_REPORT.md ⚠️ 이동
```

---

## 🎯 정리 방안

### 옵션 A: 최소 정리 (추천)
**루트에 유지** (3개만):
```
README.md                    - 프로젝트 소개
DEPLOYMENT.md                - 배포 가이드
PRODUCTION_CHECKLIST.md      - 프로덕션 체크리스트
```

**docs/로 이동** (6개):
```
docs/
├── BUSINESS_MODEL.md
├── PRD_SajuFortune.md
├── PERFORMANCE_OPTIMIZATION.md
└── reports/
    ├── E2E_TEST_REPORT.md
    ├── OPTIMIZATION_SUMMARY.md
    └── SYSTEM_INTEGRATION_REPORT.md
```

### 옵션 B: 체계적 정리
**루트**: README.md만
**docs/**: 모든 문서를 카테고리별로 분류
```
docs/
├── business/
│   ├── BUSINESS_MODEL.md
│   └── PRD_SajuFortune.md
├── deployment/
│   ├── DEPLOYMENT.md
│   └── PRODUCTION_CHECKLIST.md
├── optimization/
│   └── PERFORMANCE_OPTIMIZATION.md
└── reports/
    ├── E2E_TEST_REPORT.md
    ├── OPTIMIZATION_SUMMARY.md
    └── SYSTEM_INTEGRATION_REPORT.md
```

---

## 🗑️ .gitignore 추가 필요

```gitignore
# Test Reports
playwright-report/
test-results/
coverage/

# Temporary files
*.tmp
*.log
nul

# Environment
.env.local
.env.test
```

---

## ✅ 실행 명령어

### 옵션 A 실행
```bash
# 1. reports 디렉토리 생성
mkdir -p docs/reports

# 2. 리포트 파일 이동
mv E2E_TEST_REPORT.md docs/reports/
mv OPTIMIZATION_SUMMARY.md docs/reports/
mv SYSTEM_INTEGRATION_REPORT.md docs/reports/

# 3. 기타 문서 이동
mv BUSINESS_MODEL.md docs/
mv PRD_SajuFortune.md docs/
mv PERFORMANCE_OPTIMIZATION.md docs/

# 4. .gitignore 업데이트
echo "" >> .gitignore
echo "# Test Reports" >> .gitignore
echo "playwright-report/" >> .gitignore
echo "test-results/" >> .gitignore
```

### 옵션 B 실행
```bash
# 디렉토리 생성
mkdir -p docs/{business,deployment,optimization,reports}

# 파일 이동
mv BUSINESS_MODEL.md docs/business/
mv PRD_SajuFortune.md docs/business/
mv DEPLOYMENT.md docs/deployment/
mv PRODUCTION_CHECKLIST.md docs/deployment/
mv PERFORMANCE_OPTIMIZATION.md docs/optimization/
mv E2E_TEST_REPORT.md docs/reports/
mv OPTIMIZATION_SUMMARY.md docs/reports/
mv SYSTEM_INTEGRATION_REPORT.md docs/reports/
```

---

## 📝 README.md 업데이트

파일 이동 후 README.md에 문서 위치 안내 추가:

```markdown
## 📚 문서 구조

- [배포 가이드](DEPLOYMENT.md) - 프로덕션 배포 방법
- [프로덕션 체크리스트](PRODUCTION_CHECKLIST.md) - 배포 전 확인 사항
- [비즈니스 모델](docs/BUSINESS_MODEL.md) - 수익 모델 및 전략
- [PRD](docs/PRD_SajuFortune.md) - 제품 요구사항 문서
- [성능 최적화](docs/PERFORMANCE_OPTIMIZATION.md) - 성능 개선 가이드
- [테스트 리포트](docs/reports/) - E2E, 최적화, 시스템 통합 리포트
```

---

## 🚀 다음 단계

1. [ ] 정리 방안 선택 (옵션 A 또는 B)
2. [ ] 파일 이동 실행
3. [ ] .gitignore 업데이트
4. [ ] README.md 문서 링크 업데이트
5. [ ] Git 커밋
6. [ ] 문서 중복 확인 및 통합

---

**작성자**: SuperClaude Framework
**우선순위**: Medium (E2E 테스트 후 진행 권장)
