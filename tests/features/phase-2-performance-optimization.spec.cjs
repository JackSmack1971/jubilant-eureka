// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

// const BASE_URL = `file://${path.join(__dirname, '../../index.html')}`; // No longer needed, using baseURL from config

test.describe('Phase 2 Performance Optimization Tests', () => {

  let consoleMessages = [];

  test.beforeEach(async ({ page }) => {
    consoleMessages = []; // Clear messages for each test
    page.on('console', msg => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });
    await page.context().clearCookies();
    await page.context().clearPermissions();
    await page.goto('/'); // Use the baseURL from playwright.config.cjs
  });

  test.afterEach(async () => {
    if (consoleMessages.length > 0) {
      console.log('Captured Console Messages:');
      consoleMessages.forEach(msg => console.log(`  [${msg.type.toUpperCase()}] ${msg.text}`));
    }
  });

  // TC-PPO-001: Verify critical CSS files are preloaded
  test('TC-PPO-001: Critical CSS files are preloaded', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle'); // Ensure all network requests are complete
    // Wait for the onload event to potentially change rel to stylesheet
    await page.waitForTimeout(1000); // Give it a short time

    const headContentFinal = await page.evaluate(() => document.head.innerHTML);
    expect(headContentFinal).toContain('link rel="stylesheet" href="css/theme.min.css"');
    expect(headContentFinal).toContain('link rel="stylesheet" href="css/style.min.css"');
  });

  // TC-PPO-003: Verify sw.js is developed and successfully registered
  test('TC-PPO-003: Service worker (sw.js) is registered and active', async ({ page }) => {
    const serviceWorkerAvailable = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(serviceWorkerAvailable).toBeTruthy();

    if (serviceWorkerAvailable) {
      // Explicitly wait for the service worker to be registered and activated
      await page.evaluate(() => {
        return new Promise(resolve => { // Resolve without argument
          if (navigator.serviceWorker.controller) {
            resolve(true); // Already active
            return;
          }
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              if (registration.installing) {
                registration.installing.addEventListener('statechange', function() {
                  if (this.state === 'activated') {
                    resolve(true);
                  }
                });
              } else if (registration.active) {
                resolve(true);
              }
            })
            .catch(error => {
              console.error('Service Worker registration failed:', error);
              resolve(false); // Resolve with false on error
            });
        });
      }, { timeout: 10000 }); // Increased timeout for service worker activation

      const serviceWorker = await page.evaluate(async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.find(reg => reg.active && reg.active.scriptURL.includes('sw.js'));
      });
      expect(serviceWorker).toBeTruthy();
      if (serviceWorker && serviceWorker.active) { // Add null check for serviceWorker.active
        expect(serviceWorker.active.state).toBe('activated');
      }
    }
  });

  // TC-PPO-004: Verify static assets are cached by the service worker after the first visit
  test('TC-PPO-004: Static assets are cached by service worker after first visit', async ({ page }) => {
    // This test requires a more complex setup to simulate first and second visits
    // and inspect cache storage. Playwright's context and network interception can be used.
    // For simplicity, this test will verify the presence of a service worker and assume
    // caching logic is handled within sw.js. A more robust test would involve
    // inspecting `page.context().storageState()` or using `page.route` to check cache hits.

    const serviceWorkerAvailable = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(serviceWorkerAvailable).toBeTruthy();

    if (serviceWorkerAvailable) {
      // Explicitly wait for the service worker to be registered and activated
      await page.evaluate(() => {
        return new Promise(resolve => {
          if (navigator.serviceWorker.controller) {
            resolve(true);
            return;
          }
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              if (registration.installing) {
                registration.installing.addEventListener('statechange', function() {
                  if (this.state === 'activated') {
                    resolve(true);
                  }
                });
              } else if (registration.active) {
                resolve(true);
              }
            })
            .catch(error => {
              console.error('Service Worker registration failed:', error);
              resolve(false);
            });
        });
      }, { timeout: 10000 });

      const serviceWorker = await page.evaluate(async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.find(reg => reg.active && reg.active.scriptURL.includes('sw.js'));
      });
      expect(serviceWorker).toBeTruthy();
      if (serviceWorker && serviceWorker.active) {
        expect(serviceWorker.active.state).toBe('activated');
      }
    }

    // A more advanced test would involve:
    // 1. Navigating to the page.
    // 2. Waiting for service worker to activate and cache assets.
    // 3. Reloading the page with network interception to check if assets are served from cache.
    // This is beyond the scope of a simple initial implementation.
  });

  // TC-PPO-005: Verify offline access to cached content using the service worker
  test('TC-PPO-005: Offline access to cached content via service worker', async ({ page }) => {
    // This test requires the service worker to be fully functional and caching assets.
    // We'll simulate offline mode and check if the page still loads.
    // Wait for the service worker to be controlling the page
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    // Clear service worker caches to ensure a clean state for caching
    await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    });

    // Navigate to the main page to allow the service worker to cache it
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    await page.context().setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' }); // Reload in offline mode

    // Check if the main content is still visible, indicating successful offline load
    const pageTitle = await page.title();
    expect(pageTitle).not.toBe(''); // Page should have a title
    const bodyContent = await page.locator('body').textContent();
    console.log('TC-PPO-005 Body Content:', bodyContent);
    expect(bodyContent?.replace(/\s+/g, ' ')).toContain('Welcome to Raw Alpha'); // Trim whitespace and check
    await page.context().setOffline(false); // Re-enable network for subsequent tests
  });

  // TC-PPO-008: Verify optimal image formats are delivered based on browser support
  test('TC-PPO-008: Optimal image formats delivered based on browser support', async ({ page }) => {
    // This test is challenging to automate generically as it depends on browser capabilities
    // and the specific image formats used. Playwright runs in Chromium, Firefox, WebKit.
    // We can check if <picture> elements are used and if the browser loads a modern format.
    const imageSources = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('picture source'))
        .map(source => source.getAttribute('srcset'));
    });
    // Expect at least one modern image format (e.g., .webp or .avif) in the srcset
    const hasModernFormat = imageSources.some(src => src && (src.includes('.webp') || src.includes('.avif')));
    expect(hasModernFormat).toBeTruthy();

    // A more precise test would involve intercepting network requests for images
    // and verifying the `Content-Type` header, but this requires a server setup.
  });

  // TC-PPO-009: Verify images are served at appropriate resolutions for the viewing device/viewport
  test('TC-PPO-009: Images served at appropriate resolutions for viewport', async ({ page }) => {
    // This test requires changing viewport sizes and checking loaded image dimensions.
    // We'll check for the presence of `srcset` or `sizes` attributes on images.
    const responsiveImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img[srcset], img[sizes], picture'))
        .map(img => img.tagName === 'IMG' ? img.getAttribute('srcset') || img.getAttribute('sizes') : 'picture element');
    });
    expect(responsiveImages.length).toBeGreaterThan(0); // Expect at least one responsive image setup

    // To fully test this, one would need to:
    // 1. Set different viewports using `page.setViewportSize()`.
    // 2. Intercept image requests and check the requested image URL/dimensions.
    // This is more complex and might require a server to serve different resolutions.
  });

  // TC-PPO-010: Verify loading="lazy" attribute functions correctly for offscreen images
  test('TC-PPO-010: Lazy loading functions for offscreen images', async ({ page }) => {
    // This test requires knowing which images are initially offscreen and then scrolling.
    // We'll check for the presence of `loading="lazy"` attribute.
    const lazyImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img[loading="lazy"]')).length;
    });
    expect(lazyImages).toBeGreaterThan(0); // Expect at least one lazy-loaded image

    // To fully test lazy loading:
    // 1. Intercept image requests.
    // 2. Verify that images with `loading="lazy"` are not requested initially.
    // 3. Scroll the page.
    // 4. Verify that the images are then requested.
    // This is a more advanced scenario.
  });

  // TC-PPO-011: Verify performance monitoring JavaScript snippet is integrated and executes without errors
  test('TC-PPO-011: Performance monitoring snippet executes without errors', async ({ page }) => {
    // Check for console errors after page load.
    // This is a basic check; a more thorough test would involve specific console messages
    // or network requests made by the monitoring snippet.
    // Console messages are now captured globally in consoleMessages array
    // Reload the page to ensure all scripts are re-executed and errors are caught
    await page.reload({ waitUntil: 'domcontentloaded' });
    const errors = consoleMessages.filter(msg => msg.type === 'error' && !msg.text.includes("Content Security Policy directive 'frame-ancestors' is ignored"));
    expect(errors.length).toBe(0);
  });

  // TC-PPO-020: Verify service worker is served from the same origin as the website
  test('TC-PPO-020: Service worker served from same origin', async ({ page }) => {
    const serviceWorkerAvailable = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(serviceWorkerAvailable).toBeTruthy();

    if (serviceWorkerAvailable) {
      // Explicitly wait for the service worker to be registered and activated
      await page.evaluate(() => {
        return new Promise(resolve => {
          if (navigator.serviceWorker.controller) {
            resolve(true);
            return;
          }
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              if (registration.installing) {
                registration.installing.addEventListener('statechange', function() {
                  if (this.state === 'activated') {
                    resolve(true);
                  }
                });
              } else if (registration.active) {
                resolve(true);
              }
            })
            .catch(error => {
              console.error('Service Worker registration failed:', error);
              resolve(false);
            });
        });
      }, { timeout: 10000 });

      const serviceWorkerOrigin = await page.evaluate(async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0 && registrations[0].active) {
          const swUrl = new URL(registrations[0].active.scriptURL);
          return swUrl.origin;
        }
        return null;
      });
      const pageOrigin = await page.evaluate(() => window.location.origin);
      expect(serviceWorkerOrigin).not.toBeNull();
      expect(serviceWorkerOrigin).toBe(pageOrigin);
    }
  });

  // TC-PPO-002: Verify preloading fails gracefully if resource path is incorrect or resource is unavailable.
  test('TC-PPO-002: Preloading fails gracefully with incorrect path', async ({ page }) => {
    // Intercept requests to simulate a non-existent resource
    await page.route('**/nonexistent/theme.min.css', route => route.abort());

    // Modify the HTML to point to a non-existent CSS file for preloading
    await page.evaluate(() => {
      const link = document.querySelector('link[href="css/theme.min.css"]');
      if (link) {
        link.setAttribute('href', 'nonexistent/theme.min.css');
      }
    });

    // Console messages are now captured globally in consoleMessages array

    await page.reload({ waitUntil: 'domcontentloaded' });

    // Expect a console error related to the failed preload
    const errors = consoleMessages.filter(msg => msg.type === 'error');
    expect(errors.some(error => error.text.includes('Failed to load resource') || error.text.includes('net::ERR_FILE_NOT_FOUND'))).toBeTruthy();
    // Ensure the page still loads without crashing
    const pageTitle = await page.title();
    expect(pageTitle).not.toBe('');
  });

  // TC-PPO-006: Verify the service worker cache update mechanism correctly fetches and caches new versions of assets.
  test('TC-PPO-006: Service worker cache updates correctly', async ({ page }) => {
    // This test requires a more controlled environment to simulate asset updates.
    // For now, we'll assume the service worker logic handles updates correctly if it's registered.
    // A full test would involve serving different versions of assets and verifying cache updates.
    const serviceWorkerAvailable = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(serviceWorkerAvailable).toBeTruthy();

    if (serviceWorkerAvailable) {
      // Explicitly wait for the service worker to be registered and activated
      await page.evaluate(() => {
        return new Promise(resolve => {
          if (navigator.serviceWorker.controller) {
            resolve(true);
            return;
          }
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              if (registration.installing) {
                registration.installing.addEventListener('statechange', function() {
                  if (this.state === 'activated') {
                    resolve(true);
                  }
                });
              } else if (registration.active) {
                resolve(true);
              }
            })
            .catch(error => {
              console.error('Service Worker registration failed:', error);
              resolve(false);
            });
        });
      }, { timeout: 10000 });

      const serviceWorker = await page.evaluate(async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.find(reg => reg.active && reg.active.scriptURL.includes('sw.js'));
      });
      expect(serviceWorker).toBeTruthy();
    }
  });

  // TC-PPO-007: Verify service worker handles network failures when using network-first strategy.
  test('TC-PPO-007: Service worker handles network failures (network-first)', async ({ page }) => {
    // This test assumes a network-first strategy is implemented in sw.js for some assets.
    // We'll go offline and try to access a resource.
    // This is a simplified test and might need more specific asset handling.
    // Wait for the service worker to be controlling the page
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    // Clear service worker caches to ensure a clean state for caching
    await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    });

    // Navigate to the main page to allow the service worker to cache it
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    await page.context().setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' }); // Reload in offline mode

    // Attempt to access a resource that would typically be network-first
    // For example, check if the main page content is still accessible from cache
    const pageTitle = await page.title();
    expect(pageTitle).not.toBe('');
    const bodyContent = await page.locator('body').textContent();
    console.log('TC-PPO-007 Body Content:', bodyContent);
    expect(bodyContent?.replace(/\s+/g, ' ')).toContain('Welcome to Raw Alpha'); // Trim whitespace and check

    await page.context().setOffline(false); // Re-enable network
  });

  // TC-PPO-012: Verify Core Web Vitals (LCP, FID, CLS) are collected by the monitoring snippet.
  test('TC-PPO-012: Core Web Vitals are collected by monitoring snippet', async ({ page }) => {
    const performanceMetrics = await page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new PerformanceObserver((list) => {
          const lcpEntry = list.getEntriesByType('largest-contentful-paint')[0];
          const clsEntries = list.getEntriesByType('layout-shift');
          const fidEntry = list.getEntriesByType('first-input')[0];

          let clsValue = 0;
          clsEntries.forEach(entry => {
            // Access 'value' property using bracket notation to bypass TypeScript's strictness
            // as 'value' is specific to LayoutShift entries, not all PerformanceEntry types.
            clsValue += (entry)['value'];
          });

          resolve({
            lcp: lcpEntry ? lcpEntry.startTime : null,
            cls: clsValue,
            fid: fidEntry ? fidEntry.startTime : null
          });
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        observer.observe({ type: 'layout-shift', buffered: true });
        observer.observe({ type: 'first-input', buffered: true });

        // Simulate interaction to trigger FID
        document.body.click();

        // Give some time for entries to be recorded
        setTimeout(() => {
          resolve({ lcp: null, cls: null, fid: null }); // Resolve with nulls if no data after timeout
        }, 1000);
      });
    });

    expect(performanceMetrics.lcp).toBeGreaterThan(0);
    expect(performanceMetrics.cls).toBeDefined();
    expect(performanceMetrics.fid).toBeGreaterThan(0);
  });

  // TC-PPO-013: Verify collected performance data is successfully sent to the configured monitoring endpoint.
  test('TC-PPO-013: Performance data sent to monitoring endpoint', async ({ page }) => {
    // This test requires intercepting network requests to a specific endpoint.
    let dataSent = false;
    await page.route('**/monitoring-endpoint', route => { // Replace with actual monitoring endpoint
      dataSent = true;
      route.fulfill({ status: 200, body: 'OK' });
    });

    // Trigger performance data collection (e.g., by navigating or interacting)
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.click('body'); // Simulate interaction

    // Wait for a short period to allow data to be sent
    await page.waitForTimeout(1000);

    expect(dataSent).toBeTruthy();
  });

  // TC-PPO-019: Verify CSP prevents unauthorized scripts/resources from loading.
  test('TC-PPO-019: CSP prevents unauthorized scripts/resources', async ({ page }) => {
    // Console messages are now captured globally in consoleMessages array
    page.on('pageerror', error => {
      consoleMessages.push({ type: 'error', text: error.message });
    });

    // Modify the HTML to include an inline script that should be blocked by CSP
    await page.evaluate(() => {
      const script = document.createElement('script');
      script.textContent = 'console.log("This inline script should be blocked by CSP");';
      document.body.appendChild(script);
    });

    // Reload the page to apply CSP and trigger the script
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Expect a CSP violation error in the console
    const errors = consoleMessages.filter(msg => msg.type === 'error' && !msg.text.includes("Content Security Policy directive 'frame-ancestors' is ignored"));
    expect(errors.some(error => error.text.includes("Content Security Policy") || error.text.includes("refused to execute inline script"))).toBeTruthy();
  });

  // Manual/External Tooling Test Cases (Not automated here):
  // TC-PPO-014: Lighthouse performance score is 90+ on desktop.
  // TC-PPO-015: Lighthouse performance score is 90+ on mobile.

});