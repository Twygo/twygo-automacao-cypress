// :: Comandos de pré-condições ::

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