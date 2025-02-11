import sinon from "sinon";
import { globalErrorHandler } from "../../src/pairtest/middleware/error-handler.js";

const sandbox = sinon.createSandbox();

describe("Error Handler", () => {
  const req = {
    body: {},
    appLogger: {
      error: () => {},
    },
  };

  const res = {
    status: () => {},
    json: () => {},
  };

  const next = () => {};

  let statusStub;
  let jsonStub;
  let nextSpy;
  let errorLoggerStub;

  beforeEach(() => {
    jsonStub = sandbox.stub(res, "json");
    statusStub = sandbox.stub(res, "status").returns({
      json: jsonStub,
    });
    nextSpy = sandbox.spy(next);
    errorLoggerStub = sandbox.stub(req.appLogger, "error");
  });

  afterEach(() => {
    sandbox.restore();
  });

  context("globalErrorHandler", () => {
    it("should log error", () => {
      const error = { stack: "foo" };

      globalErrorHandler(error, req, res, nextSpy);
      sinon.assert.calledWithExactly(errorLoggerStub, "foo");
    });

    it("should return Internal server error", () => {
      const error = new SyntaxError("cannot read undefined");

      globalErrorHandler(error, req, res, nextSpy);
      sinon.assert.calledWithExactly(statusStub, 500);
      sinon.assert.calledWithExactly(jsonStub, {
        status: "Failure",
        code: 500,
        message: "Internal Server Error",
        name: "InternalServerError",
      });
    });

    it("should call next without error", () => {
      const error = undefined;

      globalErrorHandler(error, req, res, nextSpy);
      sinon.assert.calledOnce(nextSpy);
    });
  });
});
