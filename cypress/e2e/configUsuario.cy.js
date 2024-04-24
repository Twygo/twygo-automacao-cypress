///reference types="cypress" />
import { fakerPT_BR, fi } from "@faker-js/faker"
import { getAuthToken } from '../support/auth_helper'
let faker = require('faker-br')

describe('Configuração de Usuário', () => {
    let email, senha, username

    beforeEach(() => {
        // Ativa o tratamento de exceção não capturada especificamente para este teste
		Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })

        // Gerar dados aleatórios para o usuário
        let first_name = fakerPT_BR.person.firstName()
        let last_name = fakerPT_BR.person.lastName()
        email = fakerPT_BR.internet.email()
        senha = fakerPT_BR.internet.password()
        username = `${first_name} ${last_name}`
        
        const body = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: senha,
        }
        
        getAuthToken()
        // cy.excluirUsuarioViaApi()
        cy.criarUsuarioViaApi(body)
    })

    afterEach(() => {
		// Desativa o tratamento após o teste para evitar afetar outros testes
		Cypress.removeAllListeners('uncaught:exception')
	})

    it('Deve ser possível alterar o nome do usuário', () => {
        // Massa de dados
        const dados = {
            nome: fakerPT_BR.person.firstName(),
            sobrenome: fakerPT_BR.person.lastName(),
            cpf: faker.br.cpf(),
            rg: faker.br.rg(),
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
            pais: fakerPT_BR.location.country(),
            empresa: fakerPT_BR.company.name(),
            site: fakerPT_BR.internet.url(),
            telComercial: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}-${fakerPT_BR.string.numeric(4)}`,
            cargo: fakerPT_BR.person.jobTitle(),
            nrColaboradores: '> 500',
            ramo: fakerPT_BR.lorem.words(1)
        }

        // CREATE
		cy.log('## CREATE ##')

		cy.login(email, senha, username)
        cy.configUsuario()
        cy.preencherDadosConfigUsuario(dados)
    })
})