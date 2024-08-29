/// reference types="cypress" />
import { faker, fakerPT_BR } from '@faker-js/faker'
import formTrial from '../support/pageObjects/formTrial'

describe('Criar organização "Trial"', () => {
    let senha

    beforeEach(() => {
        // Defina a URL base
        const baseUrl = Cypress.env('baseUrlPadrao')
        Cypress.config('baseUrl', baseUrl)
        
        // Gerar senha para o usuário
        senha = faker.internet.password()
    })

    it('1. CRUD trial treinamento de colaboradores alterando opção para treinamento de parceiros', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Massa de dados
        const seusDados = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Estudante',
            departamento: 'Atendimento / Assistência / CS',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

    	cy.visit('/new/register/steps?1')
        
        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDados)

        // Preenche formulário "Dados da empresa"
        const dadosEmpresa = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Manufatura / Indústria',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresa, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUso = {
            objetivo: 'Treinamento de colaboradores',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUso)

        // Preenche formulário "Usuários"
        const usuarios = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuarios)

        // Preenche formulário "Login e senha"
        const loginSenha = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenha)

        // READ
        cy.log('## READ ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDados)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresa)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUso)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuarios)
        cy.validarMsgTrial('usuarios', perfilUso.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenha)
        cy.validarMsgTrial('loginSenha', perfilUso.objetivo)
        cy.get('#name')
            .should('have.value', seusDados.email)
            .should('be.visible')

        // UPDATE
        cy.log('## UPDATE ##')

        // Voltar ao primeiro step para alterar os dados
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Massa de dados
        const seusDadosUpdate = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Autônomo / Profissional liberal',
            departamento: 'Presidência',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDadosUpdate, { limpar: true })

        // Preenche formulário "Dados da empresa"
        const dadosEmpresaUpdate = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Área pública (órgãos e autarquias)',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresaUpdate, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUsoUpdate = {
            objetivo: 'Treinamento de parceiros',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUsoUpdate, { limpar: true })

        // Preenche formulário "Usuários"
        const usuariosUpdate = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuariosUpdate)

        // Preenche formulário "Login e senha"
        const loginSenhaUpdate = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenhaUpdate, { limpar: true })

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDadosUpdate)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresaUpdate)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUsoUpdate)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuariosUpdate)
        cy.validarMsgTrial('usuarios', perfilUsoUpdate.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenhaUpdate)
        cy.validarMsgTrial('loginSenha', perfilUsoUpdate.objetivo)
        cy.get('#name')
            .should('have.value', seusDadosUpdate.email)
            .should('be.visible')
        
        // FINALIZAR TRIAL
        cy.log('## FINALIZAR TRIAL ##')
        
        cy.preencherDadosTrial({ finalizar: true })
        cy.validarMsgTrial('finalizacao', '', seusDadosUpdate.nome)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Não é possível excluir um registro de trial.')
    })

    it('2. CRUD trial treinamento de parceiros alterando opção para treinamento de clientes', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Massa de dados
        const seusDados = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Analista / Engenheiro',
            departamento: 'RH',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

        cy.visit('/new/register/steps?1')
        
        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDados)

        // Preenche formulário "Dados da empresa"
        const dadosEmpresa = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Autônomo',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresa, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUso = {
            objetivo: 'Treinamento de parceiros',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUso)

        // Preenche formulário "Usuários"
        const usuarios = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuarios)

        // Preenche formulário "Login e senha"
        const loginSenha = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenha)

        // READ
        cy.log('## READ ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDados)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresa)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUso)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuarios)
        cy.validarMsgTrial('usuarios', perfilUso.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenha)
        cy.validarMsgTrial('loginSenha', perfilUso.objetivo)
        cy.get('#name')
            .should('have.value', seusDados.email)
            .should('be.visible')

        // UPDATE
        cy.log('## UPDATE ##')

        // Voltar ao primeiro step para alterar os dados
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Massa de dados
        const seusDadosUpdate = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Coordenador / Supervisor',
            departamento: 'Comercial',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDadosUpdate, { limpar: true })

        // Preenche formulário "Dados da empresa"
        const dadosEmpresaUpdate = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Consultoria / Serviços de TI',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresaUpdate, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUsoUpdate = {
            objetivo: 'Treinamento de clientes',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUsoUpdate, { limpar: true })

        // Preenche formulário "Usuários"
        const usuariosUpdate = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuariosUpdate)

        // Preenche formulário "Login e senha"
        const loginSenhaUpdate = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenhaUpdate, { limpar: true })

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDadosUpdate)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresaUpdate)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUsoUpdate)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuariosUpdate)
        cy.validarMsgTrial('usuarios', perfilUsoUpdate.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenhaUpdate)
        cy.validarMsgTrial('loginSenha', perfilUsoUpdate.objetivo)
        cy.get('#name')
            .should('have.value', seusDadosUpdate.email)
            .should('be.visible')
        
        // FINALIZAR TRIAL
        cy.log('## FINALIZAR TRIAL ##')
        
        cy.preencherDadosTrial({ finalizar: true })
        cy.validarMsgTrial('finalizacao', '', seusDadosUpdate.nome)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Não é possível excluir um registro de trial.')
    })

    it('3. CRUD trial treinamento de clientes alterando opção para venda de cursos', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Massa de dados
        const seusDados = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Diretor / V.P.',
            departamento: 'TI / Suporte',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

        cy.visit('/new/register/steps?1')
        
        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDados)

        // Preenche formulário "Dados da empresa"
        const dadosEmpresa = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Educação e Ensino',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresa, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUso = {
            objetivo: 'Treinamento de clientes',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUso)

        // Preenche formulário "Usuários"
        const usuarios = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuarios)

        // Preenche formulário "Login e senha"
        const loginSenha = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenha)

        // READ
        cy.log('## READ ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDados)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresa)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUso)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuarios)
        cy.validarMsgTrial('usuarios', perfilUso.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenha)
        cy.validarMsgTrial('loginSenha', perfilUso.objetivo)
        cy.get('#name')
            .should('have.value', seusDados.email)
            .should('be.visible')

        // UPDATE
        cy.log('## UPDATE ##')

        // Voltar ao primeiro step para alterar os dados
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Massa de dados
        const seusDadosUpdate = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'CEO / Presidente',
            departamento: 'Ensino / Educação Corporativa',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDadosUpdate, { limpar: true })

        // Preenche formulário "Dados da empresa"
        const dadosEmpresaUpdate = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Agronegócio',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresaUpdate, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUsoUpdate = {
            objetivo: 'Venda de cursos',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUsoUpdate, { limpar: true })

        // Preenche formulário "Usuários"
        const usuariosUpdate = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuariosUpdate)

        // Preenche formulário "Login e senha"
        const loginSenhaUpdate = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenhaUpdate, { limpar: true })

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDadosUpdate)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresaUpdate)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUsoUpdate)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuariosUpdate)
        cy.validarMsgTrial('usuarios', perfilUsoUpdate.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenhaUpdate)
        cy.validarMsgTrial('loginSenha', perfilUsoUpdate.objetivo)
        cy.get('#name')
            .should('have.value', seusDadosUpdate.email)
            .should('be.visible')
        
        // FINALIZAR TRIAL
        cy.log('## FINALIZAR TRIAL ##')
        
        cy.preencherDadosTrial({ finalizar: true })
        cy.validarMsgTrial('finalizacao', '', seusDadosUpdate.nome)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Não é possível excluir um registro de trial.')
    })

    it('4. CRUD trial venda de cursos alterando opção para outro', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Massa de dados
        const seusDados = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Estagiário',
            departamento: 'Administrativo',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

        cy.visit('/new/register/steps?1')
        
        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDados)

        // Preenche formulário "Dados da empresa"
        const dadosEmpresa = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Logística',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresa, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUso = {
            objetivo: 'Venda de cursos',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUso)

        // Preenche formulário "Usuários"
        const usuarios = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuarios)

        // Preenche formulário "Login e senha"
        const loginSenha = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenha)

        // READ
        cy.log('## READ ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDados)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresa)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUso)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuarios)
        cy.validarMsgTrial('usuarios', perfilUso.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenha)
        cy.validarMsgTrial('loginSenha', perfilUso.objetivo)
        cy.get('#name')
            .should('have.value', seusDados.email)
            .should('be.visible')

        // UPDATE
        cy.log('## UPDATE ##')

        // Voltar ao primeiro step para alterar os dados
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Massa de dados
        const seusDadosUpdate = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Professor / Instrutor',
            departamento: 'Parcerias / Alianças',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDadosUpdate, { limpar: true })

        // Preenche formulário "Dados da empresa"
        const dadosEmpresaUpdate = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Serviços',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresaUpdate, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUsoUpdate = {
            objetivo: 'Outro',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUsoUpdate, { limpar: true })

        // Preenche formulário "Usuários"
        const usuariosUpdate = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuariosUpdate)

        // Preenche formulário "Login e senha"
        const loginSenhaUpdate = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenhaUpdate, { limpar: true })

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDadosUpdate)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresaUpdate)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUsoUpdate)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuariosUpdate)
        cy.validarMsgTrial('usuarios', perfilUsoUpdate.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenhaUpdate)
        cy.validarMsgTrial('loginSenha', perfilUsoUpdate.objetivo)
        cy.get('#name')
            .should('have.value', seusDadosUpdate.email)
            .should('be.visible')
        
        // FINALIZAR TRIAL
        cy.log('## FINALIZAR TRIAL ##')
        
        cy.preencherDadosTrial({ finalizar: true })
        cy.validarMsgTrial('finalizacao', '', seusDadosUpdate.nome)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Não é possível excluir um registro de trial.')
    })

    it('5. CRUD trial outro alterando opção para treinamento de colaboradores', () => {
        // CREATE
        cy.log('## CREATE ##')

        // Massa de dados
        const seusDados = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Especialista /  Business partner',
            departamento: 'Marketing',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

        cy.visit('/new/register/steps?1')
        
        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDados)

        // Preenche formulário "Dados da empresa"
        const dadosEmpresa = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Software (desenvolvedor)',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresa, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUso = {
            objetivo: 'Outro',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUso)

        // Preenche formulário "Usuários"
        const usuarios = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuarios)

        // Preenche formulário "Login e senha"
        const loginSenha = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenha)

        // READ
        cy.log('## READ ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDados)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresa)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUso)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuarios)
        cy.validarMsgTrial('usuarios', perfilUso.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenha)
        cy.validarMsgTrial('loginSenha', perfilUso.objetivo)
        cy.get('#name')
            .should('have.value', seusDados.email)
            .should('be.visible')

        // UPDATE
        cy.log('## UPDATE ##')

        // Voltar ao primeiro step para alterar os dados
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Massa de dados
        const seusDadosUpdate = {
            nome: fakerPT_BR.person.fullName(),
            funcao: 'Gerente',
            departamento: 'Segurança do trabalho',
            celular: `(${fakerPT_BR.string.numeric(2)}) ${fakerPT_BR.string.numeric(5)}${fakerPT_BR.string.numeric(4)}`,
            email: faker.internet.email().toLowerCase(),
            termos: true,
            politica: true,
            proximoStep0: true
        }

        // Preenche formulário "Seus dados"
        cy.preencherDadosTrial(seusDadosUpdate, { limpar: true })

        // Preenche formulário "Dados da empresa"
        const dadosEmpresaUpdate = {
            nomeEmpresa: faker.company.name(),
            nrColaboradores: faker.number.int( {min: 1, max: 9999999} ),
            ramo: 'Saúde',
            proximoStep1: true
        }

        cy.preencherDadosTrial(dadosEmpresaUpdate, { limpar: true })

        // Preenche formulário "Perfil de uso"
        const perfilUsoUpdate = {
            objetivo: 'Treinamento de colaboradores',
            faleMais: faker.lorem.paragraph(),
            proximoStep2: true
        }

        cy.preencherDadosTrial(perfilUsoUpdate, { limpar: true })

        // Preenche formulário "Usuários"
        const usuariosUpdate = {
            quantidadePessoas: faker.number.int({ min: 0, max: 1000 }) * 5,
            proximoStep3: true
        }

        cy.preencherDadosTrial(usuariosUpdate)

        // Preenche formulário "Login e senha"
        const loginSenhaUpdate = {
            senha: senha,
            confirmarSenha: senha
        }

        cy.preencherDadosTrial(loginSenhaUpdate, { limpar: true })

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Voltar ao primeiro step para validar que os dados não foram perdidos
        for (let i = 0; i < 4; i++) {
            formTrial.voltarStep()
        }

        // Valida os dados preenchidos aba "Seus dados"
        cy.validarDadosTrial(seusDadosUpdate)
        cy.validarMsgTrial('seusDados')
        cy.preencherDadosTrial({ proximoStep0: true })

        // Valida os dados preenchidos aba "Dados da empresa"
        cy.validarDadosTrial(dadosEmpresaUpdate)
        cy.validarMsgTrial('dadosEmpresa')
        cy.preencherDadosTrial({ proximoStep1: true })

        // Valida os dados preenchidos aba "Perfil de uso"
        cy.validarDadosTrial(perfilUsoUpdate)
        cy.validarMsgTrial('perfilUso')
        cy.preencherDadosTrial({ proximoStep2: true })

        // Valida os dados preenchidos aba "Usuários"
        cy.validarDadosTrial(usuariosUpdate)
        cy.validarMsgTrial('usuarios', perfilUsoUpdate.objetivo)
        cy.preencherDadosTrial({ proximoStep3: true })

        // Valida os dados preenchidos aba "Login e senha"
        cy.validarDadosTrial(loginSenhaUpdate)
        cy.validarMsgTrial('loginSenha', perfilUsoUpdate.objetivo)
        cy.get('#name')
            .should('have.value', seusDadosUpdate.email)
            .should('be.visible')
        
        // FINALIZAR TRIAL
        cy.log('## FINALIZAR TRIAL ##')
        
        cy.preencherDadosTrial({ finalizar: true })
        cy.validarMsgTrial('finalizacao', '', seusDadosUpdate.nome)

        // DELETE
        cy.log('## DELETE ##')
        cy.log('Não é possível excluir um registro de trial.')
    })
})