/// reference types="cypress" />
import 'cypress-real-events/support'
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
import { converterDataEHoraParaISO, gerarDataAtual } from '../support/utils_helper'
import formConteudos from "../support/pageObjects/formConteudos"

describe('criar curso via catálogo', () => {
	const formulario = new formConteudos()
	
	let nome, tipoConteudo, categorias, novasCategorias, delCategorias

	// Campos e dados default do formulário de criar curso via catálogo
	let formularioConteudo = {
		nome_portfolio: '',
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
		// Ativa o tratamento de exceção não capturada especificamente para este teste
		Cypress.on('uncaught:exception', (err, runnable) => {
		  	return false
		})

		// Define o tipo de conteúdo
		tipoConteudo = 'criarCurso'

		// Gera um nome aleatório para o conteúdo
		nome = faker.commerce.productName()

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
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})

    /** DOCUMENTAÇÃO:
	 * @name
	 * 1-CRUD deve criar um curso via catálogo com visualização para inscritos
	 * 
	 * @description
	 * Testa o fluxo de criar um curso utilizando um catálogo, criado via API, com visualização para inscritos.
	 * 
	 * @steps
	 * 1. Cria um catálogo com a situação liberado e com a visualização para inscritos (via API).
	 * 2. Realiza login como administrador e acessa a página de catálogo.
	 * 3. Clica em "Criar Curso" do catálogo e salva o curso com os mesmos dados do catálogo.
	 * 4. Valida os dados do curso criado.
	 * 5. Edita o curso criado para alterar alguns dados, a visualização para "Público" e a situação para "Liberado".
	 * 6. Salva o curso editado e valida seus dados.
	 * 7. Exclui o curso criado.
	 * 
	 * @satisfies
	 * Deve ser possível criar um curso com visualização para inscritos e editá-lo para visualização para público.
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
	 * CRUD, Catalogo, Curso, Criar curso via catálogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('1-CRUD deve criar um curso via catálogo com visualização para inscritos', () => {    
        // Massa de dados para criar um curso via catálogo
		const catalogo = {
			nome: nome,
			data_inicio: '10/02/2024',
			hora_inicio: '01:00',
			data_fim: '15/12/2028',
			hora_fim: '12:00',
			descricao: `Descrição do catálogo: ${nome}`,
			carga_horaria: faker.number.int({ min: 1, max: 99 }),
			visualizacao: 'Inscritos',
			situacao: 'Liberado'
		}
		
		const { nome: name, descricao: description, data_inicio, hora_inicio, data_fim, hora_fim, carga_horaria: workload, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			date_time_start: converterDataEHoraParaISO(data_inicio, hora_inicio),
			date_time_end: converterDataEHoraParaISO(data_fim, hora_fim),
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
			nome_portfolio: catalogo.nome,
			email_responsavel: '',
			situacao: 'Em desenvolvimento'
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos }
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
			mensagem_anexo: `Insira o anexo do Curso: ${novoNome}`,
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
			valor_acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitar_chat: true
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos, ...conteudoEdit }

		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

    /** DOCUMENTAÇÃO:
	 * @name
	 * 2-CRUD deve criar um curso via catálogo com visualização para colaborador
	 * 
	 * @description
	 * Testa o fluxo de criar um curso utilizando um catálogo, criado via API, com visualização para colaborador.
	 * 
	 * @steps
	 * 1. Cria um catálogo com a situação liberado e com a visualização para colaborador (via API).
	 * 2. Realiza login como administrador e acessa a página de catálogo.
	 * 3. Clica em "Criar Curso" do catálogo e salva o curso com os mesmos dados do catálogo.
	 * 4. Valida os dados do curso criado.
	 * 5. Edita o curso criado para alterar alguns dados, a visualização para "Colaborador" e a situação para "Em desenvolvimento".
	 * 6. Salva o curso editado e valida seus dados.
	 * 7. Exclui o curso criado.
	 * 
	 * @satisfies
	 * Deve ser possível criar um curso com visualização para colaborador e editá-lo para visualização para público.
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
	 * CRUD, Catalogo, Curso, Criar curso via catálogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0 
	 */
	it('2-CRUD deve criar um curso via catálogo com visualização para colaborador', () => {
		// Massa de dados para criar um curso via catálogo
		const catalogo = {
			nome: nome,
			data_inicio: '01/01/2024',
			hora_inicio: '00:01',
        	data_fim: '31/12/2024',
        	hora_fim: '23:59',
			descricao: `Descrição do catálogo: ${nome}`,
			carga_horaria: faker.number.int({ min: 1, max: 99 }),
			visualizacao: 'Colaborador',
			situacao: 'Liberado'
		}

		const { nome: name, descricao: description, data_inicio, hora_inicio, data_fim, hora_fim, carga_horaria: workload, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			date_time_start: converterDataEHoraParaISO(data_inicio, hora_inicio),
			date_time_end: converterDataEHoraParaISO(data_fim, hora_fim),
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
			nome_portfolio: catalogo.nome,
			email_responsavel: '',
			situacao: 'Em desenvolvimento'
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar)

		// UPDATE
		cy.log('## UPDATE ##')

		const novoNome = faker.commerce.productName()
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudoEdit = {
			nome: novoNome,
			data_inicio: '10/03/2000',
			hora_inicio: '00:00',
			data_fim: '31/12/2050',
			hora_fim: '03:40',
			descricao: `Descrição editada do conteúdo: ${novoNome}`,
			tipo: 'Webinar',
			modalidade: 'Presencial',
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			numero_turma: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			atualizar_inscritos: true,
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			notificar_responsavel: true,
			rotulo_contato: 'Mande-nos um e-mail',
			hashtag: faker.hacker.adjective(),
			addCategoria: categorias,
			remover_banner: true,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			mensagem_anexo: `${faker.lorem.sentence()} anexo do curso ${novoNome}`,
			visualizacao: 'Colaborador',
			situacao: 'Em desenvolvimento',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			habilitar_chat: true
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(conteudoEdit.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(conteudoEdit.nome, tipoConteudo)

		dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos, ...conteudoEdit }

		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)
	})

    /** DOCUMENTAÇÃO:
	 * @name
	 * 3-CRUD deve criar um curso via catálogo com visualização para usuários
	 * 
	 * @description
	 * Testa o fluxo de criar um curso utilizando um catálogo, criado via API, com visualização para usuários.
	 * 
	 * @steps
	 * 1. Cria um catálogo com a situação liberado e com a visualização para usuários (via API).
	 * 2. Realiza login como administrador e acessa a página de catálogo.
	 * 3. Clica em "Criar Curso" do catálogo e salva o curso com os mesmos dados do catálogo.
	 * 4. Valida os dados do curso criado.
	 * 5. Edita o curso criado para alterar alguns dados, a visualização para "Público" e a situação para "Suspenso".
	 * 6. Salva o curso editado e valida seus dados.
	 * 7. Exclui o curso criado.
	 * 
	 * @satisfies
	 * Deve ser possível criar um curso com visualização para usuários e editá-lo para visualização para público.
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
	 * CRUD, Catalogo, Curso, Criar curso via catálogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('3-CRUD deve criar um curso via catálogo com visualização para usuários', () => {
		// Massa de dados para criar um curso via catálogo
        const catalogo = {
			nome: nome,
			data_inicio: '19/12/2024',
        	hora_inicio: '11:09',
			data_fim: '31/01/2025',
			hora_fim: '22:20',
			descricao: `Descrição do catálogo: ${nome}`,
			visualizacao: 'Usuários',
			situacao: 'Liberado'
		}

		const { nome: name, descricao: description, data_inicio, hora_inicio, data_fim, hora_fim, carga_horaria: workload, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			date_time_start: converterDataEHoraParaISO(data_inicio, hora_inicio),
			date_time_end: converterDataEHoraParaISO(data_fim, hora_fim),
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
			nome_portfolio: catalogo.nome,
			nome: catalogo.nome,
			email_responsavel: '',
			situacao: 'Em desenvolvimento'
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar)

		// UPDATE
		cy.log('## UPDATE ##')

		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudoEdit = {
			data_inicio: '01/01/2000',
			data_fim: '28/02/2030',
			tipo: 'Feira',
			canal: 'Em companhia',
			addCategoria: categorias,
			visualizacao: 'Público',
			situacao: 'Suspenso',
			exige_confirmacao: 'Desabilitado'
		}

		cy.preencherDadosConteudo(conteudoEdit, { limpar: true })
		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.salvarConteudo(catalogo.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.editarConteudo(catalogo.nome, tipoConteudo)

		dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos, ...conteudoEdit }

		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(catalogo.nome, tipoConteudo)
	})

	/** DOCUMENTAÇÃO:
	 * @name
	 * 4-CRUD deve criar um curso via catálogo com visualização para público
	 * 
	 * @description
	 * Testa o fluxo de criar um curso utilizando um catálogo, criado via API, com visualização para público.
	 * 
	 * @steps
	 * 1. Cria um catálogo com a situação liberado e com a visualização para público (via API).
	 * 2. Realiza login como administrador e acessa a página de catálogo.
	 * 3. Clica em "Criar Curso" do catálogo e salva o curso com os mesmos dados do catálogo.
	 * 4. Valida os dados do curso criado.
	 * 5. Edita o curso criado para alterar a visualização para "Usuários" e a situação para "Liberado".
	 * 6. Salva o curso editado e valida seus dados.
	 * 7. Exclui o curso criado.
	 * 
	 * @satisfies
	 * Deve ser possível criar um curso com visualização para público e editá-lo para visualização para usuários.
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
	 * CRUD, Catalogo, Curso, Criar curso via catálogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0 
	 */
	it('4-CRUD deve criar um curso via catálogo com visualização para público', () => {
		// Massa de dados para criar um curso via catálogo
        const catalogo = {
			nome: nome,
			data_inicio: '01/01/2000',
			hora_inicio: '00:01',
			data_fim: '01/01/2050',
			hora_fim: '01:00',
			descricao: `Descrição do conteúdo: ${nome}`,
			visualizacao: 'Público',
			situacao: 'Liberado'
		}

		const { nome: name, descricao: description, data_inicio, hora_inicio, data_fim, hora_fim, carga_horaria: workload, situacao, visualizacao } = catalogo

		const body = {
			name,
			description,
			date_time_start: converterDataEHoraParaISO(data_inicio, hora_inicio),
			date_time_end: converterDataEHoraParaISO(data_fim, hora_fim),
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
			nome_portfolio: catalogo.nome,
			nome: catalogo.nome,
			email_responsavel: '',
			situacao: 'Em desenvolvimento'
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar)

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

		dadosParaValidar = { ...formularioConteudo, ...catalogo, ...dadosEspecificos, ...conteudoEdit }

		cy.validarDadosConteudo(dadosParaValidar)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(catalogo.nome, tipoConteudo)
	})
	
	/** DOCUMENTAÇÃO:
	 * @name
	 * 5-CRUD deve criar um curso via catálogo que estava em desenvolvimento editado para liberado
	 * 
	 * @description
	 * Testa o fluxo de criar um curso utilizando um catálogo que estava em desenvolvimento e que foi editado para liberado.
	 * 
	 * @steps
	 * 1. Cria um catálogo com situação "Em desenvolvimento" e visualização "Público" (via API).
	 * 2. Realiza login como administrador e acessa a página de catálogo.
	 * 3. Verifica se o botão "Criar Curso" não está disponível para o catálogo criado.
	 * 4. Edita o catálogo para situação "Liberado" e clica em "Criar Curso" do catálogo.
	 * 5. Preenche os dados do curso com novos valores, salva e valida os dados.
	 * 6. Edita o curso criado para alterar o nome, visualização para "Colaborador" e situação para "Suspenso".
	 * 7. Salva o curso editado e valida seus dados.
	 * 8. Exclui o curso criado.
	 * 
	 * @satisfies
	 * Deve ser possível criar um curso após editar um catálogo que estava em desenvolvimento para liberado.
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
	 * CRUD, Catalogo, Curso, Criar curso via catálogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */	
	it('5-CRUD deve criar um curso via catálogo que estava em desenvolvimento editado para liberado', () => {
		// Massa de dados para criar um curso via catálogo
		const catalogo = {
			nome: nome,
			descricao: `Descrição do catálogo: ${nome}`,
			visualizacao: 'Público',
			situacao: 'Em desenvolvimento'
		}

		const { nome: name, descricao: description, carga_horaria: workload, situacao, visualizacao } = catalogo

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
		const novoNome = faker.commerce.productName()
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudoEdit2 = {
			nome: novoNome,
			data_inicio: '29/03/2024',
			hora_inicio: '01:00',
			data_fim: '29/04/2024',
			hora_fim: '23:00',
			descricao: `Descrição do conteúdo: ${novoNome}`,
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
			mensagem_anexo: `Insira o anexo do Catálogo do evento: ${novoNome}`,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Habilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: faker.number.int({ min: 1, max: 9 }),
			valor_acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitar_chat: true
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
			nome_portfolio: catalogo.nome		
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...conteudoEdit1, ...conteudoEdit2, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)
		
		// UPDATE
		cy.log('## UPDATE ##')

		nome = faker.commerce.productName()
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

		dadosParaValidar = { ...formularioConteudo, ...catalogo, ...conteudoEdit1, ...conteudoEdit2, ...dadosEspecificos, ...conteudoEdit3 }

		cy.validarDadosConteudo(dadosParaValidar, categorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(conteudoEdit3.nome, tipoConteudo)
	})

	/** DOCUMENTAÇÃO:
	 * @name
	 * 6-CRUD deve criar um curso via catálogo que estava suspenso editado para liberado
	 * 
	 * @description
	 * Testa o fluxo de criar um curso utilizando um catálogo que estava suspenso e que foi editado para liberado.
	 * Após a criação do curso, o catálogo base é excluído para novas validações e edição do curso criado.
	 * 
	 * @steps
	 * 1. Cria um catálogo com situação "Suspenso" e visualização "Público" (via API).
	 * 2. Realiza login como administrador e acessa a página de catálogo.
	 * 3. Verifica se o botão "Criar Curso" não está disponível para o catálogo criado.
	 * 4. Edita o catálogo para situação "Liberado" e clica em "Criar Curso" do catálogo.
	 * 5. Preenche os dados do curso com novos valores, salva e valida os dados.
	 * 6. Edita o curso criado para alterar o nome, visualização para "Usuários" e situação para "Em desenvolvimento".
	 * 7. Salva o curso editado e valida seus dados.
	 * 8. Exclui o catálogo base.
	 * 9. Edita novamente o curso, alterando alguns campos, salva e valida os dados.
	 * 10. Exclui o curso criado.
	 * 
	 * @satisfies
	 * Deve ser possível criar um curso após editar um catálogo que estava suspenso para liberado, assim como editar e excluir o 
	 * curso criado após seu catálogo base ser excluído.
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
	 * CRUD, Catalogo, Curso, Criar curso via catálogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('6-CRUD deve criar um curso via catálogo que estava suspenso editado para liberado', () => {
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
		let novoNome = faker.commerce.productName()
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudoEdit2 = {
			nome: novoNome,
			data_inicio: '01/01/2050',
			hora_inicio: '12:01',
			data_fim: '01/01/2100',
			hora_fim: '23:59',
			descricao: `Descrição do conteúdo: ${novoNome}`,
			tipo: 'Webinar',
			modalidade: 'Presencial',
			sincronismo: 'Gravado',
			canal: 'Aberto',
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
			rotulo_contato: 'Envie-nos uma mensagem',
			hashtag: faker.hacker.adjective(),
			addCategoria: categorias,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			mensagem_anexo: `Insira o anexo do Catálogo do evento: ${novoNome}`,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: faker.number.int({ min: 1, max: 9 }),
			valor_acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitar_chat: true
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
			nome_portfolio: catalogo.nome		
		}

		let dadosParaValidar = { ...formularioConteudo, ...catalogo, ...conteudoEdit1, ...conteudoEdit2, ...dadosEspecificos }
		cy.validarDadosConteudo(dadosParaValidar, categorias)
		
		// UPDATE
		cy.log('## UPDATE ##')

		nome = faker.commerce.productName()
		const conteudoEdit3 = {
			nome: nome,
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

		dadosParaValidar = { ...formularioConteudo, ...catalogo, ...conteudoEdit1, ...conteudoEdit2, ...dadosEspecificos, ...conteudoEdit3 }

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
		
		const nomeEdit = faker.commerce.productName()
		novasCategorias = [`Cat3-${faker.hacker.noun()}`, `Cat4-${faker.hacker.noun()}`]
		const conteudo_edit_4 = {
			nome: nomeEdit,
			data_inicio: '01/01/2023',
			hora_inicio: '00:01',
			data_fim: '31/01/2025',
			hora_fim: '23:59',
			descricao: `Atualização da descrição do curso ${nomeEdit} após excluir o catálogo: ${catalogo.nome}`,
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
			addCategoria: novasCategorias,
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
			habilitar_pagamento: false,
			habilitar_chat: false
		}

		cy.preencherDadosConteudo(conteudo_edit_4, { limpar: true })
		cy.salvarConteudo(conteudo_edit_4.nome, tipoConteudo)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarConteudo(conteudo_edit_4.nome, tipoConteudo)

		// Massa de dados complementar para validação
		const conteudo_extra = {
			endereco: '',
			complemento: '',
			cidade: '',
			estado: '',
			pais: ''
		}		

		const todasCategorias = [...categorias, ...novasCategorias]

		dadosParaValidar = { 
			...formularioConteudo, 
			...catalogo,
			...conteudoEdit1,
			...conteudoEdit2, 
			...dadosEspecificos, 
			...conteudoEdit3, 
			...conteudo_edit_4,
			...conteudo_extra
		}

		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo_edit_4.nome, tipoConteudo)
	})

	/** DOCUMENTAÇÃO:
	 * @name
	 * 7-CRUD deve criar um curso via catálogo com todos os campos preenchidos
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, edição e exclusão de um curso criado via catálogo
	 * onde todos os campos estavam preenchidos.
	 * 
	 * @steps
	 * 1. Realiza login como administrador e acessa a página de catálogo.
	 * 2. Cria um catálogo preenchendo todos os campos do formulário.
	 * 3. Cria um curso com base neste catálogo.
	 * 4. Realiza a leitura dos dados do curso e valida se os dados estão corretos.
	 * 5. Edita o curso, alterando alguns campos e validando se os dados foram alterados corretamente.
	 * 6. Exclui o curso.
	 * 
	 * @satisfies
	 * Deve ser possível criar um curso via catálogo com todos os campos preenchidos, validar os dados
	 * e realizar a edição e exclusão do curso.
	 * 
	 * @priority
	 * Alta
	 * 
	 * @type
	 * E2E
	 * 
	 * @time
	 * 5m
	 * 
	 * @tags
	 * CRUD, Catalogo, Curso, Criar curso via catálogo
	 * 
	 * @test_case
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('7-CRUD deve criar um curso via catálogo com todos os campos preenchidos', () => {
		// Massa de dados para criação do catálogo
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			data_inicio: '29/03/2024',
			hora_inicio: '01:00',
			data_fim: '29/04/2024',
			hora_fim: '23:00',
			descricao: `${faker.commerce.productDescription()} do conteúdo nome: ${nome}`,
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
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: faker.number.int({ min: 1, max: 9 }),
			valor_acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 })
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
			nome_portfolio: conteudo.nome, 
			situacao: 'Em desenvolvimento',
			notificar_concluir_primeira_aula: 'Não',
			habilitar_dias_teste: false, 
			exige_confirmacao: 'Habilitado'		
		}

		let dadosParaValidar = { ...formularioConteudo, ...conteudo, ...dadosEspecificos }

		cy.validarDadosConteudo(dadosParaValidar, categorias)		
		
		// UPDATE
		cy.log('## UPDATE ##')

		let novoNome = faker.commerce.productName()
		novasCategorias = [`Cat3-${faker.hacker.noun()}`, `Cat4-${faker.hacker.noun()}`]
		delCategorias = categorias[0]
		const conteudoEdit = {
			nome: novoNome,
			data_inicio: '05/09/2024',
			hora_inicio: '11:11',
			data_fim: '28/09/2040',
			hora_fim: '23:23',
			descricao: `Descrição editada do curso nome: ${novoNome}`,
			tipo: 'Palestra',
			sincronismo: 'Gravado',
			canal: 'Aberto',
			carga_horaria: faker.number.int({ min: 1, max: 9 }),
			numero_turma: faker.number.int({ min: 1, max: 9 }),
			vigencia: faker.number.int({ min: 1, max: 9 }),
			local: 'Youtube - Twygo',
			cep: '85804-455',
			endereco: 'Av. Brasil, número 1001',
			complemento: 'Bloco C, sala 300',
			cidade: 'Joinville',
			estado: 'SC',
			pais: 'Brasil',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			rotulo_contato: 'Contato',
			hashtag: faker.hacker.adjective(),
			removerCategoria: delCategorias,
			addCategoria: novasCategorias,
			permite_anexo: 'Desabilitado',
			status_iframe_anexo: false,
			visualizacao: 'Público',
			notificar_concluir_primeira_aula: 'Não',
			notificar_usuarios: 'Não',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			nr_parcelas: faker.number.int({ min: 1, max: 9 }),
			valor_acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 }),
			habilitar_chat: true
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
		
		dadosParaValidar = { ...formularioConteudo, ...conteudo, ...dadosEspecificos, ...conteudoEdit }

		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')

		tipoConteudo = 'criarCurso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.cancelarFormularioConteudo(tipoConteudo)
		tipoConteudo = 'curso'		//INFO: Alterado o tipo de conteúdo devido a BUG
		cy.excluirConteudo(conteudoEdit.nome, tipoConteudo)		
	})
})