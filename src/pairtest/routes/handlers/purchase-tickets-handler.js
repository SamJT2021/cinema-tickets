import TicketService from "../../services/TicketService.js";
import TicketTypeRequest from "../../lib/TicketTypeRequest.js";
import { HTTP_STATUS_CODES } from "../../../constants.js";

const { OK } = HTTP_STATUS_CODES;

async function purchaseTicketsHandler(req, res, next) {
  try {
    const { accountId, tickets } = req.body;

    // TODO: validate tickets request body
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
    // TODO: handle error
    return next(error);
  }
}

export { purchaseTicketsHandler };
