class formUsuarios {
    elementos = {
        email: {
            seletor: '#professional_email',
            tipo: 'input-email'
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
            tipo: 'input-fone'
        },
        celular: {
            seletor: '#professional_cell_phone',
            tipo: 'input-fone'
        },
        cep: {
            seletor: '#professional_zip_code',
            tipo: 'input-zipcode'
        },
        endereco: {
            seletor: '#professional_address',
            tipo: 'input-endereco'
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
            tipo: 'input-fone'
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
            seletor: 'input#user_profile_settings_admin.checkboxProfile',
            tipo: 'checkbox'
        },
        perfilInstrutor: {
            seletor: 'input#user_profile_settings_instructor.checkboxProfile',
            tipo: 'checkbox'
        },
        perfilGestor: {
            seletor: 'input#user_profile_settings_manager_class.checkboxProfile',
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

    preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
		const campo = this.elementos[nomeCampo]

		if (!campo) {
			throw new Error(`Campo ${nomeCampo} não encontrado`)
		}

		const { seletor, tipo, default: valorDefault } = campo

		let valorFinal = valor !== undefined ? valor : valorDefault

		if (opcoes.limpar && ( tipo === 'input' || tipo === 'input-fone')) {
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
                case 'input-fone':
                    cy.get(seletor)
                        .type(valorFinal)
                    break
                case 'checkbox':
					cy.get(seletor).then($checkbox => {
						const isChecked = $checkbox.is(':checked')
						if ((valorFinal && !isChecked) || (!valorFinal && isChecked)) {
							cy.get(seletor).click().then(() => {
								if (seletor === '#professional_enable_communities' && valorFinal === false) {
									cy.wait(1000)
									cy.get('body').then(($body) => {
										if ($body.find('button:contains("Sair")').length) {
											cy.contains('button', 'Sair').click()
										}
									})
								}
							})
						}
					})
					break
                case 'checkbox2':
                    cy.get(seletor).then($checkbox => {
                        const isChecked = $checkbox.is(':checked')
                        if (valorFinal && !isChecked) {
                        // Marcar o checkbox
                        cy.get(seletor)
                            .invoke('val', 'true')
                            .invoke('prop', 'checked', true)
                        } else if (!valorFinal && isChecked) {
                        // Desmarcar o checkbox
                        cy.get(seletor)
                            .invoke('val', 'false')
                            .invoke('prop', 'checked', false)
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
            case 'input-email':
            case 'input-endereco':
				if (nomeCampo === 'empresa' && valorFinal === '') {
                    valorFinal = Cypress.env('orgName')
                }
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
            case 'input-fone':
                cy.get(seletor)
                    .invoke('val')
                    .then((telefoneSalvo) => {
                        // Remove caracteres não numéricos do telefone
                        const telefoneEsperado = valorFinal.replace(/\D/g, '')
                        const telefoneEncontrado = telefoneSalvo.replace(/\D/g, '')
            
                        // Verifica se ambos os telefones têm a mesma quantidade de dígitos
                        expect(telefoneEncontrado.length, 'Quantidade de dígitos').to.equal(telefoneEsperado.length);
            
                        // Verifica se os telefones são iguais
                        expect(telefoneEncontrado, 'Telefone encontrado').to.equal(telefoneEsperado);
                    });
                break;            case 'checkbox':
            case 'checkbox2':
				cy.get(seletor)
					.should(valor ? 'be.checked' : 'not.be.checked')
				break
			case 'select':
                cy.get(seletor, { multiple: true }).then(elements => {
                    if (elements.is('select')) {
                        // Se for um select
                        cy.wrap(elements)
                            .find('option:selected')
                            .should('have.text', valorFinal)
                    } else if (elements.is('input')) {
                        // Se for um input
                        cy.wrap(elements)
                            .should('have.value', valorFinal)
                    } else {
                        throw new Error('Elemento não é nem select nem input')
                    }
                })
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
export default new formUsuarios