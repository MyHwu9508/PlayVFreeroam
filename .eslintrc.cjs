/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/recommended', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/no-unresolved': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/no-cycle': 2,
    'import/no-deprecated': 1,
    'import/no-mutable-exports': 2,
    'import/first': 1,
    'import/no-named-default': 2,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
      node: true,
    },
  },
  root: true,
};
