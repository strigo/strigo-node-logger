const { createLogger, format, transports } = require('winston');
const expressWinston = require('express-winston');

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export let log;

// Configure the transports the logger is going to use.
// This also allows us to directly modify the transports during runtime if necessary.
// e.g. `configuredTransports.console.level = 'debug';`
export const configuredTransports = {
  console: new transports.Console()
};

/**
 * Create the require formatters for the logger.
 * Note that this also differentiates "local" envs from envs in which STRIGO_ENV is configured (e.g. dev/prod).
 *
 * @returns {Array} A list of formatters to use.
 */
function configureFormatters() {
  const formatters = [
    format.errors({ stack: true }),
    format.metadata({ key: 'meta' }),
    format.timestamp(),
  ];

  if (process.env.STRIGO_ENV) {
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
            `${info.timestamp} ${info.level} ${info.message} ${JSON.stringify(meta)}`,
          );
        },
      ),
    );
  }

  return formatters;
}

// Setup the main logger on import. This logger can then be used directly, or propagated to
// another logger (like the express logger).
const winstonInstance = createLogger({
  level: LOG_LEVEL,
  format: format.combine(...configureFormatters()),
  transports: [ configuredTransports.console ],
});

/**
 * Setup the log level for the main logger.
 *
 * @param {*} level The level to use when setting the logger up.
 */
export function setupNodeLogger(level = LOG_LEVEL) {
  configuredTransports.console.level = level;
  log = winstonInstance;
}

/**
 * Setup an express logger based on the main logger.
 */
export function setupExpressLogger() {
  log = expressWinston.logger({
    winstonInstance,
    metaField: null,
    colorize: false,
    // Consul's Health check regularly bombards us with requests, so we should ignore it.
    skip: (req) => (req.headers['user-agent'] == 'Consul Health Check' && req.url == '/'),
  });
};
