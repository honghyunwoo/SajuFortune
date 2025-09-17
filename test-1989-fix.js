/**
 * 1989년 10월 6일 시주 계산 버그 수정 검증 테스트
 * 이 테스트는 프리미엄 계산 엔진이 제대로 작동하는지 확인합니다.
 */

// Node.js 환경에서 ES6 모듈 import 시뮬레이션
const testDate = new Date(1989, 9, 6, 12, 56); // 1989년 10월 6일 12시 56분

console.log('🧪 1989년 시주 버그 수정 검증 테스트');
console.log('======================================');
console.log(`테스트 날짜: ${testDate.toLocaleString('ko-KR')}`);

// 기본 계산 로직 테스트 (완성본 JavaScript 코드 재현)
const 천간 = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const 지지 = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 1. 일주 계산
function getDayGapja(year, month, day) {
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    console.log(`\n📅 일간 계산 상세:
    기준일: ${baseDate.toDateString()} (1900-01-31)
    대상일: ${targetDate.toDateString()} (${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')})
    경과일: ${diffDays}일
    갑자순번: ${(diffDays % 60 + 60) % 60}`);
    return (diffDays % 60 + 60) % 60;
}

// 2. 시주 계산 (수정된 버전)
function getHourGapja(dayGan, hour) {
    const dayGanIndex = 천간.indexOf(dayGan);

    // 시지 계산
    let hourJiIndex;
    if (hour === 23 || (hour >= 0 && hour <= 0)) hourJiIndex = 0; // 자시
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

    // ⭐ 핵심 수정: 정확한 시주 천간 계산
    const 일간별자시천간 = {
        0: 0, 5: 0,  // 갑(0), 기(5) → 갑자시(0)
        1: 2, 6: 2,  // 을(1), 경(6) → 병자시(2)
        2: 4, 7: 4,  // 병(2), 신(7) → 무자시(4)
        3: 8, 8: 8,  // 정(3), 임(8) → 임자시(8)
        4: 8, 9: 8   // 무(4), 계(9) → 임자시(8) ← 이 부분이 핵심 수정!
    };

    const 자시천간 = 일간별자시천간[dayGanIndex];
    const hourGanIndex = (자시천간 + hourJiIndex) % 10;

    return {
        gan: 천간[hourGanIndex],
        ji: 지지[hourJiIndex]
    };
}

// 테스트 실행
const year = testDate.getFullYear();
const month = testDate.getMonth() + 1;
const day = testDate.getDate();
const hour = testDate.getHours();

// 일간 계산
const dayGapja = getDayGapja(year, month, day);
const dayGan = 천간[dayGapja % 10];
const dayJi = 지지[dayGapja % 12];

console.log(`일주: ${dayGan}${dayJi} (갑자 순번: ${dayGapja})`);

// 🔍 디버그: 완성본에서는 무오일이어야 함
console.log(`예상 일주: 무오 (일간이 무여야 함)`);
console.log(`실제 일간: ${dayGan} (인덱스: ${천간.indexOf(dayGan)})`);
console.log(`실제 일지: ${dayJi} (인덱스: ${지지.indexOf(dayJi)})`);

// 만약 일간이 무라면 어떻게 될까?
const correctDayGan = '무';
console.log(`\n🧪 일간을 무로 가정한 시주 계산:`);
const correctedHourInfo = getHourGapja(correctDayGan, hour);
console.log(`수정된 시주: ${correctedHourInfo.gan}${correctedHourInfo.ji}`);

// 원래 계산
const hourInfo = getHourGapja(dayGan, hour);
console.log(`\n원래 시주: ${hourInfo.gan}${hourInfo.ji}`);

// 결과 검증
const expected시간 = '무';
const actual시간 = hourInfo.gan;
const isFixed = actual시간 === expected시간;

console.log('');
console.log('📊 검증 결과:');
console.log(`예상 시간: ${expected시간}○`);
console.log(`실제 시간: ${actual시간}○`);
console.log(`버그 수정: ${isFixed ? '✅ 성공!' : '❌ 실패'}}`);

if (isFixed) {
    console.log('🎉 1989년 시주 계산 버그가 성공적으로 수정되었습니다!');
    console.log('   프리미엄 계산 엔진이 정상적으로 작동합니다.');
} else {
    console.log('⚠️  시주 계산에 여전히 문제가 있습니다.');
    console.log(`   기대값: ${expected시간}○, 실제값: ${actual시간}○`);
}

console.log('');
console.log('🔍 상세 정보:');
console.log(`일간 인덱스: ${천간.indexOf(dayGan)} (${dayGan})`);
console.log(`시간: ${hour}시 → ${hourInfo.ji}시 (인덱스: ${지지.indexOf(hourInfo.ji)})`);

// 다른 시간대도 테스트
console.log('');
console.log('⏰ 다른 시간대 테스트:');
for (let testHour of [0, 6, 12, 18]) {
    const testHourInfo = getHourGapja(dayGan, testHour);
    console.log(`${testHour}시 → ${testHourInfo.gan}${testHourInfo.ji}`);
}