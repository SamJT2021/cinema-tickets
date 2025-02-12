import { expect } from "chai";

import ValidationError from "../../../src/pairtest/lib/errors/ValidationError.js";

describe("ValidationError", () => {
  context("constructor", () => {
    it("should return default message", () => {
      expect(new ValidationError().message).to.be.eql("Validation Error");
    });

    it("should return passed message", () => {
      expect(new ValidationError("test").message).to.be.eql("test");
    });

    it("should return name", () => {
      expect(new ValidationError().name).to.be.eql("ValidationError");
    });
  });
});
