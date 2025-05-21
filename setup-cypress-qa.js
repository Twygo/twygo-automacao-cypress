const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Diretórios a serem criados
const directories = [
  'cypress/support/pages',
  'cypress/fixtures',
  'cypress/docs/patterns/good',
  'cypress/docs/patterns/bad',
  'cypress/scripts',
  'cypress/tools',
  'cypress/logs',
]

// Criar diretórios
directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`Diretório criado: ${fullPath}`)
  }
})

// Instalar dependências
console.log('Instalando dependências...')
const dependencies = [
  'eslint',
  'eslint-plugin-cypress',
  'prettier',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
  '@cypress/code-coverage',
  'nyc',
  'istanbul-lib-coverage',
  'cypress-mochawesome-reporter',
]

try {
  execSync(`npm install --save-dev ${dependencies.join(' ')}`, { stdio: 'inherit' })
  console.log('Dependências instaladas com sucesso!')
} catch (error) {
  console.error('Erro ao instalar dependências:', error)
}

console.log('\nSetup concluído! Agora você pode configurar os arquivos conforme o guia.')
