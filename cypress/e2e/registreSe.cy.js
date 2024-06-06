///reference types="cypress" />
import { faker, fakerPT_BR } from '@faker-js/faker'
import { gerarTelefone, gerarCEP } from '../support/utilsHelper'
import formLogin from '../support/pageObjects/formLogin'
let fakerbr = require('faker-br')

describe('Registre-se', () => {
    let senha, nome, sobrenome

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

        // SuperAdmin - Marcar campos como obrigatórios para serem exibidos no formulário
       
        // Gerar senha, nome e sobrenome
        senha = faker.internet.password()
        nome = faker.person.firstName()
        sobrenome = faker.person.lastName()
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it('1. Registre-se', () => {
        //Massa de dados para criação do usuario
        const dados = {
            nome: nome,
            sobrenome: sobrenome,
            idioma: 'Português',
            email: faker.internet.email({ firstName: nome, lastName: sobrenome, provider: 'teste.automatizado.com' }).toLowerCase(),
            cpf: fakerbr.br.cpf(),
            telPessoal: gerarTelefone('fixo'),
            celular: gerarTelefone('celular'),
            rg: faker.number.int( { min: 100000000, max: 999999999 } ),
            cep: gerarCEP(),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: faker.number.int( { min: 1, max: 9999 } ),
            complemento: faker.word.words(2),
            cidade: fakerPT_BR.location.city(),
            bairro: fakerPT_BR.word.words(1),
            estado: fakerPT_BR.location.state(),
            pais: fakerPT_BR.location.country(),
            empresa: faker.company.name(),
            ramo: faker.commerce.department(),
            nrColaboradores: faker.number.int( { min: 1, max: 9999 } ),
            cargo: faker.commerce.department(),
            senha: senha,
            confirmarSenha: senha,
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

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosUsuario(dados)

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

        const dadosUpdate = {
            nome: fakerPT_BR.person.firstName(),
            sobrenome: fakerPT_BR.person.lastName(),
            rg: fakerPT_BR.number.int({ min: 100000, max: 999999999 }),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: fakerPT_BR.location.state(),
            pais: 'Bósnia-Herzegovina',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '31 - 100',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
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