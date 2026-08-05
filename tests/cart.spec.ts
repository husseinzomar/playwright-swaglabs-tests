import { authenticatedTest as test, expect } from './fixtures';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await inventoryPage.openCart();
  });

  test('shows every product added from the inventory page', async ({ cartPage }) => {
    const names = await cartPage.getItemNames();
    expect(names).toEqual(expect.arrayContaining(['Sauce Labs Backpack', 'Sauce Labs Bike Light']));
    await expect(cartPage.cartItems).toHaveCount(2);
  });

  test('removing an item takes it out of the cart', async ({ cartPage, inventoryPage }) => {
    await cartPage.removeItem('Sauce Labs Backpack');

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('continue shopping returns to the products page', async ({ page, cartPage }) => {
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory.html/);
  });

  test('checkout navigates to step one', async ({ page, cartPage }) => {
    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout-step-one.html/);
  });
});
