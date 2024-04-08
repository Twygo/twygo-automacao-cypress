/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper' 
import estruturaAtividades from '../support/pageObjects/estruturaAtividades'
import formAtividades from '../support/pageObjects/formAtividades'

describe('Criar atividade', () => {
    const TIMEOUT_PADRAO = 5000
    const atividades = new estruturaAtividades()
    const formAtividade = new formAtividades()

    let nomeConteudo, tipoConteudo, nomeAtividade

    let atividadeDefault = 'Novo 1'

    // Formulários padrões (obs.: o default é do tipo Texto)
    let formAtividadeDefault = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Texto',
        descricaoTexto: '',
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    let formAtividadePdf = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'PDF Estampado',
        enviarPdf: '',
        descricaoArquivoPdf: {
            nome: '',
            tamanho: ''
        },
        seguranca: 'Somente Visualizar',
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    let formAtividadeVideo = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Vídeo',
        enviarVideo: '',
        descricaoArquivoVideo: {
            nome: '',
            tamanho: ''
        },
        marcarConcluidoVideo: false,
        naoMostrarProgresso: false,
        seguranca: 'Somente Visualizar',
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    let formAtividadeVideoExterno = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Vídeo Externo',
        youtube: true,
        vimeo: false,
        eventials: false,
        videoUrl: '',
        marcarConcluidoVideoExterno: false,
        naoMostrarProgressoVideoExterno: false,
        chatTwygo: false,
        desabilitarChatFimTransmissao: false,
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    let formAtividadeArquivos = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Arquivos',
        enviarArquivo: '',
        descricaoArquivo: {
            nome: '',
            tamanho: ''
        },
        seguranca: 'Somente Visualizar',
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    let formAtividadeQuestionario = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Questionário',
        selecionarQuestionario: '',
        exibicaoPerguntas: 'Exibir mesmas perguntas nas tentativas',
        visualizacaoRespostas: 'Exibir Apenas Nota',
        pontuacaoMinima: '',
        tentativas: '',
        percPontuacaoFinal: '0',
        perguntasCat1: 'Todas',
        perguntasCat2: 'Todas',
        quantidadePerguntas: '',
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    let formAtividadeScorm = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Scorm',
        enviarScorm: '',
        descricaoArquivoScorm: {
            nome: '',
            tamanho: ''
        },
        marcarConcluidoScorm: false,
        resumoAtividade: ''
    }

    let formAtividadeGames = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Games',
        codigoCompartilhamento: '',
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    before(() => {
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        // Ativa o tratamento de exceção não capturada especificamente para este teste
		Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })

        // Define o tipo de conteúdo
        tipoConteudo = 'curso'

        // Gera um nome aleatório para o conteúdo e para a atividade
        nomeConteudo = faker.commerce.productName()
        nomeAtividade = faker.commerce.productName()

        // Obtém o token de autenticação 
        getAuthToken()

        // Exclui todos os cursos antes de iniciar o teste
        cy.excluirCursoViaApi()

        // Cria um curso default
        const body = {
            name: nomeConteudo,
            description: faker.lorem.sentence(5)
        }
        cy.criarCursoViaApi(body)
    })

    afterEach(() => {
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})

    /** DOCUMENTAÇÃO:
     * @name
     * 1. Criar uma atividade default
     * 
     * @description
     * Cenário para validar a criação de uma atividade default.
     * 
     * @steps
     * 1. Cria uma atividade default.
     * 
     * @expected
     * Deve ser possível criar a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão
     * 
     * @time
     * 1m
     * 
     * @tags
     * Curso, Atividade, Default, Texto
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('1. Criar uma atividade default', () => {
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()
        
        //READ
        cy.log('## READ ##')
        
        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeDefault)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 2. CRUD atividade do tipo "Texto"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade do tipo "Texto" atualizando
     * a atividade para "Games".
     * 
     * @steps
     * 1. Cria uma atividade do tipo "Texto".
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para o tipo "Games".
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Curso, CRUD, Texto, Games
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('2. CRUD atividade do tipo "Texto"', () => {    
        // Massa de dados para criação de atividade        
        const dados = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            descricaoTexto: faker.lorem.sentence(10),
            resumoAtividade: faker.lorem.sentence(5),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:05'
        }
        
        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeDefault, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: `Edição de nome para ${faker.commerce.productName()}`,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: false,
            tipoAtividade: 'Games',
            codigoCompartilhamento: '<iframe src= "https://kahoot.it/challenge/0857294?challenge-id=502fec44-a2dc-4312-807a-65e1d9bc4a4d_1695673333050" width=620 height=280></iframe>',
            resumoAtividade: faker.lorem.sentence(5),
            tempoMinPermanencia: false
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeGames, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)     
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 3. CRUD atividade do tipo "PDF Estampado"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade do tipo "PDF Estampado" atualizando
     * a atividade para "Vídeo".
     * 
     * @steps
     * 1. Cria uma atividade do tipo "PDF Estampado" com um arquivo de PDF teste_pdf.pdf.
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para o tipo "Vídeo" com um arquivo de vídeo teste_video.mp4.
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Curso, CRUD, PDF Estampado, Vídeo
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('3. CRUD atividade do tipo "PDF Estampado"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'PDF Estampado',
            enviarPdf: 'teste_pdf.pdf',
            descricaoArquivoPdf: {
                nome: 'teste_pdf.pdf',
                tamanho: '28102'
            },
            seguranca: 'Visualizar e Baixar',
            resumoAtividade: faker.lorem.sentence(5),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:32'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadePdf, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: `Edição de nome para ${faker.commerce.productName()}`,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: false,
            tipoAtividade: 'Vídeo',
            enviarVideo: 'teste_video.mp4',
            descricaoArquivoVideo: {
                nome: 'teste_video.mp4',
                tamanho: '50809927'
            },
            marcarConcluidoVideo: true,
            naoMostrarProgresso: true,
            seguranca: 'Visualizar e Baixar',
            resumoAtividade: faker.lorem.sentence(5),
            tempoMinPermanencia: false
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeVideo, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)        
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 4. CRUD atividade do tipo "Vídeo"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade do tipo "Vídeo" atualizando
     * a atividade para "Scorm".
     * 
     * @steps
     * 1. Cria uma atividade do tipo "Vídeo" com um arquivo de vídeo teste_video.mp4.
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para o tipo "Scorm" com um arquivo de SCORM teste_scorm.zip.
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 2m
     * 
     * @tags
     * Curso, CRUD, Vídeo, Scorm
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it.only('4. CRUD atividade do tipo "Vídeo"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Vídeo',
            enviarVideo: 'teste_video.mp4',
            descricaoArquivoVideo: {
                nome: 'teste_video.mp4',
                tamanho: '50809927'
            },
            marcarConcluidoVideo: true,
            naoMostrarProgresso: true,
            seguranca: 'Visualizar e Baixar',
            resumoAtividade: faker.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:06'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeVideo, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)  
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: `Edição de nome para ${faker.commerce.productName()}`,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: false,
            tipoAtividade: 'Scorm',
            enviarScorm: 'teste_scorm.zip',
            descricaoArquivoScorm: {
                nome: 'teste_scorm.zip',
                tamanho: '7,61 MB'
            },
            marcarConcluidoScorm: true,
            resumoAtividade: faker.lorem.sentence(5)
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)
        cy.verificarProcessamentoScorm(nomeConteudo, dadosUpdate.titulo, tipoConteudo)

        let dadosAtualizados = { ...formAtividadeScorm, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)   
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 5. CRUD atividade do tipo "Vídeo Externo - Youtube"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade do tipo "Vídeo Externo - Youtube"
     * atualizando o tipo de atividade para "Texto".
     * 
     * @steps
     * 1. Cria uma atividade do tipo "Vídeo Externo - Youtube".
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para o tipo "Texto".
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Curso, CRUD, Vídeo Externo, Youtube, Texto
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('5. CRUD atividade do tipo "Vídeo Externo - Youtube"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Vídeo Externo',
            youtube: true,
            vimeo: false,
            eventials: false,
            videoUrl: 'https://www.youtube.com/watch?v=OyTN-MF-OEg',
            marcarConcluidoVideoExterno: true,
            naoMostrarProgressoVideoExterno: true,
            chatTwygo: true,
            desabilitarChatFimTransmissao: true,
            resumoAtividade: faker.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:02'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeVideoExterno, ...dados }
        cy.validarDadosAtividade(dadosParaValidar) 
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: `Edição de nome para ${faker.commerce.productName()}`,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: false,
            tipoAtividade: 'Texto',
            descricaoTexto: faker.lorem.sentence(5),
            resumoAtividade: faker.lorem.sentence(5),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '10:00'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeDefault, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)      

        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)  
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 6. CRUD atividade do tipo "Vídeo Externo - Vimeo"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade do tipo "Vídeo Externo - Vimeo" atualizando
     * a atividade para "Questionário".
     * 
     * @steps
     * 1. Cria uma atividade do tipo "Vídeo Externo - Vimeo".
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para o tipo "Questionário".
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Curso, CRUD, Vídeo Externo, Vimeo, Questionário
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('6. CRUD atividade do tipo "Vídeo Externo - Vimeo"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Vídeo Externo',
            youtube: false,
            vimeo: true,
            eventials: false,
            videoUrl: 'https://www.youtube.com/watch?v=OyTN-MF-OEg',
            marcarConcluidoVideoExterno: true,
            resumoAtividade: faker.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:12'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeVideoExterno, ...dados }
        cy.validarDadosAtividade(dadosParaValidar) 
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: `Edição de nome para ${faker.commerce.productName()}`,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: false,
            tipoAtividade: 'Questionário',
            selecionarQuestionario: 'teste',
            exibicaoPerguntas: 'Exibir perguntas aleatoriamente',
            visualizacaoRespostas: 'Exibir Respondidas e Respostas Corretas',
            pontuacaoMinima: '88',
            tentativas: '4',
            percPontuacaoFinal: '99',
            perguntasCat1: 'Todas',
            perguntasCat2: 'Todas',
            quantidadePerguntas: '',
            resumoAtividade: faker.lorem.sentence(12),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '02:00'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeQuestionario, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)      

        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)  
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 7. CRUD atividade do tipo "Vídeo Externo - Eventials"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade do tipo "Vídeo Externo - Eventials"
     * atualizando o chat para Twygo e desabilitando o chat Eventials.
     * 
     * @steps
     * 1. Cria uma atividade do tipo "Vídeo Externo - Eventials" com chat Eventials.
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para habilitar chat Twygo e desabilitar chat Eventials.
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * CRUD, Vídeo Externo, Eventials
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('7. CRUD atividade do tipo "Vídeo Externo - Eventials"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: faker.commerce.productName(),
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Vídeo Externo',
            youtube: false,
            vimeo: false,
            eventials: true,
            videoEventials: '<iframe width="560" height="315" src="https://www.youtube.com/embed/OyTN-MF-OEg?si=satdunCxLNcsq5-I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            chatEventials: '<iframe width="560" height="315" src="https://www.youtube.com/embed/OyTN-MF-OEg?si=satdunCxLNcsq5-I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            marcarConcluidoVideoExterno: true,
            naoMostrarProgressoVideoExterno: true,
            resumoAtividade: faker.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:16'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeVideoExterno, ...dados }
        cy.validarDadosAtividade(dadosParaValidar) 
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            chatTwygo: true,
            desabilitarChatFimTransmissao: true
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        // Atualização específica para o chat "Eventials" que não é exibido na tela de edição quando habilitado chat Twygo
        const dadosEspecificos = {
            chatEventials: ''
        }

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate, ...dadosEspecificos }
        cy.validarDadosAtividade(dadosParaValidar)  
        
        //Validação específica para o chat "Eventials" que não é exibido na tela de edição quando habilitado chat Twygo
        cy.get('#eventials_chat')
            .should('have.attr', 'contenteditable', 'false')

        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dados.titulo)  
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 8. CRUD atividade do tipo "Arquivos"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade do tipo "Arquivos" atualizando
     * o tipo de atividade para "Vídeo Externo - Vimeo".
     * 
     * @steps
     * 1. Cria uma atividade do tipo "Arquivos" com um arquivo de imagem Sophia_estudiosa.png.
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para o tipo "Vídeo Externo - Vimeo".
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * CRUD, Arquivos, Vídeo Externo, Vimeo
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('8. CRUD atividade do tipo "Arquivos"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Arquivos',
            enviarArquivo: 'Sophia_estudiosa.png',
            descricaoArquivo: {
                nome: 'Sophia_estudiosa.png',
                tamanho: '34264'
            },
            seguranca: 'Visualizar e Baixar',
            resumoAtividade: faker.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:03'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeArquivos, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            tipoAtividade: 'Vídeo Externo',
            youtube: false,
            vimeo: true,
            eventials: false,
            videoUrl: 'https://www.youtube.com/watch?v=OyTN-MF-OEg',
            marcarConcluidoVideoExterno: true,
            tempoMinPermanenciaValor: '00:12'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        // Dados não alterados para a atividade
        const dadosNaoAlterados = {
            titulo: dados.titulo,
            peso: dados.peso,
            liberado: dados.liberado,
            resumoAtividade: dados.resumoAtividade,
            tempoMinPermanencia: dados.tempoMinPermanencia
        }

        let dadosAtualizados = { ...formAtividadeVideoExterno, ...dadosUpdate, ...dadosNaoAlterados }
        cy.validarDadosAtividade(dadosAtualizados)
        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dados.titulo)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 9. CRUD atividade do tipo "Questionário"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade do tipo "Questionário" atualizando
     * a atividade para "Arquivos".
     * 
     * @steps
     * 1. Cria uma atividade do tipo "Questionário".
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para o tipo "Arquivos" com um arquivo de apresentação teste_ppt.pptx.
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Curso, CRUD, Atividade, Questionário, Arquivo
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('9. CRUD atividade do tipo "Questionário"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: faker.commerce.productName(),
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Questionário',
            selecionarQuestionario: 'teste',
            exibicaoPerguntas: 'Exibir perguntas conforme ordem pré-definida',
            visualizacaoRespostas: 'Exibir Respondidas',
            pontuacaoMinima: '50',
            tentativas: '2',
            percPontuacaoFinal: '70',
            perguntasCat1: 'Todas',
            perguntasCat2: 'Todas',
            quantidadePerguntas: '',    
            resumoAtividade: faker.lorem.sentence(6),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '01:00'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeQuestionario, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: faker.commerce.productName(),
            peso: faker.number.int({min: 1, max: 9}),
            tipoAtividade: 'Arquivos',
            enviarArquivo: 'teste_ppt.pptx',
            descricaoArquivo: {
                nome: 'teste_ppt.pptx',
                tamanho: '1280494'
            },
            seguranca: 'Visualizar e Baixar',
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        const dadosNaoAlterados = {
            liberado: dados.liberado,
            resumoAtividade: dados.resumoAtividade,
            tempoMinPermanencia: dados.tempoMinPermanencia,
            tempoMinPermanenciaValor: dados.tempoMinPermanenciaValor
        }

        let dadosAtualizados = { ...formAtividadeArquivos, ...dadosUpdate, ...dadosNaoAlterados }
        cy.validarDadosAtividade(dadosAtualizados)

        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 10. CRUD atividade do tipo "Scorm"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade do tipo "Scorm" atualizando
     * a atividade para "Texto".
     * 
     * @steps
     * 1. Cria uma atividade do tipo "Scorm" com um arquivo de apresentação teste_scorm.zip.
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para o tipo "Texto".
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 2m
     * 
     * @tags
     * Curso, CRUD, Atividade, Scorm, Texto
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('10. CRUD atividade do tipo "Scorm"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Scorm',
            enviarScorm: 'teste_scorm.zip',
            descricaoArquivoScorm: {
                nome: 'teste_scorm.zip',
                tamanho: '7,61 MB'
            },
            marcarConcluidoScorm: true,
            resumoAtividade: faker.lorem.sentence(19)
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página e do processamento do scorm após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)
        cy.verificarProcessamentoScorm(nomeConteudo, dados.titulo, tipoConteudo)
        
        let dadosParaValidar = { ...formAtividadeScorm, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)   
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: faker.commerce.productName(),
            peso: 1,
            liberado: false,
            tipoAtividade: 'Texto',
            descricaoTexto: faker.lorem.sentence(10),
            resumoAtividade: faker.lorem.sentence(3),
            tempoMinPermanencia: false    
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeDefault, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)        
     
        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 11. Criar uma atividade default do tipo "Games"
     * 
     * @description
     * Cenário para validar a criação, leitura, atualização e exclusão de uma atividade default do tipo "Games" atualizando
     * a atividade para "Vídeo Externo".
     * 
     * @steps
     * 1. Cria uma atividade default do tipo "Games".
     * 2. Valida os dados da atividade criada.
     * 3. Atualiza a atividade para o tipo "Vídeo Externo - Youtube".
     * 4. Valida os dados da atividade atualizada.
     * 5. Exclui a atividade criada.
     * 
     * @expected
     * Deve ser possível criar, ler, atualizar e excluir a atividade com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressivo - CRUD - E2E
     * 
     * @time
     * 1m
     * 
     * @tags
     * Curso, CRUD, Atividade, Games, Vídeo Externo, Youtube
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('11. Criar uma atividade default do tipo "Games"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: 1,
            liberado: false,
            tipoAtividade: 'Games',
            codigoCompartilhamento: '<iframe src= "https://kahoot.it/challenge/0857294?challenge-id=502fec44-a2dc-4312-807a-65e1d9bc4a4d_1695673333050" width=620 height=280></iframe>',
            resumoAtividade: faker.lorem.sentence(5),
            tempoMinPermanencia: false
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeGames, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            tipoAtividade: 'Vídeo Externo',
            youtube: true,
            vimeo: false,
            eventials: false,
            videoUrl: 'https://www.youtube.com/watch?v=OyTN-MF-OEg',
            marcarConcluidoVideoExterno: true,
            naoMostrarProgressoVideoExterno: true,
            chatTwygo: true,
            desabilitarChatFimTransmissao: true
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dados.titulo)

        const dadosNaoAlterados = {
            titulo: dados.titulo,
            peso: dados.peso,
            liberado: dados.liberado,
            resumoAtividade: dados.resumoAtividade,
            tempoMinPermanencia: dados.tempoMinPermanencia
        }

        let dadosAtualizados = { ...formAtividadeVideoExterno, ...dadosUpdate, ...dadosNaoAlterados }
        cy.validarDadosAtividade(dadosAtualizados)        
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dados.titulo)
    })
})