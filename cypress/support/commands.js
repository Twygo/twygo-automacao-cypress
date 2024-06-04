import formConteudos from "./pageObjects/formConteudos"
import estruturaAtividades from "./pageObjects/estruturaAtividades"
import formAtividades from "./pageObjects/formAtividades"
import formBiblioteca from "./pageObjects/formBiblioteca"
import formQuestionarios from "./pageObjects/formQuestionarios"
import formPerguntas from "./pageObjects/formPerguntas"
import formUsuarios from "./pageObjects/formUsuarios"
import formParticipantes from "./pageObjects/formParticipantes"
import formConfigUsuario from "./pageObjects/formConfigUsuario"
import formInstrutor from "./pageObjects/formInstrutor"
import formGestor from "./pageObjects/formGestor"
import formAmbientesAdicionais from "./pageObjects/formAmbientesAdicionais"
import formConfigOrganizacao from "./pageObjects/formConfigOrganizacao"
import formTrial from "./pageObjects/formTrial"
import formConteudosAmbienteAdicional from "./pageObjects/formConteudosAmbienteAdicional"
<<<<<<< HEAD
import formIntegracoes from "./pageObjects/formIntegracoes"
=======
import formCobrancaAutomatica from "./pageObjects/formCobrancaAutomatica"
import formCuponsVouchers from "./pageObjects/formCuponsVouchers"
>>>>>>> b7e6a8b67b9daa0c4da5b387028c3390d97d41ea
import { fakerPT_BR } from "@faker-js/faker"
import 'cypress-real-events/support'
import moment from 'moment'

Cypress.Commands.add('loginTwygoAutomacao', (idioma = 'pt') => {
  const labels = Cypress.env('labels')[idioma]
  const { pgInicialAluno, btnProfile } = labels.configUsuario

  cy.visit('/users/login')

  cy.get('#user_email')
    .type(Cypress.env('login'))
  
  cy.get('#user_password')
    .type(Cypress.env('password'))

  cy.contains('button', 'Entrar')
    .should('be.visible')  
    .click()

  // Verificar se o login foi realizado com sucesso
  cy.contains('#page-breadcrumb', pgInicialAluno)
    .should('be.visible')

    switch (idioma) {
      case 'pt':
      case 'es':
        cy.contains('.name', Cypress.env('username'))
          .should('be.visible')
        break
      case 'en':
        const nomeCompleto = Cypress.env('username')
        const palavras = nomeCompleto.split(' ')

        const nome = palavras[0]
        const sobrenome = palavras.slice(1).join(' ')

        cy.contains('.name', `${sobrenome}, ${nome}`)
          .should('be.visible')
        break
      default:
        throw new Error(`Idioma inválido: ${idioma}. Utilize 'pt', 'en' ou 'es'`)
    }

  cy.contains('#btn-profile', btnProfile)
    .should('be.visible')
})

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

Cypress.Commands.add('acessarPgCatalogo', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/events/?tab=itens-portfolio`)

  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.conteudo.catalogo

  // Verificar se a página de catálogo foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

Cypress.Commands.add('acessarPgListaConteudos', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/events?tab=events`)

  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.conteudo.curso

  // Verificar se a página de lista de conteúdos foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

Cypress.Commands.add('acessarPgAmbientesAdicionais', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/additional_environments`)

  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.ambientesAdicionais

  // Verificar se a página de ambientes adicionais foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

Cypress.Commands.add('acessarPgBiblioteca', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/events/?tab=libraries`)

  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.conteudo.biblioteca

  // Verificar se a página da biblioteca foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

Cypress.Commands.add('acessarPgLogin', function() {
  cy.visit('/users/login')

  cy.title()
    .should('eq', `Login - ${Cypress.env('orgName')}`)
})

