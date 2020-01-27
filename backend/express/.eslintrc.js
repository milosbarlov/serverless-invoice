module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unpublished-require': 'off',
    'no-console': 'off',

    'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'es5' }],
  },
};
