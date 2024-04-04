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
      preRequisitos: {
        seletor: '.new-requirement',
        tipo: 'button'
      },
      tipoAtividade: {
        seletor: '.radiobox-content',
        tipo: 'radio',
        seletorValor: '#content_content_type'
      },
      resumoAtividade: {
        seletor: 'div#cke_2_contents iframe.cke_wysiwyg_frame',
        tipo: 'iframe_text'
      },
      tempoMinPermanencia: {
        seletor: '#enable_minimum_permanence_time',
        tipo: 'checkbox',
        default: false
      },
      escolherArquivo: {
        seletor: '#file',
        tipo: 'button'
      },
      salvarEnvioArquivo: {
        seletor: '#button_send_file',
        tipo: 'button'
      },
      cancelarEnvioArquivo: {
        seletor: '#event-cancel',
        tipo: 'button'
      },
      // Texto
      descricaoTexto: {
        seletor: 'div#cke_1_contents iframe.cke_wysiwyg_frame',
        tipo: 'iframe_text'
      },
      // PDF
      enviarPdf: {
        seletor: '#pdf_link',
        tipo: 'button'
      },
      descricaoArquivoPdf: {
        seletor: '#pdf-description'
      },
      // Segurança para PDF, Vídeos e Arquivos
      seguranca: {
        seletor: '#content_file_security',
        tipo: 'select',
        default: 'Somente Visualizar'
      },
      // Vídeo
      enviarVideo: {
        seletor: '#video_link',
        tipo: 'button'
      },
      descricaoArquivoVideo: {
        seletor: '#video-description'
      },
      marcarConcluidoVideo: {
        seletor: '#mark_completed_video',
        tipo: 'checkbox',
        default: false
      },
      naoMostrarProgresso: {
        seletor: '#controll_bar_video',
        tipo: 'checkbox',
        default: false
      },
      // Vídeo Externo
      youtube: {
        seletor: 'value="youtube"',
        tipo: 'radio',
        default: 'checked'
      },
      vimeo: {
        seletor: 'value="vimeo"',
        tipo: 'radio'
      },
      eventials: {
        seletor: 'value="eventials"',
        tipo: 'radio'
      },
      // Preencher URL YouTube e Vimeo
      videoUrl: {
        seletor: '#content_video_url',
        tipo: 'input'
      },
      // Preencher URL e Chat Eventials
      videoEventials: {
        seletor: '#eventials_video',
        tipo: 'input'
      },
      chatEventials: {
        seletor: '#eventials_chat',
        tipo: 'input'
      },
      // Opção para YouTube, Vimeo e Eventials
      marcarConcluidoVideoExterno: {
        seletor: '#mark_completed_external',
        tipo: 'checkbox',
        default: false
      },
      // Opções para YouTube e Eventials
      naoMostrarProgressoVideoExterno: {
        seletor: '#controll_bar_external',
        tipo: 'checkbox',
        default: false
      },
      chatTwygo: {
        seletor: '#enable_content_chat_external',
        tipo: 'checkbox',
        default: false
      },
      desabilitarChatFimTransmissao: {
        seletor: '#disable_chat_at_end_external',
        tipo: 'checkbox',
        default: false
      },
      // Arquivos
      enviarArquivos: {
        seletor: '#other_link',
        tipo: 'button'
      },
      descricaoArquivo: {
        seletor: '#other-description'
      },
      // Questionário
      selecionarQuestionario: {
        seletor: '#question_list_name',
        tipo: 'search',
        seletorValor: '.item_name'
      },
      exibicaoPerguntas: {
        seletor: '#content_question_draw',
        tipo: 'select',
        default: 'Exibir mesmas perguntas nas tentativas'
      },
      visualizacaoRespostas: {
        seletor: '#content_question_list_method',
        tipo: 'select',
        default: 'Exibir Apenas Nota'
      },
      pontuacaoMinima: {
        seletor: '#content_minimum_score',
        tipo: 'input'
      },
      tentativas: {
        seletor: '#content_attempts',
        tipo: 'input'
      },
      percPontuacaoFinal: {
        seletor: '#content_score_percentage',
        tipo: 'input',
        default: '0'
      },
      adicionarPerguntas: {
        seletor: '.add_category',
        tipo: 'button'
      },
      perguntasCat1: {
        seletor: '#question_params_questions_category1',
        tipo: 'select',
        default: 'Todas'
      },
      perguntasCat2: {
        seletor: '#question_params_questions_category2',
        tipo: 'select',
        default: 'Todas'
      },
      quantidadePerguntas: {
        seletor: '#question_params_questions_amount',
        tipo: 'input'
      },
      // Scorm
      enviarScorm: {
        seletor: '#scorm_link',
        tipo: 'button'
      },
      descricaoArquivoScorm: {
        seletor: '#scorm-description'
      },
      marcarConcluidoScorm: {
        seletor: '#mark_completed_scorm',
        tipo: 'checkbox'
      },
      // Games
      codigoCompartilhamento: {
        seletor: '#game-key',
        tipo: 'input'
      }
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
          case 'iframe_text':
            cy.get(seletor, { timeout: 5000 }).then($iframe => {
              const doc = $iframe.contents()
              cy.wrap(doc).find('body.cke_editable').click({ force: true }).clear().type(valorFinal, { force: true })
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
            break
          case 'button':
            cy.get(seletor)
              .click()
            break
          default:
            throw new Error(`Tipo de campo ${tipo} não suportado`)    
        }
      } else {
        throw new Error(`Campo ${nomeCampo} não pode ser preenchido com valor ${valorFinal}`)
      }
    }
  
    validarCampo(nomeCampo, valor) {
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
  
      const { seletor, tipo, seletorValor, default: valorDefault } = campo
  
      let valorFinal = valor !== undefined ? valor : valorDefault
  
      switch (tipo) {
        case 'input':
          cy.get(seletor)
            .should('have.value', valor)
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
        case 'select':
          cy.get(seletor)
            .find('option:selected')
            .should('have.text', valorFinal)
          break
        case 'iframe_text':
          cy.get(seletor, { timeout: 5000 }).then($iframe => {
            const doc = $iframe.contents()
          
            cy.wrap(doc).find('body.cke_editable').then($body => {
              cy.wrap($body).should('have.text', valorFinal)
            })
          })
          break      
        case 'search':
          cy.get(seletorValor)
            .should('have.text', valor)
          break
      }
    }

    salvar = () => {
      cy.get('#button_send_form')
        .click()
    }
  }
  
  export default formAtividades