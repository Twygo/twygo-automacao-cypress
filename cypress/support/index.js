/// <reference types="cypress" />

// :: Hooks globais ::
before(() => {
    // :: Carrega os labels do arquivo JSON ::
    cy.log(':: Carrega os labels do arquivo JSON ::')

    cy.fixture('labels.json').then((labels) => {
        Cypress.env('labels', labels)
    })
})

beforeEach(() => {
    // :: Ignora mensagens de erro conhecidas ::
    cy.ignorarCapturaErros([
        // Chrome
        //"ResizeObserver loop completed with undelivered notifications",
        "Cannot read properties of undefined (reading 'replace')",
        "Cannot read properties of null (reading 'getClientRect')",
        "Cannot read properties of undefined (reading 'toString')",
        "Cannot read properties of undefined (reading 'length')",
        "Cannot read properties of undefined (reading 'hasAttribute')",
        "Cannot read properties of null (reading 'addEventListener')",
        "Cannot read properties of undefined (reading 'test')",
        "Unexpected token 'else'",
        "Cannot read properties of null (reading 'style')"
    ], { ignoreScriptErrors: true, ignoreNetworkErrors: true })

    // :: Realiza o login na Twygo com o usuário de automação e altera para perfil administrador ::
    cy.loginTwygoAutomacaoAdm()
})

afterEach(() => {
    // :: Ativa a captura de erros ::
    cy.ativarCapturaErros()
})