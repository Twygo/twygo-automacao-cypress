import formConteudos from "./pageObjects/formConteudos"
import estruturaAtividades from "./pageObjects/estruturaAtividades"
import formAtividades from "./pageObjects/formAtividades"
import formBiblioteca from "./pageObjects/formBiblioteca"
import formQuestionarios from "./pageObjects/formQuestionarios"
import formPerguntas from "./pageObjects/formPerguntas"
import formUsuarios from "./pageObjects/formUsuarios"
import formParticipantes from "./pageObjects/formParticipantes"
import formInstrutor from "./pageObjects/formInstrutor"
import formGestor from "./pageObjects/formGestor"
import { fakerPT_BR } from "@faker-js/faker"


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

  cy.contains('.name', Cypress.env('username'))
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
 * @name acessarPgBiblioteca
 * 
 * @description
 * Comando personalizado para acessar a página da biblioteca.
 * 
 * @actions
 * 1. Acessa a página da biblioteca.
 * 
 * @example
 * cy.acessarPgBiblioteca()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('acessarPgBiblioteca', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/events/?tab=libraries`)

  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.conteudo.biblioteca

  // Verificar se a página da biblioteca foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name acessarPgLogin
 * 
 * @description
 * Comando personalizado para acessar a página de login.
 * 
 * @actions
 * 1. Acessa a página de login.
 * 
 * @example
 * cy.acessarPgLogin()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('acessarPgLogin', function() {
  cy.visit('/users/login')

  cy.title()
    .should('eq', `Login - ${Cypress.env('orgName')}`)
})

/** DOCUMENTAÇÃO:
 * @name acessarPgQuestionarios
 * 
 * @description
 * Comando personalizado para acessar a página de questionários.
 * 
 * @actions
 * 1. Acessa a página de questionários.
 * 
 * @example
 * cy.acessarPgQuestionarios()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('acessarPgQuestionarios', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/question_lists`)

  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.questionario
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
 * @param {String} tipoConteudo - O tipo do conteúdo a ser adicionado (e.g., 'trilha', 'curso', 'catalogo', 'biblioteca'). Este parâmetro influencia no seletor utilizado para
 * encontrar o botão de adição e na página carregada para criação do conteúdo.
 * 
 * @example
 * cy.addConteudo('tipoConteudo')
 * 
 * @observations
 * Este comando não realiza o preenchimento dos campos do conteúdo. Para isso, @see preencherDadosConteudo
 * 
 * @throws {Error} - Se o tipo de conteúdo informado não for 'trilha', 'curso', 'catalogo' ou 'biblioteca'.
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
    case 'biblioteca':
      cy.contains('#add-library', 'Adicionar')
        .should('be.visible')
        .click()
      break
    default:
      throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso', 'catalogo' ou 'biblioteca'`)
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
    case 'biblioteca':
      cy.get('tr.event-row')
        .contains('td.event-name', nomeConteudo)
        .parent()
        .find('a.event-edit')
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
    case 'biblioteca':
      seletor = `td.event-name[title='${nomeConteudo}']`
      break
    default:
      throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso', 'catalogo' ou 'biblioteca'`)
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
Cypress.Commands.add('excluirConteudo', function(nomeConteudo, tipoConteudo, listaConteudos = []) {
  // Define o timeout para validação das páginas
  const TIMEOUT_PADRAO = 8000

  // Acessa o arquivo de labels
  const labels = Cypress.env('labels')

  // Função para excluir um conteúdo específico
  const excluirConteudoEspecifico = (nomeConteudo, tipoConteudo) => {
    const { tituloModalExclusao, texto1ModalExclusao, texto2ModalExclusao, msgSucessoExclusao } = labels.conteudo[tipoConteudo]

    // Define o seletor para encontrar o conteúdo na listagem
    let seletor = ''

    // Utiliza o seletor para encontrar o conteúdo na listagem, clicar em 'Opções' e 'Excluir', clica em 'Excluir' e valida o modal de exclusão
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
        break
      case 'curso':
        seletor = `tr[tag-name='${nomeConteudo}']`

        // Clica em 'Opções' e 'Excluir'
        cy.get(seletor, { timeout: TIMEOUT_PADRAO })
          .find('svg[aria-label="Options"]')
          .click()

        cy.get(seletor, { timeout: TIMEOUT_PADRAO })
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
        break
      case 'catalogo':
        seletor = `tr.event-row[name='${nomeConteudo}']`
        cy.get(seletor, { timeout: TIMEOUT_PADRAO })
          .find('a[title="Excluir"]')
          .click()

        cy.contains('#modal-remove-events-index', tituloModalExclusao)
          .should('be.visible')

        cy.contains('#modal-remove-events-index_sub_title', nomeConteudo)
          .should('be.visible')

        cy.contains('#modal-remove-events-index-msg_title', texto1ModalExclusao)
          .should('be.visible')
        break
      case 'biblioteca':
        cy.get('tr.event-row')
          .contains('td.event-name', nomeConteudo)
          .parent()
          .find('a.event-remove')
          .click()

        cy.contains('#modal-remove-events-index', tituloModalExclusao)
          .should('be.visible')

        cy.contains('strong', 'Biblioteca')
          .should('be.visible')

        cy.contains('#modal-remove-events-index-msg_title', texto1ModalExclusao)
          .should('be.visible')

        cy.contains('#modal-remove-events-index-msg_title', texto2ModalExclusao)
          .should('be.visible')
        break
      default:
        throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso', 'catalogo' ou 'biblioteca'`)
    }

    // Confirma a exclusão
    switch(tipoConteudo) {
      case 'trilha':
      case 'curso':
        cy.contains('button.chakra-button', 'Excluir')
          .click({ force: true })
        break
      case 'catalogo':
      case 'biblioteca':
        cy.get('#modal-remove-events-index-confirmed')
          .click({ force: true })
        break
      default:
        throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso', 'catalogo' ou 'biblioteca'`)
    }

    // Valida a mensagem de sucesso da exclusão
    if (nomeConteudo) {
      if (tipoConteudo === 'catalogo' || tipoConteudo === 'biblioteca') {
        cy.contains('.flash.notice', msgSucessoExclusao, { timeout: TIMEOUT_PADRAO })
          .should('be.visible')
      } else {
        cy.contains('.chakra-alert__desc', msgSucessoExclusao, { timeout: TIMEOUT_PADRAO })
          .should('be.visible')
      }  
    }

    // Verifica se o conteúdo foi excluído e não é exibido na listagem
    if (tipoConteudo === 'biblioteca') {
      cy.get(`td.event-name[title='${nomeConteudo}']`, { timeout: TIMEOUT_PADRAO })
        .should('not.exist')
    } else {
      cy.get(seletor, { timeout: TIMEOUT_PADRAO })
        .should('not.exist')
    }
  }

  // Verifica se foi fornecido um nome de conteúdo específico
  if (nomeConteudo) {
    excluirConteudoEspecifico(nomeConteudo, tipoConteudo)
  } else if (listaConteudos.length !== 0) {
    // Itera sobre a lista de conteúdos e exclui cada um deles
    listaConteudos.forEach((conteudo) => {
      excluirConteudoEspecifico(conteudo, tipoConteudo)
    })
  } else {
    cy.log('Nenhum conteúdo foi fornecido para exclusão.')
  }
})

