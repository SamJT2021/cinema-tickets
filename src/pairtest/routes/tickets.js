import { purchaseTicketsHandler } from "../routes/handlers/purchase-tickets-handler.js";

export function ticketRoutes(app) {
  app.post("/tickets/purchase", purchaseTicketsHandler);
}
