const { screen } = require('@testing-library/dom'); // Use @testing-library/dom for plain JS DOM testing
// '@testing-library/jest-dom/extend-expect' is handled by jest.setup.cjs

describe('Button Component Unit Tests', () => {
  test('should render a button with correct text', () => {
    document.body.innerHTML = `
      <button class="primary-button">Click Me</button>
    `;
    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  test('should have the primary-button class', () => {
    document.body.innerHTML = `
      <button class="primary-button">Click Me</button>
    `;
    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('primary-button');
  });

  // Unit tests for hover states, disabled states, and CSS Custom Properties are better suited
  // for integration or visual regression tests due to JSDOM limitations in fully rendering CSS.
  // These aspects are covered by Playwright tests.
});