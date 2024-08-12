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
import formCobrancaAutomatica from "./pageObjects/formCobrancaAutomatica"
import formCuponsVouchers from "./pageObjects/formCuponsVouchers"
import formIntegracoes from "./pageObjects/formIntegracoes"
import formRegistreSe from "./pageObjects/formRegistreSe"
import formSuperAdmin from "./pageObjects/formSuperAdmin"
import formHome from "./pageObjects/formHome"
import formLogin from "./pageObjects/formLogin"
import listaConteudos from "./pageObjects/listaConteudos"
import comunicacao from "./pageObjects/comunicacao"
import { fakerPT_BR } from "@faker-js/faker"
import 'cypress-real-events/support'
import moment from 'moment'
import { verificarPerfilENomeUsuario } from "./utilsHelper.js"

/**
* @description Realiza o login no Twygo com o usuário de automação e altera para perfil administrador
*/
Cypress.Commands.add('loginTwygoAutomacaoAdm', () => {
    let labels = Cypress.env('labels')[pt]
    const { pgInicialAluno, btnProfile } = labels.configUsuario
  
    // :: Login ::
    cy.log(':: Login Twygo Automação ::')

    formLogin.login()
  
    cy.get(formLogin.elementos.login.seletor)
        .type(Cypress.env('login'))
    
    cy.get(formLogin.elementos.senha.seletor)
        .type(Cypress.env('password'))
  
    formLogin.entrar()
  
    // :: Verifica se o login foi realizado com sucesso ::
    cy.log(':: Verifica se o login foi realizado com sucesso ::')

    cy.contains(formHome.elementos.breadcrumb.seletor, pgInicialAluno)
        .should('be.visible')
  
    cy.contains(formHome.elementos.name.seletor, Cypress.env('username'))
        .should('be.visible')
  
    cy.contains(formHome.elementos.btnProfile.seletor, btnProfile)
        .should('be.visible')

    // :: Altera perfil para administrador ::
    cy.log(':: Altera perfil para administrador ::')

    labels = Cypress.env('labels')
    const { administrador, pgInicial } = labels.perfil
    
    formHome.clicarPerfil()

    formHome.alterarPerfil(admin)
    
    // :: Verifica se o perfil foi alterado com sucesso ::
    cy.log(':: Verifica se o perfil foi alterado com sucesso ::')

    cy.contains(formHome.elementos.btnProfile.seletor, administrador)
        .should('be.visible')

    cy.contains(formHome.elementos.breadcrumb.seletor, pgInicial)
        .should('be.visible')
})
  