/** DOCUMENTAÇÃO:
 * @name addAtividadeConteudo
 * 
 * @description
 * Comando personalizado para adicionar uma atividade em um conteúdo específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Define um timeout padrão de 5 segundos.
 * 2. Clica no conteúdo específico, conforme o tipo de conteúdo, para adicionar a atividade.
 * 3. Valida a exibição da página de adição de atividades.
 * 
 * @param {String} nomeConteudo - O nome do conteúdo a ser acessado para adicionar a atividade.
 * @param {String} tipoConteudo - O tipo do conteúdo a ser acessado (e.g., 'trilha', 'curso', 'catalogo', 'biblioteca'). 
 * Este parâmetro influencia no seletor utilizado para encontrar o conteúdo na listagem e na página carregada para adição de atividades.
 * 
 * @example
 * cy.addAtividadeConteudo('Nome do Conteúdo', 'tipoConteudo')
 * 
 * @throws {Error} - Se o tipo de conteúdo informado não for 'trilha', 'curso', 'catalogo' ou 'biblioteca'.
 * 
 * @observations
 * Este comando não realiza o preenchimento dos campos da atividade. Para isso, @see preencherDadosAtividade
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
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
        .click( {force: true} )
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

/** DOCUMENTAÇÃO:
 * @name salvarAtividades
 * 
 * @description
 * Comando personalizado para salvar uma atividade e validar a mensagem de sucesso.
 * 
 * @actions
 * 1. Salva a atividade.
 * 2. Valida a exibição da mensagem de sucesso após o salvamento.
 * 
 * @example
 * cy.salvarAtividades()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
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

/** DOCUMENTAÇÃO:
 * @name editarAtividade
 * 
 * @description
 * Comando personalizado para editar a atividade específica de um conteúdo específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Define um timeout padrão de 5 segundos.
 * 2. Edita a atividade específica com base no nome do conteúdo e da atividade.
 * 3. Valida a exibição da página de edição da atividade.
 * 
 * @param {String} nomeConteudo - O nome do conteúdo a ser editado. Este nome é utilizado para encontrar o conteúdo na listagem e 
 * clicar no botão de edição da atividade.
 * @param {String} nomeAtividade - O nome da atividade a ser editada. Este nome é utilizado para encontrar a atividade na listagem e 
 * clicar no botão de edição.
 * 
 * @example
 * cy.editarAtividade('Nome do Conteúdo', 'Nome da Atividade')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('editarAtividade', (nomeConteudo, nomeAtividade) => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPgEdicao } = labels.atividades

  // Edita a atividade
  cy.contains('li.dd-item', nomeAtividade)
    .find('.dd-edit')
    .should('be.visible')
    .click( )

  // Validar se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: TIMEOUT_PADRAO})
    .should('be.visible')

  cy.contains('#breadcrumb', `> ${nomeConteudo}`)
    .should('be.visible')

  cy.contains('.detail_title', tituloPgEdicao)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name preencherDadosAtividade
 * 
 * @description
 * Comando personalizado para preencher os campos da atividade.
 * 
 * @actions
 * 1. Preenche os campos da atividade com base nos dados fornecidos.
 * 2. Limpa os campos antes de preencher, se a opção 'limpar' for verdadeira.
 * 
 * @param {Object} dados - Os dados a serem preenchidos nos campos da atividade.
 * @param {Object} opcoes - Habilita ou não a limpeza dos campos antes do seu preenchimento.
 * 
 * @example
 * cy.preencherDadosAtividade({ nome: 'Nome da Atividade', descricao: 'Descrição da Atividade' }, { limpar: true })
 * ou
 * cy.preencherDadosAtividade(dados, { limpar: false })
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'preencherCampo' da classe 'formAtividades'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('preencherDadosAtividade', (dados, opcoes = { limpar: false }) => {
  const formulario = new formAtividades()
  
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
})

/** DOCUMENTAÇÃO:
 * @name validarDadosAtividade
 * 
 * @description
 * Comando personalizado para validar os dados de uma atividade.
 * 
 * @actions
 * 1. Valida os campos da atividade com base nos dados fornecidos.
 * 
 * @param {Object} dados - Os dados a serem validados nos campos da atividade.
 * 
 * @example
 * cy.validarDadosAtividade({ nome: 'Nome da Atividade', descricao: 'Descrição da Atividade' })
 * ou
 * cy.validarDadosAtividade(dados)
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'validarCampo' da classe 'formAtividades'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('validarDadosAtividade', (dados) => {
  const formulario = new formAtividades()

  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

/** DOCUMENTAÇÃO:
 * @name verificarProcessamentoScorm
 * 
 * @description
 * Comando personalizado para verificar a conclusão do processamento de um arquivo Scorm.
 * 
 * @actions
 * 1. Verifica se o arquivo Scorm ainda está sendo processado.
 * 2. Aguarda um tempo de 5 segundos e verifica novamente.
 * 3. Se o arquivo Scorm ainda estiver sendo processado, recarrega a página e tenta novamente.
 * 4. Caso contrário, exibe a mensagem de sucesso.
 * 
 * @param {String} nomeConteudo - O nome do conteúdo que contém o arquivo Scorm a ser processado.
 * @param {String} nomeAtividade - O nome da atividade que contém o arquivo Scorm a ser processado.
 * @param {String} tipoConteudo - O tipo do conteúdo que contém o arquivo Scorm a ser processado (e.g., 'trilha', 'curso', 'catalogo', 'biblioteca').
 * 
 * @example
 * cy.verificarProcessamentoScorm('Nome do Conteúdo', 'Nome da Atividade', 'tipoConteudo')
 * ou
 * cy.verificarProcessamentoScorm(nomeConteudo, nomeAtividade, tipoConteudo)
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('verificarProcessamentoScorm', (nomeConteudo, nomeAtividade, tipoConteudo) => {
  const TIMEOUT_PADRAO = 5000

  function verificar() {
    cy.get('body').then($body => {
      if ($body.find('span[style="font-style:italic;opacity:50%;font-size:11px;margin-left:20px;color:black;"]:contains("Processando scorm")').length > 0) {
        cy.log('Arquivo Scorm ainda está sendo processado. Aguardando...')

        cy.wait(TIMEOUT_PADRAO)

        if (tipoConteudo === 'trilha' || tipoConteudo === 'curso') {
          cy.acessarPgListaConteudos()
        } else if (tipoConteudo === 'catalogo') {
          cy.acessarPgCatalogo()
        } else if (tipoConteudo === 'biblioteca') {
          cy.acessarPgBiblioteca()
        }
        
        cy.addAtividadeConteudo(nomeConteudo, tipoConteudo)
        cy.editarAtividade(nomeConteudo, nomeAtividade)

        // Chama o comando customizado novamente para verificar o estado do processamento
        cy.verificarProcessamentoScorm(nomeConteudo, nomeAtividade, tipoConteudo)
      } else {
        cy.log('Arquivo Scorm processado com sucesso.')
      }
    })
  }

  verificar()
})

/** DOCUMENTAÇÃO
 * @name excluirAtividade
 * 
 * @description
 * Comando personalizado para excluir uma atividade específica, confirmae a exclusão e salvar a atualização da estrutura de atividades.
 * 
 * @actions
 * 1. Clica no botão de exclusão da atividade específica.
 * 2. Confirma a exclusão da atividade (arquivo enviado para lixeira).
 * 3. Salva a atualização da estrutura de atividades.
 * 4. Verifica se a atividade foi excluída.
 * 
 * @param {String} nomeAtividade - O nome da atividade a ser excluída.
 * 
 * @example
 * cy.excluirAtividade('Nome da Atividade')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('excluirAtividade', (nomeAtividade) => {
  cy.contains('li.dd-item', nomeAtividade)
    .find('.dd-delete')
    .should('be.visible')
    .click()

  // Confirma que a atividade foi enviada para lixeira
  cy.get('#deleted-list')
    .contains('li.dd-item', nomeAtividade)
    .should('be.visible')

  // Salva atualização da estrutura de atividades
  cy.salvarAtividades()

  // Confirma que a atividade foi excluída
  cy.get('li.dd-item')
    .contains(nomeAtividade)
    .should('not.exist')
})

/** DOCUMENTAÇÃO:
 * @name criarCursoViaApi
 * 
 * @description
 * Comando personalizado para criar um curso via API.
 * 
 * @actions
 * 1. Realiza uma requisição do tipo POST para a criação de um curso.
 * 2. Valida se o status da requisição é 201 (Created).
 * 3. Caso a requisição falhe, tenta novamente até 3 vezes.
 * 
 * @param {Object} body - O corpo da requisição para a criação do curso.
 * @param {Number} attempt - A tentativa atual de criação do curso.
 * 
 * @example
 * cy.criarCursoViaApi(body, attempt)
 * 
 * @throws {Error} - Se a requisição falhar após 3 tentativas.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add("criarCursoViaApi", (body, attempt = 1) => {
  const url = `/api/v1/o/${Cypress.env('orgId')}/courses`
  
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
      cy.criarCursoViaApi(body, attempt + 1)
    } else if (response.status !== 201) {
      cy.log(`Tentativa ${attempt}: Falha na requisição. Não foi possível criar o catálogo`)
      throw new Error(`Erro na criação do catálogo: ${response}`)
    } else {
      expect(response.status).to.eq(201)
    }
  })
})

/** DOCUMENTAÇÃO:
 * @name preencherDadosBiblioteca
 * 
 * @description
 * Comando personalizado para preencher os campos de uma biblioteca.
 * 
 * @actions
 * 1. Preenche os campos da biblioteca com base nos dados fornecidos.
 * 
 * @param {Object} conteudo - Os dados a serem preenchidos nos campos da biblioteca.
 * 
 * @example
 * cy.preencherDadosBiblioteca({ nome: 'Nome da Biblioteca', descricao: 'Descrição da Biblioteca' })
 * ou
 * cy.preencherDadosBiblioteca(dados)
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'preencherCampo' da classe 'formBiblioteca'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('preencherDadosBiblioteca', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formBiblioteca()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

/** DOCUMENTAÇÃO:
 * @name validarDadosBiblioteca
 * 
 * @description
 * Comando personalizado para validar os dados de uma biblioteca.
 * 
 * @actions
 * 1. Valida os campos da biblioteca com base nos dados fornecidos.
 * 
 * @param {Object} conteudo - Os dados a serem validados nos campos da biblioteca.
 * 
 * @example
 * cy.validarDadosBiblioteca({ nome: 'Nome da Biblioteca', descricao: 'Descrição da Biblioteca' })
 * ou
 * cy.validarDadosBiblioteca(dados)
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'validarCampo' da classe 'formBiblioteca'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('validarDadosBiblioteca', (conteudo) => {
  const formulario = new formBiblioteca()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

/** DOCUMENTAÇÃO:
 * @name listaConteudo
 * 
 * @description
 * Comando personalizado para listar os conteúdos de um tipo específico.
 * 
 * @actions
 * 1. Verifica se existem conteúdos do tipo especificado.
 * 2. Lista os conteúdos encontrados.
 * 
 * @param {String} tipoConteudo - O tipo de conteúdo a ser listado (e.g., 'trilha', 'curso', 'catalogo', 'biblioteca').
 * @param {Array} listaConteudos - A lista de conteúdos encontrados.
 * 
 * @example
 * cy.listaConteudo('trilha', listaConteudos)
 * 
 * @throws {Error} - Se o tipo de conteúdo informado não for 'trilha', 'curso', 'catalogo' ou 'biblioteca'.
 * 
 * @author Karla Daiany
 * @version 1.0.1
 * @since 1.0.0
 */
Cypress.Commands.add('listaConteudo', (tipoConteudo, listaConteudos) => {
  const labels = Cypress.env('labels')

  let seletor = ''
  
  switch(tipoConteudo) {
    case 'trilha':
      seletor = `tr[tag-name] span:contains("Trilha")`
      break
    case 'curso':
      seletor = `tr[tag-name] span:contains("Curso")` 
      break
    case 'catalogo':
      seletor = `tr.event-row`
      break
    case 'biblioteca':
      seletor = `tr.event-row td.event-name` 
      break
    default:
      throw new Error(`Tipo de conteúdo inválido: ${tipoConteudo}. Utilize 'trilha', 'curso', 'catalogo' ou 'biblioteca'`)
  }

  cy.get('body').then(($body) => {
    if ($body.find(seletor).length > 0) {
      cy.get(seletor)
        .each(($el) => {
          let nomeConteudo = ''

          if (tipoConteudo === 'trilha' || tipoConteudo === 'curso') {
            const $tr = $el.closest('tr')
            if (!listaConteudos.includes($tr.attr('tag-name'))) {
              nomeConteudo = $tr.attr('tag-name')
              listaConteudos.push(nomeConteudo)
            }
          } else {
            nomeConteudo = $el.text().trim()
            listaConteudos.push(nomeConteudo)
          }
        })
        .then(() => {
          cy.log(listaConteudos.join(', '))
        })
    } else {
      cy.log('Nenhum conteúdo encontrado.')
    }
  })
})

