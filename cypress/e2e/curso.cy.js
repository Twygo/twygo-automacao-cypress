/// reference types="cypress" />
import 'cypress-real-events/support'
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
import { gerarDataAtual } from '../support/utils_helper'

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
		nome = faker.commerce.productName()

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
	
	/** DOCUMENTAÇÃO:
	 * @name
	 * 1. CRUD curso com dados default
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um curso com dados default
	 * 
	 * @steps
	 * 1. Cria um curso com dados default (nome e descrição).
	 * 2. Valida os dados do curso criado e se é exibido na lista de conteúdos.
	 * 3. Edita o curso criado com novos dados.
	 * 4. Valida os dados do curso editado.
	 * 5. Exclui o curso criado.
	 * 
	 * @expected
	 * Que o curso seja criado, editado e excluído com sucesso.
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
	 * CRUD, curso
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('1. CRUD curso com dados default', () =>{
		// Massa de dados para criação do curso
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
			mensagem_anexo: `Insira o anexo do Curso: ${novoNome}`,
			status_iframe_anexo: true,
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
	 * 2. CRUD curso liberado, com anexo, com pagamento, sem acréscimo, com confirmação, com visualização para inscritos
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um curso liberado, com anexo, com pagamento, sem acréscimo, 
	 * com confirmação da inscrição e com visualização para inscritos.
	 * 
	 * @steps
	 * 1. Cria um curso liberado, com anexo, com pagamento, sem acréscimo, com confirmação da inscrição e com visualização para inscritos.
	 * 2. Valida os dados do curso criado e se é exibido na lista de conteúdos.
	 * 3. Edita o curso criado com novos dados.
	 * 4. Valida os dados do curso editado.
	 * 5. Exclui o curso criado.
	 * 
	 * @expected
	 * Que o curso seja criado, editado e excluído com sucesso.
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
	 * CRUD, curso
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('2. CRUD curso liberado, com anexo, com pagamento, sem acréscimo, com confirmação, com visualização para inscritos', () => {
		// Massa de dados para criação do curso
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
			mensagem_anexo: `Insira o anexo do Curso: ${nome}`,
			status_iframe_anexo: true,
			visualizacao: 'Inscritos',
			situacao: 'Liberado',
			notificar_concluir_primeira_aula: 'Sim',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: true,
			exige_confirmacao: 'Habilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
			habilitar_pagamento: true,
			nr_parcelas: faker.number.int({ min: 1, max: 9 }),
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 3. CRUD curso liberado, com anexo, com pagamento, com acréscimo, sem confirmação, com visualização para público
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um curso liberado, com anexo, com pagamento, com acréscimo,
	 * sem confirmação da inscrição e com visualização para público.
	 * 
	 * @steps
	 * 1. Cria um curso liberado, com anexo, com pagamento, com acréscimo, sem confirmação da inscrição e com visualização para público.
	 * 2. Valida os dados do curso criado e se é exibido na lista de conteúdos.
	 * 3. Edita o curso criado com novos dados.
	 * 4. Valida os dados do curso editado.
	 * 5. Exclui o curso criado.
	 * 
	 * @expected
	 * Que o curso seja criado, editado e excluído com sucesso.
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
	 * CRUD, curso
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('3. CRUD curso liberado, com anexo, com pagamento, c/acréscimo, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do curso
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
			valor_acrescimo: faker.commerce.price({ min: 1, max: 9, dec: 1 }),
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
			addCategoria: novasCategorias,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			mensagem_anexo: `Insira o anexo do Curso: ${novoNome}`,
			visualizacao: 'Colaborador',
			situacao: 'Em desenvolvimento',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 1, max: 9 }),
			habilitar_dias_teste: false,
			exige_confirmacao: 'Desabilitado',
			valor_inscricao: faker.commerce.price({ min: 1, max: 9 }),
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 4. CRUD curso suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um curso suspenso, sem anexo, sem pagamento, com confirmação da inscrição
	 * e com visualização para colaboradores.
	 * 
	 * @steps
	 * 1. Cria um curso suspenso, sem anexo, sem pagamento, com confirmação da inscrição e com visualização para colaboradores.
	 * 2. Valida os dados do curso criado e se é exibido na lista de conteúdos.
	 * 3. Edita o curso criado com novos dados.
	 * 4. Valida os dados do curso editado.
	 * 5. Exclui o curso criado.
	 * 
	 * @expected
	 * Que o curso seja criado, editado e excluído com sucesso.
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
	 * CRUD, curso
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('4. CRUD curso suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		// Massa de dados para criação do curso
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
			canal: 'Aberto',
			carga_horaria: faker.number.int({ min: 100, max: 999 }),
			numero_turma: faker.number.int({ min: 100, max: 999 }),
			vigencia: faker.number.int({ min: 100, max: 999 }),
			local: 'Youtube',
			email_responsavel: faker.internet.email(),
			site: faker.internet.url(),
			notificar_responsavel: false,
			hashtag: faker.hacker.adjective(),
			addCategoria: categorias,
			permite_anexo: 'Desabilitado',
			status_iframe_anexo: false,
			status_iframe_anexo: false,
			visualizacao: 'Colaborador',
			situacao: 'Suspenso',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 100, max: 999 }),
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
		dadosParaValidar = { ...dadosParaValidar, ...conteudoEdit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)

		// DELETE
		cy.log('## DELETE ##')
		
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	/** DOCUMENTAÇÃO:
	 * @name
	 * 5. CRUD curso em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um curso em desenvolvimento, sem anexo, sem pagamento, 
	 * com confirmação da inscrição e com visualização para colaboradores.
	 * 
	 * @steps
	 * 1. Cria um curso em desenvolvimento, sem anexo, sem pagamento, com confirmação da inscrição e com visualização para colaboradores.
	 * 2. Valida os dados do curso criado e se é exibido na lista de conteúdos.
	 * 3. Edita o curso criado com novos dados.
	 * 4. Valida os dados do curso editado.
	 * 5. Exclui o curso criado.
	 * 
	 * @expected
	 * Que o curso seja criado, editado e excluído com sucesso.
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
	 * CRUD, curso
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('5. CRUD curso em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
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
			addCategoria: categorias,
			status_iframe_anexo: false,
			visualizacao: 'Usuários',
			situacao: 'Suspenso',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 1000, max: 9999 }),
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 6. CRUD curso liberado, sem anexo, sem pagamento, sem confirmação, com visualização para público
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um curso liberado, sem anexo, sem pagamento, sem confirmação da inscrição
	 * e com visualização para público.
	 * 
	 * @steps
	 * 1. Cria um curso liberado, sem anexo, sem pagamento, sem confirmação da inscrição e com visualização para público.
	 * 2. Valida os dados do curso criado e se é exibido na lista de conteúdos.
	 * 3. Edita o curso criado com novos dados.
	 * 4. Valida os dados do curso editado.
	 * 5. Exclui o curso criado.
	 * 
	 * @expected
	 * Que o curso seja criado, editado e excluído com sucesso.
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
	 * CRUD, curso
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('6. CRUD curso liberado, sem anexo, sem pagamento, sem confirmação, com visualização para público', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
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

	/** DOCUMENTAÇÃO:
	 * @name
	 * 7. CRUD curso em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para usuários
	 * 
	 * @description
	 * Testa o fluxo de criação, leitura, atualização e exclusão de um curso em desenvolvimento, sem anexo, sem pagamento, 
	 * com confirmação da inscrição e com visualização para usuários.
	 * 
	 * @steps
	 * 1. Cria um curso em desenvolvimento, sem anexo, sem pagamento, com confirmação da inscrição e com visualização para usuários.
	 * 2. Valida os dados do curso criado e se é exibido na lista de conteúdos.
	 * 3. Edita o curso criado com novos dados.
	 * 4. Valida os dados do curso editado.
	 * 5. Exclui o curso criado.
	 * 
	 * @expected
	 * Que o curso seja criado, editado e excluído com sucesso.
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
	 * CRUD, curso
	 * 
	 * @testCase
	 * à confirmar
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 */
	it('7. CRUD curso em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para usuários', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			vigencia: '10000',
			local: 'Twitch',
			site: faker.internet.url(),
			hashtag: `#${faker.hacker.abbreviation()}`,
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