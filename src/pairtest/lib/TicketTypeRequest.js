import { TICKET_TYPES, TICKET_PRICES } from "../../constants.js";
import ValidationError from "./errors/ValidationError.js";

export default class TicketTypeRequest {
  #type;
  #noOfTickets;
  #price;

  constructor(type, noOfTickets) {
    if (!TICKET_TYPES.includes(type)) {
      throw new ValidationError(
        `Ticket type must be ${TICKET_TYPES.slice(0, -1).join(", ")}, or ${TICKET_TYPES.slice(-1)}`,
      );
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new ValidationError("Number of tickets must be an integer");
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
    this.#price = TICKET_PRICES[type];
    Object.freeze(this);
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }

  getTicketPrice() {
    return this.#price;
  }
}
