/// reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('Integração', () => {

    it('Criar {x} registros de integração', () => {
        const quantidade = 55

        for (let i = 0; i < quantidade; i++) {
            //Massa de dados
            const dados = {
                nome: faker.lorem.words(2),
            }

            //CREATE
            cy.log('## CREATE ##')

            cy.acessarPgIntegracoes()
            cy.adicionarChaveApi()
            cy.preencherIntegracaoApi(dados, { limpar: true })
            cy.salvarChaveApi('Criação')
            cy.validarTabelaIntegracoes(dados.nome, 'Ativada', 'Criação')
        }
    })
})