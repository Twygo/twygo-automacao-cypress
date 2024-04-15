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
        // Ativa o tratamento de exceção não capturada especificamente para este teste
		Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
        
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
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})

    /** DOCUMENTAÇÃO:
     * @name
     * 1. CRUD biblioteca "Em companhia"
     * 
     * @description
     * Testa a criação, leitura, atualização e exclusão de uma biblioteca com o canal "Em companhia".
     * 
     * @steps
     * 1. Cria uma biblioteca com o canal "Em companhia"
     * 2. Realiza a leitura dos dados da biblioteca
     * 3. Edita a biblioteca
     * 4. Realiza a leitura dos dados da biblioteca editada
     * 5. Exclui a biblioteca
     * 
     * @expected
     * Espera-se que a biblioteca seja criada, editada e excluída com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Biblioteca, CRUD
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     * @since 1.0.0
     */
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

    /** DOCUMENTAÇÃO:
     * @name
     * 2. CRUD biblioteca "Aberto"
     * 
     * @description
     * Testa a criação, leitura, atualização e exclusão de uma biblioteca com o canal "Aberto".
     * 
     * @steps
     * 1. Cria uma biblioteca com o canal "Aberto"
     * 2. Realiza a leitura dos dados da biblioteca
     * 3. Edita a biblioteca
     * 4. Realiza a leitura dos dados da biblioteca editada
     * 5. Exclui a biblioteca
     * 
     * @expected
     * Espera-se que a biblioteca seja criada, editada e excluída com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Biblioteca, CRUD
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     * @since 1.0.0
     */
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

    /** DOCUMENTAÇÃO:
     * @name
     * 3. CRUD biblioteca "Outros"
     * 
     * @description
     * Testa a criação, leitura, atualização e exclusão de uma biblioteca com o canal "Outros".
     * 
     * @steps
     * 1. Cria uma biblioteca com o canal "Outros"
     * 2. Realiza a leitura dos dados da biblioteca
     * 3. Edita a biblioteca
     * 4. Realiza a leitura dos dados da biblioteca editada
     * 5. Exclui a biblioteca
     * 
     * @expected
     * Espera-se que a biblioteca seja criada, editada e excluída com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Biblioteca, CRUD
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     * @since 1.0.0
     */
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

    /** DOCUMENTAÇÃO:
     * @name
     * 4. CRUD biblioteca sem canal
     * 
     * @description
     * Testa a criação, leitura, atualização e exclusão de uma biblioteca sem canal.
     * 
     * @steps
     * 1. Cria uma biblioteca sem canal
     * 2. Realiza a leitura dos dados da biblioteca
     * 3. Edita a biblioteca
     * 4. Realiza a leitura dos dados da biblioteca editada
     * 5. Exclui a biblioteca
     * 
     * @expected
     * Espera-se que a biblioteca seja criada, editada e excluída com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Biblioteca, CRUD
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     * @since 1.0.0
     */
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


