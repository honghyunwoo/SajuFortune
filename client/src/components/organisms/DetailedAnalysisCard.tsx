/**
 * 상세 운세 분석 카드
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DetailedAnalysisItem {
  score: number;
  level: string;
  description: string;
}

interface DetailedAnalysisCardProps {
  detailedAnalysis: Record<string, DetailedAnalysisItem> | {
    love: DetailedAnalysisItem;
    career: DetailedAnalysisItem;
    health: DetailedAnalysisItem;
    money: DetailedAnalysisItem;
  };
}

export function DetailedAnalysisCard({ detailedAnalysis }: DetailedAnalysisCardProps) {
  const categoryLabels: Record<string, { emoji: string; label: string }> = {
    love: { emoji: '💕', label: '연애운' },
    career: { emoji: '💼', label: '직업운' },
    health: { emoji: '🏥', label: '건강운' },
    money: { emoji: '💰', label: '재물운' }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          상세 운세 분석
          <Badge variant="secondary">✨ 전체 공개</Badge>
        </h3>
        
        {/* 점수 요약 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(detailedAnalysis).map(([key, value]) => (
            <div key={key} className="text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-2">
                {categoryLabels[key]?.label || key}
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

        {/* 상세 설명 */}
        <div className="space-y-4">
          {Object.entries(detailedAnalysis).map(([key, value]) => (
            <div key={key} className="p-4 bg-muted/10 rounded-lg">
              <h4 className="font-semibold mb-2">
                {categoryLabels[key]?.emoji} {categoryLabels[key]?.label || key}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
