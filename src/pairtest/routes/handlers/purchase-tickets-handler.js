import TicketService from "../../services/TicketService.js";
import TicketTypeRequest from "../../lib/TicketTypeRequest.js";
import { HTTP_STATUS_CODES } from "../../../constants.js";
import TicketsRequestBodyValidator from "../../lib/validators/TicketsRequestBodyValidator.js";
import { handleErrorResponse } from "../../lib/helpers/error-helpers.js";

import InvalidPurchaseException from "../../lib/errors/InvalidPurchaseException.js";
import ValidationError from "../../lib/errors/ValidationError.js";
import BadRequestError from "../../lib/errors/BadRequestError.js";

const { OK } = HTTP_STATUS_CODES;

async function purchaseTicketsHandler(req, res, next) {
  try {
    const { accountId, tickets } = req.body;

    TicketsRequestBodyValidator.validateTicketsRequest(tickets);
    const ticketTypeRequests = Object.entries(tickets).map(
      ([type, noOfTickets]) => new TicketTypeRequest(type, noOfTickets),
    );

    const ticketService = new TicketService(accountId, ticketTypeRequests);
    const response = await ticketService.purchaseTickets();

    return res.status(OK).json({
      status: "Success",
      code: OK,
      ...response,
    });
  } catch (error) {
    if (
      error instanceof InvalidPurchaseException ||
      error instanceof ValidationError
    ) {
      const formattedError =
        error instanceof ValidationError
          ? new BadRequestError(error.message)
          : error;
      return handleErrorResponse(formattedError, res);
    }

    return next(error);
  }
}

export { purchaseTicketsHandler };
