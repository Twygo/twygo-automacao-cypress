/// reference types="cypress" />
import 'cypress-real-events/support'
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
import { gerarDataAtual } from '../support/utils_helper'
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
		nome = fakerPT_BR.commerce.productName()

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
	 * 1. CRUD catalogo com dados default
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
	 * Regressão - CRUD - E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, Catalogo
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('1. CRUD catalogo com dados default', () => {
		// Massa de dados para criação do catálogo
		const conteudo = {
			nome: fakerPT_BR.commerce.productName(),
			descricao: fakerPT_BR.commerce.productDescription()
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
			descricao: `Descrição editada do curso nome: ${novoNome}`,
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
			status_iframe_anexo: true,
			mensagem_anexo: 'Insira o anexo do Catálogo do evento:',
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
			valor_acrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 })
		}
		
		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	/** DOCUMENTAÇÃO:
	 * @name
	 * 2. CRUD catalogo liberado, com anexo, com pagamento, sem acréscimo, com confirmação, com visualização para inscritos
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
	 * Regressão - CRUD - E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, Catalogo
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('2. CRUD catalogo liberado, com anexo, com pagamento, sem acréscimo, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação do catálogo
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: '29/03/2024',
			hora_inicio: '01:00',
			data_fim: '29/04/2024',
			hora_fim: '23:00',
			descricao: fakerPT_BR.commerce.productDescription(),
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
			status_iframe_anexo: true,
			mensagem_anexo: `Insira o anexo do Catálogo do evento: ${nome}`,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			dias_teste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Habilitado',
			valor_inscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: fakerPT_BR.number.int({ min: 1, max: 9 })
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
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')

		const novoNome = fakerPT_BR.commerce.productName()
		categorias = [`Cat3-${fakerPT_BR.hacker.noun()}`]
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
			addCategoria: categorias,
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

		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

	/** DOCUMENTAÇÃO:
	 * @name
	 * 3. CRUD catalogo liberado, com anexo, com pagamento, c/acréscimo, sem confirmação, com visualização para público
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
	 * Regressão - CRUD - E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, Catalogo
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('3. CRUD catalogo liberado, com anexo, com pagamento, c/acréscimo, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do catálogo
		const categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`, `Cat3-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: '29/01/2023',
			hora_inicio: '11:20',
			data_fim: '29/01/2024',
			hora_fim: '22:02',
			descricao: fakerPT_BR.commerce.productDescription(),
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
			valor_acrescimo: fakerPT_BR.commerce.price({ min: 1, max: 9, dec: 1 })
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
			descricao: `Descrição editada do curso nome: ${novoNome}`,
			tipo: 'Webinar',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			carga_horaria: fakerPT_BR.number.int({ min: 1, max: 9 }),
			numero_turma: fakerPT_BR.number.int({ min: 1, max: 9 }),
			vigencia: fakerPT_BR.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			local: '',
			email_responsavel: fakerPT_BR.internet.email(),
			site: fakerPT_BR.internet.url(),
			notificar_responsavel: true,
			rotulo_contato: 'Mande-nos um e-mail',
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: novasCategorias,
			remover_banner: true,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			mensagem_anexo: fakerPT_BR.lorem.sentence(),
			visualizacao: 'Colaborador',
			situacao: 'Em desenvolvimento',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: fakerPT_BR.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: false,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: fakerPT_BR.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: false
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 4. CRUD catalogo suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores
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
	 * Regressão - CRUD - E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, Catalogo
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0 
	 */
	it('4. CRUD catalogo suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		// Massa de dados para criação do catálogo
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: gerarDataAtual(),
			hora_inicio: '01:00',
			data_fim: gerarDataAtual(),
			hora_fim: '23:00',
			descricao: fakerPT_BR.commerce.productDescription(),
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
			hashtag: fakerPT_BR.hacker.adjective(),
			addCategoria: categorias,
			visualizacao: 'Colaborador',
			situacao: 'Suspenso',
			dias_teste: fakerPT_BR.number.int({ min: 100, max: 999 }),
			exige_confirmacao: 'Habilitado'
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 5. CRUD catalogo em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um catálogo em desenvolvimento, sem anexo, sem pagamento, com confirmação de inscrição
	 * e com visualização para colaboradores.
	 * 
	 * @steps
	 * 1. Cria um catálogo preenchendo alguns dos campos do formulário.
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
	 * Regressão - CRUD - E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, Catalogo
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */	
	it('5. CRUD catalogo em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		// Massa de dados para criação do catálogo
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: fakerPT_BR.commerce.productDescription(),
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
			visualizacao: 'Usuários',
			situacao: 'Suspenso',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: fakerPT_BR.number.int({ min: 1000, max: 9999 }),
			exige_confirmacao: 'Habilitado'
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
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')
		
		const conteudoEdit = {
			tipo: 'Outros',
			visualizacao: 'Inscritos'
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 6. CRUD catalogo liberado, sem anexo, sem pagamento, sem confirmação, com visualização para público
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um catálogo liberado, sem anexo, sem pagamento, sem confirmação de inscrição
	 * e com visualização para público.
	 * 
	 * @steps
	 * 1. Cria um catálogo preenchendo alguns dos campos do formulário.
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
	 * Regressão - CRUD - E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, Catalogo
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('6. CRUD catalogo liberado, sem anexo, sem pagamento, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do catálogo
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: fakerPT_BR.commerce.productDescription(),
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
			addCategoria: categorias,
			visualizacao: 'Público',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			notificar_usuarios: 'Sim',
			exige_confirmacao: 'Desabilitado'
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 7. CRUD catalogo em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para usuários
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um catálogo em desenvolvimento, sem anexo, sem pagamento, com confirmação de inscrição
	 * e com visualização para usuários.
	 * 
	 * @steps
	 * 1. Cria um catálogo preenchendo alguns dos campos do formulário.
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
	 * Regressão - CRUD - E2E
	 * 
	 * @time
	 * 1m
	 * 
	 * @tags
	 * CRUD, Catalogo
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('7. CRUD catalogo em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para usuários', () => {
		// Massa de dados para criação do catálogo
		categorias = [`Cat1-${fakerPT_BR.hacker.noun()}`, `Cat2-${fakerPT_BR.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: fakerPT_BR.commerce.productDescription(),
			tipo: 'Treinamento',
			modalidade: 'Online',
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			vigencia: '10000',
			local: 'Twitch',
			site: fakerPT_BR.internet.url(),
			hashtag: `#${fakerPT_BR.hacker.abbreviation()}`,
			addCategoria: categorias,
			visualizacao: 'Usuários',
			situacao: 'Em desenvolvimento',
			notificar_concluir_primeira_aula: 'Não'
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
		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// UPDATE
		cy.log('## UPDATE ##')
		
		delCategorias = [categorias[0], categorias[1]]
		const conteudoEdit = {
			vigencia: '',
			site: '',
			hashtag: '',
			removerCategoria: delCategorias[0],
			removerCategoria: delCategorias[1]
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