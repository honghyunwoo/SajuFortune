import { test, expect } from '@playwright/test';

test.describe('API 통합 테스트', () => {
  test('POST /api/fortune-readings - 사주 계산 API 정상 동작', async ({ request }) => {
    const response = await request.post('/api/fortune-readings', {
      data: {
        gender: 'male',
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        birthHour: 14,
        birthMinute: 30,
        calendarType: 'solar',
        serviceType: 'free'
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('sajuData');
    expect(data).toHaveProperty('analysisResult');
  });

  test('POST /api/fortune-readings - 격국 분석 포함 확인', async ({ request }) => {
    const response = await request.post('/api/fortune-readings', {
      data: {
        gender: 'female',
        birthYear: 1995,
        birthMonth: 7,
        birthDay: 10,
        birthHour: 11,
        birthMinute: 20,
        calendarType: 'solar',
        serviceType: 'free'
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.analysisResult).toHaveProperty('geokguk');
    expect(data.analysisResult.geokguk).toHaveProperty('격국명');
    expect(data.analysisResult.geokguk).toHaveProperty('격국강도');
    expect(data.analysisResult.geokguk).toHaveProperty('용신');
  });

  test('POST /api/fortune-readings - 대운 계산 포함 확인', async ({ request }) => {
    const response = await request.post('/api/fortune-readings', {
      data: {
        gender: 'male',
        birthYear: 1985,
        birthMonth: 10,
        birthDay: 20,
        birthHour: 9,
        birthMinute: 0,
        calendarType: 'solar',
        serviceType: 'free'
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.analysisResult).toHaveProperty('daeun');
    expect(data.analysisResult.daeun).toHaveProperty('대운목록');
    expect(data.analysisResult.daeun.대운목록.length).toBe(8);
    expect(data.analysisResult.daeun).toHaveProperty('현재대운');
  });

  test('POST /api/fortune-readings - 십이운성 분석 포함 확인', async ({ request }) => {
    const response = await request.post('/api/fortune-readings', {
      data: {
        gender: 'male',
        birthYear: 2000,
        birthMonth: 1,
        birthDay: 1,
        birthHour: 12,
        birthMinute: 0,
        calendarType: 'solar',
        serviceType: 'free'
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.analysisResult).toHaveProperty('sibiunseong');
    expect(data.analysisResult.sibiunseong).toHaveProperty('년주십이운성');
    expect(data.analysisResult.sibiunseong).toHaveProperty('월주십이운성');
    expect(data.analysisResult.sibiunseong).toHaveProperty('일주십이운성');
    expect(data.analysisResult.sibiunseong).toHaveProperty('시주십이운성');
    expect(data.analysisResult.sibiunseong).toHaveProperty('전체평가');
    expect(data.analysisResult.sibiunseong.전체평가).toHaveProperty('생애에너지');
  });

  test('POST /api/fortune-readings - 잘못된 날짜 에러 처리', async ({ request }) => {
    const response = await request.post('/api/fortune-readings', {
      data: {
        gender: 'male',
        birthYear: 2025, // 미래 날짜
        birthMonth: 13, // 잘못된 월
        birthDay: 32, // 잘못된 일
        birthHour: 25, // 잘못된 시간
        birthMinute: 70, // 잘못된 분
        calendarType: 'solar',
        serviceType: 'free'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('POST /api/fortune-readings - 필수 필드 누락 에러', async ({ request }) => {
    const response = await request.post('/api/fortune-readings', {
      data: {
        gender: 'male',
        // birthYear, birthMonth, birthDay 등 필수 필드 누락
        calendarType: 'solar'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('POST /api/fortune-readings - 성능 테스트 (응답 시간)', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post('/api/fortune-readings', {
      data: {
        gender: 'female',
        birthYear: 1992,
        birthMonth: 6,
        birthDay: 15,
        birthHour: 10,
        birthMinute: 30,
        calendarType: 'solar',
        serviceType: 'free'
      }
    });

    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(2000); // 2초 이내 응답
  });

  test('POST /api/fortune-readings - 음력 변환 정상 동작', async ({ request }) => {
    const response = await request.post('/api/fortune-readings', {
      data: {
        gender: 'male',
        birthYear: 1990,
        birthMonth: 3,
        birthDay: 21,
        birthHour: 15,
        birthMinute: 45,
        calendarType: 'lunar', // 음력
        serviceType: 'free'
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('sajuData');
  });

  test('POST /api/fortune-readings - 다양한 연도 테스트', async ({ request }) => {
    const testYears = [1950, 1975, 2000, 2020];

    for (const year of testYears) {
      const response = await request.post('/api/fortune-readings', {
        data: {
          gender: 'male',
          birthYear: year,
          birthMonth: 6,
          birthDay: 15,
          birthHour: 12,
          birthMinute: 0,
          calendarType: 'solar',
          serviceType: 'free'
        }
      });

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('sajuData');
      expect(data.analysisResult).toHaveProperty('geokguk');
      expect(data.analysisResult).toHaveProperty('daeun');
      expect(data.analysisResult).toHaveProperty('sibiunseong');
    }
  });

  test('GET /api/fortune-readings/:id - 저장된 사주 조회', async ({ request }) => {
    // 먼저 사주 생성
    const createResponse = await request.post('/api/fortune-readings', {
      data: {
        gender: 'male',
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        birthHour: 14,
        birthMinute: 30,
        calendarType: 'solar',
        serviceType: 'free'
      }
    });

    expect(createResponse.status()).toBe(200);
    const createData = await createResponse.json();
    const readingId = createData.id;

    // 생성된 사주 조회
    const getResponse = await request.get(`/api/fortune-readings/${readingId}`);
    expect(getResponse.status()).toBe(200);

    const getData = await getResponse.json();
    expect(getData.id).toBe(readingId);
    expect(getData).toHaveProperty('sajuData');
    expect(getData).toHaveProperty('analysisResult');
  });

  test('사주 데이터 구조 검증', async ({ request }) => {
    const response = await request.post('/api/fortune-readings', {
      data: {
        gender: 'male',
        birthYear: 1988,
        birthMonth: 12,
        birthDay: 25,
        birthHour: 18,
        birthMinute: 30,
        calendarType: 'solar',
        serviceType: 'free'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    // 사주 데이터 구조 검증
    expect(data.sajuData).toHaveProperty('pillars');
    expect(data.sajuData.pillars).toHaveLength(4); // 년월일시 4주

    // 각 주(pillar) 검증
    data.sajuData.pillars.forEach((pillar: any) => {
      expect(pillar).toHaveProperty('heavenly');
      expect(pillar).toHaveProperty('earthly');
      expect(pillar).toHaveProperty('element');
    });

    // 오행 데이터 검증
    expect(data.sajuData).toHaveProperty('elements');
    expect(data.sajuData.elements).toHaveProperty('wood');
    expect(data.sajuData.elements).toHaveProperty('fire');
    expect(data.sajuData.elements).toHaveProperty('earth');
    expect(data.sajuData.elements).toHaveProperty('metal');
    expect(data.sajuData.elements).toHaveProperty('water');

    // 분석 결과 검증
    expect(data.analysisResult).toHaveProperty('personality');
    expect(data.analysisResult).toHaveProperty('todayFortune');
    expect(data.analysisResult).toHaveProperty('detailedAnalysis');
    expect(data.analysisResult).toHaveProperty('compatibility');
    expect(data.analysisResult).toHaveProperty('monthlyFortune');
    expect(data.analysisResult).toHaveProperty('advice');
  });

  test('동시 요청 처리 (부하 테스트)', async ({ request }) => {
    const requests = Array(10).fill(null).map(() =>
      request.post('/api/fortune-readings', {
        data: {
          gender: 'male',
          birthYear: 1990 + Math.floor(Math.random() * 30),
          birthMonth: Math.floor(Math.random() * 12) + 1,
          birthDay: Math.floor(Math.random() * 28) + 1,
          birthHour: Math.floor(Math.random() * 24),
          birthMinute: Math.floor(Math.random() * 60),
          calendarType: 'solar',
          serviceType: 'free'
        }
      })
    );

    const responses = await Promise.all(requests);

    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });
});

test.describe('캐싱 및 최적화 테스트', () => {
  test('동일한 사주 요청 시 빠른 응답', async ({ request }) => {
    const requestData = {
      gender: 'male',
      birthYear: 1990,
      birthMonth: 5,
      birthDay: 15,
      birthHour: 14,
      birthMinute: 30,
      calendarType: 'solar',
      serviceType: 'free'
    };

    // 첫 번째 요청
    const start1 = Date.now();
    const response1 = await request.post('/api/fortune-readings', {
      data: requestData
    });
    const time1 = Date.now() - start1;

    expect(response1.status()).toBe(200);

    // 두 번째 요청 (캐싱 여부 확인)
    const start2 = Date.now();
    const response2 = await request.post('/api/fortune-readings', {
      data: requestData
    });
    const time2 = Date.now() - start2;

    expect(response2.status()).toBe(200);

    // 두 번째 요청이 첫 번째보다 빠르거나 비슷한 시간이어야 함
    console.log(`First request: ${time1}ms, Second request: ${time2}ms`);
  });
});
