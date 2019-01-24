# strigo-node-logger

A NodeJS logger instrumentation library for Strigo applications.

This is a very light abstraction over a common logger.
It provides a way to setup the logger for various applications, defaults as to where to direct logs in different cases, and a way to determine context for entries in a generic way.

The logger is built around the [bunyan logger](https://github.com/trentm/node-bunyan).

## Installation

Add `"node-logger": "strigo/strigo-node-logger.git#TAG"` to your `package.json`.

## Usage

### In a vanilla node application

```javascript
import logger, { setupNodeLogger } from 'node-logger';

setupNodeLogger('MyApp', process.env.ENV, 'info');

logger.info(...);

// And so on...
```

### In an ExpressJS application

```javascript
import logger, { setupExpressLogger } from 'node-logger';

setupExpressLogger('MyWebApp', process.env.ENV, 'debug');

app.use(logger);

logger.info(...);

// And so on...
```
