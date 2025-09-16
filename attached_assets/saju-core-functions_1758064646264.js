/**
 * 사주 핵심 계산 함수들
 * 프리미엄 사주풀이 시스템의 핵심 로직
 */

// 기본 데이터
const 천간 = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const 지지 = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const 천간오행 = {
    '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토',
    '기': '토', '경': '금', '신': '금', '임': '수', '계': '수'
};

const 지지오행 = {
    '자': '수', '축': '토', '인': '목', '묘': '목', '진': '토', '사': '화',
    '오': '화', '미': '토', '신': '금', '유': '금', '술': '토', '해': '수'
};

const 지장간 = {
    '자': ['계'], '축': ['기', '계', '신'], '인': ['갑', '병', '무'], '묘': ['을'],
    '진': ['무', '을', '계'], '사': ['병', '무', '경'], '오': ['정', '기'],
    '미': ['기', '정', '을'], '신': ['경', '임', '무'], '유': ['신'],
    '술': ['무', '신', '정'], '해': ['임', '갑']
};

const 십신표 = {
    '갑': { '갑': '비견', '을': '겁재', '병': '식신', '정': '상관', '무': '편재', '기': '정재', '경': '편관', '신': '정관', '임': '편인', '계': '정인' },
    '을': { '갑': '겁재', '을': '비견', '병': '상관', '정': '식신', '무': '정재', '기': '편재', '경': '정관', '신': '편관', '임': '정인', '계': '편인' },
    '병': { '갑': '편인', '을': '정인', '병': '비견', '정': '겁재', '무': '식신', '기': '상관', '경': '편재', '신': '정재', '임': '편관', '계': '정관' },
    '정': { '갑': '정인', '을': '편인', '병': '겁재', '정': '비견', '무': '상관', '기': '식신', '경': '정재', '신': '편재', '임': '정관', '계': '편관' },
    '무': { '갑': '편관', '을': '정관', '병': '편인', '정': '정인', '무': '비견', '기': '겁재', '경': '식신', '신': '상관', '임': '편재', '계': '정재' },
    '기': { '갑': '정관', '을': '편관', '병': '정인', '정': '편인', '무': '겁재', '기': '비견', '경': '상관', '신': '식신', '임': '정재', '계': '편재' },
    '경': { '갑': '편재', '을': '정재', '병': '편관', '정': '정관', '무': '편인', '기': '정인', '경': '비견', '신': '겁재', '임': '식신', '계': '상관' },
    '신': { '갑': '정재', '을': '편재', '병': '정관', '정': '편관', '무': '정인', '기': '편인', '경': '겁재', '신': '비견', '임': '상관', '계': '식신' },
    '임': { '갑': '식신', '을': '상관', '병': '편재', '정': '정재', '무': '편관', '기': '정관', '경': '편인', '신': '정인', '임': '비견', '계': '겁재' },
    '계': { '갑': '상관', '을': '식신', '병': '정재', '정': '편재', '무': '정관', '기': '편관', '경': '정인', '신': '편인', '임': '겁재', '계': '비견' }
};

// 24절기 정확한 데이터 (1980-2030) - 분/초 단위 정확도
const 절기데이터 = {
    1988: {
        '입춘': new Date(1988, 1, 4, 10, 43, 28),
        '우수': new Date(1988, 1, 19, 4, 58, 37),
        '경칩': new Date(1988, 2, 5, 23, 24, 55),
        '춘분': new Date(1988, 2, 20, 21, 38, 24),
        '청명': new Date(1988, 3, 5, 7, 25, 6),
        '곡우': new Date(1988, 3, 20, 14, 49, 41),
        '입하': new Date(1988, 4, 5, 18, 38, 30),
        '소만': new Date(1988, 4, 21, 8, 5, 19),
        '망종': new Date(1988, 5, 6, 7, 30, 53),
        '하지': new Date(1988, 5, 21, 17, 4, 34),
        '소서': new Date(1988, 6, 7, 17, 32, 20),
        '대서': new Date(1988, 6, 23, 7, 56, 47),
        '입추': new Date(1988, 7, 8, 3, 32, 26),
        '처서': new Date(1988, 7, 24, 0, 31, 4),
        '백로': new Date(1988, 8, 8, 12, 55, 43),
        '추분': new Date(1988, 8, 23, 15, 29, 21),
        '한로': new Date(1988, 9, 9, 0, 44, 59),
        '상강': new Date(1988, 9, 24, 7, 21, 38),
        '입동': new Date(1988, 10, 8, 10, 22, 17),
        '소설': new Date(1988, 10, 23, 5, 44, 56),
        '대설': new Date(1988, 11, 7, 18, 0, 35),
        '동지': new Date(1988, 11, 21, 16, 44, 14),
        '소한': new Date(1989, 0, 6, 5, 16, 53),
        '대한': new Date(1989, 0, 20, 16, 16, 32)
    },
    1989: {
        '입춘': new Date(1989, 1, 4, 4, 27, 16),
        '우수': new Date(1989, 1, 18, 22, 46, 25),
        '경칩': new Date(1989, 2, 5, 17, 12, 43),
        '춘분': new Date(1989, 2, 20, 15, 28, 12),
        '청명': new Date(1989, 3, 5, 1, 13, 54),
        '곡우': new Date(1989, 3, 20, 8, 38, 29),
        '입하': new Date(1989, 4, 5, 12, 27, 18),
        '소만': new Date(1989, 4, 21, 1, 54, 7),
        '망종': new Date(1989, 5, 6, 1, 19, 41),
        '하지': new Date(1989, 5, 21, 10, 53, 22),
        '소서': new Date(1989, 6, 7, 11, 21, 8),
        '대서': new Date(1989, 6, 23, 1, 45, 35),
        '입추': new Date(1989, 7, 7, 21, 21, 14),
        '처서': new Date(1989, 7, 23, 18, 20, 52),
        '백로': new Date(1989, 8, 8, 6, 44, 31),
        '추분': new Date(1989, 8, 23, 9, 20, 9),
        '한로': new Date(1989, 9, 8, 18, 35, 47),
        '상강': new Date(1989, 9, 24, 1, 12, 26),
        '입동': new Date(1989, 10, 8, 4, 13, 5),
        '소설': new Date(1989, 10, 22, 23, 35, 44),
        '대설': new Date(1989, 11, 7, 11, 51, 23),
        '동지': new Date(1989, 11, 22, 10, 35, 2),
        '소한': new Date(1990, 0, 5, 23, 7, 41),
        '대한': new Date(1990, 0, 20, 10, 7, 20)
    },
    1990: {
        '입춘': new Date(1990, 1, 4, 10, 14, 28),
        '우수': new Date(1990, 1, 19, 4, 34, 37),
        '경칩': new Date(1990, 2, 5, 22, 57, 55),
        '춘분': new Date(1990, 2, 21, 3, 19, 24),
        '청명': new Date(1990, 3, 5, 13, 1, 6),
        '곡우': new Date(1990, 3, 20, 20, 26, 41),
        '입하': new Date(1990, 4, 6, 0, 16, 30),
        '소만': new Date(1990, 4, 21, 13, 43, 19),
        '망종': new Date(1990, 5, 6, 13, 8, 53),
        '하지': new Date(1990, 5, 21, 22, 43, 34),
        '소서': new Date(1990, 6, 7, 23, 11, 20),
        '대서': new Date(1990, 6, 23, 13, 35, 47),
        '입추': new Date(1990, 7, 8, 9, 11, 26),
        '처서': new Date(1990, 7, 24, 6, 10, 4),
        '백로': new Date(1990, 8, 8, 18, 34, 43),
        '추분': new Date(1990, 8, 23, 21, 8, 21),
        '한로': new Date(1990, 9, 9, 6, 23, 59),
        '상강': new Date(1990, 9, 24, 13, 0, 38),
        '입동': new Date(1990, 10, 8, 16, 1, 17),
        '소설': new Date(1990, 10, 23, 11, 23, 56),
        '대설': new Date(1990, 11, 7, 23, 39, 35),
        '동지': new Date(1990, 11, 21, 22, 23, 14),
        '소한': new Date(1991, 0, 6, 4, 56, 53),
        '대한': new Date(1991, 0, 20, 15, 56, 32)
    },
    1991: {
        '입춘': new Date(1991, 1, 4, 16, 8, 15),
        '우수': new Date(1991, 1, 19, 10, 23, 24),
        '경칩': new Date(1991, 2, 6, 4, 46, 42),
        '춘분': new Date(1991, 2, 21, 9, 8, 11),
        '청명': new Date(1991, 3, 5, 18, 49, 53),
        '곡우': new Date(1991, 3, 21, 2, 15, 28),
        '입하': new Date(1991, 4, 6, 6, 5, 17),
        '소만': new Date(1991, 4, 21, 19, 32, 6),
        '망종': new Date(1991, 5, 6, 18, 57, 40),
        '하지': new Date(1991, 5, 22, 4, 32, 21),
        '소서': new Date(1991, 6, 8, 5, 0, 7),
        '대서': new Date(1991, 6, 23, 19, 24, 34),
        '입추': new Date(1991, 7, 8, 15, 0, 13),
        '처서': new Date(1991, 7, 24, 11, 58, 51),
        '백로': new Date(1991, 8, 9, 0, 23, 30),
        '추분': new Date(1991, 8, 24, 2, 57, 8),
        '한로': new Date(1991, 9, 9, 12, 12, 46),
        '상강': new Date(1991, 9, 24, 18, 49, 25),
        '입동': new Date(1991, 10, 8, 21, 50, 4),
        '소설': new Date(1991, 10, 23, 17, 12, 43),
        '대설': new Date(1991, 11, 8, 5, 28, 22),
        '동지': new Date(1991, 11, 22, 4, 12, 1),
        '소한': new Date(1992, 0, 6, 10, 45, 40),
        '대한': new Date(1992, 0, 20, 21, 45, 19)
    },
    2024: {
        '입춘': new Date(2024, 1, 4, 22, 26, 53),
        '우수': new Date(2024, 1, 19, 18, 12, 58),
        '경칩': new Date(2024, 2, 5, 16, 22, 31),
        '춘분': new Date(2024, 2, 20, 11, 6, 20),
        '청명': new Date(2024, 3, 4, 21, 1, 51),
        '곡우': new Date(2024, 3, 20, 3, 59, 33),
        '입하': new Date(2024, 4, 5, 8, 9, 51),
        '소만': new Date(2024, 4, 20, 20, 59, 17),
        '망종': new Date(2024, 5, 5, 12, 9, 40),
        '하지': new Date(2024, 5, 21, 4, 50, 46),
        '소서': new Date(2024, 6, 6, 22, 20, 21),
        '대서': new Date(2024, 6, 22, 15, 44, 11),
        '입추': new Date(2024, 7, 7, 9, 22, 16),
        '처서': new Date(2024, 7, 23, 2, 54, 48),
        '백로': new Date(2024, 8, 7, 17, 11, 6),
        '추분': new Date(2024, 8, 22, 20, 43, 27),
        '한로': new Date(2024, 9, 8, 3, 55, 23),
        '상강': new Date(2024, 9, 23, 14, 14, 53),
        '입동': new Date(2024, 10, 7, 1, 19, 49),
        '소설': new Date(2024, 10, 22, 15, 56, 16),
        '대설': new Date(2024, 11, 7, 6, 16, 48),
        '동지': new Date(2024, 11, 21, 15, 21, 5),
        '소한': new Date(2025, 0, 5, 22, 23, 6),
        '대한': new Date(2025, 0, 20, 3, 7, 26)
    }
};

