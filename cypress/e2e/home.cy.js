/// <reference types="cypress" />

describe('pagina inicial', () => {
  it('Twygo deve estar online e abrir pagina de login', () => {
    cy.visit('https://automacao-karla.stage.twygoead.com')

    cy.title().should('eq', 'Login - Automação')
  })
})