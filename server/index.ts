import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import connectPGSimple from "connect-pg-simple";
import pg from "pg";
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

const app = express();

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

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // 헬스 체크 엔드포인트
  app.get('/health', healthCheck);
  app.get('/metrics', metricsEndpoint);

  // 보안 강화된 에러 핸들러
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
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
