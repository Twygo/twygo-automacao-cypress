/// reference types="cypress" />
import { fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'
import { gerarData } from '../support/utilsHelper'
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
        // Configuração de campos customizados
        cy.configTodosCamposCustomizados('Desabilitado')
        cy.configTodosCamposCustomizados('Habilitado')
	})
    
    beforeEach(() => {
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
        cy.acessarPgListaConteudos()
    })

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
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, 'Confirmados')

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
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, 'Confirmados')

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
        cy.salvarEdicaoParticipante(`${dados.nome} ${dados.sobrenome}`, 'Confirmados')

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
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, 'Confirmados')

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
        cy.salvarEdicaoParticipante(`${dados.nome} ${dados.sobrenome}`, 'Confirmados')

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
        cy.salvarEdicaoParticipante(`${dados.nome} ${dados.sobrenome}`, 'Confirmados')

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
        cy.salvarEdicaoParticipante(`${dados.nome} ${dados.sobrenome}`, 'Confirmados')

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

    it('8. Altera status de um participante default e atualiza os dados em situação "Cancelado"', () => {
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

    it('10. Associa 5 participantes em curso que não exige confirmação e altera status individualmente e depois de todos', () => {
        let participantesAssociados = []
        let participantesPendentes = []
        let participantesCancelados = []

        // CREATE
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

    it.only('11. CRUD via criação de participante por importação de arquivo CSV', () => {
        const participante1 = {
            nome: 'Carlos Lucas',
            sobrenome: 'Moura',
            rg: '38.882.858-4',
            cep: '85814365',
            endereco: 'Rua Grahm Bell',
            numero: '948',
            bairro: 'Interlagos',
            cidade: 'Cascavel',
            estado: 'Paraná',
            telPessoal: '(45) 38234-176',
            celular: '(45) 99674-2216',
            email: 'teste1@teste.com',
            cpf: '97407843058',
            empresa: 'Henry e Anderson Telecom Ltda',
            area: 'Telefonia',
            nrColaboradores: '10',
            cargo: 'Gerente Suporte',
            complemento: 'N/A',
            pais: 'Brasil'
        }

        const participante2 = {
            nome: 'Lorena Jennifer',
            sobrenome: 'Novaes',
            rg: '46.011.112-7',
            cep: '85807660',
            endereco: 'Rua Jacarandá',
            numero: '337',
            bairro: 'Parque Verde',
            cidade: 'Cascavel',
            estado: 'Paraná',
            telPessoal: '(45) 26810-124',
            celular: '(45) 99660-7757',
            email: 'teste2@teste.com',
            cpf: '71959631012',
            empresa: 'Cecília e Bruna Esportes ME',
            area: 'Comércio',
            nrColaboradores: '15',
            cargo: 'Gerente de Vendas',
            complemento: 'Bloco C',
            pais: 'Brasil'
        }

        const participante3 = {
            nome: 'Nelson Gael',
            sobrenome: 'Castro',
            rg: '40.365.897-4',
            cep: '85816120',
            endereco: 'Rua Prestes Maia',
            numero: '646',
            bairro: 'São Cristóvão',
            cidade: 'Cascavel',
            estado: 'Paraná',
            telPessoal: '(45) 39197-428',
            celular: '(45) 98117-6785',
            email: 'teste3@teste.com',
            cpf: '79595642053',
            empresa: 'Giovanni e Sandra Doces & Salgados Ltda',
            area: 'Alimentício',
            nrColaboradores: '20',
            cargo: 'Chefe de cozinha',
            complemento: 'Apto 101',
            pais: 'Brasil'        
        }

        const participante4 = {
            nome: 'Diogo Iago',
            sobrenome: 'Drumond',
            rg: '49.966.104-7',
            cep: '85817834',
            endereco: 'Rua Ayrton Gerson de Camargo',
            numero: '899',
            bairro: 'Morumbi',
            cidade: 'Cascavel',
            estado: 'Paraná',
            telPessoal: '(45) 27194-494',
            celular: '(45) 99702-7372',
            email: 'teste4@teste.com',
            cpf: '50421771089',
            empresa: 'Fabiana e Cláudia Alimentos ME',
            area: 'Alimentício',
            nrColaboradores: '25',
            cargo: 'Vendedor',
            complemento: 'N/A',
            pais: 'Brasil'        
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.addParticipanteConteudo(nomeCurso)

        cy.importarParticipante('participantes.csv')

        cy.validarStatusImportacao('participantes', 'Concluído')

        // READ
        cy.log('## READ ##')

        // Medida de contorno para atualizar a página e validar o status do(s) participante(s)
        cy.addParticipante()
        cy.cancelarFormularioParticipante()
        cy.abaConfirmados()

        cy.editarParticipante(`${participante1.nome} ${participante1.sobrenome}`)
        let dadosParaValidar1 = { ...formDefault, ...participante1 }
        cy.validarDadosParticipante(dadosParaValidar1)
        cy.cancelarFormularioParticipante()

        cy.editarParticipante(`${participante2.nome} ${participante2.sobrenome}`)
        let dadosParaValidar2 = { ...formDefault, ...participante2 }
        cy.validarDadosParticipante(dadosParaValidar2)
        cy.cancelarFormularioParticipante()

        cy.alteraStatus(`${participante3.nome} ${participante3.sobrenome}`, 'Pendente')
        cy.abaPendentes()
        cy.editarParticipante(`${participante3.nome} ${participante3.sobrenome}`)
        let dadosParaValidar3 = { ...formDefault, ...participante3 }
        cy.validarDadosParticipante(dadosParaValidar3)
        cy.cancelarFormularioParticipante()

        cy.abaConfirmados()
        cy.alteraStatus(`${participante4.nome} ${participante4.sobrenome}`, 'Cancelado')
        cy.abaCancelados()
        cy.editarParticipante(`${participante4.nome} ${participante4.sobrenome}`)
        let dadosParaValidar4 = { ...formDefault, ...participante4 }
        cy.validarDadosParticipante(dadosParaValidar4)
        cy.cancelarFormularioParticipante()

        // UPDATE
        cy.log('## UPDATE ##')

        const senha = fakerPT_BR.internet.password()
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

        cy.abaConfirmados()
        cy.editarParticipante(`${participante2.nome} ${participante2.sobrenome}`)
        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, 'Confirmados')

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)

        let dadosParaValidar = { ...dadosParaValidar2, ...dadosUpdate }
		cy.validarDadosParticipante(dadosParaValidar)

		// DELETE
		cy.log('## DELETE ##')

        cy.acessarPgUsuarios()
		cy.excluirUsuario(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`)
        cy.excluirUsuario(`${participante1.nome} ${participante1.sobrenome}`)
        cy.excluirUsuario(`${participante3.nome} ${participante3.sobrenome}`)
        cy.excluirUsuario(`${participante4.nome} ${participante4.sobrenome}`)        
    })
})