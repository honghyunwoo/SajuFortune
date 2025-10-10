# 📊 모니터링 설정 가이드
## Monitoring Setup Guide - SajuFortune

**소요 시간**: 30분  
**난이도**: ⭐⭐⭐☆☆ (중간)

---

## 📋 목차

1. [Sentry (에러 추적)](#1-sentry-에러-추적)
2. [UptimeRobot (가동시간)](#2-uptimerobot-가동시간)
3. [Google Analytics (사용자 분석)](#3-google-analytics-사용자-분석)
4. [Prometheus + Grafana (시스템 메트릭)](#4-prometheus--grafana-시스템-메트릭)
5. [Winston (로그 관리)](#5-winston-로그-관리)
6. [Slack 알림](#6-slack-알림)
7. [대시보드 구성](#7-대시보드-구성)

---

## 1. Sentry (에러 추적)

### 🎯 목적
- 프로덕션 에러 실시간 추적
- 스택 트레이스 자동 수집
- 사용자 영향도 분석

### Step 1: Sentry 프로젝트 생성

```bash
# 1. https://sentry.io 접속 및 가입
# 2. Create Project
#    - Platform: Node.js (Express)
#    - Project name: SajuFortune
#    - Team: Your Team
```

### Step 2: DSN 복사

```bash
# Project Settings > Client Keys (DSN)
# 예: https://abc123@o456789.ingest.sentry.io/123456

SENTRY_DSN=https://abc123@o456789.ingest.sentry.io/123456
```

### Step 3: 환경변수 설정

```bash
# .env (로컬)
SENTRY_DSN=https://abc123@o456789.ingest.sentry.io/123456
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=1.0  # 개발: 100%

# Kubernetes (프로덕션)
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1  # 프로덕션: 10%
```

### Step 4: 테스트

```bash
# 서버 시작
npm run dev

# 테스트 에러 발생
curl -X POST http://localhost:5000/api/fortune-readings \
  -H "Content-Type: application/json" \
  -d '{"date":"invalid-date"}'

# Sentry에서 확인
# Issues > 새 에러 확인
```

### Step 5: Alert 설정

```bash
# Sentry > Alerts > Create Alert Rule
# 
# Alert Name: Production Errors
# Conditions:
#   - When: error
#   - In environment: production
#   - Affecting: > 10 users
# Actions:
#   - Send notification to: #alerts (Slack)
#   - Send email to: dev@sajufortune.com
```

### 📊 Sentry 대시보드

**주요 메트릭**:
- **Error Rate**: 시간당 에러 발생 수
- **Affected Users**: 영향받은 사용자 수
- **MTTR**: 평균 해결 시간
- **Error Distribution**: 에러 유형별 분포

---

## 2. UptimeRobot (가동시간)

### 🎯 목적
- 서비스 가동시간 모니터링 (Uptime)
- 장애 발생 시 즉시 알림
- 응답 시간 추적

### Step 1: UptimeRobot 가입

```bash
# https://uptimerobot.com 접속 및 가입
# Free Plan: 50개 모니터, 5분 간격
```

### Step 2: 모니터 생성

#### 2.1. 메인 웹사이트 모니터
```
Monitor Type: HTTP(s)
Friendly Name: SajuFortune Main
URL: https://sajufortune.com
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
```

#### 2.2. 헬스체크 API 모니터
```
Monitor Type: HTTP(s)
Friendly Name: SajuFortune Health API
URL: https://sajufortune.com/health
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
```

#### 2.3. 사주 계산 API 모니터 (선택)
```
Monitor Type: Keyword
Friendly Name: SajuFortune API
URL: https://sajufortune.com/api/fortune-readings/test-reading-id
Keyword Type: Exists
Keyword Value: "천간" or "status"
Monitoring Interval: 5 minutes
```

### Step 3: Alert Contacts 설정

```bash
# My Settings > Alert Contacts > Add Alert Contact

# 이메일 알림
Type: E-mail
Value: dev@sajufortune.com
Friendly Name: Dev Team

# Slack 알림 (선택)
Type: Slack
Webhook URL: https://hooks.slack.com/services/T00/B00/XXX
Friendly Name: #alerts
```

### Step 4: Status Page 생성 (선택)

```bash
# Status Pages > Add Status Page
# 
# Domain: status.sajufortune.com
# Monitors: 
#   - SajuFortune Main
#   - SajuFortune Health API
# Custom Domain (선택): status.sajufortune.com
```

### 📊 UptimeRobot 대시보드

**주요 메트릭**:
- **Uptime**: 가동 시간 (목표: 99.9%)
- **Response Time**: 평균 응답 시간
- **Incidents**: 장애 횟수
- **MTTR**: 평균 복구 시간

---

## 3. Google Analytics (사용자 분석)

### 🎯 목적
- 사용자 행동 분석
- 페이지뷰, 세션 추적
- 전환율 측정

### Step 1: GA4 프로퍼티 생성

```bash
# 1. https://analytics.google.com 접속
# 2. Admin > Create Property
#    - Property name: SajuFortune
#    - Time zone: Seoul
#    - Currency: KRW
# 3. Create Data Stream
#    - Platform: Web
#    - Website URL: https://sajufortune.com
#    - Stream name: SajuFortune Web
```

### Step 2: Measurement ID 복사

```bash
# Data Streams > SajuFortune Web > Measurement ID
# 예: G-XXXXXXXXXX

VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: 환경변수 설정

```bash
# .env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Kubernetes ConfigMap에 추가
kubectl edit configmap saju-fortune-config
# 또는 k8s/secrets-template.yaml에 추가
```

### Step 4: 이벤트 추적 확인

**이미 구현된 이벤트**:
- `fortune_calculation_start`: 사주 계산 시작
- `fortune_calculation_complete`: 사주 계산 완료
- `donation_initiated`: 후원 시작
- `donation_completed`: 후원 완료
- `pdf_downloaded`: PDF 다운로드

```bash
# 테스트
# 1. 사주 계산 실행
# 2. GA4 > Reports > Realtime
# 3. Event count 확인
```

### Step 5: 목표 설정 (Conversion)

```bash
# GA4 > Admin > Events > Mark as conversion
# 
# Conversion Events:
#   - fortune_calculation_complete (주요 전환)
#   - donation_completed (수익 전환)
#   - pdf_downloaded (사용자 인게이지먼트)
```

### 📊 GA4 대시보드

**주요 메트릭**:
- **Users**: 일간/주간/월간 사용자 수
- **Sessions**: 세션 수, 세션 당 페이지뷰
- **Bounce Rate**: 이탈률
- **Conversion Rate**: 전환율 (사주 계산)
- **Average Session Duration**: 평균 세션 시간

---

## 4. Prometheus + Grafana (시스템 메트릭)

### 🎯 목적
- CPU, 메모리, 디스크 사용량
- HTTP 요청 메트릭
- 데이터베이스 쿼리 성능

### Step 1: Prometheus 설치 (Kubernetes)

```bash
# Helm 설치
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Prometheus Stack 설치 (Prometheus + Grafana + AlertManager)
helm install prometheus prometheus-community/kube-prometheus-stack

# 설치 확인
kubectl get pods -l "release=prometheus"
```

### Step 2: Grafana 접속

```bash
# Port Forward
kubectl port-forward svc/prometheus-grafana 3000:80

# 브라우저 열기
open http://localhost:3000

# 기본 로그인
# Username: admin
# Password: prom-operator

# 비밀번호 확인 (잊은 경우)
kubectl get secret prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 --decode
```

### Step 3: 대시보드 추가

#### 3.1. Node.js 애플리케이션 대시보드
```bash
# Grafana > Dashboards > Import
# Dashboard ID: 11159 (Node.js Application Dashboard)
```

#### 3.2. Kubernetes 클러스터 대시보드
```bash
# Dashboard ID: 7249 (Kubernetes Cluster Monitoring)
```

#### 3.3. PostgreSQL 대시보드
```bash
# Dashboard ID: 9628 (PostgreSQL Database)
```

### Step 4: 커스텀 메트릭 설정 (선택)

```typescript
// server/monitoring.ts에 이미 구현됨
// 
// 제공되는 메트릭:
// - HTTP request count
// - HTTP response time
// - Error rate
// - Cache hit rate
// - Database query time
// - Active connections
```

### Step 5: Alert 설정

```yaml
# prometheus-alerts.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-alerts
data:
  alerts.yml: |
    groups:
    - name: saju-fortune
      rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
      
      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes{pod=~"saju-fortune.*"} / container_spec_memory_limit_bytes{pod=~"saju-fortune.*"} > 0.9
        for: 5m
        annotations:
          summary: "High memory usage (>90%)"
```

### 📊 Grafana 대시보드

**주요 패널**:
1. **HTTP Requests**: 초당 요청 수
2. **Response Time**: P50, P95, P99
3. **Error Rate**: 5xx 에러 비율
4. **CPU Usage**: Pod별 CPU 사용률
5. **Memory Usage**: Pod별 메모리 사용률
6. **Database**: 쿼리 시간, Connection Pool
7. **Cache**: Hit Rate, Miss Rate

---

## 5. Winston (로그 관리)

### 🎯 목적
- 구조화된 JSON 로그
- 로그 레벨별 필터링 (debug, info, warn, error)
- 프로덕션 로그 외부 전송

### 로그 레벨

| Level | 용도 | 프로덕션 |
|-------|------|---------|
| **debug** | 상세 디버깅 정보 | ❌ |
| **info** | 일반 정보 (HTTP 요청 등) | ✅ |
| **warn** | 경고 (Rate Limit 등) | ✅ |
| **error** | 에러 (예외 처리) | ✅ |

### 환경변수 설정

```bash
# 개발 환경
LOG_LEVEL=debug

# 프로덕션
LOG_LEVEL=warn
```

### 로그 조회

#### Kubernetes Logs
```bash
# 실시간 로그
kubectl logs -f deployment/saju-fortune

# 최근 100줄
kubectl logs deployment/saju-fortune --tail=100

# 에러만 필터링
kubectl logs deployment/saju-fortune | grep '"level":"error"'

# 특정 시간대
kubectl logs deployment/saju-fortune --since=1h
```

#### 로그 파싱 (jq)
```bash
# 에러만 예쁘게 출력
kubectl logs deployment/saju-fortune | jq 'select(.level == "error")'

# HTTP 요청 통계
kubectl logs deployment/saju-fortune | jq 'select(.message == "HTTP Request") | .path' | sort | uniq -c

# 평균 응답 시간
kubectl logs deployment/saju-fortune | jq 'select(.duration) | .duration' | awk '{sum+=$1; n++} END {print sum/n}'
```

### 외부 로그 전송 (선택)

#### 옵션 A: Datadog
```bash
# Winston Transport 추가
npm install winston-datadog-logger

# server/logger.ts
import { DatadogTransport } from 'winston-datadog-logger';

logger.add(new DatadogTransport({
  apiKey: process.env.DATADOG_API_KEY,
  service: 'saju-fortune',
  hostname: 'production',
  ddsource: 'nodejs',
}));
```

#### 옵션 B: Logtail
```bash
npm install @logtail/winston

import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const logtail = new Logtail(process.env.LOGTAIL_TOKEN);
logger.add(new LogtailTransport(logtail));
```

---

## 6. Slack 알림

### 🎯 목적
- 중요 이벤트 실시간 알림
- 팀 협업 및 빠른 대응

### Step 1: Slack Webhook 생성

```bash
# 1. Slack > Apps > Incoming Webhooks
# 2. Add to Slack
# 3. Channel 선택: #alerts
# 4. Webhook URL 복사
# 예: https://hooks.slack.com/services/T00/B00/XXX
```

### Step 2: Webhook 통합

#### 2.1. Sentry → Slack
```bash
# Sentry > Settings > Integrations > Slack
# Install Slack Integration
# Connect workspace
# Select channel: #alerts
```

#### 2.2. UptimeRobot → Slack
```bash
# UptimeRobot > My Settings > Alert Contacts
# Type: Slack
# Webhook URL: https://hooks.slack.com/services/T00/B00/XXX
```

#### 2.3. Grafana → Slack
```bash
# Grafana > Alerting > Contact points
# New contact point
#   - Name: Slack
#   - Type: Slack
#   - Webhook URL: https://hooks.slack.com/services/T00/B00/XXX
```

### Step 3: 커스텀 알림 (선택)

```typescript
// server/lib/slack-notifier.ts
export async function sendSlackAlert(message: string, level: 'info' | 'warn' | 'error') {
  if (!process.env.SLACK_WEBHOOK_URL) return;
  
  const color = level === 'error' ? 'danger' : level === 'warn' ? 'warning' : 'good';
  
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color,
        text: message,
        footer: 'SajuFortune Monitoring',
        ts: Math.floor(Date.now() / 1000)
      }]
    })
  });
}

// 사용 예시
import { sendSlackAlert } from './lib/slack-notifier';

// 서버 시작 알림
await sendSlackAlert('🚀 Server started successfully', 'info');

// 심각한 에러 알림
catch (error) {
  await sendSlackAlert(`❌ Critical error: ${error.message}`, 'error');
}
```

---

## 7. 대시보드 구성

### 🎯 통합 대시보드

```
┌─────────────────────────────────────────┐
│  SajuFortune Monitoring Dashboard       │
├─────────────────────────────────────────┤
│                                         │
│  [Uptime: 99.95%] [Errors: 3] [Users: 1.2K] │
│                                         │
│  ┌─────────────┐ ┌─────────────┐       │
│  │  Sentry     │ │ UptimeRobot │       │
│  │  Errors     │ │  Status     │       │
│  │     3       │ │    🟢       │       │
│  └─────────────┘ └─────────────┘       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Grafana - System Metrics       │   │
│  │  CPU: 45%  Memory: 62%          │   │
│  │  Response Time: 180ms           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Google Analytics               │   │
│  │  Today: 523 users               │   │
│  │  Conversions: 87 (16.6%)        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 일일 체크리스트

**매일 아침 (10분)**:
- [ ] Sentry: 신규 에러 확인
- [ ] UptimeRobot: 어제 Uptime 확인
- [ ] Grafana: 시스템 리소스 확인
- [ ] GA4: 어제 사용자 수 확인

**매주 월요일 (30분)**:
- [ ] Sentry: 주간 에러 트렌드 분석
- [ ] UptimeRobot: 주간 Uptime 리포트
- [ ] Grafana: 주간 성능 리포트
- [ ] GA4: 주간 사용자 행동 분석
- [ ] Slack: 주간 요약 메시지 발송

---

## 8. Alert 우선순위

### 🚨 Critical (즉시 대응)
- **Uptime < 99%**: 서비스 장애
- **Error Rate > 5%**: 대량 에러 발생
- **Response Time > 5s**: 심각한 성능 저하
- **Database Connection Failed**: DB 장애

**알림 채널**: Slack + Email + SMS

### ⚠️ High (1시간 내 대응)
- **Memory Usage > 90%**: 메모리 부족
- **CPU Usage > 90%**: CPU 과부하
- **Error Rate > 1%**: 에러 증가
- **Cache Hit Rate < 70%**: 캐싱 문제

**알림 채널**: Slack + Email

### 📝 Medium (당일 대응)
- **Response Time > 1s**: 성능 저하
- **Disk Usage > 80%**: 디스크 부족
- **Rate Limit Hit**: 과도한 요청

**알림 채널**: Slack

### ℹ️ Low (주간 리뷰)
- **Minor Errors**: 경미한 에러
- **Performance Degradation**: 약간의 성능 저하

**알림 채널**: 주간 리포트

---

## 9. 비용

| 서비스 | 플랜 | 비용/월 |
|--------|------|---------|
| **Sentry** | Free (5K errors) | $0 |
| **UptimeRobot** | Free (50 monitors) | $0 |
| **Google Analytics** | Free | $0 |
| **Prometheus+Grafana** | Self-hosted | $0* |
| **Winston** | Free | $0 |
| **Slack** | Free | $0 |
| **총계** | | **$0** |

*Kubernetes 클러스터 비용에 포함

### 유료 플랜 (선택)
- **Sentry Team**: $26/월 (50K errors, 팀 기능)
- **UptimeRobot Pro**: $7/월 (1분 간격, 50개+ 모니터)
- **Datadog** (로그 관리): $15/월 (100GB)

---

## 📚 추가 리소스

- **Sentry Docs**: https://docs.sentry.io/
- **UptimeRobot Docs**: https://uptimerobot.com/api/
- **Google Analytics 4**: https://support.google.com/analytics/
- **Prometheus**: https://prometheus.io/docs/
- **Grafana**: https://grafana.com/docs/
- **Winston**: https://github.com/winstonjs/winston

---

**작성일**: 2025-10-08  
**작성자**: AI Lead Developer  
**버전**: 1.0.0


