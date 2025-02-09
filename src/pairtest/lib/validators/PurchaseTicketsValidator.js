import InvalidPurchaseException from "../errors/InvalidPurchaseException.js";
import { MAX_NUMBER_OF_TICKETS_PER_PURCHASE } from "../../../constants.js";

export default class PurchaseTicketsValidator {
  static validatePurchaseTicketsRequest = (
    totalNoOfTickets,
    { ADULT, CHILD, INFANT },
  ) => {
    if (totalNoOfTickets > MAX_NUMBER_OF_TICKETS_PER_PURCHASE) {
      throw new InvalidPurchaseException(
        `The maximum number of tickets that can be purchased at a time is ${MAX_NUMBER_OF_TICKETS_PER_PURCHASE}`,
      );
    }

    if ((CHILD >= 1 || INFANT >= 1) && !ADULT) {
      throw new InvalidPurchaseException(
        "Child and Infant tickets cannot be purchased without purchasing an Adult ticket",
      );
    }

    if (ADULT < INFANT) {
      throw new InvalidPurchaseException(
        "There must be at least 1 adult ticket per infant ticket",
      );
    }
  };
}
