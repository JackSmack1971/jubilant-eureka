const { exec } = require('child_process');
const path = require('path');

describe('Stylelint CSS Linting', () => {
  test('style.css should pass stylelint checks', (done) => {
    const styleCssPath = path.join(__dirname, '../../css/style.css');
    const stylelintConfigPath = path.join(__dirname, '../../.stylelintrc.json');

    // Execute stylelint command
    exec(`npx stylelint "${styleCssPath}" --config "${stylelintConfigPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Stylelint errors found:\n${stdout}\n${stderr}`);
        return done(error);
      }
      if (stderr) {
        console.warn(`Stylelint warnings:\n${stderr}`);
      }
      expect(stdout).toBe(''); // Expect no output for successful linting
      done();
    });
  }, 30000); // Increase timeout for stylelint execution
});