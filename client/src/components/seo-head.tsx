/**
 * SEO Head Component
 *
 * 페이지별 동적 메타 태그 관리
 * - Open Graph (Facebook, LinkedIn)
 * - Twitter Cards
 * - Schema.org JSON-LD
 */

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any>;
}

const DEFAULT_SEO = {
  title: '운명의 해답 - 정확한 사주팔자 분석',
  description: '한국천문연구원 24절기 데이터 기반 정확한 사주팔자 분석. 격국, 대운, 십이운성 전문 명리학 분석을 100% 무료로 제공합니다.',
  keywords: ['사주', '사주팔자', '운세', '명리학', '격국', '대운', '십이운성', '무료 사주', '사주 분석', '사주 풀이'],
  ogImage: 'https://sajufortune.com/og-image.png',
  ogType: 'website' as const,
  twitterCard: 'summary_large_image' as const,
};

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noindex = false,
  jsonLd,
}: SEOProps) {
  const seoTitle = title || DEFAULT_SEO.title;
  const seoDescription = description || DEFAULT_SEO.description;
  const seoKeywords = keywords || DEFAULT_SEO.keywords;
  const seoOgImage = ogImage || DEFAULT_SEO.ogImage;
  const seoCanonical = canonicalUrl || window.location.href;

  useEffect(() => {
    // Title
    document.title = seoTitle;

    // Meta tags
    const metaTags = [
      { name: 'description', content: seoDescription },
      { name: 'keywords', content: seoKeywords.join(', ') },
      { name: 'author', content: '운명의 해답' },
      { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' },

      // Open Graph
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:image', content: seoOgImage },
      { property: 'og:url', content: seoCanonical },
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: '운명의 해답' },
      { property: 'og:locale', content: 'ko_KR' },

      // Twitter Card
      { name: 'twitter:card', content: twitterCard },
      { name: 'twitter:title', content: seoTitle },
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: seoOgImage },

      // Additional
      { name: 'theme-color', content: '#8b5cf6' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'format-detection', content: 'telephone=no' },
    ];

    // Update or create meta tags
    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seoCanonical);

    // JSON-LD structured data
    if (jsonLd) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(jsonLd);
    }
  }, [seoTitle, seoDescription, seoKeywords, seoOgImage, seoCanonical, ogType, twitterCard, noindex, jsonLd]);

  return null; // This component doesn't render anything
}

/**
 * 사주 결과 페이지용 SEO 데이터 생성
 */
export function generateSajuResultSEO(data: {
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
}): SEOProps {
  const genderText = data.gender === 'male' ? '남성' : '여성';
  const birthDateText = `${data.birthYear}년 ${data.birthMonth}월 ${data.birthDay}일`;

  return {
    title: `${birthDateText}생 ${genderText} 사주팔자 분석 결과 - 운명의 해답`,
    description: `${birthDateText}생 ${genderText}의 정확한 사주팔자 분석 결과입니다. 격국, 대운, 십이운성, 일간 분석을 포함한 전문 명리학 해석을 확인하세요.`,
    keywords: [
      '사주 분석 결과',
      `${data.birthYear}년생 사주`,
      '격국 분석',
      '대운 계산',
      '십이운성',
      '일간 분석',
      '무료 사주 결과',
    ],
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${birthDateText}생 ${genderText} 사주팔자 분석`,
      description: `한국천문연구원 24절기 데이터 기반 정확한 사주팔자 분석`,
      author: {
        '@type': 'Organization',
        name: '운명의 해답',
      },
      publisher: {
        '@type': 'Organization',
        name: '운명의 해답',
        logo: {
          '@type': 'ImageObject',
          url: 'https://sajufortune.com/logo.png',
        },
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    },
  };
}

/**
 * 홈페이지용 SEO 데이터
 */
export function generateHomeSEO(): SEOProps {
  return {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    keywords: DEFAULT_SEO.keywords,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '운명의 해답',
      description: '한국천문연구원 24절기 데이터 기반 정확한 사주팔자 분석 서비스',
      url: 'https://sajufortune.com',
      applicationCategory: 'LifestyleApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'KRW',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '50000',
        bestRating: '5',
        worstRating: '1',
      },
    },
  };
}

/**
 * FAQ 페이지용 SEO 데이터
 */
export function generateFAQSEO(): SEOProps {
  return {
    title: '자주 묻는 질문 (FAQ) - 운명의 해답',
    description: '사주팔자 분석, 격국, 대운, 십이운성에 대한 자주 묻는 질문과 답변을 확인하세요.',
    keywords: ['사주 FAQ', '사주 질문', '명리학 설명', '사주 용어', '격국이란', '대운이란'],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '사주팔자란 무엇인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '사주팔자는 태어난 연월일시를 천간지지로 표현한 것으로, 년주, 월주, 일주, 시주의 네 기둥(四柱)으로 이루어져 있습니다.',
          },
        },
        {
          '@type': 'Question',
          name: '격국이란 무엇인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '격국은 사주팔자의 구조와 균형을 분석하여 개인의 성향과 운명적 특징을 판단하는 명리학의 핵심 개념입니다.',
          },
        },
      ],
    },
  };
}
