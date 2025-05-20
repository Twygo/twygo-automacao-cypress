class BaseAtividade {
  // Elementos comuns a todos os tipos de atividades
  elementsComuns = {
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
    resumoAtividade: {
      seletor: 'div#cke_content_briefing iframe.cke_wysiwyg_frame',
      tipo: 'iframeText'
    }
  }

  // Métodos comuns a todos os tipos
  preencherCampoGenerico(nomeCampo, valor, elementos, opcoes = { limpar: false }) {
    const campo = elementos[nomeCampo]

    if (!campo) {
      throw new Error(`Campo ${nomeCampo} não encontrado`)
    }

    const { seletor, tipo, default: valorDefault, seletorValor } = campo

    // Se for um botão, apenas clique nele sem necessidade de valor
    if (tipo === 'button') {
      cy.get(seletor)
        .click()
      return this
    }

    let valorFinal = valor !== undefined ? valor : valorDefault

    if (opcoes.limpar && tipo === 'input') {
      cy.get(seletor)
        .clear()
      if (valorFinal === '') {
        return this
      }
    }

    if (valorFinal === '' && tipo === 'input') {
      cy.get(seletor)
        .clear()
    } else if (valorFinal !== undefined) {
      switch (tipo) {
        case 'input':
        case 'inputText':
          cy.get(seletor)
            .type(valorFinal)
          break
        case 'checkbox':
          cy.get(seletor)
            .then($checkbox => {
              const isChecked = $checkbox.is(':checked')
              if ((valorFinal && !isChecked) || (!valorFinal && isChecked)) {
                cy.get(seletor)
                  .click()
              }
            })
          break
        case 'radio':
          cy.contains(seletor, valorFinal)
            .click()
          break
        case 'iframeText':
          cy.get(seletor)
            .then($iframe => {
              const doc = $iframe.contents()
              cy.wrap(doc)
                .find('body.cke_editable')
                .click({ force: true })
                .clear()
                .type(valorFinal, { force: true })
            })
          break
        case 'select':
          cy.get(seletor)
            .select(valorFinal)
          break
        case 'search':
          cy.get(seletor)
            .click()
            .type(valorFinal)
            .type('{enter}')

          cy.get('.item_name')
            .contains(valorFinal)
            .click()
          break
        case 'uploadButton':
          if (valorFinal) {
            cy.get(seletor)
              .click()

            cy.get('#file')
              .selectFile(`cypress/fixtures/${valorFinal}`, { force: true })

            cy.get('#button_send_file')
              .click()

            cy.get(seletor, { timeout: 15000 })
              .contains('Substituir arquivo', { timeout: 15000 })
              .should('be.visible')
          }
          break
        case 'radioVideo':
          if (valorFinal) {
            cy.get(seletor)
              .click()
          }
          break
        case 'fileDescription':
          // Nenhuma ação necessária
          break
        default:
          throw new Error(`Tipo de campo ${tipo} não suportado`)
      }
    } else {
      throw new Error(`Campo ${nomeCampo} não pode ser preenchido com valor ${valorFinal}`)
    }

    return this
  }

  // Métodos comuns para validar campos
  validarCampoGenerico(nomeCampo, valor, elementos) {
    const campo = elementos[nomeCampo]

    if (!campo) {
      throw new Error(`Campo ${nomeCampo} não encontrado`)
    }

    const { seletor, tipo, seletorValor, default: valorDefault } = campo

    const mapeamentoTipoAtividade = {
      'Texto': 'text',
      'Página': 'page',
      'Aula': 'lesson',
      'PDF Estampado': 'pdf',
      'Vídeo': 'video',
      'Vídeo Externo': 'external',
      'Arquivos': 'other',
      'Questionário': 'questions',
      'Scorm': 'scorm',
      'Games': 'games'
    }

    let valorFinal = valor !== undefined ? valor : valorDefault

    switch (tipo) {
      case 'input':
        cy.get(seletor)
          .should('have.value', valor)
        break
      case 'inputText':
        cy.get(seletor)
          .should('have.text', valor)
        break
      case 'checkbox':
        cy.get(seletor)
          .should(valor ? 'be.checked' : 'not.be.checked')
        break
      case 'radio':
        const valorMapeado = mapeamentoTipoAtividade[valor]
        cy.get(seletorValor)
          .should('have.value', valorMapeado)
        break
      case 'radioVideo':
        if (valorFinal) {
          cy.get(`${seletor}[value="${nomeCampo}"]`)
            .should('be.checked')
        } else {
          cy.get(`${seletor}[value="${nomeCampo}"]`)
            .should('not.be.checked')
        }
        break
      case 'select':
        cy.get(seletor)
          .find('option:selected')
          .should('have.text', valorFinal)
        break
      case 'iframeText':
        cy.get(seletor)
          .then($iframe => {
            const doc = $iframe.contents()
            cy.wrap(doc)
              .find('body.cke_editable')
              .then($body => {
                cy.wrap($body)
                  .should('have.text', valorFinal)
              })
          })
        break
      case 'search':
        if (valor) {
          cy.get(seletor)
            .find(seletorValor)
            .should('have.attr', 'title', `${valor} - Prova`)
        } else {
          cy.get(seletor)
            .find(seletorValor)
            .should('not.exist')
        }
        break
      case 'uploadButton':
        if (valorFinal) {
          cy.get(seletor)
            .should('contain', 'Substituir arquivo')
        } else {
          cy.get(seletor)
            .should('contain', 'Enviar arquivo')
        }
        break
      case 'fileDescription':
        if (valorFinal === '') {
          cy.get(seletor)
            .should($desc => {
              const descText = $desc.text().trim()
              expect(descText).to.be.empty
            })
        } else if (valorFinal.nome && valorFinal.tamanho) {
          cy.get(seletor)
            .should($desc => {
              let descText = $desc.text().trim()
              descText = descText.replace(/\s*\n\s*/g, ' ')

              const nomeEsperado = `Nome: ${valorFinal.nome}`
              const tamanhoFormatado = `Tamanho: ${valorFinal.tamanho}`

              expect(descText).to.include(nomeEsperado)
              expect(descText).to.include(tamanhoFormatado)
            })
        } else {
          cy.get(seletor)
            .should('exist')
        }
        break
      default:
        throw new Error(`Tipo de campo ${tipo} não suportado para validação`)
    }

    return this
  }

  // Métodos de ação comuns
  salvar() {
    cy.get('#button_send_form')
      .click()
    
    return this
  }

  cancelar() {
    cy.get('#event-cancel')
      .click()
    
    return this
  }

  voltar() {
    cy.contains('.btn-back', 'Voltar')
      .click()
    
    return this
  }
}

export default BaseAtividade 