const fs = require('fs')
const path = require('path')
const { ESLint } = require('eslint')

/**
 * Valida um arquivo de código contra as regras definidas
 * @param {string} filePath - Caminho para o arquivo a ser validado
 */
async function validateFile(filePath) {
  // Inicializar ESLint
  const eslint = new ESLint({
    useEslintrc: true,
    fix: false,
  })

  // Executar lint
  const results = await eslint.lintFiles([filePath])

  // Verificar regras específicas do projeto
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const customRules = [
    {
      name: 'Uso de Page Objects',
      test: content => !content.includes('cy.get(') || content.includes('elements = {'),
      message: 'Testes devem usar Page Objects, não seletores diretos',
    },
    {
      name: 'Estrutura AAA',
      test: content =>
        content.includes('// Arrange') &&
        content.includes('// Act') &&
        content.includes('// Assert'),
      message: 'Testes devem seguir a estrutura AAA (Arrange-Act-Assert)',
    },
    {
      name: 'Centralização de seletores',
      test: content => !content.includes('class') || content.includes('elements = {'),
      message: 'Page Objects devem centralizar seletores na propriedade elements',
    },
  ]

  // Verificar regras customizadas
  const customViolations = []
  customRules.forEach(rule => {
    if (!rule.test(fileContent)) {
      customViolations.push(rule.message)
    }
  })

  // Retornar resultados
  return {
    eslintResults: results,
    customViolations,
  }
}

// Exemplo de uso:
// node cypress/scripts/validate-code.js path/to/file.js
if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    console.error('Uso: node validate-code.js <caminho-arquivo>')
    process.exit(1)
  }

  const filePath = args[0]

  validateFile(filePath).then(({ eslintResults, customViolations }) => {
    // Exibir erros do ESLint
    const formatter = new ESLint.Formatter()
    console.log(formatter.format(eslintResults))

    // Exibir violações customizadas
    if (customViolations.length > 0) {
      console.log('\nViolações de regras específicas do projeto:')
      customViolations.forEach(violation => {
        console.log(`- ${violation}`)
      })
    }
  })
}

module.exports = { validateFile }
