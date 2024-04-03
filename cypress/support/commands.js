import formConteudos from "./pageObjects/formConteudos"
import estruturaAtividades from "./pageObjects/estruturaAtividades"

/** DOCUMENTAÇÃO:
 * @name loginTwygoAutomacao
 * 
 * @description
 * Comando personalizado para realizar o login com usuário Twygo Automação.
 * 
 * @actions
 * 1. Acessa a página de login.
 * 2. Preenche o campo de e-mail com o login do usuário Twygo Automação.
 * 3. Preenche o campo de senha com a senha do usuário Twygo Automação.
 * 4. Clica no botão 'Entrar'.
 * 5. Verifica se o login foi realizado com sucesso.
 * 
 * @example
 * cy.loginTwygoAutomacao()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
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

/** DOCUMENTAÇÃO:
 * @name alterarPerfil
 * 
 * @description
 * Comando personalizado para alterar o perfil do usuário logado.
 * 
 * @actions
 * 1. Clica no botão de perfil.
 * 2. Seleciona o perfil desejado.
 * 3. Verifica se o perfil foi alterado com sucesso.
 * 
 * @param {String} perfil - O perfil a ser alterado (e.g., 'administrador', 'instrutor', 'gestor', 'aluno').
 * 
 * @example
 * cy.alterarPerfil('perfil')
 * 
 * @throws {Error} - Se o perfil informado não for 'administrador', 'instrutor', 'gestor' ou 'aluno'.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('alterarPerfil', function(perfil) {
  cy.get('#btn-profile')
    .should('be.visible')
    .click()

  const labels = Cypress.env('labels')
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
    default:
      throw new Error(`Perfil inválido: ${perfil}. Utilize 'administrador', 'instrutor', 'gestor' ou 'aluno'`)
  }
})

/** DOCUMENTAÇÃO:
 * @name acessarPgCatalogo
 * 
 * @description
 * Comando personalizado para acessar a página de catálogo.
 * 
 * @actions
 * 1. Acessa a página de catálogo.
 * 
 * @example
 * cy.acessarPgCatalogo()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('acessarPgCatalogo', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/events/?tab=itens-portfolio`)

  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.conteudo.catalogo

  // Verificar se a página de catálogo foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name acessarPgListaConteudos
 * 
 * @description
 * Comando personalizado para acessar a página de lista de conteúdos.
 * 
 * @actions
 * 1. Acessa a página de lista de conteúdos.
 * 
 * @example
 * cy.acessarPgListaConteudos()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('acessarPgListaConteudos', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/events?tab=events`)

  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.conteudo.curso

  // Verificar se a página de lista de conteúdos foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name criarCatalogoViaApi
 * 
 * @description
 * Comando personalizado para criar um catálogo via API.
 * 
 * @actions
 * 1. Realiza uma requisição POST para criar um catálogo.
 * 2. Valida se o status da requisição é 201.
 * 
 * @param {Object} body - O corpo da requisição para criação do catálogo. Este objeto deve conter os campos e valores a serem preenchidos.
 * @param {Number} attempt - A tentativa atual da requisição. Este parâmetro é utilizado para tentativas adicionais em caso de falha.
 * 
 * @example
 * cy.criarCatalogoViaApi(body)
 * 
 * @throws {Error} - Se a requisição não retornar status 201 após 3 tentativas.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add("criarCatalogoViaApi", (body, attempt = 1) => {
    const url = `/api/v1/o/${Cypress.env('orgId')}/portfolio`
    
    cy.request({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cypress.env('token')}`
      },
      body: body,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status !== 201 && attempt < 3) {
        cy.log(`Tentativa ${attempt}: Falha na requisição. Tentando novamente`)
        cy.criarCatalogoViaApi(body, attempt + 1)
      } else if (response.status !== 201) {
        cy.log(`Tentativa ${attempt}: Falha na requisição. Não foi possível criar o catálogo`)
        throw new Error(`Erro na criação do catálogo: ${response}`)
      } else {
        expect(response.status).to.eq(201)
      }
    })
})

/** DOCUMENTAÇÃO:
 * @name excluirCatalogoViaApi
 * 
 * @description
 * Comando personalizado para excluir todos os catálogos cadastrados via API.
 * 
 * @actions
 * 1. Realiza uma requisição GET para obter a listagem de catálogos cadastrados.
 * 2. Para cada catálogo encontrado, realiza uma requisição DELETE para excluir o catálogo.
 * 
 * @example
 * cy.excluirCatalogoViaApi()
 * 
 * @throws {Error} - Se a requisição GET não retornar status 200.
 * @throws {Error} - Se a requisição DELETE não retornar status 200.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('excluirCatalogoViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/portfolio`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(`Erro ao obter a listagem de catálogos: ${response}`)
    }

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
        if (deleteResponse.status !== 200) {
          throw new Error(`Erro ao excluir o catálogo: ${deleteResponse}`)
        }
      })
    })
  })
})

/** DOCUMENTAÇÃO:
 * @name excluirCursoViaApi
 * 
 * @description
 * Comando personalizado para excluir todos os cursos cadastrados via API.
 * 
 * @actions
 * 1. Realiza uma requisição GET para obter a listagem de cursos cadastrados.
 * 2. Para cada curso encontrado, realiza uma requisição DELETE para excluir o curso.
 * 
 * @example
 * cy.excluirCursoViaApi()
 * 
 * @throws {Error} - Se a requisição GET não retornar status 200.
 * @throws {Error} - Se a requisição DELETE não retornar status 200.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0 
 */
