/**
 * 프리미엄 기능 제한 게이트
 * 무료 사용자가 제한에 도달했을 때 표시
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Crown, Lock } from 'lucide-react';

interface PremiumGateProps {
  feature: 'sajuReading' | 'compatibility' | 'monthlyFortune';
  userId?: string;
  onAllow: () => void;
}

const FEATURE_NAMES = {
  sajuReading: '사주 분석',
  compatibility: '궁합 분석',
  monthlyFortune: '월별 운세',
};

export default function PremiumGate({ feature, userId, onAllow }: PremiumGateProps) {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<{
    allowed: boolean;
    isPremium: boolean;
    limitReached?: boolean;
    remaining?: number;
  } | null>(null);

  useEffect(() => {
    checkUsage();
  }, [feature, userId]);

  const checkUsage = async () => {
    if (!userId) {
      // 비로그인 사용자는 기본적으로 허용 (나중에 세션/쿠키 기반 제한 추가 가능)
      setStatus({ allowed: true, isPremium: false });
      onAllow();
      return;
    }

    try {
      const response = await fetch('/api/subscription/increment-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, feature }),
      });

      const data = await response.json();
      setStatus(data);

      if (data.allowed) {
        onAllow();
      } else if (data.limitReached) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Usage check error:', error);
      // 에러 발생 시 기본적으로 허용
      setStatus({ allowed: true, isPremium: false });
      onAllow();
    }
  };

  const handleUpgrade = () => {
    setLocation('/premium');
  };

  if (!status || status.allowed) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-yellow-600" />
            무료 사용 한도 초과
          </DialogTitle>
          <DialogDescription>
            {FEATURE_NAMES[feature]} 무료 사용 한도를 모두 사용했습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              프리미엄으로 업그레이드하고 무제한으로 이용하세요
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span>무제한 사주 분석</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span>무제한 궁합 분석</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span>무제한 월별 운세</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span>PDF 다운로드</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span>광고 없음</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleUpgrade} className="w-full">
              <Crown className="mr-2 h-4 w-4" />
              프리미엄 업그레이드 (월 9,900원)
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
              다음 달에 다시 시도
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
