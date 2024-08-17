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
  