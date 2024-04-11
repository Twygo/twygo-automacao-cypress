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
        tipoConteudo = 'catalogo'

        // Gera um nome aleatório para o conteúdo e para a atividade
        nomeConteudo = faker.commerce.productName()
        nomeAtividade = faker.commerce.productName()

        // Obtém o token de autenticação 
        getAuthToken()

        // Exclui todos os catálogos antes de iniciar o teste
        cy.excluirCatalogoViaApi()

        // Cria um catálogo default
        const body = {
            name: nomeConteudo,
            description: faker.lorem.sentence(5)
        }
        cy.criarCatalogoViaApi(body)
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
     * Testa a criação de uma atividade do tipo "Texto" com os dados padrões.
     * 
     * @steps
     * 1. Acessa as atividades do catálogo.
     * 2. Adiciona uma atividade.
     * 3. Salva as alterações na estrutura de atividades.
     * 4. Edita a atividade criada e valida seus dados.
     * 
     * @expected
     * Espera-se que a atividade seja criada com sucesso e que os dados informados sejam exibidos corretamente.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão, Catálogo, Atividade
     * 
     * @time
     * 1m
     * 
     * @tags
     * Atividade, Catálogo, Texto
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
		cy.acessarPgCatalogo()
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
     * Testa o fluxo de criação, leitura, atualização e exclusão de uma atividade do tipo "Texto", mantendo o mesmo
     * tipo de atividade para todos os testes.
     * 
     * @steps
     * 1. Acessa as atividades do catálogo.
     * 2. Adiciona uma atividade (default: texto).
     * 3. Salva as alterações na estrutura de atividades.
     * 4. Edita a atividade default criada e preenche com os dados do teste.
     * 5. Salva a atualização da atividade.
     * 6. Edita a atividade e valida os dados.
     * 7. Atualiza os dados da atividade.
     * 8. Edita a atividade atualizada e valida os dados.
     * 9. Exclui a atividade.
     * 
     * @expected
     * Espera-se que a atividade seja criada, editada, atualizada e excluída com sucesso.
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
     * Catálogo, CRUD, Atividade, Texto
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('2. CRUD atividade do tipo "Texto"', () => {    
        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        atividades.adicionarAtividade()
        cy.salvarAtividades()

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        formAtividade.salvar()

        //READ
        cy.log('## READ ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeDefault)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            descricaoTexto: faker.lorem.sentence(10),
            resumoAtividade: faker.lorem.sentence(5),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:08'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeDefault, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)     
        
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
     * Testa o fluxo de criação, leitura, atualização e exclusão de uma atividade do tipo "PDF Estampado", mantendo o mesmo
     * tipo de atividade para todos os testes.
     * 
     * @steps
     * 1. Acessa as atividades do catálogo.
     * 2. Adiciona uma atividade (default: texto).
     * 3. Salva as alterações na estrutura de atividades.
     * 4. Edita a atividade default criada e preenche com os dados do teste.
     * 5. Salva a atualização da atividade.
     * 6. Edita a atividade e valida os dados.
     * 7. Atualiza os dados da atividade.
     * 8. Edita a atividade atualizada e valida os dados.
     * 9. Exclui a atividade.
     * 
     * @expected
     * Espera-se que a atividade seja criada, editada, atualizada e excluída com sucesso.
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
     * Catálogo, CRUD, Atividade, PDF Estampado
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
            tipoAtividade: 'PDF Estampado'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
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
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadePdf)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            enviarPdf: 'teste_pdf.pdf',
            descricaoArquivoPdf: {
                nome: 'teste_pdf.pdf',
                tamanho: '28102'
            },
            seguranca: 'Somente Baixar',
            resumoAtividade: faker.lorem.sentence(15),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:12'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadePdf, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)        
        
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
     * Testa o fluxo de criação, leitura, atualização e exclusão de uma atividade do tipo "Vídeo", mantendo o mesmo
     * tipo de atividade para todos os testes.
     * 
     * @steps
     * 1. Acessa as atividades do catálogo.
     * 2. Adiciona uma atividade (default: texto).
     * 3. Salva as alterações na estrutura de atividades.
     * 4. Edita a atividade default criada e preenche com os dados do teste.
     * 5. Salva a atualização da atividade.
     * 6. Edita a atividade e valida os dados.
     * 7. Atualiza os dados da atividade.
     * 8. Edita a atividade atualizada e valida os dados.
     * 9. Exclui a atividade.
     * 
     * @expected
     * Espera-se que a atividade seja criada, editada, atualizada e excluída com sucesso.
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
     * Catálogo, CRUD, Atividade, Vídeo
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
            tipoAtividade: 'Vídeo'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgCatalogo()
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
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeVideo)  
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            enviarVideo: 'teste_video.mp4',
            descricaoArquivoVideo: {
                nome: 'teste_video.mp4',
                tamanho: '50809927'
            },
            marcarConcluidoVideo: true,
            naoMostrarProgresso: true,
            seguranca: 'Somente Baixar',
            resumoAtividade: faker.lorem.sentence(50),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:25'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeVideo, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)   
        
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
     * Testa o fluxo de criação, leitura, atualização e exclusão de uma atividade do tipo "Vídeo Externo - Youtube", mantendo o mesmo
     * tipo de atividade para todos os testes.
     * 
     * @steps
     * 1. Acessa as atividades do catálogo.
     * 2. Adiciona uma atividade (default: texto).
     * 3. Salva as alterações na estrutura de atividades.
     * 4. Edita a atividade default criada e preenche com os dados do teste.
     * 5. Salva a atualização da atividade.
     * 6. Edita a atividade e valida os dados.
     * 7. Atualiza os dados da atividade.
     * 8. Edita a atividade atualizada e valida os dados.
     * 9. Exclui a atividade.
     * 
     * @expected
     * Espera-se que a atividade seja criada, editada, atualizada e excluída com sucesso.
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
     * Catálogo, CRUD, Atividade, Vídeo Externo
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it.only('5. CRUD atividade do tipo "Vídeo Externo - Youtube"', () => {
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
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeVideoExterno) 
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
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

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeVideoExterno, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)   

        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)  
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 6. CRUD atividade do tipo "Arquivos"
     * 
     * @description
     * Testa o fluxo de criação, leitura, atualização e exclusão de uma atividade do tipo "Arquivos", mantendo o mesmo
     * tipo de atividade para todos os testes.
     * 
     * @steps
     * 1. Acessa as atividades do catálogo.
     * 2. Adiciona uma atividade (default: texto).
     * 3. Salva as alterações na estrutura de atividades.
     * 4. Edita a atividade default criada e preenche com os dados do teste.
     * 5. Salva a atualização da atividade.
     * 6. Edita a atividade e valida os dados.
     * 7. Atualiza os dados da atividade.
     * 8. Edita a atividade atualizada e valida os dados.
     * 9. Exclui a atividade.
     * 
     * @expected
     * Espera-se que a atividade seja criada, editada, atualizada e excluída com sucesso.
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
     * Catálogo, CRUD, Atividade, Arquivos
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeArquivos)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            enviarArquivo: 'Sophia_estudiosa.png',
            descricaoArquivo: {
                nome: 'Sophia_estudiosa.png',
                tamanho: '34264'
            },
            seguranca: 'Somente Baixar',
            resumoAtividade: faker.lorem.sentence(22),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:01'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeArquivos, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)
        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 7. CRUD atividade do tipo "Questionário"
     * 
     * @description
     * Testa o fluxo de criação, leitura, atualização e exclusão de uma atividade do tipo "Questionário", mantendo o mesmo
     * tipo de atividade para todos os testes.
     * 
     * @steps
     * 1. Acessa as atividades do catálogo.
     * 2. Adiciona uma atividade (default: texto).
     * 3. Salva as alterações na estrutura de atividades.
     * 4. Edita a atividade default criada e preenche com os dados do teste.
     * 5. Salva a atualização da atividade.
     * 6. Edita a atividade e valida os dados.
     * 7. Atualiza os dados da atividade.
     * 8. Edita a atividade atualizada e valida os dados.
     * 9. Exclui a atividade.
     * 
     * @expected
     * Espera-se que a atividade seja criada, editada, atualizada e excluída com sucesso.
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
     * Catálogo, CRUD, Atividade, Questionário
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('7. CRUD atividade do tipo "Questionário"', () => {
        // Massa de dados para criação de atividade
        const dados = {
            tipoAtividade: 'Questionário',
            selecionarQuestionario: faker.lorem.sentence(3)
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
        cy.editarAtividade(nomeConteudo, atividadeDefault)

        let dadosParaValidar = { ...formAtividadeQuestionario, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            exibicaoPerguntas: 'Exibir perguntas diferentes a cada tentativa',
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

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)

        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 8. CRUD atividade do tipo "Scorm"
     * 
     * @description
     * Testa o fluxo de criação, leitura, atualização e exclusão de uma atividade do tipo "Scorm", mantendo o mesmo
     * tipo de atividade para todos os testes.
     * 
     * @steps
     * 1. Acessa as atividades do catálogo.
     * 2. Adiciona uma atividade (default: texto).
     * 3. Salva as alterações na estrutura de atividades.
     * 4. Edita a atividade default criada e preenche com os dados do teste.
     * 5. Salva a atualização da atividade.
     * 6. Edita a atividade e valida os dados.
     * 7. Atualiza os dados da atividade.
     * 8. Edita a atividade atualizada e valida os dados.
     * 9. Exclui a atividade.
     * 
     * @expected
     * Espera-se que a atividade seja criada, editada, atualizada e excluída com sucesso.
     * 
     * @priority
     * Alta
     * 
     * @type
     * Regressão - CRUD - E2E
     * 
     * @time
     * 2m
     * 
     * @tags
     * Catálogo, CRUD, Atividade, Scorm
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.verificarProcessamentoScorm(nomeConteudo, atividadeDefault, tipoConteudo)

        let dadosParaValidar = { ...formAtividadeScorm, ...dados }
        cy.validarDadosAtividade(dadosParaValidar)   
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            enviarScorm: 'teste_scorm2.zip',
            descricaoArquivoScorm: {
                nome: 'teste_scorm2.zip',
                tamanho: '8,3 MB'
            },    
            marcarConcluidoScorm: true,
            resumoAtividade: faker.lorem.sentence(19)
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)
        cy.verificarProcessamentoScorm(nomeConteudo, dadosUpdate.titulo, tipoConteudo)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)        
     
        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 9. Criar uma atividade default do tipo "Games"
     * 
     * @description
     * Testa o fluxo de criação, leitura, atualização e exclusão de uma atividade do tipo "Games", mantendo o mesmo
     * tipo de atividade para todos os testes.
     * 
     * @steps
     * 1. Acessa as atividades do catálogo.
     * 2. Adiciona uma atividade (default: texto).
     * 3. Salva as alterações na estrutura de atividades.
     * 4. Edita a atividade default criada e preenche com os dados do teste.
     * 5. Salva a atualização da atividade.
     * 6. Edita a atividade e valida os dados.
     * 7. Atualiza os dados da atividade.
     * 8. Edita a atividade atualizada e valida os dados.
     * 9. Exclui a atividade.
     * 
     * @expected
     * Espera-se que a atividade seja criada, editada, atualizada e excluída com sucesso.
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
     * Catálogo, CRUD, Atividade, Games
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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
        cy.editarAtividade(nomeConteudo, atividadeDefault)
        cy.validarDadosAtividade(formAtividadeGames)
        
        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            titulo: nomeAtividade,
            peso: faker.number.int({min: 1, max: 9}),
            liberado: true,
            codigoCompartilhamento: '<iframe src= "https://kahoot.it/challenge/0857294?challenge-id=502fec44-a2dc-4312-807a-65e1d9bc4a4d_1695673333050" width=620 height=280></iframe>',
            resumoAtividade: faker.lorem.sentence(2),
            tempoMinPermanencia: true,
            tempoMinPermanenciaValor: '00:03'
        }

        cy.preencherDadosAtividade(dadosUpdate, {limpar: true})
        formAtividade.salvar()

        // READ - UPDATE
        cy.log('## READ - UPDATE ##')

        // Espera explícita devido ao tempo de atualização da página após salvar
        cy.wait(TIMEOUT_PADRAO)
        cy.editarAtividade(nomeConteudo, dadosUpdate.titulo)

        let dadosParaValidar = { ...formAtividadeGames, ...dadosUpdate }
        cy.validarDadosAtividade(dadosParaValidar)        
        
        // DELETE
        cy.log('## DELETE ##')

        formAtividade.cancelar()
        cy.excluirAtividade(dadosUpdate.titulo)
    })
})