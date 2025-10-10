/**
 * 월별 운세 계산기
 * 12개월 운세를 계산하여 연애/재물/건강/직업 점수 제공
 */

import type { HeavenlyStem, EarthlyBranch } from './compatibility-calculator';

/**
 * 월별 운세 결과
 */
export interface MonthlyFortuneResult {
  months: MonthFortune[];
  currentMonthIndex: number;
  summary: {
    bestMonth: number; // 가장 좋은 달 (1-12)
    worstMonth: number; // 가장 안 좋은 달 (1-12)
    averageScore: number;
    trend: 'rising' | 'stable' | 'declining';
  };
}

/**
 * 개별 월 운세
 */
export interface MonthFortune {
  month: number; // 1-12
  year: number;
  monthPillar: {
    heavenlyStem: HeavenlyStem;
    earthlyBranch: EarthlyBranch;
  };
  sibiunseong: string; // 십이운성 (장생, 목욕, 관대 등)
  overallScore: number; // 종합 점수 (0-100)
  scores: {
    love: number; // 연애운 (0-100)
    wealth: number; // 재물운 (0-100)
    health: number; // 건강운 (0-100)
    career: number; // 직업운 (0-100)
  };
  highlights: string[]; // 주요 이벤트 (긍정적)
  warnings: string[]; // 주의사항 (부정적)
  advice: string; // 조언
  luckyDay: number; // 길일 (1-31)
  luckyColor: string; // 행운의 색
  luckyDirection: string; // 행운의 방향
}

/**
 * 월별 운세 계산
 */
export function calculateMonthlyFortune(
  birthData: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: 'male' | 'female';
  },
  sajuPillars: {
    year: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    month: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    day: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    hour: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
  },
  startYear?: number,
  startMonth?: number
): MonthlyFortuneResult {
  const now = new Date();
  const currentYear = startYear || now.getFullYear();
  const currentMonth = startMonth || now.getMonth() + 1;

  const months: MonthFortune[] = [];

  // 12개월 운세 계산
  for (let i = 0; i < 12; i++) {
    let targetMonth = currentMonth + i;
    let targetYear = currentYear;

    // 월이 12를 넘으면 다음 해로
    while (targetMonth > 12) {
      targetMonth -= 12;
      targetYear += 1;
    }

    const monthFortune = calculateSingleMonthFortune(
      birthData,
      sajuPillars,
      targetYear,
      targetMonth
    );

    months.push(monthFortune);
  }

  // 요약 정보 계산
  const scores = months.map(m => m.overallScore);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  const bestMonthIndex = scores.indexOf(Math.max(...scores));
  const worstMonthIndex = scores.indexOf(Math.min(...scores));

  // 추세 계산 (첫 3개월 vs 마지막 3개월)
  const earlyAvg = scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const lateAvg = scores.slice(9, 12).reduce((a, b) => a + b, 0) / 3;
  let trend: 'rising' | 'stable' | 'declining' = 'stable';
  if (lateAvg - earlyAvg > 10) trend = 'rising';
  else if (earlyAvg - lateAvg > 10) trend = 'declining';

  return {
    months,
    currentMonthIndex: 0,
    summary: {
      bestMonth: months[bestMonthIndex].month,
      worstMonth: months[worstMonthIndex].month,
      averageScore: Math.round(averageScore),
      trend,
    },
  };
}

/**
 * 단일 월 운세 계산
 */
