import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeAnalytics } from "./lib/analytics";
import { initKakaoSDK } from "./lib/kakao-share";

// Google Analytics 초기화
initializeAnalytics();

// Kakao SDK 초기화 (JavaScript Key 사용)
// 실제 배포 시 환경변수로 관리 필요
const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY || '';
if (KAKAO_JS_KEY) {
  initKakaoSDK(KAKAO_JS_KEY);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
