class formIntegracoes {
    elementos = {
        adicionar: {
            seletor: '#api_tokens-add-button',
            tipo: 'button'
        },
        voltar: {
            seletor: '#payments-add-discount-back-button', //é, não faz sentido
            tipo: 'button'
        },
        nome: {
            seletor: '#name',
            tipo: 'input'
        },
        salvar: {
            seletor: 'button:contains("Salvar")',
            tipo: 'button'
        },
        situacao: {
            seletor: 'span[class^="chakra-switch__track"]',
            tipo: 'button'
        },
        editar: {
            seletor: 'span[id^="tokens-edit-button-"]',
            tipo: 'button'
        },
        copiarChave: {
            seletor: '#copy-button',
            tipo: 'button'
        },
        excluir: {
            seletor: 'span[id^="tokens-delete-button-"]',
            tipo: 'button'
        },
        confirmarExclusao: {
            seletor: '#tokens-delete-confirm-button',
            tipo: 'button'
        }
    }

    adicionarChave() {
        cy.get(this.elementos.adicionar.seletor)
            .click()
    }
    salvarChave() {
        cy.get(this.elementos.salvar.seletor)
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
				default:
					throw new Error(`Tipo de campo ${tipo} não suportado`)
			}
		} else {
			throw new Error(`Campo ${nomeCampo} não pode ser preenchido com valor ${valorFinal}`)
		}
	}
}
export default formIntegracoes