import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp, Search, HelpCircle, CreditCard, Shield, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

const faqData: FAQItem[] = [
  // 서비스 이용 관련 (5문항)
  {
    id: 1,
    category: "서비스 이용",
    question: "사주풀이 서비스는 어떻게 이용하나요?",
    answer: "홈페이지에서 생년월일시와 성별을 입력하면 기본 사주 분석을 무료로 받을 수 있습니다. 더 상세한 프리미엄 분석을 원하시면 29,000원의 유료 서비스를 이용하실 수 있습니다.",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    id: 2,
    category: "서비스 이용",
    question: "출생 시간을 모르는 경우 어떻게 하나요?",
    answer: "출생 시간을 모르는 경우 '시간 모름'을 선택하시면 됩니다. 다만 시주(時柱) 분석이 제외되므로 정확도가 다소 낮아질 수 있습니다. 가능하면 가족이나 출생 병원에 문의하여 정확한 시간을 확인하시는 것을 권장합니다.",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    id: 3,
    category: "서비스 이용",
    question: "음력 생일도 입력할 수 있나요?",
    answer: "네, 가능합니다. 입력 화면에서 '음력' 옵션을 선택하고 음력 생년월일을 입력하시면 자동으로 양력으로 변환하여 사주를 계산합니다.",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    id: 4,
    category: "서비스 이용",
    question: "결과를 PDF로 저장할 수 있나요?",
    answer: "네, 프리미엄 서비스 이용 시 결과 페이지 하단의 'PDF 다운로드' 버튼을 클릭하여 분석 결과를 PDF 파일로 저장할 수 있습니다.",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    id: 5,
    category: "서비스 이용",
    question: "여러 사람의 사주를 한번에 볼 수 있나요?",
    answer: "각 사주는 개별적으로 분석됩니다. 여러 사람의 사주를 보시려면 각각 정보를 입력하여 분석을 받으셔야 합니다. 프리미엄 서비스는 각 분석마다 별도 결제가 필요합니다.",
    icon: <HelpCircle className="h-5 w-5" />
  },

  // 결제 및 환불 (5문항)
  {
    id: 6,
    category: "결제 및 환불",
    question: "어떤 결제 수단을 사용할 수 있나요?",
    answer: "신용카드, 체크카드, 계좌이체를 지원합니다. Stripe 결제 시스템을 통해 안전하게 결제하실 수 있으며, 모든 거래는 SSL 암호화로 보호됩니다.",
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: 7,
    category: "결제 및 환불",
    question: "프리미엄 서비스 가격은 얼마인가요?",
    answer: "프리미엄 사주풀이는 29,000원입니다. 여기에는 상세 운세 분석, 대운(大運) 80년 예측, 십이운성 분석, 격국 판별 등 모든 고급 분석이 포함됩니다.",
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: 8,
    category: "결제 및 환불",
    question: "무이자 할부가 가능한가요?",
    answer: "네, 대부분의 카드사에서 2~3개월 무이자 할부를 지원합니다. 구체적인 할부 조건은 각 카드사 정책에 따라 다를 수 있으니 결제 시 확인해 주세요.",
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: 9,
    category: "결제 및 환불",
    question: "환불 정책은 어떻게 되나요?",
    answer: "서비스 특성상 결과 확인 후에는 환불이 어렵습니다. 단, 기술적 오류로 결과를 제공받지 못한 경우 전액 환불해 드립니다. 자세한 내용은 환불 정책 페이지를 참고해 주세요.",
    icon: <RefreshCw className="h-5 w-5" />
  },
  {
    id: 10,
    category: "결제 및 환불",
    question: "영수증 발행이 가능한가요?",
    answer: "네, 결제 완료 후 이메일로 영수증이 자동 발송됩니다. 추가 영수증이 필요하신 경우 고객지원으로 연락 주시면 재발행해 드립니다.",
    icon: <CreditCard className="h-5 w-5" />
  },

  // 정확도 및 신뢰성 (5문항)
  {
    id: 11,
    category: "정확도 및 신뢰성",
    question: "사주 분석의 정확도는 어느 정도인가요?",
    answer: "본 서비스는 전통 사주명리학 이론에 기반하지만, 사주명리학 자체가 과학적으로 검증된 학문이 아니므로 정확도를 수치로 보증할 수 없습니다. 참고 자료로만 활용해 주시기 바랍니다.",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 12,
    category: "정확도 및 신뢰성",
    question: "다른 사주 서비스와 결과가 다른데 왜 그런가요?",
    answer: "사주명리학은 해석자에 따라 다양한 견해가 있을 수 있습니다. 같은 사주라도 어떤 이론과 해석 방법을 사용하느냐에 따라 결과가 달라질 수 있으며, 이는 정상적인 현상입니다.",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 13,
    category: "정확도 및 신뢰성",
    question: "이 서비스로 중요한 인생 결정을 해도 되나요?",
    answer: "아니요, 절대 안 됩니다. 본 서비스는 엔터테인먼트 목적이며, 결혼, 이직, 투자 등 인생의 중요한 결정은 반드시 신중하게 본인이 판단하시고, 필요시 해당 분야 전문가와 상담하시기 바랍니다.",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 14,
    category: "정확도 및 신뢰성",
    question: "미래를 예측할 수 있나요?",
    answer: "본 서비스는 전통적인 운세 이론에 기반하여 경향성을 제시할 뿐, 미래를 확정적으로 예측하거나 특정 사건의 발생을 보장하지 않습니다.",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 15,
    category: "정확도 및 신뢰성",
    question: "건강, 법률, 재정 조언을 받을 수 있나요?",
    answer: "아니요, 본 서비스는 의료, 법률, 재무 조언을 제공하지 않습니다. 건강 문제는 의사, 법률 문제는 변호사, 재정 문제는 재무 전문가와 반드시 상담하시기 바랍니다.",
    icon: <Shield className="h-5 w-5" />
  },

  // 개인정보 및 보안 (5문항)
  {
    id: 16,
    category: "개인정보 및 보안",
    question: "입력한 생년월일 정보는 안전한가요?",
    answer: "네, 모든 개인정보는 SSL 암호화로 전송되며, GDPR 및 개인정보보호법을 준수하여 안전하게 관리됩니다. 자세한 내용은 개인정보처리방침을 참고해 주세요.",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 17,
    category: "개인정보 및 보안",
    question: "내 정보가 제3자에게 공유되나요?",
    answer: "아니요, 귀하의 정보는 서비스 제공 목적으로만 사용되며, 법적 요구가 있는 경우를 제외하고는 제3자에게 공유되지 않습니다.",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 18,
    category: "개인정보 및 보안",
    question: "회원가입이 필요한가요?",
    answer: "기본 무료 서비스는 회원가입 없이 이용 가능합니다. 프리미엄 서비스 구매 시에는 결제 정보 확인을 위해 최소한의 정보(이메일)가 필요할 수 있습니다.",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 19,
    category: "개인정보 및 보안",
    question: "결제 정보는 어떻게 보호되나요?",
    answer: "모든 결제는 PCI-DSS 인증을 받은 Stripe 결제 시스템을 통해 처리되며, 당사는 카드 정보를 직접 저장하지 않습니다. 결제 정보는 Stripe의 보안 서버에서 암호화되어 관리됩니다.",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 20,
    category: "개인정보 및 보안",
    question: "내 정보를 삭제할 수 있나요?",
    answer: "네, 고객지원으로 요청하시면 귀하의 모든 개인정보를 삭제해 드립니다. 단, 법적 보관 의무가 있는 결제 관련 정보는 관련 법령에 따라 일정 기간 보관될 수 있습니다.",
    icon: <Shield className="h-5 w-5" />
  }
];

