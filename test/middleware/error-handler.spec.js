import sinon from "sinon";
import {
  globalErrorHandler,
  resourceNotFound,
  invalidJSONHandler,
} from "../../src/pairtest/middleware/error-handler.js";
import ResourceNotFoundError from "../../src/pairtest/lib/errors/ResourceNotFoundError.js";

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

  context("resourceNotFound", () => {
    it("should log error and return resource not found error", () => {
      req.url = "/foo/bar";
      req.method = "POST";

      resourceNotFound(req, res, nextSpy);
      sinon.assert.calledWith(
        errorLoggerStub,
        sinon.match.instanceOf(ResourceNotFoundError),
      );
      sinon.assert.calledWithExactly(statusStub, 404);
      sinon.assert.calledWithExactly(jsonStub, {
        status: "Failure",
        code: 404,
        message: "Resource Not Found",
        name: "ResourceNotFoundError",
        method: "POST",
        url: "/foo/bar",
      });
    });
  });

  context("invalidJSONHandler", () => {
    it("should log error and return Bad Request", () => {
      const error = new SyntaxError("Unexpected String in JSON at position");
      error.body = "test";
      error.status = 400;
      error.stack = "stack";

      invalidJSONHandler(error, req, res, nextSpy);
      sinon.assert.calledWithExactly(errorLoggerStub, "stack");
      sinon.assert.calledWithExactly(statusStub, 400);
    });

    it("should call next with error", () => {
      const error = new SyntaxError("Unexpected String in JSON at position");
      error.body = "test";
      error.stack = "stack";

      invalidJSONHandler(error, req, res, nextSpy);
      sinon.assert.calledWithExactly(nextSpy, error);
    });

    it("should call next without error", () => {
      const error = undefined;

      invalidJSONHandler(error, req, res, nextSpy);
      sinon.assert.calledOnce(nextSpy);
    });
  });
});
