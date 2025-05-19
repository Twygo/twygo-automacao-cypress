/// <reference types="cypress" />

// Inicialize skipLogin como false no ambiente do Cypress
Cypress.env('skipLogin', false)

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
        "Cannot read properties of null (reading 'style')",
        "This CKEditor 4.17.1 version is not secure. Consider upgrading to the latest one"
    ], { ignoreScriptErrors: true, ignoreNetworkErrors: true })

    // Validar se o login deve ser ignorado
    if (Cypress.env('skipLogin')) {
        // Se skipLogin for verdadeiro, não executa o login
        return
    }

    // :: Realiza o login na Twygo com o usuário de automação e altera para perfil administrador ::
    cy.loginTwygoAutomacaoAdm()
})

afterEach(() => {
    // :: Ativa a captura de erros ::
    cy.ativarCapturaErros()
})