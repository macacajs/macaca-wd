'use strict';

/* eslint-env node */
const eslintConfig = {
  extends: 'eslint-config-egg',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          [ '@', `${__dirname}/src` ],
        ],
        extensions: [ '.js', '.jsx', '.json' ],
      },
    },
  },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  plugins: [
    'import'
  ],
  ignorePatterns: [ '*.d.ts' ],
  rules: {
    'import/extensions': 0,
    'jsdoc/require-param-type': 0,
    'jsdoc/require-param-description': 0,
    'jsdoc/check-tag-names': 0,
    'jsdoc/require-returns-description': 0,
  },
  overrides: [],
};

module.exports = eslintConfig;
