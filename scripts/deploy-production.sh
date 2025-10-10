#!/bin/bash

# ========================================
# SajuFortune 프로덕션 배포 스크립트
# ========================================
# 용도: Kubernetes 프로덕션 배포 자동화
# 실행: bash scripts/deploy-production.sh
# ========================================

set -e  # 에러 발생 시 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}🚀 SajuFortune 프로덕션 배포${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# ----------------------------------------
# 1. 사전 검증
# ----------------------------------------
echo -e "${YELLOW}📌 Step 1: 사전 검증${NC}"

# Git 상태 확인
if [[ -n $(git status -s) ]]; then
  echo -e "${RED}❌ Uncommitted changes detected${NC}"
  echo -e "${RED}   모든 변경사항을 커밋해주세요${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Git 상태 clean${NC}"

# 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo -e "${RED}❌ Not on main branch (current: $CURRENT_BRANCH)${NC}"
  echo -e "${YELLOW}   main 브랜치로 전환하시겠습니까? (y/n)${NC}"
  read -r response
  if [[ "$response" == "y" ]]; then
    git checkout main
    git pull origin main
  else
    exit 1
  fi
fi
echo -e "${GREEN}✅ main 브랜치 확인${NC}"

# kubectl 확인
if ! command -v kubectl &> /dev/null; then
  echo -e "${RED}❌ kubectl not found${NC}"
  echo -e "${RED}   Kubernetes CLI 설치 필요${NC}"
  exit 1
fi
echo -e "${GREEN}✅ kubectl 확인${NC}"

echo ""

# ----------------------------------------
# 2. 테스트 실행
# ----------------------------------------
echo -e "${YELLOW}📌 Step 2: 테스트 실행${NC}"

echo "🧪 단위 테스트 실행 중..."
npm test --run || {
  echo -e "${RED}❌ 테스트 실패!${NC}"
  exit 1
}
echo -e "${GREEN}✅ 테스트 통과${NC}"

echo "🔍 TypeScript 타입 체크..."
npx tsc --noEmit --skipLibCheck || {
  echo -e "${RED}❌ TypeScript 에러 발생!${NC}"
  exit 1
}
echo -e "${GREEN}✅ TypeScript 검증 완료${NC}"

echo ""

# ----------------------------------------
# 3. 빌드
# ----------------------------------------
echo -e "${YELLOW}📌 Step 3: 프로덕션 빌드${NC}"

echo "📦 빌드 실행 중..."
npm run build || {
  echo -e "${RED}❌ 빌드 실패!${NC}"
  exit 1
}
echo -e "${GREEN}✅ 빌드 완료${NC}"

echo ""

# ----------------------------------------
# 4. Docker 이미지 빌드
# ----------------------------------------
echo -e "${YELLOW}📌 Step 4: Docker 이미지 빌드${NC}"

# 버전 태그 (package.json에서 추출)
VERSION=$(node -p "require('./package.json').version")
IMAGE_NAME="ghcr.io/your-username/saju-fortune"
IMAGE_TAG="$IMAGE_NAME:$VERSION"
IMAGE_LATEST="$IMAGE_NAME:latest"

echo "🐳 Docker 이미지 빌드: $IMAGE_TAG"
docker build -t "$IMAGE_TAG" -t "$IMAGE_LATEST" . || {
  echo -e "${RED}❌ Docker 빌드 실패!${NC}"
  exit 1
}
echo -e "${GREEN}✅ Docker 이미지 빌드 완료${NC}"

echo ""

# ----------------------------------------
# 5. Docker 이미지 푸시
# ----------------------------------------
echo -e "${YELLOW}📌 Step 5: Docker 이미지 푸시${NC}"

echo "📤 Docker 레지스트리 로그인..."
echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin || {
  echo -e "${YELLOW}⚠️  Docker 로그인 실패 (GITHUB_TOKEN 확인)${NC}"
  echo "   수동 로그인: docker login ghcr.io"
}

echo "📤 이미지 푸시: $IMAGE_TAG"
docker push "$IMAGE_TAG"
docker push "$IMAGE_LATEST"
echo -e "${GREEN}✅ Docker 이미지 푸시 완료${NC}"

echo ""

# ----------------------------------------
# 6. Kubernetes Secrets 확인
# ----------------------------------------
echo -e "${YELLOW}📌 Step 6: Kubernetes Secrets 확인${NC}"

if ! kubectl get secret saju-fortune-secrets &> /dev/null; then
  echo -e "${RED}❌ Kubernetes Secret 'saju-fortune-secrets' not found${NC}"
  echo -e "${YELLOW}   다음 명령어로 생성하세요:${NC}"
  echo "   kubectl apply -f k8s/secrets.yaml"
  echo ""
  echo -e "${YELLOW}   배포를 계속하시겠습니까? (y/n)${NC}"
  read -r response
  if [[ "$response" != "y" ]]; then
    exit 1
  fi
else
  echo -e "${GREEN}✅ Kubernetes Secret 확인 완료${NC}"
fi

echo ""

# ----------------------------------------
# 7. Kubernetes 배포
# ----------------------------------------
echo -e "${YELLOW}📌 Step 7: Kubernetes 배포${NC}"

# Deployment 업데이트
echo "🚀 Deployment 업데이트..."
kubectl set image deployment/saju-fortune app="$IMAGE_TAG" --record

# Rollout 상태 확인
echo "⏳ Rollout 진행 상황 확인..."
kubectl rollout status deployment/saju-fortune --timeout=5m

echo -e "${GREEN}✅ Deployment 업데이트 완료${NC}"

echo ""

# ----------------------------------------
# 8. 배포 검증
# ----------------------------------------
echo -e "${YELLOW}📌 Step 8: 배포 검증${NC}"

# Pod 상태 확인
echo "🔍 Pod 상태 확인..."
kubectl get pods -l app=saju-fortune

# 헬스체크
echo "💚 헬스체크 확인..."
EXTERNAL_IP=$(kubectl get svc saju-fortune -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [[ -n "$EXTERNAL_IP" ]]; then
  curl -f "http://$EXTERNAL_IP/health" || {
    echo -e "${RED}❌ 헬스체크 실패!${NC}"
    echo "   롤백 필요: kubectl rollout undo deployment/saju-fortune"
    exit 1
  }
  echo -e "${GREEN}✅ 헬스체크 성공${NC}"
else
  echo -e "${YELLOW}⚠️  External IP를 가져올 수 없습니다${NC}"
  echo "   수동 확인: kubectl get svc saju-fortune"
fi

echo ""

# ----------------------------------------
# 9. 완료
# ----------------------------------------
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 배포 완료!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}📊 배포 정보:${NC}"
echo "   - Version: $VERSION"
echo "   - Image: $IMAGE_TAG"
echo "   - Namespace: default"
echo "   - Service: saju-fortune"
echo ""
echo -e "${CYAN}📋 다음 단계:${NC}"
echo "   1. 로그 확인: kubectl logs -f deployment/saju-fortune"
echo "   2. Pod 상태: kubectl get pods -l app=saju-fortune"
echo "   3. 서비스 URL: kubectl get svc saju-fortune"
echo "   4. 롤백 (문제 발생 시): kubectl rollout undo deployment/saju-fortune"
echo ""
echo -e "${CYAN}🔗 모니터링:${NC}"
echo "   - Grafana: https://grafana.your-domain.com"
echo "   - Sentry: https://sentry.io/organizations/your-org/issues/"
echo "   - Uptime: https://uptimerobot.com"
echo ""


