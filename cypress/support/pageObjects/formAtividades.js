class formAtividades {
    elementos = {
      titulo: {
        seletor: '#content_title',
        tipo: 'input',
        default: 'Novo 1'
      },
      peso: {
        seletor: '#content_duration',
        tipo: 'input',
        default: 1
      },
      liberado: {
        seletor: '#content_status',
        tipo: 'checkbox',
        default: false
      },
      tipoAtividade: {
        seletor: '.radiobox-content',
        tipo: 'radio',
        seletorValor: '#content_content_type'
      },
    }
  
    preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
      const campo = this.elementos[nomeCampo]
  
      if (!campo) {
        throw new Error(`Campo ${nomeCampo} não encontrado`)
      }
  
      const { seletor, tipo, default: valorDefault } = campo
  
      let valorFinal = valor !== undefined ? valor : valorDefault
  
      if (opcoes.limpar && tipo === 'input') {
        cy.get(seletor)
          .clear()
        if (valorFinal === '') {
          return
        }
      }
  
      if (valorFinal === '' && tipo === 'input') {
        cy.get(seletor)
          .clear()
      } else if (valorFinal !== undefined) {
        switch (tipo) {
          case 'input':
            cy.get(seletor)
              .type(valorFinal)
            break
          case 'checkbox':
            cy.get(seletor).then($checkbox => {
              const isChecked = $checkbox.is(':checked')
              if ((valorFinal && !isChecked) || (!valorFinal && isChecked)) {
                cy.get(seletor).click()
              }
            })
            break
          case 'radio':
            cy.contains(seletor, valorFinal)
              .click()
            break
          // ... outros casos para os diferentes tipos de elementos
        }
      } else {
        throw new Error(`Campo ${nomeCampo} não pode ser preenchido com valor ${valorFinal}`)
      }
    }
  
    validarCampo(nomeCampo, valorEsperado) {
      const campo = this.elementos[nomeCampo]

      const mapeamentoTipoAtividade = {
        'Texto': 'text',
        'PDF Estampado': 'pdf',
        'Vídeo': 'video',
        'Vídeo Externo': 'external',
        'Arquivos': 'other',
        'Questionário': 'questions',
        'Scorm': 'scorm',
        'Games': 'games'
      }
  
      if (!campo) {
        throw new Error(`Campo ${nomeCampo} não encontrado`)
      }
  
      const { seletor, tipo, seletorValor } = campo
  
      switch (tipo) {
        case 'input':
          cy.get(seletor)
            .should('have.value', valorEsperado)
          break
        case 'checkbox':
          cy.get(seletor)
            .should(valorEsperado ? 'be.checked' : 'not.be.checked')
          break
        case 'radio':
            const valorMapeado = mapeamentoTipoAtividade[valorEsperado]  
            cy.get(seletorValor)
                .should('have.value', valorMapeado)
          break
      }
    }
  }
  
  export default formAtividades