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
        telefone: '45999999999',
        email: Cypress.env('login'),
        site: '',
        converterEscalaBranco: false,
        personalizarLinkLogotipo: false,
        linkRedirecionamento: '',
        botaoContato: '',
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

    beforeEach(() => {
        cy.resetConfigOrganizacao('dados')
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
            telefone: '(45) 3 0303030',
            email: faker.internet.email(),
            site: faker.internet.url(),
            converterEscalaBranco: true,
            personalizarLinkLogotipo: true,
            linkRedirecionamento: faker.internet.url(),
            botaoContato: faker.lorem.word(),
            ativarGamificacao: true,
            visualizacao: 'Pública',
            abaPortfolio: true,
            abaAgenda: true,
            abaParceiros: true,
            abaSobre: true,
            abaPlanos: true,
            listaEmpresas: faker.lorem.word(),
            nrColaboradores: faker.number.int({ min: 1, max: 1000 }).toString(),
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
            telefone: '(45) 9 8888777',
            converterEscalaBranco: false,
            personalizarLinkLogotipo: false,
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
        // Não é possível excluir os dados da organização, apenas limpá-los
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

    beforeEach(() => {
        cy.resetConfigOrganizacao('customizacoes')
    })

    it('2. CRUD aba Customizações', () => {
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
        cy.contains('.flash.success', 'Organização atualizada com sucesso.')
            .should('be.visible')

        cy.preencherDadosConfigOrganizacao(configLogin, 'customizacoes', { limpar: true })
        cy.contains('.flash.success', 'Informações salvas com sucesso!')
            .should('be.visible')

        cy.preencherDadosConfigOrganizacao(customizacoesInterface, 'customizacoes', { limpar: true })
        cy.contains('.flash.success', 'Personalização de interface salva com sucesso!')
            .should('be.visible')

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
        cy.contains('.flash.success', 'Informações salvas com sucesso!')
            .should('be.visible')

        cy.preencherDadosConfigOrganizacao(customizacoesInterfaceUpdate, 'customizacoes', { limpar: true })
        cy.contains('.flash.success', 'Personalização de interface salva com sucesso!')
            .should('be.visible')

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

    beforeEach(() => {
        cy.resetConfigOrganizacao('certificado')
    })

    it('3. CRUD aba Certificado', () => {      
        // Massa de dados
        const dadosGerarCertificado = {
            configurar: true,
            selecionarImagem: `imagem_${faker.number.int({ min: 1, max: 10 })}.jpg`,
            salvarGerarModelo: true
        }

        const dadosConfigCertificado = {
            notificarGestorNovosCertificados: true,
            salvarCertificado: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.preencherDadosConfigOrganizacao(dadosGerarCertificado, 'certificado')
        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dadosConfigCertificado, 'certificado')

        // Aguardar 10 segundos para que o certificado seja gerado, e então validar
        cy.wait(10000)
        
        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigOrganizacao()
        cy.validarDadosConfigOrganizacao(dadosConfigCertificado.notificarGestorNovosCertificados, 'certificado')
        cy.validarCertificadoGerado(dadosGerarCertificado)

        // UPDATE
        cy.log('## UPDATE ##')
        
        // Massa de dados para atualização
        const dadosGerarCertificadoUpdate = {
            configurar: true,
            selecionarImagem: `imagem_${faker.number.int({ min: 1, max: 10 })}.jpg`,
            salvarGerarModelo: true
        }

        const dadosConfigCertificadoUpdate = {
            notificarGestorNovosCertificados: false,
            salvarCertificado: true
        }

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dadosGerarCertificadoUpdate, 'certificado')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dadosConfigCertificadoUpdate, 'certificado')
        // Aguardar 10 segundos para que o certificado seja gerado, e então validar
        cy.wait(10000)
        
        // READ
        cy.log('## READ ##')

        cy.wait(3000)
        cy.acessarPgConfigOrganizacao()
        cy.validarDadosConfigOrganizacao(dadosConfigCertificadoUpdate.notificarGestorNovosCertificados, 'certificado')
        
        cy.wait(5000)
        cy.acessarPgConfigOrganizacao()
        cy.validarCertificadoGerado(dadosGerarCertificadoUpdate)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('## Não é possível excluir o certificado ##')
    })
})

