import { Gift, Crown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ServiceComparison() {
  const scrollToForm = () => {
    const formElement = document.getElementById('fortune-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            맞춤형 사주풀이 서비스
          </h2>
          <p className="text-xl text-muted-foreground">
            기본부터 프리미엄까지, 원하는 만큼 깊이 있게
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardContent className="p-8 relative">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/20 rounded-full mb-4">
                  <Gift className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">기본 사주풀이</h3>
                <p className="text-muted-foreground mt-2">누구나 무료로</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">무료</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span>기본 성격 분석</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span>사주팔자 기본 해석</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span>오늘의 운세</span>
                </li>
                <li className="flex items-center text-muted-foreground">
                  <X className="w-5 h-5 mr-3" />
                  <span>상세 운세 분석</span>
                </li>
                <li className="flex items-center text-muted-foreground">
                  <X className="w-5 h-5 mr-3" />
                  <span>궁합 분석</span>
                </li>
                <li className="flex items-center text-muted-foreground">
                  <X className="w-5 h-5 mr-3" />
                  <span>PDF 다운로드</span>
                </li>
              </ul>

              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={scrollToForm}
                data-testid="button-free-start"
              >
                무료로 시작하기
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary premium-glow relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                🎉 인기 1위
              </span>
            </div>

            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">프리미엄 사주풀이</h3>
                <p className="text-muted-foreground mt-2">전문가급 해석</p>
                <div className="mt-4">
                  <span className="text-lg text-muted-foreground line-through">49,000원</span>
                  <span className="text-4xl font-bold text-primary ml-2">29,000원</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span>모든 기본 기능 포함</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span><strong>상세 인생 운세</strong> (연애, 결혼, 직업)</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span><strong>궁합 분석</strong> (가족, 연인, 사업파트너)</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span><strong>월별 운세</strong> (12개월 상세 예측)</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span><strong>맞춤 조언</strong> 및 개선 방법</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-3" />
                  <span><strong>PDF 리포트</strong> 다운로드</span>
                </li>
              </ul>

              <Button 
                className="w-full" 
                onClick={scrollToForm}
                data-testid="button-premium-start"
              >
                지금 결제하고 시작하기
              </Button>
              
              <p className="text-center text-sm text-muted-foreground mt-3">
                <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                30일 만족보장, 안전한 결제
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
