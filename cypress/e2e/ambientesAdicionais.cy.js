/// reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('ambientesAdicionais', () => {

    before(() => {
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        // Ignora mensagens de erro conhecidas
		cy.ignorarCapturaErros([
		    "Unexpected identifier 'id'",
            "ResizeObserver loop completed with undelivered notifications"
		], { ignoreScriptErrors: true })

        // Exclui todos os ambientes adicionais 
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgAmbientesAdicionais()
        cy.inativarTodosAmbientesAdicionais() 
    })

    afterEach(() => {
		cy.ativarCapturaErros()
	})

    it('1. CRUD - Ambiente adicional', () => {
    //Massa de dados para criação do ambiente
        const dadosAmbiente = {
            nome: faker.commerce.productName(),
            email: faker.internet.email().toLowerCase(),
            telefone: `(${faker.string.numeric(2)}) ${faker.string.numeric(5)}-${faker.string.numeric(4)}`,
            site: faker.internet.url()
        }

        // CREATE
        cy.log('## CREATE ##')
        cy.criarAmbienteAdicional(dadosAmbiente, { limpar: true }) 

        // READ
        cy.log('## READ ##')
        cy.acessarPgAmbientesAdicionais()
        cy.validarAmbienteAdicional(dadosAmbiente, 'Criação')

        // UPDATE
        cy.log('## UPDATE ##')
        cy.log('Não é possível alterar dados do ambiente adicional por esta tela.')

        // DELETE
        cy.log('## DELETE ##')

        cy.inativarAmbienteAdicional(dadosAmbiente.nome)
        cy.acessarPgAmbientesAdicionais()
        cy.validarAmbienteAdicional(dadosAmbiente, 'Inativação')
    })

})