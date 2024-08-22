import { gerarDados } from '../support/helpers/geradorDados'
import { getAuthToken } from '../support/authHelper'

// » Realizar login na Twygo com o usuário 'Twygo Automação' e alterar perfil para 'Administrador'
Cypress.Commands.add('loginTwygoAutomacaoAdm', () => {
    const login = Cypress.env('login')
    const senha = Cypress.env('password')
    const nome = Cypress.env('username')
    const perfil = 'administrador'

    cy.login(login, senha, nome)
    cy.alterarPerfil(perfil)
})

// » Validar se existem ambientes adicionais cadastrados e excluí-los
Cypress.Commands.add('inativarTodosAmbientesAdicionais', () => {
    cy.log(':: Inativando todos os ambientes adicionais ::')
    const labels = Cypress.env('labels')

    // Acessa a página de ambientes adicionais
    cy.acessarPgAmbientesAdicionais()

    // Verifica se a página contém ambientes e inativa todos
    cy.inativarAmbienteAdicional()
})

/**
 * :: Pré-condições - cursoAmbienteAdicional e trilhaAmbienteAdicional ::
 * - Obtém o token de autenticação
 * - Exclui todos os cursos e trilhas
 * - Cria um novo curso via API ou trilha via interface
 * - Exclui todos os ambientes adicionais
 * - Cria dois novos ambientes adicionais para o teste
 * - Retorna os dados gerados (nomeConteudo, nomeAmbienteAdicional1, nomeAmbienteAdicional2)
 * @param {String} tipoConteudo - Tipo de conteúdo
 * @param {String} situacaoConteudo - Situação do conteúdo
 * @returns {Object} - Dados gerados - { nomeConteudo, nomeAmbienteAdicional1, nomeAmbienteAdicional2 }
 */
Cypress.Commands.add('preCondConteudoAmbienteAdicional', (tipoConteudo, situacaoConteudo) => {
    // Gera nomes aleatórios para o conteúdo e para os ambientes adicionais
    const nomeConteudo = gerarDados('nomeProduto')
    const nomeAmbienteAdicional1 = gerarDados('nomeProduto')
    const nomeAmbienteAdicional2 = gerarDados('nomeProduto')

    // Exclui todos os cursos
    getAuthToken()
    cy.excluirCursoViaApi()

    // Exclui todas as trilhas
    const listaConteudos = []
    cy.listaConteudo('trilha', listaConteudos)
    cy.excluirConteudo(null, 'trilha', listaConteudos)

    switch (tipoConteudo) {
        case 'curso':
            // Criar curso via API
            const body = {
                name: nomeConteudo,
                description: gerarDados('descricaoProduto'),
                situation: situacaoConteudo
            }   
            cy.criarCursoViaApi(body)
            break
        case 'trilha':
            // Criar trilha
            const conteudo = {
                nome: nomeConteudo,
                descricao: gerarDados('descricaoProduto'),
                situacao: situacaoConteudo
            }

            cy.addConteudo(tipoConteudo)
            cy.preencherDadosConteudo(conteudo, { limpar: true })
            cy.salvarConteudo(conteudo.nome, tipoConteudo)
            break
        default:
            throw new Error(`Tipo de conteúdo não suportado: ${tipoConteudo}`)
    }

    // Excluir todos os ambientes adicionais
    cy.acessarPgAmbientesAdicionais()
    cy.inativarTodosAmbientesAdicionais()
    
    // Cria dois novos ambientes adicionais para o teste
    let dados = {
        nome: nomeAmbienteAdicional1,
        email: gerarDados('email'),
        telefone: gerarDados('telefone', 'celular'),
        site: gerarDados('site')
    }
    cy.criarAmbienteAdicional('Criar', dados, { limpar: true })

    dados = {
        nome: nomeAmbienteAdicional2,
        email: gerarDados('email'),
        telefone: gerarDados('telefone', 'fixo'),
        site: gerarDados('site')
    }
    cy.criarAmbienteAdicional('Adicionar', dados, { limpar: true })

    // Define os dados gerados em variáveis de ambiente para uso posterior
    Cypress.env('nomeConteudo', nomeConteudo)
    Cypress.env('nomeAmbienteAdicional1', nomeAmbienteAdicional1)
    Cypress.env('nomeAmbienteAdicional2', nomeAmbienteAdicional2)
})

/**
 * :: Pós-condições - cursoAmbienteAdicional e trilhaAmbienteAdicional ::
 * - Exclui todos os cursos
 * - Exclui todas as trilhas
 * - Exclui todos os ambientes adicionais
 */
Cypress.Commands.add('posCondConteudoAmbienteAdicional', () => {
    // Excluir todos os cursos
    getAuthToken()
    cy.excluirCursoViaApi()

    // Excluir todas as trilhas
    const listaConteudos = []
    cy.acessarPgListaConteudos()
    cy.listaConteudo('trilha', listaConteudos)
    cy.excluirConteudo(null, 'trilha', listaConteudos)

    // Excluir todos os ambientes adicionais
    cy.acessarPgAmbientesAdicionais()
    cy.inativarTodosAmbientesAdicionais()
})
