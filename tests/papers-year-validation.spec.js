const { test, expect } = require('@playwright/test');

test.describe('paper year validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/papers', async (route, request) => {
      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
        return;
      }

      if (request.method() === 'POST') {
        const body = request.postDataJSON();
        const year = body?.year;

        if (year === 0 || year > 2500) {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              error: 'Validation failed.',
              errors: {
                year: 'Year must be between 1 and 2500.'
              }
            })
          });
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            ...body,
            date_added: '2026-04-22'
          })
        });
        return;
      }

      await route.fallback();
    });
  });

  test('rejects year 0', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Add Paper' }).click();
    await page.getByLabel('Title').fill('Bad Year Paper');
    await page.getByLabel('Year').fill('0');
    await page.getByRole('button', { name: 'Save Paper' }).click();

    await expect(
      page.getByText('Year must be between 1 and 2500.')
    ).toBeVisible();
  });

  test('rejects year > 2500', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Add Paper' }).click();
    await page.getByLabel('Title').fill('Future Paper');
    await page.getByLabel('Year').fill('2501');
    await page.getByRole('button', { name: 'Save Paper' }).click();

    await expect(
      page.getByText('Year must be between 1 and 2500.')
    ).toBeVisible();
  });
});