import ValidationError from "../errors/ValidationError.js";

export default class AccountIdValidator {
  static validateAccountId = (accountId) => {
    if (accountId === undefined) {
      throw new ValidationError("accountId is required");
    }

    if (!Number.isInteger(accountId)) {
      throw new ValidationError("accountId must be an integer");
    }

    if (accountId <= 0) {
      throw new ValidationError("accountId must be greater than 0");
    }
  };
}
