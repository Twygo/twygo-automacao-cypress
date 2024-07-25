///reference types="cypress" />
import comunicacao from '../support/pageObjects/comunicacao'

describe('Configuração de Comunicação', () => {
    before(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'"
        ])

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
        cy.acessarPgConfigComunicacao()
        cy.resetConfigComunicacao()
        cy.logout()
    })

    beforeEach(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'"
        ])
        
        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
    })
    
    it('1. CRUD - Comunidades', () => {
        // Massa de dados
        const secao = 'comunidades'

        const configInstrutor = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configGestor = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configLiderEquipe = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configAluno = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.configurarMultiplasPermissoes(configInstrutor)
        comunicacao.configurarMultiplasPermissoes(configGestor)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipe)
        comunicacao.configurarMultiplasPermissoes(configAluno)
        cy.salvarConfigComunicacao()

        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutor)
        comunicacao.validarMultiplasPermissoes(configGestor)
        comunicacao.validarMultiplasPermissoes(configLiderEquipe)
        comunicacao.validarMultiplasPermissoes(configAluno)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para update
        const configInstrutorUpdate = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'criar'],
            acao: 'desabilitar'
        }
    
        const configGestorUpdate = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['editar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configLiderEquipeUpdate = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configAlunoUpdate = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['editar', 'criar'],
            acao: 'desabilitar'
        }

        comunicacao.configurarMultiplasPermissoes(configInstrutorUpdate)
        comunicacao.configurarMultiplasPermissoes(configGestorUpdate)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipeUpdate)
        comunicacao.configurarMultiplasPermissoes(configAlunoUpdate)
        cy.salvarConfigComunicacao()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutorUpdate)
        comunicacao.validarMultiplasPermissoes(configGestorUpdate)
        comunicacao.validarMultiplasPermissoes(configLiderEquipeUpdate)
        comunicacao.validarMultiplasPermissoes(configAlunoUpdate)

        // DELETE
        cy.log('## DELETE ##')

        // Massa de dados para delete
        const configInstrutorDelete = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configGestorDelete = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configLiderEquipeDelete = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configAlunoDelete = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }

        comunicacao.configurarMultiplasPermissoes(configInstrutorDelete)
        comunicacao.configurarMultiplasPermissoes(configGestorDelete)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipeDelete)
        comunicacao.configurarMultiplasPermissoes(configAlunoDelete)
        cy.salvarConfigComunicacao()

        // READ-DELETE
        cy.log('## READ-DELETE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutorDelete)
        comunicacao.validarMultiplasPermissoes(configGestorDelete)
        comunicacao.validarMultiplasPermissoes(configLiderEquipeDelete)
        comunicacao.validarMultiplasPermissoes(configAlunoDelete)
    })

    it('2. CRUD - Participantes da comunidade', () => {
        // Massa de dados
        const secao = 'participantes'

        const configInstrutor = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configGestor = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configLiderEquipe = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configAluno = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.configurarMultiplasPermissoes(configInstrutor)
        comunicacao.configurarMultiplasPermissoes(configGestor)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipe)
        comunicacao.configurarMultiplasPermissoes(configAluno)
        cy.salvarConfigComunicacao()

        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutor)
        comunicacao.validarMultiplasPermissoes(configGestor)
        comunicacao.validarMultiplasPermissoes(configLiderEquipe)
        comunicacao.validarMultiplasPermissoes(configAluno)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para update
        const configInstrutorUpdate = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'criar'],
            acao: 'desabilitar'
        }
    
        const configGestorUpdate = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['editar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configLiderEquipeUpdate = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configAlunoUpdate = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['editar', 'criar'],
            acao: 'desabilitar'
        }

        comunicacao.configurarMultiplasPermissoes(configInstrutorUpdate)
        comunicacao.configurarMultiplasPermissoes(configGestorUpdate)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipeUpdate)
        comunicacao.configurarMultiplasPermissoes(configAlunoUpdate)
        cy.salvarConfigComunicacao()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutorUpdate)
        comunicacao.validarMultiplasPermissoes(configGestorUpdate)
        comunicacao.validarMultiplasPermissoes(configLiderEquipeUpdate)
        comunicacao.validarMultiplasPermissoes(configAlunoUpdate)

        // DELETE
        cy.log('## DELETE ##')

        // Massa de dados para delete
        const configInstrutorDelete = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configGestorDelete = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configLiderEquipeDelete = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configAlunoDelete = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }

        comunicacao.configurarMultiplasPermissoes(configInstrutorDelete)
        comunicacao.configurarMultiplasPermissoes(configGestorDelete)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipeDelete)
        comunicacao.configurarMultiplasPermissoes(configAlunoDelete)
        cy.salvarConfigComunicacao()

        // READ-DELETE
        cy.log('## READ-DELETE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutorDelete)
        comunicacao.validarMultiplasPermissoes(configGestorDelete)
        comunicacao.validarMultiplasPermissoes(configLiderEquipeDelete)
        comunicacao.validarMultiplasPermissoes(configAlunoDelete)
    })

    it('3. CRUD - Discussões da comunidade', () => {
        // Massa de dados
        const secao = 'discussoes'

        const configInstrutor = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configGestor = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configLiderEquipe = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configAluno = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.configurarMultiplasPermissoes(configInstrutor)
        comunicacao.configurarMultiplasPermissoes(configGestor)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipe)
        comunicacao.configurarMultiplasPermissoes(configAluno)
        cy.salvarConfigComunicacao()

        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutor)
        comunicacao.validarMultiplasPermissoes(configGestor)
        comunicacao.validarMultiplasPermissoes(configLiderEquipe)
        comunicacao.validarMultiplasPermissoes(configAluno)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para update
        const configInstrutorUpdate = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'criar'],
            acao: 'desabilitar'
        }
    
        const configGestorUpdate = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['editar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configLiderEquipeUpdate = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configAlunoUpdate = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['editar', 'criar'],
            acao: 'desabilitar'
        }

        comunicacao.configurarMultiplasPermissoes(configInstrutorUpdate)
        comunicacao.configurarMultiplasPermissoes(configGestorUpdate)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipeUpdate)
        comunicacao.configurarMultiplasPermissoes(configAlunoUpdate)
        cy.salvarConfigComunicacao()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutorUpdate)
        comunicacao.validarMultiplasPermissoes(configGestorUpdate)
        comunicacao.validarMultiplasPermissoes(configLiderEquipeUpdate)
        comunicacao.validarMultiplasPermissoes(configAlunoUpdate)

        // DELETE
        cy.log('## DELETE ##')

        // Massa de dados para delete
        const configInstrutorDelete = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configGestorDelete = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configLiderEquipeDelete = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configAlunoDelete = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }

        comunicacao.configurarMultiplasPermissoes(configInstrutorDelete)
        comunicacao.configurarMultiplasPermissoes(configGestorDelete)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipeDelete)
        comunicacao.configurarMultiplasPermissoes(configAlunoDelete)
        cy.salvarConfigComunicacao()

        // READ-DELETE
        cy.log('## READ-DELETE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutorDelete)
        comunicacao.validarMultiplasPermissoes(configGestorDelete)
        comunicacao.validarMultiplasPermissoes(configLiderEquipeDelete)
        comunicacao.validarMultiplasPermissoes(configAlunoDelete)
    })

    it('4. CRUD - Notícias', () => {
        // Massa de dados
        const secao = 'noticias'

        const configInstrutor = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configGestor = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configLiderEquipe = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }
    
        const configAluno = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'habilitar'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.configurarMultiplasPermissoes(configInstrutor)
        comunicacao.configurarMultiplasPermissoes(configGestor)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipe)
        comunicacao.configurarMultiplasPermissoes(configAluno)
        cy.salvarConfigComunicacao()

        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutor)
        comunicacao.validarMultiplasPermissoes(configGestor)
        comunicacao.validarMultiplasPermissoes(configLiderEquipe)
        comunicacao.validarMultiplasPermissoes(configAluno)

        // UPDATE
        cy.log('## UPDATE ##')

        // Massa de dados para update
        const configInstrutorUpdate = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'criar'],
            acao: 'desabilitar'
        }
    
        const configGestorUpdate = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['editar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configLiderEquipeUpdate = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configAlunoUpdate = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['editar', 'criar'],
            acao: 'desabilitar'
        }

        comunicacao.configurarMultiplasPermissoes(configInstrutorUpdate)
        comunicacao.configurarMultiplasPermissoes(configGestorUpdate)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipeUpdate)
        comunicacao.configurarMultiplasPermissoes(configAlunoUpdate)
        cy.salvarConfigComunicacao()

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutorUpdate)
        comunicacao.validarMultiplasPermissoes(configGestorUpdate)
        comunicacao.validarMultiplasPermissoes(configLiderEquipeUpdate)
        comunicacao.validarMultiplasPermissoes(configAlunoUpdate)

        // DELETE
        cy.log('## DELETE ##')

        // Massa de dados para delete
        const configInstrutorDelete = {
            secao: secao,
            perfil: 'instrutor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configGestorDelete = {
            secao: secao,
            perfil: 'gestor',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configLiderEquipeDelete = {
            secao: secao,
            perfil: 'liderEquipe',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }
    
        const configAlunoDelete = {
            secao: secao,
            perfil: 'aluno',
            permissoes: ['ver', 'editar', 'criar', 'excluir'],
            acao: 'desabilitar'
        }

        comunicacao.configurarMultiplasPermissoes(configInstrutorDelete)
        comunicacao.configurarMultiplasPermissoes(configGestorDelete)
        comunicacao.configurarMultiplasPermissoes(configLiderEquipeDelete)
        comunicacao.configurarMultiplasPermissoes(configAlunoDelete)
        cy.salvarConfigComunicacao()

        // READ-DELETE
        cy.log('## READ-DELETE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarMultiplasPermissoes(configInstrutorDelete)
        comunicacao.validarMultiplasPermissoes(configGestorDelete)
        comunicacao.validarMultiplasPermissoes(configLiderEquipeDelete)
        comunicacao.validarMultiplasPermissoes(configAlunoDelete)
    })

    it('5. CRUD - Logs', () => {
        // Massa de dados
        const configInstrutor = {
            secao: 'logs', 
            perfil: 'instrutor', 
            permissao: 'ver', 
            acao: 'habilitar'
        }

        const configGestor = {
            secao: 'logs', 
            perfil: 'gestor', 
            permissao: 'ver', 
            acao: 'habilitar'
        }    

        const configLiderEquipe = {
            secao: 'logs', 
            perfil: 'liderEquipe', 
            permissao: 'ver', 
            acao: 'habilitar'
        }    

        const configAluno = {
            secao: 'logs', 
            perfil: 'aluno', 
            permissao: 'ver', 
            acao: 'habilitar'
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.configurarCombinacoes(configInstrutor)
        comunicacao.configurarCombinacoes(configGestor)
        comunicacao.configurarCombinacoes(configLiderEquipe)
        comunicacao.configurarCombinacoes(configAluno)
        cy.salvarConfigComunicacao()

        // READ
        cy.log('## READ ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarPermissao(configInstrutor)
        comunicacao.validarPermissao(configGestor)
        comunicacao.validarPermissao(configLiderEquipe)
        comunicacao.validarPermissao(configAluno)

        // UPDATE / DELETE
        cy.log('## UPDATE / DELETE ##')

        // Massa de dados para update
        const configInstrutorUpdate = {secao: 'logs', perfil: 'instrutor', permissao: 'ver', acao: 'desabilitar'}
        const configGestorUpdate = {secao: 'logs', perfil: 'gestor', permissao: 'ver', acao: 'desabilitar'}    
        const configLiderEquipeUpdate = {secao: 'logs', perfil: 'liderEquipe', permissao: 'ver', acao: 'desabilitar'}    
        const configAlunoUpdate = {secao: 'logs', perfil: 'aluno', permissao: 'ver', acao: 'desabilitar'}

        comunicacao.configurarCombinacoes(configInstrutorUpdate)
        comunicacao.configurarCombinacoes(configGestorUpdate)
        comunicacao.configurarCombinacoes(configLiderEquipeUpdate)
        comunicacao.configurarCombinacoes(configAlunoUpdate)
        cy.salvarConfigComunicacao()

        // READ-UPDATE/DELETE
        cy.log('## READ-UPDATE/DELETE ##')

        cy.acessarPgConfigComunicacao()
        comunicacao.validarPermissao(configInstrutorUpdate)
        comunicacao.validarPermissao(configGestorUpdate)
        comunicacao.validarPermissao(configLiderEquipeUpdate)
        comunicacao.validarPermissao(configAlunoUpdate)
    })
})