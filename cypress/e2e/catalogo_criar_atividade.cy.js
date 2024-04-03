/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper' 
import estruturaAtividades from '../support/pageObjects/estruturaAtividades'

describe('Criar atividade', () => {
    const atividades = new estruturaAtividades()

    let nomeConteudo, tipoConteudo

    let atividadeDefault = 'Novo 1'

    before(() => {
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        // Define o tipo de conteúdo
        tipoConteudo = 'catalogo'

        // Gera um nome aleatório para o conteúdo
        nomeConteudo = faker.commerce.productName()

        // Obtém o token de autenticação 
        getAuthToken()

        // Exclui todos os catálogos antes de iniciar o teste
        cy.excluirCatalogoViaApi()

        // Cria um catálogo default
        const body = {
            name: nomeConteudo,
            description: faker.lorem.sentence(5)
        }
        cy.criarCatalogoViaApi(body)
    })

    it('Deve criar uma atividade default', () => {
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()
        //TODO: ajustar editarAtividade
        cy.editarAtividade(nomeConteudo, atividadeDefault)
    })
})