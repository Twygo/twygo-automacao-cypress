/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'
let faker = require('faker-br')

describe('cursoAmbientesAdicionais', () => {

    let nomeConteudo

    before(() => {
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        // Ignora mensagens de erro conhecidas
		cy.ignorarCapturaErros([
		    "Unexpected identifier 'id'",
            "ResizeObserver loop completed with undelivered notifications"
		], { ignoreScriptErrors: true })
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')

        // Gera um nome aleatório para o conteúdo e para a atividade
        nomeConteudo = fakerPT_BR.commerce.productName()

        // Obtém o token de autenticação
        getAuthToken()

        // Exclui todos os cursos antes de iniciar o teste
        cy.excluirCursoViaApi()

        // Exclui todos os usuários antes de iniciar o teste
        cy.excluirUsuarioViaApi()
 
    })

    afterEach(() => {
		cy.ativarCapturaErros()
	})

    it('1. CRUD - Curso em ambiente adicional', () => {
        //Massa de dados para criação do ambiente
            const dadosAmbiente = {
                nome: 'Parceira do Cypress',
                email: 'jadson.santos@twygo.com',
                telefone: '(91) 11111-1111',
                site: 'www.sitedaparceira.com'
            }

            const body = {
                name: nomeConteudo,
                description: fakerPT_BR.lorem.sentence(5),
                situation: 1
            }
    

            // CREATE
            cy.acessarPgAmbientesAdicionais()
            cy.criarAmbienteAdicional(dadosAmbiente, { limpar: true }) 
            cy.criarCursoViaApi(body)  

            //Compartilhar curso com o ambiente adicional
            cy.acessarPgListaConteudos()
            cy.ambientesAdicionaisConteudo(nomeConteudo)
            cy.clicarCheckboxCompartilhamento(dadosAmbiente)
            //READ
            cy.acessarPgAmbientesAdicionais()
            cy.acessarAmbienteAdicional(dadosAmbiente)
            cy.loginTwygoAutomacao()
            cy.alterarPerfil('administrador')
            cy.validarConteudo(nomeConteudo, 'Compartilhar')
    
            //DELETE
            cy.fecharNovaAba()
            cy.acessarPgListaConteudos()
            cy.ambientesAdicionaisConteudo(nomeConteudo)
            cy.clicarCheckboxCompartilhamento(dadosAmbiente)
            cy.acessarPgAmbientesAdicionais()
            cy.acessarAmbienteAdicional(dadosAmbiente)
            cy.loginTwygoAutomacao()
            cy.alterarPerfil('administrador')
            cy.validarConteudo(nomeConteudo, 'Remover compartilhamento')

        })
    
})