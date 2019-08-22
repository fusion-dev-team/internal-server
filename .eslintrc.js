module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-use-before-define': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'camelcase': 'off',
    'no-continue': 'off',
    'no-case-declarations': 'off',
    'consistent-return': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-bitwise': 'off',
    'no-console': 'off',
    'no-restricted-globals': 'off',
    'no-prototype-builtins': 'off',
    'class-methods-use-this': 'off',
  },
};
