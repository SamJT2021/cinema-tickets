import InvalidPurchaseException from "../errors/InvalidPurchaseException.js";
import { MAX_NUMBER_OF_TICKETS_PER_PURCHASE } from "../../../constants.js";

export default class PurchaseTicketsValidator {
  static validatePurchaseTicketsRequest = (totalNoOfTickets) => {
    if (totalNoOfTickets > MAX_NUMBER_OF_TICKETS_PER_PURCHASE) {
      throw new InvalidPurchaseException(
        `The maximum number of tickets that can be purchased at a time is ${MAX_NUMBER_OF_TICKETS_PER_PURCHASE}`,
      );
    }
  };
}
