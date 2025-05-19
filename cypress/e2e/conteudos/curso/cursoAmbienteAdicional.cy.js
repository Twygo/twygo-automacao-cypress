/// <reference types="cypress" />

describe('Compartilhar curso com ambientes adicionais', () => {
    const tipoConteudo = 'curso'
    let situacaoCurso, nomeTesteAtual

    beforeEach(function() {
        // Captura o nome do teste atual
        nomeTesteAtual = this.currentTest.title

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

        // Prepara o ambiente de teste com base na situação do curso
        cy.preCondConteudoAmbienteAdicional(tipoConteudo, situacaoCurso )
    })

    afterEach(() => {
        // Raaliza limpeza de base
        cy.log(':: Realizando limpeza de base ::')
        cy.posCondConteudoAmbienteAdicional()
    })

    it('1. CRUD - Curso liberado compartilhado com ambiente adicional', () => {
            // CREATE
            cy.log('## CREATE ##')

            // Compartilhar curso com o ambiente adicional
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

    it('2. CRUD - Curso suspenso compartilhado com ambiente adicional', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Compartilhar curso com o ambiente adicional
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

    it('3. CRUD - Curso em desenvolvimento compartilhado com ambiente adicional', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Compartilhar curso com o ambiente adicional
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