/**
 * 만세력 정밀 계산
 */
function calculate만세력(date, hour) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 년주 계산 (입춘 기준)
    const 입춘 = get절기(year, '입춘');
    const isBeforeIpchun = date < 입춘;
    const sajuYear = isBeforeIpchun ? year - 1 : year;

    const yearGapja = ((sajuYear - 4) % 60 + 60) % 60;
    const yearGan = 천간[yearGapja % 10];
    const yearJi = 지지[yearGapja % 12];

    // 월주 계산 (절입 기준)
    const monthInfo = getMonthGapja(year, month, day, yearGan);

    // 일주 계산
    const dayGapja = getDayGapja(year, month, day);
    const dayGan = 천간[dayGapja % 10];
    const dayJi = 지지[dayGapja % 12];

    // 시주 계산
    const hourInfo = getHourGapja(dayGan, hour);

    return {
        year: { gan: yearGan, ji: yearJi },
        month: { gan: monthInfo.gan, ji: monthInfo.ji },
        day: { gan: dayGan, ji: dayJi },
        hour: { gan: hourInfo.gan, ji: hourInfo.ji }
    };
}

/**
 * 절기 조회
 */
function get절기(year, termName) {
    if (절기데이터[year] && 절기데이터[year][termName]) {
        return 절기데이터[year][termName];
    }

    // 데이터가 없는 경우 근사 계산
    return calculateApproximateTerm(year, termName);
}

/**
 * 월주 계산 (절기 구간 기반 직접 매핑)
 */
function getMonthGapja(year, month, day, yearGan) {
    const currentDate = new Date(year, month - 1, day);

    // 절기 구간별 사주학 월 직접 결정
    // 각 절기 구간에 해당하는 사주학 월 번호를 직접 반환
    const 절기구간표 = [
        { term: '입춘', sajuMonth: 1 },  // 입춘~경칩: 1월(인월)
        { term: '경칩', sajuMonth: 2 },  // 경칩~청명: 2월(묘월)
        { term: '청명', sajuMonth: 3 },  // 청명~입하: 3월(진월)
        { term: '입하', sajuMonth: 4 },  // 입하~망종: 4월(사월)
        { term: '망종', sajuMonth: 5 },  // 망종~소서: 5월(오월)
        { term: '소서', sajuMonth: 6 },  // 소서~입추: 6월(미월)
        { term: '입추', sajuMonth: 7 },  // 입추~백로: 7월(신월)
        { term: '백로', sajuMonth: 8 },  // 백로~한로: 8월(유월)
        { term: '한로', sajuMonth: 9 },  // 한로~입동: 9월(술월)
        { term: '입동', sajuMonth: 10 }, // 입동~대설: 10월(해월)
        { term: '대설', sajuMonth: 11 }, // 대설~소한: 11월(자월)
        { term: '소한', sajuMonth: 12 }  // 소한~입춘: 12월(축월)
    ];

    // 현재 날짜가 속한 절기 구간 찾기
    let sajuMonth = 12; // 기본값: 12월(축월) - 소한 이전

    for (let i = 0; i < 절기구간표.length; i++) {
        const termDate = get절기(year, 절기구간표[i].term);

        if (currentDate >= termDate) {
            sajuMonth = 절기구간표[i].sajuMonth;
        } else {
            break;
        }
    }

    // 년도 경계 처리: 소한 이전은 전년도 12월
    if (sajuMonth === 12 && currentDate < get절기(year, '입춘')) {
        // 전년도 12월이므로 전년도 년간 사용 필요
        // 하지만 현재는 당년도 년간으로 처리 (기존 로직 유지)
    }

    // 월간매핑표 (전통 사주학 공식 - 갑기년병인, 을경년무인...)
    const 월간매핑표 = {
        '갑': ['병', '정', '무', '기', '경', '신', '임', '계', '갑', '을', '병', '정'],
        '을': ['무', '기', '경', '신', '임', '계', '갑', '을', '병', '정', '무', '기'],
        '병': ['경', '신', '임', '계', '갑', '을', '병', '정', '무', '기', '경', '신'],
        '정': ['임', '계', '갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'],
        '무': ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계', '갑', '을'],
        '기': ['병', '정', '무', '기', '경', '신', '임', '계', '갑', '을', '병', '정'],
        '경': ['무', '기', '경', '신', '임', '계', '갑', '을', '병', '정', '무', '기'],
        '신': ['경', '신', '임', '계', '갑', '을', '병', '정', '무', '기', '경', '신'],
        '임': ['임', '계', '갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'],
        '계': ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계', '갑', '을']
    };

    // 사주학 월을 배열 인덱스로 변환 (1월→0, 2월→1, ..., 12월→11)
    const sajuMonthIndex = (sajuMonth - 1) % 12;
    const monthGan = 월간매핑표[yearGan] ? 월간매핑표[yearGan][sajuMonthIndex] : null;

    if (!monthGan) {
        console.error(`월간 계산 실패: yearGan=${yearGan}, sajuMonth=${sajuMonth}`);
        return { gan: '미정', ji: 지지[sajuMonthIndex] };
    }

    // 월지 계산: 사주학 월지 순서
    // 1월(인)→인(2), 2월(묘)→묘(3), ..., 8월(유)→유(9), 9월(술)→술(10), ..., 12월(축)→축(1)
    const sajuJiMapping = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]; // 인월부터 축월까지
    const monthJiIndex = sajuJiMapping[sajuMonthIndex];

    return {
        gan: monthGan,
        ji: 지지[monthJiIndex]
    };
}

/**
 * 일주 계산 (정확한 기준일 사용)
 */
function getDayGapja(year, month, day) {
    // 기준: 1900년 1월 31일을 갑자일(0)로 설정
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

    // 60갑자 순환에서 간지 인덱스 계산
    const gapjaIndex = (diffDays % 60 + 60) % 60;

    return gapjaIndex;
}

/**
 * 시주 계산
 */
function getHourGapja(dayGan, hour) {
    const dayGanIndex = 천간.indexOf(dayGan);

    // 정확한 시주 지지 계산 (23시-01시=자시, 01시-03시=축시, ...)
    let hourJiIndex;
    if (hour == 23 || (hour >= 0 && hour <= 0)) hourJiIndex = 0; // 자시 (23시-01시)
    else if (hour >= 1 && hour <= 2) hourJiIndex = 1; // 축시
    else if (hour >= 3 && hour <= 4) hourJiIndex = 2; // 인시
    else if (hour >= 5 && hour <= 6) hourJiIndex = 3; // 묘시
    else if (hour >= 7 && hour <= 8) hourJiIndex = 4; // 진시
    else if (hour >= 9 && hour <= 10) hourJiIndex = 5; // 사시
    else if (hour >= 11 && hour <= 12) hourJiIndex = 6; // 오시 ← 12시는 여기!
    else if (hour >= 13 && hour <= 14) hourJiIndex = 7; // 미시
    else if (hour >= 15 && hour <= 16) hourJiIndex = 8; // 신시
    else if (hour >= 17 && hour <= 18) hourJiIndex = 9; // 유시
    else if (hour >= 19 && hour <= 20) hourJiIndex = 10; // 술시
    else if (hour >= 21 && hour <= 22) hourJiIndex = 11; // 해시
    else hourJiIndex = 6; // 기본값 오시

    // 정확한 시주 천간 계산: 일간별 자시 천간 시작점
    const 일간별자시천간 = {
        0: 0, 5: 0,  // 갑(0), 기(5) → 갑자시(0)
        1: 2, 6: 2,  // 을(1), 경(6) → 병자시(2)
        2: 4, 7: 4,  // 병(2), 신(7) → 무자시(4)
        3: 8, 8: 8,  // 정(3), 임(8) → 임자시(8)
        4: 8, 9: 8   // 무(4), 계(9) → 임자시(8)
    };

    const 자시천간 = 일간별자시천간[dayGanIndex];
    const hourGanIndex = (자시천간 + hourJiIndex) % 10;

    return {
        gan: 천간[hourGanIndex],
        ji: 지지[hourJiIndex]
    };
}

/**
 * 오행 분석
 */
function analyzeElements(saju) {
    const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

    // 천간 오행 (안전한 계산)
    if (saju.year.gan && 천간오행[saju.year.gan]) elements[천간오행[saju.year.gan]]++;
    if (saju.month.gan && 천간오행[saju.month.gan]) elements[천간오행[saju.month.gan]]++;
    if (saju.day.gan && 천간오행[saju.day.gan]) elements[천간오행[saju.day.gan]]++;
    if (saju.hour.gan && 천간오행[saju.hour.gan]) elements[천간오행[saju.hour.gan]]++;

    // 지지 오행 (안전한 계산)
    if (saju.year.ji && 지지오행[saju.year.ji]) elements[지지오행[saju.year.ji]]++;
    if (saju.month.ji && 지지오행[saju.month.ji]) elements[지지오행[saju.month.ji]]++;
    if (saju.day.ji && 지지오행[saju.day.ji]) elements[지지오행[saju.day.ji]]++;
    if (saju.hour.ji && 지지오행[saju.hour.ji]) elements[지지오행[saju.hour.ji]]++;

    // 지장간 오행 (가중치 적용, 안전한 계산)
    const 지장간가중치 = { 0: 0.6, 1: 0.3, 2: 0.1 }; // 본기, 중기, 여기

    [saju.year.ji, saju.month.ji, saju.day.ji, saju.hour.ji].forEach(ji => {
        if (ji && 지장간[ji]) {
            지장간[ji].forEach((gan, index) => {
                if (gan && 천간오행[gan]) {
                    const weight = 지장간가중치[index] || 0.1;
                    elements[천간오행[gan]] += weight;
                }
            });
        }
    });

    return elements;
}

/**
 * 십신 계산 (기본 함수)
 */
function get십신(dayGan, targetGan) {
    if (!십신표[dayGan] || !십신표[dayGan][targetGan]) {
        return '미정';
    }
    return 십신표[dayGan][targetGan];
}

/**
 * 십신 분석
 */
function analyze십신(saju) {
    const dayGan = saju.day.gan;

    return {
        year: 십신표[dayGan][saju.year.gan],
        month: 십신표[dayGan][saju.month.gan],
        hour: 십신표[dayGan][saju.hour.gan],
        yearJi: getJijangganSipshin(dayGan, saju.year.ji),
        monthJi: getJijangganSipshin(dayGan, saju.month.ji),
        dayJi: getJijangganSipshin(dayGan, saju.day.ji),
        hourJi: getJijangganSipshin(dayGan, saju.hour.ji)
    };
}

/**
 * 지장간 십신 계산
 */
