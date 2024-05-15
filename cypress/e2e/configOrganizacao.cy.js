///reference types="cypress" />
import { fakerPT_BR, faker } from "@faker-js/faker"

describe('Configurações > Organização > Dados', () => {
    const formDadosDefault = {
        nome: Cypress.env('orgName'),
        descricao: '',
        informacoesGerais: '',
        resumoIndexacao: '',
        cep: '',
        endereco: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: '',
        telefone: '(45) 99999-9999',
        email: Cypress.env('login'),
        site: '',
        converterEscalaBranco: false,
        personalizarLinkLogotipo: false,
        linkRedirecionamento: '',
        botaoContato: '',
        usarGestaoCompetencias: false,
        ativarGamificacao: false,
        visualizacao: 'Privada',
        abaPortfolio: false,
        abaAgenda: false,
        abaParceiros: false,
        abaSobre: false,
        abaPlanos: false,
        listaEmpresas: '',
        nrColaboradores: '',
        ramoAtuacao: '',
        cargo: ''
    }

    before(() => {
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        //Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            // "Unexpected identifier 'id'"    // Chrome
            "unexpected token: identifier"    // Firefox
        ], { ignoreScriptErrors: true })

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.acessarPgConfigOrganizacao()
        cy.resetConfigOrganizacao('dados')
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it.only('1. CRUD aba Dados', () => {
        // Massa de dados
        const dados = {
            nome: faker.commerce.productName(),
            descricao: faker.lorem.sentence(50),
            informacoesGerais: faker.lorem.sentence(50),
            resumoIndexacao: faker.lorem.sentence(3),
            cep: faker.string.numeric(8),
            endereco: fakerPT_BR.location.streetAddress(),
            complemento: faker.lorem.sentence(2),
            bairro: faker.lorem.word(),
            cidade: faker.location.city(),
            estado: faker.location.state(),
            pais: faker.location.country(),
            telefone: '(45) 3 0303-030',
            email: faker.internet.email(),
            site: faker.internet.url(),
            converterEscalaBranco: true,
            personalizarLinkLogotipo: true,
            linkRedirecionamento: faker.internet.url(),
            botaoContato: faker.lorem.word(),
            usarGestaoCompetencias: true,
            ativarGamificacao: true,
            visualizacao: 'Pública',
            abaPortfolio: true,
            abaAgenda: true,
            abaParceiros: true,
            abaSobre: true,
            abaPlanos: true,
            listaEmpresas: faker.lorem.word(),
            nrColaboradores: faker.number.int({ min: 1, max: 1000 }),
            ramoAtuacao: faker.lorem.word(),
            cargo: faker.person.jobTitle(),
            salvarDados: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dados, 'dados', { limpar: true })

        // READ
        cy.log('## READ ##')

        let dadosParaValidar = { ...formDadosDefault, ...dados }
        cy.validarDadosConfigOrganizacao(dadosParaValidar, 'dados')

        // UPDATE
        // Massa de dados para atualização
        const dadosUpdate = {
            descricao: faker.lorem.sentence(50),
            resumoIndexacao: '',
            telefone: '(45) 9 8888-777',
            converterEscalaBranco: false,
            personalizarLinkLogotipo: false,
            usarGestaoCompetencias: false,
            ativarGamificacao: true,
            visualizacao: 'Pública',
            abaPortfolio: true,
            abaAgenda: true,
            abaParceiros: false,
            abaSobre: true,
            abaPlanos: false,
            listaEmpresas: faker.lorem.word(),
            nrColaboradores: '',
            ramoAtuacao: faker.lorem.word(),
            cargo: '',
            salvarDados: true
        }

        cy.log('## UPDATE ##')

        cy.preencherDadosConfigOrganizacao(dadosUpdate, 'dados', { limpar: true })

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        dadosParaValidar = { ...dadosParaValidar, ...dadosUpdate }
        cy.validarDadosConfigOrganizacao(dadosParaValidar, 'dados')

        // DELETE
        cy.log('## DELETE ##')

        cy.resetConfigOrganizacao('dados')
    })
})

