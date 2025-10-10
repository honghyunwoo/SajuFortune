/**
 * PDF 디자인 템플릿 시스템
 * 3가지 템플릿: 클래식, 모던, 미니멀
 */

import type { FortuneReading } from '@shared/schema';

// RGB 색상 타입
export type RGBColor = [number, number, number];

// 템플릿 타입
export type TemplateType = 'classic' | 'modern' | 'minimal';

// 색상 테마 타입
export type ColorTheme = 'default' | 'blue' | 'purple' | 'green' | 'red' | 'gold';

// 템플릿 설정 인터페이스
export interface TemplateConfig {
  // 기본 설정
  name: string;
  description: string;

  // 색상
  primaryColor: RGBColor;
  secondaryColor: RGBColor;
  accentColor: RGBColor;
  backgroundColor: RGBColor;
  textColor: RGBColor;

  // 폰트 크기
  titleFontSize: number;
  headingFontSize: number;
  bodyFontSize: number;

  // 레이아웃
  margin: number;
  lineHeight: number;
  sectionSpacing: number;

  // 스타일
  borderWidth: number;
  borderRadius: number;
  useShadow: boolean;
  useGradient: boolean;
}

// 색상 테마 정의
export const COLOR_THEMES: Record<ColorTheme, {
  primary: RGBColor;
  secondary: RGBColor;
  accent: RGBColor;
}> = {
  default: {
    primary: [41, 128, 185],   // 파랑
    secondary: [52, 73, 94],    // 진한 회색
    accent: [231, 76, 60],      // 빨강
  },
  blue: {
    primary: [52, 152, 219],    // 밝은 파랑
    secondary: [41, 128, 185],  // 파랑
    accent: [46, 204, 113],     // 초록
  },
  purple: {
    primary: [155, 89, 182],    // 보라
    secondary: [142, 68, 173],  // 진한 보라
    accent: [241, 196, 15],     // 노랑
  },
  green: {
    primary: [39, 174, 96],     // 초록
    secondary: [22, 160, 133],  // 청록
    accent: [230, 126, 34],     // 주황
  },
  red: {
    primary: [192, 57, 43],     // 빨강
    secondary: [231, 76, 60],   // 밝은 빨강
    accent: [241, 196, 15],     // 노랑
  },
  gold: {
    primary: [212, 175, 55],    // 금색
    secondary: [183, 149, 11],  // 진한 금색
    accent: [211, 84, 0],       // 주황
  },
};

/**
 * 클래식 템플릿
 * 전통적이고 격식 있는 디자인
 */
export function getClassicTemplate(colorTheme: ColorTheme = 'default'): TemplateConfig {
  const colors = COLOR_THEMES[colorTheme];

  return {
    name: '클래식',
    description: '전통적이고 격식 있는 디자인',

    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    accentColor: colors.accent,
    backgroundColor: [255, 255, 255],
    textColor: [0, 0, 0],

    titleFontSize: 24,
    headingFontSize: 16,
    bodyFontSize: 11,

    margin: 20,
    lineHeight: 1.6,
    sectionSpacing: 15,

    borderWidth: 2,
    borderRadius: 0,
    useShadow: false,
    useGradient: false,
  };
}

/**
 * 모던 템플릿
 * 세련되고 현대적인 디자인
 */
export function getModernTemplate(colorTheme: ColorTheme = 'blue'): TemplateConfig {
  const colors = COLOR_THEMES[colorTheme];

  return {
    name: '모던',
    description: '세련되고 현대적인 디자인',

    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    accentColor: colors.accent,
    backgroundColor: [250, 250, 250],
    textColor: [33, 33, 33],

    titleFontSize: 26,
    headingFontSize: 18,
    bodyFontSize: 12,

    margin: 25,
    lineHeight: 1.8,
    sectionSpacing: 20,

    borderWidth: 1,
    borderRadius: 8,
    useShadow: true,
    useGradient: true,
  };
}

/**
 * 미니멀 템플릿
 * 깔끔하고 단순한 디자인
 */
export function getMinimalTemplate(colorTheme: ColorTheme = 'default'): TemplateConfig {
  const colors = COLOR_THEMES[colorTheme];

  return {
    name: '미니멀',
    description: '깔끔하고 단순한 디자인',

    primaryColor: colors.primary,
    secondaryColor: [100, 100, 100],
    accentColor: colors.accent,
    backgroundColor: [255, 255, 255],
    textColor: [50, 50, 50],

    titleFontSize: 22,
    headingFontSize: 14,
    bodyFontSize: 10,

    margin: 15,
    lineHeight: 1.5,
    sectionSpacing: 12,

    borderWidth: 0,
    borderRadius: 0,
    useShadow: false,
    useGradient: false,
  };
}

