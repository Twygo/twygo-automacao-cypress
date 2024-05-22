/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'

describe('Compartilhar curso com ambientes adicionais', () => {

    let nomeConteudo, tipoConteudo, dadosAmbiente1, dadosAmbiente2, nomeAmbienteAdicional1, nomeAmbienteAdicional2, situacaoCurso, nomeTesteAtual

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

        // Captura o nome do teste atual
        nomeTesteAtual = this.currentTest.title
        cy.log(`Nome do teste atual: ${nomeTesteAtual}`)

        // Obtém o token de autenticação
        getAuthToken()

        // Exclui todos os cursos antes de iniciar o teste
        cy.excluirCursoViaApi()

        // Define situação do curso com base no nome do teste atual
        if (nomeTesteAtual.includes('liberado')) {
            situacaoCurso = 1
        } else if (nomeTesteAtual.includes('suspenso')) {
            situacaoCurso = 2
        } else if (nomeTesteAtual.includes('em desenvolvimento')) {
            situacaoCurso = 0
        } else {
            cy.log('Situação do curso inválida, utilize "liberado", "suspenso" ou "em desenvolvimento"')
            return
        }

        // Adiciona log para verificar o valor de situacao antes de chamar a API
        cy.log(`Valor de situacao antes de chamar a API: ${situacaoCurso}`)

        // Massa de dados para criar um curso
        const body = {
            name: nomeConteudo,
            description: faker.lorem.sentence(5),
            situation: situacaoCurso
        }   

        // Cria um novo curso via API
        cy.criarCursoViaApi(body)

        // Excluir todos os ambientes adicionais
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgAmbientesAdicionais()
        cy.inativarTodosAmbientesAdicionais()
        
        // Cria dois novos ambientes adicionais para o teste
        dadosAmbiente1 = {
            nome: nomeAmbienteAdicional1,
            email: faker.internet.email().toLowerCase(),
            telefone: `${faker.number.int({ min: 10, max: 99 })} 9${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            site: faker.internet.url()
        }

        dadosAmbiente2 = {
            nome: nomeAmbienteAdicional2,
            email: faker.internet.email().toLowerCase(),
            telefone: `${faker.number.int({ min: 10, max: 99 })} 9${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            site: faker.internet.url()
        }

        cy.criarAmbienteAdicional('Criar', dadosAmbiente1, { limpar: true })
        cy.criarAmbienteAdicional('Adicionar', dadosAmbiente2, { limpar: true })

        // Define tipo de conteúdo
        tipoConteudo = 'curso'
    })

    afterEach(() => {
		cy.ativarCapturaErros()
	})

    it('1. CRUD - Curso liberado compartilhado com ambiente adicional', () => {
            // CREATE
            cy.log('## CREATE ##')

            // Compartilhar curso com o ambiente adicional
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

    it('2. CRUD - Curso suspenso compartilhado com ambiente adicional', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Compartilhar curso com o ambiente adicional
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

    it('3. CRUD - Curso em desenvolvimento compartilhado com ambiente adicional', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Compartilhar curso com o ambiente adicional
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