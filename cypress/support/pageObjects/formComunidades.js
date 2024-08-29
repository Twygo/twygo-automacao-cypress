class formComunidades{
	// Mapeamento de elementos da tela de criação de comentários da comunidade (Edição de Espaço)
    elementos = {
        nomeDaComunidade:{
			seletor: '#community_name',
			tipo: 'input'
		},
        trocarImagem:{
			seletor: '#community_logo',
			tipo: 'button'
		},
        habilitarChatNaComunidade:{
			seletor: '#community_enable_twygo_chat',
			tipo: 'checkbox'
		},
        tagsRelacionadas:{
			seletor: '#add_categories2',
			tipo: 'input'
		},
		btnCriarComunidade:{
            seletor: '.btn-create-community',
            tipo: 'button'
		},
        btnVoltar:{
            seletor: '.btn btn-default btn-back',
            tipo: 'button'
        },
        btnSalvar:{
            seletor: '#submit-news',
            tipo: 'button'
        },
        btnAdicionarTag:{
            seletor: '#categories2',
            tipo: 'button'
        },
        btnEditarTag:{
            seletor: '.remove_category',
            tipo: 'button'
        },
        btnRemoverTag:{
            seletor: '.edit_category',
            tipo: 'button'
        },
        btnVerTodas:{
            seletor: '#see-all-communities',
            tipo: 'button'
        },
        btnAcessar:{
            seletor: '.btn btn-primary btn-sm',
            tipo: 'button'
        }
	}
}
export default new formComunidades