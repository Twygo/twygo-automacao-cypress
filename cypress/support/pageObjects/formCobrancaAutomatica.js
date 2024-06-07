class formCobrancaAutomatica {
    elementos = {
        abaCobrancaAutomatica: {
            seletor: 'button[name="payments-auto-billing-tab"]',
            tipo: 'button'
        },
        habilitarCobrancaAutomatica: {
            seletor: '#payments-billing-toggle',
            tipo: 'toggle'
        },
        radioAsaas: {
            seletor: '#payments-asaas-radio',
            tipo: 'radio'
        },
        radioErede: {
            seletor: '#payments-erede-radio',
            tipo: 'radio'
        },
        salvar: {
            seletor: '#payments-save-button',
            tipo: 'button'
        },
        cancelar: {
            seletor: '#payments-cancel-button',
            tipo: 'button'
        },

        // Asaas
        chaveAsaas: {
            seletor: '#payments-asaas-api-key',
            tipo: 'input'
        },
        site: {
            seletor: '#asaas_site',
            tipo: 'copy'
        },
        checkPixBoleto: {
            seletor: '#payments-slip-select',
            tipo: 'checkbox'
        },
        checkCartao: {
            seletor: '#payments-credit-card-select',
            tipo: 'checkbox'
        },
        vencimentoBoleto: {
            seletor: '#payments-asaas-due-date-days',
            tipo: 'inputContador'
        },

        // E-rede
        pvErede: {
            seletor: '#payments-erede-pv',
            tipo: 'input'
        },
        chaveErede: {
            seletor: '#payments-erede-key',
            tipo: 'input'
        }
    }

    abaCobrancaAutomatica() {
        cy.get(this.elementos.abaCobrancaAutomatica.seletor)
            .click()
    }
    
    salvar() {
        cy.get(this.elementos.salvar.seletor)
            .click()
    }

    cancelar() {
        cy.get(this.elementos.cancelar.seletor)
            .click()
    }

    preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
        const campo = this.elementos[nomeCampo]
        
        if (!campo) {
            throw new Error(`Campo ${nomeCampo} não encontrado`)
        }
    
        const { seletor, tipo, default: valorDefault } = campo 
        
        let valorFinal = valor !== undefined ? valor : valorDefault
        
        if ((opcoes.limpar || valorFinal === '') && tipo === 'input') {
            cy.get(seletor).clear()

            if (valorFinal === '') {
                return
            }
        }
    
        switch (tipo) {
            case 'input':
                cy.get(seletor).type(valorFinal)
                break
            case 'inputContador':
                cy.get(seletor).then($input => {
                    const input = $input[0]
                    input.setSelectionRange(0, input.value.length)
                    input.focus()
                    cy.get(seletor)
                        .type(valorFinal, { force: true })
                })
                break
                case 'radio':
                    // Encontra o radio button pelo seletor fornecido
                    cy.get(seletor).then($radio => {
                      const isChecked = $radio.prop('checked')
                      // Se o radio button não estiver selecionado, clica no span correspondente para selecionar
                      if (!isChecked) {
                        cy.wrap($radio).parent('label').find('span.chakra-radio__control').click({ force: true })
                      }
                    })
                    break
                case 'checkbox':
                // Verifica o estado atual do checkbox e só clica se necessário
                cy.get(seletor).closest('label').find('input[type="checkbox"]').then($checkbox => {
                    const isChecked = $checkbox.prop('checked')
                    // Se o estado desejado for diferente do estado atual, clica para alterar
                    if ((valorFinal && !isChecked) || (!valorFinal && isChecked)) {
                        cy.wrap($checkbox).click({ force: true })
                    }
                })                
                break      
            case 'button':
                if (valorFinal === true) {
                    cy.get(seletor)
                        .click({ force: true })
                    } else {
                        throw new Error(`Botão ${nomeCampo} não pode ser clicado`)
                    }
                break
            case 'copy':
                // Nenhuma ação a ser feita
                break
            case 'toggle':
                // Verifica o estado atual do checkbox e só clica se necessário
                cy.get(seletor).closest('label').find('input[type="checkbox"]').then($toggle => {
                    const isChecked = $toggle.prop('checked')
                    // Se o estado desejado for diferente do estado atual, clica para alterar
                    if ((valorFinal && !isChecked) || (!valorFinal && isChecked)) {
                        cy.wrap($toggle).click({ force: true })
                    }
                })                
                break
            default:
                throw new Error(`Tipo de campo desconhecido: ${tipo}`)
        }
    }

	validarCampo(nomeCampo, valor) {		
		const campo = this.elementos[nomeCampo]

			if (!campo) {
				throw new Error(`Campo ${nomeCampo} não encontrado`)
			}

			const { seletor, tipo, default: valorDefault } = campo
				
			const valorFinal = valor !== undefined ? valor : valorDefault
		
			switch (tipo) {
			case 'input':
            case 'inputContador':
				cy.get(seletor)
					.should('have.value', valorFinal)
				break
			case 'radio':
                if (valorFinal === true) {
                    cy.get(seletor).closest('label').find('input[type="radio"]')
                        .should('be.checked')
                } else {
                    cy.get(seletor).closest('label').find('input[type="radio"]')
                        .should('not.be.checked')
                }
                break
            case 'checkbox':
                if (valorFinal === true) {
                    cy.get(seletor).closest('label').find('input[type="checkbox"]')
                        .should('be.checked')
                } else {
                    cy.get(seletor).closest('label').find('input[type="checkbox"]')
                        .should('not.be.checked')
                }
                break
            case 'button':
                // Nenhuma validação a ser feita
                break
            case 'copy':
                cy.get(seletor)
                    .should('have.value', valorFinal)
                break
            case 'toggle':
                if (valorFinal === true) {
                    cy.get(seletor).closest('label').find('input[type="checkbox"]')
                        .should('be.checked')
                } else {
                    cy.get(seletor).closest('label').find('input[type="checkbox"]')
                        .should('not.be.checked')
                }
                break
            default:
                throw new Error(`Tipo de campo desconhecido: ${tipo}`)
			}
	}
}
export default formCobrancaAutomatica