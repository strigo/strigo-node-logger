const { setupNodeLogger } = require('../setup/winston');

// Initiate a logger with 'info' level in JSON format
const log = setupNodeLogger({});

log.debug('dev loop feedback'); // this line won't appear as default log level is 'info'
log.info('a log line');
log.warn('you should see this', { workspaceId: 'abcd1234', tags: ['webserver'] });
log.error('this is bad', { workspaceId: 'abcd1234', tags: ['webserver'] });
