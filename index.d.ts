import { Logger } from 'winston';
import { Handler } from 'express';
declare namespace strigoNodeLogger {
  type NodeLoggerOptions = {
    json?: boolean;
    level?: string;
  }

  type SkipOptions = {
    agent: string,
    urls: string[],
    statuses: number[]
  }

  type NodeExpressLoggerOptions = NodeLoggerOptions & {
    skip?: SkipOptions[],
    logger?: Logger
  }

  function setupNodeLogger(loggerOptions: NodeLoggerOptions): Logger;
  function setupExpressLogger(loggerOptions: NodeExpressLoggerOptions): {
    logger: Logger, loggerMiddleware: Handler, errorLoggerMiddleware: Handler
  };
}

export = strigoNodeLogger;