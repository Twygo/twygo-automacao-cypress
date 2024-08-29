/// <reference types="cypress" />

describe.skip('login', () => {
    it('deve logar com sucesso', () => {
        cy.acessarPgLogin() 
        cy.loginTwygoAutomacao()
	})
})