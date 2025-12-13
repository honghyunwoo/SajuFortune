import { useEffect, useRef } from 'react';

interface AdSenseInlineProps {
  adSlot: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSenseInline({ adSlot, className = '' }: AdSenseInlineProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;

    if (!publisherId || publisherId === 'ca-pub-XXXXXXXX') {
      return;
    }

    if (isAdLoaded.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isAdLoaded.current = true;
    } catch (error) {
      console.error('[AdSense] Error loading inline ad:', error);
    }
  }, []);

  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;
  const isConfigured = publisherId && publisherId !== 'ca-pub-XXXXXXXX';

  if (!isConfigured) {
    return (
      <div
        className={`my-6 bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground text-sm ${className}`}
        style={{ minHeight: '250px' }}
      >
        <div className="text-center p-4">
          <p>인피드 광고 영역</p>
          <p className="text-xs opacity-60">(AdSense 설정 후 표시됩니다)</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={adRef} className={`my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
      />
    </div>
  );
}
