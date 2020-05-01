/* eslint-disable no-unused-expressions */
import capture from 'capture-console';
import Chance from 'chance';
import { expect } from 'chai';

const { setupNodeLogger, setupExpressLogger } = require('..');

const chance = new Chance();

describe('#setupNodeLogger()', () => {
  describe('#json', () => {
    it('should printout the configured severity level', () => {
      const log = setupNodeLogger({ level: 'warn' });

      let printout = chance.string();
      let stdout = capture.captureStdout(() => {
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
      const log = setupNodeLogger({});

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout).to.be.empty;
    });

    it('should not write debug printout when configured to info in runtime', () => {
      const log = setupNodeLogger({ env: 'prod', level: 'debug' });
      log.level = 'info';

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.debug(printout);
      });

      expect(stdout).to.be.empty;
    });

    it('should output JSON structure', () => {
      const log = setupNodeLogger({});

      const printout = chance.string();
      const stdout = capture.captureStdout(() => {
        log.info(printout);
      });

      expect(JSON.parse(stdout)).to.have.all.keys('@timestamp', 'log', 'message');
      expect(JSON.parse(stdout)).to.deep.include({ log: { level: 'info' } });
    });

    it('should correctly place metadata', () => {
      const log = setupNodeLogger({});

      const msg = chance.string();
      const workspace = chance.string();
      const tag = chance.string();
      const stdout = capture.captureStdout(() => {
        log.info(msg, { workspaceId: workspace, tags: [tag] });
      });

      expect(JSON.parse(stdout)).to.deep.include({
        message: msg, strigo: { workspaceId: workspace }, tags: [tag],
      });
    });

    it('should handle errors according to ecs', () => {
      const log = setupNodeLogger({});

      const errmsg = chance.string();
      const stdout = capture.captureStdout(() => {
        log.info(new Error(errmsg));
      });

      expect(JSON.parse(stdout)).to.deep.include({ message: errmsg });
      expect(JSON.parse(stdout)).to.have.nested.property('error.stack_trace');
    });
  });

  describe('#verbose', () => {
    it('should printout the configured severity level', () => {
      const log = setupNodeLogger({ json: false });

      const msg = chance.string({ symbols: false, alpha: true });
      const stdout = capture.captureStdout(() => {
        log.warn(msg);
      });

      // remember that the output has been colorized
      const regex = new RegExp(`.+? - .+warn.+ - ${msg}`);
      expect(stdout).to.match(regex);
    });

    it('should be multiline when metadata is added', () => {
      const log = setupNodeLogger({ json: false });

      const printout = chance.string();
      const workspace = chance.string();
      const stdout = capture.captureStdout(() => {
        log.warn(printout, { workspaceId: workspace });
      });

      const lines = stdout.split('\n\t');
      expect(lines).to.have.lengthOf(2);
      expect(JSON.parse(lines[1])).to.deep.include({ strigo: { workspaceId: workspace } });
    });
  });
});

describe('#setupExpressLogger()', () => {
  it('should allow setting up an express logger', () => {
    const { logger, loggerMiddleware, errorLoggerMiddleware } = setupExpressLogger({});

    // it would be really good to actually mock req/res and check that
    // the middleware actually returns logs but i have no idea how to mock that
    expect(logger).to.be.an('Object');
    expect(loggerMiddleware).to.be.an('Function');
    expect(errorLoggerMiddleware).to.be.an('Function');
  });
});
