class formAtividades {
	// Mapeamento de elementos da tela de criação de atividades (Edição de Espaço)
	elementos = {
		titulo: {
			seletor: '#content_title',
			tipo: 'input',
			default: 'Novo 1'
		},
		peso: {
			seletor: '#content_duration',
			tipo: 'input',
			default: 1
		},
		liberado: {
			seletor: '#content_status',
			tipo: 'checkbox',
			default: false
		},
		preRequisitos: {
			seletor: '.new-requirement',
			tipo: 'button'
		},
		tipoAtividade: {
			seletor: '.radiobox-content',
			tipo: 'radio',
			seletorValor: '#content_content_type'
		},
		resumoAtividade: {
			seletor: 'div#cke_content_briefing iframe.cke_wysiwyg_frame',
			tipo: 'iframeText'
		},
		tempoMinPermanencia: {
			seletor: '#enable_minimum_permanence_time',
			tipo: 'checkbox',
			default: false
		},
		tempoMinPermanenciaValor: {
			seletor: '#minimum_permanence_time',
			tipo: 'input'
		},
		escolherArquivo: {
			seletor: '#file',
			tipo: 'button'
		},
		salvarEnvioArquivo: {
			seletor: '#button_send_file',
			tipo: 'button'
		},
		cancelarEnvioArquivo: {
			seletor: '#event-cancel',
			tipo: 'button'
		},
		// Texto
		descricaoTexto: {
			seletor: 'div#cke_content_description iframe.cke_wysiwyg_frame',
			tipo: 'iframeText'
		},
		// PDF
		enviarPdf: {
			seletor: '#pdf_link',
			tipo: 'uploadButton'
		},
		descricaoArquivoPdf: {
			seletor: '#pdf-description',
			tipo: 'fileDescription'
		},
		// Segurança para PDF, Vídeos e Arquivos
		seguranca: {
			seletor: '#content_file_security',
			tipo: 'select',
			default: 'Somente Visualizar'
		},
		// Vídeo
		enviarVideo: {
			seletor: '#video_link',
			tipo: 'uploadButton'
		},
		descricaoArquivoVideo: {
			seletor: '#video-description',
			tipo: 'fileDescription'
		},
		marcarConcluidoVideo: {
			seletor: '#mark_completed_video',
			tipo: 'checkbox',
			default: false
		},
		naoMostrarProgresso: {
			seletor: '#controll_bar_video',
			tipo: 'checkbox',
			default: false
		},
		// Vídeo Externo
		youtube: {
			seletor: 'input[value="youtube"]',
			tipo: 'radioVideo',
			default: 'checked'
		},
		vimeo: {
			seletor: 'input[value="vimeo"]',
			tipo: 'radioVideo'
		},
		eventials: {
			seletor: 'input[value="eventials"]',
			tipo: 'radioVideo'
		},
		// Preencher URL YouTube e Vimeo
		videoUrl: {
			seletor: '#content_video_url',
			tipo: 'input'
		},
		// Preencher URL e Chat Eventials
		videoEventials: {
			seletor: '#eventials_video',
			tipo: 'inputText'
		},
		chatEventials: {
			seletor: '#eventials_chat',
			tipo: 'inputText'
		},
		// Opção para YouTube, Vimeo e Eventials
		marcarConcluidoVideoExterno: {
			seletor: '#mark_completed_external',
			tipo: 'checkbox',
			default: false
		},
		// Opções para YouTube e Eventials
		naoMostrarProgressoVideoExterno: {
			seletor: '#controll_bar_external',
			tipo: 'checkbox',
			default: false
		},
		chatTwygo: {
			seletor: '#enable_content_chat_external',
			tipo: 'checkbox',
			default: false
		},
		desabilitarChatFimTransmissao: {
			seletor: '#disable_chat_at_end_external',
			tipo: 'checkbox',
			default: false
		},
		// Arquivos
		enviarArquivo: {
			seletor: '#other_link',
			tipo: 'uploadButton'
		},
		descricaoArquivo: {
			seletor: '#other-description',
			tipo: 'fileDescription'
		},
		// Questionário
		selecionarQuestionario: {
			seletor: '#question_list_filter',
			tipo: 'search',
			seletorValor: '.label_box .label_name span'
		},
		exibicaoPerguntas: {
			seletor: '#content_question_draw',
			tipo: 'select',
			default: 'Exibir mesmas perguntas nas tentativas'
		},
		visualizacaoRespostas: {
			seletor: '#content_question_list_method',
			tipo: 'select',
			default: 'Exibir Apenas Nota'
		},
		pontuacaoMinima: {
			seletor: '#content_minimum_score',
			tipo: 'input'
		},
		tentativas: {
			seletor: '#content_attempts',
			tipo: 'input'
		},
		percPontuacaoFinal: {
			seletor: '#content_final_score_ratio',
			tipo: 'input',
			default: '0'
		},
		adicionarPerguntas: {
			seletor: '.add_category',
			tipo: 'button'
		},
		perguntasCat1: {
			seletor: '#question_params_questions_category1',
			tipo: 'select',
			default: 'Todas'
		},
		perguntasCat2: {
			seletor: '#question_params_questions_category2',
			tipo: 'select',
			default: 'Todas'
		},
		quantidadePerguntas: {
			seletor: '#question_params_questions_amount',
			tipo: 'input'
		},
		// Scorm
		enviarScorm: {
			seletor: '#scorm_link',
			tipo: 'uploadButton'
		},
		descricaoArquivoScorm: {
			seletor: '#scorm-description',
			tipo: 'fileDescription'
		},
		marcarConcluidoScorm: {
			seletor: '#mark_completed_scorm',
			tipo: 'checkbox'
		},
		// Games
		codigoCompartilhamento: {
			seletor: '#game-key',
			tipo: 'input'
		},
		// Página
		editarPagina: {
			seletor: '#content-page .chakra-button',
			tipo: 'button'
		},
		fecharEditarPagina: {
			seletor: '.chakra-modal__close-btn',
			tipo: 'button'
		},
		// Aula
		editarAula: {
			seletor: '#content-lesson .chakra-button',
			tipo: 'button'
		},
		fecharEditarAula: {
			seletor: '#close-layout-aba-certificate',
			tipo: 'button'
		}
	}

	preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
		const campo = this.elementos[nomeCampo]

		if (!campo) {
			throw new Error(`Campo ${nomeCampo} não encontrado`)
		}

		const { seletor, tipo, default: valorDefault } = campo

		// Se for um botão, apenas clique nele sem necessidade de valor
		if (tipo === 'button') {
			cy.get(seletor).click()
			return
		}

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
				case 'inputText':
					cy.get(seletor)
						.type(valorFinal)
					break
				case 'checkbox':
					cy.get(seletor).then($checkbox => {
						const isChecked = $checkbox.is(':checked')
						if ((valorFinal && !isChecked) || (!valorFinal && isChecked)) {
							cy.get(seletor).click()
						}
					})
					break
				case 'radio':
					cy.contains(seletor, valorFinal)
						.click()
					break
				case 'iframeText':
					cy.get(seletor).then($iframe => {
						const doc = $iframe.contents()
						cy.wrap(doc).find('body.cke_editable').click({ force: true }).clear().type(valorFinal, { force: true })
					})
					break
				case 'select':
					cy.get(seletor)
						.select(valorFinal)
					break
				case 'search':
					cy.get(seletor)
						.click()
						.type(valorFinal)
						.type('{enter}')

					cy.get('.item_name')
						.contains(valorFinal)
						.click()
					break
				case 'uploadButton':
					if (valorFinal) {
						cy.get(seletor)
							.click()

						cy.get('#file')
							.selectFile(`cypress/fixtures/${valorFinal}`, { force: true })

						cy.get('#button_send_file')
							.click()

						cy.get(seletor, { timeout: 15000 })
							.contains('Substituir arquivo', { timeout: 15000 })
							.should('be.visible')
					}
					break
				case 'radioVideo':
					if (valorFinal) {
						cy.get(seletor)
							.click()
					}
					break
				case 'fileDescription':
					// Nenhuma ação necessária
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

