class listaConteudos {
    elementos = {
        pesquisar: () => cy.get('#eventsTitle')
    }

    pesquisarConteudo(titulo) {
        this.elementos.pesquisar()
            .type(titulo)
            .type('{enter}')
    }
}
export default new listaConteudos();