/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'
import { gerarTelefone } from '../support/utilsHelper'

describe('Compartilhar trilha com ambientes adicionais', () => {

    let nomeConteudo, tipoConteudo, dadosAmbiente1, dadosAmbiente2, nomeAmbienteAdicional1, nomeAmbienteAdicional2, 
    situacaoTrilha, nomeTesteAtual, listaConteudos, celular, fixo

    before(() => {
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(function() {
        // Ignora mensagens de erro conhecidas
		cy.ignorarCapturaErros([
		    "Unexpected identifier 'id'",
            "ResizeObserver loop completed with undelivered notifications"
		], { ignoreScriptErrors: true })

        // Gera um nome aleatório para o conteúdo e para os ambientes adicionais
        nomeConteudo = faker.commerce.productName()
        nomeAmbienteAdicional1 = faker.commerce.productName()
        nomeAmbienteAdicional2 = faker.commerce.productName()
        celular = gerarTelefone('celular')
        fixo = gerarTelefone('fixo')

        // Captura o nome do teste atual
        nomeTesteAtual = this.currentTest.title

        // Define tipo de conteúdo
        tipoConteudo = 'trilha'

        // Obtém o token de autenticação
        getAuthToken()

        // Exclui todos os cursos antes de iniciar o teste (devido a exibição na lista de conteúdos junto com as trilhas)
        cy.excluirCursoViaApi()

        // Exclui todas as trilhas antes de iniciar o teste
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')

        listaConteudos = []
		cy.listaConteudo(tipoConteudo, listaConteudos)
		cy.excluirConteudo(null, tipoConteudo, listaConteudos)	

        // Define situação da trilha com base no nome do teste atual
        if (nomeTesteAtual.includes('liberado')) {
            situacaoTrilha = 'Liberado'
        } else if (nomeTesteAtual.includes('suspenso')) {
            situacaoTrilha = 'Suspenso'
        } else if (nomeTesteAtual.includes('em desenvolvimento')) {
            situacaoTrilha = 'Em desenvolvimento'
        } else {
            cy.log('Situação da trilha inválida, utilize "liberado", "suspenso" ou "em desenvolvimento"')
            return
        }

        // Massa de dados para criar uma trilha
        const conteudo = {
            nome: nomeConteudo,
            descricao: `${faker.commerce.productDescription()} do evento ${nomeConteudo}`,
            situacao: situacaoTrilha
        }

        // Cria uma trilha para o teste
        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)

        // Excluir todos os ambientes adicionais
        cy.acessarPgAmbientesAdicionais()
        cy.inativarTodosAmbientesAdicionais()
        
        // Cria dois novos ambientes adicionais para o teste
        dadosAmbiente1 = {
            nome: nomeAmbienteAdicional1,
            email: faker.internet.email().toLowerCase(),
            telefone: celular,
            site: faker.internet.url()
        }

        dadosAmbiente2 = {
            nome: nomeAmbienteAdicional2,
            email: faker.internet.email().toLowerCase(),
            telefone: fixo,
            site: faker.internet.url()
        }

        cy.criarAmbienteAdicional('Criar', dadosAmbiente1, { limpar: true })
        cy.criarAmbienteAdicional('Adicionar', dadosAmbiente2, { limpar: true })
    })

    afterEach(() => {
		cy.ativarCapturaErros()
	})

    it('1. CRUD - Trilha com situação liberado compartilhada com ambiente adicional', () => {
            // CREATE
            cy.log('## CREATE ##')

            // Compartilhar trilha com o ambiente adicional
            cy.acessarPgListaConteudos()
            cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
            cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional1, 'Habilitar')
            cy.salvarCompartilhamentoAmbienteAdicional()

            // READ
            cy.log('## READ ##')

            cy.acessarPgListaConteudos()
            cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
            cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional1, 'Habilitado')

            // UPDATE
            cy.log('## UPDATE ##')

            cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional1, 'Desabilitar')
            cy.salvarCompartilhamentoAmbienteAdicional()

            cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional2, 'Habilitar')
            cy.salvarCompartilhamentoAmbienteAdicional()

            // READ-UPDATE
            cy.log('## READ-UPDATE ##')

            cy.acessarPgListaConteudos()
            cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
            cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional1, 'Desabilitado')
            cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional2, 'Habilitado')

            // DELETE
            cy.log('## DELETE ##')
            cy.log('Remover compartilhamento com ambiente adicional')

            cy.acessarPgListaConteudos()
            cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
            cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional2, 'Desabilitar')
            cy.salvarCompartilhamentoAmbienteAdicional()

            cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional1, 'Desabilitado')
            cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional2, 'Desabilitado')
    })

    it('2. CRUD - Trilha com situação suspenso compartilhada com ambiente adicional', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Compartilhar trilha com o ambiente adicional
        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
        cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional1, 'Habilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        // READ
        cy.log('## READ ##')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional1, 'Habilitado')

        // UPDATE
        cy.log('## UPDATE ##')

        cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional1, 'Desabilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional2, 'Habilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional1, 'Desabilitado')
        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional2, 'Habilitado')

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Remover compartilhamento com ambiente adicional')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
        cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional2, 'Desabilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional1, 'Desabilitado')
        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional2, 'Desabilitado')
    })  

    it('3. CRUD - Trilha com situação em desenvolvimento compartilhada com ambiente adicional', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Compartilhar trilha com o ambiente adicional
        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
        cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional1, 'Habilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        // READ
        cy.log('## READ ##')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional1, 'Habilitado')

        // UPDATE
        cy.log('## UPDATE ##')

        cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional1, 'Desabilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional2, 'Habilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional1, 'Desabilitado')
        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional2, 'Habilitado')

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Remover compartilhamento com ambiente adicional')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(nomeConteudo, tipoConteudo)
        cy.compartilharComAmbienteAdicional(nomeAmbienteAdicional2, 'Desabilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional1, 'Desabilitado')
        cy.validarCompartilhamentoComAmbienteAdicional(nomeAmbienteAdicional2, 'Desabilitado')
    })  
})