/**
 * i18n (국제화) 설정
 * react-i18next 기반 다국어 지원
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 한국어 번역
import ko from './locales/ko.json';
// 영어 번역
import en from './locales/en.json';

// 지원 언어 목록
export const SUPPORTED_LANGUAGES = {
  ko: { name: '한국어', nativeName: '한국어' },
  en: { name: 'English', nativeName: 'English' },
  // 추후 추가
  // zh: { name: 'Chinese', nativeName: '中文' },
  // ja: { name: 'Japanese', nativeName: '日本語' },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// i18n 초기화
i18n
  // 브라우저 언어 자동 감지
  .use(LanguageDetector)
  // React와 통합
  .use(initReactI18next)
  // 초기 설정
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },

    // 기본 언어
    fallbackLng: 'ko',

    // 지원 언어
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),

    // 디버그 모드 (개발 환경)
    debug: import.meta.env.DEV,

    // 언어 감지 옵션
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // 보간 옵션
    interpolation: {
      escapeValue: false, // React는 XSS를 자동으로 방지
    },

    // 키가 없을 때 키 이름 표시
    returnNull: false,
  });

export default i18n;