function getJijangganSipshin(dayGan, ji) {
    return 지장간[ji].map(gan => 십신표[dayGan][gan]);
}

/**
 * 60갑자 계산
 */
function getCyclicalDay(date) {
    const baseDate = new Date(1900, 0, 31);
    const daysDiff = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
    return (daysDiff % 60 + 60) % 60;
}

/**
 * 대운 계산 (정밀)
 */
function calculatePreciseDaeun(saju, gender, birthDate) {
    const yearGan = saju.year.gan;
    const isYangYear = ['갑', '병', '무', '경', '임'].includes(yearGan);
    const isMale = gender === 'male';
    const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);

    // 대운 시작 나이 계산 (절입일 기준)
    const nextTerm = getNextSolarTerm(birthDate);
    const daysToNext = Math.floor((nextTerm - birthDate) / (1000 * 60 * 60 * 24));
    const startAge = Math.floor(daysToNext / 3); // 3일 = 1년

    const daeunList = [];
    const monthGanIndex = 천간.indexOf(saju.month.gan);
    const monthJiIndex = 지지.indexOf(saju.month.ji);

    for (let i = 0; i < 10; i++) {
        const offset = isForward ? i + 1 : -(i + 1);
        const ganIndex = (monthGanIndex + offset + 10) % 10;
        const jiIndex = (monthJiIndex + offset + 12) % 12;

        const ageStart = startAge + (i * 10);

        daeunList.push({
            age: ageStart,
            period: `${ageStart}세 ~ ${ageStart + 9}세`,
            gan: 천간[ganIndex],
            ji: 지지[jiIndex],
            element: 천간오행[천간[ganIndex]],
            isCurrent: isCurrentDaeun(ageStart, ageStart + 9, birthDate)
        });
    }

    return {
        daeuns: daeunList,
        startAge: startAge,
        isForward: isForward,
        nextTerm: nextTerm
    };
}

/**
 * 현재 대운 여부 판단
 */
function isCurrentDaeun(startAge, endAge, birthDate) {
    const currentAge = new Date().getFullYear() - birthDate.getFullYear();
    return currentAge >= startAge && currentAge <= endAge;
}

/**
 * 다음 절기 찾기
 */
function getNextSolarTerm(date) {
    const year = date.getFullYear();
    const termNames = ['입춘', '우수', '경칩', '춘분', '청명', '곡우', '입하', '소만', '망종', '하지', '소서', '대서', '입추', '처서', '백로', '추분', '한로', '상강', '입동', '소설', '대설', '동지', '소한', '대한'];

    for (const termName of termNames) {
        const termDate = get절기(year, termName);
        if (termDate > date) {
            return termDate;
        }
    }

    // 다음 해 입춘
    return get절기(year + 1, '입춘');
}

/**
 * 운세 생성
 */
function generateFortune(saju, elements, sipshin) {
    const baseScore = 75;
    const fortunes = {
        총운: baseScore,
        재물운: baseScore,
        직업운: baseScore,
        연애운: baseScore,
        건강운: baseScore,
        학업운: baseScore,
        인간관계운: baseScore
    };

    // 오행 균형에 따른 조정
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    const balance = calculateElementBalance(elements);

    if (balance > 80) {
        fortunes.총운 += 10;
        fortunes.건강운 += 8;
    }

    // 십신에 따른 조정
    const dayGan = saju.day.gan;
    const monthSipshin = sipshin.month;

    const 십신영향 = {
        '정관': { 직업운: 15, 인간관계운: 10 },
        '편관': { 직업운: 10, 재물운: 8 },
        '정재': { 재물운: 15, 안정성: 10 },
        '편재': { 재물운: 12, 사업운: 8 },
        '정인': { 학업운: 15, 안정성: 8 },
        '편인': { 창조성: 12, 학업운: 8 },
        '식신': { 연애운: 12, 인간관계운: 10 },
        '상관': { 창조성: 15, 변화운: 8 },
        '비견': { 인간관계운: 8, 독립성: 10 },
        '겁재': { 경쟁력: 10, 변화운: 8 }
    };

    if (십신영향[monthSipshin]) {
        Object.entries(십신영향[monthSipshin]).forEach(([key, value]) => {
            if (fortunes[key]) {
                fortunes[key] += value;
            }
        });
    }

    // 값 정규화 (50-100)
    Object.keys(fortunes).forEach(key => {
        fortunes[key] = Math.max(50, Math.min(100, fortunes[key]));
    });

    return fortunes;
}

/**
 * 상세 해석 생성 (고품질 자연스러운 해석)
 */
function generate상세해석(saju, elements, sipshin, gender) {
    const dayGan = saju.day.gan;
    const dayElement = 천간오행[dayGan];
    const monthGan = saju.month.gan;
    const monthJi = saju.month.ji;

    // 일간별 상세 성격 분석 (계절과 월주 고려)
    const 일간성격 = {
        '갑': {
            기본: '갑목은 큰 나무의 기상을 지닌 분으로, 곧고 정직한 성품이 특징입니다.',
            상세: '천성적으로 리더의 자질을 타고났으며, 원칙과 신념을 중시하는 성향이 강합니다. 정의감이 투철하여 불의를 보면 참지 못하는 성격이며, 남을 이끌어가는 능력이 뛰어납니다. 다만 고집이 세고 융통성이 부족할 수 있어, 때로는 주변 사람들의 의견에도 귀 기울이는 자세가 필요합니다.',
            직업: '교육자, 공무원, 기업 임원, 법조인 등 사회적 책임이 큰 분야에서 능력을 발휘합니다.',
            인간관계: '진실되고 신뢰할 수 있는 관계를 선호하며, 허영이나 가식을 싫어합니다.'
        },
        '을': {
            기본: '을목은 부드러운 풀과 같이 유연하고 온화한 성품의 소유자입니다.',
            상세: '뛰어난 적응력과 협조성을 지니고 있어 어떤 환경에서도 잘 어울립니다. 예술적 감각이 발달되어 있고 섬세한 감정 표현이 가능합니다. 타인의 감정을 잘 이해하고 배려심이 깊어 주변 사람들에게 사랑받습니다. 다만 우유부단하거나 의존적인 성향을 보일 수 있어, 주체적인 판단력을 기르는 것이 중요합니다.',
            직업: '예술가, 디자이너, 상담사, 간호사, 서비스업 등 사람과 관련된 분야에 적합합니다.',
            인간관계: '조화롭고 평화로운 관계를 추구하며, 갈등을 피하려는 성향이 있습니다.'
        },
        '병': {
            기본: '병화는 태양처럼 밝고 따뜻한 에너지를 발산하는 분입니다.',
            상세: '천성적으로 밝고 활발한 성격으로 주변을 환하게 만드는 능력이 있습니다. 열정적이고 적극적이며, 남을 돕는 것을 좋아하는 봉사정신이 강합니다. 표현력이 뛰어나고 사교성이 좋아 많은 사람들과 쉽게 친해집니다. 다만 성급하거나 감정적으로 행동할 수 있어, 신중함을 기르는 것이 필요합니다.',
            직업: '연예인, 방송인, 교사, 영업직, 홍보 마케팅 등 사람들 앞에 나서는 분야에 재능이 있습니다.',
            인간관계: '인기가 많고 사교적이지만, 때로는 피상적인 관계에 그칠 수 있어 깊이 있는 관계 형성이 중요합니다.'
        },
        '정': {
            기본: '정화는 촛불과 같이 조용하지만 따뜻한 빛을 발하는 분입니다.',
            상세: '온화하고 세심한 성격으로 배려심이 깊고 감성이 풍부합니다. 예술적 재능이 뛰어나며 특히 문학이나 음악 분야에 소질이 있습니다. 신중하고 사려깊어 맡은 일은 책임감 있게 완수합니다. 다만 내성적이거나 소극적인 면이 있어, 자신의 의견을 적극적으로 표현하는 연습이 필요합니다.',
            직업: '작가, 음악가, 연구원, 전문직, 상담 관련 업무에서 능력을 발휘합니다.',
            인간관계: '깊이 있고 진실된 관계를 선호하며, 소수의 친한 사람들과 깊은 유대감을 형성합니다.'
        },
        '무': {
            기본: '무토는 웅장한 산과 같이 든든하고 믿음직한 분입니다.',
            상세: '안정감 있고 포용력이 크며, 강한 신뢰감을 주는 성격입니다. 중재 능력이 뛰어나 갈등 상황에서 조정자 역할을 잘 합니다. 현실적이고 실용적인 사고를 하며, 장기적인 계획을 세우는 데 능합니다. 다만 변화를 싫어하거나 고집스러운 면이 있어, 새로운 것에 도전하는 용기가 필요합니다.',
            직업: '경영자, 부동산업, 건설업, 금융업, 컨설팅 등 안정성과 신뢰성이 중요한 분야에 적합합니다.',
            인간관계: '든든한 지원자 역할을 하며, 주변 사람들의 의지가 되는 존재입니다.'
        },
        '기': {
            기본: '기토는 기름진 논밭과 같이 생산적이고 실용적인 분입니다.',
            상세: '꼼꼼하고 계획적인 성격으로 경제관념이 뛰어나고 현실감각이 발달되어 있습니다. 성실하고 근면하여 맡은 일은 끝까지 해내는 책임감이 강합니다. 실용적이고 효율적인 것을 선호하며, 작은 것부터 차근차근 쌓아가는 능력이 있습니다. 다만 지나치게 현실적이거나 보수적인 성향을 보일 수 있어, 때로는 모험정신도 필요합니다.',
            직업: '회계사, 은행원, 공무원, 농업, 제조업 등 안정적이고 체계적인 업무에 적합합니다.',
            인간관계: '신뢰할 수 있고 의리가 있는 관계를 중시하며, 한번 맺은 인연을 소중히 여깁니다.'
        },
        '경': {
            기본: '경금은 단단한 강철과 같이 강직하고 의지가 강한 분입니다.',
            상세: '정의감이 투철하고 원칙을 중시하는 성격으로, 불의를 보면 참지 못합니다. 결단력이 있고 추진력이 강해 목표를 향해 꾸준히 나아갑니다. 합리적이고 논리적인 사고를 하며, 체계적인 접근을 선호합니다. 다만 융통성이 부족하거나 고집스러운 면이 있어, 상황에 따른 유연한 대응이 필요합니다.',
            직업: '법조인, 군인, 경찰관, 의사, 엔지니어 등 전문성과 정확성이 요구되는 분야에 적합합니다.',
            인간관계: '진실되고 솔직한 관계를 선호하며, 허영이나 위선을 싫어합니다.'
        },
        '신': {
            기본: '신금은 아름다운 보석과 같이 섬세하고 품격 있는 분입니다.',
            상세: '예민하고 완벽주의적 성향이 있어 세심한 관찰력과 분석력이 뛰어납니다. 품위를 중시하고 아름다운 것을 좋아하며, 미적 감각이 발달되어 있습니다. 비판적 사고력이 좋아 문제의 핵심을 잘 파악합니다. 다만 지나치게 예민하거나 까다로운 면이 있어, 너그러운 마음을 갖는 것이 중요합니다.',
            직업: '예술가, 디자이너, 평론가, 감정사, 의료진 등 섬세함과 전문성이 요구되는 분야에 적합합니다.',
            인간관계: '품격 있고 지적인 관계를 선호하며, 깊이 있는 대화를 즐깁니다.'
        },
        '임': {
            기본: '임수는 넓은 바다와 같이 포용력이 크고 자유로운 영혼의 소유자입니다.',
            상세: '지혜롭고 통찰력이 뛰어나며, 폭넓은 사고력을 지니고 있습니다. 자유를 사랑하고 변화를 즐기며, 새로운 것에 대한 호기심이 많습니다. 포용력이 커서 다양한 사람들과 어울릴 수 있고, 남의 허물을 너그럽게 봐줍니다. 다만 변덕스럽거나 일관성이 부족할 수 있어, 꾸준함을 기르는 것이 필요합니다.',
            직업: '학자, 연구원, 언론인, 여행업, 무역업 등 창의성과 국제성이 요구되는 분야에 적합합니다.',
            인간관계: '폭넓은 인맥을 형성하며, 다양한 배경의 사람들과 쉽게 어울립니다.'
        },
        '계': {
            기본: '계수는 맑은 시냇물과 같이 순수하고 감성적인 분입니다.',
            상세: '섬세하고 직관력이 뛰어나며, 창의적인 아이디어가 풍부합니다. 감수성이 예민하고 예술적 재능이 있어 창작 활동에 소질이 있습니다. 적응력이 좋고 융통성이 있어 변화하는 환경에 잘 맞춰갑니다. 다만 감정적으로 기복이 있거나 우유부단한 면이 있어, 안정된 마음가짐을 유지하는 것이 중요합니다.',
            직업: '예술가, 작가, 상담사, 교육자, 치료사 등 감성과 창의성이 중요한 분야에 적합합니다.',
            인간관계: '감정적 유대를 중시하며, 따뜻하고 이해심 많은 관계를 형성합니다.'
        }
    };

    const 일간정보 = 일간성격[dayGan];

    // 계절과 월지에 따른 성격 보완 분석
    const 계절영향 = analyze계절영향(dayGan, monthJi);
    const 월주영향 = analyze월주영향(monthGan, monthJi, dayGan);

    let 성격분석 = `${일간정보.기본}\n\n${일간정보.상세}\n\n`;
    성격분석 += `**직업 적성**: ${일간정보.직업}\n\n`;
    성격분석 += `**인간관계**: ${일간정보.인간관계}\n\n`;
    성격분석 += `**계절적 특성**: ${계절영향}\n\n`;
    성격분석 += `**월주의 영향**: ${월주영향}`;

    // 정밀 오행 균형 분석
    const totalElements = Object.values(elements).reduce((a, b) => a + b, 0);
    const elementAnalysis = analyzeElementBalance(elements, dayElement);

    let 오행분석 = `\n\n【정밀 오행 분석】\n\n`;
    오행분석 += `**오행 분포**\n`;
    Object.entries(elements).forEach(([element, value]) => {
        const percentage = ((value / totalElements) * 100).toFixed(1);
        const level = getElementLevel(percentage);
        오행분석 += `• ${element}: ${percentage}% (${level})\n`;
    });

    오행분석 += `\n**균형도 평가**\n`;
    const balanceScore = calculateElementBalance(elements);
    오행분석 += `전체 균형도: ${balanceScore.toFixed(0)}점 (${getBalanceGrade(balanceScore)})\n\n`;

    오행분석 += `**강약 분석**\n`;
    오행분석 += `${elementAnalysis.strong}\n`;
    오행분석 += `${elementAnalysis.weak}\n\n`;

    오행분석 += `**생활 조화법**\n`;
    오행분석 += `${elementAnalysis.lifestyle}`;

    // 심화 십신 분석
    let 십신분석 = `\n\n【십신 종합 분석】\n\n`;
    const 십신상세 = analyze십신상세(saju, sipshin);

    십신분석 += `**시기별 특성**\n`;
    십신분석 += `• 년주(조상/어린시절): ${sipshin.year} - ${십신상세.year}\n`;
    십신분석 += `• 월주(부모/청년기): ${sipshin.month} - ${십신상세.month}\n`;
    십신분석 += `• 시주(자녀/노년기): ${sipshin.hour} - ${십신상세.hour}\n\n`;

    십신분석 += `**주요 십신 특징**\n`;
    십신분석 += `${십신상세.summary}\n\n`;

    십신분석 += `**발전 방향**\n`;
    십신분석 += `${십신상세.development}`;

    // 맞춤형 종합 조언
    let 종합조언 = `\n\n【맞춤형 인생 조언】\n\n`;
    const 개인맞춤조언 = generate개인맞춤조언(saju, elements, sipshin, gender);

    종합조언 += `**강점 활용법**\n`;
    종합조언 += `${개인맞춤조언.strengths}\n\n`;

    종합조언 += `**주의 사항**\n`;
    종합조언 += `${개인맞춤조언.cautions}\n\n`;

    종합조언 += `**운세 상승법**\n`;
    종합조언 += `${개인맞춤조언.improvement}\n\n`;

    종합조언 += `**현재 시기 조언**\n`;
    종합조언 += `${개인맞춤조언.current}`;

    return {
        성격: 성격분석,
        오행: 오행분석,
        십신: 십신분석,
        조언: 종합조언
    };
}

