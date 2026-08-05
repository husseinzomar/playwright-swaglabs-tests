import { test, expect } from './fixtures';
import { USERS, PASSWORD } from './test-data/users';

test.describe('Login', () => {
  test('has the Swag Labs title', async ({ page, loginPage }) => {
    await loginPage.goto();
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('standard_user logs in and lands on the products page', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('locked_out_user is blocked with an error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.lockedOut, PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('submitting an empty form requires a username', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('submitting without a password requires one', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.usernameInput.fill(USERS.standard);
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
  });

  test('wrong credentials are rejected', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard, 'wrong_password');

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('the login error can be dismissed', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.errorCloseButton.click();
    await expect(loginPage.errorMessage).toBeHidden();
  });

  test('performance_glitch_user eventually reaches the products page', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.performanceGlitch, PASSWORD);

    // This user simulates a slow backend, so give the navigation extra time.
    await expect(page).toHaveURL(/inventory.html/, { timeout: 15000 });
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('problem_user logs in but product images are broken (known bug)', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.problem, PASSWORD);

    await expect(inventoryPage.pageTitle).toHaveText('Products');

    // Known defect: every product renders the same broken placeholder image.
    const sources = await inventoryPage.itemImages.evaluateAll((imgs) =>
      imgs.map((img) => img.getAttribute('src'))
    );
    expect(new Set(sources).size).toBe(1);
  });

  test('visual_user logs in successfully', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.visual, PASSWORD);

    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('error_user logs in successfully', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.error, PASSWORD);

    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });
});
