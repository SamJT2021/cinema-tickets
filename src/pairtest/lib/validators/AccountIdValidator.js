export default class AccountIdValidator {
  static validateAccountId = (accountId) => {
    if (accountId === undefined) {
      throw new TypeError("accountId is required");
    }

    if (!Number.isInteger(accountId)) {
      throw new TypeError("accountId must be an integer");
    }

    if (accountId <= 0) {
      throw new TypeError("accountId must be greater than 0");
    }
  };
}
