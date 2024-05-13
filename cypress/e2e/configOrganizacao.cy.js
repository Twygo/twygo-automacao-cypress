///reference types="cypress" />
import { fakerPT_BR, faker } from "@faker-js/faker"

describe('Configurações > Organização > Dados', () => {
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
        ativarGamificacao: false,
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
        ], { ignoreScriptErrors: true })

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.acessarPgConfigOrganizacao()
        cy.resetConfigOrganizacao('dados')
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it.only('1. CRUD aba Dados', () => {
        // Massa de dados
        const dados = {
            nome: faker.commerce.productName(),
            descricao: faker.lorem.sentence(50),
            informacoesGerais: faker.lorem.sentence(50),
            resumoIndexacao: faker.lorem.sentence(3),
            cep: faker.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            complemento: faker.lorem.sentence(2),
            bairro: faker.lorem.word(),
            cidade: faker.location.city(),
            estado: faker.location.state(),
            pais: faker.location.country(),
            telefone: '(45) 3030-3030',
            email: faker.internet.email(),
            site: faker.internet.url(),
            converterEscalaBranco: true,
            personalizarLinkLogotipo: true,
            linkRedirecionamento: faker.internet.url(),
            botaoContato: faker.lorem.word(),
            usarGestaoCompetencias: true,
            ativarGamificacao: true,
            visualizacao: 'Pública',
            abaPortfolio: true,
            abaAgenda: true,
            abaParceiros: true,
            abaSobre: true,
            abaPlanos: true,
            listaEmpresas: faker.lorem.word(),
            nrColaboradores: faker.number.int({ min: 1, max: 1000 }),
            ramoAtuacao: faker.lorem.word(),
            cargo: faker.person.jobTitle()
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dados, 'dados', { limpar: true })
        cy.salvarConfigOrganizacao()
    })
})

describe('Configurações > Organização > Customizações', () => {
    it('2. CRUD aba Customizações', () => {
        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
    })
})

describe('Configurações > Organização > Certificado', () => {
    it('3. CRUD aba Certificado', () => {
        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
    })
})

describe('Configurações > Organização > Integrações', () => {
    it('4. CRUD aba Integrações', () => {
        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
    })
})

describe('Configurações > Organização > Termos', () => {
    it('5. CRUD aba Termos', () => {
        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
    })
})

describe('Configurações > Organização > Url Webhooks', () => {
    it('6. CRUD aba Url Webhooks', () => {
        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
    })
})