import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lock } from "lucide-react";
import type { CreateFortuneReading } from "@shared/schema";

export default function FortuneForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateFortuneReading>({
    gender: "male",
    birthYear: 2000,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    calendarType: "solar",
    serviceType: "free"
  });

  const createReadingMutation = useMutation({
    mutationFn: async (data: CreateFortuneReading) => {
      const response = await apiRequest("POST", "/api/fortune-readings", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.needsPayment) {
        setLocation(`/checkout/${data.readingId}`);
      } else {
        setLocation(`/results/${data.readingId}`);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "오류 발생",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReadingMutation.mutate(formData);
  };

  const updateFormData = (field: keyof CreateFortuneReading, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-fortune-reading">
          {/* Gender Selection */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-3">성별</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => updateFormData("gender", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" data-testid="radio-male" />
                <Label htmlFor="male">남성</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" data-testid="radio-female" />
                <Label htmlFor="female">여성</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Birth Date */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-3">생년월일</Label>
            <div className="flex space-x-2">
              <Select
                value={formData.birthYear.toString()}
                onValueChange={(value) => updateFormData("birthYear", parseInt(value))}
              >
                <SelectTrigger className="flex-1" data-testid="select-year">
                  <SelectValue placeholder="년도" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 75 }, (_, i) => 2024 - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={formData.birthMonth.toString()}
                onValueChange={(value) => updateFormData("birthMonth", parseInt(value))}
              >
                <SelectTrigger className="flex-1" data-testid="select-month">
                  <SelectValue placeholder="월" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <SelectItem key={month} value={month.toString()}>
                      {month}월
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={formData.birthDay.toString()}
                onValueChange={(value) => updateFormData("birthDay", parseInt(value))}
              >
                <SelectTrigger className="flex-1" data-testid="select-day">
                  <SelectValue placeholder="일" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}일
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Birth Time */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-3">
              태어난 시간
              <span className="text-sm text-muted-foreground ml-1">(모르면 12:00으로 설정)</span>
            </Label>
            <div className="flex space-x-2">
              <Select
                value={formData.birthHour.toString()}
                onValueChange={(value) => updateFormData("birthHour", parseInt(value))}
              >
                <SelectTrigger className="flex-1" data-testid="select-hour">
                  <SelectValue placeholder="시" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour.toString().padStart(2, '0')}시
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={formData.birthMinute.toString()}
                onValueChange={(value) => updateFormData("birthMinute", parseInt(value))}
              >
                <SelectTrigger className="flex-1" data-testid="select-minute">
                  <SelectValue placeholder="분" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">00분</SelectItem>
                  <SelectItem value="15">15분</SelectItem>
                  <SelectItem value="30">30분</SelectItem>
                  <SelectItem value="45">45분</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calendar Type */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-3">달력 기준</Label>
            <RadioGroup
              value={formData.calendarType}
              onValueChange={(value) => updateFormData("calendarType", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solar" id="solar" data-testid="radio-solar" />
                <Label htmlFor="solar">양력 (추천)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lunar" id="lunar" data-testid="radio-lunar" />
                <Label htmlFor="lunar">음력</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Service Selection */}
          <div className="border-t border-border pt-6">
            <Label className="block text-sm font-medium text-foreground mb-4">분석 서비스 선택</Label>
            <RadioGroup
              value={formData.serviceType}
              onValueChange={(value) => updateFormData("serviceType", value)}
              className="space-y-3"
            >
              <div className="flex items-start p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/5 transition-colors">
                <RadioGroupItem value="free" id="free" className="mt-1 mr-3" data-testid="radio-free" />
                <Label htmlFor="free" className="flex-1 cursor-pointer">
                  <div className="font-medium">무료 기본 분석</div>
                  <div className="text-sm text-muted-foreground">기본 성격 분석 + 오늘의 운세</div>
                </Label>
                <div className="text-primary font-bold">무료</div>
              </div>
              
              <div className="flex items-start p-4 border-2 border-primary rounded-lg cursor-pointer bg-primary/5 transition-colors">
                <RadioGroupItem value="premium" id="premium" className="mt-1 mr-3" data-testid="radio-premium" />
                <Label htmlFor="premium" className="flex-1 cursor-pointer">
                  <div className="font-medium flex items-center">
                    프리미엄 상세 분석
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">인기</span>
                  </div>
                  <div className="text-sm text-muted-foreground">상세 운세 + 궁합 + 직업운 + PDF</div>
                </Label>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground line-through">49,000원</div>
                  <div className="text-primary font-bold">29,000원</div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={createReadingMutation.isPending}
            data-testid="button-submit-fortune"
          >
            {createReadingMutation.isPending ? (
              <>
                <div className="loading-spinner mr-3"></div>
                분석 중...
              </>
            ) : (
              formData.serviceType === "premium" ? "프리미엄 분석 시작하기" : "무료 분석 시작하기"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <Lock className="w-4 h-4 mr-1 inline" />
            개인정보는 안전하게 보호되며, 분석 목적으로만 사용됩니다
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
