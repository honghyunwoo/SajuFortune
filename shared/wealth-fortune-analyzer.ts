/**
 * 재물운 상세 분석 시스템
 * 재성(財星) 분석, 재물 획득 방식 (정재/편재), 투자 성향, 재물운 상승 시기
 *
 * 이론적 근거:
 * - 재성(財星) 분석: 자평진전 재성론, 적천수 재기(財氣)편
 * - 정재(正財): 정직한 노력의 재물, 월급/고정수입
 * - 편재(偏財): 투기적 재물, 사업/투자 수익
 * - 투자 성향: 명리정종 재성론 - 재성 강약에 따른 투자 성향 결정
 * - 재물운 시기: 오행 상생상극 원리 (재성 오행이 강해지는 시기)
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

export interface WealthFortuneResult {
  overallScore: number; // 0-100
  wealthStar: {
    type: '정재' | '편재' | '혼재' | '없음'; // 재성 타입
    strength: number; // 재성 강도 (0-100)
    description: string;
    characteristics: string[];
  };
  acquisitionMethod: {
    primary: string; // 주 재물 획득 방식
    secondary: string; // 부 재물 획득 방식
    strengths: string[];
    warnings: string[];
  };
  investmentStyle: {
    type: string; // 투자 성향 타입
    riskLevel: '높음' | '중간' | '낮음';
    suitableInvestments: string[];
    unsuitableInvestments: string[];
    advice: string[];
  };
  currentFortune: {
    score: number; // 현재 재물운 (0-100)
    status: string;
    opportunities: string[];
    risks: string[];
  };
  peakPeriods: {
    months: number[]; // 재물운 상승 월
    years: number[]; // 재물운 상승 년
    advice: string[];
  };
  generalAdvice: string[];
}

/**
 * 재성(財星) 분석
 * 일간을 극하는 오행이 재성
 */
function analyzeWealthStar(sajuPillars: SajuPillars): {
  type: '정재' | '편재' | '혼재' | '없음';
  strength: number;
  description: string;
  characteristics: string[];
} {
  const dayStem = sajuPillars.day.heavenlyStem;

  // 오행 매핑
  const stemElement: Record<HeavenlyStem, string> = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수',
  };

  // 일간 극하는 오행 (재성)
  const wealthElement: Record<string, string> = {
    '목': '토', // 목극토
    '화': '금', // 화극금
    '토': '수', // 토극수
    '금': '목', // 금극목
    '수': '화', // 수극화
  };

  const dayElement = stemElement[dayStem];
  const targetWealthElement = wealthElement[dayElement];

  // 음양 구분
  const yangStems = ['갑', '병', '무', '경', '임'];
  const isDayYang = yangStems.includes(dayStem);

  // 재성 카운트
  let positiveWealth = 0; // 정재
  let partialWealth = 0;  // 편재

  const allStems = [
    sajuPillars.year.heavenlyStem,
    sajuPillars.month.heavenlyStem,
    sajuPillars.day.heavenlyStem,
    sajuPillars.hour.heavenlyStem,
  ];

  for (const stem of allStems) {
    const element = stemElement[stem];
    if (element === targetWealthElement) {
      const isStemYang = yangStems.includes(stem);
      if (isDayYang === isStemYang) {
        partialWealth++; // 같은 음양 = 편재
      } else {
        positiveWealth++; // 다른 음양 = 정재
      }
    }
  }

  // 타입 결정
  let type: '정재' | '편재' | '혼재' | '없음';
  if (positiveWealth === 0 && partialWealth === 0) {
    type = '없음';
  } else if (positiveWealth > partialWealth) {
    type = '정재';
  } else if (partialWealth > positiveWealth) {
    type = '편재';
  } else {
    type = '혼재';
  }

  // 강도 계산
  const totalWealth = positiveWealth + partialWealth;
  const strength = Math.min(100, totalWealth * 30 + 40);

  // 설명 및 특성
  const descriptions = {
    '정재': {
      description: '정재는 정직한 노동과 근면으로 얻는 재물입니다. 안정적이고 지속적인 수입을 의미합니다.',
      characteristics: [
        '월급, 고정 수입에 강함',
        '정직하고 성실한 재물 획득',
        '안정적이고 예측 가능한 재운',
        '저축과 절약에 능함',
      ],
    },
    '편재': {
      description: '편재는 재능과 기회로 얻는 재물입니다. 변동성이 있지만 큰 수익의 가능성이 있습니다.',
      characteristics: [
        '사업, 투자 수익에 강함',
        '기회 포착 능력 뛰어남',
        '변동성 있는 수입',
        '큰 돈을 벌 가능성',
      ],
    },
    '혼재': {
      description: '정재와 편재가 혼재되어 있어 다양한 수입원을 가질 수 있습니다.',
      characteristics: [
        '월급 + 사업/투자 병행',
        '다양한 수입원',
        '안정성과 기회의 균형',
        '유연한 재물 관리',
      ],
    },
    '없음': {
      description: '사주에 재성이 드러나지 않아 재물운이 약합니다. 노력을 통해 보완해야 합니다.',
      characteristics: [
        '재물운이 약한 편',
        '노력이 많이 필요함',
        '재테크 학습 필수',
        '절약과 관리가 중요',
      ],
    },
  };

  return {
    type,
    strength,
    ...descriptions[type],
  };
}

