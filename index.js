const { setupNodeLogger } = require('./setup/winston');
const { setupExpressLogger } = require('./setup/express');

const DEFAULT_LOG_LEVEL = 'info';

module.exports = {
  DEFAULT_LOG_LEVEL,
  setupNodeLogger,
  setupExpressLogger,
};
