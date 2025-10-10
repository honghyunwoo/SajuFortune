/**
 * 연애운 상세 분석 시스템
 * 일주(日柱) 기반 연애 성향, 배우자궁 분석, 현재 연애운, 최적 만남 시기 추천
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

export interface LoveFortuneResult {
  overallScore: number; // 0-100
  loveStyle: {
    type: string; // 연애 스타일 타입
    description: string;
    strengths: string[];
    weaknesses: string[];
  };
  spousePalace: {
    quality: string; // 배우자궁 품질 (상/중상/중/중하/하)
    characteristics: string[]; // 배우자 특성
    compatibility: string; // 궁합 성향
  };
  currentFortune: {
    score: number; // 현재 연애운 점수 (0-100)
    status: string; // 상태 (매우 좋음/좋음/보통/나쁨/매우 나쁨)
    opportunities: string[]; // 기회
    challenges: string[]; // 도전 과제
  };
  optimalPeriods: {
    months: number[]; // 최적 만남 시기 (1-12월)
    years: number[]; // 최적 만남 년도 (향후 5년)
    advice: string[]; // 시기별 조언
  };
  advice: {
    dating: string[]; // 연애 조언
    marriage: string[]; // 결혼 조언
    general: string[]; // 일반 조언
  };
}

// 일주별 연애 스타일 매핑
const DAY_PILLAR_LOVE_STYLES: Record<string, {
  type: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}> = {
  // 갑목(甲木) 일주
  '갑자': {
    type: '리더형 연애',
    description: '주도적이고 적극적인 연애를 추구합니다. 상대방을 이끌고 싶어하며 강한 책임감을 가집니다.',
    strengths: ['주도적', '책임감 강함', '보호본능', '결단력'],
    weaknesses: ['독단적일 수 있음', '고집', '상대 의견 무시 가능성'],
  },
  '갑인': {
    type: '성장형 연애',
    description: '함께 성장하고 발전하는 관계를 중요시합니다. 교육적이고 가르치려는 성향이 있습니다.',
    strengths: ['성장 지향', '긍정적', '격려', '발전적'],
    weaknesses: ['가르치려 듦', '간섭', '기대가 높음'],
  },

  // 을목(乙木) 일주
  '을축': {
    type: '배려형 연애',
    description: '상대방을 배려하고 감싸주는 스타일입니다. 부드럽고 섬세한 감정 표현을 합니다.',
    strengths: ['배려심', '섬세함', '감정 풍부', '헌신적'],
    weaknesses: ['우유부단', '눈치', '희생 과다'],
  },
  '을묘': {
    type: '감성형 연애',
    description: '감성적이고 로맨틱한 연애를 추구합니다. 예술적 감각과 심미안이 뛰어납니다.',
    strengths: ['로맨틱', '감성적', '예술적', '섬세함'],
    weaknesses: ['감정 기복', '현실성 부족', '이상주의'],
  },

  // 병화(丙火) 일주
  '병오': {
    type: '열정형 연애',
    description: '뜨겁고 열정적인 연애를 합니다. 밝고 활발하며 사교적입니다.',
    strengths: ['열정적', '적극적', '밝음', '사교적'],
    weaknesses: ['식기 쉬움', '변덕', '지속력 부족'],
  },
  '병진': {
    type: '카리스마형 연애',
    description: '강한 카리스마와 매력으로 상대를 끌어당깁니다. 자신감 넘칩니다.',
    strengths: ['카리스마', '자신감', '매력적', '리더십'],
    weaknesses: ['자기중심적', '독단적', '배려 부족'],
  },

  // 정화(丁火) 일주
  '정사': {
    type: '섬세형 연애',
    description: '섬세하고 다정한 연애 스타일입니다. 상대방의 마음을 잘 읽습니다.',
    strengths: ['섬세함', '다정함', '공감 능력', '세심함'],
    weaknesses: ['질투', '집착', '의심'],
  },
  '정미': {
    type: '온화형 연애',
    description: '따뜻하고 온화한 성격으로 편안한 연애를 합니다.',
    strengths: ['온화함', '따뜻함', '포용력', '안정적'],
    weaknesses: ['소극적', '표현 부족', '수동적'],
  },

  // 무토(戊土) 일주
  '무진': {
    type: '안정형 연애',
    description: '안정적이고 든든한 연애를 추구합니다. 신뢰와 책임을 중요시합니다.',
    strengths: ['안정적', '책임감', '신뢰', '든든함'],
    weaknesses: ['고지식', '융통성 부족', '로맨스 부족'],
  },
  '무오': {
    type: '활동형 연애',
    description: '활동적이고 역동적인 연애를 좋아합니다. 함께 즐기는 것을 중요시합니다.',
    strengths: ['활동적', '적극적', '즐거움', '에너지'],
    weaknesses: ['산만함', '집중력 부족', '변덕'],
  },

  // 기토(己土) 일주
  '기미': {
    type: '헌신형 연애',
    description: '상대방을 위해 헌신하고 희생하는 스타일입니다. 모성애/부성애가 강합니다.',
    strengths: ['헌신적', '희생', '배려', '포용'],
    weaknesses: ['과도한 희생', '자기 희생', '의존'],
  },
  '기유': {
    type: '실속형 연애',
    description: '실속 있고 현실적인 연애를 합니다. 안정과 경제를 중요시합니다.',
    strengths: ['현실적', '실속', '계획적', '안정 추구'],
    weaknesses: ['낭만 부족', '계산적', '냉정'],
  },

  // 경금(庚金) 일주
  '경신': {
    type: '직선형 연애',
    description: '직선적이고 솔직한 연애 스타일입니다. 의리와 정의를 중시합니다.',
    strengths: ['솔직함', '정직', '의리', '강직'],
    weaknesses: ['무뚝뚝', '감정 표현 서툼', '융통성 부족'],
  },
  '경술': {
    type: '보호형 연애',
    description: '상대방을 보호하고 지켜주려는 성향이 강합니다. 책임감이 뛰어납니다.',
    strengths: ['보호 본능', '책임감', '든든함', '안정'],
    weaknesses: ['간섭', '통제', '독단'],
  },

  // 신금(辛金) 일주
  '신유': {
    type: '우아형 연애',
    description: '우아하고 세련된 연애를 추구합니다. 품위와 격식을 중요시합니다.',
    strengths: ['우아함', '세련됨', '품위', '섬세함'],
    weaknesses: ['까다로움', '고집', '완벽주의'],
  },
  '신해': {
    type: '지적형 연애',
    description: '지적이고 깊이 있는 대화를 좋아합니다. 정신적 교감을 중시합니다.',
    strengths: ['지적', '깊이', '사려 깊음', '통찰력'],
    weaknesses: ['냉정', '이성 우선', '감정 표현 부족'],
  },

  // 임수(壬水) 일주
  '임자': {
    type: '자유형 연애',
    description: '자유롭고 구속받지 않는 연애를 선호합니다. 변화와 모험을 즐깁니다.',
    strengths: ['자유로움', '모험적', '개방적', '유연'],
    weaknesses: ['불안정', '변덕', '책임 회피'],
  },
  '임인': {
    type: '이상형 연애',
    description: '이상적이고 꿈 같은 연애를 꿈꿉니다. 낭만과 환상을 좋아합니다.',
    strengths: ['이상적', '낭만적', '꿈', '환상'],
    weaknesses: ['현실성 부족', '실망', '환상 과다'],
  },

  // 계수(癸水) 일주
  '계축': {
    type: '신중형 연애',
    description: '신중하고 조심스러운 연애를 합니다. 깊이 생각하고 결정합니다.',
    strengths: ['신중함', '사려 깊음', '깊이', '진지함'],
    weaknesses: ['소극적', '우유부단', '기회 놓침'],
  },
  '계해': {
    type: '감각형 연애',
    description: '감각적이고 직관적인 연애를 합니다. 분위기와 느낌을 중요시합니다.',
    strengths: ['감각적', '직관적', '분위기', '감성'],
    weaknesses: ['감정 기복', '불안정', '변덕'],
  },
};

// 기본 연애 스타일 (매핑에 없는 경우)
const DEFAULT_LOVE_STYLE = {
  type: '균형형 연애',
  description: '균형 잡힌 연애 스타일을 추구합니다. 상황에 따라 유연하게 대처합니다.',
  strengths: ['균형', '유연성', '적응력', '다양성'],
  weaknesses: ['개성 부족', '특색 없음', '우유부단'],
};

/**
 * 배우자궁 품질 분석
 */
