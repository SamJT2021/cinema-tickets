import { HTTP_STATUS_CODES } from "../../../constants.js";

export default class ResourceNotFoundError extends Error {
  constructor(url, method, message) {
    super(message);
    this.url = url;
    this.method = method;
    this.message = message || "Resource Not Found";
    this.code = HTTP_STATUS_CODES.RESOURCE_NOT_FOUND;
    this.name = this.constructor.name;
  }
}
