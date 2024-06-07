class formConfigOrganizacao {
    elementos = {
        abaDados: () => cy.get('a[tab="organization-form"]'),
        abaCustomizacoes: () => cy.get('a[tab="custom"]'),
        abaCertificado: () => cy.get('a[tab="certificate"]'),
        abaIntegracoes: () => cy.get('a[tab="integrations"]'),
        abaTermos: () => cy.get('a[tab="terms"]'),
        abaUrlWebhooks: () => cy.get('a[tab="url_webhooks"]'),

        // :: Aba Dados ::
        nome: {
            seletor: '#organization_name',
            tipo: 'input' 
        },
        descricao: {
			seletor: 'div#cke_organization_description iframe.cke_wysiwyg_frame',
			tipo: 'iframeText'
        },
        informacoesGerais: {
			seletor: 'div#cke_organization_general_information iframe.cke_wysiwyg_frame',
			tipo: 'iframeText'
        },
        resumoIndexacao: {
            seletor: '#organization_meta_description',
            tipo: 'input' 
        },
        cep: {
            seletor: '#organization_zip_code',
            tipo: 'input-zipcode' 
        },
        endereco: {
            seletor: '#organization_address',
            tipo: 'input' 
        },
        complemento: {
            seletor: '#organization_complement',
            tipo: 'input' 
        },
        bairro: {
            seletor: '#organization_neighborhood',
            tipo: 'input' 
        },
        cidade: {
            seletor: '#organization_city',
            tipo: 'input' 
        },
        estado: {
            seletor: '#organization_state',
            tipo: 'input' 
        },
        pais: {
            seletor: '#organization_country',
            tipo: 'input' 
        },
        telefone: {
            seletor: '#organization_phone',
            tipo: 'input' 
        },
        email: {
            seletor: '#organization_email',
            tipo: 'input' 
        },
        site: {
            seletor: '#organization_website',
            tipo: 'input' 
        },
        converterEscalaBranco: {
            seletor: '#organization_negative_logo',
            tipo: 'checkbox' 
        },
        personalizarLinkLogotipo: {
            seletor: '#organization_can_customize_logo_url',
            tipo: 'checkbox' 
        },
        linkRedirecionamento: {
            seletor: '#organization_logo_customized_url',
            tipo: 'input' 
        },
        botaoContato: {
            seletor: '#organization_contact_label',
            tipo: 'input' 
        },
        usarGestaoCompetencias: {
            seletor: '#organization_use_professional_skills',
            tipo: 'checkbox' 
        },
        ativarGamificacao: {
            seletor: '#organization_gamification_active',
            tipo: 'checkbox' 
        },
        visualizacao: {
            seletor: '#organization_allowed_view',
            tipo: 'select' 
        },
        abaPortfolio: {
            seletor: '#tab_enabled_portfolio',
            tipo: 'checkbox' 
        },
        abaAgenda: {
            seletor: '#tab_enabled_events',
            tipo: 'checkbox' 
        },
        abaParceiros: {
            seletor: '#tab_enabled_partners',
            tipo: 'checkbox' 
        },
        abaSobre: {
            seletor: '#tab_enabled_about',
            tipo: 'checkbox' 
        },
        abaPlanos: {
            seletor: '#tab_enabled_plans',
            tipo: 'checkbox' 
        },
        listaEmpresas: {
            seletor: '#enterprises',
            tipo: 'input' 
        },
        nrColaboradores: {
            seletor: '#number_of_employees',
            tipo: 'input' 
        },
        ramoAtuacao: {
            seletor: '#business_line',
            tipo: 'input' 
        },
        cargo: {
            seletor: '#role',
            tipo: 'input' 
        },
        salvarDados: {
            seletor: '#organization-form button.btn-primary.save[type="submit"]',
            tipo: 'button'
        },

        // :: Aba Customizações ::
        // Alterar dados do usuário
        naoPermitirAlterarDados: {
            seletor: '#not_update_professional_check',
            tipo: 'checkbox' 
        },
        salvarAlterarDados: {
            seletor: '#save_update_professional',
            tipo: 'button' 
        },

        // Configurações de login
        tempoExpiracaoLogin: {
            seletor: '#setting_active',
            tipo: 'checkbox' 
        },
        tempoMaxInativo: {
            seletor: '#inative_time',
            tipo: 'input' 
        },
        loginEmail: {
            seletor: 'input[type="checkbox"]#organization_login_by_email',
            tipo: 'checkbox' 
        },
        loginCpf: {
            seletor: 'input[type="checkbox"]#organization_login_by_cpf',
            tipo: 'checkbox' 
        },
        salvarConfiguracoesLogin: {
            seletor: '#submit_setting',
            tipo: 'button'
        },

        // Configurações de interface
        corPrimaria: {
            seletor: '#defaultColor',
            tipo: 'input' 
        },
        corTexto: {
            seletor: '#textColor',
            tipo: 'input' 
        },
        mostrarFundoLogin: {
            seletor: '#login_bar',
            tipo: 'checkbox' 
        },
        mostrarBotaoRegistrar: {
            seletor: 'input[type="checkbox"]#register_button',
            tipo: 'checkbox' 
        },
        removerImagemFundoLogin: {
            seletor: '#remove_wallpaper',
            tipo: 'checkbox-action' 
        },
        salvarCustomizacaoInterface: {
            seletor: '#organization_theme',
            tipo: 'button' 
        },

        // Envio de e-mails
        nomeEmail: {
            seletor: '#organization_email_name',
            tipo: 'input' 
        },
        emailEmail: {
            seletor: '#organization_email_email',
            tipo: 'input' 
        },
        salvarValidarEnvioEmail: {
            seletor: '#organization_email_is_spf_valid',
            tipo: 'button' 
        },
        limparInformacoesEmail: {
            seletor: '#cancel-organization-email',
            tipo: 'button'
        },

        // Domínios
        novoDominio: {
            seletor: '.btn.btn-primary.inline.new-domain.waves-effect',
            tipo: 'button' 
        },
        validarDNS: {
            seletor: '#validate_dns',
            tipo: 'button' 
        },
        editarDominio: {
            seletor: '.domain-edit',
            tipo: 'button' 
        },
        excluirDominio: {
            seletor: '.domain-edit',
            tipo: 'button' 
        },
        nomeDominio: {
            seletor: '#domain_name',
            tipo: 'input' 
        },
        url: {
            seletor: '#domain_url',
            tipo: 'input' 
        },
        salvarDominio: {
            seletor: '#domain-add',
            tipo: 'button' 
        },
        cancelarDominio: {
            seletor: '#cancel-domain',
            tipo: 'button' 
        },
        utilizarDominioPadrao: {
            seletor: '#domain_is_default_url',
            tipo: 'checkbox' 
        },

        // :: Aba Certificado ::
        configurar: {
            seletor: '.btn.btn-primary.ghost.waves-effect',
            tipo: 'button' 
        },
        selecionarImagem: {
            seletor: '#certificate_template_background',
            tipo: 'uploadButton'
        },
        salvarGerarModelo: {
            seletor: '.form-submit.btn.btn-primary',
            tipo: 'button'
        },
        notificarGestorNovosCertificados: {
            seletor: '#sent_mail_owner',
            tipo: 'checkbox' 
        },
        salvarCertificado: {
            seletor: '#organization-certificate_tab .btn.btn-primary.save.waves-effect',
            tipo: 'button' 
        },

        // :: Aba Integrações ::
        // Pixel        
        adicionarPixel: {
            seletor: '#add-pixel',
            tipo: 'button' 
        },
        identificador: {
            seletor: '#identifier',
            tipo: 'input' 
        },
        codigo: {
            seletor: '#tracker-code',
            tipo: 'input' 
        },
        salvarPixel: {
            seletor: 'div#pixel-form button.btn.btn-primary.waves-effect',
            tipo: 'button' 
        },
        salvarPixel2: {
            seletor: 'div.integration--item div#pixel-form button.btn.btn-primary.waves-effect',
            tipo: 'button' 
        },

        // Login com redes sociais
        ativarLogin: {
            seletor: 'input[type="checkbox"]#organization_setting_value',
            tipo: 'checkbox' 
        },
        salvarLogin: {
            seletor: '.secret_key_form button.btn.btn-primary.inline.waves-effect',
            tipo: 'button' 
        },

        // :: Aba Termos ::
        // Editor de texto
        editorTexto: {
            seletor: '#selected_option_text',
            tipo: 'radio' 
        },
        termosUsoTexto: {
            seletor: 'div#cke_term_use_terms_content iframe.cke_wysiwyg_frame',
            tipo: 'iframeText'
        },
        politicaPrivacidadeTexto: {
            seletor: 'div#cke_term_privacy_policy_content iframe.cke_wysiwyg_frame',
            tipo: 'iframeText'
        },
        salvarTermosPoliticaTexto: {
            seletor: 'div.container-text button.btn.btn-primary.save.waves-effect',
            tipo: 'button'
        },
        htmlCustomizado: {
            seletor: '#selected_option_html',
            tipo: 'radio' 
        },
        termosUsoHtml: {
            seletor: '#use_terms_text',
            tipo: 'input' 
        },
        politicaPrivacidadeHtml: {
            seletor: '#privacy_policy_text',
            tipo: 'input' 
        },
        salvarTermosPoliticaHtml: {
            seletor: 'div.container-HTML button.btn.btn-primary.save.waves-effect',
            tipo: 'button' 
        },

        // :: Aba URL Webhooks ::
        novaUrl: {
            seletor: '#new_url_webhook',
            tipo: 'button' 
        },
        funcionalidade: {
            seletor: '#field_function',
            tipo: 'select' 
        },
        urlWebhook: {
            seletor: '#field_url',
            tipo: 'input' 
        },
        salvarUrlWebhook: {
            seletor: '#save_url_webhook',
            tipo: 'button' 
        },
        cancelarUrlWebhook: {
            seletor: '#cancel_url_webhook',
            tipo: 'button' 
        },
        ativarUrlWebhook: {
            seletor: '#check_change_url_webhooks_active_112',
            tipo: 'checkbox' 
        },
        editarUrlWebhook: {
            seletor: '.url_webhook_edit',
            tipo: 'button' 
        },
        excluirUrlWebhook: {
            seletor: '.url_webhook_destroy',
            tipo: 'button' 
        }
    }

    abaDados() {
        this.elementos.abaDados().click()
    }

    abaCustomizacoes() {
        this.elementos.abaCustomizacoes().click()
    }

    abaCertificado() {
        this.elementos.abaCertificado().click()
    }

    abaIntegracoes() {
        this.elementos.abaIntegracoes().click()
    }

    abaTermos() {
        this.elementos.abaTermos().click()
    }

    abaUrlWebhooks() {
        this.elementos.abaUrlWebhooks().click()
    }

    preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
        const campo = this.elementos[nomeCampo]
        
        if (!campo) {
            throw new Error(`Campo ${nomeCampo} não encontrado`)
        }
    
        const { seletor, tipo, default: valorDefault } = campo 
        
        let valorFinal = valor !== undefined ? valor : valorDefault
        
        if (opcoes.limpar || valorFinal === '') {
            if (tipo === 'input') {
                cy.get(seletor).clear()
            } else if (tipo === 'iframeText') {
                cy.get(seletor).then($iframe => {
                    const doc = $iframe.contents()
                    cy.wrap(doc).find('body.cke_editable').invoke('text', '').type(' ', { force: true })
                })
            }
            
            if (valorFinal === '') {
                return
            }
        }
    
        switch (tipo) {
            case 'input':
            case 'input-zipcode':
                cy.get(seletor).type(valorFinal)
                break
            case 'select':
                cy.get(seletor).select(valorFinal)
                break
            case 'radio':
            case 'checkbox':
            case 'checkbox-action':
                // Verifica o estado atual do checkbox e só clica se necessário
                cy.get(seletor).then($checkbox => {
                    const isChecked = $checkbox.is(':checked')
                    // Se o estado desejado for diferente do estado atual, clica para alterar
                    if ((valorFinal && !isChecked) || (!valorFinal && isChecked)) {
                        cy.get(seletor).click( {force: true} )
                    }
                })
                break      
            case 'iframeText':
                cy.get(seletor).then($iframe => {
                    const doc = $iframe.contents()
                    const body = cy.wrap(doc.find('body.cke_editable'))
                    body.click({ force: true }).clear({ force: true }).then(() => {
                        if (valorFinal !== '') {
                            body.type(valorFinal, { force: true })
                        }
                    })
                })
                break
            case 'button':
                if (valorFinal === true) {
                    cy.get('body').then($body => {
                        if ($body.find(seletor).length) {
                            cy.get(seletor, { log: false }).click({ force: true })
                        }
                        // Nenhuma ação é realizada se o botão não for encontrado
                    })
                }
                break
            case 'uploadButton':
                cy.get(seletor)
                    .click()    
                    .selectFile(`cypress/fixtures/${valorFinal}`)
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
				cy.get(seletor)
					.should('have.value', valorFinal)
				break
            case 'input-zipcode':
                cy.get(seletor)
                    .invoke('val')
                    .should(val => {
                        expect(val).to.satisfy(val => 
                            val === '' || /\d{5}-\d{3}/.test(val),
                        )
                    })
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
			case 'radio':
            case 'checkbox':
				if (valorFinal === true ) {
					cy.get(seletor)
						.should('be.checked')
				} else {
					cy.get(seletor)
						.should('not.be.checked')
				}
				break
			case 'iframeText':
				cy.get(seletor).then($iframe => {
					const doc = $iframe.contents()
				
					cy.wrap(doc).find('body.cke_editable').then($body => {
						cy.wrap($body).should('have.text', valorFinal)
					})
				})
				break
            case 'button':
            case 'uploadButton':
                // Nenhuma validação a ser feita
                break
            default:
                throw new Error(`Tipo de campo desconhecido: ${tipo}`)
			}
	}
}
export default new formConfigOrganizacao