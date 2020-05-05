// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

const { setupExpressLogger } = require('../setup/express');

const app = express();
const port = 8080;

const { loggerMiddleware, errorLoggerMiddleware } = setupExpressLogger({});

app.use(loggerMiddleware);

app.get('/', (req, res) => {
  // throw new Error('oops'); // uncomment this line to test error handler
  res.send('Hello World!');
});

// Note: error logger must be attached after routers
app.use(errorLoggerMiddleware);

app.listen(port);
