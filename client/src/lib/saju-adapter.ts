import type { PremiumSajuAnalysis, SajuResult, ElementAnalysis, TenGodsAnalysis, SinsalAnalysisResult, LunarDate } from './premium-calculator';
import type { SajuData, SajuPillar } from '@shared/schema';
import { 천간오행 } from '@shared/astro-data';

// Helper function for rounding to two decimal places
function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

// Helper function for translating Korean element names to English
const ELEMENT_TRANSLATION = {
  '목': 'wood',
  '화': 'fire',
  '토': 'earth',
  '금': 'metal',
  '수': 'water'
} as const;

function translateElement(korean: '목' | '화' | '토' | '금' | '수'): 'wood' | 'fire' | 'earth' | 'metal' | 'water' {
  return ELEMENT_TRANSLATION[korean];
}

/**
 * PremiumSajuAnalysis를 SajuData 기본 형식으로 변환하는 어댑터 함수
 * @param premium PremiumSajuAnalysis 결과
 * @returns SajuData 기본 형식
 */
export function adaptPremiumToBasic(premium: PremiumSajuAnalysis): SajuData {
  // 1. Pillars Transformation
  const pillars: SajuPillar[] = [
    premium.saju.year,
    premium.saju.month,
    premium.saju.day,
    premium.saju.hour
  ].map(pillar => ({
    heavenly: pillar.gan,
    earthly: pillar.ji,
    element: 천간오행[pillar.gan] // Derive element from gan
  }));

  // 2. Elements Transformation
  const elements = {
    wood: roundToTwo(premium.elements.목),
    fire: roundToTwo(premium.elements.화),
    earth: roundToTwo(premium.elements.토),
    metal: roundToTwo(premium.elements.금),
    water: roundToTwo(premium.elements.수)
  };

  // 3. dayMaster
  const dayMaster = premium.saju.day.gan;

  // 4. strength derivation
  let strength: 'strong' | 'medium' | 'weak' = 'medium';
  const dayMasterElementKorean = 천간오행[dayMaster];
  const dayMasterElementEnglish = translateElement(dayMasterElementKorean); // Translate to English for lookup in 'elements' object
  const dayMasterElementCount = elements[dayMasterElementEnglish];

  if (dayMasterElementCount >= 3) { // Heuristic threshold
    strength = 'strong';
  } else if (dayMasterElementCount <= 1) { // Heuristic threshold
    strength = 'weak';
  } else {
    strength = 'medium';
  }

  return {
    pillars,
    elements,
    dayMaster,
    strength,
  };
}

// Add this interface to saju-adapter.ts
export interface PremiumExtras {
  tenGods: TenGodsAnalysis;
  sinsal: SinsalAnalysisResult;
  lunar: LunarDate;
  cyclicalDay: number;
  precision: 'premium' | 'basic';
  calculationTime: number;
}

// Add this function to saju-adapter.ts
/**
 * PremiumSajuAnalysis에서 프리미엄 추가 데이터를 추출하여 보존하는 함수
 * @param premium PremiumSajuAnalysis 결과
 * @returns PremiumExtras 형식의 추가 데이터
 */
export function preservePremiumExtras(premium: PremiumSajuAnalysis): PremiumExtras {
  return {
    tenGods: premium.tenGods,
    sinsal: premium.sinsal,
    lunar: premium.lunar,
    cyclicalDay: premium.cyclicalDay,
    precision: premium.precision,
    calculationTime: premium.calculationTime,
  };
}
