///reference types="cypress" />
import { faker, fakerPT_BR } from '@faker-js/faker'
import { gerarTelefone, gerarCEP } from '../support/utilsHelper'
import { gerarDados } from '../support/helpers/geradorDados'
import { getAuthToken } from '../support/authHelper'
import formSuperAdmin from '../support/pageObjects/formSuperAdmin'
let fakerbr = require('faker-br')

describe('Registre-se', () => {
    let gerarSenha, nome, sobrenome

    let formDefault = {
        email: '',
        nome: '',
        sobrenome: '',
        cpf: '',
        rg: '',
        telPessoal: '',
        celular: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: 'Brasil',
        empresa: '',
        ramo: '',
        nrColaboradores: '',
        site: '',
        telComercial: '',
        cargo: '',
        area: '',
        perfilColaborador: false,
        perfilAdministrador: false,
        perfilInstrutor: false,
        perfilGestor: false,
        perfilLiderEquipe: false,
        comunidades: true,
        notificacoes: true
    }

    before(() => {
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'"
        ])

        // Configura todos os campos omo obrigatórios
        cy.configTodosCamposObrigatorios()

        // Obtém token autenticação, lista e exclui os usuários
        getAuthToken()
        cy.excluirUsuarioViaApi()
       
        // Gerar senha, nome e sobrenome
        gerarSenha = gerarDados('senha')
        nome = gerarDados('nome')
        sobrenome = gerarDados('sobrenome')
    })

    afterEach(() => {
        // Desabilita todos os campos customizados
        cy.configNenhumCampoHabilitado()

        // Ativa captura de erros
        cy.ativarCapturaErros()
    })

    it('1. Registre-se', () => {
        //Massa de dados para criação do usuario
        const dados = {
            nome: nome,
            sobrenome: sobrenome,
            idioma: 'Português',
            email: gerarDados('email', nome, sobrenome),
            cpf: gerarDados('cpf'),
            telPessoal: gerarTelefone('fixo'),
            celular: gerarTelefone('celular'),
            rg: gerarDados('rg'),
            cep: gerarCEP(),
            endereco: gerarDados('endereco'),
            numero: gerarDados('numero'),
            complemento: gerarDados('complemento'),
            cidade: gerarDados('cidade'),
            bairro: gerarDados('bairro'),
            estado: gerarDados('estado'),
            pais: gerarDados('pais'),
            empresa: gerarDados('empresa'),
            ramo: gerarDados('ramo'),
            nrColaboradores: gerarDados('nrColaboradores'),
            cargo: gerarDados('cargo'),
            senha: gerarSenha,
            confirmarSenha: gerarSenha,
            aceiteTermosPolitica: true
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.visit('/users/sign_up')

        cy.preencherDadosRegistreSe(dados)
        cy.validarDadosRegistreSe(dados)        // Validação no formulário antes de salvar
        cy.salvarRegistreSe()               

        // READ
        cy.log('## READ ##')

        cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()

        cy.editarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // Combina formDefault e dados em um novo objeto dadosParaValidar, removendo 'idioma'
        let { idioma, senha, confirmarSenha, aceiteTermosPolitica, ...dadosParaValidar } = { ...formDefault, ...dados }
        cy.validarDadosUsuario(dadosParaValidar)

        // Alterar senha do usuário
        senha = fakerPT_BR.internet.password()
        cy.voltar()
        cy.resetSenhaUsuario(`${dados.nome} ${dados.sobrenome}`, senha)

        // Inativação do usuário
        cy.inativarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // Espera 5 segundos devido a renderização da tela
        cy.wait(5000)

        // Ativação do usuário
        cy.ativarUsuario(`${dados.nome} ${dados.sobrenome}`)        

        // UPDATE
        cy.log('## UPDATE ##')

        const nomeUpdate = gerarDados('nome')
        const sobrenomeUpdate = gerarDados('sobrenome')

        const dadosUpdate = {
            nome: nomeUpdate,
            sobrenome: sobrenomeUpdate,
            rg: gerarDados('rg'),
            telPessoal: gerarTelefone('fixo'),
            celular: gerarTelefone('celular'),
            cep: gerarCEP(),
            endereco: gerarDados('endereco'),
            numero: gerarDados('numero'),
            complemento: gerarDados('complemento'),
            bairro: gerarDados('bairro'),
            cidade: gerarDados('cidade'),
            estado: gerarDados('estado'),
            pais: gerarDados('pais'),
            empresa: gerarDados('empresa'),
            ramo: gerarDados('ramo'),
            nrColaboradores: gerarDados('nrColaboradores'),
            site: gerarDados('site'),
            telComercial: gerarDados('telefone', 'fixo'),
            cargo: gerarDados('cargo'),
            area: gerarDados('area'),
            perfilColaborador: false,
            perfilAdministrador: false,
            perfilInstrutor: false,
            perfilGestor: false,
            perfilLiderEquipe: false,
            comunidades: false,
            notificacoes: false            
        }

        cy.editarUsuario(`${dados.nome} ${dados.sobrenome}`)
        cy.preencherDadosUsuario(dadosUpdate, { limpar: true })
        cy.salvarUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarUsuario(dadosUpdate.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosUsuario(dadosParaValidar)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioUsuario()
		cy.excluirUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
    })
})