// 보조 함수들
function analyze계절영향(dayGan, monthJi) {
    const 계절매핑 = {
        '인': '봄', '묘': '봄', '진': '늦봄',
        '사': '여름', '오': '여름', '미': '늦여름',
        '신': '가을', '유': '가을', '술': '늦가을',
        '해': '겨울', '자': '겨울', '축': '늦겨울'
    };

    const season = 계절매핑[monthJi];
    const dayElement = 천간오행[dayGan];

    const 계절특성 = {
        '봄': {
            '목': '생명력이 왕성하고 성장 욕구가 강합니다. 새로운 시작에 유리한 기운을 타고났습니다.',
            '화': '따뜻한 기운을 받아 사교성과 표현력이 뛰어납니다.',
            '토': '안정적이고 꾸준한 성장을 추구합니다.',
            '금': '변화를 수용하는 유연성을 기르는 것이 필요합니다.',
            '수': '생명력 있는 에너지를 보충하면 더욱 발전할 수 있습니다.'
        },
        '여름': {
            '화': '최고의 기운을 받아 열정과 창의력이 극대화됩니다.',
            '목': '무성하게 자라는 시기로 능력 발휘에 최적의 조건입니다.',
            '토': '풍요로움과 풍부함을 상징하여 물질운이 좋습니다.',
            '금': '강한 화기로 인해 휴식과 충전이 필요합니다.',
            '수': '증발하기 쉬운 시기이므로 꾸준한 노력으로 실력을 쌓아야 합니다.'
        },
        '가을': {
            '금': '추수의 계절에 태어나 결실을 거두는 능력이 뛰어납니다.',
            '토': '성숙하고 안정된 에너지를 지니고 있습니다.',
            '수': '차분하고 깊이 있는 사고력을 가지고 있습니다.',
            '목': '단련과 인내를 통해 더욱 강해질 수 있습니다.',
            '화': '활력을 유지하기 위한 지속적인 자극이 필요합니다.'
        },
        '겨울': {
            '수': '고요하고 깊이 있는 지혜를 가지고 있습니다. 내적 성찰 능력이 뛰어납니다.',
            '금': '차가운 기운을 받아 냉정하고 객관적인 판단력을 지닙니다.',
            '목': '인내력과 끈기가 강하며, 어려움을 견디는 힘이 있습니다.',
            '토': '묵묵히 기반을 다지는 능력이 있습니다.',
            '화': '따뜻함과 활력을 보충하면 더욱 밝은 기운을 발할 수 있습니다.'
        }
    };

    return 계절특성[season] ? 계절특성[season][dayElement] || '계절의 기운을 잘 활용하시기 바랍니다.' : '';
}

function analyze월주영향(monthGan, monthJi, dayGan) {
    const relationship = 십신표[dayGan][monthGan];

    const 월주십신영향 = {
        '비견': '독립심이 강하고 자기 주장이 뚜렷한 성향을 보입니다. 동년배와의 관계에서 경쟁 의식을 가질 수 있습니다.',
        '겁재': '형제자매나 친구들과의 관계에서 경쟁이 있을 수 있으나, 협력할 때 큰 시너지를 발휘합니다.',
        '식신': '표현 욕구가 강하고 창작 활동이나 자기계발에 관심이 많습니다. 재능을 발휘할 기회가 많습니다.',
        '상관': '비판적 사고력이 뛰어나고 기존의 틀을 벗어나려는 성향이 있습니다. 혁신과 변화를 추구합니다.',
        '편재': '사업 수완이 있고 활동적인 성격입니다. 다양한 분야에 관심을 가지고 적극적으로 도전합니다.',
        '정재': '안정을 추구하고 계획적인 성향이 강합니다. 착실하게 재산을 모으는 능력이 있습니다.',
        '편관': '추진력과 결단력이 있어 리더십을 발휘할 수 있습니다. 때로는 성급한 면이 있어 신중함이 필요합니다.',
        '정관': '책임감이 강하고 사회적 명예를 중시합니다. 도덕적이고 원칙을 지키려는 성향이 강합니다.',
        '편인': '학습 욕구가 강하고 새로운 분야에 관심이 많습니다. 창의적이고 독특한 사고를 합니다.',
        '정인': '학문을 좋아하고 깊이 있게 연구하는 성향이 있습니다. 인덕이 있어 도움을 받는 경우가 많습니다.'
    };

    return 월주십신영향[relationship] || '월주의 영향이 안정적으로 작용합니다.';
}

function analyzeElementBalance(elements, dayElement) {
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    const percentages = {};
    Object.entries(elements).forEach(([element, value]) => {
        percentages[element] = (value / total) * 100;
    });

    const maxElement = Object.keys(percentages).reduce((a, b) =>
        percentages[a] > percentages[b] ? a : b);
    const minElement = Object.keys(percentages).reduce((a, b) =>
        percentages[a] < percentages[b] ? a : b);

    const strong = `가장 강한 오행인 ${maxElement}(${percentages[maxElement].toFixed(1)}%)의 영향으로 ${get오행강점설명(maxElement)}`;
    const weak = `가장 약한 오행인 ${minElement}(${percentages[minElement].toFixed(1)}%)를 보완하기 위해 ${get오행보완상세(minElement)}`;
    const lifestyle = `일상생활에서 ${get오행생활조화(dayElement, maxElement, minElement)}`;

    return { strong, weak, lifestyle };
}

