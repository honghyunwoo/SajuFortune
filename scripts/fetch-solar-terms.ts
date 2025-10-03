/**
 * 한국천문연구원 API를 통해 24절기 데이터를 가져오는 스크립트
 * 2019-2030년 데이터를 가져와서 TypeScript 형식으로 변환
 */

async function fetchSolarTermsData() {
  const baseUrl = 'https://holidays.dist.be';
  const years = Array.from({ length: 12 }, (_, i) => 2019 + i); // 2019-2030

  const allData: Record<number, any> = {};

  for (const year of years) {
    try {
      const response = await fetch(`${baseUrl}/${year}.json`);
      if (!response.ok) {
        console.log(`❌ ${year}: 데이터 없음 (${response.status})`);
        continue;
      }

      const data = await response.json();
      const solarTerms = data.filter((item: any) => item.kind === 3); // kind: 3 = 24절기

      if (solarTerms.length > 0) {
        allData[year] = {};
        solarTerms.forEach((term: any) => {
          const [hour, minute] = term.time.split(':').map(Number);
          const [y, m, d] = term.date.split('-').map(Number);

          // JavaScript Date는 month가 0-based이므로 -1
          allData[year][term.name] = {
            date: term.date,
            time: term.time,
            // TypeScript 코드 형식
            code: `new Date(${y}, ${m - 1}, ${d}, ${hour}, ${minute}, 0)`
          };
        });
        console.log(`✅ ${year}: ${solarTerms.length}개 절기 수집`);
      }
    } catch (error) {
      console.error(`❌ ${year}: 오류 -`, error);
    }
  }

  return allData;
}

// 실행
fetchSolarTermsData().then(data => {
  console.log('\n=== 수집 완료 ===');
  console.log(`총 ${Object.keys(data).length}개 연도 데이터 수집`);

  // TypeScript 코드 형식으로 출력
  console.log('\n=== TypeScript 코드 (solar-terms.ts에 추가) ===\n');

  Object.entries(data).forEach(([year, terms]: [string, any]) => {
    console.log(`    ${year}: {`);
    Object.entries(terms).forEach(([name, info]: [string, any]) => {
      console.log(`        '${name}': ${info.code},  // ${info.date} ${info.time}`);
    });
    console.log(`    },`);
  });
}).catch(console.error);
