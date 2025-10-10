/**
 * 카카오톡 공유하기 기능
 * Kakao SDK를 사용하여 결과 페이지를 공유
 */

// Kakao SDK 타입 정의
declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (settings: {
          objectType: 'feed';
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons?: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
  }
}

/**
 * Kakao SDK 초기화
 */
export function initKakaoSDK(appKey: string) {
  if (typeof window === 'undefined') return;

  // 이미 초기화되었으면 스킵
  if (window.Kakao && window.Kakao.isInitialized()) {
    return;
  }

  // SDK 스크립트 로드
  const script = document.createElement('script');
  script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
  script.integrity =
    'sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/yjOkk9OV1C2Xfzu/PMWpEoJY8U+';
  script.crossOrigin = 'anonymous';
  script.async = true;

  script.onload = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(appKey);
      console.log('[Kakao] SDK initialized');
    }
  };

  document.head.appendChild(script);
}

/**
 * 사주 결과 카카오톡 공유하기
 */
export function shareSajuResult(params: {
  readingId: string;
  userName: string;
  birthDate: string;
  overallScore: number;
}) {
  const { readingId, userName, birthDate, overallScore } = params;

  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error('[Kakao] SDK not initialized');
    alert('카카오톡 공유 기능을 사용할 수 없습니다. 페이지를 새로고침 해주세요.');
    return;
  }

  const baseUrl = window.location.origin;
  const resultUrl = `${baseUrl}/results/${readingId}`;

  // UTM 파라미터 추가 (공유 추적)
  const shareUrl = `${resultUrl}?utm_source=kakao&utm_medium=share&utm_campaign=saju_result`;

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${userName}님의 사주팔자 분석 결과`,
        description: `생년월일: ${birthDate}\n종합 점수: ${overallScore}점\n\n나의 운명을 확인해보세요!`,
        imageUrl: `${baseUrl}/og-image-saju.png`, // Open Graph 이미지
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '결과 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        {
          title: '내 사주도 보기',
          link: {
            mobileWebUrl: baseUrl,
            webUrl: baseUrl,
          },
        },
      ],
    });

    console.log('[Kakao] Share success:', shareUrl);

    // 공유 이벤트 트래킹 (GA4)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: 'kakao',
        content_type: 'saju_result',
        content_id: readingId,
      });
    }
  } catch (error) {
    console.error('[Kakao] Share error:', error);
    alert('카카오톡 공유 중 오류가 발생했습니다.');
  }
}

/**
 * 궁합 결과 카카오톡 공유하기
 */
export function shareCompatibilityResult(params: {
  person1Name: string;
  person2Name: string;
  compatibilityScore: number;
}) {
  const { person1Name, person2Name, compatibilityScore } = params;

  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error('[Kakao] SDK not initialized');
    alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    return;
  }

  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/compatibility?utm_source=kakao&utm_medium=share&utm_campaign=compatibility`;

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${person1Name} ❤️ ${person2Name} 궁합 분석`,
        description: `궁합 점수: ${compatibilityScore}점\n\n우리의 궁합은 어떨까요?`,
        imageUrl: `${baseUrl}/og-image-compatibility.png`,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '궁합 분석하기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });

    console.log('[Kakao] Compatibility share success');

    // GA4 트래킹
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: 'kakao',
        content_type: 'compatibility',
      });
    }
  } catch (error) {
    console.error('[Kakao] Share error:', error);
    alert('카카오톡 공유 중 오류가 발생했습니다.');
  }
}

/**
 * 월별 운세 카카오톡 공유하기
 */
export function shareMonthlyFortune(params: {
  userName: string;
  currentMonth: number;
  monthScore: number;
}) {
  const { userName, currentMonth, monthScore } = params;

  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error('[Kakao] SDK not initialized');
    alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    return;
  }

  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/monthly-fortune?utm_source=kakao&utm_medium=share&utm_campaign=monthly_fortune`;

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${userName}님의 ${currentMonth}월 운세`,
        description: `이번 달 운세: ${monthScore}점\n\n12개월 운세를 확인해보세요!`,
        imageUrl: `${baseUrl}/og-image-monthly.png`,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '월별 운세 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });

    console.log('[Kakao] Monthly fortune share success');

    // GA4 트래킹
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: 'kakao',
        content_type: 'monthly_fortune',
      });
    }
  } catch (error) {
    console.error('[Kakao] Share error:', error);
    alert('카카오톡 공유 중 오류가 발생했습니다.');
  }
}

/**
 * 일반 페이지 카카오톡 공유하기
 */
export function shareGenericPage(params: {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
}) {
  const { title, description, imageUrl, url } = params;

  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error('[Kakao] SDK not initialized');
    alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    return;
  }

  const baseUrl = window.location.origin;
  const shareUrl = url || `${baseUrl}?utm_source=kakao&utm_medium=share`;
  const defaultImage = `${baseUrl}/og-image-default.png`;

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl: imageUrl || defaultImage,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '자세히 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });

    console.log('[Kakao] Generic page share success');

    // GA4 트래킹
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: 'kakao',
        content_type: 'generic',
      });
    }
  } catch (error) {
    console.error('[Kakao] Share error:', error);
    alert('카카오톡 공유 중 오류가 발생했습니다.');
  }
}
