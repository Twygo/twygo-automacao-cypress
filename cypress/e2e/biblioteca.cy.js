import 'cypress-real-events/support'
import { fakerPT_BR } from '@faker-js/faker'

describe('Biblioteca', () => {  
    let nome, tipoConteudo, listaConteudos

    // Campos e dados default do formulário de catálogo
    let formularioBiblioteca = {
        nome: '',
        descricao: '',
        canal: ''
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
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier",    // Firefox
            "Cannot read properties of undefined (reading 'replace')" // Chrome
        ], { ignoreScriptErrors: true})   
        
        //Define o tipo de conteúdo
        tipoConteudo = 'biblioteca'

        // Gera um nome aleatório para a biblioteca
        nome = fakerPT_BR.commerce.productName()

        // Acessa página de biblioteca e gera uma lista com os conteúdos para serem excluídos
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgBiblioteca()
        
        listaConteudos = []
        cy.listaConteudo(tipoConteudo, listaConteudos)
        cy.excluirConteudo(null, tipoConteudo, listaConteudos)
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it('1. CRUD biblioteca "Em companhia"', () => {
        // Massa de dados para criação da biblioteca
        const dados = {
            nome: nome,
            descricao: fakerPT_BR.lorem.paragraph(),
            canal: 'Em companhia'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.addConteudo(tipoConteudo)
        cy.preencherDadosBiblioteca(dados, { limpar: true } )
        cy.salvarConteudo(dados.nome, tipoConteudo)

        // READ
        cy.log('## READ ##')

        cy.editarConteudo(dados.nome, tipoConteudo)

        let dadosParaValidar = { ...formularioBiblioteca, ...dados }
        cy.validarDadosBiblioteca(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const novosDados = {
            nome: fakerPT_BR.commerce.productName(),
            descricao: `Edição da descrição da biblioteca: ${fakerPT_BR.lorem.paragraph()}`,
            canal: 'Aberto'
        }

        cy.preencherDadosBiblioteca(novosDados, { limpar: true } )
        cy.salvarConteudo(novosDados.nome, tipoConteudo)

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        cy.editarConteudo(novosDados.nome, tipoConteudo)

        dadosParaValidar = { ...dadosParaValidar, ...novosDados }
        cy.validarDadosBiblioteca(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        cy.cancelarFormularioConteudo(tipoConteudo)
        cy.excluirConteudo(novosDados.nome, tipoConteudo)
    })

    it('2. CRUD biblioteca "Aberto"', () => {
        // Massa de dados para criação da biblioteca
        const dados = {
            nome: nome,
            descricao: fakerPT_BR.lorem.paragraph(),
            canal: 'Aberto'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.addConteudo(tipoConteudo)
        cy.preencherDadosBiblioteca(dados, { limpar: true } )
        cy.salvarConteudo(dados.nome, tipoConteudo)

        // READ
        cy.log('## READ ##')

        cy.editarConteudo(dados.nome, tipoConteudo)

        let dadosParaValidar = { ...formularioBiblioteca, ...dados }
        cy.validarDadosBiblioteca(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const novosDados = {
            nome: fakerPT_BR.commerce.productName(),
            descricao: `Edição da descrição da biblioteca: ${fakerPT_BR.lorem.paragraph()}`,
            canal: 'Outros'
        }

        cy.preencherDadosBiblioteca(novosDados, { limpar: true } )
        cy.salvarConteudo(novosDados.nome, tipoConteudo)

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        cy.editarConteudo(novosDados.nome, tipoConteudo)

        dadosParaValidar = { ...dadosParaValidar, ...novosDados }
        cy.validarDadosBiblioteca(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        cy.cancelarFormularioConteudo(tipoConteudo)
        cy.excluirConteudo(novosDados.nome, tipoConteudo)
    })

    it('3. CRUD biblioteca "Outros"', () => {
        // Massa de dados para criação da biblioteca
        const dados = {
            nome: nome,
            descricao: fakerPT_BR.lorem.paragraph(),
            canal: 'Outros'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.addConteudo(tipoConteudo)
        cy.preencherDadosBiblioteca(dados, { limpar: true } )
        cy.salvarConteudo(dados.nome, tipoConteudo)

        // READ
        cy.log('## READ ##')

        cy.editarConteudo(dados.nome, tipoConteudo)

        let dadosParaValidar = { ...formularioBiblioteca, ...dados }
        cy.validarDadosBiblioteca(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const novosDados = {
            nome: fakerPT_BR.commerce.productName(),
            descricao: `Edição da descrição da biblioteca: ${fakerPT_BR.lorem.paragraph()}`,
            canal: ''
        }

        cy.preencherDadosBiblioteca(novosDados, { limpar: true } )
        cy.salvarConteudo(novosDados.nome, tipoConteudo)

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        cy.editarConteudo(novosDados.nome, tipoConteudo)

        dadosParaValidar = { ...dadosParaValidar, ...novosDados }
        cy.validarDadosBiblioteca(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        cy.cancelarFormularioConteudo(tipoConteudo)
        cy.excluirConteudo(novosDados.nome, tipoConteudo)
    })

    it('4. CRUD biblioteca sem canal', () => {
        // Massa de dados para criação da biblioteca
        const dados = {
            nome: nome,
            descricao: fakerPT_BR.lorem.paragraph()
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.addConteudo(tipoConteudo)
        cy.preencherDadosBiblioteca(dados, { limpar: true } )
        cy.salvarConteudo(dados.nome, tipoConteudo)

        // READ
        cy.log('## READ ##')

        cy.editarConteudo(dados.nome, tipoConteudo)

        let dadosParaValidar = { ...formularioBiblioteca, ...dados }
        cy.validarDadosBiblioteca(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const novosDados = {
            nome: fakerPT_BR.commerce.productName(),
            descricao: `Edição da descrição da biblioteca: ${fakerPT_BR.lorem.paragraph()}`,
            canal: 'Em companhia'
        }

        cy.preencherDadosBiblioteca(novosDados, { limpar: true } )
        cy.salvarConteudo(novosDados.nome, tipoConteudo)

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        cy.editarConteudo(novosDados.nome, tipoConteudo)

        dadosParaValidar = { ...dadosParaValidar, ...novosDados }
        cy.validarDadosBiblioteca(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        cy.cancelarFormularioConteudo(tipoConteudo)
        cy.excluirConteudo(novosDados.nome, tipoConteudo)
    })
})


