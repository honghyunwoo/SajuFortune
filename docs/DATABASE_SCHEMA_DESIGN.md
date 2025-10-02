# 데이터베이스 스키마 설계 (Database Schema Design)

## 프로젝트: SajuFortune
**작성일**: 2025-10-03
**작성자**: Claude (Senior Developer)

---

## ERD (Entity Relationship Diagram)

```
┌─────────────────┐         ┌──────────────────────┐
│     users       │         │  fortune_readings    │
├─────────────────┤         ├──────────────────────┤
│ id (PK)         │◄───┐    │ id (PK)              │
│ username        │    │    │ user_id (FK)         │
│ email           │    └────┤ session_id           │
│ password        │         │ gender               │
│ stripe_customer │         │ birth_date           │
│ created_at      │         │ birth_time           │
└─────────────────┘         │ birth_timezone       │
                            │ precision            │
                            │ saju_data (JSON)     │
                            │ analysis (JSON)      │
                            │ is_paid              │
                            │ created_at           │
                            └──────────────────────┘

┌─────────────────┐
│    donations    │
├─────────────────┤
│ id (PK)         │
│ donor_name      │
│ amount          │
│ currency        │
│ message         │
│ stripe_payment  │
│ created_at      │
└─────────────────┘
```

---

## 인덱스 전략

### 1. fortune_readings 테이블
```sql
-- 기본 인덱스 (이미 존재)
CREATE INDEX idx_fortune_session ON fortune_readings(session_id);
CREATE INDEX idx_fortune_user ON fortune_readings(user_id);

-- 성능 최적화 인덱스 (추가 필요)
CREATE INDEX idx_fortune_created ON fortune_readings(created_at DESC);
CREATE INDEX idx_fortune_birth ON fortune_readings(birth_date);

-- Composite Index (복합 조회 최적화)
CREATE INDEX idx_fortune_user_created
  ON fortune_readings(user_id, created_at DESC);

-- Partial Index (유료 사용자 조회 최적화)
CREATE INDEX idx_fortune_paid
  ON fortune_readings(user_id, created_at DESC)
  WHERE is_paid = true;
```

**쿼리 성능 예상**:
- 세션별 조회: 1ms (인덱스 스캔)
- 사용자 기록 조회: 5-10ms (복합 인덱스)
- 날짜 범위 조회: 10-20ms (created_at 인덱스)

---

### 2. users 테이블
```sql
-- 이미 unique 제약으로 인덱스 존재
-- username, email에 자동 인덱스 생성됨

-- 추가 인덱스 (Stripe 고객 조회)
CREATE INDEX idx_users_stripe ON users(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
```

---

### 3. donations 테이블
```sql
-- 최근 후원 조회 최적화
CREATE INDEX idx_donations_created ON donations(created_at DESC);

-- Stripe 결제 ID 조회
CREATE INDEX idx_donations_stripe ON donations(stripe_payment_id);
```

---

## 파티셔닝 전략 (미래 확장)

### 시계열 파티셔닝 (Time-based Partitioning)
**대상**: `fortune_readings` 테이블
**방식**: 월별 파티션
**시작 시점**: 데이터 100만 건 이상

```sql
-- PostgreSQL 12+ Partitioning
CREATE TABLE fortune_readings_partitioned (
  LIKE fortune_readings INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- 월별 파티션 생성
CREATE TABLE fortune_readings_2025_01
  PARTITION OF fortune_readings_partitioned
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE fortune_readings_2025_02
  PARTITION OF fortune_readings_partitioned
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

**예상 효과**:
- 쿼리 성능: 30-50% 향상
- 백업 속도: 파티션 단위 백업 가능
- 데이터 관리: 오래된 데이터 아카이빙 용이

---

## 쿼리 최적화

### 1. 자주 사용되는 쿼리
```sql
-- 사용자 최근 사주 목록
SELECT id, birth_date, gender, precision, created_at
FROM fortune_readings
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20;

