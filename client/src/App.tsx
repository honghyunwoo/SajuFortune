import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { trackPageView } from "@/lib/analytics";
import Home from "@/pages/home";
import Checkout from "@/pages/checkout";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import CookiePolicy from "@/pages/cookie-policy";
import Disclaimer from "@/pages/disclaimer";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";
import RefundPolicy from "@/pages/refund-policy";
import NotFound from "@/pages/not-found";
import BlogIndex from "@/pages/blog/index";
import BlogPost from "@/pages/blog/post";

// 무거운 페이지들은 lazy loading으로 최적화
const Results = lazy(() => import("@/pages/results"));

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
        <Route path="/checkout/:readingId" component={Checkout} />
        <Route path="/results/:readingId" component={Results} />
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
