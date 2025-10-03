import { AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface LegalWarningBannerProps {
  variant?: "default" | "compact";
  dismissible?: boolean;
  showOnce?: boolean;
}

export function LegalWarningBanner({
  variant = "default",
  dismissible = true,
  showOnce = false
}: LegalWarningBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const storageKey = "legal-warning-dismissed";

  useEffect(() => {
    if (showOnce) {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed === "true") {
        setIsVisible(false);
      }
    }
  }, [showOnce]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (showOnce) {
      localStorage.setItem(storageKey, "true");
    }
  };

  if (!isVisible) return null;

  if (variant === "compact") {
    return (
      <Alert className="bg-amber-50 border-amber-300 mb-4">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm flex items-center justify-between">
          <span>
            <strong>법적 고지:</strong> 본 서비스는 엔터테인먼트 목적이며, 의료·법률·재무 조언을 제공하지 않습니다.
          </span>
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="ml-4 h-6 w-6 p-0 text-amber-600 hover:text-amber-800"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-amber-50 border-amber-400 border-2 mb-6 relative">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertDescription className="text-amber-900">
        <div className="pr-8">
          <h3 className="font-bold text-base mb-2">⚠️ 중요한 법적 고지사항</h3>
          <ul className="space-y-1.5 text-sm">
            <li>
              <strong>엔터테인먼트 목적:</strong> 본 서비스는 재미와 문화적 흥미를 위한 것이며,
              과학적 사실이나 확정적 미래 예측이 아닙니다.
            </li>
            <li>
              <strong>전문 조언 아님:</strong> 의료·법률·재무 관련 사항은 반드시 해당 분야 전문가와 상담하세요.
            </li>
            <li>
              <strong>결정의 책임:</strong> 인생의 중요한 결정은 본인의 자유의지와 책임 하에 이루어져야 하며,
              본 서비스 내용만을 근거로 삼지 마세요.
            </li>
            <li>
              <strong>정확도 보증 불가:</strong> 분석 결과의 정확성을 보장하지 않으며,
              참고 자료 중 하나로만 활용하세요.
            </li>
          </ul>
          <p className="mt-3 text-xs text-amber-700">
            자세한 내용은{" "}
            <a href="/terms-of-service" className="underline font-semibold hover:text-amber-900">
              이용약관 제14~17조
            </a>
            를 참고하세요.
          </p>
        </div>
        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute top-2 right-2 h-6 w-6 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
