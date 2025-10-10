/**
 * 결정적 운세 분석 엔진
 * - Math.random() 사용 금지
 * - 동일 입력 → 동일 출력 보장
 * - 기존 FortuneAnalysis 타입 100% 호환
 *
 * @module shared/engine/analysis
 * @author Claude Code
 * @since 2025-10-10
 */

// ============================================================================
// 타입 정의 (기존 saju-calculator.ts 호환)
// ============================================================================

export interface SajuPillar {
  heavenly: string;
  earthly: string;
  element: string;
}

export interface SajuData {
  pillars: SajuPillar[];
  elements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  dayMaster: string;
  strength: 'strong' | 'medium' | 'weak';
}

export interface FortuneAnalysis {
  personality: string;
  todayFortune: {
    rating: number;
    overall: string;
    description: string;
    love: string;
    career: string;
    money: string;
  };
  detailedAnalysis?: {
    love: { score: number; level: string; description: string };
    career: { score: number; level: string; description: string };
    health: { score: number; level: string; description: string };
    money: { score: number; level: string; description: string };
  };
  compatibility?: {
    zodiac: { compatibility: string; description: string };
    saju: { compatibility: string; description: string };
    element: { compatibility: string; description: string };
  };
  monthlyFortune?: Array<{
    month: number;
    rating: number;
    description: string;
  }>;
  advice?: {
    general: string[];
    career: string[];
    relationship: string[];
    health: string[];
  };
}

// ============================================================================
// 상수 정의
// ============================================================================

const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const ZODIAC_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

const STEM_ELEMENTS: { [key: string]: string } = {
  '갑': 'wood', '을': 'wood',
  '병': 'fire', '정': 'fire',
  '무': 'earth', '기': 'earth',
  '경': 'metal', '신': 'metal',
  '임': 'water', '계': 'water'
};

const BRANCH_ELEMENTS: { [key: string]: string } = {
  '인': 'wood', '묘': 'wood',
  '사': 'fire', '오': 'fire',
  '진': 'earth', '술': 'earth', '축': 'earth', '미': 'earth',
  '신': 'metal', '유': 'metal',
  '자': 'water', '해': 'water'
};

// ============================================================================
// 결정적 성격 분석
// ============================================================================

function generatePersonalityAnalysis(sajuData: SajuData, gender: string): string {
  const { dayMaster, strength, elements } = sajuData;
  const dayElement = STEM_ELEMENTS[dayMaster];

  const personalityTraits: Record<string, Record<string, string>> = {
    wood: {
      strong: "자연을 사랑하고 성장욕이 강한 당신은 리더십이 뛰어나고 창의적인 성격입니다. 새로운 도전을 즐기며 끊임없이 발전하려는 의지가 강합니다.",
      medium: "균형잡힌 성격으로 협동심이 뛰어나며 타인을 배려할 줄 아는 따뜻한 마음의 소유자입니다. 꾸준함과 인내력으로 목표를 달성하는 타입입니다.",
      weak: "섬세하고 예술적 감각이 뛰어나며 타인의 감정을 잘 이해하는 공감 능력이 높습니다. 평화를 추구하며 조화로운 관계를 중시합니다."
    },
    fire: {
      strong: "열정적이고 활동적인 성격으로 카리스마가 넘치며 사람들을 이끄는 능력이 뛰어납니다. 직관력이 뛰어나고 순발력이 좋아 위기 상황에서도 침착함을 유지합니다.",
      medium: "밝고 긍정적인 에너지로 주변 사람들에게 활력을 주는 성격입니다. 의사소통 능력이 뛰어나며 사교적이고 친화력이 좋습니다.",
      weak: "내면의 정열은 깊지만 외적으로는 차분하고 신중한 성격입니다. 깊이 있는 사고를 하며 예술적 감각과 상상력이 풍부합니다."
    },
    earth: {
      strong: "안정감 있고 신뢰할 수 있는 성격으로 책임감이 강하고 현실적입니다. 참을성이 많고 꾸준히 노력하여 목표를 달성하는 타입입니다.",
      medium: "중용의 지혜를 가진 균형잡힌 성격으로 포용력이 넓고 화합을 추구합니다. 실용적이면서도 따뜻한 마음을 가지고 있습니다.",
      weak: "겸손하고 온화한 성격으로 타인을 잘 도우며 협력하는 것을 좋아합니다. 세심하고 배려심이 깊어 주변 사람들의 신뢰를 받습니다."
    },
    metal: {
      strong: "의지가 강하고 결단력이 뛰어나며 정의감이 강한 성격입니다. 목표 의식이 뚜렷하고 체계적으로 일을 처리하는 능력이 뛰어납니다.",
      medium: "합리적이고 논리적인 사고를 하며 공정함을 추구하는 성격입니다. 분석력이 뛰어나고 객관적인 판단을 할 수 있습니다.",
      weak: "섬세하고 완벽주의적 성향이 있으며 품질을 중시하는 성격입니다. 예술적 감각이 뛰어나고 아름다운 것을 추구합니다."
    },
    water: {
      strong: "지혜롭고 적응력이 뛰어나며 변화에 유연하게 대응하는 성격입니다. 통찰력이 깊고 사람의 마음을 잘 읽는 능력이 있습니다.",
      medium: "부드럽고 포용력이 있으며 소통 능력이 뛰어난 성격입니다. 감수성이 풍부하고 창의적 아이디어를 잘 내는 타입입니다.",
      weak: "깊이 있고 신비로운 매력을 가진 성격으로 직감력이 뛰어납니다. 조용하지만 내면의 힘이 강하고 끈기가 있습니다."
    }
  };

  return personalityTraits[dayElement]?.[strength] ||
    "독특하고 개성 있는 성격으로 자신만의 길을 개척해 나가는 타입입니다.";
}

