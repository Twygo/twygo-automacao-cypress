///reference types="cypress" />
import { faker } from "@faker-js/faker"

describe('Configurações > Organização', () => {
    const formDadosDefault = {
        nome: Cypress.env('orgName'),
        descricao: '',
        informacoesGerais: '',
        resumoIndexacao: '',
        cep: '',
        endereco: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: '',
        telefone: '(45) 99999-9999',
        email: Cypress.env('login'),
        site: '',
        converterEscalaBranco: false,
        personalizarLinkLogotipo: false,
        linkRedirecionamento: '',
        botaoContato: '',
        usarGestaoCompetencias: false,
        ativarGamificacao: true,
        visualizacao: 'Privada',
        abaPortfolio: false,
        abaAgenda: false,
        abaParceiros: false,
        abaSobre: false,
        abaPlanos: false,
        listaEmpresas: '',
        nrColaboradores: '',
        ramoAtuacao: '',
        cargo: ''
    }

    before(() => {
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        //Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'"
        ])
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it('1. CRUD aba Dados', () => {
        // Massa de dados
        const dados = {
            nome: Cypress.env('orgName'),
            descricao: '',
            informacoesGerais: '',
            resumoIndexacao: '',
            cep: '',
            endereco: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            pais: '',
            telefone: '(45) 99999-9999',
            email: Cypress.env('login'),
            site: '',
            converterEscalaBranco: false,
            personalizarLinkLogotipo: false,
            linkRedirecionamento: '',
            botaoContato: '',
            usarGestaoCompetencias: false,
            ativarGamificacao: true,
            visualizacao: 'Privada',
            abaPortfolio: false,
            abaAgenda: false,
            abaParceiros: false,
            abaSobre: false,
            abaPlanos: false,
            listaEmpresas: '',
            nrColaboradores: '',
            ramoAtuacao: '',
            cargo: ''
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.acessarPgConfigOrganizacao('dados')
    })

    it('2. CRUD aba Customizações', () => {
        // Massa de dados
        const dados = {
            nome: Cypress.env('orgName'),
            descricao: '',
            informacoesGerais: '',
            resumoIndexacao: '',
            cep: '',
            endereco: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            pais: '',
            telefone: '(45) 99999-9999',
            email: Cypress.env('login'),
            site: '',
            converterEscalaBranco: false,
            personalizarLinkLogotipo: false,
            linkRedirecionamento: '',
            botaoContato: '',
            usarGestaoCompetencias: false,
            ativarGamificacao: true,
            visualizacao: 'Privada',
            abaPortfolio: false,
            abaAgenda: false,
            abaParceiros: false,
            abaSobre: false,
            abaPlanos: false,
            listaEmpresas: '',
            nrColaboradores: '',
            ramoAtuacao: '',
            cargo: ''
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.acessarPgConfigOrganizacao('customizacoes')
    })

    it('3. CRUD aba Certificado', () => {
        // Massa de dados
        const dados = {
            nome: Cypress.env('orgName'),
            descricao: '',
            informacoesGerais: '',
            resumoIndexacao: '',
            cep: '',
            endereco: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            pais: '',
            telefone: '(45) 99999-9999',
            email: Cypress.env('login'),
            site: '',
            converterEscalaBranco: false,
            personalizarLinkLogotipo: false,
            linkRedirecionamento: '',
            botaoContato: '',
            usarGestaoCompetencias: false,
            ativarGamificacao: true,
            visualizacao: 'Privada',
            abaPortfolio: false,
            abaAgenda: false,
            abaParceiros: false,
            abaSobre: false,
            abaPlanos: false,
            listaEmpresas: '',
            nrColaboradores: '',
            ramoAtuacao: '',
            cargo: ''
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.acessarPgConfigOrganizacao('certificado')
    })

    it('4. CRUD aba Integrações', () => {
        // Massa de dados
        const dados = {
            nome: Cypress.env('orgName'),
            descricao: '',
            informacoesGerais: '',
            resumoIndexacao: '',
            cep: '',
            endereco: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            pais: '',
            telefone: '(45) 99999-9999',
            email: Cypress.env('login'),
            site: '',
            converterEscalaBranco: false,
            personalizarLinkLogotipo: false,
            linkRedirecionamento: '',
            botaoContato: '',
            usarGestaoCompetencias: false,
            ativarGamificacao: true,
            visualizacao: 'Privada',
            abaPortfolio: false,
            abaAgenda: false,
            abaParceiros: false,
            abaSobre: false,
            abaPlanos: false,
            listaEmpresas: '',
            nrColaboradores: '',
            ramoAtuacao: '',
            cargo: ''
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.acessarPgConfigOrganizacao('integracoes')
    })

    it('5. CRUD aba Termos', () => {
        // Massa de dados
        const dados = {
            nome: Cypress.env('orgName'),
            descricao: '',
            informacoesGerais: '',
            resumoIndexacao: '',
            cep: '',
            endereco: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            pais: '',
            telefone: '(45) 99999-9999',
            email: Cypress.env('login'),
            site: '',
            converterEscalaBranco: false,
            personalizarLinkLogotipo: false,
            linkRedirecionamento: '',
            botaoContato: '',
            usarGestaoCompetencias: false,
            ativarGamificacao: true,
            visualizacao: 'Privada',
            abaPortfolio: false,
            abaAgenda: false,
            abaParceiros: false,
            abaSobre: false,
            abaPlanos: false,
            listaEmpresas: '',
            nrColaboradores: '',
            ramoAtuacao: '',
            cargo: ''
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.acessarPgConfigOrganizacao('termos')
    })

    it('6. CRUD aba Url Webhooks', () => {
        // Massa de dados
        const dados = {
            nome: Cypress.env('orgName'),
            descricao: '',
            informacoesGerais: '',
            resumoIndexacao: '',
            cep: '',
            endereco: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            pais: '',
            telefone: '(45) 99999-9999',
            email: Cypress.env('login'),
            site: '',
            converterEscalaBranco: false,
            personalizarLinkLogotipo: false,
            linkRedirecionamento: '',
            botaoContato: '',
            usarGestaoCompetencias: false,
            ativarGamificacao: true,
            visualizacao: 'Privada',
            abaPortfolio: false,
            abaAgenda: false,
            abaParceiros: false,
            abaSobre: false,
            abaPlanos: false,
            listaEmpresas: '',
            nrColaboradores: '',
            ramoAtuacao: '',
            cargo: ''
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.acessarPgConfigOrganizacao('urlWebhooks')
    })
})