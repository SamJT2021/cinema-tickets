import { assert } from "chai";
import TicketsRequestBodyValidator from "../../../src/pairtest/lib/validators/TicketsRequestBodyValidator.js";

describe("TicketsRequestBodyValidator", () => {
  describe("validateTicketsRequest", () => {
    it("should thow an error if tickets are undefined", () => {
      assert.throws(
        () => TicketsRequestBodyValidator.validateTicketsRequest(),
        "tickets are required",
      );
    });

    it("should thow an error if tickets are an Array", () => {
      assert.throws(
        () => TicketsRequestBodyValidator.validateTicketsRequest([]),
        "tickets must be an object with key-value pairs",
      );
    });

    it("should thow an error if tickets are a function", () => {
      assert.throws(
        () => TicketsRequestBodyValidator.validateTicketsRequest(() => {}),
        "tickets must be an object with key-value pairs",
      );
    });

    it("should thow an error if tickets are an empty object", () => {
      assert.throws(
        () => TicketsRequestBodyValidator.validateTicketsRequest({}),
        "tickets object must not be empty",
      );
    });

    it("should not throw an error when a valid tickets object is provided", () => {
      assert.doesNotThrow(() =>
        TicketsRequestBodyValidator.validateTicketsRequest({ ADULT: 2 }),
      );
    });
  });
});
