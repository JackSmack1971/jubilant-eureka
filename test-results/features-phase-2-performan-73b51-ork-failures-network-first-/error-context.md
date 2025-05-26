# Test info

- Name: Phase 2 Performance Optimization Tests >> TC-PPO-007: Service worker handles network failures (network-first)
- Location: C:\Projects\Raw Alpha v2\static-site\tests\features\phase-2-performance-optimization.spec.cjs:344:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Welcome to Raw Alpha"
Received string:    " Learn More Products Contact About Us Menu Unlock Your Potential with Raw Alpha Innovative solutions for a smarter future. Learn More Contact Us Learn More About Raw Alpha Raw Alpha is dedicated to providing cutting-edge solutions that empower businesses and individuals to achieve their full potential. Our innovative approach combines advanced technology with user-centric design to deliver seamless and impactful experiences. Discover how our services can transform your operations and drive future growth. We focus on creating sustainable and scalable solutions tailored to your unique needs. Future Products Showcase Product 1: Blockchain Service Alpha A revolutionary new blockchain service designed to enhance transparency and security in digital transactions. Product 2: Decentralized Finance Beta Next-gen DeFi solutions offering unparalleled financial freedom and accessibility. Product 3: AI-Powered Smart Contracts Intelligent contracts that automate agreements with enhanced efficiency and reduced risk. Contact Us Facebook Twitter LinkedIn Instagram GitHub Send Message Our contact form is coming soon! © 2025 Raw Alpha. All rights reserved. if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js') .then(registration => { console.log('Service Worker registered with scope:', registration.scope); }) .catch(error => { console.error('Service Worker registration failed:', error); }); }); } else { console.log('Service Worker not supported in this browser.'); } "
    at C:\Projects\Raw Alpha v2\static-site\tests\features\phase-2-performance-optimization.spec.cjs:370:47
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
  270 |       expect(serviceWorkerOrigin).not.toBeNull();
  271 |       expect(serviceWorkerOrigin).toBe(pageOrigin);
  272 |     }
  273 |   });
  274 |
  275 |   // TC-PPO-002: Verify preloading fails gracefully if resource path is incorrect or resource is unavailable.
  276 |   test('TC-PPO-002: Preloading fails gracefully with incorrect path', async ({ page }) => {
  277 |     // Intercept requests to simulate a non-existent resource
  278 |     await page.route('**/nonexistent/theme.min.css', route => route.abort());
  279 |
  280 |     // Modify the HTML to point to a non-existent CSS file for preloading
  281 |     await page.evaluate(() => {
  282 |       const link = document.querySelector('link[href="css/theme.min.css"]');
  283 |       if (link) {
  284 |         link.setAttribute('href', 'nonexistent/theme.min.css');
  285 |       }
  286 |     });
  287 |
  288 |     // Console messages are now captured globally in consoleMessages array
  289 |
  290 |     await page.reload({ waitUntil: 'domcontentloaded' });
  291 |
  292 |     // Expect a console error related to the failed preload
  293 |     const errors = consoleMessages.filter(msg => msg.type === 'error');
  294 |     expect(errors.some(error => error.text.includes('Failed to load resource') || error.text.includes('net::ERR_FILE_NOT_FOUND'))).toBeTruthy();
  295 |     // Ensure the page still loads without crashing
  296 |     const pageTitle = await page.title();
  297 |     expect(pageTitle).not.toBe('');
  298 |   });
  299 |
  300 |   // TC-PPO-006: Verify the service worker cache update mechanism correctly fetches and caches new versions of assets.
  301 |   test('TC-PPO-006: Service worker cache updates correctly', async ({ page }) => {
  302 |     // This test requires a more controlled environment to simulate asset updates.
  303 |     // For now, we'll assume the service worker logic handles updates correctly if it's registered.
  304 |     // A full test would involve serving different versions of assets and verifying cache updates.
  305 |     const serviceWorkerAvailable = await page.evaluate(() => 'serviceWorker' in navigator);
  306 |     expect(serviceWorkerAvailable).toBeTruthy();
  307 |
  308 |     if (serviceWorkerAvailable) {
  309 |       // Explicitly wait for the service worker to be registered and activated
  310 |       await page.evaluate(() => {
  311 |         return new Promise(resolve => {
  312 |           if (navigator.serviceWorker.controller) {
  313 |             resolve(true);
  314 |             return;
  315 |           }
  316 |           navigator.serviceWorker.register('/sw.js')
  317 |             .then(registration => {
  318 |               if (registration.installing) {
  319 |                 registration.installing.addEventListener('statechange', function() {
  320 |                   if (this.state === 'activated') {
  321 |                     resolve(true);
  322 |                   }
  323 |                 });
  324 |               } else if (registration.active) {
  325 |                 resolve(true);
  326 |               }
  327 |             })
  328 |             .catch(error => {
  329 |               console.error('Service Worker registration failed:', error);
  330 |               resolve(false);
  331 |             });
  332 |         });
  333 |       }, { timeout: 10000 });
  334 |
  335 |       const serviceWorker = await page.evaluate(async () => {
  336 |         const registrations = await navigator.serviceWorker.getRegistrations();
  337 |         return registrations.find(reg => reg.active && reg.active.scriptURL.includes('sw.js'));
  338 |       });
  339 |       expect(serviceWorker).toBeTruthy();
  340 |     }
  341 |   });
  342 |
  343 |   // TC-PPO-007: Verify service worker handles network failures when using network-first strategy.
  344 |   test('TC-PPO-007: Service worker handles network failures (network-first)', async ({ page }) => {
  345 |     // This test assumes a network-first strategy is implemented in sw.js for some assets.
  346 |     // We'll go offline and try to access a resource.
  347 |     // This is a simplified test and might need more specific asset handling.
  348 |     // Wait for the service worker to be controlling the page
  349 |     await page.waitForFunction(() => navigator.serviceWorker.controller);
  350 |     // Clear service worker caches to ensure a clean state for caching
  351 |     await page.evaluate(async () => {
  352 |       const cacheNames = await caches.keys();
  353 |       await Promise.all(cacheNames.map(name => caches.delete(name)));
  354 |     });
  355 |
  356 |     // Navigate to the main page to allow the service worker to cache it
  357 |     await page.goto('/');
  358 |     await page.waitForLoadState('networkidle');
  359 |     await page.waitForFunction(() => navigator.serviceWorker.controller);
  360 |
  361 |     await page.context().setOffline(true);
  362 |     await page.reload({ waitUntil: 'domcontentloaded' }); // Reload in offline mode
  363 |
  364 |     // Attempt to access a resource that would typically be network-first
  365 |     // For example, check if the main page content is still accessible from cache
  366 |     const pageTitle = await page.title();
  367 |     expect(pageTitle).not.toBe('');
  368 |     const bodyContent = await page.locator('body').textContent();
  369 |     console.log('TC-PPO-007 Body Content:', bodyContent);
> 370 |     expect(bodyContent?.replace(/\s+/g, ' ')).toContain('Welcome to Raw Alpha'); // Trim whitespace and check
      |                                               ^ Error: expect(received).toContain(expected) // indexOf
  371 |
  372 |     await page.context().setOffline(false); // Re-enable network
  373 |   });
  374 |
  375 |   // TC-PPO-012: Verify Core Web Vitals (LCP, FID, CLS) are collected by the monitoring snippet.
  376 |   test('TC-PPO-012: Core Web Vitals are collected by monitoring snippet', async ({ page }) => {
  377 |     const performanceMetrics = await page.evaluate(() => {
  378 |       return new Promise(resolve => {
  379 |         const observer = new PerformanceObserver((list) => {
  380 |           const lcpEntry = list.getEntriesByType('largest-contentful-paint')[0];
  381 |           const clsEntries = list.getEntriesByType('layout-shift');
  382 |           const fidEntry = list.getEntriesByType('first-input')[0];
  383 |
  384 |           let clsValue = 0;
  385 |           clsEntries.forEach(entry => {
  386 |             // Access 'value' property using bracket notation to bypass TypeScript's strictness
  387 |             // as 'value' is specific to LayoutShift entries, not all PerformanceEntry types.
  388 |             clsValue += (entry)['value'];
  389 |           });
  390 |
  391 |           resolve({
  392 |             lcp: lcpEntry ? lcpEntry.startTime : null,
  393 |             cls: clsValue,
  394 |             fid: fidEntry ? fidEntry.startTime : null
  395 |           });
  396 |         });
  397 |
  398 |         observer.observe({ type: 'largest-contentful-paint', buffered: true });
  399 |         observer.observe({ type: 'layout-shift', buffered: true });
  400 |         observer.observe({ type: 'first-input', buffered: true });
  401 |
  402 |         // Simulate interaction to trigger FID
  403 |         document.body.click();
  404 |
  405 |         // Give some time for entries to be recorded
  406 |         setTimeout(() => {
  407 |           resolve({ lcp: null, cls: null, fid: null }); // Resolve with nulls if no data after timeout
  408 |         }, 1000);
  409 |       });
  410 |     });
  411 |
  412 |     expect(performanceMetrics.lcp).toBeGreaterThan(0);
  413 |     expect(performanceMetrics.cls).toBeDefined();
  414 |     expect(performanceMetrics.fid).toBeGreaterThan(0);
  415 |   });
  416 |
  417 |   // TC-PPO-013: Verify collected performance data is successfully sent to the configured monitoring endpoint.
  418 |   test('TC-PPO-013: Performance data sent to monitoring endpoint', async ({ page }) => {
  419 |     // This test requires intercepting network requests to a specific endpoint.
  420 |     let dataSent = false;
  421 |     await page.route('**/monitoring-endpoint', route => { // Replace with actual monitoring endpoint
  422 |       dataSent = true;
  423 |       route.fulfill({ status: 200, body: 'OK' });
  424 |     });
  425 |
  426 |     // Trigger performance data collection (e.g., by navigating or interacting)
  427 |     await page.reload({ waitUntil: 'domcontentloaded' });
  428 |     await page.click('body'); // Simulate interaction
  429 |
  430 |     // Wait for a short period to allow data to be sent
  431 |     await page.waitForTimeout(1000);
  432 |
  433 |     expect(dataSent).toBeTruthy();
  434 |   });
  435 |
  436 |   // TC-PPO-019: Verify CSP prevents unauthorized scripts/resources from loading.
  437 |   test('TC-PPO-019: CSP prevents unauthorized scripts/resources', async ({ page }) => {
  438 |     // Console messages are now captured globally in consoleMessages array
  439 |     page.on('pageerror', error => {
  440 |       consoleMessages.push({ type: 'error', text: error.message });
  441 |     });
  442 |
  443 |     // Modify the HTML to include an inline script that should be blocked by CSP
  444 |     await page.evaluate(() => {
  445 |       const script = document.createElement('script');
  446 |       script.textContent = 'console.log("This inline script should be blocked by CSP");';
  447 |       document.body.appendChild(script);
  448 |     });
  449 |
  450 |     // Reload the page to apply CSP and trigger the script
  451 |     await page.reload({ waitUntil: 'domcontentloaded' });
  452 |
  453 |     // Expect a CSP violation error in the console
  454 |     const errors = consoleMessages.filter(msg => msg.type === 'error' && !msg.text.includes("Content Security Policy directive 'frame-ancestors' is ignored"));
  455 |     expect(errors.some(error => error.text.includes("Content Security Policy") || error.text.includes("refused to execute inline script"))).toBeTruthy();
  456 |   });
  457 |
  458 |   // Manual/External Tooling Test Cases (Not automated here):
  459 |   // TC-PPO-014: Lighthouse performance score is 90+ on desktop.
  460 |   // TC-PPO-015: Lighthouse performance score is 90+ on mobile.
  461 |
  462 | });
```