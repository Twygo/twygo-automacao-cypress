/// reference types='cypress' />
import { getAuthToken } from '../support/authHelper'

describe('Importar Usuários', () => {
    // Massa de dados dos usuários que deve ser validada no sistema com base no arquivo CSV
    const usuarios = [
        {
            dados: {
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
            },
            update: {
                cep: '54430050',
                endereco: 'Rua Antônio Ferreira Campos',
                numero: '538',
                bairro: 'Candeias',
                cidade: 'Jaboatão dos Guararapes',
                estado: 'PE'    
            }
        },
        {
            dados: {
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
            },
            update: {
                empresa: 'Allana e Noah Implementos Rodoviários Ltda'
            }
        },
        {
            dados: {
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
            },
            update: {
                celular: '(81) 98393-9467'
            }
        },
        {
            dados: {
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
            },
            update: {
                telPessoal: '',
                area: '',
                nrColaboradores: '',
                empresa: 'Lucas e Gabriel Marcenaria ME',
                cargo: 'Marceneiro'
            }
        },
        {
            dados: {
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
            },
            update: {
                area: '',
                nrColaboradores: ''
            }
        },
        {
            dados: {
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
        },
        {
            dados: {
                email: 'allana_castro@graffiti.net',
                nome: 'Allana',
                sobrenome: 'Castro',
                cpf: '12325856615',
                rg: '',
                empresa: '',
                area: '',
                nrColaboradores: '',
                ramo: '',
                site: '',
                cargo: '',
                cep: '',
                endereco: 'Av. Brasil',
                bairro: 'Centro',
                numero: '1001',
                complemento: 'Apto 230 Bloco Z',
                cidade: 'Curitiba',
                estado: 'Paraná',
                pais: 'Brasil',
                telPessoal: '',
                telComercial: '(41) 30332-211',
                celular: '',
                validarAposUpdate: true    
            }
        },
        {
            dados: {
                email: 'marcio_bryan_depaula@fertility.com.br',
                nome: 'Márcio Bryan',
                sobrenome: 'de Paula',
                cpf: '24530453189',
                rg: '418610964',
                empresa: 'Vinicius e Joaquim Pães e Doces Ltda',
                area: '',
                nrColaboradores: '1258',
                ramo: '',
                site: 'www.twygoead.com',
                cargo: '',
                cep: '78008812',
                endereco: 'Travessa São João',
                bairro: 'São João dos Lázaros',
                numero: '979',
                complemento: 'N/A',
                cidade: 'Cuiabá',
                estado: 'MT',
                pais: 'Brasil',
                telPessoal: '',
                telComercial: '',
                celular: '',
                validarAposUpdate: true    
            }
        }
    ]

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

        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier"    // Firefox
        ], { ignoreScriptErrors: true })        

        // Configuração de campos customizados
        cy.configTodosCamposCustomizados('Desabilitado')
        cy.configTodosCamposCustomizados('Habilitado')
        cy.configurarNrColaboradores()
    })

    beforeEach(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'",    // Chrome
            "unexpected token: identifier"    // Firefox
        ])
        
        // Exclui todos os usuários cadastrados (com excessão do usuário administrador principal)
        getAuthToken()
        cy.excluirUsuarioViaApi()

        // Acessa o sistema com o usuário administrador
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgUsuarios()
    })

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    it('1. CRUD de usuário via importação com uma nova importação utilizando a opção de "Atualizar" os usuários já cadastrados', () => {
        // CREATE
        cy.log('## CREATE ##')
        
        cy.importarUsuarios('usuarios.csv', 'Atualizar')
        cy.validarStatusImportacao('usuários', 'Concluído')

        // READ
        cy.log('## READ ##')

        cy.acessarPgUsuarios()

        usuarios.forEach(usuario => {
            if (!usuario.dados.validarAposUpdate) {
                cy.editarUsuario(`${usuario.dados.nome} ${usuario.dados.sobrenome}`)
                let dadosParaValidar = { ...formDefault, ...usuario.dados }
                cy.validarDadosUsuario(dadosParaValidar)
                cy.voltar()        
            }
        })

        // UPDATE
        cy.log('## UPDATE ##')

        cy.importarUsuarios('usuariosUpdate.csv', 'Atualizar')
        cy.validarStatusImportacao('usuários', 'Concluído')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgUsuarios()

        usuarios.forEach(usuario => {
            cy.editarUsuario(`${usuario.dados.nome} ${usuario.dados.sobrenome}`)
            let dadosParaValidar = { ...formDefault, ...usuario.dados, ...usuario.update }
            delete dadosParaValidar.validarAposUpdate
            cy.validarDadosUsuario(dadosParaValidar)
            cy.voltar()        
        })
        
        // DELETE
        cy.log('## DELETE ##')

        usuarios.forEach(usuario => {
            cy.excluirUsuario(`${usuario.dados.nome} ${usuario.dados.sobrenome}`)
        })
    })

    it('2. CRUD de usuário via importação com uma nova importação utilizando a opção de "Cancelar" os usuários já cadastrados', () => {
        // CREATE
        cy.log('## CREATE ##')
        
        cy.importarUsuarios('usuarios.csv', 'Cancelar')
        cy.validarStatusImportacao('usuários', 'Concluído')

        // READ
        cy.log('## READ ##')

        cy.acessarPgUsuarios()

        usuarios.forEach(usuario => {
            if (!usuario.dados.validarAposUpdate) {
                cy.editarUsuario(`${usuario.dados.nome} ${usuario.dados.sobrenome}`)
                let dadosParaValidar = { ...formDefault, ...usuario.dados }
                cy.validarDadosUsuario(dadosParaValidar)
                cy.voltar()        
            }
        })

        // UPDATE
        cy.log('## UPDATE ##')

        cy.importarUsuarios('usuariosUpdate.csv', 'Cancelar')
        cy.validarStatusImportacao('usuários', 'Cancelado')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgUsuarios()

        usuarios.forEach(usuario => {
            if (!usuario.dados.validarAposUpdate) {
                cy.editarUsuario(`${usuario.dados.nome} ${usuario.dados.sobrenome}`)
                let dadosParaValidar = { ...formDefault, ...usuario.dados }
                cy.validarDadosUsuario(dadosParaValidar)
                cy.voltar()        
            }
        })

        // Verifica se os usuários novos do arquivo CSV não foram cadastrados devido ao cancelamento da importação
        usuarios.forEach(usuario => {
            if (usuario.dados.validarAposUpdate) {
                cy.contains('a.student-name', `${usuario.dados.nome} ${usuario.dados.sobrenome}`).should('not.exist')
            }
        })
        
        // DELETE
        cy.log('## DELETE ##')

        usuarios.forEach(usuario => {
            if (!usuario.dados.validarAposUpdate) {
                cy.excluirUsuario(`${usuario.dados.nome} ${usuario.dados.sobrenome}`)
            }
        })
    })

    it('3. CRUD de usuário via importação com uma nova importação utilizando a opção de "Ignorar" os usuários já cadastrados', () => {
        // CREATE
        cy.log('## CREATE ##')
        
        cy.importarUsuarios('usuarios.csv', 'Ignorar')
        cy.validarStatusImportacao('usuários', 'Concluído')

        // READ
        cy.log('## READ ##')

        cy.acessarPgUsuarios()

        usuarios.forEach(usuario => {
            if (!usuario.dados.validarAposUpdate) {
                cy.editarUsuario(`${usuario.dados.nome} ${usuario.dados.sobrenome}`)
                let dadosParaValidar = { ...formDefault, ...usuario.dados }
                cy.validarDadosUsuario(dadosParaValidar)
                cy.voltar()        
            }
        })

        // UPDATE
        cy.log('## UPDATE ##')

        cy.importarUsuarios('usuariosUpdate.csv', 'Ignorar')
        cy.validarStatusImportacao('usuários', 'Concluído')

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgUsuarios()

        usuarios.forEach(usuario => {
            cy.editarUsuario(`${usuario.dados.nome} ${usuario.dados.sobrenome}`)
            let dadosParaValidar = { ...formDefault, ...usuario.dados }
            delete dadosParaValidar.validarAposUpdate
            cy.validarDadosUsuario(dadosParaValidar)
            cy.voltar()        
        })
        
        // DELETE
        cy.log('## DELETE ##')

        usuarios.forEach(usuario => {
            cy.excluirUsuario(`${usuario.dados.nome} ${usuario.dados.sobrenome}`)
        })
    })
})