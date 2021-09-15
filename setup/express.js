const expressWinston = require('express-winston');

const { setupNodeLogger } = require('./winston');
const { DEFAULT_LOG_LEVEL } = require('../constants');
const { ecsMeta, requestsFilter } = require('../utils');

const defaultMatchers = [
  { agent: 'Consul Health Check', urls: ['/', '/api/v1/health'], statuses: [200] },
  { agent: 'Pingdom.com_bot_version', urls: ['/', '/api/v1/health'], statuses: [200] },
];

/**
 * Setup an express logger based on the main logger.
 *
 * @param {Boolean} json Whether to output in json format or not. Defaults to true.
 * @param {String} level The level to use when setting the logger up.
 * @param {Array} skip Custom log filter
 */
function setupExpressLogger({
  json = true, level = DEFAULT_LOG_LEVEL, skip = defaultMatchers, logger,
}) {
  const activeLogger = logger || setupNodeLogger({ json, level });

  const loggerMiddleware = expressWinston.logger({
    winstonInstance: activeLogger,
    metaField: null,
    requestField: null,
    responseField: null,
    // Workaround to what appears to be a bug in express-winston: for some reason it will insist
    // logging the 'responseTime' field
    responseWhitelist: ['responseTime'],
    skip: requestsFilter(skip),
    dynamicMeta: ecsMeta,
  });

  const errorLoggerMiddleware = expressWinston.errorLogger({
    winstonInstance: activeLogger,
    msg: (req) => `ERROR ${req.method} ${req.originalUrl}`,
    metaField: null,
    blacklistedMetaFields: ['trace', 'date', 'os', 'uptime', 'process', 'exception', 'stack'],
    requestField: null,
    dynamicMeta: ecsMeta,
  });

  return { logger: activeLogger, loggerMiddleware, errorLoggerMiddleware };
}

module.exports = {
  setupExpressLogger,
  defaultMatchers,
};
