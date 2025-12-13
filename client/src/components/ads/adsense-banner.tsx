import { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSenseBanner({
  adSlot,
  adFormat = 'auto',
  className = '',
  style,
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // AdSense Publisher ID가 설정되어 있는지 확인
    const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;

    if (!publisherId || publisherId === 'ca-pub-XXXXXXXX') {
      console.log('[AdSense] Publisher ID not configured, showing placeholder');
      return;
    }

    // 이미 로드된 경우 스킵
    if (isAdLoaded.current) return;

    try {
      // 광고 로드
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isAdLoaded.current = true;
    } catch (error) {
      console.error('[AdSense] Error loading ad:', error);
    }
  }, []);

  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;
  const isConfigured = publisherId && publisherId !== 'ca-pub-XXXXXXXX';

  // AdSense가 설정되지 않은 경우 placeholder 표시
  if (!isConfigured) {
    return (
      <div
        className={`bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground text-sm ${className}`}
        style={{ minHeight: '90px', ...style }}
      >
        <div className="text-center p-4">
          <p>광고 영역</p>
          <p className="text-xs opacity-60">(AdSense 설정 후 표시됩니다)</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
