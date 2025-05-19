/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import { gerarDados } from '../../../support/helpers/geradorDados'
import formAmbientesAdicionais from '../../../support/pageObjects/formAmbientesAdicionais'

describe('ambientesAdicionais', () => {

    beforeEach(() => {
        // Exclui todos os ambientes adicionais 
        cy.inativarTodosAmbientesAdicionais() 
    })

    afterEach(function() {
        // Caso o teste falhe, excluir todos os ambientes adicionais
        if (this.currentTest.state === 'failed') {
            cy.log(':: Realizando limpeza de base ::')
            cy.inativarTodosAmbientesAdicionais()
        }
    })

    it('1. CRUD - Ambiente adicional', () => {
    //Massa de dados para criação do ambiente
        const dadosAmbiente = {
            nome: faker.commerce.productName(),
            email: faker.internet.email().toLowerCase(),
            telefone: gerarDados('telefone', 'celular'),
            site: faker.internet.url()
        }

        // CREATE
        cy.log('## CREATE ##')
        cy.acessarPgAmbientesAdicionais()
        cy.criarAmbienteAdicional('Criar', dadosAmbiente, { limpar: true }) 

        // READ
        cy.log('## READ ##')
        cy.acessarPgAmbientesAdicionais()
        formAmbientesAdicionais.validarAmbienteAdicional(dadosAmbiente.nome, 'Criar')

        // UPDATE
        cy.log('## UPDATE ##')
        cy.log('Não é possível alterar dados do ambiente adicional por esta tela.')

        // DELETE
        cy.log('## DELETE ##')
        cy.acessarPgAmbientesAdicionais()
        cy.inativarAmbienteAdicional(dadosAmbiente.nome)
    })
})