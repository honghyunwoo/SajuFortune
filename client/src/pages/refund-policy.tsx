import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Info, Mail } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            환불 정책
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            최종 업데이트: 2025년 10월 3일
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 기본 원칙 */}
          <Alert className="bg-blue-50 border-blue-300">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <h3 className="font-bold mb-2">환불 기본 원칙</h3>
              <p>
                본 서비스는 디지털 콘텐츠의 특성상 결과 확인 후에는 환불이 제한됩니다.
                단, 기술적 오류나 서비스 제공 불가 시에는 전액 환불해 드립니다.
              </p>
            </AlertDescription>
          </Alert>

          {/* 1. 환불 가능 케이스 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              환불 가능한 경우
            </h2>
            <div className="space-y-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    1. 기술적 오류로 결과를 제공받지 못한 경우
                  </h3>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    <li>결제는 완료되었으나 사주 분석 결과가 생성되지 않은 경우</li>
                    <li>시스템 오류로 결과 페이지에 접근할 수 없는 경우</li>
                    <li>서버 장애로 서비스 이용이 불가능한 경우</li>
                  </ul>
                  <p className="mt-2 text-sm font-semibold text-green-700">
                    → 전액 환불 (100%)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    2. 중복 결제가 발생한 경우
                  </h3>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    <li>동일한 사주 분석에 대해 실수로 2회 이상 결제한 경우</li>
                    <li>중복 결제 건수만큼 전액 환불 처리</li>
                  </ul>
                  <p className="mt-2 text-sm font-semibold text-green-700">
                    → 중복 결제 금액 전액 환불
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    3. 서비스가 약속한 기능을 제공하지 못한 경우
                  </h3>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    <li>프리미엄 서비스 구매 시 안내된 분석 항목이 누락된 경우</li>
                    <li>PDF 다운로드 등 약속된 기능이 작동하지 않는 경우</li>
                  </ul>
                  <p className="mt-2 text-sm font-semibold text-green-700">
                    → 전액 환불 또는 부분 환불 (협의)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    4. 결제 후 24시간 이내 & 결과 미확인
                  </h3>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    <li>결제 완료 후 24시간 이내</li>
                    <li>사주 분석 결과를 한 번도 확인하지 않은 경우</li>
                    <li>PDF 다운로드를 하지 않은 경우</li>
                  </ul>
                  <p className="mt-2 text-sm font-semibold text-green-700">
                    → 전액 환불 (100%)
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 2. 환불 불가 케이스 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-600" />
              환불이 불가능한 경우
            </h2>
            <div className="space-y-3">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-red-900 mb-2">
                    1. 디지털 콘텐츠 특성상 환불 불가
                  </h3>
                  <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                    <li>사주 분석 결과를 이미 확인한 경우</li>
                    <li>PDF 파일을 다운로드한 경우</li>
                    <li>결제 후 24시간이 경과한 경우 (결과 확인 여부 관계없이)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-red-900 mb-2">
                    2. 단순 변심 또는 주관적 불만
                  </h3>
                  <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                    <li>"결과가 마음에 들지 않는다"는 이유</li>
                    <li>"다른 사주 서비스와 결과가 다르다"는 이유</li>
                    <li>"원하는 내용이 없다"는 주관적 판단</li>
                    <li>"생각보다 분석이 짧다"는 개인적 기대 차이</li>
                  </ul>
                  <p className="mt-2 text-sm text-red-700">
                    ※ 서비스 구매 전 무료 버전으로 충분히 확인 가능합니다
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-red-900 mb-2">
                    3. 잘못된 정보 입력
                  </h3>
                  <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                    <li>생년월일시를 잘못 입력하여 발생한 결과</li>
                    <li>양력/음력을 잘못 선택한 경우</li>
                    <li>성별을 잘못 선택한 경우</li>
                  </ul>
                  <p className="mt-2 text-sm text-red-700">
                    ※ 결제 전 입력 정보를 반드시 확인해 주세요
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 3. 환불 절차 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">환불 신청 절차</h2>
            <div className="bg-muted/30 p-6 rounded-lg space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">고객지원 문의</h3>
                  <p className="text-sm text-muted-foreground">
                    고객지원 페이지 또는 이메일(support@sajufortune.com)로 환불 요청
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">필수 정보 제공</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>주문번호 (결제 확인 이메일 참고)</li>
                    <li>결제일시</li>
                    <li>환불 사유</li>
                    <li>결제한 이메일 주소</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">환불 심사</h3>
                  <p className="text-sm text-muted-foreground">
                    영업일 기준 1-2일 내 환불 가능 여부 검토 및 안내
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">환불 처리</h3>
                  <p className="text-sm text-muted-foreground">
                    승인 시 영업일 기준 3-5일 내 결제 수단으로 환불 (카드사 정책에 따라 추가 1-2일 소요 가능)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. 환불 수수료 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">환불 수수료</h2>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>기술적 오류 및 서비스 제공 불가</span>
                    <span className="font-semibold text-green-600">수수료 없음 (100% 환불)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>중복 결제</span>
                    <span className="font-semibold text-green-600">수수료 없음 (100% 환불)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24시간 이내 & 결과 미확인</span>
                    <span className="font-semibold text-green-600">수수료 없음 (100% 환불)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>부분 환불 (협의된 경우)</span>
                    <span className="font-semibold text-amber-600">협의에 따름</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 5. 특별 안내 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">특별 안내</h2>
            <div className="space-y-3">
              <Alert>
                <Info className="h-5 w-5" />
                <AlertDescription>
                  <h3 className="font-semibold mb-1">무료 체험 권장</h3>
                  <p className="text-sm">
                    프리미엄 서비스 구매 전 무료 기본 사주 분석을 먼저 이용해보시고,
                    서비스 품질을 확인하신 후 결제하시기를 권장합니다.
                  </p>
                </AlertDescription>
              </Alert>

              <Alert>
                <Info className="h-5 w-5" />
                <AlertDescription>
                  <h3 className="font-semibold mb-1">30일 만족 보장</h3>
                  <p className="text-sm">
                    서비스 품질에 문제가 있거나 약속된 기능이 제공되지 않은 경우,
                    30일 이내 증빙 자료와 함께 문의 주시면 적극 검토하여 환불 처리해 드립니다.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </section>

          {/* 문의 안내 */}
          <section className="bg-primary/5 p-6 rounded-lg border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">환불 문의</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              환불 관련 문의사항이 있으시면 아래 방법으로 연락 주시기 바랍니다.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">이메일:</span>
                <a href="mailto:support@sajufortune.com" className="text-primary hover:underline">
                  support@sajufortune.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">고객지원:</span>
                <a href="/contact" className="text-primary hover:underline">
                  문의하기 페이지
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">운영시간:</span>
                <span>평일 09:00-18:00 (주말 및 공휴일 휴무)</span>
              </div>
            </div>
          </section>

          {/* 법적 고지 */}
          <section className="text-xs text-muted-foreground bg-muted/20 p-4 rounded">
            <h3 className="font-semibold mb-2">법적 고지</h3>
            <p className="mb-2">
              본 환불 정책은 전자상거래 등에서의 소비자보호에 관한 법률 및 관련 법령을 준수합니다.
            </p>
            <p>
              디지털 콘텐츠의 특성상 콘텐츠 이용(결과 확인)이 시작된 경우 청약철회가 제한될 수 있으며,
              이는 사전 고지 및 동의를 통해 진행됩니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
