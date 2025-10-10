/**
 * 사주 결과 표시 메인 컴포넌트
 * Refactored: Organism 컴포넌트 분리로 유지보수성 향상
 */

import type { FortuneReading } from '@shared/schema';
import type { PremiumSajuAnalysis } from '@/lib/premium-calculator';
import { LegalWarningBanner } from './legal-warning-banner';
import { SajuPillarsCard } from './organisms/SajuPillarsCard';
import { PersonalityCard } from './organisms/PersonalityCard';
import { TodayFortuneCard } from './organisms/TodayFortuneCard';
import { DetailedAnalysisCard } from './organisms/DetailedAnalysisCard';
import { GeokgukCard } from './organisms/GeokgukCard';
import { DaeunCard } from './organisms/DaeunCard';
import { SibiunseongCard } from './organisms/SibiunseongCard';
import { FortuneDetailedCard } from './organisms/FortuneDetailedCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResultDisplayProps {
  reading: FortuneReading & { premiumResult?: PremiumSajuAnalysis };
}

export default function ResultDisplay({ reading }: ResultDisplayProps) {
  const { sajuData, analysisResult, premiumResult } = reading;

  return (
    <div className="space-y-8">
      {/* Legal Warning Banner */}
      <LegalWarningBanner variant="default" dismissible={true} showOnce={false} />

      {/* Saju Pillars - 사주팔자 */}
      <SajuPillarsCard sajuData={sajuData} />

      {/* Personality - 기본 성격 분석 */}
      <PersonalityCard personality={analysisResult.personality} />

      {/* Today's Fortune - 오늘의 운세 */}
      <TodayFortuneCard todayFortune={analysisResult.todayFortune} />

      {/* Detailed Analysis - 상세 운세 분석 */}
      {analysisResult.detailedAnalysis && (
        <DetailedAnalysisCard detailedAnalysis={analysisResult.detailedAnalysis} />
      )}

      {/* Compatibility Analysis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            궁합 분석
            <Badge variant="secondary">✨ 전체 공개</Badge>
          </h3>
              <div className="space-y-4">
                {analysisResult.compatibility && Object.entries(analysisResult.compatibility).map(([type, data]: [string, any]) => (
                  <div key={type} className="p-4 bg-muted/10 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {type === 'zodiac' ? '띠 궁합' : 
                         type === 'saju' ? '사주 궁합' : 
                         type === 'element' ? '오행 궁합' : type}
                      </span>
                      <Badge variant={data.compatibility === '최고' ? 'default' : data.compatibility === '양호' ? 'secondary' : 'outline'}>
                        {data.compatibility}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {data.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

      {/* Monthly Fortune */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            2025년 월별 운세
            <Badge variant="secondary">✨ 전체 공개</Badge>
          </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResult.monthlyFortune && analysisResult.monthlyFortune.map((month: any, index: number) => (
                  <div key={index} className="p-4 bg-muted/10 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{month.month}월</span>
                      <span className="text-sm text-muted-foreground">{month.rating}/5</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {month.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

      {/* Advice and Recommendations */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            맞춤 조언 및 개선 방법
            <Badge variant="secondary">✨ 전체 공개</Badge>
          </h3>
              <div className="space-y-6">
                {analysisResult.advice && Object.entries(analysisResult.advice).map(([category, advice]: [string, any]) => (
                  <div key={category} className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border">
                    <h4 className="font-semibold mb-3 text-primary">
                      {category === 'general' ? '🌟 종합 조언' : 
                       category === 'career' ? '💼 직업 관련' : 
                       category === 'relationship' ? '💕 인간관계' : 
                       category === 'health' ? '🏥 건강 관리' : category}
                    </h4>
                    <ul className="space-y-2">
                      {advice.map((item: string, i: number) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="text-primary mr-2">•</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

      {/* Geokguk Analysis - 격국 분석 */}
      {analysisResult.geokguk && (
        <GeokgukCard geokguk={analysisResult.geokguk} />
      )}

      {/* Daeun Timeline - 대운 타임라인 */}
      {analysisResult.daeun && (
        <DaeunCard daeun={analysisResult.daeun} />
      )}

      {/* Sibiunseong Analysis - 십이운성 분석 */}
      {analysisResult.sibiunseong && (
        <SibiunseongCard sibiunseong={analysisResult.sibiunseong} />
      )}

      {/* Five Elements Analysis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            오행 균형 분석
            <Badge variant="secondary">✨ 전체 공개</Badge>
          </h3>
          <div className="grid grid-cols-5 gap-3 mb-6">
            {sajuData.elements && Object.entries(sajuData.elements).map(([element, count]: [string, any]) => (
              <div key={element} className={`text-center p-3 rounded-lg border ${
                element === 'wood' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                element === 'fire' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                element === 'earth' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                element === 'metal' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400' :
                element === 'water' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                'bg-muted/10'
              }`}>
                <div className="text-xs mb-1">
                  {element === 'wood' ? '목(木)' :
                   element === 'fire' ? '화(火)' :
                   element === 'earth' ? '토(土)' :
                   element === 'metal' ? '금(金)' :
                   element === 'water' ? '수(水)' : element}
                </div>
                <div className="text-lg font-bold">{count}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border">
            <h4 className="font-semibold mb-2 text-primary">🔮 오행 균형 해석</h4>
            <p className="text-sm text-muted-foreground">
              당신의 오행 구성을 보면 균형잡힌 에너지 분포를 가지고 있습니다.
              부족한 원소는 일상생활에서 보완하고, 강한 원소는 더욱 발휘해보세요.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 상세 운세 분석 (4개 탭) - premiumResult가 있을 경우만 표시 */}
      {premiumResult?.loveFortune && premiumResult?.wealthFortune &&
       premiumResult?.healthFortune && premiumResult?.careerFortune && (
        <FortuneDetailedCard
          loveFortune={premiumResult.loveFortune}
          wealthFortune={premiumResult.wealthFortune}
          healthFortune={premiumResult.healthFortune}
          careerFortune={premiumResult.careerFortune}
        />
      )}
    </div>
  );
}
