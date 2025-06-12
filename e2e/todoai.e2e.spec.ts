import { test, expect } from '@playwright/test';

test.describe('TodoAI E2E', () => {
  test('User can sign up, create a goal, and view dashboard', async ({ page }) => {
    // Visit home
    await page.goto('/');
    expect(await page.title()).toMatch(/TodoAI/i);

    // Navigate to signup (placeholder, update selector as needed)
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/signup/);

    // Fill out signup form (placeholder)
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');

    // Navigate to create-goal
    await page.click('text=Create Goal');
    await expect(page).toHaveURL(/create-goal/);

    // Fill out create-goal form (placeholder selectors)
    await page.fill('input[name="goalName"]', 'E2E Goal');
    await page.selectOption('select[name="category"]', 'learning');
    await page.click('button:has-text("Next")');
    // ...continue for all steps as needed

    // Navigate to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/dashboard/);
    expect(await page.textContent('h1')).toMatch(/Today|Dashboard/i);
  });
}); 