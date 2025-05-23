/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../../../support/authHelper'

describe('Instrutor', () => {

    let nomeConteudo, nomeInstrutor1, nomeInstrutor2, sobrenomeInstrutor1, sobrenomeInstrutor2 

    before(() => {
        // Configuração de campos customizados
        cy.configTodosCamposCustomizados('Desabilitado')
        cy.configTodosCamposCustomizados('Habilitado')
    })

    //Criar um usuário Instrutor e um curso 
    beforeEach(() => {
        // Gera um nome aleatório para o conteúdo e para a atividade
        nomeConteudo = fakerPT_BR.commerce.productName()
        
        // Obtém o token de autenticação
        getAuthToken()

        // Gerar nomes aleatórios para os instrutores
        nomeInstrutor1 = fakerPT_BR.person.firstName()
        sobrenomeInstrutor1 = fakerPT_BR.person.lastName()
        nomeInstrutor2 = fakerPT_BR.person.firstName()
        sobrenomeInstrutor2 = fakerPT_BR.person.lastName()
 
        // Exclui todos os cursos antes de iniciar o teste
        cy.excluirCursoViaApi()

        // Exclui todos os usuários antes de iniciar o teste
        cy.excluirUsuarioViaApi()

        // Cria os instrutores
        cy.criarInstrutor(nomeInstrutor1, sobrenomeInstrutor1)
        cy.criarInstrutor(nomeInstrutor2, sobrenomeInstrutor2)
    })

    it('1. CRUD - Vincular instrutor em curso liberado', () => {
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
            //Acessa Opções > Instrutor
            cy.instrutorConteudo(nomeConteudo)
            cy.vincularInstrutor(nomeInstrutor1)
            cy.voltar()
            cy.instrutorConteudo(nomeConteudo)
            
            //READ            
            cy.validarVinculoInstrutor(nomeInstrutor1)
        
            // UPDATE
            cy.voltar()
            cy.instrutorConteudo(nomeConteudo)
            cy.vincularInstrutor(nomeInstrutor2)
    
            // DELETE
            cy.removerVinculoInstrutor(nomeInstrutor2)
            cy.voltar()
            cy.instrutorConteudo(nomeConteudo)
            cy.validarRemocaoVinculoInstrutor(nomeInstrutor2)
    })

    it('2. CRUD - Vincular instrutor em curso em desenvolvimento', () => {
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
            //Acessa Opções > Instrutor
            cy.instrutorConteudo(nomeConteudo)
            cy.vincularInstrutor(nomeInstrutor1)
            cy.voltar()
            cy.instrutorConteudo(nomeConteudo)
            
            //READ            
            cy.validarVinculoInstrutor(nomeInstrutor1)
        
            // UPDATE
            cy.voltar()
            cy.instrutorConteudo(nomeConteudo)
            cy.vincularInstrutor(nomeInstrutor2)
    
            // DELETE
            cy.removerVinculoInstrutor(nomeInstrutor2)
            cy.voltar()
            cy.instrutorConteudo(nomeConteudo)
            cy.validarRemocaoVinculoInstrutor(nomeInstrutor2)
    })

    it('3. CRUD - Vincular instrutor em curso suspenso', () => {
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
        //Acessa Opções > Instrutor
        cy.instrutorConteudo(nomeConteudo)
        cy.vincularInstrutor(nomeInstrutor1)
        cy.voltar()
        cy.instrutorConteudo(nomeConteudo)
        
        //READ            
        cy.validarVinculoInstrutor(nomeInstrutor1)
    
        // UPDATE
        cy.voltar()
        cy.instrutorConteudo(nomeConteudo)
        cy.vincularInstrutor(nomeInstrutor2)

        // DELETE
        cy.removerVinculoInstrutor(nomeInstrutor2)
        cy.voltar()
        cy.instrutorConteudo(nomeConteudo)
        cy.validarRemocaoVinculoInstrutor(nomeInstrutor2)
    })
})