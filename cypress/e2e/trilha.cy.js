/// reference types="cypress" />
import 'cypress-real-events/support'
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
import { gerarDataAtual } from '../support/utils_helper'

describe('trilha', () => {
	let nome, tipoConteudo, categorias, novasCategorias, delCategorias

	// Campos e dados default do formulário de trilha
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
		carga_horaria: '0',
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
		notificar_responsavel: false,
		addCategoria: '',
		removerCategoria: '',
		remover_banner: false,
		situacao: 'Em desenvolvimento',
		exige_confirmacao: 'Habilitado'
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
		tipoConteudo = 'trilha'

		// Gera um nome aleatório para o conteúdo
		nome = faker.commerce.productName()

		// Inicializa o array de categorias
		categorias = []
		novasCategorias = []
		delCategorias = []

		// Obtém o token de autenticação
		getAuthToken()
	})
	
	afterEach(() => {
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})
	
	/** DOCUMENTAÇÃO:
	 * @name
	 * 1-CRUD trilha com dados default
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de uma trilha com dados default
	 * 
	 * @steps
	 * 1. Cria uma trilha com dados default (nome e descrição).
	 * 2. Valida os dados da trilha criada e se é exibida na lista de conteúdos.
	 * 3. Edita a trilha criada com novos dados.
	 * 4. Valida os dados da trilha editada.
	 * 5. Exclui a trilha criada.
	 * 
	 * @expected
	 * Que a trilha seja criada, editada e excluída com sucesso.
	 * 
	 * @priority
	 * Alta
	 * 
	 * @type
	 * E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, trilha
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('1-CRUD trilha com dados default', () =>{
		// Massa de dados para criação da trilha
        const conteudo = {
			nome: nome,
            descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
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

		const novoNome = faker.commerce.productName()
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudoEdit = {
			nome: novoNome,
			data_inicio: '29/03/2024',
			hora_inicio: '12:00',
			data_fim: '29/04/2024',
			hora_fim: '22:00',
			descricao: `${faker.commerce.productDescription()} editado do evento ${novoNome}`,
			tipo: 'Congresso',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
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
			notificar_responsavel: true,
			addCategoria: categorias,
			remover_banner: true,
			situacao: 'Liberado',
			exige_confirmacao: 'Desabilitado'
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 2-CRUD trilha liberada, com confirmação, com visualização para inscritos
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de uma trilha liberada, com confirmação da inscrição 
	 * e com visualização para inscritos.
	 * 
	 * @steps
	 * 1. Cria uma trilha liberada, com confirmação da inscrição e com visualização para inscritos.
	 * 2. Valida os dados da trilha criada e se é exibida na lista de conteúdos.
	 * 3. Edita a trilha criada com novos dados.
	 * 4. Valida os dados da trilha editada.
	 * 5. Exclui a trilha criada.
	 * 
	 * @expected
	 * Que a trilha seja criada, editada e excluída com sucesso.
	 * 
	 * @priority
	 * Alta
	 * 
	 * @type
	 * E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, trilha
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('2-CRUD trilha liberada, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
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
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			local: 'Centro de Eventos',
			cep: '85804-455',
			endereco: 'Rua das Flores',
			complemento: 'Casa dos fundos',
			cidade: 'Joinville',
			estado: 'SC',
			pais: 'Brasil',
			email_responsavel: faker.internet.email(),
			notificar_responsavel: true,
			addCategoria: categorias,
			situacao: 'Liberado',
			exige_confirmacao: 'Habilitado'
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

		const novoNome = faker.commerce.productName()
		novasCategorias = [`Cat3-${faker.hacker.noun()}`, `Cat4-${faker.hacker.noun()}`]
		const conteudoEdit = {
			nome: novoNome,
			data_inicio: '01/01/2023',
			hora_inicio: '00:01',
			data_fim: '31/01/2025',
			hora_fim: '23:59',
			descricao: `${faker.commerce.productDescription()} do evento ${novoNome}`,
			tipo: 'Feira',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			local: 'T&D Connect',
			email_responsavel: faker.internet.email(),
			notificar_responsavel: false,
			addCategoria: novasCategorias,
			remover_banner: true,
			situacao: 'Suspenso',
			exige_confirmacao: 'Desabilitado',
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 3-CRUD trilha liberada, sem confirmação, com visualização para inscritos
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de uma trilha liberada, sem confirmação da inscrição
	 * e com visualização para inscritos.
	 * 
	 * @steps
	 * 1. Cria uma trilha liberada, sem confirmação da inscrição e com visualização para inscritos.
	 * 2. Valida os dados da trilha criada e se é exibida na lista de conteúdos.
	 * 3. Edita a trilha criada com novos dados.
	 * 4. Valida os dados da trilha editada.
	 * 5. Exclui a trilha criada.
	 * 
	 * @expected
	 * Que a trilha seja criada, editada e excluída com sucesso.
	 * 
	 * @priority
	 * Alta
	 * 
	 * @type
	 * E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, trilha
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('3-CRUD trilha liberada, sem confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`, `Cat3-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: '29/01/2023',
			hora_inicio: '11:20',
			data_fim: '29/01/2024',
			hora_fim: '22:02',
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Feira',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			carga_horaria: faker.number.int({ min: 10, max: 99 }),
			vigencia: faker.number.int({ min: 10, max: 99 }),
			local: 'Youtube',
			email_responsavel: faker.internet.email(),
			notificar_responsavel: false,
			addCategoria: categorias,
			situacao: 'Liberado',
			exige_confirmacao: 'Desabilitado'
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

		const novoNome = faker.commerce.productName()
		novasCategorias = [`Cat4-${faker.hacker.noun()}`, `Cat5-${faker.hacker.noun()}`]		
		const conteudoEdit = {
			nome: novoNome,
			data_inicio: '10/03/2000',
			hora_inicio: '00:00',
			data_fim: '31/12/2050',
			hora_fim: '03:40',
			descricao: `${faker.commerce.productDescription()} do evento ${novoNome}`,
			tipo: 'Webinar',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			email_responsavel: faker.internet.email(),
			notificar_responsavel: true,
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 4-CRUD trilha suspensa, com confirmação, com visualização para inscritos
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de uma trilha suspensa, com confirmação da inscrição
	 * e com visualização para inscritos.
	 * 
	 * @steps
	 * 1. Cria uma trilha suspensa, com confirmação da inscrição e com visualização para inscritos.
	 * 2. Valida os dados da trilha criada e se é exibida na lista de conteúdos.
	 * 3. Edita a trilha criada com novos dados.
	 * 4. Valida os dados da trilha editada.
	 * 5. Exclui a trilha criada.
	 * 
	 * @expected
	 * Que a trilha seja criada, editada e excluída com sucesso.
	 * 
	 * @priority
	 * Alta
	 * 
	 * @type
	 * E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, trilha
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('4-CRUD trilha suspensa, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
		categorias = [`Cat1-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: gerarDataAtual(),
			hora_inicio: '01:00',
			data_fim: gerarDataAtual(),
			hora_fim: '23:00',
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Outros',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			carga_horaria: faker.number.int({ min: 100, max: 999 }),
			vigencia: faker.number.int({ min: 100, max: 999 }),
			local: 'Youtube',
			email_responsavel: faker.internet.email(),
			notificar_responsavel: false,
			addCategoria: categorias,
			situacao: 'Suspenso',
			exige_confirmacao: 'Habilitado'
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

		novasCategorias = [`Cat2-${faker.hacker.noun()}`, `Cat3-${faker.hacker.noun()}`]
		const conteudoEdit = {
			data_inicio: '01/01/2000',
			data_fim: '28/02/2030',
			tipo: 'Treinamento',
			addCategoria: novasCategorias,
			situacao: 'Em desenvolvimento',
			exige_confirmacao: 'Desabilitado'
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 5-CRUD trilha suspensa, sem confirmação, com visualização para inscritos
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de uma trilha suspensa, sem confirmação da inscrição
	 * e com visualização para inscritos.
	 * 
	 * @steps
	 * 1. Cria uma trilha suspensa, sem confirmação da inscrição e com visualização para inscritos.
	 * 2. Valida os dados da trilha criada e se é exibida na lista de conteúdos.
	 * 3. Edita a trilha criada com novos dados.
	 * 4. Valida os dados da trilha editada.
	 * 5. Exclui a trilha criada.
	 * 
	 * @expected
	 * Que a trilha seja criada, editada e excluída com sucesso.
	 * 
	 * @priority
	 * Alta
	 * 
	 * @type
	 * E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, trilha
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('5-CRUD trilha suspensa, sem confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
		categorias = [`Cat1-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Palestra',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			carga_horaria: faker.number.int({ min: 1000, max: 9999 }),
			vigencia: faker.number.int({ min: 1000, max: 9999 }),
			local: 'Twygo',
			email_responsavel: faker.internet.email(),
			addCategoria: categorias,
			situacao: 'Suspenso',
			exige_confirmacao: 'Desabilitado'
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 6-CRUD trilha em desenvolvimento, sem confirmação, com visualização para inscritos
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de uma trilha em desenvolvimento, sem confirmação da inscrição
	 * e com visualização para inscritos.
	 * 
	 * @steps
	 * 1. Cria uma trilha em desenvolvimento, sem confirmação da inscrição e com visualização para inscritos.
	 * 2. Valida os dados da trilha criada e se é exibida na lista de conteúdos.
	 * 3. Edita a trilha criada com novos dados.
	 * 4. Valida os dados da trilha editada.
	 * 5. Exclui a trilha criada.
	 * 
	 * @expected
	 * Que a trilha seja criada, editada e excluída com sucesso.
	 * 
	 * @priority
	 * Alta
	 * 
	 * @type
	 * E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, trilha
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('6-CRUD trilha em desenvolvimento, sem confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Webinar',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			carga_horaria: faker.number.int({ min: 1, max: 99 }),
			vigencia: faker.number.int({ min: 1, max: 99 }),
			local: 'Zoom',
			email_responsavel: faker.internet.email(),
			notificar_responsavel: false,
			addCategoria: categorias,
			situacao: 'Em desenvolvimento',
			exige_confirmacao: 'Desabilitado'
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 7-CRUD trilha em desenvolvimento, com confirmação, com visualização para inscritos
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de uma trilha em desenvolvimento, com confirmação da inscrição
	 * e com visualização para inscritos.
	 * 
	 * @steps
	 * 1. Cria uma trilha em desenvolvimento, com confirmação da inscrição e com visualização para inscritos.
	 * 2. Valida os dados da trilha criada e se é exibida na lista de conteúdos.
	 * 3. Edita a trilha criada com novos dados.
	 * 4. Valida os dados da trilha editada.
	 * 5. Exclui a trilha criada.
	 * 
	 * @expected
	 * Que a trilha seja criada, editada e excluída com sucesso.
	 * 
	 * @priority
	 * Alta
	 * 
	 * @type
	 * E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, trilha
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('7-CRUD trilha em desenvolvimento, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação da trilha
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
			sincronismo: 'Ao vivo',
			vigencia: '10000',
			local: 'Twitch',
			addCategoria: categorias
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
			remover_banner: true
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