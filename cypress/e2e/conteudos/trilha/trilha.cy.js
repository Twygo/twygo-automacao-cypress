/// reference types="cypress" />
import 'cypress-real-events/support'
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../../../support/authHelper'
import { gerarData } from '../../../support/utilsHelper'

describe('trilha', () => {
	let nome, tipoConteudo, categorias, novasCategorias, delCategorias, listaConteudos

	// Campos e dados default do formulário de trilha
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
		cargaHoraria: '0',
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
		notificarResponsavel: false,
		addCategoria: '',
		removerCategoria: '',
		situacao: 'Em desenvolvimento',
		exigeConfirmacao: 'Desabilitado'
	}

	beforeEach(() => {
		// Define o tipo de conteúdo
		tipoConteudo = 'trilha'

		// Gera um nome aleatório para o conteúdo
		nome = fakerPT_BR.commerce.productName()

		// Inicializa o array de categorias
		categorias = []
		novasCategorias = []
		delCategorias = []

		// Exclui todos os cursos da lista de conteúdos
		getAuthToken()
		cy.excluirCursoViaApi()

		// Exclui todos os conteúdos do tipo trilha antes de iniciar o teste
		
		listaConteudos = []
		cy.listaConteudo(tipoConteudo, listaConteudos)
		cy.excluirConteudo(null, tipoConteudo, listaConteudos)		
	})

	it('1. CRUD trilha com dados default', () =>{
		// Massa de dados para criação da trilha
        const conteudo = {
			nome: nome,
            descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
		}

		// CREATE
		cy.log('## CREATE ##')

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
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
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
			notificarResponsavel: true,
			addCategoria: categorias,
			situacao: 'Liberado',
			exigeConfirmacao: 'Habilitado'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	it('2. CRUD trilha liberada, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
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
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			local: 'Centro de Eventos',
			cep: '85804-455',
			endereco: 'Rua das Flores',
			complemento: 'Casa dos fundos',
			cidade: 'Joinville',
			estado: 'SC',
			pais: 'Brasil',
			emailResponsavel: fakerPT_BR.internet.email(),
			notificarResponsavel: true,
			addCategoria: categorias,
			situacao: 'Liberado',
			exigeConfirmacao: 'Habilitado'
		}

		// CREATE
		cy.log('## CREATE ##')

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
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			atualizarInscritos: true,
			local: 'T&D Connect',
			emailResponsavel: fakerPT_BR.internet.email(),
			notificarResponsavel: false,
			addCategoria: novasCategorias,
			situacao: 'Suspenso',
			exigeConfirmacao: 'Desabilitado',
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
		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit, ...dadosEspecificos }		
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')
		
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	it('3. CRUD trilha liberada, sem confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
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
			cargaHoraria: fakerPT_BR.number.int({ min: 10, max: 99 }),
			vigencia: fakerPT_BR.number.int({ min: 10, max: 99 }),
			local: 'Youtube',
			emailResponsavel: fakerPT_BR.internet.email(),
			notificarResponsavel: false,
			addCategoria: categorias,
			situacao: 'Liberado'
		}

		// CREATE
		cy.log('## CREATE ##')

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
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			atualizarInscritos: true,
			emailResponsavel: fakerPT_BR.internet.email(),
			notificarResponsavel: true,
			addCategoria: novasCategorias,
			situacao: 'Em desenvolvimento'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	it('4. CRUD trilha suspensa, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
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
			cargaHoraria: fakerPT_BR.number.int({ min: 100, max: 999 }),
			vigencia: fakerPT_BR.number.int({ min: 100, max: 999 }),
			local: 'Youtube',
			emailResponsavel: fakerPT_BR.internet.email(),
			notificarResponsavel: false,
			addCategoria: categorias,
			situacao: 'Suspenso',
			exigeConfirmacao: 'Habilitado'
		}

		// CREATE
		cy.log('## CREATE ##')

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
			addCategoria: novasCategorias,
			situacao: 'Em desenvolvimento',
			exigeConfirmacao: 'Desabilitado'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')
		
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	it('5. CRUD trilha suspensa, sem confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Palestra',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			cargaHoraria: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			vigencia: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			local: 'Twygo',
			emailResponsavel: fakerPT_BR.internet.email(),
			addCategoria: categorias,
			situacao: 'Suspenso'
		}

		// CREATE
		cy.log('## CREATE ##')

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
			tipo: 'Outros'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	it('6. CRUD trilha em desenvolvimento, sem confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Webinar',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			cargaHoraria: fakerPT_BR.number.int({ min: 1, max: 99 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 99 }),
			local: 'Zoom',
			emailResponsavel: fakerPT_BR.internet.email(),
			notificarResponsavel: false,
			addCategoria: categorias,
			situacao: 'Em desenvolvimento'
		}

		// CREATE
		cy.log('## CREATE ##')

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
			tipo: 'Palestra',
			modalidade: 'Presencial',
			cep: '85803-760',
			endereco: 'Av. das Torres',
			complemento: 'Apto 202',
			cidade: 'Cascavel',
			estado: 'PR',
			pais: 'Brasil'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	it('7. CRUD trilha em desenvolvimento, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
			sincronismo: 'Ao vivo',
			vigencia: '10000',
			local: 'Twitch',
			addCategoria: categorias
		}

		// CREATE
		cy.log('## CREATE ##')

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
			removerCategoria: delCategorias
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)
		
		const todasCategorias = categorias.filter(categoria => 
			!delCategorias.includes(categoria)
		)
		
		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})
})