describe('Configurações > Organização > Integrações', () => {

    beforeEach(() => {
        cy.resetConfigOrganizacao('integracoes')
    })

    it('4. CRUD aba Integrações', () => {
        // Massa de dados
        const dadosPixel = {
            // Pixel
            adicionarPixel: true,
            identificador: faker.lorem.word(),
            codigo: faker.lorem.paragraph(),
            salvarPixel: true
        }

        const dadosLogin = {
            // Login redes sociais
            ativarLogin: true,
            salvarLogin: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dadosPixel, 'integracoes')
        cy.contains('.flash.success', 'Pixel salvo!')
            .should('be.visible')

        cy.preencherDadosConfigOrganizacao(dadosLogin, 'integracoes')
        cy.contains('.flash.success', 'Informações salvas com sucesso!')
            .should('be.visible')

        // READ
        cy.log('## READ ##')
      
        cy.validarDadosConfigOrganizacao(dadosLogin.ativarLogin, 'integracoes')
        
        cy.listaPixels().then((nomes) => {
            const identificadorEncontrado = nomes.some(nome => {
              // Remove espaços em branco, incluindo novas linhas, do início e do fim
              const nomeLimpo = nome.replace(/^\s+|\s+$/g, '').toLowerCase()
              const identificadorLimpo = dadosPixel.identificador.trim().toLowerCase()
              return nomeLimpo === identificadorLimpo
            })
            expect(identificadorEncontrado).to.be.true
        })

        // UPDATE
        cy.log('## UPDATE ##')
        
        // Massa de dados para atualização
        const dadosPixelUpdate = {
            // Pixel
            identificador: faker.lorem.word(),
            codigo: faker.lorem.paragraph(),
            salvarPixel2: true
        }

        const dadosLoginUpdate = {
            // Login redes sociais
            ativarLogin: false,
            salvarLogin: true
        }

        cy.editarIdentificadorPixel(dadosPixel.identificador)
        cy.preencherDadosConfigOrganizacao(dadosPixelUpdate, null, { limpar: true })
        cy.contains('.flash.success', 'Pixel salvo!')
            .should('be.visible')

        cy.preencherDadosConfigOrganizacao(dadosLoginUpdate)
        cy.contains('.flash.success', 'Informações salvas com sucesso!')
            .should('be.visible')


        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.validarDadosConfigOrganizacao(dadosLoginUpdate.ativarLogin, 'integracoes')
        
        cy.listaPixels().then((nomes) => {
            const identificadorEncontrado = nomes.some(nome => {
                // Remove espaços em branco, incluindo novas linhas, do início e do fim
                const nomeLimpo = nome.replace(/^\s+|\s+$/g, '').toLowerCase()
                const identificadorLimpo = dadosPixelUpdate.identificador.trim().toLowerCase()
                return nomeLimpo === identificadorLimpo
            })
            expect(identificadorEncontrado).to.be.true
        })

        // DELETE
        cy.log('## DELETE ##')

        cy.resetConfigOrganizacao('integracoes')        
    })
})

