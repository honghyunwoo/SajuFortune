import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, Shield, Scale } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Disclaimer() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            법적 면책 조항
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            서비스 이용 전 반드시 읽어주세요
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 중요 고지 */}
          <Alert className="bg-amber-50 border-amber-400 border-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-900">
              <h3 className="font-bold text-lg mb-2">⚠️ 필수 확인 사항</h3>
              <p className="mb-2">
                본 서비스는 <strong>엔터테인먼트 및 문화적 흥미를 목적</strong>으로 제공되는 사주 분석 서비스입니다.
              </p>
              <p>
                제공되는 모든 정보는 <strong>참고용</strong>이며, 인생의 중요한 결정을 내리는 유일한 근거나 주된 근거로 삼아서는 안 됩니다.
              </p>
            </AlertDescription>
          </Alert>

          {/* 1. 엔터테인먼트 목적 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">1. 엔터테인먼트 목적</h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg space-y-3">
              <p className="text-blue-900">
                <strong>서비스의 성격:</strong> 본 서비스가 제공하는 사주 분석, 운세 해석, 길흉 판단 등은
                <strong className="text-blue-700"> 재미와 문화적 흥미를 위한 콘텐츠</strong>입니다.
              </p>
              <p className="text-blue-900">
                <strong>과학적 근거 없음:</strong> 사주명리학은 전통적인 동양철학의 일부이지만,
                현대 과학적 방법론으로 검증되거나 입증된 사실이 아닙니다.
              </p>
              <p className="text-blue-900">
                <strong>미래 예측 불가:</strong> 어떠한 사주 분석도 미래를 확정적으로 예측하거나
                특정 사건의 발생을 보장할 수 없습니다.
              </p>
            </div>
          </section>

          {/* 2. 전문 조언 아님 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold">2. 의료·법률·재무 조언 아님</h2>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg space-y-4">
              <div>
                <h3 className="font-semibold text-red-900 mb-2">🏥 의료 관련</h3>
                <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                  <li>본 서비스는 <strong>의료적 진단, 치료, 처방을 제공하지 않습니다</strong></li>
                  <li>건강 문제는 반드시 <strong>의사, 한의사 등 의료 전문가</strong>와 상담하세요</li>
                  <li>질병 치료, 의약품 복용, 수술 결정 등을 본 서비스 내용에 근거하지 마세요</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-2">⚖️ 법률 관련</h3>
                <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                  <li>본 서비스는 <strong>법률적 자문, 소송 조언을 제공하지 않습니다</strong></li>
                  <li>법적 분쟁, 계약, 소송은 반드시 <strong>변호사, 법무사 등 법률 전문가</strong>와 상담하세요</li>
                  <li>권리 관계, 법적 책임 판단을 본 서비스 내용에 근거하지 마세요</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-2">💰 재무 관련</h3>
                <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                  <li>본 서비스는 <strong>재무 상담, 투자 조언을 제공하지 않습니다</strong></li>
                  <li>투자, 대출, 사업은 반드시 <strong>공인회계사, 재무설계사 등 재무 전문가</strong>와 상담하세요</li>
                  <li>재산 관리, 금융 거래 결정을 본 서비스 내용에 근거하지 마세요</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. 결정의 책임 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold">3. 인생 결정의 책임</h2>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg space-y-3">
              <p className="text-purple-900">
                <strong>자유의지와 책임:</strong> 결혼, 이혼, 진로, 직업, 이사, 사업, 투자 등
                인생의 중요한 결정은 <strong className="text-purple-700">전적으로 본인의 자유의지와 책임</strong> 하에 이루어져야 합니다.
              </p>
              <p className="text-purple-900">
                <strong>참고 자료 중 하나:</strong> 본 서비스의 사주 분석은 여러 참고 자료 중 하나일 뿐,
                <strong className="text-purple-700"> 유일한 근거나 주된 근거로 삼아서는 안 됩니다</strong>.
              </p>
              <p className="text-purple-900">
                <strong>결과에 대한 책임:</strong> 본 서비스 내용을 참고하여 내린 결정의 모든 결과
                (긍정적·부정적 결과 포함)는 <strong className="text-purple-700">이용자 본인이 전적으로 책임</strong>집니다.
              </p>
              <div className="bg-purple-100 p-3 rounded mt-3">
                <p className="text-purple-900 font-semibold text-sm">
                  💡 권장사항: 중요한 결정 전에는 가족, 친구, 해당 분야 전문가 등
                  신뢰할 수 있는 여러 조언자들과 충분히 상담하고, 객관적이고 합리적인 판단을 하시기 바랍니다.
                </p>
              </div>
            </div>
          </section>

          {/* 4. 정확도 보증 불가 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold">4. 분석 정확도 보증 불가</h2>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg space-y-3">
              <p className="text-orange-900">
                <strong>정확성 미보장:</strong> 전통적인 사주명리학 이론과 알고리즘을 사용하지만,
                <strong className="text-orange-700"> 분석 결과의 정확성, 완전성, 적합성을 보증하지 않습니다</strong>.
              </p>
              <p className="text-orange-900">
                <strong>해석의 다양성:</strong> 사주명리학은 해석자에 따라 다양한 견해가 존재하며,
                동일한 사주에 대해서도 전문가마다 다른 해석을 제시할 수 있습니다.
              </p>
              <p className="text-orange-900">
                <strong>결과 상이 가능:</strong> 본 서비스와 다른 사주 분석 서비스(오프라인 전문가 포함)의
                결과가 다를 수 있으며, 이는 정상적인 현상입니다.
              </p>
              <p className="text-orange-900">
                <strong>알고리즘 한계:</strong> 입력 정보 오류, 알고리즘 한계, 해석 차이 등으로 인한
                부정확성에 대해 서비스는 책임을 지지 않습니다.
              </p>
            </div>
          </section>

          {/* 5. 면책 사항 */}
          <section className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">5. 서비스 제공자 면책</h2>
            <div className="space-y-3 text-sm">
              <p>
                서비스 제공자는 다음의 경우에 대해 <strong>어떠한 책임도 지지 않습니다</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>이용자가 본 서비스 내용을 근거로 내린 결정으로 인한 손실, 피해, 불이익</li>
                <li>본 서비스를 의료·법률·재무 조언으로 오해하여 발생한 문제</li>
                <li>사주 분석 결과의 부정확성으로 인한 실망, 불만, 정신적 피해</li>
                <li>인생의 중요한 결정을 본 서비스 내용만을 근거로 하여 발생한 문제</li>
                <li>재산상 손실, 정신적 피해, 관계 손상, 기회 상실 등 모든 형태의 손해</li>
              </ul>
            </div>
          </section>

          {/* 동의 및 확인 */}
          <section className="border-2 border-primary p-6 rounded-lg bg-primary/5">
            <h2 className="text-2xl font-bold mb-4 text-center">서비스 이용 시 동의 사항</h2>
            <div className="space-y-2 text-sm">
              <p>본 서비스를 이용함으로써 이용자는 다음 사항에 동의합니다:</p>
              <div className="bg-background p-4 rounded space-y-2">
                <p>✅ 본 서비스가 <strong>엔터테인먼트 목적</strong>임을 이해합니다</p>
                <p>✅ 제공되는 정보가 <strong>의료·법률·재무 조언이 아님</strong>을 확인합니다</p>
                <p>✅ 인생의 중요한 결정은 <strong>본인의 책임</strong> 하에 이루어짐을 인정합니다</p>
                <p>✅ 분석 결과의 <strong>정확성이 보장되지 않음</strong>을 이해합니다</p>
                <p>✅ 상기 면책 조항에 <strong>동의하고 이를 수용</strong>합니다</p>
              </div>
            </div>
          </section>

          {/* 문의 안내 */}
          <section className="text-center bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              본 면책 조항에 대한 문의사항이 있으시면{" "}
              <a href="/contact" className="underline font-semibold text-primary hover:text-primary/80">
                고객지원
              </a>
              을 통해 연락 주시기 바랍니다.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              최종 업데이트: 2025년 10월 3일
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