Cypress.Commands.add('acessarPgQuestionarios', function() {
  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.questionario

  cy.visit(`/o/${Cypress.env('orgId')}/question_lists`)

  // Verificar se a página de questionários foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

Cypress.Commands.add('acessarPgConfigOrganizacao', function(aba) {
  const formulario = new formConfigOrganizacao()
  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.configOrganizacao
  
  cy.visit(`/o/${Cypress.env('orgId')}/edit`)

  // Verificar se a página de configuração da organização foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
  
  if (aba) {
    switch (aba) {
      case 'dados':
        formulario.abaDados()
        break
      case 'customizacoes':
        formulario.abaCustomizacoes()
        break
      case 'certificado':
        formulario.abaCertificado()
        break
      case 'integracoes':
        formulario.abaIntegracoes()
        break
      case 'termos':
        formulario.abaTermos()
        break
      case 'urlWebhooks':
        formulario.abaUrlWebhooks()
        break
      default:
        throw new Error(`Aba inválida: ${aba}. Utilize 'dados', 'customizacoes', 'certificado', 'integracoes', 'termos' ou 'urlWebhooks'`)
    }
  }  
})

Cypress.Commands.add('acessarPgConfigCobrancaInscricao', function(aba) {
  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.cobrancaInscricao

  cy.visit(`/o/${Cypress.env('orgId')}/payments`)

  // Verificar se a página de configuração de cobrança de inscrição foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')

  cy.wait (2000)

  if (aba) {
    switch (aba) {
      case 'cobrancaAutomatica':
        formCobrancaAutomatica.abaCobrancaAutomatica()
        break
      case 'cuponsVouchers':
        formCuponsVouchers.abaCuponsVouchers()
        break
      case 'logs':
        // Não será validado neste momento
        break
      default:
        throw new Error(`Aba inválida: ${aba}. Utilize 'cobrancaAutomatica', 'cuponsVouchers' ou 'logs'`)
    }
  }
})

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

Cypress.Commands.add('excluirCatalogoViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/portfolio`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
    failOnStatusCode: false
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

Cypress.Commands.add('excluirCursoViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/courses?page=1&per_page=99999`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
    failOnStatusCode: false
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

Cypress.Commands.add('preencherDadosConteudo', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formConteudos()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

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

Cypress.Commands.add('editarConteudo', function(nomeConteudo, tipoConteudo) {
  // Define o timeout padrão para validação das páginas
  const timeoutPadrao = 5000

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
        cy.get(seletor, { timeout: timeoutPadrao})
          .find('svg[aria-label="Options"]')
          .click()

        cy.get(seletor, { timeout: timeoutPadrao})
          .contains('button', 'Editar')
          .click()
      break
    case 'catalogo':
        seletor = `tr.event-row[name='${nomeConteudo}']`
        // Clica em editar
        cy.get(seletor, { timeout: timeoutPadrao})
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
  cy.contains('#page-breadcrumb', breadcrumbEdicao, { timeout: timeoutPadrao})
    .should('be.visible')

  cy.contains('.detail_title', tituloPgEdicao, { timeout: timeoutPadrao})
    .should('be.visible')
})

Cypress.Commands.add('salvarConteudo', function(nomeConteudo, tipoConteudo) {
  // Define o timeout para validação das páginas
  const timeoutPadrao = 5000

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
  cy.contains('.flash.notice', msgSucesso, { timeout: timeoutPadrao })
    .should('be.visible')

  // Valida o redirecionamento
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao })
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
    cy.get(seletor, { timeout: timeoutPadrao })
      .should('be.visible')
      .should('have.length', 1)
  }
})

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

Cypress.Commands.add('excluirConteudo', function(nomeConteudo, tipoConteudo, listaConteudos = []) {
  // Define o timeout para validação das páginas
  const timeoutPadrao = 8000

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
        cy.get(seletor, { timeout: timeoutPadrao})
          .find('svg[aria-label="Options"]')
          .click()

        cy.get(seletor, { timeout: timeoutPadrao})
          .wait(2000)	
          .contains('button', 'Excluir')
          .click({ force: true })

        // Valida o modal de exclusão
        cy.contains('.chakra-modal__header', tituloModalExclusao, { timeout: timeoutPadrao })
          .should('be.visible')

        cy.contains('.chakra-text', nomeConteudo)
          .should('be.visible')

        cy.contains('.chakra-text', texto1ModalExclusao)
          .should('be.visible')
        break
      case 'curso':
        seletor = `tr[tag-name='${nomeConteudo}']`

        // Clica em 'Opções' e 'Excluir'
        cy.get(seletor, { timeout: timeoutPadrao })
          .find('svg[aria-label="Options"]')
          .click()

        cy.get(seletor, { timeout: timeoutPadrao })
          .wait(2000)
          .contains('button', 'Excluir')
          .click({ force: true })

        // Valida o modal de exclusão
        cy.contains('.chakra-modal__header', tituloModalExclusao, { timeout: timeoutPadrao })
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
        cy.get(seletor, { timeout: timeoutPadrao })
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
        cy.contains('.flash.notice', msgSucessoExclusao, { timeout: timeoutPadrao })
          .should('be.visible')
      } else {
        cy.contains('.chakra-alert__desc', msgSucessoExclusao, { timeout: timeoutPadrao })
          .should('be.visible')
      }  
    }

    // Verifica se o conteúdo foi excluído e não é exibido na listagem
    if (tipoConteudo === 'biblioteca') {
      cy.get(`td.event-name[title='${nomeConteudo}']`, { timeout: timeoutPadrao })
        .should('not.exist')
    } else {
      cy.get(seletor, { timeout: timeoutPadrao })
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

Cypress.Commands.add('addAtividadeConteudo', function(nomeConteudo, tipoConteudo) {
  const timeoutPadrao = 5000
  
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg } = labels.atividades

  let seletor = ''

  switch (tipoConteudo) {
    case 'trilha':
    case 'curso':
      seletor = `tr[tag-name='${nomeConteudo}']`    
      // Clica em 'Opções' e 'Atividades'
      cy.get(seletor, { timeout: timeoutPadrao})
        .find('svg[aria-label="Options"]')
        .click()

      cy.get(seletor, { timeout: timeoutPadrao})
        .contains('button', 'Atividades')
        .click( {force: true} )
      break
    case 'catalogo':
      seletor = `tr.event-row[name='${nomeConteudo}']`
      // Clica para expandir opções
      cy.get(seletor, { timeout: timeoutPadrao})
        .find('.div-table-arrow-down')
        .click()
      // Clica em 'Atividades'
      cy.get('#content-link', { timeout: timeoutPadrao})
        .click()
      break
    case 'biblioteca':
      seletor = `tr.event-name[title='${nomeConteudo}']`
      // Clica em 'Atividades'
      cy.contains('button', 'Atividades', { timeout: timeoutPadrao})
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
  const timeoutPadrao = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPgEdicao } = labels.atividades

  // Edita a atividade
  cy.contains('li.dd-item', nomeAtividade)
    .find('.dd-edit')
    .should('be.visible')
    .click( )

  // Validar se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao})
    .should('be.visible')

  cy.contains('#breadcrumb', `> ${nomeConteudo}`)
    .should('be.visible')

  cy.contains('.detail_title', tituloPgEdicao)
    .should('be.visible')
})

Cypress.Commands.add('preencherDadosAtividade', (dados, opcoes = { limpar: false }) => {
  const formulario = new formAtividades()
  
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
})

Cypress.Commands.add('validarDadosAtividade', (dados) => {
  const formulario = new formAtividades()

  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

Cypress.Commands.add('verificarProcessamentoScorm', (nomeConteudo, nomeAtividade, tipoConteudo) => {
  const timeoutPadrao = 5000

  function verificar() {
    cy.get('body').then($body => {
      if ($body.find('span[style="font-style:italic;opacity:50%;font-size:11px;margin-left:20px;color:black;"]:contains("Processando scorm")').length > 0) {
        cy.log('Arquivo Scorm ainda está sendo processado. Aguardando...')

        cy.wait(timeoutPadrao)

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

Cypress.Commands.add('preencherDadosBiblioteca', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formBiblioteca()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

Cypress.Commands.add('validarDadosBiblioteca', (conteudo) => {
  const formulario = new formBiblioteca()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

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

Cypress.Commands.add('preencherDadosQuestionario', (dados, opcoes = { limpar: false }) => {
  const formulario = new formQuestionarios()
  
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
})

Cypress.Commands.add('validarDadosQuestionario', (dados) => {
  const formulario = new formQuestionarios()

  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

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

Cypress.Commands.add('excluirQuestionarios', (nomeQuestionario, listaQuestionario) => {
  // Define o timeout para validação das páginas
  const timeoutPadrao = 8000
  
  // Acessa o arquivo de labels
  const labels = Cypress.env('labels')

  // Inicializa formulário de questionários
  const formulario = new formQuestionarios()

  // Função para excluir um questionário específico
  const excluirQuestionarioEspecifico = (nomeQuestionario) => {
    const { tituloModalExclusao, textoModalExclusao, msgSucessoExclusao } = labels.questionario

    const seletor = `tr[name='${nomeQuestionario}']`

    // Clica em 'Excluir'
    cy.get(seletor, { timeout: timeoutPadrao })
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
    cy.contains('.flash.notice', msgSucessoExclusao, { timeout: timeoutPadrao })
      .should('be.visible')

    // Verifica se o questionário foi excluído e não é exibido na listagem
    cy.get(seletor, { timeout: timeoutPadrao })
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

Cypress.Commands.add('salvarQuestionario', (nomeQuestionario) => {
  const timeoutPadrao = 5000
  const formulario = new formQuestionarios()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.questionario

  // Salva o questionário
  formulario.salvarQuestionario()

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso)
    .should('be.visible')

  // Verifica se o questionário foi salvo
  cy.get(`tr[name='${nomeQuestionario}']`, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('editarQuestionario', (nomeQuestionario) => {
  const timeoutPadrao = 5000
  const formulario = new formQuestionarios()
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPgEdicao } = labels.questionario

  // Edita o questionário
  cy.get(`tr[name='${nomeQuestionario}']`, { timeout: timeoutPadrao })
    .find(formulario.elementos.btnEditar.seletor, formulario.elementos.btnEditar.title)
    .click()

  // Validar se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao })
    .should('be.visible')

  cy.contains('.detail_title', tituloPgEdicao)
    .should('be.visible')
})

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

Cypress.Commands.add('acessarPerguntasQuestionario', (nomeQuestionario) => {
  const timeoutPadrao = 5000
  const form = new formQuestionarios()
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg } = labels.perguntas

  // Acessa as perguntas do questionário
  cy.get(`tr[name='${nomeQuestionario}']`, { timeout: timeoutPadrao })
    .find(form.elementos.btnPerguntas.seletor)
    .click()

  // Valida se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao })
    .should('be.visible')

  cy.contains('#breadcrumb', `> ${nomeQuestionario}`, { timeout: timeoutPadrao })
    .should('be.visible')

  cy.contains('.detail_title', tituloPg)
    .should('be.visible')
})

Cypress.Commands.add('preencherDadosPergunta', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formPerguntas()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

Cypress.Commands.add('validarDadosPergunta', (conteudo) => {
  const formulario = new formPerguntas()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

Cypress.Commands.add('salvarPergunta', (descPergunta, index) => {
  const timeoutPadrao = 5000
  const formulario = new formPerguntas()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.perguntas

  // Salva a pergunta
  cy.get(`tr[id='question-new-${index}']`, { timeout: timeoutPadrao })
    .parent('tbody')
    .within(() => {
      formulario.salvar()
    })  

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso)
    .should('be.visible')

  // Verifica se a pergunta foi salva
  cy.get(`tr[title*='${descPergunta.slice(0, 1000)}']`, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('excluirPergunta', (descPergunta) => {
  const timeoutPadrao = 5000
  const formulario = new formPerguntas()

  cy.get(`tr[title*='${descPergunta.slice(0, 30)}']`, { timeout: timeoutPadrao })
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
  cy.get(`tr[title*='${descPergunta.slice(0, 30)}']`, { timeout: timeoutPadrao })
    .should('not.exist')
})

Cypress.Commands.add('expandirPergunta', (descPergunta) => {
  const timeoutPadrao = 5000
  const formulario = new formPerguntas()

  cy.get(`tr[title*='${descPergunta.slice(0, 30)}']`, { timeout: timeoutPadrao })
    .parent('tbody')
    .within(() => {
      formulario.expandirPergunta()
    })  
})

Cypress.Commands.add('salvarEdicaoPergunta', (oldDescPergunta, newDescPergunta) => {
  const timeoutPadrao = 5000
  const formulario = new formPerguntas()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.perguntas

  // Salva a pergunta
  cy.get(`tr[title*='${oldDescPergunta.slice(0, 30)}']`, { timeout: timeoutPadrao })
    .parent('tbody')
    .within(() => {
      formulario.salvar()
    })  

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso)
    .should('be.visible')

  // Verifica se a pergunta foi salva
  cy.get(`tr[title*='${newDescPergunta.slice(0, 1000)}']`, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('preencherDadosUsuario', (dados, opcoes = { limpar: false }) => {
  const formulario = new formUsuarios()
  
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

Cypress.Commands.add('validarDadosUsuario', (dados) => {
  const formulario = new formUsuarios()

  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

Cypress.Commands.add('salvarUsuario', (nomeUsuario) => {
  const timeoutPadrao = 5000
  const formulario = new formUsuarios()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.usuarios

  // Salva o usuário
  formulario.salvar()

  // Confirma a mensagem de sucesso
  cy.contains('.flash.success', msgSucesso, { timeout: timeoutPadrao })
    .should('be.visible')

  // Verifica se o usuário foi criado com sucesso
  cy.get('.student-name')
    .invoke('text')
    .should('contain', nomeUsuario)
})

Cypress.Commands.add('excluirUsuario', (nomeUsuario) => {
  const timeoutPadrao = 5000
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
  cy.contains('.flash.success', msgSucessoExclusao, { timeout: timeoutPadrao })
    .should('be.visible')

  // Verifica se o usuário foi excluído e não é exibido na listagem
  cy.get('tr.professional-row')
    .contains(nomeUsuario, { timeout: timeoutPadrao })
    .should('not.exist')
})

Cypress.Commands.add('editarUsuario', (nomeUsuario) => {
  const timeoutPadrao = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPgEdicao } = labels.usuarios

  // Edita o usuário
  cy.contains('tr.professional-row', nomeUsuario)
    .within(() => {
      cy.get('a.professional-edit')
        .click()
    })

  // Valida se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao })
    .should('be.visible')

  cy.contains('.detail_title', tituloPgEdicao)
    .should('be.visible')
})

Cypress.Commands.add('excluirUsuarioViaApi', function() {
  cy.request({
    method: 'GET',
    url: `/api/v1/o/${Cypress.env('orgId')}/students`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${Cypress.env('token')}`
    },
    failOnStatusCode: false
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

Cypress.Commands.add('acessarPgUsuarios', () => {
  const timeoutPadrao = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.usuarios

  cy.visit(`/o/${Cypress.env('orgId')}/users`)
  
  // Valida se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('addUsuario', () => {
  const timeoutPadrao = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPgAdicionar } = labels.usuarios

  cy.get('#add-professional')
    .click()

  // Valida se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao })
    .should('be.visible')

  cy.contains('.detail_title', tituloPgAdicionar, { timeout: timeoutPadrao })
    .should('be.visible')
})

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

Cypress.Commands.add('resetSenhaUsuario', function(nomeUsuario, senha) {
  const timeoutPadrao = 5000
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
  cy.contains('.flash.notice', msgSucessoSenha, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('inativarUsuario', function(nomeUsuario) {
  const timeoutPadrao = 5000
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
  cy.contains('.flash.notice', msgSucessoInativar, { timeout: timeoutPadrao })
    .should('be.visible')

  // Verifica se o usuário foi inativado
  cy.contains('tr.professional-row', nomeUsuario)
    .within(() => {
      cy.get('.professional-progress')
        .should('have.attr', 'title', 'Ativar')
        .find('a.button-inactive')
        .should('be.visible')

      // Verifica se o elemento de alteração de senha não está visível
      cy.get('a.user-password-change', { timeout: timeoutPadrao})
        .should('not.exist')

      // Verifica se o elemento de edição não está visível
      cy.get('td.professional-progress[title="Editar"]', { timeout: timeoutPadrao})
        .find('a.professional-edit')
        .should('not.exist')

      // Verifica se o elemento de exclusão não está visível
      cy.get('td.professional-progress[title="Excluir"]', { timeout: timeoutPadrao})
        .find('a.professional-delete')
        .should('not.exist')

      // Verifica se o status do usuário é "Inativo"
      cy.get('td.ellipsis', { timeout: timeoutPadrao})
        .should('contain', 'Inativo')
    })
})

Cypress.Commands.add('ativarUsuario', function(nomeUsuario) {
  const timeoutPadrao = 5000
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
  cy.contains('.flash.notice', msgSucessoAtivar, { timeout: timeoutPadrao })
    .should('be.visible')

  // Verifica se o usuário foi ativado
  cy.contains('tr.professional-row', nomeUsuario)
    .within(() => {
      cy.get('.professional-progress')
        .should('have.attr', 'title', 'Inativar')
        .find('a.button-inactive')
        .should('be.visible')

      // Verifica se o elemento de alteração de senha não está visível
      cy.get('a.user-password-change', { timeout: timeoutPadrao})
        .should('be.visible')

      // Verifica se o elemento de edição não está visível
      cy.get('td.professional-progress[title="Editar"]', { timeout: timeoutPadrao})
        .find('a.professional-edit')
        .should('be.visible')

      // Verifica se o elemento de exclusão não está visível
      cy.get('td.professional-progress[title="Excluir"]', { timeout: timeoutPadrao})
        .find('a.professional-delete')
        .should('be.visible')

      // Verifica se o status do usuário é "Ativo"
      cy.get('td.ellipsis', { timeout: timeoutPadrao})
        .should('contain', 'Ativo')
    })
})

Cypress.Commands.add('addParticipanteConteudo', function(nomeConteudo, tipoConteudo) {
  const timeoutPadrao = 5000
  
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg, breadcrumbTrilha } = labels.participantes

  // Clica em 'Opções' e 'Atividades'
  cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: timeoutPadrao})
    .find('svg[aria-label="Options"]')
    .click()

  cy.get(`tr[tag-name='${nomeConteudo}']`, { timeout: timeoutPadrao})
    .contains('button', 'Inscrição')
    .click( {force: true} )

  // Validar se a página foi carregada corretamente
  switch (tipoConteudo) {
    case 'Trilha':
      cy.contains('#page-breadcrumb', breadcrumbTrilha, { timeout: timeoutPadrao })
        .should('be.visible')
      break
    case 'curso':
      cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao })
        .should('be.visible')
      break
  }

  cy.contains('.detail_title', tituloPg)
    .should('be.visible')
})

Cypress.Commands.add('preencherDadosParticipante', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formParticipantes()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

Cypress.Commands.add('validarDadosParticipante', (conteudo) => {
  const formulario = new formParticipantes()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

Cypress.Commands.add('salvarNovoParticipante', (nomeParticipante) => {
  const timeoutPadrao = 5000
  const formulario = new formParticipantes()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.participantes

  // Salva o usuário
  formulario.salvar()

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucesso, { timeout: timeoutPadrao })
    .should('be.visible')

  // Verifica se o usuário foi criado com sucesso
  cy.contains('td', nomeParticipante, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('salvarEdicaoParticipante', (nomeParticipante, status = 'Confirmados') => {
  const timeoutPadrao = 5000
  const formulario = new formParticipantes()
  const labels = Cypress.env('labels')
  const { msgSucessoEdicao } = labels.participantes

  // Salva o usuário
  formulario.salvar()

  // Confirma a mensagem de sucesso
  cy.contains('.flash.notice', msgSucessoEdicao, { timeout: timeoutPadrao })
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
    .contains('td', nomeParticipante, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('editarParticipante', (nomeParticipante, tipoConteudo) => {
  const timeoutPadrao = 5000
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
      cy.contains('#page-breadcrumb', breadcrumbTrilha, { timeout: timeoutPadrao })
        .should('be.visible')
      break
    case 'curso':
      cy.contains('#page-breadcrumb', breadcrumbEdicao, { timeout: timeoutPadrao })
        .should('be.visible')
      break
  }

  cy.contains('.detail_title', tituloPgEdicao)
    .should('be.visible')
})

Cypress.Commands.add('addParticipante', (tipoConteudo) => {
  const timeoutPadrao = 5000
  const labels = Cypress.env('labels')
  const { breadcrumbAdicionar, tituloPgAdicionar, breadcrumbTrilha } = labels.participantes

  cy.get('.new_participant_btn')
    .click()

  // Valida se a página foi carregada corretamente [obs. adicionado tipoConteudo devido BUG no breadcrumb da trilha]
  switch (tipoConteudo) {
    case 'trilha':
      cy.contains('#page-breadcrumb', breadcrumbTrilha, { timeout: timeoutPadrao })
        .should('be.visible')
      break
    case 'curso':
      cy.contains('#page-breadcrumb', breadcrumbAdicionar, { timeout: timeoutPadrao })
        .should('be.visible')
      break
  }

  cy.contains('.detail_title', tituloPgAdicionar, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('alteraStatus', function(nomeParticipantes, status) {
  const timeoutPadrao = 20000
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
  // Problemas na validação das demais mensagens, validando apenas a última mensagem de sucesso (por isso a inclusão do wait de 3 segundos)
  // switch (status) {
  //   case 'Confirmado':
  //     cy.contains('.flash.success', msgAlteraConfirmado, { timeout: timeoutPadrao }).should('be.visible')
  //     break
  //   case 'Pendente':
  //     cy.contains('.flash.success', msgAlteraPendente, { timeout: timeoutPadrao }).should('be.visible')
  //     break
  //   case 'Cancelado':
  //     cy.contains('.flash.success', msgAlteraCancelado, { timeout: timeoutPadrao }).should('be.visible')
  //     break
  // }
  cy.wait(2000)
  cy.contains('.flash.success', msgSucessoAlteraStatus, { timeout: timeoutPadrao }).should('be.visible')

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
      .find('td', nomeParticipante, { timeout: timeoutPadrao })
      .should('be.visible')
  })
})

Cypress.Commands.add('abaConfirmados', function() {
  cy.contains('.tab_selector', 'Confirmados')
    .click()
})

Cypress.Commands.add('abaPendentes', function() {
  cy.contains('.tab_selector', 'Pendentes')
    .click()
})

Cypress.Commands.add('abaCancelados', function() {
  cy.contains('.tab_selector', 'Cancelados')
    .click()
})

Cypress.Commands.add('cancelarFormularioParticipante', function(tipoConteudo) {
  const timeoutPadrao = 5000
  const labels = Cypress.env('labels')
  const { breadcrumb, tituloPg, breadcrumbTrilha } = labels.participantes

  // Cancelar
  cy.contains('a.btn.btn-cancel', 'Cancelar')
    .should('be.visible')
    .as('btnCancelar')

  cy.get('@btnCancelar', { timeout: timeoutPadrao })
    .click()

  // Validar redirecionamento [obs. adicionado tipoConteudo devido BUG no breadcrumb da trilha]
  switch (tipoConteudo) {
    case 'trilha':
      cy.contains('#page-breadcrumb', breadcrumbTrilha, { timeout: timeoutPadrao })
        .should('be.visible')
      break
    case 'curso':
      cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao })
        .should('be.visible')
      break
  }

  cy.contains('.detail_title', tituloPg, { timeout: timeoutPadrao })
    .should('be.visible')
})

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
      cy.log(`Tentativa ${attempt}: Falha na requisição. Não foi possível criar o usuário`)
      throw new Error(`Erro na criação do usuário: ${response.body}`)
    } else {
      expect(response.status).to.eq(201)
    }
  })
})

Cypress.Commands.add('associarParticipante', function(emailParticipante, nomeParticipante) {
  const timeoutPadrao = 5000
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
  cy.contains('.flash.notice', msgSucesso, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('alterarStatusTodosParticipantes', function(status, novoStatus, listaParticipantes) {
  const timeoutPadrao = 20000
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

  // Problemas ao validar demais mensagens, validando apenas a última mensagem de sucesso (por isso a inclusão do wait de 3 segundos)
  // switch (novoStatus) {
  //   case 'Confirmado':
  //     cy.contains('.flash.success', msgAlteraConfirmado, { timeout: timeoutPadrao }).should('be.visible')
  //     break
  //   case 'Pendente':
  //     cy.contains('.flash.success', msgAlteraPendente, { timeout: timeoutPadrao }).should('be.visible')
  //     break
  //   case 'Cancelado':
  //     cy.contains('.flash.success', msgAlteraCancelado, { timeout: timeoutPadrao }).should('be.visible')
  //     break
  // }
  cy.wait(2000)
  cy.contains('.flash.success', msgSucessoAlteraStatus, { timeout: timeoutPadrao }).should('be.visible')

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
      .find('td', nomeParticipante, { timeout: timeoutPadrao })
      .should('be.visible')
  })
})

Cypress.Commands.add('importarParticipante', function(arquivo) {
  const timeoutPadrao = 5000
  const labels = Cypress.env('labels')
  const { msgUploadImportacao, msgImportacaoEmAndamento, msgImportacaoConcluida } = labels.participantes

  // Clica no botão 'Importar'
  cy.get('.import')
    .click()

  // Clica em 'Enviar arquivo'
  cy.get('#file-name-container')
    .contains('a', 'Enviar arquivo', { timeout: timeoutPadrao })
    .click( { force: true } )

  // Seleciona o arquivo a ser importado
  cy.get('#file')
    .selectFile(`cypress/fixtures/${arquivo}`, { force: true })
    
  // Clica em 'Enviar'
  cy.get('#send_to_import')
    .click( { force: true } )

  // Valida a mensagem de sucesso do upload do arquivo
  cy.contains('.flash.success', msgUploadImportacao, { timeout: timeoutPadrao })
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
  cy.contains('.flash.success', msgImportacaoEmAndamento, { timeout: timeoutPadrao })
    .should('be.visible')

  // Valida a mensagem de sucesso da importação com espera de até 2 minutos
  cy.contains('.flash.success', msgImportacaoConcluida, { timeout: 120000 })
    .should('be.visible')
})

Cypress.Commands.add('validarStatusImportacao', (tipo, statusEsperado) => {
  const timeoutPadrao = 5000
  const TIMEOUT_IMPORTACAO = 180000

  const labels = Cypress.env('labels')
  const { msgImportacaoConcluida, msgImportacaoCancelada } = labels.usuarios

  let seletor = ''

  cy.log(`Status de importação esperado: ${statusEsperado}`)

  switch (tipo) {
    case 'usuários':
      seletor = '#import_users'
      break
    case 'participantes':
      seletor = '.import'
      break
    default:
      throw new Error(`Tipo de importação inválido: ${tipo}`)
  }

  // Validar a mensagem da importação com espera de até 3 minutos com base na opção
  switch(statusEsperado) {
    case 'Concluído':
      cy.contains('.flash.success', msgImportacaoConcluida, { timeout: TIMEOUT_IMPORTACAO })
        .should('be.visible')
      break
    case 'Cancelado':
      cy.contains('.flash.error', msgImportacaoCancelada, { timeout: TIMEOUT_IMPORTACAO })
        .should('be.visible')
      break
  }

  function verificarStatus() {
    // Seleciona a primeira linha de dados da tabela, ignorando explicitamente o cabeçalho
    // Usamos o seletor 'tr:has(td)' para garantir que estamos selecionando apenas linhas que contêm células de dados
    cy.get('#imports-list').find('tr:nth-child(2)').find('td:nth-child(4)').then($cell => {
      const status = $cell.text().trim()
      cy.log(`Status da importação: ${status}`)

      if (status === 'Execução' || status === 'Pendente') {
        cy.log('Arquivo de importação ainda está sendo processado. Aguardando...')
        cy.get('#twygo-modal-close').click()
        cy.wait(timeoutPadrao)
        cy.get(seletor).click()
        verificarStatus()
      } else if (status === statusEsperado) {
        cy.log(`Status da importação está conforme o esperado: ${statusEsperado}`)
        cy.get('#twygo-modal-close').click()
      } else if (status !== statusEsperado) {
        throw new Error(`Status: ${status}`)
      }
    })
  }
  
  if (tipo === 'usuários'){
    cy.acessarPgUsuarios()
  }

  cy.get(seletor)
    .click()

  verificarStatus()
})

Cypress.Commands.add('criarUsuario', function(dados) {
  cy.acessarPgUsuarios()
  cy.addUsuario()
  cy.preencherDadosUsuario(dados, { limpar: true })
  cy.salvarUsuario(`${dados.nome} ${dados.sobrenome}`) 
})

Cypress.Commands.add('configUsuario', (idioma = 'pt') => {
  const timeoutPadrao = 5000
  
  const labels = Cypress.env('labels')[idioma]
  const { breadcrumb, tituloPg } = labels.configUsuario
  
  cy.get('#btn-profile')
    .click()

  cy.get('#config-profile')
    .click()

  // Valida se a página foi carregada corretamente
  cy.contains('#page-breadcrumb', breadcrumb, { timeout: timeoutPadrao })
    .should('be.visible')

  cy.contains('.detail_title', tituloPg, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('preencherDadosConfigUsuario', (dados, opcoes = { limpar: false }) => {
  const formulario = new formConfigUsuario()
  
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
})

Cypress.Commands.add('vincularInstrutor', (nomeInstrutor) => {
  const formulario = new formInstrutor()

  formulario.associarInstrutor(nomeInstrutor)

})

Cypress.Commands.add('vinculoGestao', (nomeGestor, acao) => {
  const formulario = new formGestor()

  switch(acao) {
    case 'Vincular':
      formulario.vincularGestor(nomeGestor)
      break
    case  'Desvincular':
      formulario.desvincularGestor(nomeGestor)
      break
  }
})

Cypress.Commands.add('validarVinculoInstrutor', (nomeInstrutor) => {
  cy.contains('.speaker_name', nomeInstrutor)
  .should('be.visible')
})

Cypress.Commands.add('validarVinculoGestor', (nomeGestor, status) => {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { msgSucessoVinculo } = labels.gestores
  const { msgSucessoRemocao } = labels.gestores

  switch(status) {
    case 'Vinculado':
      cy.contains('.flash.success', msgSucessoVinculo, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')

      cy.get(`td:contains('${nomeGestor}')`)
        .parents('tr')
        .find('.icon-check-circle.on')
      break
    case 'Desvinculado':
      cy.contains('.flash.success', msgSucessoRemocao, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
  
      cy.get(`td:contains('${nomeGestor}')`)
        .parents('tr')
        .find('.icon-times-circle.off')
        .should('be.visible')
      break  
  }
})

Cypress.Commands.add('removerVinculoInstrutor', (nomeInstrutor) => {
  //Encontra o instrutor e clica para remover 
  cy.contains('.speaker_name', nomeInstrutor)
    .parents('div')
    .parents('div')
    .parents('tr')
    .find('a.name')
    .click()
})

Cypress.Commands.add('validarRemocaoVinculoInstrutor', (nomeInstrutor) => {
  cy.contains('.speaker_name', nomeInstrutor).should('not.exist')
})

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

Cypress.Commands.add('validarDadosConfigUsuario', (dados) => {
  const formulario = new formConfigUsuario()

  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

Cypress.Commands.add('logout', (idioma = 'pt') => {
  // obs.: a msgLogout só é alterada após logout, ou seja em uma mudança de idioma, a msgLogout será a do idioma anterior
  const timeoutPadrao = 5000
  
  const labels = Cypress.env('labels')[idioma]
  const { msgLogout } = labels.configUsuario
  
  cy.get('#btn-profile')
    .click()

  cy.get('#link_logout')
    .click( { force: true } )

  // Validar mensagem de sucesso do logout
  cy.contains('.flash.notice', msgLogout, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('instrutorConteudo', (nomeConteudo) => {
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

Cypress.Commands.add('gestorConteudo', (nomeConteudo) => {
  // Acessa o arquivo de labels
  cy.readFile('cypress/fixtures/labels.json').then(labels => {
    const { breadcrumb, tituloPg } = labels.gestores;

    // Define o seletor para encontrar o conteúdo na listagem
    let seletor = `tr[tag-name='${nomeConteudo}']`;

    // Clica em 'Opções' e 'Gestores de turma'
    cy.get(seletor)
      .find('svg[aria-label="Options"]')
      .click();

    cy.get(seletor)
      .contains('button', 'Gestores de turma')
      .click({ force: true });

    // Valida se a página foi carregada corretamente conforme o tipo de conteúdo
    const breadcrumbComVariavel = breadcrumb.replace('{{nomeDoConteudo}}', nomeConteudo);
    cy.contains('#page-breadcrumb', breadcrumbComVariavel)
      .should('be.visible');

    cy.contains('.detail_title', tituloPg)
      .should('be.visible');
  })
})

Cypress.Commands.add('login', function(login, password, username, idioma = 'pt') {
  const labels = Cypress.env('labels')[idioma]
  const { pgInicialAluno, btnProfile } = labels.configUsuario
  
  cy.visit('/users/login')

  cy.get('#user_email')
    .type(login)
  
  cy.get('#user_password')
    .type(password)

  cy.contains('button', 'Entrar')
    .should('be.visible')  
    .click()

  // Aceite dos termos de uso
  cy.get('#agree_check')
    .click()

  cy.get('#next')
    .click()

  // Verificar se o login foi realizado com sucesso
  cy.contains('#page-breadcrumb', pgInicialAluno)
    .should('be.visible')

    switch (idioma) {
      case 'pt':
      case 'es':
        cy.contains('.name', username)
          .should('be.visible')
        break
      case 'en':
        const nomeCompleto = username
        const palavras = nomeCompleto.split(' ')

        const nome = palavras[0]
        const sobrenome = palavras.slice(1).join(' ')

        cy.contains('.name', `${sobrenome}, ${nome}`)
          .should('be.visible')
        break
      default:
        throw new Error(`Idioma inválido: ${idioma}. Utilize 'pt', 'en' ou 'es'`)
    }

  cy.contains('#btn-profile', btnProfile)
    .should('be.visible')
})

Cypress.Commands.add('salvarConfigUsuario', (idioma = 'pt') => {
  // obs.: a msgSucesso só é alterada após salvar, ou seja em uma mudança de idioma, a msgSucesso será a do idioma anterior
  const timeoutPadrao = 5000
  
  const labels = Cypress.env('labels')[idioma]
  const { msgSucesso, pgInicialAluno, btnSalvar } = labels.configUsuario

  cy.contains('button', btnSalvar)
  .should('be.visible')
  .click()  

  // Valida a mensagem
  cy.contains('.flash.notice', msgSucesso, { timeout: timeoutPadrao })
    .should('be.visible')

  // Valida o redirecionamento
  cy.contains('#page-breadcrumb', pgInicialAluno, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('voltar', () => {
  // Localiza o e clica no botão de voltar
  cy.contains('.btn.btn-default.btn-back.waves-effect', 'Voltar')
    .click()  
})

Cypress.Commands.add('importarUsuarios', function(arquivo, opcao = 'Cancelar') {
  const timeoutPadrao = 5000
  const labels = Cypress.env('labels')
  const { msgUploadImportacao, msgImportacaoEmAndamento } = labels.usuarios

  // Clica no botão 'Importar'
  cy.get('#import_users')
    .click()

  // Clica em 'Enviar arquivo'
  cy.get('#file-name-container')
    .contains('a', 'Enviar arquivo', { timeout: timeoutPadrao })
    .click( { force: true } )

  // Seleciona o arquivo a ser importado
  cy.get('#file')
    .selectFile(`cypress/fixtures/${arquivo}`, { force: true })
    
  // Seleciona a opção de ação para os "Usuários já cadastrados"
  cy.get('#user_exists_action')
    .select(opcao)

  // Clica em 'Enviar'
  cy.get('#send_to_import')
    .click( { force: true } )

  // Valida a mensagem de sucesso do upload do arquivo
  cy.contains('.flash.success', msgUploadImportacao, { timeout: timeoutPadrao })
    .should('be.visible')

  // Valida modal de campos para importar
  cy.get('#imports-fields')
    .contains('h3', 'Campos para importar')

  // Seleciona as opções de telefone pessoal, comercial e celular
  cy.get('#importables_phone1')
    .select('Telefone pessoal')

  cy.get('#importables_phone2')
    .select('Telefone comercial')

  cy.get('#importables_cell_phone')
    .select('Celular')

  // Clica em 'Enviar'
  cy.get('#csv-settings-form')
    .find('div.field.fs3')
    .contains('button', 'Enviar')
    .click( { force: true } )

  // Valida a mensagem de sucesso após o upload do arquivo
  cy.contains('.flash.success', msgImportacaoEmAndamento, { timeout: timeoutPadrao })
    .should('be.visible')
})

Cypress.Commands.add('limparDadosOrg', function() {
  const timeoutPadrao = 5000
  const TIMEOUT_EXCLUSAO = 300000
  const labels = Cypress.env('labels')
  const { exclusaoEmAndamento, exclusaoConcluida } = labels.menuSophia

  // Acessar menu da Sophia
  cy.get('img[src*="sophia"]')
    .eq(0)
    .click()

  // Selecionar a opção para excluir informações
  cy.get('#accordion-button-delete-info')
    .click()

  // Selecionar a opção para limpar todas as informações
  cy.get('.chakra-checkbox__control')
    .eq(3)
    .click()

  // Alternativa para navegar até o botão de excluir
  cy.realPress('Tab')

  cy.realType('{enter}')

  // Confirmar a ação de exclusão
  cy.contains('.flash.success', exclusaoEmAndamento, { timeout: timeoutPadrao })
    .should('be.visible')	

  // Aguardar mensagem de confirmação de exclusão	
  cy.contains('.flash.success', exclusaoConcluida, { timeout: TIMEOUT_EXCLUSAO })
    .should('be.visible')
})

Cypress.Commands.add('ignorarCapturaErros', (errorsToIgnore, options = { ignoreScriptErrors: false, ignoreNetworkErrors: false }) => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    const shouldIgnoreError = errorsToIgnore.some(errorToIgnore => err.message.includes(errorToIgnore))
    
    // Verificações específicas para erros de script de origem cruzada e erros de rede
    const isCrossOriginError = err.message.includes('Script error.') || err.message.includes('cross-origin')
    const isNetworkError = err.message.includes('Network Error')

    if (shouldIgnoreError || 
        (options.ignoreScriptErrors && isCrossOriginError) ||
        (options.ignoreNetworkErrors && isNetworkError)) {
      return false // Ignora o erro
    }
  })
})

Cypress.Commands.add('ativarCapturaErros', function() {
  Cypress.removeAllListeners('uncaught:exception')
})

Cypress.Commands.add('criarAmbienteAdicional', (acao, dadosAmbiente, opcoes = { limpar: true }) => {
  const formulario = new formAmbientesAdicionais()
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.ambientesAdicionais
  
  if (acao === 'Criar') {
    formulario.criarAmbienteAdicional()
  } else if (acao === 'Adicionar') {
    formulario.adicionarAmbienteAdicional()
  }
  
  Object.keys(dadosAmbiente).forEach(nomeCampo => {
      const valor = dadosAmbiente[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })

  formulario.salvarAmbiente()
  cy.contains('#success-toast', msgSucesso, { timeout: TIMEOUT_PADRAO })
        .should('be.visible')
}) 

Cypress.Commands.add('validarAmbienteAdicional', (dadosAmbiente, acao) => {
  // Extrai o valor da chave 'nome' do objeto 'dadosAmbiente'
  const nomeAmbiente = dadosAmbiente.nome;

  switch(acao) {
    case 'Criação':
      cy.get('span.css-0')
        .should('be.visible')
        .should('contain', nomeAmbiente)
      break
    case 'Inativação':
      cy.get('span.css-0').should('not.exist')
      break
  }
})

Cypress.Commands.add('inativarAmbienteAdicional', (nomeAmbiente) => {
  const formulario = new formAmbientesAdicionais()
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { msgInativacao } = labels.ambientesAdicionais

  cy.contains('div', nomeAmbiente).within(() => {
    cy.get(formulario.elementos.inativar.seletor)
    .click()
  })   

  // Confirmar a inativação do ambiente
  formulario.confirmarInativacaoAmbiente()
  
  // Valida a mensagem de sucesso
  cy.contains('.chakra-alert__desc.css-zycdy9', msgInativacao, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
}) 

Cypress.Commands.add('ambienteAdicionalConteudo', (nomeConteudo, tipoConteudo) => {
  const labels = Cypress.env('labels')
  const { breadcrumbAmbienteAdicional } = labels.conteudo[tipoConteudo]

  // Define o seletor para encontrar o conteúdo na listagem
  let seletor = `tr[tag-name='${nomeConteudo}']`

  // Clica em 'Opções' e 'Ambientes adicionais'
  cy.get(seletor)
    .find('svg[aria-label="Options"]')
    .click();

  cy.get(seletor)
    .contains('button', 'Ambiente adicional')
    .click({ force: true })

  // Valida se a página foi carregada corretamente
  const breadcrumbComVariavel = breadcrumbAmbienteAdicional.replace('{{nomeDoConteudo}}', nomeConteudo)
  cy.contains('#page-breadcrumb', breadcrumbComVariavel)
    .should('be.visible')
})

Cypress.Commands.add('compartilharComAmbienteAdicional', (nomeAmbiente, acao) => {
  // Encontra o card que contém o nome do ambiente
  cy.contains('p.chakra-text.partner-card-text span', nomeAmbiente).closest('div').within(() => {
    // Verifica o estado atual do checkbox
    cy.get('label.chakra-checkbox input[type="checkbox"]').then(($checkbox) => {
      const isChecked = $checkbox.is(':checked')
      
      if (acao === 'Habilitar' && !isChecked) {
        // Se a ação for 'Habilitar' e o checkbox não estiver marcado, marque-o
        cy.wrap($checkbox).check({ force: true });
      } else if (acao === 'Desabilitar' && isChecked) {
        // Se a ação for 'Desabilitar' e o checkbox estiver marcado, desmarque-o
        cy.wrap($checkbox).uncheck({ force: true })
      }
    })
  })
})

Cypress.Commands.add('salvarCompartilhamentoAmbienteAdicional', () => {
  const formulario = new formConteudosAmbienteAdicional()
  const labels = Cypress.env('labels')
  const { msgCompartilhamento } = labels.ambientesAdicionais

  formulario.salvarCompartilhamento()

  // Valida a mensagem de sucesso
  cy.contains('.chakra-alert__desc', msgCompartilhamento)
    .should('be.visible')
})

Cypress.Commands.add('validarCompartilhamentoComAmbienteAdicional', (nomeAmbiente, acao) => {
  // Encontra o card que contém o nome do ambiente
  cy.contains('p.chakra-text.partner-card-text span', nomeAmbiente).closest('div').within(() => {
    // Verifica o estado atual do checkbox
    cy.get('label.chakra-checkbox input[type="checkbox"]').should(($checkbox) => {
      const isChecked = $checkbox.is(':checked')
      
      if (acao === 'Habilitado') {
        expect(isChecked).to.be.true
      } else if (acao === 'Desabilitado') {
        expect(isChecked).to.be.false
      }
    })
  })
})

Cypress.Commands.add('listaAmbientesAdicionais', () => {
  const nomesAmbientesAdicionais = []

  cy.get('body').then(($body) => {
    if ($body.find('.chakra-text.partner-card-text span').length > 0) {
      cy.get('.chakra-text.partner-card-text span').each(($el) => {
        nomesAmbientesAdicionais.push($el.text())
      }).then(() => {
        return nomesAmbientesAdicionais
      })
    } else {
      return nomesAmbientesAdicionais
    } 
  })
})

Cypress.Commands.add('inativarTodosAmbientesAdicionais', () => {
  cy.listaAmbientesAdicionais().then((nomesAmbientesAdicionais) => {
    nomesAmbientesAdicionais.forEach((nome) => {
      cy.inativarAmbienteAdicional(nome)
    })
  })
  cy.acessarPgAmbientesAdicionais()
})

Cypress.Commands.add('preencherDadosConfigOrganizacao', (dados, aba, opcoes = { limpar: false }) => {
  const formulario = new formConfigOrganizacao()

  if (aba) {
    switch (aba) {
      case 'dados':
        formulario.abaDados()
        break
      case 'customizacoes':
        formulario.abaCustomizacoes()
        break
      case 'certificado':
        formulario.abaCertificado()
        break
      case 'integracoes':
        formulario.abaIntegracoes()
        break
      case 'termos':
        formulario.abaTermos()
        break
      case 'urlWebhooks':
        formulario.abaUrlWebhooks()
        break
      default:
        throw new Error(`Aba inválida: ${aba}. Utilize 'dados', 'customizacoes', 'certificado', 'integracoes', 'termos' ou 'urlWebhooks'`)
    }
  }
  
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

Cypress.Commands.add('validarDadosConfigOrganizacao', (dados, aba) => {
  const formulario = new formConfigOrganizacao()

  switch (aba) {
    case 'dados':
      formulario.abaDados()
      break
    case 'customizacoes':
      formulario.abaCustomizacoes()
      break
    case 'certificado':
      formulario.abaCertificado()
      break
    case 'integracoes':
      formulario.abaIntegracoes()
      break
    case 'termos':
      formulario.abaTermos()
      break
    case 'urlWebhooks':
      formulario.abaUrlWebhooks()
      break
    default:
      throw new Error(`Aba inválida: ${aba}. Utilize 'dados', 'customizacoes', 'certificado', 'integracoes', 'termos' ou 'urlWebhooks'`)
  }

  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

Cypress.Commands.add('resetConfigOrganizacao', (aba) => {
  switch (aba) {
    case 'dados':
      const formDadosDefault = {
        nome: Cypress.env('orgName'),
        descricao: '',
        informacoesGerais: '',
        resumoIndexacao: '',
        cep: '',
        endereco: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: '',
        telefone: '(45) 99999-9999',
        email: Cypress.env('login'),
        site: '',
        converterEscalaBranco: false,
        personalizarLinkLogotipo: true,
        linkRedirecionamento: '',
        botaoContato: '',
        usarGestaoCompetencias: false,
        ativarGamificacao: false,
        visualizacao: 'Privada',
        abaPortfolio: false,
        abaAgenda: false,
        abaParceiros: false,
        abaSobre: false,
        abaPlanos: false,
        listaEmpresas: '',
        nrColaboradores: '',
        ramoAtuacao: '',
        cargo: ''
      }

      const atualizarPersonalizarLink = {
          personalizarLinkLogotipo: false,
          salvarDados: true
      }

      cy.acessarPgConfigOrganizacao()
      cy.preencherDadosConfigOrganizacao(formDadosDefault, 'dados', { limpar: true })
      cy.preencherDadosConfigOrganizacao(atualizarPersonalizarLink)
      // Aguardar 3 segundos para atualização dos dados
      cy.wait(3000)
      cy.acessarPgConfigOrganizacao()
      break
    case 'customizacoes':
      const formAlterarDadosUsuarioDefault = {
        // Alterar dados do usuário
        naoPermitirAlterarDados: false,
        salvarAlterarDados: true
      }

      cy.acessarPgConfigOrganizacao()
      cy.preencherDadosConfigOrganizacao(formAlterarDadosUsuarioDefault, 'customizacoes', { limpar: true })

      const formConfigLoginDefault = {
        // Configurações de login
        tempoExpiracaoLogin: false,
        loginEmail: true,
        loginCpf: false,
        salvarConfiguracoesLogin: true
      }

      cy.preencherDadosConfigOrganizacao(formConfigLoginDefault, 'customizacoes', { limpar: true })

      const formCustomizacoesInterfaceDefault = {
        // Customização de interface
        corPrimaria: '#9349DE',
        corTexto: '#596679',
        mostrarFundoLogin: false,
        mostrarBotaoRegistrar: true,
        removerImagemFundoLogin: false,
        salvarCustomizacaoInterface: true
      }

      cy.preencherDadosConfigOrganizacao(formCustomizacoesInterfaceDefault, 'customizacoes', { limpar: true })

      const formEnvioEmailsDefault = {
        // Envio de E-mails
        limparInformacoesEmail: true
      }

      // Esperar para atualização da customização
      cy.wait(5000)

      cy.preencherDadosConfigOrganizacao(formEnvioEmailsDefault, 'customizacoes', { limpar: true })
      break
    case 'certificado':
      // Carregar um certificado em branco, pois não é possível limpar os dados	
      const carregarCertificadoEmBranco = {
        configurar: true,
        selecionarImagem: `imagem_0.jpg`,
        salvarGerarModelo: true
      }

      const formConfigCertificadoDefault = {
          notificarGestorNovosCertificados: false,
          salvarCertificado: true
      }

      cy.acessarPgConfigOrganizacao()
      cy.preencherDadosConfigOrganizacao(carregarCertificadoEmBranco, 'certificado')

      cy.acessarPgConfigOrganizacao()
      cy.preencherDadosConfigOrganizacao(formConfigCertificadoDefault, 'certificado')

      // Aguardar 10 segundos para que o certificado seja carregado
      cy.wait(10000)
      break    
    case 'integracoes':
      const formConfigIntegracoesDefault = {
        // Configurações de integrações
        ativarLogin: false,
        salvarLogin: true
      }

      cy.acessarPgConfigOrganizacao()
      cy.preencherDadosConfigOrganizacao(formConfigIntegracoesDefault, 'integracoes')

      cy.listaPixels().then(nomes => {
        nomes.forEach(nome => {
          cy.excluirIdentificadorPixel(nome)
        })
      })
      break
    case 'termos':
      const formTermosDefault = {
        editorTexto: true,
        termosUsoTexto: '.',
        politicaPrivacidadeTexto: '.',
        salvarTermosPoliticaTexto: true
      }

      cy.acessarPgConfigOrganizacao()
      cy.preencherDadosConfigOrganizacao(formTermosDefault, 'termos')
      break
    case 'urlWebhooks':
      cy.acessarPgConfigOrganizacao('urlWebhooks')
      cy.listaConfigUrlWebhooks().then((configs) => {
        // Verifica se existem configurações para excluir
        if (configs.length > 0) {
            // Exclui cada configuração encontrada
            configs.forEach(config => {
                cy.excluirUrlWebhook(config.nomeFuncao, config.url)
            })
        }
    })
      break
    default:
      throw new Error(`Aba inválida: ${aba}. Utilize 'dados', 'customizacoes', 'certificado', 'integracoes', 'termos' ou 'urlWebhooks'`)
  }
})

Cypress.Commands.add('validarCertificadoGerado', (dadosGerarCertificado) => {
  const orgName = Cypress.env('orgName').replace(/ /g, '_')

  // Validação do nome do arquivo do certificado
  cy.get('.file-size')
      .contains('.label', `${Cypress.env('orgId')}-${orgName}.pdf`)
      .should('exist')

  // Mapeamento dos tamanhos de arquivo por imagem
  const tamanhosPorImagem = {
      'imagem_0.jpg': '1602 bytes',
      'imagem_1.jpg': '348689 bytes',
      'imagem_2.jpg': '285303 bytes',
      'imagem_3.jpg': '236988 bytes',
      'imagem_4.jpg': '212021 bytes',
      'imagem_5.jpg': '268280 bytes',
      'imagem_6.jpg': '110903 bytes',
      'imagem_7.jpg': '60988 bytes',
      'imagem_8.jpg': '226841 bytes',
      'imagem_9.jpg': '11045 bytes',
      'imagem_10.jpg': '163247 bytes',
  }

  let tamanho = tamanhosPorImagem[dadosGerarCertificado.selecionarImagem]

  // Validação do tamanho do arquivo
  cy.get('.file-size')
      .contains('.size', tamanho)
      .should('exist')
})

Cypress.Commands.add('listaPixels', () => {
  cy.get('body').then($body => {
    // Verifica se existe algum 'tr' dentro de 'tbody'
    if ($body.find('tbody tr').length > 0) {
      // Se existir, prossegue com a lógica
      return cy.get('tbody tr').then($trs => {
        const nomes = $trs.map((index, tr) => Cypress.$(tr).find('td').first().text()).get()
        return nomes
      })
    } else {
      // Se não, retorna um array vazio
      return []
    }
  })
})

Cypress.Commands.add('excluirIdentificadorPixel', (identificador) => {
  cy.get('body').then($body => {
    // Verifica se o identificador existe na página antes de tentar excluí-lo
    if ($body.find(`tbody tr:contains('${identificador}')`).length) {
      cy.get(`tbody tr:contains('${identificador}')`).within(() => {
        cy.get('a').contains('Excluir').click()
      })
      // Aguarda a exclusão ser processada, idealmente substituir por uma verificação de estado da página
      cy.wait(1000) // Considerar substituir por uma estratégia mais robusta
    } else {
      cy.log(`Identificador ${identificador} não encontrado.`)
    }
  })
})

Cypress.Commands.add('editarIdentificadorPixel', (identificador) => {
  cy.get('body').then($body => {
    // Verifica se o identificador existe na página antes de tentar editá-lo
    if ($body.find(`tbody tr:contains('${identificador}')`).length) {
      cy.get(`tbody tr:contains('${identificador}')`).within(() => {
        cy.get('a').contains('Editar').click()
      })
    } else {
      cy.log(`Identificador ${identificador} não encontrado.`)
    }
  })
})

Cypress.Commands.add('aceiteTermos', ()=> {
    cy.get('#agree_check')
    .click()

  cy.get('#next')
    .click()
})

Cypress.Commands.add('validarWebhook', (dadosWebhook) => {
  cy.get('div.url_webhook label[for="url"]')
    .should('have.text', dadosWebhook.urlWebhook)

  cy.get('div.url_webhook label[for="function"]')
    .should('have.text', dadosWebhook.funcionalidade)
})

Cypress.Commands.add('listaConfigUrlWebhooks', () => {
  cy.get('body').then($body => {
    // Verifica se existe algum elemento com a classe '.url_webhook' no corpo do documento
    if ($body.find('.url_webhook').length) {
      // Se existir, prossegue com a lógica de mapeamento
      return cy.get('.url_webhook').then($webhooks => {
        const configs = $webhooks.map((index, webhook) => {
          const nomeFuncao = Cypress.$(webhook).find('.col-md-3 label').text().trim()
          const url = Cypress.$(webhook).find('.col-md-7 label').text().trim()
          return {
            nomeFuncao,
            url
          };
        }).get()
        // Usa cy.wrap para retornar a lista de configurações de forma assíncrona
        return cy.wrap(configs)
      })
    } else {
      // Se não existir, usa cy.wrap para retornar uma lista vazia de forma assíncrona
      cy.log('Nenhuma configuração de URL de webhook encontrada.')
      return cy.wrap([])
    }
  })
})

Cypress.Commands.add('excluirUrlWebhook', (nomeFuncao, url) => {
  cy.get('.url_webhook').then($webhooks => {
    const webhookEspecifico = $webhooks.filter((index, webhook) => {
      const nomeFuncaoAtual = Cypress.$(webhook).find('.col-md-3 label').text()
      const urlAtual = Cypress.$(webhook).find('.col-md-7 label').text()
      return nomeFuncaoAtual === nomeFuncao && urlAtual === url
    })

    if (webhookEspecifico.length) {
      // Assume que o botão de excluir está sempre no último `.col-md-1`
      cy.wrap(webhookEspecifico).find('.col-md-1 .url_webhook_destroy').click()
      cy.contains('.flash.success', 'URL deletada com sucesso', { timeout: 5000 })
        .should('be.visible')
    } else {
      cy.log(`Configuração com nome ${nomeFuncao} e URL ${url} não encontrada.`)
    }
  })
})

Cypress.Commands.add('editarUrlWebhook', (nomeFuncao, url) => {
  cy.get('.url_webhook').then($webhooks => {
    const webhookEspecifico = $webhooks.filter((index, webhook) => {
      const nomeFuncaoAtual = Cypress.$(webhook).find('.col-md-3 label').text().trim()
      const urlAtual = Cypress.$(webhook).find('.col-md-7 label').text().trim()
      return nomeFuncaoAtual === nomeFuncao && urlAtual === url
    })

    if (webhookEspecifico.length) {
      // Assume que o botão de editar pode ser identificado de forma única
      cy.wrap(webhookEspecifico).find('.col-md-1 .url_webhook_edit').click()
    } else {
      cy.log(`Configuração com nome ${nomeFuncao} e URL ${url} não encontrada.`)
    }
  })
})

Cypress.Commands.add('preencherDadosTrial', (dados, opcoes = { limpar: false }) => {
  const formulario = new formTrial()

  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo]
    formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
})

Cypress.Commands.add('validarDadosTrial', (dados) => {
  const formulario = new formTrial()
  
  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

Cypress.Commands.add('registroTrial', () => { 
  // Clica no botão "Registre-se"
  cy.get('#register_button')
    .click()

  // Valida página do trial
  cy.url()
    .should('include', '/new/register')
})

Cypress.Commands.add('validarMsgTrial', (step, objetivo, nomeUsuario) => {
  const objetivoMap = {
    'Treinamento de colaboradores': 'treinamentoColaboradores',
    'Treinamento de clientes': 'treinamentoClientes',
    'Treinamento de parceiros': 'treinamentoParceiros',
    'Venda de cursos': 'vendaCursos',
    'Outro': 'outro'
  }

  const validarTextos = (textos) => {
    textos.forEach(({ seletor, texto }) => {
      cy.contains(seletor, texto).should('be.visible')
    })
  }

  const steps = {
    seusDados: () => {
      const { nomeStep, msgBemVindo, msgPreparado, msgSolicitaDados, texto1, texto2, texto3, texto4, texto5, texto6 } = Cypress.env('labels').trial.stepSeusDados
      validarTextos([
        { seletor: 'p.chakra-text', texto: nomeStep },
        { seletor: 'h1.chakra-heading', texto: msgBemVindo },
        { seletor: 'h2.chakra-heading', texto: msgPreparado },
        { seletor: 'p.chakra-text', texto: msgSolicitaDados },
        { seletor: 'span.chakra-text', texto: texto1 },
        { seletor: 'span.chakra-text', texto: texto2 },
        { seletor: 'b.chakra-text', texto: texto3 },
        { seletor: 'span.chakra-text', texto: texto4 },
        { seletor: 'b.chakra-text', texto: texto5 },
        { seletor: 'span.chakra-text', texto: texto6 },
      ])
    },
    dadosEmpresa: () => {
      const { nomeStep, tituloStepDadosEmpresa, texto1, texto2, texto3, texto4 } = Cypress.env('labels').trial.stepDadosEmpresa
      validarTextos([
        { seletor: 'p.chakra-text', texto: nomeStep },
        { seletor: 'h2.chakra-heading', texto: tituloStepDadosEmpresa },
        { seletor: 'span.chakra-text', texto: texto1 },
        { seletor: 'span.chakra-text', texto: texto2 },
        { seletor: 'span.chakra-text', texto: texto3 },
        { seletor: 'b.chakra-text', texto: texto4 },
      ])
    },
    perfilUso: () => {
      const { nomeStep, tituloStepPerfilUso, texto1, texto2, texto3 } = Cypress.env('labels').trial.stepPerfilUso
      validarTextos([
        { seletor: 'p.chakra-text', texto: nomeStep },
        { seletor: 'label.chakra-form__label', texto: tituloStepPerfilUso },
        { seletor: 'span.chakra-text', texto: texto1 },
        { seletor: 'span.chakra-text', texto: texto2 },
        { seletor: 'b.chakra-text', texto: texto3 },
      ])
    },
    usuarios: () => {
      const { nomeStep } = Cypress.env('labels').trial.stepUsuarios
      validarTextos([
        { seletor: 'p.chakra-text', texto: nomeStep },
      ])

      if (objetivo !== '') {
        const objetivosUsuarios = {
          treinamentoColaboradores: () => {
            const { tituloStepUsuarios, texto1, texto2 } = Cypress.env('labels').trial.stepUsuarios.treinamentoColaboradores
            validarTextos([
              { seletor: 'p.chakra-text', texto: tituloStepUsuarios },
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
            ])
          },
          treinamentoClientes: () => {
            const { tituloStepUsuarios, texto1, texto2, informativo1, informativo2 } = Cypress.env('labels').trial.stepUsuarios.treinamentoClientes
            validarTextos([
              { seletor: 'p.chakra-text', texto: tituloStepUsuarios },
              { seletor: 'p.chakra-text', texto: informativo1 },
              { seletor: 'p.chakra-text', texto: informativo2 },
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
            ])
          },
          treinamentoParceiros: () => {
            const { tituloStepUsuarios, texto1, texto2, informativo1, informativo2 } = Cypress.env('labels').trial.stepUsuarios.treinamentoParceiros
            validarTextos([
              { seletor: 'p.chakra-text', texto: tituloStepUsuarios },
              { seletor: 'p.chakra-text', texto: informativo1 },
              { seletor: 'p.chakra-text', texto: informativo2 },
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
            ])
          },
          vendaCursos: () => {
            const { tituloStepUsuarios, texto1, texto2, texto3, informativo1, informativo2 } = Cypress.env('labels').trial.stepUsuarios.vendaCursos
            validarTextos([
              { seletor: 'p.chakra-text', texto: tituloStepUsuarios },
              { seletor: 'p.chakra-text', texto: informativo1 },
              { seletor: 'p.chakra-text', texto: informativo2 },
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
              { seletor: 'span.chakra-text', texto: texto3 },
            ])
          },
          outro: () => {
            const { tituloStepUsuarios, texto1, texto2 } = Cypress.env('labels').trial.stepUsuarios.outro
            validarTextos([
              { seletor: 'p.chakra-text', texto: tituloStepUsuarios },
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
            ])
          },
        }

        const mappedObjetivo = objetivoMap[objetivo]
        if (mappedObjetivo && objetivosUsuarios[mappedObjetivo]) {
          objetivosUsuarios[mappedObjetivo]()
        } else {
          throw new Error(`Objetivo inválido: ${objetivo}. Utilize 'Treinamento de colaboradores', 'Treinamento de clientes', 'Treinamento de parceiros', 'Venda de cursos' ou 'Outro'`)
        }
      }
    },
    loginSenha: () => {
      const { nomeStep, tituloStepLoginSenha } = Cypress.env('labels').trial.stepLoginSenha
      validarTextos([
        { seletor: 'p.chakra-text', texto: nomeStep },
        { seletor: 'p.chakra-text', texto: tituloStepLoginSenha },
      ])

      if (objetivo !== '') {
        const objetivosLoginSenha = {
          treinamentoColaboradores: () => {
            const { texto1, texto2 } = Cypress.env('labels').trial.stepLoginSenha.treinamentoColaboradores
            validarTextos([
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
            ])
          },
          treinamentoClientes: () => {
            const { texto1, texto2 } = Cypress.env('labels').trial.stepLoginSenha.treinamentoClientes
            validarTextos([
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
            ])
          },
          treinamentoParceiros: () => {
            const { texto1, texto2 } = Cypress.env('labels').trial.stepLoginSenha.treinamentoParceiros
            validarTextos([
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
            ])
          },
          vendaCursos: () => {
            const { texto1, texto2, texto3 } = Cypress.env('labels').trial.stepLoginSenha.vendaCursos
            validarTextos([
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
              { seletor: 'span.chakra-text', texto: texto3 },
            ])
          },
          outro: () => {
            const { texto1, texto2 } = Cypress.env('labels').trial.stepLoginSenha.outro
            validarTextos([
              { seletor: 'span.chakra-text', texto: texto1 },
              { seletor: 'span.chakra-text', texto: texto2 },
            ])
          },
        }

        const mappedObjetivo = objetivoMap[objetivo]
        if (mappedObjetivo && objetivosLoginSenha[mappedObjetivo]) {
          objetivosLoginSenha[mappedObjetivo]()
        } else {
          throw new Error(`Objetivo inválido: ${objetivo}. Utilize 'Treinamento de colaboradores', 'Treinamento de clientes', 'Treinamento de parceiros', 'Venda de cursos' ou 'Outro'`)
        }
      }
    },
    finalizacao: () => {
      const { textoSucesso, textoEmail, textoCliqueAqui, textoReenviar } = Cypress.env('labels').trial.finalizacao
      validarTextos([
        { seletor: 'span.chakra-text', texto: nomeUsuario },
        { seletor: 'span.chakra-text', texto: textoSucesso },
        { seletor: 'p.chakra-text', texto: textoEmail },
        { seletor: 'u.chakra-text', texto: textoCliqueAqui },
        { seletor: 'p.chakra-text', texto: textoReenviar },
      ])
    }
  }

  if (steps[step]) {
    steps[step]()
  } else {
    throw new Error(`Step inválido: ${step}. Utilize 'seusDados', 'dadosEmpresa', 'perfilUso', 'usuarios', 'loginSenha', 'finalizacao'`)
  }
})

Cypress.Commands.add('preencherDadosCobrancaAutomatica', (conteudo, opcoes = { limpar: false }) => {
  const formulario = new formCobrancaAutomatica()
  
  Object.keys(conteudo).forEach(nomeCampo => {
      const valor = conteudo[nomeCampo]
      formulario.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

Cypress.Commands.add('validarDadosCobrancaAutomatica', (conteudo) => {
  const formulario = new formCobrancaAutomatica()

  Object.keys(conteudo).forEach(nomeCampo => {
    const valor = conteudo[nomeCampo] !== undefined ? conteudo[nomeCampo] : valorDefault
    formulario.validarCampo(nomeCampo, valor)
  })
})

Cypress.Commands.add('salvarCobrancaAutomatica', () => {
  const formulario = new formCobrancaAutomatica()
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.cobrancaInscricao.cobrancaAutomatica

  formulario.salvar()
  validarModalSubstCobranca()
  
  // Valida a mensagem de sucesso
  cy.contains('.chakra-alert__desc', msgSucesso)
    .should('be.visible')
})

Cypress.Commands.add('resetCobrancaAutomatica', () => {
  const formulario = new formCobrancaAutomatica()

  const dados = {
    radioAsaas: true,
    chaveAsaas: 'a',
    checkCartao: true, 
    checkPixBoleto: true,
    vencimentoBoleto: '3'
  }

  cy.acessarPgConfigCobrancaInscricao()
  cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: true })
  
  cy.reload()
  cy.preencherDadosCobrancaAutomatica(dados)

  // Desabilitar o "Pix e boleto"
  cy.preencherDadosCobrancaAutomatica({ checkPixBoleto: false})

  formulario.salvar()
  validarModalSubstCobranca()

  // Desabilitar a cobrança automática
  cy.preencherDadosCobrancaAutomatica({ habilitarCobrancaAutomatica: false })  
})

Cypress.Commands.add('validarModalSubstCobranca', () => {
  const seletorModal = 'section.chakra-modal__content'
  const seletorModalConfirmacao = '#payments-change-payment-method-save-button'
  const timeout = 3000
  
  // Se aparecer modal de confirmação, clica para confirmar
  cy.get('body', { timeout: timeout }).then($body => {
    if ($body.find(seletorModal).length > 0) {
      // Se o modal estiver presente, clica no botão de confirmação
      cy.get(seletorModalConfirmacao, { timeout: timeout })
        .click()
    }
  })
})

Cypress.Commands.add('adicionarCupomVoucher', (tipoDesconto) => {   
  const labels = Cypress.env('labels')
  const { breadcrumbTipo, tituloPg } = labels.cuponsVouchers

  formCuponsVouchers.adicionar()
  cy.preencherDadosCupomVoucher({ tipo: tipoDesconto })

  // Valida a página
  cy.get('#page-breadcrumb')
    .should('contain', breadcrumbTipo.replace('{{ tipo }}', tipoDesconto.toLowerCase()))
    .should('be.visible')

  cy.get('h2.chakra-heading')
    .should('contain', tituloPg)
    .should('be.visible')
})

Cypress.Commands.add('preencherDadosCupomVoucher', (dados, opcoes = { limpar: false }) => {   
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo]
      formCuponsVouchers.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

Cypress.Commands.add('validarDadosCupomVoucher', (dados, tipoDesconto) => {
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : formCuponsVouchers.elementos[nomeCampo].default
      formCuponsVouchers.validarCampo(nomeCampo, valor, tipoDesconto);
  });
});

Cypress.Commands.add('validarTabelaCupomVoucher', (dados, tipoDesconto) => {    
  Object.keys(dados).forEach(nomeCampo => {
    let valor = dados[nomeCampo]

    // Verifica se o campo é 'validade' e converte a data para o formato DD/MM/AAAA
    if (nomeCampo === 'validade') {
      valor = moment(valor, 'YYYY-MM-DD').format('DD/MM/YYYY')
    }

    formCuponsVouchers.validarTabela(nomeCampo, valor, tipoDesconto)
  })
})

Cypress.Commands.add('salvarCupomVoucher', (tipo, acao) => {    
  const labels = Cypress.env('labels')
  const { msgSucesso, msgSucessoEdicao } = labels.cuponsVouchers
  
  formCuponsVouchers.salvar()

  if (acao === 'salvar') {
    // Valida a mensagem de sucesso
    cy.contains('.chakra-alert__desc', msgSucesso.replace('{{ tipo }}', tipo))
      .should('be.visible')
  } else if ( acao === 'editar')
  // Valida a mensagem de sucesso na edição
  cy.contains('.chakra-alert__desc', msgSucessoEdicao.replace('{{ tipo }}', tipo))
    .should('be.visible')
})

Cypress.Commands.add('adicionarItemCupomVoucher', (tipo) => {   
  const labels = Cypress.env('labels')
  const { tituloModal, descricaoModal } = labels.cuponsVouchers.modalAplicadoItem
  
  formCuponsVouchers.adicionarItem()

  cy.get(formCuponsVouchers.elementos.tituloModal.seletor)
    .should('contain', tituloModal.replace('{{ tipo }}', tipo))
    .should('be.visible')

  cy.get(formCuponsVouchers.elementos.descricaoModal.seletor)
    .should('contain', descricaoModal.replace('{{ tipo }}', tipo.toLowerCase()))
    .should('be.visible')
})

Cypress.Commands.add('aplicarItemAoCupomVoucher', (nomeItem, tipoDesconto) => {   
  const labels = Cypress.env('labels')
  const { msgSucesso } = labels.cuponsVouchers.modalAplicadoItem
  
  if (Array.isArray(nomeItem)) {
    nomeItem.forEach(nome => {
      formCuponsVouchers.aplicarItens(nome)
    })
  } else {
    formCuponsVouchers.aplicarItens(nomeItem)
  }

  formCuponsVouchers.salvarItem()

  // Validar mensagem de sucesso
  cy.get('.chakra-alert__desc')
    .should('contain', msgSucesso.replace('{{ tipo }}', tipoDesconto))
})

Cypress.Commands.add('editarCupomVoucher', (nome) => {    
  const labels = Cypress.env('labels')
  const { breadcrumbEdicao, tituloPgEdicao } = labels.cuponsVouchers
  const seletor = `tr[data-item-name="${nome}"]`

  cy.get(seletor)
    .find(formCuponsVouchers.elementos.editar.seletor)
    .click()
  
  // Valida a página de edição
  cy.get('#page-breadcrumb')
    .should('contain', breadcrumbEdicao.replace('{{ nome }}', nome))
    .should('be.visible')

  cy.get('h2.chakra-heading')
    .should('contain', tituloPgEdicao.replace('{{ nome }}', nome))
    .should('be.visible')
})

Cypress.Commands.add('excluirCupomVoucher', (nome, tipo) => {   
  const labels = Cypress.env('labels')
  const { tituloModal, descricaoModal, msgSucesso } = labels.cuponsVouchers.modalExclusao
  const seletor = `tr[data-item-name="${nome}"]`

  cy.get(seletor)
    .find(formCuponsVouchers.elementos.excluir.seletor)
    .click()

  // Valida a mensagem de exclusão
  cy.get(formCuponsVouchers.elementos.tituloModalExclusao.seletor)
    .should('contain', tituloModal)
    .should('be.visible')

  cy.get(formCuponsVouchers.elementos.descricaoModalExclusao.seletor)
    .should('contain', descricaoModal)
    .should('be.visible')

  // Confirma a exclusão
  formCuponsVouchers.confirmarExclusao()

  // Valida a mensagem de sucesso da exclusão
  cy.get('.chakra-alert__desc')
    .should('contain', msgSucesso.replace('{{ tipo }}', tipo))
    .should('be.visible')
})

Cypress.Commands.add('excluirTodosCuponsVouchers', () => {    
  const labels = Cypress.env('labels')
  const { msgNenhumResultado } = labels.cuponsVouchers
  const listaCuponsVouchers = []
  
  cy.get('tbody').then($tbody => {
    if ($tbody.find(`tr:contains(${msgNenhumResultado})`).length > 0) {
      return listaCuponsVouchers
    } else {
      cy.get('tbody tr').each($row => {
        const cupomVoucher = {}
        cy.wrap($row).find('td.coupons-name-data').invoke('text').then((text) => {
          cupomVoucher.nome = text.trim()
        })
        cy.wrap($row).find('td.coupons-discount_type-data').invoke('text').then((text) => {
          cupomVoucher.tipo = text.trim()
        }).then(() => {
          listaCuponsVouchers.push(cupomVoucher)
        })
      }).then(() => {
        return listaCuponsVouchers
      })
    }
  }).then((listaCuponsVouchers) => {
    listaCuponsVouchers.forEach(({ nome, tipo }) => {
      cy.excluirCupomVoucher(nome, tipo)

      cy.get('div[role="alert"]#success-toast button[aria-label="Close"]').click()
    })
  })
})

Cypress.Commands.add('acessarPgIntegracoes', function() {
  cy.visit(`/o/${Cypress.env('orgId')}/integrations?tab=api_tokens`)

  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.integracoes

  // Verificar se a página de integrações foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

Cypress.Commands.add('adicionarChaveApi', function() {
  const labels = Cypress.env('labels')
  const { breadcrumbAdicionar, tituloAdicionar } = labels.integracoes

  formIntegracoes.adicionarChave()

  // Verificar se a página de adicionar chave foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumbAdicionar)
    .should('be.visible')

  cy.contains('h2.chakra-heading', tituloAdicionar)
    .should('be.visible')
})

Cypress.Commands.add('preencherIntegracaoApi', (dados, opcoes = { limpar: true }) => {
  Object.keys(dados).forEach(nomeCampo => {
      const valor = dados[nomeCampo]
      formIntegracoes.preencherCampo(nomeCampo, valor, opcoes)
  })
}) 

Cypress.Commands.add('salvarChaveApi', function(acao) {
  const TIMEOUT_PADRAO = 5000
  const labels = Cypress.env('labels')
  const { msgSucessoCriacao, msgSucessoEdicao } = labels.integracoes

  formIntegracoes.salvarChave()

  if (acao === 'Criação') {
    cy.contains('#toast-success-toast-title', msgSucessoCriacao, { timeout: TIMEOUT_PADRAO })
      .should('be.visible')
  } else if (acao === 'Edição') {
    cy.contains('#toast-success-toast-title', msgSucessoEdicao, { timeout: TIMEOUT_PADRAO })
      .should('be.visible')
  }
})

Cypress.Commands.add('validarTabelaIntegracoes', (nome, situacao, acao) => {
  const seletor = formIntegracoes.elementos.linhaTabela.seletor(nome)

  switch (acao) {
    case 'Exclusão':
      cy.get('body').then($body => {
        if ($body.find(seletor).length > 0) {
          cy.get(seletor).should('not.exist')
        }
      })
      break

    case 'Criação':
      cy.get(seletor).should('exist').and('be.visible')
      switch (situacao) {
        case 'Ativada':
          cy.get(seletor).find('span[data-checked]').should('exist')
          break

        case 'Desativada':
          cy.get(seletor).find('span[data-checked]').should('not.exist')
          break

        default:
          throw new Error(`Situação desconhecida: ${situacao}`)
      }
      break

    default:
      throw new Error(`Ação desconhecida: ${acao}`)
  }
})

Cypress.Commands.add('editarChave', (nomeChave) => {
  const labels = Cypress.env('labels')
  const { breadcrumbEditar, tituloEditar } = labels.integracoes

  cy.get(formIntegracoes.elementos.linhaTabela.seletor(nomeChave)).within(() => {
    formIntegracoes.editarChave()
  })

  // Verificar se a página de edição de chave foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumbEditar)
    .should('be.visible')

  cy.contains('h2.chakra-heading', tituloEditar)
    .should('be.visible')
  // formIntegracoes.expandirSelectUsuario()
})

Cypress.Commands.add('validarDadosIntegracoes', (dados) => {
  Object.keys(dados).forEach(nomeCampo => {
    const valor = dados[nomeCampo] !== undefined ? dados[nomeCampo] : valorDefault
    formIntegracoes.validarCampo(nomeCampo, valor)
  })
})

Cypress.Commands.add('excluirChave', (nomeChave) => {
  const labels = Cypress.env('labels')
  const { tituloModalExclusao, textoModalExclusao, msgSucessoExclusao} = labels.integracoes
  
  cy.get(formIntegracoes.elementos.linhaTabela.seletor(nomeChave)).within(() => {
    formIntegracoes.exclusaoDeChave()
  })

  // Validar modal de confirmação de exclusão
  cy.contains('.chakra-modal__header', tituloModalExclusao)
    .should('be.visible')

  cy.contains('.chakra-modal__body', textoModalExclusao)
    .should('be.visible')

  formIntegracoes.confirmacaoExclusaoDeChave()

  // Validar mensagem de sucesso
  cy.contains('.chakra-alert__desc', msgSucessoExclusao)
    .should('be.visible')
})

Cypress.Commands.add('alterarSituacaoChave', (nomeChave, situacao) => {
  const labels = Cypress.env('labels')
  const { msgChaveAtivada, tituloModalInativar, textoModalInativar, msgChaveInativada } = labels.integracoes
  
  cy.get(formIntegracoes.elementos.linhaTabela.seletor(nomeChave)).within(() => {
    cy.get(formIntegracoes.elementos.situacao.seletor).find('input[type="checkbox"]').then($checkbox => {
      const isChecked = $checkbox.is(':checked')
      const estadoAtual = isChecked ? 'Ativo' : 'Inativo'
  
      // Comparar o estado atual com o estado desejado
      if (estadoAtual !== situacao) {
        // Clicar no toggle switch para alterar o estado
        cy.get(formIntegracoes.elementos.situacao.seletorValor)
          .click()
        
        if (situacao === 'Ativo') {
          // Validar mensagem de sucesso
          cy.contains('#activate-toast', msgChaveAtivada)
            .should('be.visible')
        } else if (situacao === 'Inativo') {
          // Validar modal de confirmação de inativação
          cy.contains('.chakra-modal__header', tituloModalInativar)
            .should('be.visible')
      
          cy.contains('.chakra-modal__body', textoModalInativar)
            .should('be.visible')
      
          formIntegracoes.confirmacaoInativacao()
      
          // Validar mensagem de sucesso
          cy.contains('.chakra-alert__desc', msgChaveInativada)
            .should('be.visible')
        }
      }
  })

  })
})

Cypress.Commands.add('excluirTodasChavesApi', () => {
  const labels = Cypress.env('labels')
  const { nenhumResultado } = labels.integracoes
  const nomesChavesIntegracao = []

  // Verifica se a página não contém resultados
  cy.get('body').then(($body) => {
    if ($body.find(`p:contains("${nenhumResultado}")`).length > 0) {
      // Se não houver resultados, não há chaves para excluir
    } else {
      // Seleciona todos os elementos que contêm os nomes das chaves
      cy.get('.tokens-name-data').each(($el) => {
        nomesChavesIntegracao.push($el.text())
      }).then(() => {
        // Após coletar todos os nomes das chaves, iterar sobre eles para exclusão
        Cypress._.each(nomesChavesIntegracao, (nome) => {
          cy.excluirChave(nome)
        })
      })
    }
  })
})
