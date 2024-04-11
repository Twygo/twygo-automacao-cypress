/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import formQuestionarios from '../support/pageObjects/formQuestionarios'
import formPerguntas from '../support/pageObjects/formPerguntas'

describe('Perguntas', () => {
    const formulario = new formPerguntas()
    const formQuest = new formQuestionarios()

    let titulo, novoTitulo, tipoPergunta, nomeQuestionario, listaQuestionarios, categorias1, categorias2

    let perguntaDefault = {
        titulo: '',
        descricao: '',
        ordenacao: '1',
        tipoPergunta: 'Única Escolha',
        perguntaDesabilitada: false,
        perguntaObrigatoria: false,
        explicacao: '',
        categoria1: 'Sem Categoria',
        categoria2: 'Sem Categoria',
        resposta1: '',
        resposta2: '',
        radioResposta1: false,
        radioResposta2: false
    }

    before(() => {
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {     
        // Massa de dados para criar questionário
        nomeQuestionario = faker.commerce.productName()
        categorias1 = ['Atualidades', 'Entretenimento', 'Esportes', 'Tecnologia']
        categorias2 = ['Difícil', 'Fácil', 'Médio']

        const dadosQuest = {
            nome: nomeQuestionario,
            nomeCategoria1: 'Assunto',
            nomeCategoria2: 'Dificuldade',
            addCategoria1: categorias1,
            addCategoria2: categorias2  
        }
        
        // Acessar a página de questionários, listar e excluir todos os questionários antes do teste
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgQuestionarios()

        listaQuestionarios = []
        cy.listaQuestionarios(listaQuestionarios)
        cy.excluirQuestionarios(null, listaQuestionarios)

        // Criar questionário
        formQuest.addQuestionario()
        cy.preencherDadosQuestionario(dadosQuest)
        cy.salvarQuestionario(dadosQuest.nome)

        // Gera um título aleatório para a pergunta
        titulo = faker.commerce.productName()
        novoTitulo = faker.commerce.productName()
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 1. CRUD pergunta do tipo "Texto"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Texto", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória, 
     * explicação, categoria 1 e categoria 2.
     * 
     */
    it('1. CRUD pergunta do tipo "Texto"', () => {
        // Massa de dados para criar pergunta do tipo "Texto"
        const dados = {
            titulo: titulo,
            descricao: faker.lorem.paragraph(),
            ordenacao: faker.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Texto',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: faker.lorem.sentence(),
            categoria1: 'Esportes',
            categoria2: 'Fácil'
        }

        // CREATE
        cy.log('## CREATE ##')
        
        cy.acessarPerguntasQuestionario(nomeQuestionario)
        formulario.addPergunta()

        // Preencher os campos da pergunta
        cy.preencherDadosPergunta(dados, { limpar: true })
        cy.salvarPergunta(dados.descricao, 1)

        // READ
        cy.log('## READ ##')
        cy.validarDadosPergunta(dados)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para atualizar pergunta do tipo "Texto"
        const dadosUpdate = {
            titulo: novoTitulo,
            descricao: faker.lorem.paragraph(),
            ordenacao: faker.number.int({ min: 1, max: 10 }),
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: faker.lorem.sentence(),
            categoria1: 'Tecnologia',
            categoria2: 'Difícil'
        }

        cy.expandirPergunta(dados.descricao)
        cy.preencherDadosPergunta(dadosUpdate, { limpar: true })
        cy.salvarEdicaoPergunta(dados.descricao, dadosUpdate.descricao)

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')
                
        cy.validarDadosPergunta(dadosUpdate)

        // DELETE
        cy.log('## DELETE ##')

        cy.expandirPergunta(dadosUpdate.descricao)
        cy.excluirPergunta(dadosUpdate.descricao)     
    })
})
