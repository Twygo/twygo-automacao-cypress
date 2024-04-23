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

        //Massa de dados
        const body = {
            name: nomeConteudo,
            description: fakerPT_BR.lorem.sentence(5)
        }

        
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

        // Cria um instrutor
        cy.criarInstrutor(nomeInstrutor1, sobrenomeInstrutor1)

        // Cria um instrutor
        cy.criarSegundoInstrutor(nomeInstrutor2, sobrenomeInstrutor2)

        // Criar um curso via API
        cy.criarCursoViaApi(body)       
    })

    afterEach(() => {
        // Desativa o tratamento após o teste para evitar afetar outros testes
        Cypress.removeAllListeners('uncaught:exception')
    })

    it('1. CRUD - Vincular instrutor em curso liberado', () => {
        // CREATE
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