/**
 * 건강운 상세 분석 시스템
 * 오행 균형 건강 분석, 취약 장기 및 주의사항, 계절별 건강 관리법, 건강 주의 시기
 */

export type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';
export type EarthlyBranch = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';

export interface SajuPillar {
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
}

export interface SajuPillars {
  year: SajuPillar;
  month: SajuPillar;
  day: SajuPillar;
  hour: SajuPillar;
}

export interface HealthFortuneResult {
  overallScore: number; // 0-100
  elementBalance: {
    wood: number; // 목 (0-100)
    fire: number; // 화 (0-100)
    earth: number; // 토 (0-100)
    metal: number; // 금 (0-100)
    water: number; // 수 (0-100)
    analysis: string;
    balanceScore: number; // 균형도 (0-100)
  };
  vulnerableOrgans: {
    primary: string[]; // 주요 취약 장기
    secondary: string[]; // 부차 취약 장기
    warnings: string[];
    preventions: string[];
  };
  seasonalCare: {
    spring: string[]; // 봄 건강 관리
    summer: string[]; // 여름 건강 관리
    autumn: string[]; // 가을 건강 관리
    winter: string[]; // 겨울 건강 관리
  };
  riskPeriods: {
    months: number[]; // 건강 주의 월
    warnings: string[];
    advice: string[];
  };
  lifestyle: {
    diet: string[]; // 식습관 조언
    exercise: string[]; // 운동 조언
    sleep: string[]; // 수면 조언
    stress: string[]; // 스트레스 관리
  };
  generalAdvice: string[];
}

/**
 * 오행 균형 분석
 */
function analyzeElementBalance(sajuPillars: SajuPillars): {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  analysis: string;
  balanceScore: number;
} {
  // 천간 오행 매핑
  const stemElement: Record<HeavenlyStem, string> = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수',
  };

  // 지지 오행 매핑
  const branchElement: Record<EarthlyBranch, string> = {
    '인': '목', '묘': '목',
    '사': '화', '오': '화',
    '진': '토', '술': '토', '축': '토', '미': '토',
    '신': '금', '유': '금',
    '자': '수', '해': '수',
  };

  const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  // 천간 카운트 (각 20점)
  const stems = [
    sajuPillars.year.heavenlyStem,
    sajuPillars.month.heavenlyStem,
    sajuPillars.day.heavenlyStem,
    sajuPillars.hour.heavenlyStem,
  ];

  for (const stem of stems) {
    elements[stemElement[stem] as keyof typeof elements] += 20;
  }

  // 지지 카운트 (각 15점)
  const branches = [
    sajuPillars.year.earthlyBranch,
    sajuPillars.month.earthlyBranch,
    sajuPillars.day.earthlyBranch,
    sajuPillars.hour.earthlyBranch,
  ];

  for (const branch of branches) {
    elements[branchElement[branch] as keyof typeof elements] += 15;
  }

  // 정규화 (0-100)
  const maxScore = Math.max(...Object.values(elements));
  const wood = Math.round((elements['목'] / maxScore) * 100);
  const fire = Math.round((elements['화'] / maxScore) * 100);
  const earth = Math.round((elements['토'] / maxScore) * 100);
  const metal = Math.round((elements['금'] / maxScore) * 100);
  const water = Math.round((elements['수'] / maxScore) * 100);

  // 균형도 계산 (표준편차의 역수)
  const scores = [wood, fire, earth, metal, water];
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  const balanceScore = Math.max(0, Math.min(100, 100 - stdDev));

  // 분석 텍스트
  let analysis = '';
  if (balanceScore >= 70) {
    analysis = '오행이 매우 균형 잡혀 있어 전반적인 건강이 양호합니다.';
  } else if (balanceScore >= 50) {
    analysis = '오행이 대체로 균형 잡혀 있으나 일부 보완이 필요합니다.';
  } else {
    analysis = '오행의 불균형이 있어 건강 관리에 주의가 필요합니다.';
  }

  const dominant = Object.entries({ 목: wood, 화: fire, 토: earth, 금: metal, 수: water })
    .sort((a, b) => b[1] - a[1])[0][0];

  const weak = Object.entries({ 목: wood, 화: fire, 토: earth, 금: metal, 수: water })
    .sort((a, b) => a[1] - b[1])[0][0];

  analysis += ` ${dominant}이(가) 강하고 ${weak}이(가) 약합니다.`;

  return { wood, fire, earth, metal, water, analysis, balanceScore };
}

