///<reference types="cypress" />

describe('limpar dados da organização', ()=> {
	it('deve limpar os dados da organização', () => {
		// Realizar o login
		cy.visit('https://automacao-karla.stage.twygoead.com')

		cy.get('#user_email')
			.type('karladaiany@automacao.com')
		
		cy.get('#user_password')
			.type('aut123')

		cy.contains('button', 'Entrar')
			.should('be.visible')  
			.click()

		// Verificar se o login foi realizado com sucesso
		cy.contains('#page-breadcrumb', 'Dashboard')
      		.should('be.visible')

    	cy.contains('.name', 'Twygo Automação')
      		.should('be.visible')

    	cy.contains('#btn-profile', 'Aluno')
      		.should('be.visible')

		// Alterar o perfil para administrador
		cy.get('#btn-profile')
			.should('be.visible')
			.click()

		cy.get('#admin-profile')
			.should('be.visible')
			.click()

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

		cy.contains('button', 'Excluir')
			.click({force: true})

		cy.contains('.flash.success', 'Todos os dados solicitados foram excluídos, atualize a página.', { timeout: 40000 })
			.should('be.visible')		
	})
})