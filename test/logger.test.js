/* eslint-disable no-unused-expressions */
import capture from 'capture-console';
import Chance from 'chance';
import { expect } from 'chai';

const { setupNodeLogger, setupExpressLogger } = require('..');
const { ecsMeta } = require('../utils');

const chance = new Chance();

describe('#setupNodeLogger()', () => {
  let msg;
  beforeEach(() => {
    msg = chance.string({ symbols: false, alpha: true });
  });

  describe('#json', () => {
    it('should printout the configured severity level', () => {
      const log = setupNodeLogger({ json: true, level: 'warn' });

      let stdout = capture.captureStdout(() => {
        log.warn(msg);
      });

      expect(stdout.indexOf(msg)).to.be.gt(-1);
      expect(stdout.indexOf('warn')).to.be.gt(-1);

      stdout = capture.captureStdout(() => {
        log.info(msg, { x: 'y' });
      });

      expect(stdout.indexOf(msg)).to.be.eq(-1);
      expect(stdout.indexOf('info')).to.be.eq(-1);
    });

    it('should not write debug printout when set up with info level', () => {
      const log = setupNodeLogger({ level: 'info' });

      const stdout = capture.captureStdout(() => {
        log.debug(msg);
      });

      expect(stdout).to.be.empty;
    });

    it('should not write debug printout when configured to info in runtime', () => {
      const log = setupNodeLogger({ level: 'debug' });
      log.level = 'info';

      const stdout = capture.captureStdout(() => {
        log.debug(msg);
      });

      expect(stdout).to.be.empty;
    });

    it('should output JSON structure by default', () => {
      const log = setupNodeLogger({});

      const stdout = capture.captureStdout(() => {
        log.info(msg);
      });

      expect(JSON.parse(stdout)).to.have.all.keys('@timestamp', 'log', 'message');
      expect(JSON.parse(stdout)).to.deep.include({ log: { level: 'info' } });
    });

    it('should correctly place metadata', () => {
      const log = setupNodeLogger({ json: true, level: 'info' });

      const workspace = chance.string();
      const tag = chance.string();
      const stdout = capture.captureStdout(() => {
        log.info(msg, { workspaceId: workspace, tags: [tag] });
      });

      expect(JSON.parse(stdout)).to.deep.include({
        message: msg, strigo: { workspaceId: workspace }, tags: [tag],
      });
    });

    it('should handle instanceof Error according to ecs', () => {
      const log = setupNodeLogger({ json: true, level: 'info' });

      const errmsg = chance.string();
      const err = new Error(errmsg);
      const stdout = capture.captureStdout(() => {
        log.info(msg, { err });
      });

      expect(JSON.parse(stdout)).to.deep.include(
        { error: { name: err.name, message: errmsg, stack_trace: err.stack } },
      );
      expect(JSON.parse(stdout)).to.have.nested.property('error.stack_trace');

      expect(JSON.parse(stdout)).to.deep.include({ message: msg });
    });

    it('should put Error-like object into error.raw', () => {
      const log = setupNodeLogger({ json: true, level: 'info' });

      const err = { reason: msg };
      const stdout = capture.captureStdout(() => {
        log.info(msg, { err });
      });

      expect(JSON.parse(stdout)).to.deep.include({ error: { raw: JSON.stringify(err) } });
    });
  });

  describe('#non-json', () => {
    it('should printout the configured severity level', () => {
      const log = setupNodeLogger({ json: false, level: 'info' });

      const stdout = capture.captureStdout(() => {
        log.warn(msg);
      });

      // remember that the output has been colorized
      const regex = new RegExp(`.+? - .+warn.+ - ${msg}`);
      expect(stdout).to.match(regex);
    });

    it('should output metadata in JSON format on a separate line', () => {
      const log = setupNodeLogger({ json: false, level: 'info' });

      const workspace = chance.string();
      const stdout = capture.captureStdout(() => {
        log.warn(msg, { workspaceId: workspace });
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

    // It would be really good to actually mock req/res and check that
    // the middleware actually returns logs but I have no idea how to mock that
    expect(logger).to.be.an('Object');
    expect(loggerMiddleware).to.be.an('Function');
    expect(errorLoggerMiddleware).to.be.an('Function');
  });
});


describe('utils', () => {
  let req = {};
  let expected = {};
  beforeEach(() => {
    req = {
      httpVersion: '1.1',
      method: 'GET',
      originalUrl: '/',
      protocol: 'http',
      ip: '127.0.0.1',
      socket: {
        bytesRead: 12,
        remotePort: 33553,
        localPort: 80,
        localAddress: '127.0.0.1',
      },
    };

    expected = {
      http: {
        protocol: req.httpVersion,
        request: {
          method: req.method.toLowerCase(),
          bytes: req.socket.bytesRead,
        },
      },
      url: {
        original: req.originalUrl,
        scheme: req.protocol,
      },
      client: {
        ip: req.ip,
        port: req.socket.remotePort,
      },
      server: {
        ip: req.socket.localAddress,
        port: req.socket.localPort,
      },
    };
  });

  describe('#ecsMeta()', () => {
    it('should process minimal request object', () => {
      expect(ecsMeta(req)).to.deep.equal(expected);
    });
  });
});