/**
 * 취약 장기 분석
 */
function analyzeVulnerableOrgans(elementBalance: {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}): {
  primary: string[];
  secondary: string[];
  warnings: string[];
  preventions: string[];
} {
  // 오행별 장기 매핑
  const organMap = {
    목: { organ: '간/담', systems: '신경계, 근육, 눈' },
    화: { organ: '심장/소장', systems: '혈액순환계, 혈관' },
    토: { organ: '비장/위', systems: '소화기계, 면역계' },
    금: { organ: '폐/대장', systems: '호흡기계, 피부' },
    수: { organ: '신장/방광', systems: '비뇨기계, 생식기계' },
  };

  const scores = {
    목: elementBalance.wood,
    화: elementBalance.fire,
    토: elementBalance.earth,
    금: elementBalance.metal,
    수: elementBalance.water,
  };

  // 가장 약한 오행 2개 (취약 장기)
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const weakest = sorted.slice(0, 2);
  const primary = weakest.map(([element]) => organMap[element as keyof typeof organMap].organ);
  const secondary = weakest.map(([element]) => organMap[element as keyof typeof organMap].systems);

  // 경고 및 예방법
  const warnings: string[] = [];
  const preventions: string[] = [];

  weakest.forEach(([element]) => {
    const elem = element as keyof typeof organMap;
    switch (elem) {
      case '목':
        warnings.push('간 기능 저하, 눈의 피로, 스트레스성 질환');
        preventions.push('충분한 휴식, 눈 건강 관리, 스트레스 해소');
        break;
      case '화':
        warnings.push('심혈관 질환, 고혈압, 불면증');
        preventions.push('심장 건강 체크, 혈압 관리, 수면 패턴 개선');
        break;
      case '토':
        warnings.push('소화불량, 위장 장애, 면역력 저하');
        preventions.push('규칙적인 식사, 소화 잘 되는 음식, 면역력 강화');
        break;
      case '금':
        warnings.push('호흡기 질환, 피부 트러블, 알레르기');
        preventions.push('환기와 공기 질 관리, 피부 보습, 알레르기 관리');
        break;
      case '수':
        warnings.push('신장 기능 저하, 요로 감염, 부종');
        preventions.push('충분한 수분 섭취, 신장 건강 체크, 염분 조절');
        break;
    }
  });

  return { primary, secondary, warnings, preventions };
}

/**
 * 계절별 건강 관리법
 */
function generateSeasonalCare(
  dayStem: HeavenlyStem,
  vulnerableOrgans: { primary: string[] }
): {
  spring: string[];
  summer: string[];
  autumn: string[];
  winter: string[];
} {
  // 일간 오행
  const stemElement: Record<HeavenlyStem, string> = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수',
  };

  const dayElement = stemElement[dayStem];

  const baseCare = {
    spring: [
      '봄철은 간 건강에 유의하세요.',
      '신선한 봄나물과 녹색 채소를 섭취하세요.',
      '스트레칭과 가벼운 운동으로 몸을 풀어주세요.',
    ],
    summer: [
      '여름철은 심장 건강과 수분 섭취가 중요합니다.',
      '과도한 열기를 피하고 시원한 환경을 유지하세요.',
      '충분한 수분 섭취와 열사병 예방에 주의하세요.',
    ],
    autumn: [
      '가을철은 호흡기 건강과 피부 보습이 중요합니다.',
      '환절기 감기 예방을 위해 면역력을 강화하세요.',
      '건조한 날씨에 충분한 수분 섭취를 하세요.',
    ],
    winter: [
      '겨울철은 신장 건강과 체온 유지가 중요합니다.',
      '따뜻한 음식과 충분한 보온에 신경 쓰세요.',
      '실내 습도를 적절히 유지하세요.',
    ],
  };

  // 일간 오행에 따른 특화 조언
  if (dayElement === '목') {
    baseCare.spring.push('특히 봄철에 간 해독에 신경 쓰세요.');
  } else if (dayElement === '화') {
    baseCare.summer.push('여름철 심장에 무리가 가지 않도록 주의하세요.');
  } else if (dayElement === '토') {
    baseCare.spring.push('환절기에 소화기 관리를 철저히 하세요.');
    baseCare.autumn.push('가을철 소화 기능 강화에 집중하세요.');
  } else if (dayElement === '금') {
    baseCare.autumn.push('가을철은 폐 건강에 특히 유의하세요.');
  } else if (dayElement === '수') {
    baseCare.winter.push('겨울철 신장 건강 관리에 집중하세요.');
  }

  return baseCare;
}

