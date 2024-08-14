import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
// import airbnbBase from 'eslint-config-airbnb-base';

// // Load the Airbnb base configuration
// import airbnbBaseImport from 'eslint-config-airbnb-base/rules/imports';
// import airbnbBaseStyle from 'eslint-config-airbnb-base/rules/style';
// import airbnbBaseES6 from 'eslint-config-airbnb-base/rules/es6';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: tsParser, // Specify the TypeScript parser
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: airbnbBaseImport,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Add the recommended rules from the ESLint plugin
      ...tseslint.configs.recommended.rules, // Add the recommended rules from the TypeScript ESLint plugin
      ...airbnbBase.rules, // Add Airbnb base rules
      ...airbnbBaseImport.rules,
      ...airbnbBaseStyle.rules,
      ...airbnbBaseES6.rules,
      'no-console': 'warn', // Example custom rule
    },
  },
];
