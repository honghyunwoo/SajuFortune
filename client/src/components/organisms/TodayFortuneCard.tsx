/**
 * 오늘의 운세 카드
 */

import { Card, CardContent } from '@/components/ui/card';

interface TodayFortune {
  rating: number;
  overall: string;
  description: string;
  love: string;
  career: string;
  money: string;
}

interface TodayFortuneCardProps {
  todayFortune: TodayFortune;
}

export function TodayFortuneCard({ todayFortune }: TodayFortuneCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">오늘의 운세</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-3">
              <span className="text-primary text-xl">
                {"★".repeat(todayFortune.rating)}{"☆".repeat(5 - todayFortune.rating)}
              </span>
              <span className="ml-2 font-medium">종합운: {todayFortune.overall}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {todayFortune.description}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-muted/10 rounded">
              <span className="text-sm">연애운</span>
              <span className="font-medium">{todayFortune.love}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/10 rounded">
              <span className="text-sm">직업운</span>
              <span className="font-medium">{todayFortune.career}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/10 rounded">
              <span className="text-sm">재물운</span>
              <span className="font-medium">{todayFortune.money}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
