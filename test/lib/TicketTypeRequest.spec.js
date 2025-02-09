import { assert, expect } from "chai";

import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";

describe("TicketTypeRequest", () => {
  context("constructor", () => {
    it("should throw an error for invalid ticket type", () => {
      assert.throws(
        () => new TicketTypeRequest("SENIOR", 1),
        "Ticket type must be ADULT, CHILD, or INFANT",
      );
    });

    it("should throw an error for non-integer number of tickets - float", () => {
      assert.throws(
        () => new TicketTypeRequest("ADULT", 1.11111),
        "Number of tickets must be an integer",
      );
    });

    it("should throw an error for non-integer number of tickets - string", () => {
      assert.throws(
        () => new TicketTypeRequest("ADULT", "test"),
        "Number of tickets must be an integer",
      );
    });

    it("should be an immutable object", () => {
      const ticketTypeRequest = new TicketTypeRequest("ADULT", 1);
      expect(Object.isFrozen(ticketTypeRequest)).to.be.eql(true);
    });
  });

  context("getNoOfTickets", () => {
    it("should return the number of tickets", () => {
      expect(new TicketTypeRequest("ADULT", 5).getNoOfTickets()).to.be.eql(5);
    });
  });

  context("getTicketType", () => {
    it("should return the ticket type", () => {
      expect(new TicketTypeRequest("ADULT", 5).getTicketType()).to.be.eql(
        "ADULT",
      );
    });
  });

  context("getTicketPrice", () => {
    it("should return adult ticket price", () => {
      expect(new TicketTypeRequest("ADULT", 2).getTicketPrice()).to.be.eql(25);
    });

    it("should return child ticket price", () => {
      expect(new TicketTypeRequest("CHILD", 1).getTicketPrice()).to.be.eql(15);
    });

    it("should return infant ticket price", () => {
      expect(new TicketTypeRequest("INFANT", 1).getTicketPrice()).to.be.eql(0);
    });
  });
});
