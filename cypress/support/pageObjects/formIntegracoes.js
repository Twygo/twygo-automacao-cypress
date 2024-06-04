class formIntegracoes {
    elementos = {
        adicionar: {
            seletor: '#api_tokens-add-button',
            tipo: 'button'
        },
        voltar: {
            seletor: '#payments-add-discount-back-button', 
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
            seletor: '.chakra-switch',
            seletorValor: 'span[class^="chakra-switch__track"]',
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
        },
        chaveDeApi: {
            seletor: 'input[name="token"]',
            tipo: 'inputRandom'
        },
        usuarioAssociado: {
            seletor: '.select-input',
            seletorOption: 'div[class$="option"]',
            seletorSelected: 'div[class$="singleValue"]',
            tipo: 'select'
        },
        linhaTabela: {
            seletor: (nome) => `tr[data-item-name="${nome}"]`
        },
        confirmarInativar: {
            seletor: 'button:contains("Inativar")',
            tipo: 'button'
        }
    }

    expandirSelectUsuario() {
        cy.get(this.elementos.usuarioAssociado.seletor)
            .click()
    }

    exclusaoDeChave() {
        cy.get(this.elementos.excluir.seletor)
            .click()
    }
    
    confirmacaoExclusaoDeChave() {
        cy.get(this.elementos.confirmarExclusao.seletor)
            .click()
    }

    editarChave() {
        cy.get(this.elementos.editar.seletor)
            .click()
    }

    adicionarChave() {
        cy.get(this.elementos.adicionar.seletor)
            .click()
    }

    salvarChave() {
        cy.get(this.elementos.salvar.seletor)
            .click()
    }

    confirmarInativacao() {
        cy.get(this.elementos.confirmarInativar.seletor)
            .click()
    }

    preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
		const campo = this.elementos[nomeCampo]

		if (!campo) {
			throw new Error(`Campo ${nomeCampo} não encontrado`)
		}

		const { seletor, tipo, default: valorDefault, seletorOption } = campo

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
                case 'inputRandom':
                    // Gera um valor aleatório para a chave de API, nada a fazer
                    break
                case 'select':
                    cy.get(seletor)
                        .click()
                    cy.get(seletorOption).contains(valorFinal)
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

			const { seletor, seletorSelected, tipo, default: valorDefault } = campo
				
			const valorFinal = valor !== undefined ? valor : valorDefault
		
			switch (tipo) {
			case 'input':
				cy.get(seletor)
					.should('have.value', valorFinal)
				break
			case 'select':
                cy.get(seletorSelected)
                    .should('have.text', valor)
                    .should('be.visible')
                break
            case 'inputRandom':
                if (valor === true) {           
                    cy.get(seletor)
                        .invoke('val')
                        .should('not.be.empty')
                }
                break
            default:
                throw new Error(`Tipo de campo desconhecido: ${tipo}`)
			}
	}
}
export default new formIntegracoes