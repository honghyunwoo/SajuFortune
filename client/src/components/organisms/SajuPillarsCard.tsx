/**
 * 사주팔자 카드
 * 년/월/일/시 4주 표시
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SajuData } from '@shared/schema';

interface SajuPillarsCardProps {
  sajuData: SajuData;
}

export function SajuPillarsCard({ sajuData }: SajuPillarsCardProps) {
  const pillarLabels = ['년주', '월주', '일주', '시주'];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          사주팔자
          <Badge variant="secondary">四柱八字</Badge>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sajuData.pillars.map((pillar, index) => (
            <div key={index} className="text-center p-4 bg-muted/10 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-2">
                {pillarLabels[index]}
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
  );
}
