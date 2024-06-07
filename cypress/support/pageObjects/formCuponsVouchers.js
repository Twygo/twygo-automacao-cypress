class formCuponsVouchers {
    elementos = {
        abaCuponsVouchers: {
            seletor: 'button[name="payments-coupons-vouchers-tab"]'
        },
        adicionar: {
            seletor: '#coupons-add-button',
            tipo: 'button'
        },
        editar: {
            seletor: 'span[id^="coupons-edit-button-"]',
        },
        excluir: {
            seletor: 'span[id^="coupons-delete-button-"]'
        },
        tipo: {
            seletor: '#payments-add-discount-type',
            tipo: 'select'
        },
        nome: { 
            seletor: '#payments-add-discount-name',
            tipo: 'input'
        },
        codigo: {
            seletor: '#payments-add-discount-code',
            tipo: 'input'
        },
        valor: {
            seletor: '#payments-add-discount-value',
            tipo: 'inputValor'
        },
        aplicadoItens: {
            seletor: '#payments-add-discount-applied-to',
            tipo: 'applyTo'
        },
        adicionarItem: {
            seletor: '#payments-add-discount-apply-to-item-button',
            tipo: 'button'
        },
        validade: {
            seletor: '#payments-add-discount-expiration-date',
            tipo: 'input'
        },
        salvar: {
            seletor: '#payments-add-discount-save-button',
            tipo: 'button'
        },
        cancelar: {
            seletor: '#payments-add-discount-cancel-button',
            tipo: 'button'
        },

        // Itens
        tituloModal: {
            seletor: 'header[id^="chakra-modal--header-"]'
        },
        descricaoModal: {
            seletor: 'div[id^="chakra-modal--body-"]'
        },
        pesquisarItem: {
            seletor: '#coupons-applied-to-search',
            tipo: 'input'
        },
        selecionarItem: {
            seletor: 'span.chakra-checkbox__control',
            tipo: 'checkbox',
            seletorValor: (nomeItem) => `label[data-event-name="${nomeItem}"]`
        },
        salvarItem: {
            seletor: '#coupons-applied-to-save-button',
            tipo: 'button'
        },

        // Tabela
        tabela: {
            nome: {
                seletor: 'td[id^="coupons-name-data-"]'
            },
            tipo: {
                seletor: 'td[id^="coupons-discount_type-data-"]'
            },
            codigo: {
                seletor: 'td[id^="coupons-code-data-"]'
            },
            situacao: {
                seletor: 'td[id^="coupons-situation-data-"]'
            },
            valor: {
                seletor: 'td[id^="coupons-value-data-"]'
            },
            itens: {
                seletor: 'td[id^="coupons-events-data-"]'
            },
            validade: {
                seletor: 'td[id^="coupons-valid_until-data-"]'
            }
        },

        // Modal exclusão
        tituloModalExclusao: {
            seletor: 'header[id^="chakra-modal--header-"]'
        },
        descricaoModalExclusao: {
            seletor: 'div[id^="chakra-modal--body-"]'
        },
        confirmarExclusao: {
            seletor: '#coupons-delete-confirm-button',
            tipo: 'button'
        }
    }

    abaCuponsVouchers() {
        cy.get(this.elementos.abaCuponsVouchers.seletor)
            .click()
    }

    adicionar () {
        cy.get(this.elementos.adicionar.seletor)
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

    editar() {
        cy.get(this.elementos.editar.seletor)
            .click()
    }

    excluir() {
        cy.get(this.elementos.excluir.seletor)
            .click()
    }

    confirmarExclusao() {
        cy.get(this.elementos.confirmarExclusao.seletor)
            .click()
    }

    preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
        const campo = this.elementos[nomeCampo]
        
        if (!campo) {
            throw new Error(`Campo ${nomeCampo} não encontrado`)
        }
    
        const { seletor, tipo, default: valorDefault } = campo 
        
        let valorFinal = valor !== undefined ? valor : valorDefault
        
        if ((opcoes.limpar || valorFinal === '') && (tipo === 'input' || tipo === 'inputValor')) {
            cy.get(seletor).clear()

            if (valorFinal === '') {
                return
            }
        }
    
        switch (tipo) {
            case 'input':
            case 'search':
                cy.get(seletor).type(valorFinal)
                break
            case 'inputValor':
                cy.get(seletor).then($input => {
                    const input = $input[0]
                    input.setSelectionRange(0, input.value.length)
                    input.focus()
                    cy.get(seletor)
                        .type(valorFinal, { force: true })
                })
                break
            case 'select':
                const texto = {
                    "Cupom": "Cupom (%)",
                    "Voucher": "Voucher (R$)"
                }

                cy.get(seletor)
                    .select(texto[valorFinal])
                break
            case 'button':
                if (valorFinal === true) {
                    cy.get(seletor)
                        .click({ force: true })
                    } else {
                        throw new Error(`Botão ${nomeCampo} não pode ser clicado`)
                    }
                break
            case 'applyTo':
                // Nenhuma ação a ser realizada
            default:
                throw new Error(`Tipo de campo desconhecido: ${tipo}`)
        }
    }

	validarCampo(nomeCampo, valor, tipoDesconto) {		
		const campo = this.elementos[nomeCampo]

			if (!campo) {
				throw new Error(`Campo ${nomeCampo} não encontrado`)
			}

			const { seletor, tipo, default: valorDefault } = campo
				
			const valorFinal = valor !== undefined ? valor : valorDefault
		
			switch (tipo) {
			case 'input':
				cy.get(seletor)
					.should('have.value', valorFinal)
				break
            case 'inputValor':
                cy.get(seletor).invoke('val').then((valorCampo) => {
                    let valorEsperado
                    if (tipoDesconto === 'Cupom') {
                      valorEsperado = `${valorFinal} %`
                    } else if (tipoDesconto === 'Voucher') {
                        valorEsperado = `R$ ${Number(valorFinal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    } else {
                      throw new Error(`Tipo de desconto desconhecido: ${tipoDesconto}`)
                    }
            
                    expect(valorCampo).to.eq(valorEsperado)
                })
                break
            case 'select':
                const valor = {
                    "Cupom": "coupon",
                    "Voucher": "voucher"
                }

                cy.get(seletor)
                    .should('have.attr', 'data-selected', valor[valorFinal])
                break
            case 'applyTo':
                // Concatenar itens se valor for um array
                const valorConcatenado = Array.isArray(valorFinal) ? valorFinal.join(' ') : valorFinal;

                cy.get(seletor)
                    .find('span')
                    .should('be.visible')
                    .invoke('text')
                    .then((text) => {
                        // Remover espaços em branco adicionais
                        const cleanedText = text.replace(/\s+/g, ' ').trim()
                        expect(cleanedText).to.equal(valorConcatenado)
                    })
                break
            case 'button':
            case 'search':
                // Nenhuma validação a ser feita
                break
            default:
                throw new Error(`Tipo de campo desconhecido: ${tipo}`)
			}
	}

    adicionarItem() {
        cy.get(this.elementos.adicionarItem.seletor)
            .click()
    }

    aplicarItens(nomeItem) {
        // Digita o nome do item a ser pesquisado
        cy.get(this.elementos.pesquisarItem.seletor)
            .type(nomeItem)
        
        // Aguarda a busca ser realizada
        cy.wait(3000)

        // Encontra o label que contém o nome do item e o checkbox
        cy.get(this.elementos.selecionarItem.seletorValor(nomeItem)).then($label => {
            const checkbox = $label.find('input[type="checkbox"]')
            if (!checkbox.prop('checked')) {
                // Clica no checkbox se ele não estiver marcado
                cy.wrap($label).find(this.elementos.selecionarItem.seletor).click()
            }
        })
    }

    salvarItem() {
        cy.get(this.elementos.salvarItem.seletor)
            .click()
    }

    validarTabela(nomeCampo, valor, tipoDesconto) {
        const campo = this.elementos.tabela[nomeCampo]
    
        if (!campo) {
            throw new Error(`Campo ${nomeCampo} não encontrado`)
        }
    
        const { seletor } = campo
    
        // Verifica o tipo de desconto e formata o valor corretamente
        let valorEsperado
        if (nomeCampo === 'valor') {
            if (tipoDesconto === 'Cupom') {
                valorEsperado = `${valor}%`
            } else if (tipoDesconto === 'Voucher') {
                valorEsperado = `R$ ${Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        } else {
            valorEsperado = valor
        }
    
        // Valida o valor na tabela
        if (nomeCampo === 'itens') {
            // Concatenar itens se valor for um array
            const valorConcatenado = Array.isArray(valorEsperado) ? valorEsperado.join('') : valorEsperado

            cy.get(seletor)
                .should('have.text', valorConcatenado)
                .should('exist')
                .should('be.visible')
        } else {
            cy.get(seletor)
                .should('have.text', valorEsperado)
                .should('exist')
                .should('be.visible')
        }
    }
}
export default new formCuponsVouchers