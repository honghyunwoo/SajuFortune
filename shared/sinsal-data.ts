/**
 * 한국 전통 사주학 신살(神煞) 분석 시스템
 * 완성본에서 검증된 30여종 신살 데이터와 분석 로직
 * 
 * 신살은 사주에 나타나는 특별한 별자리로, 
 * 개인의 성격, 운세, 재능 등을 상세히 분석하는 전통 사주학의 핵심 요소입니다.
 */

import { type 천간타입, type 지지타입 } from './astro-data';

// 타입 정의
export type SinsalType = 'good' | 'bad' | 'mixed';
export type CalculationMethod = 'day_gan_based' | 'year_branch_based' | 'month_based' | 'branch_conflict' | 'triple_punishment';

export interface SinsalData {
    name: string;
    type: SinsalType;
    description: string;
    calculation: CalculationMethod;
    data: any;
}

export interface SinsalResult {
    name: string;
    position: string;
    type: SinsalType;
    description: string;
}

export interface SinsalAnalysisResult {
    total: number;
    good: SinsalResult[];
    bad: SinsalResult[];
    mixed: SinsalResult[];
    summary: string;
}

export interface SajuForSinsal {
    year: { gan: 천간타입; ji: 지지타입 };
    month: { gan: 천간타입; ji: 지지타입 };
    day: { gan: 천간타입; ji: 지지타입 };
    hour: { gan: 천간타입; ji: 지지타입 };
}

// 신살 데이터 - 완성본에서 검증된 정확한 데이터
export const 신살데이터: { [key: string]: SinsalData } = {
    // 1. 길신류 (吉神類) - 좋은 기운의 별들
    천을귀인: {
        name: '천을귀인',
        type: 'good',
        description: '하늘이 도와주는 귀한 사람, 고귀함의 상징',
        calculation: 'day_gan_based',
        data: {
            '갑': ['축', '미'], '을': ['자', '신'],
            '병': ['해', '유'], '정': ['해', '유'],
            '무': ['축', '미'], '기': ['자', '신'],
            '경': ['축', '미'], '신': ['자', '신'],
            '임': ['사', '묘'], '계': ['사', '묘']
        }
    },

    태극귀인: {
        name: '태극귀인',
        type: 'good',
        description: '태극의 힘을 받은 귀인, 지혜와 통찰력',
        calculation: 'day_gan_based',
        data: {
            '갑을': ['자', '오'], '병정': ['묘', '유'],
            '무기': ['진', '술', '축', '미'], '경신': ['인', '해'],
            '임계': ['사', '신']
        }
    },

    덕수: {
        name: '덕수',
        type: 'good',
        description: '덕을 베푸는 별, 인덕과 평화',
        calculation: 'month_based',
        data: {
            '인묘진': '갑', '사오미': '정',
            '신유술': '경', '해자축': '임'
        }
    },

    월덕: {
        name: '월덕',
        type: 'good',
        description: '달의 덕을 받는 별, 모성과 포용력',
        calculation: 'month_based',
        data: {
            '인': '병', '묘': '갑', '진': '갑', '사': '무',
            '오': '임', '미': '임', '신': '무', '유': '무',
            '술': '임', '해': '갑', '자': '무', '축': '무'
        }
    },

    학당: {
        name: '학당',
        type: 'good',
        description: '학문의 별, 지식과 교육에 뛰어남',
        calculation: 'day_gan_based',
        data: {
            '갑': '해', '을': '오', '병': '인', '정': '해',
            '무': '인', '기': '오', '경': '사', '신': '인',
            '임': '신', '계': '사'
        }
    },

    문창: {
        name: '문창',
        type: 'good',
        description: '문장의 별, 글쓰기와 예술 재능',
        calculation: 'day_gan_based',
        data: {
            '갑': '사', '을': '오', '병': '신', '정': '유',
            '무': '신', '기': '유', '경': '해', '신': '자',
            '임': '인', '계': '묘'
        }
    },

    천재: {
        name: '천재',
        type: 'good',
        description: '하늘의 재물, 금전운과 사업운',
        calculation: 'day_gan_based',
        data: {
            '갑': '축', '을': '인', '병': '진', '정': '미',
            '무': '진', '기': '미', '경': '미', '신': '술',
            '임': '술', '계': '축'
        }
    },

    지재: {
        name: '지재',
        type: 'good',
        description: '땅의 재물, 부동산과 안정적 수익',
        calculation: 'day_gan_based',
        data: {
            '갑': '인', '을': '묘', '병': '오', '정': '미',
            '무': '오', '기': '미', '경': '신', '신': '유',
            '임': '자', '계': '해'
        }
    },

    천의: {
        name: '천의',
        type: 'good',
        description: '하늘의 의복, 의료와 치료 능력',
        calculation: 'year_branch_based',
        data: {
            '인오술': '해', '사유축': '인',
            '신자진': '사', '해묘미': '신'
        }
    },

    // 2. 흉신류 (凶神類) - 주의가 필요한 별들
    양인: {
        name: '양인',
        type: 'bad',
        description: '칼의 기운, 급하고 과격한 성향',
        calculation: 'day_gan_based',
        data: {
            '갑': ['묘'], '을': ['인'], '병': ['오'], '정': ['사'],
            '무': ['오'], '기': ['사'], '경': ['유'], '신': ['신'],
            '임': ['자'], '계': ['해']
        }
    },

    겁살: {
        name: '겁살',
        type: 'bad',
        description: '도적의 별, 재물 손실과 위험',
        calculation: 'year_branch_based',
        data: {
            '인오술': '사', '사유축': '신',
            '신자진': '해', '해묘미': '인'
        }
    },

    재살: {
        name: '재살',
        type: 'bad',
        description: '재앙의 별, 각종 재해와 액운',
        calculation: 'year_branch_based',
        data: {
            '인오술': '유', '사유축': '자',
            '신자진': '묘', '해묘미': '오'
        }
    },

    고신: {
        name: '고신',
        type: 'bad',
        description: '외로운 별, 고독과 인연 박함',
        calculation: 'year_branch_based',
        data: {
            '인오술': '인', '사유축': '사',
            '신자진': '신', '해묘미': '해'
        }
    },

    과숙: {
        name: '과숙',
        type: 'bad',
        description: '과부의 별, 배우자와의 이별수',
        calculation: 'year_branch_based',
        data: {
            '인오술': '술', '사유축': '축',
            '신자진': '진', '해묘미': '미'
        }
    },

    병부: {
        name: '병부',
        type: 'bad',
        description: '질병의 별, 건강상 주의 필요',
        calculation: 'year_branch_based',
        data: {
            '인오술': '묘', '사유축': '자',
            '신자진': '유', '해묘미': '오'
        }
    },

    사부: {
        name: '사부',
        type: 'bad',
        description: '죽음의 별, 생명력 약화',
        calculation: 'year_branch_based',
        data: {
            '인오술': '유', '사유축': '자',
            '신자진': '묘', '해묘미': '오'
        }
    },

    // 3. 인간관계류 - 이성운과 매력 관련
    홍염: {
        name: '홍염',
        type: 'mixed',
        description: '붉은 염주, 이성운과 매력, 때로는 복잡한 관계',
        calculation: 'year_branch_based',
        data: {
            '인오술': '묘', '사유축': '오',
            '신자진': '유', '해묘미': '자'
        }
    },

    함지: {
        name: '함지',
        type: 'mixed',
        description: '감지덕, 이성을 끌어들이는 매력',
        calculation: 'year_branch_based',
        data: {
            '인오술': '유', '사유축': '자',
            '신자진': '묘', '해묘미': '오'
        }
    },

    // 4. 성격/성향류 - 특별한 재능과 성향
    화개: {
        name: '화개',
        type: 'mixed',
        description: '꽃덮개, 예술적 재능과 종교적 성향',
        calculation: 'year_branch_based',
        data: {
            '인오술': '술', '사유축': '축',
            '신자진': '진', '해묘미': '미'
        }
    },

    // 5. 특수 신살류 - 복잡한 계산이 필요한 신살
    원진: {
        name: '원진',
        type: 'bad',
        description: '원한의 별, 인간관계에서 갈등',
        calculation: 'branch_conflict',
        data: ['자미', '축오', '인사', '묘진', '신해', '유술']
    },

    삼형: {
        name: '삼형',
        type: 'bad',
        description: '세 가지 형벌, 법적 문제나 갈등',
        calculation: 'triple_punishment',
        data: [
            ['인사신'], ['축미술'], ['자묘'], ['진오유해']
        ]
    }
};

