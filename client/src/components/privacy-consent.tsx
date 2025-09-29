import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Cookie, FileText } from "lucide-react";

interface PrivacyConsentProps {
  onAccept: (consents: ConsentSettings) => void;
  onDecline: () => void;
}

export interface ConsentSettings {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  marketing: boolean;
}

export default function PrivacyConsent({ onAccept, onDecline }: PrivacyConsentProps) {
  const [consents, setConsents] = useState<ConsentSettings>({
    essential: true, // 필수 쿠키는 항상 true
    performance: false,
    functional: false,
    marketing: false,
  });

  const [showDetails, setShowDetails] = useState(false);

  const handleConsentChange = (type: keyof ConsentSettings, checked: boolean) => {
    if (type === 'essential') return; // 필수 쿠키는 변경 불가
    
    setConsents(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const handleAccept = () => {
    // 쿠키 설정을 localStorage에 저장
    localStorage.setItem('cookie-consent', JSON.stringify(consents));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    onAccept(consents);
  };

  const handleDecline = () => {
    // 필수 쿠키만 허용
    const essentialOnly = { essential: true, performance: false, functional: false, marketing: false };
    localStorage.setItem('cookie-consent', JSON.stringify(essentialOnly));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    onDecline();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">개인정보 및 쿠키 동의</h2>
            <p className="text-muted-foreground">
              사주풀이 서비스를 이용하기 위해 개인정보 처리 및 쿠키 사용에 대한 동의가 필요합니다.
            </p>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>개인정보 보호:</strong> 귀하의 개인정보는 안전하게 보호되며, 
              사주 계산 목적으로만 사용됩니다. 자세한 내용은 개인정보처리방침을 확인해주세요.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">쿠키 설정</h3>
            
            {/* 필수 쿠키 */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/50">
              <Checkbox 
                id="essential" 
                checked={consents.essential} 
                disabled 
              />
              <div className="flex-1">
                <Label htmlFor="essential" className="font-medium">
                  필수 쿠키 (필수)
                </Label>
                <p className="text-sm text-muted-foreground">
                  서비스의 기본 기능을 위해 반드시 필요한 쿠키입니다. 
                  세션 관리, 보안, 기본 설정 등에 사용됩니다.
                </p>
              </div>
            </div>

            {/* 성능 쿠키 */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox 
                id="performance" 
                checked={consents.performance}
                onCheckedChange={(checked) => handleConsentChange('performance', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="performance" className="font-medium">
                  성능 쿠키 (선택)
                </Label>
                <p className="text-sm text-muted-foreground">
                  서비스 성능을 분석하고 개선하기 위해 사용합니다. 
                  Google Analytics 등을 통해 방문자 통계를 수집합니다.
                </p>
              </div>
            </div>

            {/* 기능 쿠키 */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox 
                id="functional" 
                checked={consents.functional}
                onCheckedChange={(checked) => handleConsentChange('functional', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="functional" className="font-medium">
                  기능 쿠키 (선택)
                </Label>
                <p className="text-sm text-muted-foreground">
                  사용자 경험을 향상시키기 위한 쿠키입니다. 
                  사주 결과 저장, 개인화된 설정 등에 사용됩니다.
                </p>
              </div>
            </div>

            {/* 마케팅 쿠키 */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox 
                id="marketing" 
                checked={consents.marketing}
                onCheckedChange={(checked) => handleConsentChange('marketing', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="marketing" className="font-medium">
                  마케팅 쿠키 (선택)
                </Label>
                <p className="text-sm text-muted-foreground">
                  맞춤형 광고 및 마케팅 목적으로 사용됩니다. 
                  현재는 사용하지 않지만 향후 서비스 확장 시 사용될 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? '간단히 보기' : '자세히 보기'}
            </Button>
            
            {showDetails && (
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">관련 문서</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button variant="ghost" size="sm" className="justify-start">
                    개인정보처리방침
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    서비스 이용약관
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    쿠키 정책
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleAccept}
              className="flex-1"
            >
              선택한 설정으로 동의
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDecline}
              className="flex-1"
            >
              필수 쿠키만 허용
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            언제든지 설정을 변경할 수 있습니다. 
            설정 변경은 브라우저의 쿠키 설정 또는 서비스 설정에서 가능합니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// 쿠키 동의 상태 확인 훅
export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');
    
    if (savedConsent && consentDate) {
      const date = new Date(consentDate);
      const now = new Date();
      const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      
      // 1년 후 재동의 요청
      if (daysDiff < 365) {
        setConsent(JSON.parse(savedConsent));
      }
    }
    
    setIsLoading(false);
  }, []);

  return { consent, isLoading };
}
