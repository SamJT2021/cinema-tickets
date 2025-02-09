import { expect } from "chai";

import InvalidPurchaseException from "../../../src/pairtest/lib/errors/InvalidPurchaseException.js";

describe("InvalidPurchaseException", () => {
  context("constructor", () => {
    it("should return default message", () => {
      expect(new InvalidPurchaseException().message).to.be.eql(
        "Invalid Purchase Exception",
      );
    });

    it("should return message passed as a parameter", () => {
      expect(new InvalidPurchaseException("Error Message").message).to.be.eql(
        "Error Message",
      );
    });

    it("should return default code", () => {
      expect(new InvalidPurchaseException().code).to.be.eql(400);
    });

    it("should return message passed as a parameter", () => {
      expect(new InvalidPurchaseException("Error Message", 422).code).to.be.eql(
        422,
      );
    });

    it("should return name", () => {
      expect(new InvalidPurchaseException().name).to.be.eql(
        "InvalidPurchaseException",
      );
    });
  });
});
