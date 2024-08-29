class formComentariosComunidade{
	// Mapeamento de elementos da tela de criação de comentários da comunidade (Edição de Espaço)
	elementos = {
		comentario:{
            seletor: 'textarea[name="text_comment"]',
            tipo: 'input'
		},
        btnAdicionarComentario: {
            seletor: 'div#comment i.pointer far fa-comment',
            tipo: 'button'
        },
		btnVerComentarios: {
            seletor: 'a.pointer i.fas fa-sort-down',
            tipo: 'button'
        },
        btnFecharComentarios: {
            seletor: 'a.pointer i.fas fa-sort-down open',
            tipo: 'button'
        },
        btnPublicar: {
            seletor: '.button btn btn-primary waves-effect',
            tipo: 'button'
        }
	}
}
export default new formComentariosComunidade