/** DOCUMENTAÇÃO:
 * @name criarBibliotecaDefault
 * 
 * @description
 * Comando personalizado para criar uma biblioteca com dados padrão.
 * 
 * @actions
 * 1. Adiciona um conteúdo do tipo 'biblioteca'.
 * 2. Preenche os campos da biblioteca com os dados padrão.
 * 3. Salva a biblioteca.
 * 
 * @param {String} nomeConteudo - O nome da biblioteca a ser criada.
 * 
 * @example
 * cy.criarBibliotecaDefault('Nome da Biblioteca')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('criarBibliotecaDefault', (nomeConteudo) => {
  const dados = {
    nome: nomeConteudo,
    descricao: 'Descrição teste para criação de biblioteca',
  }

  const tipoConteudo = 'biblioteca'

  cy.addConteudo(tipoConteudo)
  cy.preencherDadosBiblioteca(dados, { limpar: true } )
  cy.salvarConteudo(dados.nome, tipoConteudo)
})

/** DOCUMENTAÇÃO:
 * @name criarTrilhaDefault
 * 
 * @description
 * Comando personalizado para criar uma trilha com dados padrão.
 * 
 * @actions
 * 1. Adiciona um conteúdo do tipo 'trilha'.
 * 2. Preenche os campos da trilha com os dados padrão.
 * 3. Salva a trilha.
 * 
 * @param {String} nomeConteudo - O nome da trilha a ser criada.
 * 
 * @example
 * cy.criarTrilhaDefault('Nome da Trilha')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('criarTrilhaDefault', (nomeConteudo) => {
  const dados = {
    nome: nomeConteudo,
    descricao: 'Descrição teste para criação de trilha',
  }

  const tipoConteudo = 'trilha'

  cy.addConteudo(tipoConteudo)
  cy.preencherDadosConteudo(dados, { limpar: true } )
  cy.salvarConteudo(dados.nome, tipoConteudo)
})

/** DOCUMENTAÇÃO:
 * @name preencherDadosQuestionario
 * 
 * @description
 * Comando personalizado para preencher os campos de um questionário.
 * 
 * @actions
 * 1. Preenche os campos do questionário com base nos dados fornecidos.
 * 2. Limpa os campos antes de preencher, se a opção 'limpar' for verdadeira.
 * 
 * @param {Object} dados - Os dados a serem preenchidos nos campos do questionário.
 * @param {Object} opcoes - Habilita ou não a limpeza dos campos antes do seu preenchimento.
 * 
 * @example
 * cy.preencherDadosQuestionario({ nome: 'Nome do Questionário', descricao: 'Descrição do Questionário' }, { limpar: true })
 * ou
 * cy.preencherDadosQuestionario(dados, { limpar: false })
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'preencherCampo' da classe 'formQuestionarios'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('preencherDadosQuestionario', (dados, opcoes = { limpar: false }) => {
  const formulario = new formQuestionarios()
  
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
})

/** DOCUMENTAÇÃO:
 * @name validarDadosQuestionario
 * 
 * @description
 * Comando personalizado para validar os dados de um questionário.
 * 
 * @actions
 * 1. Valida os campos do questionário com base nos dados fornecidos.
 * 
 * @param {Object} dados - Os dados a serem validados nos campos do questionário.
 * 
 * @example
 * cy.validarDadosQuestionario({ nome: 'Nome do Questionário', descricao: 'Descrição do Questionário' })
 * ou
 * cy.validarDadosQuestionario(dados)
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'validarCampo' da classe 'formQuestionarios'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('validarDadosQuestionario', (dados) => {
  const formulario = new formQuestionarios()

  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

/** DOCUMENTAÇÃO:
 * @name listaQuestionarios
 * 
 * @description
 * Comando personalizado para listar os questionários.
 * 
 * @actions
 * 1. Verifica se existem questionários.
 * 2. Lista os questionários encontrados.
 * 
 * @param {Array} listaQuestionarios - A lista de questionários encontrados.
 * 
 * @example
 * cy.listaQuestionarios(listaQuestionarios)
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */ 
Cypress.Commands.add('listaQuestionarios', (listaQuestionarios) => {
  const seletor = '.question-list-row'

  cy.get('body').then(($body) => {
    if ($body.find('tbody').length > 0) {
      if ($body.find(seletor).length > 0) {
        cy.get(seletor)
          .each(($el) => {
            let nomeQuestionario = ''
            nomeQuestionario = $el.closest('tr').attr('name')
            listaQuestionarios.push(nomeQuestionario)
          })
          .then(() => {
            cy.log(listaQuestionarios.join(', '))
          })
      } else {
        cy.log('Nenhum questionário encontrado.')
      }
    } else {
      cy.log('O elemento <tbody> não foi encontrado.')
    }
  })
})

