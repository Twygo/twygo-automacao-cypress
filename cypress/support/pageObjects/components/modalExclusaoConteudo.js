/**
 * Page Object Model para o modal de exclusão de conteúdos
 * Responsabilidade: Encapsular os seletores e ações relacionadas ao modal de exclusão
 */
class ModalExclusaoConteudo {
  elementos = {
    modal: {
      seletor: '.chakra-modal__content'
    },
    titulo: {
      seletor: '.chakra-modal__header'
    },
    nomeConteudo: {
      seletor: '.chakra-modal__body .chakra-stack p.chakra-text:first-child'
    },
    mensagemConfirmacao: {
      seletor: '.chakra-modal__body .chakra-stack p.chakra-text:last-child'
    },
    btnFechar: {
      seletor: '#events-delete-close-button'
    },
    btnCancelar: {
      seletor: '#events-delete-cancel-button'
    },
    btnExcluir: {
      seletor: '#events-delete-confirm-button'
    }
  }

  /**
   * Valida se o modal está visível e contém as informações corretas
   * @param {string} nomeConteudo - Nome do conteúdo que será exibido no modal
   */
  validarModal(nomeConteudo) {
    const labels = Cypress.env('labels')
    const { prefixoConteudo, mensagemConfirmacao } = labels.modalExclusao
    const tituloModal = labels.conteudo[Cypress.env('tipoConteudoAtual')].tituloModalExclusao
    
    cy.get(this.elementos.modal.seletor)
      .should('be.visible')
    
    cy.get(this.elementos.titulo.seletor)
      .should('be.visible')
      .and('contain.text', tituloModal)
    
    cy.get(this.elementos.nomeConteudo.seletor)
      .should('be.visible')
      .and('contain.text', `${prefixoConteudo} ${nomeConteudo}`)
    
    cy.get(this.elementos.mensagemConfirmacao.seletor)
      .should('be.visible')
      .and('contain.text', mensagemConfirmacao)
  }

  /**
   * Confirma a exclusão clicando no botão Excluir
   */
  confirmarExclusao() {
    cy.get(this.elementos.btnExcluir.seletor)
      .click({ force: true })
  }

  /**
   * Cancela a exclusão clicando no botão Cancelar
   */
  cancelarExclusao() {
    cy.get(this.elementos.btnCancelar.seletor)
      .click({ force: true })
  }

  /**
   * Fecha o modal clicando no botão de fechar (X)
   */
  fecharModal() {
    cy.get(this.elementos.btnFechar.seletor)
      .click({ force: true })
  }
}

export default new ModalExclusaoConteudo() 