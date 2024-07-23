// :: Plugins ::
// » Opções do plugin cypress-terminal-report
const options = {
    collectTypes: [
        'cons:log', 'cons:info', 'cons:warn', 'cons:error',
        'cy:log', 'cy:xhr', 'cy:request', 'cy:intercept', 'cy:command'
    ],
    filterLog: ({ type, message, severity }) => {
        // Exibir apenas logs cuja severidade é 'error'
        return severity === 'error';
    }
}

// » Instalação do plugin cypress-terminal-report
require('cypress-terminal-report/src/installLogsCollector')(options);

// :: Arquivos de suporte ::
import './commands';
import './index';
