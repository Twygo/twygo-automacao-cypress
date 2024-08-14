/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import { gerarDados } from '../support/helpers/geradorDados'

describe('ambientesAdicionais', () => {

    beforeEach(() => {
        // Exclui todos os ambientes adicionais         
        cy.inativarTodosAmbientesAdicionais() 
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
        cy.criarAmbienteAdicional('Criar', dadosAmbiente, { limpar: true }) 

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