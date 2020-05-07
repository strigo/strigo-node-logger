const { format } = require('logform');
const jsonStringify = require('fast-safe-stringify');

/*
 * function errors (info)
 * Handles special 'err' field and formats error according to ECS
 */
module.exports = format((info) => {
  if (!Object.prototype.hasOwnProperty.call(info, 'err')) return info;

  const { err, ...restOfInfo } = info;
  const event = {};

  if (err instanceof Error) {
    event.error = { name: err.name, message: err.message, stack_trace: err.stack };
  } else {
    event.error = { raw: jsonStringify(err) };
  }

  return { ...event, ...restOfInfo };
});
