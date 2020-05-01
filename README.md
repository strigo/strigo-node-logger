# strigo-node-logger

A NodeJS logger instrumentation library for Strigo applications.

This is a light abstraction over a common logger.
It provides a way to setup the logger for various applications, defaults as to where to direct logs in different cases, and a way to determine context for entries in a generic way.

The logger is built around the [winston logger](https://github.com/winstonjs/winston), and
[express-winston](https://github.com/bithavoc/express-winston) when used as middleware for Express.JS.

Make sure to go over the `winston` & `express-winston` docs to know the API of the logger.
For Express.JS specifically, make sure to [read this](https://github.com/bithavoc/express-winston#error-logging) about binding order of the error logging middleware. 

## Installation

Add `"strigo-node-logger": "strigo/strigo-node-logger.git#TAG"` to your `package.json`.

## Usage

### In a vanilla node application

```javascript
import { setupNodeLogger } from 'strigo-node-logger';

const log = setupNodeLogger({ json = true, level = 'info' });

log.info(...);

log.level = 'debug';
log.debug(...);
// And so on...
```

### In an ExpressJS application

```javascript
import { setupExpressLogger } from 'strigo-node-logger';

const { log, loggerMiddleware, errorLoggerMiddleware } = setupExpressLogger({});

app.use(loggerMiddleware);

// read docs about error logger
app.use(errorLoggerMiddleware);

log.info(...);

// And so on...
```

Check `examples` for more info.
