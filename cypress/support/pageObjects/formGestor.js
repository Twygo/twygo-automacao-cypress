class formGestor{
    elementos = {
        mudarStatusGestao: {
            seletor: "a[title='Mudar status da permissão']",
            tipo: 'button'
        },
        transferirGestor: {
            seletor: '.icon-external-link',
            tipo: 'button'
        },
        removerAcessoGestor: {
            seletor:'.icon-times',
            tipo: 'button'
        },
        filtro: {
            seletor: '#filter-button',
            tipo: 'button'
        },
        fecharFiltro: {
            seletor: '#twygo-modal-close',
            tipo: 'button'
        },
        nomeFiltro: {
            seletor: "input[aria-describedby='select2-filterName-container']",
            tipo: 'select'
        },
        areaFiltro: {
            seletor: "input[aria-describedby='select2-data-filterDepartment']",
            tipo: 'select'
        },
        cargoFiltro: {
            seletor: "input[aria-describedby='select2-filterRole-container']",
            tipo: 'select'
        },
        empresaFiltro: {
            seletor: "input[aria-describedby='select2-filterEnterprise-container']",
            tipo: 'select'
        },
        cpfFiltro: {
            seletor: "input[aria-describedby='select2-filterCPF-container']",
            tipo: 'select'
        },
        filtrar: {
            seletor: '#filterClassManagers',
            tipo: 'button'
        },
        limparFiltro:  {
            seletor: '#clearFilterDashboard',
            tipo: 'button'
        }
    }
    

    vincularGestor(nomeGestor) {
        cy.get('div.class-manager-assignment.not_assigned')
            .get(`td:contains('${nomeGestor}')`)
            .parents('tr')
            .find(this.elementos.mudarStatusGestao.seletor)
            .click()
    }

    desvincularGestor(nomeGestor) {
        cy.get('div.class-manager-assignment.assigned')
            .get(`td:contains('${nomeGestor}')`)
            .parents('tr')
            .find(this.elementos.mudarStatusGestao.seletor)
            .click()
    }
}
export default new formGestor