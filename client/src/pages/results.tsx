import { useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowLeft, Download, Star, Coffee, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ResultDisplay from '@/components/result-display';
import Donation from '@/components/donation';
import { trackPdfDownload } from '@/lib/analytics';
import { shareSajuResult } from '@/lib/kakao-share';
import { useToast } from '@/hooks/use-toast';
import SEOHead, { generateSajuResultSEO } from '@/components/seo-head';
import { useAuth } from '@/contexts/auth-context';
import type { FortuneReading } from '@shared/schema';

export default function Results() {
  const params = useParams();
  const readingId = params.readingId!;
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reading, isLoading, error } = useQuery<FortuneReading>({
    queryKey: ['/api/fortune-readings', readingId],
    enabled: !!readingId,
  });

  // 현재 사주가 저장되어 있는지 확인
  const isSaved = reading?.userId === user?.id;

  // 저장 뮤테이션
  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/fortune-readings/${readingId}/save`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('저장 실패');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fortune-readings', readingId] });
      queryClient.invalidateQueries({ queryKey: ['my-readings'] });
      toast({
        title: "저장 완료",
        description: "마이페이지에서 언제든지 다시 확인할 수 있습니다.",
      });
    },
    onError: () => {
      toast({
        title: "저장 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "로그인이 필요합니다",
        description: "사주 결과를 저장하려면 먼저 로그인해주세요.",
      });
      return;
    }
    saveMutation.mutate();
  };

  const handleDownloadPDF = async () => {
    if (!reading || !('id' in reading) || !reading.id) return;

    try {
      // PDF 생성기를 동적으로 로드 (lazy loading으로 초기 번들 크기 최적화)
      const { generatePDF } = await import('@/lib/pdf-generator');
      await generatePDF(reading as FortuneReading);

      // PDF 다운로드 추적
      trackPdfDownload({
        gender: reading.gender as 'male' | 'female',
        birthYear: reading.birthYear,
      });

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

  const handleShare = () => {
    if (!reading || !('id' in reading) || !reading.id) return;

    try {
      const genderText = reading.gender === 'male' ? '남성' : '여성';
      const birthDate = `${reading.birthYear}년 ${reading.birthMonth}월 ${reading.birthDay}일생 ${genderText}`;

      shareSajuResult({
        readingId,
        userName: genderText,
        birthDate,
        overallScore: 85, // TODO: 실제 점수 계산 필요
      });

      toast({
        title: "카카오톡 공유",
        description: "카카오톡으로 사주 결과를 공유합니다.",
      });
    } catch (error) {
      toast({
        title: "공유 실패",
        description: "카카오톡 공유 중 오류가 발생했습니다.",
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
              사주풀이 결과가 존재하지 않습니다.
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
      {/* SEO Meta Tags */}
      {reading && (
        <SEOHead
          {...generateSajuResultSEO({
            gender: reading.gender as 'male' | 'female',
            birthYear: reading.birthYear,
            birthMonth: reading.birthMonth,
            birthDay: reading.birthDay,
          })}
        />
      )}

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
              <Button
                variant={isSaved ? "secondary" : "outline"}
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-2"
                disabled={isSaved || saveMutation.isPending}
                data-testid="button-save"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    저장됨
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    {saveMutation.isPending ? '저장 중...' : '저장하기'}
                  </>
                )}
              </Button>
              <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 bg-primary text-primary-foreground">
                <Star className="w-3 h-3" />
                전체 기능 무료
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
            {reading && 'birthYear' in reading && (
              <p className="text-muted-foreground">
                {reading.birthYear}년 {reading.birthMonth}월 {reading.birthDay}일 {reading.birthHour}시 {reading.birthMinute}분
                ({reading.gender === 'male' ? '남성' : '여성'}, {reading.calendarType === 'solar' ? '양력' : '음력'})
              </p>
            )}
          </div>

          {reading && 'id' in reading && reading.id && <ResultDisplay reading={reading as FortuneReading} />}

          {/* Donation Section */}
          <div className="mt-12">
            <Donation readingId={readingId} />
          </div>

          {/* Share and Feedback */}
          <div className="mt-12 text-center">
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                <Coffee className="w-5 h-5 text-orange-500" />
                모든 기능이 무료입니다!
              </h3>
              <p className="text-sm text-muted-foreground">
                상세 분석, 궁합, 월별 운세까지 모든 기능을 무료로 제공합니다.
                <br />마음에 드셨다면 커피 한 잔으로 응원해주세요! ☕
              </p>
            </div>
            <h3 className="text-lg font-semibold mb-4">결과가 도움이 되셨나요?</h3>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center gap-2"
                data-testid="button-share"
              >
                <Share2 className="w-4 h-4" />
                카카오톡 공유
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
