/// <reference types="cypress" />

const installLogsPrinter = require('cypress-terminal-report/src/installLogsPrinter')

module.exports = (on, config) => {
  // Instala o cypress-terminal-report para capturar e controlar logs
  installLogsPrinter(on, {
    printLogsToConsole: 'never', // Não imprime logs no console
    printLogsToFile: 'never'     // Não salva logs em arquivos
  })

  // Tentativa de configuração para evitar crash do Cypress, aumentando o limite de memória do navegador
  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.family === "chromium") {
      launchOptions.args.push('--js-flags="--max_old_space_size=4096 --max_semi_space_size=1024"')
    }
    return launchOptions
  })
  
  return config
}