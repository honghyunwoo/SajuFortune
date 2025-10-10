/**
 * 상세 운세 분석 카드 (4개 운세 통합)
 *
 * 연애운, 재물운, 건강운, 직업운을 탭으로 표시
 */

import { Heart, DollarSign, Activity, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import type {
  LoveFortuneResult,
  WealthFortuneResult,
  HealthFortuneResult,
  CareerFortuneResult,
} from '@shared/types';

interface FortuneDetailedCardProps {
  loveFortune: LoveFortuneResult;
  wealthFortune: WealthFortuneResult;
  healthFortune: HealthFortuneResult;
  careerFortune: CareerFortuneResult;
}

export function FortuneDetailedCard({
  loveFortune,
  wealthFortune,
  healthFortune,
  careerFortune,
}: FortuneDetailedCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ✨ 상세 운세 분석
          <Badge variant="secondary">프리미엄</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="love" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="love" className="gap-2">
              <Heart className="h-4 w-4" />
              연애운
            </TabsTrigger>
            <TabsTrigger value="wealth" className="gap-2">
              <DollarSign className="h-4 w-4" />
              재물운
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-2">
              <Activity className="h-4 w-4" />
              건강운
            </TabsTrigger>
            <TabsTrigger value="career" className="gap-2">
              <Briefcase className="h-4 w-4" />
              직업운
            </TabsTrigger>
          </TabsList>

          {/* 연애운 탭 */}
          <TabsContent value="love" className="space-y-6 mt-6">
            {/* 종합 점수 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">종합 점수</span>
                <span className="text-2xl font-bold text-pink-600">{loveFortune.overallScore}점</span>
              </div>
              <Progress value={loveFortune.overallScore} className="h-2" />
            </div>

            {/* 연애 스타일 */}
            <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
              <h4 className="font-semibold text-pink-700 dark:text-pink-400 mb-2">💕 {loveFortune.loveStyle.type}</h4>
              <p className="text-sm text-muted-foreground mb-3">{loveFortune.loveStyle.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">강점</h5>
                  <ul className="text-sm space-y-1">
                    {loveFortune.loveStyle.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">주의할 점</h5>
                  <ul className="text-sm space-y-1">
                    {loveFortune.loveStyle.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-amber-500 mr-2">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 배우자궁 */}
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border">
              <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
                💑 배우자궁: {loveFortune.spousePalace.quality}
              </h4>
              <ul className="text-sm space-y-1 mb-2">
                {loveFortune.spousePalace.characteristics.map((char, i) => (
                  <li key={i}>• {char}</li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                궁합: {loveFortune.spousePalace.compatibility}
              </p>
            </div>

            {/* 현재 연애운 */}
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg border">
              <h4 className="font-semibold mb-2">📅 현재 연애운 ({loveFortune.currentFortune.score}점)</h4>
              <p className="text-sm mb-3">{loveFortune.currentFortune.status}</p>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <h5 className="text-sm font-semibold text-green-600 mb-1">기회</h5>
                  <ul className="text-sm space-y-1">
                    {loveFortune.currentFortune.opportunities.map((opp, i) => (
                      <li key={i}>✨ {opp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-amber-600 mb-1">주의사항</h5>
                  <ul className="text-sm space-y-1">
                    {loveFortune.currentFortune.challenges.map((chal, i) => (
                      <li key={i}>⚠️ {chal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 최적 만남 시기 */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">🗓️ 최적 만남 시기</h4>
              <div className="mb-2">
                <span className="text-sm font-medium">이번 해: </span>
                <span className="text-sm">
                  {loveFortune.optimalPeriods.months.map(m => `${m}월`).join(', ')}
                </span>
              </div>
              <div className="mb-3">
                <span className="text-sm font-medium">향후 좋은 해: </span>
                <span className="text-sm">
                  {loveFortune.optimalPeriods.years.map(y => `${y}년`).join(', ')}
                </span>
              </div>
              <ul className="text-sm space-y-1">
                {loveFortune.optimalPeriods.advice.map((adv, i) => (
                  <li key={i} className="text-muted-foreground">💡 {adv}</li>
                ))}
              </ul>
            </div>

            {/* 연애 조언 */}
            <div className="space-y-3">
              <h4 className="font-semibold">💬 맞춤 조언</h4>
              {loveFortune.advice.dating.length > 0 && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h5 className="text-sm font-semibold mb-2">데이트 조언</h5>
                  <ul className="text-sm space-y-1">
                    {loveFortune.advice.dating.map((adv, i) => (
                      <li key={i}>• {adv}</li>
                    ))}
                  </ul>
                </div>
              )}
              {loveFortune.advice.marriage.length > 0 && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h5 className="text-sm font-semibold mb-2">결혼 조언</h5>
                  <ul className="text-sm space-y-1">
                    {loveFortune.advice.marriage.map((adv, i) => (
                      <li key={i}>• {adv}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 재물운 탭 */}
          <TabsContent value="wealth" className="space-y-6 mt-6">
            {/* 종합 점수 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">종합 점수</span>
                <span className="text-2xl font-bold text-green-600">{wealthFortune.overallScore}점</span>
              </div>
              <Progress value={wealthFortune.overallScore} className="h-2" />
            </div>

            {/* 재성 분석 */}
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                💰 재성(財星): {wealthFortune.wealthStar.type}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">{wealthFortune.wealthStar.description}</p>
              <div className="mb-2">
                <span className="text-sm font-medium">강도: </span>
                <Progress value={wealthFortune.wealthStar.strength} className="h-2 inline-block w-32 ml-2" />
                <span className="ml-2 text-sm">{wealthFortune.wealthStar.strength}점</span>
              </div>
              <ul className="text-sm space-y-1">
                {wealthFortune.wealthStar.characteristics.map((char, i) => (
                  <li key={i}>• {char}</li>
                ))}
              </ul>
            </div>

            {/* 재물 획득 방식 */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">💼 재물 획득 방식</h4>
              <div className="mb-3">
                <span className="text-sm font-medium">주요 방식: </span>
                <Badge variant="default">{wealthFortune.acquisitionMethod.primary}</Badge>
                {wealthFortune.acquisitionMethod.secondary && (
                  <>
                    <span className="mx-2 text-sm">+</span>
                    <Badge variant="secondary">{wealthFortune.acquisitionMethod.secondary}</Badge>
                  </>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <h5 className="text-sm font-semibold text-green-600 mb-1">강점</h5>
                  <ul className="text-sm space-y-1">
                    {wealthFortune.acquisitionMethod.strengths.map((str, i) => (
                      <li key={i}>✓ {str}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-amber-600 mb-1">주의사항</h5>
                  <ul className="text-sm space-y-1">
                    {wealthFortune.acquisitionMethod.warnings.map((warn, i) => (
                      <li key={i}>! {warn}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 투자 성향 */}
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border">
              <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
                📊 투자 성향: {wealthFortune.investmentStyle.type}
              </h4>
              <div className="mb-3">
                <span className="text-sm font-medium">리스크 레벨: </span>
                <Badge variant={
                  wealthFortune.investmentStyle.riskLevel === '높음' ? 'destructive' :
                  wealthFortune.investmentStyle.riskLevel === '중간' ? 'default' : 'secondary'
                }>
                  {wealthFortune.investmentStyle.riskLevel}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div>
                  <h5 className="text-sm font-semibold text-green-600 mb-1">적합한 투자</h5>
                  <ul className="text-sm space-y-1">
                    {wealthFortune.investmentStyle.suitableInvestments.map((inv, i) => (
                      <li key={i}>✓ {inv}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-red-600 mb-1">피할 투자</h5>
                  <ul className="text-sm space-y-1">
                    {wealthFortune.investmentStyle.unsuitableInvestments.map((inv, i) => (
                      <li key={i}>✗ {inv}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-1">투자 조언</h5>
                <ul className="text-sm space-y-1">
                  {wealthFortune.investmentStyle.advice.map((adv, i) => (
                    <li key={i} className="text-muted-foreground">💡 {adv}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 현재 재물운 & 상승 시기 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border">
                <h4 className="font-semibold mb-2">📅 현재 재물운</h4>
                <p className="text-sm">{wealthFortune.currentFortune.status}</p>
                <div className="mt-2">
                  <Progress value={wealthFortune.currentFortune.score} className="h-2" />
                  <span className="text-xs text-muted-foreground">{wealthFortune.currentFortune.score}점</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 rounded-lg border">
                <h4 className="font-semibold mb-2">📈 재물운 상승 시기</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">이번 해: </span>
                    {wealthFortune.peakPeriods.months.map(m => `${m}월`).join(', ')}
                  </div>
                  <div>
                    <span className="font-medium">향후 좋은 해: </span>
                    {wealthFortune.peakPeriods.years.map(y => `${y}년`).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 건강운 탭 */}
          <TabsContent value="health" className="space-y-6 mt-6">
            {/* 종합 점수 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">종합 점수</span>
                <span className="text-2xl font-bold text-emerald-600">{healthFortune.overallScore}점</span>
              </div>
              <Progress value={healthFortune.overallScore} className="h-2" />
            </div>

            {/* 오행 균형 */}
            <div className="p-4 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20 rounded-lg border">
              <h4 className="font-semibold mb-3">⚖️ 오행 균형 (균형도: {healthFortune.elementBalance.balanceScore}점)</h4>
              <div className="grid grid-cols-5 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-xs text-green-600 dark:text-green-400">목(木)</div>
                  <Progress value={healthFortune.elementBalance.wood} className="h-2 my-1" />
                  <div className="text-xs">{healthFortune.elementBalance.wood}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-red-600 dark:text-red-400">화(火)</div>
                  <Progress value={healthFortune.elementBalance.fire} className="h-2 my-1" />
                  <div className="text-xs">{healthFortune.elementBalance.fire}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">토(土)</div>
                  <Progress value={healthFortune.elementBalance.earth} className="h-2 my-1" />
                  <div className="text-xs">{healthFortune.elementBalance.earth}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400">금(金)</div>
                  <Progress value={healthFortune.elementBalance.metal} className="h-2 my-1" />
                  <div className="text-xs">{healthFortune.elementBalance.metal}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-blue-600 dark:text-blue-400">수(水)</div>
                  <Progress value={healthFortune.elementBalance.water} className="h-2 my-1" />
                  <div className="text-xs">{healthFortune.elementBalance.water}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{healthFortune.elementBalance.analysis}</p>
            </div>

            {/* 취약 장기 */}
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">⚠️ 취약 장기 및 주의사항</h4>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div>
                  <h5 className="text-sm font-semibold text-red-600 mb-1">1차 주의</h5>
                  <ul className="text-sm space-y-1">
                    {healthFortune.vulnerableOrgans.primary.map((org, i) => (
                      <li key={i}>❗ {org}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-orange-600 mb-1">2차 주의</h5>
                  <ul className="text-sm space-y-1">
                    {healthFortune.vulnerableOrgans.secondary.map((org, i) => (
                      <li key={i}>⚠️ {org}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mb-2">
                <h5 className="text-sm font-semibold mb-1">경고 증상</h5>
                <ul className="text-sm space-y-1">
                  {healthFortune.vulnerableOrgans.warnings.map((warn, i) => (
                    <li key={i} className="text-muted-foreground">🚨 {warn}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-1">예방법</h5>
                <ul className="text-sm space-y-1">
                  {healthFortune.vulnerableOrgans.preventions.map((prev, i) => (
                    <li key={i} className="text-muted-foreground">✓ {prev}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 계절별 건강 관리 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border">
                <h5 className="text-sm font-semibold text-green-600 mb-2">🌸 봄</h5>
                <ul className="text-xs space-y-1">
                  {healthFortune.seasonalCare.spring.map((care, i) => (
                    <li key={i}>• {care}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border">
                <h5 className="text-sm font-semibold text-red-600 mb-2">☀️ 여름</h5>
                <ul className="text-xs space-y-1">
                  {healthFortune.seasonalCare.summer.map((care, i) => (
                    <li key={i}>• {care}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border">
                <h5 className="text-sm font-semibold text-yellow-600 mb-2">🍂 가을</h5>
                <ul className="text-xs space-y-1">
                  {healthFortune.seasonalCare.autumn.map((care, i) => (
                    <li key={i}>• {care}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                <h5 className="text-sm font-semibold text-blue-600 mb-2">❄️ 겨울</h5>
                <ul className="text-xs space-y-1">
                  {healthFortune.seasonalCare.winter.map((care, i) => (
                    <li key={i}>• {care}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 건강 주의 시기 & 생활습관 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">📅 건강 주의 시기</h4>
                <div className="text-sm space-y-1 mb-2">
                  <div>
                    <span className="font-medium">주의 월: </span>
                    {healthFortune.riskPeriods.months.map((m: number) => `${m}월`).join(', ')}
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  {healthFortune.riskPeriods.warnings.map((warn: string, i: number) => (
                    <div key={i}>⚠️ {warn}</div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg border">
                <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-2">💪 생활습관 조언</h4>
                <div className="text-xs space-y-2">
                  <div>
                    <strong>식단:</strong>
                    <div className="ml-2">{healthFortune.lifestyle.diet.map((d: string, i: number) => <div key={i}>• {d}</div>)}</div>
                  </div>
                  <div>
                    <strong>운동:</strong>
                    <div className="ml-2">{healthFortune.lifestyle.exercise.map((e: string, i: number) => <div key={i}>• {e}</div>)}</div>
                  </div>
                  <div>
                    <strong>수면:</strong>
                    <div className="ml-2">{healthFortune.lifestyle.sleep.map((s: string, i: number) => <div key={i}>• {s}</div>)}</div>
                  </div>
                  <div>
                    <strong>스트레스:</strong>
                    <div className="ml-2">{healthFortune.lifestyle.stress.map((st: string, i: number) => <div key={i}>• {st}</div>)}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 직업운 탭 */}
          <TabsContent value="career" className="space-y-6 mt-6">
            {/* 종합 점수 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">종합 점수</span>
                <span className="text-2xl font-bold text-blue-600">{careerFortune.overallScore}점</span>
              </div>
              <Progress value={careerFortune.overallScore} className="h-2" />
            </div>

            {/* 적성 직업 */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3">💼 적성 직업군</h4>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div>
                  <h5 className="text-sm font-semibold text-blue-600 mb-2">1순위 적성</h5>
                  <div className="flex flex-wrap gap-2">
                    {careerFortune.suitableCareers.primary.map((career, i) => (
                      <Badge key={i} variant="default">{career}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-blue-500 mb-2">2순위 적성</h5>
                  <div className="flex flex-wrap gap-2">
                    {careerFortune.suitableCareers.secondary.map((career, i) => (
                      <Badge key={i} variant="secondary">{career}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-semibold text-green-600 mb-1">강점</h5>
                  <ul className="text-sm space-y-1">
                    {careerFortune.suitableCareers.strengths.map((str, i) => (
                      <li key={i}>✓ {str}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-amber-600 mb-1">고려사항</h5>
                  <ul className="text-sm space-y-1">
                    {careerFortune.suitableCareers.considerations.map((con, i) => (
                      <li key={i}>💡 {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 관성 분석 */}
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border">
              <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
                👔 관성(官星): {careerFortune.officialStar.type}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">{careerFortune.officialStar.description}</p>
              <div className="mb-3">
                <span className="text-sm font-medium">강도: </span>
                <Progress value={careerFortune.officialStar.strength} className="h-2 inline-block w-32 ml-2" />
                <span className="ml-2 text-sm">{careerFortune.officialStar.strength}점</span>
              </div>
              <ul className="text-sm space-y-1">
                {careerFortune.officialStar.implications.map((impl, i) => (
                  <li key={i}>• {impl}</li>
                ))}
              </ul>
            </div>

            {/* 승진 & 이직 타이밍 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">📈 승진 타이밍</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">단기 전망: </span>
                    {careerFortune.promotionTiming.nearFuture}
                  </div>
                  <div>
                    <span className="font-medium">중기 전망: </span>
                    {careerFortune.promotionTiming.midTerm}
                  </div>
                  <div className="mt-2">
                    <h5 className="font-semibold mb-1">조언</h5>
                    <ul className="space-y-1">
                      {careerFortune.promotionTiming.advice.map((adv: string, i: number) => (
                        <li key={i} className="text-muted-foreground">💡 {adv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">🔄 이직 타이밍</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">최적 시기: </span>
                    {careerFortune.jobChangeTiming.optimal.map((m: number) => `${m}월`).join(', ')}
                  </div>
                  <div>
                    <span className="font-medium">주의 시기: </span>
                    {careerFortune.jobChangeTiming.caution.map((m: number) => `${m}월`).join(', ')}
                  </div>
                  <div className="mt-2">
                    <h5 className="font-semibold mb-1">조언</h5>
                    <ul className="space-y-1">
                      {careerFortune.jobChangeTiming.advice.map((adv: string, i: number) => (
                        <li key={i} className="text-muted-foreground">💡 {adv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 사업 운세 */}
            <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20 rounded-lg border">
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">🏪 사업 운세</h4>
              <div className="mb-3">
                <span className="text-sm font-medium">사업 적합도: </span>
                <Progress value={careerFortune.businessFortune.suitability} className="h-2 inline-block w-32 ml-2" />
                <span className="ml-2 text-sm">{careerFortune.businessFortune.suitability}점</span>
              </div>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-semibold text-blue-600 mb-1">추천 사업 유형</h5>
                  <p className="text-sm">{careerFortune.businessFortune.type}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-green-600 mb-1">사업 시작 적기</h5>
                  <p className="text-sm">{careerFortune.businessFortune.timing}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-red-600 mb-1">리스크 요인</h5>
                  <ul className="text-sm space-y-1">
                    {careerFortune.businessFortune.risks.map((risk: string, i: number) => (
                      <li key={i} className="text-muted-foreground">⚠️ {risk}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-amber-600 mb-1">사업 조언</h5>
                  <ul className="text-sm space-y-1">
                    {careerFortune.businessFortune.advice.map((adv: string, i: number) => (
                      <li key={i} className="text-muted-foreground">💡 {adv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
