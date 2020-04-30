/* eslint-disable prefer-object-spread */
const { format } = require('logform');
const { MESSAGE } = require('triple-beam');
const jsonStringify = require('fast-safe-stringify');

/*
 * function simple (info, key)
 * An adjusted version of logform's simple() format.
 * Contains a different format that includes the timestamp.
 * key is the metadata key, if exists.
 *
 * src: https://github.com/winstonjs/logform/blob/master/simple.js
 */
module.exports = format((info, key = '') => {
  const stringifiedRest = jsonStringify(Object.assign({}, info, {
    level: undefined,
    message: undefined,
    timestamp: undefined,
    splat: undefined,
  }));

  if (stringifiedRest !== `{"${key}":{}}`) {
    // eslint-disable-next-line no-param-reassign
    info[MESSAGE] = `${info.timestamp} - ${info.level} - ${info.message}\n\t${stringifiedRest}`;
  } else {
    // eslint-disable-next-line no-param-reassign
    info[MESSAGE] = `${info.timestamp} - ${info.level} - ${info.message}`;
  }

  return info;
});
