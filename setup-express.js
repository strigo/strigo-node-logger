const expressWinston = require('express-winston');
const setupNodeLogger = require('./setup-winston');
const { DEFAULT_LOG_LEVEL } = require('.');

const defaultFilters = [
  { agent: 'Consul Health Check', urls: ['/'], statuses: [200] },
  { agent: 'Pingdom.com_bot_version', urls: ['/', '/api/v1/health'], statuses: [200] },
];

function skipRequests(filters) {
  return (req, res) => {
    const userAgent = req.headers['user-agent'] || '';

    return filters.some(
      ({ agent, urls, statuses }) => userAgent.includes(agent)
        && urls.includes(req.url)
        && statuses.includes(res.statusCode),
    );
  };
}

const whitelistedHeaders = [
  'x-forwarded-for',
  'x-forwarded-proto',
  'content-type',
];

function ecsMeta(req, res) {
  const meta = {};
  meta.http = {};
  meta.http.protocol = req.httpVersion;

  meta.http.request = {};
  meta.http.request.method = req.method.toLowerCase();
  meta.http.request.bytes = req.socket.bytesRead;

  if (req.headers.referer) {
    meta.http.request.referer = req.headers.referer;
  }

  if (req.headers['content-length']) {
    meta.http.request.body = {};
    meta.http.request.body.bytes = req.headers['content-length'];
  }

  if (req.headers['user-agent']) {
    meta.user_agent = {};
    meta.user_agent.original = req.headers['user-agent'];
  }

  whitelistedHeaders.forEach((header) => {
    if (req.headers[header]) {
      meta.http.request.headers = meta.http.request.headers || {};
      meta.http.request.headers[header] = req.headers[header];
    }
  });

  meta.url = {};
  meta.url.original = req.originalUrl;
  meta.url.scheme = req.protocol;
  if (req.hostname) {
    const [host, port] = req.hostname.split(':');
    meta.url.domain = host;
    if (port) meta.url.port = Number(port);
  }

  meta.client = {};
  meta.client.ip = req.ip;
  meta.client.port = req.socket.remotePort;

  meta.server = {};
  meta.server.ip = req.socket.localAddress;
  meta.server.port = req.socket.localPort;

  if (res) {
    meta.http = meta.http || {};
    meta.http.response = {};
    meta.http.response.status_code = res.statusCode;
    meta.event = {};
    meta.event.duration_ms = res.responseTime;
  }

  return meta;
}

/**
 * Setup an express logger based on the main logger.
 *
 * @param {Boolean} json Whether to output in json format or not. Defaults to true.
 * @param {String} level The level to use when setting the logger up.
 * @param {Array} skip Custom log filter
 */
function setupExpressLogger({ json = true, level = DEFAULT_LOG_LEVEL, skip = defaultFilters }) {
  const logger = setupNodeLogger({ json, level });

  const loggerMiddleware = expressWinston.logger({
    winstonInstance: logger,
    metaField: null,
    requestField: null,
    responseField: null,
    // Workaround to what appears to be a bug in express-winston: for some reason it will insist
    // logging the 'responseTime' field
    responseWhitelist: ['responseTime'],
    skip: skipRequests(skip),
    dynamicMeta: ecsMeta,
  });

  const errorLoggerMiddleware = expressWinston.errorLogger({
    winstonInstance: logger,
    metaField: null,
    blacklistedMetaFields: ['trace', 'date', 'os', 'uptime', 'exception', 'process', 'error'],
    requestField: null,
    dynamicMeta: ecsMeta,
  });

  return { logger, loggerMiddleware, errorLoggerMiddleware };
}

module.exports = setupExpressLogger;