const categories = ["전체", "서비스 이용", "결제 및 환불", "정확도 및 신뢰성", "개인정보 및 보안"];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "서비스 이용": return <HelpCircle className="h-4 w-4" />;
      case "결제 및 환불": return <CreditCard className="h-4 w-4" />;
      case "정확도 및 신뢰성": return <Shield className="h-4 w-4" />;
      case "개인정보 및 보안": return <Shield className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">자주 묻는 질문</h1>
        <p className="text-muted-foreground">
          궁금하신 내용을 빠르게 찾아보세요
        </p>
      </div>

      {/* 검색창 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="질문 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
              }`}
          >
            {getCategoryIcon(category)}
            {category}
          </button>
        ))}
      </div>

      {/* FAQ 리스트 */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              검색 결과가 없습니다. 다른 키워드로 검색해 보세요.
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full text-left p-6 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {item.icon}
                      {item.question}
                    </h3>
                  </div>
                  <div className="ml-4 mt-1">
                    {openItems.includes(item.id) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </button>
              {openItems.includes(item.id) && (
                <div className="px-6 pb-6 pt-2">
                  <div className="border-t pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* 추가 문의 안내 */}
      <Card className="mt-8 bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">찾으시는 답변이 없으신가요?</h3>
          <p className="text-muted-foreground mb-4">
            고객지원팀이 도와드리겠습니다.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            문의하기
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