Cypress.Commands.add('excluirCursoViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/courses?page=1&per_page=99999`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(`Erro ao obter a listagem de cursos: ${response}`)
    }
    
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
        if (deleteResponse.status !== 200) {
          throw new Error(`Erro ao excluir o curso: ${deleteResponse}`)
        }
      })
    })
  })
})

/** DOCUMENTAÇÃO:
 * @name preencherDadosConteudo
 * 
 * @description
 * Comando personalizado para preencher os campos do formulário de um conteúdo específico.
 * 
 * @actions
 * 1. Preenche cada campo do formulário de acordo com os dados informados.
 * 
 * @param {Object} conteudo - O conteúdo a ser preenchido. Este objeto deve conter os campos e valores a serem preenchidos.
 * @param {Object} opcoes - As opções para preenchimento do conteúdo. Este objeto pode conter a opção de limpar os campos antes de preencher.
 * 
 * @example
 * cy.preencherDadosConteudo(conteudo, opcoes)
 * 
 * @throws {Error} - Se o campo informado não for encontrado no formulário. Validação realizada pelo método 'preencherCampo' da classe 'formConteudos'.
 * @see formConteudos
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('preencherDadosConteudo', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formConteudos()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

/** DOCUMENTAÇÃO:
 * @name validarDadosConteudo
 * 
 * @description
 * Comando personalizado para validar os dados do formulário de um conteúdo específico.
 * 
 * @actions
 * 1. Valida cada campo do formulário de acordo com os dados informados.
 * 
 * @param {Object} conteudo - O conteúdo a ser validado. Este objeto deve conter os campos e valores a serem validados.
 * @param {Object} categoria - As categorias do conteúdo a ser validado. Este objeto deve conter a listagem final de categorias a serem validadas.
 * 
 * @example
 * cy.validarDadosConteudo(conteudo, categoria)
 * 
 * @throws {Error} - Se o campo informado não for encontrado no formulário. Validação realizada pelo método 'validarCampo' da classe 'formConteudos'.
 * @see formConteudos
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0 
 */
Cypress.Commands.add('validarDadosConteudo', (conteudo, categoria) => {
  if (!conteudo) {
    throw new Error('O parâmetro "conteudo" é obrigatório.')
  }

  if (!categoria) {
    throw new Error('O parâmetro "categoria" é obrigatório.')
  }

  const formulario = new formConteudos()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor, categoria)
  })
})

