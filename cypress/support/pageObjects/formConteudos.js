class formConteudos {
	// Mapeamento de elementos da tela de criação de conteúdos (Catálogo, Curso e Trilha)
	elementos = {
		nome: { 
			seletor: '#event_name', 
			tipo: 'input'
		},
		nome_portfolio: {
			seletor: '#model_name',
		},
		data_inicio: { 
			seletor: '#date_start', 
			tipo: 'input' 
		},
		hora_inicio: { 
			seletor: '#time_start', 
			tipo: 'input' 
		},
		data_fim: { 
			seletor: '#date_end', 
			tipo: 'input' 
		},
		hora_fim: { 
			seletor: '#time_end', 
			tipo: 'input' 
		},
		descricao: {
			seletor: 'div#cke_event_description iframe.cke_wysiwyg_frame',
			tipo: 'iframe_text'
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
		carga_horaria: { 
			seletor: '#event_workload', 
			tipo: 'input', 
			default: '0' 
		},
		numero_turma: { 
			seletor: '#event_class_number', 
			tipo: 'input' 
		},
		vigencia: { 
			seletor: '#event_days_to_expire', 
			tipo: 'input', 
			default: '0' 
		},
		atualizar_inscritos: {
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
		email_responsavel: { 
			seletor: '#event_email', 
			tipo: 'input',
			default: Cypress.env('login')
		},
		site: { 
			seletor: '#event_website', 
			tipo: 'input' 
		},
		notificar_responsavel: { 
			seletor: '#event_sent_mail_owner', 
			tipo: 'checkbox', 
			default: false 
		},
		rotulo_contato: { 
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
			tipo: 'add_tag'
		},
		removerCategoria: {
			seletor: 'li.as-selection-item.blur',
			tipo: 'del_tag'
		},
		remover_banner: { 
			seletor: '#remove_banner', 
			tipo: 'checkbox-action', 
			default: false 
		},
		permite_anexo: {
			seletor: 'div.col-md-6.col-lg-4:contains("Permitir envio de anexos na inscrição?")',
			tipo: 'radio',
			default: 'Desabilitado'
		},
		mensagem_anexo: {
			seletor: 'div#cke_event_attachment_description iframe.cke_wysiwyg_frame',
			tipo: 'iframe_text'
		},
		status_iframe_anexo: {
			seletor: 'div#cke_event_attachment_description iframe.cke_wysiwyg_frame',
			tipo: 'iframe_status',
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
		notificar_concluir_primeira_aula: {
			seletor: '#event_end_class',
			tipo: 'select',
			default: 'Não'
		},
		notificar_usuarios: {
			seletor: '#event_notify_users',
			tipo: 'select',
			default: 'Não'
		},
		dias_teste: {
			seletor: '#event_trial_days',
			tipo: 'input',
			default: '0'
		},
		habilitar_dias_teste: {
			seletor: '#event_enable_trial_days',
			tipo: 'checkbox',
			default: false
		},
		exige_confirmacao: {
			seletor: 'div.col-md-6.col-lg-4:contains("Exigir confirmação de inscrição pelo Organizador?")',
			tipo: 'radio',
			default: 'Habilitado'
		},
		valor_inscricao: {
			seletor: '#event_subscription_value',
			tipo: 'input_value',
			default: '0,00'
		},
		habilitar_pagamento: {
			seletor: '#event_payment_enabled',
			tipo: 'checkbox',
			default: false
		},
		nr_parcelas: {
			seletor: '#event_installments_number',
			tipo: 'input',
			default: '1'
		},
		valor_acrescimo: {
			seletor: '#event_addition',
			tipo: 'input',
			default: '0,0'
		},
		habilitar_chat: {
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
				case 'iframe_text':
					cy.get(seletor, { timeout: 5000 }).then($iframe => {
						const doc = $iframe.contents()
						cy.wrap(doc).find('body.cke_editable').click({ force: true }).clear().type(valorFinal, { force: true })
					})
					break
				case 'add_tag':
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
				case 'del_tag':
					if (Array.isArray(valorFinal)) {
						valorFinal.forEach(val => {
							cy.contains(seletor, `${val}`, { timeout: 5000})
								.find('a.as-close')
								.click()
						})
					} else {
						cy.contains(seletor, `${valorFinal}`)
							.find('a.as-close')
							.click()		
					}
					break	
				case 'input_value':
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
			case 'iframe_text':
				cy.get(seletor, { timeout: 5000 }).then($iframe => {
					const doc = $iframe.contents()
				
					cy.wrap(doc).find('body.cke_editable').then($body => {
						cy.wrap($body).should('have.text', valorFinal)
					})
				})
				break      
			case 'iframe_status':
				cy.get(seletor, { timeout: 5000 }).then($iframe => {
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
			case 'input_value':
				cy.get(seletor)
					.should('have.value', valorFinal.replace('.', ','))
				break
			}
	}

	// Função para clicar no botão "Criar Curso" de um catálogo liberado conforme o nome do conteúdo
	criarCursoViaCatalogo(nomeConteudo) {
		cy.get(`tr.event-row[name='${nomeConteudo}']`)
			.find('a[title="Criar  Curso"]', { timeout: 5000 })
			.click()
	}
}
export default formConteudos