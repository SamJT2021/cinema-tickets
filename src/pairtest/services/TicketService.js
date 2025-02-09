import TicketTypeRequest from "../lib/TicketTypeRequest.js";
import PurchaseTicketsValidator from "../lib/validators/PurchaseTicketsValidator.js";

export default class TicketService {
  // #accountId;
  #ticketTypeRequests;

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
    this.#ticketTypeRequests = ticketTypeRequests;
  }

  #getTotalNumberOfTickets() {
    return this.#ticketTypeRequests.reduce(
      (accumulator, ticketType) => accumulator + ticketType.getNoOfTickets(),
      0,
    );
  }

  #getIndividualTicketTotals() {
    return this.#ticketTypeRequests.reduce((accumulator, ticket) => {
      return Object.assign(accumulator, {
        [ticket.getTicketType()]: ticket.getNoOfTickets(),
      });
    }, {});
  }

  async purchaseTickets() {
    // TODO: use this.#accountId and this.#ticketTypeRequests

    const totalNoOfTickets = this.#getTotalNumberOfTickets();
    const ticketsOverview = this.#getIndividualTicketTotals();

    // Validate
    PurchaseTicketsValidator.validatePurchaseTicketsRequest(
      totalNoOfTickets,
      ticketsOverview,
    );
    // Make Payment
    // Reserve Seats
    return {
      totalNoOfTickets,
      ticketsOverview,
    };
  }
}
