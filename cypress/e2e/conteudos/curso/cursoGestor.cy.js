/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../../../support/authHelper'
let faker = require('faker-br')

describe('Gestor', () => {
    let nomeConteudo, nomeGestor1, nomeGestor2, sobrenomeGestor1, sobrenomeGestor2 

    before(() => {
        // Configuração de campos customizados
        cy.configTodosCamposCustomizados('Desabilitado')
        cy.configTodosCamposCustomizados('Habilitado')
    })

    beforeEach(() => {
        // Gera um nome aleatório para o conteúdo e para a atividade
        nomeConteudo = fakerPT_BR.commerce.productName()
        
        // Obtém o token de autenticação
        getAuthToken()

        // Gerar nomes aleatórios para os gestores
        nomeGestor1 = fakerPT_BR.person.firstName()
        sobrenomeGestor1 = fakerPT_BR.person.lastName()
        nomeGestor2 = fakerPT_BR.person.firstName()
        sobrenomeGestor2 = fakerPT_BR.person.lastName()
 
        // Exclui todos os cursos antes de iniciar o teste
        cy.excluirCursoViaApi()

        // Exclui todos os usuários antes de iniciar o teste
        cy.excluirUsuarioViaApi()

        // Cria os gestores
        cy.criarGestor(nomeGestor1, sobrenomeGestor1)
        cy.criarGestor(nomeGestor2, sobrenomeGestor2)
    })

    it('1. CRUD - Vincular gestor em curso liberado', () => {
        // CREATE
        //Massa de dados
        const body = {
            name: nomeConteudo,
            description: fakerPT_BR.lorem.sentence(5),
            situation: 1
        }

            // Criar um curso via API
            cy.criarCursoViaApi(body) 
            // Acessa a Lista de conteúdos
            cy.acessarPgListaConteudos()
            //Acessa Opções > Gestor
            cy.gestorConteudo(nomeConteudo)
            //Habilita o Gestor
            cy.vinculoGestao(nomeGestor1, 'Vincular')
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            
            //READ              
            cy.validarVinculoGestor(nomeGestor1, 'Vinculado')

            //UPDATE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.vinculoGestao(nomeGestor2, 'Vincular')
            cy.validarVinculoGestor(nomeGestor2, 'Vinculado')
    
            // DELETE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.vinculoGestao(nomeGestor2, 'Desvincular')
            cy.validarVinculoGestor(nomeGestor2, 'Desvinculado')
    })

    it('2. CRUD - Vincular gestor em curso em desenvolvimento', () => {
        // CREATE
        //Massa de dados
        const body = {
            name: nomeConteudo,
            description: fakerPT_BR.lorem.sentence(5),
            situation: 0
        }

            // Criar um curso via API
            cy.criarCursoViaApi(body) 
            // Acessa a Lista de conteúdos
            cy.acessarPgListaConteudos()
            //Acessa Opções > Gestor
            cy.gestorConteudo(nomeConteudo)
            //Habilita o Gestor
            cy.vinculoGestao(nomeGestor1, 'Vincular')
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)

            //READ              
            cy.validarVinculoGestor(nomeGestor1, 'Vinculado')

            //UPDATE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.vinculoGestao(nomeGestor2, 'Vincular')
            cy.validarVinculoGestor(nomeGestor2, 'Vinculado')

            // DELETE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.vinculoGestao(nomeGestor2, 'Desvincular')
            cy.validarVinculoGestor(nomeGestor2, 'Desvinculado')
    })

    it('3. CRUD - Vincular gestor em curso suspenso', () => {
        // CREATE
        //Massa de dados
        const body = {
            name: nomeConteudo,
            description: fakerPT_BR.lorem.sentence(5),
            situation: 2
        }

            // Criar um curso via API
            cy.criarCursoViaApi(body) 
            // Acessa a Lista de conteúdos
            cy.acessarPgListaConteudos()
            //Acessa Opções > Gestor
            cy.gestorConteudo(nomeConteudo)
            //Habilita o Gestor
            cy.vinculoGestao(nomeGestor1, 'Vincular')
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)

            //READ              
            cy.validarVinculoGestor(nomeGestor1, 'Vinculado')

            //UPDATE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.vinculoGestao(nomeGestor2, 'Vincular')
            cy.validarVinculoGestor(nomeGestor2, 'Vinculado')

            // DELETE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.vinculoGestao(nomeGestor2, 'Desvincular')
            cy.validarVinculoGestor(nomeGestor2, 'Desvinculado')
    })
})