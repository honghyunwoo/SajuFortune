/**
 * i18n 다국어 설정
 * 한국어, 영어 지원
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 한국어 번역
import koTranslation from './locales/ko.json';
// 영어 번역
import enTranslation from './locales/en.json';

i18n
  // 브라우저 언어 자동 감지
  .use(LanguageDetector)
  // React와 통합
  .use(initReactI18next)
  // 초기화
  .init({
    resources: {
      ko: {
        translation: koTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    // 기본 언어
    fallbackLng: 'ko',
    // 지원 언어
    supportedLngs: ['ko', 'en'],
    // 개발 모드에서 디버그 정보 표시
    debug: process.env.NODE_ENV === 'development',
    // 언어 감지 순서
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    // 보간 설정
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