/**
 * 건강 주의 시기 분석
 */
function analyzeRiskPeriods(
  elementBalance: { wood: number; fire: number; earth: number; metal: number; water: number }
): {
  months: number[];
  warnings: string[];
  advice: string[];
} {
  // 가장 약한 오행 찾기
  const scores = {
    목: elementBalance.wood,
    화: elementBalance.fire,
    토: elementBalance.earth,
    금: elementBalance.metal,
    수: elementBalance.water,
  };

  const weakest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];

  // 오행별 취약 계절/월
  const riskMonths: Record<string, number[]> = {
    목: [7, 8, 9], // 금왕(금극목) 계절인 가을
    화: [10, 11, 12], // 수왕(수극화) 계절인 겨울
    토: [1, 2, 3], // 목왕(목극토) 계절인 봄
    금: [4, 5, 6], // 화왕(화극금) 계절인 여름
    수: [3, 6, 9, 12], // 토왕(토극수) 계절인 환절기
  };

  const months = riskMonths[weakest as keyof typeof riskMonths] || [];

  const warnings = [
    `${weakest} 기운이 약하여 ${months.join(', ')}월에 건강 관리에 특히 주의가 필요합니다.`,
    '계절 변화에 따른 건강 체크를 정기적으로 하세요.',
    '피로가 누적되지 않도록 충분한 휴식을 취하세요.',
  ];

  const advice = [
    '주의 시기 전에 미리 건강검진을 받으세요.',
    '면역력 강화와 충분한 영양 섭취에 신경 쓰세요.',
    '규칙적인 생활 패턴과 충분한 수면을 유지하세요.',
    '스트레스 관리와 긍정적인 마인드를 유지하세요.',
  ];

  return { months, warnings, advice };
}

/**
 * 생활 습관 조언 생성
 */
