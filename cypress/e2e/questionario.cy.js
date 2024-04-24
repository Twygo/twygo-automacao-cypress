///reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import formQuestionarios from '../support/pageObjects/formQuestionarios'

describe('Questionário', () => {
    const TIMEOUT_PADRAO = 5000
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
    
    /** DOCUMENTAÇÃO:
     * @name
     * 1. CRUD questionário tipo "Prova" com comentário aluno e parecer instrutor
     * 
     * @description
     * Valida o fluxo de criação, leitura, atualização e exclusão de um questionário do tipo "Prova" 
     * com comentário do aluno, com parecer do instrutor e com categorias. A atualização inclui a
     * alteração para o tipo "Pesquisa" e a remoção dos comentários do aluno e do instrutor.
     * 
     * @steps
     * 1. Cria um questionário do tipo "Prova" com comentário do aluno, parecer do instrutor e categorias
     * 2. Valida os dados do questionário criado
     * 3. Atualiza o questionário para o tipo "Pesquisa" e remove os comentários do aluno e do instrutor
     * 4. Valida os dados do questionário atualizado
     * 5. Exclui o questionário
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir o questionário com sucesso.
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
     * Questionário, CRUD, Prova, Pesquisa, Comentário Aluno, Parecer Instrutor
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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

    /** DOCUMENTAÇÃO:
     * @name
     * 2. CRUD questionário tipo "Pesquisa" com comentário aluno e parecer instrutor
     * 
     * @description
     * Valida o fluxo de criação, leitura, atualização e exclusão de um questionário do tipo "Pesquisa"
     * com comentário do aluno, com parecer do instrutor e com categorias. A atualização inclui a
     * alteração para o tipo "Prova" e a remoção dos comentários do aluno e do instrutor.
     * 
     * @steps
     * 1. Cria um questionário do tipo "Pesquisa" com comentário do aluno, parecer do instrutor e categorias
     * 2. Valida os dados do questionário criado
     * 3. Atualiza o questionário para o tipo "Prova" e remove os comentários do aluno e do instrutor
     * 4. Valida os dados do questionário atualizado
     * 5. Exclui o questionário
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir o questionário com sucesso.
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
     * Questionário, CRUD, Prova, Pesquisa, Comentário Aluno, Parecer Instrutor
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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

    /** DOCUMENTAÇÃO:
     * @name
     * 3. CRUD questionário tipo "Prova" com comentário aluno e sem parecer instrutor
     * 
     * @description
     * Valida o fluxo de criação, leitura, atualização e exclusão de um questionário do tipo "Prova"
     * com comentário do aluno e sem parecer do instrutor. A atualização inclui a alteração para o tipo
     * "Pesquisa", a remoção do comentário do aluno e habilita o parecer do instrutor.
     * 
     * @steps
     * 1. Cria um questionário do tipo "Prova" com comentário do aluno, sem parecer do instrutor e com categorias
     * 2. Valida os dados do questionário criado
     * 3. Atualiza o questionário para o tipo "Pesquisa", remove o comentário do aluno e habilita o parecer do instrutor
     * 4. Valida os dados do questionário atualizado
     * 5. Exclui o questionário
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir o questionário com sucesso.
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
     * Questionário, CRUD, Prova, Pesquisa, Comentário Aluno, Parecer Instrutor
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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

    /** DOCUMENTAÇÃO:
     * @name
     * 4. CRUD questionário tipo "Pesquisa" com comentário aluno e sem parecer instrutor
     * 
     * @description
     * Valida o fluxo de criação, leitura, atualização e exclusão de um questionário do tipo "Pesquisa"
     * com comentário do aluno, sem parecer do instrutor e com categorias. A atualização inclui a 
     * alteração para o tipo "Prova", a remoção do comentário do aluno e habilita o parecer do instrutor.
     * 
     * @steps
     * 1. Cria um questionário do tipo "Pesquisa" com comentário do aluno, sem parecer do instrutor e com categorias
     * 2. Valida os dados do questionário criado
     * 3. Atualiza o questionário para o tipo "Prova", remove o comentário do aluno e habilita o parecer do instrutor
     * 4. Valida os dados do questionário atualizado
     * 5. Exclui o questionário
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir o questionário com sucesso.
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
     * Questionário, CRUD, Prova, Pesquisa, Comentário Aluno, Parecer Instrutor
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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

    /** DOCUMENTAÇÃO:
     * @name
     * 5. CRUD questionário tipo "Prova" sem comentário aluno e com parecer instrutor
     * 
     * @description
     * Valida o fluxo de criação, leitura, atualização e exclusão de um questionário do tipo "Prova"
     * sem comentário do aluno, com parecer do instrutor e com categorias. A atualização inclui a 
     * alteração para o tipo "Pesquisa", a inclusão de novas categorias, a remoção de categorias 
     * existentes, desabilitar o parecer do instrutor e habilitar o comentário do aluno.
     * 
     * @steps
     * 1. Cria um questionário do tipo "Prova" sem comentário do aluno, com parecer do instrutor e com categorias
     * 2. Valida os dados do questionário criado
     * 3. Atualiza o questionário para o tipo "Pesquisa", atualiza categoria, remove categoria, desabilita parecer do instrutor e habilita comentário do aluno
     * 4. Valida os dados do questionário atualizado
     * 5. Exclui o questionário
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir o questionário com sucesso.
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
     * Questionário, CRUD, Prova, Pesquisa, Comentário Aluno, Parecer Instrutor
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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

    /** DOCUMENTAÇÃO:
     * @name
     * 6. CRUD questionário tipo "Pesquisa" sem comentário aluno e com parecer instrutor
     * 
     * @description
     * Valida o fluxo de criação, leitura, atualização e exclusão de um questionário do tipo "Pesquisa"
     * sem comentário do aluno, com parecer do instrutor e com categorias. A atualização inclui a
     * alteração para o tipo "Prova", habilita o comentário do aluno, desabilita o parecer do instrutor, 
     * edita algumas categorias e remove outra.
     * 
     * @steps
     * 1. Cria um questionário do tipo "Pesquisa" sem comentário do aluno, com parecer do instrutor e com categorias
     * 2. Valida os dados do questionário criado
     * 3. Atualiza o questionário para o tipo "Prova", habilita o comentário do aluno, desabilita o parecer do instrutor, edita e remove categorias
     * 4. Valida os dados do questionário atualizado
     * 5. Exclui o questionário
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir o questionário com sucesso.
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
     * Questionário, CRUD, Prova, Pesquisa, Comentário Aluno, Parecer Instrutor
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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

    /** DOCUMENTAÇÃO:
     * @name
     * 7. CRUD questionário default ("Prova")
     * 
     * @description
     * Valida o fluxo de criação, leitura, atualização e exclusão de um questionário default ("Prova").
     * 
     * @steps
     * 1. Cria um questionário default ("Prova")
     * 2. Valida os dados do questionário criado
     * 3. Atualiza o questionário default ("Prova")
     * 4. Valida os dados do questionário atualizado
     * 5. Exclui o questionário default ("Prova")
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir o questionário com sucesso.
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
     * Questionário, CRUD, Prova, Pesquisa, Comentário Aluno, Parecer Instrutor
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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