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
    const labels = Cypress.env('labels')
    const { txtNenhumResultado } = labels.ambientesAdicionais
    const nomesAmbientes = []

    // Acessa a página de ambientes adicionais
    cy.acessarPgAmbientesAdicionais()

    cy.wait(3000)

    // Verifica se a página não contém resultados
    cy.get('body').then(($body) => {
        if ($body.find(`div#details h2.chakra-heading:contains("${txtNenhumResultado}")`).length > 0) {
            // Se não houver resultados, não há ambientes para excluir
        } else {
            // Seleciona todos os elementos que contêm os nomes dos ambientes
            cy.get('.chakra-text.partner-card-text span').each(($el) => {
                nomesAmbientes.push($el.text())
            }).then(() => {
                // Após coletar todos os nomes dos ambientes, iterar sobre eles para exclusão
                Cypress._.each(nomesAmbientes, (nome) => {
                    cy.inativarAmbienteAdicional(nome)
                })
            })
        }
    })
})