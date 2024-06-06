//TODO em andamento em paralelo 
const { faker } = require('@faker-js/faker')

function gerarDados(tipo) {
    switch (tipo) {
        case 'nome':
            return faker.person.firstName();
        case 'sobrenome':
            return faker.person.lastName();
        case 'nomeCompleto':
            return `${faker.person.firstName()} ${faker.person.lastName()}`;
        case 'email'(nome, sobrenome, dominio = 'automacao.com'):
            const nome = nome.toLowerCase()
            const sobrenome = sobrenome.toLowerCase()
            return `${nome}.${sobrenome}@${dominio}`
        case 'celular'(tipo):
            const dddsValidos = [
                '11', '12', '13', '14', '15', '16', '17', '18', '19', // São Paulo
                '21', '22', '24', // Rio de Janeiro
                '27', '28', // Espírito Santo
                '31', '32', '33', '34', '35', '37', '38', // Minas Gerais
                '41', '42', '43', '44', '45', '46', // Paraná
                '47', '48', '49', // Santa Catarina
                '51', '53', '54', '55', // Rio Grande do Sul
                '61', // Distrito Federal
                '62', '64', '65', '66', '67', // Goiás e Mato Grosso
                '68', '69', // Acre e Rondônia
                '71', '73', '74', '75', '77', // Bahia
                '79', // Sergipe
                '81', '82', '83', '84', '85', '86', '87', '88', '89', // Pernambuco, Alagoas, Paraíba, Rio Grande do Norte, Ceará, Piauí
                '91', '92', '93', '94', '95', '96', '97', '98', '99' // Pará, Amazonas, Roraima, Amapá, Maranhão
            ]
        
            const ddd = dddsValidos[Math.floor(Math.random() * dddsValidos.length)]
        
            if (tipo === 'celular') {
            const numero = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
            return `(${ddd}) 9${numero.substring(0, 4)}-${numero.substring(4)}`
            } else if (tipo === 'fixo') {
            const numero = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
            return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`
            } else {
            throw new Error(`Tipo de telefone inválido: ${tipo}. Utilize 'celular' ou 'fixo'`)
            }
        case 'endereco':
            return faker.location.streetAddress();
        case 'cidade':
            return faker.location.city();
        case 'estado':
            return faker.location.state();
        case 'pais':
            return faker.location.country();
        case 'cep':
            // Definindo as regiões postais e seus respectivos intervalos de CEP
            const regioesPostais = {
                0: '0', // Grande São Paulo
                1: '1', // Interior de São Paulo
                2: '2', // Rio de Janeiro e Espírito Santo
                3: '3', // Minas Gerais
                4: '4', // Bahia e Sergipe
                5: '5', // Pernambuco, Alagoas, Paraíba e Rio Grande do Norte
                6: '6', // Ceará, Piauí, Maranhão, Pará, Amazonas, Acre, Amapá e Roraima
                7: '7', // Distrito Federal, Goiás, Tocantins, Mato Grosso, Mato Grosso do Sul e Rondônia
                8: '8', // Paraná e Santa Catarina
                9: '9'  // Rio Grande do Sul
            }

            // Se uma região específica for fornecida, use-a; caso contrário, escolha uma aleatória
            const regiaoEscolhida = regiao !== null ? regiao : faker.helpers.arrayElement(Object.keys(regioesPostais))

            // Gerando os outros dígitos do CEP
            const subRegiao = faker.number.int({ min: 0, max: 9 })
            const setor = faker.number.int({ min: 0, max: 9 })
            const subSetor = faker.number.int({ min: 0, max: 9 })
            const divisorSubSetor = faker.number.int({ min: 0, max: 9 })
            const identificadorDistribuicao = faker.number.int({ min: 0, max: 999 }).toString().padStart(3, '0')

            // Montando o CEP completo
            const cep = `${regioesPostais[regiaoEscolhida]}${subRegiao}${setor}${subSetor}${divisorSubSetor}-${identificadorDistribuicao}`

            return cep        
        default:
            throw new Error(`Tipo de dado não suportado: ${tipo}`);
    }
}

module.exports = {
    gerarDados
}