/**
 * 타임존 처리 유틸리티
 * 한국 사주학은 KST(UTC+9) 기준으로 계산되어야 함
 */

// 한국 표준시(KST) 오프셋: UTC+9
export const KST_OFFSET = 9 * 60; // 분 단위

/**
 * UTC 시간을 KST 시간으로 변환
 * @param utcDate UTC 기준 Date 객체
 * @returns KST 기준 Date 객체
 */
export function utcToKST(utcDate: Date): Date {
  const kstDate = new Date(utcDate.getTime() + KST_OFFSET * 60 * 1000);
  return kstDate;
}

/**
 * KST 시간을 UTC 시간으로 변환
 * @param kstDate KST 기준 Date 객체
 * @returns UTC 기준 Date 객체
 */
export function kstToUTC(kstDate: Date): Date {
  const utcDate = new Date(kstDate.getTime() - KST_OFFSET * 60 * 1000);
  return utcDate;
}

/**
 * 로컬 타임존을 KST로 정규화
 * 사용자가 입력한 시간을 KST 기준으로 변환
 * @param localDate 로컬 타임존 Date 객체
 * @returns KST 기준으로 정규화된 Date 객체
 */
export function normalizeToKST(localDate: Date): Date {
  // 로컬 타임존 오프셋 계산 (분 단위)
  const localOffset = localDate.getTimezoneOffset(); // 양수면 UTC-x, 음수면 UTC+x

  // UTC 기준 시간 계산
  const utcTime = localDate.getTime() + (localOffset * 60 * 1000);

  // KST 기준 시간으로 변환
  const kstTime = utcTime + (KST_OFFSET * 60 * 1000);

  return new Date(kstTime);
}

/**
 * KST 기준 Date 객체 생성
 * @param year 년
 * @param month 월 (1-12)
 * @param day 일
 * @param hour 시 (0-23)
 * @param minute 분 (0-59)
 * @param second 초 (0-59)
 * @returns KST 기준 Date 객체
 */
export function createKSTDate(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0
): Date {
  // JavaScript Date는 월을 0-11로 받음
  const date = new Date(year, month - 1, day, hour, minute, second);

  // 로컬 타임존 오프셋 보정하여 KST로 변환
  const localOffset = date.getTimezoneOffset();
  const kstOffset = -540; // KST는 UTC+9 = -540분
  const offsetDiff = (localOffset - kstOffset) * 60 * 1000;

  return new Date(date.getTime() - offsetDiff);
}

/**
 * Date 객체가 KST 기준인지 검증
 * (타임존 오프셋이 -540분인지 확인)
 * @param date 검증할 Date 객체
 * @returns KST 기준 여부
 */
export function isKSTDate(date: Date): boolean {
  return date.getTimezoneOffset() === -540;
}

/**
 * 타임존 정보를 포함한 날짜 문자열 생성
 * @param date Date 객체
 * @returns ISO 8601 형식의 KST 시간 문자열
 */
export function toKSTString(date: Date): string {
  const kstDate = normalizeToKST(date);
  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');
  const hour = String(kstDate.getHours()).padStart(2, '0');
  const minute = String(kstDate.getMinutes()).padStart(2, '0');
  const second = String(kstDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`;
}

/**
 * 타임존 디버깅 정보 출력
 * @param date Date 객체
 */
export function debugTimezone(date: Date): void {
  console.log('🕒 타임존 디버깅 정보:');
  console.log('  - Local Time:', date.toString());
  console.log('  - UTC Time:', date.toUTCString());
  console.log('  - ISO String:', date.toISOString());
  console.log('  - Timezone Offset:', date.getTimezoneOffset(), '분');
  console.log('  - KST로 변환:', toKSTString(date));
}
