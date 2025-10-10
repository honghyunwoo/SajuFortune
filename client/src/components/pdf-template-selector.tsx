/**
 * PDF 템플릿 선택 컴포넌트
 * 3가지 템플릿 + 6가지 색상 테마 선택
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, FileText, Sparkles, Minimize2 } from 'lucide-react';
import type { TemplateType, ColorTheme } from '@/lib/pdf-templates';
import { getTemplate } from '@/lib/pdf-templates';

interface PDFTemplateSelectorProps {
  onSelect: (template: TemplateType, colorTheme: ColorTheme) => void;
  defaultTemplate?: TemplateType;
  defaultColorTheme?: ColorTheme;
}

export default function PDFTemplateSelector({
  onSelect,
  defaultTemplate = 'classic',
  defaultColorTheme = 'default',
}: PDFTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(defaultTemplate);
  const [selectedColorTheme, setSelectedColorTheme] = useState<ColorTheme>(defaultColorTheme);

  const templates: Array<{
    id: TemplateType;
    name: string;
    description: string;
    icon: React.ReactNode;
    preview: string;
  }> = [
    {
      id: 'classic',
      name: '클래식',
      description: '전통적이고 격식 있는 디자인',
      icon: <FileText className="w-6 h-6" />,
      preview: 'border-2 border-gray-800 bg-white',
    },
    {
      id: 'modern',
      name: '모던',
      description: '세련되고 현대적인 디자인',
      icon: <Sparkles className="w-6 h-6" />,
      preview: 'rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-white',
    },
    {
      id: 'minimal',
      name: '미니멀',
      description: '깔끔하고 단순한 디자인',
      icon: <Minimize2 className="w-6 h-6" />,
      preview: 'bg-white border-0',
    },
  ];

  const colorThemes: Array<{
    id: ColorTheme;
    name: string;
    primary: string;
    secondary: string;
  }> = [
    { id: 'default', name: '기본', primary: 'bg-blue-600', secondary: 'bg-gray-700' },
    { id: 'blue', name: '블루', primary: 'bg-blue-500', secondary: 'bg-blue-700' },
    { id: 'purple', name: '퍼플', primary: 'bg-purple-600', secondary: 'bg-purple-800' },
    { id: 'green', name: '그린', primary: 'bg-green-600', secondary: 'bg-teal-700' },
    { id: 'red', name: '레드', primary: 'bg-red-600', secondary: 'bg-red-700' },
    { id: 'gold', name: '골드', primary: 'bg-yellow-600', secondary: 'bg-yellow-700' },
  ];

  const handleTemplateChange = (template: TemplateType) => {
    setSelectedTemplate(template);
    onSelect(template, selectedColorTheme);
  };

  const handleColorThemeChange = (colorTheme: ColorTheme) => {
    setSelectedColorTheme(colorTheme);
    onSelect(selectedTemplate, colorTheme);
  };

  // 현재 선택된 템플릿 설정 가져오기
  const currentConfig = getTemplate(selectedTemplate, selectedColorTheme);

  return (
    <div className="space-y-6">
      {/* 템플릿 선택 */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">PDF 템플릿</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`relative p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleTemplateChange(template.id)}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-start gap-3 mb-3">
                <div className="text-primary">{template.icon}</div>
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* 템플릿 미리보기 */}
              <div className={`h-32 ${template.preview} flex items-center justify-center`}>
                <div className="text-xs text-gray-400">미리보기</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 색상 테마 선택 */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">색상 테마</Label>
        <RadioGroup
          value={selectedColorTheme}
          onValueChange={(value) => handleColorThemeChange(value as ColorTheme)}
          className="grid grid-cols-3 md:grid-cols-6 gap-3"
        >
          {colorThemes.map((theme) => (
            <div key={theme.id} className="relative">
              <RadioGroupItem
                value={theme.id}
                id={theme.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={theme.id}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    selectedColorTheme === theme.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
              >
                {/* 색상 프리뷰 */}
                <div className="flex gap-1">
                  <div className={`w-6 h-6 rounded ${theme.primary}`} />
                  <div className={`w-6 h-6 rounded ${theme.secondary}`} />
                </div>
                <span className="text-xs font-medium">{theme.name}</span>

                {selectedColorTheme === theme.id && (
                  <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* 현재 설정 요약 */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-900">
        <h4 className="font-semibold mb-2 text-sm">현재 선택</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">템플릿:</span>
            <span className="ml-2 font-medium">{currentConfig.name}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">색상:</span>
            <span className="ml-2 font-medium">
              {colorThemes.find((t) => t.id === selectedColorTheme)?.name}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">제목 크기:</span>
            <span className="ml-2 font-medium">{currentConfig.titleFontSize}pt</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">본문 크기:</span>
            <span className="ml-2 font-medium">{currentConfig.bodyFontSize}pt</span>
          </div>
        </div>
      </Card>

      {/* 미리보기 안내 */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <div className="text-blue-600 dark:text-blue-400 mt-0.5">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium">PDF 생성 시 선택한 템플릿이 적용됩니다.</p>
          <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
            프리미엄 사용자만 모든 템플릿과 색상을 사용할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