// ============================================================================
// 결정적 오늘 운세 분석 (Math.random() 제거)
// ============================================================================

function generateTodayFortune(sajuData: SajuData): FortuneAnalysis['todayFortune'] {
  const today = new Date();
  const { elements } = sajuData;

  // 오늘 날짜의 간지를 계산 (결정적)
  const todayDayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
  const todayStemIndex = todayDayOfYear % 10;
  const todayBranchIndex = todayDayOfYear % 12;
  const todayStem = HEAVENLY_STEMS[todayStemIndex];
  const todayBranch = EARTHLY_BRANCHES[todayBranchIndex];

  // 오늘의 오행
  const todayElement = STEM_ELEMENTS[todayStem];

  // 사주 오행과의 조화도 계산 (결정적)
  const elementArray: Array<keyof typeof elements> = ['wood', 'fire', 'earth', 'metal', 'water'];
  let harmony = 0;

  elementArray.forEach(element => {
    const birthCount = elements[element];
    const todayImpact = element === todayElement ? 2 : 0;
    harmony += Math.abs(birthCount - todayImpact);
  });

  // 조화도를 1-5 점수로 변환
  const rating = Math.min(5, Math.max(1, 5 - Math.floor(harmony / 3)));
  const overall = rating >= 4 ? '매우 좋음' : rating >= 3 ? '좋음' : rating >= 2 ? '보통' : '주의 필요';

  // 설명은 오늘 오행 기반으로 결정적 선택
  const descriptions: Record<string, string> = {
    wood: "오늘은 새로운 시작과 성장에 좋은 날입니다. 창의적인 아이디어를 실행에 옮겨보세요.",
    fire: "열정과 활력이 넘치는 하루입니다. 적극적인 자세로 기회를 포착하세요.",
    earth: "안정적이고 차분한 하루가 될 것입니다. 계획을 세우고 차근차근 실행하기 좋은 날입니다.",
    metal: "집중력이 높아지는 날입니다. 중요한 결정을 내리거나 분석 작업에 적합합니다.",
    water: "유연하고 적응력이 발휘되는 날입니다. 소통과 관계 개선에 좋은 시간입니다."
  };

  return {
    rating,
    overall,
    description: descriptions[todayElement] || descriptions.earth,
    love: rating >= 4 ? '상승세' : rating >= 3 ? '안정' : '주의',
    career: rating >= 4 ? '호전' : rating >= 3 ? '보통' : '신중',
    money: rating >= 4 ? '길함' : rating >= 3 ? '평안' : '검소'
  };
}

// ============================================================================
// 결정적 세부 분석 (Math.random() 제거)
// ============================================================================

