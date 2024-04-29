///reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import formQuestionarios from '../support/pageObjects/formQuestionarios'

describe('Questionário', () => {
    const timeoutPadrao = 5000
    const formulario = new formQuestionarios()

    let nomeQuestionario, nomeCategoria1, nomeCategoria2, addCategoria1, addCategoria2, categoriasAtualizadas, listaQuestionarios
    
    // Campos e dados default do formulário de questionário
    const formQuestionarioDefault = {
        nome: '',
        tipoProva: true,
        tipoPesquisa: false,
        comentarioAluno: false,
        parecerInstrutor: false,
        nomeCategoria1: 'Categorias 1',
        nomeCategoria2: 'Categorias 2',
        addCategoria1: '',
        addCategoria2: ''
    }

    before(() => {
		// Carrega os labels do arquivo JSON
		cy.fixture('labels.json').then((labels) => {
			Cypress.env('labels', labels)
		})
	})

    beforeEach(() => { 
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'"
        ])
        
        // Gerar um nome aleatório para o questionário
        nomeQuestionario = fakerPT_BR.commerce.productName()
        nomeCategoria1 = 'Assunto'
        nomeCategoria2 = 'Dificuldade'

        // Inicializa o array de categorias
        addCategoria1 = ['Atualidades', 'Entretenimento', 'Esportes', 'Tecnologia']
        addCategoria2 = ['Difícil', 'Fácil', 'Médio']
        categoriasAtualizadas = []
        
        // Acessar a página de questionários, listar e excluir todos os questionários antes do teste
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgQuestionarios()

        listaQuestionarios = []
        cy.listaQuestionarios(listaQuestionarios)
        cy.excluirQuestionarios(null, listaQuestionarios)
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it('1. CRUD questionário tipo "Prova" com comentário aluno e parecer instrutor', () => {
        // Massa de dados para criação de questionário
        const dados = {
            nome: nomeQuestionario,
            tipoProva: true,
            tipoPesquisa: false,
            comentarioAluno: true,
            parecerInstrutor: true,
            nomeCategoria1: nomeCategoria1,
            nomeCategoria2: nomeCategoria2,
            addCategoria1: addCategoria1,
            addCategoria2: addCategoria2
        }

        // CREATE
        cy.log('## CREATE ##')

        formulario.addQuestionario()
        cy.preencherDadosQuestionario(dados, { limpar: true })
        cy.salvarQuestionario(dados.nome)

        // READ
        cy.log('## READ ##')

        cy.editarQuestionario(dados.nome)

        let dadosParaValidar = { ...formQuestionarioDefault, ...dados }
        cy.validarDadosQuestionario(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            nome: fakerPT_BR.commerce.productName(),
            tipoProva: false,
            tipoPesquisa: true,
            comentarioAluno: false,
            parecerInstrutor: false
        }

        cy.preencherDadosQuestionario(dadosUpdate, { limpar: true })
        cy.salvarQuestionario(dadosUpdate.nome)

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        cy.editarQuestionario(dadosUpdate.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosQuestionario(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        formulario.voltarQuestionario()
        cy.excluirQuestionarios(dadosUpdate.nome)
    })

    it('2. CRUD questionário tipo "Pesquisa" com comentário aluno e parecer instrutor', () => {
        // Massa de dados para criação de questionário
        const dados = {
            nome: nomeQuestionario,
            tipoProva: false,
            tipoPesquisa: true,
            comentarioAluno: true,
            parecerInstrutor: true,
            nomeCategoria1: nomeCategoria1,
            nomeCategoria2: nomeCategoria2,
            addCategoria1: addCategoria1,
            addCategoria2: addCategoria2
        }

        // CREATE
        cy.log('## CREATE ##')

        formulario.addQuestionario()
        cy.preencherDadosQuestionario(dados, { limpar: true })
        cy.salvarQuestionario(dados.nome)

        // READ
        cy.log('## READ ##')

        cy.editarQuestionario(dados.nome)

        let dadosParaValidar = { ...formQuestionarioDefault, ...dados }
        cy.validarDadosQuestionario(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            nome: fakerPT_BR.commerce.productName(),
            tipoProva: true,
            tipoPesquisa: false,
            comentarioAluno: false,
            parecerInstrutor: false
        }

        cy.preencherDadosQuestionario(dadosUpdate, { limpar: true })
        cy.salvarQuestionario(dadosUpdate.nome)

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        cy.editarQuestionario(dadosUpdate.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosQuestionario(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        formulario.voltarQuestionario()
        cy.excluirQuestionarios(dadosUpdate.nome)
    })

    it('3. CRUD questionário tipo "Prova" com comentário aluno e sem parecer instrutor', () => {
        // Massa de dados para criação de questionário
        const dados = {
            nome: nomeQuestionario,
            tipoProva: true,
            tipoPesquisa: false,
            comentarioAluno: true,
            parecerInstrutor: false,
            nomeCategoria1: nomeCategoria1,
            nomeCategoria2: nomeCategoria2,
            addCategoria1: addCategoria1,
            addCategoria2: addCategoria2
        }

        // CREATE
        cy.log('## CREATE ##')

        formulario.addQuestionario()
        cy.preencherDadosQuestionario(dados, { limpar: true })
        cy.salvarQuestionario(dados.nome)

        // READ
        cy.log('## READ ##')

        cy.editarQuestionario(dados.nome)

        let dadosParaValidar = { ...formQuestionarioDefault, ...dados }
        cy.validarDadosQuestionario(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            nome: fakerPT_BR.commerce.productName(),
            tipoProva: false,
            tipoPesquisa: true,
            comentarioAluno: false,
            parecerInstrutor: true
        }

        cy.preencherDadosQuestionario(dadosUpdate, { limpar: true })
        cy.salvarQuestionario(dadosUpdate.nome)

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        cy.editarQuestionario(dadosUpdate.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosQuestionario(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        formulario.voltarQuestionario()
        cy.excluirQuestionarios(dadosUpdate.nome)
    })

    it('4. CRUD questionário tipo "Pesquisa" com comentário aluno e sem parecer instrutor', () => {
        // Massa de dados para criação de questionário
        const dados = {
            nome: nomeQuestionario,
            tipoProva: false,
            tipoPesquisa: true,
            comentarioAluno: true,
            parecerInstrutor: false,
            nomeCategoria1: nomeCategoria1,
            nomeCategoria2: nomeCategoria2,
            addCategoria1: addCategoria1,
            addCategoria2: addCategoria2
        }

        // CREATE
        cy.log('## CREATE ##')

        formulario.addQuestionario()
        cy.preencherDadosQuestionario(dados, { limpar: true })
        cy.salvarQuestionario(dados.nome)

        // READ
        cy.log('## READ ##')

        cy.editarQuestionario(dados.nome)

        let dadosParaValidar = { ...formQuestionarioDefault, ...dados }
        cy.validarDadosQuestionario(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            nome: fakerPT_BR.commerce.productName(),
            tipoProva: true,
            tipoPesquisa: false,
            comentarioAluno: false,
            parecerInstrutor: true
        }

        cy.preencherDadosQuestionario(dadosUpdate, { limpar: true })
        cy.salvarQuestionario(dadosUpdate.nome)

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        cy.editarQuestionario(dadosUpdate.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosQuestionario(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        formulario.voltarQuestionario()
        cy.excluirQuestionarios(dadosUpdate.nome)
    })

    it('5. CRUD questionário tipo "Prova" sem comentário aluno e com parecer instrutor', () => {
        // Massa de dados para criação de questionário
        const dados = {
            nome: nomeQuestionario,
            tipoProva: true,
            tipoPesquisa: false,
            comentarioAluno: false,
            parecerInstrutor: true,
            nomeCategoria1: nomeCategoria1,
            nomeCategoria2: nomeCategoria2,
            addCategoria1: addCategoria1,
            addCategoria2: addCategoria2
        }

        // CREATE
        cy.log('## CREATE ##')

        formulario.addQuestionario()
        cy.preencherDadosQuestionario(dados, { limpar: true })
        cy.salvarQuestionario(dados.nome)

        // READ
        cy.log('## READ ##')

        cy.editarQuestionario(dados.nome)

        let dadosParaValidar = { ...formQuestionarioDefault, ...dados }
        cy.validarDadosQuestionario(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            nome: fakerPT_BR.commerce.productName(),
            tipoProva: false,
            tipoPesquisa: true,
            comentarioAluno: true,
            parecerInstrutor: false,
            editarCategoria: 'Atualidades',
            edicaoCategoria: 'Fatos atuais',
            excluirCategoria: 'Entretenimento'
        }

        cy.preencherDadosQuestionario(dadosUpdate, { limpar: true })
        cy.salvarQuestionario(dadosUpdate.nome)

        // READ - UPDATE
        // Atualização do array de categorias
        // Remover a categoria especificada em excluirCategoria
        addCategoria1 = addCategoria1.filter(categoria => categoria !== dadosUpdate.excluirCategoria)

        // Encontrar o índice da categoria especificada em editarCategoria e substituí-la por edicaoCategoria
        const index = addCategoria1.indexOf(dadosUpdate.editarCategoria)
        if (index !== -1) {
            addCategoria1[index] = dadosUpdate.edicaoCategoria
        }
        
        // Ordenar o array resultante em ordem alfabética
        addCategoria1.sort()
                
        cy.log('## READ - UPDATE ##')

        cy.editarQuestionario(dadosUpdate.nome)        
        
        dadosUpdate.addCategoria1 = addCategoria1
        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosQuestionario(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        formulario.voltarQuestionario()
        cy.excluirQuestionarios(dadosUpdate.nome)
    })

    it('6. CRUD questionário tipo "Pesquisa" sem comentário aluno e com parecer instrutor', () => {
        // Massa de dados para criação de questionário
        const dados = {
            nome: nomeQuestionario,
            tipoProva: false,
            tipoPesquisa: true,
            comentarioAluno: false,
            parecerInstrutor: true,
            nomeCategoria1: nomeCategoria1,
            nomeCategoria2: nomeCategoria2,
            addCategoria1: addCategoria1,
            addCategoria2: addCategoria2
        }

        // CREATE
        cy.log('## CREATE ##')

        formulario.addQuestionario()
        cy.preencherDadosQuestionario(dados, { limpar: true })
        cy.salvarQuestionario(dados.nome)

        // READ
        cy.log('## READ ##')

        cy.editarQuestionario(dados.nome)

        let dadosParaValidar = { ...formQuestionarioDefault, ...dados }
        cy.validarDadosQuestionario(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            nome: fakerPT_BR.commerce.productName(),
            tipoProva: true,
            tipoPesquisa: false,
            comentarioAluno: true,
            parecerInstrutor: false,
            editarCategoria: 'Fácil',
            edicaoCategoria: 'Iniciante',
            excluirCategoria: 'Difícil'
        }

        cy.preencherDadosQuestionario(dadosUpdate, { limpar: true })
        cy.salvarQuestionario(dadosUpdate.nome)

        // READ - UPDATE
        // Atualização do array de categorias
        // Remover a categoria especificada em excluirCategoria
        addCategoria2 = addCategoria2.filter(categoria => categoria !== dadosUpdate.excluirCategoria)

        // Encontrar o índice da categoria especificada em editarCategoria e substituí-la por edicaoCategoria
        const index = addCategoria2.indexOf(dadosUpdate.editarCategoria)
        if (index !== -1) {
            addCategoria2[index] = dadosUpdate.edicaoCategoria
        }
        
        // Ordenar o array resultante em ordem alfabética
        addCategoria2.sort()
                
        cy.log('## READ - UPDATE ##')

        cy.editarQuestionario(dadosUpdate.nome)        
        
        dadosUpdate.addCategoria2 = addCategoria2
        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosQuestionario(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        formulario.voltarQuestionario()
        cy.excluirQuestionarios(dadosUpdate.nome)
    })

    it('7. CRUD questionário default ("Prova")', () => {
        // Massa de dados para criação de questionário
        const dados = {
            nome: nomeQuestionario
        }

        // CREATE
        cy.log('## CREATE ##')

        formulario.addQuestionario()
        cy.preencherDadosQuestionario(dados, { limpar: true })
        cy.salvarQuestionario(dados.nome)

        // READ
        cy.log('## READ ##')

        cy.editarQuestionario(dados.nome)

        let dadosParaValidar = { ...formQuestionarioDefault, ...dados }
        cy.validarDadosQuestionario(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            nome: fakerPT_BR.commerce.productName(),
            tipoProva: false,
            tipoPesquisa: true,
            nomeCategoria1: nomeCategoria1,
            nomeCategoria2: nomeCategoria2,
            addCategoria1: addCategoria1,
            addCategoria2: addCategoria2
        }

        cy.preencherDadosQuestionario(dadosUpdate, { limpar: true })
        cy.salvarQuestionario(dadosUpdate.nome)

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        cy.editarQuestionario(dadosUpdate.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosQuestionario(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        formulario.voltarQuestionario()
        cy.excluirQuestionarios(dadosUpdate.nome)
    })
})