function analyzeSpousePalace(dayPillar: SajuPillar, monthPillar: SajuPillar): {
  quality: string;
  characteristics: string[];
  compatibility: string;
} {
  const dayBranch = dayPillar.earthlyBranch;
  const dayStem = dayPillar.heavenlyStem;

  // 지지별 배우자궁 기본 특성
  const branchCharacteristics: Record<EarthlyBranch, string[]> = {
    '자': ['총명한 배우자', '활동적', '사교적', '지혜로움'],
    '축': ['성실한 배우자', '근면', '신중함', '안정 추구'],
    '인': ['활발한 배우자', '리더십', '적극적', '추진력'],
    '묘': ['섬세한 배우자', '예술적', '감성적', '우아함'],
    '진': ['카리스마 있는 배우자', '자신감', '매력적', '강인함'],
    '사': ['지적인 배우자', '통찰력', '세련됨', '품위'],
    '오': ['열정적인 배우자', '밝음', '낙천적', '활력'],
    '미': ['온화한 배우자', '배려심', '따뜻함', '포용력'],
    '신': ['능력 있는 배우자', '실력', '계획적', '현실적'],
    '유': ['품격 있는 배우자', '우아함', '격식', '세련'],
    '술': ['충실한 배우자', '정직', '신뢰', '책임감'],
    '해': ['순수한 배우자', '진실함', '감각적', '직관적'],
  };

  const characteristics = branchCharacteristics[dayBranch] || ['균형 잡힌 배우자'];

  // 품질 결정 (천간지지 조화)
  const harmony = checkHarmony(dayStem, dayBranch);
  const quality = harmony > 70 ? '상' : harmony > 50 ? '중상' : harmony > 30 ? '중' : harmony > 10 ? '중하' : '하';

  // 궁합 성향
  const compatibilityMap: Record<EarthlyBranch, string> = {
    '자': '활발하고 지적인 상대와 궁합이 좋습니다.',
    '축': '성실하고 안정적인 상대와 궁합이 좋습니다.',
    '인': '적극적이고 밝은 상대와 궁합이 좋습니다.',
    '묘': '예술적이고 감성적인 상대와 궁합이 좋습니다.',
    '진': '강하고 카리스마 있는 상대와 궁합이 좋습니다.',
    '사': '지적이고 세련된 상대와 궁합이 좋습니다.',
    '오': '열정적이고 낙천적인 상대와 궁합이 좋습니다.',
    '미': '온화하고 배려심 있는 상대와 궁합이 좋습니다.',
    '신': '능력 있고 실속 있는 상대와 궁합이 좋습니다.',
    '유': '우아하고 품격 있는 상대와 궁합이 좋습니다.',
    '술': '정직하고 신뢰할 수 있는 상대와 궁합이 좋습니다.',
    '해': '순수하고 감각적인 상대와 궁합이 좋습니다.',
  };

  return {
    quality,
    characteristics,
    compatibility: compatibilityMap[dayBranch] || '균형 잡힌 상대와 궁합이 좋습니다.',
  };
}

