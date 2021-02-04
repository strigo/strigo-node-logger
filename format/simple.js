/* eslint-disable no-param-reassign */
const { format } = require('logform');
const PrettyError = require('pretty-error');
const { MESSAGE } = require('triple-beam');
const jsonStringify = require('fast-safe-stringify');

const { removeReservedOrEmpty } = require('../utils');


function prettifyError(error) {
  const pe = new PrettyError();
  return pe.render(error);
}

/*
 * function simple (info, key)
 * An adjusted version of logform's simple() format.
 * Contains a different format that includes the timestamp.
 * key is the metadata key, if exists.
 *
 * src: https://github.com/winstonjs/logform/blob/master/simple.js
 */
module.exports = format((info) => {

  const { error, ...restInfo } = info;

  const prettifiedError = info.error ? prettifyError(info.error) : ''

  const stringifiedRest = jsonStringify(restInfo, removeReservedOrEmpty);

  info[MESSAGE] = `${info.timestamp} - ${info.level} - ${info.message}`;

  if (prettifiedError) {
    info[MESSAGE] += `\n\t${prettifiedError}`;
  }

  if (stringifiedRest !== '{}') {
    info[MESSAGE] += `\n\t${stringifiedRest}`;
  }
  
  return info;
});
