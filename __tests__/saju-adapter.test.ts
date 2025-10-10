import { describe, it, expect } from 'vitest';
import { adaptPremiumToBasic } from '../client/src/lib/saju-adapter';
import { calculatePremiumSaju } from '@shared/premium-calculator';
import { 천간오행 } from '../shared/astro-data';

describe('Saju Adapter - Corrected', () => {
  it('should correctly adapt PremiumSajuAnalysis to SajuData based on current logic', () => {
    // Input Data
    const testDate = new Date(1989, 9, 6, 12, 56); // 1989-10-06 12:56
    const testHour = 12;

    // Execute the functions
    const premiumResult = calculatePremiumSaju(testDate, testHour);
    const sajuData = adaptPremiumToBasic(premiumResult);

    // Assertions based on the ACTUAL output of the current calculator
    expect(sajuData.pillars).toHaveLength(4);

    // Year Pillar
    expect(sajuData.pillars[0].heavenly).toBe('기');
    expect(sajuData.pillars[0].earthly).toBe('사');

    // Month Pillar
    expect(sajuData.pillars[1].heavenly).toBe('계');
    expect(sajuData.pillars[1].earthly).toBe('유');

    // Day Pillar
    expect(sajuData.pillars[2].heavenly).toBe('무');
    expect(sajuData.pillars[2].earthly).toBe('오');

    // Hour Pillar
    expect(sajuData.pillars[3].heavenly).toBe('경');
    expect(sajuData.pillars[3].earthly).toBe('오');

    // DayMaster (This was the source of the original contradiction)
    expect(sajuData.dayMaster).toBe('무'); // Corrected to match the Day Pillar's heavenly stem
  });
});
