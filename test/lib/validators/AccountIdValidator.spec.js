import { assert } from "chai";

import AccountIdValidator from "../../../src/pairtest/lib/validators/AccountIdValidator.js";
import ValidationError from "../../../src/pairtest/lib/errors/ValidationError.js";

describe("AccountIdValidator", () => {
  describe("validateAccountId", () => {
    it("should throw an error if acountId is undefined", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId(),
        ValidationError,
        "accountId is required",
      );
    });

    it("should throw an error if acountId is not a number", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId("test"),
        ValidationError,
        "accountId must be an integer",
      );
    });

    it("should throw an error if acountId is a number as a string", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId("123456"),
        ValidationError,
        "accountId must be an integer",
      );
    });

    it("should throw an error if acountId is a float", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId(1.23456),
        ValidationError,
        "accountId must be an integer",
      );
    });

    it("should throw an error if acountId is 0", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId(0),
        ValidationError,
        "accountId must be greater than 0",
      );
    });

    it("should throw an error if acountId is less than 0", () => {
      assert.throws(
        () => AccountIdValidator.validateAccountId(-1),
        ValidationError,
        "accountId must be greater than 0",
      );
    });
  });
});
