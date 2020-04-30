const setupNodeLogger = require('../setup-winston');

// initiate a logger with 'info' level and verbose output which is more human readable
const log = setupNodeLogger({ compact: false, level: 'debug' });

log.debug('dev loop feedback');
log.info('a log line');
log.warn('you should see this');
log.error('this is bad');

// adding context
log.info('some event just happend', { workspaceId: 'abcd1234' });
