# Test info

- Name: Phase 2 Performance Optimization Tests >> TC-PPO-005: Offline access to cached content via service worker
- Location: C:\Projects\Raw Alpha v2\static-site\tests\features\phase-2-performance-optimization.spec.cjs:139:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Welcome to Raw Alpha"
Received string:    " Learn More Products Contact About Us Menu Unlock Your Potential with Raw Alpha Innovative solutions for a smarter future. Learn More Contact Us Learn More About Raw Alpha Raw Alpha is dedicated to providing cutting-edge solutions that empower businesses and individuals to achieve their full potential. Our innovative approach combines advanced technology with user-centric design to deliver seamless and impactful experiences. Discover how our services can transform your operations and drive future growth. We focus on creating sustainable and scalable solutions tailored to your unique needs. Future Products Showcase Product 1: Blockchain Service Alpha A revolutionary new blockchain service designed to enhance transparency and security in digital transactions. Product 2: Decentralized Finance Beta Next-gen DeFi solutions offering unparalleled financial freedom and accessibility. Product 3: AI-Powered Smart Contracts Intelligent contracts that automate agreements with enhanced efficiency and reduced risk. Contact Us Facebook Twitter LinkedIn Instagram GitHub Send Message Our contact form is coming soon! © 2025 Raw Alpha. All rights reserved. if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js') .then(registration => { console.log('Service Worker registered with scope:', registration.scope); }) .catch(error => { console.error('Service Worker registration failed:', error); }); }); } else { console.log('Service Worker not supported in this browser.'); } "
    at C:\Projects\Raw Alpha v2\static-site\tests\features\phase-2-performance-optimization.spec.cjs:163:47
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
   63 |               }
   64 |             })
   65 |             .catch(error => {
   66 |               console.error('Service Worker registration failed:', error);
   67 |               resolve(false); // Resolve with false on error
   68 |             });
   69 |         });
   70 |       }, { timeout: 10000 }); // Increased timeout for service worker activation
   71 |
   72 |       const serviceWorker = await page.evaluate(async () => {
   73 |         const registrations = await navigator.serviceWorker.getRegistrations();
   74 |         return registrations.find(reg => reg.active && reg.active.scriptURL.includes('sw.js'));
   75 |       });
   76 |       expect(serviceWorker).toBeTruthy();
   77 |       if (serviceWorker && serviceWorker.active) { // Add null check for serviceWorker.active
   78 |         expect(serviceWorker.active.state).toBe('activated');
   79 |       }
   80 |     }
   81 |   });
   82 |
   83 |   // TC-PPO-004: Verify static assets are cached by the service worker after the first visit
   84 |   test('TC-PPO-004: Static assets are cached by service worker after first visit', async ({ page }) => {
   85 |     // This test requires a more complex setup to simulate first and second visits
   86 |     // and inspect cache storage. Playwright's context and network interception can be used.
   87 |     // For simplicity, this test will verify the presence of a service worker and assume
   88 |     // caching logic is handled within sw.js. A more robust test would involve
   89 |     // inspecting `page.context().storageState()` or using `page.route` to check cache hits.
   90 |
   91 |     const serviceWorkerAvailable = await page.evaluate(() => 'serviceWorker' in navigator);
   92 |     expect(serviceWorkerAvailable).toBeTruthy();
   93 |
   94 |     if (serviceWorkerAvailable) {
   95 |       // Explicitly wait for the service worker to be registered and activated
   96 |       await page.evaluate(() => {
   97 |         return new Promise(resolve => {
   98 |           if (navigator.serviceWorker.controller) {
   99 |             resolve(true);
  100 |             return;
  101 |           }
  102 |           navigator.serviceWorker.register('/sw.js')
  103 |             .then(registration => {
  104 |               if (registration.installing) {
  105 |                 registration.installing.addEventListener('statechange', function() {
  106 |                   if (this.state === 'activated') {
  107 |                     resolve(true);
  108 |                   }
  109 |                 });
  110 |               } else if (registration.active) {
  111 |                 resolve(true);
  112 |               }
  113 |             })
  114 |             .catch(error => {
  115 |               console.error('Service Worker registration failed:', error);
  116 |               resolve(false);
  117 |             });
  118 |         });
  119 |       }, { timeout: 10000 });
  120 |
  121 |       const serviceWorker = await page.evaluate(async () => {
  122 |         const registrations = await navigator.serviceWorker.getRegistrations();
  123 |         return registrations.find(reg => reg.active && reg.active.scriptURL.includes('sw.js'));
  124 |       });
  125 |       expect(serviceWorker).toBeTruthy();
  126 |       if (serviceWorker && serviceWorker.active) {
  127 |         expect(serviceWorker.active.state).toBe('activated');
  128 |       }
  129 |     }
  130 |
  131 |     // A more advanced test would involve:
  132 |     // 1. Navigating to the page.
  133 |     // 2. Waiting for service worker to activate and cache assets.
  134 |     // 3. Reloading the page with network interception to check if assets are served from cache.
  135 |     // This is beyond the scope of a simple initial implementation.
  136 |   });
  137 |
  138 |   // TC-PPO-005: Verify offline access to cached content using the service worker
  139 |   test('TC-PPO-005: Offline access to cached content via service worker', async ({ page }) => {
  140 |     // This test requires the service worker to be fully functional and caching assets.
  141 |     // We'll simulate offline mode and check if the page still loads.
  142 |     // Wait for the service worker to be controlling the page
  143 |     await page.waitForFunction(() => navigator.serviceWorker.controller);
  144 |     // Clear service worker caches to ensure a clean state for caching
  145 |     await page.evaluate(async () => {
  146 |       const cacheNames = await caches.keys();
  147 |       await Promise.all(cacheNames.map(name => caches.delete(name)));
  148 |     });
  149 |
  150 |     // Navigate to the main page to allow the service worker to cache it
  151 |     await page.goto('/');
  152 |     await page.waitForLoadState('networkidle');
  153 |     await page.waitForFunction(() => navigator.serviceWorker.controller);
  154 |
  155 |     await page.context().setOffline(true);
  156 |     await page.reload({ waitUntil: 'domcontentloaded' }); // Reload in offline mode
  157 |
  158 |     // Check if the main content is still visible, indicating successful offline load
  159 |     const pageTitle = await page.title();
  160 |     expect(pageTitle).not.toBe(''); // Page should have a title
  161 |     const bodyContent = await page.locator('body').textContent();
  162 |     console.log('TC-PPO-005 Body Content:', bodyContent);
> 163 |     expect(bodyContent?.replace(/\s+/g, ' ')).toContain('Welcome to Raw Alpha'); // Trim whitespace and check
      |                                               ^ Error: expect(received).toContain(expected) // indexOf
  164 |     await page.context().setOffline(false); // Re-enable network for subsequent tests
  165 |   });
  166 |
  167 |   // TC-PPO-008: Verify optimal image formats are delivered based on browser support
  168 |   test('TC-PPO-008: Optimal image formats delivered based on browser support', async ({ page }) => {
  169 |     // This test is challenging to automate generically as it depends on browser capabilities
  170 |     // and the specific image formats used. Playwright runs in Chromium, Firefox, WebKit.
  171 |     // We can check if <picture> elements are used and if the browser loads a modern format.
  172 |     const imageSources = await page.evaluate(() => {
  173 |       return Array.from(document.querySelectorAll('picture source'))
  174 |         .map(source => source.getAttribute('srcset'));
  175 |     });
  176 |     // Expect at least one modern image format (e.g., .webp or .avif) in the srcset
  177 |     const hasModernFormat = imageSources.some(src => src && (src.includes('.webp') || src.includes('.avif')));
  178 |     expect(hasModernFormat).toBeTruthy();
  179 |
  180 |     // A more precise test would involve intercepting network requests for images
  181 |     // and verifying the `Content-Type` header, but this requires a server setup.
  182 |   });
  183 |
  184 |   // TC-PPO-009: Verify images are served at appropriate resolutions for the viewing device/viewport
  185 |   test('TC-PPO-009: Images served at appropriate resolutions for viewport', async ({ page }) => {
  186 |     // This test requires changing viewport sizes and checking loaded image dimensions.
  187 |     // We'll check for the presence of `srcset` or `sizes` attributes on images.
  188 |     const responsiveImages = await page.evaluate(() => {
  189 |       return Array.from(document.querySelectorAll('img[srcset], img[sizes], picture'))
  190 |         .map(img => img.tagName === 'IMG' ? img.getAttribute('srcset') || img.getAttribute('sizes') : 'picture element');
  191 |     });
  192 |     expect(responsiveImages.length).toBeGreaterThan(0); // Expect at least one responsive image setup
  193 |
  194 |     // To fully test this, one would need to:
  195 |     // 1. Set different viewports using `page.setViewportSize()`.
  196 |     // 2. Intercept image requests and check the requested image URL/dimensions.
  197 |     // This is more complex and might require a server to serve different resolutions.
  198 |   });
  199 |
  200 |   // TC-PPO-010: Verify loading="lazy" attribute functions correctly for offscreen images
  201 |   test('TC-PPO-010: Lazy loading functions for offscreen images', async ({ page }) => {
  202 |     // This test requires knowing which images are initially offscreen and then scrolling.
  203 |     // We'll check for the presence of `loading="lazy"` attribute.
  204 |     const lazyImages = await page.evaluate(() => {
  205 |       return Array.from(document.querySelectorAll('img[loading="lazy"]')).length;
  206 |     });
  207 |     expect(lazyImages).toBeGreaterThan(0); // Expect at least one lazy-loaded image
  208 |
  209 |     // To fully test lazy loading:
  210 |     // 1. Intercept image requests.
  211 |     // 2. Verify that images with `loading="lazy"` are not requested initially.
  212 |     // 3. Scroll the page.
  213 |     // 4. Verify that the images are then requested.
  214 |     // This is a more advanced scenario.
  215 |   });
  216 |
  217 |   // TC-PPO-011: Verify performance monitoring JavaScript snippet is integrated and executes without errors
  218 |   test('TC-PPO-011: Performance monitoring snippet executes without errors', async ({ page }) => {
  219 |     // Check for console errors after page load.
  220 |     // This is a basic check; a more thorough test would involve specific console messages
  221 |     // or network requests made by the monitoring snippet.
  222 |     // Console messages are now captured globally in consoleMessages array
  223 |     // Reload the page to ensure all scripts are re-executed and errors are caught
  224 |     await page.reload({ waitUntil: 'domcontentloaded' });
  225 |     const errors = consoleMessages.filter(msg => msg.type === 'error' && !msg.text.includes("Content Security Policy directive 'frame-ancestors' is ignored"));
  226 |     expect(errors.length).toBe(0);
  227 |   });
  228 |
  229 |   // TC-PPO-020: Verify service worker is served from the same origin as the website
  230 |   test('TC-PPO-020: Service worker served from same origin', async ({ page }) => {
  231 |     const serviceWorkerAvailable = await page.evaluate(() => 'serviceWorker' in navigator);
  232 |     expect(serviceWorkerAvailable).toBeTruthy();
  233 |
  234 |     if (serviceWorkerAvailable) {
  235 |       // Explicitly wait for the service worker to be registered and activated
  236 |       await page.evaluate(() => {
  237 |         return new Promise(resolve => {
  238 |           if (navigator.serviceWorker.controller) {
  239 |             resolve(true);
  240 |             return;
  241 |           }
  242 |           navigator.serviceWorker.register('/sw.js')
  243 |             .then(registration => {
  244 |               if (registration.installing) {
  245 |                 registration.installing.addEventListener('statechange', function() {
  246 |                   if (this.state === 'activated') {
  247 |                     resolve(true);
  248 |                   }
  249 |                 });
  250 |               } else if (registration.active) {
  251 |                 resolve(true);
  252 |               }
  253 |             })
  254 |             .catch(error => {
  255 |               console.error('Service Worker registration failed:', error);
  256 |               resolve(false);
  257 |             });
  258 |         });
  259 |       }, { timeout: 10000 });
  260 |
  261 |       const serviceWorkerOrigin = await page.evaluate(async () => {
  262 |         const registrations = await navigator.serviceWorker.getRegistrations();
  263 |         if (registrations.length > 0 && registrations[0].active) {
```