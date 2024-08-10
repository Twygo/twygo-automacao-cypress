///reference types="cypress" />
import { fakerPT_BR, faker } from "@faker-js/faker"
import { getAuthToken } from '../support/authHelper'
let fakerbr = require('faker-br')

describe('Configuração de Usuário', () => {
    let nome, sobrenome, email, senha, nomeCompleto

    before(() => {
        // Configuração de campos customizados
        cy.configTodosCamposCustomizados('Desabilitado')
        cy.configTodosCamposCustomizados('Habilitado')
        cy.configurarNrColaboradores()
    })

    beforeEach(() => {
        // Gerar dados aleatórios para o usuário
        nome = faker.person.firstName()
        sobrenome = faker.person.lastName()
        email = `${nome}.${sobrenome}@testetwygo.com`.toLowerCase()
        senha = faker.internet.password()
        nomeCompleto = `${nome} ${sobrenome}`
                
        getAuthToken()
        cy.excluirUsuarioViaApi()
    })
    
    it('1. CRUD alterar os dados de usuário aluno e idioma para inglês', () => {
        // Massa de dados para criação do usuário
        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.criarUsuario(dados)
        cy.resetSenhaUsuario(nomeCompleto, senha)        

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(nomeCompleto)
        cy.validarDadosUsuario(dados)

        // UPDATE
		cy.log('## UPDATE ##')

        // Massa de dados à serem alterados
        const dadosUpdate = {
            nome: fakerPT_BR.person.firstName(),
            sobrenome: fakerPT_BR.person.lastName(),
            cpf: fakerbr.br.cpf(),
            rg: fakerbr.br.rg(),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            idioma: 'Inglês',
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: fakerPT_BR.location.state(),
            pais: 'Jordânia',
            empresa: fakerPT_BR.company.name(),
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            nrColaboradores: '> 500',
            ramo: fakerPT_BR.lorem.words(1)
        }

        cy.logout()
		cy.primeiroLogin(email, senha, nomeCompleto)
        cy.configUsuario()
        cy.preencherDadosConfigUsuario(dadosUpdate, { limpar: true } )
        cy.salvarConfigUsuario()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        const dadosEspecificos = {
            idioma: 'English',
            pais: 'JO'
        }

        cy.configUsuario('en')

        const dadosParaValidar = { ...dados, ...dadosUpdate, ...dadosEspecificos }
        cy.validarDadosConfigUsuario(dadosParaValidar)

        // INATIVAR
        cy.log('## INATIVAR ##')

        cy.logout('en')
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.inativarUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
    })

    it('2. CRUD alterar os dados de usuário instrutor e idioma para espanhol', () => {
        // Massa de dados para criação do usuário
        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            cpf: fakerbr.br.cpf(),
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: fakerPT_BR.location.state(),
            pais: 'Austrália',
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            empresa: fakerPT_BR.company.name(),
            site: fakerPT_BR.internet.url(),
            cargo: fakerPT_BR.person.jobTitle(),
            nrColaboradores: '> 500',
            ramo: fakerPT_BR.lorem.words(1),
            perfilInstrutor: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.criarUsuario(dados)
        cy.resetSenhaUsuario(nomeCompleto, senha)        

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(nomeCompleto)
        cy.validarDadosUsuario(dados)

        // UPDATE
		cy.log('## UPDATE ##')

        // Massa de dados à serem alterados
        const dadosUpdate = {
            rg: fakerbr.br.rg(),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            idioma: 'Espanhol',
            endereco: fakerPT_BR.location.streetAddress(),
            complemento: '',
            telComercial: '',
            empresa: '',
            site: '',
            cargo: '',
            nrColaboradores: '',
            ramo: ''
        }

        cy.logout()
		cy.primeiroLogin(email, senha, nomeCompleto)
        cy.configUsuario()
        cy.preencherDadosConfigUsuario(dadosUpdate, { limpar: true } )
        cy.salvarConfigUsuario()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        const dadosEspecificos = {
            idioma: 'Español',
            pais: 'AU'
        }

        cy.configUsuario('es')

        // Remove campo perfilInstrutor dos dados para validação
        const { perfilInstrutor, ...dadosUpdateSemPerfilInstrutor } = dados
        const dadosParaValidar = { ...dadosUpdateSemPerfilInstrutor, ...dadosUpdate, ...dadosEspecificos }
        cy.validarDadosConfigUsuario(dadosParaValidar)

        // INATIVAR
        cy.log('## INATIVAR ##')

        cy.logout('es')
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.inativarUsuario(`${dados.nome} ${dados.sobrenome}`)
    })

    it('3. CRUD alterar os dados de usuário gestor e idioma para inglês e depois português', () => {
        // Massa de dados para criação do usuário
        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            cpf: fakerbr.br.cpf(),
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: fakerPT_BR.location.state(),
            pais: 'CW',
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            empresa: fakerPT_BR.company.name(),
            site: fakerPT_BR.internet.url(),
            cargo: fakerPT_BR.person.jobTitle(),
            nrColaboradores: '> 500',
            ramo: fakerPT_BR.lorem.words(1),
            perfilGestor: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.criarUsuario(dados)
        cy.resetSenhaUsuario(nomeCompleto, senha)        

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(nomeCompleto)
        cy.validarDadosUsuario(dados)

        // UPDATE
		cy.log('## UPDATE ##')

        // Massa de dados à serem alterados
        const dadosUpdate = {
            rg: fakerbr.br.rg(),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            idioma: 'Inglês',
            endereco: fakerPT_BR.location.streetAddress(),
            complemento: '',
            telComercial: '',
            empresa: '',
            site: '',
            cargo: '',
            nrColaboradores: '',
            ramo: ''
        }

        cy.logout()
		cy.primeiroLogin(email, senha, nomeCompleto)
        cy.configUsuario()
        cy.preencherDadosConfigUsuario(dadosUpdate, { limpar: true } )
        cy.salvarConfigUsuario()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        const dadosEspecificos = {
            idioma: 'English',
            pais: 'CW'
        }

        cy.configUsuario('en')

        // Remove campo perfilGestor dos dados para validação
        const { perfilGestor, ...dadosUpdateSemPerfilGestor } = dados
        const dadosParaValidar = { ...dadosUpdateSemPerfilGestor, ...dadosUpdate, ...dadosEspecificos }
        cy.validarDadosConfigUsuario(dadosParaValidar)

        // Alterar idioma para português
        const dadosUpdatePt = {
            idioma: 'Portuguese'
        }

        cy.preencherDadosConfigUsuario(dadosUpdatePt)
        cy.salvarConfigUsuario('en')

        // INATIVAR
        cy.log('## INATIVAR ##')

        cy.logout()
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.inativarUsuario(`${dados.nome} ${dados.sobrenome}`)
    })

    it('4. CRUD alterar os dados de usuário administrador sem alterar idioma', () => {
        // Massa de dados para criação do usuário
        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            cpf: fakerbr.br.cpf(),
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: fakerPT_BR.location.state(),
            pais: 'Suécia',
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            empresa: fakerPT_BR.company.name(),
            site: fakerPT_BR.internet.url(),
            cargo: fakerPT_BR.person.jobTitle(),
            nrColaboradores: '> 500',
            ramo: fakerPT_BR.lorem.words(1),
            perfilAdministrador: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.criarUsuario(dados)
        cy.resetSenhaUsuario(nomeCompleto, senha)        

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(nomeCompleto)
        cy.validarDadosUsuario(dados)

        // UPDATE
		cy.log('## UPDATE ##')

        // Massa de dados à serem alterados
        const dadosUpdate = {
            rg: fakerbr.br.rg(),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            complemento: '',
            site: '',
            cargo: '',
            ramo: ''
        }

        cy.logout()
		cy.primeiroLogin(email, senha, nomeCompleto)
        cy.configUsuario()
        cy.preencherDadosConfigUsuario(dadosUpdate, { limpar: true } )
        cy.salvarConfigUsuario()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        const dadosEspecificos = {
            idioma: 'Português',
            pais: 'SE'
        }

        cy.configUsuario()

        // Remove campo perfilAdministrador dos dados para validação
        const { perfilAdministrador, ...dadosUpdateSemPerfilAdministrador } = dados
        const dadosParaValidar = { ...dadosUpdateSemPerfilAdministrador, ...dadosUpdate, ...dadosEspecificos }
        cy.validarDadosConfigUsuario(dadosParaValidar)

        // INATIVAR
        cy.log('## INATIVAR ##')

        cy.logout()
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.inativarUsuario(`${dados.nome} ${dados.sobrenome}`)
    })
})