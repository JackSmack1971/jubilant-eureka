import globals from 'globals';
import pluginJs from '@eslint/js';
import standard from 'eslint-config-standard';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      // Add any specific rules from your .eslintrc.json here if they were in "rules"
    }
  },
];