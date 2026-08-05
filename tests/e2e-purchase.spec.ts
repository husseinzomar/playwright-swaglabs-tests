import { test, expect } from './fixtures';
import { USERS, PASSWORD } from './test-data/users';

test('a customer can log in, buy two products, and complete checkout', async ({
  page,
  loginPage,
  inventoryPage,
  cartPage,
  checkoutStepOnePage,
  checkoutStepTwoPage,
  checkoutCompletePage,
}) => {
  await loginPage.goto();
  await loginPage.login(USERS.standard, PASSWORD);
  await expect(inventoryPage.pageTitle).toHaveText('Products');

  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.addToCart('Sauce Labs Bike Light');
  await expect(inventoryPage.cartBadge).toHaveText('2');

  await inventoryPage.openCart();
  await expect(cartPage.getItemNames()).resolves.toEqual(
    expect.arrayContaining(['Sauce Labs Backpack', 'Sauce Labs Bike Light'])
  );

  await cartPage.checkout();
  await expect(page).toHaveURL(/checkout-step-one.html/);
  await checkoutStepOnePage.fillInfo('John', 'Doe', '12345');
  await checkoutStepOnePage.continueToOverview();

  await expect(page).toHaveURL(/checkout-step-two.html/);
  const subtotal = await checkoutStepTwoPage.getSubtotal();
  const tax = await checkoutStepTwoPage.getTax();
  const total = await checkoutStepTwoPage.getTotal();
  expect(total).toBeCloseTo(subtotal + tax, 2);

  await checkoutStepTwoPage.finish();

  await expect(page).toHaveURL(/checkout-complete.html/);
  await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');

  await checkoutCompletePage.backToProducts();
  await expect(page).toHaveURL(/inventory.html/);
  await expect(inventoryPage.cartBadge).toBeHidden();
});
