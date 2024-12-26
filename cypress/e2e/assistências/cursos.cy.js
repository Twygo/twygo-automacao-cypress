/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper' 

describe('Curso', () => {

    it('Criar {x} cursos via API', () => {
        const quantidade = 24

        for (let i = 0; i < quantidade; i++) {
            // Gera um nome aleatório para o conteúdo e para a atividade
            nomeConteudo = faker.commerce.productName()

            // Obtém o token de autenticação 
            getAuthToken()

            // Cria um curso default
            const body = {
                name: nomeConteudo,
                description: faker.lorem.sentence(5)
            }
            cy.criarCursoViaApi(body)            
        }
    })
})