import { expect } from "chai";

import BadRequestError from "../../../src/pairtest/lib/errors/BadRequestError.js";

describe("BadRequestError", () => {
  context("constructor", () => {
    it("should return default message", () => {
      expect(new BadRequestError().message).to.be.eql("Bad Request");
    });

    it("should return passed message", () => {
      expect(new BadRequestError("test", 400).message).to.be.eql("test");
    });

    it("should return default code", () => {
      expect(new BadRequestError().code).to.be.eql(400);
    });

    it("should return passed code", () => {
      expect(new BadRequestError("test", 422).code).to.be.eql(422);
    });

    it("should return name", () => {
      expect(new BadRequestError().name).to.be.eql("BadRequestError");
    });
  });
});
