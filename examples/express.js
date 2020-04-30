const express = require('express');
const setupExpressLogger = require('../setup-express');

const app = express();
const port = 8080;

const { loggerMiddleware, errorLoggerMiddleware } = setupExpressLogger({});

app.use(loggerMiddleware);

app.get('/', (req, res) => {
  // throw new Error('oops'); // uncomment this line to test error handler
  res.send('Hello World!');
});

// note that error logger must be attached after routes & roters
app.use(errorLoggerMiddleware);

app.listen(port);
