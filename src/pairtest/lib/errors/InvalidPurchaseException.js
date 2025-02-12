import { HTTP_STATUS_CODES } from "../../../constants.js";

export default class InvalidPurchaseException extends Error {
  constructor(message, code) {
    super(message, code);
    this.message = message || "Invalid Purchase Exception";
    this.code = code || HTTP_STATUS_CODES.BAD_REQUEST;
    this.name = this.constructor.name;
  }
}
