import formConteudos from "./pageObjects/formConteudos"

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

Cypress.Commands.add('alterarPerfil', function(perfil) {
  cy.get('#btn-profile')
    .should('be.visible')
    .click()

  cy.fixture('labels').then((labels) => {
    const { administrador, instrutor, gestor, aluno, pgInicial, pgInicialAluno } = labels.perfil
    
    switch (perfil) {
      case 'administrador':
        cy.get('#admin-profile')
          .should('be.visible')
          .click()

        // Verificar se o perfil foi alterado com sucesso
        cy.contains('#btn-profile', administrador)
          .should('be.visible')

        cy.contains('#page-breadcrumb', pgInicial)
          .should('be.visible')
        break
      case 'instrutor':
        cy.get('#instructor-profile')
          .should('be.visible')
          .click()
        
        // Verificar se o perfil foi alterado com sucesso
        cy.contains('#btn-profile', instrutor)
          .should('be.visible')

        cy.contains('#page-breadcrumb', pgInicial)
          .should('be.visible')
        break
      case 'gestor':
        cy.get('#manager-profile')
          .should('be.visible')
          .click()
        
        // Verificar se o perfil foi alterado com sucesso
        cy.contains('#btn-profile', gestor)
          .should('be.visible')

        cy.contains('#page-breadcrumb', pgInicial)
          .should('be.visible')
        break
      case 'aluno':
        cy.get('#student-profile')
          .should('be.visible')
          .click()

        // Verificar se o perfil foi alterado com sucesso
        cy.contains('#btn-profile', aluno)
          .should('be.visible')

        cy.contains('#page-breadcrumb', pgInicialAluno)
          .should('be.visible')
        break
    }
  })
})

Cypress.Commands.add('acessarPgCatalogo', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/events/?tab=itens-portfolio`)

  cy.fixture('labels').then((labels) => {
    const { breadcrumb } = labels.conteudo.catalogo
  
    // Verificar se a página de catálogo foi acessada com sucesso
    cy.contains('#page-breadcrumb', breadcrumb)
      .should('be.visible')
  })
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
  const formulario = new formConteudos()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

Cypress.Commands.add('validarDadosConteudo', (conteudo, categoria) => {
  const formulario = new formConteudos()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor, categoria)
  })
})

Cypress.Commands.add('addConteudo', function(tipoConteudo) {
  cy.fixture('labels').then((labels) => {
    const { breadcrumbAdicionar, tituloPgAdicionar } = labels.conteudo[tipoConteudo]
    
    switch (tipoConteudo) {
      case 'curso':
        cy.get('button', '#menu-button-4')
          .should('be.visible')
          .click()

        cy.get('button', '#menu-list-4-menuitem-2')
          .should('be.visible')
          .click()
        break
      case 'trilha':
        cy.get('button', '#menu-button-4')
          .should('be.visible')
          .click()

        cy.get('button', '#menu-list-4-menuitem-1')
          .should('be.visible')
          .click()
        break
    }

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