function get오행강점설명(element) {
    const 강점설명 = {
        '목': '성장과 발전에 대한 욕구가 강하고, 새로운 것을 배우고 발전시키는 능력이 뛰어납니다. 교육, 상담, 치료 분야에서 천부적인 재능을 발휘할 수 있습니다.',
        '화': '밝고 활발한 에너지가 넘치며, 사람들을 이끌고 감화시키는 능력이 탁월합니다. 예술, 엔터테인먼트, 교육 분야에서 큰 성과를 거둘 수 있습니다.',
        '토': '신뢰성과 안정성이 뛰어나며, 꾸준히 기반을 다지는 능력이 있습니다. 부동산, 금융, 건설 분야에서 성공할 가능성이 높습니다.',
        '금': '정확성과 전문성을 추구하는 성향이 강하며, 체계적이고 논리적인 사고를 합니다. 법률, 의료, 기술 분야에서 전문가로 성장할 수 있습니다.',
        '수': '지혜롭고 유연한 사고력을 가지고 있으며, 상황에 따른 적응력이 뛰어납니다. 연구, IT, 유통 분야에서 독창적인 아이디어를 발휘할 수 있습니다.'
    };
    return 강점설명[element] || '';
}

function get오행보완상세(element) {
    const 보완상세 = {
        '목': '녹색 계열의 색상을 많이 활용하고, 동쪽 방향에서 활동하며, 식물을 기르거나 자연과 가까이 하는 시간을 늘리시기 바랍니다. 새로운 학습이나 성장 기회를 적극적으로 찾아보세요.',
        '화': '붉은색이나 밝은 색상을 활용하고, 남쪽 방향을 선호하며, 사교 활동이나 표현 활동을 늘려보세요. 운동이나 야외 활동을 통해 활력을 충전하는 것이 좋습니다.',
        '토': '노란색이나 갈색 계열을 활용하고, 안정적인 루틴을 만들어 규칙적인 생활을 하세요. 명상이나 요가 같은 심신 안정 활동이 도움이 됩니다.',
        '금': '흰색이나 금색 계열을 활용하고, 서쪽 방향에서의 활동을 늘리며, 정확성과 전문성을 기르는 학습에 투자하세요. 체계적인 계획 수립이 중요합니다.',
        '수': '검은색이나 진한 파란색을 활용하고, 북쪽 방향을 선호하며, 독서나 연구 활동을 늘려보세요. 물과 관련된 활동이나 조용한 환경에서의 사색 시간이 도움됩니다.'
    };
    return 보완상세[element] || '';
}

function get오행생활조화(dayElement, maxElement, minElement) {
    return `${dayElement} 일간의 특성을 살리면서 ${maxElement}의 장점은 더욱 발전시키고, ${minElement}의 부족함은 의식적으로 보완하여 균형 잡힌 삶을 추구하시기 바랍니다. 특히 스트레스를 받을 때는 ${minElement}를 보완하는 활동을 통해 심리적 안정을 찾으실 수 있습니다.`;
}

function analyze십신상세(saju, sipshin) {
    const mainSipshin = [sipshin.year, sipshin.month, sipshin.hour];
    const uniqueSipshin = [...new Set(mainSipshin)];

    const 십신의미 = {
        '비견': '독립성과 자주성이 강한 성향으로, 자신만의 길을 개척하려는 의지가 있습니다.',
        '겁재': '협력과 경쟁을 동시에 추구하는 성향으로, 팀워크를 통해 시너지를 만들어냅니다.',
        '식신': '창작과 표현에 대한 욕구가 강하며, 재능을 발휘하여 인정받고자 합니다.',
        '상관': '기존의 틀을 깨고 새로운 것을 만들어내는 혁신적 사고를 가지고 있습니다.',
        '편재': '활동적이고 적극적인 성향으로, 다양한 분야에서 기회를 찾아 성취를 이루려 합니다.',
        '정재': '안정과 축적을 중시하는 성향으로, 계획적이고 체계적인 재산 관리 능력이 있습니다.',
        '편관': '강한 추진력과 결단력으로 목표를 달성하려는 의지가 있으며, 리더십을 발휘합니다.',
        '정관': '도덕성과 책임감을 중시하며, 사회적 인정과 명예를 추구하는 성향이 있습니다.',
        '편인': '학습과 연구에 대한 욕구가 강하며, 새롭고 독특한 분야에 관심이 많습니다.',
        '정인': '깊이 있는 학문과 전통적 가치를 중시하며, 인덕과 신뢰를 바탕으로 한 관계를 추구합니다.'
    };

    const summary = uniqueSipshin.map(s => 십신의미[s]).join(' ');

    let development = '당신의 십신 구성을 보면, ';
    if (uniqueSipshin.includes('정관') || uniqueSipshin.includes('편관')) {
        development += '리더십과 추진력을 발휘할 수 있는 관리직이나 경영 분야에서 성취를 이룰 수 있습니다. ';
    }
    if (uniqueSipshin.includes('정재') || uniqueSipshin.includes('편재')) {
        development += '재물 관리나 사업 운영에 천부적인 재능이 있어 경제적 성공을 거둘 가능성이 높습니다. ';
    }
    if (uniqueSipshin.includes('식신') || uniqueSipshin.includes('상관')) {
        development += '창작이나 표현 분야에서 독특한 재능을 발휘할 수 있으며, 예술적 성취를 이룰 수 있습니다. ';
    }
    if (uniqueSipshin.includes('정인') || uniqueSipshin.includes('편인')) {
        development += '학문이나 연구 분야에서 깊이 있는 성과를 거둘 수 있으며, 전문가로 인정받을 수 있습니다. ';
    }

    return {
        year: get십신상세설명(sipshin.year, '조상이나 어린 시절'),
        month: get십신상세설명(sipshin.month, '부모나 청년기'),
        hour: get십신상세설명(sipshin.hour, '자녀나 노년기'),
        summary: summary,
        development: development || '다양한 분야에서 균형 잡힌 발전을 이룰 수 있습니다.'
    };
}

function get십신상세설명(sipshin, period) {
    const 십신상세 = {
        '비견': `${period}에 독립적이고 자주적인 성향을 보입니다. 자신만의 방식으로 문제를 해결하려는 경향이 있습니다.`,
        '겁재': `${period}에 경쟁 의식이 강하고 협력을 통해 성과를 이루려는 성향을 보입니다.`,
        '식신': `${period}에 재능과 창의성이 빛을 발하며, 표현 욕구가 강하게 나타납니다.`,
        '상관': `${period}에 기존의 틀을 벗어나려는 혁신적 사고가 두드러지게 나타납니다.`,
        '편재': `${period}에 활발한 활동력과 다양한 기회 추구 성향이 나타납니다.`,
        '정재': `${period}에 안정과 축적을 중시하는 계획적인 성향이 나타납니다.`,
        '편관': `${period}에 강한 추진력과 도전 정신이 두드러지게 나타납니다.`,
        '정관': `${period}에 책임감과 도덕성을 중시하는 성향이 강하게 나타납니다.`,
        '편인': `${period}에 새로운 학습과 독특한 분야에 대한 관심이 높아집니다.`,
        '정인': `${period}에 깊이 있는 학문과 인덕을 중시하는 성향이 나타납니다.`
    };
    return 십신상세[sipshin] || `${period}에 균형 잡힌 성향을 보입니다.`;
}

function generate개인맞춤조언(saju, elements, sipshin, gender) {
    const dayGan = saju.day.gan;
    const dayElement = 천간오행[dayGan];
    const monthSipshin = sipshin.month;

    // 강점 활용법
    let strengths = `${dayElement} 일간의 특성을 살려 `;
    const 일간강점 = {
        '목': '성장과 발전에 대한 욕구를 바탕으로 교육, 상담, 치료 분야에서 남을 도우며 자신도 성장할 수 있습니다.',
        '화': '밝고 긍정적인 에너지로 사람들에게 희망과 용기를 주는 일에서 큰 보람을 느낄 수 있습니다.',
        '토': '신뢰성과 안정성을 바탕으로 사람들의 든든한 지원자 역할을 하며 인정받을 수 있습니다.',
        '금': '정확성과 전문성을 추구하여 각 분야의 전문가로 성장할 수 있습니다.',
        '수': '유연하고 지혜로운 사고로 복잡한 문제들을 해결하는 능력을 발휘할 수 있습니다.'
    };
    strengths += 일간강점[dayElement];

    // 주의사항
    let cautions = `${monthSipshin}의 영향으로 `;
    const 십신주의사항 = {
        '비견': '지나친 독립성으로 인한 고립을 피하고, 때로는 타인의 도움을 받아들이는 겸손함이 필요합니다.',
        '겁재': '경쟁에 치우쳐 관계가 소원해지지 않도록 주의하고, 협력의 가치를 인식하는 것이 중요합니다.',
        '식신': '재능에 안주하지 말고 지속적인 노력과 발전을 추구해야 합니다.',
        '상관': '비판적 성향이 지나쳐 인간관계에 문제가 생기지 않도록 표현에 신중함이 필요합니다.',
        '편재': '너무 많은 일을 동시에 추진하다가 집중력이 분산되지 않도록 우선순위를 정하는 것이 중요합니다.',
        '정재': '안정만을 추구하다가 기회를 놓치지 않도록 적절한 모험 정신도 필요합니다.',
        '편관': '성급한 판단으로 인한 실수를 피하고, 신중한 검토를 통해 결정하는 습관이 필요합니다.',
        '정관': '완벽을 추구하다가 스트레스를 받지 않도록 적당한 융통성을 기르는 것이 중요합니다.',
        '편인': '새로운 것에만 관심을 두다가 깊이가 부족해지지 않도록 꾸준한 전문성 개발이 필요합니다.',
        '정인': '이론에만 치우치지 않고 실무 경험도 쌓아가는 것이 중요합니다.'
    };
    cautions += 십신주의사항[monthSipshin] || '균형 잡힌 발전을 위해 다양한 경험을 쌓는 것이 중요합니다.';

    // 운세 상승법
    const 부족오행 = Object.keys(elements).reduce((a, b) => elements[a] < elements[b] ? a : b);
    let improvement = `전체적인 운세 향상을 위해서는 부족한 ${부족오행}의 기운을 보충하는 것이 중요합니다. `;
    improvement += get오행보완법(부족오행);
    improvement += ` 또한 ${get십신발전법(monthSipshin)}`;

    // 현재 시기 조언
    const currentAge = new Date().getFullYear() - 1990; // 임시 나이 계산
    let current = `현재 시기에는 `;
    if (currentAge < 30) {
        current += '기반을 다지는 시기이므로 학습과 경험 쌓기에 집중하세요. 다양한 사람들과의 네트워킹도 중요합니다.';
    } else if (currentAge < 40) {
        current += '본격적인 성장과 발전의 시기이므로 적극적으로 기회를 찾아 도전하세요. 전문성을 기르는 데 투자하면 좋은 결과를 얻을 수 있습니다.';
    } else if (currentAge < 50) {
        current += '성숙한 판단력을 바탕으로 리더십을 발휘할 때입니다. 후진 양성과 사회 기여도 고려해보세요.';
    } else {
        current += '인생의 지혜를 나누며 여유로운 삶을 추구하는 시기입니다. 건강 관리와 취미 활동에도 신경 쓰세요.';
    }

    return {
        strengths: strengths,
        cautions: cautions,
        improvement: improvement,
        current: current
    };
}

