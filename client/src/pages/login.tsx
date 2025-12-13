import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import SocialLoginButtons from "@/components/social-login-buttons";
import SEOHead from "@/components/seo-head";
import { useAuth } from "@/contexts/auth-context";

export default function Login() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // URL에서 에러 파라미터 추출
  const searchParams = new URLSearchParams(window.location.search);
  const error = searchParams.get("error");

  // 이미 로그인된 경우 마이페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation("/mypage");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "google_failed":
        return "Google 로그인에 실패했습니다. 다시 시도해주세요.";
      case "kakao_failed":
        return "카카오 로그인에 실패했습니다. 다시 시도해주세요.";
      case "naver_failed":
        return "네이버 로그인에 실패했습니다. 다시 시도해주세요.";
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage(error);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="로그인 | 운명의 해답"
        description="소셜 로그인으로 간편하게 가입하고 나만의 사주 분석 결과를 저장하세요."
      />

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                홈으로
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="yin-yang scale-50"></div>
              <span className="text-xl font-bold text-primary">운명의 해답</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center py-20 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="yin-yang"></div>
            </div>
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              소셜 계정으로 간편하게 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <SocialLoginButtons />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                로그인하면{" "}
                <Link href="/terms-of-service">
                  <span className="underline hover:text-foreground">서비스 이용약관</span>
                </Link>
                과{" "}
                <Link href="/privacy-policy">
                  <span className="underline hover:text-foreground">개인정보 처리방침</span>
                </Link>
                에 동의하게 됩니다.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                로그인하면 나만의 사주 분석 결과를 저장하고
                <br />
                언제든지 다시 확인할 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
