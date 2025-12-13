import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, LogOut, Calendar, Star, Trash2 } from "lucide-react";
import SEOHead from "@/components/seo-head";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface SavedReading {
  id: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: string;
  createdAt: string;
}

export default function MyPage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // 저장된 사주 목록 조회
  const { data: savedReadings, isLoading: readingsLoading, refetch } = useQuery<SavedReading[]>({
    queryKey: ["my-readings"],
    queryFn: async () => {
      const response = await fetch("/api/users/me/readings", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("저장된 사주 목록을 불러올 수 없습니다");
      }
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "로그아웃 완료",
        description: "다음에 또 만나요!",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReading = async (readingId: string) => {
    if (!confirm("이 사주 기록을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/fortune-readings/${readingId}/unsave`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("삭제 실패");

      toast({
        title: "삭제 완료",
        description: "사주 기록이 삭제되었습니다.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google";
      case "kakao":
        return "카카오";
      case "naver":
        return "네이버";
      default:
        return provider;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="마이페이지 | 운명의 해답"
        description="나의 사주 분석 결과를 확인하세요."
      />

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                홈으로
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="yin-yang scale-50"></div>
              <span className="text-xl font-bold text-primary">운명의 해답</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.profileImage} alt={user.username} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user.username}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {user.email}
                  <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                    {getProviderName(user.authProvider)}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Saved Readings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              저장된 사주 분석
            </CardTitle>
            <CardDescription>
              저장한 사주 분석 결과를 언제든지 다시 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {readingsLoading ? (
              <div className="flex justify-center py-8">
                <div className="loading-spinner" aria-label="Loading" />
              </div>
            ) : savedReadings && savedReadings.length > 0 ? (
              <div className="space-y-4">
                {savedReadings.map((reading) => (
                  <div
                    key={reading.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {reading.birthYear}년 {reading.birthMonth}월 {reading.birthDay}일{" "}
                          {reading.birthHour}시생
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reading.gender === "male" ? "남성" : "여성"} •{" "}
                          {new Date(reading.createdAt).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/results/${reading.id}`}>
                        <Button variant="outline" size="sm">
                          결과 보기
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReading(reading.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">
                  아직 저장된 사주 분석이 없습니다
                </p>
                <Link href="/">
                  <Button>사주 분석하기</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
