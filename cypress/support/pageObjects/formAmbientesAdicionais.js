class formAmbientesAdicionais {
    url = `/o/${Cypress.env('orgId')}/additional_environments`

    elementos = {
        breadcrumb: '#page-breadcrumb',
        card: 'div',
        textoCardAmbiente: 'p.partner-card-text',
        toastMessage: {
            inativacao: '#toast-success-toast-description',
            criacao: '#toast-success-toast'
        },
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

    inativarAmbiente(nomeAmbiente) {
        cy.log(`:: Inativar ambiente ::`)
        cy.contains(this.elementos.card, nomeAmbiente).within(() => {
            cy.get(this.elementos.inativar.seletor)
                .click()
        })
    }

    confirmarInativacaoAmbiente() {
        cy.log(`:: Confirmar a inativação do ambiente ::`)
        cy.get(this.elementos.confirmarInativacao.seletor)
            .click()
    }

    validarMsgSucesso(acao, message) {
        cy.log(`:: Validar mensagem sucesso ${acao} ::`)
        switch (acao) {
            case 'Criar':
                cy.contains(this.elementos.toastMessage.criacao, message)
                    .should('exist')
                break
            case 'Inativar':
                cy.contains(this.elementos.toastMessage.inativacao, message)
                    .should('exist')
                break
            default:
                throw new Error(`Ação ${acao} não suportada`)
        }

        // Aguardar 3 segundos até que a mensagem de sucesso desapareça
        cy.log(':: Aguardar 3 segundos até que a mensagem desapareça ::')
        cy.wait(3000)
    }

    verificarNenhumResultado(txtNenhumResultado) {
        cy.log(`:: Verificar mensagem de nenhum resultado ::`)
        // Verificar se a mensagem de nenhum resultado é exibida e retorna true caso não esteja e false caso esteja
        return cy.get('body').then(($body) => {
            return !$body.find(`div#details h2.chakra-heading:contains("${txtNenhumResultado}")`).length
        })
    }

    capturarNomesAmbientes() {
        cy.log(':: Capturar nomes dos ambientes adicionais ::')
        const nomesAmbientes = []

        // Usar cy.wrap para retornar uma Promise que o Cypress pode esperar
        return cy.wrap(new Cypress.Promise((resolve) => {
            cy.get('.chakra-text.partner-card-text span').then(($els) => {
                $els.each((index, el) => {
                    nomesAmbientes.push(Cypress.$(el).text())
                })
                resolve(nomesAmbientes) // Resolve a Promise com os nomes coletados
            })
        }))
    }

    validarAmbienteAdicional(nomeAmbiente, acao) {
        cy.log(`:: Validar ${acao} ambiente adicional ${nomeAmbiente} ::`)
        switch(acao) {
            case 'Criar':
                cy.get(this.elementos.textoCardAmbiente)
                    .should('exist')
                    .and('contain', nomeAmbiente)
                break
            case 'Inativar':
                cy.get(`partner-card-text span:contains("${nomeAmbiente}")`)
                    .should('not.exist')
                break
            default:
                throw new Error(`::Erro:: Ação inválida: ${acao}, utilize 'Criar' ou 'Inativar'`)
        }
    }

    compartilharCurso() {
        cy.get(this.elementos.checkboxCompartilhamento.seletor)
            .click({ force: true })
    }

    salvarCompartilhamento() {
        cy.get(this.elementos.salvarCompartilhamento.seletor)
            .click()
    }

    page(breadcrumb) {
        cy.url().then((urlAtual) => {
            if (!urlAtual.includes(this.url)) {
                // URL não está na página, acessar
                cy.log(`:: Acessando ${this.url} ::`)
                cy.visit(this.url)
                this.validarBreadcrumb(breadcrumb)
            } else {
                // URL já está na página, verificar se o breadcrumb é o esperado
                cy.log(`:: URL está correto. Verificando breadcrumb ${breadcrumb} ::`)
                cy.get(this.elementos.breadcrumb).then(($breadcrumb) => {
                    if (!$breadcrumb.text().includes(breadcrumb)) {
                        // Se o breadcrumb não for o esperado, mesmo estando na página, recarregar
                        cy.log(':: Recarregando página ::')
                        cy.visit(this.url)
                    }
                })
                // Validar breadcrumb
                cy.log(`:: Validando breadcrumb ${breadcrumb} ::`)
                this.validarBreadcrumb(breadcrumb)
            }
        })
    }

    validarBreadcrumb(breadcrumb) {
        cy.contains(this.elementos.breadcrumb, breadcrumb)
            .should('be.visible')
    }
}
export default new formAmbientesAdicionais