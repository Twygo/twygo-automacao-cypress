///reference types="cypress" />
import estruturaAtividades from "../../support/pageObjects/estruturaAtividades"
import { getAuthToken } from '../../support/authHelper'

describe('Recalcular Progresso', () => {   
    const tipoConteudo = 'curso'

    const dadosOrg = {
        link: 'automacao-karla.twygoead.com',
        login: '',
        senha: '',
        orgId: 21654
    }

    before(() => {
        // Sobrescrever as variáveis de ambiente com os dados temporários
        Cypress.config('baseUrl', `https://${dadosOrg.link}`)
        Cypress.env('login', dadosOrg.login)
        Cypress.env('password', dadosOrg.senha)
        Cypress.env('orgId', dadosOrg.orgId)

        // Obter o token de autenticação
        getAuthToken()
    })
        
    it.skip('Recalcular Progresso', () => {
        cy.visit('/users/login')
        cy.login(dadosOrg.login, dadosOrg.senha)
        cy.alterarPerfil('administrador')

        cy.listaCursoViaApi().then((listaCursos) => {
            const conteudos = listaCursos

            cy.wrap(conteudos).each((conteudo) => {
                cy.pesquisarConteudo(conteudo.name)
                cy.addAtividadeConteudo(conteudo.name, tipoConteudo)
                estruturaAtividades.recalcularProgresso()
                estruturaAtividades.confirmarRecalcularProgresso()
       
                cy.get('#page-breadcrumb')
                    .contains('Lista de conteúdos')
                    .should('be.visible')
            })
        })
    })
})