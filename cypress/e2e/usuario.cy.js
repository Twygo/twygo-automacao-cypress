/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
import formUsuarios from '../support/pageObjects/formUsuarios'
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
		// Carrega os labels do arquivo JSON
		cy.fixture('labels.json').then((labels) => {
			Cypress.env('labels', labels)
		})
	})
    
    beforeEach(() => {
        // Obtém token autenticação, lista e exclui os usuários
        getAuthToken()
        cy.excluirUsuarioViaApi()
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 1. CRUD usuário default
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um usuário com os dados padrões obrigatórios (nome, sobrenome e email). 
     * A atualização consiste em alterar todos os campos do usuário, exceto o email. Neste cenário, também é alterada a senha do usuário, 
     * realizada a inativação e ativação do usuário, para depois excluí-lo.
     * 
     * @steps
     * 1. Cria um usuário com os dados padrões obrigatórios (nome, sobrenome e email)
     * 2. Confirma os dados do usuário criado
     * 3. Atualiza os dados do usuário, exceto o email
     * 4. Confirma os dados do usuário atualizado
     * 5. Altera a senha do usuário
     * 6. Inativa o usuário
     * 7. Ativa o usuário
     * 8. Exclui o usuário
     * 
     * @expected
     * Espera-se que o usuário seja criado, atualizado, inativado, ativado e excluído com sucesso. Assim como a senha alterada.
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
     * Usuário, Default, CRUD, Alterar senha, Inativar, Ativar
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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
        const formulario = new formUsuarios()
        const senha = fakerPT_BR.internet.password()
        formulario.voltar()
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

    /** DOCUMENTAÇÃO:
     * @name
     * 2. CRUD usuário com todos os perfis (colaborador, líder de equipe, administrador, instrutor e gestor)
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um usuário com todos os perfis (colaborador, líder de equipe, administrador,
     * instrutor e gestor). Neste cenário também é alterada a senha do usuário, realizada a inativação e ativação do usuário, para depois
     * atualizá-lo. Na edição são alterados todos os campos do usuário, exceto o email para depois excluí-lo.
     * 
     * @steps
     * 1. Cria um usuário com todos os perfis (colaborador, líder de equipe, administrador, instrutor e gestor)
     * 2. Confirma os dados do usuário criado
     * 3. Altera a senha, inativa e ativa o usuário
     * 4. Atualiza os dados do usuário, exceto o email
     * 5. Confirma os dados do usuário atualizado
     * 6. Exclui o usuário
     * 
     * @expected
     * Espera-se que o usuário seja criado, inativado, ativado, atualizado e excluído com sucesso. Assim como a senha alterada.
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
     * Usuário, Colaborador, Líder de equipe, Administrador, Instrutor, Gestor, CRUD, Alterar senha, Inativar, Ativar
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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
        const formulario = new formUsuarios()
        const senha = fakerPT_BR.internet.password()
        formulario.voltar()
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

    /** DOCUMENTAÇÃO:
     * @name
     * 3. CRUD usuário somente administrador
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um usuário com o perfil de administrador. Na alteração são alterados dados 
     * e desabilitado o perfil de administrador. Neste cenário também é alterada a senha do usuário, realizada a inativação e ativação do
     * usuário, para depois excluí-lo.
     * 
     * @steps
     * 1. Cria um usuário com o perfil de administrador
     * 2. Confirma os dados do usuário criado
     * 3. Altera alguns dados do usuário e desabilita o perfil de administrador
     * 4. Confirma os dados do usuário atualizado
     * 5. Altera a senha do usuário
     * 6. Inativa o usuário
     * 7. Ativa o usuário
     * 8. Exclui o usuário
     * 
     * @expected
     * Espera-se que o usuário seja criado, atualizado, inativado, ativado e excluído com sucesso. Assim como a senha alterada.
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
     * Usuário, Administrador, CRUD, Alterar senha, Inativar, Ativar
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it.only('3. CRUD usuário somente administrador', () => {
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
        const formulario = new formUsuarios()
        const senha = fakerPT_BR.internet.password()
        formulario.voltar()
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

    /** DOCUMENTAÇÃO:
     * @name
     * 4. CRUD usuário somente líder de equipe
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um usuário com o perfil de líder de equipe. Neste cenário também é alterada a 
     * senha do usuário, realizada a inativação e ativação do usuário, para depois atualizá-lo. Na alteração são adicionados novos dados 
     * e habilitado o perfil de administrador. 
     * 
     * @steps
     * 1. Cria um usuário com o perfil de líder de equipe
     * 2. Confirma os dados do usuário criado
     * 3. Altera a senha, inativa e ativa o usuário
     * 4. Atualiza os dados do usuário, adicionando novos dados e habilitando o perfil de administrador
     * 5. Confirma os dados do usuário atualizado
     * 6. Exclui o usuário
     * 
     * @expected
     * Espera-se que o usuário seja criado, inativado, ativado, atualizado e excluído com sucesso. Assim como a senha alterada.
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
     * Usuário, Líder de equipe, Administrador, CRUD, Alterar senha, Inativar, Ativar
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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
        const formulario = new formUsuarios()
        const senha = fakerPT_BR.internet.password()
        formulario.voltar()
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

    /** DOCUMENTAÇÃO:
     * @name
     * 5. CRUD usuário somente instrutor
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um usuário com o perfil de instrutor. Na alteração são adicionados novos
     * dados e desabilitado comunidades e notificações. Neste cenário também é alterada a senha do usuário, realizada a inativação e ativação
     * do usuário, para depois excluí-lo.
     * 
     * @steps
     * 1. Cria um usuário com o perfil de instrutor
     * 2. Confirma os dados do usuário criado
     * 3. Atualiza os dados do usuário, adicionando novos dados e desabilitando comunidades e notificações
     * 4. Confirma os dados do usuário atualizado
     * 5. Altera a senha do usuário
     * 6. Inativa o usuário
     * 7. Ativa o usuário
     * 8. Exclui o usuário
     * 
     * @expected
     * Espera-se que o usuário seja criado, atualizado, inativado, ativado e excluído com sucesso. Assim como a senha alterada.
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
     * Usuário, Instrutor, CRUD, Alterar senha, Inativar, Ativar
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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
        const formulario = new formUsuarios()
        const senha = fakerPT_BR.internet.password()
        formulario.voltar()
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

    /** DOCUMENTAÇÃO:
     * @name
     * 6. CRUD usuário somente gestor de turma
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um usuário com o perfil de gestor de turma. Na alteração são adicionados novos
     * dados e habilitado o perfil de instrutor. Neste cenário também é alterada a senha do usuário, realizada a inativação e ativação do
     * usuário, para depois atualizá-lo.
     * 
     * @steps
     * 1. Cria um usuário com o perfil de gestor de turma
     * 2. Confirma os dados do usuário criado
     * 3. Altera a senha, inativa e ativa o usuário
     * 4. Atualiza os dados do usuário, adicionando novos dados e habilitando o perfil de instrutor
     * 5. Confirma os dados do usuário atualizado
     * 7. Exclui o usuário
     * 
     * @expected
     * Espera-se que o usuário seja criado, inativado, ativado, atualizado e excluído com sucesso. Assim como a senha alterada.
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
     * Usuário, Gestor de turma, Instrutor, CRUD, Alterar senha, Inativar, Ativar
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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
        const formulario = new formUsuarios()
        const senha = fakerPT_BR.internet.password()
        formulario.voltar()
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

    /** DOCUMENTAÇÃO:
     * @name
     * 7. CRUD usuário somente colaborador
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um usuário com o perfil de colaborador. Na alteração são adicionados novos
     * dados e habilitado o perfil de gestor. Neste cenário também é alterada a senha do usuário, realizada a inativação e ativação do 
     * usuário, para depois excluí-lo.
     * 
     * @steps
     * 1. Cria um usuário com o perfil de colaborador
     * 2. Confirma os dados do usuário criado
     * 3. Atualiza os dados do usuário, adicionando novos dados e habilitando o perfil de gestor
     * 4. Confirma os dados do usuário atualizado
     * 5. Altera a senha do usuário
     * 6. Inativa o usuário
     * 7. Ativa o usuário
     * 8. Exclui o usuário
     * 
     * @expected
     * Espera-se que o usuário seja criado, atualizado, inativado, ativado e excluído com sucesso. Assim como a senha alterada.
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
     * Usuário, Colaborador, Gestor, CRUD, Alterar senha, Inativar, Ativar
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
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
        const formulario = new formUsuarios()
        const senha = fakerPT_BR.internet.password()
        formulario.voltar()
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