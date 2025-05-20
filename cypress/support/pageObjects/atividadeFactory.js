// Importando as classes específicas
import atividadePagina from './atividadePagina'
import atividadeAula from './atividadeAula'

class AtividadeFactory {
  /**
   * Retorna a instância da classe de atividade apropriada com base no tipo
   * @param {string} tipo - O tipo de atividade ('Página', 'Aula', etc.)
   * @returns {object} - Instância da classe de atividade apropriada
   */
  getAtividade(tipo) {
    switch (tipo.toLowerCase()) {
      case 'página':
        return atividadePagina
      case 'aula':
        return atividadeAula
      // À medida que mais tipos de atividades forem implementados, adicioná-los aqui
      default:
        throw new Error(`Tipo de atividade não implementado: ${tipo}. Use a POM formAtividades.js para este caso.`)
    }
  }
}

export default new AtividadeFactory() 