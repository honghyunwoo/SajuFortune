# 📚 SajuFortune 문서 인덱스 (Docs Index)

이 디렉토리는 프로젝트의 모든 설계/운영/보고 문서를 보관합니다. 아래 인덱스를 통해 빠르게 원하는 문서를 찾을 수 있습니다.

---

## 1) 개요 및 상위 문서
- [PROJECT_COMPREHENSIVE_ANALYSIS.md](./PROJECT_COMPREHENSIVE_ANALYSIS.md) — 전반 시스템 완전 분석
- [PRD_SajuFortune.md](./PRD_SajuFortune.md) — 제품 요구사항(최종 승인)
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) — ADR 모음(핵심 결정 기록)

## 2) 설계 문서 (Design)
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) — API 명세 및 에러 코드
- [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) — 프론트 컴포넌트 구조
- [CACHING_ARCHITECTURE.md](./CACHING_ARCHITECTURE.md) — 캐싱 계층 및 키 전략
- [DATABASE_SCHEMA_DESIGN.md](./DATABASE_SCHEMA_DESIGN.md) — DB 스키마 및 인덱스
- [ERROR_HANDLING_DESIGN.md](./ERROR_HANDLING_DESIGN.md) — 에러 분류/클래스/플로우
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) — 보안 설계 및 체크리스트
- [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) — 성능 최적화 가이드

## 3) 운영/배포 (Ops)
- [DEPLOYMENT.md](../DEPLOYMENT.md) — 배포 가이드(루트)
- k8s/
  - [deployment.yaml](../k8s/deployment.yaml)
  - [monitoring.yaml](../k8s/monitoring.yaml)
- 기타: [PRODUCTION_CHECKLIST.md](../PRODUCTION_CHECKLIST.md)

## 4) 비즈니스/전략
- [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) — BM 및 수익화 전략
- [PROJECT_ROADMAP.md](../PROJECT_ROADMAP.md) — 로드맵(루트)
- [DEVELOPMENT_ROADMAP.md](../DEVELOPMENT_ROADMAP.md) — 개발 로드맵(루트)

## 5) 리포트(Reports)
- reports/
  - [E2E_TEST_REPORT.md](./reports/E2E_TEST_REPORT.md)
  - [OPTIMIZATION_SUMMARY.md](./reports/OPTIMIZATION_SUMMARY.md)
  - [SYSTEM_INTEGRATION_REPORT.md](./reports/SYSTEM_INTEGRATION_REPORT.md)
  - [CLEANUP_PLAN.md](./reports/CLEANUP_PLAN.md)
  - [CLEANUP_REPORT.md](./reports/CLEANUP_REPORT.md)
  - [SOLAR_TERMS_DATA_STATUS.md](./reports/SOLAR_TERMS_DATA_STATUS.md)
- archive/ (과거 보고서 보관)
  - DAY1~DAY4, FINAL_*, SECURITY_AUDIT_REPORT 등

## 6) 법무/정책
- LEGAL/
  - [PRIVACY_POLICY.md](../LEGAL/PRIVACY_POLICY.md)
  - [TERMS_OF_SERVICE.md](../LEGAL/TERMS_OF_SERVICE.md)

---

## 유지보수 메모 (Maintenance Notes)
- 링크 정합성: `SYSTEM_INTEGRATION_REPORT.md` 철자 확인 필요 (INTEGRATION가 맞음)
- 중복 문서: `project-reports/` vs `archive/` 범위 정의 및 중복 이동 필요
- 루트 README의 문서 목록과 본 인덱스 싱크 주기적 점검

## 권장 폴더 구조 표준화(제안)
- 설계: `docs/` 직속
- 리포트: `docs/reports/` (현재/활성), `docs/archive/`(이전/역사)
- 프로젝트 리포트: `docs/project-reports/` → `docs/reports/`로 통합 고려
- 법무/정책: `LEGAL/` 유지

업데이트 일자: 자동 갱신 필요
