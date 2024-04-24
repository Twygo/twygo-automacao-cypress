/// <reference types="cypress" />

describe('pagina inicial', () => {
	it('Twygo deve estar online e abrir pagina de login', () => {
		cy.acessarPgLogin()
	})
})