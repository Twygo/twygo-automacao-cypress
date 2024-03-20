/// reference types="cypress" />
import 'cypress-real-events/support'
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'

describe('curso', () => {
	let nome
	let tipoConteudo
	let categorias
	let novasCategorias

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

		// Obtém o token de autenticação
		getAuthToken()

		// Exclui todos os cursos antes de iniciar o teste
		cy.excluirCursoViaApi()
	})
	
	afterEach(() => {
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})
	
	it('1-CRUD curso com dados default', () =>{
		// Massa de dados para criação do curso
        const conteudo = {
			nome: nome,
            descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
		}

		// TESTE
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)
        cy.editarConteudo(conteudo.nome, tipoConteudo)
        cy.validarDadosConteudo(conteudo)

		const novoNome = faker.commerce.productName()
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudo_edit = {
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
			categoria: categorias,
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

		cy.preencherDadosConteudo(conteudo_edit, { limpar: true })
		cy.salvarConteudo(conteudo_edit.nome, tipoConteudo)		
		cy.editarConteudo(conteudo_edit.nome, tipoConteudo)
		cy.validarDadosConteudo(conteudo_edit, categorias)
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo_edit.nome, tipoConteudo)
	})

	it('2-CRUD curso liberado, com anexo, com pagamento, sem acréscimo, com confirmação, com visualização para inscritos', () => {
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
			categoria: categorias,
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

		// TESTE
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)
        cy.editarConteudo(conteudo.nome, tipoConteudo)
        cy.validarDadosConteudo(conteudo, categorias)

		const novoNome = faker.commerce.productName()
		novasCategorias = [`Cat3-${faker.hacker.noun()}`, `Cat4-${faker.hacker.noun()}`]

		const conteudo_edit = {
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
			categoria: novasCategorias,
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

		cy.preencherDadosConteudo(conteudo_edit, { limpar: true })
		cy.salvarConteudo(conteudo_edit.nome, tipoConteudo)
		cy.editarConteudo(conteudo_edit.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		cy.validarDadosConteudo(conteudo_edit, todasCategorias)
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo_edit.nome, tipoConteudo)
	})

	it('3-CRUD curso liberado, com anexo, com pagamento, c/acréscimo, sem confirmação, com visualização para público', () => {
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
			categoria: categorias,
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

		// TESTE
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)
        cy.editarConteudo(conteudo.nome, tipoConteudo)
        cy.validarDadosConteudo(conteudo, categorias)

		const novoNome = faker.commerce.productName()
		novasCategorias = [`Cat4-${faker.hacker.noun()}`, `Cat5-${faker.hacker.noun()}`]
		
		const conteudo_edit = {
			nome: novoNome,
			data_inicio: '10/03/2000',
			hora_inicio: '00:00',
			data_fim: '31/12/2050',
			hora_fim: '03:40',
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
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
			categoria: novasCategorias,
			permite_anexo: 'Habilitado',
			status_iframe_anexo: true,
			mensagem_anexo: `Insira o anexo do Curso: ${nome}`,
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

		cy.preencherDadosConteudo(conteudo_edit, { limpar: true })
		cy.salvarConteudo(conteudo_edit.nome, tipoConteudo)
		cy.editarConteudo(conteudo_edit.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		cy.validarDadosConteudo(conteudo_edit, todasCategorias)
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo_edit.nome, tipoConteudo)
	})

	it('4-CRUD curso suspenso, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
		categorias = [`Cat1-${faker.hacker.noun()}`]
		
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
		let dataFormatada = `${dia}/${mes}/${ano}`

		// Massa de dados para criação do curso
		const conteudo = {
			nome: nome,
			data_inicio: dataFormatada,
			hora_inicio: '01:00',
			data_fim: dataFormatada,
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
			categoria: categorias,
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

		// TESTE
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)
        cy.editarConteudo(conteudo.nome, tipoConteudo)
        cy.validarDadosConteudo(conteudo, categorias)

		novasCategorias = [`Cat2-${faker.hacker.noun()}`, `Cat3-${faker.hacker.noun()}`]

		const conteudo_edit = {
			data_inicio: '01/01/2000',
			data_fim: '28/02/2030',
			tipo: 'Treinamento',
			canal: 'Em companhia',
			categoria: novasCategorias,
			visualizacao: 'Usuários',
			situacao: 'Em desenvolvimento',
			exige_confirmacao: 'Desabilitado'
		}

		cy.preencherDadosConteudo(conteudo_edit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)
		cy.editarConteudo(conteudo.nome, tipoConteudo)

		const todasCategorias = [...categorias, ...novasCategorias]
		const dadosParaValidar = { ...conteudo, ...conteudo_edit }
		cy.validarDadosConteudo(dadosParaValidar, todasCategorias)
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	it('5-CRUD curso em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para colaboradores', () => {
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
			categoria: categorias,
			status_iframe_anexo: false,
			visualizacao: 'Usuários',
			situacao: 'Suspenso',
			notificar_concluir_primeira_aula: 'Não',
			dias_teste: faker.number.int({ min: 1000, max: 9999 }),
			exige_confirmacao: 'Habilitado',
			habilitar_chat: true
		}

		// TESTE
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
		cy.addConteudo(tipoConteudo)
		cy.preencherDadosConteudo(conteudo, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)
		cy.editarConteudo(conteudo.nome, tipoConteudo)
		cy.validarDadosConteudo(conteudo, categorias)
		
		// UPDATE
		const conteudo_edit = {
			tipo: 'Outros',
			visualizacao: 'Inscritos',
			status_iframe_anexo: false
		}

		const dadosParaValidar = { ...conteudo, ...conteudo_edit }

		cy.preencherDadosConteudo(conteudo_edit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)
		cy.editarConteudo(conteudo.nome, tipoConteudo)
		cy.validarDadosConteudo(dadosParaValidar, categorias)
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	it('6-CRUD curso liberado, sem anexo, sem pagamento, sem confirmação, com visualização para público', () => {
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
			categoria: categorias,
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

		// TESTE
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)
        cy.editarConteudo(conteudo.nome, tipoConteudo)
        cy.validarDadosConteudo(conteudo, categorias)
		
		// UPDATE
		const conteudo_edit = {
			tipo: 'Palestra'
		}

		cy.preencherDadosConteudo(conteudo_edit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)
		cy.editarConteudo(conteudo.nome, tipoConteudo)

		const dadosParaValidar = { ...conteudo, ...conteudo_edit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})

	it('7-CRUD curso em desenvolvimento, sem anexo, sem pagamento, com confirmação, com visualização para usuários', () => {
		// Massa de dados para criação do curso
		categorias = [`Cat1-${faker.hacker.noun()}`, `Cat2-${faker.hacker.noun()}`]
		const conteudo = {
			nome: nome,
			descricao: `${faker.commerce.productDescription()} do evento ${nome}`,
			tipo: 'Treinamento',
			modalidade: 'Online',
			sincronismo: 'Ao vivo',
			canal: 'Aberto',
			vigencia: '10000',
			local: 'Twitch',
			site: faker.internet.url(),
			notificar_responsavel: false,
			hashtag: `#${faker.hacker.abbreviation()}`,
			categoria: categorias,
			status_iframe_anexo: false,
			visualizacao: 'Usuários',
			situacao: 'Em desenvolvimento',
			notificar_concluir_primeira_aula: 'Não',
			habilitar_pagamento: false,
			habilitar_chat: true
		}

		// TESTE
		cy.loginTwygoAutomacao()
		cy.alterarPerfilParaAdministrador()
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)
        cy.editarConteudo(conteudo.nome, tipoConteudo)
        cy.validarDadosConteudo(conteudo, categorias)
		

		const conteudo_edit = {
			vigencia: '0',
			site: ' ',
			hashtag: ' ',
			habilitar_chat: false
		}

		cy.preencherDadosConteudo(conteudo_edit, { limpar: true })
		cy.salvarConteudo(conteudo.nome, tipoConteudo)
		cy.editarConteudo(conteudo.nome, tipoConteudo)

		const dadosParaValidar = { ...conteudo, ...conteudo_edit }
		cy.validarDadosConteudo(dadosParaValidar, categorias)
		cy.cancelarFormularioConteudo(tipoConteudo)
		cy.excluirConteudo(conteudo.nome, tipoConteudo)
	})
})