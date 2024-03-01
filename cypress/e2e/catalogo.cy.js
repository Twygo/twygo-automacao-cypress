/// reference types="cypress" />
import 'cypress-iframe'
import 'cypress-real-events/support'

describe('catalogo', () => {
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

	// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type('Curso de Automação Cypress')

		cy.get('#date_start')
			.type('29032024')
			

		cy.get('#time_start')
			.type('01:00')

		cy.get('#date_end')
			.type('29042024')

		cy.get('#time_end')
			.type('23:00')

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).type('Descrição - inclusão de texto CKEditor para Catalogo Online', { force: true })
			})
		})

		cy.get('#event_event_type_id')
			.select('Congresso')  //Lista de opções: Congresso, Feira, Outros, Palestra, Treinamento, Webinar

		cy.get('#event_mode')
			.select('Presencial')  //Lista de opções: Online, Presencial

		cy.get('#event_synchronism')
			.select('Ao vivo')  //Lista de opções: Ao vivo, Gravado

		cy.get('#event_outlet')
			.select('Outros')  //Lista de opções: Em companhia, Aberto, Outros

		cy.get('#event_workload')
			.type('40')

		cy.get('#event_class_number')
			.type('10')

		cy.get('#event_days_to_expire')
			.type('30')

		cy.get('#event_place')
			.type('Centro de Eventos')

		cy.get('#event_zip_code')
			.type('85804-455')

		cy.get('#event_address')
			.type('Rua das Flores')

		cy.get('#event_address2')
			.type('Casa dos fundos')

		cy.get('#event_city')
			.type('Joinville')

		cy.get('#event_state')
			.type('SC')

		cy.get('#event_country')
			.type('Brasil')

		cy.get('#event_email')
		.clear()	
		.type('automacao@teste.com')

		cy.get('#event_website')
			.type('https://twygoead.com')

		//REVIEW
		// cy.get('#sent_mail_owner')
		// 	.click()

		cy.get('#event_contact_label')
			.type('Fale conosco')

		cy.get('#event_hashtag')
			.type('#automacao')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type('Framework')
		
		cy.realPress('Tab')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type('Cypress')
		
		cy.realPress('Tab')

		cy.get("[for='event_allow_attachments_1']").contains('Habilitado')
			.click()

		//cy.get("[for='event_allow_attachments_0']").contains('Desabilitado')
		//	.check()

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(1).then($body => {
				cy.wrap($body).click({ force: true }).type('Descrição - inclusão de texto CKEditor para Anexo no Catalogo Online', { force: true })
			})
		})

		cy.get('#event_inscription_access')
			.select('Público')  //Lista de opções: Inscritos, Colaborador, Usuários, Público

		cy.get('#event_situation')
			.select('Liberado')  //Lista de opções: Em desenvolvimento, Liberado, Suspenso

		cy.get('#event_end_class')
			.select('Sim')  //Lista de opções: Sim, Não

		cy.get('#event_notify_users')
			.select('Sim')  //Lista de opções: Sim, Não

		cy.get('#event_trial_days')
			.clear()
			.type('7')

		cy.get('#event_enable_trial_days').parents('span.input').first()
			.click()

		// cy.get('#event_status_2') //Habilitado
		// 	.check()

		cy.get('#event_status_1') //Desabilitado
			.click()

		cy.get('#event_subscription_value')
			.clear()
			.type('100,00')

		cy.get('#event_payment_enabled')
			.click()

		cy.get('#event_installments_number')
			.clear()	
			.type('3')

		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.')
			.should('be.visible')

		//TODO: Adicionar validação para verificar se o item foi salvo com sucesso
		// cy.get('.models-portfolio-list > thead > tr > .name')
		// 	.should('have.text', 'Curso de Automação Cypress')
	})
})