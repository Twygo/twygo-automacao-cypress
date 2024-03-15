// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Em cypress/support/commands.js
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

//TODO>
Cypress.Commands.add('formularioConteudosAbaDados', (conteudo, opcoes = { limpar: false }) => {
  const preencherCampo = (seletor, valor, tipo, valorDefault) => {
    if (opcoes.limpar && tipo !== 'checkbox' && tipo !== 'radio') {
      cy.get(seletor)
        .clear()
    }

    const valorFinal = valor || valorDefault

    switch (tipo) {
      case 'input':
      case 'select':
        cy.get(seletor)
          .type(valorFinal)
        break
      case 'checkbox':
      case 'radio':
        if (valorFinal) cy.get(seletor).check()
        else cy.get(seletor).uncheck()
        break
      case 'iframe':
        cy.get(seletor, { timeout: 10000 }).then($iframe => {
          const doc = $iframe.contents()
          cy.wrap(doc).find('body.cke_editable').click({ force: true }).clear().type(valorFinal, { force: true })
        })
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
      tipo: 'checkbox',
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
    categorias: {
      seletor: "input.form-control.as-input[name='event[category_extra]']",
      tipo: 'texto'
    },
    remover_banner: { 
      seletor: '#remove_banner', 
      tipo: 'checkbox', 
      default: false 
    },
    permite_anexo: {
      seletor: 'div.col-md-6.col-lg-4:contains("Permitir envio de anexos na inscrição?")',
      tipo: 'radio',
      default: 'Desabilitado'
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
      tipo: 'input',
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
  };
})  


  // Preenchendo os campos com base no objeto conteudo
  // Object.entries(conteudo).forEach(([chave, valor]) => {
  //   const configCampo = mapeamentoCampos[chave];
  //   if (configCampo) {
  //     preencherCampo(configCampo.seletor, valor, configCampo.tipo, configCampo.default);
  //   }
  // });