/** DOCUMENTAÇÃO:
 * @name addConteudo
 * 
 * @description
 * Comando personalizado para adicionar um conteúdo específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Acessa a opção de 'Adicionar' conforme cada tipo de conteúdo para iniciar o processo de criação do conteúdo.
 * 2. Valida a exibição da página de criação do conteúdo.
 * 
 * @param {String} tipoConteudo - O tipo do conteúdo a ser adicionado (e.g., 'trilha', 'curso', 'catalogo'). Este parâmetro influencia no seletor utilizado para
 * encontrar o botão de adição e na página carregada para criação do conteúdo.
 * 
 * @example
 * cy.addConteudo('tipoConteudo')
 * 
 * @observations
 * Este comando não realiza o preenchimento dos campos do conteúdo. Para isso, @see preencherDadosConteudo
 * 
 * @throws {Error} - Se o tipo de conteúdo informado não for 'trilha', 'curso' ou 'catalogo'.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('addConteudo', function(tipoConteudo) {
  const labels = Cypress.env('labels')
  const { breadcrumbAdicionar, tituloPgAdicionar } = labels.conteudo[tipoConteudo]
  
  switch (tipoConteudo) {
    case 'curso':
      cy.get('#menu-button-4')
        .should('be.visible')
        .click()

      cy.get('#menu-list-4-menuitem-2')
        .should('be.visible')
        .click()
      break
    case 'trilha':
      cy.get('#menu-button-4')
        .should('be.visible')
        .click()

      cy.get('#menu-list-4-menuitem-1')
        .should('be.visible')
        .click()
      break
    case 'catalogo':
      cy.contains('button', 'Adicionar')
      .should('be.visible')
      .click()  
      break
    default:
      throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso' ou 'catalogo'`)
  }

  // Validar se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumbAdicionar)
    .should('be.visible')

  cy.contains('.detail_title', tituloPgAdicionar)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name editarConteudo
 * 
 * @description
 * Comando personalizado para editar um conteúdo específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Define um timeout padrão de 5 segundos.
 * 2. Acessa a opção de 'Editar' conforme cada tipo de conteúdo para iniciar o processo de edição do conteúdo.
 * 3. Valida a exibição da página de edição do conteúdo.
 * 
 * @param {String} nomeConteudo - O nome do conteúdo a ser editado. Este nome é utilizado para encontrar o conteúdo na listagem e clicar no botão de edição.
 * @param {String} tipoConteudo - O tipo do conteúdo a ser editado (e.g., 'trilha', 'curso', 'catalogo'). Este parâmetro influencia no seletor utilizado para 
 * encontrar o conteúdo na listagem e na página carregada para edição do conteúdo.
 * 
 * @example
 * cy.editarConteudo('Nome do Conteúdo', 'tipoConteudo')
 * 
 * @observations
 * Este comando não realiza a edição dos campos do conteúdo. Para isso, @see preencherDadosConteudo
 * 
 * @throws {Error} - Se o tipo de conteúdo informado não for 'trilha', 'curso' ou 'catalogo'.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('editarConteudo', function(nomeConteudo, tipoConteudo) {
  // Define o timeout padrão para validação das páginas
  const TIMEOUT_PADRAO = 5000

  // Acessa o arquivo de labels
  const labels = Cypress.env('labels')
  const { breadcrumbEdicao, tituloPgEdicao } = labels.conteudo[tipoConteudo]

  // Define o seletor para encontrar o conteúdo na listagem
  let seletor = ''

  switch (tipoConteudo) {
    case 'trilha':
    case 'curso':        
        seletor = `tr[tag-name='${nomeConteudo}']`    
        // Clica em 'Opções' e 'Editar'
        cy.get(seletor, { timeout: TIMEOUT_PADRAO})
          .find('svg[aria-label="Options"]')
          .click()

        cy.get(seletor, { timeout: TIMEOUT_PADRAO})
          .contains('button', 'Editar')
          .click()
      break
    case 'catalogo':
        seletor = `tr.event-row[name='${nomeConteudo}']`
        // Clica em editar
        cy.get(seletor, { timeout: TIMEOUT_PADRAO})
          .find('a[title="Editar"]')
          .click()
      break
    default:
      throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso' ou 'catalogo'`)
  }
  
  // Valida se a página foi carregada corretamente conforme o tipo de conteúdo
  cy.contains('#page-breadcrumb', breadcrumbEdicao, { timeout: TIMEOUT_PADRAO})
    .should('be.visible')

  cy.contains('.detail_title', tituloPgEdicao, { timeout: TIMEOUT_PADRAO})
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name salvarConteudo
 * 
 * @description
 * Comando personalizado para salvar um conteúdo específico e validar a ação.
 * 
 * @actions
 * 1. Define um timeout padrão de 5 segundos.
 * 2. Clica no botão 'Salvar' para iniciar o processo de salvamento do conteúdo.
 * 3. Valida a exibição da mensagem de sucesso após o salvamento.
 * 4. Verifica se o usuário é redirecionado para a página correta, conforme o tipo de conteúdo.
 * 5. Confirma se o conteúdo criado é visível e único na listagem correspondente.
 * 
 * @param {String} nomeConteudo - O nome do conteúdo a ser salvo. Este nome é utilizado para verificar a presença do conteúdo na listagem após o salvamento.
 * @param {String} tipoConteudo - O tipo do conteúdo a ser salvo (e.g., 'trilha', 'curso', 'catalogo'). Este parâmetro influencia na mensagem de sucesso esperada, na página de redirecionamento esperada e no seletor utilizado para encontrar o conteúdo na listagem.
 * 
 * @example
 * cy.salvarConteudo('Nome do Conteúdo', 'tipoConteudo')
 * 
 * @throws {Error} - Se o tipo de conteúdo informado não for 'trilha', 'curso' ou 'catalogo'.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('salvarConteudo', function(nomeConteudo, tipoConteudo) {
  // Define o timeout para validação das páginas
  const TIMEOUT_PADRAO = 5000

  // Acessa o arquivo de labels
  const labels = Cypress.env('labels')
  const { breadcrumb, msgSucesso } = labels.conteudo[tipoConteudo]
  
  // Define o seletor para encontrar o conteúdo na listagem
  let seletor = ''
  
  // Salva o conteúdo
  cy.contains('button', 'Salvar')
    .should('be.visible')
    .click()  
  
  // Valida a mensagem
  cy.contains('.flash.notice', msgSucesso, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  // Valida o redirecionamento
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  switch (tipoConteudo) {
    case 'criarCurso':
    case 'trilha':
    case 'curso':
      seletor = `tr[tag-name='${nomeConteudo}']`
      break
    case 'catalogo':
      seletor = `tr.event-row[name='${nomeConteudo}']`
      break
    default:
      throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso' ou 'catalogo'`)
  }

  // Verifica se o conteúdo foi criado e é exibido na listagem
  if (seletor) {
    cy.get(seletor, { timeout: TIMEOUT_PADRAO })
      .should('be.visible')
      .should('have.length', 1)
  }
})

/** DOCUMENTAÇÃO:
 * @name cancelarFormularioConteudo
 * 
 * @description
 * Comando personalizado para cancelar um formulário de conteúdo e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Clica no botão 'Cancelar' para cancelar a criação/edição de determinado conteúdo.
 * 2. Valida a exibição da página correta após o cancelamento.
 * 
 * @param {String} tipoConteudo - O tipo do conteúdo que está sendo criado (e.g., 'trilha', 'curso', 'catalogo'). Este parâmetro influencia no breadcrumb esperado para a página de redirecionamento.
 * 
 * @example
 * cy.cancelarFormularioConteudo('tipoConteudo')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('cancelarFormularioConteudo', function(tipoConteudo) {
  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.conteudo[tipoConteudo]

  // Cancelar
  cy.contains('#event-cancel', 'Cancelar')
    .should('be.visible')
    .click()

  // Validar redirecionamento
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: 5000})
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name excluirConteudo
 * 
 * @description
 * Comando personalizado para excluir um conteúdo específico, validar o modal, mensagens e confirmar a ação.
 * 
 * @actions
 * 1. Define um timeout padrão de 5 segundos.
 * 2. Clica na opção para excluir conforme o tipo de conteúdo a ser excluído.
 * 3. Valida a exibição do modal de exclusão do conteúdo e as mensagens exibidas.
 * 4. Confirma a exclusão do conteúdo.
 * 5. Valida a exibição da mensagem de sucesso após a exclusão.
 * 6. Verifica se o conteúdo foi removido da listagem.
 * 
 * @param {String} nomeConteudo - O nome do conteúdo a ser excluído. Este nome é utilizado para encontrar o conteúdo na listagem e clicar no botão de exclusão.
 * @param {String} tipoConteudo - O tipo do conteúdo a ser excluído (e.g., 'trilha', 'curso', 'catalogo'). Este parâmetro influencia no seletor utilizado para 
 * encontrar o conteúdo na listagem.
 * 
 * @example
 * cy.excluirConteudo('Nome do Conteúdo', 'tipoConteudo')
 * 
 * @throws {Error} - Se o tipo de conteúdo informado não for 'trilha', 'curso' ou 'catalogo'.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('excluirConteudo', function(nomeConteudo, tipoConteudo) {
  // Define o timeout para validação das páginas
  const TIMEOUT_PADRAO = 6000

  // Acessa o arquivo de labels
  const labels = Cypress.env('labels')
  const { tituloModalExclusao, texto1ModalExclusao, texto2ModalExclusao, msgSucessoExclusao } = labels.conteudo[tipoConteudo]

  // Define o seletor para encontrar o conteúdo na listagem
  let seletor = ''

  switch(tipoConteudo) {
    case 'trilha':
      seletor = `tr[tag-name='${nomeConteudo}']`  
      // Clica em 'Opções' e 'Excluir'
      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .find('svg[aria-label="Options"]')
        .click()

      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .wait(2000)	
        .contains('button', 'Excluir')
        .click({ force: true })

      // Valida o modal de exclusão
      cy.contains('.chakra-modal__header', tituloModalExclusao, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')

      cy.contains('.chakra-text', nomeConteudo)
        .should('be.visible')

      cy.contains('.chakra-text', texto1ModalExclusao)
        .should('be.visible')

      // Confirma a exclusão
      cy.contains('button.chakra-button', 'Excluir')
        .click({ force: true})

      // Valida a mensagem de sucesso da exclusão
      cy.contains('.chakra-alert__desc', msgSucessoExclusao, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')

      // Verifica se o conteúdo foi excluído e não é exibido na listagem
      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .should('not.exist')
      break
    case 'curso':        
      seletor = `tr[tag-name='${nomeConteudo}']`  
      // Clica em 'Opções' e 'Excluir'
      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .find('svg[aria-label="Options"]')
        .click()

      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .wait(2000)	
        .contains('button', 'Excluir')
        .click({ force: true })

      // Valida o modal de exclusão
      cy.contains('.chakra-modal__header', tituloModalExclusao, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')

      cy.contains('.chakra-heading', nomeConteudo)
        .should('be.visible')

      cy.contains('.chakra-modal__body', texto1ModalExclusao)
        .should('be.visible')

      cy.contains('.chakra-modal__body', texto2ModalExclusao)
        .should('be.visible')

      // Confirma a exclusão
      cy.contains('button.chakra-button', 'Excluir')
        .click({ force: true})

      // Valida a mensagem de sucesso da exclusão
      cy.contains('.chakra-alert__desc', msgSucessoExclusao, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')

      // Verifica se o conteúdo foi excluído e não é exibido na listagem
      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .should('not.exist')
      break
    case 'catalogo':
      seletor = `tr.event-row[name='${nomeConteudo}']`
      
      // Clica em 'Excluir'
      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .find('a[title="Excluir"]')
        .click()

      // Valida o modal de exclusão
      cy.contains('#modal-remove-events-index', tituloModalExclusao)
        .should('be.visible')
  
      cy.contains('#modal-remove-events-index_sub_title', nomeConteudo)
        .should('be.visible')
  
      cy.contains('#modal-remove-events-index-msg_title', texto1ModalExclusao)
        .should('be.visible')

      cy.contains('#modal-remove-events-index-msg_title', texto1ModalExclusao)
        .should('be.visible')
  
      cy.get('#modal-remove-events-index-confirmed')
        .click({ force: true })
  
      cy.contains('.flash.notice', msgSucessoExclusao, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
  
      // Verifica se o conteúdo foi excluído e não é exibido na listagem
      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .should('not.exist')
      break
    default:
      throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso' ou 'catalogo'`)
  }    
})

Cypress.Commands.add('addAtividadeConteudo', function(nomeConteudo, tipoConteudo) {
  const TIMEOUT_PADRAO = 5000
  
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg } = labels.atividades

  let seletor = ''

  switch (tipoConteudo) {
    case 'trilha':
    case 'curso':
      seletor = `tr[tag-name='${nomeConteudo}']`    
      // Clica em 'Opções' e 'Atividades'
      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .find('svg[aria-label="Options"]')
        .click()

      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .contains('button', 'Atividades')
        .click()
      break
    case 'catalogo':
      seletor = `tr.event-row[name='${nomeConteudo}']`
      // Clica para expandir opções
      cy.get(seletor, { timeout: TIMEOUT_PADRAO})
        .find('.div-table-arrow-down')
        .click()
      // Clica em 'Atividades'
      cy.get('#content-link', { timeout: TIMEOUT_PADRAO})
        .click()
      break
    case 'biblioteca':
      seletor = `tr.event-name[title='${nomeConteudo}']`
      // Clica em 'Atividades'
      cy.contains('button', 'Atividades', { timeout: TIMEOUT_PADRAO})
        .click()
      break
    default:
      throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso', 'catalogo' ou 'biblioteca'`)
  }

  // Validar se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')

  cy.contains('#breadcrumb', `> ${nomeConteudo}`)
    .should('be.visible')

  cy.contains('.detail_title', tituloPg)
    .should('be.visible')
})

Cypress.Commands.add('salvarAtividades', () => {
  const atividades = new estruturaAtividades()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.atividades

  // Salva a atividade
  atividades.salvarAtividade()

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso)
    .should('be.visible')
})

Cypress.Commands.add('editarAtividade', (nomeConteudo, nomeAtividade) => {
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPgEdicao } = labels.atividades

  // Edita a atividade
  cy.contains(`.dd-label, '${nomeAtividade}'`)
    .find('.dd-edit', 'Editar')
    .click()

  // Validar se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')

  cy.contains('#breadcrumb', `> ${nomeConteudo}`)
    .should('be.visible')

  cy.contains('.detail_title', tituloPgEdicao)
    .should('be.visible')
})
