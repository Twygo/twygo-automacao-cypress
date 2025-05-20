import BaseAtividade from './baseAtividade'

class AtividadePagina extends BaseAtividade {
  // Elementos específicos da Atividade Página
  elements = {
    editarPagina: {
      seletor: '#content-page .chakra-button',
      tipo: 'button'
    },
    fecharEditarPagina: {
      seletor: '.chakra-modal__close-btn',
      tipo: 'button'
    }
  }

  // Getter que combina elementos base + específicos
  get allElements() {
    return { ...this.elementsComuns, ...this.elements }
  }

  // Métodos específicos para atividade de página
  preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
    return this.preencherCampoGenerico(nomeCampo, valor, this.allElements, opcoes)
  }

  validarCampo(nomeCampo, valor) {
    return this.validarCampoGenerico(nomeCampo, valor, this.allElements)
  }

  // Método para editar a página
  editarPagina() {
    this.preencherCampo('editarPagina')
    // Aguardar carregamento do editor
    cy.wait(2000)
    return this
  }

  // Método para fechar o editor de página
  fecharEditorPagina() {
    this.preencherCampo('fecharEditarPagina')
    return this
  }

  // Método para preencher formulário completo
  preencherFormularioCompleto(dados, opcoes = { limpar: true }) {
    // Preencher campos básicos
    if (dados.titulo) this.preencherCampo('titulo', dados.titulo, opcoes)
    if (dados.peso !== undefined) this.preencherCampo('peso', dados.peso, opcoes)
    if (dados.liberado !== undefined) this.preencherCampo('liberado', dados.liberado)
    if (dados.tipoAtividade) this.preencherCampo('tipoAtividade', dados.tipoAtividade)
    if (dados.resumoAtividade) this.preencherCampo('resumoAtividade', dados.resumoAtividade)
    
    // Se precisa editar página
    if (dados.editarPagina) {
      this.editarPagina()
      this.fecharEditorPagina()
    }
    
    return this
  }

  // Método para validar formulário completo
  validarFormularioCompleto(dados) {
    // Validar campos básicos
    if (dados.titulo) this.validarCampo('titulo', dados.titulo)
    if (dados.peso !== undefined) this.validarCampo('peso', dados.peso)
    if (dados.liberado !== undefined) this.validarCampo('liberado', dados.liberado)
    if (dados.tipoAtividade) this.validarCampo('tipoAtividade', dados.tipoAtividade)
    if (dados.resumoAtividade) this.validarCampo('resumoAtividade', dados.resumoAtividade)
    
    return this
  }
}

export default new AtividadePagina() 