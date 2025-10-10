/**
 * SEO 메타 태그 동적 생성 유틸리티
 *
 * react-helmet-async 기반으로 페이지별 SEO 메타 태그를 동적으로 생성합니다.
 * Open Graph, Twitter Card, JSON-LD 구조화 데이터를 포함합니다.
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * 기본 SEO 설정
 */
const DEFAULT_SEO: SEOConfig = {
  title: '운명의 해답 - 무료 사주팔자 분석 | 격국, 대운, 십이운성',
  description:
    '한국천문연구원 정밀 24절기 데이터 기반 100% 무료 사주팔자 분석 서비스. 격국, 대운, 십이운성 등 전문적인 명리학 분석을 3분 내 확인하세요. 회원가입 없이 즉시 이용 가능!',
  keywords: '사주, 사주팔자, 운세, 명리학, 격국, 대운, 십이운성, 무료 사주, 사주 분석, 한국천문연구원, 24절기',
  image: 'https://sajufortune.com/og-image.png',
  url: 'https://sajufortune.com/',
  type: 'website',
};

/**
 * 페이지별 SEO 설정 생성
 */
export function generateSEO(config: Partial<SEOConfig>): SEOConfig {
  return {
    ...DEFAULT_SEO,
    ...config,
    title: config.title ? `${config.title} | 운명의 해답` : DEFAULT_SEO.title,
  };
}

/**
 * 사주 결과 페이지 SEO 생성
 */
export function generateSajuResultSEO(data: {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: 'male' | 'female';
  readingId: string;
}): SEOConfig {
  const genderText = data.gender === 'male' ? '남자' : '여자';
  const birthDate = `${data.birthYear}년 ${data.birthMonth}월 ${data.birthDay}일`;

  return generateSEO({
    title: `${birthDate}생 ${genderText} 사주팔자 분석 결과`,
    description: `${birthDate}에 태어난 ${genderText}의 사주팔자 분석 결과입니다. 격국, 대운, 십이운성을 포함한 전문 명리학 분석을 확인하세요.`,
    keywords: `${data.birthYear}년생 사주, ${genderText} 사주, 사주팔자, 격국, 대운, 십이운성`,
    url: `https://sajufortune.com/results/${data.readingId}`,
    type: 'article',
  });
}

/**
 * 궁합 페이지 SEO 생성
 */
export function generateCompatibilitySEO(): SEOConfig {
  return generateSEO({
    title: '사주 궁합 분석',
    description:
      '두 사람의 사주팔자를 비교하여 궁합을 분석합니다. 오행 상생상극, 육친 관계 등 전문적인 명리학 기반 궁합 분석을 제공합니다.',
    keywords: '사주 궁합, 궁합 분석, 연애 궁합, 결혼 궁합, 띠 궁합',
    url: 'https://sajufortune.com/compatibility',
  });
}

/**
 * 월별 운세 페이지 SEO 생성
 */
export function generateMonthlyFortuneSEO(year?: number): SEOConfig {
  const currentYear = year || new Date().getFullYear();

  return generateSEO({
    title: `${currentYear}년 월별 운세`,
    description: `${currentYear}년 12개월 월별 운세를 확인하세요. 사주팔자 기반으로 매월 운세 흐름과 주의사항을 분석합니다.`,
    keywords: `${currentYear}년 운세, 월별 운세, 사주 운세, 월운`,
    url: 'https://sajufortune.com/monthly-fortune',
  });
}

/**
 * 프리미엄 분석 페이지 SEO 생성
 */
export function generatePremiumSEO(): SEOConfig {
  return generateSEO({
    title: '프리미엄 사주 분석',
    description:
      '격국, 대운, 십이운성을 포함한 전문가 수준의 프리미엄 사주팔자 분석 서비스. 80년 생애 운세 흐름과 상세한 명리학 해석을 제공합니다.',
    keywords: '프리미엄 사주, 전문 사주 분석, 격국, 대운, 십이운성, 상세 운세',
    url: 'https://sajufortune.com/premium',
  });
}

/**
 * 블로그 포스트 SEO 생성
 */
export function generateBlogPostSEO(data: {
  title: string;
  description: string;
  slug: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}): SEOConfig {
  return generateSEO({
    title: data.title,
    description: data.description,
    url: `https://sajufortune.com/blog/${data.slug}`,
    type: 'article',
    author: data.author || '운명의 해답',
    publishedTime: data.publishedTime,
    modifiedTime: data.modifiedTime,
  });
}

/**
 * JSON-LD 구조화 데이터 생성 (사주 결과)
 */
export function generateSajuResultJSONLD(data: {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: 'male' | 'female';
  readingId: string;
}) {
  const genderText = data.gender === 'male' ? '남자' : '여자';
  const birthDate = `${data.birthYear}년 ${data.birthMonth}월 ${data.birthDay}일`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${birthDate}생 ${genderText} 사주팔자 분석`,
    description: `${birthDate}에 태어난 ${genderText}의 사주팔자 분석 결과`,
    url: `https://sajufortune.com/results/${data.readingId}`,
    datePublished: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: '운명의 해답',
      url: 'https://sajufortune.com',
    },
    publisher: {
      '@type': 'Organization',
      name: '운명의 해답',
      url: 'https://sajufortune.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sajufortune.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sajufortune.com/results/${data.readingId}`,
    },
  };
}

/**
 * JSON-LD 구조화 데이터 생성 (블로그 포스트)
 */
export function generateBlogPostJSONLD(data: {
  title: string;
  description: string;
  slug: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    url: `https://sajufortune.com/blog/${data.slug}`,
    datePublished: data.publishedTime || new Date().toISOString(),
    dateModified: data.modifiedTime || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: data.author || '운명의 해답',
    },
    publisher: {
      '@type': 'Organization',
      name: '운명의 해답',
      url: 'https://sajufortune.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sajufortune.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sajufortune.com/blog/${data.slug}`,
    },
  };
}

/**
 * FAQ 구조화 데이터 생성
 */
export function generateFAQJSONLD(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
