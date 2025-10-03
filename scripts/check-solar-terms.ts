import { 절기데이터 } from '../shared/solar-terms';

console.log('🔍 24절기 데이터 검증\n');

const 절기순서 = [
  '소한', '대한', '입춘', '우수', '경칩', '춘분', '청명', '곡우',
  '입하', '소만', '망종', '하지', '소서', '대서',
  '입추', '처서', '백로', '추분', '한로', '상강',
  '입동', '소설', '대설', '동지'
];

Object.entries(절기데이터).forEach(([year, terms]) => {
  const count = Object.keys(terms).length;
  const termNames = Object.keys(terms);

  if (count !== 24) {
    console.log(`❌ ${year}년: ${count}개 절기 (누락 ${24 - count}개)`);

    // 누락된 절기 찾기
    const missing = 절기순서.filter(name => !termNames.includes(name));
    if (missing.length > 0) {
      console.log(`   누락된 절기: ${missing.join(', ')}`);
    }
  } else {
    console.log(`✅ ${year}년: ${count}개 절기 완료`);
  }
});
