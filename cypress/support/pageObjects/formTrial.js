class formTrial {
    elementos = {
        nome: {
            seletor: '#name',
            tipo: 'input'
        },
        funcao: {
            seletor: 'select[name="role"]',
            tipo: 'select'
        },
        departamento: {
            seletor: 'select[name="department"]',
            tipo: 'select'
        },
        celular: {
            seletor: '#cellphone',
            tipo: 'input'
        },
        email: {
            seletor: '#email',
            tipo: 'input'
        },
        termos: {
            seletor: 'span.chakra-checkbox__label:contains("Termos de uso")',
            tipo: 'checkbox'
        },
        politica: {
            seletor: 'span.chakra-checkbox__label:contains("Política de privacidade")',
            tipo: 'checkbox'
        },
        proximoStep0: {
            seletor: '.chakra-button.step0',
            tipo: 'button'
        },
        nomeEmpresa: {
            seletor: '#organization_name',
            tipo: 'input'
        },
        nrColaboradores: {
            seletor: '#number_of_employees',
            tipo: 'input'
        },
        ramo: {
            seletor: 'select[name="role"]',
            tipo: 'select'
        },
        proximoStep1: {
            seletor: '.chakra-button.step1',
            tipo: 'button'
        },
        objetivo: {
            seletor: '.chakra-radio',
            tipo: 'radio'
        },
        faleMais: {
            seletor: '.chakra-textarea',
            tipo: 'input'
        },
        proximoStep2: {
            seletor: '.chakra-button.step2',
            tipo: 'button'
        },
        quantidadePessoas: {
            seletorThumb: '#slider-thumb-track-monthly-trained',
            seletorTrack: '#slider-track-track-monthly-trained',
            valorMin: 0,
            valorMax: 5000,
            tipo: 'slider'
        },
        proximoStep3: {
            seletor: '.chakra-button.step3',
            tipo: 'button'
        },
        senha: {
            seletor: '#password',
            tipo: 'input'
        },
        confirmarSenha: {
            seletor: '#password-confirmation',
            tipo: 'input'
        },
        finalizar: {
            seletor: '.chakra-button.finish',
            tipo: 'button'
        }
    }

    voltarStep() {
        cy.get('button.chakra-button')
            .contains('Anterior')
            .click()
    }

    // Implementado para mover o thumb do slider com as setas de teclado pois não foi possível fazer com o método .click()
    moverSliderComTeclasDeSeta(mapeamento, valorFinal) {
        const { seletorThumb } = mapeamento
    
        // Selecionar o thumb do slider
        cy.get(seletorThumb).click().then($thumb => {
            cy.wrap($thumb).invoke('attr', 'aria-valuenow').then(currentValue => {
                let valorAtual = parseInt(currentValue)
                let diferenca = valorFinal - valorAtual
    
                function moverThumb() {
                    cy.wrap($thumb).invoke('attr', 'aria-valuenow').then(currentValue => {
                        valorAtual = parseInt(currentValue)
                        diferenca = valorFinal - valorAtual
    
                        cy.log(`Valor atual: ${valorAtual}, Valor final: ${valorFinal}, Diferença: ${diferenca}`)
    
                        if (diferenca === 0) {
                            return // Se a diferença for zero, não há necessidade de mover o thumb
                        }
    
                        // Considerar que cada movimento de seta ajusta o valor em incrementos de 5
                        let passos = Math.abs(diferenca) / 5
    
                        if (diferenca > 0) {
                            cy.wrap($thumb).type('{rightarrow}'.repeat(passos))
                        } else if (diferenca < 0) {
                            cy.wrap($thumb).type('{leftarrow}'.repeat(passos))
                        }
    
                        // Verificação adicional para evitar loop infinito
                        if (Math.abs(diferenca) > 0 && Math.abs(diferenca) < 5) {
                            if (diferenca > 0) {
                                cy.wrap($thumb).type('{rightarrow}')
                            } else {
                                cy.wrap($thumb).type('{leftarrow}')
                            }
                        }
    
                        if (Math.abs(diferenca) >= 5) {
                            cy.wait(50).then(moverThumb)
                        }
                    })
                }
    
                moverThumb()
            })
        })
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
            case 'select':
                cy.get(seletor).select(valorFinal)
                break
            case 'radio':
                cy.get(seletor).then($elements => {
                    // Itera sobre cada elemento encontrado
                    cy.wrap($elements).each($element => {
                        // Verifica se o texto desejado está dentro do div irmão
                        if ($element.next().text().includes(valorFinal)) {
                            // Encontra o input radio dentro do label
                            cy.wrap($element).find(`input[type="${tipo}"]`).check({ force: true })
                        }
                    })
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
            case 'slider':
                this.moverSliderComTeclasDeSeta(campo, valorFinal)
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

			const { seletor, seletorThumb, tipo, default: valorDefault } = campo
				
			const valorFinal = valor !== undefined ? valor : valorDefault
		
			switch (tipo) {
			case 'input':
				cy.get(seletor)
					.should('have.value', valorFinal)
				break
			case 'select':
                cy.get(seletor)
                    .find('option:selected')
                    .invoke('text')
                    .then((text) => {
                    expect(text.trim()).to.eq(valorFinal.trim())
                })
                break
			case 'radio':
                // Verifica se o radio button com o valor específico está selecionado
                cy.get(seletor).then($elements => {
                    // Itera sobre cada elemento encontrado
                    cy.wrap($elements).each($element => {
                        // Verifica se o texto desejado está dentro do div irmão
                        if ($element.next().text().includes(valorFinal)) {
                            // Verifica se a label tem o atributo data-checked
                            cy.wrap($element).closest('label').should('have.attr', 'data-checked')
                        }
                    })
                })               
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
            case 'slider':
                cy.get(seletorThumb)
                    .should('have.attr', 'aria-valuenow', valorFinal.toString())
                break
            default:
                throw new Error(`Tipo de campo desconhecido: ${tipo}`)
			}
	}
}
export default formTrial