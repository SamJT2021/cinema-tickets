import { assert } from "chai";

import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";

describe("TicketTypeRequest", () => {
  context("constructor", () => {
    it("should throw an error for invalid ticket type", () => {
      assert.throws(
        () => new TicketTypeRequest("SENIOR", 1),
        "type must be ADULT, CHILD, or INFANT"
      );
    });
  });
});
