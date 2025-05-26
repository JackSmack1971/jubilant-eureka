import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Design System Accessibility', () => {
  test('should not have any detectable accessibility violations on the homepage', async ({ page }) => {
    await page.goto('/index.html');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['document-title', 'html-has-lang', 'meta-viewport'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});