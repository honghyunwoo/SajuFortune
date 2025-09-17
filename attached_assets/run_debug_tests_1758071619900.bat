@echo off
echo 🔍 사주 시주 계산 디버깅 테스트 실행
echo.
echo 다음 HTML 파일들이 브라우저에서 열립니다:
echo 1. debug_hour_test.html - 기본 디버깅 테스트
echo 2. specific_test.html - 1989년 10월 6일 12:56 특정 테스트
echo 3. comparison_test.html - 두 가지 계산 방식 비교
echo.
pause

start "" "%~dp0debug_hour_test.html"
timeout /t 2 /nobreak >nul

start "" "%~dp0specific_test.html"
timeout /t 2 /nobreak >nul

start "" "%~dp0comparison_test.html"

echo.
echo ✅ 모든 테스트 파일이 브라우저에서 열렸습니다.
echo 각 페이지에서 결과를 확인하세요.
pause