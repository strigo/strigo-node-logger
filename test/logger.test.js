import capture from 'capture-console';
import Chance from 'chance';
import { expect } from 'chai';

import { setupNodeLogger, setupExpressLogger } from '..';

const chance = new Chance();

describe('strigo-node-logger', () => {
  describe('#setupNodeLogger()', () => {
    it('should printout the configured severity level', () => {
      const log = setupNodeLogger({ level: 'warn' });

      let printout;
      let stdout;

      printout = chance.string();
      stdout = capture.captureStdout(() => {
        log.warn(printout);
      });

      expect(stdout.indexOf(printout)).to.be.gt(-1);
      expect(stdout.indexOf('warn')).to.be.gt(-1);

      printout = chance.string();
      stdout = capture.captureStdout(() => {
        log.info(printout, { x: 'y' });
      });

      expect(stdout.indexOf(printout)).to.be.eq(-1);
      expect(stdout.indexOf('info')).to.be.eq(-1);
    });

    it('should not write debug printout when set up with info level', () => {
      const log = setupNodeLogger({ env: 'prod', level: 'info' });

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout.indexOf(printout)).to.be.eq(-1);
    });

    it('should not write debug printout when configured to info in runtime', () => {
      const log = setupNodeLogger({ env: 'prod', level: 'debug' });
      log.level = 'info';

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout.indexOf(printout)).to.be.eq(-1);
    });

    it('should allow setting up an express logger', () => {
      const { logger: log, loggerMiddleware: middleware } = setupExpressLogger({ env: 'prod', level: 'info' });

      // Should be a function. This test can be better if we check for specific
      // expressWinston attributes.
      expect({}.toString.call(middleware)).to.be.eq('[object Function]');

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.info(printout);
      });

      expect(stdout.indexOf(printout)).to.be.gt(-1);
    });
  });
});
