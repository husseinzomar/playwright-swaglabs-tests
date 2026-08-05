import { authenticatedTest as test, expect } from './fixtures';

test.describe('Hamburger menu', () => {
  test('logout returns to the login page', async ({ page, menu }) => {
    await menu.logout();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('logout clears the session so inventory is no longer accessible', async ({ page, menu, loginPage }) => {
    await menu.logout();

    await page.goto('/inventory.html');
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in."
    );
  });

  test('reset app state clears the cart', async ({ inventoryPage, menu }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await menu.resetAppState();

    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('About link points to Sauce Labs', async ({ page, menu }) => {
    await menu.open();

    await expect(menu.aboutLink).toHaveAttribute('href', 'https://saucelabs.com/');
  });

  test('the menu can be closed without navigating away', async ({ page, menu }) => {
    await menu.open();
    await menu.closeMenuButton.click();

    await expect(menu.logoutLink).toBeHidden();
    await expect(page).toHaveURL(/inventory.html/);
  });
});
