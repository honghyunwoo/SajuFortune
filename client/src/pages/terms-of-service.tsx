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
            최종 수정일: 2024년 1월 15일
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

          <section className="bg-muted p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">부칙</h2>
            <p className="text-sm text-muted-foreground">
              이 약관은 2024년 1월 15일부터 시행합니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
