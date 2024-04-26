/// reference types="cypress" />
import { getAuthToken } from "../support/auth_helper"
import { fakerPT_BR, faker } from "@faker-js/faker"
let fakerbr = require('faker-br')

describe('Importar Usuários', () => {
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
          pais: 'Escolha seu País', // quando não preenche o campo no CSV
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
          estado: 'AP',
          pais: 'Brasil', // ao informar a sigla BR no arquivo CSV deve ser selecionada a opção de nome corretamente
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
          endereco: 'Rua Severino João de Souza',
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
        let dadosParaValidar1 = { ...formDefault, ...usuario1 }
        cy.validarDadosUsuario(dadosParaValidar1)
        cy.voltar()

        cy.editarUsuario(`${usuario2.nome} ${usuario2.sobrenome}`)
        let dadosParaValidar2 = { ...formDefault, ...usuario2 }
        cy.validarDadosUsuario(dadosParaValidar2)
        cy.voltar()

        cy.editarUsuario(`${usuario3.nome} ${usuario3.sobrenome}`)
        let dadosParaValidar3 = { ...formDefault, ...usuario3 }
        cy.validarDadosUsuario(dadosParaValidar3)
        cy.voltar()

        cy.editarUsuario(`${usuario4.nome} ${usuario4.sobrenome}`)
        let dadosParaValidar4 = { ...formDefault, ...usuario4 }
        cy.validarDadosUsuario(dadosParaValidar4)
        cy.voltar()

        cy.editarUsuario(`${usuario5.nome} ${usuario5.sobrenome}`)
        let dadosParaValidar5 = { ...formDefault, ...usuario5 }
        cy.validarDadosUsuario(dadosParaValidar5)
        cy.voltar()

        cy.editarUsuario(`${usuario6.nome} ${usuario6.sobrenome}`)
        let dadosParaValidar6 = { ...formDefault, ...usuario6 }
        cy.validarDadosUsuario(dadosParaValidar6)
        cy.voltar()

        // UPDATE
        cy.log('## UPDATE ##')

        cy.importarUsuarios('usuariosUpdate.csv', 'Atualizar')
        cy.validarStatusImportacao('usuários')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Massa de dados atualizada
        let updateUsuario1 = {
            cep: '54430050',
            endereco: 'Rua Antônio Ferreira Campos',
            numero: '538',
            complemento: 'N/A',
            bairro: 'Candeias',
            cidade: 'Jaboatão dos Guararapes',
            estado: 'PE'
        }
      
        let updateUsuario3 = {
            celular: '(81) 98393-9467'
        }
  
        let updateUsuario4 = {
            telPessoal: '',
            empresa: 'Lucas e Gabriel Marcenaria ME',
            cargo: 'Marceneiro'
        }
  
        let updateUsuario5 = {
            empresa: '',
            nrColaboradores: '',
            area: ''
        }
      
        let usuario7 = {
            email: "allana_castro@graffiti.net",
            nome: "Allana",
            sobrenome: "Castro",
            cpf: "12325856615",
            rg: "",
            empresa: "",
            area: "",
            nrColaboradores: "",
            ramo: "",
            site: "",
            cargo: "",
            cep: "",
            endereco: "Av. Brasil",
            bairro: "Centro",
            numero: "1001",
            complemento: "Apto 230 Bloco Z",
            cidade: "Curitiba",
            estado: "Paraná",
            pais: "Brasil",
            telPessoal: "",
            telComercial: "4130332211",
            celular: ""
        }

        let usuario8 = {
            email: "marcio_bryan_depaula@fertility.com.br",
            nome: "Márcio Bryan",
            sobrenome: "de Paula",
            cpf: "24530453189",
            rg: "418610964",
            empresa: "Vinicius e Joaquim Pães e Doces Ltda",
            area: "",
            nrColaboradores: "1258",
            ramo: "",
            site: "www.twygoead.com",
            cargo: "",
            cep: "78008812",
            endereco: "Travessa São João",
            bairro: "São João dos Lázaros",
            numero: "979",
            complemento: "N/A",
            cidade: "Cuiabá",
            estado: "MT",
            pais: "Brasil",
            telPessoal: "",
            telComercial: "",
            celular: ""
        }

        cy.acessarPgUsuarios()
        cy.editarUsuario(`${usuario1.nome} ${usuario1.sobrenome}`)
        dadosParaValidar1 = { ...dadosParaValidar1, ...updateUsuario1 }
        cy.validarDadosUsuario(dadosParaValidar1)
        cy.voltar()

        cy.editarUsuario(`${usuario3.nome} ${usuario3.sobrenome}`)
        dadosParaValidar3 = { ...dadosParaValidar3, ...updateUsuario3 }
        cy.validarDadosUsuario(dadosParaValidar3)
        cy.voltar()

        cy.editarUsuario(`${usuario4.nome} ${usuario4.sobrenome}`)
        dadosParaValidar4 = { ...dadosParaValidar4, ...updateUsuario4 }
        cy.validarDadosUsuario(dadosParaValidar4)
        cy.voltar()

        cy.editarUsuario(`${usuario5.nome} ${usuario5.sobrenome}`)
        dadosParaValidar5 = { ...dadosParaValidar5, ...updateUsuario5 }
        cy.validarDadosUsuario(dadosParaValidar5)
        cy.voltar()

        cy.editarUsuario(`${usuario7.nome} ${usuario7.sobrenome}`)
        let dadosParaValidar7 = { ...formDefault, ...usuario7 }
        cy.validarDadosUsuario(dadosParaValidar7)

        cy.editarUsuario(`${usuario8.nome} ${usuario8.sobrenome}`)
        let dadosParaValidar8 = { ...formDefault, ...usuario8 }
        cy.validarDadosUsuario(dadosParaValidar8)
        cy.voltar()

        // DELETE
        cy.log('## DELETE ##')

        cy.excluirUsuario(`${usuario1.nome} ${usuario1.sobrenome}`)
        cy.excluirUsuario(`${usuario2.nome} ${usuario2.sobrenome}`)
        cy.excluirUsuario(`${usuario3.nome} ${usuario3.sobrenome}`)
        cy.excluirUsuario(`${usuario4.nome} ${usuario4.sobrenome}`)
        cy.excluirUsuario(`${usuario5.nome} ${usuario5.sobrenome}`)
        cy.excluirUsuario(`${usuario6.nome} ${usuario6.sobrenome}`)
        cy.excluirUsuario(`${usuario7.nome} ${usuario7.sobrenome}`)
        cy.excluirUsuario(`${usuario8.nome} ${usuario8.sobrenome}`)
    })
})