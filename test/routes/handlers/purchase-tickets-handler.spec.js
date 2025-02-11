import sinon from "sinon";

import { purchaseTicketsHandler } from "../../../src/pairtest/routes/handlers/purchase-tickets-handler.js";
import TicketService from "../../../src/pairtest/services/TicketService.js";
import TicketsRequestBodyValidator from "../../../src/pairtest/lib/validators/TicketsRequestBodyValidator.js";
import InvalidPurchaseException from "../../../src/pairtest/lib/errors/InvalidPurchaseException.js";
import ValidationError from "../../../src/pairtest/lib/errors/ValidationError.js";

const sandbox = sinon.createSandbox();

describe("Purchase Ticket Handler", () => {
  const req = {
    body: {},
  };

  const res = {
    status: () => {},
    json: () => {},
  };

  const next = () => {};

  let jsonStub;
  let statusStub;
  let nextSpy;
  let purchaseTicketsStub;
  let validateTicketsRequestStub;

  beforeEach(() => {
    jsonStub = sandbox.stub(res, "json");
    statusStub = sandbox.stub(res, "status").returns({
      json: jsonStub,
    });
    nextSpy = sandbox.spy(next);
    purchaseTicketsStub = sandbox
      .stub(TicketService.prototype, "purchaseTickets")
      .returns({
        totalNoOfTickets: 4,
        totalCost: 65,
        currency: "GBP",
        totalSeats: 3,
        ticketsOverview: { ADULT: 2, CHILD: 1, INFANT: 1 },
      });
    validateTicketsRequestStub = sandbox.stub(
      TicketsRequestBodyValidator,
      "validateTicketsRequest",
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  context("purchaseTicketsHandler", () => {
    it("should validate tickets request body", async () => {
      req.body = {
        accountId: 123456,
        tickets: {
          ADULT: 2,
          CHILD: 1,
          INFANT: 1,
        },
      };
      await purchaseTicketsHandler(req, res, nextSpy);
      sinon.assert.calledWithExactly(
        validateTicketsRequestStub,
        req.body.tickets,
      );
    });

    it("should call purchaseTickets and return success json", async () => {
      req.body = {
        accountId: 123456,
        tickets: {
          ADULT: 2,
          CHILD: 1,
          INFANT: 1,
        },
      };

      await purchaseTicketsHandler(req, res, nextSpy);
      sinon.assert.calledWithExactly(statusStub, 200);
      sinon.assert.calledWithExactly(jsonStub, {
        status: "Success",
        code: 200,
        totalNoOfTickets: 4,
        totalCost: 65,
        currency: "GBP",
        totalSeats: 3,
        ticketsOverview: { ADULT: 2, CHILD: 1, INFANT: 1 },
      });
    });

    it("should return InvalidPurchaseException", async () => {
      req.body = {
        accountId: 123456,
        tickets: {
          ADULT: 0,
          CHILD: 1,
          INFANT: 1,
        },
      };

      purchaseTicketsStub.throws(
        new InvalidPurchaseException(
          "There must at least 1 adult per purchase",
        ),
      );

      await purchaseTicketsHandler(req, res, nextSpy);
      sinon.assert.calledWithExactly(statusStub, 400);
      sinon.assert.calledWithExactly(jsonStub, {
        status: "Failure",
        name: "InvalidPurchaseException",
        code: 400,
        message: "There must at least 1 adult per purchase",
      });
    });

    it("should return BadRequestError", async () => {
      req.body = {
        tickets: {
          ADULT: 0,
          CHILD: 1,
          INFANT: 1,
        },
      };

      purchaseTicketsStub.throws(new ValidationError("accountId is required"));

      await purchaseTicketsHandler(req, res, nextSpy);
      sinon.assert.calledWithExactly(statusStub, 400);
      sinon.assert.calledWithExactly(jsonStub, {
        status: "Failure",
        name: "BadRequestError",
        code: 400,
        message: "accountId is required",
      });
    });

    it("should call next with error", async () => {
      req.body = {
        accountId: 123456,
        tickets: {
          ADULT: 2,
          CHILD: 1,
          INFANT: 1,
        },
      };

      const error = new Error("error");
      purchaseTicketsStub.throws(error);

      await purchaseTicketsHandler(req, res, nextSpy);
      sinon.assert.calledWithExactly(nextSpy, error);
    });
  });
});
