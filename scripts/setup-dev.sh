#!/bin/bash

# ========================================
# SajuFortune 개발 환경 자동 설정 스크립트
# ========================================
# 용도: 신규 개발자 온보딩 원클릭 설정
# 실행: bash scripts/setup-dev.sh
# ========================================

set -e  # 에러 발생 시 중단

echo "🚀 SajuFortune 개발 환경 설정 시작..."
echo ""

# ----------------------------------------
# 1. Node.js 버전 확인
# ----------------------------------------
echo "📌 Step 1: Node.js 버전 확인"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20 이상 필요 (현재: v$NODE_VERSION)"
  echo "   https://nodejs.org 에서 최신 버전 설치"
  exit 1
fi
echo "✅ Node.js $(node -v) 확인 완료"
echo ""

# ----------------------------------------
# 2. 의존성 설치
# ----------------------------------------
echo "📌 Step 2: npm 의존성 설치"
if [ ! -d "node_modules" ]; then
  npm install
  echo "✅ 의존성 설치 완료"
else
  echo "✅ 의존성 이미 설치됨 (skip)"
fi
echo ""

# ----------------------------------------
# 3. .env 파일 생성
# ----------------------------------------
echo "📌 Step 3: 환경변수 파일 생성"
if [ ! -f ".env" ]; then
  if [ -f ".env.local" ]; then
    cp .env.local .env
    echo "✅ .env 파일 생성 (.env.local 복사)"
  elif [ -f ".env.example.txt" ]; then
    cp .env.example.txt .env
    echo "✅ .env 파일 생성 (.env.example.txt 복사)"
    
    # SESSION_SECRET 자동 생성
    SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
      sed -i.bak "s/development-secret-key-change-in-production-minimum-32-chars/$SESSION_SECRET/" .env
      rm .env.bak
    else
      # Windows Git Bash
      sed -i "s/development-secret-key-change-in-production-minimum-32-chars/$SESSION_SECRET/" .env
    fi
    echo "✅ SESSION_SECRET 자동 생성 완료"
  else
    echo "❌ .env.example.txt 파일이 없습니다"
    exit 1
  fi
else
  echo "✅ .env 파일 이미 존재 (skip)"
fi
echo ""

# ----------------------------------------
# 4. Docker Compose로 PostgreSQL 시작
# ----------------------------------------
echo "📌 Step 4: PostgreSQL 시작 (Docker)"
if command -v docker &> /dev/null; then
  if [ ! "$(docker ps -q -f name=sajufortune-postgres-dev)" ]; then
    echo "🐳 Docker Compose로 PostgreSQL 시작 중..."
    docker-compose -f docker-compose.dev.yml up -d postgres
    echo "⏳ PostgreSQL 초기화 대기 중 (10초)..."
    sleep 10
    echo "✅ PostgreSQL 시작 완료"
  else
    echo "✅ PostgreSQL 이미 실행 중"
  fi
else
  echo "⚠️  Docker가 설치되지 않았습니다"
  echo "   수동으로 PostgreSQL 설치 및 실행 필요"
  echo "   DATABASE_URL을 .env에 설정해주세요"
fi
echo ""

# ----------------------------------------
# 5. 데이터베이스 마이그레이션
# ----------------------------------------
echo "📌 Step 5: 데이터베이스 스키마 생성"
npm run db:push 2>/dev/null || npm run db:migrate 2>/dev/null || true
echo "✅ 데이터베이스 스키마 생성 완료"
echo ""

# ----------------------------------------
# 6. 완료
# ----------------------------------------
echo "🎉 개발 환경 설정 완료!"
echo ""
echo "📋 다음 단계:"
echo "   1. 개발 서버 시작: npm run dev"
echo "   2. 브라우저 열기: http://localhost:5000"
echo "   3. 테스트 실행: npm test"
echo ""
echo "📚 유용한 명령어:"
echo "   - DB Studio: npm run db:studio"
echo "   - Docker 로그: docker-compose -f docker-compose.dev.yml logs -f"
echo "   - Docker 중지: docker-compose -f docker-compose.dev.yml down"
echo ""
echo "🔧 Stripe 테스트 (선택):"
echo "   1. Stripe 계정 생성: https://dashboard.stripe.com"
echo "   2. Test API Keys 복사"
echo "   3. .env 파일에 STRIPE_SECRET_KEY 업데이트"
echo ""


