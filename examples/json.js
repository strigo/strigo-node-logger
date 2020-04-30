const setupNodeLogger = require('../setup-winston');

// initiate a logger with 'info' level and verbose output which is more human readable
const log = setupNodeLogger({});

log.debug('dev loop feedback'); // this line won't appear as default log level is 'info'
log.info('a log line');
log.warn('you should see this', { workspaceId: 'abcd1234', tags: ['webserver'] });
log.error('this is bad', { workspaceId: 'abcd1234', tags: ['webserver'] });
