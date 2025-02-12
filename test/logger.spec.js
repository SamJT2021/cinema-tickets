import { expect } from "chai";
import sinon from "sinon";
import winston from "winston";
import logger from "../src/logger.js";

const sandbox = sinon.createSandbox();

describe("Logger", () => {
  let consoleStub;
  let fileStub;

  beforeEach(() => {
    consoleStub = sandbox
      .stub(winston.transports.Console.prototype, "log")
      .returns(true);
    fileStub = sandbox
      .stub(winston.transports.File.prototype, "log")
      .returns(true);
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.LOG_PATH;
  });

  context("Console logging", () => {
    beforeEach(() => {
      process.env.OUTPUT_LOGS_TO_FILE = "false";
    });

    afterEach(() => {
      delete process.env.LOG_LEVEL;
    });

    it("should set default log level", () => {
      delete process.env.LOG_LEVEL;
      const testLogger = new logger().getLogger();
      const consoleTransport = testLogger.transports.find(
        (transport) => transport instanceof winston.transports.Console,
      );
      expect(consoleTransport.level).to.eql("debug");
    });

    it("should set log level based on env variable", () => {
      process.env.LOG_LEVEL = "info";
      const testLogger = new logger().getLogger();
      const consoleTransport = testLogger.transports.find(
        (transport) => transport instanceof winston.transports.Console,
      );
      expect(consoleTransport.level).to.eql("info");
    });

    it("should log message in the correct format", () => {
      const testLogger = new logger().getLogger();
      testLogger.info("This is an info message");
      sinon.assert.calledOnce(consoleStub);
      const { message, level, timestamp } = consoleStub.getCall(0).args[0];
      expect(message).to.match(/This is an info message/);
      expect(level).to.match(/info/);
      expect(timestamp).to.match(
        /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} [APM]{1}/,
      );
    });
  });

  context("File logging", () => {
    beforeEach(() => {
      process.env.OUTPUT_LOGS_TO_FILE = "true";
    });

    afterEach(() => {
      delete process.env.LOG_PATH;
      delete process.env.OUTPUT_LOGS_TO_FILE;
    });

    it("should set default log path", () => {
      delete process.env.LOG_PATH;
      const testLogger = new logger().getLogger();
      const fileTransport = testLogger.transports.find(
        (transport) => transport instanceof winston.transports.File,
      );
      expect(fileTransport.dirname).to.eql("logs");
      expect(fileTransport.filename).to.eql("application-logs.log");
    });

    it("should set log path based on env variable", () => {
      process.env.LOG_PATH = "logs/test-application-logs.log";
      const testLogger = new logger().getLogger();
      const fileTransport = testLogger.transports.find(
        (transport) => transport instanceof winston.transports.File,
      );
      expect(fileTransport.level).to.eql("error");
      expect(fileTransport.dirname).to.eql("logs");
      expect(fileTransport.filename).to.eql("test-application-logs.log");
    });

    it("should not log if OUTPUT_LOGS_TO_FILE not true", () => {
      process.env.OUTPUT_LOGS_TO_FILE = "false";
      const testLogger = new logger().getLogger();
      testLogger.error("This is an error message");
      sinon.assert.notCalled(fileStub);
    });

    it("should log message in the correct format", () => {
      process.env.LOG_PATH = "logs/test-application-logs.log";
      const testLogger = new logger().getLogger();
      testLogger.error("This is an error message");
      sinon.assert.calledOnce(fileStub);
      const { message, level, timestamp } = fileStub.getCall(0).args[0];
      expect(message).to.match(/This is an error message/);
      expect(level).to.match(/error/);
      expect(timestamp).to.match(
        /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} [APM]{1}/,
      );
    });
  });
});
