import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowLeft, Download, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ResultDisplay from '@/components/result-display';
import { generatePDF } from '@/lib/pdf-generator';
import { useToast } from '@/hooks/use-toast';

export default function Results() {
  const params = useParams();
  const readingId = params.readingId!;
  const { toast } = useToast();

  const { data: reading, isLoading, error } = useQuery({
    queryKey: ['/api/fortune-readings', readingId],
    enabled: !!readingId,
  });

  const handleDownloadPDF = async () => {
    if (!reading) return;
    
    try {
      await generatePDF(reading);
      toast({
        title: "PDF 생성 완료",
        description: "사주풀이 결과가 다운로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "PDF 생성 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" aria-label="Loading"/>
          <p className="text-muted-foreground">사주풀이 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-bold text-foreground mb-4">결과를 찾을 수 없습니다</h1>
            <p className="text-muted-foreground mb-4">
              사주풀이 결과가 존재하지 않거나 결제가 완료되지 않았을 수 있습니다.
            </p>
            <Link href="/">
              <Button>홈으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground" data-testid="link-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              새로운 분석하기
            </Link>
            <div className="flex items-center space-x-2">
              <div className="yin-yang scale-50"></div>
              <span className="text-lg font-bold text-primary">운명의 해답</span>
            </div>
            <div className="flex items-center space-x-2">
              {reading.serviceType === 'premium' && reading.isPaid && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2"
                  data-testid="button-download-pdf"
                >
                  <Download className="w-4 h-4" />
                  PDF 다운로드
                </Button>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                reading.serviceType === 'premium' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {reading.serviceType === 'premium' ? (
                  <>
                    <Crown className="w-3 h-3" />
                    프리미엄
                  </>
                ) : (
                  <>
                    <Star className="w-3 h-3" />
                    기본
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              사주풀이 결과
            </h1>
            <p className="text-muted-foreground">
              {reading.birthYear}년 {reading.birthMonth}월 {reading.birthDay}일 {reading.birthHour}시 {reading.birthMinute}분
              ({reading.gender === 'male' ? '남성' : '여성'}, {reading.calendarType === 'solar' ? '양력' : '음력'})
            </p>
          </div>

          <ResultDisplay reading={reading} />

          {/* Call to Action for Free Users */}
          {reading.serviceType === 'free' && (
            <Card className="mt-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary">
              <CardContent className="p-8 text-center">
                <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">더 자세한 분석이 필요하신가요?</h3>
                <p className="text-muted-foreground mb-6">
                  프리미엄 사주풀이로 상세한 운세, 궁합, 월별 예측, PDF 리포트까지 받아보세요
                </p>
                <Link href="/">
                  <Button size="lg" data-testid="button-upgrade-premium">
                    프리미엄으로 업그레이드하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Share and Feedback */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold mb-4">결과가 도움이 되셨나요?</h3>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" data-testid="button-share">
                결과 공유하기
              </Button>
              <Button variant="outline" data-testid="button-feedback">
                피드백 남기기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
