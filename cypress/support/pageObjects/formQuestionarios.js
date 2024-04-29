class formQuestionarios {
    // Mapeamento dos elementos da página de criação de questionário
    elementos = {
        addQuestionario: {
            seletor: '#add-question-list',
            tipo: 'button'
        },
        listaQuestionarios: {
            seletor: '.question-list-row',
        },
        nome: {
            seletor: '#question_list_name',
            tipo: 'inputTitle'
        },
        tipoProva: {
            seletor: '#question_list_kind_exam',
            tipo: 'radio'
        },
        tipoPesquisa: {
            seletor: '#question_list_kind_research',
            tipo: 'radio'
        },
        comentarioAluno: {
            seletor: '#question_list_can_comment',
            tipo: 'checkbox'
        },
        parecerInstrutor: {
            seletor: '#question_list_can_instructor_opinion',
            tipo: 'checkbox'
        },
        nomeCategoria1: {
            seletor: '#question_list_categories1_label',
            tipo: 'input'
        },
        nomeCategoria2: {
            seletor: '#question_list_categories2_label',
            tipo: 'input'
        },
        addCategoria1: {
            seletor: '#add_categories1',
            tipo: 'inputAdd',
			seletorValor: '#categories1_'
        },
        addCategoria2: {
            seletor: '#add_categories2',
            tipo: 'inputAdd',
			seletorValor: '#categories2_'
        },
		editarCategoria: {
			seletor: '.edit_category',
			tipo: 'buttonEdit',
			seletorValor: '.category[title="{0}"]'
		},
		edicaoCategoria: {
			seletor: '',
			tipo: 'inputCategoryEdit'
		},
		excluirCategoria: {
			seletor: '.remove_category',
			tipo: 'buttonDelete',
			seletorValor: '.category[title="{0}"]'
		},
        btnAddCategoria1: {
            seletor: '#categories1',
            tipo: 'button'
        },
        btnAddCategoria2: {
            seletor: '#categories2',
            tipo: 'button'
        },
        btnSalvar: {
            seletor: '.green_btn.save',
            tipo: 'button'
        },
        btnSalvarENovo: {
            seletor: '.green_btn.save_and_new',
            tipo: 'button'
        },
        btnCancelar: {
            seletor: '#question-list-cancel',
            tipo: 'button'
        },
        btnVoltar: {
            seletor: '.btn-back',
            tipo: 'button'
        },
        btnEditar: {
            seletor: '.question-list-edit',
            title: 'Editar'
        },
        btnExcluir: {
            seletor: '.question-list-delete',
            title: 'Excluir'
        },
        btnCancelarExclusao: {
            seletor: '#modal-remove-question-list-cancel'
        },
        btnConfirmarExclusao: {
            seletor: '#modal-remove-question-list-confirmed'
        },
        btnPerguntas: {
            seletor: '.question-cell',
        }
    }

	preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
		const campo = this.elementos[nomeCampo]

		if (!campo) {
			throw new Error(`Campo ${nomeCampo} não encontrado`)
		}

		const { seletor, tipo, seletorValor, default: valorDefault } = campo

		let valorFinal = valor !== undefined ? valor : valorDefault

		if (opcoes.limpar && tipo === 'input' || tipo === 'inputTitle') {
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
				case 'inputTitle':
					cy.get(seletor)
						.type(valorFinal)
						.wait(2000)
					break
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
				case 'inputAdd':
					if (Array.isArray(valorFinal)) {
						valorFinal.forEach((valor) => {
						cy.get(seletor)
							.type(valor)
							.type('{enter}')
						})
					} else {
						cy.get(seletor)
						.type(valorFinal)
						.type('{enter}')
					}
					break				
				case 'radio':
					if (valorFinal === true) {
						cy.get(seletor)
						.check({ force: true })
					}
					break				
				case 'button':
					cy.get(seletor)
						.click()
					break
				case 'buttonEdit':
					if (valorFinal) {
						const seletorValorReal = seletorValor.replace('{0}', valorFinal)
						cy.get(seletorValorReal)
							.find(seletor)
							.click()
							.then(() => {
								if (valor.edicaoCategoria) {
									cy.focused().clear().type(valor.edicaoCategoria)
								}
							})
					} else {
						throw new Error(`O valor de ${nomeCampo} está undefined`)
					}
					break				
				case 'buttonDelete':
					if (valorFinal) {
						const seletorValorReal = seletorValor.replace('{0}', valorFinal)
						cy.get(seletorValorReal)
							.find(seletor)
							.click()
					} else {
						throw new Error(`O valor de ${nomeCampo} está undefined`)
					}
					break				
				case 'inputCategoryEdit':
					cy.focused().clear().type(valorFinal)
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
			case 'inputTitle':
				cy.get(seletor)
					.should('have.value', valor)
				break
			case 'inputAdd':
				if (Array.isArray(valor)) {
					cy.get(seletorValor)
						.each(($input, index) => {
							expect($input.val()).to.equal(valor[index])
						})
				}				
				break			
			case 'checkbox':
				cy.get(seletor)
					.should(valor ? 'be.checked' : 'not.be.checked')
				break
			case 'radio':
				if (valor === true) {
					cy.get(seletor)
					.should('be.checked')
				} else {
					cy.get(seletor)
					.should('not.be.checked')
				}
				break
			case 'buttonEdit':
			case 'buttonDelete':
			case 'inputCategoryEdit':
				// Não é necessário validar
				break
			default:
				throw new Error(`Tipo de campo ${tipo} não suportado`)
		}
	}

	// Função para clicar no botão "Adicionar Questionário" da tela de questionários
	addQuestionario() {
		cy.get(this.elementos.addQuestionario.seletor)
			.click()
	}
	
    salvarQuestionario() {
        cy.get(this.elementos.btnSalvar.seletor)
            .click()
    }

    salvarENovoQuestionario() {
        cy.get(this.elementos.btnSalvarENovo.seletor)
            .click()
    }

    cancelarQuestionario() {
        cy.get(this.elementos.btnCancelar.seletor)
            .click()
    }

    voltarQuestionario() {
        cy.get(this.elementos.btnVoltar.seletor)
            .click()
    }
}
export default formQuestionarios