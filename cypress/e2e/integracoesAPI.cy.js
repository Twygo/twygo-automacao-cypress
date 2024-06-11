/// reference types="cypress" />
import { faker, fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'


describe('Integrações com API', () => {
    let nome, sobrenome, email

    before(() => {
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })

        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier"    // Firefox
        ], { ignoreScriptErrors: true })        

        // Configuração de campos customizados
        cy.configTodosCamposCustomizados('Desabilitado')
        cy.configTodosCamposCustomizados('Habilitado')
    })

    beforeEach(function() {
        // Ignora mensagens de erro conhecidas
		cy.ignorarCapturaErros([
		    "Unexpected identifier 'id'"
		])

        // Excluir todas as chaves de API
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgIntegracoes()
        cy.excluirTodasChavesApi()      // Necessário excluir as chaves de API antes dos usuários devido a um BUG

        // Exclui todos os usuários antes de iniciar o teste
        getAuthToken()
        cy.excluirUsuarioViaApi()        

        // Cria usuário administrador
        nome = faker.person.firstName()
        sobrenome = faker.person.lastName()
        email = faker.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

        const usuario = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            perfilAdministrador: true
        }
        cy.criarUsuario(usuario)
    })

    afterEach(() => {
		cy.ativarCapturaErros()
	})

    it('1. CRUD - Criação da chave de API para usuário default', () => {
        //Massa de dados
        const dados = {
            nome: faker.lorem.words(2),
        }

        const dadosAdicionais = {
            usuarioAssociado: `${Cypress.env('username')} <${Cypress.env('login')}>`,
            chaveDeApi: true
        }

        //CREATE
        cy.log('## CREATE ##')

        cy.acessarPgIntegracoes()
        cy.adicionarChaveApi()
        cy.preencherIntegracaoApi(dados, { limpar: true })
        cy.salvarChaveApi('Criação')

        //READ
        cy.log('## READ ##')

        cy.validarTabelaIntegracoes(dados.nome, 'Ativada', 'Criação')
        cy.editarChave(dados.nome)

        let dadosParaValidar = { ...dados, ...dadosAdicionais }
        cy.validarDadosIntegracoes(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para atualização
        const dadosUpdate = {
            nome: faker.lorem.words(2),
            // usuarioAssociado: `${nome} ${sobrenome} <${email}>`,         // Na edição está com BUG e não está salvando o usuário associado
            chaveDeApi: true
        }

        cy.preencherIntegracaoApi(dadosUpdate, { limpar: true })
        cy.salvarChaveApi('Edição')

        cy.alterarSituacaoChave(dadosUpdate.nome, 'Inativo')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.validarTabelaIntegracoes(dadosUpdate.nome, 'Desativada', 'Criação')
        cy.editarChave(dadosUpdate.nome)
        cy.validarDadosIntegracoes(dadosUpdate)

        //DELETE
        cy.log('## DELETE ##')

        cy.acessarPgIntegracoes()
        cy.excluirChave(dadosUpdate.nome)
        cy.validarTabelaIntegracoes(dadosUpdate, null, 'Exclusão')
    })

    it('2. CRUD - Criação da chave de API para outro usuário administrador', () => {
        //Massa de dados
        const dados = {
            nome: faker.lorem.words(2),
            usuarioAssociado: `${nome} ${sobrenome} <${email}>`
        }

        const dadosAdicionais = {
            chaveDeApi: true
        }

        //CREATE
        cy.log('## CREATE ##')

        cy.acessarPgIntegracoes()
        cy.adicionarChaveApi()
        cy.preencherIntegracaoApi(dados, { limpar: true })
        cy.salvarChaveApi('Criação')

        //READ
        cy.log('## READ ##')

        cy.validarTabelaIntegracoes(dados.nome, 'Ativada', 'Criação')
        cy.editarChave(dados.nome)

        let dadosParaValidar = { ...dados, ...dadosAdicionais }
        cy.validarDadosIntegracoes(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para atualização
        const dadosUpdate = {
            nome: faker.lorem.words(2),
            chaveDeApi: true
        }

        cy.preencherIntegracaoApi(dadosUpdate, { limpar: true })
        cy.salvarChaveApi('Edição')

        cy.alterarSituacaoChave(dadosUpdate.nome, 'Inativo')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.validarTabelaIntegracoes(dadosUpdate.nome, 'Desativada', 'Criação')
        cy.editarChave(dadosUpdate.nome)
        cy.validarDadosIntegracoes(dadosUpdate)

        //DELETE
        cy.log('## DELETE ##')

        cy.acessarPgIntegracoes()
        cy.excluirChave(dadosUpdate.nome)
        cy.validarTabelaIntegracoes(dadosUpdate, null, 'Exclusão')
    })

})