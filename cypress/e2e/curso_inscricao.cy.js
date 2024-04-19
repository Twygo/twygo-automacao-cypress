/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'
import { gerarData } from '../support/utils_helper'
let faker = require('faker-br')

describe('Participante', () => {
    // Formulário default
    let formDefault = {
        email: '',
        nome: '',
        sobrenome: '',
        cpf: '',
        rg: '',
        telPessoal: '',
        celular: '',
        dataExpiracao: '',
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
        observacao: '',
        novaSenha: '',
        confirmacaoSenha: ''
    }

    let nomeCurso, descricaoCurso = ''
    let body = {}
    
    before(() => {
		// Carrega os labels do arquivo JSON
		cy.fixture('labels.json').then((labels) => {
			Cypress.env('labels', labels)
		})
	})
    
    beforeEach(() => {
        // Ativa o tratamento de exceção não capturada especificamente para este teste
		Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })

        // Obtém token autenticação, lista e exclui os usuários e cursos
        getAuthToken()
        cy.excluirUsuarioViaApi()
        cy.excluirCursoViaApi()

        // Cria um curso via API para execução dos testes de inscrição de participantes
        nomeCurso = fakerPT_BR.commerce.productName()
        descricaoCurso = fakerPT_BR.lorem.sentence(5)

        body = {
            name: nomeCurso,
            description: descricaoCurso
        }
        
        cy.criarCursoViaApi(body)
    })

    afterEach(() => {
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})

    /** DOCUMENTAÇÃO:
     * @name
     * 1. CRUD participante default
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um participante com os dados padrões obrigatórios (nome, sobrenome e email). 
     * A atualização consiste em alterar todos os campos do participante, exceto o email e configurar a senha do participante.
     * 
     * @steps
     * 1. Cria um participante com os dados padrões obrigatórios (nome, sobrenome e email)
     * 2. Confirma os dados do participante criado
     * 3. Atualiza os dados do participante, exceto o email, configurando inclusive a senha
     * 4. Confirma os dados do participante atualizado
     * 5. Exclui o participante
     * 
     * @expected
     * Espera-se que o participante seja criado, atualizado, tenha a senha configura e que seja excluído com sucesso.
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
     * Participante, Default, CRUD, Configurar senha
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('1. CRUD participante default', () => {
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
        cy.addParticipanteConteudo(nomeCurso)
        cy.addParticipante()
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosParticipante(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')
        const senha = fakerPT_BR.internet.password()
        const dadosUpdate = {
            nome: fakerPT_BR.person.firstName(),
            sobrenome: fakerPT_BR.person.lastName(),
            rg: fakerPT_BR.number.int({ min: 100000, max: 999999999 }),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            dataExpiracao: gerarData(0, 1, 0),
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: 'Minas Gerais',
            pais: 'Bahamas',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '> 500',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            observacao: fakerPT_BR.lorem.words(5),
            novaSenha: senha,
            confirmacaoSenha: senha
        }

        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosParticipante(dadosUpdate)

        // DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 2. CRUD participante com todos os campos preenchidos
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um participante criado com todos os campos preenchidos, inclusive com 
     * a configuração de senha. Na edição são alterados todos os campos do participante, exceto o email. Neste cenário também é alterada a senha.
     * 
     * @steps
     * 1. Cria um participante com todos os campos preenchidos, incluindo a configuração de senha
     * 2. Confirma os dados do participante criado
     * 3. Atualiza os dados do participante, exceto o email, alterando inclusive a senha
     * 4. Confirma os dados do participante atualizado
     * 5. Exclui o participante
     * 
     * @expected
     * Espera-se que o participante seja criado, atualizado e excluído com sucesso. Assim como a senha alterada.
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
     * Participante, CRUD, Configurar senha
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('2. CRUD participante com todos os campos preenchidos', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()
        let senha = fakerPT_BR.internet.password()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            cpf: faker.br.cpf(),
            rg: fakerPT_BR.number.int({ min: 100000, max: 100000000 }),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            dataExpiracao: gerarData(0, 3, 1),
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: 'Paraná',
            pais: 'França',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '11 - 30',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            observacao: fakerPT_BR.lorem.words(5),
            novaSenha: senha,
            confirmacaoSenha: senha
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addParticipanteConteudo(nomeCurso)
        cy.addParticipante()
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosParticipante(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        senha = fakerPT_BR.internet.password()
        const dadosUpdate = {
            nome: fakerPT_BR.person.firstName(),
            sobrenome: fakerPT_BR.person.lastName(),
            rg: fakerPT_BR.number.int({ min: 100000, max: 999999999 }),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            dataExpiracao: gerarData(15, 2, 0),
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: 'Santa Catarina',
            pais: 'Bósnia-Herzegovina',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '31 - 100',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            observacao: fakerPT_BR.lorem.words(5),
            novaSenha: senha,
            confirmacaoSenha: senha
        }

        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosParticipante(dadosParaValidar)

		// DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 3. CRUD participante com todos os campos preenchidos sem configurar senha
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um participante criado com todos os campos sendo preenchidos, com exceção da senha.
     * Na alteração são alterados alguns campos e configurada a senha.
     * 
     * @steps
     * 1. Cria um participante preenchendo todos os campos, exceto a senha
     * 2. Confirma os dados do participante criado
     * 3. Altera alguns dados do participante e configura a senha
     * 4. Confirma os dados do participante atualizado
     * 5. Exclui o participante
     * 
     * @expected
     * Espera-se que o participante seja criado, atualizado e excluído com sucesso. Assim como a senha alterada.
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
     * Participante, CRUD, Alterar senha
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('3. CRUD participante com todos os campos preenchidos sem configurar senha', () => {
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
            estado: 'Rio Grande do Sul',
            pais: 'França',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '101 - 500',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea()
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addParticipanteConteudo(nomeCurso)
        cy.addParticipante()
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosParticipante(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        let senha = fakerPT_BR.internet.password()
        const dadosUpdate = {
            endereco: fakerPT_BR.location.streetAddress(),
            dataExpiracao: gerarData(0, 3, 0),
            observacao: fakerPT_BR.lorem.words(5),
            novaSenha: senha,
            confirmacaoSenha: senha,
        }

        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dados.nome} ${dados.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosParticipante(dadosParaValidar)
        
		// DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dados.nome} ${dados.sobrenome}`)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 4. CRUD participante com apenas alguns campos preenchidos sem configurar senha
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um participante que não esteja com todos os campos preenchidos e nem configurado a senha.
     * 
     * @steps
     * 1. Cria um participante sem preencher todos os campos obrigatórios e sem configurar a senha
     * 2. Confirma os dados do participante criado
     * 3. Atualiza alguns dados do participante, sem configurar senha
     * 4. Confirma os dados do participante atualizado
     * 5. Exclui o participante
     * 
     * @expected
     * Espera-se que o participante seja criado, atualizado e excluído com sucesso, mesmo que a senha não tenha sido configurada.
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
     * Participante, CRUD
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('4. CRUD participante com apenas alguns campos preenchidos sem configurar senha', () => {
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
            observacao: fakerPT_BR.lorem.words(5)
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addParticipanteConteudo(nomeCurso)
        cy.addParticipante()
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosParticipante(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            nome: fakerPT_BR.person.firstName(),
            sobrenome: fakerPT_BR.person.lastName(),
            rg: fakerPT_BR.number.int({ min: 100000, max: 999999999 }),
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            pais: 'BQ'
        }

        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosParticipante(dadosParaValidar)

		// DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 5. CRUD participante com alguns campos preenchidos sem configurar senha
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um participante que não esteja com todos os campos preenchidos e nem configurado a senha.
     * Na alteração são adicionados alguns dados e removida a observação.
     * 
     * @steps
     * 1. Cria um participante sem preencher todos os campos obrigatórios e sem configurar a senha
     * 2. Confirma os dados do participante criado
     * 3. Atualiza alguns dados do participante, sem configurar senha
     * 4. Confirma os dados do participante atualizado
     * 5. Exclui o participante
     * 
     * @expected
     * Espera-se que o participante seja criado, atualizado e excluído com sucesso, mesmo que a senha não tenha sido configurada.
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
     * Participante, CRUD
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('5. CRUD participante somente instrutor', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            observacao: fakerPT_BR.lorem.words(5)
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addParticipanteConteudo(nomeCurso)
        cy.addParticipante()
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosParticipante(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            cpf: faker.br.cpf(),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            pais: 'Pitcairn',
            cargo: fakerPT_BR.person.jobTitle(),
            observacao: ''
        }

        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dados.nome} ${dados.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosParticipante(dadosParaValidar)

		// DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dados.nome} ${dados.sobrenome}`)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 6. CRUD participante com e-mail, nome, sobrenome, data de expiração e senha
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um participante preenchendo apenas e-mail, nome, sobrenome, data de expiração e senha.
     * Na alteração são adicionados novos dados e removida a data de expiração. 
     * 
     * @steps
     * 1. Cria um participante apenas com e-mail, nome, sobrenome, data de expiração e senha
     * 2. Confirma os dados do participante criado
     * 3. Atualiza os dados do participante, adicionando novos dados
     * 4. Confirma os dados do participante atualizado
     * 5. Exclui o participante
     * 
     * @expected
     * Espera-se que o participante seja criado, atualizado e excluído com sucesso. Assim como a senha configurada.
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
     * Participante, CRUD, Configurar senha
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('6. CRUD participante com e-mail, nome, sobrenome, data de expiração e senha', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()
        let senha = fakerPT_BR.internet.password()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            dataExpiracao: gerarData(0, 12, 0),
            novaSenha: senha,
            confirmacaoSenha: senha
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addParticipanteConteudo(nomeCurso)
        cy.addParticipante()
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosParticipante(dadosParaValidar)

        // UPDATE
        cy.log('## UPDATE ##')

        const dadosUpdate = {
            cpf: faker.br.cpf(),
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            dataExpiracao: '',
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: 'Pernambuco',
            pais: 'Ilhas Menores Distantes dos Estados Unidos',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea()
        }

        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dados.nome} ${dados.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosParticipante(dadosParaValidar)

		// DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dados.nome} ${dados.sobrenome}`)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 7. CRUD participante com e-mail, nome, sobrenome e senha
     * 
     * @description
     * Valida a criação, leitura, atualização e exclusão de um participante criado apenas com e-mail, nome, sobrenome e senha. 
     * Na alteração são adicionados novos dados, sem alterar a senha.
     * 
     * @steps
     * 1. Cria um participante com e-mail, nome, sobrenome e senha
     * 2. Confirma os dados do participante criado
     * 3. Atualiza os dados do participante, adicionando novos dados
     * 4. Confirma os dados do participante atualizado
     * 5. Exclui o participante
     * 
     * @expected
     * Espera-se que o participante seja criado, atualizado e excluído com sucesso.
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
     * Participante, CRUD, Configurar senha
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('7. CRUD participante com e-mail, nome, sobrenome e senha', () => {
        // Massa de dados
        let nome = fakerPT_BR.person.firstName()
        let sobrenome = fakerPT_BR.person.lastName()
        let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()
        let senha = fakerPT_BR.internet.password()

        const dados = {
            email: email,
            nome: nome,
            sobrenome: sobrenome,
            novaSenha: senha,
            confirmacaoSenha: senha
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.addParticipanteConteudo(nomeCurso)
        cy.addParticipante()
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosParticipante(dadosParaValidar)

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
            estado: 'Distrito Federal',
            pais: 'Bélgica',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '> 500',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea()
        }

        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dados.nome} ${dados.sobrenome}`)

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosParticipante(dadosParaValidar)

		// DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dados.nome} ${dados.sobrenome}`)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 8. Altera status de um participante default e atualiza os dados em situação "Cancelado"
     * 
     * @description
     * Valida a alteração de status de um participante default e atualiza os dados em situação "Cancelado".
     * 
     * @steps
     * 1. Cria um participante preenchendo os dados mínimos obrigatórios (nome, sobrenome e e-mail)
     * 2. Confirma os dados do participante criado
     * 3. Altera o status do participante para 'Pendente'
     * 4. Altera o status do participante para 'Confirmado'
     * 5. Altera o status do participante para 'Cancelado'
     * 6. Atualiza os dados do participante em situação 'Cancelado'
     * 7. Confirma os dados do participante atualizado
     * 8. Exclui o participante
     * 
     * @expected
     * Espera-se que o participante seja criado, atualizado e excluído com sucesso, mesmo que esteja na
     * situação 'Cancelado'.
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
     * Participante, CRUD, Alterar status
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it.only('8. Altera status de um participante default e atualiza os dados em situação "Cancelado"', () => {
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
        cy.addParticipanteConteudo(nomeCurso)
        cy.addParticipante()
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosParticipante(dadosParaValidar)
        cy.cancelarFormularioParticipante()

        // Altera status para 'Pendente'
        cy.alteraStatus(`${dados.nome} ${dados.sobrenome}`, 'Pendente')

        // Altera status para 'Confirmado'
        cy.alteraStatus(`${dados.nome} ${dados.sobrenome}`, 'Confirmado')

        // Altera status para 'Cancelado'
        cy.alteraStatus(`${dados.nome} ${dados.sobrenome}`, 'Cancelado')

        // UPDATE
        cy.log('## UPDATE ##')

        const senha = fakerPT_BR.internet.password()
        const dadosUpdate = {
            nome: fakerPT_BR.person.firstName(),
            sobrenome: fakerPT_BR.person.lastName(),
            rg: fakerPT_BR.number.int({ min: 100000, max: 999999999 }),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            dataExpiracao: gerarData(0, 1, 0),
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: 'Minas Gerais',
            pais: 'Bahamas',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '> 500',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            observacao: fakerPT_BR.lorem.words(5),
            novaSenha: senha,
            confirmacaoSenha: senha
        }

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)
        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, 'Cancelados')

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosParticipante(dadosUpdate)

        // DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 9. Altera status de um participante default e atualiza os dados em situação "Pendente"
     * 
     * @description
     * Valida a alteração de status de um participante default e atualiza os dados em situação "Pendente".
     * 
     * @steps
     * 1. Cria um participante preenchendo os dados mínimos obrigatórios (nome, sobrenome e e-mail)
     * 2. Confirma os dados do participante criado
     * 3. Altera o status do participante para 'Cancelado'
     * 4. Altera o status do participante para 'Confirmado'
     * 5. Altera o status do participante para 'Pendente'
     * 6. Atualiza os dados do participante em situação 'Pendente'
     * 7. Confirma os dados do participante atualizado
     * 8. Exclui o participante
     * 
     * @expected
     * Espera-se que o participante seja criado, atualizado e excluído com sucesso, mesmo que esteja na
     * situação 'Pendente'.
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
     * Participante, CRUD, Alterar status
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('9. Altera status de um participante default e atualiza os dados em situação "Pendente"', () => {
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
        cy.addParticipanteConteudo(nomeCurso)
        cy.addParticipante()
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)

        let dadosParaValidar = { ...formDefault, ...dados }
        cy.validarDadosParticipante(dadosParaValidar)
        cy.cancelarFormularioParticipante()

        // Altera status para 'Cancelado'
        cy.alteraStatus(`${dados.nome} ${dados.sobrenome}`, 'Cancelado')

        // Altera status para 'Confirmado'
        cy.alteraStatus(`${dados.nome} ${dados.sobrenome}`, 'Confirmado')

        // Altera status para 'Pendente'
        cy.alteraStatus(`${dados.nome} ${dados.sobrenome}`, 'Pendente')

        // UPDATE
        cy.log('## UPDATE ##')

        const senha = fakerPT_BR.internet.password()
        const dadosUpdate = {
            nome: fakerPT_BR.person.firstName(),
            sobrenome: fakerPT_BR.person.lastName(),
            rg: fakerPT_BR.number.int({ min: 100000, max: 999999999 }),
            telPessoal: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            dataExpiracao: gerarData(0, 1, 0),
            cep: fakerPT_BR.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            numero: fakerPT_BR.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}, Sala: ${fakerPT_BR.number.int( { min: 1, max: 20 } )}`,
            bairro: fakerPT_BR.lorem.words(1),
            cidade: fakerPT_BR.location.city(),
            estado: 'Minas Gerais',
            pais: 'Bahamas',
            empresa: fakerPT_BR.company.name(),
            ramo: fakerPT_BR.lorem.words(1),
            nrColaboradores: '> 500',
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            area: fakerPT_BR.person.jobArea(),
            observacao: fakerPT_BR.lorem.words(5),
            novaSenha: senha,
            confirmacaoSenha: senha
        }

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`)
        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, 'Pendentes')

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
		cy.validarDadosParticipante(dadosUpdate)

        // DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
    })

    /** DOCUMENTAÇÃO:
     * @name
     * 10. Associa 5 participantes em curso que não exige confirmação e altera status individualmente
     * e depois de todos da página atual
     * 
     * @description
     * Valida a associação de 5 participantes em um curso que não exige confirmação e altera o status 
     * de cada um individualmente, após altera o status de todos da página atual.
     * 
     * @steps
     * 1. Cria um curso que não exige confirmação (via API)
     * 2. Cria 5 usuários (via API)
     * 3. Associa os 5 usuários ao curso
     * 4. Altera o status de 2 participantes para 'Pendente'
     * 5. Altera o status de 2 participantes para 'Cancelado'
     * 6. Altera o status de 2 participantes para 'Confirmado'
     * 7. Altera o status dos outros 2 participantes para 'Confirmado'
     * 8. Altera o status de todos os participantes para 'Pendente'
     * 9. Altera o status de todos os participantes para 'Cancelado'
     * 10. Altera o status de todos os participantes para 'Confirmado'
     * 
     * @expected
     * Espera-se que os participantes sejam associados ao curso e que o status seja alterado com sucesso.
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
     * Participante, CRUD, Alterar status
     * 
     * @testCase
     * à confirmar
     * 
     * @author Karla Daiany
     * @version 1.0.0
     */
    it('10. Associa 5 participantes em curso que não exige confirmação e altera status individualmente e depois de todos', () => {
        let participantesAssociados = []
        let participantesPendentes = []
        let participantesCancelados = []

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')

        cy.log('## CREATE ##')
        
        cy.addParticipanteConteudo(nomeCurso)

        for (let i = 0; i < 5; i++) {
            const body = {
                first_name: fakerPT_BR.person.firstName(),
                last_name: fakerPT_BR.person.lastName(),
                email: fakerPT_BR.internet.email()
            }
        
            cy.criarUsuarioViaApi(body).then((response) => {
                const participante = response.body
        
                cy.addParticipante()
                cy.associarParticipante(body.email, `${body.first_name} ${body.last_name}`)
        
                participantesAssociados.push(`${body.first_name} ${body.last_name}`)
            })
        }
        
        cy.then(() => {
            participantesPendentes = participantesAssociados.slice(0, 2)
            cy.log(`Array de participantes pendentes: ${participantesPendentes}`)
        
            participantesCancelados = participantesAssociados.slice(2, 4)
            cy.log(`Array de participantes cancelados: ${participantesCancelados}`)
        
            cy.alteraStatus(participantesPendentes, 'Pendente')
        
            cy.abaConfirmados()
            cy.alteraStatus(participantesCancelados, 'Cancelado')

            cy.abaPendentes()
            cy.alteraStatus(participantesPendentes, 'Confirmado')

            cy.abaCancelados()
            cy.alteraStatus(participantesCancelados, 'Confirmado')
            cy.alterarStatusTodosParticipantes('Confirmado', 'Pendente', participantesAssociados)
            cy.alterarStatusTodosParticipantes('Pendente', 'Cancelado', participantesAssociados)
            cy.alterarStatusTodosParticipantes('Cancelado', 'Confirmado', participantesAssociados)
        })
    })
})