/**
 * 사주 궁합 분석 계산기
 * 두 사람의 사주를 비교하여 궁합 점수 및 상세 분석 제공
 */

// 천간 타입
export type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';

// 지지 타입
export type EarthlyBranch = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';

/**
 * 궁합 분석 결과
 */
export interface CompatibilityResult {
  // 종합 점수 (0-100)
  overallScore: number;

  // 세부 점수
  scores: {
    heavenlyStemScore: number; // 천간 궁합 점수
    earthlyBranchScore: number; // 지지 궁합 점수
    elementScore: number; // 오행 균형 점수
    geokgukScore: number; // 격국 보완성 점수
  };

  // 상세 분석
  analysis: {
    strengths: string[]; // 강점
    weaknesses: string[]; // 약점
    advice: string[]; // 조언
  };

  // 천간 궁합
  heavenlyStemCompatibility: {
    yearStem: StemCompatibility;
    monthStem: StemCompatibility;
    dayStem: StemCompatibility;
    hourStem: StemCompatibility;
  };

  // 지지 궁합
  earthlyBranchCompatibility: {
    yearBranch: BranchCompatibility;
    monthBranch: BranchCompatibility;
    dayBranch: BranchCompatibility;
    hourBranch: BranchCompatibility;
  };

  // 특수 관계
  specialRelations: SpecialRelation[];
}

/**
 * 천간 궁합 상세
 */
interface StemCompatibility {
  person1: HeavenlyStem;
  person2: HeavenlyStem;
  relation: '상생' | '상극' | '합' | '충' | '중립';
  score: number; // 0-25
  description: string;
}

/**
 * 지지 궁합 상세
 */
interface BranchCompatibility {
  person1: EarthlyBranch;
  person2: EarthlyBranch;
  relation: '육합' | '삼합' | '육충' | '삼형' | '육해' | '중립';
  score: number; // 0-25
  description: string;
}

/**
 * 특수 관계
 */
interface SpecialRelation {
  type: '천을귀인' | '도화살' | '역마살' | '원진살' | '귀문관살';
  description: string;
  impact: '긍정' | '부정' | '중립';
}

/**
 * 사주 궁합 계산
 */
export function calculateCompatibility(
  person1Saju: {
    year: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    month: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    day: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    hour: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
  },
  person2Saju: {
    year: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    month: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    day: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
    hour: { heavenlyStem: HeavenlyStem; earthlyBranch: EarthlyBranch };
  }
): CompatibilityResult {
  // 천간 궁합 분석
  const heavenlyStemCompatibility = {
    yearStem: analyzeStemCompatibility(person1Saju.year.heavenlyStem, person2Saju.year.heavenlyStem),
    monthStem: analyzeStemCompatibility(person1Saju.month.heavenlyStem, person2Saju.month.heavenlyStem),
    dayStem: analyzeStemCompatibility(person1Saju.day.heavenlyStem, person2Saju.day.heavenlyStem),
    hourStem: analyzeStemCompatibility(person1Saju.hour.heavenlyStem, person2Saju.hour.heavenlyStem),
  };

  // 지지 궁합 분석
  const earthlyBranchCompatibility = {
    yearBranch: analyzeBranchCompatibility(person1Saju.year.earthlyBranch, person2Saju.year.earthlyBranch),
    monthBranch: analyzeBranchCompatibility(person1Saju.month.earthlyBranch, person2Saju.month.earthlyBranch),
    dayBranch: analyzeBranchCompatibility(person1Saju.day.earthlyBranch, person2Saju.day.earthlyBranch),
    hourBranch: analyzeBranchCompatibility(person1Saju.hour.earthlyBranch, person2Saju.hour.earthlyBranch),
  };

  // 세부 점수 계산
  const heavenlyStemScore = (
    heavenlyStemCompatibility.yearStem.score +
    heavenlyStemCompatibility.monthStem.score +
    heavenlyStemCompatibility.dayStem.score * 1.5 + // 일주가 가장 중요
    heavenlyStemCompatibility.hourStem.score
  ) / 4.5;

  const earthlyBranchScore = (
    earthlyBranchCompatibility.yearBranch.score +
    earthlyBranchCompatibility.monthBranch.score +
    earthlyBranchCompatibility.dayBranch.score * 1.5 + // 일주가 가장 중요
    earthlyBranchCompatibility.hourBranch.score
  ) / 4.5;

  // 오행 균형 점수
  const elementScore = calculateElementBalanceScore(person1Saju, person2Saju);

  // 격국 보완성 점수 (추후 구현)
  const geokgukScore = 75; // 임시값

  // 종합 점수 (가중 평균)
  const overallScore = Math.round(
    heavenlyStemScore * 0.3 +
    earthlyBranchScore * 0.4 +
    elementScore * 0.2 +
    geokgukScore * 0.1
  );

  // 특수 관계 분석
  const specialRelations = analyzeSpecialRelations(person1Saju, person2Saju);

  // 강점/약점/조언 생성
  const analysis = generateAnalysis(
    overallScore,
    heavenlyStemCompatibility,
    earthlyBranchCompatibility,
    specialRelations
  );

  return {
    overallScore,
    scores: {
      heavenlyStemScore: Math.round(heavenlyStemScore),
      earthlyBranchScore: Math.round(earthlyBranchScore),
      elementScore: Math.round(elementScore),
      geokgukScore,
    },
    analysis,
    heavenlyStemCompatibility,
    earthlyBranchCompatibility,
    specialRelations,
  };
}

