/// reference types="cypress" />
import 'cypress-iframe'
import 'cypress-real-events/support'
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'

describe('catalogo', () => {
	beforeEach(() => {
		// Ativa o tratamento de exceção não capturada especificamente para este teste
		Cypress.on('uncaught:exception', (err, runnable) => {
		  	return false
		})

		// Obtem o token de autenticação
		getAuthToken()

		// Exclui todos os catálogos antes de iniciar o teste
		cy.excluirCatalogoViaApi()
	})
	
	afterEach(() => {
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})
	
	it('1-CRUD catalogo com dados default', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			descricao: faker.commerce.productDescription()
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
		cy.acessarPgCatalogo()

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar no botão de adicionar novo catálogo e validar página correta
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de Cursos > Adicionar Novo')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
			.should('be.visible')

		// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type(conteudo.nome)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).type(`${conteudo.descricao} do catálogo nome: ${conteudo.nome}`, { force: true })
			})
		})

		// Salvar a criação do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo foi criado e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)

		// READ
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')
		
		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo.nome)

		cy.get('#date_start')
			.should('have.value', '')

		cy.get('#time_start')
			.should('have.value', '')

		cy.get('#date_end')
			.should('have.value', '')

		cy.get('#time_end')
			.should('have.value', '')

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
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

		cy.get('#update_inscriptions')
			.should('not.be.checked')

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
			.should('have.value', 'karla.oliveira@twygo.com')
		
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

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		
			cy.wrap(doc).find('body.cke_editable').eq(1).invoke('attr', 'contenteditable').then(contentEditable => {
				expect(contentEditable).to.eq('false')
			})
		})

		cy.get('#event_inscription_access')
			.find('option:selected')
			.contains('Inscritos')

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
			local: 'Centro de Eventos',
			cep: '85803-760',
			endereco: 'Rua das Petúnias',
			complemento: 'Apto 101',
			cidade: 'Cascavel',
			estado: 'PR',
			pais: 'Brasil',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			rotulo_contato: 'Contato',
			hashtag: faker.hacker.adjective(),
			categoria: { 
				cat1: faker.hacker.noun(),
				cat2: faker.hacker.noun(),
			},
			permite_anexo: 'Habilitado',
			mensagem_anexo: 'Insira o anexo do Catálogo do evento:',
			visualizacao: 'Público',
			situacao: 'Liberado',
			notif_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			numero_parcelas: faker.number.int({ min: 1, max: 9 }),
			acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 })
		}

		// Editar os campos do formulário - aba Dados
		cy.get('#event_name')
			.clear()
			.type(conteudo_edit.nome)

		cy.get('#date_start')
			.type(conteudo_edit.data_inicio)			

		cy.get('#time_start')
			.type(conteudo_edit.hora_inicio)

		cy.get('#date_end')
			.type(conteudo_edit.data_fim)

		cy.get('#time_end')
			.type(conteudo_edit.hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).clear().type(`${conteudo_edit.descricao} do catálogo nome: ${conteudo_edit.nome}`, { force: true })
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
			.type(conteudo_edit.numero_turma)

		cy.get('#event_days_to_expire')
			.clear()
			.type(conteudo_edit.vigencia)

		cy.get('#update_inscriptions')
			.click()

		cy.get('#event_place')
			.type(conteudo_edit.local)

		cy.get('#event_zip_code')
			.type(conteudo_edit.cep)

		cy.get('#event_address')
			.type(conteudo_edit.endereco)

		cy.get('#event_address2')
			.type(conteudo_edit.complemento)

		cy.get('#event_city')
			.type(conteudo_edit.cidade)

		cy.get('#event_state')
			.type(conteudo_edit.estado)

		cy.get('#event_country')
			.type(conteudo_edit.pais)

		cy.get('#event_email')
			.clear()	
			.type(conteudo_edit.email_responsavel)

		cy.get('#event_website')
			.type(conteudo_edit.site)

		cy.get('#event_sent_mail_owner')
			.click()

		cy.get('#event_contact_label')
			.type(conteudo_edit.rotulo_contato)

		cy.get('#event_hashtag')
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

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(1).then($body => {
				cy.wrap($body).click({ force: true }).type(`${conteudo_edit.mensagem_anexo} ${conteudo_edit.nome}`, { force: true })
			})
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

		cy.get('#event_installments_number')
			.clear()	
			.type(conteudo_edit.numero_parcelas)

		cy.get('#event_addition')
			.clear()
			.type(conteudo_edit.acrescimo)

		// Salvar a edição do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo editado foi salvo corretamente e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
		
		// READ-UPDATE
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
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
				cy.wrap($body).should('have.text', `${conteudo_edit.descricao} do catálogo nome: ${conteudo_edit.nome}`)
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
			.should('have.value', conteudo_edit.cep)

		cy.get('#event_address')
			.should('have.value', conteudo_edit.endereco)

		cy.get('#event_address2')
			.should('have.value', conteudo_edit.complemento)

		cy.get('#event_city')
			.should('have.value', conteudo_edit.cidade)

		cy.get('#event_state')
			.should('have.value', conteudo_edit.estado)
		
		cy.get('#event_country')
			.should('have.value', conteudo_edit.pais)

		cy.get('#event_email')
			.should('have.value', conteudo_edit.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo_edit.site)

		cy.get('#event_sent_mail_owner')
			.should('be.checked')

		cy.get('#event_contact_label')
			.should('have.value', conteudo_edit.rotulo_contato)

		cy.get('#event_hashtag')
			.should('have.value', conteudo_edit.hashtag)

		let categoriasEncontradas = []
		cy.get('li.as-selection-item.blur').each(($el) => {
			const text = $el.text().trim().replace('×', '').trim()
			categoriasEncontradas.push(text)
			})
		
		cy.get('li.as-selection-item.blur').then(() => {
			const categoriasEsperadas = [conteudo_edit.categoria.cat1, conteudo_edit.categoria.cat2].sort()
			categoriasEncontradas.sort()
			expect(categoriasEncontradas).to.deep.eq(categoriasEsperadas)
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
		
			cy.wrap(doc).find('body.cke_editable').eq(1).then($body => {
				cy.wrap($body).should('have.text', `${conteudo_edit.mensagem_anexo} ${conteudo_edit.nome}`)
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
			.should('be.checked')

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
			.should('be.checked')

		cy.get('#event_installments_number')
			.should('have.value', conteudo_edit.numero_parcelas)

		cy.get('#event_addition')
			.should('have.value', conteudo_edit.acrescimo)

		// Cancelar a edição do catálogo e validar redirecionamento
		cy.contains('#event-cancel','Cancelar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// DELETE
		// Clicar no botão de excluir do catálogo, mensagem de confirmação e confirmar exclusão
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
			.find('a[title="Excluir"]')
			.click()

		cy.contains('#modal-remove-events-index', 'Excluir Catálogo de Cursos')
			.should('be.visible')

		cy.contains('#modal-remove-events-index_sub_title', conteudo_edit.nome)
			.should('be.visible')

		cy.contains('#modal-remove-events-index-msg_title', 'Você tem certeza que deseja excluir este item de portfólio?')
			.should('be.visible')

		cy.get('#modal-remove-events-index-confirmed')
			.click({ force: true })

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos excluído com sucesso.', { timeout: 5000 })
			.should('be.visible')

		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Verificar se o catálogo foi excluído e não é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
			.should('not.exist')
	})

	it('2-CRUD catalogo liberado, com anexo, com pagamento, sem acrescimo, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação do catálogo
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
			mensagem_anexo: 'Insira o anexo do Catálogo do evento:',
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
		cy.acessarPgCatalogo()

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar no botão de adicionar novo catálogo e validar página correta
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de Cursos > Adicionar Novo')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
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
				cy.wrap($body).click({ force: true }).type(`${conteudo.descricao} do catálogo nome: ${conteudo.nome}`, { force: true })
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

		// Salvar a criação do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo foi criado e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)

		// READ
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
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
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

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
				cy.wrap($body).click({ force: true }).clear().type(`${conteudo_edit.descricao} do catálogo nome: ${conteudo_edit.nome}`, { force: true })
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

		// Salvar a edição do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo editado foi salvo corretamente e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
		
		// READ-UPDATE
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
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
				cy.wrap($body).should('have.text', `${conteudo_edit.descricao} do catálogo nome: ${conteudo_edit.nome}`)
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

		// Cancelar a edição do catálogo e validar redirecionamento
		cy.contains('#event-cancel','Cancelar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// DELETE
		// Clicar no botão de excluir do catálogo, mensagem de confirmação e confirmar exclusão
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
		.find('a[title="Excluir"]')
		.click()

		cy.contains('#modal-remove-events-index', 'Excluir Catálogo de Cursos')
		.should('be.visible')

		cy.contains('#modal-remove-events-index_sub_title', conteudo_edit.nome)
		.should('be.visible')

		cy.contains('#modal-remove-events-index-msg_title', 'Você tem certeza que deseja excluir este item de portfólio?')
		.should('be.visible')

		cy.get('#modal-remove-events-index-confirmed')
		.click({ force: true })

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos excluído com sucesso.', { timeout: 5000 })
		.should('be.visible')

		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Verificar se o catálogo foi excluído e não é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
		.should('not.exist')
	})

	it('3-CRUD catalogo liberado, com anexo, com pagamento, c/acrescimo, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			data_inicio: '29/01/2023',
			hora_inicio: '11:20',
			data_fim: '29/01/2024',
			hora_fim: '22:02',
			descricao: faker.commerce.productDescription(),
			tipo: 'Feira',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Em companhia',
			carga_horaria: faker.number.int({ min: 10, max: 99 }),
			numero_turma: faker.number.int({ min: 10, max: 99 }),
			vigencia: faker.number.int({ min: 10, max: 99 }),
			local: 'Youtube',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			rotulo_contato: 'Entre em contato conosco para mais informações.',
			hashtag: faker.hacker.adjective(),
			categoria: { 
				cat1: `Cat1-${faker.hacker.noun()}`,
				cat2: `Cat2-${faker.hacker.noun()}`,
				cat3: `Cat3-${faker.hacker.noun()}`
			},
			permite_anexo: 'Habilitado',
			visualizacao: 'Público',
			situacao: 'Liberado',
			notif_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			dias_teste: faker.number.int({ min: 10, max: 99 }),
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 10, max: 99 }),
			numero_parcelas: faker.number.int({ min: 10, max: 12 }),
			acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 })
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
		cy.acessarPgCatalogo()

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar no botão de adicionar novo catálogo e validar página correta
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de Cursos > Adicionar Novo')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
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
				cy.wrap($body).click({ force: true }).type(`${conteudo.descricao} do catálogo nome: ${conteudo.nome}`, { force: true })
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

		cy.get('#event_email')
			.clear()	
			.type(conteudo.email_responsavel)

		cy.get('#event_website')
			.type(conteudo.site)

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

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo.categoria.cat3)
		
		cy.realPress('Tab')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.permite_anexo}")`)
			.invoke('attr', 'for')
			.then((id) => {
				cy.get(`input#${id}`).click()
			})
	
		cy.get('#event_inscription_access')
			.select(conteudo.visualizacao)

		cy.get('#event_situation')
			.select(conteudo.situacao)

		cy.get('#event_end_class')
			.select(conteudo.notif_concluir_primeira_aula)

		cy.get('#event_notify_users')
			.select(conteudo.notificar_usuarios)

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

		cy.get('#event_addition')
			.clear()	
			.type(conteudo.acrescimo)
	
		// Salvar a criação do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo foi criado e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)

		// READ
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
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
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

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
			.should('have.value', conteudo.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo.site)

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

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
			const categoriasEsperadas = [conteudo.categoria.cat1, conteudo.categoria.cat2, conteudo.categoria.cat3].sort()
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
				cy.wrap($body).should('have.text', '')
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
			.contains(conteudo.notificar_usuarios)

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
			.should('have.value', conteudo.acrescimo)

		// UPDATE
		const conteudo_edit = {
			nome: faker.commerce.productName(),
			data_inicio: '10/03/2000',
			hora_inicio: '00:00',
			data_fim: '31/12/2050',
			hora_fim: '03:40',
			descricao: faker.commerce.productDescription(),
			tipo: 'Webinar',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			numero_turma: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			rotulo_contato: 'Mande-nos um e-mail',
			hashtag: faker.hacker.adjective(),
			categoria: { 
				cat1: `Cat4-${faker.hacker.noun()}`,
				cat2: `Cat5-${faker.hacker.noun()}`,
			},
			permite_anexo: 'Habilitado',
			mensagem_anexo: faker.lorem.sentence(),
			visualizacao: 'Colaborador',
			situacao: 'Em desenvolvimento',
			notif_concluir_primeira_aula: 'Não',
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
				cy.wrap($body).click({ force: true }).clear().type(`${conteudo_edit.descricao} do catálogo nome: ${conteudo_edit.nome}`, { force: true })
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
		
		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
			  
			cy.wrap(doc).find('body.cke_editable').eq(1).then($body => {
				cy.wrap($body).click({ force: true }).type(`${conteudo_edit.mensagem_anexo} ${conteudo_edit.nome}`, { force: true })
			})
		})

		cy.get('#event_inscription_access')
			.select(conteudo_edit.visualizacao)

		cy.get('#event_situation')
			.select(conteudo_edit.situacao)

		cy.get('#event_end_class')
			.select(conteudo_edit.notif_concluir_primeira_aula)

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

		// Salvar a edição do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo editado foi salvo corretamente e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
		
		// READ-UPDATE
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
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
				cy.wrap($body).should('have.text', `${conteudo_edit.descricao} do catálogo nome: ${conteudo_edit.nome}`)
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
			.should('have.value', conteudo_edit.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo_edit.site)

		cy.get('#event_sent_mail_owner')
			.should('be.checked')

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
			const categoriasEsperadasEdit = [conteudo.categoria.cat1, conteudo.categoria.cat2, conteudo.categoria.cat3, conteudo_edit.categoria.cat1, conteudo_edit.categoria.cat2].sort()
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
		
			cy.wrap(doc).find('body.cke_editable').eq(1).then($body => {
				cy.wrap($body).should('have.text', `${conteudo_edit.mensagem_anexo} ${conteudo_edit.nome}`)
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
			.contains(conteudo.notificar_usuarios)

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
			.should('have.value', conteudo.acrescimo)

		// Cancelar a edição do catálogo e validar redirecionamento
		cy.contains('#event-cancel','Cancelar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// DELETE
		// Clicar no botão de excluir do catálogo, mensagem de confirmação e confirmar exclusão
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
		.find('a[title="Excluir"]')
		.click()

		cy.contains('#modal-remove-events-index', 'Excluir Catálogo de Cursos')
		.should('be.visible')

		cy.contains('#modal-remove-events-index_sub_title', conteudo_edit.nome)
		.should('be.visible')

		cy.contains('#modal-remove-events-index-msg_title', 'Você tem certeza que deseja excluir este item de portfólio?')
		.should('be.visible')

		cy.get('#modal-remove-events-index-confirmed')
		.click({ force: true })

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos excluído com sucesso.', { timeout: 5000 })
		.should('be.visible')

		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Verificar se o catálogo foi excluído e não é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo_edit.nome}']`)
		.should('not.exist')
	})

	it('4-CRUD catalogo suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		// Cria um novo objeto Date para a data atual
		let dataAtual = new Date()

		// Extrai o dia, mês e ano do objeto Date
		let dia = dataAtual.getDate()
		let mes = dataAtual.getMonth() + 1
		let ano = dataAtual.getFullYear()

		// Converte dia e mês para string e garante que ambos tenham dois dígitos
		dia = dia < 10 ? '0' + dia : dia.toString()
		mes = mes < 10 ? '0' + mes : mes.toString()

		// Concatena as strings de ano, mês e dia
		let dataFormatada = `${dia}/${mes}/${ano}`

		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			data_inicio: dataFormatada,
			hora_inicio: '01:00',
			data_fim: dataFormatada,
			hora_fim: '23:00',
			descricao: faker.commerce.productDescription(),
			tipo: 'Outros',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			carga_horaria: faker.number.int({ min: 100, max: 999 }),
			numero_turma: faker.number.int({ min: 100, max: 999 }),
			vigencia: faker.number.int({ min: 100, max: 999 }),
			local: 'Youtube',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			hashtag: faker.hacker.adjective(),
			categoria: { 
				cat1: `Cat1-${faker.hacker.noun()}`
			},
			permite_anexo: 'Desabilitado',
			visualizacao: 'Colaborador',
			situacao: 'Suspenso',
			notif_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 100, max: 999 }),
			exige_confirmacao: 'Habilitado'
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
		cy.acessarPgCatalogo()

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar no botão de adicionar novo catálogo e validar página correta
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de Cursos > Adicionar Novo')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
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
				cy.wrap($body).click({ force: true }).type(`${conteudo.descricao} do catálogo nome: ${conteudo.nome}`, { force: true })
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

		cy.get('#event_email')
			.clear()	
			.type(conteudo.email_responsavel)

		cy.get('#event_website')
			.type(conteudo.site)

		cy.get('#event_hashtag')
			.type(conteudo.hashtag)

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo.categoria.cat1)
		
		cy.realPress('Tab')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.permite_anexo}")`)
			.invoke('attr', 'for')
			.then((id) => {
				cy.get(`input#${id}`).click()
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

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.exige_confirmacao}")`)
			.invoke('attr', 'for')
			.then((id) => {
				cy.get(`input#${id}`).click()
			})

		// Salvar a criação do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo foi criado e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)

		// READ
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
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
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

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
			.should('have.value', conteudo.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo.site)

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', conteudo.hashtag)

		let categoriasEncontradas = []
		cy.get('li.as-selection-item.blur').each(($el) => {
			const text = $el.text().trim().replace('×', '').trim()
			categoriasEncontradas.push(text)
			})
		
		cy.get('li.as-selection-item.blur').then(() => {
			const categoriasEsperadas = [conteudo.categoria.cat1].sort()
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
		
		 	cy.wrap(doc).find('body.cke_editable').eq(1).invoke('attr', 'contenteditable').then(contenteditable => {
		 		expect(contenteditable).to.eq('false')
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
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.exige_confirmacao}")`)
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

		// UPDATE
		const conteudo_edit = {
			data_inicio: '01/01/2000',
			data_fim: '28/02/2030',
			tipo: 'Treinamento',
			canal: 'Em companhia',
			categoria: { 
				cat1: `Cat2-${faker.hacker.noun()}`,
				cat2: `Cat3-${faker.hacker.noun()}`,
			},
			visualizacao: 'Usuários',
			situacao: 'Em desenvolvimento',
			exige_confirmacao: 'Desabilitado'
		}

		// Editar os campos do formulário - aba Dados
		cy.get('#event_name')
			.clear()
			.type(conteudo.nome)

		cy.get('#date_start')
			.clear()
			.type(conteudo_edit.data_inicio)			

		cy.get('#time_start')
			.clear()
			.type(conteudo.hora_inicio)

		cy.get('#date_end')
			.clear()
			.type(conteudo_edit.data_fim)

		cy.get('#time_end')
			.clear()
			.type(conteudo.hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
			
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).clear().type(`${conteudo.descricao} do catálogo nome: ${conteudo.nome}`, { force: true })
			})
		})

		cy.get('#event_event_type_id')
			.select(conteudo_edit.tipo)  

		cy.get('#event_mode')
			.select(conteudo.modalidade)  

		cy.get('#event_synchronism')
			.select(conteudo.sincronismo)  

		cy.get('#event_outlet')
			.select(conteudo_edit.canal)  

		cy.get('#event_workload')
			.clear()
			.type(conteudo.carga_horaria)

		cy.get('#event_class_number')
			.clear()
			.type(conteudo.numero_turma)

		cy.get('#event_days_to_expire')
			.clear()
			.type(conteudo.vigencia)

		cy.get('#event_email')
			.clear()	
			.type(conteudo.email_responsavel)

		cy.get('#event_website')
			.clear()
			.type(conteudo.site)

		cy.get('#event_hashtag')
			.clear()
			.type(conteudo.hashtag)

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo_edit.categoria.cat1)
		
		cy.realPress('Tab')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo_edit.categoria.cat2)
		
		cy.realPress('Tab')
		
		cy.get('#event_inscription_access')
			.select(conteudo_edit.visualizacao)

		cy.get('#event_situation')
			.select(conteudo_edit.situacao)

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo_edit.exige_confirmacao}")`)
			.invoke('attr', 'for')
			.then((id) => {
				cy.get(`input#${id}`).click()
			})

		// Salvar a edição do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo editado foi salvo corretamente e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
		
		// READ-UPDATE
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo.nome)

		cy.get('#date_start')
			.should('have.value', conteudo_edit.data_inicio)

		cy.get('#time_start')
			.should('have.value', conteudo.hora_inicio)

		cy.get('#date_end')
			.should('have.value', conteudo_edit.data_fim)

		cy.get('#time_end')
			.should('have.value', conteudo.hora_fim)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
			
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo_edit.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.text', conteudo_edit.canal)

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
			.should('have.value', conteudo.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo.site)

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', conteudo.hashtag)

		let categoriasEncontradasEdit = []
		cy.get('li.as-selection-item.blur').each(($el) => {
			const text = $el.text().trim().replace('×', '').trim()
			categoriasEncontradasEdit.push(text)
			})
		
		cy.get('li.as-selection-item.blur').then(() => {
			const categoriasEsperadasEdit = [conteudo.categoria.cat1, conteudo_edit.categoria.cat1, conteudo_edit.categoria.cat2].sort()
			categoriasEncontradasEdit.sort()
			expect(categoriasEncontradasEdit).to.deep.eq(categoriasEsperadasEdit)
		})
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('${conteudo.permite_anexo}')`)
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
			.contains(conteudo.notif_concluir_primeira_aula)

		cy.get('#event_notify_users')
			.find('option:selected')
			.contains('Não')

		cy.get('#event_trial_days')
			.should('have.value', conteudo.dias_teste)

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
			.should('have.value', '0,00')

		cy.get('#event_payment_enabled')
			.should('not.be.checked')

		cy.get('#event_installments_number')
			.should('have.value', '1')

		cy.get('#event_addition')
			.should('have.value', '0.0')

		// Cancelar a edição do catálogo e validar redirecionamento
		cy.contains('#event-cancel','Cancelar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// DELETE
		// Clicar no botão de excluir do catálogo, mensagem de confirmação e confirmar exclusão
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
		.find('a[title="Excluir"]')
		.click()

		cy.contains('#modal-remove-events-index', 'Excluir Catálogo de Cursos')
		.should('be.visible')

		cy.contains('#modal-remove-events-index_sub_title', conteudo.nome)
		.should('be.visible')

		cy.contains('#modal-remove-events-index-msg_title', 'Você tem certeza que deseja excluir este item de portfólio?')
		.should('be.visible')

		cy.get('#modal-remove-events-index-confirmed')
		.click({ force: true })

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos excluído com sucesso.', { timeout: 5000 })
		.should('be.visible')

		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Verificar se o catálogo foi excluído e não é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
		.should('not.exist')		
	})

	it('5-CRUD catalogo em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			descricao: faker.commerce.productDescription(),
			tipo: 'Palestra',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			carga_horaria: faker.number.int({ min: 1000, max: 9999 }),
			numero_turma: faker.number.int({ min: 1000, max: 9999 }),
			vigencia: faker.number.int({ min: 1000, max: 9999 }),
			local: 'Twygo',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			hashtag: faker.hacker.adjective(),
			categoria: { 
				cat1: faker.hacker.noun()
			},
			visualizacao: 'Usuários',
			situacao: 'Suspenso',
			notif_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 1000, max: 9999 }),
			exige_confirmacao: 'Habilitado'
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
		cy.acessarPgCatalogo()

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar no botão de adicionar novo catálogo e validar página correta
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de Cursos > Adicionar Novo')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
			.should('be.visible')

		// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type(conteudo.nome)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
			
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).type(`${conteudo.descricao} do catálogo nome: ${conteudo.nome}`, { force: true })
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

		cy.get('#event_email')
			.clear()	
			.type(conteudo.email_responsavel)

		cy.get('#event_website')
			.type(conteudo.site)

		cy.get('#event_hashtag')
			.type(conteudo.hashtag)

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo.categoria.cat1)
		
		cy.realPress('Tab')

		cy.get('#event_inscription_access')
			.select(conteudo.visualizacao)

		cy.get('#event_situation')
			.select(conteudo.situacao)

		cy.get('#event_end_class')
			.select(conteudo.notif_concluir_primeira_aula)

		cy.get('#event_trial_days')
			.clear()
			.type(conteudo.dias_teste)

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.exige_confirmacao}")`)
			.invoke('attr', 'for')
			.then((id) => {
				cy.get(`input#${id}`).click()
			})

		// Salvar a criação do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo foi criado e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)

		// READ
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo.nome)

		cy.get('#date_start')
			.should('have.value', '')

		cy.get('#time_start')
			.should('have.value', '')

		cy.get('#date_end')
			.should('have.value', '')

		cy.get('#time_end')
			.should('have.value', '')

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

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
			.should('have.value', conteudo.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo.site)

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', conteudo.hashtag)

		let categoriasEncontradas = []
		cy.get('li.as-selection-item.blur').each(($el) => {
			const text = $el.text().trim().replace('×', '').trim()
			categoriasEncontradas.push(text)
			})
		
		cy.get('li.as-selection-item.blur').then(() => {
			const categoriasEsperadas = [conteudo.categoria.cat1].sort()
			categoriasEncontradas.sort()
			expect(categoriasEncontradas).to.deep.eq(categoriasEsperadas)
		})
		
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

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
		 	const doc = $iframe.contents()
		
		 	cy.wrap(doc).find('body.cke_editable').eq(1).invoke('attr', 'contenteditable').then(contenteditable => {
		 		expect(contenteditable).to.eq('false')
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
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.exige_confirmacao}")`)
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

		// UPDATE
		const conteudo_edit = {
			tipo: 'Outros',
			visualizacao: 'Inscritos'
		}

		// Editar os campos do formulário - aba Dados
		cy.get('#event_event_type_id')
			.select(conteudo_edit.tipo)  

		cy.get('#event_inscription_access')
			.select(conteudo_edit.visualizacao)

		// Salvar a edição do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo editado foi salvo corretamente e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
		
		// READ-UPDATE
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo.nome)

		cy.get('#date_start')
			.should('have.value', '')

		cy.get('#time_start')
			.should('have.value', '')

		cy.get('#date_end')
			.should('have.value', '')

		cy.get('#time_end')
			.should('have.value', '')

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo_edit.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.value', conteudo.canal)

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
			.should('have.value', conteudo.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo.site)

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', conteudo.hashtag)

		let categoriasEncontradasEdit = []
		cy.get('li.as-selection-item.blur').each(($el) => {
			const text = $el.text().trim().replace('×', '').trim()
			categoriasEncontradasEdit.push(text)
			})
		
		cy.get('li.as-selection-item.blur').then(() => {
			const categoriasEsperadasEdit = [conteudo.categoria.cat1].sort()
			categoriasEncontradasEdit.sort()
			expect(categoriasEncontradasEdit).to.deep.eq(categoriasEsperadasEdit)
		})
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('Desabilitado')`)
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
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('${conteudo.exige_confirmacao}')`)
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

		// Cancelar a edição do catálogo e validar redirecionamento
		cy.contains('#event-cancel','Cancelar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// DELETE
		// Clicar no botão de excluir do catálogo, mensagem de confirmação e confirmar exclusão
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
		.find('a[title="Excluir"]')
		.click()

		cy.contains('#modal-remove-events-index', 'Excluir Catálogo de Cursos')
		.should('be.visible')

		cy.contains('#modal-remove-events-index_sub_title', conteudo.nome)
		.should('be.visible')

		cy.contains('#modal-remove-events-index-msg_title', 'Você tem certeza que deseja excluir este item de portfólio?')
		.should('be.visible')

		cy.get('#modal-remove-events-index-confirmed')
		.click({ force: true })

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos excluído com sucesso.', { timeout: 5000 })
		.should('be.visible')

		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Verificar se o catálogo foi excluído e não é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
		.should('not.exist')
	})

	it('6-CRUD catalogo liberado, sem anexo, sem pagamento, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			descricao: faker.commerce.productDescription(),
			tipo: 'Webinar',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			carga_horaria: faker.number.int({ min: 1, max: 99 }),
			numero_turma: faker.number.int({ min: 1, max: 99 }),
			vigencia: faker.number.int({ min: 1, max: 99 }),
			local: 'Zoom',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			categoria: { 
				cat1: `Cat1-${faker.hacker.noun()}`,
				cat2: `Cat2-${faker.hacker.noun()}`
			},
			visualizacao: 'Público',
			situacao: 'Liberado',
			notif_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			exige_confirmacao: 'Desabilitado'
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
		cy.acessarPgCatalogo()

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar no botão de adicionar novo catálogo e validar página correta
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de Cursos > Adicionar Novo')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
			.should('be.visible')

		// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type(conteudo.nome)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
			
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).type(`${conteudo.descricao} do catálogo nome: ${conteudo.nome}`, { force: true })
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

		cy.get('#event_email')
			.clear()	
			.type(conteudo.email_responsavel)

		cy.get('#event_website')
			.type(conteudo.site)

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo.categoria.cat1)
		
		cy.realPress('Tab')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo.categoria.cat2)
		
		cy.realPress('Tab')

		cy.get('#event_inscription_access')
			.select(conteudo.visualizacao)

		cy.get('#event_situation')
			.select(conteudo.situacao)

		cy.get('#event_end_class')
			.select(conteudo.notif_concluir_primeira_aula)

		cy.get('#event_notify_users')
			.select(conteudo.notificar_usuarios)

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.exige_confirmacao}")`)
			.invoke('attr', 'for')
			.then((id) => {
				cy.get(`input#${id}`).click()
			})

		// Salvar a criação do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo foi criado e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)

		// READ
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo.nome)

		cy.get('#date_start')
			.should('have.value', '')

		cy.get('#time_start')
			.should('have.value', '')

		cy.get('#date_end')
			.should('have.value', '')

		cy.get('#time_end')
			.should('have.value', '')

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

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
			.should('have.value', conteudo.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo.site)

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', '')

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
			.find('label:contains("Desabilitado")')
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
			.contains(conteudo.visualizacao)

		cy.get('#event_situation')
			.find('option:selected')
			.contains(conteudo.situacao)

		cy.get('#event_end_class')
			.find('option:selected')
			.contains(conteudo.notif_concluir_primeira_aula)

		cy.get('#event_notify_users')
			.find('option:selected')
			.contains(conteudo.notificar_usuarios)

		cy.get('#event_trial_days')
			.should('have.value', '0')

		cy.get('#event_enable_trial_days')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.exige_confirmacao}")`)
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
		
		// UPDATE
		const conteudo_edit = {
			tipo: 'Palestra'
		}

		// Editar os campos do formulário - aba Dados
		cy.get('#event_event_type_id')
			.select(conteudo_edit.tipo)
			
		cy.contains('li.as-selection-item', conteudo.categoria.cat1)
			.find('a.as-close')
			.click()

		// Salvar a edição do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo editado foi salvo corretamente e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
		
		// READ-UPDATE
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo.nome)

		cy.get('#date_start')
			.should('have.value', '')

		cy.get('#time_start')
			.should('have.value', '')

		cy.get('#date_end')
			.should('have.value', '')

		cy.get('#time_end')
			.should('have.value', '')

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo_edit.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.value', conteudo.canal)

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
			.should('have.value', conteudo.email_responsavel)
		
		cy.get('#event_website')
			.should('have.value', conteudo.site)

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', '')

		let categoriasEncontradasEdit = []
		cy.get('li.as-selection-item.blur').each(($el) => {
			const text = $el.text().trim().replace('×', '').trim()
			categoriasEncontradasEdit.push(text)
			})
		
		cy.get('li.as-selection-item.blur').then(() => {
			const categoriasEsperadasEdit = [conteudo.categoria.cat2].sort()
			categoriasEncontradasEdit.sort()
			expect(categoriasEncontradasEdit).to.deep.eq(categoriasEsperadasEdit)
		})
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('Desabilitado')`)
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
			.contains(conteudo.visualizacao)

		cy.get('#event_situation')
			.find('option:selected')
			.contains(conteudo.situacao)

		cy.get('#event_end_class')
			.find('option:selected')
			.contains(conteudo.notif_concluir_primeira_aula)

		cy.get('#event_notify_users')
			.find('option:selected')
			.contains(conteudo.notificar_usuarios)

		cy.get('#event_trial_days')
			.should('have.value', '0')

		cy.get('#event_enable_trial_days')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('${conteudo.exige_confirmacao}')`)
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

		// Cancelar a edição do catálogo e validar redirecionamento
		cy.contains('#event-cancel','Cancelar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// DELETE
		// Clicar no botão de excluir do catálogo, mensagem de confirmação e confirmar exclusão
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
		.find('a[title="Excluir"]')
		.click()

		cy.contains('#modal-remove-events-index', 'Excluir Catálogo de Cursos')
		.should('be.visible')

		cy.contains('#modal-remove-events-index_sub_title', conteudo.nome)
		.should('be.visible')

		cy.contains('#modal-remove-events-index-msg_title', 'Você tem certeza que deseja excluir este item de portfólio?')
		.should('be.visible')

		cy.get('#modal-remove-events-index-confirmed')
		.click({ force: true })

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos excluído com sucesso.', { timeout: 5000 })
		.should('be.visible')

		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Verificar se o catálogo foi excluído e não é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
		.should('not.exist')
	})

	it('7-CRUD catalogo em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para usuários', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			descricao: faker.commerce.productDescription(),
			tipo: 'Treinamento',
			modalidade: 'Online',
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			vigencia: '10000',
			local: 'Twitch',
			site: faker.internet.url(),
			hashtag: `#${faker.hacker.abbreviation()}`,
			categoria: { 
				cat1: `Cat1-${faker.hacker.noun()}`,
				cat2: `Cat2-${faker.hacker.noun()}`
			},
			visualizacao: 'Usuários',
			situacao: 'Em desenvolvimento',
			notif_concluir_primeira_aula: 'Não'
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
		cy.acessarPgCatalogo()

		// !!! INÍCIO DO TESTE !!!
		// CREATE
		// Clicar no botão de adicionar novo catálogo e validar página correta
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de Cursos > Adicionar Novo')
			.should('be.visible')

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
			.should('be.visible')

		// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type(conteudo.nome)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
			
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).type(`${conteudo.descricao} do catálogo nome: ${conteudo.nome}`, { force: true })
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

		cy.get('#event_days_to_expire')
			.clear()
			.type(conteudo.vigencia)

		cy.get('#event_place')
			.type(conteudo.local)

		cy.get('#event_website')
			.type(conteudo.site)

		cy.get('#event_hashtag')
			.type(conteudo.hashtag)

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo.categoria.cat1)
		
		cy.realPress('Tab')

		cy.get("input.form-control.as-input[name='event[category_extra]']")
			.type(conteudo.categoria.cat2)
		
		cy.realPress('Tab')

		cy.get('#event_inscription_access')
			.select(conteudo.visualizacao)

		cy.get('#event_situation')
			.select(conteudo.situacao)

		cy.get('#event_end_class')
			.select(conteudo.notif_concluir_primeira_aula)

		// Salvar a criação do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo foi criado e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)

		// READ
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo.nome)

		cy.get('#date_start')
			.should('have.value', '')

		cy.get('#time_start')
			.should('have.value', '')

		cy.get('#date_end')
			.should('have.value', '')

		cy.get('#time_end')
			.should('have.value', '')

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.text', conteudo.canal)

		cy.get('#event_workload')
			.should('have.value', '0')

		cy.get('#event_class_number')
			.should('have.value', '')

		cy.get('#event_days_to_expire')
			.should('have.value', conteudo.vigencia)

		cy.get('#update_inscriptions')
			.should('not.be.checked')

		cy.get('#event_place')
			.should('have.value', conteudo.local)

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
			.should('have.value', 'karla.oliveira@twygo.com')
		
		cy.get('#event_website')
			.should('have.value', conteudo.site)

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

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
			.find('label:contains("Desabilitado")')
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
			.should('have.value', '0')

		cy.get('#event_enable_trial_days')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('Habilitado')`)
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

		// UPDATE
		// Editar os campos do formulário - aba Dados
		cy.get('#event_days_to_expire')
			.clear()

		cy.get('#event_website')
			.clear()

		cy.get('#event_hashtag')
			.clear()
		
		cy.contains('li.as-selection-item', conteudo.categoria.cat1)
			.find('a.as-close')
			.click()

		cy.contains('li.as-selection-item', conteudo.categoria.cat2)
			.find('a.as-close')
			.click()

		// Salvar a edição do catálogo, validar mensagem e redirecionamento
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.', { timeout: 5000 })
			.should('be.visible')

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// Verificar se o catálogo editado foi salvo corretamente e é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
		
		// READ-UPDATE
		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Clicar no botão de editar do catálogo para validar dados salvos e página correta
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.find('a[title="Editar"]')
			.click()
		
		cy.wait(2000)

		cy.contains('#page-breadcrumb', 'Detalhes do Item de Portfólio')
			.should('be.visible')

		cy.contains('.detail_title', 'Edição de Catálogo de Cursos')
			.should('be.visible')

		// Verificar se os dados foram salvos corretamente
		cy.get('#event_name')
			.should('have.value', conteudo.nome)

		cy.get('#date_start')
			.should('have.value', '')

		cy.get('#time_start')
			.should('have.value', '')

		cy.get('#date_end')
			.should('have.value', '')

		cy.get('#time_end')
			.should('have.value', '')

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 5000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).should('have.text', `${conteudo.descricao} do catálogo nome: ${conteudo.nome}`)
			})
		})

		cy.get('#event_event_type_id')
			.find('option:selected')
			.contains(conteudo.tipo)

		cy.get('#event_mode')
			.find('option:selected')
			.contains(conteudo.modalidade)

		cy.get('#event_synchronism')
			.find('option:selected')
			.contains(conteudo.sincronismo)

		cy.get('#event_outlet')
			.find('option:selected')
			.should('have.value', conteudo.canal)

		cy.get('#event_workload')
			.should('have.value', '0')

		cy.get('#event_class_number')
			.should('have.value', '')

		cy.get('#event_days_to_expire')
			.should('have.value', '')

		cy.get('#update_inscriptions')
			.should('not.be.checked')

		cy.get('#event_place')
			.should('have.value', conteudo.local)

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
			.should('have.value', 'karla.oliveira@twygo.com')
		
		cy.get('#event_website')
			.should('have.value', '')

		cy.get('#event_sent_mail_owner')
			.should('not.be.checked')

		cy.get('#event_contact_label')
			.should('have.value', '')

		cy.get('#event_hashtag')
			.should('have.value', '')

		cy.get('ul.as-selections')
			.find('li.as-selection-item.blur')
			.should('have.length', 0)
		
		cy.get('#remove_banner')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Permitir envio de anexos na inscrição?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('Desabilitado')`)
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
			.should('have.value', '0')

		cy.get('#event_enable_trial_days')
			.should('not.be.checked')

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains('Habilitado')`)
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

		// Cancelar a edição do catálogo e validar redirecionamento
		cy.contains('#event-cancel','Cancelar')
			.should('be.visible')
			.click()

		cy.contains('#page-breadcrumb', 'Catálogo de cursos')
			.should('be.visible')

		// DELETE
		// Clicar no botão de excluir do catálogo, mensagem de confirmação e confirmar exclusão
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
		.find('a[title="Excluir"]')
		.click()

		cy.contains('#modal-remove-events-index', 'Excluir Catálogo de Cursos')
		.should('be.visible')

		cy.contains('#modal-remove-events-index_sub_title', conteudo.nome)
		.should('be.visible')

		cy.contains('#modal-remove-events-index-msg_title', 'Você tem certeza que deseja excluir este item de portfólio?')
		.should('be.visible')

		cy.get('#modal-remove-events-index-confirmed')
		.click({ force: true })

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos excluído com sucesso.', { timeout: 5000 })
		.should('be.visible')

		// Aguardar 4s devido a atualização da página
		cy.wait(4000)

		// Verificar se o catálogo foi excluído e não é exibido na listagem
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
		.should('not.exist')
	})
})