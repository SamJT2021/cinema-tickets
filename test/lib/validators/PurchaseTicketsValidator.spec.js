import { assert } from "chai";

import PurchaseTicketsValidator from "../../../src/pairtest/lib/validators/PurchaseTicketsValidator.js";
import InvalidPurchaseException from "../../../src/pairtest/lib/errors/InvalidPurchaseException.js";

describe("PurchaseTicketsValidator", () => {
  describe("validatePurchaseTicketsRequest", () => {
    it("should throw error for exceeding maximum number of tickets purchased at a time", () => {
      const totalNoOfTickets = 26;

      assert.throws(
        () =>
          PurchaseTicketsValidator.validatePurchaseTicketsRequest(
            totalNoOfTickets,
          ),
        InvalidPurchaseException,
        "The maximum number of tickets that can be purchased at a time is 25",
      );
    });
  });
});
