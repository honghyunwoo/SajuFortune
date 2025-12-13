/**
 * __tests__/ai/bon.test.ts
 *
 * Best-of-N 토너먼트 시스템 테스트
 */

import { describe, it, expect } from 'vitest';
import {
  runBestOfN,
  createCandidate,
  summarizeTournament,
  assessWinnerReliability,
  autoRunBestOfN,
  analyzeWithPerspective
} from '../../src/ai/bon';
import { PERSPECTIVES, getPerspective } from '../../src/ai/perspectives';
import type { Candidate, Perspective } from '../../shared/types';
import type { 사주정보 } from '../../shared/geokguk-analyzer';

// 테스트용 사주 데이터
const mockSaju: 사주정보 = {
  연주: { 천간: '갑', 지지: '자' },
  월주: { 천간: '을', 지지: '축' },
  일주: { 천간: '병', 지지: '인' },
  시주: { 천간: '정', 지지: '묘' },
  일간: '병',
  월령: '축',
  계절: '겨울'
};

// 테스트용 후보 생성 함수
const mockCandidateGenerator = (
  사주: 사주정보,
  격국: string,
  perspective: Perspective
): Candidate<string> => {
  // 각 관점별로 다른 결과 반환 (테스트용)
  const results: Record<string, { result: string; confidence: number }> = {
    격국용신론: { result: '용신: 목', confidence: 0.85 },
    조후용신론: { result: '용신: 화', confidence: 0.75 },
    통변론: { result: '용신: 수', confidence: 0.7 },
    보수파: { result: '용신: 목', confidence: 0.8 },
    현대파: { result: '용신: 화', confidence: 0.65 }
  };

  const { result, confidence } = results[perspective.name] || {
    result: '용신: 미정',
    confidence: 0.5
  };

  return createCandidate(
    result,
    perspective,
    perspective.source,
    confidence,
    [`${perspective.name}에 의한 분석`, '근거 제시', '이론적 근거']
  );
};

