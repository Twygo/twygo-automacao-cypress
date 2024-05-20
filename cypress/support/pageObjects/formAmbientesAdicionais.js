class formAmbientesAdicionais {
    elementos = {
        adicionar: {
            seletor: 'button:contains("Adicionar")',
            tipo: 'button'
        },
        criar: {
            seletor: 'button:contains("Criar ambiente adicional")',
            tipo: 'button'
        },
        barraPesquisa: {
            seletor: "input[placeholder='Pesquise o ambiente']",
            tipo: 'input'
        },
        inativar: {
            seletor: 'label[data-checked]',
            tipo: 'button'
        },
        confirmarInativacao: {
            seletor: 'button:contains("Inativar mesmo assim")',
            tipo: 'button'
        },
        nome: {
            seletor: '#name',
            tipo: 'input'
        },
        email: {
            seletor: '#email',
            tipo: 'input'
        },
        telefone: {
            seletor: '#phoneNumber',
            tipo: 'input'
        },
        site: {
            seletor: '#site',
            tipo: 'input'
        },
        salvar: {
            seletor: 'button:contains("Salvar")',
            tipo: 'button' 
        },
        cancelar: {
            seletor: 'button:contains("Cancelar")',
            tipo: 'button' 
        },
        checkboxCompartilhamento: {
            seletor: 'span[aria-hidden="true"]',
            tipo: 'checkbox'
        },
        salvarCompartilhamento: {
            seletor: '#partner-list-save',
            tipo: 'button'
        }
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

    adicionarAmbienteAdicional() {
        cy.get(this.elementos.adicionar.seletor)
            .click()
    }

    criarAmbienteAdicional() {
        cy.get(this.elementos.criar.seletor)
            .click()
    }

    salvarAmbiente() {
        cy.get(this.elementos.salvar.seletor)
            .click()
    }

    inativarAmbiente() {
        cy.get(this.elementos.inativar.seletor)
            .click()
    }

    confirmarInativacaoAmbiente() {
        cy.get(this.elementos.confirmarInativacao.seletor)
            .click()
    }

    compartilharCurso() {
        cy.get(this.elementos.checkboxCompartilhamento.seletor)
            .click({ force: true })
    }

    salvarCompartilhamento() {
        cy.get(this.elementos.salvarCompartilhamento.seletor)
            .click()
    }
}
export default formAmbientesAdicionais