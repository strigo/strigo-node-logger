const { setupNodeLogger } = require('./setup/winston');
const { setupExpressLogger } = require('./setup/express');


module.exports = {
  setupNodeLogger,
  setupExpressLogger,
};
