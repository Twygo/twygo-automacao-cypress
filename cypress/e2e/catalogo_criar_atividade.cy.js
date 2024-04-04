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
        seguranca: 'Somente Visualizar',
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    let formAtividadeVideo = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Vídeo',
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
        youtube: 'checked',
        vimeo: 'unchecked',
        eventials: 'unchecked',
        videoUrl: '',
        marcarConcluidoVideoExterno: false,
        naoMostrarProgressoVideoExterno: false,
        chatTwygo: false,
        desabilitarChatFimTransmissao: false,
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    let formAtividadeArquivo = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Arquivo',
        seguranca: 'Somente Visualizar',
        resumoAtividade: '',
        tempoMinPermanencia: false
    }

    let formAtividadeQuestionario = {
        titulo: 'Novo 1',
        peso: 1,
        liberado: false,
        tipoAtividade: 'Questionário',
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

    it('Criar uma atividade default', () => {
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

    it('Criar uma atividade default do tipo "Texto"', () => {    
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
    })

    it('Deve criar uma atividade default do tipo "PDF Estampado"', () => {
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
    })
})