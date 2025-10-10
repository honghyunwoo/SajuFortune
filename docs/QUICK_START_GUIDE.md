# 🚀 빠른 시작 가이드
## Quick Start Guide - SajuFortune

**소요 시간**: 10분  
**난이도**: ⭐⭐☆☆☆ (쉬움)

---

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [로컬 개발 환경 설정](#2-로컬-개발-환경-설정)
3. [서버 시작](#3-서버-시작)
4. [테스트 실행](#4-테스트-실행)
5. [Docker 사용 (선택)](#5-docker-사용-선택)

---

## 1. 사전 준비

### 필수 도구

| 도구 | 최소 버전 | 확인 명령어 | 설치 링크 |
|-----|---------|-----------|---------|
| **Node.js** | 20.0.0+ | `node -v` | https://nodejs.org |
| **npm** | 9.0.0+ | `npm -v` | Node.js 포함 |
| **Git** | 2.0+ | `git --version` | https://git-scm.com |

### 선택 도구

| 도구 | 용도 | 설치 링크 |
|-----|------|---------|
| **Docker Desktop** | PostgreSQL 간편 설치 | https://www.docker.com/products/docker-desktop |
| **PostgreSQL** | 직접 설치 (Docker 대신) | https://www.postgresql.org/download |

---

## 2. 로컬 개발 환경 설정

### 방법 A: 자동 설정 스크립트 (권장 ⭐)

#### Windows (PowerShell)
```powershell
# PowerShell 관리자 권한으로 실행
powershell -ExecutionPolicy Bypass -File scripts\setup-dev.ps1
```

#### macOS / Linux (Bash)
```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

**자동으로 수행**:
- ✅ Node.js 버전 확인
- ✅ npm 의존성 설치
- ✅ .env 파일 생성
- ✅ SESSION_SECRET 자동 생성
- ✅ Docker PostgreSQL 시작
- ✅ DB 스키마 생성

### 방법 B: 수동 설정 (단계별)

#### Step 1: 저장소 클론
```bash
git clone https://github.com/your-username/SajuFortune.git
cd SajuFortune
```

#### Step 2: 의존성 설치
```bash
npm install
```

#### Step 3: 환경변수 설정
```bash
# Windows (PowerShell)
Copy-Item .env.local .env

# macOS / Linux
cp .env.local .env
```

**또는 직접 생성**:
```bash
# .env 파일 생성 후 아래 내용 붙여넣기
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sajufortune
SESSION_SECRET=9e358923edcc95fa5bc97a43f118983c2d85ece4d7b27c68ae40af6659bdedbe
```

#### Step 4: PostgreSQL 설정

**옵션 A: Docker 사용 (권장)**
```bash
# PostgreSQL + Redis + pgAdmin 모두 시작
docker compose -f docker-compose.dev.yml up -d

# PostgreSQL만 시작
docker compose -f docker-compose.dev.yml up -d postgres

# 로그 확인
docker compose -f docker-compose.dev.yml logs -f postgres

# 중지
docker compose -f docker-compose.dev.yml down
```

**옵션 B: 직접 설치**
```bash
# Windows (Chocolatey)
choco install postgresql

# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Linux (Ubuntu/Debian)
sudo apt install postgresql-16
sudo systemctl start postgresql
```

**데이터베이스 생성**:
```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE sajufortune;

# 종료
\q
```

#### Step 5: DB 스키마 생성
```bash
# 방법 1: Migration (권장)
npm run db:migrate

# 방법 2: Push (개발용)
npm run db:push
```

---

## 3. 서버 시작

### 개발 서버 실행
```bash
npm run dev
# 또는
npx tsx server/index.ts
```

**출력 예시**:
```
✅ 환경변수 검증 완료
📝 Logger initialized
  environment: development
  level: debug

serving on localhost:5000
```

### 브라우저 열기
```
http://localhost:5000
```

---

## 4. 테스트 실행

### 단위 테스트
```bash
# 전체 테스트
npm test

# Watch 모드
npm run test:watch

# Coverage
npm run test:coverage
```

**예상 결과**:
```
✓ 171 tests passed (100%)
Coverage: 85%
```

### E2E 테스트
```bash
# 서버가 이미 실행 중이어야 함!
# Terminal 1: npm run dev

# Terminal 2: E2E 테스트 실행
npx playwright test

# UI 모드 (디버깅)
npx playwright test --ui

# 특정 파일만
npx playwright test e2e/smoke.spec.ts
```

### Stripe Webhook 테스트 (선택)
```bash
# Stripe CLI 설치 필요
stripe listen --forward-to localhost:5000/api/stripe-webhook
stripe trigger payment_intent.succeeded
```

---

## 5. Docker 사용 (선택)

### 전체 스택 실행
```bash
# PostgreSQL + Redis + pgAdmin
docker compose -f docker-compose.dev.yml up -d

# 상태 확인
docker compose -f docker-compose.dev.yml ps

# 로그 확인
docker compose -f docker-compose.dev.yml logs -f

# 중지
docker compose -f docker-compose.dev.yml down

# 완전 삭제 (데이터 포함)
docker compose -f docker-compose.dev.yml down -v
```

### 개별 서비스 관리
```bash
# PostgreSQL만 시작
docker compose -f docker-compose.dev.yml up -d postgres

# Redis만 시작
docker compose -f docker-compose.dev.yml up -d redis

# pgAdmin 접속: http://localhost:5050
# 이메일: admin@sajufortune.com
# 비밀번호: admin
```

### DB 접속 정보 (pgAdmin)
```
Host: postgres
Port: 5432
Username: postgres
Password: postgres
Database: sajufortune
```

---

## 6. 유용한 명령어

### npm scripts
```bash
npm run dev          # 개발 서버 시작
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 (빌드 후)
npm test             # 단위 테스트
npm run db:studio    # Drizzle Studio (DB GUI)
npm run db:generate  # 마이그레이션 파일 생성
npm run db:migrate   # 마이그레이션 실행
npm run db:rollback  # 마이그레이션 되돌리기
```

### DB 관리
```bash
# Drizzle Studio 실행 (DB GUI)
npm run db:studio
# → https://local.drizzle.studio 열림

# 마이그레이션 생성 (스키마 변경 후)
npm run db:generate

# 마이그레이션 적용
npm run db:migrate

# 마이그레이션 되돌리기
npm run db:rollback
```

---

## 7. 문제 해결 (Troubleshooting)

### 문제 1: "DATABASE_URL is not set"

**원인**: .env 파일이 없거나 DATABASE_URL 누락

**해결**:
```bash
# .env 파일 생성
cp .env.local .env

# 또는 직접 추가
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sajufortune" >> .env
```

### 문제 2: "Cannot connect to PostgreSQL"

**원인**: PostgreSQL이 실행되지 않음

**해결**:
```bash
# Docker 사용 시
docker compose -f docker-compose.dev.yml up -d postgres

# 직접 설치 시 (Windows)
services.msc → PostgreSQL 서비스 시작

# 직접 설치 시 (macOS)
brew services start postgresql@16

# 직접 설치 시 (Linux)
sudo systemctl start postgresql
```

### 문제 3: "Port 5000 already in use"

**원인**: 다른 프로세스가 5000 포트 사용 중

**해결**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS / Linux
lsof -i :5000
kill -9 <PID>

# 또는 .env에서 PORT 변경
PORT=3000
```

### 문제 4: "Module not found"

**원인**: node_modules 미설치 또는 손상

**해결**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 문제 5: TypeScript 에러

**원인**: 타입 정의 불일치

**해결**:
```bash
# 타입 체크
npx tsc --noEmit

# node_modules/@types 재설치
rm -rf node_modules/@types
npm install
```

---

## 8. 개발 워크플로우

### 일반적인 개발 흐름

```bash
# 1. 브랜치 생성
git checkout -b feature/my-new-feature

# 2. 개발 서버 시작
npm run dev

# 3. 코드 수정 (Hot Reload 자동)

# 4. 테스트 실행
npm test

# 5. 빌드 확인
npm run build

# 6. 커밋
git add .
git commit -m "feat: Add new feature"

# 7. 푸시
git push origin feature/my-new-feature
```

### DB 스키마 변경 시

```bash
# 1. shared/schema.ts 수정

# 2. 마이그레이션 파일 생성
npm run db:generate

# 3. 마이그레이션 적용
npm run db:migrate

# 4. Drizzle Studio로 확인
npm run db:studio
```

---

## 9. 다음 단계

### 로컬 개발이 잘 되면

✅ **Phase 1: 기능 개발**
- 새로운 기능 추가
- 테스트 작성
- 문서 업데이트

✅ **Phase 2: 배포 준비**
- 프로덕션 환경변수 설정
- NeonDB/Upstash 계정 생성
- Stripe Live Mode 전환

✅ **Phase 3: 배포**
- Docker 빌드
- Kubernetes 배포
- 모니터링 설정

---

## 📚 추가 문서

- **[README.md](../README.md)** - 프로젝트 개요
- **[DEPLOYMENT.md](../DEPLOYMENT.md)** - 배포 가이드
- **[docs/API_SPECIFICATION.md](./API_SPECIFICATION.md)** - API 문서
- **[docs/PRD_SajuFortune.md](./PRD_SajuFortune.md)** - 제품 요구사항

---

## 🆘 도움말

### 문의처
- **GitHub Issues**: https://github.com/your-username/SajuFortune/issues
- **Email**: dev@sajufortune.com

### 유용한 링크
- **Drizzle ORM**: https://orm.drizzle.team
- **TanStack Query**: https://tanstack.com/query
- **Stripe Docs**: https://stripe.com/docs

---

**작성일**: 2025-10-08  
**마지막 업데이트**: 2025-10-08  
**작성자**: AI Lead Developer