/**
 * 재물 획득 방식 분석
 */
function analyzeAcquisitionMethod(wealthStar: {
  type: '정재' | '편재' | '혼재' | '없음';
  strength: number;
}): {
  primary: string;
  secondary: string;
  strengths: string[];
  warnings: string[];
} {
  const methods = {
    '정재': {
      primary: '근로 소득 (월급, 고정 수입)',
      secondary: '장기 저축, 연금, 부동산 임대',
      strengths: [
        '안정적인 현금 흐름 확보',
        '예측 가능한 재무 계획',
        '리스크가 낮은 재테크',
      ],
      warnings: [
        '큰 수익을 기대하기 어려움',
        '인플레이션 대응 필요',
        '수입원 다각화 고려',
      ],
    },
    '편재': {
      primary: '사업 소득, 투자 수익',
      secondary: '프리랜서, 부업, 주식/코인',
      strengths: [
        '큰 수익의 기회',
        '기회 포착 능력',
        '창의적 재물 창출',
      ],
      warnings: [
        '변동성과 리스크 관리 필수',
        '과도한 투자 경계',
        '안정성 확보 필요',
      ],
    },
    '혼재': {
      primary: '월급 + 사업/투자 병행',
      secondary: '다양한 수입원 확보',
      strengths: [
        '안정성과 기회의 조화',
        '수입원 다각화',
        '리스크 분산',
      ],
      warnings: [
        '에너지 분산 주의',
        '집중력 저하 가능',
        '우선순위 설정 필요',
      ],
    },
    '없음': {
      primary: '근면 성실한 노동',
      secondary: '절약과 저축',
      strengths: [
        '노력으로 극복 가능',
        '금전 관리 능력 향상',
        '자기 계발 기회',
      ],
      warnings: [
        '쉽게 돈이 모이지 않음',
        '과소비 절대 금물',
        '재테크 학습 필수',
      ],
    },
  };

  return methods[wealthStar.type];
}

/**
 * 투자 성향 분석
 *
 * 투자 성향 결정 로직:
 * 1. 기본 리스크는 일간(日干)의 오행 성향에서 결정
 * 2. 재성 타입과 강도에 따라 조정
 *
 * 조정 규칙 (출처: 명리정종 재성론):
 * - 편재 + 강도 높음(>70): 리스크 상향 (중간→높음, 낮음→중간)
 * - 편재 + 강도 중간(40-70): 한 단계 상향 가능
 * - 정재 + 강도 높음(>70): 리스크 하향 (높음→중간, 중간→낮음)
 * - 정재 + 강도 중간(40-70): 한 단계 하향
 * - 혼재 + 강도 높음(>60): 중간으로 수렴 (안정성과 기회 균형)
 * - 없음: 리스크 하향 (보수적 접근 권장)
 */
