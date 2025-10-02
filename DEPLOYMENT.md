# 🚀 배포 가이드

## 📋 목차
- [사전 준비](#사전-준비)
- [환경 변수 설정](#환경-변수-설정)
- [데이터베이스 설정](#데이터베이스-설정)
- [프로덕션 빌드](#프로덕션-빌드)
- [배포 방법](#배포-방법)
- [모니터링 및 유지보수](#모니터링-및-유지보수)

## 사전 준비

### 체크리스트
- [ ] Node.js 18+ 설치
- [ ] PostgreSQL 14+ 설치
- [ ] Redis 설치 (선택사항, 권장)
- [ ] 도메인 준비
- [ ] SSL/TLS 인증서 (Let's Encrypt 권장)
- [ ] Sentry 계정 (에러 모니터링)
- [ ] Stripe 계정 (결제 처리)

## 환경 변수 설정

### 프로덕션 환경 변수

`.env` 파일을 생성하고 다음 값들을 설정하세요:

```env
# 환경 설정
NODE_ENV=production
PORT=3000

# 데이터베이스
DATABASE_URL=postgresql://username:password@host:5432/sajufortune

# 세션 비밀키 (강력한 랜덤 문자열 생성)
SESSION_SECRET=your-very-secure-random-string-here

# Redis (캐싱)
REDIS_URL=redis://localhost:6379

# Stripe (결제)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Sentry (모니터링)
SENTRY_DSN=https://...@sentry.io/...

# 기타
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 보안 주의사항

⚠️ **절대로 프로덕션 환경 변수를 Git에 커밋하지 마세요!**

```bash
# 강력한 세션 비밀키 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 데이터베이스 설정

### PostgreSQL 설정

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE sajufortune;

# 사용자 생성 및 권한 부여
CREATE USER sajufortune_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE sajufortune TO sajufortune_user;

# 연결 테스트
\c sajufortune
```

### 마이그레이션 실행

```bash
# Drizzle Kit으로 스키마 푸시
npm run db:push

# 테이블 생성 확인
psql -U sajufortune_user -d sajufortune -c "\dt"
```

### 데이터베이스 백업

```bash
# 정기 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/sajufortune"

mkdir -p $BACKUP_DIR
pg_dump -U sajufortune_user sajufortune > "$BACKUP_DIR/backup_$DATE.sql"

# 7일 이상 된 백업 삭제
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# cron에 등록 (매일 새벽 2시)
0 2 * * * /path/to/backup.sh
```

## 프로덕션 빌드

### 1. 의존성 설치

```bash
# 프로덕션 의존성만 설치
npm ci --only=production
```

### 2. 빌드 실행

```bash
# TypeScript 컴파일 및 최적화
npm run build

# 빌드 결과 확인
ls -la dist/
```

### 3. 빌드 결과물

```
dist/
├── public/          # 정적 에셋 (CSS, JS)
│   ├── index.html
│   └── assets/
└── index.js         # 서버 번들
```

## 배포 방법

### 옵션 1: PM2 (추천)

#### PM2 설치

```bash
npm install -g pm2
```

#### PM2 설정 파일

`ecosystem.config.js` 생성:

```javascript
module.exports = {
  apps: [{
    name: 'sajufortune',
    script: './dist/index.js',
    instances: 'max', // CPU 코어 수만큼 인스턴스 생성
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

#### PM2로 시작

```bash
# 앱 시작
pm2 start ecosystem.config.js

# 상태 확인
pm2 status

# 로그 확인
pm2 logs sajufortune

# 재시작
pm2 restart sajufortune

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save
```

### 옵션 2: Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 포트 노출
EXPOSE 3000

# 실행
CMD ["node", "dist/index.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/sajufortune
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=sajufortune_user
      - POSTGRES_PASSWORD=your-password
      - POSTGRES_DB=sajufortune
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### Docker 실행

```bash
# 빌드 및 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f app

# 중지
docker-compose down
```

### 옵션 3: 전통적 배포

#### Nginx 리버스 프록시 설정

`/etc/nginx/sites-available/sajufortune`:

```nginx
upstream sajufortune_backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # HTTPS로 리다이렉트
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 인증서 (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 정적 파일 캐싱
    location /assets {
        alias /path/to/dist/public/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 프록시
    location / {
        proxy_pass http://sajufortune_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

```bash
# Nginx 설정 활성화
sudo ln -s /etc/nginx/sites-available/sajufortune /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Let's Encrypt SSL 인증서

```bash
# Certbot 설치
sudo apt-get install certbot python3-certbot-nginx

# 인증서 발급
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 자동 갱신 확인
sudo certbot renew --dry-run
```

## 모니터링 및 유지보수

### 1. Sentry 설정

```typescript
// server/index.ts에 이미 구현됨
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. 로그 관리

```bash
# PM2 로그 확인
pm2 logs sajufortune --lines 100

# 로그 파일 위치
tail -f /path/to/logs/err.log
tail -f /path/to/logs/out.log

# 로그 로테이션 (logrotate)
sudo nano /etc/logrotate.d/sajufortune
```

```
/path/to/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 3. 성능 모니터링

```bash
# 서버 리소스 모니터링
pm2 monit

# 메모리 사용량
free -h

# CPU 사용률
top -bn1 | grep "Cpu(s)"

# 디스크 사용량
df -h
```

### 4. 헬스 체크 엔드포인트

```typescript
// server/routes.ts에 추가
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### 5. 백업 확인

```bash
# 데이터베이스 백업 확인
ls -lh /backups/sajufortune/

# 복구 테스트 (테스트 DB에서)
psql -U postgres -d test_db < /backups/sajufortune/backup_latest.sql
```

## 배포 후 체크리스트

- [ ] 애플리케이션 정상 실행 확인
- [ ] 데이터베이스 연결 확인
- [ ] Redis 연결 확인
- [ ] API 응답 확인
- [ ] SSL/HTTPS 동작 확인
- [ ] Sentry 에러 수집 확인
- [ ] Stripe 결제 테스트 (테스트 모드)
- [ ] 모바일 반응형 확인
- [ ] 로그 수집 확인
- [ ] 백업 스케줄 확인
- [ ] PM2 자동 재시작 확인
- [ ] 부하 테스트 실행

## 트러블슈팅

### 포트 이미 사용중

```bash
# 프로세스 찾기
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

### 데이터베이스 연결 실패

```bash
# PostgreSQL 서비스 상태 확인
sudo systemctl status postgresql

# 연결 테스트
psql -U sajufortune_user -d sajufortune -h localhost
```

### Redis 연결 실패

```bash
# Redis 서비스 상태 확인
sudo systemctl status redis

# 연결 테스트
redis-cli ping
```

### 메모리 부족

```bash
# PM2 메모리 제한 증가
pm2 delete sajufortune
pm2 start ecosystem.config.js --max-memory-restart 2G
```

## 업데이트 절차

```bash
# 1. 코드 풀
git pull origin main

# 2. 의존성 업데이트
npm ci

# 3. 빌드
npm run build

# 4. 데이터베이스 마이그레이션 (필요시)
npm run db:push

# 5. PM2 재시작
pm2 restart sajufortune
```

## 롤백 절차

```bash
# 1. 이전 버전으로 복구
git reset --hard <commit-hash>

# 2. 의존성 재설치
npm ci

# 3. 빌드
npm run build

# 4. 재시작
pm2 restart sajufortune
```

---

배포에 문제가 있으면 GitHub Issues에 문의하세요.
