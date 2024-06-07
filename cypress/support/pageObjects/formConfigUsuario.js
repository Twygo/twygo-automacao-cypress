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
export default new formConfigUsuario