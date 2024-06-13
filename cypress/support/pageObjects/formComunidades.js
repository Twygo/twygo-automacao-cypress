class formComunidades{
	// Mapeamento de elementos da tela de criação de comentários da comunidade (Edição de Espaço)
    elementos = {
        nomeDaComunidade:{
			seletor: '#community_name',
			tipo: 'input'
		},
        trocarImagem:{
			seletor: '#community_logo',
			tipo: 'input'
		},
        habilitarChatNaComunidade:{
			seletor: '#community_enable_twygo_chat',
			tipo: 'input'
		},
        tagsRelacionadas:{
			seletor: '#add_categories2',
			tipo: 'input'
		},
		btnCriarComentario:{
            seletor: '.btn-create-community',
            tipo: 'anchor'
		},
        btnVoltar:{
            seletor: '.btn btn-default btn-back',
            tipo: 'i'
        },
        btnSalvar:{
            seletor: '#submit-news',
            tipo: 'button'
        },
        btnAdicionarTag:{
            seletor: '#categories2',
            tipo: 'anchor'
        },
        btnEditarTag:{
            seletor: '.remove_category',
            tipo: 'anchor'
        },
        btnRemoverTag:{
            seletor: '.edit_category',
            tipo: 'anchor'
        },
        btnVerTodas:{
            seletor: '#see-all-communities',
            tipo: 'anchor'
        },
        btnAcessar:{
            seletor: '.btn btn-primary btn-sm',
            tipo: 'anchor'
        }
	}
}

export default new formComunidades