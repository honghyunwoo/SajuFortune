import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Coffee, Heart, Star, Gift } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_dummy');

interface DonationProps {
  readingId: string;
}

interface DonationFormProps {
  readingId: string;
  amount: number;
  onSuccess: () => void;
}

const DonationForm = ({ readingId, amount, onSuccess }: DonationFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
    });

    if (error) {
      toast({
        title: "후원 실패",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "감사합니다! ☕",
        description: "따뜻한 후원에 감사드립니다. 더 좋은 서비스로 보답하겠습니다!",
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-donation">
      <div className="space-y-3">
        <div>
          <Label htmlFor="donorName" className="text-sm font-medium">
            후원자 이름 (선택사항)
          </Label>
          <Input
            id="donorName"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="익명으로 남기려면 비워두세요"
            data-testid="input-donor-name"
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-sm font-medium">
            응원 메시지 (선택사항)
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="따뜻한 메시지를 남겨주세요 😊"
            rows={3}
            data-testid="textarea-message"
          />
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg">
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || isProcessing}
        data-testid="button-donate"
      >
        {isProcessing ? (
          <>
            <div className="loading-spinner mr-3"></div>
            후원 처리 중...
          </>
        ) : (
          <>
            <Coffee className="w-4 h-4 mr-2" />
            {amount.toLocaleString()}원 후원하기
          </>
        )}
      </Button>

      <div className="text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center">
          <Heart className="w-3 h-3 mr-1 text-red-500" />
          <span>안전한 결제 시스템으로 보호됩니다</span>
        </div>
      </div>
    </form>
  );
};

export default function Donation({ readingId }: DonationProps) {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const donationAmounts = [
    { amount: 3000, label: '커피 한 잔', icon: '☕', description: '따뜻한 응원' },
    { amount: 5000, label: '케이크 조각', icon: '🍰', description: '달콤한 후원' },
    { amount: 10000, label: '브런치 세트', icon: '🥐', description: '든든한 지원' }
  ];

  const createDonationMutation = useMutation({
    mutationFn: async (data: { amount: number; donorName?: string; message?: string }) => {
      const response = await apiRequest("POST", "/api/create-donation", {
        readingId,
        ...data
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setIsDialogOpen(true);
    },
    onError: (error: Error) => {
      toast({
        title: "오류 발생",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDonationClick = (amount: number) => {
    setSelectedAmount(amount);
    createDonationMutation.mutate({ amount });
  };

  const handleDonationSuccess = () => {
    setIsDialogOpen(false);
    setClientSecret('');
    setSelectedAmount(null);
    
    // Show special thank you message
    toast({
      title: "🎉 후원 완료!",
      description: "따뜻한 마음에 감사드립니다. 여러분의 응원이 큰 힘이 됩니다!",
    });
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-2 border-orange-200/50 dark:border-orange-800/50">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Coffee className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              커피 한 잔 후원하기 ☕
            </h3>
            <p className="text-muted-foreground">
              무료 사주풀이가 도움이 되셨나요? 따뜻한 후원으로 서비스 발전에 힘을 주세요!
              <br />
              <span className="text-sm">여러분의 작은 응원이 더 나은 서비스를 만듭니다 💝</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {donationAmounts.map((donation, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className="h-auto p-4 flex-col space-y-2 border-2 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
                onClick={() => handleDonationClick(donation.amount)}
                disabled={createDonationMutation.isPending}
                data-testid={`button-donate-${donation.amount}`}
              >
                <div className="text-2xl">{donation.icon}</div>
                <div className="font-semibold">{donation.label}</div>
                <div className="text-sm text-muted-foreground">{donation.description}</div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {donation.amount.toLocaleString()}원
                </Badge>
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              <span>선택적 후원</span>
            </div>
            <div className="flex items-center">
              <Gift className="w-4 h-4 mr-1 text-purple-500" />
              <span>감사 메시지</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              <span>서비스 개선</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/50 dark:bg-black/10 rounded-lg border border-orange-200/50">
            <p className="text-xs text-muted-foreground">
              <Coffee className="w-3 h-3 inline mr-1" />
              모든 사주풀이 기능은 완전 무료입니다. 후원은 선택사항이며, 
              더 좋은 서비스 개발과 운영에 사용됩니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Donation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <div className="text-center mb-4">
            <Coffee className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">후원해주셔서 감사합니다!</h3>
            <p className="text-sm text-muted-foreground">
              {selectedAmount?.toLocaleString()}원 후원
            </p>
          </div>
          
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <DonationForm
                readingId={readingId}
                amount={selectedAmount || 0}
                onSuccess={handleDonationSuccess}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}