-- 인덱스 사용: idx_fortune_user_created
-- 예상 실행 시간: 5-10ms
```

```sql
-- 특정 기간 통계
SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count
FROM fortune_readings
WHERE created_at BETWEEN $1 AND $2
GROUP BY date
ORDER BY date DESC;

-- 인덱스 사용: idx_fortune_created
-- 예상 실행 시간: 20-50ms (데이터량에 따라)
```

---

### 2. EXPLAIN ANALYZE 예시
```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM fortune_readings
WHERE session_id = 'abc123';

-- 예상 결과:
-- Index Scan using idx_fortune_session
-- Planning Time: 0.123 ms
-- Execution Time: 1.456 ms
```

---

## 데이터 무결성

### 1. 외래 키 제약
```sql
-- user_id는 NULL 허용 (익명 사용자)
ALTER TABLE fortune_readings
ADD CONSTRAINT fk_fortune_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE SET NULL;
```

### 2. CHECK 제약
```sql
-- 성별 값 검증
ALTER TABLE fortune_readings
ADD CONSTRAINT chk_gender
CHECK (gender IN ('male', 'female'));

-- 정밀도 값 검증
ALTER TABLE fortune_readings
ADD CONSTRAINT chk_precision
CHECK (precision IN ('basic', 'premium'));

-- 생년월일 유효 범위
ALTER TABLE fortune_readings
ADD CONSTRAINT chk_birth_date
CHECK (birth_date BETWEEN '1900-01-01' AND '2100-12-31');
```

---

## JSON 컬럼 최적화

### GIN 인덱스 (JSONB 검색 최적화)
```sql
-- saju_data 검색 최적화
CREATE INDEX idx_fortune_saju_gin
ON fortune_readings USING GIN (saju_data);

-- 특정 경로 인덱스 (더 빠름)
CREATE INDEX idx_fortune_geokguk
ON fortune_readings ((saju_data->'geokguk'->>'격국명'));
```

**쿼리 예시**:
```sql
-- 특정 격국을 가진 사주 검색
SELECT id, birth_date
FROM fortune_readings
WHERE saju_data->'geokguk'->>'격국명' = '정관격';

-- GIN 인덱스 사용으로 빠른 검색 가능
```

---

## 백업 및 복구 전략

### 1. 백업 정책
- **전체 백업**: 매일 00:00 UTC
- **증분 백업**: 4시간마다
- **트랜잭션 로그**: 실시간 백업
- **보관 기간**: 30일

### 2. pg_dump 스크립트
```bash
#!/bin/bash
# scripts/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="saju_fortune"

pg_dump -Fc $DB_NAME > $BACKUP_DIR/db_$DATE.dump

# 30일 이상 오래된 백업 삭제
find $BACKUP_DIR -name "db_*.dump" -mtime +30 -delete
```

---

## 모니터링 쿼리

### 1. 테이블 크기 확인
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. 인덱스 사용률
```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### 3. 슬로우 쿼리 감지
```sql
-- postgresql.conf 설정
log_min_duration_statement = 1000  -- 1초 이상 쿼리 로깅

-- 분석
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## 마이그레이션 스크립트

### 인덱스 추가 마이그레이션
```typescript
// migrations/001_add_indexes.ts

export async function up() {
  await db.execute(sql`
    CREATE INDEX CONCURRENTLY idx_fortune_created
    ON fortune_readings(created_at DESC);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY idx_fortune_user_created
    ON fortune_readings(user_id, created_at DESC);
  `);
}

export async function down() {
  await db.execute(sql`DROP INDEX idx_fortune_created;`);
  await db.execute(sql`DROP INDEX idx_fortune_user_created;`);
}
```

---

**예상 효과**:
- 쿼리 성능: 50-70% 향상
- 동시 접속 처리: 2배 향상
- 데이터베이스 부하: 30% 감소

---

**문서 작성자**: Claude (Senior Developer)
**마지막 업데이트**: 2025-10-03
