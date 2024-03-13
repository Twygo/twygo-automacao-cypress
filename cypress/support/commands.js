// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Em cypress/support/commands.js
Cypress.Commands.add("criarCatalogoViaApi", (body, attempt = 1) => {
    cy.request({
      method: 'POST',
      url: `/api/v1/o/${Cypress.env('orgId')}/portfolio`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cypress.env('token')}`
      },
      body: body,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status !== 201 && attempt < 3) {
        cy.log(`Tentativa ${attempt}: Falha na requisição. Tentando novamente`)
        cy.makeRequestWithRetry(url, body, attempt + 1)
      } else {
        expect(response.status).to.eq(201)
      }
    })
})

Cypress.Commands.add('excluirCatalogoViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/portfolio`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
  }).then((response) => {
    expect(response.status).to.eq(200)
    const portfolios = response.body.portfolios
    portfolios.forEach((portfolio) => {
      cy.request({
        method: 'DELETE',
        url: `/api/v1/o/${Cypress.env('orgId')}/portfolio/${portfolio.id}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${Cypress.env('token')}`
        },
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200)
      })
    })
  })
})

Cypress.Commands.add('excluirCursoViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/courses?page=1&per_page=99999`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
  }).then((response) => {
    expect(response.status).to.eq(200)
    const courses = response.body.courses.contents
    courses.forEach((course) => {
      cy.request({
        method: 'DELETE',
        url: `/api/v1/o/${Cypress.env('orgId')}/courses/${course.id}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${Cypress.env('token')}`
        },
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200)
      })
    })
  })
})