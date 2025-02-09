import { assert } from "chai";

import TicketService from "../../src/pairtest/services/TicketService.js";

describe("TicketService", () => {
  const accountId = 123456;

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
});
