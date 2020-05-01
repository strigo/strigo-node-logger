const { createLogger, format, transports } = require('winston');

const { simple, ecs } = require('../format');
const { DEFAULT_LOG_LEVEL } = require('..');

const STRIGO_BASE = 'strigo';
const ECS_BASE = [
  // This is a trick to stop metadata formatter from adding it to the metadata object.
  // Do not remove.
  'level', 'message', 'stack', 'expressmeta',
  // Root level fields from ECS: https://www.elastic.co/guide/en/ecs/current/
  'labels', 'tags', 'client', 'cloud', 'destination', 'event',
  'http', 'interface', 'log', 'process', 'server', 'service', 'source',
  'user_agent', 'trace', 'transaction', 'url',
];

/**
 * Create the require formatters for the logger.
 *
 * @returns {Array} A list of formatters to use.
 */
function configureFormatters(json) {
  // Formatters order matter, make sure to test your changes
  const formatters = [
    format.metadata({ key: STRIGO_BASE, fillExcept: ECS_BASE }),
    format.timestamp(),
  ];

  if (json) {
    formatters.push(
      format.errors({ stack: true }),
      ecs(),
      format.json(),
    );
  } else {
    formatters.push(
      format.errors({ stack: false }),
      format.colorize({ level: true }),
      simple(STRIGO_BASE),
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