function calculateSingleMonthFortune(
  birthData: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: 'male' | 'female';
  },
  sajuPillars: {
    year: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    month: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    day: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    hour: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
  },
  targetYear: number,
  targetMonth: number
): MonthFortune {
  // 해당 월의 월주 계산 (간략화)
  const monthPillar = getMonthPillar(targetYear, targetMonth);

  // 일주와 월주의 관계로 십이운성 계산
  const sibiunseong = calculateSibiunseong(sajuPillars.day, monthPillar);

  // 세부 운세 점수 계산
  const loveScore = calculateLoveScore(sajuPillars, monthPillar, sibiunseong);
  const wealthScore = calculateWealthScore(sajuPillars, monthPillar, sibiunseong);
  const healthScore = calculateHealthScore(sajuPillars, monthPillar, sibiunseong);
  const careerScore = calculateCareerScore(sajuPillars, monthPillar, sibiunseong);

  // 종합 점수 (가중 평균)
  const overallScore = Math.round(
    loveScore * 0.25 +
    wealthScore * 0.25 +
    healthScore * 0.25 +
    careerScore * 0.25
  );

  // 하이라이트 및 경고 생성
  const highlights: string[] = [];
  const warnings: string[] = [];

  if (loveScore >= 80) highlights.push('연애운이 최고조에 달합니다. 새로운 만남의 기회가 있습니다.');
  if (wealthScore >= 80) highlights.push('재물운이 좋아 투자나 사업 기회를 잡을 수 있습니다.');
  if (careerScore >= 80) highlights.push('직장에서 인정받고 승진 기회가 있을 수 있습니다.');

  if (loveScore < 40) warnings.push('연애 관계에서 갈등이 있을 수 있으니 주의하세요.');
  if (wealthScore < 40) warnings.push('재물 관리에 신중해야 합니다. 불필요한 지출을 줄이세요.');
  if (healthScore < 40) warnings.push('건강에 유의하세요. 규칙적인 생활이 중요합니다.');
  if (careerScore < 40) warnings.push('직장에서 스트레스가 있을 수 있습니다. 인내심을 가지세요.');

  // 조언 생성
  let advice = '';
  if (overallScore >= 80) {
    advice = '이번 달은 전반적으로 운세가 좋습니다. 새로운 도전을 해보세요.';
  } else if (overallScore >= 60) {
    advice = '안정적인 한 달입니다. 꾸준히 노력하면 좋은 결과가 있을 것입니다.';
  } else if (overallScore >= 40) {
    advice = '평범한 한 달입니다. 현 상태를 유지하며 다음 기회를 준비하세요.';
  } else {
    advice = '조금 어려운 시기입니다. 무리하지 말고 휴식을 취하세요.';
  }

  // 길일 계산 (간단한 로직)
  const luckyDay = (targetMonth + sajuPillars.day.earthlyBranch.charCodeAt(0)) % 28 + 1;

  // 행운의 색 (오행 기반)
  const luckyColor = getLuckyColor(monthPillar.heavenlyStem);

  // 행운의 방향 (지지 기반)
  const luckyDirection = getLuckyDirection(monthPillar.earthlyBranch);

  return {
    month: targetMonth,
    year: targetYear,
    monthPillar,
    sibiunseong,
    overallScore,
    scores: {
      love: loveScore,
      wealth: wealthScore,
      health: healthScore,
      career: careerScore,
    },
    highlights,
    warnings,
    advice,
    luckyDay,
    luckyColor,
    luckyDirection,
  };
}

/**
 * 월주 계산 (간략화 버전)
 */
function getMonthPillar(year: number, month: number): {
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
} {
  const stems: HeavenlyStem[] = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const branches: EarthlyBranch[] = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

  // 간단한 월주 계산 (실제로는 절입일 기준 복잡한 계산 필요)
  const stemIndex = ((year % 10) * 2 + month) % 10;
  const branchIndex = (month + 1) % 12;

  return {
    heavenlyStem: stems[stemIndex],
    earthlyBranch: branches[branchIndex],
  };
}

/**
 * 십이운성 계산
 */
function calculateSibiunseong(
  dayPillar: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch },
  monthPillar: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch }
): string {
  // 십이운성 테이블 (간략화)
  const sibiunseongTable: Record<string, string[]> = {
    '木': ['목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양', '장생'],
    '火': ['관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양', '장생', '목욕'],
    '土': ['건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양', '장생', '목욕', '관대'],
    '金': ['제왕', '쇠', '병', '사', '묘', '절', '태', '양', '장생', '목욕', '관대', '건록'],
    '水': ['쇠', '병', '사', '묘', '절', '태', '양', '장생', '목욕', '관대', '건록', '제왕'],
  };

  const dayElement = getElement(dayPillar.heavenlyStem);
  const monthBranchIndex = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'].indexOf(monthPillar.earthlyBranch);

  return sibiunseongTable[dayElement]?.[monthBranchIndex] || '중립';
}

/**
 * 연애운 점수 계산
 */
