import { assert, expect } from "chai";

import TicketService from "../../src/pairtest/services/TicketService.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";

describe("TicketService", () => {
  const accountId = 123456;
  const tickets = [
    new TicketTypeRequest("ADULT", 2),
    new TicketTypeRequest("CHILD", 1),
    new TicketTypeRequest("INFANT", 1),
  ];

  context("constructor", () => {
    it("should throw an error if tickets are not an Array", () => {
      assert.throws(() => {
        new TicketService(accountId, { ADULT: 2, CHILD: 1, INFANT: 1 }),
          TypeError,
          "tickets must be an Array";
      });
    });

    it("should throw an error if each ticket is not and instance of TicketTypeRequest", () => {
      assert.throws(() => {
        new TicketService(accountId, [{ ADULT: 2, CHILD: 1, INFANT: 1 }]),
          TypeError,
          "Each ticket must be an instance of TicketTypeRequest";
      });
    });
  });

  context("#getTotalNumberOfTickets", () => {
    it("should calculate the total number of tickets", async () => {
      const ticketService = new TicketService(accountId, tickets);
      const result = await ticketService.purchaseTickets();
      expect(result.totalNoOfTickets).to.be.eql(4);
    });
  });

  context("#getIndividualTicketTotals", () => {
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
});
