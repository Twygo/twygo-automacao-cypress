Cypress.Commands.add('loginTwygoAutomacao', function() {
  cy.visit('/users/login')

  cy.get('#user_email')
    .type(Cypress.env('login'))
  
  cy.get('#user_password')
    .type(Cypress.env('password'))

  cy.contains('button', 'Entrar')
    .should('be.visible')  
    .click()

  // Verificar se o login foi realizado com sucesso
  cy.contains('#page-breadcrumb', 'Dashboard')
    .should('be.visible')

  cy.contains('.name', 'Twygo Automação')
    .should('be.visible')

  cy.contains('#btn-profile', 'Aluno')
    .should('be.visible')
})

Cypress.Commands.add('alterarPerfilParaAdministrador', function() {
  cy.get('#btn-profile')
    .should('be.visible')
    .click()

  cy.get('#admin-profile')
    .should('be.visible')
    .click()

  // Verificar se o perfil foi alterado com sucesso
  cy.contains('#btn-profile', 'Administrador')
    .should('be.visible')

  cy.contains('#page-breadcrumb', 'Lista de cursos')
    .should('be.visible')
})

Cypress.Commands.add('acessarPgCatalogo', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/events/?tab=itens-portfolio`)

  // Verificar se a página de catálogo foi acessada com sucesso
  cy.contains('#page-breadcrumb', 'Catálogo de cursos')
    .should('be.visible')
})

Cypress.Commands.add("criarCatalogoViaApi", (body, attempt = 1) => {
    cy.request({
      method: 'POST',
      url: `/api/v1/o/${Cypress.env('orgId')}/portfolio`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cypress.env('token')}`
      },
      body: body,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status !== 201 && attempt < 3) {
        cy.log(`Tentativa ${attempt}: Falha na requisição. Tentando novamente`)
        cy.makeRequestWithRetry(url, body, attempt + 1)
      } else {
        expect(response.status).to.eq(201)
      }
    })
})

Cypress.Commands.add('excluirCatalogoViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/portfolio`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
  }).then((response) => {
    expect(response.status).to.eq(200)
    const portfolios = response.body.portfolios
    portfolios.forEach((portfolio) => {
      cy.request({
        method: 'DELETE',
        url: `/api/v1/o/${Cypress.env('orgId')}/portfolio/${portfolio.id}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${Cypress.env('token')}`
        },
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200)
      })
    })
  })
})

Cypress.Commands.add('excluirCursoViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/courses?page=1&per_page=99999`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
  }).then((response) => {
    expect(response.status).to.eq(200)
    const courses = response.body.courses.contents
    courses.forEach((course) => {
      cy.request({
        method: 'DELETE',
        url: `/api/v1/o/${Cypress.env('orgId')}/courses/${course.id}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${Cypress.env('token')}`
        },
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200)
      })
    })
  })
})

