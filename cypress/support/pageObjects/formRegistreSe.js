class formRegistreSe {
    elementos = {
        nome: {
            seletor: '#first-name',
            tipo: 'input'
        },
        sobrenome: {
            seletor: '#last-name',
            tipo: 'input'
        },
        idioma: {
            seletor: '#user_language',
            tipo: 'select'
        },
        email: {
            seletor: '#cadastro_email',
            tipo: 'input'
        },
        cpf: {
            seletor: '#cadastro_cpf',
            tipo: 'input'
        },
        telPessoal: {
            seletor: '#phone1',
            tipo: 'input'
        },
        celular: {
            seletor: '#cell_phone',
            tipo: 'input'
        },
        rg: {
            seletor: '#rg',
            tipo: 'input'
        },
        cep: {
            seletor: '#zip_code',
            tipo: 'input-zipcode'
        },
        endereco: {
            seletor: '#address',
            tipo: 'input-endereco'
        },
        numero: {
            seletor: '#address_number',
            tipo: 'input'
        },
        complemento: {
            seletor: '#address2',
            tipo: 'input'
        },
        cidade: {
            seletor: '#city',
            tipo: 'input'
        },
        bairro: {
            seletor: '#district',
            tipo: 'input'
        },
        estado: {
            seletor: '#state',
            tipo: 'input'
        },
        pais: {
            seletor: '#country',
            tipo: 'input'
        },
        empresa: {
            seletor: '#enterprise',
            tipo: 'input'
        },
        ramo: {
            seletor: '#business_line',
            tipo: 'input'
        },
        nrColaboradores: {
            seletor: '#number_of_employees',
            tipo: 'input'
        },
        cargo: {
            seletor: '#role',
            tipo: 'input'
        },
        senha: {
            seletor: '#user-pass',
            tipo: 'input'
        },
        confirmarSenha: {
            seletor: '#user-pass-confirmation',
            tipo: 'input'
        },
        aceiteTermosPolitica: {
            seletorCheck: '#check_click',
            seletorUncheck: '#check_unclick',
            tipo: 'checkbox'
        },
        cadastreMe: {
            seletor: '#button-confirm-signup',
            tipo: 'button'
        },
    }

    salvar() {
        cy.get(this.elementos.cadastreMe.seletor)
            .click()
    }

    preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
		const campo = this.elementos[nomeCampo]

		if (!campo) {
			throw new Error(`Campo ${nomeCampo} não encontrado`)
		}

		const { seletor, seletorCheck, seletorUncheck, tipo, default: valorDefault } = campo

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
                case 'checkbox':
					if (valorFinal === true) {
                        cy.get(seletorCheck)
                            .click()
                    } else if (valorFinal === false) {
                        cy.get(seletorUncheck)
                            .click()
                    }                
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

		const { seletor, tipo, default: valorDefault } = campo

		let valorFinal = valor !== undefined ? valor : valorDefault

		switch (tipo) {
			case 'input':
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
            case 'checkbox':
				// não validar nada
				break
			case 'select':
				cy.get(seletor)
					.find('option:selected')
					.should('have.text', valorFinal)
				break
			default:
				throw new Error(`Tipo de campo ${tipo} não suportado`)
		}
	}
}
export default new formRegistreSe