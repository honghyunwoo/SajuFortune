/**
 * 대운 계산 시스템 (大運 Calculation System)
 * 전통 명리학의 대운 이론을 바탕으로 한 10년 단위 운세 계산
 *
 * 대운(大運)이란?
 * 10년을 주기로 변화하는 인생의 큰 흐름을 나타내는 명리학의 핵심 개념
 * 사람의 일생을 10년씩 끊어서 각 시기의 운세를 판단
 *
 * 주요 특징:
 * - 남성 양년생/여성 음년생: 순행(順行)
 * - 남성 음년생/여성 양년생: 역행(逆行)
 * - 대운 시작 나이는 생년월일과 절기로 계산
 */

import {
    천간, 지지, 천간오행, 지지오행,
    type 천간타입, type 지지타입, type 오행타입
} from './astro-data';
import { get절기, type SolarTermName } from './solar-terms';

// 타입 정의
export interface 대운주 {
    간: 천간타입;
    지: 지지타입;
    시작나이: number;
    종료나이: number;
    대운오행: {
        간: 오행타입;
        지: 오행타입;
    };
    길흉: '대길' | '길' | '평' | '흉' | '대흉';
    해석: string;
}

export interface 대운결과 {
    대운목록: 대운주[];
    현재대운: 대운주 | null;
    대운시작나이: number;
    대운방향: '순행' | '역행';
    전체해석: string;
}

export interface 생년월일정보 {
    년: number;
    월: number;
    일: number;
    시: number;
    성별: 'male' | 'female';
    월주간: 천간타입;
    월주지: 지지타입;
}

/**
 * 대운 계산 메인 함수
 */
export function calculate대운(
    birthDate: Date,
    gender: 'male' | 'female',
    월주간: 천간타입,
    월주지: 지지타입,
    현재나이?: number
): 대운결과 {
    console.log('🎴 대운 계산 시작');

    const 년 = birthDate.getFullYear();
    const 월 = birthDate.getMonth() + 1;
    const 일 = birthDate.getDate();

    // 1. 년간(年干) 계산 - 음양 판별용
    const 년간 = get년간(년);

    // 2. 대운 방향 결정 (순행/역행)
    const 대운방향 = get대운방향(년간, gender);

    // 3. 대운 시작 나이 계산
    const 대운시작나이 = calculate대운시작나이(birthDate, 대운방향);

    // 4. 8개 대운 생성 (80년치)
    const 대운목록 = generate대운목록(
        월주간,
        월주지,
        대운시작나이,
        대운방향
    );

    // 5. 현재 대운 찾기
    const 현재대운 = 현재나이
        ? find현재대운(대운목록, 현재나이)
        : null;

    // 6. 전체 해석 생성
    const 전체해석 = generate전체해석(대운방향, 대운시작나이, 현재대운);

    console.log('✅ 대운 계산 완료:', {
        대운방향,
        대운시작나이,
        현재대운: 현재대운 ? `${현재대운.간}${현재대운.지}` : '없음'
    });

    return {
        대운목록,
        현재대운,
        대운시작나이,
        대운방향,
        전체해석
    };
}

/**
 * 년간(年干) 계산
 * 갑자년을 기준으로 계산
 */
function get년간(년: number): 천간타입 {
    // 1984년 = 갑자년 (갑: 0)
    const baseYear = 1984;
    const yearDiff = 년 - baseYear;
    const 간Index = (yearDiff % 10 + 10) % 10;
    return 천간[간Index];
}

/**
 * 대운 방향 결정
 * 양남음녀(陽男陰女): 순행
 * 음남양녀(陰男陽女): 역행
 */
function get대운방향(년간: 천간타입, gender: 'male' | 'female'): '순행' | '역행' {
    const 년간Index = 천간.indexOf(년간);
    const is양간 = 년간Index % 2 === 0; // 갑(0), 병(2), 무(4), 경(6), 임(8)

    if (gender === 'male') {
        return is양간 ? '순행' : '역행';
    } else {
        return is양간 ? '역행' : '순행';
    }
}

