/// <reference types="cypress" />

describe.skip('login', () => {
    before(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier"    // Firefox
        ])
        
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it('deve logar com sucesso', () => {
        cy.acessarPgLogin() 
        cy.loginTwygoAutomacao()
	})
})