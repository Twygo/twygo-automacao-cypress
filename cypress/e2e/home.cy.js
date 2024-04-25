/// <reference types="cypress" />

describe('pagina inicial', () => {
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

	it('Twygo deve estar online e abrir pagina de login', () => {
		cy.acessarPgLogin()
	})
})