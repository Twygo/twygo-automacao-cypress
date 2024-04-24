class formConfigUsuario {
    elementos = { 
        email: {
            seletor: '#user_email',
            tipo: 'input'
        },
        nome: {
            seletor: '#user_first_name',
            tipo: 'input'
        },
        sobrenome: {
            seletor: '#user_last_name',
            tipo: 'input'
        },
        cpf: {
            seletor: '#user_cpf',
            tipo: 'input'
        },
        rg: {
            seletor: '#user_rg',
            tipo: 'input'
        },
        telPessoal: {
            seletor: '#user_phone1',
            tipo: 'input'
        },
        celular: {
            seletor: '#user_cell_phone',
            tipo: 'input'
        },
        idioma: {
            seletor: '#user_language',
            tipo: 'select'
        },
        cep: {
            seletor: '#user_zip_code',
            tipo: 'input-zipcode'
        },
        endereco: {
            seletor: '#user_address',
            tipo: 'input-endereco'
        },
        numero: {
            seletor: '#user_address_number',
            tipo: 'input'
        },
        complemento: {
            seletor: '#user_address2',
            tipo: 'input'
        },
        bairro: {
            seletor: '#user_district',
            tipo: 'input'
        },
        cidade: {
            seletor: '#user_city',
            tipo: 'input'
        },
        estado: {
            seletor: '#user_state',
            tipo: 'input'
        },
        pais: {
            seletor: '#user_country',
            tipo: 'input'
        },
        empresa: {
            seletor: '#user_enterprise',
            tipo: 'input'
        },
        site: {
            seletor: '#user_site',
            tipo: 'input'
        },
        telComercial: {
            seletor: '#user_phone2',
            tipo: 'input'
        },
        cargo: {
            seletor: '#user_role',
            tipo: 'input'
        },
        nrColaboradores: {
            seletor: '#user_number_of_employees',
            tipo: 'select'
        },
        ramo: {
            seletor: '#user_business_line',
            tipo: 'input'
        },
        senhaAtual: {
            seletor: '#user_current_password',
            tipo: 'input'
        },
        novaSenha: {
            seletor: '#user_password',
            tipo: 'input'
        },
        confirmarSenha: {
            seletor: '#user_password_confirmation',
            tipo: 'input'
        }
    }

    /** DOCUMENTAÇÃO:
     * @name preencherCampo
     * 
     * @description
     * Método para preencher campos de um formulário
     * 
     * @actions
     * 1. Verifica se o campo existe
     * 2. Verifica se o campo deve ser limpo antes de preencher
     * 3. Preenche o campo de acordo com o tipo
     * 
     * @param {string} nomeCampo - Nome do campo a ser preenchido
     * @param {string} valor - Valor a ser preenchido no campo
     * @param {object} opcoes - Opções para definir se o campo deve ser limpo antes de preencher
     * 
     * @example
     * preencherCampo('nome', 'Nome do Evento')
     * 
     * @throws {Error} - Caso o campo não seja encontrado
     * @throws {Error} - Caso o tipo do campo não seja suportado
     * @throws {Error} - Caso o campo não possa ser preenchido com o valor informado
     * 
     * @author Karla Daiany
     * @version 1.0.0
     * @since 1.0.0
     */
    preencherCampo(nomeCampo, valor, opcoes = { limpar: false }) {
        const campo = this.elementos[nomeCampo]

        if (!campo) {
            throw new Error(`Campo ${nomeCampo} não encontrado`)
        }

        const { seletor, tipo, default: valorDefault } = campo

        let valorFinal = valor !== undefined ? valor : valorDefault

        if (opcoes.limpar && tipo === 'input') {
            cy.get(seletor)
                .clear()
            if (valorFinal === '') {
                return
            }
        }

        if (valorFinal === '' && tipo === 'input') {
            cy.get(seletor)
                .clear()
        } else if (valorFinal !== undefined) {
            switch (tipo) {
                case 'input-zipcode':
                    cy.get(seletor)
                        .clear()
                        .type(valorFinal)
                        .wait(2000)
                    break
                case 'input-endereco':
                    cy.get(seletor)
                        .click()
                        .clear()
                        .wait(2000)
                        .type(valorFinal, {delay: 200})
                    break
                case 'input':
                    cy.get(seletor)
                        .type(valorFinal)
                    break
                case 'select':
                    cy.get(seletor)
                        .select(valorFinal)
                    break
                case 'input-email':
                    // Não é necessária nenhuma ação pois o campo fica bloqueado
                    break
                default:
                    throw new Error(`Tipo de campo ${tipo} não suportado`)
            }
        } else {
            throw new Error(`Campo ${nomeCampo} não pode ser preenchido com valor ${valorFinal}`)
        }
    }

    /** DOCUMENTAÇÃO:
     * @name validarCampo
     * 
     * @description
     * Método para validar campos de um formulário
     * 
     * @actions
     * 1. Verifica se o campo existe
     * 2. Valida o campo de acordo com o tipo
     * 
     * @param {string} nomeCampo - Nome do campo a ser validado
     * @param {string} valor - Valor a ser validado no campo
     * 
     * @example
     * validarCampo('nome', 'Nome do Evento')
     * 
     * @throws {Error} - Caso o campo não seja encontrado
     * @throws {Error} - Caso o tipo do campo não seja suportado
     * 
     * @author Karla Daiany
     * @version 1.0.0
     * @since 1.0.0
     */
    validarCampo(nomeCampo, valor) {
        const campo = this.elementos[nomeCampo]

        if (!campo) {
            throw new Error(`Campo ${nomeCampo} não encontrado`)
        }

        const { seletor, tipo, seletorValor, default: valorDefault } = campo

        let valorFinal = valor !== undefined ? valor : valorDefault

        switch (tipo) {
            case 'input':
            case 'input-email':
            case 'input-endereco':
                cy.get(seletor)
                    .should('have.value', valorFinal)
                break
            case 'input-zipcode':
                cy.get(seletor)
                    .invoke('val')
                    .should(val => {
                        expect(val).to.satisfy(val => 
                            val === '' || /\d{5}-\d{3}/.test(val),
                        )
                    })
                break
            case 'select':
                cy.get(seletor)
                    .find('option:selected')
                    .should('have.text', valorFinal)
                break
            default:
                throw new Error(`Tipo de campo ${tipo} não suportado`)
        }
    }
}
export default formConfigUsuario