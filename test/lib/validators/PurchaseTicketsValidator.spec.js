import { assert } from "chai";

import PurchaseTicketsValidator from "../../../src/pairtest/lib/validators/PurchaseTicketsValidator.js";
import InvalidPurchaseException from "../../../src/pairtest/lib/errors/InvalidPurchaseException.js";

describe("PurchaseTicketsValidator", () => {
  describe("validatePurchaseTicketsRequest", () => {
    context("Maximum number of tickets", () => {
      it("should throw error for exceeding maximum number of tickets purchased at a time", () => {
        const totalNoOfTickets = 26;
        const tickets = {
          ADULT: 10,
          CHILD: 14,
          INFANT: 2,
        };

        assert.throws(
          () =>
            PurchaseTicketsValidator.validatePurchaseTicketsRequest(
              totalNoOfTickets,
              tickets,
            ),
          InvalidPurchaseException,
          "The maximum number of tickets that can be purchased at a time is 25",
        );
      });

      it("should not throw an error if purchasing the maximum number of tickets purchased at a time", () => {
        const totalNoOfTickets = 25;
        const tickets = {
          ADULT: 10,
          CHILD: 14,
          INFANT: 1,
        };

        assert.doesNotThrow(() =>
          PurchaseTicketsValidator.validatePurchaseTicketsRequest(
            totalNoOfTickets,
            tickets,
          ),
        );
      });

      it("should not throw an error if purchasing less than the maximum number of tickets purchased at a time", () => {
        const totalNoOfTickets = 20;
        const tickets = {
          ADULT: 10,
          CHILD: 9,
          INFANT: 1,
        };

        assert.doesNotThrow(() =>
          PurchaseTicketsValidator.validatePurchaseTicketsRequest(
            totalNoOfTickets,
            tickets,
          ),
        );
      });
    });

    context("Child and Infant Tickets", () => {
      it("should throw error if attempting to purchase a child ticket without an adult - all types passed as parameters", () => {
        const totalNoOfTickets = 1;
        const tickets = {
          ADULT: 0,
          CHILD: 1,
          INFANT: 0,
        };

        assert.throws(
          () =>
            PurchaseTicketsValidator.validatePurchaseTicketsRequest(
              totalNoOfTickets,
              tickets,
            ),
          InvalidPurchaseException,
          "Child and Infant tickets cannot be purchased without purchasing an Adult ticket",
        );
      });

      it("should throw error if attempting to purchase a infant ticket without an adult - all types passed as parameters", () => {
        const totalNoOfTickets = 1;
        const tickets = {
          ADULT: 0,
          CHILD: 0,
          INFANT: 1,
        };

        assert.throws(
          () =>
            PurchaseTicketsValidator.validatePurchaseTicketsRequest(
              totalNoOfTickets,
              tickets,
            ),
          InvalidPurchaseException,
          "Child and Infant tickets cannot be purchased without purchasing an Adult ticket",
        );
      });

      it("should throw error if attempting to purchase a child ticket without an adult - only child type passed as parameter", () => {
        const totalNoOfTickets = 1;
        const tickets = {
          CHILD: 1,
        };

        assert.throws(
          () =>
            PurchaseTicketsValidator.validatePurchaseTicketsRequest(
              totalNoOfTickets,
              tickets,
            ),
          InvalidPurchaseException,
          "Child and Infant tickets cannot be purchased without purchasing an Adult ticket",
        );
      });

      it("should throw error if attempting to purchase a infant ticket without an adult - only infant type passed as parameter", () => {
        const totalNoOfTickets = 1;
        const tickets = {
          INFANT: 1,
        };

        assert.throws(
          () =>
            PurchaseTicketsValidator.validatePurchaseTicketsRequest(
              totalNoOfTickets,
              tickets,
            ),
          InvalidPurchaseException,
          "Child and Infant tickets cannot be purchased without purchasing an Adult ticket",
        );
      });

      it("should not throw error if attempting to purchase a child ticket with an adult", () => {
        const totalNoOfTickets = 2;
        const tickets = {
          ADULT: 1,
          CHILD: 1,
        };

        assert.doesNotThrow(() =>
          PurchaseTicketsValidator.validatePurchaseTicketsRequest(
            totalNoOfTickets,
            tickets,
          ),
        );
      });

      it("should not throw error if attempting to purchase a infant ticket with an adult", () => {
        const totalNoOfTickets = 2;
        const tickets = {
          ADULT: 1,
          INFANT: 1,
        };

        assert.doesNotThrow(() =>
          PurchaseTicketsValidator.validatePurchaseTicketsRequest(
            totalNoOfTickets,
            tickets,
          ),
        );
      });

      it("should not throw error if attempting to purchase a child and infant ticket with an adult", () => {
        const totalNoOfTickets = 3;
        const tickets = {
          ADULT: 1,
          CHILD: 1,
          INFANT: 1,
        };

        assert.doesNotThrow(() =>
          PurchaseTicketsValidator.validatePurchaseTicketsRequest(
            totalNoOfTickets,
            tickets,
          ),
        );
      });

      it("should not throw error if attempting to purchase an adult ticket only", () => {
        const totalNoOfTickets = 1;
        const tickets = {
          ADULT: 1,
        };

        assert.doesNotThrow(() =>
          PurchaseTicketsValidator.validatePurchaseTicketsRequest(
            totalNoOfTickets,
            tickets,
          ),
        );
      });
    });

    context("Adult and Infant Tickets", () => {
      it("should throw an error if there are more infants than adults", () => {
        const totalNoOfTickets = 1;
        const tickets = {
          ADULT: 3,
          CHILD: 1,
          INFANT: 4,
        };

        assert.throws(
          () =>
            PurchaseTicketsValidator.validatePurchaseTicketsRequest(
              totalNoOfTickets,
              tickets,
            ),
          InvalidPurchaseException,
          "There must be at least 1 adult ticket per infant ticket",
        );
      });

      it("should not throw an error if there are equal number of infants to adults", () => {
        const totalNoOfTickets = 1;
        const tickets = {
          ADULT: 3,
          CHILD: 1,
          INFANT: 3,
        };

        assert.doesNotThrow(() =>
          PurchaseTicketsValidator.validatePurchaseTicketsRequest(
            totalNoOfTickets,
            tickets,
          ),
        );
      });

      it("should not throw an error if there are fewer infants than adults", () => {
        const totalNoOfTickets = 1;
        const tickets = {
          ADULT: 3,
          CHILD: 1,
          INFANT: 3,
        };

        assert.doesNotThrow(() =>
          PurchaseTicketsValidator.validatePurchaseTicketsRequest(
            totalNoOfTickets,
            tickets,
          ),
        );
      });
    });
  });
});