function generateLifestyleAdvice(
  elementBalance: { wood: number; fire: number; earth: number; metal: number; water: number },
  vulnerableOrgans: { primary: string[] }
): {
  diet: string[];
  exercise: string[];
  sleep: string[];
  stress: string[];
} {
  const diet: string[] = [];
  const exercise: string[] = [];
  const sleep: string[] = [];
  const stress: string[] = [];

  // 취약 장기에 따른 식습관 조언
  if (vulnerableOrgans.primary.some(organ => organ.includes('간'))) {
    diet.push('간 건강에 좋은 브로콜리, 당근, 녹차를 섭취하세요.');
    diet.push('과도한 음주와 기름진 음식은 피하세요.');
  }
  if (vulnerableOrgans.primary.some(organ => organ.includes('심장'))) {
    diet.push('오메가-3가 풍부한 생선과 견과류를 섭취하세요.');
    diet.push('나트륨과 포화지방 섭취를 줄이세요.');
  }
  if (vulnerableOrgans.primary.some(organ => organ.includes('비장') || organ.includes('위'))) {
    diet.push('소화가 잘 되는 따뜻한 음식을 섭취하세요.');
    diet.push('과식을 피하고 규칙적으로 식사하세요.');
  }
  if (vulnerableOrgans.primary.some(organ => organ.includes('폐'))) {
    diet.push('폐 건강에 좋은 배, 도라지, 무를 섭취하세요.');
    diet.push('충분한 수분 섭취로 기관지를 촉촉하게 유지하세요.');
  }
  if (vulnerableOrgans.primary.some(organ => organ.includes('신장'))) {
    diet.push('신장 건강에 좋은 검은콩, 검은깨를 섭취하세요.');
    diet.push('염분 섭취를 줄이고 충분한 수분을 섭취하세요.');
  }

  // 공통 식습관 조언
  diet.push('균형 잡힌 영양 섭취와 신선한 식재료를 사용하세요.');
  diet.push('과식보다는 적당량을 여러 번 나누어 드세요.');

  // 운동 조언
  exercise.push('주 3-4회, 하루 30분 이상의 유산소 운동을 하세요.');
  exercise.push('근력 운동과 스트레칭을 병행하여 균형 잡힌 체력을 유지하세요.');
  exercise.push('과도한 운동보다는 꾸준한 운동이 중요합니다.');
  exercise.push('자신의 체력 수준에 맞는 운동 강도를 선택하세요.');

  // 수면 조언
  sleep.push('하루 7-8시간의 충분한 수면을 취하세요.');
  sleep.push('규칙적인 수면 시간을 유지하여 생체 리듬을 안정시키세요.');
  sleep.push('잠들기 전 전자기기 사용을 줄이고 편안한 환경을 조성하세요.');
  sleep.push('낮잠은 20-30분 이내로 제한하세요.');

  // 스트레스 관리 조언
  stress.push('명상, 요가, 호흡법 등으로 스트레스를 해소하세요.');
  stress.push('취미 활동과 사회적 교류로 긍정적인 에너지를 얻으세요.');
  stress.push('완벽주의를 버리고 자신을 있는 그대로 받아들이세요.');
  stress.push('필요시 전문가의 상담을 받는 것도 좋습니다.');

  return { diet, exercise, sleep, stress };
}

/**
 * 일반 건강 조언 생성
 */
function generateGeneralAdvice(balanceScore: number): string[] {
  const advice: string[] = [];

  if (balanceScore >= 70) {
    advice.push('전반적인 건강 상태가 양호합니다. 현재의 건강 습관을 유지하세요.');
  } else if (balanceScore >= 50) {
    advice.push('건강 상태는 양호하나 일부 개선이 필요합니다.');
  } else {
    advice.push('건강 관리에 더 많은 관심과 노력이 필요합니다.');
  }

  advice.push('정기적인 건강검진으로 조기에 질병을 발견하고 예방하세요.');
  advice.push('균형 잡힌 생활 습관(식사, 운동, 수면)이 건강의 기본입니다.');
  advice.push('스트레스 관리와 긍정적인 마음가짐을 유지하세요.');
  advice.push('몸의 신호에 귀 기울이고 이상 증상 시 즉시 병원을 방문하세요.');
  advice.push('예방이 치료보다 중요합니다. 건강한 습관을 지금부터 실천하세요.');

  return advice;
}

/**
 * 건강운 상세 분석 (메인 함수)
 */
export function analyzeHealthFortune(sajuPillars: SajuPillars): HealthFortuneResult {
  // 1. 오행 균형 분석
  const elementBalance = analyzeElementBalance(sajuPillars);

  // 2. 취약 장기 분석
  const vulnerableOrgans = analyzeVulnerableOrgans(elementBalance);

  // 3. 계절별 건강 관리법
  const seasonalCare = generateSeasonalCare(sajuPillars.day.heavenlyStem, vulnerableOrgans);

  // 4. 건강 주의 시기
  const riskPeriods = analyzeRiskPeriods(elementBalance);

  // 5. 생활 습관 조언
  const lifestyle = generateLifestyleAdvice(elementBalance, vulnerableOrgans);

  // 6. 일반 조언
  const generalAdvice = generateGeneralAdvice(elementBalance.balanceScore);

  // 7. 종합 점수 계산
  const overallScore = Math.round(elementBalance.balanceScore);

  return {
    overallScore,
    elementBalance,
    vulnerableOrgans,
    seasonalCare,
    riskPeriods,
    lifestyle,
    generalAdvice,
  };
}
