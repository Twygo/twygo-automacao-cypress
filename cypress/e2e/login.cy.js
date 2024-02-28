/// <reference types="cypress" />

describe('login', () => {
  it('deve logar com sucesso', () => {
    cy.visit('https://automacao-karla.stage.twygoead.com')

    cy.get('#user_email')
      .type('karladaiany@automacao.com')
    
    cy.get('#user_password')
      .type('aut123')

    cy.contains('button', 'Entrar').click()

    //cy.title().should('eq', 'Dashboard')

    //cy.contains('.name', 'Twygo Automacao').should('eq', 'Twygo Automacao')
  })

})