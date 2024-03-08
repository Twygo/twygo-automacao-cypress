const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '2p3j3j',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
