class formComentariosComunidade{
	// Mapeamento de elementos da tela de criação de comentários da comunidade (Edição de Espaço)


	elementos = {
		comentario:{
            seletor: 'textarea[name="text_comment"]',
            tipo: 'textarea'
		},
        btnAdicionarComentario: {
            seletor: 'div#comment i.pointer far fa-comment',
            tipo: 'i'
        },
		btnVerComentarios: {
            seletor: 'a.pointer i.fas fa-sort-down',
            tipo: 'i'
        },
        btnFecharComentarios: {
            seletor: 'a.pointer i.fas fa-sort-down open',
            tipo: 'i'
        },
        btnPublicar: {
            seletor: '.button btn btn-primary waves-effect',
            tipo: 'button'
        }

	}

}
export default new formComentariosComunidade