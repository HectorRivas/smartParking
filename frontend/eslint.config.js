// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    extends: ['plugin:react/recommended', 'plugin:react-native/all', 'prettier'],
    rules: {
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react-native/no-inline-styles': 'off', // Allow inline styles
      'react-native/split-platform-components': 'off', // Allow platform-specific file extensions
      'react-native/no-raw-text': 'off', // Allow raw text outside of Text components
      'prettier/prettier': 'error',
    },
  }
]);
