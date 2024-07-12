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

    before(() => {
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier",    // Firefox
            "Cannot read properties of undefined (reading 'toString')", // Chrome
            "Cannot read properties of null (reading 'getClientRect')"  // Chrome
        ], { ignoreNetworkErrors: true, ignoreScriptErrors: true })
        
        // Define o tipo de conteúdo
        tipoConteudo = 'curso'

        // Gera um nome aleatório para o conteúdo e para a atividade
        nomeConteudo = fakerPT_BR.commerce.productName()
        nomeAtividade = fakerPT_BR.commerce.productName()

        // Obtém o token de autenticação 
        getAuthToken()

        // Exclui todos os cursos antes de iniciar o teste
        cy.excluirCursoViaApi()

        // Cria um curso default
        const body = {
            name: nomeConteudo,
            description: fakerPT_BR.lorem.sentence(5)
        }
        cy.criarCursoViaApi(body)
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it('1. Criar uma atividade default', () => {
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
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
        // Massa de dados para criação de atividade        
        const dados = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            descricaoTexto: fakerPT_BR.lorem.sentence(10),
            resumoAtividade: fakerPT_BR.lorem.sentence(5),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:05'
        }
        
        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
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
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeDefault, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: `Edição de nome para ${fakerPT_BR.commerce.productName()}`,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: false,
            tipoAtividade: 'Games',
            codigoCompartilhamento: '<iframe src= "https://kahoot.it/challenge/0857294?challenge-id=502fec44-a2dc-4312-807a-65e1d9bc4a4d_1695673333050" width=620 height=280></iframe>',
            resumoAtividade: fakerPT_BR.lorem.sentence(5),
            tempoMinPermanencia: false
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeGames, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)     
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('3. CRUD atividade do tipo "PDF Estampado"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'PDF Estampado',
            enviarPdf: 'teste_pdf.pdf',
            descricaoArquivoPdf: {
                nome: 'teste_pdf.pdf',
                tamanho: '28102'
            },
            seguranca: 'Visualizar e Baixar',
            resumoAtividade: fakerPT_BR.lorem.sentence(5),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:32'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
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
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadePdf, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: `Edição de nome para ${fakerPT_BR.commerce.productName()}`,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
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
            resumoAtividade: fakerPT_BR.lorem.sentence(5),
            tempoMinPermanencia: false
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeVideo, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)        
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('4. CRUD atividade do tipo "Vídeo"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
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
            resumoAtividade: fakerPT_BR.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:06'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
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
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeVideo, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)  
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: `Edição de nome para ${fakerPT_BR.commerce.productName()}`,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: false,
            tipoAtividade: 'Scorm',
            enviarScorm: 'teste_scorm.zip',
            descricaoArquivoScorm: {
                nome: 'teste_scorm.zip',
                tamanho: '7,61 MB'
            },
            marcarConcluidoScorm: true,
            resumoAtividade: fakerPT_BR.lorem.sentence(5)
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)
        cy.verificarProcessamentoScorm(nomeConteudo, dadosUpdate.titulo, tipoConteudo)

        let dadosAtualizados = { ...formAtividadeScorm, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)   
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('5. CRUD atividade do tipo "Vídeo Externo - Youtube"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
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
            resumoAtividade: fakerPT_BR.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:02'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
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
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeVideoExterno, ...dados }
        cy.validarDadosAtividade(dadosParaValidar) 
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: `Edição de nome para ${fakerPT_BR.commerce.productName()}`,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: false,
            tipoAtividade: 'Texto',
            descricaoTexto: fakerPT_BR.lorem.sentence(5),
            resumoAtividade: fakerPT_BR.lorem.sentence(5),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '10:00'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeDefault, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)      

        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)  
    })

    it('6. CRUD atividade do tipo "Vídeo Externo - Vimeo"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Vídeo Externo',
            youtube: false,
            vimeo: true,
            eventials: false,
            videoUrl: 'https://www.youtube.com/watch?v=OyTN-MF-OEg',
            marcarConcluidoVideoExterno: true,
            resumoAtividade: fakerPT_BR.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:12'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')

        // Criar atividade
        cy.acessarPgListaConteudos()
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
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeVideoExterno, ...dados }
        cy.validarDadosAtividade(dadosParaValidar) 
        
        // UPDATE
        cy.log('## UPDATE ##')

        // Criar questionário
        const nomeQuestionario = fakerPT_BR.commerce.productName()
        cy.criarQuestionarioDefault(nomeQuestionario)

        const dadosUpdate = {
            titulo: `Edição de nome para ${fakerPT_BR.commerce.productName()}`,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: false,
            tipoAtividade: 'Questionário',
            selecionarQuestionario: nomeQuestionario,
            exibicaoPerguntas: 'Exibir perguntas aleatoriamente',
            visualizacaoRespostas: 'Exibir Respondidas e Respostas Corretas',
            pontuacaoMinima: '88',
            tentativas: '4',
            percPontuacaoFinal: '99',
            perguntasCat1: 'Todas',
            perguntasCat2: 'Todas',
            quantidadePerguntas: '',
            resumoAtividade: fakerPT_BR.lorem.sentence(12),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '02:00'
        }

        cy.acessarPgListaConteudos()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        cy.editarAtividade(nomeConteudo, dados.titulo)
        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeQuestionario, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)      

        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)  
    })

    it('7. CRUD atividade do tipo "Vídeo Externo - Eventials"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: fakerPT_BR.commerce.productName(),
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Vídeo Externo',
            youtube: false,
            vimeo: false,
            eventials: true,
            videoEventials: '<iframe width="560" height="315" src="https://www.youtube.com/embed/OyTN-MF-OEg?si=satdunCxLNcsq5-I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            chatEventials: '<iframe width="560" height="315" src="https://www.youtube.com/embed/OyTN-MF-OEg?si=satdunCxLNcsq5-I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            marcarConcluidoVideoExterno: true,
            naoMostrarProgressoVideoExterno: true,
            resumoAtividade: fakerPT_BR.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:16'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
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
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
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

        formAtividades.cancelar()
        cy.excluirAtividade(dados.titulo)  
    })

    it('8. CRUD atividade do tipo "Arquivos"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Arquivos',
            enviarArquivo: 'Sophia_estudiosa.png',
            descricaoArquivo: {
                nome: 'Sophia_estudiosa.png',
                tamanho: '34264'
            },
            seguranca: 'Visualizar e Baixar',
            resumoAtividade: fakerPT_BR.lorem.sentence(8),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:03'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
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
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
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

        formAtividades.cancelar()
        cy.excluirAtividade(dados.titulo)
    })

    it('9. CRUD atividade do tipo "Questionário"', () => {               
        // Massa de dados para criação de atividade
        const nomeQuestionario = fakerPT_BR.commerce.productName()
        const dados = {
            titulo: fakerPT_BR.commerce.productName(),
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Questionário',
            selecionarQuestionario: nomeQuestionario,
            exibicaoPerguntas: 'Exibir perguntas conforme ordem pré-definida',
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

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')

        // Criar questionário
        cy.criarQuestionarioDefault(nomeQuestionario)
        
        cy.acessarPgListaConteudos()
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
        cy.editarAtividade(nomeConteudo, dados.titulo)

        let dadosParaValidar = { ...formAtividadeQuestionario, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: fakerPT_BR.commerce.productName(),
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            tipoAtividade: 'Arquivos',
            enviarArquivo: 'teste_ppt.pptx',
            descricaoArquivo: {
                nome: 'teste_ppt.pptx',
                tamanho: '1280494'
            },
            seguranca: 'Visualizar e Baixar',
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
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

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('10. CRUD atividade do tipo "Scorm"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: fakerPT_BR.number.int({min: 1, max: 9}),
            liberado: true,
            tipoAtividade: 'Scorm',
            enviarScorm: 'teste_scorm.zip',
            descricaoArquivoScorm: {
                nome: 'teste_scorm.zip',
                tamanho: '7,61 MB'
            },
            marcarConcluidoScorm: true,
            resumoAtividade: fakerPT_BR.lorem.sentence(19)
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
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
        cy.editarAtividade(nomeConteudo, dados.titulo)
        cy.verificarProcessamentoScorm(nomeConteudo, dados.titulo, tipoConteudo)
        
        let dadosParaValidar = { ...formAtividadeScorm, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)   
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: fakerPT_BR.commerce.productName(),
            peso: 1,
            liberado: false,
            tipoAtividade: 'Texto',
            descricaoTexto: fakerPT_BR.lorem.sentence(10),
            resumoAtividade: fakerPT_BR.lorem.sentence(3),
            tempoMinPermanencia: false    
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosAtualizados = { ...formAtividadeDefault, ...dadosUpdate }
        cy.validarDadosAtividade(dadosAtualizados)        
     
        // DELETE
        cy.log('## DELETE ##')

        formAtividades.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    it('11. Criar uma atividade default do tipo "Games"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            titulo: nomeAtividade,
            peso: 1,
            liberado: false,
            tipoAtividade: 'Games',
            codigoCompartilhamento: '<iframe src= "https://kahoot.it/challenge/0857294?challenge-id=502fec44-a2dc-4312-807a-65e1d9bc4a4d_1695673333050" width=620 height=280></iframe>',
            resumoAtividade: fakerPT_BR.lorem.sentence(5),
            tempoMinPermanencia: false
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
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
        formAtividades.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(esperaExplicita)
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

        formAtividades.cancelar()
        cy.excluirAtividade(dados.titulo)
    })
})