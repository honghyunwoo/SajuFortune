import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            쿠키 정책
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            최종 수정일: 2024년 1월 15일
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">쿠키란 무엇인가요?</h2>
            <p className="text-sm text-muted-foreground">
              쿠키는 웹사이트가 사용자의 컴퓨터나 모바일 기기에 저장하는 작은 텍스트 파일입니다. 
              쿠키는 웹사이트가 사용자의 선호도와 설정을 기억하고, 더 나은 사용자 경험을 제공하는 데 도움을 줍니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">사주풀이 서비스에서 사용하는 쿠키</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">필수 쿠키 (Essential Cookies)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  서비스의 기본 기능을 위해 반드시 필요한 쿠키입니다.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>세션 쿠키:</strong> 로그인 상태 유지 및 보안</li>
                  <li><strong>CSRF 토큰:</strong> 보안을 위한 토큰</li>
                  <li><strong>서비스 설정:</strong> 언어, 테마 등 기본 설정</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  * 이 쿠키들은 서비스 이용에 필수적이므로 비활성화할 수 없습니다.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">성능 쿠키 (Performance Cookies)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  서비스 성능을 분석하고 개선하기 위해 사용하는 쿠키입니다.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>Google Analytics:</strong> 방문자 통계 및 사용 패턴 분석</li>
                  <li><strong>성능 모니터링:</strong> 페이지 로딩 시간 및 오류 추적</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  * 이 쿠키들은 선택사항이며, 비활성화할 수 있습니다.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">기능 쿠키 (Functional Cookies)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  사용자 경험을 향상시키기 위한 쿠키입니다.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>사주 결과 저장:</strong> 계산 결과 임시 저장</li>
                  <li><strong>사용자 선호도:</strong> 개인화된 설정 저장</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  * 이 쿠키들은 선택사항이며, 비활성화할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">쿠키 관리 방법</h2>
            <p className="text-sm text-muted-foreground mb-3">
              브라우저 설정을 통해 쿠키를 관리할 수 있습니다:
            </p>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium mb-2">Chrome</h3>
                <p className="text-sm text-muted-foreground">
                  설정 → 개인정보 보호 및 보안 → 쿠키 및 기타 사이트 데이터
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Firefox</h3>
                <p className="text-sm text-muted-foreground">
                  설정 → 개인정보 보호 및 보안 → 쿠키 및 사이트 데이터
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Safari</h3>
                <p className="text-sm text-muted-foreground">
                  환경설정 → 개인정보 보호 → 쿠키 및 웹사이트 데이터 관리
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Edge</h3>
                <p className="text-sm text-muted-foreground">
                  설정 → 쿠키 및 사이트 권한 → 쿠키 및 저장된 데이터
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">쿠키 설정 변경</h2>
            <p className="text-sm text-muted-foreground mb-3">
              사주풀이 서비스에서는 쿠키 설정을 변경할 수 있는 옵션을 제공합니다:
            </p>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">현재 쿠키 설정</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">필수 쿠키</span>
                  <span className="text-sm text-green-600">활성화됨 (필수)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">성능 쿠키</span>
                  <span className="text-sm text-blue-600">활성화됨</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">기능 쿠키</span>
                  <span className="text-sm text-blue-600">활성화됨</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">쿠키 보관 기간</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>세션 쿠키:</strong> 브라우저 종료 시 자동 삭제</li>
              <li><strong>영구 쿠키:</strong> 최대 1년 (브라우저 설정에 따라 다를 수 있음)</li>
              <li><strong>분석 쿠키:</strong> 최대 2년 (Google Analytics 기준)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제3자 쿠키</h2>
            <p className="text-sm text-muted-foreground mb-2">
              서비스는 다음과 같은 제3자 서비스의 쿠키를 사용할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Google Analytics:</strong> 웹사이트 사용 통계</li>
              <li><strong>Stripe:</strong> 결제 처리 (후원 시에만)</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              이러한 제3자 쿠키는 각 서비스의 개인정보처리방침을 따릅니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">쿠키 정책 변경</h2>
            <p className="text-sm text-muted-foreground">
              이 쿠키 정책은 필요에 따라 변경될 수 있습니다. 
              중요한 변경사항이 있을 경우 서비스 내 공지사항을 통해 알려드리겠습니다.
            </p>
          </section>

          <section className="bg-muted p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">문의사항</h2>
            <p className="text-sm text-muted-foreground">
              쿠키 정책에 대한 문의사항이 있으시면 다음으로 연락해 주세요:
            </p>
            <p className="text-sm mt-2">
              <strong>이메일:</strong> privacy@saju-fortune.com<br />
              <strong>문의시간:</strong> 평일 09:00 ~ 18:00
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
