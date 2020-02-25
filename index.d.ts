import { Logger } from 'winston';
import { Handler } from 'express';

declare namespace strigoNodeLogger {
  function setupNodeLogger(env: string, level?: string): Logger;
  function setupExpressLogger(env: string, level?: string): { logger: Logger, loggerMiddleware: Handler };
}

export = strigoNodeLogger;