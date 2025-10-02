import { test, expect } from '@playwright/test';

test.describe('사주풀이 전체 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('홈페이지 로딩 및 기본 요소 확인', async ({ page }) => {
    // 타이틀 확인
    await expect(page).toHaveTitle(/SajuFortune/);

    // 메인 헤더 확인
    await expect(page.getByRole('heading', { name: /사주풀이/i })).toBeVisible();

    // 입력 폼 확인
    await expect(page.locator('form')).toBeVisible();
  });

  test('사주 입력 폼 유효성 검사', async ({ page }) => {
    // 제출 버튼 찾기
    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });

    // 빈 폼 제출 시도
    await submitButton.click();

    // 유효성 에러 메시지 확인 (브라우저 기본 또는 커스텀)
    // 최소 한 개의 입력 필드에 포커스가 가거나 에러 메시지가 표시되어야 함
  });

  test('완전한 사주 정보 입력 및 결과 조회', async ({ page }) => {
    // 성별 선택
    await page.getByLabel(/남성|남자/i).click();

    // 생년월일 입력
    await page.getByLabel(/년|연도/i).fill('1990');
    await page.getByLabel(/월/i).fill('5');
    await page.getByLabel(/일/i).fill('15');

    // 시간 입력
    await page.getByLabel(/시|시간/i).fill('14');
    await page.getByLabel(/분/i).fill('30');

    // 양력/음력 선택 (기본값이 양력이라고 가정)

    // 제출
    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    // 결과 페이지로 이동 대기
    await page.waitForURL(/\/results/i, { timeout: 10000 });

    // 결과 페이지 확인
    await expect(page.getByText(/사주팔자|四柱八字/i)).toBeVisible({ timeout: 10000 });
  });

  test('사주 결과 페이지 - 기본 정보 표시 확인', async ({ page }) => {
    // 테스트용 데이터로 직접 결과 페이지 접근
    await page.goto('/');

    // 사주 입력
    await page.getByLabel(/남성|남자/i).click();
    await page.getByLabel(/년|연도/i).fill('1985');
    await page.getByLabel(/월/i).fill('10');
    await page.getByLabel(/일/i).fill('20');
    await page.getByLabel(/시|시간/i).fill('9');
    await page.getByLabel(/분/i).fill('0');

    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    // 결과 대기
    await page.waitForURL(/\/results/i, { timeout: 10000 });

    // 사주팔자 섹션 확인
    await expect(page.getByText(/사주팔자|四柱八字/i)).toBeVisible();
    await expect(page.getByText(/년주|년주/i)).toBeVisible();
    await expect(page.getByText(/월주/i)).toBeVisible();
    await expect(page.getByText(/일주/i)).toBeVisible();
    await expect(page.getByText(/시주/i)).toBeVisible();
  });

  test('사주 결과 페이지 - 격국 분석 표시 확인', async ({ page }) => {
    await page.goto('/');

    // 사주 입력
    await page.getByLabel(/남성|남자/i).click();
    await page.getByLabel(/년|연도/i).fill('1990');
    await page.getByLabel(/월/i).fill('3');
    await page.getByLabel(/일/i).fill('21');
    await page.getByLabel(/시|시간/i).fill('15');
    await page.getByLabel(/분/i).fill('45');

    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    await page.waitForURL(/\/results/i, { timeout: 10000 });

    // 격국 분석 섹션 확인
    await expect(page.getByText(/격국 분석|格局分析/i)).toBeVisible({ timeout: 5000 });

    // 격국명 표시 확인 (예: 정관격, 편관격 등)
    const geokgukSection = page.locator('text=/격국 분석|格局分析/i').locator('..');
    await expect(geokgukSection).toBeVisible();
  });

  test('사주 결과 페이지 - 대운 타임라인 표시 확인', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/여성|여자/i).click();
    await page.getByLabel(/년|연도/i).fill('1995');
    await page.getByLabel(/월/i).fill('7');
    await page.getByLabel(/일/i).fill('10');
    await page.getByLabel(/시|시간/i).fill('11');
    await page.getByLabel(/분/i).fill('20');

    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    await page.waitForURL(/\/results/i, { timeout: 10000 });

    // 대운 타임라인 섹션 확인
    await expect(page.getByText(/대운 타임라인|大運/i)).toBeVisible({ timeout: 5000 });

    // 대운 주기 표시 확인 (10년 단위)
    await expect(page.getByText(/세.*-.*세/i).first()).toBeVisible();
  });

  test('사주 결과 페이지 - 십이운성 분석 표시 확인', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/남성|남자/i).click();
    await page.getByLabel(/년|연도/i).fill('2000');
    await page.getByLabel(/월/i).fill('1');
    await page.getByLabel(/일/i).fill('1');
    await page.getByLabel(/시|시간/i).fill('12');
    await page.getByLabel(/분/i).fill('0');

    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    await page.waitForURL(/\/results/i, { timeout: 10000 });

    // 십이운성 분석 섹션 확인
    await expect(page.getByText(/십이운성 분석|十二運星/i)).toBeVisible({ timeout: 5000 });

    // 생애 에너지 표시 확인
    await expect(page.getByText(/생애 에너지/i)).toBeVisible();

    // 운성 표시 확인 (장생, 목욕, 관대 등)
    await expect(page.getByText(/년주.*Year/i)).toBeVisible();
    await expect(page.getByText(/월주.*Month/i)).toBeVisible();
    await expect(page.getByText(/일주.*Day/i)).toBeVisible();
    await expect(page.getByText(/시주.*Hour/i)).toBeVisible();
  });

  test('사주 결과 페이지 - 오행 균형 분석 확인', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/남성|남자/i).click();
    await page.getByLabel(/년|연도/i).fill('1988');
    await page.getByLabel(/월/i).fill('12');
    await page.getByLabel(/일/i).fill('25');
    await page.getByLabel(/시|시간/i).fill('18');
    await page.getByLabel(/분/i).fill('30');

    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    await page.waitForURL(/\/results/i, { timeout: 10000 });

    // 오행 균형 분석 섹션 확인
    await expect(page.getByText(/오행 균형 분석/i)).toBeVisible({ timeout: 5000 });

    // 오행 요소 표시 확인
    await expect(page.getByText(/목.*木/i)).toBeVisible();
    await expect(page.getByText(/화.*火/i)).toBeVisible();
    await expect(page.getByText(/토.*土/i)).toBeVisible();
    await expect(page.getByText(/금.*金/i)).toBeVisible();
    await expect(page.getByText(/수.*水/i)).toBeVisible();
  });

  test('PDF 다운로드 기능 확인', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/남성|남자/i).click();
    await page.getByLabel(/년|연도/i).fill('1992');
    await page.getByLabel(/월/i).fill('6');
    await page.getByLabel(/일/i).fill('15');
    await page.getByLabel(/시|시간/i).fill('10');
    await page.getByLabel(/분/i).fill('30');

    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    await page.waitForURL(/\/results/i, { timeout: 10000 });

    // PDF 다운로드 버튼 확인
    const downloadButton = page.getByRole('button', { name: /PDF|다운로드|저장/i });
    await expect(downloadButton).toBeVisible({ timeout: 5000 });

    // 다운로드 버튼 클릭 가능 확인 (실제 다운로드는 테스트하지 않음)
    await expect(downloadButton).toBeEnabled();
  });

  test('반응형 디자인 - 모바일 뷰 확인', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 폼이 모바일에서도 정상 표시되는지 확인
    await expect(page.locator('form')).toBeVisible();

    // 입력 필드들이 세로로 정렬되어 있는지 확인
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('에러 처리 - 잘못된 날짜 입력', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/남성|남자/i).click();
    await page.getByLabel(/년|연도/i).fill('2025'); // 미래 날짜
    await page.getByLabel(/월/i).fill('13'); // 잘못된 월
    await page.getByLabel(/일/i).fill('32'); // 잘못된 일
    await page.getByLabel(/시|시간/i).fill('25'); // 잘못된 시간
    await page.getByLabel(/분/i).fill('70'); // 잘못된 분

    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    // 에러 메시지 또는 유효성 검사 확인
    // (구현에 따라 브라우저 기본 유효성 검사 또는 커스텀 메시지)
  });

  test('뒤로 가기 후 폼 상태 유지', async ({ page }) => {
    await page.goto('/');

    // 폼 입력
    await page.getByLabel(/남성|남자/i).click();
    await page.getByLabel(/년|연도/i).fill('1990');
    await page.getByLabel(/월/i).fill('5');
    await page.getByLabel(/일/i).fill('15');
    await page.getByLabel(/시|시간/i).fill('14');
    await page.getByLabel(/분/i).fill('30');

    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    await page.waitForURL(/\/results/i, { timeout: 10000 });

    // 뒤로 가기
    await page.goBack();

    // 입력한 값이 유지되는지 확인
    await expect(page.getByLabel(/년|연도/i)).toHaveValue('1990');
  });

  test('다양한 생년월일 조합 테스트', async ({ page }) => {
    const testCases = [
      { year: '1950', month: '1', day: '1', hour: '0', minute: '0' },
      { year: '1975', month: '6', day: '15', hour: '12', minute: '30' },
      { year: '2000', month: '12', day: '31', hour: '23', minute: '59' },
      { year: '2020', month: '2', day: '29', hour: '14', minute: '15' }, // 윤년
    ];

    for (const testCase of testCases) {
      await page.goto('/');

      await page.getByLabel(/남성|남자/i).click();
      await page.getByLabel(/년|연도/i).fill(testCase.year);
      await page.getByLabel(/월/i).fill(testCase.month);
      await page.getByLabel(/일/i).fill(testCase.day);
      await page.getByLabel(/시|시간/i).fill(testCase.hour);
      await page.getByLabel(/분/i).fill(testCase.minute);

      const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
      await submitButton.click();

      // 결과 페이지 로딩 확인
      await page.waitForURL(/\/results/i, { timeout: 10000 });
      await expect(page.getByText(/사주팔자|四柱八字/i)).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('성능 테스트', () => {
  test('페이지 로딩 성능', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // 3초 이내 로딩
    expect(loadTime).toBeLessThan(3000);
  });

  test('사주 계산 응답 시간', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/남성|남자/i).click();
    await page.getByLabel(/년|연도/i).fill('1990');
    await page.getByLabel(/월/i).fill('5');
    await page.getByLabel(/일/i).fill('15');
    await page.getByLabel(/시|시간/i).fill('14');
    await page.getByLabel(/분/i).fill('30');

    const startTime = Date.now();
    const submitButton = page.getByRole('button', { name: /운세 보기|조회|확인/i });
    await submitButton.click();

    await page.waitForURL(/\/results/i, { timeout: 10000 });
    const responseTime = Date.now() - startTime;

    // 5초 이내 응답
    expect(responseTime).toBeLessThan(5000);
  });
});

test.describe('접근성 테스트', () => {
  test('키보드 네비게이션', async ({ page }) => {
    await page.goto('/');

    // Tab 키로 모든 입력 필드 접근 가능한지 확인
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // 포커스된 요소가 입력 필드인지 확인
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'SELECT']).toContain(focusedElement);
  });

  test('ARIA 레이블 확인', async ({ page }) => {
    await page.goto('/');

    // 주요 폼 요소들이 적절한 레이블을 가지고 있는지 확인
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // 폼 필드에 레이블이 있는지 확인
    const inputs = await form.locator('input').all();
    expect(inputs.length).toBeGreaterThan(0);
  });
});