/**
 * 템플릿 가져오기
 */
export function getTemplate(type: TemplateType, colorTheme: ColorTheme = 'default'): TemplateConfig {
  switch (type) {
    case 'classic':
      return getClassicTemplate(colorTheme);
    case 'modern':
      return getModernTemplate(colorTheme);
    case 'minimal':
      return getMinimalTemplate(colorTheme);
    default:
      return getClassicTemplate(colorTheme);
  }
}

/**
 * PDF 커버 페이지 생성
 */
export function generateCoverPage(
  doc: any,
  template: TemplateConfig,
  data: {
    title: string;
    subtitle?: string;
    userName: string;
    birthDate: string;
    generatedDate: string;
  }
) {
  const { title, subtitle, userName, birthDate, generatedDate } = data;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 배경색
  doc.setFillColor(...template.backgroundColor);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 그라디언트 효과 (모던 템플릿)
  if (template.useGradient) {
    doc.setFillColor(...template.primaryColor);
    doc.setGlobalAlpha(0.1);
    doc.rect(0, 0, pageWidth, pageHeight / 2, 'F');
    doc.setGlobalAlpha(1.0);
  }

  // 메인 타이틀
  doc.setFontSize(template.titleFontSize + 8);
  doc.setTextColor(...template.primaryColor);
  doc.text(title, pageWidth / 2, pageHeight / 3, { align: 'center' });

  // 서브타이틀
  if (subtitle) {
    doc.setFontSize(template.headingFontSize);
    doc.setTextColor(...template.secondaryColor);
    doc.text(subtitle, pageWidth / 2, pageHeight / 3 + 15, { align: 'center' });
  }

  // 구분선
  if (template.borderWidth > 0) {
    doc.setDrawColor(...template.accentColor);
    doc.setLineWidth(template.borderWidth);
    doc.line(
      pageWidth / 4,
      pageHeight / 2 - 10,
      (pageWidth * 3) / 4,
      pageHeight / 2 - 10
    );
  }

  // 사용자 정보
  doc.setFontSize(template.bodyFontSize + 2);
  doc.setTextColor(...template.textColor);
  doc.text(`${userName}`, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
  doc.text(`Birth: ${birthDate}`, pageWidth / 2, pageHeight / 2 + 25, { align: 'center' });

  // 생성 날짜 (하단)
  doc.setFontSize(template.bodyFontSize);
  doc.setTextColor(...template.secondaryColor);
  doc.text(
    `Generated on ${generatedDate}`,
    pageWidth / 2,
    pageHeight - template.margin,
    { align: 'center' }
  );

  // 테두리 (클래식 템플릿)
  if (template.name === '클래식' && template.borderWidth > 0) {
    doc.setDrawColor(...template.primaryColor);
    doc.setLineWidth(template.borderWidth);
    doc.rect(
      template.margin,
      template.margin,
      pageWidth - template.margin * 2,
      pageHeight - template.margin * 2
    );
  }
}

/**
 * PDF 섹션 헤더 생성
 */
export function generateSectionHeader(
  doc: any,
  template: TemplateConfig,
  title: string,
  y: number
): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  // 배경 박스 (모던 템플릿)
  if (template.useShadow) {
    doc.setFillColor(...template.primaryColor);
    doc.setGlobalAlpha(0.1);
    doc.roundedRect(
      template.margin,
      y - 5,
      pageWidth - template.margin * 2,
      template.headingFontSize + 10,
      template.borderRadius,
      template.borderRadius,
      'F'
    );
    doc.setGlobalAlpha(1.0);
  }

  // 헤더 텍스트
  doc.setFontSize(template.headingFontSize);
  doc.setTextColor(...template.primaryColor);
  doc.text(title, template.margin + 5, y + template.headingFontSize / 2);

  // 언더라인 (미니멀 제외)
  if (template.borderWidth > 0) {
    doc.setDrawColor(...template.accentColor);
    doc.setLineWidth(1);
    doc.line(
      template.margin,
      y + template.headingFontSize,
      pageWidth - template.margin,
      y + template.headingFontSize
    );
  }

  return y + template.headingFontSize + template.sectionSpacing;
}

