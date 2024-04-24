/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
let faker = require('faker-br')

describe('Instrutor', () => {

    let nomeConteudo, nomeInstrutor1, nomeInstrutor2, sobrenomeInstrutor1, sobrenomeInstrutor2 

    before(() => {
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    //Criar um usuário Instrutor e um curso 
    beforeEach(() => {
        // Ativa o tratamento de exceção não capturada especificamente para este teste
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        }) 

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

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        // Cria os instrutores
        cy.criarInstrutor(nomeInstrutor1, sobrenomeInstrutor1)
        cy.criarInstrutor(nomeInstrutor2, sobrenomeInstrutor2)
  
    })

    afterEach(() => {
        // Desativa o tratamento após o teste para evitar afetar outros testes
        Cypress.removeAllListeners('uncaught:exception')
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
        // Criar instrutor
        cy.acessarPgListaConteudos()
        cy.instrutorConteudo(nomeConteudo)

        //READ
        cy.vincularInstrutor(nomeInstrutor1)

        // UPDATE
        cy.voltar()
        cy.instrutorConteudo(nomeConteudo)
        cy.vincularInstrutor(nomeInstrutor2)

        // DELETE
        cy.excluirInstrutor(nomeInstrutor2)
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
        // Criar instrutor
        cy.acessarPgListaConteudos()
        cy.instrutorConteudo(nomeConteudo)

        //READ
        cy.vincularInstrutor(nomeInstrutor1)

        // UPDATE
        cy.voltar()
        cy.instrutorConteudo(nomeConteudo)
        cy.vincularInstrutor(nomeInstrutor2)

        // DELETE
        cy.excluirInstrutor(nomeInstrutor2)
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
        // Criar instrutor
        cy.acessarPgListaConteudos()
        cy.instrutorConteudo(nomeConteudo)

        //READ
        cy.vincularInstrutor(nomeInstrutor1)

        // UPDATE
        cy.voltar()
        cy.instrutorConteudo(nomeConteudo)
        cy.vincularInstrutor(nomeInstrutor2)

        // DELETE
        cy.excluirInstrutor(nomeInstrutor2)
    })




})