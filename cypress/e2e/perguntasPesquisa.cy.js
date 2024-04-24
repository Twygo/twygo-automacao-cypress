/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import formQuestionarios from '../support/pageObjects/formQuestionarios'
import formPerguntas from '../support/pageObjects/formPerguntas'

describe('Perguntas', () => {
    const formulario = new formPerguntas()
    const formQuest = new formQuestionarios()

    let titulo, novoTitulo, tipoPergunta, nomeQuestionario, listaQuestionarios, categorias1, categorias2

    before(() => {
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {     
        // Massa de dados para criar questionário
        nomeQuestionario = fakerPT_BR.commerce.productName()
        categorias1 = ['Atualidades', 'Entretenimento', 'Esportes', 'Tecnologia']
        categorias2 = ['Difícil', 'Fácil', 'Médio']

        const dadosQuest = {
            nome: nomeQuestionario,
            tipoPesquisa: true,
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
        titulo = fakerPT_BR.commerce.productName()
        novoTitulo = fakerPT_BR.commerce.productName()
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 1. CRUD pergunta do tipo "Texto"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Texto", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória, 
     * explicação, categoria 1 e categoria 2.
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização (mantendo o tipo de pergunta)
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Texto" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Texto
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('1. CRUD pergunta do tipo "Texto"', () => {
        // Massa de dados para criar pergunta do tipo "Texto"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Texto',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
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
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence(),
            categoria1: 'Tecnologia',
            categoria2: 'Difícil'
        }

        cy.expandirPergunta(dados.descricao)
        cy.preencherDadosPergunta(dadosUpdate, { limpar: true })
        cy.salvarEdicaoPergunta(dados.descricao, dadosUpdate.descricao)

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')
                
        let dadosParaValidar = { ...dados, ...dadosUpdate }
        cy.validarDadosPergunta(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        cy.expandirPergunta(dadosUpdate.descricao)
        cy.excluirPergunta(dadosUpdate.descricao)     
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 2. CRUD pergunta do tipo "Arquivo"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Arquivo", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória,
     * explicação, categoria 1 e categoria 2.
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização (mantendo o tipo de pergunta)
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Arquivo" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Arquivo
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('2. CRUD pergunta do tipo "Arquivo"', () => {
        // Massa de dados para criar pergunta do tipo "Arquivo"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Arquivo',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
            categoria1: 'Atualidades',
            categoria2: 'Médio'
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

        // Massa de dados para atualizar pergunta do tipo "Arquivo"
        const dadosUpdate = {
            titulo: novoTitulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence(),
            categoria1: 'Entretenimento',
            categoria2: 'Fácil'
        }

        cy.expandirPergunta(dados.descricao)
        cy.preencherDadosPergunta(dadosUpdate, { limpar: true })
        cy.salvarEdicaoPergunta(dados.descricao, dadosUpdate.descricao)

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')
                
        let dadosParaValidar = { ...dados, ...dadosUpdate }
        cy.validarDadosPergunta(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        cy.expandirPergunta(dadosUpdate.descricao)
        cy.excluirPergunta(dadosUpdate.descricao)     
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 3. CRUD pergunta do tipo "Faixa de Valores"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Faixa de Valores", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória,
     * explicação, valor inicial e valor final.
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização (mantendo o tipo de pergunta)
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Faixa de Valores" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Faixa de Valores
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('3. CRUD pergunta do tipo "Faixa de Valores"', () => {
        // Massa de dados para criar pergunta do tipo "Faixa de Valores"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Faixa de Valores',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
            valorInicial: '1',
            valorFinal: '10'
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

        // Massa de dados para atualizar pergunta do tipo "Faixa de Valores"
        const dadosUpdate = {
            titulo: novoTitulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence(),
            valorInicial: '10',
            valorFinal: '20'
        }

        cy.expandirPergunta(dados.descricao)
        cy.preencherDadosPergunta(dadosUpdate, { limpar: true })
        cy.salvarEdicaoPergunta(dados.descricao, dadosUpdate.descricao)

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')
                
        let dadosParaValidar = { ...dados, ...dadosUpdate }
        cy.validarDadosPergunta(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        cy.expandirPergunta(dadosUpdate.descricao)
        cy.excluirPergunta(dadosUpdate.descricao)     
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 4. CRUD pergunta do tipo "Única Escolha"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Única Escolha", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória,
     * explicação, 2 respostas e com uma resposta marcada como correta.
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização (mantendo o tipo de pergunta)
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Única Escolha" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Única Escolha
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('4. CRUD pergunta do tipo "Única Escolha"', () => {
        // Massa de dados para criar pergunta do tipo "Única Escolha"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Única Escolha',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
            resposta1: fakerPT_BR.lorem.sentence(5),
            resposta2: fakerPT_BR.lorem.sentence(5)
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

        // Massa de dados para atualizar pergunta do tipo "Única Escolha"
        const dadosUpdate = {
            titulo: novoTitulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence(),
            resposta1: fakerPT_BR.lorem.sentence(5),
            resposta2: fakerPT_BR.lorem.sentence(5)
        }

        cy.expandirPergunta(dados.descricao)
        cy.preencherDadosPergunta(dadosUpdate, { limpar: true })
        cy.salvarEdicaoPergunta(dados.descricao, dadosUpdate.descricao)

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')
                
        let dadosParaValidar = { ...dados, ...dadosUpdate }
        cy.validarDadosPergunta(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        cy.expandirPergunta(dadosUpdate.descricao)
        cy.excluirPergunta(dadosUpdate.descricao)     
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 5. CRUD pergunta do tipo "Múltipla Escolha"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Múltipla Escolha", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória,
     * explicação, 2 respostas e com a resposta 2 marcada como correta.
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização (mantendo o tipo de pergunta)
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Múltipla Escolha" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Múltipla Escolha
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('5. CRUD pergunta do tipo "Múltipla Escolha"', () => {
        // Massa de dados para criar pergunta do tipo "Múltipla Escolha"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Múltipla Escolha',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
            resposta1: fakerPT_BR.lorem.sentence(5),
            resposta2: fakerPT_BR.lorem.sentence(5)
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

        // Massa de dados para atualizar pergunta do tipo "Múltipla Escolha"
        const dadosUpdate = {
            titulo: novoTitulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence(),
            resposta1: fakerPT_BR.lorem.sentence(5),
            resposta2: fakerPT_BR.lorem.sentence(5)
        }

        cy.expandirPergunta(dados.descricao)
        cy.preencherDadosPergunta(dadosUpdate, { limpar: true })
        cy.salvarEdicaoPergunta(dados.descricao, dadosUpdate.descricao)

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')
                
        let dadosParaValidar = { ...dados, ...dadosUpdate }
        cy.validarDadosPergunta(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        cy.expandirPergunta(dadosUpdate.descricao)
        cy.excluirPergunta(dadosUpdate.descricao)     
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 6. CRUD pergunta do tipo "Texto" atualizada para "Múltipla Escolha"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Texto", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória, 
     * explicação, categoria 1 e categoria 2, com atualização para o tipo "Múltipla Escolha", adicionando 3 respostas e marcando todas como corretas.
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização para "Múltipla Escolha"
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Texto" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Texto, Múltipla Escolha
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('6. CRUD pergunta do tipo "Texto" atualizada para "Múltipla Escolha"', () => {
        // Massa de dados para criar pergunta do tipo "Texto"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Texto',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
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

        // Massa de dados para atualizar pergunta para o tipo "Múltipla Escolha"
        const dadosUpdate = {
            titulo: novoTitulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Múltipla Escolha',
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence(),
            categoria1: 'Tecnologia',
            categoria2: 'Difícil',
            resposta1: fakerPT_BR.lorem.sentence(5),
            resposta2: fakerPT_BR.lorem.sentence(5),
            resposta3: fakerPT_BR.lorem.sentence(5)
        }

        cy.expandirPergunta(dados.descricao)
        formulario.addResposta()
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

    /** DOCUMENTAÇÃO:
     * @name
     * 7. CRUD pergunta do tipo "Arquivo" atualizada para "Faixa de Valores"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Arquivo", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória,
     * explicação, categoria 1 e categoria 2, com atualização para o tipo "Faixa de Valores", com valor inicial e valor final.
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização para "Faixa de Valores"
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Arquivo" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Arquivo, Faixa de Valores
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('7. CRUD pergunta do tipo "Arquivo" atualizada para "Faixa de Valores"', () => {
        // Massa de dados para criar pergunta do tipo "Arquivo"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Arquivo',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
            categoria1: 'Atualidades',
            categoria2: 'Médio'
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

        // Massa de dados para atualizar pergunta para o tipo "Faixa de Valores"
        const dadosUpdate = {
            titulo: novoTitulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Faixa de Valores',
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence(),
            categoria1: 'Entretenimento',
            categoria2: 'Fácil',
            valorInicial: '20',
            valorFinal: '10'
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

        /** DOCUMENTAÇÃO:
     * @name
     * 8. CRUD pergunta do tipo "Faixa de Valores" atualizada para "Única Escolha"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Faixa de Valores", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória,
     * explicação, valor inicial e valor final, com atualização para o tipo "Única Escolha", adicionando 3 respostas e marcando a última como correta.
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização para "Única Escolha"
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Faixa de Valores" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Faixa de Valores, Única Escolha
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('8. CRUD pergunta do tipo "Faixa de Valores" atualizada para "Única Escolha"', () => {
        // Massa de dados para criar pergunta do tipo "Faixa de Valores"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Faixa de Valores',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
            valorInicial: '1',
            valorFinal: '10'
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

        // Massa de dados para atualizar pergunta para o tipo "Única Escolha"
        const dadosUpdate = {
            titulo: novoTitulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Única Escolha',
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence(),
            resposta1: fakerPT_BR.lorem.sentence(5),
            resposta2: fakerPT_BR.lorem.sentence(5),
            resposta3: fakerPT_BR.lorem.sentence(5)
        }

        cy.expandirPergunta(dados.descricao)
        formulario.addResposta()
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

    /** DOCUMENTAÇÃO:
     * @name
     * 9. CRUD pergunta do tipo "Única Escolha" para "Arquivo"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Única Escolha", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória,
     * explicação, 2 respostas e com uma resposta marcada como correta, com atualização para o tipo "Arquivo".
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização para "Arquivo"
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Única Escolha" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Única Escolha, Arquivo
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('9. CRUD pergunta do tipo "Única Escolha" para "Arquivo"', () => {
        // Massa de dados para criar pergunta do tipo "Única Escolha"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Única Escolha',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
            resposta1: fakerPT_BR.lorem.sentence(5),
            resposta2: fakerPT_BR.lorem.sentence(5)
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

        // Massa de dados para atualizar pergunta para o tipo "Arquivo"
        const dadosUpdate = {
            titulo: novoTitulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Arquivo',
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence()
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

    /** DOCUMENTAÇÃO:
     * @name
     * 10. CRUD pergunta do tipo "Múltipla Escolha" para "Texto"
     * 
     * @description
     * Testa a criação de uma pergunta do tipo "Múltipla Escolha", com descrição, ordenação, pergunta desabilitada, pergunta obrigatória,
     * explicação, 2 respostas e com a resposta 2 marcada como correta, com atualização para o tipo "Texto".
     * 
     * @steps
     * 1. Acessa a página de perguntas de um questionário específico
     * 2. Clica no botão para adicionar uma nova pergunta e preenche os os campos conforme a massa de dados
     * 3. Salva a pergunta
     * 4. Valida se a pergunta foi criada corretamente
     * 5. Clica na pergunta criada para expandir as opções de edição
     * 6. Atualiza os campos da pergunta conforme a massa de dados para atualização para "Texto"
     * 7. Salva a edição da pergunta
     * 8. Valida se a pergunta foi atualizada corretamente
     * 9. Exclui a pergunta
     * 
     * @expected
     * Deve criar, atualizar e excluir uma pergunta do tipo "Múltipla Escolha" com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @tags
     * Perguntas, Questionários, CRUD, Múltipla Escolha, Texto
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('10. CRUD pergunta do tipo "Múltipla Escolha" para "Texto"', () => {
        // Massa de dados para criar pergunta do tipo "Múltipla Escolha"
        const dados = {
            titulo: titulo,
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Múltipla Escolha',
            perguntaDesabilitada: true,
            perguntaObrigatoria: true,
            explicacao: fakerPT_BR.lorem.sentence(),
            resposta1: fakerPT_BR.lorem.sentence(5),
            resposta2: fakerPT_BR.lorem.sentence(5)
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
            descricao: fakerPT_BR.lorem.paragraph(),
            ordenacao: fakerPT_BR.number.int({ min: 1, max: 10 }),
            tipoPergunta: 'Texto',
            perguntaDesabilitada: false,
            perguntaObrigatoria: false,
            explicacao: fakerPT_BR.lorem.sentence()
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