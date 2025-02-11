import { assert } from "chai";

import AccountIdValidator from "../../../src/pairtest/lib/validators/AccountIdValidator.js";

describe("AccountIdValidator", () => {
  describe("validateAccountId", () => {
    it("should throw an error if acountId is undefined", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId(),
        TypeError,
        "accountId is required",
      );
    });

    it("should throw an error if acountId is not a number", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId("test"),
        TypeError,
        "accountId must be an integer",
      );
    });

    it("should throw an error if acountId is a number as a string", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId("123456"),
        TypeError,
        "accountId must be an integer",
      );
    });

    it("should throw an error if acountId is a float", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId(1.23456),
        TypeError,
        "accountId must be an integer",
      );
    });

    it("should throw an error if acountId is 0", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId(0),
        TypeError,
        "accountId must be greater than 0",
      );
    });

    it("should throw an error if acountId is less than 0", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId(-1),
        TypeError,
        "accountId must be greater than 0",
      );
    });
  });
});
