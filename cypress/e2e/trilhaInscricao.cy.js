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

    let nomeTrilha, tipoConteudo, listaConteudos, nome = ''
    
    before(() => {
        // Configuração de campos customizados
        cy.configTodosCamposCustomizados('Desabilitado')
        cy.configTodosCamposCustomizados('Habilitado')
        cy.configurarNrColaboradores()
	})
    
    beforeEach(() => {
        // Define o tipo de conteúdo
		tipoConteudo = 'trilha'

        // Obtém token autenticação, lista e exclui os usuários e cursos
        getAuthToken()
        cy.excluirUsuarioViaApi()
        cy.excluirCursoViaApi()

        // Exclui todos os conteúdos do tipo trilha antes de iniciar o teste
		
		listaConteudos = []
		cy.listaConteudo(tipoConteudo, listaConteudos)
		cy.excluirConteudo(null, tipoConteudo, listaConteudos)	

		// Gera um nome aleatório para o conteúdo
		nomeTrilha = fakerPT_BR.commerce.productName()

        // Cria uma trilha para execução dos testes de inscrição de participantes
        const conteudo = {
            nome: nomeTrilha,
            descricao: `${fakerPT_BR.commerce.productDescription()} do evento ${nome}`,
            exigeConfirmacao: true,
        }

        cy.addConteudo(tipoConteudo)
        cy.preencherDadosConteudo(conteudo, { limpar: true })
        cy.salvarConteudo(conteudo.nome, tipoConteudo)        
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

        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)
        cy.addParticipante(tipoConteudo)
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, tipoConteudo)

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

        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)
        cy.addParticipante(tipoConteudo)
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, tipoConteudo)

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

        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)
        cy.addParticipante(tipoConteudo)
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

		cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)
        cy.addParticipante(tipoConteudo)
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, tipoConteudo)

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

        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)
        cy.addParticipante(tipoConteudo)
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

		cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)
        cy.addParticipante(tipoConteudo)
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

		cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)
        cy.addParticipante(tipoConteudo)
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

		cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)
        cy.addParticipante(tipoConteudo)
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)
        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, 'Cancelados')

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, tipoConteudo)

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

        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)
        cy.addParticipante(tipoConteudo)
        cy.preencherDadosParticipante(dados, { limpar: true })
        cy.salvarNovoParticipante(`${dados.nome} ${dados.sobrenome}`)

        // READ
        cy.log('## READ ##')

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)

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

        cy.editarParticipante(`${dados.nome} ${dados.sobrenome}`, tipoConteudo)
        cy.preencherDadosParticipante(dadosUpdate, { limpar: true })
        cy.salvarEdicaoParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, 'Pendentes')

		// READ-UPDATE
		cy.log('## READ-UPDATE ##')

		cy.editarParticipante(`${dadosUpdate.nome} ${dadosUpdate.sobrenome}`, tipoConteudo)

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
        
        cy.addParticipanteConteudo(nomeTrilha, tipoConteudo)

        for (let i = 0; i < 5; i++) {
            const body = {
                first_name: fakerPT_BR.person.firstName(),
                last_name: fakerPT_BR.person.lastName(),
                email: fakerPT_BR.internet.email()
            }
        
            cy.criarUsuarioViaApi(body).then((response) => {
                const participante = response.body
        
                cy.addParticipante(tipoConteudo)
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