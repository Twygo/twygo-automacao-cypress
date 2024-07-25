/// <reference types="cypress" />

// Hooks globais

before(() => {
    // Carrega os labels do arquivo JSON
    cy.fixture('labels.json').then((labels) => {
        Cypress.env('labels', labels)
    })
})