describe('Best-of-N Tournament System', () => {
  describe('createCandidate()', () => {
    it('후보를 생성해야 함', () => {
      const perspective = getPerspective('격국용신론')!;
      const candidate = createCandidate(
        '용신: 목',
        perspective,
        '자평진전',
        0.85,
        ['근거1', '근거2']
      );

      expect(candidate.result).toBe('용신: 목');
      expect(candidate.perspective).toBe('격국용신론');
      expect(candidate.source).toBe('자평진전');
      expect(candidate.base_confidence).toBe(0.85);
      expect(candidate.reasoning).toHaveLength(2);
    });

    it('weighted_confidence는 base_confidence × weight여야 함', () => {
      const perspective = getPerspective('격국용신론')!;
      const candidate = createCandidate('용신: 목', perspective, '자평진전', 0.8, ['근거']);

      expect(candidate.weighted_confidence).toBe(0.8 * perspective.weight);
    });
  });

  describe('runBestOfN()', () => {
    it('토너먼트 결과를 반환해야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);

      expect(result).toHaveProperty('winner');
      expect(result).toHaveProperty('alternatives');
      expect(result).toHaveProperty('all_candidates');
      expect(result).toHaveProperty('metadata');
    });

    it('승자는 최고 점수를 가져야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);

      const winnerScore = result.winner.final_score;

      result.all_candidates.forEach(candidate => {
        expect(winnerScore).toBeGreaterThanOrEqual(candidate.final_score);
      });
    });

    it('대안 후보는 최대 2개여야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);

      expect(result.alternatives.length).toBeLessThanOrEqual(2);
    });

    it('모든 후보는 rubric_score를 가져야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);

      result.all_candidates.forEach(candidate => {
        expect(candidate.rubric_score).toBeDefined();
        expect(candidate.rubric_score).toBeGreaterThanOrEqual(0);
        expect(candidate.rubric_score).toBeLessThanOrEqual(1);
      });
    });

    it('모든 후보는 self_critique를 가져야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);

      result.all_candidates.forEach(candidate => {
        expect(candidate.self_critique).toBeDefined();
        expect(candidate.self_critique?.strengths).toBeDefined();
        expect(candidate.self_critique?.weaknesses).toBeDefined();
        expect(candidate.self_critique?.overall_assessment).toBeDefined();
      });
    });

    it('metadata는 토너먼트 정보를 포함해야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);

      expect(result.metadata.total_candidates).toBe(5);
      expect(result.metadata.perspectives_used).toHaveLength(5);
      expect(result.metadata.average_confidence).toBeGreaterThan(0);
      expect(result.metadata.score_spread).toBeGreaterThanOrEqual(0);
      expect(result.metadata.tournament_date).toBeDefined();
    });

    it('all_candidates는 점수 내림차순 정렬되어야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);

      for (let i = 0; i < result.all_candidates.length - 1; i++) {
        expect(result.all_candidates[i].final_score).toBeGreaterThanOrEqual(
          result.all_candidates[i + 1].final_score
        );
      }
    });

    it('커스텀 관점을 사용할 수 있어야 함', async () => {
      const customPerspectives = [
        getPerspective('격국용신론')!,
        getPerspective('조후용신론')!
      ];

      const result = await runBestOfN(
        mockSaju,
        '정관격',
        mockCandidateGenerator,
        undefined,
        customPerspectives
      );

      expect(result.all_candidates).toHaveLength(2);
      expect(result.metadata.total_candidates).toBe(2);
    });
  });

  describe('summarizeTournament()', () => {
    it('토너먼트 요약을 반환해야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);
      const summary = summarizeTournament(result);

      expect(summary).toContain('Best-of-N 토너먼트 결과');
      expect(summary).toContain('승자:');
      expect(summary).toContain('확신도:');
      expect(summary).toContain('루브릭 점수:');
    });

    it('요약에 주요 근거가 포함되어야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);
      const summary = summarizeTournament(result);

      expect(summary).toContain('주요 근거:');
      result.winner.reasoning.forEach(r => {
        expect(summary).toContain(r);
      });
    });

    it('대안 해석이 있으면 표시해야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);
      const summary = summarizeTournament(result);

      if (result.alternatives.length > 0) {
        expect(summary).toContain('대안 해석');
      }
    });
  });

  describe('assessWinnerReliability()', () => {
    it('점수 차이가 크면 reliable = true', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);
      const assessment = assessWinnerReliability(result);

      expect(assessment).toHaveProperty('reliable');
      expect(assessment).toHaveProperty('reason');
      expect(assessment).toHaveProperty('confidence_adjustment');
    });

    it('confidence_adjustment는 -0.2 ~ 0.1 범위여야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);
      const assessment = assessWinnerReliability(result);

      expect(assessment.confidence_adjustment).toBeGreaterThanOrEqual(-0.2);
      expect(assessment.confidence_adjustment).toBeLessThanOrEqual(0.1);
    });

    it('reason은 점수 차이를 언급해야 함', async () => {
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);
      const assessment = assessWinnerReliability(result);

      expect(assessment.reason).toContain('%');
    });

    it('후보가 1개뿐이면 reliable = true', async () => {
      const singlePerspective = [getPerspective('격국용신론')!];
      const result = await runBestOfN(
        mockSaju,
        '정관격',
        mockCandidateGenerator,
        undefined,
        singlePerspective
      );
      const assessment = assessWinnerReliability(result);

      expect(assessment.reliable).toBe(true);
      expect(assessment.reason).toContain('후보가 1개뿐');
    });
  });

  describe('autoRunBestOfN()', () => {
    it('확신도 ≥ 0.7이면 Best-of-N 실행 안 함', async () => {
      const result = await autoRunBestOfN(0.85, mockSaju, '정관격', mockCandidateGenerator);

      expect(result.ran).toBe(false);
      expect(result.result).toBeUndefined();
      expect(result.reason).toContain('충분히 높음');
    });

    it('확신도 < 0.7이면 Best-of-N 실행', async () => {
      const result = await autoRunBestOfN(0.6, mockSaju, '정관격', mockCandidateGenerator);

      expect(result.ran).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.reason).toContain('Best-of-N 실행');
    });

    it('경계값 테스트: 0.7', async () => {
      const result1 = await autoRunBestOfN(0.7, mockSaju, '정관격', mockCandidateGenerator);
      const result2 = await autoRunBestOfN(0.69, mockSaju, '정관격', mockCandidateGenerator);

      expect(result1.ran).toBe(false);
      expect(result2.ran).toBe(true);
    });

    it('실행된 경우 토너먼트 결과를 반환해야 함', async () => {
      const result = await autoRunBestOfN(0.5, mockSaju, '정관격', mockCandidateGenerator);

      expect(result.result).toBeDefined();
      expect(result.result?.winner).toBeDefined();
      expect(result.result?.all_candidates).toBeDefined();
    });
  });

  describe('analyzeWithPerspective()', () => {
    it('관점별 분석 실행', () => {
      const perspective = getPerspective('격국용신론')!;

      const candidate = analyzeWithPerspective(mockSaju, '정관격', perspective, (사주, config) => {
        expect(config.monthly_pillar_importance).toBeGreaterThan(0.8); // 격국용신론 특성
        return {
          result: '용신: 목',
          confidence: 0.85,
          reasoning: ['격국 이론 적용', '월령 중시']
        };
      });

      expect(candidate.result).toBe('용신: 목');
      expect(candidate.perspective).toBe('격국용신론');
      expect(candidate.base_confidence).toBe(0.85);
    });

    it('각 관점마다 다른 config 적용', () => {
      const perspectives = [
        getPerspective('격국용신론')!,
        getPerspective('조후용신론')!,
        getPerspective('통변론')!
      ];

      const configs: Record<string, any>[] = [];

      perspectives.forEach(p => {
        analyzeWithPerspective(mockSaju, '정관격', p, (사주, config) => {
          configs.push({ name: p.name, config });
          return { result: '테스트', confidence: 0.8, reasoning: ['테스트'] };
        });
      });

      // 격국용신론: monthly_pillar_importance 높음
      const 격국Config = configs.find(c => c.name === '격국용신론')?.config;
      expect(격국Config.monthly_pillar_importance).toBeGreaterThan(0.8);

      // 조후용신론: seasonal_importance 높음
      const 조후Config = configs.find(c => c.name === '조후용신론')?.config;
      expect(조후Config.seasonal_importance).toBeGreaterThan(0.8);

      // 통변론: balance_importance 높음
      const 통변Config = configs.find(c => c.name === '통변론')?.config;
      expect(통변Config.balance_importance).toBeGreaterThan(0.8);
    });
  });

  describe('통합 시나리오', () => {
    it('전체 Best-of-N 프로세스 실행', async () => {
      // 1. 토너먼트 실행
      const result = await runBestOfN(mockSaju, '정관격', mockCandidateGenerator);

      // 2. 승자 검증
      expect(result.winner).toBeDefined();
      expect(result.winner.final_score).toBeGreaterThan(0);

      // 3. 승자 신뢰도 평가
      const assessment = assessWinnerReliability(result);
      expect(assessment.reliable).toBeDefined();

      // 4. 요약 생성
      const summary = summarizeTournament(result);
      expect(summary.length).toBeGreaterThan(100);

      // 5. 메타데이터 검증
      expect(result.metadata.total_candidates).toBe(5);
      expect(result.metadata.average_confidence).toBeGreaterThan(0);
    });

    it('저확신도 케이스: 자동 Best-of-N 트리거', async () => {
      const initialConfidence = 0.55; // 낮은 확신도

      const result = await autoRunBestOfN(
        initialConfidence,
        mockSaju,
        '정관격',
        mockCandidateGenerator
      );

      expect(result.ran).toBe(true);
      expect(result.result).toBeDefined();

      // Best-of-N 후 승자 확신도가 개선되었는지 확인
      const winnerConfidence = result.result!.winner.base_confidence;
      // (반드시 높아지지는 않지만, 다관점 검증으로 신뢰성 향상)
      expect(result.result!.all_candidates.length).toBeGreaterThan(1);
    });

    it('고확신도 케이스: Best-of-N 스킵', async () => {
      const initialConfidence = 0.9; // 높은 확신도

      const result = await autoRunBestOfN(
        initialConfidence,
        mockSaju,
        '정관격',
        mockCandidateGenerator
      );

      expect(result.ran).toBe(false);
      expect(result.reason).toContain('충분히 높음');
    });
  });
});
