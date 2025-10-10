/**
 * 격국 분석 카드
 * 8대 정격 + 특수격 분석 표시
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface 격국결과 {
  격국명: string;
  격국종류: string;
  격국강도: number;
  용신: string;
  희신: string[];
  격국함의: string;
  상세해석: {
    장점: string[];
    주의사항: string[];
    적합직업: string[];
  };
}

interface GeokgukCardProps {
  geokguk: 격국결과;
}

export function GeokgukCard({ geokguk }: GeokgukCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          격국 분석
          <Badge variant="secondary">格局分析</Badge>
        </h3>
        
        <div className="space-y-6">
          {/* 격국 요약 */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20">
            <div>
              <div className="text-sm text-muted-foreground mb-1">당신의 격국</div>
              <div className="text-2xl font-bold text-primary">{geokguk.격국명}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {geokguk.격국종류} • 강도 {geokguk.격국강도}/100
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">용신/희신</div>
              <div className="text-lg font-semibold">{geokguk.용신}</div>
              <div className="text-sm text-muted-foreground">{geokguk.희신.join(', ')}</div>
            </div>
          </div>

          {/* 격국 함의 */}
          <div className="p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2 text-primary">🎯 격국 함의</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {geokguk.격국함의}
            </p>
          </div>

          {/* 장점 & 주의사항 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">✅ 장점</h4>
              <ul className="space-y-2">
                {geokguk.상세해석.장점.map((item, i) => (
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
                {geokguk.상세해석.주의사항.map((item, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 적합 직업 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">💼 적합한 직업</h4>
            <div className="flex flex-wrap gap-2">
              {geokguk.상세해석.적합직업.map((job, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {job}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

