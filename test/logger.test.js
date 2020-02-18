import chai from 'chai';
import capture from 'capture-console';
import Chance from 'chance';

import { log, setupNodeLogger, setupExpressLogger, configuredTransports } from '..';

const expect = chai.expect;
const chance = new Chance();

describe('strigo-node-logger', function() {
  describe('#setupNodeLogger()', function() {
    beforeEach(() => {
      setupNodeLogger();
    });

    it('should write info printout', function() {
      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.info(printout);
      });

      expect(stdout.indexOf(printout)).to.be.gt(-1);
    });

    it('should write warn printout', function() {
      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.warn(printout);
      });

      expect(stdout.indexOf(printout)).to.be.gt(-1);
    });

    it('should write error printout', function() {
      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.error(printout);
      });

      expect(stdout.indexOf(printout)).to.be.gt(-1);
    });

    it('should write debug printout when set up with debug level', function() {
      setupNodeLogger('debug');

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout.indexOf(printout)).to.be.gt(-1);
    });

    it('should not write debug printout when set up with info level', function() {
      setupNodeLogger('info');

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout.indexOf(printout)).to.be.eq(-1);
    });

    it('should not write debug printout when configured to info in runtime', function() {
      setupNodeLogger('debug');
      configuredTransports.console.level = 'info';

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout.indexOf(printout)).to.be.eq(-1);
    });

    it('should allow setting up an express logger', function() {
      setupExpressLogger();

      // Should be a function. This test can be better if we check for specific
      // expressWinston attributes.
      expect({}.toString.call(log)).to.be.eq('[object Function]');
    });
  });
});
