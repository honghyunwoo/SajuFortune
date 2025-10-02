import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FortuneReading } from '@shared/schema';

interface ResultDisplayProps {
  reading: FortuneReading;
}

export default function ResultDisplay({ reading }: ResultDisplayProps) {
  const { sajuData, analysisResult } = reading;

  return (
    <div className="space-y-8">
      {/* Saju Pillars */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            사주팔자
            <Badge variant="secondary">四柱八字</Badge>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sajuData.pillars.map((pillar: any, index: number) => (
              <div key={index} className="text-center p-4 bg-muted/10 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-2">
                  {['년주', '월주', '일주', '시주'][index]}
                </div>
                <div className="text-lg font-bold text-primary mb-1">
                  {pillar.heavenly}{pillar.earthly}
                </div>
                <div className="text-xs text-muted-foreground">
                  {pillar.element}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Basic Personality Analysis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">기본 성격 분석</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {analysisResult.personality}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Fortune (Always Available) */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">오늘의 운세</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-3">
                <span className="text-primary text-xl">
                  {"★".repeat(analysisResult.todayFortune.rating)}{"☆".repeat(5 - analysisResult.todayFortune.rating)}
                </span>
                <span className="ml-2 font-medium">종합운: {analysisResult.todayFortune.overall}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {analysisResult.todayFortune.description}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-muted/10 rounded">
                <span className="text-sm">연애운</span>
                <span className="font-medium">{analysisResult.todayFortune.love}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/10 rounded">
                <span className="text-sm">직업운</span>
                <span className="font-medium">{analysisResult.todayFortune.career}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/10 rounded">
                <span className="text-sm">재물운</span>
                <span className="font-medium">{analysisResult.todayFortune.money}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Life Analysis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            상세 운세 분석
            <Badge variant="secondary">✨ 전체 공개</Badge>
          </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Object.entries(analysisResult.detailedAnalysis || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-2">
                      {key === 'love' ? '연애운' : 
                       key === 'career' ? '직업운' : 
                       key === 'health' ? '건강운' : 
                       key === 'money' ? '재물운' : key}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {value.score}점
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {value.level}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {Object.entries(analysisResult.detailedAnalysis || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="p-4 bg-muted/10 rounded-lg">
                    <h4 className="font-semibold mb-2">
                      {key === 'love' ? '💕 연애운' : 
                       key === 'career' ? '💼 직업운' : 
                       key === 'health' ? '🏥 건강운' : 
                       key === 'money' ? '💰 재물운' : key}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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

      {/* Geokguk Analysis */}
      {analysisResult.geokguk && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              격국 분석
              <Badge variant="secondary">格局分析</Badge>
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">당신의 격국</div>
                  <div className="text-2xl font-bold text-primary">{analysisResult.geokguk.격국명}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {analysisResult.geokguk.격국종류} • 강도 {analysisResult.geokguk.격국강도}/100
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">용신/희신</div>
                  <div className="text-lg font-semibold">{analysisResult.geokguk.용신}</div>
                  <div className="text-sm text-muted-foreground">{analysisResult.geokguk.희신.join(', ')}</div>
                </div>
              </div>

              <div className="p-4 bg-muted/10 rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">🎯 격국 함의</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysisResult.geokguk.격국함의}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">✅ 장점</h4>
                  <ul className="space-y-2">
                    {analysisResult.geokguk.상세해석.장점.map((item: string, i: number) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold mb-3 text-amber-700 dark:text-amber-400">⚠️ 주의사항</h4>
                  <ul className="space-y-2">
                    {analysisResult.geokguk.상세해석.주의사항.map((item: string, i: number) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">💼 적합한 직업</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.geokguk.상세해석.적합직업.map((job: string, i: number) => (
                    <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {job}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daeun Timeline */}
      {analysisResult.daeun && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              대운 타임라인
              <Badge variant="secondary">大運</Badge>
            </h3>
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysisResult.daeun.전체해석}
              </p>
            </div>
            <div className="space-y-3">
              {analysisResult.daeun.대운목록.map((daeun: any, index: number) => {
                const isCurrent = analysisResult.daeun?.현재대운?.간 === daeun.간 &&
                                 analysisResult.daeun?.현재대운?.지 === daeun.지;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary shadow-md'
                        : 'bg-muted/10 border-transparent hover:border-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-primary">
                          {daeun.간}{daeun.지}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {daeun.시작나이}세 - {daeun.종료나이}세
                        </div>
                        {isCurrent && (
                          <Badge variant="default" className="ml-2">현재</Badge>
                        )}
                      </div>
                      <Badge
                        variant={
                          daeun.길흉 === '대길' ? 'default' :
                          daeun.길흉 === '길' ? 'secondary' :
                          daeun.길흉 === '평' ? 'outline' :
                          'destructive'
                        }
                      >
                        {daeun.길흉}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-2 text-sm">
                      <span className="text-muted-foreground">
                        천간: <span className="font-medium text-foreground">{daeun.대운오행.간}</span>
                      </span>
                      <span className="text-muted-foreground">
                        지지: <span className="font-medium text-foreground">{daeun.대운오행.지}</span>
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {daeun.해석}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sibiunseong (12 Life Stages) Analysis */}
      {analysisResult.sibiunseong && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              십이운성 분석
              <Badge variant="secondary">十二運星</Badge>
            </h3>

            {/* Overall Life Energy */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">생애 에너지</div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {analysisResult.sibiunseong.전체평가.생애에너지}점
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">주요 운성</div>
                  <div className="flex gap-2">
                    {analysisResult.sibiunseong.전체평가.주요운성.map((운성: string, i: number) => (
                      <Badge key={i} variant="default" className="bg-purple-600 text-white">
                        {운성}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysisResult.sibiunseong.전체평가.종합해석}
              </p>
            </div>

            {/* Each Pillar's Sibiunseong */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/10 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">년주 (Year)</span>
                  <Badge variant="outline">{analysisResult.sibiunseong.년주십이운성.운성}</Badge>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full"
                        style={{ width: `${analysisResult.sibiunseong.년주십이운성.강도}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {analysisResult.sibiunseong.년주십이운성.강도}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {analysisResult.sibiunseong.년주십이운성.해석}
                </p>
              </div>

              <div className="p-4 bg-muted/10 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">월주 (Month)</span>
                  <Badge variant="outline">{analysisResult.sibiunseong.월주십이운성.운성}</Badge>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${analysisResult.sibiunseong.월주십이운성.강도}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {analysisResult.sibiunseong.월주십이운성.강도}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {analysisResult.sibiunseong.월주십이운성.해석}
                </p>
              </div>

              <div className="p-4 bg-muted/10 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">일주 (Day)</span>
                  <Badge variant="outline">{analysisResult.sibiunseong.일주십이운성.운성}</Badge>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${analysisResult.sibiunseong.일주십이운성.강도}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {analysisResult.sibiunseong.일주십이운성.강도}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {analysisResult.sibiunseong.일주십이운성.해석}
                </p>
              </div>

              <div className="p-4 bg-muted/10 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">시주 (Hour)</span>
                  <Badge variant="outline">{analysisResult.sibiunseong.시주십이운성.운성}</Badge>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{ width: `${analysisResult.sibiunseong.시주십이운성.강도}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {analysisResult.sibiunseong.시주십이운성.강도}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {analysisResult.sibiunseong.시주십이운성.해석}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
}
