/// <reference types="cypress" />

describe.skip('login', () => {
    before(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier"    // Firefox
        ])
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it('deve logar com sucesso', () => {
        cy.acessarPgLogin() 
        cy.loginTwygoAutomacao()
	})
})