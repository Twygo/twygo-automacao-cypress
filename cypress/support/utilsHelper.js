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
export function gerarData(dias = 0, meses = 0, anos = 0) {
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
  
    let dataFormatada = `${dia}/${mes}/${ano}`
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