import { test, expect } from '@playwright/test';

test.describe('Public Navigation', () => {
  test('should load the homepage and show stats', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/منصة ضمان الجودة/);
    
    // Check if stats are visible
    await expect(page.locator('text=زائر').first()).toBeVisible();
    await expect(page.locator('text=متدرب معتمد').first()).toBeVisible();
  });

  test('should navigate to forum and have forum UI', async ({ page }) => {
    await page.goto('/forum');
    await expect(page.locator('text=مجتمع الجودة')).toBeVisible();
    await expect(page.locator('text=موضوع جديد')).toBeVisible();
  });

  test('should navigate to courses', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.locator('text=البرامج التدريبية المعتمدة')).toBeVisible();
  });
});

test.describe('Admin Login', () => {
  test('should show login form and reject invalid credentials', async ({ page }) => {
    await page.goto('/admin');
    
    // Because of middleware, /admin without auth redirects to /admin/login
    await expect(page).toHaveURL(/.*\/admin\/login/);

    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=بيانات الدخول غير صحيحة')).toBeVisible();
  });
});
