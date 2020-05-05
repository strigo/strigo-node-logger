/* eslint-disable no-param-reassign */
const { format } = require('logform');

/*
 * function ecs (info)
 * Aligns the base info object fields to the ECS schema
 */
module.exports = format((info) => {
  if (info.timestamp) {
    info['@timestamp'] = info.timestamp;
    delete info.timestamp;
  }

  info.log = { level: info.level, ...info.log };
  delete info.level;

  if (info.stack) {
    info.error = { stack_trace: info.stack, ...info.error };
    delete info.stack;
  }

  return info;
});
