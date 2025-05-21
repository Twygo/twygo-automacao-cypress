/**
 * ✅ EXEMPLO DE BOA PRÁTICA: Page Object Model
 *
 * Este exemplo demonstra a implementação correta do padrão Page Object Model:
 * - Seletores centralizados na propriedade elements
 * - Métodos com responsabilidade única
 * - Retorno de this para encadeamento
 * - JSDoc em todos os métodos
 */
class LoginPage {
  // Centralização de todos os seletores
  elements = {
    emailInput: () => cy.get('[data-cy=email], #email'),
    passwordInput: () => cy.get('[data-cy=password], #password'),
    loginButton: () => cy.get('[data-cy=login-button], #login-button'),
  }

  /**
   * Preenche o campo de email
   * @param {string} email - Email do usuário
   * @returns {LoginPage} - Instância para encadeamento
   */
  typeEmail(email) {
    this.elements.emailInput().clear().type(email)
    return this
  }

  /**
   * Preenche o campo de senha
   * @param {string} password - Senha do usuário
   * @returns {LoginPage} - Instância para encadeamento
   */
  typePassword(password) {
    this.elements.passwordInput().clear().type(password)
    return this
  }

  /**
   * Clica no botão de login
   * @returns {LoginPage} - Instância para encadeamento
   */
  clickLogin() {
    this.elements.loginButton().click()
    return this
  }

  /**
   * Realiza o processo completo de login
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {LoginPage} - Instância para encadeamento
   */
  login(email, password) {
    this.typeEmail(email)
    this.typePassword(password)
    this.clickLogin()
    return this
  }
}

export default new LoginPage()
