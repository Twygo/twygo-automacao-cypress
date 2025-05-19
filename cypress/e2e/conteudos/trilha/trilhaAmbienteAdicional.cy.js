/// <reference types="cypress" />
describe('Compartilhar trilha com ambientes adicionais', () => {
    const tipoConteudo = 'trilha'
    let situacaoTrilha, nomeTesteAtual

    beforeEach(function() {
        // Captura o nome do teste atual
        nomeTesteAtual = this.currentTest.title

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

        // Prepara o ambiente de teste com base na situação do curso
        cy.preCondConteudoAmbienteAdicional(tipoConteudo, situacaoTrilha )
    })

    afterEach(() => {
        // Realiza limpeza de base
        cy.log(':: Realizando limpeza de base ::')
        cy.posCondConteudoAmbienteAdicional()
    })

    it('1. CRUD - Trilha com situação liberado compartilhada com ambiente adicional', () => {
            // CREATE
            cy.log('## CREATE ##')

            // Compartilhar trilha com o ambiente adicional
            cy.acessarPgListaConteudos()
            cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
            cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Habilitar')
            cy.salvarCompartilhamentoAmbienteAdicional()

            // READ
            cy.log('## READ ##')

            cy.acessarPgListaConteudos()
            cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
            cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Habilitado')

            // UPDATE
            cy.log('## UPDATE ##')

            cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Desabilitar')
            cy.salvarCompartilhamentoAmbienteAdicional()

            cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Habilitar')
            cy.salvarCompartilhamentoAmbienteAdicional()

            // READ-UPDATE
            cy.log('## READ-UPDATE ##')

            cy.acessarPgListaConteudos()
            cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
            cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Desabilitado')
            cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Habilitado')

            // DELETE
            cy.log('## DELETE ##')
            cy.log('Remover compartilhamento com ambiente adicional')

            cy.acessarPgListaConteudos()
            cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
            cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Desabilitar')
            cy.salvarCompartilhamentoAmbienteAdicional()

            cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Desabilitado')
            cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Desabilitado')
    })

    it('2. CRUD - Trilha com situação suspenso compartilhada com ambiente adicional', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Compartilhar trilha com o ambiente adicional
        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
        cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Habilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        // READ
        cy.log('## READ ##')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Habilitado')

        // UPDATE
        cy.log('## UPDATE ##')

        cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Desabilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Habilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Desabilitado')
        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Habilitado')

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Remover compartilhamento com ambiente adicional')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
        cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Desabilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Desabilitado')
        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Desabilitado')
    })  

    it('3. CRUD - Trilha com situação em desenvolvimento compartilhada com ambiente adicional', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Compartilhar trilha com o ambiente adicional
        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
        cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Habilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        // READ
        cy.log('## READ ##')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Habilitado')

        // UPDATE
        cy.log('## UPDATE ##')

        cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Desabilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Habilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Desabilitado')
        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Habilitado')

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Remover compartilhamento com ambiente adicional')

        cy.acessarPgListaConteudos()
        cy.ambienteAdicionalConteudo(Cypress.env('nomeConteudo'), tipoConteudo)
        cy.compartilharComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Desabilitar')
        cy.salvarCompartilhamentoAmbienteAdicional()

        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional1'), 'Desabilitado')
        cy.validarCompartilhamentoComAmbienteAdicional(Cypress.env('nomeAmbienteAdicional2'), 'Desabilitado')
    })  
})