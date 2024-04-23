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

    /** DOCUMENTAÇÃO:
     * @name associarInstrutor
     * 
     * @description
     * Método para associar um instrutor em um conteúdo
     * 
     * @actions
     * 1. Pesquisa pelo nome do instrutor
     * 2. Clica para buscar
     * 3. Clica para associar
     * 
     * @param {string} nomeInstrutor - Nome do instrutor a ser vinculado
     * 
     * @example
     * associarInstrutor('nome')
     * 
     * @author Karla Daiany
     * @version 1.0.0
     * @since 1.0.0
     */
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
				case 'input':
                    cy.get(seletor)
                        .type(valorFinal)
                    break
                // case 'search':
                //     cy.get(seletor)
                //         .type(valorFinal)
                //     cy.contains('.manager-grid', valorFinal)
                //         .find('a.btn-add')
                //         .click()
                //     break
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
export default formInstrutor