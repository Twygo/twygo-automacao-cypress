class formPerguntas {
    elementos = {
        titulo: {
            seletor: '#title',
            tipo: 'input'
        },
        descricao: {
            seletor: 'div#cke_description_new-1 iframe.cke_wysiwyg_frame',
            tipo: 'iframe'
        },
        ordenacao: {
            seletor: '#order',
            tipo: 'input'
        },
        tipoPergunta: {
            seletor: '#kind',
            tipo: 'select'
        },
        perguntaDesabilitada: {
            seletor: '#is_disable',
            tipo: 'checkbox'
        },
        perguntaObrigatoria: {
            seletor: '#require_answer',
            tipo: 'checkbox'
        },
        explicacao: {
            seletor: '#explanation',
            tipo: 'input'
        },
        categoria1: {
            seletor: '#category1',
            tipo: 'select'
        },
        categoria2: {
            seletor: '#category2',
            tipo: 'select'
        },
        // Campos de respostas única e múltipla escolha
        resposta1: {
            seletor: '#cke_answer_new-1 iframe.cke_wysiwyg_frame',
            tipo: 'iframe'
        },
        resposta2: {
            seletor: '#cke_answer_new-2 iframe.cke_wysiwyg_frame',
            tipo: 'iframe'
        },
        resposta3: {
            seletor: '#cke_answer_new-3 iframe.cke_wysiwyg_frame',
            tipo: 'iframe'
        },
        radioResposta1: {
            seletor: 'input[type="radio"][value="new-1"]',
            tipo: 'radio',
        },
        radioResposta2: {
            seletor: 'input[type="radio"][value="new-2"]',
            tipo: 'radio',
        },
        radioResposta3: {
            seletor: 'input[type="radio"][value="new-3"]',
            tipo: 'radio',
        },
        checkResposta1: {
            seletor: 'input[type="checkbox"][value="new-1"]',
            tipo: 'checkbox',
        },
        checkResposta2: {
            seletor: 'input[type="checkbox"][value="new-2"]',
            tipo: 'checkbox',
        },
        checkResposta3: {
            seletor: 'input[type="checkbox"][value="new-3"]',
            tipo: 'checkbox',
        },
        // Campos para faixa de valores
        valorInicial: {
            seletor: '#start_scale',
            tipo: 'input'
        },
        valorFinal: {
            seletor: '#end_scale',
            tipo: 'input'
        }
    }

    // Botão para adicionar nova pergunta
    addPergunta() {
        cy.get('.new_question_btn')
            .click()
    }

    salvar() {
        cy.get('#save_question')
            .click()
    }

    salvarENovo() {
        cy.get('#save_and_new_question')
            .click()
    }

    remover() {
        cy.get('#remove_question')
            .click( { force: true } )
    }

    expandirPergunta() {
        cy.get('.div-table-arrow-down')
        .click()
    }

    addResposta() {
        cy.get('#add_answer')
            .click( { force: true } )
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
                    if (valorFinal === true) {
                        cy.get(seletor)
                            .check({ force: true })
                    }
                    break
				case 'iframe':
					cy.get(seletor).then($iframe => {
						const doc = $iframe.contents()
						cy.wrap(doc).find('body.cke_editable').click({ force: true }).clear().type(valorFinal, { force: true })
					})
					break
				case 'select':
					cy.get(seletor)
						.select(valorFinal)
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
            case 'radio':
				cy.get(seletor)
					.should(valor ? 'be.checked' : 'not.be.checked')
				break
			case 'select':
				cy.get(seletor)
					.find('option:selected')
					.should('have.text', valorFinal)
				break
			case 'iframe':
				cy.get(seletor).then($iframe => {
					const doc = $iframe.contents()

					cy.wrap(doc).find('body.cke_editable').then($body => {
						cy.wrap($body).should('have.text', valorFinal)
					})
				})
				break
			default:
				throw new Error(`Tipo de campo ${tipo} não suportado`)
		}
	}
}
export default new formPerguntas