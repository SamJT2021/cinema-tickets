import TicketTypeRequest from "../lib/TicketTypeRequest.js";
// import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";

export default class TicketService {
  // #accountId;
  // #ticketTypeRequests;

  constructor(accountId, ticketTypeRequests) {
    if (!(ticketTypeRequests instanceof Array)) {
      throw new TypeError("tickets must be an Array");
    }

    if (
      !ticketTypeRequests.every((ticket) => ticket instanceof TicketTypeRequest)
    ) {
      throw new TypeError(
        "Each ticket must be an instance of TicketTypeRequest",
      );
    }

    // this.#accountId = accountId;
    // this.ticketTypeRequests = ticketTypeRequests;
  }

  // purchaseTickets() {
  // TODO: use this.#accountId and this.#ticketTypeRequests
  // throws InvalidPurchaseException
  // }
}
