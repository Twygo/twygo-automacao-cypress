const fs = require('fs')
   const path = require('path')

   const feedbackFile = path.join(process.cwd(), 'cypress/logs/agent-feedback.json')

   /**
    * Registra feedback sobre o agente Cypress QA
    * @param {string} command - Comando utilizado
    * @param {number} rating - Avaliação (1-5)
    * @param {string} comment - Comentário opcional
    */
   function recordFeedback(command, rating, comment = '') {
     // Garantir que o diretório existe
     const dir = path.dirname(feedbackFile)
     if (!fs.existsSync(dir)) {
       fs.mkdirSync(dir, { recursive: true })
     }
     
     // Ler feedback existente ou criar novo
     let feedback = []
     if (fs.existsSync(feedbackFile)) {
       feedback = JSON.parse(fs.readFileSync(feedbackFile, 'utf8'))
     }
     
     // Adicionar novo feedback
     feedback.push({
       command,
       rating,
       comment,
       timestamp: new Date().toISOString()
     })
     
     // Salvar feedback
     fs.writeFileSync(feedbackFile, JSON.stringify(feedback, null, 2))
     console.log(`Feedback registrado para o comando: ${command}`)
   }

   // Exemplo de uso:
   // node cypress/scripts/agent-feedback.js criar_pom 5 "Excelente geração de POM"
   if (require.main === module) {
     const args = process.argv.slice(2)
     if (args.length < 2) {
       console.error('Uso: node agent-feedback.js <comando> <avaliacao> [comentario]')
       process.exit(1)
     }
     
     const command = args[0]
     const rating = parseInt(args[1], 10)
     const comment = args[2] || ''
     
     recordFeedback(command, rating, comment)
   }

   module.exports = { recordFeedback }