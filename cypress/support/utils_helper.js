/** DOCUMENTAÇÃO
 * @name gerarDataAtual
 * 
 * @description 
 * Função para gerar data atual no formato DD/MM/AAAA
 * 
 * @actions
 * 1. Cria um novo objeto Date para a data atual
 * 2. Extrai o dia, mês e ano do objeto Date
 * 3. Converte dia e mês para string e garante que ambos tenham dois dígitos
 * 4. Concatena as strings de ano, mês e dia
 *  
 * @returns {string} Data atual no formato DD/MM/AAAA
 * 
 * @example
 * gerarDataAtual()
 * 
 * @author Karla Daiany
 * @version 1.0.0
 * @since 1.0.0
 */
export function gerarDataAtual() {
    // Cria um novo objeto Date para a data atual
    let dataAtual = new Date()

    // Extrai o dia, mês e ano do objeto Date
    let dia = dataAtual.getDate()
    let mes = dataAtual.getMonth() + 1
    let ano = dataAtual.getFullYear()

    // Converte dia e mês para string e garante que ambos tenham dois dígitos
    dia = dia < 10 ? '0' + dia : dia.toString()
    mes = mes < 10 ? '0' + mes : mes.toString()

    // Concatena as strings de ano, mês e dia
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