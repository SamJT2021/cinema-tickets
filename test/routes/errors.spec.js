import request from "supertest";

import app from "../../src/app.js";
import { overrideAppLogger } from "../test-helpers/middleware-overrides.js";

describe("Error Handling", () => {
  beforeEach(() => {
    overrideAppLogger(app);
  });

  context("Resource Not Found", () => {
    it("handles resource not found", (done) => {
      request(app).post("/not-an-endpoint").expect(
        404,
        {
          status: "Failure",
          code: 404,
          message: "Resource Not Found",
          name: "ResourceNotFoundError",
          method: "POST",
          url: "/not-an-endpoint",
        },
        done,
      );
    });
  });

  context("Invalid JSON", () => {
    it("handles invalid JSON in a request", (done) => {
      request(app)
        .post("/tickets/purchase")
        .send('{"invalid"}')
        .type("json")
        .set("Accept", "application/json")
        .expect(
          400,
          {
            status: "Failure",
            code: 400,
            message: "Expected ':' after property name in JSON at position 10",
            name: "BadRequestError",
          },
          done,
        );
    });
  });
});
