/* eslint-disable no-param-reassign */
const { format } = require('logform');
const { MESSAGE } = require('triple-beam');
const jsonStringify = require('fast-safe-stringify');

const { removeEmpty } = require('../utils');

/*
 * function simple (info, key)
 * An adjusted version of logform's simple() format.
 * Contains a different format that includes the timestamp.
 * key is the metadata key, if exists.
 *
 * src: https://github.com/winstonjs/logform/blob/master/simple.js
 */
module.exports = format((info) => {
  const stringifiedRest = jsonStringify({
    ...info,
    ...{
      level: undefined, message: undefined, timestamp: undefined, splat: undefined,
    },
  }, removeEmpty);

  info[MESSAGE] = `${info.timestamp} - ${info.level} - ${info.message}`;
  if (stringifiedRest !== '{}') {
    info[MESSAGE] += `\n\t${stringifiedRest}`;
  }
  return info;
});
