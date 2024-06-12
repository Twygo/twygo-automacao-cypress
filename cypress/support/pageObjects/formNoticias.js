class formNoticias {
	// Mapeamento de elementos da tela de criação de noticias (Edição de Espaço)
	elementos = {
		tituloDaNoticia:{
			seletor: '#community_newsletter_title',
			tipo: 'input'
		},
		conteudoDaNoticia: {
			seletor: '#cke_community_newsletter_content.cke_wysiwyg_frame cke_reset',
			tipo: 'iframe'
		},
		imagemEmDestaque: {
			seletor: '#community_newsletter_banner',
			tipo: 'input'
		},
		tagsRelacionadas: {
			seletor: '#add_categories2',
			tipo: 'input'
		},
		btnTagsRelacionadas: {
			seletor: '#categories2',
			tipo: 'anchor'
		},
		
		btnEditTagsRelacionadas: {
			seletor: '.remove_category',
			tipo: 'anchor'
		},
		btnExcluirTagsRelacionadas: {
			seletor: '.edit_category',
			tipo: 'anchor'
		},

		btnSalvar: {
            seletor: '#submit-news',
            tipo: 'button'
        },
		btnVoltar: {
            seletor: '#details-title.back-container.btn btn-default btn-back waves-effect',
            tipo: 'anchor'
        }


	}

}
export default new formNoticias