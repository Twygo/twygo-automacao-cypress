/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
let faker = require('faker-br')

describe('Instrutor', () => {

    let nomeConteudo 

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
 
        // Exclui todos os cursos antes de iniciar o teste
        cy.excluirCursoViaApi()

        // Exclui todos os usuários antes de iniciar o teste
        cy.excluirUsuarioViaApi()

        // Cria um instrutor
        cy.criarInstrutor("Instrutor", "do Conteúdo 1")

        // Cria um instrutor
        cy.criarSegundoInstrutor("Instructor", "do Conteúdo 2")

        // Criar um curso via API
        cy.criarCursoViaApi(body)
    })

    afterEach(() => {
        // Desativa o tratamento após o teste para evitar afetar outros testes
        Cypress.removeAllListeners('uncaught:exception')
    })

    it('vincular instrutor em curso liberado', () => {
        cy.acessarPgListaConteudos()
        cy.instrutorConteudo(nomeConteudo)
        cy.vincularInstrutor("Instrutor")
        cy.voltar()
        cy.instrutorConteudo(nomeConteudo)
        cy.vincularInstrutor("Instructor")
        cy.excluirInstrutor("Instructor")
    })


})