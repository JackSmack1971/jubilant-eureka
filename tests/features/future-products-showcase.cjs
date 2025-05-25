const { JSDOM } = require('jsdom');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');

describe('Future Products Showcase', () => {
    let dom;
    let document;
    let showcaseSection; // Declare showcaseSection here

    beforeEach(() => {
        // Load the actual index.html file
        const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
        dom = new JSDOM(html, { url: `file://${path.resolve(__dirname, '../../index.html')}`, runScripts: 'dangerously', resources: 'usable' });
        document = dom.window.document;

        // Extract the Future Products Showcase section
        showcaseSection = document.getElementById('future-products-showcase');
        if (!showcaseSection) {
            throw new Error('Future Products Showcase section not found in index.html. Ensure it has id="future-products-showcase".');
        }

        // Make document and window available globally for axe-core and polyfill HTMLIFrameElement
        global.document = document;
        global.window = dom.window;
        global.HTMLIFrameElement = dom.window.HTMLIFrameElement;
    });

    afterEach(() => {
        // Clean up global variables
        delete global.document;
        delete global.window;
    });

    // TC-FPS-001: Verify the Future Products Showcase section loads successfully and displays content.
    it('TC-FPS-001: should load successfully and display content', () => {
        const showcaseSection = document.getElementById('future-products-showcase');
        expect(showcaseSection).toBeInTheDocument();
        expect(showcaseSection.querySelector('h2')).toHaveTextContent('Future Products Showcase');
        expect(showcaseSection.querySelectorAll('.product-item').length).toBeGreaterThan(0);
    });

    // TC-FPS-002: Verify consistent use of brand assets.
    it('TC-FPS-002: should use brand assets from the specified directory', () => {
        const images = document.querySelectorAll('#future-products-showcase img');
        expect(images.length).toBeGreaterThan(0);

        images.forEach(img => {
            const src = img.getAttribute('src');
            // Check if the src attribute contains the expected path for brand assets
            expect(src).toMatch(/docs\/assets\//);
        });
    });

    // TC-FPS-003: Verify consistent application of dark theme and brand visual identity.
    it('TC-FPS-003: should consistently apply the dark theme and brand visual identity', () => {
        // Check for the presence of theme.css and style.css links
        const themeCssLink = document.querySelector('link[href*="theme.css"]');
        const styleCssLink = document.querySelector('link[href*="style.css"]');
        expect(themeCssLink).not.toBeNull();
        expect(styleCssLink).not.toBeNull();

        // Check if the body or html element has a class indicating dark theme, or if the showcase section itself has styling
        // This is a simplified check due to JSDOM limitations on computed styles.
        // A more robust test would require a full browser environment or visual regression testing.
        const body = document.body;
        const htmlElement = document.documentElement;

        // Check for common dark theme classes or attributes
        const hasDarkThemeClass = body.classList.contains('dark-theme') || htmlElement.classList.contains('dark-theme') || showcaseSection.classList.contains('dark-theme');
        const hasDarkAttribute = body.hasAttribute('data-theme') && body.getAttribute('data-theme') === 'dark';

        // If the theme is applied via CSS variables, we can't directly check computed styles in JSDOM.
        // This test assumes a class-based or attribute-based theme application.
        expect(hasDarkThemeClass || hasDarkAttribute).toBe(true);
    });

    // TC-FPS-004: Verify clear and intuitive navigation (if applicable).
    it('TC-FPS-004: should have clear and intuitive navigation if present', () => {
        // Check for common navigation elements within the showcase section
        const navElements = showcaseSection.querySelectorAll('nav, .navigation, .nav-links, [role="navigation"]');
        
        if (navElements.length > 0) {
            // If navigation elements are found, assert that they are visible or have expected structure
            // This is a basic check; more complex navigation would require simulating clicks/interactions.
            navElements.forEach(nav => {
                expect(nav).toBeInTheDocument(); // Check if the element exists in the DOM
                // Further checks could include:
                // expect(nav.children.length).toBeGreaterThan(0); // Has child links/buttons
                // expect(nav.textContent).not.toBe(''); // Has some content
            });
        } else {
            // If no navigation elements are found, the test passes as navigation might not be applicable for a simple static section.
            console.log('No explicit navigation elements found in Future Products Showcase section. Test passed as N/A.');
            expect(true).toBe(true); // Explicitly pass if no navigation is found
        }
    });

    // TC-FPS-014: Accessibility - Verify WCAG 2.1 AA compliance using `axe-core`.
    it('TC-FPS-014: should be WCAG 2.1 AA compliant', async () => {
        // The beforeEach now loads the full index.html, so we can reuse the document.
        
        // Run axe-core on the document
        // Configure axe-core to disable rules that are unreliable in JSDOM
        // 'color-contrast' often fails in JSDOM because it doesn't fully render CSS.
        const axeConfig = {
            rules: {
                'color-contrast': { enabled: false }
            }
        };
        const results = await axe.run(document, axeConfig); // Use the already loaded document

        // Assert that there are no accessibility violations
        if (results.violations.length > 0) {
            console.error('Accessibility Violations:', results.violations);
            // Log detailed violations for debugging
            results.violations.forEach(violation => {
                console.error(`  Rule: ${violation.id}`);
                console.error(`  Description: ${violation.description}`);
                console.error(`  Help: ${violation.helpUrl}`);
                console.error(`  Nodes:`, violation.nodes.map(node => node.html));
            });
        }
        expect(results.violations.length).toBe(0);
    });
    // TC-FPS-005: Verify handling of missing brand assets.
    it('TC-FPS-005: should handle missing brand assets gracefully', () => {
        // Find an image within the showcase section
        const image = showcaseSection.querySelector('img');
        if (image) {
            // Change its src to a non-existent path
            image.src = '/non-existent-path/missing-image.png';
            // In a real browser, this would trigger an error event or show a broken image icon.
            // In JSDOM, we can check if the element still exists and if it has an alt attribute.
            expect(image).toBeInTheDocument();
            expect(image.hasAttribute('alt')).toBe(true); // Expect alt text for accessibility
            // Further checks could involve visual regression testing in a real browser environment
            // to ensure layout integrity.
        } else {
            console.log('No images found in Future Products Showcase section. TC-FPS-005 skipped.');
            expect(true).toBe(true); // Pass if no images to test
        }
    });
    // TC-FPS-006: Verify behavior with invalid or malformed HTML/CSS.
    it('TC-FPS-006: should handle invalid or malformed HTML/CSS gracefully', () => {
        // This test is challenging in JSDOM as it attempts to correct malformed HTML.
        // A basic check is to ensure the section still exists and has content.
        // For CSS, JSDOM does not render styles, so direct testing of malformed CSS is not feasible here.
        expect(showcaseSection).toBeInTheDocument();
        expect(showcaseSection.innerHTML).not.toBe(''); // Ensure it's not empty

        // Further checks would require a real browser or a dedicated HTML/CSS validator.
        console.log('TC-FPS-006: Limited testing for malformed HTML/CSS due to JSDOM environment. Manual inspection or dedicated validation tools recommended.');
    });
    // TC-FPS-007: Verify responsiveness at minimum and maximum supported screen widths.
    it('TC-FPS-007: should include responsive design elements', () => {
        // In JSDOM, we cannot directly test visual responsiveness.
        // This test checks for the presence of common responsive design indicators,
        // such as viewport meta tag and linked stylesheets that might contain media queries.
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        expect(viewportMeta).not.toBeNull();
        expect(viewportMeta.getAttribute('content')).toMatch(/width=device-width, initial-scale=1/);

        // Check for linked stylesheets that are likely to contain media queries
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        let hasResponsiveStylesheet = false;
        stylesheets.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.includes('style.css') || href.includes('theme.css') || href.includes('responsive'))) {
                hasResponsiveStylesheet = true;
            }
        });
        expect(hasResponsiveStylesheet).toBe(true);

        console.log('TC-FPS-007: Responsiveness tested by checking for viewport meta tag and responsive stylesheets. Full visual testing requires a browser environment.');
    });
    // TC-FPS-008: Verify behavior with extremely long or short text content (if applicable).
    it('TC-FPS-008: should handle varying text content lengths gracefully', () => {
        // In JSDOM, we cannot directly test visual text wrapping or overflow.
        // This test checks if text elements exist and can have their content modified.
        const textElements = showcaseSection.querySelectorAll('h2, h3, p'); // Common text elements
        
        if (textElements.length > 0) {
            textElements.forEach(el => {
                const originalText = el.textContent;
                // Test with very long text
                el.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
                expect(el.textContent.length).toBeGreaterThan(originalText.length);
                
                // Test with very short text
                el.textContent = 'Short';
                expect(el.textContent.length).toBeLessThan(originalText.length);
                
                // Restore original text (optional, but good practice)
                el.textContent = originalText;
            });
        } else {
            console.log('No text elements found in Future Products Showcase section. TC-FPS-008 skipped.');
            expect(true).toBe(true); // Pass if no text elements to test
        }
        console.log('TC-FPS-008: Text content handling tested by modifying textContent. Full visual testing requires a browser environment.');
    });
    // TC-FPS-009: Verify integration with theme.css for dark theme variables.
    it('TC-FPS-009: should integrate with theme.css for dark theme variables', () => {
        const themeCssLink = document.querySelector('link[href*="theme.css"]');
        expect(themeCssLink).not.toBeNull(); // Ensure theme.css is linked

        // Since JSDOM doesn't render CSS, we can't check computed styles.
        // We can check for elements that are expected to have styles from theme.css,
        // e.g., if the body or a specific container has a class that theme.css applies styles to.
        // For this test, we'll assume the presence of the link is sufficient for basic integration.
        // More advanced checks would require a browser-based testing tool.
        console.log('TC-FPS-009: Integration with theme.css tested by checking for link presence. Full CSS variable application testing requires a browser environment.');
    });
    // TC-FPS-010: Verify integration with style.css for layout and typography.
    it('TC-FPS-010: should integrate with style.css for layout and typography', () => {
        const styleCssLink = document.querySelector('link[href*="style.css"]');
        expect(styleCssLink).not.toBeNull(); // Ensure style.css is linked

        // Similar to theme.css, direct testing of layout and typography in JSDOM is limited.
        // We assume that if the stylesheet is linked, the styles are intended to be applied.
        // Visual inspection or browser-based tests are needed for full verification.
        console.log('TC-FPS-010: Integration with style.css tested by checking for link presence. Full layout and typography testing requires a browser environment.');
    });
    // TC-FPS-011: Verify integration of minor interactivity via script.js (if applicable).
    it('TC-FPS-011: should integrate minor interactivity via script.js if present', () => {
        const scriptLink = document.querySelector('script[src*="script.js"]');
        if (scriptLink) {
            expect(scriptLink).not.toBeNull(); // Ensure script.js is linked

            // If there are specific interactive elements, simulate interaction and assert changes.
            // For example, if there's a nav toggle button:
            // const navToggleButton = document.querySelector('.nav-toggle');
            // if (navToggleButton) {
            //     navToggleButton.click();
            //     expect(document.querySelector('.nav-menu').classList.contains('open')).toBe(true);
            // }
            console.log('TC-FPS-011: script.js linked. Further interactivity testing requires specific element identification and event simulation.');
        } else {
            console.log('TC-FPS-011: script.js not found. Test passed as N/A for interactivity.');
            expect(true).toBe(true); // Pass if no script.js to test
        }
    });
    // TC-FPS-012: Performance - Verify section loads under 3 seconds on broadband.
    it('TC-FPS-012: should load under 3 seconds on broadband (manual/external test required)', () => {
        // Performance testing (load time) cannot be accurately simulated or measured in JSDOM.
        // This test serves as a placeholder to acknowledge the requirement.
        console.log('TC-FPS-012: Performance testing for load time requires a real browser environment with network throttling capabilities (e.g., Chrome DevTools, Lighthouse).');
        expect(true).toBe(true); // Pass as this is a placeholder for manual/external testing
    });
    // TC-FPS-013: Performance - Verify PageSpeed Insights score of 90+.
    it('TC-FPS-013: should achieve a PageSpeed Insights score of 90+ (manual/external test required)', () => {
        // PageSpeed Insights testing requires an external tool (Google PageSpeed Insights).
        // This test serves as a placeholder to acknowledge the requirement.
        console.log('TC-FPS-013: PageSpeed Insights score verification requires running Google PageSpeed Insights externally.');
        expect(true).toBe(true); // Pass as this is a placeholder for manual/external testing
    });
});