/**
 * 천간 궁합 분석
 */
function analyzeStemCompatibility(stem1: HeavenlyStem, stem2: HeavenlyStem): StemCompatibility {
  // 천간합 (天干合)
  const stemCombinations: Record<string, string> = {
    '갑-기': '합',
    '을-경': '합',
    '병-신': '합',
    '정-임': '합',
    '무-계': '합',
  };

  const key = [stem1, stem2].sort().join('-');
  const reverseKey = [stem2, stem1].sort().join('-');

  if (stemCombinations[key] === '합' || stemCombinations[reverseKey] === '합') {
    return {
      person1: stem1,
      person2: stem2,
      relation: '합',
      score: 25,
      description: `${stem1}과 ${stem2}는 천간합으로 서로를 보완하며 조화로운 관계입니다.`,
    };
  }

  // 천간충 (天干冲)
  const stemClashes: Record<string, string> = {
    '갑-경': '충',
    '을-신': '충',
    '병-임': '충',
    '정-계': '충',
  };

  if (stemClashes[key] === '충' || stemClashes[reverseKey] === '충') {
    return {
      person1: stem1,
      person2: stem2,
      relation: '충',
      score: 5,
      description: `${stem1}과 ${stem2}는 천간충으로 의견 충돌이 있을 수 있습니다.`,
    };
  }

  // 오행 상생/상극 판단
  const stemElements: Record<HeavenlyStem, string> = {
    '갑': '木', '을': '木',
    '병': '火', '정': '火',
    '무': '土', '기': '土',
    '경': '金', '신': '金',
    '임': '水', '계': '水',
  };

  const element1 = stemElements[stem1];
  const element2 = stemElements[stem2];

  if (isProductive(element1, element2)) {
    return {
      person1: stem1,
      person2: stem2,
      relation: '상생',
      score: 20,
      description: `${stem1}(${element1})이 ${stem2}(${element2})를 생해주는 상생 관계입니다.`,
    };
  }

  if (isDestructive(element1, element2)) {
    return {
      person1: stem1,
      person2: stem2,
      relation: '상극',
      score: 10,
      description: `${stem1}(${element1})이 ${stem2}(${element2})를 극하는 상극 관계입니다.`,
    };
  }

  return {
    person1: stem1,
    person2: stem2,
    relation: '중립',
    score: 15,
    description: `${stem1}과 ${stem2}는 특별한 관계가 없는 중립입니다.`,
  };
}

/**
 * 지지 궁합 분석
 */
function analyzeBranchCompatibility(branch1: EarthlyBranch, branch2: EarthlyBranch): BranchCompatibility {
  // 육합 (六合)
  const liuhe: Record<string, string> = {
    '자-축': '육합',
    '인-해': '육합',
    '묘-술': '육합',
    '진-유': '육합',
    '사-신': '육합',
    '오-미': '육합',
  };

  const key = [branch1, branch2].sort().join('-');

  if (liuhe[key]) {
    return {
      person1: branch1,
      person2: branch2,
      relation: '육합',
      score: 25,
      description: `${branch1}과 ${branch2}는 육합으로 가장 이상적인 궁합입니다.`,
    };
  }

  // 삼합 (三合)
  const sanhe: Record<string, string[]> = {
    '수국': ['신', '자', '진'],
    '목국': ['해', '묘', '미'],
    '화국': ['인', '오', '술'],
    '금국': ['사', '유', '축'],
  };

  for (const [type, branches] of Object.entries(sanhe)) {
    if (branches.includes(branch1) && branches.includes(branch2)) {
      return {
        person1: branch1,
        person2: branch2,
        relation: '삼합',
        score: 22,
        description: `${branch1}과 ${branch2}는 ${type} 삼합으로 강한 결속력을 가집니다.`,
      };
    }
  }

  // 육충 (六冲)
  const liuchong: Record<string, string> = {
    '자-오': '육충',
    '축-미': '육충',
    '인-신': '육충',
    '묘-유': '육충',
    '진-술': '육충',
    '사-해': '육충',
  };

  if (liuchong[key]) {
    return {
      person1: branch1,
      person2: branch2,
      relation: '육충',
      score: 5,
      description: `${branch1}과 ${branch2}는 육충으로 갈등이 있을 수 있습니다.`,
    };
  }

  // 삼형 (三刑)
  const sanxing: Record<string, string[]> = {
    '무은지형': ['인', '사', '신'],
    '무례지형': ['축', '술', '미'],
    '자형': ['자', '묘'],
  };

  for (const [type, branches] of Object.entries(sanxing)) {
    if (branches.includes(branch1) && branches.includes(branch2)) {
      return {
        person1: branch1,
        person2: branch2,
        relation: '삼형',
        score: 8,
        description: `${branch1}과 ${branch2}는 ${type}으로 주의가 필요합니다.`,
      };
    }
  }

  // 육해 (六害)
  const liuhai: Record<string, string> = {
    '자-미': '육해',
    '축-오': '육해',
    '인-사': '육해',
    '묘-진': '육해',
    '신-해': '육해',
    '유-술': '육해',
  };

  if (liuhai[key]) {
    return {
      person1: branch1,
      person2: branch2,
      relation: '육해',
      score: 10,
      description: `${branch1}과 ${branch2}는 육해로 서로 해가 될 수 있습니다.`,
    };
  }

  return {
    person1: branch1,
    person2: branch2,
    relation: '중립',
    score: 15,
    description: `${branch1}과 ${branch2}는 특별한 관계가 없는 중립입니다.`,
  };
}

