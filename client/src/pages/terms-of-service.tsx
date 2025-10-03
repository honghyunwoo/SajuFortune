import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            서비스 이용약관
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            최종 수정일: 2025년 10월 3일
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">제1조 (목적)</h2>
            <p className="text-sm text-muted-foreground">
              이 약관은 사주풀이 서비스(이하 "서비스")가 제공하는 온라인 사주 분석 서비스의 이용과 관련하여 
              서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제2조 (정의)</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>"서비스"</strong>란 사주팔자 계산 및 운세 분석을 제공하는 온라인 플랫폼을 의미합니다.</li>
              <li><strong>"이용자"</strong>란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 의미합니다.</li>
              <li><strong>"콘텐츠"</strong>란 이용자가 서비스를 이용하면서 생성한 사주 분석 결과를 의미합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제3조 (약관의 효력 및 변경)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
            </p>
            <p className="text-sm text-muted-foreground">
              2. 서비스는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 
              변경된 약관은 서비스 화면에 공지함으로써 효력이 발생합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제4조 (서비스의 제공)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              서비스는 다음과 같은 업무를 수행합니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>사주팔자 계산 및 분석 서비스</li>
              <li>운세 해석 및 조언 서비스</li>
              <li>관련 정보 제공 서비스</li>
              <li>기타 서비스가 정하는 업무</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제5조 (서비스의 중단)</h2>
            <p className="text-sm text-muted-foreground">
              서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 
              서비스의 제공을 일시적으로 중단할 수 있으며, 새로운 서비스로의 교체 시에는 그 사유를 이용자에게 통지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제6조 (이용자의 의무)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              이용자는 다음 행위를 하여서는 안 됩니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>신청 또는 변경 시 허위내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>서비스에 게시된 정보의 변경</li>
              <li>서비스가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>서비스 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>서비스 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제7조 (서비스의 무료 제공)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              1. 서비스는 기본적으로 무료로 제공됩니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              2. 서비스는 이용자에게 후원을 요청할 수 있으며, 후원은 선택사항입니다.
            </p>
            <p className="text-sm text-muted-foreground">
              3. 후원은 서비스 개선 및 유지보수를 위한 목적으로 사용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제8조 (개인정보보호)</h2>
            <p className="text-sm text-muted-foreground">
              서비스는 관련법령이 정하는 바에 따라서 이용자의 개인정보를 보호하기 위해 노력합니다. 
              개인정보의 보호 및 사용에 대해서는 관련법령 및 서비스의 개인정보처리방침이 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제9조 (서비스 제공자의 의무)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              서비스는 다음과 같은 의무를 가집니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하는데 최선을 다하여야 합니다.</li>
              <li>이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 구축하여야 합니다.</li>
              <li>이용자로부터 제기되는 의견이나 불만이 정당하다고 객관적으로 인정될 경우에는 적절한 절차를 거쳐 즉시 처리하여야 합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제10조 (손해배상)</h2>
            <p className="text-sm text-muted-foreground">
              서비스는 무료로 제공되는 서비스와 관련하여 이용자에게 어떠한 손해가 발생하더라도 
              동 손해가 서비스의 중대한 과실에 의한 경우를 제외하고는 이에 대하여 책임을 부담하지 아니합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제11조 (면책조항)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              1. 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              2. 서비스는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              3. 서비스는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며 그 밖에 서비스를 통하여 얻은 자료로 인한 손해에 관하여는 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제12조 (분쟁해결)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              1. 서비스는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
            </p>
            <p className="text-sm text-muted-foreground">
              2. 서비스와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제13조 (준거법 및 관할법원)</h2>
            <p className="text-sm text-muted-foreground">
              이 약관의 해석 및 서비스와 이용자 간의 분쟁에 대하여는 대한민국의 법을 적용하며,
              본 분쟁으로 인한 소송은 민사소송법상의 관할법원에 제기합니다.
            </p>
          </section>

          <section className="border-l-4 border-amber-500 pl-4">
            <h2 className="text-xl font-semibold mb-3 text-amber-700">제14조 (서비스의 성격 및 목적)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              1. 본 서비스는 <strong>엔터테인먼트 및 문화적 흥미를 목적</strong>으로 제공되는 사주 분석 서비스입니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              2. 서비스가 제공하는 모든 사주 분석, 운세 해석, 길흉 판단 등의 콘텐츠는
              <strong>오락적·참고적 성격</strong>을 가지며, 과학적·객관적 사실이 아닙니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              3. 이용자는 본 서비스가 제공하는 정보를 <strong>재미와 흥미를 위한 참고 자료</strong>로만 활용해야 하며,
              이를 절대적 진리나 확정적 미래 예측으로 받아들여서는 안 됩니다.
            </p>
            <p className="text-sm text-muted-foreground">
              4. 서비스는 이용자가 본 서비스의 콘텐츠를 엔터테인먼트 목적 이외의 용도로 사용함으로써 발생하는
              어떠한 결과에 대해서도 책임을 지지 않습니다.
            </p>
          </section>

          <section className="border-l-4 border-red-500 pl-4">
            <h2 className="text-xl font-semibold mb-3 text-red-700">제15조 (의료·법률·재무 조언 면책)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              1. 본 서비스가 제공하는 모든 콘텐츠는 <strong>의료적 조언, 법률적 자문, 재무적 상담을 제공하지 않습니다</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              2. 건강, 질병, 치료, 의약품 복용 등 의료 관련 사항은 반드시 <strong>의사, 한의사 등 면허를 보유한
              의료 전문가</strong>와 상담해야 하며, 본 서비스의 내용을 의료적 판단의 근거로 사용해서는 안 됩니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              3. 법적 분쟁, 소송, 계약, 권리 관계 등 법률 관련 사항은 반드시 <strong>변호사, 법무사 등
              법률 전문가</strong>와 상담해야 하며, 본 서비스의 내용을 법률적 판단의 근거로 사용해서는 안 됩니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              4. 투자, 대출, 사업, 재산 관리 등 재무 관련 사항은 반드시 <strong>공인회계사, 재무설계사 등
              재무 전문가</strong>와 상담해야 하며, 본 서비스의 내용을 재무적 판단의 근거로 사용해서는 안 됩니다.
            </p>
            <p className="text-sm text-muted-foreground">
              5. 서비스는 이용자가 본 서비스의 콘텐츠를 의료·법률·재무 조언으로 오해하여 발생하는
              모든 손해에 대해 책임을 지지 않습니다.
            </p>
          </section>

          <section className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">제16조 (인생 결정 및 선택의 책임)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              1. 결혼, 이혼, 진로, 직업, 이사, 사업 시작, 투자 등 <strong>인생의 중요한 결정과 선택은
              전적으로 이용자 본인의 자유의지와 책임</strong> 하에 이루어져야 합니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              2. 본 서비스가 제공하는 사주 분석 결과나 운세 해석을 <strong>인생의 중요한 결정을 내리는
              유일한 근거나 주된 근거로 삼아서는 안 됩니다</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              3. 이용자가 본 서비스의 콘텐츠를 참고하여 내린 결정으로 인해 발생하는 모든 결과
              (긍정적 결과 및 부정적 결과 포함)는 <strong>이용자 본인이 전적으로 책임</strong>져야 합니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              4. 서비스는 이용자의 인생 결정으로 인한 재산상 손실, 정신적 피해, 관계 손상,
              기회 상실 등 어떠한 손해에 대해서도 책임을 지지 않습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              5. 중요한 결정을 내리기 전에는 <strong>가족, 친구, 전문가 등 신뢰할 수 있는 조언자들과
              충분히 상담</strong>하고, 객관적이고 합리적인 판단을 하실 것을 권장합니다.
            </p>
          </section>

          <section className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-xl font-semibold mb-3 text-purple-700">제17조 (분석 정확도 및 결과 보증 불가)</h2>
            <p className="text-sm text-muted-foreground mb-2">
              1. 본 서비스는 전통적인 사주명리학 이론과 알고리즘을 기반으로 하지만,
              <strong>분석 결과의 정확성, 완전성, 적합성을 보증하지 않습니다</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              2. 사주명리학은 <strong>해석자에 따라 다양한 견해</strong>가 존재할 수 있으며,
              동일한 사주에 대해서도 전문가마다 다른 해석을 제시할 수 있습니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              3. 본 서비스가 제공하는 미래 예측, 운세 분석, 길흉 판단 등은
              <strong>어떠한 결과나 사건의 발생을 보장하거나 약속하지 않습니다</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              4. 동일한 생년월일시에 대해 본 서비스와 다른 사주 분석 서비스(오프라인 전문가 포함)의
              결과가 상이할 수 있으며, 이는 정상적인 현상입니다.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              5. 서비스는 입력 정보의 오류, 알고리즘의 한계, 해석의 차이 등으로 인해
              발생할 수 있는 <strong>분석 결과의 부정확성에 대해 책임을 지지 않습니다</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
              6. 이용자는 본 서비스의 결과를 <strong>절대적이고 확정적인 정보가 아닌,
              여러 참고 자료 중 하나</strong>로만 받아들여야 합니다.
            </p>
          </section>

          <section className="bg-muted p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">부칙</h2>
            <p className="text-sm text-muted-foreground mb-2">
              1. 이 약관은 2024년 1월 15일부터 시행합니다.
            </p>
            <p className="text-sm text-muted-foreground">
              2. 제14조~제17조는 2025년 10월 3일부터 추가 시행합니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
