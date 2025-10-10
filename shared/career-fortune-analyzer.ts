/**
 * 직업운 상세 분석 시스템
 * 적성 직업군 추천, 관성(官星) 분석, 승진/이직 적기, 사업 운세
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

export interface CareerFortuneResult {
  overallScore: number; // 0-100
  suitableCareers: {
    primary: string[]; // 최적 직업군
    secondary: string[]; // 부적합 직업군
    strengths: string[];
    considerations: string[];
  };
  officialStar: {
    type: '정관' | '편관' | '혼재' | '없음'; // 관성 타입
    strength: number; // 관성 강도 (0-100)
    description: string;
    implications: string[];
  };
  promotionTiming: {
    nearFuture: string; // 단기 (1-2년)
    midTerm: string; // 중기 (3-5년)
    advice: string[];
  };
  jobChangeTiming: {
    optimal: number[]; // 최적 이직 월
    caution: number[]; // 이직 주의 월
    advice: string[];
  };
  businessFortune: {
    suitability: number; // 사업 적성 (0-100)
    type: string; // 추천 사업 유형
    timing: string; // 사업 시작 적기
    risks: string[];
    advice: string[];
  };
  workStyle: {
    type: string; // 업무 스타일 타입
    strengths: string[];
    weaknesses: string[];
    teamRole: string; // 팀 내 역할
  };
  generalAdvice: string[];
}

/**
 * 적성 직업군 분석
 */
function analyzeSuitableCareers(sajuPillars: SajuPillars): {
  primary: string[];
  secondary: string[];
  strengths: string[];
  considerations: string[];
} {
  const dayStem = sajuPillars.day.heavenlyStem;
  const dayBranch = sajuPillars.day.earthlyBranch;

  // 천간별 직업 성향
  const stemCareers: Record<HeavenlyStem, {
    primary: string[];
    secondary: string[];
    strengths: string[];
  }> = {
    '갑': {
      primary: ['경영/관리직', '리더십 직무', '교육/강사', '컨설턴트'],
      secondary: ['단순 사무직', '반복 업무', '보조 업무'],
      strengths: ['리더십', '추진력', '기획력', '통솔력'],
    },
    '을': {
      primary: ['예술/디자인', '상담/심리', '교육', '문화/컨텐츠'],
      secondary: ['강압적 업무', '과도한 경쟁', '단순 노동'],
      strengths: ['창의력', '공감 능력', '섬세함', '예술적 감각'],
    },
    '병': {
      primary: ['영업/마케팅', '홍보/PR', '연예/방송', '강사/발표'],
      secondary: ['뒷받침 업무', '은둔형 업무', '반복 작업'],
      strengths: ['소통력', '발표력', '열정', '사교성'],
    },
    '정': {
      primary: ['교육', '상담', '간호/의료', '서비스업'],
      secondary: ['강압적 환경', '과도한 경쟁', '단독 업무'],
      strengths: ['공감 능력', '세심함', '친절', '인내심'],
    },
    '무': {
      primary: ['부동산', '건설/토목', '관리/운영', '농업/임업'],
      secondary: ['빠른 변화 업무', '유행 업무', '창의적 업무'],
      strengths: ['안정성', '신뢰성', '지구력', '실속'],
    },
    '기': {
      primary: ['서비스업', '요식업', '농업', '복지/돌봄'],
      secondary: ['리더십 역할', '경쟁 업무', '변화 빠른 업무'],
      strengths: ['헌신', '배려', '섬김', '포용력'],
    },
    '경': {
      primary: ['법률/법무', '군인/경찰', '금융', '기술/엔지니어'],
      secondary: ['예술 업무', '감성 업무', '유연성 필요 업무'],
      strengths: ['정직', '원칙', '실행력', '기술력'],
    },
    '신': {
      primary: ['예술/공예', '패션/뷰티', '금융/재테크', '상담'],
      secondary: ['거친 업무', '단순 노동', '비정규직'],
      strengths: ['심미안', '정밀함', '세련됨', '분석력'],
    },
    '임': {
      primary: ['무역/국제', '여행/관광', '연구/학문', '정보/IT'],
      secondary: ['고정적 업무', '반복 업무', '제한적 환경'],
      strengths: ['적응력', '유연성', '학습 능력', '글로벌 마인드'],
    },
    '계': {
      primary: ['연구/개발', '예술/문화', '상담/치료', '정보/분석'],
      secondary: ['리더십 역할', '강압적 환경', '시끄러운 환경'],
      strengths: ['통찰력', '직관', '분석력', '창의력'],
    },
  };

  const career = stemCareers[dayStem];

  const considerations = [
    '적성과 흥미를 고려한 선택이 중요합니다.',
    '장기적 성장 가능성을 고려하세요.',
    '일과 삶의 균형을 유지할 수 있는 환경을 선택하세요.',
  ];

  return {
    ...career,
    considerations,
  };
}

