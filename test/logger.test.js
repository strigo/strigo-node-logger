import chai from 'chai';
import capture from 'capture-console';
import Chance from 'chance';

import { setupNodeLogger, setupExpressLogger } from '..';

const expect = chai.expect;
const chance = new Chance();

describe('strigo-node-logger', function() {
  describe('#setupNodeLogger()', function() {
    it('should printout the configured severity level', function() {
      const log = setupNodeLogger(null, 'warn');

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

    it('should not write debug printout when set up with info level', function() {
      const log = setupNodeLogger('prod', 'info');

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout.indexOf(printout)).to.be.eq(-1);
    });

    it('should not write debug printout when configured to info in runtime', function() {
      const log = setupNodeLogger('prod', 'debug');
      log.level = 'info';

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout.indexOf(printout)).to.be.eq(-1);
    });

    it('should allow setting up an express logger', function() {
      const { logger: log, loggerMiddleware: middleware } = setupExpressLogger('prod', 'info');

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