/**
 * 대운 시작 나이 계산
 * 절기와의 거리를 3으로 나눈 값
 */
function calculate대운시작나이(birthDate: Date, 대운방향: '순행' | '역행'): number {
    const 년 = birthDate.getFullYear();
    const 월 = birthDate.getMonth() + 1;

    try {
        // 절기 정보 가져오기
        const 절기명 = get절기명For월(월);
        const 절기Date = get절기(년, 절기명);

        // 생일과 절기 사이의 날짜 차이
        const 날짜차이 = Math.abs(
            Math.floor((birthDate.getTime() - 절기Date.getTime()) / (1000 * 60 * 60 * 24))
        );

        // 3일 = 1살 (전통적 계산법)
        const 대운시작 = Math.floor(날짜차이 / 3);

        // 최소 1살, 최대 10살로 제한
        return Math.max(1, Math.min(10, 대운시작));
    } catch (error) {
        console.warn('⚠️ 절기 계산 실패, 기본값 5살 사용:', error);
        return 5; // 기본값
    }
}

/**
 * 월에 해당하는 절기명 반환
 */
function get절기명For월(월: number): SolarTermName {
    const 절기표: Record<number, SolarTermName> = {
        1: '입춘', 2: '경칩', 3: '청명', 4: '입하',
        5: '망종', 6: '소서', 7: '입추', 8: '백로',
        9: '한로', 10: '입동', 11: '대설', 12: '소한'
    };
    return 절기표[월] || '입춘';
}

/**
 * 8개 대운 생성
 * 80년치의 대운을 10년 단위로 생성
 */
function generate대운목록(
    월주간: 천간타입,
    월주지: 지지타입,
    대운시작나이: number,
    대운방향: '순행' | '역행'
): 대운주[] {
    const 대운목록: 대운주[] = [];

    const 간Index = 천간.indexOf(월주간);
    const 지Index = 지지.indexOf(월주지);

    for (let i = 0; i < 8; i++) {
        let 대운간Index: number;
        let 대운지Index: number;

        if (대운방향 === '순행') {
            대운간Index = (간Index + i + 1) % 10;
            대운지Index = (지Index + i + 1) % 12;
        } else {
            대운간Index = (간Index - i - 1 + 10) % 10;
            대운지Index = (지Index - i - 1 + 12) % 12;
        }

        const 대운간 = 천간[대운간Index];
        const 대운지 = 지지[대운지Index];

        const 시작나이 = 대운시작나이 + (i * 10);
        const 종료나이 = 시작나이 + 9;

        대운목록.push({
            간: 대운간,
            지: 대운지,
            시작나이,
            종료나이,
            대운오행: {
                간: 천간오행[대운간],
                지: 지지오행[대운지]
            },
            길흉: calculate대운길흉(대운간, 대운지),
            해석: generate대운해석(대운간, 대운지, 시작나이, 종료나이)
        });
    }

    return 대운목록;
}

/**
 * 대운 길흉 판단
 * 간지의 조화와 오행 균형을 고려
 */
function calculate대운길흉(간: 천간타입, 지: 지지타입): '대길' | '길' | '평' | '흉' | '대흉' {
    // 간단한 판별 (실제로는 더 복잡한 로직)
    const 간오행 = 천간오행[간];
    const 지오행 = 지지오행[지];

    // 천지비화(天地比和) - 간지 오행이 같으면 길
    if (간오행 === 지오행) {
        return '길';
    }

    // 천지상생 - 간이 지를 생하면 대길
    if (is상생(간오행, 지오행)) {
        return '대길';
    }

    // 천지상극 - 간이 지를 극하면 흉
    if (is상극(간오행, 지오행)) {
        return '흉';
    }

    return '평';
}

/**
 * 오행 상생 판단
 */
function is상생(생하는오행: 오행타입, 생받는오행: 오행타입): boolean {
    const 상생표: Record<오행타입, 오행타입> = {
        '목': '화',
        '화': '토',
        '토': '금',
        '금': '수',
        '수': '목'
    };
    return 상생표[생하는오행] === 생받는오행;
}

