import sinon from "sinon";

import { purchaseTicketsHandler } from "../../../src/pairtest/routes/handlers/purchase-tickets-handler.js";
import TicketService from "../../../src/pairtest/services/TicketService.js";

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

  beforeEach(() => {
    jsonStub = sandbox.stub(res, "json");
    statusStub = sandbox.stub(res, "status").returns({
      json: jsonStub,
    });
    nextSpy = sandbox.spy(next);
    purchaseTicketsStub = sandbox.stub(
      TicketService.prototype,
      "purchaseTickets",
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  context("purchaseTicketsHandler", () => {
    it("should call purchaseTickets and return success json", async () => {
      req.body = {
        accountId: 123456,
        tickets: {
          ADULT: 2,
          CHILD: 1,
          INFANT: 1,
        },
      };

      purchaseTicketsStub.returns({
        totalNoOfTickets: 4,
        totalCost: 65,
        currency: "GBP",
        totalSeats: 3,
        ticketsOverview: { ADULT: 2, CHILD: 1, INFANT: 1 },
      });

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
