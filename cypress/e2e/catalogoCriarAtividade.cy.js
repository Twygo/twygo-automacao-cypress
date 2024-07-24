/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper' 
import estruturaAtividades from '../support/pageObjects/estruturaAtividades'
import formAtividades from '../support/pageObjects/formAtividades'

describe('Criar atividade', () => {
    const esperaExplicita = 5000

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

    beforeEach(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier",    // Firefox
            "Cannot read properties of undefined (reading 'toString')", // Chrome
            "Cannot read properties of undefined (reading 'hasAttribute')", // Chrome
            "Cannot read properties of null (reading 'addEventListener')", // Chrome
			"Cannot read properties of undefined (reading 'length')",	//Chrome
            "Cannot read properties of null (reading 'getClientRect')"  //Chrome
        ], { ignoreScriptErrors: true }, { ignoreNetworkErrors: true })
        
        // Define o tipo de conteúdo
        tipoConteudo = 'catalogo'

        // Gera um nome aleatório para o conteúdo e para a atividade
        nomeConteudo = fakerPT_BR.commerce.productName()
        nomeAtividade = fakerPT_BR.commerce.productName()

        // Obtém o token de autenticação 
        getAuthToken()

        // Exclui todos os catálogos antes de iniciar o teste
        cy.excluirCatalogoViaApi()

        // Cria um catálogo default
        const body = {
            name: nomeConteudo,
            description: fakerPT_BR.lorem.sentence(5)
        }
        cy.criarCatalogoViaApi(body)
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it('1. Criar uma atividade default', () => {
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
		cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        estruturaAtividades.adicionarAtividade()
        cy.salvarAtividades()
        
        //READ
        cy.log('## READ ##')
        
        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeDefault)
    })

    it('2. CRUD atividade do tipo "Texto"', () => {    
        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        estruturaAtividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        formAtividades.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeDefault)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            descricaoTexto: fakerPT_BR.lorem.sentence(10),
            resumoAtividade: fakerPT_BR.lorem.sentence(5),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:08'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeDefault, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)     
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('3. CRUD atividade do tipo "PDF Estampado"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            tipoAtividade: 'PDF Estampado'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        estruturaAtividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)

        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividades.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadePdf)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            enviarPdf: 'teste_pdf.pdf',
            descricaoArquivoPdf: {
                nome: 'teste_pdf.pdf',
                tamanho: '28102'
            },
            seguranca: 'Somente Baixar',
            resumoAtividade: fakerPT_BR.lorem.sentence(15),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:12'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadePdf, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)        
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('4. CRUD atividade do tipo "Vídeo"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            tipoAtividade: 'Vídeo'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        estruturaAtividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)

        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividades.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeVideo)  
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            enviarVideo: 'teste_video.mp4',
            descricaoArquivoVideo: {
                nome: 'teste_video.mp4',
                tamanho: '50809927'
            },
            marcarConcluidoVideo: true,
            naoMostrarProgresso: true,
            seguranca: 'Somente Baixar',
            resumoAtividade: fakerPT_BR.lorem.sentence(50),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:25'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeVideo, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)   
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('5. CRUD atividade do tipo "Vídeo Externo - Youtube"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            tipoAtividade: 'Vídeo Externo'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        estruturaAtividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)

        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividades.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeVideoExterno) 
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            youtube: true,
            vimeo: false,
            eventials: false,
            videoUrl: 'https://www.youtube.com/watch?v=OyTN-MF-OEg',
            marcarConcluidoVideoExterno: true,
            naoMostrarProgressoVideoExterno: true,
            chatTwygo: true,
            desabilitarChatFimTransmissao: true,
            resumoAtividade: fakerPT_BR.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:02'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeVideoExterno, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)   

        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)  
    })

    it('6. CRUD atividade do tipo "Arquivos"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            tipoAtividade: 'Arquivos'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        estruturaAtividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)

        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividades.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeArquivos)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            enviarArquivo: 'Sophia_estudiosa.png',
            descricaoArquivo: {
                nome: 'Sophia_estudiosa.png',
                tamanho: '34264'
            },
            seguranca: 'Somente Baixar',
            resumoAtividade: fakerPT_BR.lorem.sentence(22),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:01'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeArquivos, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('7. CRUD atividade do tipo "Questionário"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            tipoAtividade: 'Questionário',
            selecionarQuestionario: fakerPT_BR.lorem.sentence(3)
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')

        // Criar questionário
        cy.criarQuestionarioDefault(dados.selecionarQuestionario)

        // Acessar catálogo
        cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        estruturaAtividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)

        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividades.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)

        let dadosParaValidar = { ...formAtividadeQuestionario, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            exibicaoPerguntas: 'Exibir perguntas diferentes a cada tentativa',
            visualizacaoRespostas: 'Exibir Respondidas',
            pontuacaoMinima: '50',
            tentativas: '2',
            percPontuacaoFinal: '70',
            perguntasCat1: 'Todas',
            perguntasCat2: 'Todas',
            quantidadePerguntas: '',
            resumoAtividade: fakerPT_BR.lorem.sentence(6),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '01:00'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('8. CRUD atividade do tipo "Scorm"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            tipoAtividade: 'Scorm',
            enviarScorm: 'teste_scorm.zip',
            descricaoArquivoScorm: {
                nome: 'teste_scorm.zip',
                tamanho: '7,61 MB'
            }
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        estruturaAtividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página e do processamento do scorm após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)

        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividades.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.verificarProcessamentoScorm(nomeConteudo, atividadeDefault, tipoConteudo)

        let dadosParaValidar = { ...formAtividadeScorm, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)   
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            enviarScorm: 'teste_scorm2.zip',
            descricaoArquivoScorm: {
                nome: 'teste_scorm2.zip',
                tamanho: '8,3 MB'
            },    
            marcarConcluidoScorm: true,
            resumoAtividade: fakerPT_BR.lorem.sentence(19)
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)
        cy.verificarProcessamentoScorm(nomeConteudo, dadosUpdate.titulo, tipoConteudo)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)        
     
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('9. Criar uma atividade default do tipo "Games"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            tipoAtividade: 'Games'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        estruturaAtividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)

        cy.preencherDadosAtividade(dados, {limpar: true})
        formAtividades.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeGames)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            codigoCompartilhamento: '<iframe src= "https://kahoot.it/challenge/0857294?challenge-id=502fec44-a2dc-4312-807a-65e1d9bc4a4d_1695673333050" width=620 height=280></iframe>',
            resumoAtividade: fakerPT_BR.lorem.sentence(2),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:03'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeGames, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)        
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })
})