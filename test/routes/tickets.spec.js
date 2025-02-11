import request from "supertest";
import sinon from "sinon";

import TicketPaymentService from "../../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../../src/thirdparty/seatbooking/SeatReservationService.js";
import TicketService from "../../src/pairtest/services/TicketService.js";

import app from "../../src/app.js";
import InternalServerError from "../../src/pairtest/lib/errors/InternalServerError.js";

import { overrideAppLogger } from "../test-helpers/middleware-overrides.js";

const sandbox = sinon.createSandbox();

describe("POST /tickets/purchase", () => {
  beforeEach(() => {
    overrideAppLogger(app);
    sandbox.stub(TicketPaymentService.prototype, "makePayment").returns(true);
    sandbox.stub(SeatReservationService.prototype, "reserveSeat").returns(true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("responds with success json", (done) => {
    request(app)
      .post("/tickets/purchase")
      .send({ accountId: 123456, tickets: { ADULT: 2, CHILD: 1, INFANT: 1 } })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          status: "Success",
          code: 200,
          ticketsOverview: {
            ADULT: 2,
            CHILD: 1,
            INFANT: 1,
          },
          totalCost: 65,
          currency: "GBP",
          totalNoOfTickets: 4,
          totalSeats: 3,
        },
        done,
      );
  });

  it("responds with InvalidPurchaseException error", (done) => {
    request(app)
      .post("/tickets/purchase")
      .send({
        accountId: 123456,
        tickets: { ADULT: 1, CHILD: 1, INFANT: 2 },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        400,
        {
          status: "Failure",
          code: 400,
          message: "There must be at least 1 adult ticket per infant ticket",
          name: "InvalidPurchaseException",
        },
        done,
      );
  });

  it("responds with BadRequestError", (done) => {
    request(app)
      .post("/tickets/purchase")
      .send({
        tickets: { ADULT: 1, CHILD: 1, INFANT: 0 },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        400,
        {
          status: "Failure",
          code: 400,
          message: "accountId is required",
          name: "BadRequestError",
        },
        done,
      );
  });

  it("responds with InternalServerError", (done) => {
    sandbox
      .stub(TicketService.prototype, "purchaseTickets")
      .throws(new InternalServerError("Error"));
    request(app)
      .post("/tickets/purchase")
      .send({
        accountId: 123456,
        tickets: { ADULT: 1, CHILD: 1, INFANT: 0 },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        500,
        {
          status: "Failure",
          code: 500,
          message: "Internal Server Error",
          name: "InternalServerError",
        },
        done,
      );
  });
});
