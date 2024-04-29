/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
let faker = require('faker-br')

describe('Gestor', () => {

    let nomeConteudo, nomeGestor1, nomeGestor2, sobrenomeGestor1, sobrenomeGestor2 

    before(() => {
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

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
        nomeGestor1 = fakerPT_BR.person.firstName()
        sobrenomeGestor1 = fakerPT_BR.person.lastName()
        nomeGestor2 = fakerPT_BR.person.firstName()
        sobrenomeGestor2 = fakerPT_BR.person.lastName()
 
        // Exclui todos os cursos antes de iniciar o teste
        cy.excluirCursoViaApi()

        // Exclui todos os usuários antes de iniciar o teste
        cy.excluirUsuarioViaApi()

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        // Cria os instrutores
        cy.criarGestor(nomeGestor1, sobrenomeGestor1)
        cy.criarGestor(nomeGestor2, sobrenomeGestor2)
    })

    afterEach(() => {
        // Desativa o tratamento após o teste para evitar afetar outros testes
        Cypress.removeAllListeners('uncaught:exception')
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
            cy.habilitarDesabilitarGestao(nomeGestor1)
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            
            //READ              
            cy.validarVinculoGestor(nomeGestor1)

            //UPDATE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.habilitarDesabilitarGestao(nomeGestor2)
            cy.validarVinculoGestor(nomeGestor2)
    
            // DELETE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.habilitarDesabilitarGestao(nomeGestor2)
            cy.validarRemocaoGestor(nomeGestor2)
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
            cy.habilitarDesabilitarGestao(nomeGestor1)
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            
            //READ              
            cy.validarVinculoGestor(nomeGestor1)

            //UPDATE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.habilitarDesabilitarGestao(nomeGestor2)
            cy.validarVinculoGestor(nomeGestor2)
    
            // DELETE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.habilitarDesabilitarGestao(nomeGestor2)
            cy.validarRemocaoGestor(nomeGestor2)
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
            cy.habilitarDesabilitarGestao(nomeGestor1)
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            
            //READ              
            cy.validarVinculoGestor(nomeGestor1)

            //UPDATE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.habilitarDesabilitarGestao(nomeGestor2)
            cy.validarVinculoGestor(nomeGestor2)
    
            // DELETE
            cy.voltar()
            cy.gestorConteudo(nomeConteudo)
            cy.habilitarDesabilitarGestao(nomeGestor2)
            cy.validarRemocaoGestor(nomeGestor2)
    })
})