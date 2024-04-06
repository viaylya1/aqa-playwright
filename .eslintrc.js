module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-plusplus': 'off',
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'comma-dangle': ['error', 'never'],
    'import/extensions': 'off',
    'arrow-parens': ['error', 'always'],
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'linebreak-style': 'off',
    'import/prefer-default-export': 'off'
  }
};
