/**
 * 타임존 경계 조건 테스트
 *
 * 목적:
 * - Asia/Seoul 타임존 기준으로 날짜/시간 계산이 정확한지 검증
 * - 자정(00:00), 절기 전후, 윤년, 음력 전환 등 경계 조건 테스트
 *
 * 배경:
 * - 사주 계산은 시간 경계(자시/축시 등)에 민감
 * - 로컬 타임존과 Asia/Seoul 타임존 차이로 인한 오류 방지
 */

import { describe, it, expect } from 'vitest';
import { DateTime } from 'luxon';
import {
  createSeoulDate,
  createSeoulDateTime,
  nowInSeoul,
  isValidDateTime,
  formatSeoulDateTime,
  SEOUL_TIMEZONE,
} from '@shared/timezone-utils';

describe('타임존 경계 조건 테스트', () => {
  describe('자정 경계 (23:59 vs 00:00)', () => {
    it('23:59:59는 해당 날짜로 유지', () => {
      const date = createSeoulDate(2025, 10, 10, 23, 59);

      expect(date.getDate()).toBe(10);
      expect(date.getHours()).toBe(23);
      expect(date.getMinutes()).toBe(59);
    });

    it('00:00:00는 다음 날짜로 넘어가지 않음', () => {
      const date = createSeoulDate(2025, 10, 11, 0, 0);

      expect(date.getDate()).toBe(11);
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
    });

    it('23:59와 00:00은 다른 일주(日柱)를 가져야 함', () => {
      const date1 = createSeoulDate(2025, 10, 10, 23, 59);
      const date2 = createSeoulDate(2025, 10, 11, 0, 0);

      // 날짜가 다르므로 일주도 달라야 함
      expect(date1.getDate()).not.toBe(date2.getDate());
    });
  });

  describe('월 경계 (월말 → 월초)', () => {
    it('1월 31일 23시 → 2월 1일로 넘어가지 않음', () => {
      const date = createSeoulDate(2025, 1, 31, 23, 0);

      expect(date.getMonth() + 1).toBe(1); // JavaScript month는 0-based
      expect(date.getDate()).toBe(31);
    });

    it('2월 28일 23시 → 3월 1일로 넘어가지 않음 (평년)', () => {
      const date = createSeoulDate(2025, 2, 28, 23, 0);

      expect(date.getMonth() + 1).toBe(2);
      expect(date.getDate()).toBe(28);
    });

    it('2월 29일 처리 (윤년)', () => {
      const date = createSeoulDate(2024, 2, 29, 12, 0);

      expect(date.getMonth() + 1).toBe(2);
      expect(date.getDate()).toBe(29);
    });
  });

  describe('윤년 처리', () => {
    it('2024년 2월 29일은 유효한 날짜', () => {
      const dt = createSeoulDateTime(2024, 2, 29, 12, 0);

      expect(isValidDateTime(dt)).toBe(true);
      expect(dt.month).toBe(2);
      expect(dt.day).toBe(29);
    });

    it('2025년 2월 29일은 무효한 날짜', () => {
      const dt = createSeoulDateTime(2025, 2, 29, 12, 0);

      expect(isValidDateTime(dt)).toBe(false);
    });

    it('2000년 2월 29일은 유효 (400의 배수 윤년)', () => {
      const dt = createSeoulDateTime(2000, 2, 29, 12, 0);

      expect(isValidDateTime(dt)).toBe(true);
    });

    it('1900년 2월 29일은 무효 (100의 배수 평년)', () => {
      const dt = createSeoulDateTime(1900, 2, 29, 12, 0);

      expect(isValidDateTime(dt)).toBe(false);
    });
  });

  describe('Asia/Seoul 타임존 일관성', () => {
    it('createSeoulDateTime은 항상 Asia/Seoul 타임존 반환', () => {
      const dt = createSeoulDateTime(2025, 10, 10, 14, 30);

      expect(dt.zoneName).toBe(SEOUL_TIMEZONE);
      expect(dt.offset).toBe(540); // UTC+9 = 540분
    });

    it('nowInSeoul은 현재 시각을 Asia/Seoul 기준으로 반환', () => {
      const now = nowInSeoul();

      expect(now.zoneName).toBe(SEOUL_TIMEZONE);
      expect(now.offset).toBe(540);
    });

    it('동일한 입력은 동일한 절대 시각 생성', () => {
      const dt1 = createSeoulDateTime(2025, 10, 10, 14, 30);
      const dt2 = createSeoulDateTime(2025, 10, 10, 14, 30);

      expect(dt1.toMillis()).toBe(dt2.toMillis());
      expect(dt1.toISO()).toBe(dt2.toISO());
    });
  });

  describe('시간대 경계 (자시 23:00-01:00)', () => {
    it('23:00-23:59는 자시 초반', () => {
      const date = createSeoulDate(2025, 10, 10, 23, 30);

      expect(date.getHours()).toBe(23);
    });

    it('00:00-00:59는 자시 후반 (다음 날)', () => {
      const date = createSeoulDate(2025, 10, 11, 0, 30);

      expect(date.getDate()).toBe(11);
      expect(date.getHours()).toBe(0);
    });

    it('자시 경계에서 일주는 유지되어야 함', () => {
      // 사주학에서 자시(23:00-01:00)는 다음 날 간지를 사용
      const date1 = createSeoulDate(2025, 10, 10, 23, 30);
      const date2 = createSeoulDate(2025, 10, 11, 0, 30);

      // 두 시간 모두 자시이지만, 날짜는 다름
      expect(date1.getDate()).toBe(10);
      expect(date2.getDate()).toBe(11);
    });
  });

  describe('ISO 8601 포맷팅', () => {
    it('formatSeoulDateTime은 +09:00 오프셋 포함', () => {
      const dt = createSeoulDateTime(2025, 10, 10, 14, 30, 0);
      const formatted = formatSeoulDateTime(dt);

      expect(formatted).toContain('+09:00');
      expect(formatted).toMatch(/2025-10-10T14:30:00/);
    });

    it('자정(00:00)도 올바르게 포맷팅', () => {
      const dt = createSeoulDateTime(2025, 10, 10, 0, 0, 0);
      const formatted = formatSeoulDateTime(dt);

      expect(formatted).toContain('T00:00:00');
      expect(formatted).toContain('+09:00');
    });
  });

  describe('createSeoulDate JavaScript Date 변환', () => {
    it('Luxon → JS Date 변환 일관성', () => {
      const jsDate = createSeoulDate(2025, 10, 10, 14, 30);
      const luxonDt = createSeoulDateTime(2025, 10, 10, 14, 30);

      expect(jsDate.getTime()).toBe(luxonDt.toJSDate().getTime());
    });

    it('JS Date는 로컬 타임존이 아닌 Seoul 타임존 기준', () => {
      const seoulDate = createSeoulDate(2025, 10, 10, 14, 30);

      // Asia/Seoul 기준으로 생성된 Date의 UTC 시간은 05:30 (14:30 - 9시간)
      const utcHours = seoulDate.getUTCHours();
      expect(utcHours).toBe(5); // 14 - 9 = 5
    });
  });

  describe('절기(節氣) 경계 조건', () => {
    it('입춘(立春) 전후 - 연주 변경 가능성', () => {
      // 2025년 입춘: 2월 3일 17:10경
      const beforeLichun = createSeoulDate(2025, 2, 3, 17, 0);
      const afterLichun = createSeoulDate(2025, 2, 3, 17, 30);

      expect(beforeLichun.getHours()).toBe(17);
      expect(afterLichun.getHours()).toBe(17);
      // 연주 변경은 실제 사주 계산 로직에서 처리
    });

    it('동지(冬至) 경계 - 양력 12월 21-22일', () => {
      const dongji = createSeoulDate(2025, 12, 21, 23, 30);

      expect(dongji.getMonth() + 1).toBe(12);
      expect(dongji.getDate()).toBe(21);
    });
  });

  describe('극단적 날짜 처리', () => {
    it('매우 오래된 날짜 (1900년)', () => {
      const dt = createSeoulDateTime(1900, 1, 1, 0, 0);

      expect(isValidDateTime(dt)).toBe(true);
      expect(dt.year).toBe(1900);
    });

    it('먼 미래 날짜 (2100년)', () => {
      const dt = createSeoulDateTime(2100, 12, 31, 23, 59);

      expect(isValidDateTime(dt)).toBe(true);
      expect(dt.year).toBe(2100);
    });

    it('무효한 날짜 (13월)', () => {
      const dt = createSeoulDateTime(2025, 13, 1, 0, 0);

      expect(isValidDateTime(dt)).toBe(false);
    });

    it('무효한 날짜 (0월)', () => {
      const dt = createSeoulDateTime(2025, 0, 1, 0, 0);

      expect(isValidDateTime(dt)).toBe(false);
    });

    it('무효한 시간 (25시)', () => {
      const dt = createSeoulDateTime(2025, 10, 10, 25, 0);

      expect(isValidDateTime(dt)).toBe(false);
    });
  });

  describe('타임존 오프셋 일관성', () => {
    it('모든 Seoul DateTime은 UTC+9 (540분)', () => {
      const dates = [
        createSeoulDateTime(2025, 1, 1, 0, 0),
        createSeoulDateTime(2025, 6, 15, 12, 0),
        createSeoulDateTime(2025, 12, 31, 23, 59),
      ];

      dates.forEach((dt) => {
        expect(dt.offset).toBe(540);
        expect(dt.zoneName).toBe(SEOUL_TIMEZONE);
      });
    });

    it('여름/겨울 상관없이 UTC+9 유지 (한국은 DST 없음)', () => {
      const summer = createSeoulDateTime(2025, 7, 15, 12, 0);
      const winter = createSeoulDateTime(2025, 1, 15, 12, 0);

      expect(summer.offset).toBe(winter.offset);
      expect(summer.offset).toBe(540);
    });
  });
});
