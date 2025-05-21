module.exports = {
    root: true,
    plugins: ['cypress'],
    extends: [
        'plugin:cypress/recommended',
        'plugin:prettier/recommended'
      ],
    rules: {
      // Regras personalizadas para o projeto
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'semi': ['error', 'never'],
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/assertion-before-screenshot': 'warn',
      'cypress/no-force': 'warn',
      'cypress/no-async-tests': 'error'
    },
    env: {
      'cypress/globals': true
    }
  }