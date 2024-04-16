const { createLogger, format, transports } = require('winston');

const { simple, ecs, errors } = require('../format');
const { removeEmpty } = require('../utils');
const { DEFAULT_LOG_LEVEL, LOGGER_META_NAME, ECS_RESERVED } = require('../constants');

/**
 * Create the require formatters for the logger.
 *
 * @returns {Array} A list of formatters to use.
 */
function configureFormatters(json) {
  // Formatters order matter, make sure to test your changes
  const formatters = [
    errors(),
    format.metadata({ key: LOGGER_META_NAME, fillExcept: ECS_RESERVED }),
    format.timestamp(),
  ];

  if (json) {
    formatters.push(
      ecs(),
      format.json({ replacer: removeEmpty }),
    );
  } else {
    formatters.push(
      format.colorize({ level: true }),
      simple(),
    );
  }

  return formatters;
}

/**
 * Setup the main logger. This logger can then be used directly, or propagated to
 * another logger (like the express logger).
 *
 * @param {Boolean} json Whether to output in json format or not. Defaults to true.
 * @param {String} level The level to use when setting the logger up.
 */
function setupNodeLogger({ json = true, level = DEFAULT_LOG_LEVEL }) {
  return createLogger({
    level,
    format: format.combine(...configureFormatters(json)),
    transports: [new transports.Console()],
  });
}

module.exports = {
  setupNodeLogger,
};
