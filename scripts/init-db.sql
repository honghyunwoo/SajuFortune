-- ========================================
-- SajuFortune 데이터베이스 초기화 스크립트
-- ========================================
-- 용도: PostgreSQL 컨테이너 시작 시 자동 실행
-- ========================================

-- 데이터베이스 생성 (이미 docker-compose에서 생성됨)
-- CREATE DATABASE IF NOT EXISTS sajufortune;

-- 확장 모듈 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 텍스트 검색 최적화

-- 타임존 설정
SET timezone = 'Asia/Seoul';

-- 기본 사용자 정보 출력
SELECT 
  version() AS postgresql_version,
  current_database() AS database_name,
  current_user AS current_user,
  inet_server_addr() AS server_address,
  inet_server_port() AS server_port;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ SajuFortune 데이터베이스 초기화 완료!';
  RAISE NOTICE '📍 데이터베이스: %', current_database();
  RAISE NOTICE '⏰ 타임존: %', current_setting('timezone');
END $$;