/**
 * 관성(官星) 분석
 * 일간을 극하는 오행이 관성
 */
function analyzeOfficialStar(sajuPillars: SajuPillars): {
  type: '정관' | '편관' | '혼재' | '없음';
  strength: number;
  description: string;
  implications: string[];
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

  // 일간을 극하는 오행 (관성)
  const officialElement: Record<string, string> = {
    '목': '금', // 금극목
    '화': '수', // 수극화
    '토': '목', // 목극토
    '금': '화', // 화극금
    '수': '토', // 토극수
  };

  const dayElement = stemElement[dayStem];
  const targetOfficialElement = officialElement[dayElement];

  // 음양 구분
  const yangStems = ['갑', '병', '무', '경', '임'];
  const isDayYang = yangStems.includes(dayStem);

  // 관성 카운트
  let positiveOfficial = 0; // 정관
  let partialOfficial = 0;  // 편관(칠살)

  const allStems = [
    sajuPillars.year.heavenlyStem,
    sajuPillars.month.heavenlyStem,
    sajuPillars.day.heavenlyStem,
    sajuPillars.hour.heavenlyStem,
  ];

  for (const stem of allStems) {
    const element = stemElement[stem];
    if (element === targetOfficialElement) {
      const isStemYang = yangStems.includes(stem);
      if (isDayYang !== isStemYang) {
        positiveOfficial++; // 다른 음양 = 정관
      } else {
        partialOfficial++; // 같은 음양 = 편관
      }
    }
  }

  // 타입 결정
  let type: '정관' | '편관' | '혼재' | '없음';
  if (positiveOfficial === 0 && partialOfficial === 0) {
    type = '없음';
  } else if (positiveOfficial > partialOfficial) {
    type = '정관';
  } else if (partialOfficial > positiveOfficial) {
    type = '편관';
  } else {
    type = '혼재';
  }

  // 강도 계산
  const totalOfficial = positiveOfficial + partialOfficial;
  const strength = Math.min(100, totalOfficial * 30 + 40);

  // 설명 및 의미
  const descriptions = {
    '정관': {
      description: '정관은 안정적인 직장, 공식적인 권위, 질서를 의미합니다.',
      implications: [
        '직장 생활에 적합하며 승진 기회가 있습니다.',
        '공무원, 대기업, 안정적 조직에서 능력 발휘',
        '질서와 규칙을 중시하는 환경에서 성공',
        '명예와 사회적 지위를 얻을 수 있습니다.',
      ],
    },
    '편관': {
      description: '편관(칠살)은 도전, 경쟁, 자유로운 환경을 의미합니다.',
      implications: [
        '자영업, 프리랜서, 창업에 적합합니다.',
        '경쟁과 도전이 있는 환경에서 능력 발휘',
        '고정된 틀보다는 유연한 환경 선호',
        '강한 추진력과 실행력을 가집니다.',
      ],
    },
    '혼재': {
      description: '정관과 편관이 혼재되어 직장과 사업을 병행할 수 있습니다.',
      implications: [
        '직장 생활과 부업/사업 병행 가능',
        '안정성과 도전을 모두 추구',
        '다양한 커리어 경로 탐색',
        '유연한 직업 선택이 유리합니다.',
      ],
    },
    '없음': {
      description: '관성이 없어 조직 생활보다는 자유로운 환경이 적합합니다.',
      implications: [
        '자유 직업, 예술, 전문직에 적합',
        '상사나 규칙에 얽매이기 싫어함',
        '자기 주도적 커리어 개발 필요',
        '창의성과 독립성을 발휘하는 분야 추천',
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
 * 승진 타이밍 분석
 */
function analyzePromotionTiming(
  officialStar: { type: '정관' | '편관' | '혼재' | '없음'; strength: number },
  currentYear: number
): {
  nearFuture: string;
  midTerm: string;
  advice: string[];
} {
  let nearFuture = '';
  let midTerm = '';
  const advice: string[] = [];

  if (officialStar.strength >= 70) {
    nearFuture = `${currentYear}-${currentYear + 1}년에 승진 기회가 높습니다.`;
    midTerm = `${currentYear + 2}-${currentYear + 4}년에도 지속적인 성장이 예상됩니다.`;
    advice.push('관성이 강하므로 승진 기회를 적극 활용하세요.');
    advice.push('리더십과 관리 능력을 발휘할 기회를 찾으세요.');
  } else if (officialStar.strength >= 40) {
    nearFuture = `${currentYear + 1}-${currentYear + 2}년에 승진 기회가 있을 수 있습니다.`;
    midTerm = `${currentYear + 3}-${currentYear + 5}년에 더 좋은 기회가 올 수 있습니다.`;
    advice.push('꾸준한 자기 개발로 역량을 강화하세요.');
    advice.push('네트워킹과 인간관계 관리에 신경 쓰세요.');
  } else {
    nearFuture = '단기적으로는 자기 개발과 역량 강화에 집중하세요.';
    midTerm = `${currentYear + 3}년 이후 기회가 올 수 있으나 노력이 필요합니다.`;
    advice.push('승진보다는 전문성 향상에 집중하세요.');
    advice.push('이직이나 다른 경로를 고려해볼 수 있습니다.');
  }

  advice.push('실력과 성과가 가장 중요한 기반입니다.');
  advice.push('상사 및 동료와의 원만한 관계 유지가 중요합니다.');

  return { nearFuture, midTerm, advice };
}

/**
 * 이직 타이밍 분석
 */
function analyzeJobChangeTiming(currentMonth: number): {
  optimal: number[];
  caution: number[];
  advice: string[];
} {
  // 일반적으로 봄(3-5월), 가을(9-11월)이 이직 적기
  const optimal = [3, 4, 5, 9, 10, 11];
  const caution = [1, 2, 7, 8, 12]; // 연초, 여름, 연말

  const advice = [
    '이직은 충분한 준비와 계획이 필요합니다.',
    '현재 직장의 장단점을 명확히 파악하세요.',
    '새 직장의 문화와 조건을 철저히 조사하세요.',
    '감정적 판단보다는 이성적 분석에 기반하세요.',
    '이직 후 적응 기간을 고려하여 여유를 두세요.',
  ];

  return { optimal, caution, advice };
}

/**
 * 사업 운세 분석
 */
function analyzeBusinessFortune(
  officialStar: { type: '정관' | '편관' | '혼재' | '없음'; strength: number },
  dayStem: HeavenlyStem,
  currentYear: number
): {
  suitability: number;
  type: string;
  timing: string;
  risks: string[];
  advice: string[];
} {
  let suitability = 50; // 기본 적성

  // 편관이 강하면 사업 적성 상승
  if (officialStar.type === '편관') {
    suitability += 30;
  } else if (officialStar.type === '혼재') {
    suitability += 15;
  } else if (officialStar.type === '정관') {
    suitability -= 15; // 직장 생활이 더 적합
  }

  // 일간별 사업 적성 보정
  const businessProneStem = ['병', '임', '갑', '경'];
  if (businessProneStem.includes(dayStem)) {
    suitability += 20;
  }

  suitability = Math.max(0, Math.min(100, suitability));

  // 추천 사업 유형
  const businessTypes: Record<HeavenlyStem, string> = {
    '갑': '컨설팅, 교육, 대형 사업',
    '을': '예술, 디자인, 소규모 창업',
    '병': '마케팅, 영업, 유통업',
    '정': '교육, 서비스업, 요식업',
    '무': '부동산, 건설, 안정적 사업',
    '기': '요식업, 서비스업, 농업',
    '경': '금융, 기술, 제조업',
    '신': '예술, 패션, 뷰티',
    '임': '무역, 여행, IT',
    '계': '연구, 컨설팅, 정보업',
  };

  const type = businessTypes[dayStem];

  // 사업 시작 적기
  const timing = suitability >= 70
    ? `${currentYear}-${currentYear + 1}년에 시작하기 좋습니다.`
    : suitability >= 50
    ? `${currentYear + 1}-${currentYear + 2}년에 준비를 마치고 시작하세요.`
    : `당분간은 준비 기간이 필요하며, ${currentYear + 3}년 이후 고려하세요.`;

  // 리스크
  const risks = [
    '초기 자금 부족과 현금 흐름 관리',
    '시장 조사 부족으로 인한 실패',
    '과도한 확장과 무리한 투자',
    '경쟁 심화와 시장 변화',
  ];

  // 조언
  const advice = [
    '철저한 사업 계획과 시장 조사가 필수입니다.',
    '충분한 자금 확보와 여유 자금 준비가 중요합니다.',
    '작게 시작하여 점진적으로 확장하세요.',
    '전문가 자문과 멘토링을 적극 활용하세요.',
    '리스크 관리와 비상 계획을 수립하세요.',
  ];

  return { suitability, type, timing, risks, advice };
}

/**
 * 업무 스타일 분석
 */
function analyzeWorkStyle(dayStem: HeavenlyStem): {
  type: string;
  strengths: string[];
  weaknesses: string[];
  teamRole: string;
} {
  const workStyles: Record<HeavenlyStem, {
    type: string;
    strengths: string[];
    weaknesses: string[];
    teamRole: string;
  }> = {
    '갑': {
      type: '주도적 리더형',
      strengths: ['기획력', '추진력', '결단력', '통솔력'],
      weaknesses: ['독단적', '고집', '협업 부족'],
      teamRole: '팀장, 프로젝트 리더',
    },
    '을': {
      type: '협력적 서포터형',
      strengths: ['공감 능력', '협업', '세심함', '창의력'],
      weaknesses: ['우유부단', '소극적', '결정력 부족'],
      teamRole: '팀원, 조정자',
    },
    '병': {
      type: '열정적 커뮤니케이터형',
      strengths: ['소통력', '발표력', '열정', '추진력'],
      weaknesses: ['지속력 부족', '변덕', '감정 기복'],
      teamRole: '영업, 대외 업무 담당',
    },
    '정': {
      type: '섬세한 실무자형',
      strengths: ['세심함', '꼼꼼함', '친절', '인내심'],
      weaknesses: ['소극적', '스트레스 약함', '느림'],
      teamRole: '실무 담당, 지원 업무',
    },
    '무': {
      type: '안정적 관리자형',
      strengths: ['신뢰성', '책임감', '지구력', '관리 능력'],
      weaknesses: ['융통성 부족', '변화 거부', '고지식'],
      teamRole: '관리자, 운영 담당',
    },
    '기': {
      type: '헌신적 지원자형',
      strengths: ['헌신', '배려', '협력', '서비스 정신'],
      weaknesses: ['자기주장 약함', '희생 과다', '수동적'],
      teamRole: '지원 업무, 서비스 담당',
    },
    '경': {
      type: '원칙적 실행자형',
      strengths: ['정직', '원칙', '실행력', '기술력'],
      weaknesses: ['융통성 부족', '감정 표현 서툼', '고집'],
      teamRole: '기술 담당, 실행 책임자',
    },
    '신': {
      type: '세련된 전문가형',
      strengths: ['정밀함', '분석력', '심미안', '전문성'],
      weaknesses: ['완벽주의', '까다로움', '비판적'],
      teamRole: '전문가, 품질 관리',
    },
    '임': {
      type: '유연한 탐험가형',
      strengths: ['적응력', '학습 능력', '유연성', '글로벌 마인드'],
      weaknesses: ['불안정', '집중력 부족', '책임 회피'],
      teamRole: '신규 사업, 혁신 담당',
    },
    '계': {
      type: '통찰력 있는 분석가형',
      strengths: ['통찰력', '분석력', '직관', '창의력'],
      weaknesses: ['소극적', '이상주의', '현실성 부족'],
      teamRole: '연구, 기획 담당',
    },
  };

  return workStyles[dayStem];
}

/**
 * 일반 직업운 조언
 */
function generateGeneralAdvice(
  officialStar: { type: '정관' | '편관' | '혼재' | '없음'; strength: number },
  workStyle: { type: string }
): string[] {
  const advice: string[] = [];

  advice.push('자신의 강점을 파악하고 최대한 활용하세요.');
  advice.push('약점은 인정하고 보완하려는 노력이 필요합니다.');
  advice.push('지속적인 학습과 자기 개발이 커리어 성장의 열쇠입니다.');
  advice.push('네트워킹과 인간관계 관리를 소홀히 하지 마세요.');
  advice.push('장기적 커리어 목표를 설정하고 단계적으로 실행하세요.');
  advice.push('일과 삶의 균형을 유지하며 건강을 챙기세요.');
  advice.push('변화를 두려워하지 말고 필요한 도전을 하세요.');

  return advice;
}

/**
 * 직업운 상세 분석 (메인 함수)
 */
export function analyzeCareerFortune(
  sajuPillars: SajuPillars,
  currentYear: number = new Date().getFullYear(),
  currentMonth: number = new Date().getMonth() + 1
): CareerFortuneResult {
  // 1. 적성 직업군 분석
  const suitableCareers = analyzeSuitableCareers(sajuPillars);

  // 2. 관성 분석
  const officialStar = analyzeOfficialStar(sajuPillars);

  // 3. 승진 타이밍
  const promotionTiming = analyzePromotionTiming(officialStar, currentYear);

  // 4. 이직 타이밍
  const jobChangeTiming = analyzeJobChangeTiming(currentMonth);

  // 5. 사업 운세
  const businessFortune = analyzeBusinessFortune(
    officialStar,
    sajuPillars.day.heavenlyStem,
    currentYear
  );

  // 6. 업무 스타일
  const workStyle = analyzeWorkStyle(sajuPillars.day.heavenlyStem);

  // 7. 일반 조언
  const generalAdvice = generateGeneralAdvice(officialStar, workStyle);

  // 8. 종합 점수 계산
  const overallScore = Math.round(
    officialStar.strength * 0.4 +       // 관성 강도 40%
    businessFortune.suitability * 0.3 + // 사업 적성 30%
    70 * 0.3                             // 기본 점수 30%
  );

  return {
    overallScore,
    suitableCareers,
    officialStar,
    promotionTiming,
    jobChangeTiming,
    businessFortune,
    workStyle,
    generalAdvice,
  };
}
