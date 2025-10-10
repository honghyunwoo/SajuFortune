/**
 * 십이운성 분석 카드
 * 12가지 생명 에너지 단계 분석
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface 십이운성항목 {
  운성: string;
  강도: number;
  해석: string;
}

interface 십이운성결과 {
  년주십이운성: 십이운성항목;
  월주십이운성: 십이운성항목;
  일주십이운성: 십이운성항목;
  시주십이운성: 십이운성항목;
  전체평가: {
    주요운성: string[];
    생애에너지: number;
    종합해석: string;
  };
}

interface SibiunseongCardProps {
  sibiunseong: 십이운성결과;
}

export function SibiunseongCard({ sibiunseong }: SibiunseongCardProps) {
  const pillars = [
    { label: '년주 (Year)', data: sibiunseong.년주십이운성, color: 'purple' },
    { label: '월주 (Month)', data: sibiunseong.월주십이운성, color: 'blue' },
    { label: '일주 (Day)', data: sibiunseong.일주십이운성, color: 'green' },
    { label: '시주 (Hour)', data: sibiunseong.시주십이운성, color: 'orange' }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          십이운성 분석
          <Badge variant="secondary">十二運星</Badge>
        </h3>

        {/* 전체 평가 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">생애 에너지</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {sibiunseong.전체평가.생애에너지}점
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">주요 운성</div>
              <div className="flex gap-2">
                {sibiunseong.전체평가.주요운성.map((운성, i) => (
                  <Badge key={i} variant="default" className="bg-purple-600 text-white">
                    {운성}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {sibiunseong.전체평가.종합해석}
          </p>
        </div>

        {/* 각 주별 십이운성 */}
        <div className="grid md:grid-cols-2 gap-4">
          {pillars.map(({ label, data, color }) => {
            const bgColor = {
              purple: 'bg-purple-500',
              blue: 'bg-blue-500',
              green: 'bg-green-500',
              orange: 'bg-orange-500'
            }[color];

            return (
              <div key={label} className="p-4 bg-muted/10 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{label}</span>
                  <Badge variant="outline">{data.운성}</Badge>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className={`${bgColor} h-full rounded-full`}
                        style={{ width: `${data.강도}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {data.강도}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {data.해석}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

