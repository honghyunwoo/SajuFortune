/**
 * 궁합 분석 페이지
 * 두 사람의 사주를 입력받아 궁합 결과 표시
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
import { Heart, ArrowLeft, Download, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/seo-head';

interface PersonInfo {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  isLeapMonth: boolean;
}

interface CompatibilityResult {
  overallScore: number;
  scores: {
    heavenlyStemScore: number;
    earthlyBranchScore: number;
    elementScore: number;
    geokgukScore: number;
  };
  analysis: {
    strengths: string[];
    weaknesses: string[];
    advice: string[];
  };
}

export default function Compatibility() {
  const { toast } = useToast();
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [person1, setPerson1] = useState<PersonInfo>({
    name: '',
    gender: 'male',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 0,
    birthMinute: 0,
    isLeapMonth: false,
  });
  const [person2, setPerson2] = useState<PersonInfo>({
    name: '',
    gender: 'female',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 0,
    birthMinute: 0,
    isLeapMonth: false,
  });
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const calculateMutation = useMutation({
    mutationFn: async (data: { person1: PersonInfo; person2: PersonInfo }) => {
      const response = await fetch('/api/compatibility', {
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
    },
    onError: () => {
      toast({
        title: '오류',
        description: '궁합 계산 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!person1.name || !person2.name) {
      toast({
        title: '입력 오류',
        description: '두 사람의 이름을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    calculateMutation.mutate({ person1, person2 });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '매우 좋음';
    if (score >= 60) return '좋음';
    if (score >= 40) return '보통';
    return '주의 필요';
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="사주 궁합 분석 - 운명의 해답"
        description="두 사람의 사주팔자를 비교하여 정확한 궁합 점수와 상세 분석을 제공합니다."
        keywords={['사주 궁합', '궁합 보기', '천간 궁합', '지지 궁합', '육합', '삼합', '육충']}
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
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">💑 사주 궁합 분석</h1>
            <p className="text-muted-foreground text-lg">
              두 사람의 사주를 비교하여 천간, 지지, 오행 궁합을 종합 분석합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Person 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  첫 번째 사람 정보
                </CardTitle>
                <CardDescription>정확한 생년월일시를 입력해주세요.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="person1-name">이름 *</Label>
                  <Input
                    id="person1-name"
                    value={person1.name}
                    onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
                    placeholder="홍길동"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person1-gender">성별</Label>
                  <Select
                    value={person1.gender}
                    onValueChange={(value: 'male' | 'female') =>
                      setPerson1({ ...person1, gender: value })
                    }
                  >
                    <SelectTrigger id="person1-gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person1-year">생년</Label>
                  <Input
                    id="person1-year"
                    type="number"
                    min={1900}
                    max={2024}
                    value={person1.birthYear}
                    onChange={(e) => setPerson1({ ...person1, birthYear: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person1-month">월</Label>
                  <Input
                    id="person1-month"
                    type="number"
                    min={1}
                    max={12}
                    value={person1.birthMonth}
                    onChange={(e) => setPerson1({ ...person1, birthMonth: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person1-day">일</Label>
                  <Input
                    id="person1-day"
                    type="number"
                    min={1}
                    max={31}
                    value={person1.birthDay}
                    onChange={(e) => setPerson1({ ...person1, birthDay: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person1-hour">시</Label>
                  <Input
                    id="person1-hour"
                    type="number"
                    min={0}
                    max={23}
                    value={person1.birthHour}
                    onChange={(e) => setPerson1({ ...person1, birthHour: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Person 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  두 번째 사람 정보
                </CardTitle>
                <CardDescription>정확한 생년월일시를 입력해주세요.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="person2-name">이름 *</Label>
                  <Input
                    id="person2-name"
                    value={person2.name}
                    onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
                    placeholder="김영희"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person2-gender">성별</Label>
                  <Select
                    value={person2.gender}
                    onValueChange={(value: 'male' | 'female') =>
                      setPerson2({ ...person2, gender: value })
                    }
                  >
                    <SelectTrigger id="person2-gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person2-year">생년</Label>
                  <Input
                    id="person2-year"
                    type="number"
                    min={1900}
                    max={2024}
                    value={person2.birthYear}
                    onChange={(e) => setPerson2({ ...person2, birthYear: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person2-month">월</Label>
                  <Input
                    id="person2-month"
                    type="number"
                    min={1}
                    max={12}
                    value={person2.birthMonth}
                    onChange={(e) => setPerson2({ ...person2, birthMonth: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person2-day">일</Label>
                  <Input
                    id="person2-day"
                    type="number"
                    min={1}
                    max={31}
                    value={person2.birthDay}
                    onChange={(e) => setPerson2({ ...person2, birthDay: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person2-hour">시</Label>
                  <Input
                    id="person2-hour"
                    type="number"
                    min={0}
                    max={23}
                    value={person2.birthHour}
                    onChange={(e) => setPerson2({ ...person2, birthHour: parseInt(e.target.value) })}
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
                {calculateMutation.isPending ? '계산 중...' : '궁합 분석하기'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Result */}
      {step === 'result' && result && (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {person1.name} ❤️ {person2.name}
            </h1>
            <p className="text-muted-foreground">사주 궁합 분석 결과</p>
          </div>

          {/* Overall Score */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">종합 궁합 점수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore}점
                </div>
                <Badge variant="secondary" className="mt-2">
                  {getScoreLabel(result.overallScore)}
                </Badge>
              </div>
              <Progress value={result.overallScore} className="h-4" />
            </CardContent>
          </Card>

          {/* Detailed Scores */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>세부 점수</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>천간 궁합</span>
                  <span className="font-bold">{result.scores.heavenlyStemScore}점</span>
                </div>
                <Progress value={result.scores.heavenlyStemScore} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>지지 궁합</span>
                  <span className="font-bold">{result.scores.earthlyBranchScore}점</span>
                </div>
                <Progress value={result.scores.earthlyBranchScore} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>오행 균형</span>
                  <span className="font-bold">{result.scores.elementScore}점</span>
                </div>
                <Progress value={result.scores.elementScore} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>격국 보완성</span>
                  <span className="font-bold">{result.scores.geokgukScore}점</span>
                </div>
                <Progress value={result.scores.geokgukScore} />
              </div>
            </CardContent>
          </Card>

          {/* Analysis */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">💚 강점</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex gap-2">
                      <span>✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">⚠️ 약점</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.analysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex gap-2">
                      <span>!</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Advice */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>💡 조언</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.analysis.advice.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span>→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStep('input')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              다시 분석하기
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              PDF 다운로드
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