describe('Configurações > Organização > Termos', () => {

    beforeEach(() => {
        cy.resetConfigOrganizacao('termos')

        // Aguardar 2 segundos para que o aceite seja salvo
        cy.wait(2000)

        cy.visit(`/o/${Cypress.env('orgId')}/events?tab=events`)
        cy.aceiteTermos()
        
        // Aguardar 2 segundos para que o aceite seja registrado
        cy.wait(2000)
        cy.alterarPerfil('administrador')
    })

    it('5. CRUD aba Termos com editor de texto', () => {
        // Massa de dados
        const dados = {
            editorTexto: true,
            termosUsoTexto: faker.lorem.paragraph(),
            politicaPrivacidadeTexto: faker.lorem.paragraph(),
            salvarTermosPoliticaTexto: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dados, 'termos')
        cy.contains('.flash.success', 'Informações salvas com sucesso!')
            .should('be.visible')

        // READ
        cy.log('## READ ##')

        // Aguardar 2 segundos para que o aceite seja salvo
        cy.wait(2000)

        cy.visit(`/o/${Cypress.env('orgId')}/events?tab=events`)
        cy.aceiteTermos()
        
        // Aguardar 2 segundos para que o aceite seja registrado
        cy.wait(2000)
        cy.alterarPerfil('administrador')
        
        cy.acessarPgConfigOrganizacao()
        cy.validarDadosConfigOrganizacao(dados, 'termos')

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para atualização
        const dadosUpdate = {
            termosUsoTexto: faker.lorem.paragraph(),
            politicaPrivacidadeTexto: faker.lorem.paragraph(),
            salvarTermosPoliticaTexto: true
        }

        cy.preencherDadosConfigOrganizacao(dadosUpdate, 'termos')
        cy.contains('.flash.success', 'Informações salvas com sucesso!')
            .should('be.visible')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Aguardar 2 segundos para que o aceite seja salvo
        cy.wait(2000)

        cy.visit(`/o/${Cypress.env('orgId')}/events?tab=events`)
        cy.aceiteTermos()
        
        // Aguardar 2 segundos para que o aceite seja registrado
        cy.wait(2000)
        cy.alterarPerfil('administrador')
        
        cy.acessarPgConfigOrganizacao()
        cy.validarDadosConfigOrganizacao(dadosUpdate, 'termos')

        // DELETE
        // Após configuração de termos e política, não é possível excluir
        cy.log('## DELETE ##')

        cy.resetConfigOrganizacao('termos')
        
        // Aguardar 2 segundos para que o aceite seja salvo
        cy.wait(2000)

        cy.visit(`/o/${Cypress.env('orgId')}/events?tab=events`)
        cy.aceiteTermos()        
    })

    it('6. CRUD aba Termos com editor de HTML', () => {
        // Massa de dados
        const dados = {
            htmlCustomizado: true,
            termosUsoHtml: faker.lorem.paragraph(),
            politicaPrivacidadeHtml: faker.lorem.paragraph(),
            salvarTermosPoliticaHtml: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dados, 'termos', { limpar: true })
        cy.contains('.flash.success', 'Informações salvas com sucesso!')
            .should('be.visible')

        // READ
        cy.log('## READ ##')

        // Aguardar 2 segundos para que o aceite seja salvo
        cy.wait(2000)

        cy.visit(`/o/${Cypress.env('orgId')}/events?tab=events`)
        cy.aceiteTermos()
        
        // Aguardar 2 segundos para que o aceite seja registrado
        cy.wait(2000)
        cy.alterarPerfil('administrador')
        
        cy.acessarPgConfigOrganizacao()
        cy.validarDadosConfigOrganizacao(dados, 'termos')

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para atualização
        const dadosUpdate = {
            termosUsoHtml: faker.lorem.paragraph(),
            politicaPrivacidadeHtml: faker.lorem.paragraph(),
            salvarTermosPoliticaHtml: true
        }

        cy.preencherDadosConfigOrganizacao(dadosUpdate, 'termos', { limpar: true })
        cy.contains('.flash.success', 'Informações salvas com sucesso!')
            .should('be.visible')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Aguardar 2 segundos para que o aceite seja salvo
        cy.wait(2000)

        cy.visit(`/o/${Cypress.env('orgId')}/events?tab=events`)
        cy.aceiteTermos()
        
        // Aguardar 2 segundos para que o aceite seja registrado
        cy.wait(2000)
        cy.alterarPerfil('administrador')
        
        cy.acessarPgConfigOrganizacao()
        cy.validarDadosConfigOrganizacao(dadosUpdate, 'termos')

        // DELETE
        cy.log('## DELETE ##')

        cy.resetConfigOrganizacao('termos')
        
        // Aguardar 2 segundos para que o aceite seja salvo
        cy.wait(2000)

        cy.visit(`/o/${Cypress.env('orgId')}/events?tab=events`)
        cy.aceiteTermos()        
    })
})