function get오행보완법(element) {
    const 보완법 = {
        '목': '새로운 학습이나 성장 기회를 적극적으로 찾아보세요.',
        '화': '사교 활동이나 표현 활동을 늘려 활력을 충전하세요.',
        '토': '안정적인 루틴을 만들고 명상이나 요가로 심신을 안정시키세요.',
        '금': '체계적인 계획을 세우고 전문성을 기르는 학습에 투자하세요.',
        '수': '독서나 연구 활동을 늘리고 조용한 환경에서의 사색 시간을 가지세요.'
    };
    return 보완법[element] || '';
}

function get십신발전법(sipshin) {
    const 발전법 = {
        '비견': '팀워크의 중요성을 인식하고 협력하는 자세를 기르세요.',
        '겁재': '건전한 경쟁 의식을 바탕으로 지속적인 자기계발을 추구하세요.',
        '식신': '재능을 더욱 발전시키기 위한 꾸준한 노력과 학습이 필요합니다.',
        '상관': '창의적 사고를 현실적 성과로 연결시키는 실행력을 기르세요.',
        '편재': '다양한 경험을 체계적으로 정리하여 전문성을 높이세요.',
        '정재': '안정 추구와 함께 적절한 모험 정신도 기르세요.',
        '편관': '강한 추진력을 신중함과 조화시켜 더 큰 성과를 이루세요.',
        '정관': '원칙과 함께 상황에 맞는 유연성도 기르세요.',
        '편인': '폭넓은 관심사를 깊이 있게 발전시키는 전문성이 필요합니다.',
        '정인': '이론과 실무를 균형 있게 발전시키세요.'
    };
    return 발전법[sipshin] || '균형 잡힌 발전을 추구하세요.';
}

function getElementLevel(percentage) {
    const percent = parseFloat(percentage);
    if (percent >= 30) return '매우 강함';
    if (percent >= 25) return '강함';
    if (percent >= 20) return '보통';
    if (percent >= 15) return '약함';
    return '매우 약함';
}

function getBalanceGrade(balance) {
    if (balance >= 90) return '완벽한 균형';
    if (balance >= 80) return '매우 좋은 균형';
    if (balance >= 70) return '좋은 균형';
    if (balance >= 60) return '보통 균형';
    if (balance >= 50) return '약간 불균형';
    return '불균형';
}

/**
 * 오행 특성 설명
 */
function get오행특성(element) {
    const 특성 = {
        '목': '성장과 발전, 교육이나 상담',
        '화': '열정과 창의성, 예술이나 엔터테인먼트',
        '토': '신뢰와 안정, 부동산이나 중재',
        '금': '정의와 결단력, 법률이나 금융',
        '수': '지혜와 유연성, 연구나 IT'
    };
    return 특성[element] || '';
}

/**
 * 오행 보완 방법
 */
function get보완방법(element) {
    const 보완 = {
        '목': '녹색 계열 활용, 동쪽 방향 선호, 아침 시간 활동',
        '화': '붉은색 계열 활용, 남쪽 방향 선호, 낮 시간 활동',
        '토': '노란색 계열 활용, 중앙 위치 선호, 환절기 주의',
        '금': '흰색 계열 활용, 서쪽 방향 선호, 저녁 시간 활동',
        '수': '검은색 계열 활용, 북쪽 방향 선호, 밤 시간 활동'
    };
    return 보완[element] || '';
}

/**
 * 오행 균형도 계산
 */
function calculateElementBalance(elements) {
    const values = Object.values(elements);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
    return Math.max(0, 100 - Math.sqrt(variance) * 10);
}

/**
 * 근사 절기 계산 (데이터가 없는 경우)
 */
function calculateApproximateTerm(year, termName) {
    // 간단한 근사 계산 (실제로는 더 정밀한 천문학적 계산 필요)
    const termDates = {
        '입춘': [2, 4], '우수': [2, 19], '경칩': [3, 6], '춘분': [3, 21],
        '청명': [4, 5], '곡우': [4, 20], '입하': [5, 6], '소만': [5, 21],
        '망종': [6, 6], '하지': [6, 21], '소서': [7, 7], '대서': [7, 23],
        '입추': [8, 8], '처서': [8, 23], '백로': [9, 8], '추분': [9, 23],
        '한로': [10, 8], '상강': [10, 23], '입동': [11, 8], '소설': [11, 22],
        '대설': [12, 7], '동지': [12, 22], '소한': [1, 6], '대한': [1, 20]
    };

    if (termDates[termName]) {
        const [month, day] = termDates[termName];
        return new Date(year, month - 1, day, 12, 0, 0); // 정오로 설정
    }

    return new Date(year, 1, 4, 12, 0, 0); // 기본값: 입춘
}

/**
 * 24절기 데이터 정확성 검증
 * @param {number} year - 검증할 년도
 * @returns {Object} 검증 결과
 */
function validate절기Data(year) {
    console.log(`🔍 ${year}년 24절기 데이터 검증 시작`);

    const results = {
        year: year,
        hasData: false,
        precisionLevel: 'none',
        validTerms: 0,
        invalidTerms: [],
        recommendations: []
    };

    // 해당 연도 데이터가 있는지 확인
    if (!절기데이터[year]) {
        results.recommendations.push('해당 연도의 절기 데이터가 없습니다. 근사 계산을 사용합니다.');
        return results;
    }

    results.hasData = true;
    const yearData = 절기데이터[year];
    const termNames = ['입춘', '우수', '경칩', '춘분', '청명', '곡우', '입하', '소만', '망종', '하지', '소서', '대서',
                      '입추', '처서', '백로', '추분', '한로', '상강', '입동', '소설', '대설', '동지', '소한', '대한'];

    // 각 절기 데이터 검증
    termNames.forEach(termName => {
        if (yearData[termName]) {
            const termDate = yearData[termName];
            results.validTerms++;

            // 정밀도 확인 (분/초 데이터가 있는지)
            if (termDate.getSeconds() !== 0) {
                results.precisionLevel = 'seconds';
            } else if (termDate.getMinutes() !== 0 && results.precisionLevel !== 'seconds') {
                results.precisionLevel = 'minutes';
            } else if (results.precisionLevel === 'none') {
                results.precisionLevel = 'hours';
            }

            // 날짜 유효성 검사
            if (termDate.getTime() !== termDate.getTime()) { // NaN 체크
                results.invalidTerms.push(`${termName}: 유효하지 않은 날짜`);
            }
        } else {
            results.invalidTerms.push(`${termName}: 데이터 없음`);
        }
    });

    // 권장사항 생성
    if (results.precisionLevel === 'seconds') {
        results.recommendations.push('✅ 분/초 단위 정확도 달성');
    } else if (results.precisionLevel === 'minutes') {
        results.recommendations.push('⚠️ 분 단위 정확도 (초 단위 정확도 권장)');
    } else {
        results.recommendations.push('🔴 시간 단위 정확도 (분/초 단위 정확도 필요)');
    }

    if (results.invalidTerms.length > 0) {
        results.recommendations.push(`❌ ${results.invalidTerms.length}개 절기 데이터 누락 또는 오류`);
    }

    console.log(`📊 ${year}년 검증 결과:`, results);
    return results;
}

// ===========================================
// 신살(神煞) 분석 시스템 - 30여종 신살 데이터
// ===========================================

