/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'
let faker = require('faker-br')

describe('ambientesAdicionais', () => {

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

    it('1. CRUD - Ambiente adicional', () => {
    //Massa de dados para criação do ambiente
        const dadosAmbiente = {
            nome: 'Parceira do Cypress',
            email: 'jadson.santos@twygo.com',
            telefone: '(91) 11111-1111',
            site: 'www.sitedaparceira.com'
        }

        // Criar o Ambiente Adicional
        cy.acessarPgAmbientesAdicionais()
        cy.criarAmbienteAdicional(dadosAmbiente, { limpar: true }) 

        //READ
        cy.acessarPgAmbientesAdicionais()
        cy.validarAmbienteAdicional(dadosAmbiente, 'Criação')

        //DELETE
        cy.inativarAmbienteAdicional(dadosAmbiente)
        cy.acessarPgAmbientesAdicionais()
        cy.validarAmbienteAdicional(dadosAmbiente, 'Inativação')
    })

})