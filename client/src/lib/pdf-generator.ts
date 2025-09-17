import jsPDF from 'jspdf';
import type { FortuneReading, SajuPillar } from '@shared/schema';

// Configure jsPDF for Korean text support
const configureKoreanFont = (doc: jsPDF) => {
  try {
    // Try times font which has better Unicode support
    doc.setFont('times');
    doc.setFontSize(12);
  } catch (error) {
    try {
      // Fallback to courier 
      doc.setFont('courier');
      doc.setFontSize(12);
    } catch (error2) {
      // Final fallback to helvetica
      console.warn('Advanced fonts not available, using helvetica');
      doc.setFont('helvetica');
      doc.setFontSize(12);
    }
  }
};

const addKoreanText = (doc: jsPDF, text: string, x: number, y: number, options: any = {}) => {
  const { fontSize = 12, maxWidth = 180, lineHeight = 7 } = options;
  
  doc.setFontSize(fontSize);
  
  if (maxWidth) {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      doc.text(line, x, y + (index * lineHeight));
    });
    return y + (lines.length * lineHeight);
  } else {
    doc.text(text, x, y);
    return y + lineHeight;
  }
};

const addHeader = (doc: jsPDF) => {
  // Add traditional pattern background
  doc.setFillColor(253, 243, 232); // Light cream background
  doc.rect(0, 0, 210, 30, 'F');
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(139, 35, 50); // Primary color
  doc.text('운명의 해답', 105, 20, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(14);
  doc.setTextColor(102, 102, 102);
  doc.text('전통 사주풀이 분석 결과', 105, 28, { align: 'center' });
  
  // Add decorative line
  doc.setLineWidth(0.5);
  doc.setDrawColor(218, 165, 32); // Secondary color
  doc.line(20, 35, 190, 35);
  
  return 45; // Return next Y position
};

const addPersonalInfo = (doc: jsPDF, reading: FortuneReading, startY: number) => {
  let currentY = startY;
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  currentY = addKoreanText(doc, '🧑 개인 정보', 20, currentY, { fontSize: 16 });
  currentY += 5;
  
  // Birth info
  const birthInfo = `생년월일: ${reading.birthYear}년 ${reading.birthMonth}월 ${reading.birthDay}일 ${reading.birthHour}시 ${reading.birthMinute}분`;
  const genderInfo = `성별: ${reading.gender === 'male' ? '남성' : '여성'}`;
  const calendarInfo = `달력: ${reading.calendarType === 'solar' ? '양력' : '음력'}`;
  
  doc.setFontSize(12);
  currentY = addKoreanText(doc, birthInfo, 25, currentY);
  currentY = addKoreanText(doc, genderInfo, 25, currentY);
  currentY = addKoreanText(doc, calendarInfo, 25, currentY);
  
  return currentY + 10;
};

const addSajuPillars = (doc: jsPDF, reading: FortuneReading, startY: number) => {
  let currentY = startY;
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  currentY = addKoreanText(doc, '📊 사주팔자 (四柱八字)', 20, currentY, { fontSize: 16 });
  currentY += 5;
  
  const pillars = reading.sajuData.pillars;
  const pillarNames = ['년주', '월주', '일주', '시주'];
  
  // Create table header
  doc.setFontSize(12);
  doc.setFillColor(249, 249, 249);
  doc.rect(25, currentY, 160, 8, 'F');
  
  pillarNames.forEach((name, index) => {
    doc.text(name, 30 + (index * 40), currentY + 6);
  });
  currentY += 8;
  
  // Add pillar data
  doc.setFillColor(255, 255, 255);
  doc.rect(25, currentY, 160, 12, 'F');
  doc.rect(25, currentY, 160, 12, 'S');
  
  pillars.forEach((pillar: SajuPillar, index: number) => {
    const pillarText = `${pillar.heavenly}${pillar.earthly}`;
    doc.text(pillarText, 30 + (index * 40), currentY + 6);
    doc.setFontSize(10);
    doc.text(`(${pillar.element})`, 30 + (index * 40), currentY + 10);
    doc.setFontSize(12);
  });
  
  return currentY + 20;
};

const addElementsAnalysis = (doc: jsPDF, reading: FortuneReading, startY: number) => {
  let currentY = startY;
  
  doc.setFontSize(16);
  currentY = addKoreanText(doc, '🌟 오행 균형 분석', 20, currentY, { fontSize: 16 });
  currentY += 5;
  
  const elements = reading.sajuData.elements;
  const elementNames: { [key: string]: string } = {
    wood: '목(木)',
    fire: '화(火)', 
    earth: '토(土)',
    metal: '금(金)',
    water: '수(水)'
  };
  
  doc.setFontSize(12);
  Object.entries(elements).forEach(([element, count]) => {
    const elementText = `${elementNames[element]}: ${count}개`;
    currentY = addKoreanText(doc, elementText, 25, currentY);
  });
  
  // Add day master and strength analysis
  currentY += 5;
  doc.setFontSize(14);
  currentY = addKoreanText(doc, '🎯 일간 분석', 20, currentY, { fontSize: 14 });
  doc.setFontSize(12);
  currentY = addKoreanText(doc, `일간(日干): ${reading.sajuData.dayMaster} - 태어난 날의 천간으로 당신의 본성을 나타냅니다`, 25, currentY, { maxWidth: 160, lineHeight: 6 });
  
  const strengthText = reading.sajuData.strength === 'strong' ? '강' : 
                      reading.sajuData.strength === 'medium' ? '중' : '약';
  const strengthDesc = reading.sajuData.strength === 'strong' ? '오행 균형이 강하여 추진력이 있습니다' :
                       reading.sajuData.strength === 'medium' ? '오행 균형이 적절하여 안정적입니다' :
                       '오행 균형이 약하여 섬세하고 신중합니다';
  currentY = addKoreanText(doc, `일간 강약: ${strengthText} - ${strengthDesc}`, 25, currentY, { maxWidth: 160, lineHeight: 6 });
  
  return currentY + 10;
};

const addPersonalityAnalysis = (doc: jsPDF, reading: FortuneReading, startY: number) => {
  let currentY = startY;
  
  doc.setFontSize(16);
  currentY = addKoreanText(doc, '🎭 성격 분석', 20, currentY, { fontSize: 16 });
  currentY += 5;
  
  doc.setFontSize(12);
  currentY = addKoreanText(doc, reading.analysisResult.personality, 25, currentY, { maxWidth: 160, lineHeight: 6 });
  
  return currentY + 10;
};

const addTodayFortune = (doc: jsPDF, reading: FortuneReading, startY: number) => {
  let currentY = startY;
  
  doc.setFontSize(16);
  currentY = addKoreanText(doc, '⭐ 오늘의 운세', 20, currentY, { fontSize: 16 });
  currentY += 5;
  
  const todayFortune = reading.analysisResult.todayFortune;
  
  doc.setFontSize(12);
  currentY = addKoreanText(doc, `종합운: ${todayFortune.overall} (${todayFortune.rating}/5)`, 25, currentY);
  currentY = addKoreanText(doc, `연애운: ${todayFortune.love}`, 25, currentY);
  currentY = addKoreanText(doc, `직업운: ${todayFortune.career}`, 25, currentY);
  currentY = addKoreanText(doc, `재물운: ${todayFortune.money}`, 25, currentY);
  currentY += 5;
  currentY = addKoreanText(doc, todayFortune.description, 25, currentY, { maxWidth: 160, lineHeight: 6 });
  
  return currentY + 10;
};

const addPremiumAnalysis = (doc: jsPDF, reading: FortuneReading, startY: number) => {
  let currentY = startY;
  
  if (!reading.analysisResult.detailedAnalysis) return currentY;
  
  // Detailed Analysis
  doc.setFontSize(16);
  currentY = addKoreanText(doc, '💎 상세 운세 분석 (프리미엄)', 20, currentY, { fontSize: 16 });
  currentY += 5;
  
  const detailed = reading.analysisResult.detailedAnalysis;
  const categories = [
    { key: 'love', name: '연애운', icon: '💕' },
    { key: 'career', name: '직업운', icon: '💼' },
    { key: 'health', name: '건강운', icon: '🏥' },
    { key: 'money', name: '재물운', icon: '💰' }
  ];
  
  doc.setFontSize(12);
  categories.forEach(category => {
    const data = detailed[category.key as keyof typeof detailed];
    if (data) {
      currentY = addKoreanText(doc, `${category.icon} ${category.name}: ${data.score}점 (${data.level})`, 25, currentY);
      currentY = addKoreanText(doc, data.description, 30, currentY, { maxWidth: 155, lineHeight: 6 });
      currentY += 5;
    }
  });
  
  // Check if we need a new page
  if (currentY > 250) {
    doc.addPage();
    currentY = addHeader(doc);
  }
  
  // Compatibility Analysis
  if (reading.analysisResult.compatibility) {
    doc.setFontSize(16);
    currentY = addKoreanText(doc, '💝 궁합 분석', 20, currentY, { fontSize: 16 });
    currentY += 5;
    
    doc.setFontSize(12);
    const compatibility = reading.analysisResult.compatibility;
    
    Object.entries(compatibility).forEach(([type, data]: [string, any]) => {
      const typeName = type === 'zodiac' ? '띠 궁합' : type === 'saju' ? '사주 궁합' : '오행 궁합';
      currentY = addKoreanText(doc, `${typeName}: ${data.compatibility}`, 25, currentY);
      currentY = addKoreanText(doc, data.description, 30, currentY, { maxWidth: 155, lineHeight: 6 });
      currentY += 5;
    });
  }
  
  // Check if we need a new page
  if (currentY > 240) {
    doc.addPage();
    currentY = addHeader(doc);
  }
  
  // Monthly Fortune
  if (reading.analysisResult.monthlyFortune) {
    doc.setFontSize(16);
    currentY = addKoreanText(doc, `📅 ${new Date().getFullYear()}년 월별 운세`, 20, currentY, { fontSize: 16 });
    currentY += 5;
    
    doc.setFontSize(10);
    reading.analysisResult.monthlyFortune.forEach((month: any) => {
      currentY = addKoreanText(doc, `${month.month}월: ${month.description} (${month.rating}/5)`, 25, currentY, { fontSize: 10, lineHeight: 5 });
    });
    
    currentY += 10;
  }
  
  // Check if we need a new page
  if (currentY > 230) {
    doc.addPage();
    currentY = addHeader(doc);
  }
  
  // Advice
  if (reading.analysisResult.advice) {
    doc.setFontSize(16);
    currentY = addKoreanText(doc, '💡 맞춤 조언', 20, currentY, { fontSize: 16 });
    currentY += 5;
    
    const advice = reading.analysisResult.advice;
    const adviceCategories = [
      { key: 'general', name: '종합 조언', icon: '🌟' },
      { key: 'career', name: '직업 관련', icon: '💼' },
      { key: 'relationship', name: '인간관계', icon: '💕' },
      { key: 'health', name: '건강 관리', icon: '🏥' }
    ];
    
    doc.setFontSize(12);
    adviceCategories.forEach(category => {
      const adviceList = advice[category.key as keyof typeof advice];
      if (adviceList) {
        currentY = addKoreanText(doc, `${category.icon} ${category.name}:`, 25, currentY);
        adviceList.forEach((item: string) => {
          currentY = addKoreanText(doc, `• ${item}`, 30, currentY, { maxWidth: 155, lineHeight: 6 });
        });
        currentY += 5;
      }
    });
  }
  
  return currentY;
};

const addFooter = (doc: jsPDF, pageCount: number) => {
  const pageHeight = doc.internal.pageSize.height;
  
  // Add decorative line
  doc.setLineWidth(0.5);
  doc.setDrawColor(218, 165, 32);
  doc.line(20, pageHeight - 25, 190, pageHeight - 25);
  
  // Add footer text
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text('운명의 해답 - 전통 사주풀이 서비스', 20, pageHeight - 18);
  doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, 20, pageHeight - 12);
  doc.text(`페이지: ${pageCount}`, 190, pageHeight - 12, { align: 'right' });
  
  // Add disclaimer
  doc.setFontSize(8);
  doc.text('본 결과는 전통 사주학에 기반한 참고용 자료입니다.', 105, pageHeight - 6, { align: 'center' });
};

