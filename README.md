# 🔮 사주풀이 서비스 (Saju Fortune)

> 전통 한국 사주학을 기반으로 한 정밀한 온라인 사주 분석 서비스

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)

## ✨ 주요 특징

- **🎯 정밀한 사주 계산**: 1989년 버그 수정을 포함한 검증된 사주 계산 엔진
- **🆓 완전 무료**: 모든 사주 기능을 무료로 제공
- **📱 모바일 최적화**: 반응형 디자인으로 모든 기기에서 완벽 지원
- **🔒 개인정보 보호**: GDPR 및 한국 개인정보보호법 완벽 준수
- **⚡ 빠른 성능**: 캐싱 시스템으로 100ms 이하 응답 시간
- **🛡️ 보안 강화**: OWASP Top 10 대응 및 Rate Limiting

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 20.0.0 이상
- PostgreSQL 16 이상
- Redis 7 이상 (선택사항)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/saju-fortune.git
cd saju-fortune

# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 필요한 값들을 설정하세요

# 데이터베이스 설정
npm run db:push

# 개발 서버 실행
npm run dev
```

서비스가 `http://localhost:5000`에서 실행됩니다.

## 🏗️ 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Radix UI** - 접근성 우선 컴포넌트
- **TanStack Query** - 서버 상태 관리

### Backend
- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **TypeScript** - 타입 안전성
- **Drizzle ORM** - 데이터베이스 ORM
- **PostgreSQL** - 메인 데이터베이스
- **Redis** - 캐싱 시스템

### DevOps & 배포
- **Docker** - 컨테이너화
- **Kubernetes** - 오케스트레이션
- **Nginx** - 리버스 프록시
- **GitHub Actions** - CI/CD
- **Prometheus & Grafana** - 모니터링

## 📁 프로젝트 구조

```
saju-fortune/
├── client/                 # 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── lib/           # 유틸리티 및 라이브러리
│   │   └── hooks/         # 커스텀 훅
├── server/                # 백엔드 애플리케이션
│   ├── index.ts          # 서버 진입점
│   ├── routes.ts         # API 라우트
│   ├── storage.ts        # 데이터베이스 레이어
│   ├── security.ts       # 보안 미들웨어
│   ├── cache.ts          # 캐싱 시스템
│   └── monitoring.ts     # 성능 모니터링
├── shared/               # 공유 타입 및 유틸리티
│   ├── schema.ts         # 데이터베이스 스키마
│   ├── astro-data.ts     # 천문학 데이터
│   ├── solar-terms.ts    # 24절기 데이터
│   └── lunar-calculator.ts # 음력 계산
├── k8s/                  # Kubernetes 배포 설정
├── scripts/              # 배포 및 유틸리티 스크립트
└── __tests__/            # 테스트 파일
```

## 🔧 개발 가이드

### 환경 변수 설정

```bash
# 데이터베이스
DATABASE_URL=postgresql://username:password@localhost:5432/saju_fortune

# 세션 보안
SESSION_SECRET=your-super-secret-session-key

# Stripe 결제 (선택사항)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Redis 캐싱 (선택사항)
REDIS_URL=redis://localhost:6379
```

### 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test

# 린팅
npm run lint

# 타입 체크
npm run check

# 데이터베이스 마이그레이션
npm run db:push
```

### 테스트

```bash
# 모든 테스트 실행
npm test

# 특정 테스트 파일 실행
npm test saju-adapter.test.ts

# 커버리지 리포트
npm run test:coverage
```

## 🚀 배포

### Docker를 사용한 배포

```bash
# Docker 이미지 빌드
docker build -t saju-fortune .

# Docker Compose로 실행
docker-compose up -d
```

### Kubernetes를 사용한 배포

```bash
# Kubernetes 클러스터에 배포
kubectl apply -f k8s/

# 배포 상태 확인
kubectl get pods -l app=saju-fortune
```

### 자동 배포 스크립트

```bash
# 스테이징 환경 배포
./scripts/deploy.sh staging

# 프로덕션 환경 배포
./scripts/deploy.sh production
```

## 📊 모니터링

### 헬스 체크

- **애플리케이션**: `GET /health`
- **메트릭**: `GET /metrics`

### 성능 지표

- **응답 시간**: 평균 100ms 이하
- **가용성**: 99.9% 이상
- **에러율**: 1% 이하

## 🔒 보안

### 구현된 보안 기능

- **Rate Limiting**: API 요청 제한
- **CORS**: Cross-Origin 요청 제어
- **Helmet**: 보안 헤더 설정
- **XSS 방지**: 입력값 검증 및 필터링
- **CSRF 보호**: 세션 기반 토큰 검증
- **개인정보 보호**: 민감한 정보 마스킹

### 보안 모범사례

- 환경 변수를 통한 민감한 정보 관리
- 정기적인 의존성 업데이트
- 보안 스캔 자동화
- 로그 모니터링 및 알림

## 📈 성능 최적화

### 캐싱 전략

- **메모리 캐시**: 개발 환경용 NodeCache
- **Redis 캐시**: 프로덕션 환경용 분산 캐시
- **사주 계산 결과 캐싱**: 동일 입력 재계산 방지

### 성능 모니터링

- **실시간 메트릭**: Prometheus + Grafana
- **응답 시간 추적**: API 엔드포인트별 모니터링
- **에러율 모니터링**: 자동 알림 시스템

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 가이드라인

- TypeScript 사용 필수
- ESLint 및 Prettier 설정 준수
- 테스트 코드 작성 권장
- 커밋 메시지는 Conventional Commits 형식 사용

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원 및 문의

- **이메일**: support@saju-fortune.com
- **이슈 트래커**: [GitHub Issues](https://github.com/your-username/saju-fortune/issues)
- **문서**: [Wiki](https://github.com/your-username/saju-fortune/wiki)

## 🙏 감사의 말

- 한국천문연구원의 정밀한 24절기 데이터
- 전통 사주학 연구자들의 기여
- 오픈소스 커뮤니티의 지원

---

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**
