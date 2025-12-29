import { describe, it, expect } from 'vitest';
import { adaptPremiumToBasic } from '../client/src/lib/saju-adapter';
import { calculatePremiumSaju } from '@shared/premium-calculator';
import { 천간오행 } from '../shared/astro-data';

describe('Saju Adapter - Corrected', () => {
  /**
   * 1989년 10월 6일 12시 56분 생 (홍현우)
   *
   * 수정된 일주 계산 결과 (2024-12 버그 수정 후):
   * - 연주: 己巳 (기사)
   * - 월주: 癸酉 (계유)
   * - 일주: 己亥 (기해) ← 이전 무오(戊午)에서 수정됨
   * - 시주: 丙午 (병오) ← 일주 수정으로 시주도 변경됨
   *
   * 검증: 온라인 만세력 (sajuplus.net, sajulink.com)과 일치
   */
  it('should correctly adapt PremiumSajuAnalysis to SajuData based on current logic', () => {
    // Input Data
    const testDate = new Date(1989, 9, 6, 12, 56); // 1989-10-06 12:56
    const testHour = 12;

    // Execute the functions
    const premiumResult = calculatePremiumSaju(testDate, testHour);
    const sajuData = adaptPremiumToBasic(premiumResult);

    // Assertions based on the CORRECTED output of the calculator
    expect(sajuData.pillars).toHaveLength(4);

    // Year Pillar - 己巳 (기사)
    expect(sajuData.pillars[0].heavenly).toBe('기');
    expect(sajuData.pillars[0].earthly).toBe('사');

    // Month Pillar - 癸酉 (계유)
    expect(sajuData.pillars[1].heavenly).toBe('계');
    expect(sajuData.pillars[1].earthly).toBe('유');

    // Day Pillar - 己亥 (기해) [수정됨]
    // 이전: 무오(戊午) - 잘못된 기준일(1900-01-31=갑자) 사용
    // 수정: 기해(己亥) - 올바른 기준일(1989-10-31=갑자) 사용
    expect(sajuData.pillars[2].heavenly).toBe('기');
    expect(sajuData.pillars[2].earthly).toBe('해');

    // Hour Pillar - 庚午 (경오)
    // 시주 천간 계산법: 甲/己일 → 子時부터 甲으로 시작
    // 己일간 + 午時(12시) = 甲子乙丑丙寅丁卯戊辰己巳庚午 → 庚(경)
    expect(sajuData.pillars[3].heavenly).toBe('경');
    expect(sajuData.pillars[3].earthly).toBe('오');

    // DayMaster - 일주의 천간
    expect(sajuData.dayMaster).toBe('기');
  });
});
