/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'

describe('criar curso via catálogo', () => {
    before(() => {
        getAuthToken()
    })

    function convertToISOFormat(dateString, timeString) {
        // Dividindo a data em partes
        const [day, month, year] = dateString.split('/')
        // Combinando as partes da data e a hora para formar uma string ISO
        const isoString = `${year}-${month}-${day}T${timeString}:00.000Z`
    
        return isoString
    }

    const visualizacaoTexto = {
        0: 'Inscritos',
        1: 'Colaborador',
        2: 'Usuários',
        3: 'Público'
    }
    
    it('1-CRUD deve criar um curso via catálogo com visualização para inscritos', () => {    
        //Definindo data e hora de início e fim
        const data_inicio = '10/02/2024'
        const hora_inicio = '01:00'
        const data_fim = '15/12/2028'
        const hora_fim = '12:00'

        const date_time_start = convertToISOFormat(data_inicio, hora_inicio)
        const date_time_end = convertToISOFormat(data_fim, hora_fim)  
        
        // Gerando nome aleatório
        const eventName = faker.commerce.productName()

        const body = {
			name: eventName,
			description: `Descrição do conteúdo: ${eventName}`,
			date_time_start: date_time_start,
			date_time_end: date_time_end,
			workload: 12,
			situation: 1, 
			inscription_access: 0
		}

		// !!! PRÉ-CONDIÇÃO !!!
		// Criar um catálogo liberado via API
        cy.criarCatalogoViaApi(body)

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

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar em "Criar curso" do catálogo
		cy.get(`tr.event-row[name='${body.name}']`)
			.find('a[title="Criar  Curso"]')
			.click()

		// Abre a página de criação de curso com base no catálogo selecionado
		cy.contains('#page-breadcrumb', 'Lista de cursos')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Curso')
			.should('be.visible')

		cy.get('#model_name')
			.should('have.value', body.name)

		cy.get('#event_name')
			.should('have.value', body.name)

		cy.get('#date_start')
			.should('have.value', data_inicio)

		cy.get('#time_start')
			.should('have.value', hora_inicio)

		cy.get('#date_end')
			.should('have.value', data_fim)

		cy.get('#time_end')
			.should('have.value', hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
			
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${body.description}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains('Treinamento')

		cy.get('#event_mode')
			.find('option:selected')
			.contains('Online')

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains('Gravado')

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.value', '')

		cy.get('#event_workload')
			.should('have.value', body.workload)

		cy.get('#event_class_number')
			.should('have.value', '')

		cy.get('#event_days_to_expire')
			.should('have.value', '0')

		cy.get('#event_place')
			.should('have.value', '')

		cy.get('#event_zip_code')
			.should('have.value', '')

		cy.get('#event_address')
			.should('have.value', '')

		cy.get('#event_address2')
			.should('have.value', '')

		cy.get('#event_city')
			.should('have.value', '')

		cy.get('#event_state')
			.should('have.value', '')
		
		cy.get('#event_country')
			.should('have.value', '')

		cy.get('#event_email')
			.should('have.value', '')
		
		cy.get('#event_website')
			.should('have.value', '')

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', '')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.should('have.value', '')
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find('label:contains("Desabilitado")')
			.invoke('attr', 'for')
			.then((id) => {
					cy.get(`input#${id}`).should('be.checked')
			})

        cy.wait(4000)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
		
			cy.wrap(doc).find('body.cke_editable').eq(1).invoke('attr', 'contenteditable').then(contentEditable => {
				expect(contentEditable).to.eq('false')
			})
		})

        const visualizacao = visualizacaoTexto[body.inscription_access]

		cy.get('#event_inscription_access')
			.find('option:selected')
			.should('have.text', visualizacao)

		cy.get('#event_situation')
			.find('option:selected')
			.contains('Em desenvolvimento')

		cy.get('#event_end_class')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_notify_users')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_trial_days')
			.should('have.value', '0')

		cy.get('#event_enable_trial_days')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find('label:contains("Habilitado")')
			.invoke('attr', 'for')
			.then((id) => {
					cy.get(`input#${id}`).should('be.checked')
			})

		cy.get('#event_subscription_value')
			.should('have.value', '0,00')

		cy.get('#event_payment_enabled')
			.should('not.be.checked')

		cy.get('#event_installments_number')
			.should('have.value', '1')

		cy.get('#event_addition')
			.should('have.value', '0.0')
	
		cy.get('#event_enable_twygo_chat')
			.should('not.be.checked')	
	})

    it('2-CRUD deve criar um curso via catálogo com visualização para colaborador', () => {
		//Definindo data e hora de início e fim
        const data_inicio = '01/01/2024'
        const hora_inicio = '00:01'
        const data_fim = '31/12/2024'
        const hora_fim = '23:59'

        const date_time_start = convertToISOFormat(data_inicio, hora_inicio)
        const date_time_end = convertToISOFormat(data_fim, hora_fim)  
        
        // Gerando nome aleatório
        const eventName = faker.commerce.productName()

        const body = {
			name: eventName,
			description: `Descrição do conteúdo: ${eventName}`,
			date_time_start: date_time_start,
			date_time_end: date_time_end,
			workload: 5,
			situation: 1, 
			inscription_access: 1
		}
        
		// !!! PRÉ-CONDIÇÃO !!!
		// Criar um catálogo liberado via API
        cy.criarCatalogoViaApi(body)

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

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar em "Criar curso" do catálogo
		cy.get(`tr.event-row[name='${body.name}']`)
			.find('a[title="Criar  Curso"]')
			.click()

		// Abre a página de criação de curso com base no catálogo selecionado
		cy.contains('#page-breadcrumb', 'Lista de cursos')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Curso')
			.should('be.visible')

		cy.get('#model_name')
			.should('have.value', body.name)

		cy.get('#event_name')
			.should('have.value', body.name)
		
		cy.get('#date_start')
			.should('have.value', data_inicio)

		cy.get('#time_start')
			.should('have.value', hora_inicio)

		cy.get('#date_end')
			.should('have.value', data_fim)

		cy.get('#time_end')
			.should('have.value', hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
			
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${body.description}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains('Treinamento')

		cy.get('#event_mode')
			.find('option:selected')
			.contains('Online')

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains('Gravado')

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.value', '')

		cy.get('#event_workload')
			.should('have.value', body.workload)

		cy.get('#event_class_number')
			.should('have.value', '')

		cy.get('#event_days_to_expire')
			.should('have.value', '0')

		cy.get('#event_place')
			.should('have.value', '')

		cy.get('#event_zip_code')
			.should('have.value', '')

		cy.get('#event_address')
			.should('have.value', '')

		cy.get('#event_address2')
			.should('have.value', '')

		cy.get('#event_city')
			.should('have.value', '')

		cy.get('#event_state')
			.should('have.value', '')
		
		cy.get('#event_country')
			.should('have.value', '')

		cy.get('#event_email')
			.should('have.value', '')
		
		cy.get('#event_website')
			.should('have.value', '')

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', '')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.should('have.value', '')
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find('label:contains("Desabilitado")')
			.invoke('attr', 'for')
			.then((id) => {
					cy.get(`input#${id}`).should('be.checked')
			})

        cy.wait(4000)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
		
			cy.wrap(doc).find('body.cke_editable').eq(1).invoke('attr', 'contenteditable').then(contentEditable => {
				expect(contentEditable).to.eq('false')
			})
		})

        const visualizacao = visualizacaoTexto[body.inscription_access]

		cy.get('#event_inscription_access')
			.find('option:selected')
			.should('have.text', visualizacao)

		cy.get('#event_situation')
			.find('option:selected')
			.contains('Em desenvolvimento')

		cy.get('#event_end_class')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_notify_users')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_trial_days')
			.should('have.value', '0')

		cy.get('#event_enable_trial_days')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find('label:contains("Habilitado")')
			.invoke('attr', 'for')
			.then((id) => {
					cy.get(`input#${id}`).should('be.checked')
			})

		cy.get('#event_subscription_value')
			.should('have.value', '0,00')

		cy.get('#event_payment_enabled')
			.should('not.be.checked')

		cy.get('#event_installments_number')
			.should('have.value', '1')

		cy.get('#event_addition')
			.should('have.value', '0.0')
	
		cy.get('#event_enable_twygo_chat')
			.should('not.be.checked')	
	})

    it('3-CRUD deve criar um curso via catálogo com visualização para usuários', () => {
		//Definindo data e hora de início e fim
        const data_inicio = '19/12/2024'
        const hora_inicio = '11:09'
        const data_fim = '31/01/2025'
        const hora_fim = '22:20'

        const date_time_start = convertToISOFormat(data_inicio, hora_inicio)
        const date_time_end = convertToISOFormat(data_fim, hora_fim)  
        
        // Gerando nome aleatório
        const eventName = faker.commerce.productName()

        const body = {
			name: eventName,
			description: `Descrição do conteúdo: ${eventName}`,
			date_time_start: date_time_start,
			date_time_end: date_time_end,
			situation: 1, 
			inscription_access: 2
		}       
        
		// !!! PRÉ-CONDIÇÃO !!!
		// Criar um catálogo liberado via API
        cy.criarCatalogoViaApi(body)

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

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar em "Criar curso" do catálogo
		cy.get(`tr.event-row[name='${body.name}']`)
			.find('a[title="Criar  Curso"]')
			.click()

		// Abre a página de criação de curso com base no catálogo selecionado
		cy.contains('#page-breadcrumb', 'Lista de cursos')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Curso')
			.should('be.visible')

		cy.get('#model_name')
			.should('have.value', body.name)

		cy.get('#event_name')
			.should('have.value', body.name)
		
		cy.get('#date_start')
			.should('have.value', data_inicio)

		cy.get('#time_start')
			.should('have.value', hora_inicio)

		cy.get('#date_end')
			.should('have.value', data_fim)

		cy.get('#time_end')
			.should('have.value', hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
			
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${body.description}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains('Treinamento')

		cy.get('#event_mode')
			.find('option:selected')
			.contains('Online')

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains('Gravado')

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.value', '')

		cy.get('#event_workload')
			.should('have.value', '0')

		cy.get('#event_class_number')
			.should('have.value', '')

		cy.get('#event_days_to_expire')
			.should('have.value', '0')

		cy.get('#event_place')
			.should('have.value', '')

		cy.get('#event_zip_code')
			.should('have.value', '')

		cy.get('#event_address')
			.should('have.value', '')

		cy.get('#event_address2')
			.should('have.value', '')

		cy.get('#event_city')
			.should('have.value', '')

		cy.get('#event_state')
			.should('have.value', '')
		
		cy.get('#event_country')
			.should('have.value', '')

		cy.get('#event_email')
			.should('have.value', '')
		
		cy.get('#event_website')
			.should('have.value', '')

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', '')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.should('have.value', '')
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find('label:contains("Desabilitado")')
			.invoke('attr', 'for')
			.then((id) => {
					cy.get(`input#${id}`).should('be.checked')
			})

        cy.wait(4000)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
		
			cy.wrap(doc).find('body.cke_editable').eq(1).invoke('attr', 'contenteditable').then(contentEditable => {
				expect(contentEditable).to.eq('false')
			})
		})

        const visualizacao = visualizacaoTexto[body.inscription_access]

		cy.get('#event_inscription_access')
			.find('option:selected')
			.should('have.text', visualizacao)

		cy.get('#event_situation')
			.find('option:selected')
			.contains('Em desenvolvimento')

		cy.get('#event_end_class')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_notify_users')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_trial_days')
			.should('have.value', '0')

		cy.get('#event_enable_trial_days')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find('label:contains("Habilitado")')
			.invoke('attr', 'for')
			.then((id) => {
					cy.get(`input#${id}`).should('be.checked')
			})

		cy.get('#event_subscription_value')
			.should('have.value', '0,00')

		cy.get('#event_payment_enabled')
			.should('not.be.checked')

		cy.get('#event_installments_number')
			.should('have.value', '1')

		cy.get('#event_addition')
			.should('have.value', '0.0')
	
		cy.get('#event_enable_twygo_chat')
			.should('not.be.checked')	
	})

    it('4-CRUD deve criar um curso via catálogo com visualização para público', () => {
		// Gerando nome aleatório
        const eventName = faker.commerce.productName()

        const body = {
			name: eventName,
			description: `Descrição do conteúdo: ${eventName}`,
			situation: 1, 
			inscription_access: 3
		}

		// !!! PRÉ-CONDIÇÃO !!!
		// Criar um catálogo liberado via API
        cy.criarCatalogoViaApi(body)

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

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar em "Criar curso" do catálogo
		cy.get(`tr.event-row[name='${body.name}']`)
			.find('a[title="Criar  Curso"]')
			.click()

		// Abre a página de criação de curso com base no catálogo selecionado
		cy.contains('#page-breadcrumb', 'Lista de cursos')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Curso')
			.should('be.visible')

		cy.get('#model_name')
			.should('have.value', body.name)

		cy.get('#event_name')
			.should('have.value', body.name)
		
		cy.get('#date_start')
			.should('have.value', '')

		cy.get('#time_start')
			.should('have.value', '')

		cy.get('#date_end')
			.should('have.value', '')

		cy.get('#time_end')
			.should('have.value', '')

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
			
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${body.description}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains('Treinamento')

		cy.get('#event_mode')
			.find('option:selected')
			.contains('Online')

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains('Gravado')

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.value', '')

		cy.get('#event_workload')
			.should('have.value', '0')

		cy.get('#event_class_number')
			.should('have.value', '')

		cy.get('#event_days_to_expire')
			.should('have.value', '0')

		cy.get('#event_place')
			.should('have.value', '')

		cy.get('#event_zip_code')
			.should('have.value', '')

		cy.get('#event_address')
			.should('have.value', '')

		cy.get('#event_address2')
			.should('have.value', '')

		cy.get('#event_city')
			.should('have.value', '')

		cy.get('#event_state')
			.should('have.value', '')
		
		cy.get('#event_country')
			.should('have.value', '')

		cy.get('#event_email')
			.should('have.value', '')
		
		cy.get('#event_website')
			.should('have.value', '')

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', '')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.should('have.value', '')
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find('label:contains("Desabilitado")')
			.invoke('attr', 'for')
			.then((id) => {
					cy.get(`input#${id}`).should('be.checked')
			})

        cy.wait(4000)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
		
			cy.wrap(doc).find('body.cke_editable').eq(1).invoke('attr', 'contenteditable').then(contentEditable => {
				expect(contentEditable).to.eq('false')
			})
		})

        const visualizacao = visualizacaoTexto[body.inscription_access]

		cy.get('#event_inscription_access')
			.find('option:selected')
			.should('have.text', visualizacao)

		cy.get('#event_situation')
			.find('option:selected')
			.contains('Em desenvolvimento')

		cy.get('#event_end_class')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_notify_users')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_trial_days')
			.should('have.value', '0')

		cy.get('#event_enable_trial_days')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find('label:contains("Habilitado")')
			.invoke('attr', 'for')
			.then((id) => {
					cy.get(`input#${id}`).should('be.checked')
			})

		cy.get('#event_subscription_value')
			.should('have.value', '0,00')

		cy.get('#event_payment_enabled')
			.should('not.be.checked')

		cy.get('#event_installments_number')
			.should('have.value', '1')

		cy.get('#event_addition')
			.should('have.value', '0.0')
	
		cy.get('#event_enable_twygo_chat')
			.should('not.be.checked')	
	})
})