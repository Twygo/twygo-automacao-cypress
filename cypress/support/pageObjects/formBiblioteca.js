class formBiblioteca {
    // Mapeamento de elementos da tela de criação de biblioteca
    elementos = {
        nome: {
            seletor: '#event_name',
            tipo: 'input'
        },
        descricao: {
            seletor: 'div#cke_event_description iframe.cke_wysiwyg_frame',
            tipo: 'iframe_text'
        },
        canal: {
            seletor: '#event_outlet',
            tipo: 'select'
        }
    }
	
    /** DOCUMENTAÇÃO:
	 * @name preencherCampo
	 * 
	 * @description 
	 * Preenche os campo de um formulário com base no nome, tipo e valor informado.
	 * 
	 * @actions
	 * 1. Busca o campo na lista de elementos com base no nome informado
	 * 2. Verifica se o campo foi encontrado
	 * 3. Verifica se o campo deve ser limpo antes de preencher
	 * 4. Localiza o tipo de campo na lista de ações suportadas
	 * 5. Executa a ação de preenchimento do campo
	 * 
	 * 
	 * @param {string} nomeCampo - Nome do campo a ser preenchido
	 * @param {string} valor - Valor a ser preenchido no campo
	 * @param {boolean} opcoes.limpar - Determina se o campo deve ser limpo antes de preencher
	 * 
	 * @example
	 * preencherCampo('nome', 'Nome do Evento')
	 * 
	 * @throws {Error} Campo {nomeCampo} não encontrado
	 * @throws {Error} Tipo de campo {tipo} não suportado
	 * @throws {Error} Campo {nomeCampo} não pode ser preenchido com valor {valorFinal}
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
            case 'select':
                cy.get(seletor)
                    .select(valorFinal)
                break
            case 'iframe_text':
                cy.get(seletor, { timeout: 5000 }).then($iframe => {
                    const doc = $iframe.contents()
                    cy.wrap(doc).find('body.cke_editable').click({ force: true }).clear().type(valorFinal, { force: true })
                })
                break
            } 
        } else {
        throw new Error(`Campo ${nomeCampo} não pode ser preenchido com valor ${valorFinal}`)
	    }
	}

    /** DOCUMENTAÇÃO:
	 * @name validarCampo
	 * 
	 * @description
	 * Valida o campo de um formulário com base no nome e valor informado.
	 * 
	 * @actions
	 * 1. Busca o campo na lista de elementos com base no nome informado
	 * 2. Verifica se o campo foi encontrado
	 * 3. Localiza o tipo de campo na lista de ações suportadas
	 * 4. Executa a ação de validação do campo
	 * 
	 * @param {string} nomeCampo - Nome do campo a ser validado
	 * @param {string} valor - Valor a ser validado no campo
	 * 
	 * @example
	 * validarCampo('nome', 'Nome do Evento')
	 * 
	 * @throws {Error} Campo {nomeCampo} não encontrado
	 * @throws {Error} Tipo de campo {tipo} não suportado
	 * 
	 * @author Karla Daiany
	 * @version 1.0.0
	 * @since 1.0.0
	 */
	validarCampo(nomeCampo, valor, categoria) {
		
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
        case 'select':
            cy.get(seletor)
                .find('option:selected')
                .should('have.text', valorFinal)
            break
        case 'iframe_text':
            cy.get(seletor, { timeout: 5000 }).then($iframe => {
                const doc = $iframe.contents()
            
                cy.wrap(doc).find('body.cke_editable').then($body => {
                    cy.wrap($body).should('have.text', valorFinal)
                })
            })
            break      
            default:
                throw new Error(`Campo ${nomeCampo} não pode ser validado`)
        }
	}

    // Função para clicar no botão "Salvar" da tela de criação de nova biblioteca
    salvar() {
        cy.contains('.save', 'Salvar')
            .click()
    }
	
    // Função para clicar no botão "Cancelar" da tela de criação de nova biblioteca
    cancelar() {
        cy.contains('.btn-cancel', 'Cancelar')
            .click()
    }

    // Função para clicar no botão "Voltar" da tela de criação de nova biblioteca
    voltar() {
        cy.contains('.btn-back', 'Voltar')
            .click()
    }
}
export default formBiblioteca