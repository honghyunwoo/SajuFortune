import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            개인정보처리방침
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            최종 수정일: 2024년 1월 15일
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. 개인정보 수집 및 이용 목적</h2>
            <p className="text-sm text-muted-foreground mb-2">
              사주풀이 서비스는 다음과 같은 목적으로 개인정보를 수집 및 이용합니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>사주팔자 계산 및 운세 분석 서비스 제공</li>
              <li>서비스 이용 통계 및 개선을 위한 분석</li>
              <li>고객 문의 및 불만 처리</li>
              <li>법령에 따른 의무 이행</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 수집하는 개인정보 항목</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium mb-2">필수 수집 항목:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>생년월일시 (사주 계산용)</li>
                  <li>성별 (사주 분석용)</li>
                  <li>달력 기준 (양력/음력)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">자동 수집 항목:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>IP 주소, 접속 시간, 서비스 이용 기록</li>
                  <li>브라우저 정보, 운영체제 정보</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 개인정보 보유 및 이용 기간</h2>
            <p className="text-sm text-muted-foreground mb-2">
              수집된 개인정보는 다음 기간 동안 보유 및 이용됩니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>사주 계산 데이터:</strong> 서비스 제공 완료 후 즉시 삭제</li>
              <li><strong>서비스 이용 기록:</strong> 1년 (통계 및 개선 목적)</li>
              <li><strong>후원 기록:</strong> 5년 (세법상 의무 보관)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. 개인정보 제3자 제공</h2>
            <p className="text-sm text-muted-foreground">
              사주풀이 서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. 개인정보 처리의 위탁</h2>
            <p className="text-sm text-muted-foreground mb-2">
              서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><strong>Neon Database:</strong> 데이터 저장 및 관리</li>
                <li><strong>Stripe:</strong> 결제 처리 (후원 시에만)</li>
                <li><strong>Vercel/Netlify:</strong> 웹 호스팅 서비스</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. 개인정보의 안전성 확보 조치</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>개인정보 암호화 저장 및 전송</li>
              <li>접근 권한의 제한 및 관리</li>
              <li>정기적인 보안 점검 및 업데이트</li>
              <li>개인정보 처리시스템의 접근 기록 보관</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. 이용자의 권리</h2>
            <p className="text-sm text-muted-foreground mb-2">
              이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>개인정보 처리 현황에 대한 열람 요구</li>
              <li>오류 등이 있을 경우 정정·삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. 개인정보보호책임자</h2>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>개인정보보호책임자:</strong> 사주풀이 서비스 관리자<br />
                <strong>연락처:</strong> privacy@saju-fortune.com<br />
                <strong>문의시간:</strong> 평일 09:00 ~ 18:00
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. 개인정보처리방침의 변경</h2>
            <p className="text-sm text-muted-foreground">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 
              삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
