/**
 * 프리미엄 소개 페이지
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, ArrowLeft } from 'lucide-react';
import SEOHead from '@/components/seo-head';

const PLANS = [
  {
    id: 'monthly',
    name: '프리미엄 월간',
    price: 9900,
    interval: 'month',
    features: [
      '무제한 사주 분석',
      '무제한 궁합 분석',
      '무제한 월별 운세',
      'PDF 다운로드',
      '광고 없음',
      '우선 지원',
    ],
  },
  {
    id: 'yearly',
    name: '프리미엄 연간',
    price: 99000,
    interval: 'year',
    savings: '2개월 무료',
    features: [
      '월간 플랜 모든 혜택',
      '2개월 무료 (연 99,000원)',
      '프리미엄 뱃지',
      '우선 기능 업데이트',
      '전담 고객 지원',
    ],
    popular: true,
  },
];

export default function Premium() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(planId);

      // TODO: 실제 userId와 email을 세션에서 가져오기
      const userId = 'temp-user-id';
      const email = 'user@example.com';

      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: planId,
          userId,
          email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="프리미엄 플랜 - 운명의 해답"
        description="무제한 사주 분석, 궁합, 월별 운세를 프리미엄으로 이용하세요. 월 9,900원부터."
        keywords={['프리미엄 사주', '사주 구독', '무제한 운세', '프리미엄 플랜']}
      />

      {/* Header */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <div className="yin-yang scale-50"></div>
                <span className="text-xl font-bold text-primary">운명의 해답</span>
              </a>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                홈으로
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Crown className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4">프리미엄으로 업그레이드</h1>
          <p className="text-xl text-purple-200 mb-8">
            무제한으로 사주, 궁합, 월별 운세를 확인하고<br />
            더 깊은 통찰력을 얻으세요
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>광고 없음</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>무제한 분석</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>PDF 다운로드</span>
            </div>
          </div>
        </div>
      </section>

      {/* Free vs Premium Comparison */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">무료 vs 프리미엄</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>무료 플랜</CardTitle>
                <CardDescription>기본 기능 제공</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <span>사주 분석 월 3회</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <span>궁합 분석 월 1회</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <span>월별 운세 월 1회</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span className="w-5 h-5 mt-0.5">✗</span>
                  <span>PDF 다운로드</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span className="w-5 h-5 mt-0.5">✗</span>
                  <span>광고 제거</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    프리미엄 플랜
                  </CardTitle>
                  <Badge>인기</Badge>
                </div>
                <CardDescription>모든 기능 무제한</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="font-semibold">무제한 사주 분석</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="font-semibold">무제한 궁합 분석</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="font-semibold">무제한 월별 운세</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="font-semibold">PDF 다운로드</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="font-semibold">광고 없음</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="font-semibold">우선 지원</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">플랜 선택</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={plan.popular ? 'border-primary shadow-xl scale-105' : ''}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.popular && (
                      <Badge variant="default" className="bg-primary">
                        <Star className="w-3 h-3 mr-1" />
                        추천
                      </Badge>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="text-4xl font-bold">
                      {plan.price.toLocaleString()}원
                      <span className="text-lg font-normal text-muted-foreground">
                        /{plan.interval === 'month' ? '월' : '년'}
                      </span>
                    </div>
                    {plan.savings && (
                      <div className="text-sm text-green-600 font-semibold mt-1">
                        {plan.savings}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      '처리 중...'
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        {plan.id === 'yearly' ? '연간 구독하기' : '월간 구독하기'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">언제든지 취소할 수 있나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  네, 언제든지 구독을 취소할 수 있습니다. 취소 시 현재 결제 기간이 끝날 때까지 프리미엄 기능을 이용할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">환불 정책은 어떻게 되나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  구독 후 7일 이내에 서비스를 이용하지 않은 경우 전액 환불이 가능합니다. 자세한 내용은 환불 정책을 참고해주세요.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">결제 수단은 무엇이 있나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  신용카드, 체크카드로 결제할 수 있습니다. Stripe를 통해 안전하게 결제가 처리됩니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">무료 플랜으로 돌아갈 수 있나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  네, 언제든지 구독을 취소하고 무료 플랜으로 돌아갈 수 있습니다. 무료 플랜에서는 월별 사용 제한이 적용됩니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">지금 시작하세요</h2>
          <p className="text-xl mb-8 text-purple-100">
            프리미엄으로 업그레이드하고 무제한으로 운세를 확인하세요
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => handleSubscribe('monthly')}
          >
            <Crown className="mr-2 h-5 w-5" />
            프리미엄 시작하기
          </Button>
        </div>
      </section>
    </div>
  );
}
