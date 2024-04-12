/// reference types="cypress" />
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../support/auth_helper'

describe('Usuário', () => {
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

    it('1. Cadastrar usuário', () => {
        // Massa de dados
        const dados = {
            email: faker.internet.email(),
            nome: faker.person.firstName(),
            sobrenome: faker.person.lastName(),
            cpf: '64864655065',
            rg: faker.string.numeric({ min: 100000, max: 999999999 }),
            telPessoal: `(${faker.string.numeric(2)}) ${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
            celular: `(${faker.string.numeric(2)}) ${faker.string.numeric(5)}-${faker.string.numeric(4)}`,
            cep: faker.string.numeric(8),
            endereco: faker.location.streetAddress(),
            numero: faker.number.int( { min: 1, max: 9999 } ),
            complemento: `Andar: ${faker.number.int( { min: 1, max: 20 } )}, Sala: ${faker.number.int( { min: 1, max: 20 } )}`,
            bairro: faker.lorem.words(1),
            cidade: faker.location.city(),
            estado: faker.location.state(),
            // pais: faker.location.country(),
            empresa: faker.company.name(),
            ramo: faker.lorem.words(3),
            nrColaboradores: '',
            site: faker.internet.url(),
            telComercial: `(${faker.string.numeric(2)}) ${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
            cargo: faker.person.jobTitle(),
            area: faker.person.jobArea(),
            perfilColaborador: true,
            perfilAdministrador: true,
            perfilInstrutor: true,
            perfilGestor: true,
            perfilLiderEquipe: true,
            // responsavel: ,
            // navegacao: ,
            comunidades: true,
            notificacoes: true
        }
        
        // CREATE
		cy.log('## CREATE ##')

		cy.loginTwygoAutomacao()
		cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.addUsuario()
        cy.preencherDadosUsuario(dados, { limpar: true })
        cy.salvarUsuario(dados.nome)

        //TODO a validação do usuário salvo está retornando com espaços e demais nomes. Verificar também checkbox instrutor e gestor que não estão marcando
    })
})