export async function generatePDF(reading: FortuneReading): Promise<void> {
  try {
    const doc = new jsPDF();
    configureKoreanFont(doc);
    
    let currentY = addHeader(doc);
    
    // Add content sections
    currentY = addPersonalInfo(doc, reading, currentY);
    currentY = addSajuPillars(doc, reading, currentY);
    currentY = addElementsAnalysis(doc, reading, currentY);
    currentY = addPersonalityAnalysis(doc, reading, currentY);
    currentY = addTodayFortune(doc, reading, currentY);
    
    // Add premium content (now included in free service)
    // Check if we need a new page
    if (currentY > 230) {
      doc.addPage();
      currentY = addHeader(doc);
    }
    
    currentY = addPremiumAnalysis(doc, reading, currentY);
    
    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addFooter(doc, i);
    }
    
    // Generate filename
    const filename = `사주풀이_${reading.birthYear}${reading.birthMonth.toString().padStart(2, '0')}${reading.birthDay.toString().padStart(2, '0')}_${Date.now()}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('PDF 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// Alternative function for getting PDF as blob (useful for server-side processing)
export async function generatePDFBlob(reading: FortuneReading): Promise<Blob> {
  const doc = new jsPDF();
  configureKoreanFont(doc);
  
  let currentY = addHeader(doc);
  
  // Add content sections (same as above)
  currentY = addPersonalInfo(doc, reading, currentY);
  currentY = addSajuPillars(doc, reading, currentY);
  currentY = addElementsAnalysis(doc, reading, currentY);
  currentY = addPersonalityAnalysis(doc, reading, currentY);
  currentY = addTodayFortune(doc, reading, currentY);
  
  // Premium content included in free service
  if (currentY > 230) {
    doc.addPage();
    currentY = addHeader(doc);
  }
  currentY = addPremiumAnalysis(doc, reading, currentY);
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i);
  }
  
  return doc.output('blob');
}
