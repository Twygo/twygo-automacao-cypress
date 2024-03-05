/// reference types="cypress" />
import 'cypress-iframe'
import 'cypress-real-events/support'
import { faker } from '@faker-js/faker'

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
	
	it('criar catalogo com dados default', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			descricao: faker.commerce.productDescription()
		}

		// !!! PRÉ-CONDIÇÃO !!!
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

		// !!! INÍCIO DO TESTE !!!
		// Clicar no botão de adicionar novo catálogo
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
			.should('be.visible')

		// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type(conteudo.nome)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
			const doc = $iframe.contents()
		  
			cy.wrap(doc).find('body.cke_editable').eq(0).then($body => {
				cy.wrap($body).click({ force: true }).type(`${conteudo.descricao} do catálogo nome: ${conteudo.nome}`, { force: true })
			})
		})

		// Salvar a criação do catálogo
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.')
			.should('be.visible')

		// Verificar se o catálogo foi criado
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
	})

	it('deve criar um catalogo liberado, com anexo, com pagamento, sem acrescimo, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			data_inicio: '29032024',
			hora_inicio: '01:00',
			data_fim: '29042024',
			hora_fim: '23:00',
			descricao: faker.commerce.productDescription(),
			tipo: 'Congresso', //Lista de opções: Congresso, Feira, Outros, Palestra, Treinamento, Webinar
			modalidade: 'Presencial', //Lista de opções: Online, Presencial
			sincronismo: 'Ao vivo', //Lista de opções: Ao vivo, Gravado
			canal: 'Outros', //Lista de opções: Em companhia, Aberto, Outros
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
				cat1: faker.hacker.noun(),
				cat2: faker.hacker.noun(),
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

		// !!! INÍCIO DO TESTE !!!
		// Clicar no botão de adicionar novo catálogo
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

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

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
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
			.type(conteudo.carga_horaria)

		cy.get('#event_class_number')
			.type(conteudo.numero_turma)

		cy.get('#event_days_to_expire')
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

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
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
			.type(conteudo.valor_inscricao)

		cy.get('#event_payment_enabled')
			.click()

		cy.get('#event_installments_number')
			.clear()	
			.type(conteudo.numero_parcelas)

		// Salvar a criação do catálogo
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.')
			.should('be.visible')

		// Verificar se o catálogo foi criado
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
	})

	it('deve criar um catalogo liberado, com anexo, com pagamento, c/acrescimo, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			data_inicio: '29012023',
			hora_inicio: '01:00',
			data_fim: '29012024',
			hora_fim: '23:00',
			descricao: faker.commerce.productDescription(),
			tipo: 'Feira', //Lista de opções: Congresso, Feira, Outros, Palestra, Treinamento, Webinar
			modalidade: 'Online', //Lista de opções: Online, Presencial
			sincronismo: 'Gravado', //Lista de opções: Ao vivo, Gravado
			canal: 'Em companhia', //Lista de opções: Em companhia, Aberto, Outros
			carga_horaria: faker.number.int({ min: 10, max: 99 }),
			numero_turma: faker.number.int({ min: 10, max: 99 }),
			vigencia: faker.number.int({ min: 10, max: 99 }),
			local: 'Youtube',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			rotulo_contato: 'Contato',
			hashtag: faker.hacker.adjective(),
			categoria: { 
				cat1: faker.hacker.noun(),
				cat2: faker.hacker.noun(),
				cat3: faker.hacker.noun()
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
			acrescimo: faker.commerce.price({ min: 1, max: 9 })
		}

		// !!! PRÉ-CONDIÇÃO !!!
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

		// !!! INÍCIO DO TESTE !!!
		// Clicar no botão de adicionar novo catálogo
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

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

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
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
			.type(conteudo.carga_horaria)

		cy.get('#event_class_number')
			.type(conteudo.numero_turma)

		cy.get('#event_days_to_expire')
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
			.type(conteudo.valor_inscricao)

		cy.get('#event_payment_enabled')
			.click()

		cy.get('#event_installments_number')
			.clear()	
			.type(conteudo.numero_parcelas)

		cy.get('#event_addition')
			.clear()	
			.type(conteudo.acrescimo)
	
		// Salvar a criação do catálogo
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.')
			.should('be.visible')

		// Verificar se o catálogo foi criado
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
	})

	it('deve criar um catalogo suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
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
		let dataFormatada = dia + mes + ano

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
				cat1: faker.hacker.noun()
			},
			permite_anexo: 'Desabilitado',
			visualizacao: 'Colaborador',
			situacao: 'Suspenso',
			notif_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 100, max: 999 }),
			exige_confirmacao: 'Habilitado'
		}

		// !!! PRÉ-CONDIÇÃO !!!
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

		// !!! INÍCIO DO TESTE !!!
		// Clicar no botão de adicionar novo catálogo
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

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

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
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
			.type(conteudo.carga_horaria)

		cy.get('#event_class_number')
			.type(conteudo.numero_turma)

		cy.get('#event_days_to_expire')
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

		// Salvar a criação do catálogo
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.')
			.should('be.visible')

		// Verificar se o catálogo foi criado
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
	})

	it('deve criar um catalogo em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
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

		// !!! INÍCIO DO TESTE !!!
		// Clicar no botão de adicionar novo catálogo
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
			.should('be.visible')

		// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type(conteudo.nome)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
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
			.type(conteudo.carga_horaria)

		cy.get('#event_class_number')
			.type(conteudo.numero_turma)

		cy.get('#event_days_to_expire')
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

		cy.get('div.col-md-6.col-lg-4')
			.contains('Exigir confirmação de inscrição pelo Organizador?')
			.parents('.col-md-6.col-lg-4')
			.find(`label:contains("${conteudo.exige_confirmacao}")`)
			.invoke('attr', 'for')
			.then((id) => {
				cy.get(`input#${id}`).click()
			})

		// Salvar a criação do catálogo
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.')
			.should('be.visible')

		// Verificar se o catálogo foi criado
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
	})

	it('deve criar um catalogo liberado, sem anexo, sem pagamento, sem confirmação, com visualização para público', () => {
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
			local: 'Clube',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			categoria: { 
				cat1: faker.hacker.noun()
			},
			visualizacao: 'Público',
			situacao: 'Liberado',
			notif_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			exige_confirmacao: 'Desabilitado'
		}

		// !!! PRÉ-CONDIÇÃO !!!
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

		// !!! INÍCIO DO TESTE !!!
		// Clicar no botão de adicionar novo catálogo
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
			.should('be.visible')

		// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type(conteudo.nome)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
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
			.type(conteudo.carga_horaria)

		cy.get('#event_class_number')
			.type(conteudo.numero_turma)

		cy.get('#event_days_to_expire')
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

		// Salvar a criação do catálogo
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.')
			.should('be.visible')

		// Verificar se o catálogo foi criado
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
	})

	it('deve criar um catalogo liberado, sem anexo, sem pagamento, com confirmação, com visualização para público', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			descricao: faker.commerce.productDescription(),
			tipo: 'Treinamento',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			carga_horaria: faker.number.int({ min: 10000, max: 99999 }),
			numero_turma: faker.number.int({ min: 10000, max: 99999 }),
			vigencia: faker.number.int({ min: 10000, max: 99999 }),
			local: 'Clube',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			categoria: { 
				cat1: faker.hacker.noun()
			},
			visualizacao: 'Público',
			situacao: 'Liberado',
			notif_concluir_primeira_aula: 'Não',
			notificar_usuarios: 'Não',
			exige_confirmacao: 'Habilitado'
		}

		// !!! PRÉ-CONDIÇÃO !!!
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

		// !!! INÍCIO DO TESTE !!!
		// Clicar no botão de adicionar novo catálogo
		cy.contains('button', 'Adicionar')
			.should('be.visible')
			.click()

		cy.contains('.detail_title', 'Novo Catálogo de Cursos')
			.should('be.visible')

		// Preencher os campos do formulário - aba Dados
		cy.get('#event_name')
			.type(conteudo.nome)

		cy.get('iframe.cke_wysiwyg_frame', { timeout: 10000 }).then($iframe => {
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
			.type(conteudo.carga_horaria)

		cy.get('#event_class_number')
			.type(conteudo.numero_turma)

		cy.get('#event_days_to_expire')
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

		// Salvar a criação do catálogo
		cy.contains('button', 'Salvar')
			.should('be.visible')
			.click()

		cy.contains('.flash.notice', 'Item do Catálogo de Cursos salvo com sucesso.')
			.should('be.visible')

		// Verificar se o catálogo foi criado
		cy.get(`tr.event-row[name='${conteudo.nome}']`)
			.should('be.visible')
			.should('have.length', 1)
	})
})