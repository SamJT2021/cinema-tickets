import sinon from "sinon";

import { handleErrorResponse } from "../../../src/pairtest/lib/helpers/error-helpers.js";

const sandbox = sinon.createSandbox();

describe("Error Helpers", () => {
  const res = {
    status: () => {},
    json: () => {},
  };

  let statusStub;
  let jsonStub;

  beforeEach(() => {
    jsonStub = sandbox.stub(res, "json");
    statusStub = sandbox.stub(res, "status").returns({
      json: jsonStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  context("handleErrorResponse", () => {
    it("should return error response", () => {
      const error = {
        code: 400,
        name: "BadRequestError",
        message: "accountId is required",
      };

      handleErrorResponse(error, res);
      sinon.assert.calledWithExactly(statusStub, 400);
      sinon.assert.calledWithExactly(jsonStub, {
        status: "Failure",
        code: 400,
        name: "BadRequestError",
        message: "accountId is required",
      });
    });

    it("should return error response with optional error parameters", () => {
      const error = {
        code: 404,
        name: "ResourceNotFoundError",
        message: "Resource Not Found",
        method: "POST",
        url: "/tickets/urchase",
      };

      handleErrorResponse(error, res);
      sinon.assert.calledWithExactly(statusStub, 404);
      sinon.assert.calledWithExactly(jsonStub, {
        status: "Failure",
        code: 404,
        name: "ResourceNotFoundError",
        message: "Resource Not Found",
        method: "POST",
        url: "/tickets/urchase",
      });
    });
  });
});
