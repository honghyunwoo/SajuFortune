# ========================================
# SajuFortune 개발 환경 자동 설정 (Windows)
# ========================================
# 용도: Windows 개발자 원클릭 설정
# 실행: powershell -ExecutionPolicy Bypass -File scripts\setup-dev.ps1
# ========================================

Write-Host "🚀 SajuFortune 개발 환경 설정 시작..." -ForegroundColor Cyan
Write-Host ""

# ----------------------------------------
# 1. Node.js 버전 확인
# ----------------------------------------
Write-Host "📌 Step 1: Node.js 버전 확인" -ForegroundColor Yellow
try {
    $nodeVersion = (node -v).Replace('v','').Split('.')[0]
    if ([int]$nodeVersion -lt 20) {
        Write-Host "❌ Node.js 20 이상 필요 (현재: v$nodeVersion)" -ForegroundColor Red
        Write-Host "   https://nodejs.org 에서 최신 버전 설치" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node.js $(node -v) 확인 완료" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js가 설치되지 않았습니다" -ForegroundColor Red
    exit 1
}
Write-Host ""

# ----------------------------------------
# 2. 의존성 설치
# ----------------------------------------
Write-Host "📌 Step 2: npm 의존성 설치" -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    npm install
    Write-Host "✅ 의존성 설치 완료" -ForegroundColor Green
} else {
    Write-Host "✅ 의존성 이미 설치됨 (skip)" -ForegroundColor Green
}
Write-Host ""

# ----------------------------------------
# 3. .env 파일 생성
# ----------------------------------------
Write-Host "📌 Step 3: 환경변수 파일 생성" -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    if (Test-Path ".env.local") {
        Copy-Item .env.local .env
        Write-Host "✅ .env 파일 생성 (.env.local 복사)" -ForegroundColor Green
    } elseif (Test-Path ".env.example.txt") {
        Copy-Item .env.example.txt .env
        Write-Host "✅ .env 파일 생성 (.env.example.txt 복사)" -ForegroundColor Green
        
        # SESSION_SECRET 자동 생성
        $sessionSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        (Get-Content .env) -replace 'development-secret-key-change-in-production-minimum-32-chars', $sessionSecret | Set-Content .env
        Write-Host "✅ SESSION_SECRET 자동 생성 완료" -ForegroundColor Green
    } else {
        Write-Host "❌ .env.example.txt 파일이 없습니다" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .env 파일 이미 존재 (skip)" -ForegroundColor Green
}
Write-Host ""

# ----------------------------------------
# 4. Docker로 PostgreSQL 시작
# ----------------------------------------
Write-Host "📌 Step 4: PostgreSQL 시작 (Docker)" -ForegroundColor Yellow
try {
    $dockerRunning = docker ps 2>$null
    if ($dockerRunning) {
        $postgresContainer = docker ps --filter "name=sajufortune-postgres-dev" --format "{{.Names}}"
        if (!$postgresContainer) {
            Write-Host "🐳 Docker Compose로 PostgreSQL 시작 중..." -ForegroundColor Cyan
            docker-compose -f docker-compose.dev.yml up -d postgres
            Write-Host "⏳ PostgreSQL 초기화 대기 중 (10초)..." -ForegroundColor Cyan
            Start-Sleep -Seconds 10
            Write-Host "✅ PostgreSQL 시작 완료" -ForegroundColor Green
        } else {
            Write-Host "✅ PostgreSQL 이미 실행 중" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ Docker가 실행되지 않았습니다" -ForegroundColor Red
        Write-Host "   Docker Desktop을 시작하거나" -ForegroundColor Yellow
        Write-Host "   수동으로 PostgreSQL을 설치해주세요" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Docker가 설치되지 않았습니다" -ForegroundColor Yellow
    Write-Host "   수동으로 PostgreSQL 설치 및 실행 필요" -ForegroundColor Yellow
}
Write-Host ""

# ----------------------------------------
# 5. 데이터베이스 마이그레이션
# ----------------------------------------
Write-Host "📌 Step 5: 데이터베이스 스키마 생성" -ForegroundColor Yellow
try {
    npm run db:push 2>$null
    Write-Host "✅ 데이터베이스 스키마 생성 완료" -ForegroundColor Green
} catch {
    Write-Host "⚠️  스키마 생성 실패 (DATABASE_URL 확인 필요)" -ForegroundColor Yellow
}
Write-Host ""

# ----------------------------------------
# 6. 완료
# ----------------------------------------
Write-Host "🎉 개발 환경 설정 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 다음 단계:" -ForegroundColor Cyan
Write-Host "   1. 개발 서버 시작: npm run dev" -ForegroundColor White
Write-Host "   2. 브라우저 열기: http://localhost:5000" -ForegroundColor White
Write-Host "   3. 테스트 실행: npm test" -ForegroundColor White
Write-Host ""
Write-Host "📚 유용한 명령어:" -ForegroundColor Cyan
Write-Host "   - DB Studio: npm run db:studio" -ForegroundColor White
Write-Host "   - Docker 로그: docker-compose -f docker-compose.dev.yml logs -f" -ForegroundColor White
Write-Host "   - Docker 중지: docker-compose -f docker-compose.dev.yml down" -ForegroundColor White
Write-Host "   - pgAdmin: http://localhost:5050 (admin@sajufortune.com / admin)" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Stripe 테스트 (선택):" -ForegroundColor Cyan
Write-Host "   1. Stripe 계정: https://dashboard.stripe.com" -ForegroundColor White
Write-Host "   2. Test Keys 복사 → .env 업데이트" -ForegroundColor White
Write-Host ""


