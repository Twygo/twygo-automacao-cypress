/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import formQuestionarios from '../support/pageObjects/formQuestionarios'
import formPerguntas from '../support/pageObjects/formPerguntas'

describe('Perguntas', () => {
    let titulo, novoTitulo, tipoPergunta, nomeQuestionario, listaQuestionarios, categorias1, categorias2

    beforeEach(() => {  
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier",    // Firefox
            "Cannot read properties of null (reading 'getClientRect')"  //Chrome
        ])
        
        // Massa de dados para criar questionário
        nomeQuestionario = fakerPT_BR.commerce.productName()
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
        formQuestionarios.addQuestionario()
        cy.preencherDadosQuestionario(dadosQuest)
        cy.salvarQuestionario(dadosQuest.nome)

        // Gera um título aleatório para a pergunta
        titulo = fakerPT_BR.commerce.productName()
        novoTitulo = fakerPT_BR.commerce.productName()
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

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
        formPerguntas.addPergunta()

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
        formPerguntas.addPergunta()

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
        formPerguntas.addPergunta()

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
            resposta2: fakerPT_BR.lorem.sentence(5),
            radioResposta1: false,
            radioResposta2: true
        }

        // CREATE
        cy.log('## CREATE ##')
        
        cy.acessarPerguntasQuestionario(nomeQuestionario)
        formPerguntas.addPergunta()

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
            resposta2: fakerPT_BR.lorem.sentence(5),
            radioResposta1: true,
            radioResposta2: false
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
            resposta2: fakerPT_BR.lorem.sentence(5),
            checkResposta2: true
        }

        // CREATE
        cy.log('## CREATE ##')
        
        cy.acessarPerguntasQuestionario(nomeQuestionario)
        formPerguntas.addPergunta()

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
            resposta2: fakerPT_BR.lorem.sentence(5),
            checkResposta1: true
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
        formPerguntas.addPergunta()

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
            resposta3: fakerPT_BR.lorem.sentence(5),
            radioResposta1: true,
            radioResposta2: true,
            radioResposta3: true
        }

        cy.expandirPergunta(dados.descricao)
        formPerguntas.addResposta()
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
        formPerguntas.addPergunta()

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
        formPerguntas.addPergunta()

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
            resposta3: fakerPT_BR.lorem.sentence(5),
            radioResposta1: false,
            radioResposta2: false,
            radioResposta3: true            
        }

        cy.expandirPergunta(dados.descricao)
        formPerguntas.addResposta()
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
            resposta2: fakerPT_BR.lorem.sentence(5),
            radioResposta1: false,
            radioResposta2: true
        }

        // CREATE
        cy.log('## CREATE ##')
        
        cy.acessarPerguntasQuestionario(nomeQuestionario)
        formPerguntas.addPergunta()

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
            resposta2: fakerPT_BR.lorem.sentence(5),
            checkResposta2: true
        }

        // CREATE
        cy.log('## CREATE ##')
        
        cy.acessarPerguntasQuestionario(nomeQuestionario)
        formPerguntas.addPergunta()

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