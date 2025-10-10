/**
 * 결정성 테스트 (Determinism Test)
 * 동일 입력에 대해 항상 동일한 결과를 반환하는지 검증
 */

import { describe, it, expect } from 'vitest';
import { buildAnalysisResult, type SajuData } from '@shared/engine/analysis';

describe('결정성 보장 테스트 (Determinism)', () => {
  const testSajuData: SajuData = {
    pillars: [
      { heavenly: '갑', earthly: '자', element: 'wood' },
      { heavenly: '을', earthly: '축', element: 'wood' },
      { heavenly: '병', earthly: '인', element: 'fire' },
      { heavenly: '정', earthly: '묘', element: 'fire' },
    ],
    elements: {
      wood: 2,
      fire: 2,
      earth: 1,
      metal: 2,
      water: 1,
    },
    dayMaster: '병',
    strength: 'medium' as const,
  };

  it('동일 입력 3회 호출 시 동일 결과 (남성)', () => {
    const result1 = buildAnalysisResult(testSajuData, 'male');
    const result2 = buildAnalysisResult(testSajuData, 'male');
    const result3 = buildAnalysisResult(testSajuData, 'male');

    // JSON.stringify를 통한 깊은 비교
    const json1 = JSON.stringify(result1);
    const json2 = JSON.stringify(result2);
    const json3 = JSON.stringify(result3);

    expect(json1).toBe(json2);
    expect(json2).toBe(json3);
    expect(json1).toBe(json3);
  });

  it('동일 입력 3회 호출 시 동일 결과 (여성)', () => {
    const result1 = buildAnalysisResult(testSajuData, 'female');
    const result2 = buildAnalysisResult(testSajuData, 'female');
    const result3 = buildAnalysisResult(testSajuData, 'female');

    expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
    expect(JSON.stringify(result2)).toBe(JSON.stringify(result3));
  });

  it('1989-10-06 12:56 케이스 재현성', () => {
    // 1989년 10월 6일 12시 56분 사주 (알려진 버그 케이스)
    const specialCase: SajuData = {
      pillars: [
        { heavenly: '기', earthly: '사', element: 'earth' },
        { heavenly: '계', earthly: '유', element: 'water' },
        { heavenly: '정', earthly: '사', element: 'fire' },
        { heavenly: '병', earthly: '오', element: 'fire' },
      ],
      elements: {
        wood: 0,
        fire: 3,
        earth: 2,
        metal: 1,
        water: 2,
      },
      dayMaster: '정',
      strength: 'strong' as const,
    };

    const results = Array.from({ length: 3 }, () =>
      buildAnalysisResult(specialCase, 'male')
    );

    const jsonSet = new Set(results.map(r => JSON.stringify(r)));
    expect(jsonSet.size).toBe(1); // 모두 동일해야 함
  });

  it('다양한 사주 패턴 결정성 검증', () => {
    const patterns: Array<{ name: string; data: SajuData }> = [
      {
        name: '목 강세',
        data: {
          pillars: [
            { heavenly: '갑', earthly: '인', element: 'wood' },
            { heavenly: '을', earthly: '묘', element: 'wood' },
            { heavenly: '갑', earthly: '인', element: 'wood' },
            { heavenly: '을', earthly: '묘', element: 'wood' },
          ],
          elements: { wood: 4, fire: 0, earth: 0, metal: 0, water: 4 },
          dayMaster: '갑',
          strength: 'strong' as const,
        },
      },
      {
        name: '금 약세',
        data: {
          pillars: [
            { heavenly: '경', earthly: '신', element: 'metal' },
            { heavenly: '신', earthly: '유', element: 'metal' },
            { heavenly: '임', earthly: '자', element: 'water' },
            { heavenly: '계', earthly: '해', element: 'water' },
          ],
          elements: { wood: 1, fire: 1, earth: 1, metal: 2, water: 3 },
          dayMaster: '경',
          strength: 'weak' as const,
        },
      },
    ];

    patterns.forEach(({ name, data }) => {
      const result1 = buildAnalysisResult(data, 'male');
      const result2 = buildAnalysisResult(data, 'male');

      expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
      console.log(`✅ ${name} 패턴: 결정성 검증 통과`);
    });
  });

  it('성격 분석 결정성 (오행별)', () => {
    const elements = ['목', '화', '토', '금', '수'];
    const stems = ['갑', '병', '무', '경', '임']; // 대표 천간

    stems.forEach((stem, index) => {
      const testData: SajuData = {
        pillars: [
          { heavenly: stem, earthly: '자', element: elements[index] },
          { heavenly: stem, earthly: '축', element: elements[index] },
          { heavenly: stem, earthly: '인', element: elements[index] },
          { heavenly: stem, earthly: '묘', element: elements[index] },
        ],
        elements: {
          wood: index === 0 ? 4 : 1,
          fire: index === 1 ? 4 : 1,
          earth: index === 2 ? 4 : 1,
          metal: index === 3 ? 4 : 1,
          water: index === 4 ? 4 : 1,
        },
        dayMaster: stem,
        strength: 'strong' as const,
      };

      const r1 = buildAnalysisResult(testData, 'male');
      const r2 = buildAnalysisResult(testData, 'male');

      expect(r1.personality).toBe(r2.personality);
      expect(r1.personality.length).toBeGreaterThan(0);
    });
  });

  it('월별 운세 배열 결정성', () => {
    const result1 = buildAnalysisResult(testSajuData, 'male');
    const result2 = buildAnalysisResult(testSajuData, 'male');

    expect(result1.monthlyFortune).toEqual(result2.monthlyFortune);
    expect(result1.monthlyFortune).toHaveLength(12);

    // 각 월의 데이터도 동일해야 함
    result1.monthlyFortune?.forEach((month, index) => {
      expect(month).toEqual(result2.monthlyFortune?.[index]);
    });
  });

  it('세부 분석 점수 결정성', () => {
    const result1 = buildAnalysisResult(testSajuData, 'male');
    const result2 = buildAnalysisResult(testSajuData, 'male');

    expect(result1.detailedAnalysis?.love.score).toBe(result2.detailedAnalysis?.love.score);
    expect(result1.detailedAnalysis?.career.score).toBe(result2.detailedAnalysis?.career.score);
    expect(result1.detailedAnalysis?.health.score).toBe(result2.detailedAnalysis?.health.score);
    expect(result1.detailedAnalysis?.money.score).toBe(result2.detailedAnalysis?.money.score);
  });

  it('오늘 운세 결정성 (같은 날짜 기준)', () => {
    // 같은 시점에 여러 번 호출해도 동일한 결과
    const result1 = buildAnalysisResult(testSajuData, 'male');
    const result2 = buildAnalysisResult(testSajuData, 'male');

    expect(result1.todayFortune.rating).toBe(result2.todayFortune.rating);
    expect(result1.todayFortune.description).toBe(result2.todayFortune.description);
    expect(result1.todayFortune.overall).toBe(result2.todayFortune.overall);
  });
});
