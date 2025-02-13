class listaConteudos {
    elementos = {
        // Campo de pesquisa
        pesquisar: () => cy.get('#play-interest-search'),
        
        // Botões de ação principais
        btnAdicionar: () => cy.get('[data-id="add-button"]'),
        btnExtrairDados: () => cy.get('#data-export-button'),
        btnFiltro: () => cy.get('#open-filter'),
        
        // Elementos da tabela
        tabelaConteudos: () => cy.get('.chakra-table'),
        linhasTabelaConteudos: () => cy.get('.chakra-table tbody tr'),
        
        // Colunas da tabela
        colunaTipo: () => cy.get('[id^="td-kind-"]'),
        colunaNome: () => cy.get('[id^="td-name-"]'),
        colunaEquipe: () => cy.get('[id^="td-team_data-"]'),
        colunaPublicacao: () => cy.get('[id^="td-publication_date-"]'),
        colunaInscricoes: () => cy.get('[id^="td-events_participants_all-"]'),
        colunaSituacao: () => cy.get('[id^="td-situation-"]'),
        
        // Botões de ação por linha
        btnAcoes: () => cy.get('[id^="menu-button-"]'),
        menuAcoes: () => cy.get('.chakra-menu__menu-list'),
        btnEditar: () => cy.get('.chakra-menu__menuitem').contains('Editar'),
        btnExcluir: () => cy.get('.chakra-menu__menuitem').contains('Excluir'),
        
        // Paginação
        paginacao: () => cy.get('.css-1winx4k'),
        selectItensPorPagina: () => cy.get('#select_pages'),
        
        // Modal de exclusão
        modalExcluir: () => cy.get('.chakra-modal__content'),
        tituloModalExcluir: () => cy.get('.chakra-modal__header'),
        descricaoModalExcluir: () => cy.get('.chakra-modal__body'),
        btnConfirmarExclusao: () => cy.get('#events-delete-confirm-button'),
        mensagemSucesso: () => cy.get('.chakra-toast')
    }

    pesquisarConteudo(titulo) {
        this.elementos.pesquisar()
            .type(titulo)
            .type('{enter}')
    }

    clicarAdicionar() {
        this.elementos.btnAdicionar().click()
    }

    clicarExtrairDados() {
        this.elementos.btnExtrairDados().click()
    }

    clicarFiltro() {
        this.elementos.btnFiltro().click()
    }

    abrirMenuAcoes(index) {
        this.elementos.btnAcoes().eq(index).click()
    }

    validarConteudoNaTabela(nomeConteudo, tipoConteudo) {
        // Aguarda a tabela ser carregada
        this.elementos.tabelaConteudos().should('be.visible')
        
        // Pesquisa o conteúdo específico
        this.pesquisarConteudo(nomeConteudo)
        
        // Valida que existe apenas 1 registro
        this.elementos.linhasTabelaConteudos()
            .should('have.length', 1)
        
        // Valida o nome do conteúdo
        this.elementos.colunaNome()
            .should('contain', nomeConteudo)
        
        // Valida o tipo do conteúdo
        this.elementos.colunaTipo()
            .should('contain', tipoConteudo)
    }

    editarConteudo(nomeConteudo) {
        this.elementos.linhasTabelaConteudos()
            .contains(nomeConteudo)
            .parents('tr')
            .within(() => {
                this.elementos.btnAcoes().click()
                this.elementos.btnEditar().click({ force: true })
            })
    }

    excluirConteudo(nomeConteudo, tipoConteudo) {
        cy.fixture('labels').then(labels => {
            const textos = labels.conteudo[tipoConteudo]

            // Localiza a linha do conteúdo e clica em excluir
            this.elementos.linhasTabelaConteudos()
                .contains(nomeConteudo)
                .parents('tr')
                .within(() => {
                    this.elementos.btnAcoes().click()
                    this.elementos.btnExcluir().click({ force: true })
                })

            // Valida o modal de exclusão
            this.elementos.modalExcluir()
                .should('be.visible')
            
            // Valida título e textos do modal
            this.elementos.tituloModalExcluir()
                .should('contain', textos.tituloModalExclusao)
            
            this.elementos.descricaoModalExcluir()
                .should('contain', textos.texto1ModalExclusao)

            // Confirma a exclusão
            this.elementos.btnConfirmarExclusao()
                .should('be.visible')
                .click()

            // Valida mensagem de sucesso
            this.elementos.mensagemSucesso()
                .should('contain', textos.msgSucessoExclusao)

            // Verifica se o conteúdo foi excluído
            this.elementos.linhasTabelaConteudos()
                .contains(nomeConteudo)
                .should('not.exist')
        })
    }
}

export default new listaConteudos