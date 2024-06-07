// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

before(() => {
  // Define resolução padrão
  cy.viewport(1920, 1080)

  // Carrega os labels do arquivo JSON
  cy.fixture('labels.json').then((labels) => {
    Cypress.env('labels', labels)
  })

  // Ignora mensagens de erro conhecidas
  cy.ignorarCapturaErros([
    "Unexpected identifier 'id'"
  ])

  cy.configTodosCamposCustomizados('Desabilitado')
})

afterEach(() => {
  // Ativa captura de erros
  cy.ativarCapturaErros()
})