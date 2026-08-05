import { authenticatedTest as test, expect } from './fixtures';

test.describe('Inventory / Products', () => {
  test('lists all six products', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('sorts by name A to Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sorts by name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sorts by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts by price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('adding a product shows a cart badge and switches the button to Remove', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();

    await inventoryPage.addToCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.itemCard('Sauce Labs Backpack').getByRole('button', { name: 'Remove' })).toBeVisible();
  });

  test('removing a product from the list updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('adding multiple products accumulates the cart badge count', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('clicking a product name navigates to its detail page', async ({ page, inventoryPage }) => {
    await inventoryPage.openProduct('Sauce Labs Backpack');

    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
  });

  test('clicking the cart icon navigates to the cart page', async ({ page, inventoryPage }) => {
    await inventoryPage.openCart();

    await expect(page).toHaveURL(/cart.html/);
  });
});
