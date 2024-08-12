class formHome {
    elementos = {
        btnProfile: {
            seletor: '#btn-profile'
        },
        administrador: {
            seletor: '#admin-profile'
        },
        instrutor: {
            seletor: '#instructor-profile'
        },
        gestor: {
            seletor: '#manager-profile'
        },
        aluno: {
            seletor: '#student-profile'
        },
        pgInicial: {
            seletor: '#page-breadcrumb'
        },
        pgInicialAluno: {
            seletor: '#page-breadcrumb'
        },
        breadcrumb: {
            seletor: '#page-breadcrumb'
        },
        name: {
            seletor: '.name'
        }
    }

    clicarPerfil() {
        cy.get(this.elementos.btnProfile.seletor)
            .should('be.visible')
            .click()
    }

    alterarPerfil(perfil) {
        cy.get(`#${perfil}-profile`)
            .should('be.visible')
            .click()
    }
}
export default new formHome