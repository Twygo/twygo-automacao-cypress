class formParticipantes {
    elementos = {
        email: {
            seletor: '#event_participant_email',
            tipo: 'input-email'
        },
        nome: {
            seletor: '#event_participant_first_name',
            tipo: 'input'
        },
        sobrenome: {
            seletor: '#event_participant_last_name',
            tipo: 'input'
        },
        cpf: {
            seletor: '#event_participant_cpf',
            tipo: 'input'
        },
        rg: {
            seletor: '#event_participant_rg',
            tipo: 'input'
        },
        telPessoal: {
            seletor: '#event_participant_phone1',
            tipo: 'input'
        },
        celular: {
            seletor: '#event_participant_cell_phone',
            tipo: 'input'
        },
        dataExpiracao: {
            seletor: '#event_participant_expires_at',
            tipo: 'input'
        },
        cep: {
            seletor: '#event_participant_zip_code',
            tipo: 'input-zipcode'
        },
        endereco: {
            seletor: '#event_participant_address',
            tipo: 'input-endereco'
        },
        numero: {
            seletor: '#event_participant_address_number',
            tipo: 'input'
        },
        complemento: {
            seletor: '#event_participant_address2',
            tipo: 'input'
        },
        bairro: {
            seletor: '#event_participant_district',
            tipo: 'input'
        },
        cidade: {
            seletor: '#event_participant_city',
            tipo: 'input'
        },
        estado: {
            seletor: '#event_participant_state',
            tipo: 'select'
        },
        pais: {
            seletor: '#event_participant_country',
            tipo: 'select'
        },
        empresa: {
            seletor: '#event_participant_enterprise',
            tipo: 'input'
        },
        ramo: {
            seletor: '#event_participant_business_line',
            tipo: 'input'
        },
        nrColaboradores: {
            seletor: '#event_participant_number_of_employees',
            tipo: 'select'
        },
        site: {
            seletor: '#professional_attributes_site',
            tipo: 'input'
        },
        telComercial: {
            seletor: '#event_participant_phone2',
            tipo: 'input'
        },
        cargo: {
            seletor: '#event_participant_role',
            tipo: 'input'
        },
        area: {
            seletor: '#professional_attributes_department',
            tipo: 'input'
        },
        observacao: {
            seletor: '#event_participant_comment',
            tipo: 'input'
        },
        novaSenha: {
            seletor: '#password',
            tipo: 'input-password'
        },
        confirmacaoSenha: {
            seletor: '#password_confirmation',
            tipo: 'input-password-confirmation',
        },
        btnVoltar: {
            seletor: '.btn-default',
            tipo: 'button'
        },
        btnSalvarENovo: {
            seletor: '.save_and_new',
            tipo: 'button'
        },
        btnCancelar: {
            seletor: '.btn-cancel',
            tipo: 'button'
        },
        selecionarTodos: {
            seletor: '#confirmed_top_all_participants',
            tipo: 'checkbox'
        }
    }

    addParticipante() {
        cy.get('.new_participant_btn')
            .click()
    }

    salvar() {
        cy.get('.save')
            .click()
    }

    editar() {
        cy.get('.btn.btn-primary.ghost.inline.waves-effect')
            .contains('Editar')
            .click()
    }

    voltar() {
        cy.get('.back-container a.btn.btn-default.btn-back')
            .should('be.visible')
            .should('not.be.disabled')
            .should('contain.text', 'Voltar')
            .click({ force: true })
            .then(() => {
                cy.get('#professional-cancel')
                    .should('be.visible')
                    .should('not.be.disabled')
                    .click({ force: true })
            })
    }

    confirmados() {
        cy.get('a.tab_selector[list="confirmed"]')
            .click()
    }

    pendentes() {
        cy.get('a.tab_selector[list="pending"]')
            .click()
    }

    cancelados() {
        cy.get('a.tab_selector[list="canceled"]')
            .click()
    }

    importar() {
        cy.get('.import')
            .click()
    }

    alterarParaPendente() {
        cy.get('.pending_participant')
            .click()
    }

    alterarParaConfirmado() {
        cy.get('.confirm_participant')
            .click()
    }

    alterarParaCancelado() {
        cy.get('.cancel_participant')
            .click()
    }

    /** DOCUMENTAÇÃO:
     * @name preencherCampo
     * 
     * @description
     * Método para preencher campos de um formulário
     * 
     * @actions
     * 1. Verifica se o campo existe
     * 2. Verifica se o campo deve ser limpo antes de preencher
     * 3. Preenche o campo de acordo com o tipo
     * 
     * @param {string} nomeCampo - Nome do campo a ser preenchido
     * @param {string} valor - Valor a ser preenchido no campo
     * @param {object} opcoes - Opções para definir se o campo deve ser limpo antes de preencher
     * 
     * @example
     * preencherCampo('nome', 'Nome do Evento')
     * 
     * @throws {Error} - Caso o campo não seja encontrado
     * @throws {Error} - Caso o tipo do campo não seja suportado
     * @throws {Error} - Caso o campo não possa ser preenchido com o valor informado
     * 
     * @author Karla Daiany
     * @version 1.0.0
     * @since 1.0.0
     */
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
				case 'input-email':
                case 'input-zipcode':
                    cy.get(seletor)
						.clear()
                        .type(valorFinal)
                        .wait(2000)
					break
                case 'input-endereco':
                    cy.get(seletor)
                        .click()
                        .clear()
                        .wait(2000)
                        .type(valorFinal, {delay: 200})
                    break
                case 'input':
                case 'input-password-confirmation':
                    cy.get(seletor)
                        .type(valorFinal)
                    break
				case 'select':
					cy.get(seletor)
						.select(valorFinal)
					break
                case 'input-password':
                    cy.contains('h3', 'Senha')
                        .click()

                    cy.get(seletor)
                        .type(valorFinal)
                    break
				default:
					throw new Error(`Tipo de campo ${tipo} não suportado`)
			}
		} else {
			throw new Error(`Campo ${nomeCampo} não pode ser preenchido com valor ${valorFinal}`)
		}
	}

    /** DOCUMENTAÇÃO:
     * @name validarCampo
     * 
     * @description
     * Método para validar campos de um formulário
     * 
     * @actions
     * 1. Verifica se o campo existe
     * 2. Valida o campo de acordo com o tipo
     * 
     * @param {string} nomeCampo - Nome do campo a ser validado
     * @param {string} valor - Valor a ser validado no campo
     * 
     * @example
     * validarCampo('nome', 'Nome do Evento')
     * 
     * @throws {Error} - Caso o campo não seja encontrado
     * @throws {Error} - Caso o tipo do campo não seja suportado
     * 
     * @author Karla Daiany
     * @version 1.0.0
     * @since 1.0.0
     */
    validarCampo(nomeCampo, valor) {
		const campo = this.elementos[nomeCampo]

		if (!campo) {
			throw new Error(`Campo ${nomeCampo} não encontrado`)
		}

		const { seletor, tipo, default: valorDefault } = campo

		let valorFinal = valor !== undefined ? valor : valorDefault

		switch (tipo) {
			case 'input':
            case 'input-email':
            case 'input-endereco':
                cy.get(seletor)
					.should('have.value', valorFinal)
				break
            case 'input-zipcode':
                cy.get(seletor)
                    .invoke('val')
                    .should(val => {
                        expect(val).to.satisfy(val => 
                            val === '' || /\d{5}-\d{3}/.test(val),
                        )
                    })
                break
			case 'select':
				cy.get(seletor)
					.find('option:selected')
					.should('have.text', valorFinal)
				break
            case 'input-password':
            case 'input-password-confirmation':
                // Não é possível validar campos do tipo password
                break
			default:
				throw new Error(`Tipo de campo ${tipo} não suportado`)
		}
	}
}
export default formParticipantes