import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle("SajuFortune - 당신의 운명을 탐색하세요");
  });

  test('has form elements', async ({ page }) => {
    await page.goto('/');

    // Expect the main form to be visible.
    await expect(page.getByTestId('form-fortune-reading')).toBeVisible();

    // Expect the submit button to be visible.
    await expect(page.getByTestId('button-submit-fortune')).toBeVisible();
  });
});
