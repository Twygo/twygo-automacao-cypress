///<reference types="cypress" />
import 'cypress-real-events/support'

describe('limpar dados da organização', ()=> {
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

	it('deve limpar os dados da organização', () => {
		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		
		// Acessar menu da Sophia
		cy.get('img[src*="sophia"]')
			.eq(0)
			.click()

		// Selecionar a opção para excluir informações
		cy.get('#accordion-button-delete-info')
			.click()

		// Selecionar a opção para limpar todas as informações
		cy.get('.chakra-checkbox__control')
			.eq(3)
			.click()

		// Alternativa para navegar até o botão de excluir
		cy.realPress('Tab')

		cy.realType('{enter}')

		// Confirmar a ação de exclusão
		cy.contains('.flash.success', 'A exclusão está sendo realizada, aguarde alguns instantes.', { timeout: 40000 })
		.should('be.visible')	

		// Aguardar mensagem de confirmação de exclusão	
		cy.contains('.flash.success', 'Todos os dados solicitados foram excluídos, atualize a página.', { timeout: 40000 })
		.should('be.visible')		
	})
})