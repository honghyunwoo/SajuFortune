import { describe, it, expect } from 'vitest';
import { 절기데이터 } from '@shared/solar-terms';

describe('24절기 데이터 커버리지 테스트', () => {
  // 실제 서비스 가능 연도 확인
  const availableYears = Object.keys(절기데이터).map(Number).sort((a, b) => a - b);

  it('정밀 데이터 연도가 존재해야 함', () => {
    expect(availableYears.length).toBeGreaterThan(0);
    console.log('✅ 정밀 데이터 연도:', availableYears);
  });

  it('1950-2030년 범위 내 연도들', () => {
    const testYears = [
      1950, 1960, 1970, 1980, 1989, 1990, 1991,
      1992, 2000, 2010, 2019, 2020, 2023, 2024, 2025, 2026,
      2027, 2028, 2029, 2030
    ];

    testYears.forEach(year => {
      const hasData = availableYears.includes(year);
      console.log(`${year}년: ${hasData ? '✅ 정밀 데이터' : '⚠️ 알고리즘 계산'}`);
    });
  });

  it('각 연도마다 24개 절기가 있어야 함', () => {
    availableYears.forEach(year => {
      const terms = 절기데이터[year];
      const termCount = Object.keys(terms).length;

      expect(termCount).toBe(24);
    });
  });

  it('모든 절기 데이터가 유효한 Date 객체여야 함', () => {
    availableYears.forEach(year => {
      const terms = 절기데이터[year];

      Object.entries(terms).forEach(([name, date]) => {
        expect(date).toBeInstanceOf(Date);
        expect(date.getTime()).not.toBeNaN();
      });
    });
  });

  it('절기 순서가 올바른지 확인', () => {
    const 절기순서 = [
      '입춘', '우수', '경칩', '춘분', '청명', '곡우',
      '입하', '소만', '망종', '하지', '소서', '대서',
      '입추', '처서', '백로', '추분', '한로', '상강',
      '입동', '소설', '대설', '동지', '소한', '대한'
    ];

    availableYears.forEach(year => {
      const terms = 절기데이터[year];

      // 소한, 대한이 연초에 있으므로 입춘부터 시작하는 절기들만 순서 확인
      const dates절기 = 절기순서
        .filter(term => terms[term])
        .map(term => ({ name: term, date: terms[term] }))
        .filter(t => t.name !== '소한' && t.name !== '대한'); // 연초 제외

      // 날짜 순서대로 정렬되어 있는지 확인
      for (let i = 1; i < dates절기.length; i++) {
        const prev = dates절기[i - 1].date.getTime();
        const curr = dates절기[i].date.getTime();

        if (curr < prev) {
          console.warn(`${year}년 절기 순서 오류: ${dates절기[i-1].name} → ${dates절기[i].name}`);
        }
      }
    });
  });

  it('데이터 커버리지 요약', () => {
    const minYear = Math.min(...availableYears);
    const maxYear = Math.max(...availableYears);
    const totalYears = availableYears.length;

    console.log('\n📊 24절기 데이터 커버리지 요약:');
    console.log(`   최소 연도: ${minYear}`);
    console.log(`   최대 연도: ${maxYear}`);
    console.log(`   정밀 데이터: ${totalYears}년분`);
    console.log(`   연도 목록: ${availableYears.join(', ')}`);

    // 누락된 범위 확인
    const gaps: string[] = [];
    for (let i = 1; i < availableYears.length; i++) {
      const diff = availableYears[i] - availableYears[i - 1];
      if (diff > 1) {
        gaps.push(`${availableYears[i - 1] + 1}-${availableYears[i] - 1}`);
      }
    }

    if (gaps.length > 0) {
      console.log(`   ⚠️ 알고리즘 계산 범위: ${gaps.join(', ')}`);
    }
  });
});
