class formLogin {
    elementos = {
        login: {
            seletor: '#user_email',
            tipo: 'input'
        },
        senha: {
            seletor: '#user_password',
            tipo: 'input'
        },
        entrar: {
            seletor: '#user_submit',
            tipo: 'button'
        },
        esqueciSenha: {
            seletor: '#forgot-password',
            tipo: 'link'
        },
        reenviarEmailConfirmacao: {
            seletor: '#resend-confirmation',
            tipo: 'link'
        },
        registreSe: {
            seletor: '#register_button',
            tipo: 'link'
        }
    }

    entrar() {
        cy.get(this.elementos.entrar.seletor)
            .click()
    }

    registreSe() {
        cy.get(this.elementos.registreSe.seletor)
            .click()
    }

    login() {
        cy.visit('/users/login')
    }
    
}
export default new formLogin