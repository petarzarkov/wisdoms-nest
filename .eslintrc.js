module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.build.json'],
  },
  ignorePatterns: [
    '**/*.js',
    '**/*.d.ts',
    'node_modules',
    'dist',
    'tests',
    '**/*.md',
    '**/*.json',
    'coverage',
    'scripts',
    '**/*.spec.ts',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent': 'warn',
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/quotes': ['warn', 'double'],
    '@typescript-eslint/semi': ['warn', 'always'],
    'brace-style': ['warn', '1tbs'],
    curly: ['warn', 'multi-line'],
    'max-len': [
      'error',
      {
        code: 200,
      },
    ],
    'no-caller': 'warn',
    'no-constant-condition': 'warn',
    'no-control-regex': 'warn',
    'no-eval': 'error',
    'no-extra-semi': 'error',
    'no-invalid-regexp': 'error',
    'no-irregular-whitespace': 'warn',
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 1,
      },
    ],
    'no-octal': 'warn',
    'no-octal-escape': 'warn',
    'no-regex-spaces': 'warn',
    'no-restricted-syntax': ['error', 'ForInStatement'],
    'no-trailing-spaces': 'warn',
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
  },
};
