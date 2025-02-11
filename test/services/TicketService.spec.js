import { assert, expect } from "chai";
import sinon from "sinon";

import TicketService from "../../src/pairtest/services/TicketService.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";
import InternalServerError from "../../src/pairtest/lib/errors/InternalServerError.js";
import TicketPaymentService from "../../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../../src/thirdparty/seatbooking/SeatReservationService.js";

const sandbox = sinon.createSandbox();

describe("TicketService", () => {
  const accountId = 123456;
  const tickets = [
    new TicketTypeRequest("ADULT", 2),
    new TicketTypeRequest("CHILD", 1),
    new TicketTypeRequest("INFANT", 1),
  ];

  context("constructor", () => {
    it("should throw an error if accountId is invalid", () => {
      assert.throws(
        () => new TicketService("test", tickets),
        TypeError,
        "accountId must be an integer",
      );
    });

    it("should throw an error if tickets are not an Array", () => {
      assert.throws(() => {
        new TicketService(accountId, { ADULT: 2, CHILD: 1, INFANT: 1 }),
          InternalServerError,
          "tickets must be an Array";
      });
    });

    it("should throw an error if each ticket is not and instance of TicketTypeRequest", () => {
      assert.throws(() => {
        new TicketService(accountId, [{ ADULT: 2, CHILD: 1, INFANT: 1 }]),
          InternalServerError,
          "Each ticket must be an instance of TicketTypeRequest";
      });
    });
  });

  context("#getTotalTickets", () => {
    it("should calculate the total number of tickets", async () => {
      const ticketService = new TicketService(accountId, tickets);
      const result = await ticketService.purchaseTickets();
      expect(result.totalNoOfTickets).to.be.eql(4);
    });
  });

  context("#getTicketTypeTotals", () => {
    it("should return total number of tickets for each type", async () => {
      const ticketService = new TicketService(accountId, tickets);
      const result = await ticketService.purchaseTickets();
      expect(result.ticketsOverview).to.be.eql({
        ADULT: 2,
        CHILD: 1,
        INFANT: 1,
      });
    });

    it("should return total number of tickets for type passed only", async () => {
      const ticketService = new TicketService(accountId, [
        new TicketTypeRequest("ADULT", 2),
      ]);
      const result = await ticketService.purchaseTickets();
      expect(result.ticketsOverview).to.be.eql({
        ADULT: 2,
      });
    });
  });

  context("#getTotalCost", () => {
    it("should calculate the total cost of tickets", async () => {
      const ticketService = new TicketService(accountId, tickets);
      const result = await ticketService.purchaseTickets();
      expect(result.totalCost).to.be.eql(65);
    });
  });

  context("#validateTotalCost", () => {
    let getTicketPriceStub;

    beforeEach(() => {
      getTicketPriceStub = sandbox.stub(
        TicketTypeRequest.prototype,
        "getTicketPrice",
      );
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should throw an error if total cost is not a number", async () => {
      getTicketPriceStub.returns("test");
      const ticketService = new TicketService(accountId, tickets);
      try {
        await ticketService.purchaseTickets();
      } catch (error) {
        expect(error).to.be.eql(
          new InternalServerError("Total Cost must be a number"),
        );
      }
    });

    it("should throw an error if total cost is 0", async () => {
      getTicketPriceStub.returns(0);
      const ticketService = new TicketService(accountId, tickets);
      try {
        await ticketService.purchaseTickets();
      } catch (error) {
        expect(error).to.be.eql(
          new InternalServerError(
            "Total Cost cannot be less than or equal to 0",
          ),
        );
      }
    });

    it("should throw an error if total cost is less than 0", async () => {
      getTicketPriceStub.returns(-1);
      const ticketService = new TicketService(accountId, tickets);
      try {
        await ticketService.purchaseTickets();
      } catch (error) {
        expect(error).to.be.eql(
          new InternalServerError(
            "Total Cost cannot be less than or equal to 0",
          ),
        );
      }
    });
  });

  context("#getTotalSeatsToReserve", async () => {
    it("should calculate the total number of seats required", async () => {
      const ticketService = new TicketService(accountId, tickets);
      const result = await ticketService.purchaseTickets();
      expect(result.totalSeats).to.be.eql(3);
    });
  });

  context("purchaseTickets", () => {
    let makePaymentStub;
    let reserveSeatStub;

    beforeEach(() => {
      makePaymentStub = sandbox
        .stub(TicketPaymentService.prototype, "makePayment")
        .returns(true);
      reserveSeatStub = sandbox
        .stub(SeatReservationService.prototype, "reserveSeat")
        .returns(true);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should make payment and seat reservation to thirdparty services", async () => {
      const ticketService = new TicketService(accountId, tickets);
      const result = await ticketService.purchaseTickets();
      sandbox.assert.calledWithExactly(makePaymentStub, accountId, 65);
      sandbox.assert.calledWithExactly(reserveSeatStub, accountId, 3);
      expect(result).to.be.eql({
        totalNoOfTickets: 4,
        ticketsOverview: { ADULT: 2, CHILD: 1, INFANT: 1 },
        totalCost: 65,
        totalSeats: 3,
      });
    });
  });
});