describe('Configurações > Organização > Url Webhooks', () => {

    beforeEach(() => {
        cy.resetConfigOrganizacao('urlWebhooks')
    })

    it('7. CRUD aba Url Webhooks - Ao completar o curso', () => {
        // Massa de dados
        const dados = {
            novaUrl: true,
            funcionalidade: 'Ao Completar o curso',
            urlWebhook: faker.internet.url(),
            salvarUrlWebhook: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dados, 'urlWebhooks')
        cy.contains('.flash.success', 'URL criada com sucesso')
            .should('be.visible')

        // READ
        cy.log('## READ ##')

        cy.validarWebhook(dados)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para atualização
        const dadosUpdate = {
            funcionalidade: 'Novo cadastro na academia',
            urlWebhook: faker.internet.url(),
            salvarUrlWebhook: true
        }

        cy.editarUrlWebhook(dados.funcionalidade, dados.urlWebhook)
        cy.preencherDadosConfigOrganizacao(dadosUpdate, null, { limpar: true })
        cy.contains('.flash.success', 'URL criada com sucesso')
            .should('be.visible')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.validarWebhook(dadosUpdate)

        // DELETE
        cy.log('## DELETE ##')

        cy.excluirUrlWebhook(dadosUpdate.funcionalidade, dadosUpdate.urlWebhook)
    })

    it('8. CRUD aba Url Webhooks - Ao Completar a aula', () => {
        // Massa de dados
        const dados = {
            novaUrl: true,
            funcionalidade: 'Ao Completar a aula',
            urlWebhook: faker.internet.url(),
            salvarUrlWebhook: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dados, 'urlWebhooks')
        cy.contains('.flash.success', 'URL criada com sucesso')
            .should('be.visible')

        // READ
        cy.log('## READ ##')

        cy.validarWebhook(dados)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para atualização
        const dadosUpdate = {
            funcionalidade: 'Data de Vigência do Curso',
            urlWebhook: faker.internet.url(),
            salvarUrlWebhook: true
        }

        cy.editarUrlWebhook(dados.funcionalidade, dados.urlWebhook)
        cy.preencherDadosConfigOrganizacao(dadosUpdate, null, { limpar: true })
        cy.contains('.flash.success', 'URL criada com sucesso')
            .should('be.visible')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.validarWebhook(dadosUpdate)

        // DELETE
        cy.log('## DELETE ##')

        cy.excluirUrlWebhook(dadosUpdate.funcionalidade, dadosUpdate.urlWebhook)
    })

    it('9. CRUD aba Url Webhooks - Novo cadastro na academia', () => {
        // Massa de dados
        const dados = {
            novaUrl: true,
            funcionalidade: 'Novo cadastro na academia',
            urlWebhook: faker.internet.url(),
            salvarUrlWebhook: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dados, 'urlWebhooks')
        cy.contains('.flash.success', 'URL criada com sucesso')
            .should('be.visible')

        // READ
        cy.log('## READ ##')

        cy.validarWebhook(dados)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para atualização
        const dadosUpdate = {
            funcionalidade: 'Ao Completar o curso',
            urlWebhook: faker.internet.url(),
            salvarUrlWebhook: true
        }

        cy.editarUrlWebhook(dados.funcionalidade, dados.urlWebhook)
        cy.preencherDadosConfigOrganizacao(dadosUpdate, null, { limpar: true })
        cy.contains('.flash.success', 'URL criada com sucesso')
            .should('be.visible')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.validarWebhook(dadosUpdate)

        // DELETE
        cy.log('## DELETE ##')

        cy.excluirUrlWebhook(dadosUpdate.funcionalidade, dadosUpdate.urlWebhook)
    })

    it('10. CRUD aba Url Webhooks - Data de Vigência do Curso', () => {
        // Massa de dados
        const dados = {
            novaUrl: true,
            funcionalidade: 'Data de Vigência do Curso',
            urlWebhook: faker.internet.url(),
            salvarUrlWebhook: true
        }

        // CREATE
		cy.log('## CREATE ##')

        cy.acessarPgConfigOrganizacao()
        cy.preencherDadosConfigOrganizacao(dados, 'urlWebhooks')
        cy.contains('.flash.success', 'URL criada com sucesso')
            .should('be.visible')

        // READ
        cy.log('## READ ##')

        cy.validarWebhook(dados)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para atualização
        const dadosUpdate = {
            funcionalidade: 'Ao Completar a aula',
            urlWebhook: faker.internet.url(),
            salvarUrlWebhook: true
        }

        cy.editarUrlWebhook(dados.funcionalidade, dados.urlWebhook)
        cy.preencherDadosConfigOrganizacao(dadosUpdate, null, { limpar: true })
        cy.contains('.flash.success', 'URL criada com sucesso')
            .should('be.visible')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.validarWebhook(dadosUpdate)

        // DELETE
        cy.log('## DELETE ##')

        cy.excluirUrlWebhook(dadosUpdate.funcionalidade, dadosUpdate.urlWebhook)
    })
})