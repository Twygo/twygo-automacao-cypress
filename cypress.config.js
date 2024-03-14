const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '2p3j3j',
  e2e: {
    baseUrl: 'https://automacao-karla.twygoead.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    numTestsKeptInMemory: 0,
  },
  env: {
    // Define as variáveis de ambiente que serão utilizadas nos testes
    login: 'karla.oliveira@twygo.com',
    password: 'aut123',
    orgId: 21654
  }
});
