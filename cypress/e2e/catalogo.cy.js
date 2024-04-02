/// reference types="cypress" />
import 'cypress-real-events/support'
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
import { converterDataEHoraParaISO, gerarDataAtual } from '../support/utils_helper'
import formConteudos from "../support/pageObjects/formConteudos"

describe('catálogo', () => {
	const formulario = new formConteudos()

	let nome, tipoConteudo, categorias, novasCategorias, delCategorias

	// Campos e dados default do formulário de catálogo
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

	beforeEach(() => {
		// Ativa o tratamento de exceção não capturada especificamente para este teste
		Cypress.on('uncaught:exception', (err, runnable) => {
		  	return false
		})
		
		// Define o tipo de conteúdo
		tipoConteudo = 'catalogo'

		// Gera um nome aleatório para o conteúdo
		nome = faker.commerce.productName()

		// Inicializa o array de categorias
		categorias = []
		novasCategorias = []
		delCategorias = []
		
		// Obtem o token de autenticação
		getAuthToken()

		// Exclui todos os catálogos antes de iniciar o teste
		cy.excluirCatalogoViaApi()
	})
	
	afterEach(() => {
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})
	
	/** DOCUMENTAÇÃO:
	 * @name
	 * 1-CRUD catalogo com dados default
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um catálogo com dados default
	 * 
	 * @steps
	 * 1. Cria um catálogo com dados default (Nome e Descrição).
	 * 2. Valida se o catálogo foi criado e é exibido na listagem.
	 * 3. Edita o catálogo inserindo novos dados.
	 * 4. Valida se os dados foram salvos corretamente.
	 * 5. Exclui o catálogo e valida se foi removido da listagem.
	 * 
	 * @expected
	 * O catálogo é criado, editado e excluído com sucesso.
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
	 * CRUD, Catalogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('1-CRUD catalogo com dados default', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: faker.commerce.productName(),
			descricao: faker.commerce.productDescription()
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()	
		cy.addConteudo(tipoConteudo)
		cy.preencherDadosConteudo(conteudo, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
		cy.validarDadosConteudo(dadosParaValidar)

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
			descricao: `Descrição editada do curso nome: ${novoNome}`,
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
			addCategoria: categorias,
			remover_banner: true,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			mensagem_anexo: 'Insira o anexo do Catálogo do evento:',
			visualizacao: 'Público',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: faker.number.int({ min: 1, max: 9 }),
			valor_acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 })
		}
		
		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	/** DOCUMENTAÇÃO:
	 * @name
	 * 2-CRUD catalogo liberado, com anexo, com pagamento, sem acréscimo, com confirmação, com visualização para inscritos
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um catálogo liberado, com anexo, com pagamento, sem acréscimo, 
	 * com confirmação de inscrição e com visualização para inscritos.
	 * 
	 * @steps
	 * 1. Cria um catálogo preenchendo todos os campos do formulário.
	 * 2. Valida se o catálogo foi criado e é exibido na listagem.
	 * 3. Edita o catálogo inserindo novos dados.
	 * 4. Valida se os dados foram salvos corretamente.
	 * 5. Exclui o catálogo e valida se foi removido da listagem.
	 * 
	 * @expected
	 * O catálogo deve ser criado, editado e excluído com sucesso.
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
	 * CRUD, Catalogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('2-CRUD catalogo liberado, com anexo, com pagamento, sem acréscimo, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação do catálogo
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
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
			notificar_responsavel: true,
			rotulo_contato: 'Fale conosco',
			hashtag: faker.hacker.adjective(),
			addCategoria: categorias,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			mensagem_anexo: `Insira o anexo do Catálogo do evento: ${nome}`,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Habilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: faker.number.int({ min: 1, max: 9 })
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()	
		cy.addConteudo(tipoConteudo)
		cy.preencherDadosConteudo(conteudo, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
		cy.validarDadosConteudo(dadosParaValidar)

		// UPDATE
		cy.log('## UPDATE ##')

		const novoNome = faker.commerce.productName()
		categorias = [`Cat3-${faker.hacker.noun()}`]
		const conteudoEdit = {
			nome: novoNome,
			data_inicio: '01/01/2023',
			hora_inicio: '00:01',
			data_fim: '31/01/2025',
			hora_fim: '23:59',
			descricao: `Descrição editada do curso nome: ${novoNome}`,
			tipo: 'Feira',
			modalidade: 'Online',
			sincronismo: 'Gravado',
			canal: '',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			numero_turma: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			local: 'T&D Connect',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			notificar_responsavel: false,
			rotulo_contato: 'Contato',
			hashtag: faker.hacker.adjective(),
			addCategoria: categorias,
			remover_banner: true,
			permite_anexo: 'Desabilitado',
			status_iframe_anexo: false,
			visualizacao: 'Público',
			situacao: 'Suspenso',
			notificar_concluir_primeira_aula: 'Não',
			notificar_usuarios: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: false,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: false
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		// Após salvar a alteração de modalidade de Presencial para Online, o campo de CEP não é limpo como os demais campos de endereço
		let dadosEspecificos = {
			cep: '85804-455',
			endereco: '',
			complemento: '',
			cidade: '',
			estado: '',
			pais: ''
		}

		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	/** DOCUMENTAÇÃO:
	 * @name
	 * 3-CRUD catalogo liberado, com anexo, com pagamento, c/acréscimo, sem confirmação, com visualização para público
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um catálogo liberado, com anexo, com pagamento, com acréscimo,
	 * sem confirmação de inscrição e com visualização para público.
	 * 
	 * @steps
	 * 1. Cria um catálogo preenchendo todos os campos do formulário.
	 * 2. Valida se o catálogo foi criado e é exibido na listagem.
	 * 3. Edita o catálogo inserindo novos dados.
	 * 4. Valida se os dados foram salvos corretamente.
	 * 5. Exclui o catálogo e valida se foi removido da listagem.
	 * 
	 * @expected
	 * O catálogo deve ser criado, editado e excluído com sucesso.
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
	 * CRUD, Catalogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('3-CRUD catalogo liberado, com anexo, com pagamento, c/acréscimo, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do catálogo
		const categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`, `Cat3-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
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
			notificar_responsavel: false,
			rotulo_contato: 'Entre em contato conosco para mais informações.',
			hashtag: faker.hacker.adjective(),
			addCategoria: categorias,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			visualizacao: 'Público',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			dias_teste: faker.number.int({ min: 10, max: 99 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 10, max: 99 }),
			habilitar_pagamento: true,
			nr_parcelas: faker.number.int({ min: 10, max: 12 }),
			valor_acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 })
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()	
		cy.addConteudo(tipoConteudo)
		cy.preencherDadosConteudo(conteudo, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
		cy.validarDadosConteudo(dadosParaValidar)

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
			descricao: `Descrição editada do curso nome: ${novoNome}`,
			tipo: 'Webinar',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			numero_turma: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			local: '',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			notificar_responsavel: true,
			rotulo_contato: 'Mande-nos um e-mail',
			hashtag: faker.hacker.adjective(),
			addCategoria: novasCategorias,
			remover_banner: true,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			mensagem_anexo: faker.lorem.sentence(),
			visualizacao: 'Colaborador',
			situacao: 'Em desenvolvimento',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: false,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: false
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
	 * 4-CRUD catalogo suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um catálogo suspenso, sem anexo, sem pagamento, com confirmação de inscrição
	 * e com visualização para colaboradores.
	 * 
	 * @steps
	 * 1. Cria um catálogo preenchendo todos os campos do formulário.
	 * 2. Valida se o catálogo foi criado e é exibido na listagem.
	 * 3. Edita o catálogo inserindo novos dados.
	 * 4. Valida se os dados foram salvos corretamente.
	 * 5. Exclui o catálogo e valida se foi removido da listagem.
	 * 
	 * @expected
	 * O catálogo deve ser criado, editado e excluído com sucesso.
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
	 * CRUD, Catalogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0 
	 */
	it.only('4-CRUD catalogo suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		// Massa de dados para criação do catálogo
		categorias = [`Cat1-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: gerarDataAtual(),
			hora_inicio: '01:00',
			data_fim: gerarDataAtual(),
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
			notificar_responsavel: false,
			site: faker.internet.url(),
			hashtag: faker.hacker.adjective(),
			addCategoria: categorias,
			permite_anexo: 'Desabilitado',
			status_iframe_anexo: false,
			visualizacao: 'Colaborador',
			situacao: 'Suspenso',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 100, max: 999 }),
			habilitar_dias_teste: false,
			exige_confirmacao: 'Habilitado',
			habilitar_pagamento: false
		}

		// CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()	
		cy.addConteudo(tipoConteudo)
		cy.preencherDadosConteudo(conteudo, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)

		// READ
		cy.log('## READ ##')

		cy.editarConteudo(conteudo.nome, tipoConteudo)

		let dadosParaValidar = { ...formularioConteudo, ...conteudo }
		cy.validarDadosConteudo(dadosParaValidar)

		// UPDATE
		cy.log('## UPDATE ##')
		
		novasCategorias = [`Cat2-${faker.hacker.noun()}`, `Cat3-${faker.hacker.noun()}`]
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
		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
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
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 1000, max: 9999 }),
			exige_confirmacao: 'Habilitado'
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
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
			.select(conteudo.notificar_concluir_primeira_aula)

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
			.contains(conteudo.notificar_concluir_primeira_aula)

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
		const conteudoEdit = {
			tipo: 'Outros',
			visualizacao: 'Inscritos'
		}

		// Editar os campos do formulário - aba Dados
		cy.get('#event_event_type_id')
			.select(conteudoEdit.tipo)  

		cy.get('#event_inscription_access')
			.select(conteudoEdit.visualizacao)

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
			.contains(conteudoEdit.tipo)

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
			.contains(conteudoEdit.visualizacao)

		cy.get('#event_situation')
			.find('option:selected')
			.contains(conteudo.situacao)

		cy.get('#event_end_class')
			.find('option:selected')
			.contains(conteudo.notificar_concluir_primeira_aula)

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
			notificar_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			exige_confirmacao: 'Desabilitado'
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
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
			.select(conteudo.notificar_concluir_primeira_aula)

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
			.contains(conteudo.notificar_concluir_primeira_aula)

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
		const conteudoEdit = {
			tipo: 'Palestra'
		}

		// Editar os campos do formulário - aba Dados
		cy.get('#event_event_type_id')
			.select(conteudoEdit.tipo)
			
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
			.contains(conteudoEdit.tipo)

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
			.contains(conteudo.notificar_concluir_primeira_aula)

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
			notificar_concluir_primeira_aula: 'Não'
		}

		// !!! PRÉ-CONDIÇÃO !!!
		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
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
			.select(conteudo.notificar_concluir_primeira_aula)

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
			.contains(conteudo.notificar_concluir_primeira_aula)

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
			.contains(conteudo.notificar_concluir_primeira_aula)

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