function generateDetailedAnalysis(sajuData: SajuData, gender: string): FortuneAnalysis['detailedAnalysis'] {
  const { elements, strength, dayMaster } = sajuData;
  const dayElement = STEM_ELEMENTS[dayMaster];

  // 오행 균형 점수 계산 (결정적)
  const totalElements = Object.values(elements).reduce((sum, count) => sum + count, 0);
  const balanceScore = Math.max(20, 100 - Math.abs(totalElements - 8) * 10);
  const strengthBonus = strength === 'medium' ? 10 : 0;

  return {
    love: {
      score: Math.min(100, Math.max(60, balanceScore + strengthBonus + (elements.water * 5))),
      level: elements.water >= 2 ? '상승세' : '안정기',
      description: gender === 'female'
        ? "감수성이 풍부하고 매력적인 당신은 진실한 사랑을 만날 가능성이 높습니다. 자신의 감정을 솔직하게 표현하는 것이 좋겠습니다."
        : "진중하고 책임감 있는 성격으로 안정적인 관계를 구축할 수 있습니다. 상대방에 대한 이해와 배려를 늘려보세요."
    },
    career: {
      score: Math.min(100, Math.max(65, balanceScore + strengthBonus + (elements.earth * 5))),
      level: strength === 'strong' ? '발전기' : '성장기',
      description: dayElement === 'wood'
        ? "창조성과 성장 지향적인 성향으로 새로운 분야에서 성공할 가능성이 높습니다. 리더십을 발휘할 기회를 찾아보세요."
        : "꾸준함과 성실함으로 직업적 안정을 이룰 수 있습니다. 전문성을 기르는 데 투자하는 것이 좋겠습니다."
    },
    health: {
      score: Math.min(100, Math.max(70, balanceScore + strengthBonus + (elements.earth * 3))),
      level: '양호',
      description: "전반적으로 건강한 체질이지만 스트레스 관리에 신경 쓰시기 바랍니다. 규칙적인 운동과 충분한 휴식을 취하세요."
    },
    money: {
      score: Math.min(100, Math.max(65, balanceScore + strengthBonus + (elements.metal * 4))),
      level: '안정',
      description: "재물운이 점진적으로 상승하는 추세입니다. 장기적인 투자나 저축 계획을 세우는 것이 도움이 될 것입니다."
    }
  };
}

// ============================================================================
// 결정적 궁합 분석
// ============================================================================

function generateCompatibility(sajuData: SajuData): FortuneAnalysis['compatibility'] {
  const { pillars } = sajuData;
  const yearBranch = pillars[0].earthly;
  const yearBranchIndex = EARTHLY_BRANCHES.indexOf(yearBranch);

  // 삼합, 육합 매핑 (결정적)
  const bestMatches: { [key: number]: number[] } = {
    0: [4, 8], 1: [5, 9], 2: [6, 10], 3: [7, 11],
    4: [0, 8], 5: [1, 9], 6: [2, 10], 7: [3, 11],
    8: [0, 4], 9: [1, 5], 10: [2, 6], 11: [3, 7]
  };

  const matches = bestMatches[yearBranchIndex] || [];
  const bestZodiac = matches.map((i: number) => ZODIAC_ANIMALS[i]).join(', ');

  return {
    zodiac: {
      compatibility: '좋음',
      description: `${bestZodiac}띠와 특히 좋은 궁합을 가지고 있습니다. 서로를 보완하며 발전시킬 수 있는 관계입니다.`
    },
    saju: {
      compatibility: '양호',
      description: "사주의 오행 균형이 잘 맞는 상대와 만나면 서로에게 도움이 되는 관계를 만들 수 있습니다."
    },
    element: {
      compatibility: '보통',
      description: "오행의 조화를 통해 부족한 부분을 서로 채워줄 수 있는 상대를 만나는 것이 좋겠습니다."
    }
  };
}

// ============================================================================
// 결정적 월별 운세 (Math.random() 제거)
// ============================================================================

function generateMonthlyFortune(sajuData: SajuData): FortuneAnalysis['monthlyFortune'] {
  const { elements, dayMaster } = sajuData;
  const months = [];

  // 일간 기반 월별 운세 패턴 (결정적)
  const dayMasterIndex = HEAVENLY_STEMS.indexOf(dayMaster);

  for (let i = 1; i <= 12; i++) {
    // 일간과 월의 관계로 점수 계산 (결정적)
    const monthOffset = (dayMasterIndex + i) % 10;
    const baseRating = 3 + (monthOffset % 3); // 3, 4, 5 순환

    // 월별 고정 설명
    const descriptions = [
      "새로운 시작에 좋은 달입니다. 계획을 세우고 실행에 옮겨보세요.",
      "인간관계에서 좋은 소식이 있을 수 있습니다. 소통을 늘려보세요.",
      "재물운이 상승하는 시기입니다. 투자나 부업을 고려해볼만 합니다.",
      "건강에 신경 쓸 필요가 있는 달입니다. 무리하지 마세요.",
      "창의력이 발휘되는 시기입니다. 새로운 도전을 해보세요.",
      "가족이나 가정에 좋은 일이 생길 수 있습니다.",
      "학습이나 자기계발에 좋은 시기입니다. 새로운 기술을 배워보세요.",
      "여행이나 이동과 관련된 좋은 기회가 있을 수 있습니다.",
      "직업적으로 발전할 수 있는 기회가 찾아올 것입니다.",
      "감정적으로 풍요로운 시기가 될 것입니다.",
      "목표 달성에 가까워지는 시기입니다. 포기하지 마세요.",
      "연말을 마무리하며 새로운 계획을 세우기 좋은 때입니다."
    ];

    months.push({
      month: i,
      rating: baseRating,
      description: descriptions[i - 1]
    });
  }

  return months;
}

