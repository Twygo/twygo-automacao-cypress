/// <reference types="cypress" />

describe('login', () => {
    it('deve logar com sucesso', () => {
        cy.visit('https://automacao-karla.twygoead.com')

        cy.get('#user_email')
            .type('karla.oliveira@twygo.com')
    
        cy.get('#user_password')
            .type('aut123')

        cy.contains('button', 'Entrar')
            .should('be.visible')
            .click()

    	cy.contains('#page-breadcrumb', 'Dashboard')
      		.should('be.visible')

    	cy.contains('.name', 'Twygo Automação')
      		.should('be.visible')

    	cy.contains('#btn-profile', 'Aluno')
      		.should('be.visible')
	})
})