#!/bin/bash

# 사주풀이 서비스 배포 스크립트
# Usage: ./scripts/deploy.sh [environment] [version]

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
PROJECT_NAME="saju-fortune"

echo "🚀 Starting deployment..."
echo "Environment: $ENVIRONMENT"
echo "Version: $VERSION"

# 환경 변수 확인
check_env_vars() {
    echo "📋 Checking environment variables..."
    
    required_vars=(
        "DATABASE_URL"
        "SESSION_SECRET"
        "STRIPE_SECRET_KEY"
        "STRIPE_WEBHOOK_SECRET"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "❌ Error: $var is not set"
            exit 1
        fi
    done
    
    echo "✅ All required environment variables are set"
}

# Docker 이미지 빌드
build_image() {
    echo "🔨 Building Docker image..."
    
    docker build -t $PROJECT_NAME:$VERSION .
    docker tag $PROJECT_NAME:$VERSION $PROJECT_NAME:latest
    
    echo "✅ Docker image built successfully"
}

# 테스트 실행
run_tests() {
    echo "🧪 Running tests..."
    
    # 단위 테스트
    npm test
    
    # 통합 테스트
    docker-compose -f docker-compose.test.yml up --abort-on-container-exit
    
    echo "✅ All tests passed"
}

# 데이터베이스 마이그레이션
run_migrations() {
    echo "🗄️ Running database migrations..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # 프로덕션에서는 백업 후 마이그레이션
        echo "Creating database backup..."
        pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
        
        echo "Running migrations..."
        npm run db:migrate
    else
        # 스테이징에서는 바로 마이그레이션
        npm run db:migrate
    fi
    
    echo "✅ Database migrations completed"
}

# 배포 실행
deploy() {
    echo "🚀 Deploying to $ENVIRONMENT..."
    
    case $ENVIRONMENT in
        "staging")
            deploy_staging
            ;;
        "production")
            deploy_production
            ;;
        *)
            echo "❌ Unknown environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
}

# 스테이징 배포
deploy_staging() {
    echo "📦 Deploying to staging..."
    
    # Docker Compose로 배포
    docker-compose -f docker-compose.staging.yml down
    docker-compose -f docker-compose.staging.yml up -d
    
    # 헬스 체크
    sleep 30
    curl -f http://localhost:5000/health || {
        echo "❌ Health check failed"
        exit 1
    }
    
    echo "✅ Staging deployment completed"
}

# 프로덕션 배포
deploy_production() {
    echo "🏭 Deploying to production..."
    
    # Kubernetes 배포
    kubectl apply -f k8s/
    
    # 배포 상태 확인
    kubectl rollout status deployment/saju-fortune-app
    
    # 헬스 체크
    kubectl wait --for=condition=ready pod -l app=saju-fortune --timeout=300s
    
    echo "✅ Production deployment completed"
}

# 배포 후 검증
verify_deployment() {
    echo "🔍 Verifying deployment..."
    
    # API 엔드포인트 테스트
    curl -f http://localhost:5000/health
    curl -f http://localhost:5000/metrics
    
    # 성능 테스트
    echo "Running performance tests..."
    # Add your performance test commands here
    
    echo "✅ Deployment verification completed"
}

# 롤백 함수
rollback() {
    echo "🔄 Rolling back deployment..."
    
    case $ENVIRONMENT in
        "staging")
            docker-compose -f docker-compose.staging.yml down
            docker-compose -f docker-compose.staging.yml up -d
            ;;
        "production")
            kubectl rollout undo deployment/saju-fortune-app
            ;;
    esac
    
    echo "✅ Rollback completed"
}

# 메인 실행
main() {
    echo "🎯 Starting deployment process for $PROJECT_NAME"
    
    # 환경 변수 확인
    check_env_vars
    
    # 테스트 실행
    run_tests
    
    # Docker 이미지 빌드
    build_image
    
    # 데이터베이스 마이그레이션
    run_migrations
    
    # 배포 실행
    deploy
    
    # 배포 후 검증
    verify_deployment
    
    echo "🎉 Deployment completed successfully!"
    echo "Environment: $ENVIRONMENT"
    echo "Version: $VERSION"
    echo "URL: https://saju-fortune.com"
}

# 에러 처리
trap 'echo "❌ Deployment failed. Rolling back..."; rollback; exit 1' ERR

# 스크립트 실행
main "$@"