function analyzeInvestmentStyle(
  wealthStar: { type: '정재' | '편재' | '혼재' | '없음'; strength: number },
  dayStem: HeavenlyStem
): {
  type: string;
  riskLevel: '높음' | '중간' | '낮음';
  suitableInvestments: string[];
  unsuitableInvestments: string[];
  advice: string[];
} {
  // 일간 기반 기본 투자 성향
  // 양간(陽干)은 적극적, 음간(陰干)은 보수적 성향
  // 화/수 오행은 변동성, 토 오행은 안정성 추구
  const stemRisk: Record<HeavenlyStem, '높음' | '중간' | '낮음'> = {
    '갑': '중간', '을': '낮음',  // 목: 성장 추구, 을목은 유연하여 보수적
    '병': '높음', '정': '중간',  // 화: 열정적, 병화는 적극적
    '무': '낮음', '기': '낮음',  // 토: 안정 추구
    '경': '중간', '신': '중간',  // 금: 실리적
    '임': '높음', '계': '중간',  // 수: 유동적, 임수는 큰 물로 적극적
  };

  let riskLevel = stemRisk[dayStem];

  // 재성 타입과 강도에 따른 리스크 조정
  if (wealthStar.type === '편재') {
    // 편재(偏財): 투기성 재물, 강하면 적극적 투자 성향
    if (wealthStar.strength > 70) {
      // 매우 강한 편재: 리스크 한 단계 상향
      if (riskLevel === '낮음') riskLevel = '중간';
      else if (riskLevel === '중간') riskLevel = '높음';
    } else if (wealthStar.strength >= 50) {
      // 중간 편재: 낮음→중간만 상향
      if (riskLevel === '낮음') riskLevel = '중간';
    }
    // 약한 편재(<50): 변화 없음
  } else if (wealthStar.type === '정재') {
    // 정재(正財): 정직한 재물, 안정적 투자 선호
    if (wealthStar.strength > 70) {
      // 매우 강한 정재: 리스크 한 단계 하향
      if (riskLevel === '높음') riskLevel = '중간';
      else if (riskLevel === '중간') riskLevel = '낮음';
    } else if (wealthStar.strength >= 50) {
      // 중간 정재: 높음→중간만 하향
      if (riskLevel === '높음') riskLevel = '중간';
    }
    // 약한 정재(<50): 변화 없음
  } else if (wealthStar.type === '혼재') {
    // 혼재: 정재+편재, 균형 잡힌 접근
    if (wealthStar.strength > 60) {
      // 강한 혼재: 중간으로 수렴
      riskLevel = '중간';
    }
    // 약한 혼재: 기존 성향 유지
  } else if (wealthStar.type === '없음') {
    // 재성 없음: 보수적 접근 권장
    // 재물운이 약하므로 공격적 투자는 위험
    if (riskLevel === '높음') riskLevel = '중간';
    else riskLevel = '낮음';
  }

  const styles = {
    '높음': {
      type: '적극적 투자형',
      suitableInvestments: ['주식 직접 투자', '코인/가상자산', '스타트업 투자', '선물/옵션'],
      unsuitableInvestments: ['예금', '채권', '연금보험', '적금'],
      advice: [
        '고수익 고위험 투자에 적합하나 분산 투자 필수',
        '시장 공부와 리서치 철저히',
        '손절 기준 명확히 설정',
        '투자 금액은 여유 자금으로만',
      ],
    },
    '중간': {
      type: '균형 투자형',
      suitableInvestments: ['ETF', '인덱스 펀드', '배당주', '리츠(REITs)', '혼합형 펀드'],
      unsuitableInvestments: ['고위험 파생상품', '레버리지 상품'],
      advice: [
        '안정성과 수익성의 균형 추구',
        '포트폴리오 분산으로 리스크 관리',
        '장기 투자 원칙 유지',
        '시장 변동에 침착하게 대응',
      ],
    },
    '낮음': {
      type: '안정 추구형',
      suitableInvestments: ['예금', '국채', '회사채', '연금보험', 'CMA/MMF', '부동산'],
      unsuitableInvestments: ['주식 직접 투자', '코인', '선물', '고위험 펀드'],
      advice: [
        '원금 보장 상품 위주로 투자',
        '장기 저축과 복리 효과 활용',
        '부동산 등 실물 자산 고려',
        '무리한 투자 지양',
      ],
    },
  };

  return {
    ...styles[riskLevel],
    riskLevel,
  };
}

/**
 * 현재 재물운 분석
 */
function analyzeCurrentFortune(
  wealthStar: { strength: number },
  currentMonth: number
): {
  score: number;
  status: string;
  opportunities: string[];
  risks: string[];
} {
  // 기본 점수는 재성 강도 기반
  let score = wealthStar.strength;

  // 월별 변동 (간단한 사이클)
  const monthBonus = [5, -5, 10, 0, 5, -10, 0, 10, -5, 5, 0, -5];
  score += monthBonus[currentMonth - 1] || 0;

  score = Math.max(0, Math.min(100, score));

  const status =
    score >= 80 ? '매우 좋음' :
    score >= 60 ? '좋음' :
    score >= 40 ? '보통' :
    score >= 20 ? '나쁨' : '매우 나쁨';

  const opportunities =
    score >= 60
      ? ['수입 증가 기회', '투자 수익 가능', '보너스/인센티브 기대']
      : ['절약으로 자산 증대', '재테크 학습 기회', '장기 계획 수립'];

  const risks =
    score < 60
      ? ['예상치 못한 지출', '투자 손실 위험', '과소비 주의']
      : ['과도한 자신감 경계', '리스크 관리 필요', '계획적 소비'];

  return { score, status, opportunities, risks };
}

/**
 * 재물운 상승 시기 찾기
 */
