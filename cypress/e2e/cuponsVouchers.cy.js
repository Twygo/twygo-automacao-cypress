///reference types="cypress" />
import { faker, fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'
import { gerarData } from '../support/utilsHelper'

describe('Cupons', () => {
    let nomeConteudo1, nomeConteudo2, situacaoCurso, nomeTesteAtual, listaConteudos, tipoDesconto, nomeDesconto, codigoDesconto
    
    before(() => {
        cy.fixture('labels').then((labels) => {
            Cypress.env('labels', labels)
        })

        // Define o tipo de desconto
        tipoDesconto = 'Cupom'
    })

    beforeEach(function() {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",       // Chrome
            "unexpected token: identifier"     // Firefox
        ])

        // Gera um nome aleatório para o conteúdo e para o nome e código do desconto
        nomeConteudo1 = faker.commerce.productName()
        nomeConteudo2 = faker.commerce.productName()
        nomeDesconto = faker.word.words(1)
        codigoDesconto = `${(tipoDesconto).toUpperCase()}-${(nomeDesconto).toUpperCase().trim().replace(' ', '')}${faker.number.int({ max: 100 })}`

        // Captura o nome do teste atual
        nomeTesteAtual = this.currentTest.title

        // Excluir todos os cursos e trilhas
        getAuthToken()
        cy.excluirCursoViaApi()

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
		
        listaConteudos = []
		cy.listaConteudo('trilha', listaConteudos)
		cy.excluirConteudo(null, 'trilha', listaConteudos)

        // Excluir todos os cupons e vouchers
        cy.acessarPgConfigCobrancaInscricao('cuponsVouchers')
        cy.excluirTodosCuponsVouchers()

        // Define situação do curso com base no nome do teste atual
        if (nomeTesteAtual.includes('liberado')) {
            situacaoCurso = 1
        } else if (nomeTesteAtual.includes('suspenso')) {
            situacaoCurso = 2
        } else if (nomeTesteAtual.includes('em desenvolvimento')) {
            situacaoCurso = 0
        } else {
            cy.log('Situação do curso inválida, utilize "liberado", "suspenso" ou "em desenvolvimento"')
            return
        }

        // Massa de dados para criar um curso
        let body = {
            name: nomeConteudo1,
            description: faker.lorem.sentence(5),
            situation: situacaoCurso
        }

        // Cria um novo curso via API
        cy.criarCursoViaApi(body)

        // Massa de dados para criar outro curso
        body = {
            name: nomeConteudo2,
            description: faker.lorem.sentence(5),
            situation: situacaoCurso
        }
        
        cy.criarCursoViaApi(body)        
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })
    
    it('1. CRUD cupom associado a um curso liberado', () => {
        // Massa de dados
        const dados = {
            nome: nomeDesconto,
            codigo: codigoDesconto,
            valor: faker.number.int({ min: 1, max: 100 }),
            validade: gerarData(0, 6, 0, 'YYYY-MM-DD')
        }

        // CREATE
        cy.log('## CREATE ##')
        cy.adicionarCupomVoucher(tipoDesconto)
        cy.preencherDadosCupomVoucher(dados, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo1, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto)     //ok até aqui

        // READ
        cy.log('## READ ##')

        // UPDATE
        cy.log('## UPDATE ##')

        // DELETE
        cy.log('## DELETE ##')
        
    })
})