/// reference types="cypress" />
import { getAuthToken } from "../support/auth_helper"
import { fakerPT_BR, faker } from "@faker-js/faker"
let fakerbr = require('faker-br')

describe('Importar Usuários', () => {
    // Massa de dados do arquivo CSV
    let usuario1 = {
          email: 'sueli.aline.castro@iesa.com.br',
          nome: 'Sueli Aline',
          sobrenome: 'Castro',
          cpf: '92125955881',
          rg: '256190835',
          telPessoal: '(45) 38234-176',
          celular: '(45) 99674-2216',
          cep: '93220320',
          endereco: 'Rua Grahm Bell',
          numero: '948',
          complemento: 'N/A',
          bairro: 'Interlagos',
          cidade: 'Cascavel',
          estado: 'Paraná',
          pais: 'Brasil',
          empresa: 'Raul e Fátima Transportes ME',
          ramo: '',
          nrColaboradores: '122',
          site: '',
          telComercial: '',
          cargo: 'Faturista',
          area: 'Transportadora'
        }
    
    let usuario2 = {
          email: 'isabel_daconceicao@trilhavitoria.com.br',
          nome: 'Isabel',
          sobrenome: 'da Conceição',
          cpf: '51974413217',
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
          area: ''
        }

    let usuario3 = {
          email: 'benedita-rodrigues78@mcpsolucoesgraficas.com.br',
          nome: 'Benedita',
          sobrenome: 'Rodrigues',
          cpf: '75592931158',
          rg: '',
          telPessoal: '(45) 39197-428',
          celular: '(45) 98117-6785',
          cep: '68020820',
          endereco: 'Rua Prestes Maia',
          numero: '646',
          complemento: 'Apto 101',
          bairro: 'São Cristóvão',
          cidade: 'Cascavel',
          estado: 'Paraná',
          pais: 'Brasil',
          empresa: 'Juan e Tereza Telas Ltda',
          ramo: '',
          nrColaboradores: '14',
          site: '',
          telComercial: '',
          cargo: 'Encarregada Produção',
          area: 'Comércio'
        }

    let usuario4 = {
          email: 'noahluiznunes@dpi.indl.com.br',
          nome: 'Noah Luiz',
          sobrenome: 'Nunes',
          cpf: '75857248027',
          rg: '442968309',
          telPessoal: '(45) 27194-494',
          celular: '(45) 99702-7372',
          cep: '29172820',
          endereco: 'Rua Ayrton Gerson de Camargo',
          numero: '899',
          complemento: 'N/A',
          bairro: 'Morumbi',
          cidade: 'Cascavel',
          estado: 'Paraná',
          pais: 'Brasil',
          empresa: 'Carlos e Roberto Joalheria ME',
          ramo: '',
          nrColaboradores: '2',
          site: '',
          telComercial: '',
          cargo: 'Vendedor',
          area: 'Comércio'
        }

    let usuario5 = {
          email: 'fatima_antonella_pereira@digitalsj.com.br',
          nome: 'Fátima Antonella',
          sobrenome: 'Pereira',
          cpf: '97629297998',
          rg: '142131738',
          telPessoal: '',
          celular: '(96) 99292-3861',
          cep: '68911026',
          endereco: 'Avenida Rio Negro',
          numero: '288',
          complemento: '',
          bairro: 'Fazendinha',
          cidade: 'Macapá',
          estado: '',
          pais: '',
          empresa: 'Melissa e Tânia Comercio de Bebidas Ltda',
          ramo: '',
          nrColaboradores: '22',
          site: '',
          telComercial: '',
          cargo: '',
          area: 'Comércio'
        }
    
    let usuario6 = {
          email: 'matheus-moura91@sunrise.com.br',
          nome: 'Matheus',
          sobrenome: 'Moura',
          cpf: '63983224369',
          rg: '',
          telPessoal: '(48) 39779-125',
          celular: '',
          cep: '88901088',
          endereco: 'Rua Severino JosÃ© de Souza',
          numero: '266',
          complemento: '',
          bairro: 'Cidade Alta',
          cidade: 'Araranguá',
          estado: 'Santa Catarina',
          pais: 'Brasil',
          empresa: 'Helena e Mateus Publicidade e Propaganda ME',
          ramo: '',
          nrColaboradores: '35',
          site: '',
          telComercial: '',
          cargo: '',
          area: 'Marketing'
        }

    before(() => {
        // Carrega os labels do arquivo JSON
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        getAuthToken()
        cy.excluirUsuarioViaApi()
    })

    it('1. CRUD de usuário via importação', () => {
        // CREATE
        cy.log('## CREATE ##')
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
        cy.importarUsuarios('usuarios.csv')
        cy.validarStatusImportacao('usuários')

        // READ
        cy.log('## READ ##')

        cy.acessarPgUsuarios()
        cy.editarUsuario(`${usuario1.nome} ${usuario1.sobrenome}`)
        cy.validarDadosUsuario(usuario1)
        cy.voltar()

        cy.editarUsuario(`${usuario2.nome} ${usuario2.sobrenome}`)
        cy.validarDadosUsuario(usuario2)
        cy.voltar()

        cy.editarUsuario(`${usuario3.nome} ${usuario3.sobrenome}`)
        cy.validarDadosUsuario(usuario3)
        cy.voltar()

        cy.editarUsuario(`${usuario4.nome} ${usuario4.sobrenome}`)
        cy.validarDadosUsuario(usuario4)
        cy.voltar()

        cy.editarUsuario(`${usuario5.nome} ${usuario5.sobrenome}`)
        cy.validarDadosUsuario(usuario5)
        cy.voltar()

        cy.editarUsuario(`${usuario6.nome} ${usuario6.sobrenome}`)
        cy.validarDadosUsuario(usuario6)
    })
})