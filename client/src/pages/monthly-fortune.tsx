/**
 * 월별 운세 페이지
 * 12개월 운세 타임라인 및 상세 분석
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ArrowLeft, TrendingUp, TrendingDown, Minus, Heart, DollarSign, Activity, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/seo-head';

interface BirthData {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
}

interface MonthFortune {
  month: number;
  year: number;
  overallScore: number;
  scores: {
    love: number;
    wealth: number;
    health: number;
    career: number;
  };
  highlights: string[];
  warnings: string[];
  advice: string;
  luckyDay: number;
  luckyColor: string;
  luckyDirection: string;
  sibiunseong: string;
}

interface MonthlyFortuneResult {
  months: MonthFortune[];
  currentMonthIndex: number;
  summary: {
    bestMonth: number;
    worstMonth: number;
    averageScore: number;
    trend: 'rising' | 'stable' | 'declining';
  };
}

export default function MonthlyFortune() {
  const { toast } = useToast();
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [birthData, setBirthData] = useState<BirthData>({
    name: '',
    gender: 'male',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 0,
  });
  const [result, setResult] = useState<MonthlyFortuneResult | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const calculateMutation = useMutation({
    mutationFn: async (data: BirthData) => {
      const response = await fetch('/api/monthly-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('계산 실패');
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setStep('result');
      setSelectedMonth(data.currentMonthIndex);
    },
    onError: () => {
      toast({
        title: '오류',
        description: '월별 운세 계산 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthData.name) {
      toast({
        title: '입력 오류',
        description: '이름을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    calculateMutation.mutate(birthData);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: 'rising' | 'stable' | 'declining') => {
    if (trend === 'rising') return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (trend === 'declining') return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="월별 운세 - 운명의 해답"
        description="12개월 운세를 한눈에! 연애, 재물, 건강, 직업운을 월별로 확인하세요."
        keywords={['월별 운세', '12개월 운세', '이번 달 운세', '다음 달 운세', '운세 달력']}
      />

      {/* Header */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <div className="yin-yang scale-50"></div>
                <span className="text-xl font-bold text-primary">운명의 해답</span>
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Input Form */}
      {step === 'input' && (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Calendar className="w-12 h-12 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">📅 월별 운세</h1>
            <p className="text-muted-foreground text-lg">
              12개월 운세를 한눈에 확인하고 최적의 시기를 찾아보세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>생년월일 정보</CardTitle>
                <CardDescription>정확한 생년월일시를 입력해주세요.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={birthData.name}
                    onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                    placeholder="홍길동"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">성별</Label>
                  <Select
                    value={birthData.gender}
                    onValueChange={(value: 'male' | 'female') =>
                      setBirthData({ ...birthData, gender: value })
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">생년</Label>
                  <Input
                    id="year"
                    type="number"
                    min={1900}
                    max={2024}
                    value={birthData.birthYear}
                    onChange={(e) => setBirthData({ ...birthData, birthYear: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">월</Label>
                  <Input
                    id="month"
                    type="number"
                    min={1}
                    max={12}
                    value={birthData.birthMonth}
                    onChange={(e) => setBirthData({ ...birthData, birthMonth: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day">일</Label>
                  <Input
                    id="day"
                    type="number"
                    min={1}
                    max={31}
                    value={birthData.birthDay}
                    onChange={(e) => setBirthData({ ...birthData, birthDay: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hour">시</Label>
                  <Input
                    id="hour"
                    type="number"
                    min={0}
                    max={23}
                    value={birthData.birthHour}
                    onChange={(e) => setBirthData({ ...birthData, birthHour: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button type="button" variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  돌아가기
                </Button>
              </Link>
              <Button type="submit" size="lg" disabled={calculateMutation.isPending}>
                {calculateMutation.isPending ? '계산 중...' : '월별 운세 보기'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Result */}
      {step === 'result' && result && (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">{birthData.name}님의 월별 운세</h1>
            <p className="text-muted-foreground">12개월 운세를 확인하세요</p>
          </div>

          {/* Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                요약
                {getTrendIcon(result.summary.trend)}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">평균 점수</div>
                <div className={`text-2xl font-bold ${getScoreColor(result.summary.averageScore)}`}>
                  {result.summary.averageScore}점
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">최고의 달</div>
                <div className="text-2xl font-bold text-green-600">
                  {result.summary.bestMonth}월
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">주의해야 할 달</div>
                <div className="text-2xl font-bold text-red-600">
                  {result.summary.worstMonth}월
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">추세</div>
                <div className="text-2xl font-bold">
                  {result.summary.trend === 'rising' && '상승'}
                  {result.summary.trend === 'stable' && '안정'}
                  {result.summary.trend === 'declining' && '하강'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>12개월 타임라인</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {result.months.map((month, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMonth(index)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedMonth === index
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{month.month}월</div>
                    <div className={`text-lg font-bold ${getScoreColor(month.overallScore)}`}>
                      {month.overallScore}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Month Detail */}
          {result.months[selectedMonth] && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {result.months[selectedMonth].year}년 {result.months[selectedMonth].month}월 상세 운세
                </CardTitle>
                <CardDescription>
                  십이운성: {result.months[selectedMonth].sibiunseong}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scores */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">종합</TabsTrigger>
                    <TabsTrigger value="love">연애</TabsTrigger>
                    <TabsTrigger value="wealth">재물</TabsTrigger>
                    <TabsTrigger value="health">건강</TabsTrigger>
                    <TabsTrigger value="career">직업</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-4 mt-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          연애운
                        </span>
                        <span className="font-bold">{result.months[selectedMonth].scores.love}점</span>
                      </div>
                      <Progress value={result.months[selectedMonth].scores.love} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          재물운
                        </span>
                        <span className="font-bold">{result.months[selectedMonth].scores.wealth}점</span>
                      </div>
                      <Progress value={result.months[selectedMonth].scores.wealth} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          건강운
                        </span>
                        <span className="font-bold">{result.months[selectedMonth].scores.health}점</span>
                      </div>
                      <Progress value={result.months[selectedMonth].scores.health} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          직업운
                        </span>
                        <span className="font-bold">{result.months[selectedMonth].scores.career}점</span>
                      </div>
                      <Progress value={result.months[selectedMonth].scores.career} />
                    </div>
                  </TabsContent>
                  <TabsContent value="love">
                    <div className="text-center py-8">
                      <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.months[selectedMonth].scores.love)}`}>
                        {result.months[selectedMonth].scores.love}점
                      </div>
                      <p className="text-muted-foreground">연애운 점수</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="wealth">
                    <div className="text-center py-8">
                      <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.months[selectedMonth].scores.wealth)}`}>
                        {result.months[selectedMonth].scores.wealth}점
                      </div>
                      <p className="text-muted-foreground">재물운 점수</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="health">
                    <div className="text-center py-8">
                      <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.months[selectedMonth].scores.health)}`}>
                        {result.months[selectedMonth].scores.health}점
                      </div>
                      <p className="text-muted-foreground">건강운 점수</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="career">
                    <div className="text-center py-8">
                      <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.months[selectedMonth].scores.career)}`}>
                        {result.months[selectedMonth].scores.career}점
                      </div>
                      <p className="text-muted-foreground">직업운 점수</p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Highlights & Warnings */}
                <div className="grid gap-4 md:grid-cols-2">
                  {result.months[selectedMonth].highlights.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-green-600 mb-2">✨ 긍정적 요소</h3>
                      <ul className="space-y-1">
                        {result.months[selectedMonth].highlights.map((item, i) => (
                          <li key={i} className="text-sm">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.months[selectedMonth].warnings.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-orange-600 mb-2">⚠️ 주의사항</h3>
                      <ul className="space-y-1">
                        {result.months[selectedMonth].warnings.map((item, i) => (
                          <li key={i} className="text-sm">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Advice */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">💡 조언</h3>
                  <p>{result.months[selectedMonth].advice}</p>
                </div>

                {/* Lucky Info */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">길일</div>
                    <div className="font-bold">{result.months[selectedMonth].luckyDay}일</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">행운의 색</div>
                    <div className="font-bold">{result.months[selectedMonth].luckyColor}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">행운의 방향</div>
                    <div className="font-bold">{result.months[selectedMonth].luckyDirection}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setStep('input')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              다시 보기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
