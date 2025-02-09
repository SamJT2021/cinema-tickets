import InternalServerError from "../lib/errors/InternalServerError.js";
import TicketTypeRequest from "../lib/TicketTypeRequest.js";
import PurchaseTicketsValidator from "../lib/validators/PurchaseTicketsValidator.js";

export default class TicketService {
  // #accountId;
  #ticketTypeRequests;

  constructor(accountId, ticketTypeRequests) {
    if (!(ticketTypeRequests instanceof Array)) {
      throw new InternalServerError("tickets must be an Array");
    }

    if (
      !ticketTypeRequests.every((ticket) => ticket instanceof TicketTypeRequest)
    ) {
      throw new InternalServerError(
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

  #getTotalCost() {
    const totalCost = this.#ticketTypeRequests.reduce(
      (accumulator, ticketType) =>
        accumulator + ticketType.getNoOfTickets() * ticketType.getTicketPrice(),
      0,
    );

    if (isNaN(totalCost)) {
      throw new InternalServerError("Total Cost must be a number");
    }

    if (totalCost <= 0) {
      throw new InternalServerError(
        "Total Cost cannot be less than or equal to 0",
      );
    }

    return totalCost;
  }

  async purchaseTickets() {
    // TODO: use this.#accountId and this.#ticketTypeRequests

    const totalNoOfTickets = this.#getTotalNumberOfTickets();
    const ticketsOverview = this.#getIndividualTicketTotals();
    const totalCost = this.#getTotalCost();

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
      totalCost,
    };
  }
}