function findPeakPeriods(
  dayStem: HeavenlyStem,
  currentYear: number
): {
  months: number[];
  years: number[];
  advice: string[];
} {
  // 재성이 강해지는 월 (일간 오행 기반)
  const stemElement: Record<HeavenlyStem, string> = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수',
  };

  const wealthElement: Record<string, string> = {
    '목': '토',
    '화': '금',
    '토': '수',
    '금': '목',
    '수': '화',
  };

  const elementToMonths: Record<string, number[]> = {
    '목': [1, 2], // 인묘월 (봄)
    '화': [4, 5], // 사오월 (여름)
    '토': [3, 6, 9, 12], // 진술축미월
    '금': [7, 8], // 신유월 (가을)
    '수': [10, 11], // 해자월 (겨울)
  };

  const dayElement = stemElement[dayStem];
  const targetElement = wealthElement[dayElement];
  const months = elementToMonths[targetElement] || [1, 6, 9, 12];

  // 향후 5년
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const advice = [
    `${months.join(', ')}월에 재물운이 상승합니다.`,
    '이 시기에 투자나 사업 확장을 고려하세요.',
    '재물운 상승기에도 신중하고 계획적인 행동이 중요합니다.',
  ];

  return { months, years, advice };
}

/**
 * 일반 재물운 조언 생성
 */
function generateGeneralAdvice(
  wealthStar: { type: '정재' | '편재' | '혼재' | '없음'; strength: number },
  investmentStyle: { riskLevel: '높음' | '중간' | '낮음' }
): string[] {
  const advice: string[] = [];

  // 재성 타입별 조언
  if (wealthStar.type === '정재') {
    advice.push('안정적인 수입원 유지가 가장 중요합니다.');
    advice.push('장기 저축과 복리 효과를 활용하세요.');
    advice.push('부동산 등 실물 자산 투자를 고려하세요.');
  } else if (wealthStar.type === '편재') {
    advice.push('기회를 놓치지 말되, 리스크 관리는 철저히 하세요.');
    advice.push('다양한 수입원을 확보하는 것이 유리합니다.');
    advice.push('시장 동향과 트렌드를 항상 주시하세요.');
  } else if (wealthStar.type === '혼재') {
    advice.push('주 수입원은 안정적으로 유지하고, 여유 자금으로 투자하세요.');
    advice.push('포트폴리오를 다각화하여 리스크를 분산하세요.');
  } else {
    advice.push('재물운이 약하므로 절약과 저축이 매우 중요합니다.');
    advice.push('재테크 공부를 통해 금융 지식을 쌓으세요.');
    advice.push('과소비를 절대 피하고 계획적으로 소비하세요.');
  }

  // 리스크 레벨별 조언
  if (investmentStyle.riskLevel === '높음') {
    advice.push('투자 시 반드시 분산 투자 원칙을 지키세요.');
    advice.push('감정적 판단을 피하고 분석에 기반한 투자를 하세요.');
  } else if (investmentStyle.riskLevel === '낮음') {
    advice.push('안전한 자산에 꾸준히 투자하여 복리 효과를 누리세요.');
    advice.push('급한 수익을 기대하지 말고 장기적 관점을 유지하세요.');
  }

  // 공통 조언
  advice.push('정기적인 재무 점검과 계획 수정이 필요합니다.');
  advice.push('빚은 최소화하고, 꼭 필요한 경우에만 활용하세요.');

  return advice;
}

/**
 * 재물운 상세 분석 (메인 함수)
 */
export function analyzeWealthFortune(
  sajuPillars: SajuPillars,
  currentYear: number = new Date().getFullYear(),
  currentMonth: number = new Date().getMonth() + 1
): WealthFortuneResult {
  // 1. 재성 분석
  const wealthStar = analyzeWealthStar(sajuPillars);

  // 2. 재물 획득 방식 분석
  const acquisitionMethod = analyzeAcquisitionMethod(wealthStar);

  // 3. 투자 성향 분석
  const investmentStyle = analyzeInvestmentStyle(wealthStar, sajuPillars.day.heavenlyStem);

  // 4. 현재 재물운 분석
  const currentFortune = analyzeCurrentFortune(wealthStar, currentMonth);

  // 5. 재물운 상승 시기 찾기
  const peakPeriods = findPeakPeriods(sajuPillars.day.heavenlyStem, currentYear);

  // 6. 일반 조언 생성
  const generalAdvice = generateGeneralAdvice(wealthStar, investmentStyle);

  // 7. 종합 점수 계산
  const overallScore = Math.round(
    wealthStar.strength * 0.4 +       // 재성 강도 40%
    currentFortune.score * 0.4 +      // 현재 운 40%
    (investmentStyle.riskLevel === '중간' ? 20 : 10) // 균형 보너스 20%
  );

  return {
    overallScore,
    wealthStar,
    acquisitionMethod,
    investmentStyle,
    currentFortune,
    peakPeriods,
    generalAdvice,
  };
}
