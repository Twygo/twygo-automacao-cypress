/// reference types="cypress" />
import 'cypress-real-events/support'
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'
import { converterDataEHoraParaISO } from '../support/utilsHelper'
import formConteudos from "../support/pageObjects/formConteudos"

describe('criar curso via catálogo', () => {
	const formulario = new formConteudos()
	
	let nome, tipoConteudo, categorias, novasCategorias, delCategorias

	// Campos e dados default do formulário de criar curso via catálogo
	let formularioConteudo = {
		nomePortfolio: '',
		nome: '',
		dataInicio: '',
		horaInicio: '',
		dataFim: '',
		horaFim: '',
		descricao: '',
		tipo: 'Treinamento',
		modalidade: 'Online',
		sincronismo: 'Gravado',
		canal: '',
		cargaHoraria: '0',
		numeroTurma: '',
		vigencia: '0',
		atualizarInscritos: false,
		local: '',
		cep: '',
		endereco: '',
		complemento: '',
		cidade: '',
		estado: '',
		pais: '',
		emailResponsavel: Cypress.env('login'),
		site: '',
		notificarResponsavel: false,
		rotuloContato: '',
		hashtag: '',
		addCategoria: '',
		removerCategoria: '',
		removerBanner: false,
		permiteAnexo: 'Desabilitado',
		mensagemAnexo: '',
		statusIframeAnexo: false,
		visualizacao: 'Inscritos',
		situacao: 'Em desenvolvimento',
		notificarConcluirPrimeiraAula: 'Não',
		notificarUsuarios: 'Não',
		diasTeste: '0',
		habilitarDiasTeste: false,
		exigeConfirmacao: 'Habilitado',
		valorInscricao: '0,00',
		habilitarPagamento: false,
		nrParcelas: '1',
		valorAcrescimo: '0.0',
		habilitarChat: false
	}

	let visualizacaoTexto = {
        'Inscritos': 0,
		'Colaborador': 1,
		'Usuários': 2,
		'Público': 3
    }

	let situacaoTexto = {
		'Em desenvolvimento': 0,
		'Liberado': 1,
		'Suspenso': 2
	}

	before(() => {
		// Carrega os labels do arquivo JSON
		cy.fixture('labels.json').then((labels) => {  
			Cypress.env('labels', labels)
		})
	})

	beforeEach( () => {
		// Ignora mensagens de erro conhecidas
		cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier"    // Firefox
		], { ignoreScriptErrors: true })
		
		// Define o tipo de conteúdo
		tipoConteudo = 'criarCurso'

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
		cy.excluirCatalogoViaApi()
	})

	afterEach(() => {
		cy.ativarCapturaErros()
	})
	
	it('1. CRUD deve criar um curso via catálogo com visualização para inscritos', () => {    
        // Massa de dados para criar um curso via catálogo
		const catalogo = {
			nome: nome,
			dataInicio: '10/02/2024',
			horaInicio: '01:00',
			dataFim: '15/12/2028',
			horaFim: '12:00',
			descricao: `Descrição do catálogo: ${nome}`,
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 99 }),
			visualizacao: 'Inscritos',
			situacao: 'Liberado'
		}
		
		const { nome: name, descricao: description, dataInicio, horaInicio, dataFim, horaFim, cargaHoraria: workload, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			date_time_start: converterDataEHoraParaISO(dataInicio, horaInicio),
			date_time_end: converterDataEHoraParaISO(dataFim, horaFim),
			workload,
			situation: situacaoTexto[situacao], 
			inscription_access: visualizacaoTexto[visualizacao]
		}
		
		// CREATE
		cy.log('## CREATE ##')

		cy.criarCatalogoViaApi(body)
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()	
		formulario.criarCursoViaCatalogo(catalogo.nome)
		cy.salvarConteudo(catalogo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
        cy.editarConteudo(catalogo.nome, tipoConteudo)

		/**
		 * Dados específicos para validar devido às configurações default do formulário de criar curso via catálogo
		 * que não seguem o preenchimento realizado no cadastro do catálogo.
		 */		
		let dadosEspecificos = {
			nomePortfolio: catalogo.nome,
			emailResponsavel: '',
			situacao: 'Em desenvolvimento'
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')

		const novoNome = fakerPT_BR.commerce.productName()
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudoEdit = {
			nome: novoNome,
			dataInicio: '29/03/2024',
			horaInicio: '12:00',
			dataFim: '29/04/2024',
			horaFim: '22:00',
			descricao: `Descrição editada do curso nome: ${novoNome}`,
			tipo: 'Congresso',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Outros',
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numeroTurma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			atualizarInscritos: true,
			local: 'Centro de Eventos',
			cep: '85803-760',
			endereco: 'Rua das Petúnias',
			complemento: 'Apto 101',
			cidade: 'Cascavel',
			estado: 'PR',
			pais: 'Brasil',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificarResponsavel: true,
			rotuloContato: 'Contato',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			removerBanner: true,
			permiteAnexo: 'Habilitado',
			statusIframeAnexo: true,
			mensagemAnexo: `Insira o anexo do Curso: ${novoNome}`,
			visualizacao: 'Público',
			situacao: 'Liberado',
			notificarConcluirPrimeiraAula: 'Sim',
			notificarUsuarios: 'Sim',
			diasTeste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitarDiasTeste: true,
			exigeConfirmacao: 'Desabilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitarPagamento: true,
			nrParcelas: fakerPT_BR.number.int({ min: 1, max: 9 }),
			valorAcrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitarChat: true
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	it('2. CRUD deve criar um curso via catálogo com visualização para colaborador', () => {
		// Massa de dados para criar um curso via catálogo
		const catalogo = {
			nome: nome,
			dataInicio: '01/01/2024',
			horaInicio: '00:01',
			dataFim: '31/12/2024',
			horaFim: '23:59',
			descricao: `Descrição do catálogo: ${nome}`,
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 99 }),
			visualizacao: 'Colaborador',
			situacao: 'Liberado'
		}

		const { nome: name, descricao: description, dataInicio, horaInicio, dataFim, horaFim, cargaHoraria: workload, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			date_time_start: converterDataEHoraParaISO(dataInicio, horaInicio),
			date_time_end: converterDataEHoraParaISO(dataFim, horaFim),
			workload,
			situation: situacaoTexto[situacao], 
			inscription_access: visualizacaoTexto[visualizacao]
		}

		// CREATE
		cy.log('## CREATE ##')

        cy.criarCatalogoViaApi(body)
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()	
		formulario.criarCursoViaCatalogo(catalogo.nome)
		cy.salvarConteudo(catalogo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(catalogo.nome, tipoConteudo)

		/**
		 * Dados específicos para validar devido às configurações default do formulário de criar curso via catálogo
		 * que não seguem o preenchimento realizado no cadastro do catálogo.
		 */		
		let dadosEspecificos = {
			nomePortfolio: catalogo.nome,
			emailResponsavel: '',
			situacao: 'Em desenvolvimento'
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')

		const novoNome = fakerPT_BR.commerce.productName()
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudoEdit = {
			nome: novoNome,
			dataInicio: '10/03/2000',
			horaInicio: '00:00',
			dataFim: '31/12/2050',
			horaFim: '03:40',
			descricao: `Descrição editada do conteúdo: ${novoNome}`,
			tipo: 'Webinar',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numeroTurma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			atualizarInscritos: true,
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificarResponsavel: true,
			rotuloContato: 'Mande-nos um e-mail',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			removerBanner: true,
			permiteAnexo: 'Habilitado',
			statusIframeAnexo: true,
			mensagemAnexo: `${fakerPT_BR.lorem.sentence()} anexo do curso ${novoNome}`,
			visualizacao: 'Colaborador',
			situacao: 'Em desenvolvimento',
			notificarConcluirPrimeiraAula: 'Não',
			diasTeste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitarDiasTeste: true,
			exigeConfirmacao: 'Desabilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitarPagamento: true,
			habilitarChat: true
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	it('3. CRUD deve criar um curso via catálogo com visualização para usuários', () => {
		// Massa de dados para criar um curso via catálogo
        const catalogo = {
			nome: nome,
			dataInicio: '19/12/2024',
			horaInicio: '11:09',
			dataFim: '31/01/2025',
			horaFim: '22:20',
			descricao: `Descrição do catálogo: ${nome}`,
			visualizacao: 'Usuários',
			situacao: 'Liberado'
		}

		const { nome: name, descricao: description, dataInicio, horaInicio, dataFim, horaFim, cargaHoraria: workload, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			date_time_start: converterDataEHoraParaISO(dataInicio, horaInicio),
			date_time_end: converterDataEHoraParaISO(dataFim, horaFim),
			situation: situacaoTexto[situacao], 
			inscription_access: visualizacaoTexto[visualizacao]
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.criarCatalogoViaApi(body)
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()	
		formulario.criarCursoViaCatalogo(catalogo.nome)
		cy.salvarConteudo(catalogo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
        cy.editarConteudo(catalogo.nome, tipoConteudo)

		/**
		 * Dados específicos para validar devido às configurações default do formulário de criar curso via catálogo
		 * que não seguem o preenchimento realizado no cadastro do catálogo.
		 */		
		let dadosEspecificos = {
			nomePortfolio: catalogo.nome,
			nome: catalogo.nome,
			emailResponsavel: '',
			situacao: 'Em desenvolvimento'
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')

		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudoEdit = {
			dataInicio: '01/01/2000',
			dataFim: '28/02/2030',
			tipo: 'Feira',
			canal: 'Em companhia',
			addCategoria: categorias,
			visualizacao: 'Público',
			situacao: 'Suspenso',
			exigeConfirmacao: 'Desabilitado'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(catalogo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(catalogo.nome, tipoConteudo)

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(catalogo.nome, tipoConteudo)
	})

	it('4. CRUD deve criar um curso via catálogo com visualização para público', () => {
		// Massa de dados para criar um curso via catálogo
        const catalogo = {
			nome: nome,
			dataInicio: '01/01/2000',
			horaInicio: '00:01',
			dataFim: '01/01/2050',
			horaFim: '01:00',
			descricao: `Descrição do conteúdo: ${nome}`,
			visualizacao: 'Público',
			situacao: 'Liberado'
		}

		const { nome: name, descricao: description, dataInicio, horaInicio, dataFim, horaFim, cargaHoraria: workload, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			date_time_start: converterDataEHoraParaISO(dataInicio, horaInicio),
			date_time_end: converterDataEHoraParaISO(dataFim, horaFim),
			situation: situacaoTexto[situacao], 
			inscription_access: visualizacaoTexto[visualizacao]
		}

		// CREATE
		cy.log('## CREATE ##')

        cy.criarCatalogoViaApi(body)
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()	
		formulario.criarCursoViaCatalogo(catalogo.nome)
		cy.salvarConteudo(catalogo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
        cy.editarConteudo(catalogo.nome, tipoConteudo)

		/**
		 * Dados específicos para validar devido às configurações default do formulário de criar curso via catálogo
		 * que não seguem o preenchimento realizado no cadastro do catálogo.
		 */		
		let dadosEspecificos = {
			nomePortfolio: catalogo.nome,
			nome: catalogo.nome,
			emailResponsavel: '',
			situacao: 'Em desenvolvimento'
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')

		const conteudoEdit = {
			visualizacao: 'Usuários',
			situacao: 'Liberado'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(catalogo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(catalogo.nome, tipoConteudo)

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(catalogo.nome, tipoConteudo)
	})
	
	it('5. CRUD deve criar um curso via catálogo que estava em desenvolvimento editado para liberado', () => {
		// Massa de dados para criar um curso via catálogo
		const catalogo = {
			nome: nome,
			descricao: `Descrição do catálogo: ${nome}`,
			visualizacao: 'Público',
			situacao: 'Em desenvolvimento'
		}

		const { nome: name, descricao: description, cargaHoraria: workload, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			situation: situacaoTexto[situacao], 
			inscription_access: visualizacaoTexto[visualizacao]
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.criarCatalogoViaApi(body)
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()
		
		// Não deve ser possível criar um curso com base em um catálogo em desenvolvimento
		cy.get(`tr.event-row[name='${body.name}']`)
			.find('a[title="Criar  Curso"]')
			.should('not.exist')
		
		// Editar catálogo para liberado
		const conteudoEdit1 = {
			situacao: 'Liberado'
		}

		cy.editarConteudo(catalogo.nome, 'catalogo')
		cy.preencherDadosConteudo(conteudoEdit1, { limpar: true })
		cy.salvarConteudo(catalogo.nome, 'catalogo')

		formulario.criarCursoViaCatalogo(catalogo.nome)
		// Preencher com novos dados do curso
		const novoNome = fakerPT_BR.commerce.productName()
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudoEdit2 = {
			nome: novoNome,
			dataInicio: '29/03/2024',
			horaInicio: '01:00',
			dataFim: '29/04/2024',
			horaFim: '23:00',
			descricao: `Descrição do conteúdo: ${novoNome}`,
			tipo: 'Congresso',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Outros',
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numeroTurma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			local: 'Centro de Eventos',
			cep: '85804-455',
			endereco: 'Rua das Flores',
			complemento: 'Casa dos fundos',
			cidade: 'Joinville',
			estado: 'SC',
			pais: 'Brasil',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificarResponsavel: true,
			rotuloContato: 'Fale conosco',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			permiteAnexo: 'Habilitado',
			statusIframeAnexo: true,
			mensagemAnexo: `Insira o anexo do Catálogo do evento: ${novoNome}`,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificarConcluirPrimeiraAula: 'Sim',
			diasTeste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitarDiasTeste: true,
			exigeConfirmacao: 'Habilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitarPagamento: true,
			nrParcelas: fakerPT_BR.number.int({ min: 1, max: 9 }),
			valorAcrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitarChat: true
		}

		cy.preencherDadosConteudo(conteudoEdit2, { limpar: true })
		cy.salvarConteudo(conteudoEdit2.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
        cy.editarConteudo(conteudoEdit2.nome, tipoConteudo)

		/**
		 * Dados do catálogo exibidos no formulário de criar curso via catálogo
		 */
		let dadosEspecificos = {
			nomePortfolio: catalogo.nome		
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...conteudoEdit1, ...conteudoEdit2, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)
		
		// UPDATE
		cy.log('## UPDATE ##')

		nome = fakerPT_BR.commerce.productName()
		const conteudoEdit3 = {
			nome: nome,
			visualizacao: 'Colaborador',
			situacao: 'Suspenso'
		}

		cy.preencherDadosConteudo(conteudoEdit3, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(conteudoEdit3.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(conteudoEdit3.nome, tipoConteudo)

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit3 }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(conteudoEdit3.nome, tipoConteudo)
	})

	it('6. CRUD deve criar um curso via catálogo que estava suspenso editado para liberado', () => {
		// Massa de dados para criar um curso via catálogo
		const catalogo = {
			nome: nome,
			descricao: `Descrição do catálogo: ${nome}`,
			visualizacao: 'Público',
			situacao: 'Suspenso'
		}

		const { nome: name, descricao: description, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			situation: situacaoTexto[situacao], 
			inscription_access: visualizacaoTexto[visualizacao]
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.criarCatalogoViaApi(body)
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()

		// Não deve ser possível criar um curso com base em um catálogo em desenvolvimento
		cy.get(`tr.event-row[name='${body.name}']`)
			.find('a[title="Criar  Curso"]')
			.should('not.exist')
		
		// Editar catálogo para liberado
		const conteudoEdit1 = {
			situacao: 'Liberado'
		}

		cy.editarConteudo(catalogo.nome, 'catalogo')
		cy.preencherDadosConteudo(conteudoEdit1, { limpar: true })
		cy.salvarConteudo(catalogo.nome, 'catalogo')

		// Clicar em "Criar curso" do catálogo
		formulario.criarCursoViaCatalogo(catalogo.nome)

		// Preencher com novos dados do curso
		let novoNome = fakerPT_BR.commerce.productName()
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudoEdit2 = {
			nome: novoNome,
			dataInicio: '01/01/2050',
			horaInicio: '12:01',
			dataFim: '01/01/2100',
			horaFim: '23:59',
			descricao: `Descrição do conteúdo: ${novoNome}`,
			tipo: 'Webinar',
			modalidade: 'Presencial',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numeroTurma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			local: 'Centro de Eventos',
			cep: '85804-455',
			endereco: 'Rua das Flores',
			complemento: 'Casa dos fundos',
			cidade: 'Joinville',
			estado: 'SC',
			pais: 'Brasil',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificarResponsavel: true,
			rotuloContato: 'Envie-nos uma mensagem',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			permiteAnexo: 'Habilitado',
			statusIframeAnexo: true,
			mensagemAnexo: `Insira o anexo do Catálogo do evento: ${novoNome}`,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificarConcluirPrimeiraAula: 'Sim',
			diasTeste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitarDiasTeste: true,
			exigeConfirmacao: 'Desabilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitarPagamento: true,
			nrParcelas: fakerPT_BR.number.int({ min: 1, max: 9 }),
			valorAcrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitarChat: true
		}

		cy.preencherDadosConteudo(conteudoEdit2, { limpar: true })
		cy.salvarConteudo(conteudoEdit2.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
        cy.editarConteudo(conteudoEdit2.nome, tipoConteudo)

		/**
		 * Dados do catálogo exibidos no formulário de criar curso via catálogo
		 */
		let dadosEspecificos = {
			nomePortfolio: catalogo.nome		
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...conteudoEdit1, ...conteudoEdit2, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)
		
		// UPDATE
		cy.log('## UPDATE ##')

		nome = fakerPT_BR.commerce.productName()
		const conteudoEdit3 = {
			nome: fakerPT_BR.commerce.productName(),
			visualizacao: 'Usuários',
			situacao: 'Em desenvolvimento'
		}

		cy.preencherDadosConteudo(conteudoEdit3, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(conteudoEdit3.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(conteudoEdit3.nome, tipoConteudo)

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit3 }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE CATALOGO
		cy.log('## DELETE CATALOGO ##')

		tipoConteudo = 'catalogo'		//INFO: Alterado o tipo de conteúdo devido a BUG

		// Excluir catálogo para validar a exclusão do curso
		cy.acessarPgCatalogo()
		cy.excluirConteudo(catalogo.nome, tipoConteudo)

		// UPDATE
		cy.log('## UPDATE CURSO ##')

		tipoConteudo = 'curso'
		cy.acessarPgListaConteudos()
		cy.editarConteudo(conteudoEdit3.nome, tipoConteudo)

		// Validar que nome do catálogo foi removido do campo "Nome do portfólio"
		cy.get('#model_name')
			.should('not.exist')
		
		const nomeEdit = fakerPT_BR.commerce.productName()
		novasCategorias = [`Cat3-${fakerPT_BR.hacker.noun()}`, `Cat4-${fakerPT_BR.hacker.noun()}`]
		const conteudoEdit4 = {
			nome: nomeEdit,
			dataInicio: '01/01/2023',
			horaInicio: '00:01',
			dataFim: '31/01/2025',
			horaFim: '23:59',
			descricao: `Atualização da descrição do curso ${nomeEdit} após excluir o catálogo: ${catalogo.nome}`,
			tipo: 'Feira',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: '',
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numeroTurma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			atualizarInscritos: true,
			local: 'T&D Connect',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificarResponsavel: false,
			rotuloContato: 'Contato',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: novasCategorias,
			removerBanner: true,
			permiteAnexo: 'Desabilitado',
			statusIframeAnexo: false,
			visualizacao: 'Público',
			situacao: 'Suspenso',
			notificarConcluirPrimeiraAula: 'Não',
			notificarUsuarios: 'Sim',
			diasTeste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitarDiasTeste: false,
			exigeConfirmacao: 'Desabilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitarPagamento: false,
			habilitarChat: false
		}

		cy.preencherDadosConteudo(conteudoEdit4, { limpar: true })
		cy.salvarConteudo(conteudoEdit4.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudoEdit4.nome, tipoConteudo)

		// Massa de dados complementar para validação
		const dadosEspecificos2 = {
			endereco: '',
			complemento: '',
			cidade: '',
			estado: '',
			pais: ''
		}		

		const todasCategorias = [...categorias, ...novasCategorias]

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit4, ...dadosEspecificos2 }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit4.nome, tipoConteudo)
	})

	it('7. CRUD deve criar um curso via catálogo com todos os campos preenchidos', () => {
		// Massa de dados para criação do catálogo
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			dataInicio: '29/03/2024',
			horaInicio: '01:00',
			dataFim: '29/04/2024',
			horaFim: '23:00',
			descricao: `${fakerPT_BR.commerce.productDescription()} do conteúdo nome: ${nome}`,
			tipo: 'Congresso',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Outros',
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numeroTurma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			local: 'Centro de Eventos',
			cep: '85804-455',
			endereco: 'Rua das Flores',
			complemento: 'Casa dos fundos',
			cidade: 'Joinville',
			estado: 'SC',
			pais: 'Brasil',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificarResponsavel: true,
			rotuloContato: 'Fale conosco',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			permiteAnexo: 'Habilitado',
			statusIframeAnexo: true,
			mensagemAnexo: `Insira o anexo do Catálogo do evento: ${nome}`,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificarConcluirPrimeiraAula: 'Sim',
			diasTeste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitarDiasTeste: true,
			exigeConfirmacao: 'Desabilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitarPagamento: true,
			nrParcelas: fakerPT_BR.number.int({ min: 1, max: 9 }),
			valorAcrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 })
		}
		
		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()

		cy.addConteudo('catalogo')
		cy.preencherDadosConteudo(conteudo, { limpar: true })
		cy.salvarConteudo(conteudo.nome, 'catalogo')

		formulario.criarCursoViaCatalogo(conteudo.nome)
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(conteudo.nome, tipoConteudo)

		/**
		 * Dados específicos para validar devido às configurações default do formulário de criar curso via catálogo
		 * que não seguem o preenchimento realizado no cadastro do catálogo.
		 */		
		let dadosEspecificos = {
			nomePortfolio: conteudo.nome, 
			situacao: 'Em desenvolvimento',
			notificarConcluirPrimeiraAula: 'Não',
			habilitarDiasTeste: false, 
			exigeConfirmacao: 'Habilitado'		
		}

		let dadosParaValidar = { ...formularioConteudo, ...conteudo, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)		
		
		// UPDATE
		cy.log('## UPDATE ##')

		let novoNome = fakerPT_BR.commerce.productName()
		novasCategorias = [`Cat3-${fakerPT_BR.hacker.noun()}`, `Cat4-${fakerPT_BR.hacker.noun()}`]
		delCategorias = categorias[0]
		const conteudoEdit = {
			nome: novoNome,
			dataInicio: '05/09/2024',
			horaInicio: '11:11',
			dataFim: '28/09/2040',
			horaFim: '23:23',
			descricao: `Descrição editada do curso nome: ${novoNome}`,
			tipo: 'Palestra',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numeroTurma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			local: 'Youtube - Twygo',
			cep: '85804-455',
			endereco: 'Av. Brasil, número 1001',
			complemento: 'Bloco C, sala 300',
			cidade: 'Joinville',
			estado: 'SC',
			pais: 'Brasil',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			rotuloContato: 'Contato',
			hashtag: fakerPT_BR.hacker.adjective(),
			removerCategoria: delCategorias,
			addCategoria: novasCategorias,
			permiteAnexo: 'Desabilitado',
			statusIframeAnexo: false,
			visualizacao: 'Público',
			notificarConcluirPrimeiraAula: 'Não',
			notificarUsuarios: 'Não',
			diasTeste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			exigeConfirmacao: 'Desabilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			nrParcelas: fakerPT_BR.number.int({ min: 1, max: 9 }),
			valorAcrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitarChat: true
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		const todasCategorias = categorias.filter(categoria => 
			!delCategorias.includes(categoria)
		)
		
		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)		
	})
})