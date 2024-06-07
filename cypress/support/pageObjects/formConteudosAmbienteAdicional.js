class formConteudosAmbienteAdicional {
    elementos = {
        compartilhar: {
            seletor: 'span[aria-hidden="true"]',
            tipo: 'checkbox'
        },
        salvarCompartilhamento: {
            seletor: '#partner-list-save',
            tipo: 'button'
        }
    }

    compartilhar() {
        cy.get(this.elementos.compartilhar.seletor)
            .click({ force: true })
    }

    salvarCompartilhamento() {
        cy.get(this.elementos.salvarCompartilhamento.seletor)
            .click()
    }
}
export default new formConteudosAmbienteAdicional