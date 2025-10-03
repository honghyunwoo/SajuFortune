import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Clock, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "일반 문의",
    subject: "",
    message: ""
  });

  const categories = [
    "일반 문의",
    "결제 문의",
    "환불 요청",
    "기술 지원",
    "서비스 개선 제안",
    "기타"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "입력 오류",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "이메일 형식 오류",
        description: "올바른 이메일 주소를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/contact", formData);

      if (response.ok) {
        toast({
          title: "문의 접수 완료",
          description: "문의사항이 접수되었습니다. 영업일 기준 1-2일 내에 답변 드리겠습니다."
        });

        // 폼 초기화
        setFormData({
          name: "",
          email: "",
          category: "일반 문의",
          subject: "",
          message: ""
        });
      } else {
        throw new Error("문의 접수 실패");
      }
    } catch (error) {
      toast({
        title: "전송 실패",
        description: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">고객 지원</h1>
        <p className="text-muted-foreground">
          궁금하신 점이나 문의사항을 남겨주세요
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* 연락처 정보 */}
        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">이메일</h3>
            <p className="text-sm text-muted-foreground">support@sajufortune.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">전화</h3>
            <p className="text-sm text-muted-foreground">02-1234-5678</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">운영 시간</h3>
            <p className="text-sm text-muted-foreground">
              평일 09:00 - 18:00<br />
              (주말 및 공휴일 휴무)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 문의 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>문의하기</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">문의 유형 *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">제목 *</Label>
              <Input
                id="subject"
                type="text"
                placeholder="문의 제목을 입력하세요"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">문의 내용 *</Label>
              <Textarea
                id="message"
                placeholder="문의하실 내용을 자세히 입력해주세요"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={8}
                required
              />
            </div>

            <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground">
              <p className="mb-2">📋 <strong>문의 전 확인사항</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>FAQ 페이지에서 먼저 답변을 확인해보세요</li>
                <li>영업일 기준 1-2일 내에 이메일로 답변드립니다</li>
                <li>결제 문의 시 주문번호를 함께 기재해주세요</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  전송 중...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  문의 접수하기
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 추가 안내 */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 빠른 답변이 필요하신가요?</h3>
            <p className="text-sm text-blue-800">
              FAQ 페이지에서 자주 묻는 질문에 대한 답변을 즉시 확인하실 수 있습니다.
            </p>
            <a href="/faq" className="inline-block mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
              FAQ 보러가기 →
            </a>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-900 mb-2">📞 긴급 문의</h3>
            <p className="text-sm text-green-800">
              결제 오류나 긴급한 기술 문제는 전화로 문의하시면 더 빠르게 도와드릴 수 있습니다.
            </p>
            <p className="text-sm font-semibold text-green-600 mt-2">
              02-1234-5678 (평일 09:00-18:00)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
