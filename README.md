# strigo-node-logger

A NodeJS logger instrumentation library for Strigo applications.

This is a very light abstraction over a common logger.
It provides a way to setup the logger for various applications, defaults as to where to direct logs in different cases, and a way to determine context for entries in a generic way.

The logger is built around the [winston logger](https://github.com/winstonjs/winston).

## Installation

Add `"node-logger": "strigo/strigo-node-logger.git#TAG"` to your `package.json`.

## Usage

### In a vanilla node application

```javascript
import { log, setupNodeLogger, configuredTransports } from 'node-logger';

// Optionally pass a winston level here.
setupNodeLogger();

log.info(...);

configuredTransports.console.level = 'debug';
log.debug(...);
// And so on...
```

### In an ExpressJS application

We use [express-winston](https://github.com/bithavoc/express-winston) here.

```javascript
import { log, setupExpressLogger } from 'node-logger';

setupExpressLogger();

app.use(log);

log.info(...);

// And so on...
```
