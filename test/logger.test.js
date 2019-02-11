import chai from 'chai';
import capture from 'capture-console';
import Chance from 'chance';

import { log, setupNodeLogger } from '..';

const expect = chai.expect;
const chance = new Chance();

describe('strigo-node-logger', function() {
  describe('#setupNodeLogger()', function() {
    beforeEach(() => {
      setupNodeLogger('dev', 'dev');
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

      const stderr = capture.captureStderr(() => {
        log.error(printout);
      });

      expect(stderr.indexOf(printout)).to.be.gt(-1);
    });

    it('should write debug printout when set up with debug level', function() {
      setupNodeLogger('dev', 'dev', 'debug');

      const printout = chance.string();

      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout.indexOf(printout)).to.be.gt(-1);
    });

  });
});
