class formConteudos {
	// Mapeamento de elementos da tela de criação de conteúdos (Catálogo, Curso e Trilha)
	elementos = {
		nome: { 
			seletor: '#event_name', 
			tipo: 'input'
		},
		nomePortfolio: {
			seletor: '#model_name',
		},
		dataInicio: { 
			seletor: '#date_start', 
			tipo: 'input' 
		},
		horaInicio: { 
			seletor: '#time_start', 
			tipo: 'input' 
		},
		dataFim: { 
			seletor: '#date_end', 
			tipo: 'input' 
		},
		horaFim: { 
			seletor: '#time_end', 
			tipo: 'input' 
		},
		descricao: {
			seletor: 'div#cke_event_description iframe.cke_wysiwyg_frame',
			tipo: 'iframeText'
		},
		tipo: { 
			seletor: '#event_event_type_id', 
			tipo: 'select', 
			default: 'Treinamento' 
		},
		modalidade: { 
			seletor: '#event_mode', 
			tipo: 'select', 
			default: 'Online' 
		},
		sincronismo: { 
			seletor: '#event_synchronism', 
			tipo: 'select', 
			default: 'Gravado' 
		},
		canal: { 
			seletor: '#event_outlet', 
			tipo: 'select', 
			default: '' 
		},
		cargaHoraria: { 
			seletor: '#event_workload', 
			tipo: 'input', 
			default: '0' 
		},
		numeroTurma: { 
			seletor: '#event_class_number', 
			tipo: 'input' 
		},
		vigencia: { 
			seletor: '#event_days_to_expire', 
			tipo: 'input', 
			default: '0' 
		},
		atualizarInscritos: {
			seletor: '#update_inscriptions',
			tipo: 'checkbox-action',
			default: false
		},
		local: { 
			seletor: '#event_place', 
			tipo: 'input' 
		},
		cep: { 
			seletor: '#event_zip_code', 
			tipo: 'input' 
		},
		endereco: { 
			seletor: '#event_address', 
			tipo: 'input' 
		},
		complemento: { 
			seletor: '#event_address2', 
			tipo: 'input' 
		},
		cidade: { 
			seletor: '#event_city', 
			tipo: 'input' 
		},
		estado: { 
			seletor: '#event_state', 
			tipo: 'input' 
		},
		pais: { 
			seletor: '#event_country', 
			tipo: 'input' 
		},
		emailResponsavel: { 
			seletor: '#event_email', 
			tipo: 'input',
			default: Cypress.env('login')
		},
		site: { 
			seletor: '#event_website', 
			tipo: 'input' 
		},
		notificarResponsavel: { 
			seletor: '#event_sent_mail_owner', 
			tipo: 'checkbox', 
			default: false 
		},
		rotuloContato: { 
			seletor: '#event_contact_label', 
			tipo: 'input' 
		},
		hashtag: { 
			seletor: '#event_hashtag', 
			tipo: 'input' 
		},
		categoria: {
			seletor: "input.form-control.as-input[name='event[category]']",
			tipo: 'tag'
		},
		addCategoria: {
			seletor: "input.form-control.as-input[name='event[category_extra]']",
			tipo: 'addTag'
		},
		removerCategoria: {
			seletor: 'li.as-selection-item.blur',
			tipo: 'delTag'
		},
		permiteAnexo: {
			seletor: 'div.col-md-6.col-lg-4:contains("Permitir envio de anexos na inscrição?")',
			tipo: 'radio',
			default: 'Desabilitado'
		},
		mensagemAnexo: {
			seletor: 'div#cke_event_attachment_description iframe.cke_wysiwyg_frame',
			tipo: 'iframeText'
		},
		statusIframeAnexo: {
			seletor: 'div#cke_event_attachment_description iframe.cke_wysiwyg_frame',
			tipo: 'iframeStatus',
			default: false
		},      
		visualizacao: {
			seletor: '#event_inscription_access',
			tipo: 'select',
			default: 'Inscritos'
		},
		situacao: {
			seletor: '#event_situation',
			tipo: 'select',
			default: 'Em desenvolvimento'
		},
		notificarConcluirPrimeiraAula: {
			seletor: '#event_end_class',
			tipo: 'select',
			default: 'Não'
		},
		notificarUsuarios: {
			seletor: '#event_notify_users',
			tipo: 'select',
			default: 'Não'
		},
		diasTeste: {
			seletor: '#event_trial_days',
			tipo: 'input',
			default: '0'
		},
		habilitarDiasTeste: {
			seletor: '#event_enable_trial_days',
			tipo: 'checkbox',
			default: false
		},
		exigeConfirmacao: {
			seletor: 'div.col-md-6.col-lg-4:contains("Exigir confirmação de inscrição pelo Organizador?")',
			tipo: 'radio',
			default: 'Habilitado'
		},
		valorInscricao: {
			seletor: '#event_subscription_value',
			tipo: 'inputValue',
			default: '0,00'
		},
		habilitarPagamento: {
			seletor: '#event_payment_enabled',
			tipo: 'checkbox',
			default: false
		},
		nrParcelas: {
			seletor: '#event_installments_number',
			tipo: 'input',
			default: '1'
		},
		valorAcrescimo: {
			seletor: '#event_addition',
			tipo: 'input',
			default: '0,0'
		},
		habilitarChat: {
			seletor: '#event_enable_twygo_chat',
			tipo: 'checkbox',
			default: false
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
				case 'select':
					cy.get(seletor)
						.select(valorFinal)
					break
				case 'checkbox':
				case 'checkbox-action':
					// Verifica o estado atual do checkbox e só clica se necessário
					cy.get(seletor).then($checkbox => {
						const isChecked = $checkbox.is(':checked')
						// Se o estado desejado for diferente do estado atual, clica para alterar
						if ((valorFinal && !isChecked) || (!valorFinal && isChecked)) {
							cy.get(seletor).click().then(() => {
								// Caso específico para o seletor '#event_enable_twygo_chat'
								if (seletor === '#event_enable_twygo_chat' && valorFinal === false) {
									cy.wait(1000)
									cy.get('body').then(($body) => {
										if ($body.find('button:contains("Sair")').length) {
											cy.contains('button', 'Sair').click()
										}
									})
								}
							})
						}
					})
					break      
				case 'radio':
					const valorParaMarcar = valorFinal === 'Habilitado' ? 'Habilitado' : 'Desabilitado'
					cy.get(seletor)
						.contains(valorParaMarcar)
						.parents('.col-md-6.col-lg-4')
						.find(`label:contains("${valorParaMarcar}")`)
						.invoke('attr', 'for')
						.then((id) => {
								cy.get(`input#${id}`).check().should('be.checked')
						})
					break
				case 'iframeText':
					cy.get(seletor).then($iframe => {
						const doc = $iframe.contents()
						cy.wrap(doc).find('body.cke_editable').click({ force: true }).clear().type(valorFinal, { force: true })
					})
					break
				case 'addTag':
					if (Array.isArray(valorFinal)) {
						valorFinal.forEach(val => {
							cy.get(seletor)
								.type(`${val}`)
							cy.realPress('Tab')
						})
					} else {
						cy.get(seletor)
							.type(`${valorFinal}`)
						cy.realPress('Tab')
					}
					break
				case 'delTag':
					if (Array.isArray(valorFinal)) {
						valorFinal.forEach(val => {
							cy.contains(seletor, `${val}`)
								.find('a.as-close')
								.click()
						})
					} else {
						cy.contains(seletor, `${valorFinal}`)
							.find('a.as-close')
							.click()		
					}
					break	
				case 'inputValue':
					cy.get(seletor)
						.clear()
						.type(valorFinal.replace('.', ','))
					break
			}
		} else {
			throw new Error(`Campo ${nomeCampo} não pode ser preenchido com valor ${valorFinal}`)
	}
	}

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
			case 'checkbox-action':
				cy.get(seletor)
					.should('not.be.checked')
				break
			case 'checkbox':
				if (valorFinal === true ) {
					cy.get(seletor)
						.should('be.checked')
				} else {
					cy.get(seletor)
						.should('not.be.checked')
				}
				break
			case 'radio':
				const valorParaMarcar = valorFinal === 'Habilitado' ? 'Habilitado' : 'Desabilitado'
				cy.get(seletor)
					.contains(valorParaMarcar)
					.parents('.col-md-6.col-lg-4')
					.find(`label:contains("${valorParaMarcar}")`)
					.invoke('attr', 'for')
					.then((id) => {
						cy.get(`input#${id}`).should('be.checked')
					})
				break
			case 'iframeText':
				cy.get(seletor).then($iframe => {
					const doc = $iframe.contents()
				
					cy.wrap(doc).find('body.cke_editable').then($body => {
						cy.wrap($body).should('have.text', valorFinal)
					})
				})
				break      
			case 'iframeStatus':
				cy.get(seletor).then($iframe => {
					cy.wait(3000)
					const doc = $iframe.contents()

					cy.wrap(doc).find('body.cke_editable').invoke('attr', 'contenteditable').then(contentEditable => {
						if (valorFinal === true) {
							expect(contentEditable).to.eq('true')
						} else if (valorFinal === false) {
							expect(contentEditable).to.eq('false')
						}
					})
				})
				break
			case 'tag':
				let categoriasEncontradas = []
				cy.get('li.as-selection-item.blur').each(($el) => {
					const text = $el.text().trim().replace('×', '').trim()
					categoriasEncontradas.push(text)
				}).then(() => {
					try {
						const categoriasEsperadas = categoria.sort()
						categoriasEncontradas.sort()
						expect(categoriasEncontradas).to.deep.eq(categoriasEsperadas)  
					} catch (error) {
						console.error('Erro capturado: ', error)
					}
				})
				break
			case 'inputValue':
				cy.get(seletor)
					.should('have.value', valorFinal.replace('.', ','))
				break
			}
	}

	// Função para clicar no botão "Criar Curso" de um catálogo liberado conforme o nome do conteúdo
	criarCursoViaCatalogo(nomeConteudo) {
		cy.get(`tr.event-row[name='${nomeConteudo}']`)
			.find('a[title="Criar  Curso"]')
			.click()
	}
}
export default new formConteudos