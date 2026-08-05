import { test, expect } from './fixtures';
import { USERS, PASSWORD } from './test-data/users';

test.describe('Visual regression', () => {
  test('login page matches its baseline', async ({ page, loginPage }) => {
    await loginPage.goto();

    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('standard_user inventory page matches its baseline', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);
    await page.waitForURL('**/inventory.html');

    await expect(page).toHaveScreenshot('inventory-page.png');
  });

  test('visual_user inventory page diverges from the standard baseline (known visual bug)', async ({
    page,
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(USERS.visual, PASSWORD);
    await page.waitForURL('**/inventory.html');

    // Intentionally reused against the standard_user baseline above: visual_user
    // is SauceDemo's deliberately-broken account (swapped product image,
    // randomized prices, shifted cart icon), so this must NOT match.
    await expect(page).not.toHaveScreenshot('inventory-page.png');
  });
});
