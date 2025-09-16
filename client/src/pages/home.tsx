import { useState } from "react";
import { Link } from "wouter";
import { Star, Users, Tag, Gift, Crown, Play, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FortuneForm from "@/components/fortune-form";
import ServiceComparison from "@/components/service-comparison";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-background text-foreground antialiased">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="yin-yang scale-50"></div>
              <span className="text-xl font-bold text-primary">운명의 해답</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" data-testid="button-login">
                로그인
              </Button>
              <Button size="sm" data-testid="button-premium">
                프리미엄 체험
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 traditional-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="flex justify-center space-x-4 mb-6">
              <div className="zodiac-icon">子</div>
              <div className="zodiac-icon">丑</div>
              <div className="zodiac-icon">寅</div>
              <div className="zodiac-icon">卯</div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            당신의 <span className="text-primary">운명</span>을<br />
            <span className="text-secondary">정확히</span> 알아보세요
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            천년의 지혜가 담긴 전통 사주풀이로 인생의 방향을 찾아보세요.<br />
            AI와 전통이 만나 더욱 정확한 해석을 제공합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="flex items-center gap-2"
              onClick={() => setShowForm(true)}
              data-testid="button-start-free"
            >
              <Star className="w-5 h-5" />
              무료로 시작하기
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2" data-testid="button-watch-intro">
              <Play className="w-5 h-5" />
              서비스 소개 보기
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-muted-foreground">
            <div className="flex items-center" data-testid="text-user-count">
              <Users className="w-4 h-4 mr-2" />
              <span>누적 사용자 <strong className="text-foreground">50,000+</strong></span>
            </div>
            <div className="flex items-center" data-testid="text-rating">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              <span>평점 <strong className="text-foreground">4.8/5.0</strong></span>
            </div>
            <div className="flex items-center" data-testid="text-accuracy">
              <Tag className="w-4 h-4 mr-2" />
              <span><strong className="text-foreground">정확도 95%</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Comparison */}
      <ServiceComparison />

      {/* Birth Info Input Section */}
      {showForm && (
        <section className="py-20 bg-background" id="fortune-form">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                사주팔자 분석 시작하기
              </h2>
              <p className="text-muted-foreground">
                정확한 생년월일과 시간을 입력하면 더 정밀한 해석이 가능합니다
              </p>
            </div>
            <FortuneForm />
          </div>
        </section>
      )}

      {/* Sample Results Preview */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              이런 결과를 받아보실 수 있어요
            </h2>
            <p className="text-muted-foreground">
              실제 사용자 분석 결과 예시 (개인정보 보호를 위해 일부 내용 변경)
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Basic Result Preview */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">기본 분석 결과</h3>
                  <span className="bg-muted/20 text-muted-foreground px-3 py-1 rounded-full text-sm">무료</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">사주팔자</h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-background border rounded p-3">
                        <div className="text-xs text-muted-foreground">년주</div>
                        <div className="font-bold text-primary">갑자</div>
                      </div>
                      <div className="bg-background border rounded p-3">
                        <div className="text-xs text-muted-foreground">월주</div>
                        <div className="font-bold text-primary">병인</div>
                      </div>
                      <div className="bg-background border rounded p-3">
                        <div className="text-xs text-muted-foreground">일주</div>
                        <div className="font-bold text-primary">무오</div>
                      </div>
                      <div className="bg-background border rounded p-3">
                        <div className="text-xs text-muted-foreground">시주</div>
                        <div className="font-bold text-primary">정유</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">기본 성격</h4>
                    <div className="bg-muted/10 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        솔직하고 정직한 성격으로 주변 사람들의 신뢰를 받습니다. 
                        책임감이 강하고 한 번 시작한 일은 끝까지 해내는 끈기가 있습니다...
                      </p>
                      <div className="mt-3 text-muted-foreground text-xs">
                        더 상세한 분석은 프리미엄에서 확인하세요
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">오늘의 운세</h4>
                    <div className="flex items-center mb-2">
                      <span className="text-primary">★★★★☆</span>
                      <span className="ml-2 text-sm">종합운: 좋음</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      전반적으로 안정적인 하루가 될 것 같습니다. 특히 오후에 좋은 소식이...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Result Preview */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary premium-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">프리미엄 분석 결과</h3>
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    프리미엄
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card/50 border rounded p-3 text-center">
                      <div className="text-sm font-medium">연애운</div>
                      <div className="text-primary font-bold">85점</div>
                    </div>
                    <div className="bg-card/50 border rounded p-3 text-center">
                      <div className="text-sm font-medium">직업운</div>
                      <div className="text-secondary font-bold">92점</div>
                    </div>
                    <div className="bg-card/50 border rounded p-3 text-center">
                      <div className="text-sm font-medium">재물운</div>
                      <div className="text-accent font-bold">78점</div>
                    </div>
                    <div className="bg-card/50 border rounded p-3 text-center">
                      <div className="text-sm font-medium">건강운</div>
                      <div className="text-primary font-bold">90점</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">궁합 분석</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-card/50 rounded">
                        <span className="text-sm">띠 궁합 (원숭이띠)</span>
                        <span className="text-primary font-medium">최고</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-card/50 rounded">
                        <span className="text-sm">사주 궁합</span>
                        <span className="text-secondary font-medium">양호</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">월별 운세 (2024년)</h4>
                    <div className="bg-card/50 p-4 rounded-lg">
                      <div className="text-sm mb-2">
                        <strong>12월:</strong> 연말 새로운 기회가 찾아올 것
                      </div>
                      <div className="text-xs text-muted-foreground">
                        1-11월 상세 운세는 PDF 리포트에서 확인
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Button className="w-full" data-testid="button-download-pdf">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF 리포트 다운로드 (15페이지)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              왜 운명의 해답을 선택하시나요?
            </h2>
            <p className="text-muted-foreground">
              천년의 전통과 현대 기술의 만남
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI + 전통 지혜</h3>
              <p className="text-muted-foreground">
                천년의 사주학 이론과 최신 AI 기술을 결합하여 
                더욱 정확하고 세밀한 분석을 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-6">
                <Tag className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">95% 정확도</h3>
              <p className="text-muted-foreground">
                수만 건의 검증을 통해 입증된 높은 정확도로 
                신뢰할 수 있는 인생 가이드를 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">언제 어디서나</h3>
              <p className="text-muted-foreground">
                모바일 최적화된 인터페이스로 언제 어디서나 
                편리하게 사주풀이를 받아보실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              사용자 후기
            </h2>
            <p className="text-muted-foreground">
              실제 사용자들의 생생한 경험담
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "김○○님", job: "직장인, 30대", rating: 5, review: "진짜 신기했어요. 제 성격이나 현재 상황이 너무 정확하게 나와서 깜짝 놀랐습니다. 특히 직업운 분석이 도움이 많이 됐어요." },
              { name: "박○○님", job: "사업자, 40대", rating: 5, review: "궁합 분석 때문에 프리미엄을 결제했는데, 정말 자세하고 정확해요. 가족들 것도 다 해봤는데 모두 만족했습니다." },
              { name: "이○○님", job: "대학생, 20대", rating: 4, review: "무료로도 기본적인 건 다 알 수 있어서 좋아요. 앱도 사용하기 편하고 디자인도 예뻐서 친구들에게 추천했어요." }
            ].map((testimonial, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                      <span className="font-bold text-primary">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.job}</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    <span className="text-yellow-500">
                      {"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    "{testimonial.review}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              자주 묻는 질문
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                사주풀이 결과가 정확한가요?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                전통 사주학 이론을 바탕으로 한 95% 정확도의 분석 시스템입니다. 
                다만 사주풀이는 참고용이며, 인생의 방향성을 제시하는 가이드라는 점을 말씀드립니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                태어난 시간을 정확히 모르는데 괜찮나요?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                시간을 모르시면 12:00으로 설정하셔도 됩니다. 
                시주를 제외한 년주, 월주, 일주만으로도 충분히 의미 있는 분석이 가능합니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                결제는 어떻게 이루어지나요?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Stripe을 통한 안전한 결제 시스템을 사용합니다. 
                신용카드, 체크카드 모두 사용 가능하며, 30일 만족보장 정책을 운영합니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                PDF 다운로드는 어떻게 하나요?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                프리미엄 결제 후 분석 결과 페이지에서 'PDF 다운로드' 버튼을 클릭하시면 됩니다. 
                15페이지 분량의 상세한 리포트를 받아보실 수 있습니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/20 text-muted-foreground py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="yin-yang scale-50"></div>
                <span className="text-lg font-bold text-foreground">운명의 해답</span>
              </div>
              <p className="text-sm">
                전통과 현대가 만나는<br />
                정확한 사주풀이 서비스
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">서비스</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-foreground transition-colors">무료 사주풀이</Link></li>
                <li><Link href="/" className="hover:text-foreground transition-colors">프리미엄 분석</Link></li>
                <li><Link href="/" className="hover:text-foreground transition-colors">궁합 분석</Link></li>
                <li><Link href="/" className="hover:text-foreground transition-colors">운세 달력</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">고객지원</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-foreground transition-colors">자주 묻는 질문</Link></li>
                <li><Link href="/" className="hover:text-foreground transition-colors">이용약관</Link></li>
                <li><Link href="/" className="hover:text-foreground transition-colors">개인정보처리방침</Link></li>
                <li><Link href="/" className="hover:text-foreground transition-colors">문의하기</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">연락처</h4>
              <ul className="space-y-2 text-sm">
                <li>이메일: support@fortuneapp.kr</li>
                <li>전화: 1588-0000</li>
                <li>평일 9:00-18:00</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-border" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © 2024 운명의 해답. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/" className="hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </Link>
              <Link href="/" className="hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.83.841-.09.381-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.751-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001"/>
                </svg>
              </Link>
              <Link href="/" className="hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
