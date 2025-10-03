import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Warning: VITE_STRIPE_PUBLIC_KEY not found. Using test key.');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_dummy');

const CheckoutForm = ({ readingId }: { readingId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 약관 동의 체크
    if (!agreedToTerms) {
      toast({
        title: "약관 동의 필요",
        description: "서비스 이용약관 및 법적 고지사항에 동의해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/results/${readingId}`,
      },
    });

    if (error) {
      toast({
        title: "결제 실패",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "결제 완료",
        description: "프리미엄 사주풀이를 확인해보세요!",
      });
      setLocation(`/results/${readingId}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-payment">
      <div className="bg-muted/10 p-4 rounded-lg space-y-4">
        <PaymentElement />
      </div>

      {/* 약관 동의 체크박스 */}
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms-agreement"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-amber-400 text-primary focus:ring-primary"
            data-testid="checkbox-terms"
          />
          <label htmlFor="terms-agreement" className="text-sm text-amber-900 cursor-pointer">
            <span className="font-semibold block mb-1">필수 동의 사항</span>
            <span className="block">
              본인은{" "}
              <a
                href="/terms-of-service"
                target="_blank"
                className="underline font-semibold hover:text-amber-700"
              >
                서비스 이용약관
              </a>
              (특히 제14조~제17조 법적 면책 조항)을 읽고 이해하였으며,
              본 서비스가 <strong>엔터테인먼트 목적</strong>이고{" "}
              <strong>의료·법률·재무 조언을 제공하지 않음</strong>을 확인하고 동의합니다.
            </span>
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing || !agreedToTerms}
        data-testid="button-pay"
      >
        {isProcessing ? (
          <>
            <div className="loading-spinner mr-3"></div>
            결제 처리 중...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            안전하게 결제하기 (29,000원)
          </>
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground space-y-1">
        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>SSL 보안 연결로 안전하게 보호됩니다</span>
        </div>
        <div>30일 만족보장 | 카드사 무이자 할부 가능</div>
      </div>
    </form>
  );
};

export default function Checkout() {
  const params = useParams();
  const readingId = params.readingId!;
  const [clientSecret, setClientSecret] = useState("");

  const { data: reading, isLoading: isLoadingReading } = useQuery({
    queryKey: ['/api/fortune-readings', readingId],
    enabled: !!readingId,
  });

  useEffect(() => {
    if (!readingId) return;
    
    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { readingId })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Payment intent creation failed:', error);
      });
  }, [readingId]);

  if (isLoadingReading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" aria-label="Loading"/>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" aria-label="Loading"/>
          <p className="text-muted-foreground">결제 준비 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground" data-testid="link-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </Link>
            <div className="ml-auto flex items-center space-x-2">
              <div className="yin-yang scale-50"></div>
              <span className="text-lg font-bold text-primary">운명의 해답</span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              안전한 결제
            </h2>
            <p className="text-muted-foreground">
              Stripe을 통한 안전하고 빠른 결제 시스템
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">주문 요약</h3>
                <div className="bg-muted/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>프리미엄 사주풀이</span>
                    <span>29,000원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>할인</span>
                    <span>-20,000원</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>총 결제금액</span>
                    <span className="text-primary">29,000원</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm readingId={readingId} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
