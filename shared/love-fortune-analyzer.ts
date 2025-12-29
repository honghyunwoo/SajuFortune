/**
 * 연애운 상세 분석 시스템
 * 일주(日柱) 기반 연애 성향, 배우자궁 분석, 현재 연애운, 최적 만남 시기 추천
 *
 * 이론적 근거:
 * - 일주 연애 스타일: 명리정종 일주론, 적천수 논명(論命) 기준
 * - 배우자궁 분석: 자평진전 배우자궁론 (일지가 배우자궁)
 * - 육합/삼합/육충/삼형: 전통 명리학 지지 관계론
 *
 * 60갑자 일주별 연애 스타일:
 * - 갑목(甲木): 리더십, 적극성, 주도적 성향
 * - 을목(乙木): 배려, 섬세함, 유연성
 * - 병화(丙火): 열정, 카리스마, 사교성
 * - 정화(丁火): 섬세함, 온화함, 지적 감성
 * - 무토(戊土): 안정감, 포용력, 추진력
 * - 기토(己土): 헌신, 배려, 실속
 * - 경금(庚金): 직선적, 강직함, 리더십
 * - 신금(辛金): 우아함, 세련됨, 품격
 * - 임수(壬水): 자유로움, 모험적, 변화 추구
 * - 계수(癸水): 신중함, 지혜, 감각적
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
  // ============================================================================
  // 갑목(甲木) 일주 - 리더십, 적극성, 주도적
  // ============================================================================
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
  '갑진': {
    type: '변화형 연애',
    description: '변화와 성장을 추구하는 역동적인 연애를 합니다. 큰 꿈과 비전을 함께 나누려 합니다.',
    strengths: ['비전 제시', '역동적', '카리스마', '발전 지향'],
    weaknesses: ['안정 부족', '변덕', '현실성 부족'],
  },
  '갑오': {
    type: '열정형 리더',
    description: '열정적이면서도 주도적인 연애를 합니다. 에너지가 넘치고 상대를 이끌어갑니다.',
    strengths: ['열정적', '적극적', '밝음', '리더십'],
    weaknesses: ['급한 성격', '지나친 주도', '상대 배려 부족'],
  },
  '갑신': {
    type: '실용형 리더',
    description: '실용적이고 계획적인 연애를 합니다. 책임감 있게 미래를 함께 설계합니다.',
    strengths: ['계획적', '실용적', '책임감', '능력'],
    weaknesses: ['융통성 부족', '낭만 부족', '계산적'],
  },
  '갑술': {
    type: '신뢰형 연애',
    description: '신뢰와 의리를 바탕으로 한 든든한 연애를 합니다. 한번 맺은 인연을 소중히 합니다.',
    strengths: ['신뢰', '의리', '책임감', '진실함'],
    weaknesses: ['고지식', '융통성 부족', '변화 거부'],
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
  '을사': {
    type: '지혜형 연애',
    description: '지적이고 현명한 연애를 합니다. 상대의 내면을 깊이 이해하려 합니다.',
    strengths: ['지혜로움', '통찰력', '섬세함', '이해심'],
    weaknesses: ['의심', '계산적', '냉정할 수 있음'],
  },
  '을미': {
    type: '포용형 연애',
    description: '따뜻하고 포용력 있는 연애를 합니다. 상대를 감싸주고 보듬습니다.',
    strengths: ['포용력', '따뜻함', '헌신', '인내심'],
    weaknesses: ['우유부단', '과도한 양보', '자기 희생'],
  },
  '을유': {
    type: '세련형 연애',
    description: '세련되고 품위 있는 연애를 추구합니다. 외적 조건도 중시합니다.',
    strengths: ['세련됨', '품위', '심미안', '우아함'],
    weaknesses: ['까다로움', '외적 조건 중시', '완벽주의'],
  },
  '을해': {
    type: '순수형 연애',
    description: '순수하고 진심어린 연애를 합니다. 정신적 교감을 중요시합니다.',
    strengths: ['순수함', '진실함', '감성', '직관'],
    weaknesses: ['현실성 부족', '상처받기 쉬움', '이상주의'],
  },

  // 병화(丙火) 일주
  '병자': {
    type: '매력형 연애',
    description: '밝은 매력과 지적인 면모가 조화된 연애를 합니다. 다재다능합니다.',
    strengths: ['매력적', '지적', '밝음', '다재다능'],
    weaknesses: ['감정 기복', '변덕', '깊이 부족'],
  },
  '병인': {
    type: '열정적 리더형',
    description: '열정과 리더십이 넘치는 연애를 합니다. 상대를 적극적으로 이끕니다.',
    strengths: ['열정', '리더십', '적극성', '밝음'],
    weaknesses: ['성급함', '지나친 주도', '자기중심'],
  },
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
  '병신': {
    type: '실행형 연애',
    description: '말보다 행동으로 표현하는 연애를 합니다. 현실적이고 능력있습니다.',
    strengths: ['실행력', '능력', '현실적', '활동적'],
    weaknesses: ['감정 표현 서툼', '급함', '무뚝뚝'],
  },
  '병술': {
    type: '정의형 연애',
    description: '정의롭고 따뜻한 연애를 합니다. 상대를 보호하려는 마음이 강합니다.',
    strengths: ['정의감', '보호본능', '따뜻함', '신뢰'],
    weaknesses: ['고집', '융통성 부족', '간섭'],
  },

  // 정화(丁火) 일주
  '정축': {
    type: '신중형 연애',
    description: '신중하고 깊이 있는 연애를 합니다. 한번 마음 주면 변치 않습니다.',
    strengths: ['신중함', '깊이', '진실함', '충성'],
    weaknesses: ['소극적', '내성적', '표현 서툼'],
  },
  '정묘': {
    type: '감성 예술형',
    description: '예술적 감성이 풍부한 연애를 합니다. 로맨틱하고 섬세합니다.',
    strengths: ['예술적', '로맨틱', '감성적', '섬세함'],
    weaknesses: ['현실성 부족', '감정적', '예민함'],
  },
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
  '정유': {
    type: '완벽추구형',
    description: '완벽하고 세련된 연애를 추구합니다. 품위와 격식을 중시합니다.',
    strengths: ['완벽추구', '세련됨', '품위', '안목'],
    weaknesses: ['까다로움', '비판적', '냉정'],
  },
  '정해': {
    type: '지적 감성형',
    description: '지적이면서도 감성적인 연애를 합니다. 정신적 교감을 중시합니다.',
    strengths: ['지적', '감성적', '통찰력', '이해심'],
    weaknesses: ['내성적', '표현 부족', '고민 많음'],
  },

  // 무토(戊土) 일주
  '무자': {
    type: '포용형 연애',
    description: '넓은 포용력과 이해심으로 상대를 감싸줍니다. 안정감을 줍니다.',
    strengths: ['포용력', '이해심', '안정감', '너그러움'],
    weaknesses: ['우유부단', '결단력 부족', '느림'],
  },
  '무인': {
    type: '추진형 연애',
    description: '힘 있고 추진력 있는 연애를 합니다. 목표를 향해 함께 나아갑니다.',
    strengths: ['추진력', '힘', '목표 지향', '실행력'],
    weaknesses: ['강압적', '고집', '독단적'],
  },
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
  '무신': {
    type: '현실형 연애',
    description: '현실적이고 능력 있는 연애를 합니다. 경제적 안정을 중시합니다.',
    strengths: ['현실적', '능력', '경제력', '계획적'],
    weaknesses: ['낭만 부족', '계산적', '감정 표현 서툼'],
  },
  '무술': {
    type: '의리형 연애',
    description: '의리 있고 신뢰할 수 있는 연애를 합니다. 한결같은 마음을 지킵니다.',
    strengths: ['의리', '신뢰', '진실함', '한결같음'],
    weaknesses: ['고집', '융통성 부족', '보수적'],
  },

  // 기토(己土) 일주
  '기축': {
    type: '내실형 연애',
    description: '내실 있고 알찬 연애를 합니다. 겉보다 속을 중시합니다.',
    strengths: ['내실', '진실함', '안정', '실속'],
    weaknesses: ['표현 부족', '내성적', '소극적'],
  },
  '기묘': {
    type: '부드러운 배려형',
    description: '부드럽고 배려심 깊은 연애를 합니다. 상대를 존중합니다.',
    strengths: ['배려심', '부드러움', '존중', '양보'],
    weaknesses: ['우유부단', '자기 주장 부족', '눈치'],
  },
  '기사': {
    type: '지혜로운 헌신형',
    description: '지혜롭고 헌신적인 연애를 합니다. 상대를 위해 노력합니다.',
    strengths: ['지혜', '헌신', '인내', '노력'],
    weaknesses: ['의심', '걱정', '불안'],
  },
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
  '기해': {
    type: '순수 헌신형',
    description: '순수한 마음으로 헌신하는 연애를 합니다. 깊은 정을 나눕니다.',
    strengths: ['순수함', '헌신', '깊은 정', '이해심'],
    weaknesses: ['상처받기 쉬움', '우유부단', '의존'],
  },

  // 경금(庚金) 일주
  '경자': {
    type: '지적 강직형',
    description: '지적이면서도 강직한 연애를 합니다. 명확한 원칙이 있습니다.',
    strengths: ['지적', '강직', '명확함', '결단력'],
    weaknesses: ['완고함', '타협 어려움', '냉정'],
  },
  '경인': {
    type: '추진형 연애',
    description: '강한 추진력으로 관계를 이끌어갑니다. 목표 지향적입니다.',
    strengths: ['추진력', '결단력', '리더십', '목표 지향'],
    weaknesses: ['급함', '강압적', '배려 부족'],
  },
  '경진': {
    type: '야망형 연애',
    description: '야망과 포부를 가진 연애를 합니다. 함께 성공을 꿈꿉니다.',
    strengths: ['야망', '포부', '능력', '결단력'],
    weaknesses: ['자기중심', '강압적', '감정 표현 서툼'],
  },
  '경오': {
    type: '열정적 강직형',
    description: '열정적이면서도 원칙을 지키는 연애를 합니다. 정의로운 면이 있습니다.',
    strengths: ['열정', '정의감', '강직함', '결단력'],
    weaknesses: ['급함', '융통성 부족', '독선'],
  },
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
  '신축': {
    type: '섬세한 현실형',
    description: '섬세하면서도 현실적인 연애를 합니다. 안정과 품위를 추구합니다.',
    strengths: ['섬세함', '현실적', '안정', '품위'],
    weaknesses: ['내성적', '표현 서툼', '까다로움'],
  },
  '신묘': {
    type: '감성적 세련형',
    description: '감성적이면서 세련된 연애를 합니다. 아름다움을 추구합니다.',
    strengths: ['감성', '세련됨', '미적 감각', '섬세함'],
    weaknesses: ['예민함', '감정적', '변덕'],
  },
  '신사': {
    type: '지혜로운 세련형',
    description: '지혜롭고 세련된 연애를 합니다. 깊이와 품격을 갖춥니다.',
    strengths: ['지혜', '세련됨', '깊이', '품격'],
    weaknesses: ['의심', '냉정', '계산적'],
  },
  '신미': {
    type: '온화한 품격형',
    description: '온화하고 품격 있는 연애를 합니다. 상대를 존중합니다.',
    strengths: ['온화함', '품격', '존중', '배려'],
    weaknesses: ['우유부단', '소극적', '결단력 부족'],
  },
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
  '임진': {
    type: '야망적 자유형',
    description: '야망과 자유로움을 겸비한 연애를 합니다. 큰 꿈을 꿉니다.',
    strengths: ['야망', '자유로움', '추진력', '지혜'],
    weaknesses: ['변덕', '불안정', '집중력 부족'],
  },
  '임오': {
    type: '열정적 자유형',
    description: '열정적이면서 자유로운 연애를 합니다. 즉흥적이고 활발합니다.',
    strengths: ['열정', '자유로움', '활발함', '즉흥성'],
    weaknesses: ['변덕', '불안정', '지속력 부족'],
  },
  '임신': {
    type: '실행형 자유인',
    description: '자유롭지만 능력 있는 연애를 합니다. 독립적이고 실용적입니다.',
    strengths: ['독립적', '능력', '실용적', '자유로움'],
    weaknesses: ['냉정', '감정 표현 부족', '거리감'],
  },
  '임술': {
    type: '신뢰형 자유인',
    description: '자유로우면서도 신뢰할 수 있는 연애를 합니다. 의리가 있습니다.',
    strengths: ['신뢰', '의리', '자유로움', '지혜'],
    weaknesses: ['변덕', '고집', '거리감'],
  },

  // 계수(癸水) 일주
  '계축': {
    type: '신중형 연애',
    description: '신중하고 조심스러운 연애를 합니다. 깊이 생각하고 결정합니다.',
    strengths: ['신중함', '사려 깊음', '깊이', '진지함'],
    weaknesses: ['소극적', '우유부단', '기회 놓침'],
  },
  '계묘': {
    type: '감성적 지혜형',
    description: '감성적이면서 지혜로운 연애를 합니다. 섬세하고 이해심이 깊습니다.',
    strengths: ['감성', '지혜', '섬세함', '이해심'],
    weaknesses: ['예민함', '걱정 많음', '내성적'],
  },
  '계사': {
    type: '지적 탐구형',
    description: '지적이고 탐구적인 연애를 합니다. 상대를 깊이 알고 싶어합니다.',
    strengths: ['지적', '탐구심', '통찰력', '분석력'],
    weaknesses: ['의심', '분석적 과다', '냉정'],
  },
  '계미': {
    type: '따뜻한 지혜형',
    description: '따뜻하고 지혜로운 연애를 합니다. 상대를 감싸주고 이해합니다.',
    strengths: ['따뜻함', '지혜', '이해심', '배려'],
    weaknesses: ['우유부단', '걱정 과다', '소극적'],
  },
  '계유': {
    type: '세련된 지성형',
    description: '세련되고 지적인 연애를 합니다. 품격과 깊이를 겸비합니다.',
    strengths: ['세련됨', '지적', '품격', '깊이'],
    weaknesses: ['까다로움', '냉정', '비판적'],
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
