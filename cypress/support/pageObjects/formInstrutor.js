class formInstrutor{
    //Mapeamento de elementos da tela de vínculo de Instrutor em conteúdo
    elementos = {
        voltar: {
            seletor: ".btn.btn-default.btn-back.waves-effect",
            tipo: "button"
        },
        nomeInstrutor: {
            seletor: "#search-speark",
            tipo: "input"
        },
        novoInstrutor: {
            seletor: ".btn.btn-primary.inline.new_speaker_btn.waves-effect",
            tipo: "button"
        },
        associar: {
            seletor: ".btn.btn-add.ghost.inline.waves-effect",
            tipo: "button"
        }
    }

    associarInstrutor(nomeInstrutor) {
        cy.get(this.elementos.nomeInstrutor.seletor)
            .type(nomeInstrutor)

        cy.get('#speaker_name')
            .find('i.icon-search-1')
            .click()
        
        cy.contains('.speakerList .speakerName', nomeInstrutor)
            .parents('li')
            .find(this.elementos.associar.seletor)
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
                    cy.get(seletor)
                        .type(valorFinal)
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

		if (!campo) {
			throw new Error(`Campo ${nomeCampo} não encontrado`)
		}

		const { seletor, tipo, seletorValor, default: valorDefault } = campo

		let valorFinal = valor !== undefined ? valor : valorDefault

		switch (tipo) {
			case 'input':
				if (nomeCampo === 'empresa' && valorFinal === '') {
                    valorFinal = Cypress.env('orgName')
                }
                cy.get(seletor)
					.should('have.value', valorFinal)
				break
            case 'search':
                cy.get(seletorValor)
                    .should('have.text', valorFinal)
                break
            case 'button':
                //não é necessário validar
                break
			default:
				throw new Error(`Tipo de campo ${tipo} não suportado`)
		}
	}
}
export default new formInstrutor