/**
 * 천간지지 조화도 계산
 */
function checkHarmony(stem: HeavenlyStem, branch: EarthlyBranch): number {
  // 천간과 지지의 조화를 계산하는 간단한 로직
  // 실제로는 더 복잡한 명리학 규칙 적용 필요
  const harmonies = {
    '갑': ['인', '묘', '해'],
    '을': ['묘', '인', '해'],
    '병': ['사', '오', '인'],
    '정': ['오', '미', '사'],
    '무': ['진', '술', '미', '축'],
    '기': ['미', '축', '진', '술'],
    '경': ['신', '유', '진'],
    '신': ['유', '신', '술'],
    '임': ['자', '해', '신'],
    '계': ['해', '자', '축'],
  };

  const matchingBranches = harmonies[stem] || [];
  if (matchingBranches.includes(branch)) {
    return 80;
  }
  return 50;
}

/**
 * 현재 연애운 분석 (월운/일운 기반)
 */
function analyzeCurrentFortune(
  dayPillar: SajuPillar,
  monthPillar: SajuPillar,
  currentMonth: number
): {
  score: number;
  status: string;
  opportunities: string[];
  challenges: string[];
} {
  // 간단한 점수 계산 (실제로는 월운/일운 세밀 분석 필요)
  let score = 60; // 기본 점수

  // 월지와 일지 관계 분석
  const monthBranch = monthPillar.earthlyBranch;
  const dayBranch = dayPillar.earthlyBranch;

  // 육합/삼합 관계면 점수 상승
  if (isHexagram(monthBranch, dayBranch)) {
    score += 20;
  } else if (isTriangle(monthBranch, dayBranch)) {
    score += 15;
  }

  // 육충/삼형 관계면 점수 하락
  if (isConflict(monthBranch, dayBranch)) {
    score -= 20;
  } else if (isPunishment(monthBranch, dayBranch)) {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, score));

  const status = score >= 80 ? '매우 좋음' :
                 score >= 60 ? '좋음' :
                 score >= 40 ? '보통' :
                 score >= 20 ? '나쁨' : '매우 나쁨';

  const opportunities = score >= 60
    ? ['새로운 만남의 기회', '관계 발전 가능성', '긍정적인 변화']
    : ['인내심 필요', '자기 개발 시기', '내면 성장'];

  const challenges = score < 60
    ? ['오해 가능성', '감정 기복 주의', '소통 노력 필요']
    : ['과도한 기대 자제', '현실적 접근', '균형 유지'];

  return { score, status, opportunities, challenges };
}

