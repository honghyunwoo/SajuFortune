# 🚀 프로덕션 배포 가이드
## Production Deployment Guide - SajuFortune

**소요 시간**: 30-60분  
**난이도**: ⭐⭐⭐⭐☆ (어려움)

---

## 📋 목차

1. [배포 전 체크리스트](#1-배포-전-체크리스트)
2. [클라우드 인프라 설정](#2-클라우드-인프라-설정)
3. [환경변수 설정](#3-환경변수-설정)
4. [Docker 빌드 & 푸시](#4-docker-빌드--푸시)
5. [Kubernetes 배포](#5-kubernetes-배포)
6. [모니터링 설정](#6-모니터링-설정)
7. [SSL/도메인 설정](#7-ssl도메인-설정)
8. [배포 후 검증](#8-배포-후-검증)

---

## 1. 배포 전 체크리스트

### ✅ 코드 준비
- [ ] 모든 테스트 통과 (171/171)
- [ ] TypeScript 0 에러
- [ ] Lint 0 경고
- [ ] 프로덕션 빌드 성공
- [ ] Git main 브랜치에 최신 코드 머지
- [ ] 버전 태그 생성 (`git tag v1.0.0`)

### ✅ 인프라 준비
- [ ] Kubernetes 클러스터 생성
- [ ] 도메인 구매 (sajufortune.com)
- [ ] SSL 인증서 발급 (Let's Encrypt)
- [ ] Docker Registry 설정 (GHCR/DockerHub)

### ✅ 외부 서비스 준비
- [ ] NeonDB 프로덕션 DB 생성
- [ ] Upstash Redis 프로덕션 인스턴스
- [ ] Stripe Live Mode 전환
- [ ] SendGrid API Key 발급
- [ ] Sentry 프로젝트 생성
- [ ] Google Analytics 계정

---

## 2. 클라우드 인프라 설정

### 옵션 A: AWS EKS (권장)

#### Step 1: EKS 클러스터 생성
```bash
# AWS CLI 설치 및 설정
aws configure

# eksctl 설치 (macOS)
brew install eksctl

# 클러스터 생성 (약 15분 소요)
eksctl create cluster \
  --name saju-fortune-prod \
  --region ap-northeast-2 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed
```

#### Step 2: kubectl 설정
```bash
# kubeconfig 업데이트
aws eks update-kubeconfig --region ap-northeast-2 --name saju-fortune-prod

# 연결 확인
kubectl get nodes
```

### 옵션 B: Google GKE

```bash
# gcloud CLI 설치
# https://cloud.google.com/sdk/docs/install

# 클러스터 생성
gcloud container clusters create saju-fortune-prod \
  --region asia-northeast3 \
  --num-nodes 2 \
  --machine-type e2-medium \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 4

# kubeconfig 설정
gcloud container clusters get-credentials saju-fortune-prod --region asia-northeast3
```

### 옵션 C: DigitalOcean Kubernetes (저렴)

```bash
# doctl CLI 설치
brew install doctl

# 인증
doctl auth init

# 클러스터 생성
doctl kubernetes cluster create saju-fortune-prod \
  --region sgp1 \
  --node-pool "name=worker-pool;size=s-2vcpu-4gb;count=2;auto-scale=true;min-nodes=1;max-nodes=4"

# kubeconfig 저장
doctl kubernetes cluster kubeconfig save saju-fortune-prod
```

---

## 3. 환경변수 설정

### Step 1: 외부 서비스 API Keys 수집

#### 3.1. NeonDB (PostgreSQL)
```bash
# 1. https://console.neon.tech 접속
# 2. 새 프로젝트 생성: "SajuFortune Production"
# 3. Connection String 복사
# 예: postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/sajufortune?sslmode=require
```

#### 3.2. Upstash Redis
```bash
# 1. https://console.upstash.com 접속
# 2. Redis 데이터베이스 생성 (Region: Seoul)
# 3. Connection String 복사
# 예: rediss://default:xxx@us1-moved-shark-12345.upstash.io:6379
```

#### 3.3. Stripe Live Mode
```bash
# 1. https://dashboard.stripe.com 접속
# 2. Live Mode 전환
# 3. API Keys 복사
STRIPE_SECRET_KEY=sk_live_51xxxxx
STRIPE_PUBLIC_KEY=pk_live_51xxxxx

# 4. Webhook 엔드포인트 추가
# URL: https://sajufortune.com/api/stripe-webhook
# Events: payment_intent.succeeded, payment_intent.payment_failed
# Webhook Secret 복사
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### 3.4. SendGrid (이메일)
```bash
# 1. https://app.sendgrid.com 접속
# 2. API Keys 생성 (Full Access)
# 3. API Key 복사
SENDGRID_API_KEY=SG.xxxxx

# 4. Sender 인증 (이메일 검증)
# Settings > Sender Authentication > Verify Single Sender
# noreply@sajufortune.com
```

#### 3.5. Sentry (에러 추적)
```bash
# 1. https://sentry.io 접속
# 2. 새 프로젝트 생성: "SajuFortune"
# 3. DSN 복사
SENTRY_DSN=https://xxx@oyyy.ingest.sentry.io/zzz
```

#### 3.6. SESSION_SECRET 생성
```bash
# 32바이트 랜덤 문자열 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# 출력: 9e358923edcc95fa5bc97a43f118983c2d85ece4d7b27c68ae40af6659bdedbe
```

### Step 2: Kubernetes Secrets 생성

#### 2.1. secrets.yaml 생성
```bash
# 템플릿 복사
cp k8s/secrets-template.yaml k8s/secrets.yaml

# Base64 인코딩 헬퍼 함수
encode() {
  echo -n "$1" | base64
}

# 각 값 인코딩 (예시)
encode "postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/sajufortune?sslmode=require"
encode "rediss://default:xxx@us1-moved-shark-12345.upstash.io:6379"
encode "9e358923edcc95fa5bc97a43f118983c2d85ece4d7b27c68ae40af6659bdedbe"
encode "sk_live_51xxxxx"
encode "whsec_xxxxx"
encode "SG.xxxxx"
encode "https://xxx@oyyy.ingest.sentry.io/zzz"
```

#### 2.2. secrets.yaml 편집
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: saju-fortune-secrets
data:
  database-url: cG9zdGdyZXNxbC...  # 위에서 인코딩한 값
  redis-url: cmVkaXNzOi8vZGVmYXVsdDp...
  session-secret: OWUzNTg5MjNlZGNjOTV...
  stripe-secret-key: c2tfbGl2ZV81MXh...
  stripe-webhook-secret: d2hzZWNfeHh4eHg=
  sendgrid-api-key: U0cueHh4eHg=
  sentry-dsn: aHR0cHM6Ly94eHg=
```

#### 2.3. Secrets 적용
```bash
# Kubernetes에 적용
kubectl apply -f k8s/secrets.yaml

# 확인
kubectl get secrets saju-fortune-secrets

# ⚠️ secrets.yaml을 절대 Git에 커밋하지 마세요!
# .gitignore에 추가되어 있는지 확인
grep "secrets.yaml" .gitignore
```

---

## 4. Docker 빌드 & 푸시

### Step 1: Docker Registry 로그인

#### GitHub Container Registry (권장)
```bash
# Personal Access Token 생성
# Settings > Developer settings > Personal access tokens > Tokens (classic)
# Scopes: write:packages, read:packages

# 로그인
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin
```

#### DockerHub
```bash
docker login
```

### Step 2: 이미지 빌드
```bash
# 버전 확인
VERSION=$(node -p "require('./package.json').version")
echo "Building version: $VERSION"

# 빌드
docker build -t ghcr.io/your-username/saju-fortune:$VERSION .
docker build -t ghcr.io/your-username/saju-fortune:latest .

# 또는 한번에
docker build \
  -t ghcr.io/your-username/saju-fortune:$VERSION \
  -t ghcr.io/your-username/saju-fortune:latest \
  .
```

### Step 3: 이미지 푸시
```bash
docker push ghcr.io/your-username/saju-fortune:$VERSION
docker push ghcr.io/your-username/saju-fortune:latest
```

### Step 4: 로컬 테스트 (선택)
```bash
# 컨테이너 실행
docker run -p 5000:5000 \
  -e DATABASE_URL="postgresql://..." \
  -e SESSION_SECRET="9e358923..." \
  ghcr.io/your-username/saju-fortune:latest

# 헬스체크
curl http://localhost:5000/health
```

---

## 5. Kubernetes 배포

### Step 1: Deployment 설정

#### 5.1. k8s/deployment.yaml 이미지 업데이트
```yaml
spec:
  template:
    spec:
      containers:
      - name: app
        image: ghcr.io/your-username/saju-fortune:v1.0.0  # 버전 업데이트
```

### Step 2: 배포 적용
```bash
# ConfigMap 적용
kubectl apply -f k8s/secrets-template.yaml  # ConfigMap 부분만

# Deployment 적용
kubectl apply -f k8s/deployment.yaml

# Monitoring 적용
kubectl apply -f k8s/monitoring.yaml

# 상태 확인
kubectl get pods
kubectl get svc
kubectl get ingress
```

### Step 3: Rollout 모니터링
```bash
# Rollout 상태 확인
kubectl rollout status deployment/saju-fortune

# Pod 로그 확인
kubectl logs -f deployment/saju-fortune

# Pod 상세 정보
kubectl describe pod <pod-name>
```

### Step 4: 롤백 (문제 발생 시)
```bash
# 이전 버전으로 롤백
kubectl rollout undo deployment/saju-fortune

# 특정 revision으로 롤백
kubectl rollout history deployment/saju-fortune
kubectl rollout undo deployment/saju-fortune --to-revision=2
```

---

## 6. 모니터링 설정

### 6.1. Sentry (에러 추적)

**이미 환경변수로 설정됨** ✅

```bash
# 테스트 에러 발생
curl -X POST https://sajufortune.com/api/fortune-readings \
  -H "Content-Type: application/json" \
  -d '{"date":"invalid"}'

# Sentry에서 확인
# https://sentry.io/organizations/your-org/issues/
```

### 6.2. UptimeRobot (가동시간 모니터링)

```bash
# 1. https://uptimerobot.com 가입
# 2. New Monitor 생성
#    - Monitor Type: HTTP(s)
#    - URL: https://sajufortune.com/health
#    - Interval: 5 minutes
# 3. Alert Contacts 설정 (이메일/Slack)
```

### 6.3. Prometheus + Grafana (선택)

```bash
# Helm 설치
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Prometheus 설치
helm install prometheus prometheus-community/kube-prometheus-stack

# Grafana 접속
kubectl port-forward svc/prometheus-grafana 3000:80

# 브라우저: http://localhost:3000
# 기본 로그인: admin / prom-operator
```

---

## 7. SSL/도메인 설정

### Step 1: 도메인 DNS 설정

```bash
# LoadBalancer External IP 확인
kubectl get svc saju-fortune

# 출력 예시:
# NAME           TYPE           EXTERNAL-IP       PORT(S)
# saju-fortune   LoadBalancer   34.64.123.456     80:30123/TCP

# DNS A Record 추가
# sajufortune.com → 34.64.123.456
# www.sajufortune.com → 34.64.123.456
```

### Step 2: cert-manager 설치 (Let's Encrypt)

```bash
# cert-manager 설치
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# ClusterIssuer 생성
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@sajufortune.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### Step 3: Ingress TLS 설정

```yaml
# k8s/deployment.yaml Ingress 부분
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: saju-fortune-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - sajufortune.com
    - www.sajufortune.com
    secretName: saju-fortune-tls
  rules:
  - host: sajufortune.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: saju-fortune
            port:
              number: 80
```

```bash
# 적용
kubectl apply -f k8s/deployment.yaml

# 인증서 발급 확인 (1-2분 소요)
kubectl get certificate
kubectl describe certificate saju-fortune-tls
```

---

## 8. 배포 후 검증

### 8.1. 헬스체크
```bash
# 기본 헬스체크
curl https://sajufortune.com/health

# 예상 출력:
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 123,
  "checks": {
    "database": { "status": "ok", "latency": 45 },
    "redis": { "status": "ok", "latency": 12 }
  }
}
```

### 8.2. API 테스트
```bash
# 사주 계산 테스트
curl -X POST https://sajufortune.com/api/fortune-readings \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1990-01-01",
    "hour": 12,
    "gender": "남성",
    "precision": "standard"
  }'

# 응답 확인 (200 OK)
```

### 8.3. 스모크 테스트 실행
```bash
# Playwright E2E 테스트 (프로덕션)
VITE_API_URL=https://sajufortune.com/api npx playwright test e2e/smoke.spec.ts
```

### 8.4. 성능 테스트
```bash
# Apache Bench (간단)
ab -n 1000 -c 10 https://sajufortune.com/

# k6 (상세)
k6 run scripts/load-test.js

# 기대 결과:
# - 평균 응답 시간: < 200ms
# - 99th percentile: < 500ms
# - 에러율: < 0.1%
```

### 8.5. 모니터링 대시보드 확인

| 도구 | URL | 확인 사항 |
|-----|-----|----------|
| **Sentry** | https://sentry.io | 에러 0건 |
| **UptimeRobot** | https://uptimerobot.com | Uptime 100% |
| **Grafana** | https://grafana.your-domain.com | CPU < 50%, Memory < 70% |
| **Google Analytics** | https://analytics.google.com | 트래픽 수집 확인 |

---

## 9. 배포 자동화 (CI/CD)

### GitHub Actions 설정

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run tests
        run: |
          npm install
          npm test
      
      - name: Build Docker image
        run: |
          docker build -t ghcr.io/${{ github.repository }}:${{ github.ref_name }} .
      
      - name: Push to GHCR
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/${{ github.repository }}:${{ github.ref_name }}
      
      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v4
        with:
          manifests: |
            k8s/deployment.yaml
          images: |
            ghcr.io/${{ github.repository }}:${{ github.ref_name }}
          kubeconfig: ${{ secrets.KUBE_CONFIG }}
```

### 배포 방법
```bash
# 버전 태그 생성
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions가 자동으로 배포 실행
# https://github.com/your-username/SajuFortune/actions
```

---

## 10. 원클릭 배포 스크립트

```bash
# 스크립트 실행 권한 부여
chmod +x scripts/deploy-production.sh

# 배포 실행
bash scripts/deploy-production.sh

# 스크립트가 자동으로 수행:
# ✅ Git 상태 검증
# ✅ 테스트 실행
# ✅ 빌드
# ✅ Docker 이미지 빌드/푸시
# ✅ Kubernetes 배포
# ✅ 헬스체크
```

---

## 11. 롤백 절차

### 즉시 롤백
```bash
# 이전 버전으로 즉시 롤백
kubectl rollout undo deployment/saju-fortune

# 확인
kubectl rollout status deployment/saju-fortune
```

### 특정 버전으로 롤백
```bash
# Rollout 히스토리 확인
kubectl rollout history deployment/saju-fortune

# 특정 revision으로 롤백
kubectl rollout undo deployment/saju-fortune --to-revision=3
```

---

## 12. 비용 최적화

### 예상 월간 비용 (최소 구성)

| 서비스 | 플랜 | 비용/월 |
|--------|------|---------|
| **Kubernetes** (DigitalOcean) | 2 nodes (2GB) | $24 |
| **NeonDB** | Free tier | $0 |
| **Upstash Redis** | Free tier | $0 |
| **Stripe** | 수수료만 (2.9% + 30¢) | 변동 |
| **Sentry** | Free tier | $0 |
| **SendGrid** | Free 100 emails/day | $0 |
| **도메인** | .com | $12/년 |
| **SSL** | Let's Encrypt | $0 |
| **총계** | | **~$25/월** |

### 무료 tier 한계
- **NeonDB Free**: 3 Projects, 10GB storage
- **Upstash Redis Free**: 10K commands/day
- **Sentry Free**: 5K errors/month
- **SendGrid Free**: 100 emails/day

### 스케일업 시 (1만 사용자/월)
- Kubernetes: $100/월 (8GB nodes)
- NeonDB: $19/월 (Pro plan)
- Upstash Redis: $0.2/10K commands = $60/월
- **총계**: **~$200/월**

---

## 📚 추가 리소스

- **Kubernetes Docs**: https://kubernetes.io/docs/
- **Helm Charts**: https://helm.sh/
- **cert-manager**: https://cert-manager.io/
- **Prometheus**: https://prometheus.io/
- **Grafana**: https://grafana.com/

---

**작성일**: 2025-10-08  
**작성자**: AI Lead Developer  
**버전**: 1.0.0


