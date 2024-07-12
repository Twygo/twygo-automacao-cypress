/// <reference types="cypress" />

const installLogsPrinter = require('cypress-terminal-report/src/installLogsPrinter')

module.exports = (on, config) => {
  // Instala o cypress-terminal-report para capturar e controlar logs
  installLogsPrinter(on, {
    printLogsToConsole: 'never', // Não imprime logs no console
    printLogsToFile: 'never'     // Não salva logs em arquivos
  })

  // Certifique-se de retornar a configuração modificada
  return config
}