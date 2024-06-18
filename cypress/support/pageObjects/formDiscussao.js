class formDiscussao{
	// Mapeamento de elementos da tela de criação de noticias (Edição de Espaço)
	elementos = {
		titulo:{
			seletor: '#community_discussion_title',
			tipo: 'input'
		},
		conteudo:{
			seletor: '#cke_community_discussion_content.cke_inner cke_reset.cke_contents cke_reset',
			tipo: 'iframe'
		},
		comunidades:{
			seletor: '#community_discussion_community',
			tipo: 'input'
		},
		btnSalvar: {
            seletor: '#save',
            tipo: 'button'
        },
		btnVoltar: {
            seletor: '#details-title.back-container.btn btn-default btn-back waves-effect',
            tipo: 'anchor'
        }


	}

}
export default new formDiscussao