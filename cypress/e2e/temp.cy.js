import 'cypress-iframe'
import 'cypress-real-events/support'
import { faker } from '@faker-js/faker'

describe('temp', () => {
    it('excluir catálogo', () => {
		// !!! PRÉ-CONDIÇÃO !!!
		// Realizar o login
		cy.visit('/users/login')

		cy.get('#user_email')
			.type(Cypress.env('login'))
		
		cy.get('#user_password')
			.type(Cypress.env('password'))

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
		cy.visit(`/o/${Cypress.env('orgId')}/events/?tab=itens-portfolio`)

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

            cy.get(`tr.event-row[name='Luxurious Concrete Salad']`)
			.find('a[title="Excluir"]')
			.click()

		cy.contains('#modal-remove-events-index', 'Excluir Catálogo de Cursos')
			.should('be.visible')

		cy.contains('#modal-remove-events-index_sub_title', 'Luxurious Concrete Salad')
			.should('be.visible')

		cy.contains('#modal-remove-events-index-msg_title', 'Você tem certeza que deseja excluir este item de portfólio?')
			.should('be.visible')

		cy.get('#modal-remove-events-index-confirmed')
			.click({ force: true })        
    })
})