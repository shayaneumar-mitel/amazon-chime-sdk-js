// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import Logger from '../logger/Logger';
import LogLevel from '../logger/LogLevel';
import IntervalScheduler from '../scheduler/IntervalScheduler';
import MeetingSessionConfiguration from '../meetingsession/MeetingSessionConfiguration';

export default class MeetingSessionPOSTLogger implements Logger {
  private logCapture: string[] = [];
  private sequenceNumber: number = 0;
  private lock = false;
  private intervalScheduler: IntervalScheduler;

  constructor(
    private name: string,
    private configuration: MeetingSessionConfiguration,
    private batchSize: number,
    private intervalMs: number,
    private url: string,
    private level = LogLevel.INFO,
  ) {
    this.intervalScheduler = new IntervalScheduler(this.intervalMs);
    this.startLogPublishScheduler(this.batchSize);
    const GlobalAny = global as any;
          GlobalAny['window'] &&
            GlobalAny['window']['addEventListener'] &&

    window.addEventListener('unload', () => {
      this.intervalScheduler.stop();
      const body = this.makeRequestBody(this.logCapture);
      navigator.sendBeacon(this.url, body);
   });
  }

  debug(debugFunction: () => string): void {
    if (LogLevel.DEBUG < this.level) {
      return;
    }
    this.log(LogLevel.DEBUG, debugFunction());
  }

  info(msg: string): void {
    this.log(LogLevel.INFO, msg);
  }

  warn(msg: string): void {
    this.log(LogLevel.WARN, msg);
  }

  error(msg: string): void {
    this.log(LogLevel.ERROR, msg);
  }

  setLogLevel(level: LogLevel): void {
    this.level = level;
  }

  getLogLevel(): LogLevel {
    return this.level;
  }

  startLogPublishScheduler(batchSize: number): void {
    this.intervalScheduler.start(async () => {
      if (this.lock === true || this.logCapture.length === 0) {
        return;
      }
      this.lock = true;
      const batch = this.logCapture.slice(0, batchSize);
      const body = this.makeRequestBody(batch);
      try {
        const response = await fetch(this.url, {
          method: 'POST',
          body,
        });
        if (response.status === 200) {
          this.logCapture = this.logCapture.slice(batch.length);
        }
      } catch (error) {
        console.warn('[MeetingSessionPOSTLogger] ' + error.message);
      } finally {
        this.lock = false;
      }
    });
  }

  private makeRequestBody(batch: string[]) : string {
    return JSON.stringify({
      meetingId: this.configuration.meetingId,
      attendeeId: this.configuration.credentials.attendeeId,
      appName: this.name,
      logs: batch,
    });
  }

  private log(type: LogLevel, msg: string): void {
    if (type < this.level) {
      return;
    }
    const date = new Date();
    this.logCapture.push(
      JSON.stringify({
        sequenceNumber: this.sequenceNumber,
        message: msg,
        timestampMs: date.getTime(),
        logLevel: LogLevel[type],
      })
    );
    this.sequenceNumber += 1;
  }
}