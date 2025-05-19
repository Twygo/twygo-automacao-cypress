/**
 * Page Object Model para interação com o menu de opções (três pontos)
 * Responsabilidade única: abrir o menu e selecionar uma ação
 */
class MenuOpcoes {
  /**
   * Mapeamento do botão de menu de opções.
   * Utiliza seletor dinâmico: 'button[id^="menu-button-"]' para capturar qualquer botão cujo id comece com 'menu-button-'.
   * Não é necessário usar barras invertidas para o caractere ':', pois o seletor CSS [id^="menu-button-"] já cobre todos os casos dinâmicos.
   */
  elementos = {
    menuOpcoes: {
      seletor: 'button[id^="menu-button-"]',
      descricao: 'Botão de menu de opções (três pontos) dinâmico'
    },
    menuList: {
      seletor: '.chakra-menu__menu-list',
      descricao: 'Lista de opções do menu'
    }
  };

  /**
   * Abre o menu de opções e clica na ação desejada
   * @param {string} item - Texto da ação a ser clicada
   * @param {string} seletorContexto - Seletor do contexto do item
   * @returns {this}
   */
  executarAcaoMenu(item, seletorContexto) {
    cy.get(seletorContexto)
      .find('button[id^="menu-button-"]')
      .click({ force: true });
    cy.get('body')
      .find(this.elementos.menuList.seletor)
      .find('.chakra-menu__menuitem')
      .contains(item)
      .click({ force: true });
    return this;
  }
}

export default new MenuOpcoes(); 