// Função para realizar a autenticação e obter o token Bearer
export function getAuthToken() {
  return cy.request({
    method: 'POST',
    url: '/oauth/token',
    body: {
      grant_type: 'password',
      username: Cypress.env('login'),
      password: Cypress.env('password'),
    }
  }).then((response) => {
    Cypress.env('token', response.body.access_token)
  })
}