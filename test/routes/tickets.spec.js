import request from "supertest";
import sinon from "sinon";

import TicketPaymentService from "../../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../../src/thirdparty/seatbooking/SeatReservationService.js";
import app from "../../src/app.js";

const sandbox = sinon.createSandbox();

describe("POST /tickets/purchase", () => {
  beforeEach(() => {
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
});
