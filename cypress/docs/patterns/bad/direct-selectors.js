/**
 * ❌ EXEMPLO DE ANTI-PADRÃO: Seletores Diretos
 *
 * Este exemplo demonstra práticas que devem ser evitadas:
 * - Uso de seletores diretamente nos testes
 * - Seletores frágeis baseados em classes genéricas
 * - Ausência de estrutura AAA
 * - Falta de encadeamento
 */
describe('Login (Anti-padrão)', () => {
  it('deve fazer login', () => {
    cy.visit('/login')

    // ❌ Seletores diretos no teste
    cy.get('.form-input').first().type('user@example.com')

    // ❌ Seletor frágil baseado em índice
    cy.get('.form-input').eq(1).type('password123')

    // ❌ Classe genérica
    cy.get('.btn').click()

    // ❌ Espera fixa
    cy.wait(2000)

    // ❌ Verificação sem contexto claro
    cy.get('h1').should('be.visible')
  })
})
