/// reference types="cypress" />
import 'cypress-iframe'

describe('catalogo', () => {
	it('deve criar um novo catalogo', () => {
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

	// Acessar a página de catálogo de conteúdos
		cy.visit('https://automacao-karla.stage.twygoead.com/o/37434/events/?tab=itens-portfolio')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

	// Clicar no botão de adicionar novo catálogo
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

	// Preencher os campos do formulário
		cy.get('#event_name')
			.type('Curso de Automação Cypress')

		// cy.get('#date_start')
		// 	.type('29/03/2024')

		// cy.get('#time_start')
		// 	.type('01:00')

		// cy.get('#date_end')
		// 	.type('29/04/2024')

		// cy.get('#time_end')
		// 	.type('23:00')

		// validando interação com o iframe
		cy.iframe('iframe[title="Editor de texto enriquecido, event_description"]').then(($iframe) => {
			const $body = $iframe.contents().find('body');
			cy.wrap($body).type('Descrição - inclusão de texto CKEditor para Biblioteca 01');
		})

		cy.iframe('iframe[class="cke_wysiwyg_frame cke_reset"]').then($iframe => {
			const body = $iframe.contents().find('body[class="cke_editable cke_editable_themed cke_contents_ltr cke_show_borders"]')
			cy.wrap(body).type('Seu texto aqui')
		})
  })
})