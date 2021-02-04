/**
 * A replacer function for JSON.stringify. Will remove any empty objects in root of object
 *
 */
function removeEmpty(key, value) {
  if (value === null || typeof value !== 'object') return value;
  return Object.keys(value).length === 0 ? undefined : value;
}

function removeReservedOrEmpty(key, value) {
  if (['level', 'message', 'timestamp', 'splat'].includes(key)) return undefined;
  return removeEmpty(key, value);
}

function requestsFilter(matchers) {
  return (req, res) => {
    const userAgent = req.headers['user-agent'] || '';

    return matchers.some(
      ({ agent, urls, statuses }) => userAgent.includes(agent)
        && urls.includes(req.url)
        && statuses.includes(res.statusCode),
    );
  };
}


function ecsMeta(req, res, err) {
  const whitelistedHeaders = [
    'x-forwarded-for',
    'x-forwarded-proto',
    'content-type',
  ];

  const meta = {
    http: {
      protocol: req.httpVersion,
      request: {
        method: req.method.toLowerCase(),
        bytes: req.socket.bytesRead,
      },
    },
    url: {
      original: req.originalUrl,
      scheme: req.protocol,
    },
    client: {
      ip: req.ip,
      port: req.socket.remotePort,
    },
    server: {
      ip: req.socket.localAddress,
      port: req.socket.localPort,
    },
  };

  if (req.headers) {
    if (req.headers.referer) {
      meta.http.request.referer = req.headers.referer;
    }

    if (req.headers['content-length']) {
      meta.http.request.body = {
        bytes: req.headers['content-length'],
      };
    }

    if (req.headers['user-agent']) {
      meta.user_agent = {
        original: req.headers['user-agent'],
      };
    }

    whitelistedHeaders.forEach((header) => {
      if (req.headers[header]) {
        meta.http.request.headers = meta.http.request.headers || {};
        meta.http.request.headers[header] = req.headers[header];
      }
    });
  }

  if (req.hostname) {
    const [host, port] = req.hostname.split(':');
    meta.url.domain = host;
    if (port) meta.url.port = Number(port);
  }

  // during error handling, the res part is meaningless.
  // the actual return code and duration are logged in the regular http log
  if (res && !err) {
    meta.http = {
      response: {
        status_code: res.statusCode,
      },
      event: {
        duration_ms: res.responseTime,
      },
    };
  }

  if (err) {
    meta.error = {
      type: err.name,
      message: err.message,
      stack_trace: err.stack,
    };

    if (err.innerError) {
      meta.inner_error = {
        type: err.innerError.name,
        message: err.innerError.message,
        stack_trace: err.innerError.stack,
        details: err.innerError.details
      }
    }
  }

  return meta;
}


module.exports = {
  removeEmpty,
  removeReservedOrEmpty,
  requestsFilter,
  ecsMeta,
};
