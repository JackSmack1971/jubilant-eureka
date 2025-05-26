# Test info

- Name: Design System Visual Regression >> should visually match the baseline for typography and layout on tablet
- Location: C:\Projects\Raw Alpha v2\static-site\tests\features\design-system-implementation\visual-regression.spec.js:20:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected)

  Expected an image 768px by 1024px, received 768px by 3955px. 2923308 pixels (ratio 0.97 of all image pixels) are different.

Expected: C:\Projects\Raw Alpha v2\static-site\tests\features\design-system-implementation\visual-regression.spec.js-snapshots\homepage-typography-layout-tablet-win32.png
Received: C:\Projects\Raw Alpha v2\static-site\test-results\features-design-system-imp-5a757-graphy-and-layout-on-tablet\homepage-typography-layout-tablet-actual.png
    Diff: C:\Projects\Raw Alpha v2\static-site\test-results\features-design-system-imp-5a757-graphy-and-layout-on-tablet\homepage-typography-layout-tablet-diff.png

Call log:
  - expect.toHaveScreenshot(homepage-typography-layout-tablet.png) with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 768px by 1024px, received 768px by 3955px. 2923308 pixels (ratio 0.97 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 768px by 1024px, received 768px by 3955px. 2923308 pixels (ratio 0.97 of all image pixels) are different.

    at C:\Projects\Raw Alpha v2\static-site\tests\features\design-system-implementation\visual-regression.spec.js:24:26
```

# Page snapshot

```yaml
- banner:
  - link "Raw Alpha Logo":
    - /url: "#"
    - img "Raw Alpha Logo"
  - navigation:
    - list:
      - listitem:
        - link "Learn More":
          - /url: "#learn-more"
      - listitem:
        - link "Products":
          - /url: "#future-products-showcase"
      - listitem:
        - link "Contact":
          - /url: "#contact"
      - listitem:
        - link "About Us":
          - /url: about.html
  - heading "Unlock Your Potential with Raw Alpha" [level=1]
  - paragraph: Innovative solutions for a smarter future.
  - link "Learn More":
    - /url: "#learn-more"
  - link "Contact Us":
    - /url: "#contact"
- main:
  - heading "Learn More About Raw Alpha" [level=2]
  - paragraph: Raw Alpha is dedicated to providing cutting-edge solutions that empower businesses and individuals to achieve their full potential. Our innovative approach combines advanced technology with user-centric design to deliver seamless and impactful experiences.
  - paragraph: Discover how our services can transform your operations and drive future growth. We focus on creating sustainable and scalable solutions tailored to your unique needs.
  - heading "Future Products Showcase" [level=2]
  - 'img "Product 1: Blockchain Service Alpha"'
  - 'heading "Product 1: Blockchain Service Alpha" [level=3]'
  - paragraph: A revolutionary new blockchain service designed to enhance transparency and security in digital transactions.
  - 'img "Product 2: Decentralized Finance Beta"'
  - 'heading "Product 2: Decentralized Finance Beta" [level=3]'
  - paragraph: Next-gen DeFi solutions offering unparalleled financial freedom and accessibility.
  - 'img "Product 3: AI-Powered Smart Contracts"'
  - 'heading "Product 3: AI-Powered Smart Contracts" [level=3]'
  - paragraph: Intelligent contracts that automate agreements with enhanced efficiency and reduced risk.
  - heading "Contact Us" [level=2]
  - link "Facebook":
    - /url: https://facebook.com/rawalpha
  - link "Twitter":
    - /url: https://twitter.com/rawalpha
  - link "LinkedIn":
    - /url: https://linkedin.com/company/rawalpha
  - link "Instagram":
    - /url: https://instagram.com/rawalpha
  - link "GitHub":
    - /url: https://github.com/rawalpha
  - textbox "Name (Coming Soon)" [disabled]
  - textbox "Email (Coming Soon)" [disabled]
  - textbox "Message (Coming Soon)" [disabled]
  - button "Send Message" [disabled]
  - paragraph: Our contact form is coming soon!
- contentinfo:
  - paragraph: © 2025 Raw Alpha. All rights reserved.
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Design System Visual Regression', () => {
   4 |   // TC-DSI-VR-001: Verify pixel-perfect implementation of the Color System on the homepage
   5 |   test('should visually match the baseline for the homepage color system', async ({ page }) => {
   6 |     await page.goto('/index.html');
   7 |     await page.waitForLoadState('networkidle');
   8 |     await expect(page).toHaveScreenshot('homepage-color-system.png', { fullPage: true });
   9 |   });
  10 |
  11 |   // TC-DSI-VR-002: Verify pixel-perfect implementation of the Typography System on the homepage
  12 |   // TC-DSI-VR-003: Verify pixel-perfect implementation of Spacing & Layout on the homepage
  13 |   const viewports = [
  14 |     { width: 375, height: 667, name: 'mobile' },
  15 |     { width: 768, height: 1024, name: 'tablet' },
  16 |     { width: 1440, height: 900, name: 'desktop' },
  17 |   ];
  18 |
  19 |   for (const viewport of viewports) {
  20 |     test(`should visually match the baseline for typography and layout on ${viewport.name}`, async ({ page }) => {
  21 |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  22 |       await page.goto('/index.html');
  23 |       await page.waitForLoadState('networkidle');
> 24 |       await expect(page).toHaveScreenshot(`homepage-typography-layout-${viewport.name}.png`, { fullPage: true });
     |                          ^ Error: expect(page).toHaveScreenshot(expected)
  25 |     });
  26 |   }
  27 |
  28 |   // TC-DSI-VR-004: Verify pixel-perfect implementation of Component Library default states
  29 |   test('should visually match the baseline for component default states', async ({ page }) => {
  30 |     await page.goto('/index.html');
  31 |     await page.waitForLoadState('networkidle');
  32 |     // Assuming components are visible on the homepage. More specific selectors could be used if needed.
  33 |     await expect(page).toHaveScreenshot('homepage-components-default-states.png', { fullPage: true });
  34 |   });
  35 |
  36 |   // TC-DSI-VR-005: Verify pixel-perfect implementation of Iconography
  37 |   test('should visually match the baseline for iconography', async ({ page }) => {
  38 |     await page.goto('/index.html');
  39 |     await page.waitForLoadState('networkidle');
  40 |     // Assuming icons are visible on the homepage. More specific selectors could be used if needed.
  41 |     await expect(page).toHaveScreenshot('homepage-iconography.png', { fullPage: true });
  42 |   });
  43 |
  44 |   // TC-DSI-VR-006: Verify pixel-perfect implementation of Motion & Interaction (hover states, animations)
  45 |   test('should visually match the baseline for motion and interaction states', async ({ page }) => {
  46 |     await page.goto('/index.html');
  47 |     await page.waitForLoadState('networkidle');
  48 |
  49 |     // Example: Hover over a button to capture its hover state
  50 |     // This assumes there's a button with a specific selector, e.g., '.primary-button'
  51 |     const primaryButton = page.locator('.primary-button');
  52 |     if (await primaryButton.isVisible()) {
  53 |       await primaryButton.hover();
  54 |       await expect(page).toHaveScreenshot('homepage-button-hover-state.png', { fullPage: true });
  55 |     } else {
  56 |       console.warn('Primary button not found for hover state test.');
  57 |     }
  58 |
  59 |     // Add more interactions as needed for other components (cards, links, inputs)
  60 |     // For example, focusing on an input field:
  61 |     const inputField = page.locator('input[type="text"]'); // Adjust selector as needed
  62 |     if (await inputField.isVisible()) {
  63 |       await inputField.focus();
  64 |       await expect(page).toHaveScreenshot('homepage-input-focus-state.png', { fullPage: true });
  65 |     } else {
  66 |       console.warn('Input field not found for focus state test.');
  67 |     }
  68 |   });
  69 | });
```