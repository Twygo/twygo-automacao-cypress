import BaseAtividade from './baseAtividade'

class AtividadeAula extends BaseAtividade {
  // Elementos específicos da Atividade Aula
  elements = {
    editarAula: {
      seletor: '#content-lesson .chakra-button',
      tipo: 'button'
    },
    fecharEditarAula: {
      seletor: '#close-layout-aba-certificate',
      tipo: 'button'
    }
  }

  // Getter que combina elementos base + específicos
  get allElements() {
    return { ...this.elementsComuns, ...this.elements }
  }

  // Métodos específicos para atividade de aula
  preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
    return this.preencherCampoGenerico(nomeCampo, valor, this.allElements, opcoes)
  }

  validarCampo(nomeCampo, valor) {
    return this.validarCampoGenerico(nomeCampo, valor, this.allElements)
  }

  // Método para editar a aula
  editarAula() {
    this.preencherCampo('editarAula')
    // Aguardar carregamento do editor
    cy.wait(2000)
    return this
  }

  // Método para fechar o editor de aula
  fecharEditorAula() {
    this.preencherCampo('fecharEditarAula')
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
    
    // Se precisa editar aula
    if (dados.editarAula) {
      this.editarAula()
      this.fecharEditorAula()
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

export default new AtividadeAula() 