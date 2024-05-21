/// reference types="cypress" />
import { faker, fakerPT_BR } from '@faker-js/faker'

describe('Criar organização "Trial"', () => {
    let senha

    before(() => {
        cy.fixture('labels').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "Unexpected token 'else'",    // Chrome
            "unexpected token: identifier"    // Firefox
        ], { ignoreScriptErrors: true })

        // Defina a URL base
        const baseUrl = Cypress.env('baseUrlPadrao')
        Cypress.config('baseUrl', baseUrl)
        
        // Gerar senha para o usuário
        senha = faker.internet.password()
    })

    it('1. CRUD trial treinamento de colaboradores', () => {
        // Massa de dados
        const seusDados = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Estudante',
            departamento: 'Atendimento / Assistência / CS',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

    	cy.visit('/users/login')

        // Clica no botão "Registre-se"
        cy.get('#register_button')
            .click()

        // Valida página do trial
        cy.url()
            .should('include', '/new/register')

        cy.contains('h1.chakra-heading', 'Bem vindo a')
            .should('be.visible')

        cy.contains('h2.chakra-heading', 'Preparado para começar essa nova jornada?')
            .should('be.visible')

        cy.contains('p.chakra-text', 'Comece informando seus dados para gente.')

        
        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDados)

        // Preenche formulário "Dados da empresa"
        const dadosEmpresa = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Manufatura / Indústria',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresa, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUso = {
            objetivo: 'Treinamento de colaboradores',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUso)

        // Preenche formulário "Usuários"
        const usuarios = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
        }

        cy.log(`Quantidade de pessoas: ${usuarios.quantidadePessoas}`)
        cy.preencherDadosTrial(usuarios)
        cy.validarDadosTrial(usuarios)

        // Preenche formulário "Login e senha"
        const loginSenha = {
            proximoStep3: true,
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenha)
    })
})