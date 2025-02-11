import ValidationError from "../errors/ValidationError.js";

export default class TicketsRequestBodyValidator {
  static validateTicketsRequest = (tickets) => {
    if (tickets == undefined) {
      throw new ValidationError("tickets are required");
    }

    if (
      typeof tickets !== "object" ||
      tickets === null ||
      Array.isArray(tickets) ||
      typeof tickets === "function"
    ) {
      throw new ValidationError(
        "tickets must be an object with key-value pairs",
      );
    }

    if (Object.keys(tickets).length === 0) {
      throw new ValidationError("tickets object must not be empty");
    }
  };
}
