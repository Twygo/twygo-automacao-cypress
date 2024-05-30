/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'


describe('Integrações com API', () => {
    let nome = fakerPT_BR.person.firstName()
    let sobrenome = fakerPT_BR.person.lastName()
    let emailUsuario = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

    before(() => {
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(function() {
        // Ignora mensagens de erro conhecidas
		cy.ignorarCapturaErros([
		    "Unexpected identifier 'id'",
            "ResizeObserver loop completed with undelivered notifications"
		], { ignoreScriptErrors: true })

        // Gera um nome aleatório para o conteúdo e para os ambientes adicionais
        
        // Obtém o token de autenticação
        getAuthToken()

        // Exclui todos os usuários antes de iniciar o teste
        cy.excluirUsuarioViaApi()

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')

        
    })

    afterEach(() => {
		cy.ativarCapturaErros()
	})

    it('1. CRUD - Integração com API', () => {
        //Massa de dados

        const dadosChave = {
            nome: fakerPT_BR.commerce.productName()
        }

        const dadosChaveEditada = {
            nome: fakerPT_BR.commerce.productName()
        }

        const body = {
            first_name: nome,
            last_name: sobrenome,
            email: emailUsuario
        }

        const nomeCompleto = {usuarioAssociado: `${body.first_name} ${body.last_name} <${body.email}>`}
        const valorChaveApi = {chaveDeApi: true}

        //CREATE
        cy.criarUsuarioViaApi(body)
        cy.acessarPgIntegracoes()
        cy.adicionarChaveApi()
        cy.preencherIntegracaoApi(dadosChave, { limpar: true })
        cy.salvarChaveApi()

        //READ
        cy.validarTabelaIntegracoes(dadosChave, 'Ativada', 'Criação')
        cy.editarChave(dadosChave)

        let dadosParaValidar = { ...nomeCompleto, ...dadosChave, ...valorChaveApi}
        cy.validarDadosIntegracoes(dadosParaValidar)

        //UPDATE
        cy.editarChave(dadosChave, dadosChaveEditada, nomeCompleto, { limpar: true })
        cy.validarChave(dadosChaveEditada, 'Ativada', 'Criação')
        cy.alterarSituacaoChave(dadosChaveEditada, 'Desativar')
        cy.validarChave(dadosChaveEditada, 'Desativada', 'Criação')

        //DELETE
        cy.excluirChave(dadosChaveEditada)
        cy.validarChave(dadosChaveEditada, 'Desativada', 'Exclusão')
    })
})