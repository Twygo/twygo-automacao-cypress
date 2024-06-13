class formNavegacao{
	// Mapeamento de elementos da tela de criação de navegação (Edição de Espaço)
    elementos = {
        filtro:{
            seletor: '#use_mode_title_search',
			tipo: 'input'
        },
        modoDeUsoTitutlo:{
            seletor: '#use_mode_title',
			tipo: 'input' 
        },
        paginaInicial:{
            seletor: '#icon_to_home_0',
			tipo: 'i' 
        },
        menuHabilitado:{
            seletor: '#is-disabled-checkbox-0',
			tipo: 'input' 
        },
        btnAdicionar:{
			seletor: '#add_use_mode',
			tipo: 'button'
		},
        btnFiltro:{
            seletor: '.icon-search-1',
			tipo: 'i'
        },
        btnPadrao:{
            seletor: 'input[name="radio_default_use_mode"]',
			tipo: 'input'
        },
        btnEditar:{
            seletor: '.fas fa-edit to-home-index',
			tipo: 'i'
        },
        btnExcluir:{
            seletor: '.fas fa-trash-alt to-home-index',
			tipo: 'i'
        },
        btnVoltar:{
            seletor: '.btn btn-default btn-back waves-effect',
			tipo: 'anchor'
        },
        btnSalvar:{
            seletor: '#save',
			tipo: 'button'
        },
        btnCancelar:{
            seletor: '.cancel-button btn btn-cancel',
			tipo: 'button'
        }
	}
}

export default new formNavegacao