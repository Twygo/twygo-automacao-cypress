/// reference types="cypress" />
import 'cypress-real-events/support'
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
import { gerarData } from '../support/utils_helper'

describe('curso', () => {
	let nome, tipoConteudo, categorias, novasCategorias, delCategorias

	// Campos e dados default do formulário de curso
	let formularioConteudo = {
		nome: '',
		data_inicio: '',
		hora_inicio: '',
		data_fim: '',
		hora_fim: '',
		descricao: '',
		tipo: 'Treinamento',
		modalidade: 'Online',
		sincronismo: 'Gravado',
		canal: '',
		carga_horaria: '0',
		numero_turma: '',
		vigencia: '0',
		atualizar_inscritos: false,
		local: '',
		cep: '',
		endereco: '',
		complemento: '',
		cidade: '',
		estado: '',
		pais: '',
		email_responsavel: Cypress.env('login'),
		site: '',
		notificar_responsavel: false,
		rotulo_contato: '',
		hashtag: '',
		addCategoria: '',
		removerCategoria: '',
		remover_banner: false,
		permite_anexo: 'Desabilitado',
		mensagem_anexo: '',
		status_iframe_anexo: false,
		visualizacao: 'Inscritos',
		situacao: 'Em desenvolvimento',
		notificar_concluir_primeira_aula: 'Não',
		notificar_usuarios: 'Não',
		dias_teste: '0',
		habilitar_dias_teste: false,
		exige_confirmacao: 'Habilitado',
		valor_inscricao: '0,00',
		habilitar_pagamento: false,
		nr_parcelas: '1',
		valor_acrescimo: '0.0',
		habilitar_chat: false
	}

	before(() => {
		// Carrega os labels do arquivo JSON
		cy.fixture('labels.json').then((labels) => {
			Cypress.env('labels', labels)
		})
	})

	beforeEach( () => {
		// Ativa o tratamento de exceção não capturada especificamente para este teste
		Cypress.on('uncaught:exception', (err, runnable) => {
		  	return false
		})

		// Define o tipo de conteúdo
		tipoConteudo = 'curso'

		// Gera um nome aleatório para o conteúdo
		nome = fakerPT_BR.commerce.productName()

		// Inicializa o array de categorias
		categorias = []
		novasCategorias = []
		delCategorias = []

		// Obtém o token de autenticação
		getAuthToken()

		// Exclui todos os cursos antes de iniciar o teste
		cy.excluirCursoViaApi()
	})
	
	afterEach(() => {
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})
	
	it.only('1. CRUD curso com dados default', () =>{
		// Massa de dados para criação do curso
        const conteudo = {
			nome: nome,
            descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

        cy.editarConteudo(conteudo.nome, tipoConteudo)
        
		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')

		const novoNome = fakerPT_BR.commerce.productName()
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudoEdit = {
			nome: novoNome,
			data_inicio: '29/03/2024',
			hora_inicio: '12:00',
			data_fim: '29/04/2024',
			hora_fim: '22:00',
			descricao: `${fakerPT_BR.commerce.productDescription()} editado do evento ${novoNome}`,
			tipo: 'Congresso',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Outros',
			carga_horaria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numero_turma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			local: 'Centro de Eventos',
			cep: '85803-760',
			endereco: 'Rua das Petúnias',
			complemento: 'Apto 101',
			cidade: 'Cascavel',
			estado: 'PR',
			pais: 'Brasil',
			email_responsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificar_responsavel: true,
			rotulo_contato: 'Contato',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			remover_banner: true,
			permite_anexo: 'Habilitado',
			mensagem_anexo: `Insira o anexo do Curso: ${novoNome}`,
			status_iframe_anexo: true,
			visualizacao: 'Público',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			dias_teste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: fakerPT_BR.number.int({ min: 1, max: 9 }),
			valor_acrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitar_chat: true
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	it('2. CRUD curso liberado, com anexo, com pagamento, sem acréscimo, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: '29/03/2024',
			hora_inicio: '01:00',
			data_fim: '29/04/2024',
			hora_fim: '23:00',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Congresso',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Outros',
			carga_horaria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numero_turma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			local: 'Centro de Eventos',
			cep: '85804-455',
			endereco: 'Rua das Flores',
			complemento: 'Casa dos fundos',
			cidade: 'Joinville',
			estado: 'SC',
			pais: 'Brasil',
			email_responsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificar_responsavel: true,
			rotulo_contato: 'Fale conosco',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			permite_anexo: 'Habilitado',
			mensagem_anexo: `Insira o anexo do Curso: ${nome}`,
			status_iframe_anexo: true,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			dias_teste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Habilitado',
			valor_inscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitar_chat: true
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

        cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
        cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')

		const novoNome = fakerPT_BR.commerce.productName()
		novasCategorias = [`Cat3-${fakerPT_BR.hacker.noun()}`, `Cat4-${fakerPT_BR.hacker.noun()}`]
		const conteudoEdit = {
			nome: novoNome,
			data_inicio: '01/01/2023',
			hora_inicio: '00:01',
			data_fim: '31/01/2025',
			hora_fim: '23:59',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${novoNome}`,
			tipo: 'Feira',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: '',
			carga_horaria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numero_turma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			local: 'T&D Connect',
			email_responsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificar_responsavel: false,
			rotulo_contato: 'Contato',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: novasCategorias,
			remover_banner: true,
			permite_anexo: 'Desabilitado',
			status_iframe_anexo: false,
			visualizacao: 'Público',
			situacao: 'Suspenso',
			notificar_concluir_primeira_aula: 'Não',
			notificar_usuarios: 'Sim',
			dias_teste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: false,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: false,
			habilitar_chat: false
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		let dadosEspecificos = {
			endereco: '',
			complemento: '',
			cidade: '',
			estado: '',
			pais: ''
		}

		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit, ...dadosEspecificos }		
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')
		
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	it('3. CRUD curso liberado, com anexo, com pagamento, c/acréscimo, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`, `Cat3-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: '29/01/2023',
			hora_inicio: '11:20',
			data_fim: '29/01/2024',
			hora_fim: '22:02',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Feira',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Em companhia',
			carga_horaria: fakerPT_BR.number.int({ min: 10, max: 99 }),
			numero_turma: fakerPT_BR.number.int({ min: 10, max: 99 }),
			vigencia: fakerPT_BR.number.int({ min: 10, max: 99 }),
			local: 'Youtube',
			email_responsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificar_responsavel: false,
			rotulo_contato: 'Entre em contato conosco para mais informações.',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			visualizacao: 'Público',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			dias_teste: fakerPT_BR.number.int({ min: 10, max: 99 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: fakerPT_BR.commerce.price({ min: 10, max: 99 }),
			habilitar_pagamento: true,
			nr_parcelas: fakerPT_BR.number.int({ min: 10, max: 12 }),
			valor_acrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitar_chat: true
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

        cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
        cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')

		const novoNome = fakerPT_BR.commerce.productName()
		novasCategorias = [`Cat4-${fakerPT_BR.hacker.noun()}`, `Cat5-${fakerPT_BR.hacker.noun()}`]		
		const conteudoEdit = {
			nome: novoNome,
			data_inicio: '10/03/2000',
			hora_inicio: '00:00',
			data_fim: '31/12/2050',
			hora_fim: '03:40',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${novoNome}`,
			tipo: 'Webinar',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			carga_horaria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numero_turma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			email_responsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificar_responsavel: true,
			rotulo_contato: 'Mande-nos um e-mail',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: novasCategorias,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			mensagem_anexo: `Insira o anexo do Curso: ${novoNome}`,
			visualizacao: 'Colaborador',
			situacao: 'Em desenvolvimento',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: false,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: false,
			habilitar_chat: false
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	it('4. CRUD curso suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: gerarData(),
			hora_inicio: '01:00',
			data_fim: gerarData(),
			hora_fim: '23:00',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Outros',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			carga_horaria: fakerPT_BR.number.int({ min: 100, max: 999 }),
			numero_turma: fakerPT_BR.number.int({ min: 100, max: 999 }),
			vigencia: fakerPT_BR.number.int({ min: 100, max: 999 }),
			local: 'Youtube',
			email_responsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificar_responsavel: false,
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			permite_anexo: 'Desabilitado',
			status_iframe_anexo: false,
			status_iframe_anexo: false,
			visualizacao: 'Colaborador',
			situacao: 'Suspenso',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: fakerPT_BR.number.int({ min: 100, max: 999 }),
			habilitar_dias_teste: false,
			exige_confirmacao: 'Habilitado',
			habilitar_pagamento: false,
			habilitar_chat: true
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

        cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
        cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')

		novasCategorias = [`Cat2-${fakerPT_BR.hacker.noun()}`, `Cat3-${fakerPT_BR.hacker.noun()}`]
		const conteudoEdit = {
			data_inicio: '01/01/2000',
			data_fim: '28/02/2030',
			tipo: 'Treinamento',
			canal: 'Em companhia',
			addCategoria: novasCategorias,
			visualizacao: 'Usuários',
			situacao: 'Em desenvolvimento',
			exige_confirmacao: 'Desabilitado'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')
		
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	it('5. CRUD curso em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Palestra',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			carga_horaria: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			numero_turma: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			vigencia: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			local: 'Twygo',
			email_responsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			status_iframe_anexo: false,
			visualizacao: 'Usuários',
			situacao: 'Suspenso',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			exige_confirmacao: 'Habilitado',
			habilitar_chat: true
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.addConteudo(tipoConteudo)
		cy.preencherDadosConteudo(conteudo, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
		cy.validarDadosConteudo(dadosParaValidar, categorias)
		
		// UPDATE
		cy.log('## UPDATE ##')

		const conteudoEdit = {
			tipo: 'Outros',
			visualizacao: 'Inscritos',
			status_iframe_anexo: false
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	it('6. CRUD curso liberado, sem anexo, sem pagamento, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Webinar',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			carga_horaria: fakerPT_BR.number.int({ min: 1, max: 99 }),
			numero_turma: fakerPT_BR.number.int({ min: 1, max: 99 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 99 }),
			local: 'Zoom',
			email_responsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificar_responsavel: false,
			addCategoria: categorias,
			status_iframe_anexo: false,
			visualizacao: 'Público',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			habilitar_dias_teste: false,
			notificar_usuarios: 'Sim',
			exige_confirmacao: 'Desabilitado',
			habilitar_pagamento: false,
			habilitar_chat: true
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

        cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
        cy.validarDadosConteudo(dadosParaValidar, categorias)
		
		// UPDATE
		cy.log('## UPDATE ##')

		const conteudoEdit = {
			tipo: 'Palestra'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	it.only('7. CRUD curso em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para usuários', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			vigencia: '10000',
			local: 'Twitch',
			site: fakerPT_BR.internet.url(),
			hashtag: `#${fakerPT_BR.hacker.abbreviation()}`,
			addCategoria: categorias,
			visualizacao: 'Usuários',
			habilitar_chat: true
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

        cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
        cy.validarDadosConteudo(dadosParaValidar, categorias)		

		// UPDATE
		cy.log('## UPDATE ##')

		delCategorias = categorias[0]
		const conteudoEdit = {
			vigencia: '0',
			atualizar_inscritos: true,
			removerCategoria: delCategorias,
			remover_banner: true,
			habilitar_chat: false
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)
		
		const todasCategorias = categorias.filter(categoria => 
			!delCategorias.includes(categoria)
		)
		
		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})
})