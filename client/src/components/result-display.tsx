import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FortuneReading } from '@shared/schema';

interface ResultDisplayProps {
  reading: FortuneReading;
}

export default function ResultDisplay({ reading }: ResultDisplayProps) {
  const { sajuData, analysisResult, serviceType } = reading;

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

      {/* Premium Features */}
      {serviceType === 'premium' && (
        <>
          {/* Detailed Life Analysis */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                상세 운세 분석
                <Badge>프리미엄</Badge>
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
                <Badge>프리미엄</Badge>
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
                2024년 월별 운세
                <Badge>프리미엄</Badge>
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
                <Badge>프리미엄</Badge>
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
        </>
      )}

      {/* Five Elements Analysis (Always shown but limited for free) */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            오행 균형 분석
            {serviceType === 'free' && <Badge variant="outline">미리보기</Badge>}
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
          {serviceType === 'free' && (
            <div className="text-center p-4 bg-muted/10 rounded-lg border-2 border-dashed border-muted">
              <p className="text-muted-foreground text-sm">
                프리미엄에서 오행 균형 상세 분석과 개선 방법을 확인하세요
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
