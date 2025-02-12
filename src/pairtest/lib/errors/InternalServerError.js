import { HTTP_STATUS_CODES } from "../../../constants.js";

export default class InternalServerError extends Error {
  constructor(message, code) {
    super(message, code);
    this.message = message || "Internal Server Error";
    this.code = code || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    this.name = this.constructor.name;
  }
}
