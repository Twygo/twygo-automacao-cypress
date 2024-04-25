/// <reference types="cypress" />

describe('login', () => {
    beforeEach(() => {
        // Ativa o tratamento de exceção não capturada especificamente para este teste
		Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
    })

    afterEach(() => {
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})

    it('deve logar com sucesso', () => {
        cy.acessarPgLogin() 

        cy.get('#user_email')
            .type(Cypress.env('login'))
    
        cy.get('#user_password')
            .type(Cypress.env('password'))

        cy.contains('button', 'Entrar')
            .should('be.visible')
            .click()

    	cy.contains('#page-breadcrumb', 'Dashboard')
      		.should('be.visible')

    	cy.contains('.name', Cypress.env('username'))
      		.should('be.visible')

    	cy.contains('#btn-profile', 'Aluno')
      		.should('be.visible')
	})
})