/// references types="cypress" />
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
import 'cypress-real-events/support'

describe('Temp', () => {
    beforeEach(() => {
        // Ativar o tratamento de exceção não capturada
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })

        // Obtém o token de autenticação
        getAuthToken()

        // Exclui todos os cursos antes de iniciar o teste
        cy.excluirCursoViaApi()
        cy.excluirCatalogoViaApi()
    })

    afterEach(() => {
        // Desativa o tratamento de exceção não capturada
        Cypress.removeAllListeners('uncaught:exception')
    })

    it('Criar curso', () => {
        cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
        cy.addConteudo('curso')

        const nome = faker.commerce.productName()
        const conteudo = {
            nome: nome,
            data_inicio: '29/03/2024',
            hora_inicio: '01:00',
            data_fim: '29/04/2024',
            hora_fim: '23:00',
            descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
            tipo: 'Congresso',
            modalidade: 'Presencial',
            sincronismo: 'Ao vivo',
            canal: 'Outros',
            carga_horaria: faker.number.int({ min: 1, max: 9 }),
            numero_turma: faker.number.int({ min: 1, max: 9 }),
            vigencia: faker.number.int({ min: 1, max: 9 }),
            local: 'Centro de Eventos',
            cep: '85804-455',
            endereco: 'Rua das Flores',
            complemento: 'Casa dos fundos',
            cidade: 'Joinville',
            estado: 'SC',
            pais: 'Brasil',
            email_responsavel: faker.internet.email(),
            site: faker.internet.url(),
            rotulo_contato: 'Fale conosco',
            hashtag: faker.hacker.adjective(),
            categoria: [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`],
            permite_anexo: 'Habilitado',
            mensagem_anexo: `Insira o anexo do conteúdo: ${nome}`,
            status_iframe_anexo: true,
            visualizacao: 'Inscritos',
            situacao: 'Liberado',
            notif_concluir_primeira_aula: 'Sim',
            dias_teste: faker.number.int({ min: 1, max: 9 }),
            exige_confirmacao: 'Habilitado',
            valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
            numero_parcelas: faker.number.int({ min: 1, max: 9 }),
        }
    
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, 'curso')
        cy.editarConteudo(conteudo.nome, 'curso')
        cy.validarDadosConteudo(conteudo)
    })

    it.only('1-CRUD curso com dados default', () => {
		// Massa de dados para criação do curso
        const tipoConteudo = 'curso'
		const nome = faker.commerce.productName()
        const conteudo = {
			nome: nome,
            descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
		}

		// TESTE
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)
        cy.editarConteudo(conteudo.nome, tipoConteudo)
        cy.validarDadosConteudo(conteudo)

		// UPDATE
		const conteudo_edit = {
			nome: faker.commerce.productName(),
			data_inicio: '29/03/2024',
			hora_inicio: '12:00',
			data_fim: '29/04/2024',
			hora_fim: '22:00',
			descricao: faker.commerce.productDescription(),
			tipo: 'Congresso',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Outros',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			numero_turma: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			local: 'Centro de Eventos',
			cep: '85803-760',
			endereco: 'Rua das Petúnias',
			complemento: 'Apto 101',
			cidade: 'Cascavel',
			estado: 'PR',
			pais: 'Brasil',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			notificar_responsavel: true,
			rotulo_contato: 'Contato',
			hashtag: faker.hacker.adjective(),
			categoria: [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`],
			remover_banner: true,
			permite_anexo: 'Habilitado',
			mensagem_anexo: 'Insira o anexo do Curso:',
			status_iframe_anexo: true,
			visualizacao: 'Público',
			situacao: 'Liberado',
			notif_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: faker.number.int({ min: 1, max: 9 }),
			acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitar_chat: true
		}

		cy.preencherDadosConteudo(conteudo_edit, { limpar: true })
		cy.salvarConteudo(conteudo_edit.nome, tipoConteudo)
		cy.editarConteudo(conteudo_edit.nome, tipoConteudo)
		cy.validarDadosConteudo(conteudo_edit)
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo_edit.nome, tipoConteudo)
	})

	it('2-CRUD curso liberado, com anexo, com pagamento, sem acrescimo, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação do curso
		const conteudo = {
			nome: faker.commerce.productName(),
			data_inicio: '29/03/2024',
			hora_inicio: '01:00',
			data_fim: '29/04/2024',
			hora_fim: '23:00',
			descricao: faker.commerce.productDescription(),
			tipo: 'Congresso',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Outros',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			numero_turma: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			local: 'Centro de Eventos',
			cep: '85804-455',
			endereco: 'Rua das Flores',
			complemento: 'Casa dos fundos',
			cidade: 'Joinville',
			estado: 'SC',
			pais: 'Brasil',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			rotulo_contato: 'Fale conosco',
			hashtag: faker.hacker.adjective(),
			categoria: { 
				cat1: `Cat1-${faker.hacker.noun()}`,
				cat2: `Cat2-${faker.hacker.noun()}`,
			},
			permite_anexo: 'Habilitado',
			mensagem_anexo: 'Insira o anexo do Curso:',
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notif_concluir_primeira_aula: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			exige_confirmacao: 'Habilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			numero_parcelas: faker.number.int({ min: 1, max: 9 })
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar no botão de adicionar novo curso e validar página correta
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Lista de cursos > Adicionar novo')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Curso')
			.should('be.visible')

		// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type(conteudo.nome)

		cy.get('#date_start')
			.type(conteudo.data_inicio)			

		cy.get('#time_start')
			.type(conteudo.hora_inicio)

		cy.get('#date_end')
			.type(conteudo.data_fim)

		cy.get('#time_end')
			.type(conteudo.hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).type(`${conteudo.descricao} do curso nome: ${conteudo.nome}`, { force: true })
			})
		})

		cy.get('#event_event_type_id')
			.select(conteudo.tipo)  

		cy.get('#event_mode')
			.select(conteudo.modalidade)  

		cy.get('#event_synchronism')
			.select(conteudo.sincronismo)  

		cy.get('#event_outlet')
			.select(conteudo.canal)  

		cy.get('#event_workload')
			.clear()
			.type(conteudo.carga_horaria)

		cy.get('#event_class_number')
			.type(conteudo.numero_turma)

		cy.get('#event_days_to_expire')
			.clear()
			.type(conteudo.vigencia)

		cy.get('#event_place')
			.type(conteudo.local)

		cy.get('#event_zip_code')
			.type(conteudo.cep)

		cy.get('#event_address')
			.type(conteudo.endereco)

		cy.get('#event_address2')
			.type(conteudo.complemento)

		cy.get('#event_city')
			.type(conteudo.cidade)

		cy.get('#event_state')
			.type(conteudo.estado)

		cy.get('#event_country')
			.type(conteudo.pais)

		cy.get('#event_email')
			.clear()	
			.type(conteudo.email_responsavel)

		cy.get('#event_website')
			.type(conteudo.site)

		cy.get('#event_sent_mail_owner')
			.click()

		cy.get('#event_contact_label')
			.type(conteudo.rotulo_contato)

		cy.get('#event_hashtag')
			.type(conteudo.hashtag)

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo.categoria.cat1)
		
		cy.realPress('Tab')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo.categoria.cat2)
		
		cy.realPress('Tab')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.permite_anexo}")`)
			.invoke('attr', 'for')
			.then((id) => {
				cy.get(`input#${id}`).click()
			})

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(1).then($body => {
				cy.wrap($body).click({ force: true }).type(`${conteudo.mensagem_anexo} ${conteudo.nome}`, { force: true })
			})
		})

		cy.get('#event_inscription_access')
			.select(conteudo.visualizacao)

		cy.get('#event_situation')
			.select(conteudo.situacao)

		cy.get('#event_end_class')
			.select(conteudo.notif_concluir_primeira_aula)

		cy.get('#event_trial_days')
			.clear()
			.type(conteudo.dias_teste)

		cy.get('#event_enable_trial_days')
			.parents('span.input')
			.first()
			.click()

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.exige_confirmacao}")`)
			.invoke('attr', 'for')
			.then((id) => {
			  cy.get(`input#${id}`).click()
			})

		cy.get('#event_subscription_value')
			.clear()
			.type(conteudo.valor_inscricao.replace('.', ','))

		cy.get('#event_payment_enabled')
			.click()

		cy.get('#event_installments_number')
			.clear()	
			.type(conteudo.numero_parcelas)

		cy.get('#event_enable_twygo_chat')
			.click()

		// Salvar a criação do curso, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Evento salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Lista de cursos')
			.should('be.visible')

		// Verificar se o curso foi criado e é exibido na listagem
		cy.get(`tr[tag-name='${conteudo.nome}']`, { timeout: 5000})
			.should('be.visible')
			.should('have.length', 1)

		// READ
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do curso para validar dados salvos e página correta
		cy.get(`tr[tag-name='${conteudo.nome}']`, { timeout: 5000})
			.find('svg[aria-label="Options"]')
			.click()

		cy.get(`tr[tag-name='${conteudo.nome}']`, { timeout: 5000})
			.contains('button', 'Editar')
			.click()

		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do evento')
			.should('be.visible')

		cy.contains('.detail_title', 'Editar Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo.nome)

		cy.get('#date_start')
			.should('have.value', conteudo.data_inicio)

		cy.get('#time_start')
			.should('have.value', conteudo.hora_inicio)

		cy.get('#date_end')
			.should('have.value', conteudo.data_fim)

		cy.get('#time_end')
			.should('have.value', conteudo.hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.descricao} do curso nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.should('have.text', conteudo.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.should('have.text',conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.should('have.text',conteudo.sincronismo)

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.text', conteudo.canal)

		cy.get('#event_workload')
			.should('have.value', conteudo.carga_horaria)

		cy.get('#event_class_number')
			.should('have.value', conteudo.numero_turma)

		cy.get('#event_days_to_expire')
			.should('have.value', conteudo.vigencia)

		cy.get('#update_inscriptions')
			.should('not.be.checked')

		cy.get('#event_place')
			.should('have.value', conteudo.local)

		cy.get('#event_zip_code')
			.should('have.value', conteudo.cep)

		cy.get('#event_address')
			.should('have.value', conteudo.endereco)

		cy.get('#event_address2')
			.should('have.value', conteudo.complemento)

		cy.get('#event_city')
			.should('have.value', conteudo.cidade)

		cy.get('#event_state')
			.should('have.value', conteudo.estado)
		
		cy.get('#event_country')
			.should('have.value', conteudo.pais)

		cy.get('#event_email')
			.should('have.value', conteudo.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo.site)

		cy.get('#event_sent_mail_owner')
			.should('be.checked')

		cy.get('#event_contact_label')
			.should('have.value', conteudo.rotulo_contato)

		cy.get('#event_hashtag')
			.should('have.value', conteudo.hashtag)

		let categoriasEncontradas = []
		cy.get('li.as-selection-item.blur').each(($el) => {
			const text = $el.text().trim().replace('×', '').trim()
			categoriasEncontradas.push(text)
			})
		
		cy.get('li.as-selection-item.blur').then(() => {
			const categoriasEsperadas = [conteudo.categoria.cat1, conteudo.categoria.cat2].sort()
			categoriasEncontradas.sort()
			expect(categoriasEncontradas).to.deep.eq(categoriasEsperadas)
		})
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.permite_anexo}")`)
			.invoke('attr', 'for')
			.then((id) => {
			  	cy.get(`input#${id}`).should('be.checked')
			})

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		
			cy.wrap(doc).find('body.cke_editable').eq(1).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.mensagem_anexo} ${conteudo.nome}`)
			})
		})

		cy.get('#event_inscription_access')
			.find('option:selected')
			.contains(conteudo.visualizacao)

		cy.get('#event_situation')
			.find('option:selected')
			.contains(conteudo.situacao)

		cy.get('#event_end_class')
			.find('option:selected')
			.contains(conteudo.notif_concluir_primeira_aula)

		cy.get('#event_notify_users')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_trial_days')
			.should('have.value', conteudo.dias_teste)

		cy.get('#event_enable_trial_days')
			.should('be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.exige_confirmacao}")`)
			.invoke('attr', 'for')
			.then((id) => {
			  	cy.get(`input#${id}`).should('be.checked')
			})

		cy.get('#event_subscription_value')
			.should('have.value', conteudo.valor_inscricao.replace('.', ','))

		cy.get('#event_payment_enabled')
			.should('be.checked')

		cy.get('#event_installments_number')
			.should('have.value', conteudo.numero_parcelas)

		cy.get('#event_addition')
			.should('have.value', '0.0')

		cy.get('#event_enable_twygo_chat')
			.should('be.checked')

		// UPDATE
		const conteudo_edit = {
			nome: faker.commerce.productName(),
			data_inicio: '01/01/2023',
			hora_inicio: '00:01',
			data_fim: '31/01/2025',
			hora_fim: '23:59',
			descricao: faker.commerce.productDescription(),
			tipo: 'Feira',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: '',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			numero_turma: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			local: 'T&D Connect',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			rotulo_contato: 'Contato',
			hashtag: faker.hacker.adjective(),
			categoria: { 
				cat1: `Cat3-${faker.hacker.noun()}`,
				cat2: `Cat4-${faker.hacker.noun()}`,
			},
			permite_anexo: 'Desabilitado',
			visualizacao: 'Público',
			situacao: 'Suspenso',
			notif_concluir_primeira_aula: 'Não',
			notificar_usuarios: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 })
		}

		// Editar os campos do formulário - aba Dados
		cy.get('#event_name')
			.clear()
			.type(conteudo_edit.nome)

		cy.get('#date_start')
			.clear()
			.type(conteudo_edit.data_inicio)			

		cy.get('#time_start')
			.clear()
			.type(conteudo_edit.hora_inicio)

		cy.get('#date_end')
			.clear()
			.type(conteudo_edit.data_fim)

		cy.get('#time_end')
			.clear()
			.type(conteudo_edit.hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).clear().type(`${conteudo_edit.descricao} do curso nome: ${conteudo_edit.nome}`, { force: true })
			})
		})

		cy.get('#event_event_type_id')
			.select(conteudo_edit.tipo)  

		cy.get('#event_mode')
			.select(conteudo_edit.modalidade)  

		cy.get('#event_synchronism')
			.select(conteudo_edit.sincronismo)  

		cy.get('#event_outlet')
			.select(conteudo_edit.canal)  

		cy.get('#event_workload')
			.clear()
			.type(conteudo_edit.carga_horaria)

		cy.get('#event_class_number')
			.clear()
			.type(conteudo_edit.numero_turma)

		cy.get('#event_days_to_expire')
			.clear()
			.type(conteudo_edit.vigencia)

		cy.get('#update_inscriptions')
			.click()

		cy.get('#event_place')
			.clear()
			.type(conteudo_edit.local)

		cy.get('#event_email')
			.clear()	
			.type(conteudo_edit.email_responsavel)

		cy.get('#event_website')
			.clear()
			.type(conteudo_edit.site)

		cy.get('#event_sent_mail_owner')
			.click()

		cy.get('#event_contact_label')
			.clear()
			.type(conteudo_edit.rotulo_contato)

		cy.get('#event_hashtag')
			.clear()
			.type(conteudo_edit.hashtag)

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo_edit.categoria.cat1)
		
		cy.realPress('Tab')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo_edit.categoria.cat2)
		
		cy.realPress('Tab')
	
		cy.get('#remove_banner')
			.click()

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo_edit.permite_anexo}")`)
			.invoke('attr', 'for')
			.then((id) => {
				cy.get(`input#${id}`).click()
			})

		cy.get('#event_inscription_access')
			.select(conteudo_edit.visualizacao)

		cy.get('#event_situation')
			.select(conteudo_edit.situacao)

		cy.get('#event_end_class')
			.select(conteudo_edit.notif_concluir_primeira_aula)

		cy.get('#event_notify_users')
			.select(conteudo_edit.notificar_usuarios)

		cy.get('#event_trial_days')
			.clear()
			.type(conteudo_edit.dias_teste)

		cy.get('#event_enable_trial_days')
			.parents('span.input')
			.first()
			.click()

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo_edit.exige_confirmacao}")`)
			.invoke('attr', 'for')
			.then((id) => {
			  cy.get(`input#${id}`).click()
			})

		cy.get('#event_subscription_value')
			.clear()
			.type(conteudo_edit.valor_inscricao.replace('.', ','))

		cy.get('#event_payment_enabled')
			.click()

		// Salvar a edição do curso, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Evento salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Lista de cursos')
			.should('be.visible')

		// Verificar se o curso editado foi salvo corretamente e é exibido na listagem
		cy.get(`tr[tag-name='${conteudo_edit.nome}']`, { timeout: 5000})
			.should('be.visible')
			.should('have.length', 1)
		
		// READ-UPDATE
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do curso para validar dados salvos e página correta
		cy.get(`tr[tag-name='${conteudo_edit.nome}']`, { timeout: 5000})
			.find('svg[aria-label="Options"]')
			.click()

		cy.get(`tr[tag-name='${conteudo_edit.nome}']`, { timeout: 5000})
			.contains('button', 'Editar')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do evento')
			.should('be.visible')

		cy.contains('.detail_title', 'Editar Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo_edit.nome)

		cy.get('#date_start')
			.should('have.value', conteudo_edit.data_inicio)

		cy.get('#time_start')
			.should('have.value', conteudo_edit.hora_inicio)

		cy.get('#date_end')
			.should('have.value', conteudo_edit.data_fim)

		cy.get('#time_end')
			.should('have.value', conteudo_edit.hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo_edit.descricao} do curso nome: ${conteudo_edit.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo_edit.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo_edit.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo_edit.sincronismo)

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.value', conteudo_edit.canal)

		cy.get('#event_workload')
			.should('have.value', conteudo_edit.carga_horaria)

		cy.get('#event_class_number')
			.should('have.value', conteudo_edit.numero_turma)

		cy.get('#event_days_to_expire')
			.should('have.value', conteudo_edit.vigencia)

		cy.get('#update_inscriptions')
			.should('not.be.checked')

		cy.get('#event_place')
			.should('have.value', conteudo_edit.local)

		cy.get('#event_zip_code')
			.should('have.value', '85804-455')

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
			.should('have.value', conteudo_edit.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo_edit.site)

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', conteudo_edit.rotulo_contato)

		cy.get('#event_hashtag')
			.should('have.value', conteudo_edit.hashtag)

		let categoriasEncontradasEdit = []
		cy.get('li.as-selection-item.blur').each(($el) => {
			const text = $el.text().trim().replace('×', '').trim()
			categoriasEncontradasEdit.push(text)
		})
		
		cy.get('li.as-selection-item.blur').then(() => {
			const categoriasEsperadasEdit = [conteudo.categoria.cat1, conteudo.categoria.cat2, conteudo_edit.categoria.cat1, conteudo_edit.categoria.cat2].sort()
			categoriasEncontradasEdit.sort()
			expect(categoriasEncontradasEdit).to.deep.eq(categoriasEsperadasEdit)
		})
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('${conteudo_edit.permite_anexo}')`)
			.invoke('attr', 'for')
			.then((id) => {
			  	cy.get(`input#${id}`).should('be.checked')
			})

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		
			cy.wrap(doc).find('body.cke_editable').eq(1).invoke('attr', 'contenteditable').then(contenteditable => {
				expect(contenteditable).to.eq('false')
			})
		})

		cy.get('#event_inscription_access')
			.find('option:selected')
			.contains(conteudo_edit.visualizacao)

		cy.get('#event_situation')
			.find('option:selected')
			.contains(conteudo_edit.situacao)

		cy.get('#event_end_class')
			.find('option:selected')
			.contains(conteudo_edit.notif_concluir_primeira_aula)

		cy.get('#event_notify_users')
			.find('option:selected')
			.contains(conteudo_edit.notificar_usuarios)

		cy.get('#event_trial_days')
			.should('have.value', conteudo_edit.dias_teste)

		cy.get('#event_enable_trial_days')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('${conteudo_edit.exige_confirmacao}')`)
			.invoke('attr', 'for')
			.then((id) => {
			  	cy.get(`input#${id}`).should('be.checked')
			})

		cy.get('#event_subscription_value')
			.should('have.value', conteudo_edit.valor_inscricao.replace('.', ','))

		cy.get('#event_payment_enabled')
			.should('not.be.checked')

		cy.get('#event_installments_number')
			.should('have.value', conteudo.numero_parcelas)

		cy.get('#event_addition')
			.should('have.value', '0.0')

		// Cancelar a edição do curso e validar redirecionamento
		cy.contains('#event-cancel','Cancelar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Lista de cursos')
			.should('be.visible')

		// DELETE
		// Clicar no botão de excluir do curso, mensagem de confirmação e confirmar exclusão
		cy.get(`tr[tag-name='${conteudo_edit.nome}']`, { timeout: 5000})
			.find('svg[aria-label="Options"]')
			.click()

		cy.get(`tr[tag-name='${conteudo_edit.nome}']`, { timeout: 5000})
			.wait(2000)	
			.contains('button', 'Excluir')
			.click({ force: true })

		cy.contains('.chakra-modal__header', 'Excluir curso')
			.should('be.visible')

		cy.contains('.chakra-heading', conteudo_edit.nome)
			.should('be.visible')

		cy.contains('.chakra-modal__body', 'Você tem certeza que deseja excluir este curso?')
			.should('be.visible')

		cy.contains('button.chakra-button', 'Excluir')
			.click({ force: true})

		cy.contains('.chakra-alert__desc', 'Evento excluído com sucesso', { timeout: 5000 })
			.should('be.visible')

		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Verificar se o curso foi excluído e não é exibido na listagem
		cy.get(`tr[tag-name='${conteudo_edit.nome}']`, { timeout: 5000})
			.should('not.exist')
	})
})
