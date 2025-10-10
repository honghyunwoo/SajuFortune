/**
 * 언어 선택 컴포넌트
 *
 * 한국어/영어 전환 기능 제공
 */

import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES } from '@/i18n';

/**
 * 언어 선택 드롭다운 버튼
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language || 'ko';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">
            {SUPPORTED_LANGUAGES[currentLanguage as keyof typeof SUPPORTED_LANGUAGES]?.nativeName || '한국어'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, language]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLanguage(code)}
            className={currentLanguage === code ? 'bg-accent' : ''}
          >
            <span className="mr-2">
              {code === 'ko' ? '🇰🇷' : '🇺🇸'}
            </span>
            <span>{language.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * 간단한 언어 토글 버튼 (모바일용)
 */
export function LanguageToggle() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language || 'ko';
  const nextLanguage = currentLanguage === 'ko' ? 'en' : 'ko';

  const toggleLanguage = () => {
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">
        {currentLanguage === 'ko' ? 'EN' : 'KO'}
      </span>
    </Button>
  );
}
