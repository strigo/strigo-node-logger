const { format } = require('logform');

/*
 * function errors (info)
 * Handles special 'err' field and formats error according to ECS
 */
module.exports = format((info) => {
  if (!Object.prototype.hasOwnProperty.call(info, 'err')) return info;

  const { err, error, ...restOfInfo } = info;
  const event = {};

  if (err instanceof Error) {
    event.error = { name: err.name, message: err.message, stack_trace: err.stack };
  } else {
    event.error = { raw: JSON.stringify(err) };
  }

  return { ...event, ...restOfInfo };
});