/** DOCUMENTAÇÃO:
 * @name excluirQuestionarios
 * 
 * @description
 * Comando personalizado para excluir questionários específicos ou uma lista de questionários.
 * 
 * @actions
 * 1. Clica no botão de exclusão do questionário específico ou de cada questionário da lista.
 * 2. Confirma a exclusão do questionário.
 * 3. Valida a mensagem de sucesso após a exclusão.
 * 4. Verifica se o questionário foi excluído.
 * 
 * @param {String} nomeQuestionario - O nome do questionário a ser excluído.
 * @param {Array} listaQuestionario - A lista de questionários a serem excluídos.
 * 
 * @example
 * cy.excluirQuestionarios('Nome do Questionário', listaQuestionario)
 * ou
 * cy.excluirQuestionarios(nomeQuestionario, [])
 * ou
 * cy.excluirQuestionarios('', listaQuestionario)
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('excluirQuestionarios', (nomeQuestionario, listaQuestionario) => {
  // Define o timeout para validação das páginas
  const TIMEOUT_PADRAO = 8000
  
  // Acessa o arquivo de labels
  const labels = Cypress.env('labels')

  // Inicializa formulário de questionários
  const formulario = new formQuestionarios()

  // Função para excluir um questionário específico
  const excluirQuestionarioEspecifico = (nomeQuestionario) => {
    const { tituloModalExclusao, textoModalExclusao, msgSucessoExclusao } = labels.questionario

    const seletor = `tr[name='${nomeQuestionario}']`

    // Clica em 'Excluir'
    cy.get(seletor, { timeout: TIMEOUT_PADRAO })
      .wait(2000)
      .find(formulario.elementos.btnExcluir.seletor, formulario.elementos.btnExcluir.title)
      .click({ force: true })

    // Valida o título do modal de exclusão
    cy.get('.panel-header h3')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.equal(tituloModalExclusao)
      })

    // Valida o texto do modal de exclusão
    cy.get('.panel-header strong')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.equal(textoModalExclusao)
      })    
      
    // Confirma a exclusão
    cy.contains(formulario.elementos.btnConfirmarExclusao.seletor, 'Confirmar')
      .click({ force: true })

    // Valida a mensagem de sucesso da exclusão
    cy.contains('.flash.notice', msgSucessoExclusao, { timeout: TIMEOUT_PADRAO })
      .should('be.visible')

    // Verifica se o questionário foi excluído e não é exibido na listagem
    cy.get(seletor, { timeout: TIMEOUT_PADRAO })
      .should('not.exist')
  }

  // Verifica se foi fornecido um nome de conteúdo específico
  if (nomeQuestionario) {
    excluirQuestionarioEspecifico(nomeQuestionario)
  } else if (listaQuestionario.length !== 0) {
    // Itera sobre a lista de conteúdos e exclui cada um deles
    listaQuestionario.forEach((questionario) => {
      excluirQuestionarioEspecifico(questionario)
    })
  } else {
    cy.log('Nenhum conteúdo foi fornecido para exclusão.')
  }
})

/** DOCUMENTAÇÃO:
 * @name salvarQuestionario
 * 
 * @description
 * Comando personalizado para salvar um questionário e validar a mensagem de sucesso.
 * 
 * @actions
 * 1. Salva o questionário.
 * 2. Valida a exibição da mensagem de sucesso após o salvamento.
 * 3. Verifica se o questionário foi salvo.
 * 
 * @param {String} nomeQuestionario - O nome do questionário a ser salvo.
 * 
 * @example
 * cy.salvarQuestionario('Nome do Questionário')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('salvarQuestionario', (nomeQuestionario) => {
  const TIMEOUT_PADRAO = 5000
  const formulario = new formQuestionarios()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.questionario

  // Salva o questionário
  formulario.salvarQuestionario()

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso)
    .should('be.visible')

  // Verifica se o questionário foi salvo
  cy.get(`tr[name='${nomeQuestionario}']`, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name editarQuestionario
 * 
 * @description
 * Comando personalizado para editar um questionário específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Edita o questionário específico.
 * 2. Valida a exibição da página de edição do questionário.
 * 
 * @param {String} nomeQuestionario - O nome do questionário a ser editado.
 * 
 * @example
 * cy.editarQuestionario('Nome do Questionário')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('editarQuestionario', (nomeQuestionario) => {
  const TIMEOUT_PADRAO = 5000
  const formulario = new formQuestionarios()
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPgEdicao } = labels.questionario

  // Edita o questionário
  cy.get(`tr[name='${nomeQuestionario}']`, { timeout: TIMEOUT_PADRAO })
    .find(formulario.elementos.btnEditar.seletor, formulario.elementos.btnEditar.title)
    .click()

  // Validar se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  cy.contains('.detail_title', tituloPgEdicao)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name criarQuestionarioDefault
 * 
 * @description
 * Comando personalizado para criar um questionário com dados padrão.
 * 
 * @actions
 * 1. Acessa a página de questionários.
 * 2. Adiciona um questionário.
 * 3. Preenche com o nome (conforme o parâmetro fornecido) e salva o questionário.
 * 
 * @param {String} nomeQuestionario - O nome do questionário a ser criado.
 * 
 * @example
 * cy.criarQuestionarioDefault('Nome do Questionário')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('criarQuestionarioDefault', (nomeQuestionario) => {
  const formulario = new formQuestionarios()
  
  const dados = {
    nome: nomeQuestionario
  }

  cy.acessarPgQuestionarios()
  formulario.addQuestionario()
  cy.preencherDadosQuestionario(dados)
  cy.salvarQuestionario(dados.nome)
})

/** DOCUMENTAÇÃO:
 * @name acessarPerguntasQuestionario
 * 
 * @description
 * Comando personalizado para acessar as perguntas de um questionário específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Acessa as perguntas do questionário específico.
 * 2. Valida a exibição da página de perguntas do questionário.
 * 
 * @param {String} nomeQuestionario - O nome do questionário a ser acessado.
 * 
 * @example
 * cy.acessarPerguntasQuestionario('Nome do Questionário')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('acessarPerguntasQuestionario', (nomeQuestionario) => {
  const TIMEOUT_PADRAO = 5000
  const form = new formQuestionarios()
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg } = labels.perguntas

  // Acessa as perguntas do questionário
  cy.get(`tr[name='${nomeQuestionario}']`, { timeout: TIMEOUT_PADRAO })
    .find(form.elementos.btnPerguntas.seletor)
    .click()

  // Valida se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  cy.contains('#breadcrumb', `> ${nomeQuestionario}`, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  cy.contains('.detail_title', tituloPg)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name preencherDadosPergunta
 * 
 * @description
 * Comando personalizado para preencher os campos de uma pergunta.
 * 
 * @actions
 * 1. Preenche os campos da pergunta com base nos dados fornecidos.
 * 2. Limpa os campos antes de preencher, se a opção 'limpar' for verdadeira.
 * 
 * @param {Object} conteudo - Os dados a serem preenchidos nos campos da pergunta.
 * @param {Object} opcoes - Habilita ou não a limpeza dos campos antes do seu preenchimento.
 * 
 * @example
 * cy.preencherDadosPergunta({ descricao: 'Descrição da Pergunta', tipo: 'Tipo da Pergunta' }, { limpar: true })
 * ou
 * cy.preencherDadosPergunta(dados, { limpar: false })
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'preencherCampo' da classe 'formPerguntas'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('preencherDadosPergunta', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formPerguntas()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

/** DOCUMENTAÇÃO:
 * @name validarDadosPergunta
 * 
 * @description
 * Comando personalizado para validar os dados de uma pergunta.
 * 
 * @actions
 * 1. Valida os campos da pergunta com base nos dados fornecidos.
 * 
 * @param {Object} conteudo - Os dados a serem validados nos campos da pergunta.
 * 
 * @example
 * cy.validarDadosPergunta({ descricao: 'Descrição da Pergunta', tipo: 'Tipo da Pergunta' })
 * ou
 * cy.validarDadosPergunta(dados)
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'validarCampo' da classe 'formPerguntas'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('validarDadosPergunta', (conteudo) => {
  const formulario = new formPerguntas()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

/** DOCUMENTAÇÃO:
 * @name salvarPergunta
 * 
 * @description
 * Comando personalizado para salvar uma pergunta, validar a mensagem de sucesso e verificar se a pergunta foi salva.
 * 
 * @actions
 * 1. Salva a pergunta.
 * 2. Confirma a mensagem de sucesso após o salvamento.
 * 3. Verifica se a pergunta foi salva.
 * 
 * @param {String} descPergunta - A descrição da pergunta a ser salva.
 * @param {Number} index - O índice da pergunta a ser salva.
 * 
 * @example
 * cy.salvarPergunta('Descrição da Pergunta', 1)
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('salvarPergunta', (descPergunta, index) => {
  const TIMEOUT_PADRAO = 5000
  const formulario = new formPerguntas()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.perguntas

  // Salva a pergunta
  cy.get(`tr[id='question-new-${index}']`, { timeout: TIMEOUT_PADRAO })
    .parent('tbody')
    .within(() => {
      formulario.salvar()
    })  

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso)
    .should('be.visible')

  // Verifica se a pergunta foi salva
  cy.get(`tr[title*='${descPergunta.slice(0, 1000)}']`, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name excluirPergunta
 * 
 * @description
 * Comando personalizado para excluir uma pergunta específica, confirmar a exclusão e verificar se a pergunta foi excluída.
 * 
 * @actions
 * 1. Clica no botão de exclusão da pergunta específica.
 * 2. Valida o modal de confirmação da exclusão.
 * 3. Confirma a exclusão da pergunta.
 * 4. Valida a mensagem de sucesso após a exclusão.
 * 5. Verifica se a pergunta foi excluída.
 * 
 * @param {String} descPergunta - A descrição da pergunta a ser excluída.
 * 
 * @example
 * cy.excluirPergunta('Descrição da Pergunta')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('excluirPergunta', (descPergunta) => {
  const TIMEOUT_PADRAO = 5000
  const formulario = new formPerguntas()

  cy.get(`tr[title*='${descPergunta.slice(0, 30)}']`, { timeout: TIMEOUT_PADRAO })
    .parent('tbody')
    .within(() => {
      formulario.remover()
    
      // Lida com a mensagem de confirmação do navegador
      cy.on('window:confirm', (message) => {
        expect(message).to.equal('Você tem certeza que deseja remover esta pergunta?')
        return true
    })
  })

  // Verifica se a pergunta foi excluída e não é exibida na listagem
  cy.get(`tr[title*='${descPergunta.slice(0, 30)}']`, { timeout: TIMEOUT_PADRAO })
    .should('not.exist')
})

/** DOCUMENTAÇÃO:
 * @name expandirPergunta
 * 
 * @description
 * Comando personalizado para expandir uma pergunta específica.
 * 
 * @actions
 * 1. Clica no botão de expansão da pergunta específica.
 * 
 * @param {String} descPergunta - A descrição da pergunta a ser expandida.
 * 
 * @example
 * cy.expandirPergunta('Descrição da Pergunta')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('expandirPergunta', (descPergunta) => {
  const TIMEOUT_PADRAO = 5000
  const formulario = new formPerguntas()

  cy.get(`tr[title*='${descPergunta.slice(0, 30)}']`, { timeout: TIMEOUT_PADRAO })
    .parent('tbody')
    .within(() => {
      formulario.expandirPergunta()
    })  
})

/** DOCUMENTAÇÃO:
 * @name salvarEdicaoPergunta
 * 
 * @description
 * Comando personalizado para salvar a edição de uma pergunta, validar a mensagem de sucesso e verificar se a pergunta foi salva.
 * 
 * @actions
 * 1. Salva a edição da pergunta.
 * 2. Confirma a mensagem de sucesso após o salvamento.
 * 3. Verifica se a pergunta foi salva.
 * 
 * @param {String} oldDescPergunta - A descrição antiga da pergunta a ser editada.
 * @param {String} newDescPergunta - A nova descrição da pergunta a ser salva.
 * 
 * @example
 * cy.salvarEdicaoPergunta('Descrição da Pergunta', 'Nova Descrição da Pergunta')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('salvarEdicaoPergunta', (oldDescPergunta, newDescPergunta) => {
  const TIMEOUT_PADRAO = 5000
  const formulario = new formPerguntas()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.perguntas

  // Salva a pergunta
  cy.get(`tr[title*='${oldDescPergunta.slice(0, 30)}']`, { timeout: TIMEOUT_PADRAO })
    .parent('tbody')
    .within(() => {
      formulario.salvar()
    })  

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso)
    .should('be.visible')

  // Verifica se a pergunta foi salva
  cy.get(`tr[title*='${newDescPergunta.slice(0, 1000)}']`, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name preencherDadosUsuario
 * 
 * @description
 * Comando personalizado para preencher os campos de um usuário.
 * 
 * @actions
 * 1. Preenche os campos do usuário com base nos dados fornecidos.
 * 2. Limpa os campos antes de preencher, se a opção 'limpar' for verdadeira.
 * 
 * @param {Object} conteudo - Os dados a serem preenchidos nos campos do usuário.
 * @param {Object} opcoes - Habilita ou não a limpeza dos campos antes do seu preenchimento.
 * 
 * @example
 * cy.preencherDadosUsuario({ nome: 'Nome do Usuário', email: 'Email do Usuário' }, { limpar: true })
 * ou
 * cy.preencherDadosUsuario(dados, { limpar: false })
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'preencherCampo' da classe 'formUsuarios'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('preencherDadosUsuario', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formUsuarios()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

/** DOCUMENTAÇÃO:
 * @name validarDadosUsuario
 * 
 * @description
 * Comando personalizado para validar os dados de um usuário.
 * 
 * @actions
 * 1. Valida os campos do usuário com base nos dados fornecidos.
 * 
 * @param {Object} conteudo - Os dados a serem validados nos campos do usuário.
 * 
 * @example
 * cy.validarDadosUsuario({ nome: 'Nome do Usuário', email: 'Email do Usuário' })
 * ou
 * cy.validarDadosUsuario(dados)
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'validarCampo' da classe 'formUsuarios'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('validarDadosUsuario', (conteudo) => {
  const formulario = new formUsuarios()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

/** DOCUMENTAÇÃO:
 * @name salvarUsuario
 * 
 * @description
 * Comando personalizado para salvar um usuário, validar a mensagem de sucesso e verificar se o usuário foi salvo.
 * 
 * @actions
 * 1. Salva o usuário.
 * 2. Confirma a mensagem de sucesso após o salvamento.
 * 3. Verifica se o usuário foi salvo.
 * 
 * @param {String} nomeUsuario - O nome do usuário a ser salvo.
 * 
 * @example
 * cy.salvarUsuario('Nome do Usuário')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('salvarUsuario', (nomeUsuario) => {
  const TIMEOUT_PADRAO = 5000
  const formulario = new formUsuarios()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.usuarios

  // Salva o usuário
  formulario.salvar()

  // Confirma a mensagem de sucesso
  cy.contains('.flash.success', msgSucesso, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  // Verifica se o usuário foi criado com sucesso
  cy.get('.student-name')
    .invoke('text')
    .should('contain', nomeUsuario)
})

/** DOCUMENTAÇÃO:
 * @name excluirUsuario
 * 
 * @description
 * Comando personalizado para excluir um usuário específico, confirmar a exclusão e verificar se o usuário foi excluído.
 * 
 * @actions
 * 1. Clica no botão de exclusão do usuário específico.
 * 2. Valida o modal de confirmação da exclusão.
 * 3. Confirma a exclusão do usuário.
 * 4. Valida a mensagem de sucesso após a exclusão.
 * 5. Verifica se o usuário foi excluído.
 * 
 * @param {String} nomeUsuario - O nome do usuário a ser excluído.
 * 
 * @example
 * cy.excluirUsuario('Nome do Usuário')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('excluirUsuario', (nomeUsuario) => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { tituloModalExclusao, texto1ModalExclusao, texto2ModalExclusao, btnConfirmar, msgSucessoExclusao } = labels.usuarios

  cy.contains('tr.professional-row', nomeUsuario)
    .within(() => {
      cy.get('a.professional-delete')
        .click()
    })

  // Valida o título do modal de exclusão
  cy.get('#professional-exclusion .panel-header h3')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).to.equal(tituloModalExclusao)
    })

  // Valida o texto do modal de exclusão
  cy.get('#professional-exclusion .panel-header strong')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).to.equal('Usuário')
    })

  cy.get('#professional-exclusion .panel-header p span.name')
    .should('have.text', nomeUsuario)

  cy.get('.are_you_sure_destroy')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).to.equal(texto1ModalExclusao)
    })

  cy.get('.row.inactivate-option.hidden p')
    .invoke('text')
    .then((text) => {
      expect(text.trim()).to.equal(texto2ModalExclusao)
    })

  // Confirma a exclusão do usuário
  cy.get('.remove-professional')
    .contains(btnConfirmar)
    .click()

  // Valida a mensagem de sucesso após a exclusão
  cy.contains('.flash.success', msgSucessoExclusao, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  // Verifica se o usuário foi excluído e não é exibido na listagem
  cy.get('tr.professional-row')
    .contains(nomeUsuario, { timeout: TIMEOUT_PADRAO })
    .should('not.exist')
})

/** DOCUMENTAÇÃO:
 * @name editarUsuario
 * 
 * @description
 * Comando personalizado para editar um usuário específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Edita o usuário específico.
 * 2. Valida a exibição da página de edição do usuário.
 * 
 * @param {String} nomeUsuario - O nome do usuário a ser editado.
 * 
 * @example
 * cy.editarUsuario('Nome do Usuário')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('editarUsuario', (nomeUsuario) => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPgEdicao } = labels.usuarios

  // Edita o usuário
  cy.contains('tr.professional-row', nomeUsuario)
    .within(() => {
      cy.get('a.professional-edit')
        .click()
    })

  // Valida se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  cy.contains('.detail_title', tituloPgEdicao)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name excluirUsuarioViaApi
 * 
 * @description
 * Comando personalizado para excluir usuários via API.
 * 
 * @actions
 * 1. Obtém a listagem de usuários.
 * 2. Exclui todos os usuários, exceto o usuário administrador.
 * 
 * @example
 * cy.excluirUsuarioViaApi()
 * 
 * @throws {Error} - Se ocorrer algum erro ao obter a listagem de usuários ou ao excluir um usuário.
 * 
 * @obs
 * Deve ser configurado o ID do usuário administrador no arquivo 'cypress.config.json' no 'env', campo 'userAdminId'.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('excluirUsuarioViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/students`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(`Erro ao obter a listagem de usuários: ${response}`)
    }

    const students = response.body.students
    students.forEach((student) => {
      if (student.id !== Cypress.env('userAdminId')) {
        cy.request({
          method: 'DELETE',
          url: `/api/v1/o/${Cypress.env('orgId')}/students/${student.id}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${Cypress.env('token')}`
          },
        }).then((deleteResponse) => {
          if (deleteResponse.status !== 200) {
            throw new Error(`Erro ao excluir o usuário: ${deleteResponse}`)
          }
        })
      }
    })
  })
})

/** DOCUMENTAÇÃO:
 * @name acessarPgUsuarios
 * 
 * @description
 * Comando personalizado para acessar a página de usuários e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Acessa a página de usuários.
 * 2. Valida a exibição da página de usuários.
 * 
 * @example
 * cy.acessarPgUsuarios()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('acessarPgUsuarios', () => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.usuarios

  cy.visit(`/o/${Cypress.env('orgId')}/users`)
  
  // Valida se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name addUsuario
 * 
 * @description
 * Comando personalizado para adicionar um usuário e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Clica no botão de adicionar usuário.
 * 2. Valida a exibição da página de adicionar usuário.
 * 
 * @example
 * cy.addUsuario()
 * 
 * @obs
 * Esta comando não cria um usuário, apenas acessa a página de adicionar usuário. Para criar um usuário 
 * @see preencherDadosUsuario
 * @see salvarUsuario
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('addUsuario', () => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPgAdicionar } = labels.usuarios

  cy.get('#add-professional')
    .click()

  // Valida se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  cy.contains('.detail_title', tituloPgAdicionar, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name cancelarFormularioUsuario
 * 
 * @description
 * Comando para cancelar o formulário de usuário e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Clica no botão de cancelar.
 * 2. Valida a exibição da página de usuários.
 * 
 * @example
 * cy.cancelarFormularioUsuario()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('cancelarFormularioUsuario', function() {
  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.usuarios

  // Cancelar
  cy.contains('#professional-cancel', 'Cancelar')
    .should('be.visible')
    .click()

  // Validar redirecionamento
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: 5000})
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name resetSenhaUsuario
 * 
 * @description
 * Comando personalizado para resetar a senha de um usuário.
 * 
 * @actions
 * 1. Clica em 'Alterar senha' do usuário específico.
 * 2. Valida o título do modal de alteração de senha.
 * 3. Insere senhas incompatíveis e valida a mensagem de senhas diferentes.
 * 4. Insere senhas compatíveis e valida a mensagem de senhas iguais.
 * 5. Confirma a alteração de senha do usuário.
 * 6. Valida a mensagem de sucesso após a alteração de senha.
 * 
 * @param {String} nomeUsuario - O nome do usuário a ter a senha resetada.
 * @param {String} senha - A nova senha do usuário.
 * 
 * @example
 * cy.resetSenhaUsuario('Nome do Usuário', 'Nova Senha')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('resetSenhaUsuario', function(nomeUsuario, senha) {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { tituloAlterarSenha, aguardandoSenha, senhasDiferentes, senhasIguais, msgSucessoSenha } = labels.usuarios

  // Clica em 'Alterar senha'
  cy.contains('tr.professional-row', nomeUsuario)
  .within(() => {
    cy.get('a.user-password-change')
      .click()
  })

  // Valida o título do modal de alteração de senha
  cy.get('#user-password-change-modal .panel-header h3')
    .should('contain', tituloAlterarSenha)
    .and('contain', nomeUsuario)

  // Valida a mensagem de aguardando senha
  cy.get('#matching-passwords')
    .should('contain', aguardandoSenha)

  // Insere senhas incompatíveis
  cy.get('#user-password-change-modal #new-password')
    .type(senha)

  cy.get('#user-password-change-modal #confirm-password')
    .type('senha123')

  cy.get('#matching-passwords')
    .should('contain', senhasDiferentes)

  // Insere senhas compatíveis
  cy.get('#user-password-change-modal #confirm-password')
    .clear()
    .type(senha)

  cy.get('#matching-passwords')
    .should('contain', senhasIguais)

  // Confirma a alteração de senha do usuário
  cy.get('.green_btn[value="Salvar"]')
    .click()

  // Valida a mensagem de sucesso
  cy.contains('.flash.notice', msgSucessoSenha, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name inativarUsuario
 * 
 * @description
 * Comando personalizado para inativar um usuário específico.
 * 
 * @actions
 * 1. Clica no botão de inativar do usuário específico.
 * 2. Valida o título e texto do modal de inativação.
 * 3. Confirma a inativação do usuário.
 * 4. Valida a mensagem de sucesso após a inativação.
 * 5. Verifica se o usuário foi inativado.
 * 6. Verifica se os elementos de alteração de senha, edição e exclusão não estão visíveis.
 * 7. Verifica se o status do usuário é "Inativo".
 * 
 * @param {String} nomeUsuario - O nome do usuário a ser inativado.
 * 
 * @example
 * cy.inativarUsuario('Nome do Usuário')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('inativarUsuario', function(nomeUsuario) {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { tituloModalInativar, textoModalInativar, msgSucessoInativar } = labels.usuarios

  cy.contains('tr.professional-row', nomeUsuario)
    .find('.professional-progress')
    .then(($progressCell) => {
      const title = $progressCell.attr('title')
      if (title === 'Inativar') {
        cy.wrap($progressCell)
          .find('a.button-inactive')
          .click()
      }
    })

  // Valida o título do modal de inativação
  cy.get('#user-inactive-modal .inactiv_or_active')
    .should('have.text', tituloModalInativar)

  // Valida o texto do modal de inativação
  cy.get('#user-inactive-modal .are_you_sure_destroy')
    .should('have.text', textoModalInativar)

  // Confirma a inativação do usuário
  cy.get('.inactive-professional')
    .contains('Inativar')
    .click()

  // Valida a mensagem de sucesso após a inativação
  cy.contains('.flash.notice', msgSucessoInativar, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  // Verifica se o usuário foi inativado
  cy.contains('tr.professional-row', nomeUsuario)
    .within(() => {
      cy.get('.professional-progress')
        .should('have.attr', 'title', 'Ativar')
        .find('a.button-inactive')
        .should('be.visible')

      // Verifica se o elemento de alteração de senha não está visível
      cy.get('a.user-password-change', { timeout: TIMEOUT_PADRAO})
        .should('not.exist')

      // Verifica se o elemento de edição não está visível
      cy.get('td.professional-progress[title="Editar"]', { timeout: TIMEOUT_PADRAO})
        .find('a.professional-edit')
        .should('not.exist')

      // Verifica se o elemento de exclusão não está visível
      cy.get('td.professional-progress[title="Excluir"]', { timeout: TIMEOUT_PADRAO})
        .find('a.professional-delete')
        .should('not.exist')

      // Verifica se o status do usuário é "Inativo"
      cy.get('td.ellipsis', { timeout: TIMEOUT_PADRAO})
        .should('contain', 'Inativo')
    })
})

/** DOCUMENTAÇÃO:
 * @name ativarUsuario
 * 
 * @description
 * Comando personalizado para ativar um usuário específico.
 * 
 * @actions
 * 1. Clica no botão de ativar do usuário específico.
 * 2. Valida o título e texto do modal de ativação.
 * 3. Confirma a ativação do usuário.
 * 4. Valida a mensagem de sucesso após a ativação.
 * 5. Verifica se o usuário foi ativado.
 * 6. Verifica se os elementos de alteração de senha, edição e exclusão estão visíveis.
 * 7. Verifica se o status do usuário é "Ativo".
 * 
 * @param {String} nomeUsuario - O nome do usuário a ser ativado.
 * 
 * @example
 * cy.ativarUsuario('Nome do Usuário')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('ativarUsuario', function(nomeUsuario) {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { tituloModalAtivar, textoModalAtivar, msgSucessoAtivar } = labels.usuarios

  cy.contains('tr.professional-row', nomeUsuario)
    .find('.professional-progress')
    .then(($progressCell) => {
      const title = $progressCell.attr('title')
      if (title === 'Ativar') {
        cy.wrap($progressCell)
          .find('a.button-inactive')
          .click()
      }
  })

  // Valida o título do modal de ativação
  cy.get('#user-inactive-modal .inactiv_or_active')
    .should('have.text', tituloModalAtivar)

  // Valida o texto do modal de ativação
  cy.get('#user-inactive-modal .are_you_sure_destroy')
    .should('have.text', textoModalAtivar)

  // Confirma a ativação do usuário
  cy.get('.inactive-professional')
    .contains('Ativar')
    .click()

  // Valida a mensagem de sucesso após a ativação
  cy.contains('.flash.notice', msgSucessoAtivar, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  // Verifica se o usuário foi ativado
  cy.contains('tr.professional-row', nomeUsuario)
    .within(() => {
      cy.get('.professional-progress')
        .should('have.attr', 'title', 'Inativar')
        .find('a.button-inactive')
        .should('be.visible')

      // Verifica se o elemento de alteração de senha não está visível
      cy.get('a.user-password-change', { timeout: TIMEOUT_PADRAO})
        .should('be.visible')

      // Verifica se o elemento de edição não está visível
      cy.get('td.professional-progress[title="Editar"]', { timeout: TIMEOUT_PADRAO})
        .find('a.professional-edit')
        .should('be.visible')

      // Verifica se o elemento de exclusão não está visível
      cy.get('td.professional-progress[title="Excluir"]', { timeout: TIMEOUT_PADRAO})
        .find('a.professional-delete')
        .should('be.visible')

      // Verifica se o status do usuário é "Ativo"
      cy.get('td.ellipsis', { timeout: TIMEOUT_PADRAO})
        .should('contain', 'Ativo')
    })
})

/** DOCUMENTAÇÃO:
 * @name addParticipanteConteudo
 * 
 * @description
 * Comando personalizado para acessar a página de inscrição de um participante em um conteúdo específico e validar o 
 * redirecionamento correto da página.
 * 
 * @actions
 * 1. Clica em 'Opções' do conteúdo específico.
 * 2. Clica em 'Inscrição' do conteúdo específico.
 * 3. Valida a exibição da página de inscrição de participante.
 * 
 * @param {String} nomeConteudo - O nome do conteúdo a ser inscrito.
 * 
 * @example
 * cy.addParticipanteConteudo('Nome do Conteúdo')
 * 
 * @obs
 * Esta comando não inscreve um participante, apenas acessa a página de inscrição de participante. Para inscrever um participante
 * @see preencherDadosParticipante
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('addParticipanteConteudo', function(nomeConteudo, tipoConteudo) {
  const TIMEOUT_PADRAO = 5000
  
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg, breadcrumbTrilha } = labels.participantes

  // Clica em 'Opções' e 'Atividades'
  cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: TIMEOUT_PADRAO})
    .find('svg[aria-label="Options"]')
    .click()

  cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: TIMEOUT_PADRAO})
    .contains('button', 'Inscrição')
    .click( {force: true} )

  // Validar se a página foi carregada corretamente
  switch (tipoConteudo) {
    case 'Trilha':
      cy.contains('#page-breadcrumb', breadcrumbTrilha, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
      break
    case 'curso':
      cy.contains('#page-breadcrumb', breadcrumb, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
      break
  }

  cy.contains('.detail_title', tituloPg)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name preencherDadosParticipante
 * 
 * @description
 * Comando personalizado para preencher os campos de um participante.
 * 
 * @actions
 * 1. Preenche os campos do participante com base nos dados fornecidos.
 * 2. Limpa os campos antes de preencher, se a opção 'limpar' for verdadeira.
 * 
 * @param {Object} conteudo - Os dados a serem preenchidos nos campos do participante.
 * @param {Object} opcoes - Habilita ou não a limpeza dos campos antes do seu preenchimento.
 * 
 * @example
 * cy.preencherDadosParticipante({ nome: 'Nome do Participante', email: 'Email do Participante' }, { limpar: true })
 * ou
 * cy.preencherDadosParticipante(dados, { limpar: false })
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'preencherCampo' da classe 'formUsuarios'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('preencherDadosParticipante', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formParticipantes()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

/** DOCUMENTAÇÃO:
 * @name validarDadosParticipante
 * 
 * @description
 * Comando personalizado para validar os dados de um participante.
 * 
 * @actions
 * 1. Valida os campos do participante com base nos dados fornecidos.
 * 
 * @param {Object} conteudo - Os dados a serem validados nos campos do participante.
 * 
 * @example
 * cy.validarDadosParticipante({ nome: 'Nome do Participante', email: 'Email do Participante' })
 * ou
 * cy.validarDadosParticipante(dados)
 * 
 * @throws {Error} - Se o campo informado não for válido. // Existente no método 'validarCampo' da classe 'formUsuarios'
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('validarDadosParticipante', (conteudo) => {
  const formulario = new formParticipantes()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

/** DOCUMENTAÇÃO:
 * @name salvarNovoParticipante
 * 
 * @description
 * Comando personalizado para salvar um novo participante, validar a mensagem de sucesso e verificar se o participante foi salvo.
 * 
 * @actions
 * 1. Salva o participante.
 * 2. Confirma a mensagem de sucesso após o salvamento.
 * 3. Verifica se o participante foi salvo.
 * 
 * @param {String} nomeUsuario - O nome do participante a ser salvo.
 * 
 * @example
 * cy.salvarNovoParticipante('Nome do Participante')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('salvarNovoParticipante', (nomeParticipante) => {
  const TIMEOUT_PADRAO = 5000
  const formulario = new formParticipantes()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.participantes

  // Salva o usuário
  formulario.salvar()

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  // Verifica se o usuário foi criado com sucesso
  cy.contains('td', nomeParticipante, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name salvarEdicaoParticipante
 * 
 * @description
 * Comando personalizado para salvar a edição de um participante, validar a mensagem de sucesso e 
 * verificar se o participante foi salvo de acordo com o status informado.
 * 
 * @actions
 * 1. Salva a edição de um participante.
 * 2. Confirma a mensagem de sucesso na atualização após o salvamento conforme o status informado.
 * 3. Verifica se o participante foi salvo no status informado.
 * 
 * @param {String} nomeUsuario - O nome do participante a ser salvo.
 * 
 * @example
 * cy.salvarEdicaoParticipante('Nome do Participante', 'Confirmados')
 * 
 * @author Karla Daiany
 * @version 1.1.0
 * @since 1.0.0
 */
