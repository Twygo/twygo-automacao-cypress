///reference types="cypress" />
import { faker, fakerPT_BR } from '@faker-js/faker'
import { getAuthToken } from '../support/authHelper'
import { gerarData } from '../support/utilsHelper'
import formCuponsVouchers from '../support/pageObjects/formCuponsVouchers'

describe('Criar e vincular cupom à curso', () => {
    let nomeConteudo1, nomeConteudo2, situacaoCurso, nomeTesteAtual, listaConteudos, tipoDesconto, nomeDesconto, codigoDesconto
    
    before(() => {
        // Define o tipo de desconto
        tipoDesconto = 'Cupom'
    })

    beforeEach(function() {
        // Gera um nome aleatório para o conteúdo e para o nome e código do desconto
        nomeConteudo1 = faker.lorem.words(2)
        nomeConteudo2 = faker.lorem.words(2)
        nomeDesconto = faker.word.words(1)
        codigoDesconto = `${(tipoDesconto).toUpperCase()}-${(nomeDesconto).toUpperCase().trim().replace(' ', '')}${faker.number.int({ max: 100 })}`

        // Captura o nome do teste atual
        nomeTesteAtual = this.currentTest.title

        // Excluir todos os cursos e trilhas
        getAuthToken()
        cy.excluirCursoViaApi()

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
		
        listaConteudos = []
		cy.listaConteudo('trilha', listaConteudos)
		cy.excluirConteudo(null, 'trilha', listaConteudos)

        // Excluir todos os cupons e vouchers
        cy.acessarPgConfigCobrancaInscricao('cuponsVouchers')
        cy.excluirTodosCuponsVouchers()

        // Define situação do curso com base no nome do teste atual
        if (nomeTesteAtual.includes('liberado')) {
            situacaoCurso = 1
        } else if (nomeTesteAtual.includes('suspenso')) {
            situacaoCurso = 2
        } else if (nomeTesteAtual.includes('em desenvolvimento')) {
            situacaoCurso = 0
        } else {
            cy.log('Situação do curso inválida, utilize "liberado", "suspenso" ou "em desenvolvimento"')
            return
        }

        // Massa de dados para criar um curso
        let body = {
            name: nomeConteudo1,
            description: faker.lorem.sentence(5),
            situation: situacaoCurso
        }

        // Cria um novo curso via API
        cy.criarCursoViaApi(body)

        // Massa de dados para criar outro curso
        body = {
            name: nomeConteudo2,
            description: faker.lorem.sentence(5),
            situation: situacaoCurso
        }
        
        cy.criarCursoViaApi(body)        
    })
    
    it('1. CRUD cupom associado a um curso liberado', () => {
        // Massa de dados
        const dados = {
            nome: nomeDesconto,
            codigo: codigoDesconto,
            valor: faker.number.int({ min: 1, max: 100 }),
            validade: gerarData(0, 6, 0, 'YYYY-MM-DD')
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.adicionarCupomVoucher(tipoDesconto)
        cy.preencherDadosCupomVoucher(dados, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo1, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'salvar')     

        // READ
        cy.log('## READ ##')

        let dadosParaValidarTabela = { ...dados, itens: nomeConteudo1 }
        let dadosParaValidarForm = { ...dados, aplicadoItens: nomeConteudo1 }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)
        cy.editarCupomVoucher(nomeDesconto)
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // UPDATE
        cy.log('## UPDATE ##')
        
        // Massa de dados
        const dadosUpdate = {
            nome: faker.word.words(1),
            codigo: `${(tipoDesconto).toUpperCase()}-${(faker.word.words(1)).toUpperCase().trim().replace(' ', '')}${faker.number.int({ max: 100 })}`,
            valor: faker.number.int({ min: 1, max: 100 }),
            validade: gerarData(10, 0, 0, 'YYYY-MM-DD')
        }

        cy.preencherDadosCupomVoucher(dadosUpdate, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo2, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'editar') 

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Concatenar itens para validação
        const itensConcatenados = [nomeConteudo1, nomeConteudo2]

        // Validar tabela
        dadosParaValidarTabela = { ...dadosUpdate, itens: itensConcatenados }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)

        // Validar formulário
        cy.editarCupomVoucher(dadosUpdate.nome)
        dadosParaValidarForm = { ...dadosUpdate, aplicadoItens: itensConcatenados }
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // DELETE
        cy.log('## DELETE ##')
        
        formCuponsVouchers.cancelar()
        cy.excluirCupomVoucher(dadosUpdate.nome, tipoDesconto)
    })

    it('2. CRUD cupom associado a um curso suspenso', () => {
        // Massa de dados
        const dados = {
            nome: nomeDesconto,
            codigo: codigoDesconto,
            valor: faker.number.int({ min: 1, max: 100 }),
            validade: gerarData(0, 6, 0, 'YYYY-MM-DD')
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.adicionarCupomVoucher(tipoDesconto)
        cy.preencherDadosCupomVoucher(dados, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo1, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'salvar')     

        // READ
        cy.log('## READ ##')

        let dadosParaValidarTabela = { ...dados, itens: nomeConteudo1 }
        let dadosParaValidarForm = { ...dados, aplicadoItens: nomeConteudo1 }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)
        cy.editarCupomVoucher(nomeDesconto)
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // UPDATE
        cy.log('## UPDATE ##')
        
        // Massa de dados
        const dadosUpdate = {
            nome: faker.word.words(1),
            codigo: `${(tipoDesconto).toUpperCase()}-${(faker.word.words(1)).toUpperCase().trim().replace(' ', '')}${faker.number.int({ max: 100 })}`,
            valor: faker.number.int({ min: 1, max: 100 }),
            validade: gerarData(10, 0, 0, 'YYYY-MM-DD')
        }

        cy.preencherDadosCupomVoucher(dadosUpdate, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo2, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'editar') 

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Concatenar itens para validação
        const itensConcatenados = [nomeConteudo1, nomeConteudo2]

        // Validar tabela
        dadosParaValidarTabela = { ...dadosUpdate, itens: itensConcatenados }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)

        // Validar formulário
        cy.editarCupomVoucher(dadosUpdate.nome)
        dadosParaValidarForm = { ...dadosUpdate, aplicadoItens: itensConcatenados }
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // DELETE
        cy.log('## DELETE ##')
        
        formCuponsVouchers.cancelar()
        cy.excluirCupomVoucher(dadosUpdate.nome, tipoDesconto)
    })

    it('3. CRUD cupom associado a um curso em desenvolvimento', () => {
        // Massa de dados
        const dados = {
            nome: nomeDesconto,
            codigo: codigoDesconto,
            valor: faker.number.int({ min: 1, max: 100 }),
            validade: gerarData(0, 6, 0, 'YYYY-MM-DD')
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.adicionarCupomVoucher(tipoDesconto)
        cy.preencherDadosCupomVoucher(dados, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo1, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'salvar')     

        // READ
        cy.log('## READ ##')

        let dadosParaValidarTabela = { ...dados, itens: nomeConteudo1 }
        let dadosParaValidarForm = { ...dados, aplicadoItens: nomeConteudo1 }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)
        cy.editarCupomVoucher(nomeDesconto)
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // UPDATE
        cy.log('## UPDATE ##')
        
        // Massa de dados
        const dadosUpdate = {
            nome: faker.word.words(1),
            codigo: `${(tipoDesconto).toUpperCase()}-${(faker.word.words(1)).toUpperCase().trim().replace(' ', '')}${faker.number.int({ max: 100 })}`,
            valor: faker.number.int({ min: 1, max: 100 }),
            validade: gerarData(10, 0, 0, 'YYYY-MM-DD')
        }

        cy.preencherDadosCupomVoucher(dadosUpdate, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo2, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'editar') 

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Concatenar itens para validação
        const itensConcatenados = [nomeConteudo1, nomeConteudo2]

        // Validar tabela
        dadosParaValidarTabela = { ...dadosUpdate, itens: itensConcatenados }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)

        // Validar formulário
        cy.editarCupomVoucher(dadosUpdate.nome)
        dadosParaValidarForm = { ...dadosUpdate, aplicadoItens: itensConcatenados }
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // DELETE
        cy.log('## DELETE ##')
        
        formCuponsVouchers.cancelar()
        cy.excluirCupomVoucher(dadosUpdate.nome, tipoDesconto)
    })
})