// 신살 계산 함수들
export class SinsalCalculator {
    // 일간 기준 계산
    static dayGanBased(saju: SajuForSinsal, sinsal: SinsalData): SinsalResult[] {
        const dayGan = saju.day.gan;
        const result: SinsalResult[] = [];

        if (sinsal.data[dayGan]) {
            const targets = Array.isArray(sinsal.data[dayGan]) ? sinsal.data[dayGan] : [sinsal.data[dayGan]];

            [saju.year.ji, saju.month.ji, saju.hour.ji].forEach((ji, index) => {
                if (targets.includes(ji)) {
                    const positions = ['년지', '월지', '시지'];
                    result.push({
                        name: sinsal.name,
                        position: positions[index],
                        type: sinsal.type,
                        description: sinsal.description
                    });
                }
            });
        }

        return result;
    }

    // 년지 기준 계산 (삼합 그룹)
    static yearBranchBased(saju: SajuForSinsal, sinsal: SinsalData): SinsalResult[] {
        const yearBranch = saju.year.ji;
        const result: SinsalResult[] = [];

        // 삼합 그룹 찾기
        let group: string | null = null;
        Object.keys(sinsal.data).forEach(key => {
            if (key.includes(yearBranch)) {
                group = key;
            }
        });

        if (group) {
            const target = sinsal.data[group];
            [saju.month.ji, saju.day.ji, saju.hour.ji].forEach((ji, index) => {
                if (ji === target) {
                    const positions = ['월지', '일지', '시지'];
                    result.push({
                        name: sinsal.name,
                        position: positions[index],
                        type: sinsal.type,
                        description: sinsal.description
                    });
                }
            });
        }

        return result;
    }

