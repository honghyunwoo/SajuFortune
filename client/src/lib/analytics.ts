/**
 * Google Analytics 4 통합
 *
 * 주요 이벤트:
 * - saju_calculation: 사주 분석 완료
 * - pdf_download: PDF 다운로드
 * - donation_click: 후원 버튼 클릭
 * - donation_complete: 후원 완료
 * - page_view: 페이지 조회
 */

// Google Analytics 측정 ID (환경변수에서 로드)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Google Analytics 스크립트 로드 여부
let isGALoaded = false;

/**
 * Google Analytics 초기화
 * 앱 시작 시 한 번만 호출
 */
export function initializeAnalytics(): void {
  // GA ID가 없으면 초기화하지 않음 (로컬 개발 환경)
  if (!GA_MEASUREMENT_ID) {
    console.warn('[Analytics] GA_MEASUREMENT_ID가 설정되지 않았습니다.');
    return;
  }

  // 이미 로드되었으면 중복 초기화 방지
  if (isGALoaded) {
    return;
  }

  // gtag.js 스크립트 동적 삽입
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // gtag 함수 초기화
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // React Router에서 수동으로 페이지뷰 전송
  });

  isGALoaded = true;
  
  if (import.meta.env.DEV) {
    console.log('[Analytics] Google Analytics 초기화 완료');
  }
}

/**
 * 페이지뷰 이벤트 전송
 * React Router 라우트 변경 시 호출
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!isGALoaded || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });

  if (import.meta.env.DEV) {
    console.log('[Analytics] 페이지뷰:', pagePath);
  }
}

/**
 * 사주 분석 완료 이벤트
 */
export function trackSajuCalculation(data: {
  gender: 'male' | 'female';
  birthYear: number;
  calculationTime: number; // 밀리초
}): void {
  if (!isGALoaded || !window.gtag) return;

  window.gtag('event', 'saju_calculation', {
    event_category: 'engagement',
    event_label: '사주 분석 완료',
    gender: data.gender,
    birth_year: data.birthYear,
    calculation_time_ms: data.calculationTime,
  });

  if (import.meta.env.DEV) {
    console.log('[Analytics] 사주 분석 완료:', data);
  }
}

/**
 * PDF 다운로드 이벤트
 */
export function trackPdfDownload(data: {
  gender: 'male' | 'female';
  birthYear: number;
}): void {
  if (!isGALoaded || !window.gtag) return;

  window.gtag('event', 'pdf_download', {
    event_category: 'engagement',
    event_label: 'PDF 다운로드',
    gender: data.gender,
    birth_year: data.birthYear,
  });

  if (import.meta.env.DEV) {
    console.log('[Analytics] PDF 다운로드:', data);
  }
}

/**
 * 후원 버튼 클릭 이벤트
 */
export function trackDonationClick(amount: number): void {
  if (!isGALoaded || !window.gtag) return;

  window.gtag('event', 'donation_click', {
    event_category: 'conversion',
    event_label: '후원 버튼 클릭',
    value: amount,
    currency: 'KRW',
  });

  if (import.meta.env.DEV) {
    console.log('[Analytics] 후원 버튼 클릭:', amount);
  }
}

/**
 * 후원 완료 이벤트 (전환)
 */
export function trackDonationComplete(data: {
  amount: number;
  method: string; // 'card', 'kakao', etc.
  transactionId: string;
}): void {
  if (!isGALoaded || !window.gtag) return;

  // GA4 구매 이벤트
  window.gtag('event', 'purchase', {
    transaction_id: data.transactionId,
    value: data.amount,
    currency: 'KRW',
    items: [
      {
        item_id: 'donation',
        item_name: '감사 후원',
        price: data.amount,
        quantity: 1,
      },
    ],
  });

  // 커스텀 이벤트
  window.gtag('event', 'donation_complete', {
    event_category: 'conversion',
    event_label: '후원 완료',
    value: data.amount,
    currency: 'KRW',
    payment_method: data.method,
  });

  if (import.meta.env.DEV) {
    console.log('[Analytics] 후원 완료:', data);
  }
}

/**
 * 에러 발생 이벤트
 */
export function trackError(error: {
  message: string;
  stack?: string;
  fatal?: boolean;
}): void {
  if (!isGALoaded || !window.gtag) return;

  window.gtag('event', 'exception', {
    description: error.message,
    fatal: error.fatal || false,
  });

  console.error('[Analytics] 에러 추적:', error);
}

/**
 * 커스텀 이벤트 전송
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  if (!isGALoaded || !window.gtag) return;

  window.gtag('event', eventName, params);

  if (import.meta.env.DEV) {
    console.log('[Analytics] 커스텀 이벤트:', eventName, params);
  }
}

// TypeScript 타입 선언
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
