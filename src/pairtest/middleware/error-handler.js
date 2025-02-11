import InternalServerError from "../lib/errors/InternalServerError.js";
import ResourceNotFoundError from "../lib/errors/ResourceNotFoundError.js";
import BadRequestError from "../lib/errors/BadRequestError.js";
import { STATUS_RESPONSES, HTTP_STATUS_CODES } from "../../constants.js";

const { FAILURE } = STATUS_RESPONSES;

const globalErrorHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  req.appLogger.error(err.stack);
  const { code, name, message } = new InternalServerError();
  return res.status(code).json({ status: FAILURE, code, name, message });
};

const resourceNotFound = (req, res) => {
  const error = new ResourceNotFoundError(req.url, req.method);
  req.appLogger.error(error);
  const { code, name, message, method, url } = error;
  return res
    .status(code)
    .json({ status: FAILURE, code, name, message, method, url });
};

const invalidJSONHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (
    err instanceof SyntaxError &&
    err.status === HTTP_STATUS_CODES.BAD_REQUEST &&
    "body" in err
  ) {
    req.appLogger.error(err.stack);
    const { code, name, message } = new BadRequestError(err.message);
    return res.status(code).json({ status: FAILURE, code, name, message });
  }

  return next(err);
};

export { globalErrorHandler, resourceNotFound, invalidJSONHandler };
