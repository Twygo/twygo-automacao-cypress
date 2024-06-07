import { faker } from '@faker-js/faker'

/** DOCUMENTAÇÃO
 * @name gerarData
 * 
 * @description 
 * Função para gerar data atual no formato DD/MM/AAAA ou adicionar/subtrair dias, meses e anos da data atual
 * 
 * @actions
 * 1. Cria um novo objeto Date para a data atual
 * 2. Extrai o dia, mês e ano do objeto Date
 * 3. Converte dia e mês para string e garante que ambos tenham dois dígitos
 * 4. Concatena as strings de ano, mês e dia
 * 
 * @param {number} dias - Quantidade de dias a serem adicionados ou subtraídos da data atual
 * @param {number} meses - Quantidade de meses a serem adicionados ou subtraídos da data atual
 * @param {number} anos - Quantidade de anos a serem adicionados ou subtraídos da data atual
 *  
 * @returns {string} Data atual no formato DD/MM/AAAA
 * 
 * @example
 * gerarData() [Data atual]
 * gerarData(0, 0, 1) [Data atual + 1 ano]
 * gerarData(0, 1, 0) [Data atual + 1 mês]
 * gerarData(1, 0, 0) [Data atual + 1 dia]
 * gerarData(1, 1, 1) [Data atual + 1 dia, 1 mês e 1 ano]
 * gerarData(-1, -1, -1) [Data atual - 1 dia, 1 mês e 1 ano] * 
 * 
 * @author Karla Daiany
 * @version 1.1.0
 * @since 1.0.0
 */
export function gerarData(dias = 0, meses = 0, anos = 0, formato = 'DD/MM/YYYY') {
    let dataAtual = new Date()
  
    // Adiciona ou subtrai dias, meses e anos da data atual
    dataAtual.setDate(dataAtual.getDate() + dias)
    dataAtual.setMonth(dataAtual.getMonth() + meses)
    dataAtual.setFullYear(dataAtual.getFullYear() + anos)
  
    let dia = dataAtual.getDate()
    let mes = dataAtual.getMonth() + 1
    let ano = dataAtual.getFullYear()
  
    dia = dia < 10 ? '0' + dia : dia.toString()
    mes = mes < 10 ? '0' + mes : mes.toString()
  
    let dataFormatada
    if (formato === 'YYYY-MM-DD') {
        dataFormatada = `${ano}-${mes}-${dia}`
    } else {
        dataFormatada = `${dia}/${mes}/${ano}`
    }
    
    return dataFormatada
}

/** DOCUMENTAÇÃO
 * @name converterDataEHoraParaISO
 * 
 * @description
 * Função para converter data e hora para o formato ISO
 * 
 * @actions
 * 1. Separa o dia, mês e ano da data
 * 2. Concatena a data no formato ISO
 * 
 * @param {string} data 
 * @param {string} hora 
 * 
 * @returns {string} Data e hora no formato ISO
 * 
 * @example
 * converterDataEHoraParaISO('10/10/2021', '10:00')
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
export function converterDataEHoraParaISO(data, hora) {
    // Separa o dia, mês e ano da data
    let dia = data.substring(0, 2)
    let mes = data.substring(3, 5)
    let ano = data.substring(6, 10)

    // Concatena a data no formato ISO
    let dataISO = `${ano}-${mes}-${dia}T${hora}:00.000Z`
    return dataISO
}

export function gerarDataEHoraAtual() {
    // Captura a data e hora atuais
    let agora = new Date();

    // Formata a data e hora para corresponder ao formato DD/MM/AAAA HH:MM (ex: '25/04/2024 18:25')
    // Ajusta os parâmetros de acordo com a necessidade de formatação
    let dataFormatada = agora.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(/\//g, '-').replace(/ /g, ' ')

    return dataFormatada
}

export function gerarTelefone(tipo) {
    const dddsValidos = [
        '11', '12', '13', '14', '15', '16', '17', '18', '19', // São Paulo
        '21', '22', '24', // Rio de Janeiro
        '27', '28', // Espírito Santo
        '31', '32', '33', '34', '35', '37', '38', // Minas Gerais
        '41', '42', '43', '44', '45', '46', // Paraná
        '47', '48', '49', // Santa Catarina
        '51', '53', '54', '55', // Rio Grande do Sul
        '61', // Distrito Federal
        '62', '64', '65', '66', '67', // Goiás e Mato Grosso
        '68', '69', // Acre e Rondônia
        '71', '73', '74', '75', '77', // Bahia
        '79', // Sergipe
        '81', '82', '83', '84', '85', '86', '87', '88', '89', // Pernambuco, Alagoas, Paraíba, Rio Grande do Norte, Ceará, Piauí
        '91', '92', '93', '94', '95', '96', '97', '98', '99' // Pará, Amazonas, Roraima, Amapá, Maranhão
    ]

    const ddd = dddsValidos[Math.floor(Math.random() * dddsValidos.length)]

    if (tipo === 'celular') {
    const numero = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
    return `(${ddd}) 9${numero.substring(0, 4)}-${numero.substring(4)}`
    } else if (tipo === 'fixo') {
    const numero = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
    return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`
    } else {
    throw new Error(`Tipo de telefone inválido: ${tipo}. Utilize 'celular' ou 'fixo'`)
    }
}

export function gerarCEP(regiao = null) {
    // Definindo as regiões postais e seus respectivos intervalos de CEP
    const regioesPostais = {
        0: '0', // Grande São Paulo
        1: '1', // Interior de São Paulo
        2: '2', // Rio de Janeiro e Espírito Santo
        3: '3', // Minas Gerais
        4: '4', // Bahia e Sergipe
        5: '5', // Pernambuco, Alagoas, Paraíba e Rio Grande do Norte
        6: '6', // Ceará, Piauí, Maranhão, Pará, Amazonas, Acre, Amapá e Roraima
        7: '7', // Distrito Federal, Goiás, Tocantins, Mato Grosso, Mato Grosso do Sul e Rondônia
        8: '8', // Paraná e Santa Catarina
        9: '9'  // Rio Grande do Sul
    }

    // Se uma região específica for fornecida, use-a; caso contrário, escolha uma aleatória
    const regiaoEscolhida = regiao !== null ? regiao : faker.helpers.arrayElement(Object.keys(regioesPostais))

    // Gerando os outros dígitos do CEP
    const subRegiao = faker.number.int({ min: 0, max: 9 })
    const setor = faker.number.int({ min: 0, max: 9 })
    const subSetor = faker.number.int({ min: 0, max: 9 })
    const divisorSubSetor = faker.number.int({ min: 0, max: 9 })
    const identificadorDistribuicao = faker.number.int({ min: 0, max: 999 }).toString().padStart(3, '0')
    
    // Montando o CEP completo
    const cep = `${regioesPostais[regiaoEscolhida]}${subRegiao}${setor}${subSetor}${divisorSubSetor}-${identificadorDistribuicao}`

    return cep
}

export function verificarPerfilENomeUsuario() {
    return cy.get('body').then(($body) => {
      const nomeUsuario = $body.find('.name').text().trim()
      const perfilAtual = $body.find('#btn-profile').text().trim()
  
      if (!nomeUsuario && !perfilAtual) {
        return { acao: 'login' }
      }
  
      if (nomeUsuario !== Cypress.env('username')) {
        return { acao: 'logout' }
      }
  
      if (nomeUsuario === Cypress.env('username') && perfilAtual !== 'Administrador') {
        return { acao: 'alterarPerfil' }
      }
  
      return { acao: 'N/A' }
    })
}