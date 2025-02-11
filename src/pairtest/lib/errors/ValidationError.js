export default class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Validation Error";
    this.name = this.constructor.name;
  }
}
