/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'
let faker = require('faker-br')

describe('Usuário', () => {
    // Formulário default
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
        // Configuração de campos customizados
        cy.configTodosCamposCustomizados('Desabilitado')
        cy.configTodosCamposCustomizados('Habilitado')
        cy.configurarNrColaboradores()
	})
    
    beforeEach(() => {
        // Obtém token autenticação, lista e exclui os usuários
        getAuthToken()
        cy.excluirUsuarioViaApi()
    })

    it('1. CRUD usuário default', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.addUsuario()
        cy.preencherDadosUsuario(dados, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosUsuario(dadosParaValidar)

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
            pais: 'Bélgica',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '1 - 10',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            perfilColaborador: true,
            perfilAdministrador: true,
            perfilInstrutor: true,
            perfilGestor: true,
            perfilLiderEquipe: true,
            comunidades: false,
            notificacoes: false            
        }

        cy.preencherDadosUsuario(dadosUpdate, { limpar: true })
        cy.salvarUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarUsuario(dadosUpdate.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosUsuario(dadosUpdate)

        // Alterar senha do usuário
        const senha = fakerPT_BR.internet.password()
        cy.voltar()
        cy.resetSenhaUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, senha)

        // Inativação do usuário
        cy.inativarUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

        // Espera 5 segundos devido a renderização da tela
        cy.wait(5000)

        // Ativação do usuário
        cy.ativarUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

        // DELETE
		cy.log('## DELETE ##')

		cy.excluirUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
    })

    it('2. CRUD usuário com todos os perfis (colaborador, líder de equipe, administrador, instrutor e gestor)', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            cpf: faker.br.cpf(),
            rg: fakerPT_BR.number.int({ min: 100000, max: 100000000 }),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: fakerPT_BR.location.state(),
            pais: 'França',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '11 - 30',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            perfilColaborador: true,
            perfilAdministrador: true,
            perfilInstrutor: true,
            perfilGestor: true,
            perfilLiderEquipe: true
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.addUsuario()
        cy.preencherDadosUsuario(dados, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosUsuario(dadosParaValidar)

        // Alterar senha do usuário
        const senha = fakerPT_BR.internet.password()
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

    it('3. CRUD usuário somente administrador', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            cpf: faker.br.cpf(),
            rg: fakerPT_BR.number.int({ min: 100000, max: 100000000 }),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: fakerPT_BR.location.state(),
            pais: 'França',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '101 - 500',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            perfilAdministrador: true
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.addUsuario()
        cy.preencherDadosUsuario(dados, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosUsuario(dadosParaValidar)

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
            pais: 'àustria',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '> 500',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            perfilAdministrador: false,
            comunidades: false,
            notificacoes: false            
        }

        cy.preencherDadosUsuario(dadosUpdate, { limpar: true })
        cy.salvarUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarUsuario(dadosUpdate.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosUsuario(dadosParaValidar)
        
        // Alterar senha do usuário
        const senha = fakerPT_BR.internet.password()
        cy.voltar()
        cy.resetSenhaUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, senha)

        // Inativação do usuário
        cy.inativarUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

        // Espera 5 segundos devido a renderização da tela
        cy.wait(5000)

        // Ativação do usuário
        cy.ativarUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)        

		// DELETE
		cy.log('## DELETE ##')

		cy.excluirUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
    })

    it('4. CRUD usuário somente líder de equipe', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            cpf: faker.br.cpf(),
            pais: 'Guernsey',
            empresa: fakerPT_BR.company.name(),
            nrColaboradores: '> 500',
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            perfilLiderEquipe: true
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.addUsuario()
        cy.preencherDadosUsuario(dados, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosUsuario(dadosParaValidar)

        // Alterar senha do usuário
        const senha = fakerPT_BR.internet.password()
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
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            pais: 'BQ',
            perfilAdministrador: true,
            comunidades: false,
            notificacoes: false            
        }

        cy.editarUsuario(dados.nome)
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

    it('5. CRUD usuário somente instrutor', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            perfilInstrutor: true
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.addUsuario()
        cy.preencherDadosUsuario(dados, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosUsuario(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            cpf: faker.br.cpf(),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            pais: 'Pitcairn',
            cargo: fakerPT_BR.person.jobTitle(),
            comunidades: false,
            notificacoes: false            
        }

        cy.preencherDadosUsuario(dadosUpdate, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarUsuario(dados.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosUsuario(dadosParaValidar)

        // Alterar senha do usuário
        const senha = fakerPT_BR.internet.password()
        cy.voltar()
        cy.resetSenhaUsuario(`${dados.nome} ${dados.sobrenome}`, senha)

        // Inativação do usuário
        cy.inativarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // Espera 5 segundos devido a renderização da tela
        cy.wait(5000)

        // Ativação do usuário
        cy.ativarUsuario(`${dados.nome} ${dados.sobrenome}`)        

		// DELETE
		cy.log('## DELETE ##')

		cy.excluirUsuario(`${dados.nome} ${dados.sobrenome}`)
    })

    it('6. CRUD usuário somente gestor de turma', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            perfilGestor: true
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.addUsuario()
        cy.preencherDadosUsuario(dados, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosUsuario(dadosParaValidar)

        // Alterar senha do usuário
        const senha = fakerPT_BR.internet.password()
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
            cpf: faker.br.cpf(),
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: fakerPT_BR.location.state(),
            pais: 'Ilhas Menores Distantes dos Estados Unidos',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            perfilInstrutor: true,
            comunidades: false,
            notificacoes: false            
        }

        cy.editarUsuario(dados.nome)
        cy.preencherDadosUsuario(dadosUpdate, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarUsuario(dados.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosUsuario(dadosParaValidar)

		// DELETE
		cy.log('## DELETE ##')

		cy.cancelarFormularioUsuario()
		cy.excluirUsuario(`${dados.nome} ${dados.sobrenome}`)
    })

    it('7. CRUD usuário somente colaborador', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            perfilColaborador: true,
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.addUsuario()
        cy.preencherDadosUsuario(dados, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarUsuario(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosUsuario(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            cpf: faker.br.cpf(),
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
            pais: 'Bélgica',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '> 500',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            perfilGestor: true,
            comunidades: false,
            notificacoes: false            
        }

        cy.preencherDadosUsuario(dadosUpdate, { limpar: true })
        cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarUsuario(dados.nome)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosUsuario(dadosParaValidar)

        // Alterar senha do usuário
        const senha = fakerPT_BR.internet.password()
        cy.voltar()
        cy.resetSenhaUsuario(`${dados.nome} ${dados.sobrenome}`, senha)

        // Inativação do usuário
        cy.inativarUsuario(`${dados.nome} ${dados.sobrenome}`)

        // Espera 5 segundos devido a renderização da tela
        cy.wait(5000)

        // Ativação do usuário
        cy.ativarUsuario(`${dados.nome} ${dados.sobrenome}`)        

		// DELETE
		cy.log('## DELETE ##')

		cy.excluirUsuario(`${dados.nome} ${dados.sobrenome}`)
    })
})