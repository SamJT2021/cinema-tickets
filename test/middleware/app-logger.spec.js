import { expect } from "chai";
import sinon from "sinon";
import { appLogger } from "../../src/pairtest/middleware/app-logger.js";
import Logger from "../../src/logger.js";

const sandbox = sinon.createSandbox();

describe("appLogger", () => {
  const req = {};
  const res = {};
  const next = () => {};

  let nextSpy;
  let appLoggerStub;

  beforeEach(() => {
    nextSpy = sandbox.spy(next);
    appLoggerStub = sandbox
      .stub(Logger.prototype, "getLogger")
      .returns("logger");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should add logger to req", () => {
    appLogger(req, res, nextSpy);
    sinon.assert.calledOnce(appLoggerStub);
    expect(req.appLogger).to.equal("logger");
  });

  it("should call next", () => {
    appLogger(req, res, nextSpy);
    sinon.assert.calledOnce(nextSpy);
  });
});