/**
 * PDF 본문 텍스트 생성
 */
export function generateBodyText(
  doc: any,
  template: TemplateConfig,
  text: string,
  y: number,
  options?: { bold?: boolean; color?: RGBColor }
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - template.margin * 2 - 10;

  doc.setFontSize(template.bodyFontSize);

  if (options?.bold) {
    doc.setFont('courier', 'bold');
  } else {
    doc.setFont('courier', 'normal');
  }

  if (options?.color) {
    doc.setTextColor(...options.color);
  } else {
    doc.setTextColor(...template.textColor);
  }

  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, template.margin + 5, y);

  const lineHeight = template.bodyFontSize * template.lineHeight;
  return y + lines.length * lineHeight + 5;
}

/**
 * PDF 표 생성 (사주팔자)
 */
export function generatePillarTable(
  doc: any,
  template: TemplateConfig,
  pillars: { year: any; month: any; day: any; hour: any },
  y: number
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const tableWidth = pageWidth - template.margin * 2;
  const cellWidth = tableWidth / 4;
  const cellHeight = 20;

  // 헤더
  const headers = ['Year', 'Month', 'Day', 'Hour'];
  doc.setFillColor(...template.primaryColor);
  doc.rect(template.margin, y, tableWidth, cellHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(template.bodyFontSize + 1);
  headers.forEach((header, i) => {
    doc.text(
      header,
      template.margin + cellWidth * i + cellWidth / 2,
      y + cellHeight / 2 + 2,
      { align: 'center' }
    );
  });

  // 천간
  y += cellHeight;
  doc.setFillColor(...template.backgroundColor);
  doc.rect(template.margin, y, tableWidth, cellHeight);

  doc.setTextColor(...template.textColor);
  const stems = [
    pillars.year.heavenlyStem,
    pillars.month.heavenlyStem,
    pillars.day.heavenlyStem,
    pillars.hour.heavenlyStem,
  ];

  stems.forEach((stem, i) => {
    doc.text(
      stem,
      template.margin + cellWidth * i + cellWidth / 2,
      y + cellHeight / 2 + 2,
      { align: 'center' }
    );
  });

  // 지지
  y += cellHeight;
  doc.setFillColor(245, 245, 245);
  doc.rect(template.margin, y, tableWidth, cellHeight, 'F');

  const branches = [
    pillars.year.earthlyBranch,
    pillars.month.earthlyBranch,
    pillars.day.earthlyBranch,
    pillars.hour.earthlyBranch,
  ];

  branches.forEach((branch, i) => {
    doc.text(
      branch,
      template.margin + cellWidth * i + cellWidth / 2,
      y + cellHeight / 2 + 2,
      { align: 'center' }
    );
  });

  // 테두리
  if (template.borderWidth > 0) {
    doc.setDrawColor(...template.secondaryColor);
    doc.setLineWidth(0.5);

    // 세로선
    for (let i = 0; i <= 4; i++) {
      doc.line(
        template.margin + cellWidth * i,
        y - cellHeight * 2,
        template.margin + cellWidth * i,
        y + cellHeight
      );
    }

    // 가로선
    for (let i = 0; i <= 3; i++) {
      doc.line(
        template.margin,
        y - cellHeight * 2 + cellHeight * i,
        template.margin + tableWidth,
        y - cellHeight * 2 + cellHeight * i
      );
    }
  }

  return y + cellHeight + template.sectionSpacing;
}

/**
 * 페이지 번호 추가
 */
export function addPageNumber(
  doc: any,
  template: TemplateConfig,
  pageNum: number,
  totalPages: number
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(template.bodyFontSize - 1);
  doc.setTextColor(...template.secondaryColor);
  doc.text(
    `${pageNum} / ${totalPages}`,
    pageWidth / 2,
    pageHeight - template.margin / 2,
    { align: 'center' }
  );
}

/**
 * 워터마크 추가 (미니멀 템플릿 제외)
 */
export function addWatermark(doc: any, template: TemplateConfig, text: string = 'SajuFortune') {
  if (template.name === '미니멀') return;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setGlobalAlpha(0.05);
  doc.setFontSize(80);
  doc.setTextColor(...template.secondaryColor);
  doc.text(text, pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 45,
  });
  doc.setGlobalAlpha(1.0);
}
