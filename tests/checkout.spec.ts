import { authenticatedTest as test, expect } from './fixtures';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
  });

  test.describe('Step one — information form', () => {
    test.beforeEach(async ({ cartPage }) => {
      await cartPage.checkout();
    });

    test('requires a first name', async ({ checkoutStepOnePage }) => {
      await checkoutStepOnePage.fillInfo('', 'Doe', '12345');
      await checkoutStepOnePage.continueToOverview();

      await expect(checkoutStepOnePage.errorMessage).toHaveText('Error: First Name is required');
    });

    test('requires a last name', async ({ checkoutStepOnePage }) => {
      await checkoutStepOnePage.fillInfo('John', '', '12345');
      await checkoutStepOnePage.continueToOverview();

      await expect(checkoutStepOnePage.errorMessage).toHaveText('Error: Last Name is required');
    });

    test('requires a postal code', async ({ checkoutStepOnePage }) => {
      await checkoutStepOnePage.fillInfo('John', 'Doe', '');
      await checkoutStepOnePage.continueToOverview();

      await expect(checkoutStepOnePage.errorMessage).toHaveText('Error: Postal Code is required');
    });

    test('valid info proceeds to the overview step', async ({ page, checkoutStepOnePage }) => {
      await checkoutStepOnePage.fillInfo('John', 'Doe', '12345');
      await checkoutStepOnePage.continueToOverview();

      await expect(page).toHaveURL(/checkout-step-two.html/);
    });

    test('cancel returns to the cart', async ({ page, checkoutStepOnePage }) => {
      await checkoutStepOnePage.cancelButton.click();

      await expect(page).toHaveURL(/cart.html/);
    });
  });

  test.describe('Step two — overview', () => {
    test.beforeEach(async ({ cartPage, checkoutStepOnePage }) => {
      await cartPage.checkout();
      await checkoutStepOnePage.fillInfo('John', 'Doe', '12345');
      await checkoutStepOnePage.continueToOverview();
    });

    test('lists the items being purchased', async ({ checkoutStepTwoPage }) => {
      await expect(checkoutStepTwoPage.itemNames).toHaveText(['Sauce Labs Backpack']);
    });

    test('total equals item subtotal plus tax', async ({ checkoutStepTwoPage }) => {
      const subtotal = await checkoutStepTwoPage.getSubtotal();
      const tax = await checkoutStepTwoPage.getTax();
      const total = await checkoutStepTwoPage.getTotal();

      expect(total).toBeCloseTo(subtotal + tax, 2);
    });

    test('cancel returns to the products page', async ({ page, checkoutStepTwoPage }) => {
      await checkoutStepTwoPage.cancelButton.click();

      await expect(page).toHaveURL(/inventory.html/);
    });

    test('finish completes the order', async ({ page, checkoutStepTwoPage, checkoutCompletePage }) => {
      await checkoutStepTwoPage.finish();

      await expect(page).toHaveURL(/checkout-complete.html/);
      await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    });
  });
});
