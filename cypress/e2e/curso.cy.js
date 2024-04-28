/// reference types="cypress" />
import 'cypress-real-events/support'
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'
import { gerarData } from '../support/utilsHelper'

describe('curso', () => {
	let nome, tipoConteudo, categorias, novasCategorias, delCategorias

	// Campos e dados default do formulário de curso
	let formularioConteudo = {
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

	before(() => {
		// Carrega os labels do arquivo JSON
		cy.fixture('labels.json').then((labels) => {
			Cypress.env('labels', labels)
		})
	})

	beforeEach( () => {
		// Ignora mensagens de erro conhecidas
		cy.ignorarCapturaErros([
			"Unexpected identifier 'id'"
		], { ignoreScriptErrors: true })
		
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
		cy.ativarCapturaErros()
	})
	
	it('1. CRUD curso com dados default', () =>{
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
			dataInicio: '29/03/2024',
			horaInicio: '12:00',
			dataFim: '29/04/2024',
			horaFim: '22:00',
			descricao: `${fakerPT_BR.commerce.productDescription()} editado do evento ${novoNome}`,
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
			mensagemAnexo: `Insira o anexo do Curso: ${novoNome}`,
			statusIframeAnexo: true,
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
			dataInicio: '29/03/2024',
			horaInicio: '01:00',
			dataFim: '29/04/2024',
			horaFim: '23:00',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
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
			mensagemAnexo: `Insira o anexo do Curso: ${nome}`,
			statusIframeAnexo: true,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificarConcluirPrimeiraAula: 'Sim',
			diasTeste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitarDiasTeste: true,
			exigeConfirmacao: 'Habilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitarPagamento: true,
			nrParcelas: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitarChat: true
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
			dataInicio: '01/01/2023',
			horaInicio: '00:01',
			dataFim: '31/01/2025',
			horaFim: '23:59',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${novoNome}`,
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
			dataInicio: '29/01/2023',
			horaInicio: '11:20',
			dataFim: '29/01/2024',
			horaFim: '22:02',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Feira',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Em companhia',
			cargaHoraria: fakerPT_BR.number.int({ min: 10, max: 99 }),
			numeroTurma: fakerPT_BR.number.int({ min: 10, max: 99 }),
			vigencia: fakerPT_BR.number.int({ min: 10, max: 99 }),
			local: 'Youtube',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificarResponsavel: false,
			rotuloContato: 'Entre em contato conosco para mais informações.',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			permiteAnexo: 'Habilitado',
			statusIframeAnexo: true,
			visualizacao: 'Público',
			situacao: 'Liberado',
			notificarConcluirPrimeiraAula: 'Sim',
			notificarUsuarios: 'Sim',
			diasTeste: fakerPT_BR.number.int({ min: 10, max: 99 }),
			habilitarDiasTeste: true,
			exigeConfirmacao: 'Desabilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 10, max: 99 }),
			habilitarPagamento: true,
			nrParcelas: fakerPT_BR.number.int({ min: 10, max: 12 }),
			valorAcrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitarChat: true
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
			dataInicio: '10/03/2000',
			horaInicio: '00:00',
			dataFim: '31/12/2050',
			horaFim: '03:40',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${novoNome}`,
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
			addCategoria: novasCategorias,
			permiteAnexo: 'Habilitado',
			statusIframeAnexo: true,
			mensagemAnexo: `Insira o anexo do Curso: ${novoNome}`,
			visualizacao: 'Colaborador',
			situacao: 'Em desenvolvimento',
			notificarConcluirPrimeiraAula: 'Não',
			diasTeste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitarDiasTeste: false,
			exigeConfirmacao: 'Desabilitado',
			valorInscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitarPagamento: false,
			habilitarChat: false
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
			dataInicio: gerarData(),
			horaInicio: '01:00',
			dataFim: gerarData(),
			horaFim: '23:00',
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Outros',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			cargaHoraria: fakerPT_BR.number.int({ min: 100, max: 999 }),
			numeroTurma: fakerPT_BR.number.int({ min: 100, max: 999 }),
			vigencia: fakerPT_BR.number.int({ min: 100, max: 999 }),
			local: 'Youtube',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificarResponsavel: false,
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			permiteAnexo: 'Desabilitado',
			statusIframeAnexo: false,
			statusIframeAnexo: false,
			visualizacao: 'Colaborador',
			situacao: 'Suspenso',
			notificarConcluirPrimeiraAula: 'Não',
			diasTeste: fakerPT_BR.number.int({ min: 100, max: 999 }),
			habilitarDiasTeste: false,
			exigeConfirmacao: 'Habilitado',
			habilitarPagamento: false,
			habilitarChat: true
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
			dataInicio: '01/01/2000',
			dataFim: '28/02/2030',
			tipo: 'Treinamento',
			canal: 'Em companhia',
			addCategoria: novasCategorias,
			visualizacao: 'Usuários',
			situacao: 'Em desenvolvimento',
			exigeConfirmacao: 'Desabilitado'
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
			cargaHoraria: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			numeroTurma: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			vigencia: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			local: 'Twygo',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			statusIframeAnexo: false,
			visualizacao: 'Usuários',
			situacao: 'Suspenso',
			notificarConcluirPrimeiraAula: 'Não',
			diasTeste: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			exigeConfirmacao: 'Habilitado',
			habilitarChat: true
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
			statusIframeAnexo: false
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
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 99 }),
			numeroTurma: fakerPT_BR.number.int({ min: 1, max: 99 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 99 }),
			local: 'Zoom',
			emailResponsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificarResponsavel: false,
			addCategoria: categorias,
			statusIframeAnexo: false,
			visualizacao: 'Público',
			situacao: 'Liberado',
			notificarConcluirPrimeiraAula: 'Sim',
			habilitarDiasTeste: false,
			notificarUsuarios: 'Sim',
			exigeConfirmacao: 'Desabilitado',
			habilitarPagamento: false,
			habilitarChat: true
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

	it('7. CRUD curso em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para usuários', () => {
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
			habilitarChat: true
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
			atualizarInscritos: true,
			removerCategoria: delCategorias,
			removerBanner: true,
			habilitarChat: false
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