/**
 * 육합 관계 확인
 */
function isHexagram(branch1: EarthlyBranch, branch2: EarthlyBranch): boolean {
  const hexagrams = [
    ['자', '축'], ['인', '해'], ['묘', '술'],
    ['진', '유'], ['사', '신'], ['오', '미'],
  ];
  return hexagrams.some(pair =>
    (pair[0] === branch1 && pair[1] === branch2) ||
    (pair[0] === branch2 && pair[1] === branch1)
  );
}

/**
 * 삼합 관계 확인
 */
function isTriangle(branch1: EarthlyBranch, branch2: EarthlyBranch): boolean {
  const triangles = [
    ['인', '오', '술'], // 화국
    ['신', '자', '진'], // 수국
    ['해', '묘', '미'], // 목국
    ['사', '유', '축'], // 금국
  ];
  return triangles.some(trio =>
    trio.includes(branch1) && trio.includes(branch2)
  );
}

/**
 * 육충 관계 확인
 */
function isConflict(branch1: EarthlyBranch, branch2: EarthlyBranch): boolean {
  const conflicts = [
    ['자', '오'], ['축', '미'], ['인', '신'],
    ['묘', '유'], ['진', '술'], ['사', '해'],
  ];
  return conflicts.some(pair =>
    (pair[0] === branch1 && pair[1] === branch2) ||
    (pair[0] === branch2 && pair[1] === branch1)
  );
}

/**
 * 삼형 관계 확인
 */
function isPunishment(branch1: EarthlyBranch, branch2: EarthlyBranch): boolean {
  const punishments = [
    ['인', '사', '신'],
    ['축', '술', '미'],
    ['자', '묘'],
  ];
  return punishments.some(group =>
    group.includes(branch1) && group.includes(branch2)
  );
}

/**
 * 최적 만남 시기 추천
 */
function findOptimalPeriods(dayPillar: SajuPillar, currentYear: number): {
  months: number[];
  years: number[];
  advice: string[];
} {
  const dayBranch = dayPillar.earthlyBranch;

  // 육합/삼합 월 찾기
  const optimalMonths: number[] = [];
  const branchToMonth: Record<EarthlyBranch, number> = {
    '자': 11, '축': 12, '인': 1, '묘': 2, '진': 3, '사': 4,
    '오': 5, '미': 6, '신': 7, '유': 8, '술': 9, '해': 10,
  };

  // 육합 월
  const hexagramPairs = [
    ['자', '축'], ['인', '해'], ['묘', '술'],
    ['진', '유'], ['사', '신'], ['오', '미'],
  ];

  for (const pair of hexagramPairs) {
    if (pair.includes(dayBranch)) {
      const otherBranch = pair[0] === dayBranch ? pair[1] : pair[0];
      optimalMonths.push(branchToMonth[otherBranch as EarthlyBranch]);
    }
  }

  // 삼합 월
  const triangles = [
    ['인', '오', '술'],
    ['신', '자', '진'],
    ['해', '묘', '미'],
    ['사', '유', '축'],
  ];

  for (const trio of triangles) {
    if (trio.includes(dayBranch)) {
      trio.forEach(branch => {
        if (branch !== dayBranch) {
          const month = branchToMonth[branch as EarthlyBranch];
          if (!optimalMonths.includes(month)) {
            optimalMonths.push(month);
          }
        }
      });
    }
  }

  // 향후 5년
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const advice = [
    `${optimalMonths.join(', ')}월에 새로운 만남의 기회가 높습니다.`,
    '육합/삼합 시기를 활용하여 적극적으로 나서보세요.',
    '자신감을 갖고 먼저 다가가는 것이 좋습니다.',
  ];

  return { months: optimalMonths.sort((a, b) => a - b), years, advice };
}