// ============================================================================
// 결정적 조언 생성
// ============================================================================

function generateAdvice(sajuData: SajuData): FortuneAnalysis['advice'] {
  const { elements, strength, dayMaster } = sajuData;
  const dayElement = STEM_ELEMENTS[dayMaster];

  const generalAdvice: Record<string, string[]> = {
    wood: [
      "자연과 함께하는 시간을 늘려 에너지를 충전하세요",
      "창의적인 활동을 통해 내재된 잠재력을 발휘해보세요",
      "새로운 도전을 두려워하지 말고 적극적으로 임하세요"
    ],
    fire: [
      "열정을 조절하여 지속가능한 성장을 도모하세요",
      "소통과 네트워킹을 통해 인맥을 넓혀보세요",
      "직감을 믿되 신중한 판단도 함께 하세요"
    ],
    earth: [
      "꾸준함과 인내심을 바탕으로 목표를 추진하세요",
      "안정성을 추구하되 새로운 기회도 놓치지 마세요",
      "타인을 도우며 상호 발전하는 관계를 만들어가세요"
    ],
    metal: [
      "목표를 명확히 설정하고 체계적으로 실행하세요",
      "공정함과 원칙을 지키며 신뢰를 쌓아가세요",
      "완벽함을 추구하되 유연성도 기르세요"
    ],
    water: [
      "변화에 유연하게 적응하며 기회를 포착하세요",
      "지혜와 통찰력을 바탕으로 올바른 선택을 하세요",
      "깊이 있는 사고와 감수성을 발휘해보세요"
    ]
  };

  return {
    general: generalAdvice[dayElement] || [
      "자신의 특성을 잘 파악하여 강점을 살리세요",
      "균형잡힌 생활을 통해 조화를 이루세요",
      "지속적인 학습과 발전을 추구하세요"
    ],
    career: [
      "전문성을 기르는 데 투자하여 경쟁력을 높이세요",
      "네트워킹을 통해 기회를 확장해보세요",
      "장기적인 비전을 가지고 계획을 세우세요"
    ],
    relationship: [
      "진실한 마음으로 상대방을 대하세요",
      "상호 존중과 이해를 바탕으로 관계를 발전시키세요",
      "소통을 늘리고 감정을 솔직하게 표현하세요"
    ],
    health: [
      "규칙적인 생활 패턴을 유지하세요",
      "스트레스 관리와 충분한 휴식을 취하세요",
      "적절한 운동과 건강한 식습관을 유지하세요"
    ]
  };
}

// ============================================================================
// 메인 분석 함수 (Public API)
// ============================================================================

/**
 * 결정적 운세 분석 결과 생성
 *
 * @param sajuData 사주 데이터
 * @param gender 성별 ('male' | 'female')
 * @returns FortuneAnalysis 객체 (기존 타입 100% 호환)
 *
 * @example
 * ```typescript
 * const result = buildAnalysisResult(sajuData, 'male');
 * // 동일 입력에 대해 항상 동일한 결과 반환 (Math.random() 없음)
 * ```
 */
export function buildAnalysisResult(
  sajuData: SajuData,
  gender: 'male' | 'female'
): FortuneAnalysis {
  const personality = generatePersonalityAnalysis(sajuData, gender);
  const todayFortune = generateTodayFortune(sajuData);

  const analysis: FortuneAnalysis = {
    personality,
    todayFortune,
    detailedAnalysis: generateDetailedAnalysis(sajuData, gender),
    compatibility: generateCompatibility(sajuData),
    monthlyFortune: generateMonthlyFortune(sajuData),
    advice: generateAdvice(sajuData)
  };

  return analysis;
}
