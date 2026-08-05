import { authenticatedTest as test, expect } from './fixtures';

test.describe('Product detail page', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.openProduct('Sauce Labs Backpack');
  });

  test('shows the selected product name and price', async ({ productDetailPage }) => {
    await expect(productDetailPage.productName).toHaveText('Sauce Labs Backpack');
    await expect(productDetailPage.productPrice).toHaveText('$29.99');
  });

  test('adding to cart from the detail page updates the badge and swaps the button', async ({ productDetailPage }) => {
    await productDetailPage.addToCartButton.click();

    await expect(productDetailPage.cartBadge).toHaveText('1');
    await expect(productDetailPage.removeButton).toBeVisible();
  });

  test('the back button returns to the products list', async ({ page, productDetailPage }) => {
    await productDetailPage.goBack();

    await expect(page).toHaveURL(/inventory.html/);
  });
});
