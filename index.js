const { createLogger, format, transports } = require('winston');
const expressWinston = require('express-winston');

const DEFAULT_LOG_LEVEL = 'info';

/**
 * Create the require formatters for the logger.
 *
 * @returns {Array} A list of formatters to use.
 */
function configureFormatters(env) {
  const formatters = [
    format.errors({ stack: true }),
    format.metadata({ key: 'meta' }),
    format.timestamp(),
  ];

  if (env) {
    formatters.push(format.json());
  } else {
    formatters.push(
      format.printf(
        (info) => {
          const { meta } = info;
          if (meta.err) {
            meta.err = meta.err.toString();
          }
          const colorizer = format.colorize();
          return colorizer.colorize(
            info.level,
            `${info.timestamp} - ${info.level} - ${info.message} \n${JSON.stringify(meta)}`,
          );
        },
      ),
    );
  }

  return formatters;
}

/**
 * Setup the main logger. This logger can then be used directly, or propagated to
 * another logger (like the express logger).
 *
 * @param {String} env The name of the environment to use. This affects formatting.
 * @param {String} level The level to use when setting the logger up.
 */
export function setupNodeLogger(env, level = DEFAULT_LOG_LEVEL) {
  return createLogger({
    level,
    format: format.combine(...configureFormatters(env)),
    transports: [ new transports.Console() ],
  });
}

/**
 * Setup an express logger based on the main logger.
 *
 * @param {String} env The name of the environment to use. This affects formatting.
 * @param {String} level The level to use when setting the logger up.
 */
export function setupExpressLogger(env, level = DEFAULT_LOG_LEVEL) {
  const logger = setupNodeLogger(env, level);

  const loggerMiddleware = expressWinston.logger({
    winstonInstance: logger,
    metaField: null,
    colorize: false,
    // Consul's Health check regularly bombards us with requests, so we should ignore it.
    skip: (req) => (req.headers['user-agent'] == 'Consul Health Check' && req.url == '/'),
  });

  return { logger, loggerMiddleware };
}