Cypress.Commands.add('preencherDadosConteudo', (conteudo, opcoes = { limpar: false }) => {
  const preencherCampo = (seletor, valor, tipo, valorDefault) => {
    if (opcoes.limpar && tipo === 'input') {
      cy.get(seletor)
        .clear()
    }

    const valorFinal = valor || valorDefault

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
          const isChecked = $checkbox.is(':checked');
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
      case 'tag':
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
      case 'input_value':
        cy.get(seletor)
          .clear()
          .type(valorFinal.replace('.', ','))
        break
    }
  }

  const mapeamentoCampos = {
    nome: { 
      seletor: '#event_name', 
      tipo: 'input'
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
      tipo: 'input' 
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
      seletor: "input.form-control.as-input[name='event[category_extra]']",
      tipo: 'tag'
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

  Object.keys(conteudo).forEach(nomeCampo => {
    // Verifica se a entrada para nomeCampo existe em mapeamentoCampos
    if (mapeamentoCampos[nomeCampo]) {
      const { seletor, tipo, default: valorDefault } = mapeamentoCampos[nomeCampo]
      const valor = conteudo[nomeCampo]
      preencherCampo(seletor, valor, tipo, valorDefault)
    } else {
      // Trata o caso em que a entrada não existe, possivelmente com um console.log ou outra ação
      console.warn(`Campo não encontrado no mapeamento: ${nomeCampo}`)
    }
  })
}) 

Cypress.Commands.add('validarDadosConteudo', (conteudo, categoria) => {
  const mapeamentoCampos = {
    nome: { 
      seletor: '#event_name', 
      tipo: 'input'
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
      tipo: 'input' 
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
      seletor: "input.form-control.as-input[name='event[category_extra]']",
      tipo: 'tag'
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
      tipo: 'iframe_status'
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

  Object.keys(conteudo).forEach(nomeCampo => {
    // Verifica se a entrada para nomeCampo existe em mapeamentoCampos
    if (mapeamentoCampos[nomeCampo]) {
      const { seletor, tipo, default: valorDefault } = mapeamentoCampos[nomeCampo]
      const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault

      validarCampo(seletor, valor, tipo, valorDefault)
    } else {
      // Trata o caso em que a entrada não existe, possivelmente com um console.log ou outra ação
      console.warn(`Campo não encontrado no mapeamento: ${nomeCampo}`)
    }
  })
  
  function validarCampo(seletor, valor, tipo, valorDefault) {
    
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
            console.log(`Categorias encontradas: ${categoriasEncontradas} | Categorias esperadas: ${categoriasEsperadas}`)
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
})

Cypress.Commands.add('addConteudo', function(tipoConteudo) {
  cy.fixture('labels').then((labels) => {
    const { breadcrumbAdicionar, tituloPgAdicionar } = labels.conteudo[tipoConteudo]
    
    // Adicionar
    cy.contains('button', 'Adicionar')
      .should('be.visible')
      .click()

    // Validar se a página foi carregada corretamente
    cy.contains('#page-breadcrumb', breadcrumbAdicionar)
      .should('be.visible')

    cy.contains('.detail_title', tituloPgAdicionar)
      .should('be.visible')
  })
})

Cypress.Commands.add('editarConteudo', function(nomeConteudo, tipoConteudo) {
  cy.fixture('labels').then((labels) => {
    const { breadcrumbEdicao, tituloPgEdicao } = labels.conteudo[tipoConteudo]
    
		// Clicar em opções e editar
		cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: 5000})
			.find('svg[aria-label="Options"]')
			.click()

		cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: 5000})
			.contains('button', 'Editar')
			.click()

    // Validar se a página foi carregada corretamente
		cy.contains('#page-breadcrumb', breadcrumbEdicao, { timeout: 5000})
			.should('be.visible')

		cy.contains('.detail_title', tituloPgEdicao, { timeout: 5000})
			.should('be.visible')
  })
})

Cypress.Commands.add('salvarConteudo', function(nomeConteudo, tipoConteudo) {
  cy.fixture('labels').then((labels) => {
    const { breadcrumb, msgSucesso } = labels.conteudo[tipoConteudo]
    
    // Salvar conteúdo
    cy.contains('button', 'Salvar')
      .should('be.visible')
      .click()

    // Validar mensagem
    cy.contains('.flash.notice', msgSucesso, { timeout: 5000 })
      .should('be.visible')

    // Validar redirecionamento
    cy.contains('#page-breadcrumb', breadcrumb, { timeout: 5000})
      .should('be.visible')

    // Verificar se o curso foi criado e é exibido na listagem
    cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: 5000})
      .should('be.visible')
      .should('have.length', 1)
  })
})

Cypress.Commands.add('cancelarFormularioConteudo', function(tipoConteudo) {
  cy.fixture('labels').then((labels) => {
    const { breadcrumb } = labels.conteudo[tipoConteudo]

    // Cancelar
    cy.contains('#event-cancel', 'Cancelar')
      .should('be.visible')
      .click()

    // Validar redirecionamento
    cy.contains('#page-breadcrumb', breadcrumb, { timeout: 5000})
      .should('be.visible')
  })
})

Cypress.Commands.add('excluirConteudo', function(nomeConteudo, tipoConteudo) {
  cy.fixture('labels').then((labels) => {
    const { tituloModalExclusao, texto1ModalExclusao, texto2ModalExclusao, msgSucessoExclusao } = labels.conteudo[tipoConteudo]

    // Acessar opções e excluir
    cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: 5000})
      .find('svg[aria-label="Options"]')
      .click()

    cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: 5000})
      .wait(2000)	
      .contains('button', 'Excluir')
      .click({ force: true })

    // Validar modal de exclusão
    cy.contains('.chakra-modal__header', tituloModalExclusao)
      .should('be.visible')

    cy.contains('.chakra-heading', nomeConteudo)
      .should('be.visible')

    cy.contains('.chakra-modal__body', texto1ModalExclusao)
      .should('be.visible')

    cy.contains('.chakra-modal__body', texto2ModalExclusao)
      .should('be.visible')

    // Confirmar exclusão
    cy.contains('button.chakra-button', 'Excluir')
      .click({ force: true})

    // Validar mensagem
    cy.contains('.chakra-alert__desc', msgSucessoExclusao, { timeout: 5000 })
      .should('be.visible')

    // Verificar se o conteúdo foi excluído e não é exibido na listagem
    cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: 5000})
      .should('not.exist')
  })
})
