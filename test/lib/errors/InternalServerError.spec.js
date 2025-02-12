import { expect } from "chai";

import InternalServerError from "../../../src/pairtest/lib/errors/InternalServerError.js";

describe("InternalServerError", () => {
  context("constructor", () => {
    it("should return default message", () => {
      expect(new InternalServerError().message).to.be.eql(
        "Internal Server Error",
      );
    });

    it("should return message passed as a parameter", () => {
      expect(new InternalServerError("Error Message").message).to.be.eql(
        "Error Message",
      );
    });

    it("should return default code", () => {
      expect(new InternalServerError().code).to.be.eql(500);
    });

    it("should return message passed as a parameter", () => {
      expect(new InternalServerError("Error Message", 502).code).to.be.eql(502);
    });

    it("should return name", () => {
      expect(new InternalServerError().name).to.be.eql("InternalServerError");
    });
  });
});
