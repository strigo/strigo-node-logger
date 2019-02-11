import bunyan from 'bunyan';
import bunyanDebugStream from 'bunyan-debug-stream';
import { createLogger as createLogzioLogger } from 'logzio-nodejs';
import { Bunyan2Logzio } from 'bunyan-logzio';
import expressBunyanLogger from 'express-bunyan-logger'

import * as Constants from './constants';

export let log;

/**
 * Create the default streams, if no explicit streams were provided.
 *
 * @param env The environment, to determine which streams are needed.
 * @param level The level to set to them.
 *
 * @returns {Array} A list of streams.
 */
function createDefaultStreams(env, level) {
  const streams = [
    createDebugStream(level),
  ];

  if (env === Constants.ENV_PROD) {
    streams.push(createLogzioStream());
  } else {
    streams.push({ stream: process.stdout, level: 'debug' });
    streams.push({ stream: process.stderr, level: 'error' });
  }

  return streams;
}

/**
 * Create the basic bunyan debug stream, the prettifies the JSON log entries to be human readable.
 *
 * @param level The level of the stream.
 *
 * @returns {Object} The stream.
 */
function createDebugStream(level) {
  return {
    stream: bunyanDebugStream(),
    level,
    type: 'raw'
  };
}

/**
 * Create a stream the pushes logs to Logz.io.
 * It assumes a Logz.io token exists in the environment variables.
 */
function createLogzioStream() {
  const logzioLogger = createLogzioLogger({ token: Constants.LOGZIO_TOKEN, protocol: 'https' });
  return Bunyan2Logzio(logzioLogger);
}

/**
 * @returns {Object} The default serializers to be used.
 */
function createDefaultSerializers() {
  return {
    err: bunyan.stdSerializers.err,
  };
}

/**
 * @returns {Object} The serializers for a web logger.
 */
function createWebSerializers() {
  return {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
  };
}

/**
 * Setup a logger for a vanilla nodejs application.
 *
 * @param appName The name of the app, for context in the log.
 * @param env The env of the app.
 * @param level The level of the logger (default: info).
 * @param streams (optional) A list of streams. If not provided, default streams will be created according to the env.
 */
export function setupNodeLogger(appName, env, level = 'info', streams) {
  const finalStreams = streams && streams.length ? streams : createDefaultStreams(env, level);
  const serializers = createDefaultSerializers();

  log = bunyan.createLogger({
    name: appName,
    meta: { env },
    streams: finalStreams,
    serializers,
  });
}

/**
 * Setup a logger for an expressjs application.
 *
 * @param appName The name of the app, for context in the log.
 * @param env The env of the app.
 * @param level The level of the logger (default: info).
 * @param streams (optional) A list of streams. If not provided, default streams will be created according to the env.
 */
export function setupExpressLogger(appName, env, level = 'info', streams) {
  const finalStreams = streams && streams.length ? streams : createDefaultStreams(env, level);
  const serializers = _.assign({}, createDefaultSerializers(), createWebSerializers());

  log = expressBunyanLogger({
    name: appName,
    meta: { env },
    streams: finalStreams,
    serializers,
  });
}
