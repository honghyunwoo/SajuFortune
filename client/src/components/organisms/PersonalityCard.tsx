/**
 * 기본 성격 분석 카드
 */

import { Card, CardContent } from '@/components/ui/card';

interface PersonalityCardProps {
  personality: string;
}

export function PersonalityCard({ personality }: PersonalityCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">기본 성격 분석</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {personality}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
