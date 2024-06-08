class comunicacao {
    constructor() {
        this.elementos = {
            comunidades: this.gerarElementos('community'),
            participantes: this.gerarElementos('community_participant'),
            discussoes: this.gerarElementos('community_discussion'),
            noticias: this.gerarElementos('community_newsletter'),
            logs: this.gerarElementos('stream'),
            salvar: '#communities button.btn.btn-primary[type="submit"]'
        }
    }
  
    gerarElementos(prefixo) {
        return {
            instrutor: this.gerarPermissoes(`${prefixo}_instructor`),
            gestor: this.gerarPermissoes(`${prefixo}_manager_class`),
            liderEquipe: this.gerarPermissoes(`${prefixo}_team_manager`),
            aluno: this.gerarPermissoes(`${prefixo}_student`)
        }
    }
  
    gerarPermissoes(prefixo) {
        return {
            ver: `#${prefixo}_read`,
            editar: `#${prefixo}_update`,
            criar: `#${prefixo}_create`,
            excluir: `#${prefixo}_destroy`
        }
    }
  
    salvar() {
        cy.get(this.elementos.salvar)
            .click()
    }
  
    configurarComunicacao(secao, perfil, permissao, acao) {
        const elemento = this.elementos[secao][perfil][permissao]
        cy.get(elemento).then($checkbox => {
            const isChecked = $checkbox.is(':checked')
            if ((acao === 'habilitar' && !isChecked) || (acao === 'desabilitar' && isChecked)) {
                cy.get(elemento).click()
            }
        })
    }
    
    configurarMultiplasPermissoes(config) {
        const { secao, perfil, permissoes, acao } = config
        permissoes.forEach(permissao => {
            this.configurarComunicacao(secao, perfil, permissao, acao)
        })
    }

    validarConfigComunicacao(secao, perfil, permissao, acao) {
        const elemento = this.elementos[secao][perfil][permissao]
        cy.get(elemento).then($checkbox => {
            const isChecked = $checkbox.is(':checked')
            if (acao === 'habilitar') {
                expect(isChecked).to.be.true
            } else if (acao === 'desabilitar') {
                expect(isChecked).to.be.false
            }
        })
    }

    validarMultiplasPermissoes(config) {
        const { secao, perfil, permissoes, acao } = config
        permissoes.forEach(permissao => {
            this.validarConfigComunicacao(secao, perfil, permissao, acao)
        })
    }

    gerarCombinacoes(secoes, perfis, permissoes, acao) {
        const combinacoes = []
    
        secoes.forEach(secao => {
            perfis.forEach(perfil => {
                permissoes.forEach(permissao => {
                    combinacoes.push({
                        secao: secao,
                        perfil: perfil,
                        permissao: permissao,
                        acao: acao
                    })
                })
            })
        })
    
        return combinacoes
    }

    configurarCombinacoes(combinacao) {
        const { secao, perfil, permissao, acao } = combinacao
    
        const seletor = this.elementos[secao][perfil][permissao]
        if (seletor) {
            cy.get('body').then($body => {
                if ($body.find(seletor).length > 0) {
                    cy.get(seletor).then($checkbox => {
                        const isChecked = $checkbox.is(':checked')
                        if ((acao === 'habilitar' && !isChecked) || (acao === 'desabilitar' && isChecked)) {
                            cy.wrap($checkbox).click()
                        }
                    })
                }
            })
        }
    }

    validarPermissao({ secao, perfil, permissao, acao }) {
        const seletor = this.elementos[secao]?.[perfil]?.[permissao]
        if (!seletor) {
            throw new Error(`Seletor não encontrado para secao: ${secao}, perfil: ${perfil}, permissao: ${permissao}`)
        }
        const esperado = acao === 'habilitar' // Converte a ação em um valor booleano esperado
        cy.get('body').then($body => {
            if ($body.find(seletor).length > 0) {
                cy.get(seletor).should($checkbox => {
                    const isChecked = $checkbox.is(':checked')
                    expect(isChecked).to.equal(esperado)
                })
            }
        })
    }
}
export default new comunicacao()