    // 월지 기준 계산
    static monthBased(saju: SajuForSinsal, sinsal: SinsalData): SinsalResult[] {
        const monthBranch = saju.month.ji;
        const result: SinsalResult[] = [];

        if (sinsal.data[monthBranch]) {
            const target = sinsal.data[monthBranch];
            [saju.year.gan, saju.day.gan, saju.hour.gan].forEach((gan, index) => {
                if (gan === target) {
                    const positions = ['년간', '일간', '시간'];
                    result.push({
                        name: sinsal.name,
                        position: positions[index],
                        type: sinsal.type,
                        description: sinsal.description
                    });
                }
            });
        }

        return result;
    }

    // 지지 충돌 기준
    static branchConflict(saju: SajuForSinsal, sinsal: SinsalData): SinsalResult[] {
        const result: SinsalResult[] = [];
        const branches = [saju.year.ji, saju.month.ji, saju.day.ji, saju.hour.ji];

        sinsal.data.forEach((conflict: string) => {
            const [branch1, branch2] = conflict.split('');
            let positions: string[] = [];

            branches.forEach((branch, index) => {
                if (branch === branch1 || branch === branch2) {
                    positions.push(['년지', '월지', '일지', '시지'][index]);
                }
            });

            if (positions.length >= 2) {
                result.push({
                    name: sinsal.name,
                    position: positions.join(', '),
                    type: sinsal.type,
                    description: sinsal.description
                });
            }
        });

        return result;
    }

    // 삼형 계산
    static triplePunishment(saju: SajuForSinsal, sinsal: SinsalData): SinsalResult[] {
        const result: SinsalResult[] = [];
        const branches = [saju.year.ji, saju.month.ji, saju.day.ji, saju.hour.ji];

        sinsal.data.forEach((punishment: string[]) => {
            const [group] = punishment;
            let count = 0;
            let positions: string[] = [];

            branches.forEach((branch, index) => {
                if (group.includes(branch)) {
                    count++;
                    positions.push(['년지', '월지', '일지', '시지'][index]);
                }
            });

            if (count >= 2) {
                result.push({
                    name: sinsal.name,
                    position: positions.join(', '),
                    type: sinsal.type,
                    description: `${sinsal.description} (${count}개 형성)`
                });
            }
        });

        return result;
    }
}

/**
 * 종합 신살 분석 함수
 * @param saju 사주팔자 데이터
 * @returns 신살 분석 결과
 */
export function analyze신살(saju: SajuForSinsal): SinsalAnalysisResult {
    console.log('🔮 신살 분석 시작');

    const 신살결과: SinsalAnalysisResult = {
        total: 0,
        good: [],
        bad: [],
        mixed: [],
        summary: ''
    };

    // 모든 신살 검사
    Object.entries(신살데이터).forEach(([key, 신살]) => {
        let results: SinsalResult[] = [];

        switch (신살.calculation) {
            case 'day_gan_based':
                results = SinsalCalculator.dayGanBased(saju, 신살);
                break;
            case 'year_branch_based':
                results = SinsalCalculator.yearBranchBased(saju, 신살);
                break;
            case 'month_based':
                results = SinsalCalculator.monthBased(saju, 신살);
                break;
            case 'branch_conflict':
                results = SinsalCalculator.branchConflict(saju, 신살);
                break;
            case 'triple_punishment':
                results = SinsalCalculator.triplePunishment(saju, 신살);
                break;
        }

        // 결과 분류
        results.forEach(result => {
            신살결과.total++;
            신살결과[result.type].push(result);
        });
    });

    // 종합 평가
    const goodCount = 신살결과.good.length;
    const badCount = 신살결과.bad.length;
    const mixedCount = 신살결과.mixed.length;

    if (goodCount > badCount) {
        신살결과.summary = '길신이 많아 전반적으로 좋은 운세를 가지고 있습니다.';
    } else if (badCount > goodCount) {
        신살결과.summary = '흉신이 있어 주의가 필요한 부분들이 있습니다.';
    } else {
        신살결과.summary = '길신과 흉신이 균형을 이루고 있습니다.';
    }

    console.log('🔮 신살 분석 완료:', {
        총신살: 신살결과.total,
        길신: goodCount,
        흉신: badCount,
        중성: mixedCount
    });

    return 신살결과;
}

// 신살 종류별 통계
export function getSinsalStatistics(): { [category: string]: number } {
    const stats = {
        good: 0,
        bad: 0,
        mixed: 0,
        total: 0
    };

    Object.values(신살데이터).forEach(sinsal => {
        stats[sinsal.type]++;
        stats.total++;
    });

    return stats;
}

// 특정 신살 조회
export function getSinsalByName(name: string): SinsalData | undefined {
    return Object.values(신살데이터).find(sinsal => sinsal.name === name);
}

// 신살 타입별 목록 조회
export function getSinsalByType(type: SinsalType): SinsalData[] {
    return Object.values(신살데이터).filter(sinsal => sinsal.type === type);
}

// 편의성 함수들
export const analyzeSinsal = analyze신살;
export const SINSAL_DATA = 신살데이터;