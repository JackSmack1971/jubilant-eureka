import { test, expect } from '@playwright/test';

test.describe('Design System Visual Regression', () => {
  // TC-DSI-VR-001: Verify pixel-perfect implementation of the Color System on the homepage
  test('should visually match the baseline for the homepage color system', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage-color-system.png', { fullPage: true });
  });

  // TC-DSI-VR-002: Verify pixel-perfect implementation of the Typography System on the homepage
  // TC-DSI-VR-003: Verify pixel-perfect implementation of Spacing & Layout on the homepage
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1440, height: 900, name: 'desktop' },
  ];

  for (const viewport of viewports) {
    test(`should visually match the baseline for typography and layout on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/index.html');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(`homepage-typography-layout-${viewport.name}.png`, { fullPage: true });
    });
  }

  // TC-DSI-VR-004: Verify pixel-perfect implementation of Component Library default states
  test('should visually match the baseline for component default states', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    // Assuming components are visible on the homepage. More specific selectors could be used if needed.
    await expect(page).toHaveScreenshot('homepage-components-default-states.png', { fullPage: true });
  });

  // TC-DSI-VR-005: Verify pixel-perfect implementation of Iconography
  test('should visually match the baseline for iconography', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    // Assuming icons are visible on the homepage. More specific selectors could be used if needed.
    await expect(page).toHaveScreenshot('homepage-iconography.png', { fullPage: true });
  });

  // TC-DSI-VR-006: Verify pixel-perfect implementation of Motion & Interaction (hover states, animations)
  test('should visually match the baseline for motion and interaction states', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');

    // Example: Hover over a button to capture its hover state
    // This assumes there's a button with a specific selector, e.g., '.primary-button'
    const primaryButton = page.locator('.primary-button');
    if (await primaryButton.isVisible()) {
      await primaryButton.hover();
      await expect(page).toHaveScreenshot('homepage-button-hover-state.png', { fullPage: true });
    } else {
      console.warn('Primary button not found for hover state test.');
    }

    // Add more interactions as needed for other components (cards, links, inputs)
    // For example, focusing on an input field:
    const inputField = page.locator('input[type="text"]'); // Adjust selector as needed
    if (await inputField.isVisible()) {
      await inputField.focus();
      await expect(page).toHaveScreenshot('homepage-input-focus-state.png', { fullPage: true });
    } else {
      console.warn('Input field not found for focus state test.');
    }
  });
});