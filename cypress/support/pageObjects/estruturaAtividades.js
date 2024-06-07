class estruturaAtividades {
    elementos = {
        btnAddAtividade: () => cy.get('.create_content_btn'),
        btnCopiarAtividade: () => cy.get('.copy_content_btn'),
        btnSalvar: () => cy.get('.save_list')
    }

    adicionarAtividade() {
        this.elementos.btnAddAtividade().click()
    }

    salvarAtividade() {
        this.elementos.btnSalvar().click()
    }

    copiarAtividade() {
        this.elementos.btnCopiarAtividade().click()
    }
}
export default new estruturaAtividades