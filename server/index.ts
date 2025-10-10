import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { registerBlogRoutes } from "./blog";
import { registerCompatibilityRoutes } from "./compatibility";
import { setupVite, serveStatic, log as viteLog } from "./vite";
import session from "express-session";
import connectPGSimple from "connect-pg-simple";
import pg from "pg";
import compression from "compression";
import {
  securityHeaders,
  corsOptions,
  apiRateLimit,
  validateInput,
  privacySafeLogging,
  secureErrorHandler,
  sessionSecurity
} from "./security";
import { performanceMonitoring, healthCheck, metricsEndpoint } from "./monitoring";
import { requestLogger, errorLogger } from "./middleware/logger-middleware";
import { handleApiError, notFoundHandler } from "./middleware/error-handler";
import { log } from "./logger";

// 환경변수 검증 (프로덕션에서 필수)
function validateEnvironment() {
  const requiredEnvVars = {
    NODE_ENV: process.env.NODE_ENV,
    SESSION_SECRET: process.env.SESSION_SECRET,
  };

  const missingVars: string[] = [];
  const weakVars: string[] = [];

  // 프로덕션 환경에서만 엄격한 검증
  if (process.env.NODE_ENV === 'production') {
    // SESSION_SECRET 필수 검증
    if (!requiredEnvVars.SESSION_SECRET) {
      missingVars.push('SESSION_SECRET');
    } else if (requiredEnvVars.SESSION_SECRET === 'fallback-secret-change-in-production') {
      weakVars.push('SESSION_SECRET (fallback값 사용 중 - 보안 위험!)');
    } else if (requiredEnvVars.SESSION_SECRET.length < 32) {
      weakVars.push('SESSION_SECRET (32자 이상 권장)');
    }
  }

  // 오류 출력 및 서버 중단
  if (missingVars.length > 0 || (weakVars.length > 0 && process.env.NODE_ENV === 'production')) {
    console.error('\n🚨 환경변수 검증 실패!\n');

    if (missingVars.length > 0) {
      console.error('❌ 누락된 필수 환경변수:');
      missingVars.forEach(v => console.error(`   - ${v}`));
    }

    if (weakVars.length > 0) {
      console.error('\n⚠️ 보안에 취약한 환경변수:');
      weakVars.forEach(v => console.error(`   - ${v}`));
    }

    console.error('\n📖 해결 방법:');
    console.error('   1. .env 파일을 생성하고 필수 환경변수를 설정하세요.');
    console.error('   2. SESSION_SECRET는 최소 32자 이상의 무작위 문자열을 사용하세요.');
    console.error('   3. 예시: SESSION_SECRET=$(node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\')"))\n');

    process.exit(1);
  }

  // 개발 환경에서 경고만 표시
  if (weakVars.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('\n⚠️ 환경변수 경고 (개발 환경):');
    weakVars.forEach(v => console.warn(`   - ${v}`));
    console.warn('   프로덕션 배포 전에 반드시 수정하세요!\n');
  }

  console.log('✅ 환경변수 검증 완료');
}

// 서버 시작 전 환경변수 검증
validateEnvironment();

const app = express();

// Trust proxy (프로덕션 환경에서 필요)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Response compression (성능 최적화)
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
}));

// 보안 헤더 설정
app.use(securityHeaders);

// CORS 설정
app.use(corsOptions);

// Rate Limiting
app.use(apiRateLimit);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// 입력값 검증 및 XSS 방지
app.use(validateInput);

// 개인정보 보호 로깅
app.use(privacySafeLogging);

// HTTP 요청/응답 로깅 (Winston)
app.use(requestLogger);

// 성능 모니터링
app.use(performanceMonitoring);

// 환경 변수 검증
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// 데이터베이스 연결
const PGStore = connectPGSimple(session);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// 보안 강화된 세션 설정
app.use(
  session({
    store: new PGStore({
      pool: pool,
      createTableIfMissing: true,
    }),
    ...sessionSecurity
  }),
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      viteLog(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // 블로그 라우트 등록
  registerBlogRoutes(app);

  // 궁합 분석 라우트 등록
  registerCompatibilityRoutes(app);

  // 헬스 체크 엔드포인트
  app.get('/health', healthCheck);
  app.get('/metrics', metricsEndpoint);

  // 404 Not Found 핸들러
  app.use(notFoundHandler);
  
  // Winston 에러 로깅
  app.use(errorLogger);
  
  // 커스텀 에러 핸들러 (PRD 에러 코드 준수)
  app.use(handleApiError);
  
  // 보안 강화된 에러 핸들러 (Fallback)
  app.use(secureErrorHandler);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.platform === 'win32' ? 'localhost' : '0.0.0.0';

  server.listen(port, host, () => {
    viteLog(`serving on ${host}:${port}`);
  });
})();
