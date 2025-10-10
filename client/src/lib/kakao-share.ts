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
export function shareSajuResult(readingId: string, userData: {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: 'male' | 'female';
}) {
  const genderText = userData.gender === 'male' ? '남성' : '여성';
  const birthDate = `${userData.birthYear}년 ${userData.birthMonth}월 ${userData.birthDay}일`;

  shareToKakao({
    title: `${birthDate}생 ${genderText} 사주팔자 분석`,
    description: '한국천문연구원 24절기 데이터 기반 정확한 사주 분석 결과입니다. 격국, 대운, 십이운성을 포함한 전문 명리학 분석을 확인하세요.',
    link: `https://sajufortune.com/results/${readingId}?utm_source=kakao&utm_medium=share&utm_campaign=saju_result`,
    buttonText: '내 사주 보기',
  });
}

/**
 * 궁합 결과 카카오톡 공유
 */
export function shareCompatibilityResult(person1Name: string, person2Name: string, score: number) {
  shareToKakao({
    title: `${person1Name} ❤️ ${person2Name} 궁합 분석`,
    description: `궁합 점수: ${score}점! 두 사람의 사주 궁합을 자세히 확인해보세요.`,
    link: `https://sajufortune.com/compatibility?utm_source=kakao&utm_medium=share&utm_campaign=compatibility`,
    buttonText: '궁합 분석 보기',
  });
}