/**
 * 연애 조언 생성
 */
function generateAdvice(
  loveStyle: { type: string; strengths: string[]; weaknesses: string[] },
  spousePalace: { quality: string },
  currentFortune: { score: number }
): {
  dating: string[];
  marriage: string[];
  general: string[];
} {
  const dating: string[] = [];
  const marriage: string[] = [];
  const general: string[] = [];

  // 연애 조언
  if (currentFortune.score >= 70) {
    dating.push('현재 연애운이 매우 좋습니다. 적극적으로 만남을 시도하세요.');
    dating.push('자신의 매력을 자신 있게 표현하세요.');
  } else if (currentFortune.score >= 40) {
    dating.push('안정적인 연애운입니다. 천천히 관계를 발전시키세요.');
    dating.push('서두르지 말고 상대방을 깊이 이해하는 시간을 가지세요.');
  } else {
    dating.push('현재는 자기 개발에 집중하는 시기입니다.');
    dating.push('급하게 관계를 시작하기보다 내면을 가꾸세요.');
  }

  dating.push(`당신의 연애 스타일: ${loveStyle.type} - ${loveStyle.strengths.slice(0, 2).join(', ')}을 활용하세요.`);

  // 결혼 조언
  if (spousePalace.quality === '상' || spousePalace.quality === '중상') {
    marriage.push('배우자궁이 좋습니다. 좋은 배우자를 만날 가능성이 높습니다.');
    marriage.push('결혼 생활도 원만할 것으로 예상됩니다.');
  } else {
    marriage.push('배우자 선택 시 신중함이 필요합니다.');
    marriage.push('서로의 차이를 이해하고 존중하는 자세가 중요합니다.');
  }

  marriage.push('결혼은 타이밍과 준비가 중요합니다. 서두르지 마세요.');

  // 일반 조언
  general.push(`약점 보완: ${loveStyle.weaknesses.slice(0, 2).join(', ')}을 개선하면 더 나은 관계를 만들 수 있습니다.`);
  general.push('상대방의 입장에서 생각하고 배려하는 자세가 중요합니다.');
  general.push('소통과 이해를 바탕으로 관계를 발전시키세요.');

  return { dating, marriage, general };
}

/**
 * 연애운 상세 분석 (메인 함수)
 */
export function analyzeLoveFortune(
  sajuPillars: SajuPillars,
  currentYear: number = new Date().getFullYear(),
  currentMonth: number = new Date().getMonth() + 1
): LoveFortuneResult {
  const dayPillar = sajuPillars.day;
  const monthPillar = sajuPillars.month;

  // 1. 일주 기반 연애 스타일 분석
  const dayPillarKey = dayPillar.heavenlyStem + dayPillar.earthlyBranch;
  const loveStyle = DAY_PILLAR_LOVE_STYLES[dayPillarKey] || DEFAULT_LOVE_STYLE;

  // 2. 배우자궁 분석
  const spousePalace = analyzeSpousePalace(dayPillar, monthPillar);

  // 3. 현재 연애운 분석
  const currentFortune = analyzeCurrentFortune(dayPillar, monthPillar, currentMonth);

  // 4. 최적 만남 시기 추천
  const optimalPeriods = findOptimalPeriods(dayPillar, currentYear);

  // 5. 조언 생성
  const advice = generateAdvice(loveStyle, spousePalace, currentFortune);

  // 6. 종합 점수 계산
  const spouseQualityScore =
    spousePalace.quality === '상' ? 95 :
    spousePalace.quality === '중상' ? 80 :
    spousePalace.quality === '중' ? 65 :
    spousePalace.quality === '중하' ? 45 : 30;

  const overallScore = Math.round(
    currentFortune.score * 0.5 + // 현재운 50%
    spouseQualityScore * 0.3 +    // 배우자궁 30%
    70 * 0.2                       // 기본 점수 20%
  );

  return {
    overallScore,
    loveStyle,
    spousePalace,
    currentFortune,
    optimalPeriods,
    advice,
  };
}