/**
 * 오행 상생 관계
 */
function isProductive(element1: string, element2: string): boolean {
  const productive: Record<string, string> = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木',
  };
  return productive[element1] === element2;
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
 * 오행 균형 점수 계산
 */
function calculateElementBalanceScore(person1Saju: any, person2Saju: any): number {
  // 간단한 구현: 두 사람의 오행이 서로 보완되는지 확인
  // 추후 더 정교한 알고리즘으로 개선
  return 70; // 임시값
}

/**
 * 특수 관계 분석
 */
function analyzeSpecialRelations(person1Saju: any, person2Saju: any): SpecialRelation[] {
  const relations: SpecialRelation[] = [];

  // 간단한 예시: 도화살 체크
  const doHwa = ['자', '오', '묘', '유'];
  if (
    doHwa.includes(person1Saju.day.earthlyBranch) &&
    doHwa.includes(person2Saju.day.earthlyBranch)
  ) {
    relations.push({
      type: '도화살',
      description: '두 사람 모두 도화살이 있어 강한 끌림이 있을 수 있습니다.',
      impact: '긍정',
    });
  }

  return relations;
}

/**
 * 분석 텍스트 생성
 */
function generateAnalysis(
  overallScore: number,
  stemCompatibility: any,
  branchCompatibility: any,
  specialRelations: SpecialRelation[]
): {
  strengths: string[];
  weaknesses: string[];
  advice: string[];
} {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const advice: string[] = [];

  // 종합 점수에 따른 기본 분석
  if (overallScore >= 80) {
    strengths.push('전반적으로 매우 조화로운 궁합입니다.');
    strengths.push('서로의 장단점을 잘 보완해줍니다.');
    advice.push('현재의 좋은 관계를 계속 유지하세요.');
  } else if (overallScore >= 60) {
    strengths.push('대체로 좋은 궁합입니다.');
    weaknesses.push('일부 충돌 가능성이 있으나 극복 가능합니다.');
    advice.push('서로의 차이를 이해하고 존중하세요.');
  } else if (overallScore >= 40) {
    weaknesses.push('일부 갈등 요소가 있습니다.');
    advice.push('소통을 강화하고 타협점을 찾으세요.');
    advice.push('서로의 성격 차이를 인정하고 받아들이세요.');
  } else {
    weaknesses.push('상당한 갈등 요소가 있습니다.');
    weaknesses.push('서로 다른 성향으로 충돌이 잦을 수 있습니다.');
    advice.push('관계 유지를 위해서는 상당한 노력이 필요합니다.');
    advice.push('전문가의 상담을 받는 것을 추천합니다.');
  }

  // 일주 궁합 특별 분석 (가장 중요)
  const dayStemRelation = stemCompatibility.dayStem.relation;
  const dayBranchRelation = branchCompatibility.dayBranch.relation;

  if (dayStemRelation === '합' || dayBranchRelation === '육합') {
    strengths.push('일주 궁합이 매우 좋아 평생의 인연이 될 수 있습니다.');
  }

  if (dayStemRelation === '충' || dayBranchRelation === '육충') {
    weaknesses.push('일주에 충이 있어 근본적인 가치관 차이가 있을 수 있습니다.');
  }

  // 특수 관계 반영
  for (const relation of specialRelations) {
    if (relation.impact === '긍정') {
      strengths.push(relation.description);
    } else if (relation.impact === '부정') {
      weaknesses.push(relation.description);
    }
  }

  return { strengths, weaknesses, advice };
}