Cypress.Commands.add('salvarEdicaoParticipante', (nomeParticipante, status = 'Confirmados') => {
  const TIMEOUT_PADRAO = 5000
  const formulario = new formParticipantes()
  const labels = Cypress.env('labels')
  const { msgSucessoEdicao } = labels.participantes

  // Salva o usuário
  formulario.salvar()

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucessoEdicao, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  // Mapeia a aba esperada para o seletor correspondente
  const abaSeletor = {
    'Confirmados': '#confirmed',
    'Pendentes': '#pending',
    'Cancelados': '#canceled'
  }

  // Clica na aba correspondente em que o participante foi editado
  switch (status) {
    case 'Confirmados':
      cy.abaConfirmados()
      break
    case 'Pendentes':
      cy.abaPendentes()
      break
    case 'Cancelados':
      cy.abaCancelados()
      break
  }  

  // Verifica se o usuário foi editado com sucesso na aba esperada
  cy.get(abaSeletor[status])
    .contains('td', nomeParticipante, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name editarParticipante
 * 
 * @description
 * Comando personalizado para editar um participante específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Edita o participante específico.
 * 2. Valida a exibição da página de edição do participante.
 * 
 * @param {String} nomeUsuario - O nome do participante a ser editado.
 * 
 * @example
 * cy.editarParticipante('Nome do Participante')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('editarParticipante', (nomeParticipante, tipoConteudo) => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { breadcrumbEdicao, tituloPgEdicao, breadcrumbTrilha } = labels.participantes

  // Edita o usuário
  cy.contains('td', nomeParticipante) 
  .parent('tr') 
  .within(() => {
    cy.get('.participant_edit') 
      .find('a') 
      .contains('Editar') 
      .click()
  })
  
  // Valida se a página foi carregada corretamente [obs. adicionado tipoConteudo devido BUG no breadcrumb da trilha]
  switch (tipoConteudo) {
    case 'trilha':
      cy.contains('#page-breadcrumb', breadcrumbTrilha, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
      break
    case 'curso':
      cy.contains('#page-breadcrumb', breadcrumbEdicao, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
      break
  }

  cy.contains('.detail_title', tituloPgEdicao)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name addParticipante
 * 
 * @description
 * Comando personalizado para clicar no botão de 'Adicionar' na tela de inscrição.
 * 
 * @actions
 * 1. Clica no botão de 'Adicionar' participante.
 * 2. Valida a exibição da página de inscrição de participante.
 * 
 * @example
 * cy.addParticipante()
 * 
 * @obs
 * Esta comando não cria um participante, apenas clica na opção de 'Adicionar' participante. Para criar um participante 
 * @see preencherDadosUsuario
 * @see salvarNovoUsuario
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('addParticipante', (tipoConteudo) => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { breadcrumbAdicionar, tituloPgAdicionar, breadcrumbTrilha } = labels.participantes

  cy.get('.new_participant_btn')
    .click()

  // Valida se a página foi carregada corretamente [obs. adicionado tipoConteudo devido BUG no breadcrumb da trilha]
  switch (tipoConteudo) {
    case 'trilha':
      cy.contains('#page-breadcrumb', breadcrumbTrilha, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
      break
    case 'curso':
      cy.contains('#page-breadcrumb', breadcrumbAdicionar, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
      break
  }

  cy.contains('.detail_title', tituloPgAdicionar, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name alteraStatus
 * 
 * @description
 * Comando personalizado para alterar o status de um ou mais participantes com base no status informado
 * e validar a alteração do status.
 * 
 * @actions
 * 1. Seleciona o(s) participante(s) desejado(s), marcando a caixa de seleção.
 * 2. Clica no botão correspondente ao status desejado.
 * 3. Insere o motivo de cancelamento, se o status for 'Cancelado'.
 * 4. Confirma a alteração do status.
 * 5. Valida a mensagem de sucesso após a alteração do status.
 * 6. Navega para a aba correspondente ao status.
 * 7. Valida o status do(s) participante(s).
 * 
 * @param {String|Array} nomeParticipantes - O nome do(s) participante(s) a ter o status alterado.
 * @param {String} status - O status a ser alterado (e.g., 'Confirmado', 'Pendente', 'Cancelado').
 * 
 * @example
 * cy.alteraStatus('Nome do Participante', 'Confirmado')
 * ou
 * cy.alteraStatus(['Nome do Participante 1', 'Nome do Participante 2'], 'Pendente')
 * 
 * @throws {Error} - Se o status informado não for válido.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('alteraStatus', function(nomeParticipantes, status) {
  const TIMEOUT_PADRAO = 20000
  const labels = Cypress.env('labels')
  const { msgAlteraConfirmado, msgAlteraPendente, msgAlteraCancelado, msgSucessoAlteraStatus } = labels.participantes

  // Verifica se nomeParticipantes é uma string ou um array
  const participantes = Array.isArray(nomeParticipantes) ? nomeParticipantes : [nomeParticipantes]

  // Seleciona o(s) participante(s)
  participantes.forEach(nomeParticipante => {
    cy.contains('td', nomeParticipante)
      .parent('tr')
      .within(() => {
        cy.get('.participant_check input[type="checkbox"]')
        .check({ force: true })
      })
  })

  // Clica no botão correspondente ao status desejado
  switch (status) {
    case 'Confirmado':
      cy.get('.link-confirm')
        .first()
        .should('be.visible')
        .and('not.be.disabled')
        .click()
      break
    case 'Pendente':
      cy.get('.pending_participant')
        .first()
        .should('be.visible')
        .and('not.be.disabled')
        .click()
      break
    case 'Cancelado':
      cy.get('.link-danger.cancel_participant')
        .first()
        .should('be.visible')
        .and('not.be.disabled')
        .click()
      // Insere motivo de cancelamento e confirma
      cy.get('#reject_message').type('Motivo de cancelamento: Teste Cypress')
      cy.get('#simplemodal-data').find('p button.green_btn.confirmations').click()
      break
    default:
      throw new Error(`Status inválido: ${status}`)
  }
  // Valida apenas a última mensagem de sucesso (por isso a inclusão do wait de 3 segundos)
  // switch (status) {
  //   case 'Confirmado':
  //     cy.contains('.flash.success', msgAlteraConfirmado, { timeout: TIMEOUT_PADRAO }).should('be.visible')
  //     break
  //   case 'Pendente':
  //     cy.contains('.flash.success', msgAlteraPendente, { timeout: TIMEOUT_PADRAO }).should('be.visible')
  //     break
  //   case 'Cancelado':
  //     cy.contains('.flash.success', msgAlteraCancelado, { timeout: TIMEOUT_PADRAO }).should('be.visible')
  //     break
  // }
  cy.wait(2000)
  cy.contains('.flash.success', msgSucessoAlteraStatus, { timeout: TIMEOUT_PADRAO }).should('be.visible')

  // Medida de contorno para atualizar a página e validar o status do(s) participante(s)
  cy.addParticipante()
  cy.cancelarFormularioParticipante()

  // Navega para a aba correspondente ao status
  switch (status) {
    case 'Confirmado':
      cy.abaConfirmados()
      break
    case 'Pendente':
      cy.abaPendentes()
      break
    case 'Cancelado':
      cy.abaCancelados()
      break
  }

  // Valida o status do(s) participante(s)
  participantes.forEach(nomeParticipante => {
    let statusSeletor = {
      'Confirmado': 'confirmed',
      'Pendente': 'pending',
      'Cancelado': 'canceled'
    }

    cy.get(`#${statusSeletor[status]}`)
      .find('td', nomeParticipante, { timeout: TIMEOUT_PADRAO })
      .should('be.visible')
  })
})

/** DOCUMENTAÇÃO:
 * @name abaConfirmados
 * 
 * @description
 * Comando personalizado para clicar na aba 'Confirmados'.
 * 
 * @actions
 * 1. Clica na aba 'Confirmados'.
 * 
 * @example
 * cy.abaConfirmados()
 * 
 * @obs
 * Este comando é utilizado para navegar entre as abas de status dos participantes.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('abaConfirmados', function() {
  cy.contains('.tab_selector', 'Confirmados')
    .click()
})

/** DOCUMENTAÇÃO:
 * @name abaPendentes
 * 
 * @description
 * Comando personalizado para clicar na aba 'Pendentes'.
 * 
 * @actions
 * 1. Clica na aba 'Pendentes'.
 * 
 * @example
 * cy.abaPendentes()
 * 
 * @obs
 * Este comando é utilizado para navegar entre as abas de status dos participantes.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('abaPendentes', function() {
  cy.contains('.tab_selector', 'Pendentes')
    .click()
})

/** DOCUMENTAÇÃO:
 * @name abaCancelados
 * 
 * @description
 * Comando personalizado para clicar na aba 'Cancelados'.
 * 
 * @actions
 * 1. Clica na aba 'Cancelados'.
 * 
 * @example
 * cy.abaCancelados()
 * 
 * @obs
 * Este comando é utilizado para navegar entre as abas de status dos participantes.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('abaCancelados', function() {
  cy.contains('.tab_selector', 'Cancelados')
    .click()
})

/** DOCUMENTAÇÃO:
 * @name cancelarFormularioParticipante
 * 
 * @description
 * Comando personalizado para cancelar o formulário de participante e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Clica no botão 'Cancelar' para cancelar a criação/edição de determinado participante.
 * 2. Valida a exibição da página correta após o cancelamento.
 * 
 * @example
 * cy.cancelarFormularioParticipante()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('cancelarFormularioParticipante', function(tipoConteudo) {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg, breadcrumbTrilha } = labels.participantes

  // Cancelar
  cy.contains('a.btn.btn-cancel', 'Cancelar')
    .should('be.visible')
    .as('btnCancelar')

  cy.get('@btnCancelar', { timeout: TIMEOUT_PADRAO })
    .click()

  // Validar redirecionamento [obs. adicionado tipoConteudo devido BUG no breadcrumb da trilha]
  switch (tipoConteudo) {
    case 'trilha':
      cy.contains('#page-breadcrumb', breadcrumbTrilha, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
      break
    case 'curso':
      cy.contains('#page-breadcrumb', breadcrumb, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
      break
  }

  cy.contains('.detail_title', tituloPg, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name criarUsuarioViaApi
 * 
 * @description
 * Comando personalizado para criar um usuário via API com base nos dados fornecidos (body).
 * 
 * @actions
 * 1. Cria um usuário via API com base nos dados fornecidos.
 * 2. Valida se o status da requisição é 201.
 * 
 * @param {Object} body - Os dados a serem enviados na requisição.
 * @param {Number} attempt - A tentativa de criação do usuário.
 * 
 * @example
 * cy.criarUsuarioViaApi({ nome: 'Nome do Usuário', email: 'Email do Usuário' })
 * 
 * @throws {Error} - Se a requisição falhar após 3 tentativas.
 * 
 * @obs
 * O comando tentará criar o usuário até 3 vezes. Caso a requisição falhe após 3 tentativas, uma mensagem 
 * de erro será exibida.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('criarUsuarioViaApi', function(body) {
  const url = `/api/v1/o/${Cypress.env('orgId')}/students`

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
      cy.criarUsuarioViaApi(body, attempt + 1)
    } else if (response.status !== 201) {
      cy.log(`Tentativa ${attempt}: Falha na requisição. Não foi possível criar o catálogo`)
      throw new Error(`Erro na criação do catálogo: ${response}`)
    } else {
      expect(response.status).to.eq(201)
    }
  })
})

/** DOCUMENTAÇÃO:
 * @name associarParticipante
 * 
 * @description
 * Comando personalizado para associar um participante a um conteúdo (via cadastro de participante).
 * 
 * @actions
 * 1. Insere o e-mail do participante.
 * 2. Seleciona o participante correspondente clicando em 'Associar'.
 * 3. Salva a associação do participante.
 * 4. Valida a mensagem de sucesso após a associação.
 * 
 * @param {String} emailParticipante - O e-mail do participante a ser associado.
 * @param {String} nomeParticipante - O nome do participante a ser associado (nome e sobrenome).
 * 
 * @example
 * cy.associarParticipante('joaquim@gmail.com', 'Joaquim Silva')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('associarParticipante', function(emailParticipante, nomeParticipante) {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.participantes

  // Insere o e-mail e seleciona o participante correspondente clicando em 'Associar'
  cy.get('#event_participant_email')
    .type(emailParticipante)
    .then(() => {
      cy.get('#email-list')
        .should('be.visible')
        .contains('.participantName', nomeParticipante)
        .parents('li')
        .find('a[id^="undefined"]')
        .contains('Associar')
        .click()
    })

  // Salva a associação do participante
  cy.salvarNovoParticipante(nomeParticipante)

  // Valida a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name alterarStatusTodosParticipantes
 * 
 * @description
 * Comando personalizado para alterar o status de todos os participantes com base no status atual 
 * e no novo status informado. Validando se os participantes foram alterados com sucesso.
 * 
 * @actions
 * 1. Clica na aba correspondente ao status atual.
 * 2. Seleciona todos os participantes conforme a aba do status atual.
 * 3. Clica no botão correspondente ao status desejado.
 * 4. Insere o motivo de cancelamento, se o status for 'Cancelado'.
 * 5. Confirma a alteração do status.
 * 6. Valida a mensagem de sucesso após a alteração do status.
 * 7. Navega para a aba correspondente ao novo status.
 * 8. Valida o novo status do(s) participante(s).
 * 
 * @param {String} status - O status atual dos participantes (e.g., 'Confirmado', 'Pendente', 'Cancelado').
 * @param {String} novoStatus - O novo status dos participantes (e.g., 'Confirmado', 'Pendente', 'Cancelado').
 * @param {Array} listaParticipantes - A lista de participantes a ter o status alterado.
 * 
 * @example
 * cy.alterarStatusTodosParticipantes('Confirmado', 'Pendente', ['Nome do Participante 1', 'Nome do Participante 2'])
 * 
 * @throws {Error} - Se o status informado não for válido.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('alterarStatusTodosParticipantes', function(status, novoStatus, listaParticipantes) {
  const TIMEOUT_PADRAO = 20000
  const labels = Cypress.env('labels')
  const { msgAlteraConfirmado, msgAlteraPendente, msgAlteraCancelado, msgSucessoAlteraStatus } = labels.participantes

  // Clica na aba correspondente ao status atual
  switch(status) {
    case 'Confirmado':
      cy.get('#confirmed')
        .click()
      break
    case 'Pendente':
      cy.get('#pending')
        .click()
      break
    case 'Cancelado':
      cy.get('#canceled')
        .click()
      break
    default:
      throw new Error(`Status inválido: ${status}`)
  }

  // Seleciona todos os participantes conforme a aba do status atual
  switch(status) {
    case 'Confirmado':
      cy.get('#confirmed_top_all_participants')
        .click()
      break
    case 'Pendente':
      cy.get('#pending_top_all_participants')
        .click()
      break
    case 'Cancelado':
      cy.get('#canceled_top_all_participants')
        .click()
      break
    default:
      throw new Error(`Status inválido: ${status}`)
  }  

  // Clica no botão correspondente ao status desejado
  switch (novoStatus) {
    case 'Confirmado':
      cy.get('.link-confirm')
        .first()
        .should('be.visible')
        .and('not.be.disabled')
        .click()
      break
    case 'Pendente':
      cy.get('.pending_participant')
        .first()
        .should('be.visible')
        .and('not.be.disabled')
        .click()
      break
    case 'Cancelado':
      cy.get('.link-danger.cancel_participant')
        .first()
        .should('be.visible')
        .and('not.be.disabled')
        .click()
      // Insere motivo de cancelamento e confirma
      cy.get('#reject_message').type('Motivo de cancelamento: Teste Cypress')
      cy.get('#simplemodal-data').find('p button.green_btn.confirmations').click()
      break
    default:
      throw new Error(`Status inválido: ${novoStatus}`)
  }

  // Valida apenas a última mensagem de sucesso (por isso a inclusão do wait de 3 segundos)
  // switch (novoStatus) {
  //   case 'Confirmado':
  //     cy.contains('.flash.success', msgAlteraConfirmado, { timeout: TIMEOUT_PADRAO }).should('be.visible')
  //     break
  //   case 'Pendente':
  //     cy.contains('.flash.success', msgAlteraPendente, { timeout: TIMEOUT_PADRAO }).should('be.visible')
  //     break
  //   case 'Cancelado':
  //     cy.contains('.flash.success', msgAlteraCancelado, { timeout: TIMEOUT_PADRAO }).should('be.visible')
  //     break
  // }
  cy.wait(2000)
  cy.contains('.flash.success', msgSucessoAlteraStatus, { timeout: TIMEOUT_PADRAO }).should('be.visible')

  // Medida de contorno para atualizar a página e validar o status do(s) participante(s)
  cy.addParticipante()
  cy.cancelarFormularioParticipante()

  // Navega para a aba correspondente ao novo status
  switch (novoStatus) {
    case 'Confirmado':
      cy.abaConfirmados()
      break
    case 'Pendente':
      cy.abaPendentes()
      break
    case 'Cancelado':
      cy.abaCancelados()
      break
  }

  // Valida o novo status do(s) participante(s)
  listaParticipantes.forEach(nomeParticipante => {
    let statusSeletor = {
      'Confirmado': 'confirmed',
      'Pendente': 'pending',
      'Cancelado': 'canceled'
    }

    cy.get(`#${statusSeletor[novoStatus]}`)
      .find('td', nomeParticipante, { timeout: TIMEOUT_PADRAO })
      .should('be.visible')
  })
})

Cypress.Commands.add('importarParticipante', function(arquivo) {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { msgUploadImportacao, msgImportacaoEmAndamento, msgImportacaoConcluida } = labels.participantes

  // Clica no botão 'Importar'
  cy.get('.import')
    .click()

  // Clica em 'Enviar arquivo'
  cy.get('#file-name-container')
    .contains('a', 'Enviar arquivo', { timeout: TIMEOUT_PADRAO })
    .click( { force: true } )

  // Seleciona o arquivo a ser importado
  cy.get('#file')
    .selectFile(`cypress/fixtures/${arquivo}`, { force: true })
    
  // Clica em 'Enviar'
  cy.get('#send_to_import')
    .click( { force: true } )

  // Valida a mensagem de sucesso do upload do arquivo
  cy.contains('.flash.success', msgUploadImportacao, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')

  // Valida modal de campos para importar
  cy.get('#imports-fields')
    .contains('h3', 'Campos para importar')

  // Seleciona as opções de telefone pessoal e celular
  cy.get('#importables_phone1')
    .select('Telefone pessoal')

  cy.get('#importables_cell_phone')
    .select('Celular')

  // Clica em 'Enviar'
  cy.get('#csv-settings-form')
    .find('div.field.fs3')
    .contains('button', 'Enviar')
    .click( { force: true } )

  // Valida a mensagem de sucesso após a importação
  cy.contains('.flash.success', msgImportacaoEmAndamento, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
})

Cypress.Commands.add('verificarImportacao', () => {
  const TIMEOUT_PADRAO = 5000

  function verificarStatus() {
    cy.get('#imports-list tbody tr:last-child td:nth-child(4)').then($cell => {
      const status = $cell.text().trim()
      cy.log(`Status da importação: ${status}`)

      if (status === 'Execução' || status === 'Pendente') {
        cy.log('Arquivo de importação ainda está sendo processado. Aguardando...')
        cy.get('#twygo-modal-close').click()
        cy.wait(TIMEOUT_PADRAO)
        cy.get('.import').click()
        verificarStatus()
      } else if (status === 'Concluído') {
        cy.log('Arquivo importado com sucesso.')
        cy.get('#twygo-modal-close').click()
      } else if (status === 'Erro') {
        throw new Error('Erro na importação do arquivo.')
      } else {
        throw new Error(`Status desconhecido: ${status}`)
      }
    })
  }

  cy.get('.import').click()
  verificarStatus()
})

/** DOCUMENTAÇÃO:
 * @name vincularInstrutor
 * 
 * @description
 * Comando personalizado para vincular um instrutor em um conteúdo
 * 
 * @actions
 * 1. Pesquisa pelo nome do Instrutor.
 * 2. Clica para buscar.
 * 3. Clica no botão de associar.
 * 4. Valida a associação.
 * 
 * @param {String} nomeInstrutor - Nome do instrutor a ser vinculado
 * 
 * @example
 * cy.vincularInstrutor(nomeInstrutor)
 * 
 * @see formInstrutor
 * 
 * @author Jadson
 * @version 1.0.0
 * @since 1.0.0 
 */
Cypress.Commands.add('vincularInstrutor', (nomeInstrutor) => {
  const formulario = new formInstrutor()

  formulario.associarInstrutor(nomeInstrutor)

})

Cypress.Commands.add('habilitarDesabilitarGestao', (nomeGestor) => {
  const formulario = new formGestor()

  formulario.alternarStatusGestao(nomeGestor)
})

/** DOCUMENTAÇÃO:
 * @name validarVinculoInstrutor
 * 
 * @description
 * Comando personalizado para validar se um instrutor foi vinculado corretamente ao conteúdo.
 * 
 * @actions
 * 1. Pesquisa pelo nome do Instrutor.
 * 2. Verifica se o nome está sendo exibido na tela.
 * 
 * @param {String} nomeInstrutor - Nome do instrutor a ser vinculado
 * 
 * @example
 * cy.validarVinculoInstrutor(nomeInstrutor)
 * 
 * @author Jadson
 * @version 1.0.0
 * @since 1.0.0 
 */
Cypress.Commands.add('validarVinculoInstrutor', (nomeInstrutor) => {
  cy.contains('.speaker_name', nomeInstrutor)
  .should('be.visible')
})

Cypress.Commands.add('validarRemocaoVinculoGestor', (nomeGestor) => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { msgSucessoRemocao } = labels.gestores

  cy.contains('.flash.success', msgSucessoRemocao, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
  
  cy.get(`td:contains('${nomeGestor}')`)
    .parents('tr')
    .find('.icon-check-circle.off')
})

Cypress.Commands.add('validarVinculoGestor', (nomeGestor) => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { msgSucessoVinculo } = labels.gestores

  cy.contains('.flash.success', msgSucessoVinculo, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
  
  cy.get(`td:contains('${nomeGestor}')`)
    .parents('tr')
    .find('.icon-check-circle.on')
})

Cypress.Commands.add('validarRemocaoGestor', (nomeGestor) => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { msgSucessoRemocao } = labels.gestores

  cy.contains('.flash.success', msgSucessoRemocao, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
  
  cy.get(`td:contains('${nomeGestor}')`)
    .parents('tr')
    .find('.icon-times-circle.off')
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name removerVinculoInstrutor
 * 
 * @description
 * Comando personalizado para remover a associação do instrutor em um conteúdo
 * 
 * @actions
 * 1. Pesquisa pelo nome do Instrutor.
 * 2. Clica para remover.
 * 3. Valida a remoção.
 * 
 * @param {String} nomeInstrutor - Nome do instrutor a ser excluído
 * 
 * @example
 * cy.excluirInstrutor(nomeInstrutor)
 * 
 * 
 * @author Jadson
 * @version 1.0.0
 * @since 1.0.0 
 */
Cypress.Commands.add('removerVinculoInstrutor', (nomeInstrutor) => {
  //Encontra o instrutor e clica para remover 
  cy.contains('.speaker_name', nomeInstrutor)
    .parents('div')
    .parents('div')
    .parents('tr')
    .find('a.name')
    .click()
})

/** DOCUMENTAÇÃO:
 * @name validarRemocaoVinculoInstrutor
 * 
 * @description
 * Comando personalizado para validar se um instrutor foi removido corretamente do conteúdo
 * 
 * @actions
 * 1. Pesquisa pelo nome do Instrutor.
 * 2. Verifica se o nome não está sendo exibido na tela.
 * 
 * @param {String} nomeInstrutor - Nome do instrutor a ser vinculado
 * 
 * @example
 * cy.validarRemocaoInstrutor(nomeInstrutor)
 * 
 * @author Jadson
 * @version 1.0.0
 * @since 1.0.0 
 */
Cypress.Commands.add('validarRemocaoVinculoInstrutor', (nomeInstrutor) => {
  cy.contains('.speaker_name', nomeInstrutor).should('not.exist')
})

/** DOCUMENTAÇÃO:
 * @name criarInstrutor
 * 
 * @description
 * Comando personalizado para criar um usuário instrutor via front.
 * 
 * @actions
 * 1. Loga na aplicação.
 * 2. Altera o perfil para administrador.
 * 3. Acessa a página de usuários.
 * 4. Clica para adicionar um novo usuário.
 * 5. Preenche os dados para criar um usuário Instrutor.
 * 6. Salva o formulário.
 * 
 * @param {String} nomeInstrutor - Nome do instrutor a ser criado
 * @param {String} sobrenomeInstrutor - Sobrenome do instrutor a ser criado
 * 
 * @example
 * cy.criarInstrutor(nomeInstrutor, sobrenomeInstrutor)
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('criarInstrutor', (nomeInstrutor, sobrenomeInstrutor) => {
  // Massa de dados
  let nome = nomeInstrutor
  let sobrenome = sobrenomeInstrutor
  let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

  const dados = {
      email: email,
      nome: nome,
      sobrenome: sobrenome,
      perfilInstrutor: true
  }

  cy.acessarPgUsuarios()
  cy.addUsuario()
  cy.preencherDadosUsuario(dados, { limpar: true })
  cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)
})

/** DOCUMENTAÇÃO:
 * @name instrutorConteudo
 * 
 * @description
 * Comando personalizado para acessar a página de instrutor um conteúdo específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Define um timeout padrão de 5 segundos.
 * 2. Acessa a opção de 'Instrutor' conforme cada tipo de conteúdo para iniciar o processo adição/remoção de instrutor.
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
 * Este comando não realiza a adição ou remoção de instrutores no conteúdo. Para isso, @see vincularInstrutor e @see excluirInstrutor 
 * 
 * @throws {Error} - Se o tipo de conteúdo informado não for 'trilha', 'curso'.
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('instrutorConteudo', (nomeConteudo) => {
  // Define o timeout padrão para validação das páginas

  // Acessa o arquivo de labels
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg } = labels.instrutores

  // Define o seletor para encontrar o conteúdo na listagem
  let seletor = ''
  
  seletor = `tr[tag-name='${nomeConteudo}']`    
  // Clica em 'Opções' e 'Instrutor'
  cy.get(seletor)
    .find('svg[aria-label="Options"]')
    .click()

  cy.get(seletor)
    .contains('button', 'Instrutor')
    .click({force: true})
  
  // Valida se a página foi carregada corretamente conforme o tipo de conteúdo
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')

  cy.contains('.detail_title', tituloPg)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name criarGestor
 * 
 * @description
 * Comando personalizado para criar um usuário gestor via front.
 * 
 * @actions
 * 1. Loga na aplicação.
 * 2. Altera o perfil para administrador.
 * 3. Acessa a página de usuários.
 * 4. Clica para adicionar um novo usuário.
 * 5. Preenche os dados para criar um usuário Gestor.
 * 6. Salva o formulário.
 * 
 * @param {String} nomeGestor - Nome do gestor a ser criado
 * @param {String} sobrenomeGestor - Sobrenome do gestor a ser criado
 * 
 * @example
 * cy.criarGestor(nome, sobrenome)
 * 
 * @author Jadson
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('criarGestor', (nomeGestor, sobrenomeGestor) => {
  // Massa de dados
  let nome = nomeGestor
  let sobrenome = sobrenomeGestor
  let email = fakerPT_BR.internet.email({ firstName: nome, lastName: sobrenome}).toLowerCase()

  const dados = {
      email: email,
      nome: nome,
      sobrenome: sobrenome,
      perfilGestor: true
  }

  cy.acessarPgUsuarios()
  cy.addUsuario()
  cy.preencherDadosUsuario(dados, { limpar: true })
  cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`)
})

/** DOCUMENTAÇÃO:
 * @name gestorConteudo
 * 
 * @description
 * Comando personalizado para acessar a página de gestor de turma de um conteúdo específico e validar o redirecionamento correto da página.
 * 
 * @actions
 * 1. Acessa a opção de 'Gestores de turma' conforme cada tipo de conteúdo para iniciar o processo de habilitar/desabilitar a gestão de turma.
 * 2. Valida a exibição da página de edição do conteúdo.
 * 
 * @param {String} nomeConteudo - O nome do conteúdo a ser editado. Este nome é utilizado para encontrar o conteúdo na listagem e clicar no botão de edição.
 * @param {String} tipoConteudo - O tipo do conteúdo a ser editado (e.g., 'trilha', 'curso', 'catalogo'). Este parâmetro influencia no seletor utilizado para 
 * encontrar o conteúdo na listagem e na página carregada para edição do conteúdo.
 * 
 * @example
 * cy.editarConteudo('Nome do Conteúdo', 'tipoConteudo')
 * 
 * @observations
 * Este comando não realiza a adição ou remoção de gestores no conteúdo. Para isso, @see alternarStatusGestao
 * @throws {Error} - Se o tipo de conteúdo informado não for 'trilha', 'curso'.
 * 
 * @author Jadson
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('gestorConteudo', (nomeConteudo) => {
  // Acessa o arquivo de labels
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg } = labels.gestores

  // Define o seletor para encontrar o conteúdo na listagem
  let seletor = ''
  
  seletor = `tr[tag-name='${nomeConteudo}']`    
  // Clica em 'Opções' e 'Gestores de turma'
  cy.get(seletor)
    .find('svg[aria-label="Options"]')
    .click()

  cy.get(seletor)
    .contains('button', 'Gestores de turma')
    .click({force: true})
  
  // Valida se a página foi carregada corretamente conforme o tipo de conteúdo
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')

  cy.contains('.detail_title', tituloPg)
    .should('be.visible')
})

/** DOCUMENTAÇÃO:
 * @name voltar
 * 
 * @description
 * Comando personalizado para clicar no botão de voltar existente em várias páginas.
 * 
 * @actions
 * 1. Localiza o botão voltar.
 * 2. Clica no botão voltar
 * 
 * @author Jadson
 * @version 1.0.0
 * @since 1.0.0
 */
Cypress.Commands.add('voltar', function() {
  // Localiza o e clica no botão de voltar
  cy.contains('.btn.btn-default.btn-back.waves-effect', 'Voltar')
    .click()  
})