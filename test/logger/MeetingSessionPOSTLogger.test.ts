// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as chai from 'chai';
//import * as chaiFetch from 'chai-fetch';
import * as sinon from 'sinon';
//chai.use(chaiFetch);

//import Logger from '../../src/logger/Logger';
import LogLevel from '../../src/logger/LogLevel';
import MeetingSessionPOSTLogger from '../../src/logger/MeetingSessionPOSTLogger';
//import IntervalScheduler from '../../src/scheduler/IntervalScheduler';
import MeetingSessionConfiguration from '../../src/meetingsession/MeetingSessionConfiguration';
import DOMMockBuilder from '../dommock/DOMMockBuilder';

describe('MeetingSessionPOSTLogger', () => {
  let expect: Chai.ExpectStatic;
  let debugSpy: sinon.SinonSpy;
  let infoSpy: sinon.SinonSpy;
  let warnSpy: sinon.SinonSpy;
  let errorSpy: sinon.SinonSpy;
  let startLogPublishSchedulerSpy: sinon.SinonSpy;
  let domMockBuilder: DOMMockBuilder | null = null;
  before(() => {
    expect = chai.expect;
  });

  beforeEach(() => {
    domMockBuilder = new DOMMockBuilder();
  });

  after(() => {
    if (domMockBuilder) {
        domMockBuilder.cleanup();
        domMockBuilder = null;
      }
  });

  const configuration = new MeetingSessionConfiguration(
    {
      MeetingId: 'meeting-id',
      MediaPlacement: {
        AudioHostUrl: 'audio-host-url',
        ScreenDataUrl: 'screen-data-url',
        ScreenSharingUrl: 'screen-sharing-url',
        ScreenViewingUrl: 'screen-viewing-url',
        SignalingUrl: 'signaling-url',
        TurnControlUrl: 'turn-control-url',
      },
    },
    {
      AttendeeId: 'attendee-id',
      JoinToken: 'join-token',
    }
  );

  describe('construction', () => {
    it('can be constructed', () => {
      const logger: MeetingSessionPOSTLogger = new MeetingSessionPOSTLogger('testLogger', configuration, 2, 10000, "https://wn8uetxz70.execute-api.us-east-1.amazonaws.com/Prod/", LogLevel.WARN);

      expect(logger).to.not.equal(null);
      expect(logger.getLogLevel()).to.equal(LogLevel.WARN);
    });
    it('can be with different level', () => {
      const logger: MeetingSessionPOSTLogger = new MeetingSessionPOSTLogger('testLogger', configuration, 2, 10000, "https://wn8uetxz70.execute-api.us-east-1.amazonaws.com/Prod/", LogLevel.WARN);
      expect(logger).to.not.equal(null);
      expect(logger.getLogLevel()).to.equal(LogLevel.WARN);
    });
  });


  describe('startLogPublishScheduler', () => {
    it('should call the startLogPublishScheduler', done => {
      const logger: MeetingSessionPOSTLogger = new MeetingSessionPOSTLogger('testLogger', configuration, 2, 1000, "https://wn8uetxz70.execute-api.us-east-1.amazonaws.com/Prod/", LogLevel.WARN);

      logger.info("Adding this log as a test");
      logger.startLogPublishScheduler(10);
      expect(startLogPublishSchedulerSpy.calledOnce).to.be.true;
        new TimeoutScheduler(1500.start(() => {
                     // Write some expert() checks here
                      done()
                  });
    });

  });

//   describe('logging level', () => {
//     const originalConsole = {
//       debug: console.debug,
//       info: console.info,
//       warn: console.warn,
//       error: console.error,
//     };
//
//     before(() => {
//       // eslint-disable-next-line
//       const noOpFunc = (_message?: any, ..._optionalParams: any[]) => {};
//       console.debug = noOpFunc;
//       console.info = noOpFunc;
//       console.warn = noOpFunc;
//       console.error = noOpFunc;
//
//       debugSpy = sinon.spy(console, 'debug');
//       infoSpy = sinon.spy(console, 'info');
//       warnSpy = sinon.spy(console, 'warn');
//       errorSpy = sinon.spy(console, 'error');
//     });
//     after(() => {
//       debugSpy.restore();
//       infoSpy.restore();
//       warnSpy.restore();
//       errorSpy.restore();
//
//       console.debug = originalConsole.debug;
//       console.info = originalConsole.info;
//       console.warn = originalConsole.warn;
//       console.error = originalConsole.error;
//     });
//
//     it('should log nothing with LogLevel.OFF', () => {
//       const logger: MeetingSessionPOSTLogger = new MeetingSessionPOSTLogger('testLogger', configuration, 2, 10000, "https://wn8uetxz70.execute-api.us-east-1.amazonaws.com/Prod/", LogLevel.OFF);
//
//       logger.info('info');
//       logger.error('error');
//       expect(infoSpy.calledOnce).to.not.be.true;
//       expect(errorSpy.calledOnce).to.not.be.true;
//     });
//
//     it('should skip info and debug logs by default', () => {
//       const logger: MeetingSessionPOSTLogger = new MeetingSessionPOSTLogger('testLogger', configuration, 2, 10000, "https://wn8uetxz70.execute-api.us-east-1.amazonaws.com/Prod/");
//
//       logger.debug(() => {
//         return 'debug';
//       });
//       logger.info('info');
//       logger.warn('warn');
//       logger.error('error');
//       expect(infoSpy.calledOnce).to.not.be.true;
//       expect(debugSpy.calledOnce).to.not.be.true;
//       expect(warnSpy.calledOnce).to.not.be.true;
//       expect(errorSpy.calledOnce).to.be.true;
//     });
//
//     it('should have debug and info logs after setting DEBUG log level', () => {
//       const logger: MeetingSessionPOSTLogger = new MeetingSessionPOSTLogger('testLogger', configuration, 2, 10000, "https://wn8uetxz70.execute-api.us-east-1.amazonaws.com/Prod/");
//       logger.debug(() => {
//         return 'debug';
//       });
//       expect(debugSpy.calledOnce).to.not.be.true;
//       expect(logger.getLogLevel()).to.equal(LogLevel.WARN);
//       logger.setLogLevel(LogLevel.DEBUG);
//       expect(logger.getLogLevel()).to.equal(LogLevel.DEBUG);
//       logger.debug(() => {
//         return 'debug';
//       });
//       logger.info('info');
//       expect(debugSpy.calledOnce).to.be.true;
//       expect(infoSpy.calledOnce).to.be.true;
//     });
 });
});
