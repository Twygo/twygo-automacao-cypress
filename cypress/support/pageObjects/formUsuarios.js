class formUsuarios {
    elementos = {
        email: {
            seletor: '#professional_email',
            tipo: 'input'
        },
        nome: {
            seletor: '#professional_first_name',
            tipo: 'input'
        },
        sobrenome: {
            seletor: '#professional_last_name',
            tipo: 'input'
        },
        cpf: {
            seletor: '#professional_cpf',
            tipo: 'input'
        },
        rg: {
            seletor: '#professional_rg',
            tipo: 'input'
        },
        telPessoal: {
            seletor: '#professional_phone1',
            tipo: 'input'
        },
        celular: {
            seletor: '#professional_cell_phone',
            tipo: 'input'
        },
        cep: {
            seletor: '#professional_zip_code',
            tipo: 'input'
        },
        endereco: {
            seletor: '#professional_address',
            tipo: 'input'
        },
        numero: {
            seletor: '#professional_address_number',
            tipo: 'input'
        },
        complemento: {
            seletor: '#professional_address2',
            tipo: 'input'
        },
        bairro: {
            seletor: '#professional_district',
            tipo: 'input'
        },
        cidade: {
            seletor: '#professional_city',
            tipo: 'input'
        },
        estado: {
            seletor: '#professional_state',
            tipo: 'input'
        },
        pais: {
            seletor: '#professional_country',
            tipo: 'select'
        },
        empresa: {
            seletor: '#professional_enterprise',
            tipo: 'input'
        },
        ramo: {
            seletor: '#professional_business_line',
            tipo: 'input'
        },
        nrColaboradores: {
            seletor: '#professional_number_of_employees',
            tipo: 'select'
        },
        site: {
            seletor: '#professional_site',
            tipo: 'input'
        },
        telComercial: {
            seletor: '#professional_phone2',
            tipo: 'input'
        },
        cargo: {
            seletor: '#professional_role',
            tipo: 'input'
        },
        area: {
            seletor: '#professional_department',
            tipo: 'input'
        },
        perfilColaborador: {
            seletor: '#professional_professional',
            tipo: 'checkbox'
        },
        perfilAdministrador: {
            seletor: '#user_profile_settings_admin',
            tipo: 'checkbox'
        },
        perfilInstrutor: {
            seletor: '#user_profile_settings_instructor',
            tipo: 'checkbox'
        },
        perfilGestor: {
            seletor: '#user_profile_settings_manager_class',
            tipo: 'checkbox'
        },
        perfilLiderEquipe: {
            seletor: '#professional_is_manager',
            tipo: 'checkbox'
        },
        responsavel: {
            seletor: '#manager_name',
            tipo: 'search',
            seletorValor: '.manager_name',
        },
        navegacao: {
            seletor: '#professional_use_mode_id',
            tipo: 'select'
        },
        comunidades: {
            seletor: '#professional_enable_communities',
            tipo: 'checkbox'
        },
        notificacoes: {
            seletor: '#professional_enable_notifications',
            tipo: 'checkbox'
        },
        btnVoltar: {
            seletor: '.btn-default',
            tipo: 'button'
        },
        btnSalvar: {
            seletor: '.save',
            tipo: 'button'
        },
        btnSalvarENovo: {
            seletor: '.save_and_new',
            tipo: 'button'
        },
        btnCancelar: {
            seletor: '#professional-cancel',
            tipo: 'button'
        }
    }

    addUsuario() {
        cy.get('#add-professional')
            .click()
    }

    salvar() {
        cy.get('.save')
            .click()
    }

    editar() {
        cy.get('.professional-edit')
            .click()
    }

    excluir() {
        cy.get('.professional-delete')
            .click()
    }

    inativar() {
        cy.get('.button-inactive')
            .click()
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
                    cy.wait(1000)
                    cy.get(seletor)
						.type(valorFinal)
                        .wait(1000)
					break
				case 'checkbox':
					cy.get(seletor).then($checkbox => {
						const isChecked = $checkbox.is(':checked')
						if ((valorFinal && !isChecked) || (!valorFinal && isChecked)) {
							cy.get(seletor)
                                .click( { force: true } )
                            cy.wait(1000)
						}
					})
					break
				case 'select':
					cy.get(seletor)
						.select(valorFinal)
					break
                case 'search':
                    cy.get(seletor)
                        .type(valorFinal)
                    cy.contains('.manager-grid', valorFinal)
                        .find('a.btn-add')
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
			case 'select':
				cy.get(seletor)
					.find('option:selected')
					.should('have.text', valorFinal)
				break
            case 'search':
                cy.get(seletorValor)
                    .should('have.text', valorFinal)
                break
			default:
				throw new Error(`Tipo de campo ${tipo} não suportado`)
		}
	}
}
export default formUsuarios