/**
 * 오행 상극 판단
 */
function is상극(극하는오행: 오행타입, 극당하는오행: 오행타입): boolean {
    const 상극표: Record<오행타입, 오행타입> = {
        '목': '토',
        '화': '금',
        '토': '수',
        '금': '목',
        '수': '화'
    };
    return 상극표[극하는오행] === 극당하는오행;
}

/**
 * 대운 해석 생성
 */
function generate대운해석(
    간: 천간타입,
    지: 지지타입,
    시작: number,
    종료: number
): string {
    const 간오행 = 천간오행[간];
    const 지오행 = 지지오행[지];

    // 대운 해석 템플릿
    const 해석템플릿: Record<오행타입, string[]> = {
        '목': [
            '성장과 발전의 시기입니다.',
            '새로운 시작에 좋은 운입니다.',
            '창의적 활동이 빛을 발합니다.'
        ],
        '화': [
            '열정과 활동의 시기입니다.',
            '사회적 활동이 왕성합니다.',
            '명예와 인정을 받을 수 있습니다.'
        ],
        '토': [
            '안정과 축적의 시기입니다.',
            '재물 관리에 유리합니다.',
            '부동산 관련 기회가 있습니다.'
        ],
        '금': [
            '정리와 결실의 시기입니다.',
            '권위와 지위가 상승합니다.',
            '결단력이 필요한 시기입니다.'
        ],
        '수': [
            '지혜와 유동의 시기입니다.',
            '학문과 연구에 좋습니다.',
            '인간관계가 확장됩니다.'
        ]
    };

    const 기본해석 = 해석템플릿[간오행][0];
    const 보조해석 = 해석템플릿[지오행][1];

    return `${시작}-${종료}세: ${간}${지} 대운. ${기본해석} ${보조해석}`;
}

/**
 * 현재 대운 찾기
 */
function find현재대운(대운목록: 대운주[], 현재나이: number): 대운주 | null {
    return 대운목록.find(
        대운 => 현재나이 >= 대운.시작나이 && 현재나이 <= 대운.종료나이
    ) || null;
}

/**
 * 전체 해석 생성
 */
function generate전체해석(
    대운방향: '순행' | '역행',
    대운시작나이: number,
    현재대운: 대운주 | null
): string {
    let 해석 = `대운은 ${대운시작나이}세부터 시작하며, ${대운방향} 방식으로 진행됩니다.\n`;

    if (현재대운) {
        해석 += `\n현재 ${현재대운.간}${현재대운.지} 대운(${현재대운.시작나이}-${현재대운.종료나이}세)을 지나고 있습니다. `;
        해석 += `이 시기는 ${현재대운.해석}`;
    } else {
        해석 += '\n현재 나이 정보가 없어 현재 대운을 표시할 수 없습니다.';
    }

    return 해석;
}

/**
 * 대운 간단 요약
 */
export function get대운요약(대운: 대운주): string {
    return `${대운.간}${대운.지}운 (${대운.시작나이}-${대운.종료나이}세)`;
}

/**
 * 대운 상세 정보
 */
export function get대운상세(대운: 대운주): {
    대운주: string;
    연령대: string;
    오행: string;
    길흉: string;
    핵심키워드: string[];
} {
    const 오행키워드: Record<오행타입, string[]> = {
        '목': ['성장', '발전', '시작', '창의'],
        '화': ['열정', '활동', '명예', '인정'],
        '토': ['안정', '축적', '재물', '부동산'],
        '금': ['결실', '권위', '지위', '결단'],
        '수': ['지혜', '유동', '학문', '인간관계']
    };

    return {
        대운주: `${대운.간}${대운.지}`,
        연령대: `${대운.시작나이}-${대운.종료나이}세`,
        오행: `간(${대운.대운오행.간}) 지(${대운.대운오행.지})`,
        길흉: 대운.길흉,
        핵심키워드: [
            ...오행키워드[대운.대운오행.간],
            ...오행키워드[대운.대운오행.지]
        ]
    };
}
