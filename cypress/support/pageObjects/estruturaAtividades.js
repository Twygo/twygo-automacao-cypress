class estruturaAtividades {
    elementos = {
        btnAddAtividade: () => cy.get('.create_content_btn'),
        btnCopiarAtividade: () => cy.get('.copy_content_btn'),
        btnSalvar: () => cy.get('.save_list'),
        recalcularProgresso: () => cy.get('a.btn.btn-default.waves-effect').contains('Recalcular progresso'),
        confirmarRecalcularProgresso: () => cy.get('#modal-confirm-event_contents-confirmed')
    }

    adicionarAtividade() {
        this.elementos.btnAddAtividade()
            .click()
    }

    salvarAtividade() {
        this.elementos.btnSalvar()
            .click()
    }

    copiarAtividade() {
        this.elementos.btnCopiarAtividade()
            .click()
    }

    recalcularProgresso() {
        this.elementos.recalcularProgresso()
            .click()
    }

    confirmarRecalcularProgresso() {
        this.elementos.confirmarRecalcularProgresso()
            .click()
    }
}
export default new estruturaAtividades