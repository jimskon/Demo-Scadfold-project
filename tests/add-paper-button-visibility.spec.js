const { test, expect } = require('@playwright/test');

test('Add Paper button disappears when form is shown', async ({ page }) => {
  // Mock initial load
  await page.route('**/api/papers', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  await page.goto('/');

  // Button should be visible initially
  const addButton = page.getByRole('button', { name: 'Add Paper' });
  await expect(addButton).toBeVisible();

  // Click it
  await addButton.click();

  // Form should appear
  await expect(page.getByText('Add New Paper')).toBeVisible();

  // Button should now be gone
  await expect(addButton).toHaveCount(0);
});