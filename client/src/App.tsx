import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { trackPageView } from "@/lib/analytics";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// 인증 관련 페이지
const Login = lazy(() => import("@/pages/login"));
const MyPage = lazy(() => import("@/pages/mypage"));

// 무거운 페이지들은 lazy loading으로 최적화
const Results = lazy(() => import("@/pages/results"));
const Checkout = lazy(() => import("@/pages/checkout"));
const Compatibility = lazy(() => import("@/pages/compatibility"));
const MonthlyFortune = lazy(() => import("@/pages/monthly-fortune"));
const Premium = lazy(() => import("@/pages/premium"));
const BlogIndex = lazy(() => import("@/pages/blog/index"));
const BlogPost = lazy(() => import("@/pages/blog/post"));

// 법적 문서들은 lazy loading (자주 방문하지 않음)
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const CookiePolicy = lazy(() => import("@/pages/cookie-policy"));
const Disclaimer = lazy(() => import("@/pages/disclaimer"));
const FAQ = lazy(() => import("@/pages/faq"));
const Contact = lazy(() => import("@/pages/contact"));
const RefundPolicy = lazy(() => import("@/pages/refund-policy"));

function Router() {
  const [location] = useLocation();

  // 라우트 변경 시 페이지뷰 추적
  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner" aria-label="Loading" />
        </div>
      }
    >
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/checkout/:readingId" component={Checkout} />
        <Route path="/results/:readingId" component={Results} />
        <Route path="/compatibility" component={Compatibility} />
        <Route path="/monthly-fortune" component={MonthlyFortune} />
        <Route path="/premium" component={Premium} />
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contact" component={Contact} />
        <Route path="/refund-policy" component={RefundPolicy} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