describe('Criar e vincular voucher à curso', () => {
    let nomeConteudo1, nomeConteudo2, situacaoCurso, nomeTesteAtual, listaConteudos, tipoDesconto, nomeDesconto, codigoDesconto
    
    before(() => {
        // Define o tipo de desconto
        tipoDesconto = 'Voucher'
    })

    beforeEach(function() {
        // Gera um nome aleatório para o conteúdo e para o nome e código do desconto
        nomeConteudo1 = faker.commerce.productName()
        nomeConteudo2 = faker.commerce.productName()
        nomeDesconto = faker.word.words(1)
        codigoDesconto = `${(tipoDesconto).toUpperCase()}-${(nomeDesconto).toUpperCase().trim().replace(' ', '')}${faker.number.int({ max: 100 })}`

        // Captura o nome do teste atual
        nomeTesteAtual = this.currentTest.title

        // Excluir todos os cursos e trilhas
        getAuthToken()
        cy.excluirCursoViaApi()

        cy.loginTwygoAutomacao()
        cy.alterarPerfil('administrador')
		
        listaConteudos = []
		cy.listaConteudo('trilha', listaConteudos)
		cy.excluirConteudo(null, 'trilha', listaConteudos)

        // Excluir todos os cupons e vouchers
        cy.acessarPgConfigCobrancaInscricao('cuponsVouchers')
        cy.excluirTodosCuponsVouchers()

        // Define situação do curso com base no nome do teste atual
        if (nomeTesteAtual.includes('liberado')) {
            situacaoCurso = 1
        } else if (nomeTesteAtual.includes('suspenso')) {
            situacaoCurso = 2
        } else if (nomeTesteAtual.includes('em desenvolvimento')) {
            situacaoCurso = 0
        } else {
            cy.log('Situação do curso inválida, utilize "liberado", "suspenso" ou "em desenvolvimento"')
            return
        }

        // Massa de dados para criar um curso
        let body = {
            name: nomeConteudo1,
            description: faker.lorem.sentence(5),
            situation: situacaoCurso
        }

        // Cria um novo curso via API
        cy.criarCursoViaApi(body)

        // Massa de dados para criar outro curso
        body = {
            name: nomeConteudo2,
            description: faker.lorem.sentence(5),
            situation: situacaoCurso
        }
        
        cy.criarCursoViaApi(body)        
    })

    it('1. CRUD voucher associado a um curso liberado', () => {
        // Massa de dados
        const dados = {
            nome: nomeDesconto,
            codigo: codigoDesconto,
            valor: fakerPT_BR.commerce.price({ min: 1, max: 999999 }),
            validade: gerarData(3, 1, 1, 'YYYY-MM-DD')
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.adicionarCupomVoucher(tipoDesconto)
        cy.preencherDadosCupomVoucher(dados, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo1, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'salvar')     

        // READ
        cy.log('## READ ##')

        let dadosParaValidarTabela = { ...dados, itens: nomeConteudo1 }
        let dadosParaValidarForm = { ...dados, aplicadoItens: nomeConteudo1 }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)
        cy.editarCupomVoucher(nomeDesconto)
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // UPDATE
        cy.log('## UPDATE ##')
        
        // Massa de dados
        const dadosUpdate = {
            nome: faker.word.words(1),
            codigo: `${(tipoDesconto).toUpperCase()}-${(faker.word.words(1)).toUpperCase().trim().replace(' ', '')}${faker.number.int({ max: 100 })}`,
            valor: fakerPT_BR.commerce.price({ min: 1, max: 999999 }),
            validade: gerarData(2, 0, 2, 'YYYY-MM-DD')
        }

        cy.preencherDadosCupomVoucher(dadosUpdate, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo2, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'editar') 

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Concatenar itens para validação
        const itensConcatenados = [nomeConteudo1, nomeConteudo2]

        // Validar tabela
        dadosParaValidarTabela = { ...dadosUpdate, itens: itensConcatenados }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)

        // Validar formulário
        cy.editarCupomVoucher(dadosUpdate.nome)
        dadosParaValidarForm = { ...dadosUpdate, aplicadoItens: itensConcatenados }
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // DELETE
        cy.log('## DELETE ##')
        
        formCuponsVouchers.cancelar()
        cy.excluirCupomVoucher(dadosUpdate.nome, tipoDesconto)
    })

    it('2. CRUD voucher associado a um curso suspenso', () => {
        // Massa de dados
        const dados = {
            nome: nomeDesconto,
            codigo: codigoDesconto,
            valor: fakerPT_BR.commerce.price({ min: 1, max: 999999 }),
            validade: gerarData(1, 3, 0, 'YYYY-MM-DD')
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.adicionarCupomVoucher(tipoDesconto)
        cy.preencherDadosCupomVoucher(dados, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo1, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'salvar')     

        // READ
        cy.log('## READ ##')

        let dadosParaValidarTabela = { ...dados, itens: nomeConteudo1 }
        let dadosParaValidarForm = { ...dados, aplicadoItens: nomeConteudo1 }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)
        cy.editarCupomVoucher(nomeDesconto)
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // UPDATE
        cy.log('## UPDATE ##')
        
        // Massa de dados
        const dadosUpdate = {
            nome: faker.word.words(1),
            codigo: `${(tipoDesconto).toUpperCase()}-${(faker.word.words(1)).toUpperCase().trim().replace(' ', '')}${faker.number.int({ max: 100 })}`,
            valor: fakerPT_BR.commerce.price({ min: 1, max: 999999 }),
            validade: gerarData(30, 0, 0, 'YYYY-MM-DD')
        }

        cy.preencherDadosCupomVoucher(dadosUpdate, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo2, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'editar') 

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Concatenar itens para validação
        const itensConcatenados = [nomeConteudo1, nomeConteudo2]

        // Validar tabela
        dadosParaValidarTabela = { ...dadosUpdate, itens: itensConcatenados }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)

        // Validar formulário
        cy.editarCupomVoucher(dadosUpdate.nome)
        dadosParaValidarForm = { ...dadosUpdate, aplicadoItens: itensConcatenados }
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // DELETE
        cy.log('## DELETE ##')
        
        formCuponsVouchers.cancelar()
        cy.excluirCupomVoucher(dadosUpdate.nome, tipoDesconto)
    })

    it('3. CRUD voucher associado a um curso em desenvolvimento', () => {
        // Massa de dados
        const dados = {
            nome: nomeDesconto,
            codigo: codigoDesconto,
            valor: fakerPT_BR.commerce.price({ min: 1, max: 999999 }),
            validade: gerarData(0, 6, 0, 'YYYY-MM-DD')
        }

        // CREATE
        cy.log('## CREATE ##')

        cy.adicionarCupomVoucher(tipoDesconto)
        cy.preencherDadosCupomVoucher(dados, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo1, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'salvar')     

        // READ
        cy.log('## READ ##')

        let dadosParaValidarTabela = { ...dados, itens: nomeConteudo1 }
        let dadosParaValidarForm = { ...dados, aplicadoItens: nomeConteudo1 }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)
        cy.editarCupomVoucher(nomeDesconto)
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // UPDATE
        cy.log('## UPDATE ##')
        
        // Massa de dados
        const dadosUpdate = {
            nome: faker.word.words(1),
            codigo: `${(tipoDesconto).toUpperCase()}-${(faker.word.words(1)).toUpperCase().trim().replace(' ', '')}${faker.number.int({ max: 100 })}`,
            valor: fakerPT_BR.commerce.price({ min: 1, max: 999999 }),
            validade: gerarData(7, 0, 0, 'YYYY-MM-DD')
        }

        cy.preencherDadosCupomVoucher(dadosUpdate, { limpar: true })
        cy.adicionarItemCupomVoucher(tipoDesconto)
        cy.aplicarItemAoCupomVoucher(nomeConteudo2, tipoDesconto)
        cy.salvarCupomVoucher(tipoDesconto, 'editar') 

        // READ-UPDATE
        cy.log('## READ-UPDATE ##')

        // Concatenar itens para validação
        const itensConcatenados = [nomeConteudo1, nomeConteudo2]

        // Validar tabela
        dadosParaValidarTabela = { ...dadosUpdate, itens: itensConcatenados }
        cy.validarTabelaCupomVoucher(dadosParaValidarTabela, tipoDesconto)

        // Validar formulário
        cy.editarCupomVoucher(dadosUpdate.nome)
        dadosParaValidarForm = { ...dadosUpdate, aplicadoItens: itensConcatenados }
        cy.validarDadosCupomVoucher(dadosParaValidarForm, tipoDesconto)

        // DELETE
        cy.log('## DELETE ##')
        
        formCuponsVouchers.cancelar()
        cy.excluirCupomVoucher(dadosUpdate.nome, tipoDesconto)
    })
})