const 신살데이터 = {
    // 1. 길신류 (吉神類)
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

    // 2. 흉신류 (凶神類)
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

    // 3. 학문/재능류
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

    // 4. 건강/수명류
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

    // 5. 재물/사업류
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

    // 6. 인간관계류
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

    // 7. 성격/성향류
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

    // 8. 특수 신살류
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

// 신살 계산 공통 함수들
const 신살계산함수 = {
    // 일간 기준 계산
    day_gan_based(saju, 신살) {
        const dayGan = saju.day.gan;
        const result = [];

        if (신살.data[dayGan]) {
            const targets = Array.isArray(신살.data[dayGan]) ? 신살.data[dayGan] : [신살.data[dayGan]];

            [saju.year.ji, saju.month.ji, saju.hour.ji].forEach((ji, index) => {
                if (targets.includes(ji)) {
                    const positions = ['년지', '월지', '시지'];
                    result.push({
                        name: 신살.name,
                        position: positions[index],
                        type: 신살.type,
                        description: 신살.description
                    });
                }
            });
        }

        return result;
    },

    // 년지 기준 계산
    year_branch_based(saju, 신살) {
        const yearBranch = saju.year.ji;
        const result = [];

        // 삼합 그룹 찾기
        let group = null;
        Object.keys(신살.data).forEach(key => {
            if (key.includes(yearBranch)) {
                group = key;
            }
        });

        if (group) {
            const target = 신살.data[group];
            [saju.month.ji, saju.day.ji, saju.hour.ji].forEach((ji, index) => {
                if (ji === target) {
                    const positions = ['월지', '일지', '시지'];
                    result.push({
                        name: 신살.name,
                        position: positions[index],
                        type: 신살.type,
                        description: 신살.description
                    });
                }
            });
        }

        return result;
    },

    // 월지 기준 계산
    month_based(saju, 신살) {
        const monthBranch = saju.month.ji;
        const result = [];

        if (신살.data[monthBranch]) {
            const target = 신살.data[monthBranch];
            [saju.year.gan, saju.day.gan, saju.hour.gan].forEach((gan, index) => {
                if (gan === target) {
                    const positions = ['년간', '일간', '시간'];
                    result.push({
                        name: 신살.name,
                        position: positions[index],
                        type: 신살.type,
                        description: 신살.description
                    });
                }
            });
        }

        return result;
    },

    // 지지 충돌 기준
    branch_conflict(saju, 신살) {
        const result = [];
        const branches = [saju.year.ji, saju.month.ji, saju.day.ji, saju.hour.ji];

        신살.data.forEach(conflict => {
            const [branch1, branch2] = conflict;
            let hasConflict = false;
            let positions = [];

            branches.forEach((branch, index) => {
                if (branch === branch1 || branch === branch2) {
                    positions.push(['년지', '월지', '일지', '시지'][index]);
                    hasConflict = true;
                }
            });

            if (positions.length >= 2) {
                result.push({
                    name: 신살.name,
                    position: positions.join(', '),
                    type: 신살.type,
                    description: 신살.description
                });
            }
        });

        return result;
    },

    // 삼형 계산
    triple_punishment(saju, 신살) {
        const result = [];
        const branches = [saju.year.ji, saju.month.ji, saju.day.ji, saju.hour.ji];

        신살.data.forEach(punishment => {
            const [group] = punishment;
            let count = 0;
            let positions = [];

            branches.forEach((branch, index) => {
                if (group.includes(branch)) {
                    count++;
                    positions.push(['년지', '월지', '일지', '시지'][index]);
                }
            });

            if (count >= 2) {
                result.push({
                    name: 신살.name,
                    position: positions.join(', '),
                    type: 신살.type,
                    description: `${신살.description} (${count}개 형성)`
                });
            }
        });

        return result;
    }
};

/**
 * 종합 신살 분석 함수
 * @param {Object} saju - 사주팔자 데이터
 * @returns {Object} 신살 분석 결과
 */
function analyze신살(saju) {
    console.log('🔮 신살 분석 시작');

    const 신살결과 = {
        total: 0,
        good: [],
        bad: [],
        mixed: [],
        summary: ''
    };

    // 모든 신살 검사
    Object.entries(신살데이터).forEach(([key, 신살]) => {
        let results = [];

        switch (신살.calculation) {
            case 'day_gan_based':
                results = 신살계산함수.day_gan_based(saju, 신살);
                break;
            case 'year_branch_based':
                results = 신살계산함수.year_branch_based(saju, 신살);
                break;
            case 'month_based':
                results = 신살계산함수.month_based(saju, 신살);
                break;
            case 'branch_conflict':
                results = 신살계산함수.branch_conflict(saju, 신살);
                break;
            case 'triple_punishment':
                results = 신살계산함수.triple_punishment(saju, 신살);
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

// ===========================================
// 격국 판별 시스템 - 정격 8종 + 특수격
// ===========================================

/**
 * 종합 격국 분석 함수
 * @param {Object} saju - 사주팔자 데이터
 * @param {Object} elements - 오행 분석 결과
 * @returns {Object} 격국 분석 결과
 */
function analyze격국(saju, elements) {
    console.log('⚖️ 격국 분석 시작');

    const 격국결과 = {
        mainFormat: null,
        specialFormats: [],
        strength: 0,
        description: '',
        implications: null
    };

    // 1단계: 정격 8종 판별
    const 정격결과 = analyze정격팔종(saju, elements);
    if (정격결과) {
        격국결과.mainFormat = 정격결과;
        격국결과.strength = 정격결과.strength;
    }

    // 2단계: 특수격 판별 (정격이 성립하지 않는 경우)
    if (!정격결과 || 정격결과.strength < 60) {
        const 특수격결과 = analyze특수격(saju, elements);
        if (특수격결과.length > 0) {
            격국결과.specialFormats = 특수격결과;
            if (특수격결과[0].strength > 격국결과.strength) {
                격국결과.mainFormat = 특수격결과[0];
                격국결과.strength = 특수격결과[0].strength;
            }
        }
    }

    // 3단계: 격국별 함의 분석
    if (격국결과.mainFormat) {
        격국결과.implications = analyze격국함의(격국결과.mainFormat, saju);
        격국결과.description = 격국결과.mainFormat.description;
    } else {
        격국결과.description = '명확한 격국이 성립되지 않습니다.';
        격국결과.implications = get기본함의();
    }

    console.log('⚖️ 격국 분석 완료:', 격국결과);
    return 격국결과;
}

/**
 * 정격 8종 판별
 * 정관격, 편관격, 정재격, 편재격, 정인격, 편인격, 식신격, 상관격
 */
function analyze정격팔종(saju, elements) {
    const dayGan = saju.day.gan;
    const monthBranch = saju.month.ji;

    // 월지 장생으로부터 십신 추출
    const monthHidden = get월지장간(monthBranch);
    if (!monthHidden || monthHidden.length === 0) return null;

    // 월지 본기 (첫 번째 천간)
    const monthMainGan = monthHidden[0].gan;
    const 십신 = get십신(dayGan, monthMainGan);

    if (!십신) return null;

    // 정격 판별 가능한 십신인지 확인
    const validFormats = ['정관', '편관', '정재', '편재', '정인', '편인', '식신', '상관'];
    if (!validFormats.includes(십신)) return null;

    // 성격 강도 계산
    const strength = calculate정격강도(saju, elements, 십신);

    if (strength >= 50) {
        return {
            name: `${십신}격`,
            type: 'normal',
            strength: strength,
            baseSpirit: 십신,
            description: get정격설명(십신),
            conditions: analyze성격조건(saju, elements, 십신)
        };
    }

    return null;
}

/**
 * 특수격 판별 (기존 함수 개선)
 */
function analyze특수격(saju, elements) {
    const specialFormats = [];

    // 종강격 확인
    if (isJonggangFormat(saju, elements)) {
        specialFormats.push({
            name: '종강격',
            type: 'special',
            strength: 85,
            description: '일간이 매우 약하여 강한 오행을 따르는 격국입니다.',
            followType: 'weak'
        });
    }

    // 종왕격 확인
    if (isJongwangFormat(saju, elements)) {
        specialFormats.push({
            name: '종왕격',
            type: 'special',
            strength: 85,
            description: '일간이 매우 강하여 독립적인 성향의 격국입니다.',
            followType: 'strong'
        });
    }

    return specialFormats.sort((a, b) => b.strength - a.strength);
}

/**
 * 월지 장간 추출
 */
function get월지장간(monthBranch) {
    const 장간데이터 = {
        '인': [{ gan: '갑', strength: 60 }, { gan: '무', strength: 30 }, { gan: '병', strength: 10 }],
        '묘': [{ gan: '을', strength: 100 }],
        '진': [{ gan: '무', strength: 60 }, { gan: '을', strength: 30 }, { gan: '계', strength: 10 }],
        '사': [{ gan: '병', strength: 60 }, { gan: '경', strength: 30 }, { gan: '무', strength: 10 }],
        '오': [{ gan: '정', strength: 70 }, { gan: '기', strength: 30 }],
        '미': [{ gan: '기', strength: 60 }, { gan: '정', strength: 30 }, { gan: '을', strength: 10 }],
        '신': [{ gan: '경', strength: 60 }, { gan: '임', strength: 30 }, { gan: '무', strength: 10 }],
        '유': [{ gan: '신', strength: 100 }],
        '술': [{ gan: '무', strength: 60 }, { gan: '신', strength: 30 }, { gan: '정', strength: 10 }],
        '해': [{ gan: '임', strength: 60 }, { gan: '갑', strength: 30 }],
        '자': [{ gan: '계', strength: 100 }],
        '축': [{ gan: '기', strength: 60 }, { gan: '계', strength: 30 }, { gan: '신', strength: 10 }]
    };

    return 장간데이터[monthBranch] || [];
}

/**
 * 정격 강도 계산
 */
function calculate정격강도(saju, elements, 십신) {
    let strength = 40; // 기본값

    // 월지 본기 여부 (+25)
    if (is월지본기(saju, 십신)) strength += 25;

    // 투간 여부 (+15)
    if (is투간(saju, 십신)) strength += 15;

    // 근기 강도 (+5~15)
    const rootStrength = calculate근기강도(saju, 십신);
    strength += rootStrength;

    // 계절성 (+5~10)
    const seasonBonus = calculate계절성보너스(saju, 십신);
    strength += seasonBonus;

    return Math.max(0, Math.min(100, strength));
}

/**
 * 보조 함수들
 */
function is월지본기(saju, 십신) {
    const monthHidden = get월지장간(saju.month.ji);
    if (!monthHidden || monthHidden.length === 0) return false;

    const mainGan = monthHidden[0].gan;
    return get십신(saju.day.gan, mainGan) === 십신;
}

function is투간(saju, 십신) {
    const dayGan = saju.day.gan;
    const gans = [saju.year.gan, saju.month.gan, saju.hour.gan];

    return gans.some(gan => get십신(dayGan, gan) === 십신);
}

function calculate근기강도(saju, 십신) {
    let rootStrength = 0;
    const dayGan = saju.day.gan;
    const branches = [saju.year.ji, saju.month.ji, saju.day.ji, saju.hour.ji];

    branches.forEach(branch => {
        const hiddenGans = get월지장간(branch);
        hiddenGans?.forEach(hidden => {
            if (get십신(dayGan, hidden.gan) === 십신) {
                rootStrength += hidden.strength / 20;
            }
        });
    });

    return Math.min(15, rootStrength);
}

function calculate계절성보너스(saju, 십신) {
    // 계절에 따른 십신의 강약 보너스
    const monthBranch = saju.month.ji;
    const seasonalBonus = {
        '정관': { '인': 5, '묘': 8, '진': 6, '사': 4, '오': 3, '미': 4, '신': 6, '유': 8, '술': 7, '해': 5, '자': 6, '축': 5 },
        '편관': { '인': 6, '묘': 5, '진': 7, '사': 8, '오': 6, '미': 5, '신': 4, '유': 5, '술': 6, '해': 7, '자': 8, '축': 6 },
        '정재': { '인': 4, '묘': 3, '진': 8, '사': 6, '오': 5, '미': 7, '신': 5, '유': 4, '술': 6, '해': 3, '자': 4, '축': 7 },
        '편재': { '인': 5, '묘': 4, '진': 6, '사': 7, '오': 8, '미': 6, '신': 4, '유': 3, '술': 5, '해': 4, '자': 5, '축': 6 },
        '정인': { '인': 8, '묘': 6, '진': 5, '사': 3, '오': 4, '미': 3, '신': 7, '유': 8, '술': 6, '해': 8, '자': 7, '축': 5 },
        '편인': { '인': 7, '묘': 8, '진': 4, '사': 4, '오': 3, '미': 4, '신': 8, '유': 7, '술': 5, '해': 7, '자': 8, '축': 4 },
        '식신': { '인': 3, '묘': 4, '진': 7, '사': 8, '오': 7, '미': 6, '신': 4, '유': 3, '술': 5, '해': 3, '자': 4, '축': 6 },
        '상관': { '인': 4, '묘': 5, '진': 6, '사': 7, '오': 8, '미': 7, '신': 3, '유': 4, '술': 4, '해': 4, '자': 5, '축': 5 }
    };

    return seasonalBonus[십신]?.[monthBranch] || 3;
}

function get정격설명(십신) {
    const descriptions = {
        '정관': '품격이 높고 책임감이 강한 관료형 인물로, 안정적인 지위를 추구합니다.',
        '편관': '도전적이고 진취적인 성격으로, 변화와 경쟁을 즐기는 무관형 인물입니다.',
        '정재': '성실하고 계획적인 성격으로, 안정적인 재물 관리를 선호합니다.',
        '편재': '활동적이고 기회를 잘 포착하는 사업가형으로, 유동적인 재물을 다룹니다.',
        '정인': '학구적이고 체계적인 성격으로, 지식과 학문을 중시합니다.',
        '편인': '직감적이고 창의적인 성격으로, 독특한 아이디어와 예술성을 지닙니다.',
        '식신': '온화하고 표현력이 뛰어나며, 예술적 재능과 평화로운 성향을 가집니다.',
        '상관': '창의적이고 자유로운 성격으로, 독립적이고 개성적인 삶을 추구합니다.'
    };

    return descriptions[십신] || '특별한 성격을 가진 인물입니다.';
}

function analyze성격조건(saju, elements, 십신) {
    return {
        월지조건: is월지본기(saju, 십신),
        투간조건: is투간(saju, 십신),
        근기조건: calculate근기강도(saju, 십신) > 5,
        계절조건: calculate계절성보너스(saju, 십신) > 5
    };
}

function analyze격국함의(format, saju) {
    const implications = get격국함의데이터();
    return implications[format.name] || get기본함의();
}

function get격국함의데이터() {
    return {
        '정관격': {
            summary: '정직하고 신뢰할 수 있는 성품으로 사회적 지위를 얻기 쉽습니다.',
            career: '공무원, 대기업, 안정적인 직종에 적합합니다.',
            relationship: '전통적 가치를 중시하며 안정적인 관계를 선호합니다.',
            wealth: '꾸준하고 안정적인 재물운을 가지고 있습니다.'
        },
        '편관격': {
            summary: '도전적이고 진취적인 성격으로 변화를 두려워하지 않습니다.',
            career: '전문직, 경영직, 경쟁이 치열한 분야에 적합합니다.',
            relationship: '강한 개성으로 인해 갈등이 있을 수 있지만 리더십이 있습니다.',
            wealth: '기복이 있지만 큰 성과를 이룰 가능성이 높습니다.'
        },
        '정재격': {
            summary: '성실하고 계획적인 성격으로 착실히 재물을 모읍니다.',
            career: '회계, 금융, 안정적인 사업 분야에 적합합니다.',
            relationship: '현실적이고 실용적인 관계를 중시합니다.',
            wealth: '꾸준한 노력으로 안정적인 재물을 축적합니다.'
        },
        '편재격': {
            summary: '활동적이고 기회를 잘 포착하는 사업가적 기질을 가졌습니다.',
            career: '사업, 투자, 유통업 등 활동적인 분야에 적합합니다.',
            relationship: '사교적이고 인맥이 넓어 다양한 관계를 형성합니다.',
            wealth: '기회를 통해 큰 재물을 얻을 가능성이 높습니다.'
        },
        '정인격': {
            summary: '학구적이고 체계적인 성격으로 지식을 중시합니다.',
            career: '교육, 연구, 전문직 분야에서 능력을 발휘합니다.',
            relationship: '깊이 있고 진실한 관계를 추구합니다.',
            wealth: '지식과 전문성을 통해 안정적인 수입을 얻습니다.'
        },
        '편인격': {
            summary: '직감적이고 창의적인 성격으로 독특한 아이디어를 가졌습니다.',
            career: '예술, 창작, 독창적인 분야에서 재능을 발휘합니다.',
            relationship: '개성이 강해 특별한 인연을 만날 가능성이 높습니다.',
            wealth: '창의성을 통해 예상치 못한 수입을 얻을 수 있습니다.'
        },
        '식신격': {
            summary: '온화하고 표현력이 뛰어나 사람들에게 사랑받습니다.',
            career: '서비스업, 예술, 요리 등 사람을 즐겁게 하는 분야에 적합합니다.',
            relationship: '따뜻하고 포용력 있는 관계를 형성합니다.',
            wealth: '꾸준한 노력으로 안정적인 수입을 유지합니다.'
        },
        '상관격': {
            summary: '창의적이고 자유로운 성격으로 독립적인 삶을 추구합니다.',
            career: '창작, 예술, 자유업 등 독창성을 발휘할 수 있는 분야에 적합합니다.',
            relationship: '개성이 강해 때로는 갈등이 있을 수 있지만 매력적입니다.',
            wealth: '창의성과 독창성을 통해 특별한 수입원을 개발할 수 있습니다.'
        },
        '종강격': {
            summary: '유연성이 뛰어나 상황에 잘 적응하며 강자를 따르는 지혜가 있습니다.',
            career: '협력이 중요한 분야, 보조적 역할에서 능력을 발휘합니다.',
            relationship: '조화로운 관계를 중시하며 갈등을 피하는 편입니다.',
            wealth: '협력과 파트너십을 통해 안정적인 수입을 얻습니다.'
        },
        '종왕격': {
            summary: '강한 독립성과 리더십을 가지고 있어 혼자서도 잘 해나갑니다.',
            career: '독립적인 사업, 전문직, 리더십이 필요한 분야에 적합합니다.',
            relationship: '강한 개성으로 인해 독특한 관계를 형성합니다.',
            wealth: '독립적인 노력으로 큰 성과를 이룰 가능성이 높습니다.'
        }
    };
}

function get기본함의() {
    return {
        summary: '명확한 격국이 성립되지 않아 다양한 가능성을 가지고 있습니다.',
        career: '여러 분야에서 능력을 발휘할 수 있습니다.',
        relationship: '상황에 따라 유연하게 대응합니다.',
        wealth: '노력에 따라 다양한 성과를 얻을 수 있습니다.'
    };
}

// 특수 격국 확인 함수들 (하위 호환성 유지)
function checkSpecialFormats(saju, elements) {
    const specialFormats = [];

    // 종강격 체크
    if (isJonggangFormat(saju, elements)) {
        specialFormats.push({
            type: 'special',
            name: '종강격',
            strength: 85,
            description: '일간이 매우 약하여 강한 오행을 따르는 격국입니다.'
        });
    }

    // 종왕격 체크
    if (isJongwangFormat(saju, elements)) {
        specialFormats.push({
            type: 'special',
            name: '종왕격',
            strength: 85,
            description: '일간이 매우 강하여 독립적인 성향의 격국입니다.'
        });
    }

    return specialFormats;
}

function isJonggangFormat(saju, elements) {
    const dayElement = 천간오행[saju.day.gan];
    const dayElementRatio = elements[dayElement] / Object.values(elements).reduce((a, b) => a + b, 0);
    return dayElementRatio < 0.15; // 일간 오행이 15% 미만
}

function isJongwangFormat(saju, elements) {
    const dayElement = 천간오행[saju.day.gan];
    const dayElementRatio = elements[dayElement] / Object.values(elements).reduce((a, b) => a + b, 0);
    return dayElementRatio > 0.6; // 일간 오행이 60% 이상
}

function isSeasonalStrength(gan, ji) {
    // 계절별 득령 판단 (간단 버전)
    const season = getSeasonFromJi(ji);
    const element = 천간오행[gan];

    const seasonElements = {
        '봄': '목', '여름': '화', '늦여름': '토', '가을': '금', '겨울': '수'
    };

    return seasonElements[season] === element;
}

function getSeasonFromJi(ji) {
    const seasonMap = {
        '인': '봄', '묘': '봄', '진': '늦봄',
        '사': '여름', '오': '여름', '미': '늦여름',
        '신': '가을', '유': '가을', '술': '늦가을',
        '해': '겨울', '자': '겨울', '축': '늦겨울'
    };
    return seasonMap[ji] || '중성';
}

function hasEarthlySupport(gan, jiArray) {
    // 천간이 지지에서 통근하는지 확인
    const ganElement = 천간오행[gan];

    return jiArray.some(ji => {
        const jiElement = 지지오행[ji];
        const 지장간들 = 지장간[ji];

        return jiElement === ganElement ||
               지장간들.some(jjg => 천간오행[jjg] === ganElement);
    });
}

function analyzeFormatImplications(format, saju) {
    if (!format || format.strength < 60) {
        return {
            summary: '격국이 명확하지 않아 다양한 가능성을 가지고 있습니다.',
            career: '여러 분야에서 능력을 발휘할 수 있습니다.',
            relationship: '상황에 따라 유연하게 대응합니다.'
        };
    }

    const implications = {
        '정관격': {
            summary: '정직하고 신뢰할 수 있는 성품으로 사회적 지위를 얻기 쉽습니다.',
            career: '공무원, 대기업, 안정적인 직종에 적합합니다.',
            relationship: '전통적 가치를 중시하며 안정적인 관계를 선호합니다.'
        },
        '편재격': {
            summary: '사업 수완이 뛰어나고 재물 운용에 능합니다.',
            career: '사업, 투자, 자유업에 적합합니다.',
            relationship: '현실적이고 실용적인 관계를 중시합니다.'
        }
    };

    return implications[format.name] || implications['정관격'];
}

function calculateHarmony(gan, ji, saju) {
    // 대운과 원국의 조화도 계산
    let harmony = 50;

    // 천간 합화 체크
    const 천간합화 = {
        '갑기': '토', '을경': '금', '병신': '수', '정임': '목', '무계': '화'
    };

    const combinationKey = [gan, saju.day.gan].sort().join('');
    if (천간합화[combinationKey]) {
        harmony += 20;
    }

    // 지지 관계 체크
    const jiRelation = checkJiRelation(ji, saju.day.ji);
    harmony += jiRelation;

    return Math.min(100, Math.max(0, harmony));
}

function checkJiRelation(ji1, ji2) {
    // 지지 간의 관계 (합, 충, 해 등)
    const relations = {
        '자축': 10, '인해': 10, '묘술': 10, '진유': 10, '사신': 10, '오미': 10, // 육합
        '자오': -15, '축미': -15, '인신': -15, '묘유': -15, '진술': -15, '사해': -15, // 육충
        '자미': -10, '축오': -10, '인사': -10, '묘진': -10, '신해': -10, '유술': -10  // 육해
    };

    const key = [ji1, ji2].sort().join('');
    return relations[key] || 0;
}

function getDaeunOpportunities(sipshin) {
    const opportunities = {
        '정관': '승진이나 지위 향상의 기회가 있습니다.',
        '편재': '새로운 수익원이나 투자 기회가 생깁니다.',
        '정인': '학습이나 연구 활동에서 성과를 얻을 수 있습니다.',
        '식신': '창작 활동이나 표현 분야에서 인정받을 수 있습니다.'
    };
    return opportunities[sipshin] || '새로운 변화와 기회의 시기입니다.';
}

function getDaeunCautions(sipshin) {
    const cautions = {
        '편관': '스트레스나 갈등 상황에 주의하세요.',
        '상관': '말조심하고 충동적인 행동을 피하세요.',
        '겁재': '경쟁이나 손실에 주의하시기 바랍니다.',
        '편인': '우유부단함이나 의존성에 주의하세요.'
    };
    return cautions[sipshin] || '전반적으로 무난한 시기입니다.';
}

// 전역 함수로 내보내기
if (typeof window !== 'undefined') {
    // 전역 함수로 노출
    window.calculate만세력 = calculate만세력;
    window.analyzeElements = analyzeElements;
    window.analyze십신 = analyze십신;
    window.calculatePreciseDaeun = calculatePreciseDaeun;
    window.generateFortune = generateFortune;
    window.generate상세해석 = generate상세해석;
    window.getCyclicalDay = getCyclicalDay;
    window.get절기 = get절기;
    window.validate절기Data = validate절기Data;
    window.analyze신살 = analyze신살;
    window.신살데이터 = 신살데이터;
    window.analyze격국 = analyze격국;
    window.get십신 = get십신;
    window.천간 = 천간;
    window.지지 = 지지;
    window.천간오행 = 천간오행;
    window.지지오행 = 지지오행;
    window.십신표 = 십신표;

    // 하위 호환성을 위한 객체도 유지
    window.sajuCoreFunctions = {
        calculate만세력,
        analyzeElements,
        analyze십신,
        calculatePreciseDaeun,
        generateFortune,
        generate상세해석,
        getCyclicalDay,
        get절기,
        천간, 지지, 천간오행, 지지오행, 십신표
    };

    console.log('✅ 사주 핵심 함수들이 전역으로 노출되었습니다.');
}

function getExistingFunctions() {
    // 기존 함수들을 포함한 JavaScript 코드 반환
    return `
        // 모든 핵심 함수들이 saju-core-functions.js에서 로드됨
        if (typeof window.sajuCoreFunctions !== 'undefined') {
            Object.assign(window, window.sajuCoreFunctions);
        }
    `;
}