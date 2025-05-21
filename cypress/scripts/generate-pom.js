const fs = require('fs')
const path = require('path')

/**
 * Gera uma Page Object a partir de um arquivo HTML
 * @param {string} htmlPath - Caminho para o arquivo HTML
 * @param {string} pageName - Nome da página (PascalCase)
 * @param {Array<string>} elementTypes - Tipos de elementos a serem incluídos (input, button, etc)
 */
function generatePOM(htmlPath, pageName, elementTypes = ['input', 'button', 'select', 'a']) {
  // Ler o arquivo HTML
  const html = fs.readFileSync(htmlPath, 'utf8')

  // Analisar o HTML (implementação simplificada)
  // Em um cenário real, use uma biblioteca como cheerio ou jsdom
  const elements = {}

  // Exemplo simplificado de extração de elementos
  elementTypes.forEach(type => {
    const regex = new RegExp(`<${type}[^>]*id=["']([^"']+)["'][^>]*>`, 'g')
    let match
    while ((match = regex.exec(html)) !== null) {
      const id = match[1]
      const camelCaseName = id.replace(/-([a-z])/g, g => g[1].toUpperCase())
      elements[camelCaseName] = `cy.get('#${id}')`
    }

    // Buscar por data-cy e data-testid
    const dataRegex = new RegExp(`<${type}[^>]*data-(cy|testid)=["']([^"']+)["'][^>]*>`, 'g')
    while ((match = dataRegex.exec(html)) !== null) {
      const attr = match[1]
      const value = match[2]
      const camelCaseName = value.replace(/-([a-z])/g, g => g[1].toUpperCase())
      elements[camelCaseName] = `cy.get('[data-${attr}="${value}"]')`
    }
  })

  // Gerar o código da Page Object
  const fileName = `${pageName.charAt(0).toLowerCase() + pageName.slice(1)}Page.js`
  const filePath = path.join(process.cwd(), 'cypress/support/pages', fileName)

  let pomCode = `/**\n * Page Object para ${pageName}\n */\nclass ${pageName}Page {\n  elements = {\n`

  // Adicionar elementos
  Object.entries(elements).forEach(([name, selector]) => {
    pomCode += `    ${name}: () => ${selector},\n`
  })

  pomCode += `  }\n\n  // Adicione métodos aqui\n\n}\n\nexport default new ${pageName}Page()`

  // Criar diretório se não existir
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Salvar arquivo
  fs.writeFileSync(filePath, pomCode)
  console.log(`Page Object gerada em: ${filePath}`)
}

// Exemplo de uso:
// node cypress/scripts/generate-pom.js path/to/page.html PageName input,button,select
if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Uso: node generate-pom.js <caminho-html> <nome-pagina> [tipos-elementos]')
    process.exit(1)
  }

  const htmlPath = args[0]
  const pageName = args[1]
  const elementTypes = args[2] ? args[2].split(',') : undefined

  generatePOM(htmlPath, pageName, elementTypes)
}

module.exports = { generatePOM }
