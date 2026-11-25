# Playwright Sauce Demo Test Suite

End-to-end UI test automation for [Sauce Demo (Swag Labs)](https://www.saucedemo.com) built with **Playwright** and **TypeScript**, using the **Page Object Model**.

## What it covers

| Area | Spec file | Examples |
|---|---|---|
| Login | `login.spec.ts` | valid login, locked-out user, empty username/password, wrong credentials, dismissing errors, slow `performance_glitch_user` |
| Inventory | `inventory.spec.ts` | six products listed, sort by name and price, cart badge updates, navigation |
| Product detail | `product-detail.spec.ts` | name and price shown, add to cart, back button |
| Cart | `cart.spec.ts` | items added, remove item, continue shopping, go to checkout |
| Checkout | `checkout.spec.ts` | required-field validation, overview items, total = subtotal + tax, cancel, finish |
| End-to-end | `e2e-purchase.spec.ts` | log in, buy two products, complete checkout |
| Menu | `menu.spec.ts` | logout, session cleared, reset app state, About link, close menu |
| Visual regression | `visual.spec.ts` | screenshot baselines for login and inventory; `visual_user` must differ from the baseline |

## Tech stack

- Playwright Test (`@playwright/test`)
- TypeScript
- GitHub Actions (CI)

## Project structure

```
tests/
  pages/          Page Objects (Login, Inventory, ProductDetail, Cart, Checkout steps, Menu)
  test-data/      Users and shared password
  fixtures.ts     One fixture per page object, plus an authenticatedTest that starts logged in
  *.spec.ts       Test specs
playwright.config.ts
.github/workflows/playwright.yml
```

## How to run

Requirements: Node.js 20+ and Google Chrome.

```bash
npm ci
npx playwright test                 # runs in a visible, slowed-down Chrome locally
npx playwright show-report          # open the HTML report
```

On CI (`CI=true`) tests run headless, in parallel, with 2 retries and a trace on the first retry.

## CI

GitHub Actions runs the suite on every push and pull request to `main` and uploads the HTML report as an artifact. The visual regression tests are excluded on CI because their snapshots were baselined on Windows and are OS-specific.
