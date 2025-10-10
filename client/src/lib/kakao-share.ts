/**
 * 카카오톡 공유하기 SDK
 * 
 * 사주 결과를 카카오톡으로 공유하는 기능
 * - 커스텀 메시지 템플릿
 * - 이미지 프리뷰
 * - UTM 트래킹
 */

declare global {
  interface Window {
    Kakao: any;
  }
}

export interface ShareData {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  buttonText?: string;
}

/**
 * Kakao SDK 초기화
 */
export function initializeKakao(apiKey: string) {
  if (typeof window === 'undefined') return;

  // 이미 초기화되었으면 스킵
  if (window.Kakao && window.Kakao.isInitialized()) {
    return;
  }

  // SDK 로드 확인
  if (!window.Kakao) {
    console.error('[Kakao] SDK not loaded. Add script to index.html');
    return;
  }

  try {
    window.Kakao.init(apiKey);
    console.log('[Kakao] SDK initialized');
  } catch (error) {
    console.error('[Kakao] Initialization failed:', error);
  }
}

/**
 * 카카오톡 공유하기
 */
export function shareToKakao(data: ShareData) {
  if (typeof window === 'undefined') return;

  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error('[Kakao] SDK not initialized');
    return;
  }

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || 'https://sajufortune.com/og-image.png',
        link: {
          mobileWebUrl: data.link,
          webUrl: data.link,
        },
      },
      buttons: [
        {
          title: data.buttonText || '결과 보기',
          link: {
            mobileWebUrl: data.link,
            webUrl: data.link,
          },
        },
      ],
    });

    console.log('[Kakao] Share succeeded');
  } catch (error) {
    console.error('[Kakao] Share failed:', error);
  }
}

/**
 * 사주 결과 카카오톡 공유
 */
export function shareSajuResult(data: {
  readingId: string;
  userName: string;
  birthDate: string;
  overallScore: number;
}) {
  shareToKakao({
    title: `${data.userName}님의 사주팔자 분석 결과`,
    description: `${data.birthDate} | 종합 점수: ${data.overallScore}점\n한국천문연구원 24절기 데이터 기반 정확한 사주 분석 결과입니다.`,
    link: `https://sajufortune.com/results/${data.readingId}?utm_source=kakao&utm_medium=share&utm_campaign=saju_result`,
    buttonText: '내 사주 보기',
  });
}

/**
 * 궁합 결과 카카오톡 공유
 */
export function shareCompatibilityResult(data: {
  person1Name: string;
  person2Name: string;
  compatibilityScore: number;
}) {
  shareToKakao({
    title: `${data.person1Name} ❤️ ${data.person2Name} 궁합 분석`,
    description: `궁합 점수: ${data.compatibilityScore}점! 두 사람의 사주 궁합을 자세히 확인해보세요.`,
    link: `https://sajufortune.com/compatibility?utm_source=kakao&utm_medium=share&utm_campaign=compatibility`,
    buttonText: '궁합 분석 보기',
  });
}

/**
 * 월별 운세 카카오톡 공유
 */
export function shareMonthlyFortune(data: {
  userName: string;
  currentMonth: number;
  monthScore: number;
}) {
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  const monthText = monthNames[data.currentMonth - 1] || `${data.currentMonth}월`;

  shareToKakao({
    title: `${data.userName}님의 ${monthText} 운세`,
    description: `이번 달 운세 점수: ${data.monthScore}점! 자세한 월별 운세를 확인해보세요.`,
    link: `https://sajufortune.com/monthly-fortune?utm_source=kakao&utm_medium=share&utm_campaign=monthly_fortune`,
    buttonText: '월별 운세 보기',
  });
}

/**
 * 일반 페이지 카카오톡 공유
 */
export function shareGenericPage(data: {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
}) {
  shareToKakao({
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    link: data.url || 'https://sajufortune.com?utm_source=kakao&utm_medium=share&utm_campaign=generic',
    buttonText: '자세히 보기',
  });
}
