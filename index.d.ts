import { Logger } from 'winston';
import { Handler } from 'express';
import { RouteFilter } from 'express-winston';

declare namespace strigoNodeLogger {
  type NodeLoggerOptions = {
    json?: boolean;
    level?: string;
  }

  type NodeExpressLoggerOptions = NodeLoggerOptions & {
    skip?: RouteFilter[]
  }

  function setupNodeLogger(loggerOptions: NodeLoggerOptions): Logger;
  function setupExpressLogger(loggerOptions: NodeExpressLoggerOptions): {
    logger: Logger, loggerMiddleware: Handler, errorLoggerMiddleware: Handler
  };
}

export = strigoNodeLogger;