		const mapeamentoTipoAtividade = {
			'Texto': 'text',
			'Página': 'page',
			'Aula': 'lesson',
			'PDF Estampado': 'pdf',
			'Vídeo': 'video',
			'Vídeo Externo': 'external',
			'Arquivos': 'other',
			'Questionário': 'questions',
			'Scorm': 'scorm',
			'Games': 'games'
		}

		if (!campo) {
			throw new Error(`Campo ${nomeCampo} não encontrado`)
		}

		const { seletor, tipo, seletorValor, default: valorDefault } = campo

		let valorFinal = valor !== undefined ? valor : valorDefault

		switch (tipo) {
			case 'input':
				cy.get(seletor)
					.should('have.value', valor)
				break
			case 'inputText':
				cy.get(seletor)
					.should('have.text', valor)
				break
			case 'checkbox':
				cy.get(seletor)
					.should(valor ? 'be.checked' : 'not.be.checked')
				break
			case 'radio':
				const valorMapeado = mapeamentoTipoAtividade[valor]
				cy.get(seletorValor)
					.should('have.value', valorMapeado)
				break
			case 'radioVideo':
				if (valorFinal) {
					cy.get(`${seletor}[value="${nomeCampo}"]`)
						.should('be.checked')
				} else {
					cy.get(`${seletor}[value="${nomeCampo}"]`)
						.should('not.be.checked')
				}
				break
			case 'select':
				cy.get(seletor)
					.find('option:selected')
					.should('have.text', valorFinal)
				break
			case 'iframeText':
				cy.get(seletor).then($iframe => {
					const doc = $iframe.contents()

					cy.wrap(doc).find('body.cke_editable').then($body => {
						cy.wrap($body).should('have.text', valorFinal)
					})
				})
				break
			case 'search':
				if (valor) {
					cy.get(seletor)
						.find(seletorValor)
						.should('have.attr', 'title', `${valor} - Prova`)
				} else {
					cy.get(seletor)
						.find(seletorValor)
						.should('not.exist')
				}
				break
			case 'uploadButton':
				if (valorFinal) {
					cy.get(seletor)
						.should('contain', 'Substituir arquivo')
				} else {
					cy.get(seletor)
						.should('contain', 'Enviar arquivo')
				}
				break
			case 'fileDescription':
				if (valorFinal === '') {
					cy.get(seletor).should($desc => {
						const descText = $desc.text().trim()
						expect(descText).to.be.empty
					})
				} else if (valorFinal.nome && valorFinal.tamanho) {
					cy.get(seletor).should($desc => {
						let descText = $desc.text().trim()
						descText = descText.replace(/\s*\n\s*/g, ' ')

						const nomeEsperado = `Nome: ${valorFinal.nome}`
						const tamanhoFormatado = `Tamanho: ${valorFinal.tamanho}`

						expect(descText).to.include(nomeEsperado)
						expect(descText).to.include(tamanhoFormatado)
					})
				} else {
					cy.get(seletor).should('exist')
				}
				break
			default:
				throw new Error(`Tipo de campo ${tipo} não suportado`)
		}
	}

	// Função para clicar no botão "Salvar" da tela de criação de atividades (Edição de Espaço)
	salvar() {
		cy.get('#button_send_form')
			.click()
	}

	// Função para clicar no botão "Cancelar" da tela de criação de atividades (Edição de Espaço)
	cancelar() {
		cy.get('#event-cancel')
			.click()
	}

	// Função para clicar no botão "Voltar" da tela de criação de atividades (Edição de Espaço)
	voltar() {
		cy.contains('.btn-back', 'Voltar')
			.click()
	}
}
export default new formAtividades