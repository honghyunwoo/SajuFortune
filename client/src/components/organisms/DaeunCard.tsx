/**
 * 대운 타임라인 카드
 * 10년 주기 80년 생애 대운 표시
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import from shared types
import type { 대운결과 } from '@shared/daeun-calculator';

interface DaeunCardProps {
  daeun: 대운결과;
}

export function DaeunCard({ daeun }: DaeunCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          대운 타임라인
          <Badge variant="secondary">大運</Badge>
        </h3>
        
        {/* 전체 해석 */}
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {daeun.전체해석}
          </p>
        </div>

        {/* 대운 목록 */}
        <div className="space-y-3">
          {daeun.대운목록.map((daeunItem, index) => {
            const isCurrent = daeun.현재대운?.간 === daeunItem.간 &&
                             daeun.현재대운?.지 === daeunItem.지;
            
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
                      {daeunItem.간}{daeunItem.지}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {daeunItem.시작나이}세 - {daeunItem.종료나이}세
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs mt-1"
                      >
                        {daeunItem.대운오행.간} / {daeunItem.대운오행.지}
                      </Badge>
                    </div>
                  </div>
                  {isCurrent && (
                    <Badge className="bg-primary text-primary-foreground">
                      현재 대운
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {daeunItem.해석}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

