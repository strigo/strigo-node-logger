const { setupNodeLogger } = require('../setup/winston');

// Initialize a logger with 'info' level and non-JSON format
const log = setupNodeLogger({ json: false, level: 'debug' });

log.debug('dev loop feedback');
log.info('a log line');
log.warn('you should see this');
log.error('this is bad');

// Adding context
log.info('some event just happend', { workspaceId: 'abcd1234', tags: ['true'] });
