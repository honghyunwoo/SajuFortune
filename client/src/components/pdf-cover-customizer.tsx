/**
 * PDF 커버 커스터마이징 컴포넌트
 * 제목, 서브타이틀, 로고 등 커버 페이지 설정
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Upload, Eye, RotateCcw } from 'lucide-react';

export interface CoverCustomization {
  title: string;
  subtitle: string;
  includeUserName: boolean;
  includeBirthDate: boolean;
  includeGeneratedDate: boolean;
  customMessage?: string;
  logoUrl?: string;
}

interface PDFCoverCustomizerProps {
  onChange: (customization: CoverCustomization) => void;
  defaultValues?: Partial<CoverCustomization>;
  userName?: string;
  birthDate?: string;
}

export default function PDFCoverCustomizer({
  onChange,
  defaultValues,
  userName = '홍길동',
  birthDate = '1990-01-01',
}: PDFCoverCustomizerProps) {
  const [customization, setCustomization] = useState<CoverCustomization>({
    title: defaultValues?.title || '사주팔자 분석 결과',
    subtitle: defaultValues?.subtitle || '운명의 해답',
    includeUserName: defaultValues?.includeUserName ?? true,
    includeBirthDate: defaultValues?.includeBirthDate ?? true,
    includeGeneratedDate: defaultValues?.includeGeneratedDate ?? true,
    customMessage: defaultValues?.customMessage || '',
    logoUrl: defaultValues?.logoUrl || '',
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateCustomization = (updates: Partial<CoverCustomization>) => {
    const newCustomization = { ...customization, ...updates };
    setCustomization(newCustomization);
    onChange(newCustomization);
  };

  const resetToDefault = () => {
    const defaultCustomization: CoverCustomization = {
      title: '사주팔자 분석 결과',
      subtitle: '운명의 해답',
      includeUserName: true,
      includeBirthDate: true,
      includeGeneratedDate: true,
      customMessage: '',
      logoUrl: '',
    };
    setCustomization(defaultCustomization);
    onChange(defaultCustomization);
  };

  return (
    <div className="space-y-6">
      {/* 제목 설정 */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">커버 페이지 제목</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cover-title">메인 제목</Label>
            <Input
              id="cover-title"
              value={customization.title}
              onChange={(e) => updateCustomization({ title: e.target.value })}
              placeholder="사주팔자 분석 결과"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              {customization.title.length}/50
            </p>
          </div>

          <div>
            <Label htmlFor="cover-subtitle">서브 제목</Label>
            <Input
              id="cover-subtitle"
              value={customization.subtitle}
              onChange={(e) => updateCustomization({ subtitle: e.target.value })}
              placeholder="운명의 해답"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              {customization.subtitle.length}/50
            </p>
          </div>
        </div>
      </Card>

      {/* 포함 정보 설정 */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">포함 정보</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="include-name" className="cursor-pointer">
              사용자 이름 표시
            </Label>
            <Switch
              id="include-name"
              checked={customization.includeUserName}
              onCheckedChange={(checked) =>
                updateCustomization({ includeUserName: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="include-birth" className="cursor-pointer">
              생년월일 표시
            </Label>
            <Switch
              id="include-birth"
              checked={customization.includeBirthDate}
              onCheckedChange={(checked) =>
                updateCustomization({ includeBirthDate: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="include-date" className="cursor-pointer">
              생성 날짜 표시
            </Label>
            <Switch
              id="include-date"
              checked={customization.includeGeneratedDate}
              onCheckedChange={(checked) =>
                updateCustomization({ includeGeneratedDate: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* 커스텀 메시지 */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">커스텀 메시지 (선택)</h3>
        <Textarea
          value={customization.customMessage}
          onChange={(e) => updateCustomization({ customMessage: e.target.value })}
          placeholder="커버 페이지에 표시할 메시지를 입력하세요. (예: '당신의 운명을 함께 찾아갑니다')"
          rows={3}
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">
          {customization.customMessage?.length || 0}/200
        </p>
      </Card>

      {/* 로고 업로드 (프리미엄) */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold">로고 이미지</h3>
          <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded">
            프리미엄
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            커버 페이지에 표시할 로고 이미지를 업로드하세요.
          </p>

          {customization.logoUrl ? (
            <div className="flex items-center gap-3">
              <img
                src={customization.logoUrl}
                alt="Logo preview"
                className="w-16 h-16 object-contain border rounded"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateCustomization({ logoUrl: '' })}
              >
                제거
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              <Upload className="w-4 h-4 mr-2" />
              로고 업로드 (프리미엄 전용)
            </Button>
          )}
        </div>
      </Card>

      {/* 미리보기 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">커버 미리보기</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? '닫기' : '보기'}
          </Button>
        </div>

        {showPreview && (
          <div className="mt-4 p-6 border-2 border-dashed rounded-lg bg-white dark:bg-gray-900 text-center space-y-4">
            {customization.logoUrl && (
              <img
                src={customization.logoUrl}
                alt="Logo"
                className="w-20 h-20 mx-auto object-contain"
              />
            )}

            <h1 className="text-3xl font-bold text-primary">
              {customization.title}
            </h1>

            {customization.subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {customization.subtitle}
              </p>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            <div className="space-y-2 text-sm">
              {customization.includeUserName && (
                <p className="font-medium">{userName}</p>
              )}
              {customization.includeBirthDate && (
                <p className="text-gray-600 dark:text-gray-400">
                  생년월일: {birthDate}
                </p>
              )}
            </div>

            {customization.customMessage && (
              <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-4">
                "{customization.customMessage}"
              </p>
            )}

            {customization.includeGeneratedDate && (
              <p className="text-xs text-gray-400 mt-6">
                Generated on {new Date().toLocaleDateString('ko-KR')}
              </p>
            )}
          </div>
        )}
      </Card>

      {/* 초기화 버튼 */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={resetToDefault}>
          <RotateCcw className="w-4 h-4 mr-2" />
          기본값으로 초기화
        </Button>
      </div>
    </div>
  );
}
