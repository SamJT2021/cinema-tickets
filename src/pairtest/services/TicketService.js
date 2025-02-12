import InternalServerError from "../lib/errors/InternalServerError.js";
import TicketTypeRequest from "../lib/TicketTypeRequest.js";
import PurchaseTicketsValidator from "../lib/validators/PurchaseTicketsValidator.js";
import TicketPaymentService from "../../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../../thirdparty/seatbooking/SeatReservationService.js";
import AccountIdValidator from "../lib/validators/AccountIdValidator.js";

export default class TicketService {
  #accountId;
  #ticketTypeRequests;

  constructor(accountId, ticketTypeRequests) {
    this.#validateInputs(accountId, ticketTypeRequests);

    this.#accountId = accountId;
    this.#ticketTypeRequests = ticketTypeRequests;
  }

  #validateInputs(accountId, ticketTypeRequests) {
    AccountIdValidator.validateAccountId(accountId);

    if (!(ticketTypeRequests instanceof Array)) {
      throw new InternalServerError("ticketTypeRequests must be an Array");
    }

    if (
      !ticketTypeRequests.every((ticket) => ticket instanceof TicketTypeRequest)
    ) {
      throw new InternalServerError(
        "Each ticket must be an instance of TicketTypeRequest",
      );
    }
  }

  #getTotalTickets() {
    return this.#ticketTypeRequests.reduce(
      (accumulator, ticketType) => accumulator + ticketType.getNoOfTickets(),
      0,
    );
  }

  #getTicketTypeTotals() {
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

    this.#validateTotalCost(totalCost);

    return totalCost;
  }

  #validateTotalCost(totalCost) {
    if (isNaN(totalCost)) {
      throw new InternalServerError("Total Cost must be a number");
    }

    if (totalCost <= 0) {
      throw new InternalServerError(
        "Total Cost cannot be less than or equal to 0",
      );
    }
  }

  #getTotalSeatsToReserve() {
    return this.#ticketTypeRequests.reduce((accumulator, ticketType) => {
      if (ticketType.getTicketType() !== "INFANT") {
        return accumulator + ticketType.getNoOfTickets();
      }
      return accumulator;
    }, 0);
  }

  async purchaseTickets() {
    const totalNoOfTickets = this.#getTotalTickets();
    const ticketsOverview = this.#getTicketTypeTotals();
    const totalCost = this.#getTotalCost();
    const totalSeats = this.#getTotalSeatsToReserve();

    PurchaseTicketsValidator.validatePurchaseTicketsRequest(
      totalNoOfTickets,
      ticketsOverview,
    );

    const ticketPaymentService = new TicketPaymentService();
    const seatReservationService = new SeatReservationService();

    // Although thirdparty code is not asynchronous for this test, added await as a best practice.
    await ticketPaymentService.makePayment(this.#accountId, totalCost);
    await seatReservationService.reserveSeat(this.#accountId, totalSeats);

    return {
      totalNoOfTickets,
      ticketsOverview,
      totalCost,
      currency: "GBP",
      totalSeats,
    };
  }
}
