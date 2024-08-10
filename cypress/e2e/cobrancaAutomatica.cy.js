/// reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('Cobrança de inscrição', () => {

    beforeEach(() => {
        // Desabilitar cobrança de inscrições
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.resetCobrancaAutomatica()
    })

    it('1. CRUD cobrança automática Asaas alterando dados', () => {
        // Massa de dados
        const dados = {
            radioAsaas: true, 
            chaveAsaas: Cypress.env('chaveAsaas1'),
            site: Cypress.env('baseUrlPersonalizado'),
            checkPixBoleto: true, 
            checkCartao: false,
            vencimentoBoleto: faker.number.int({ min: 1, max: 30 })
        }
        
        // CREATE
        cy.log('## CREATE ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: true })

        cy.reload()
        cy.preencherDadosCobrancaAutomatica(dados, { limpar: true })
        cy.salvarCobrancaAutomatica()

        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.validarDadosCobrancaAutomatica(dados)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados
        const dadosUpdate = {
            chaveAsaas: Cypress.env('chaveAsaas2'),
            site: Cypress.env('baseUrlPersonalizado'),
            checkCartao: true,
            checkPixBoleto: false
        }

        cy.preencherDadosCobrancaAutomatica(dadosUpdate, { limpar: true })
        cy.salvarCobrancaAutomatica()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.validarDadosCobrancaAutomatica(dadosUpdate)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Não é possível remover dados de cobrança, apenas desabilitar a cobrança automática de inscrições')

        cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: false })
    })

    it('2. CRUD cobrança automática Rede alterando dados', () => {
        // Massa de dados
        const dados = {
            radioErede: true, 
            pvErede: Cypress.env('pvErede1'),
            chaveErede: Cypress.env('chaveErede1')
        }
        
        // CREATE
        cy.log('## CREATE ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: true })

        cy.reload()
        cy.preencherDadosCobrancaAutomatica(dados, { limpar: true })
        cy.salvarCobrancaAutomatica()

        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.validarDadosCobrancaAutomatica(dados)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados
        const dadosUpdate = {
            pvErede: Cypress.env('pvErede2'),
            chaveErede: Cypress.env('chaveErede2')
        }

        cy.preencherDadosCobrancaAutomatica(dadosUpdate, { limpar: true })
        cy.salvarCobrancaAutomatica()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.validarDadosCobrancaAutomatica(dadosUpdate)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Não é possível remover dados de cobrança, apenas desabilitar a cobrança automática de inscrições')

        cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: false })
    })

    it('3. CRUD cobrança automática Asaas alterando para Rede', () => {
        // Massa de dados
        const dados = {
            radioAsaas: true, 
            chaveAsaas: Cypress.env('chaveAsaas1'),
            site: Cypress.env('baseUrlPersonalizado'),
            checkPixBoleto: true, 
            checkCartao: false,
            vencimentoBoleto: faker.number.int({ min: 1, max: 30 })
        }
        
        // CREATE
        cy.log('## CREATE ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: true })

        cy.reload()
        cy.preencherDadosCobrancaAutomatica(dados, { limpar: true })
        cy.salvarCobrancaAutomatica()

        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.validarDadosCobrancaAutomatica(dados)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados
        const dadosUpdate = {
            radioErede: true, 
            pvErede: Cypress.env('pvErede2'),
            chaveErede: Cypress.env('chaveErede2')
        }

        cy.preencherDadosCobrancaAutomatica(dadosUpdate, { limpar: true })
        cy.salvarCobrancaAutomatica()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.validarDadosCobrancaAutomatica(dadosUpdate)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Não é possível remover dados de cobrança, apenas desabilitar a cobrança automática de inscrições')

        cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: false })
    })

    it('4. CRUD cobrança automática Rede alterando para Asaas', () => {
        // Massa de dados
        const dados = {
            radioErede: true, 
            pvErede: Cypress.env('pvErede2'),
            chaveErede: Cypress.env('chaveErede2')
        }
        
        // CREATE
        cy.log('## CREATE ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: true })

        cy.reload()
        cy.preencherDadosCobrancaAutomatica(dados, { limpar: true })
        cy.salvarCobrancaAutomatica()

        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.validarDadosCobrancaAutomatica(dados)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados
        const dadosUpdate = {
            radioAsaas: true, 
            chaveAsaas: Cypress.env('chaveAsaas1'),
            site: Cypress.env('baseUrlPersonalizado'),
            checkPixBoleto: true, 
            checkCartao: false,
            vencimentoBoleto: faker.number.int({ min: 1, max: 30 })
        }

        cy.preencherDadosCobrancaAutomatica(dadosUpdate, { limpar: true })
        cy.salvarCobrancaAutomatica()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgConfigCobrancaInscricao()
        cy.validarDadosCobrancaAutomatica(dadosUpdate)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Não é possível remover dados de cobrança, apenas desabilitar a cobrança automática de inscrições')

        cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: false })
    })
})