describe('Configurações > Organização > Customizações', () => {
    const formAlterarDadosUsuarioDefault = {
        // Alterar dados do usuário
        naoPermitirAlterarDados: false
    }

    const formConfigLoginDefault = {
        // Configurações de login
        tempoExpiracaoLogin: false,
        loginEmail: true,
        loginCpf: false
    }

    const formCustomizacoesInterfaceDefault = {
        // Customização de interface
        corPrimaria: '#9349DE',
        corTexto: '#596679',
        mostrarFundoLogin: false,
        mostrarBotaoRegistrar: true,
        removerImagemFundoLogin: false
    }

    const formEnvioEmailsDefault = {
        // Envio de E-mails
        nomeEmail: '',
        emailEmail: ''
    }

    
    before(() => {
        cy.fixture('labels.json').then((labels) => {
            Cypress.env('labels', labels)
        })
    })

    beforeEach(() => {
        //Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            // "Unexpected identifier 'id'"    // Chrome
            "unexpected token: identifier"    // Firefox
        ], { ignoreScriptErrors: true })

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')      

        cy.acessarPgConfigOrganizacao()
        cy.resetConfigOrganizacao('customizacoes')
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    
    it.only('2. CRUD aba Customizações', () => {
        // Massa de dados
        const alterarDadosUsuario = {
            // Alterar dados do usuário
            naoPermitirAlterarDados: true,
            salvarAlterarDados: true
        }

        const configLogin = {
            // Configurações de login
            tempoExpiracaoLogin: true,
            tempoMaxInativo: '19',
            loginEmail: true,
            loginCpf: true,
            salvarConfiguracoesLogin: true
        }

        const customizacoesInterface = {
            // Customização de interface
            corPrimaria: faker.color.rgb({ casing: 'upper' }),
            corTexto: faker.color.rgb({ casing: 'upper' }),
            mostrarFundoLogin: true,
            mostrarBotaoRegistrar: false,
            removerImagemFundoLogin: true,
            salvarCustomizacaoInterface: true
        }
        
        const envioEmails = {
            // Envio de E-mails
            nomeEmail: 'Nome para teste de e-mail',
            emailEmail: 'teste@mazepa.com.br',
            salvarValidarEnvioEmail: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(alterarDadosUsuario, 'customizacoes', { limpar: true })
        cy.preencherDadosConfigOrganizacao(configLogin, 'customizacoes', { limpar: true })
        cy.preencherDadosConfigOrganizacao(customizacoesInterface, 'customizacoes', { limpar: true })

        // Pausa para aguardar a atualização da página
        cy.wait(2000)

        cy.preencherDadosConfigOrganizacao(envioEmails, 'customizacoes', { limpar: true })

        // READ
        cy.log('## READ ##')

        let dadosParaValidar1 = { ...formAlterarDadosUsuarioDefault, ...alterarDadosUsuario}
        cy.validarDadosConfigOrganizacao(dadosParaValidar1, 'customizacoes')

        let dadosParaValidar2 = { ...formConfigLoginDefault, ...configLogin}
        cy.validarDadosConfigOrganizacao(dadosParaValidar2, 'customizacoes')

        let dadosParaValidar3 = { ...formCustomizacoesInterfaceDefault, ...customizacoesInterface}
        cy.validarDadosConfigOrganizacao(dadosParaValidar3, 'customizacoes')

        let dadosParaValidar4 = { ...formEnvioEmailsDefault, ...envioEmails}
        cy.validarDadosConfigOrganizacao(dadosParaValidar4, 'customizacoes')

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados
        const configLoginUpdate = {
            // Configurações de login
            tempoMaxInativo: '120',
            loginEmail: true,
            loginCpf: false,
            salvarConfiguracoesLogin: true
        }

        const customizacoesInterfaceUpdate = {
            // Customização de interface
            corTexto: faker.color.rgb({ casing: 'upper' }),
            mostrarFundoLogin: false,
            mostrarBotaoRegistrar: true,
            salvarCustomizacaoInterface: true
        }
        
        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(configLoginUpdate, 'customizacoes', { limpar: true })
        cy.preencherDadosConfigOrganizacao(customizacoesInterfaceUpdate, 'customizacoes', { limpar: true })

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.validarDadosConfigOrganizacao(dadosParaValidar1, 'customizacoes')
        
        dadosParaValidar2 = { ...dadosParaValidar2, ...configLoginUpdate}
        cy.validarDadosConfigOrganizacao(dadosParaValidar2, 'customizacoes')

        dadosParaValidar3 = { ...dadosParaValidar3, ...customizacoesInterfaceUpdate}
        cy.validarDadosConfigOrganizacao(dadosParaValidar3, 'customizacoes')

        cy.validarDadosConfigOrganizacao(dadosParaValidar4, 'customizacoes')

        // DELETE
        cy.log('## DELETE ##')

        cy.resetConfigOrganizacao('customizacoes')
    })
})

describe('Configurações > Organização > Certificado', () => {
    it('3. CRUD aba Certificado', () => {
        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
    })
})

describe('Configurações > Organização > Integrações', () => {
    it('4. CRUD aba Integrações', () => {
        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
    })
})

describe('Configurações > Organização > Termos', () => {
    it('5. CRUD aba Termos', () => {
        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
    })
})

describe('Configurações > Organização > Url Webhooks', () => {
    it('6. CRUD aba Url Webhooks', () => {
        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
    })
})