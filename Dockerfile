# ==================================
# 🚀 운명의 해답 (SajuFortune) Dockerfile
# ==================================
#
# Multi-stage build for optimal image size
# - Stage 1: Build application (TypeScript → JavaScript)
# - Stage 2: Production runtime (Node.js 20 Alpine)
#
# Build: docker build -t saju-fortune:latest .
# Run: docker run -d -p 5000:5000 --env-file .env.production saju-fortune:latest
# ==================================

# ----------------------------------
# Stage 1: Builder
# ----------------------------------
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 메타데이터
LABEL maintainer="SajuFortune Team"
LABEL description="운명의 해답 - 사주팔자 분석 서비스"

# 의존성 파일 복사 (캐시 최적화)
COPY package.json package-lock.json ./

# 의존성 설치 (devDependencies 포함)
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# ----------------------------------
# Stage 2: Production Runtime
# ----------------------------------
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 메타데이터
LABEL maintainer="SajuFortune Team"
LABEL version="1.0.0"

# 보안: 비-root 사용자 생성
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 빌드 결과물 복사
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# 프로덕션 의존성만 설치
RUN npm ci --production && \
    npm cache clean --force

# 로그 디렉토리 생성
RUN mkdir -p /app/logs && chown nodejs:nodejs /app/logs

# 비-root 사용자로 전환
USER nodejs

# 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

# 포트 노출
EXPOSE 5000

# 환경변수 기본값
ENV NODE_ENV=production
ENV PORT=5000

# 컨테이너 실행 명령
CMD ["node", "dist/index.js"]
