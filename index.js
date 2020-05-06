const { setupNodeLogger } = require('./setup/winston');
const { setupExpressLogger, defaultMatchers } = require('./setup/express');


module.exports = {
  setupNodeLogger,
  setupExpressLogger,
  defaultMatchers,
};