function calculateLoveScore(
  sajuPillars: any,
  monthPillar: any,
  sibiunseong: string
): number {
  let score = 50; // 기본 점수

  // 십이운성에 따른 점수
  const sibiunseongScores: Record<string, number> = {
    '장생': 80, '목욕': 90, '관대': 75,
    '건록': 60, '제왕': 70, '쇠': 45,
    '병': 35, '사': 30, '묘': 40,
    '절': 25, '태': 55, '양': 65,
  };

  score = sibiunseongScores[sibiunseong] || 50;

  // 도화살이 있으면 +10
  if (['자', '오', '묘', '유'].includes(monthPillar.earthlyBranch)) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * 재물운 점수 계산
 */
function calculateWealthScore(
  sajuPillars: any,
  monthPillar: any,
  sibiunseong: string
): number {
  let score = 50;

  const sibiunseongScores: Record<string, number> = {
    '장생': 70, '목욕': 60, '관대': 75,
    '건록': 85, '제왕': 90, '쇠': 55,
    '병': 40, '사': 30, '묘': 35,
    '절': 25, '태': 50, '양': 65,
  };

  score = sibiunseongScores[sibiunseong] || 50;

  // 재성(財星)과의 관계 (간략화)
  const dayElement = getElement(sajuPillars.day.heavenlyStem);
  const monthElement = getElement(monthPillar.heavenlyStem);

  // 일간이 월간을 극하면 재물운 +15 (재성)
  if (isDestructive(dayElement, monthElement)) {
    score += 15;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * 건강운 점수 계산
 */
function calculateHealthScore(
  sajuPillars: any,
  monthPillar: any,
  sibiunseong: string
): number {
  let score = 50;

  const sibiunseongScores: Record<string, number> = {
    '장생': 95, '목욕': 70, '관대': 80,
    '건록': 90, '제왕': 95, '쇠': 55,
    '병': 30, '사': 20, '묘': 25,
    '절': 15, '태': 65, '양': 75,
  };

  score = sibiunseongScores[sibiunseong] || 50;

  return Math.min(100, Math.max(0, score));
}

/**
 * 직업운 점수 계산
 */
function calculateCareerScore(
  sajuPillars: any,
  monthPillar: any,
  sibiunseong: string
): number {
  let score = 50;

  const sibiunseongScores: Record<string, number> = {
    '장생': 75, '목욕': 65, '관대': 80,
    '건록': 90, '제왕': 95, '쇠': 50,
    '병': 35, '사': 25, '묘': 30,
    '절': 20, '태': 60, '양': 70,
  };

  score = sibiunseongScores[sibiunseong] || 50;

  // 관성(官星)과의 관계 (간략화)
  const dayElement = getElement(sajuPillars.day.heavenlyStem);
  const monthElement = getElement(monthPillar.heavenlyStem);

  // 월간이 일간을 극하면 직업운 +10 (관성)
  if (isDestructive(monthElement, dayElement)) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * 오행 반환
 */
function getElement(stem: HeavenlyStem): string {
  const elements: Record<HeavenlyStem, string> = {
    '갑': '木', '을': '木',
    '병': '火', '정': '火',
    '무': '土', '기': '土',
    '경': '金', '신': '金',
    '임': '水', '계': '水',
  };
  return elements[stem];
}

/**
 * 오행 상극 관계
 */
function isDestructive(element1: string, element2: string): boolean {
  const destructive: Record<string, string> = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木',
  };
  return destructive[element1] === element2;
}

/**
 * 행운의 색 (천간 오행 기반)
 */
function getLuckyColor(stem: HeavenlyStem): string {
  const colors: Record<string, string> = {
    '木': '초록색',
    '火': '빨간색',
    '土': '노란색',
    '金': '흰색',
    '水': '검은색',
  };
  return colors[getElement(stem)];
}

/**
 * 행운의 방향 (지지 기반)
 */
function getLuckyDirection(branch: EarthlyBranch): string {
  const directions: Record<EarthlyBranch, string> = {
    '자': '북쪽',
    '축': '북북동',
    '인': '동북동',
    '묘': '동쪽',
    '진': '동남동',
    '사': '남남동',
    '오': '남쪽',
    '미': '남남서',
    '신': '서남서',
    '유': '서쪽',
    '술': '서북서',
    '해': '북북서',
  };
  return directions[branch];
}
