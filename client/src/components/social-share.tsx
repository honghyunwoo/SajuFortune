/**
 * 소셜 공유 버튼 컴포넌트
 * 카카오톡, 페이스북, 트위터, 링크 복사 등
 */

import { Button } from '@/components/ui/button';
import { Share2, Link as LinkIcon, Facebook, Twitter } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  shareSajuResult,
  shareCompatibilityResult,
  shareMonthlyFortune,
  shareGenericPage,
} from '@/lib/kakao-share';

// Kakao 아이콘 SVG
const KakaoIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 0C4.03125 0 0 3.16406 0 7.03125C0 9.56641 1.59375 11.8125 4.00781 13.1367L3.16406 16.3828C3.09375 16.6289 3.35156 16.8164 3.5625 16.6641L7.45312 14.0859C7.95312 14.1445 8.46094 14.1797 9 14.1797C13.9688 14.1797 18 11.0156 18 7.03125C18 3.16406 13.9688 0 9 0Z"
      fill="currentColor"
    />
  </svg>
);

interface ShareButtonsProps {
  type: 'saju' | 'compatibility' | 'monthly' | 'generic';
  data?: {
    // 사주 결과 데이터
    readingId?: string;
    userName?: string;
    birthDate?: string;
    overallScore?: number;
    // 궁합 데이터
    person1Name?: string;
    person2Name?: string;
    compatibilityScore?: number;
    // 월별 운세 데이터
    currentMonth?: number;
    monthScore?: number;
    // 일반 페이지 데이터
    title?: string;
    description?: string;
    imageUrl?: string;
    url?: string;
  };
}

export default function SocialShareButtons({ type, data = {} }: ShareButtonsProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  /**
   * 카카오톡 공유
   */
  const handleKakaoShare = () => {
    setIsSharing(true);

    try {
      switch (type) {
        case 'saju':
          if (data.readingId && data.userName && data.birthDate && data.overallScore !== undefined) {
            shareSajuResult({
              readingId: data.readingId,
              userName: data.userName,
              birthDate: data.birthDate,
              overallScore: data.overallScore,
            });
          }
          break;

        case 'compatibility':
          if (data.person1Name && data.person2Name && data.compatibilityScore !== undefined) {
            shareCompatibilityResult({
              person1Name: data.person1Name,
              person2Name: data.person2Name,
              compatibilityScore: data.compatibilityScore,
            });
          }
          break;

        case 'monthly':
          if (data.userName && data.currentMonth && data.monthScore !== undefined) {
            shareMonthlyFortune({
              userName: data.userName,
              currentMonth: data.currentMonth,
              monthScore: data.monthScore,
            });
          }
          break;

        case 'generic':
          if (data.title && data.description) {
            shareGenericPage({
              title: data.title,
              description: data.description,
              imageUrl: data.imageUrl,
              url: data.url,
            });
          }
          break;
      }

      toast({
        title: '카카오톡 공유',
        description: '카카오톡으로 공유되었습니다.',
      });
    } catch (error) {
      console.error('Kakao share error:', error);
      toast({
        title: '공유 실패',
        description: '카카오톡 공유에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * 페이스북 공유
   */
  const handleFacebookShare = () => {
    const url = encodeURIComponent(data.url || window.location.href);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');

    toast({
      title: '페이스북 공유',
      description: '페이스북으로 공유되었습니다.',
    });

    // GA4 트래킹
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: 'facebook',
        content_type: type,
      });
    }
  };

  /**
   * 트위터 공유
   */
  const handleTwitterShare = () => {
    const text = encodeURIComponent(data.title || '사주팔자 분석 결과');
    const url = encodeURIComponent(data.url || window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');

    toast({
      title: '트위터 공유',
      description: '트위터로 공유되었습니다.',
    });

    // GA4 트래킹
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: 'twitter',
        content_type: type,
      });
    }
  };

  /**
   * 링크 복사
   */
  const handleCopyLink = async () => {
    const url = data.url || window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: '링크 복사 완료',
        description: '클립보드에 링크가 복사되었습니다.',
      });

      // GA4 트래킹
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: 'link_copy',
          content_type: type,
        });
      }
    } catch (error) {
      console.error('Copy link error:', error);
      toast({
        title: '복사 실패',
        description: '링크 복사에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  /**
   * 네이티브 공유 (모바일)
   */
  const handleNativeShare = async () => {
    if (!navigator.share) {
      toast({
        title: '공유 불가',
        description: '이 브라우저는 공유 기능을 지원하지 않습니다.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.share({
        title: data.title || '사주팔자 운세',
        text: data.description || '나의 사주 분석 결과를 확인해보세요!',
        url: data.url || window.location.href,
      });

      toast({
        title: '공유 완료',
        description: '공유되었습니다.',
      });

      // GA4 트래킹
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: 'native',
          content_type: type,
        });
      }
    } catch (error: any) {
      // 사용자가 취소한 경우는 에러로 처리하지 않음
      if (error.name !== 'AbortError') {
        console.error('Native share error:', error);
        toast({
          title: '공유 실패',
          description: '공유에 실패했습니다.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        결과 공유하기
      </div>

      <div className="flex flex-wrap gap-2">
        {/* 카카오톡 공유 */}
        <Button
          onClick={handleKakaoShare}
          disabled={isSharing}
          className="bg-[#FEE500] hover:bg-[#FDD835] text-black"
        >
          <KakaoIcon />
          <span className="ml-2">카카오톡</span>
        </Button>

        {/* 페이스북 공유 */}
        <Button onClick={handleFacebookShare} className="bg-[#1877F2] hover:bg-[#166FE5]">
          <Facebook className="w-4 h-4" />
          <span className="ml-2">페이스북</span>
        </Button>

        {/* 트위터 공유 */}
        <Button onClick={handleTwitterShare} className="bg-[#1DA1F2] hover:bg-[#1A91DA]">
          <Twitter className="w-4 h-4" />
          <span className="ml-2">트위터</span>
        </Button>

        {/* 링크 복사 */}
        <Button onClick={handleCopyLink} variant="outline">
          <LinkIcon className="w-4 h-4" />
          <span className="ml-2">링크 복사</span>
        </Button>

        {/* 네이티브 공유 (모바일에서만 표시) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button onClick={handleNativeShare} variant="outline">
            <Share2 className="w-4 h-4" />
            <span className="ml-2">공유</span>
          </Button>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        친구들과 결과를 공유하고 함께 운세를 확인해보세요!
      </div>
    </div>
  );
}
