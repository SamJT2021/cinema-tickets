import InternalServerError from "../lib/errors/InternalServerError.js";
import ResourceNotFoundError from "../lib/errors/ResourceNotFoundError.js";
import BadRequestError from "../lib/errors/BadRequestError.js";
import { HTTP_STATUS_CODES } from "../../constants.js";
import { handleErrorResponse } from "../lib/helpers/error-helpers.js";

const globalErrorHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  req.appLogger.error(err.stack);
  return handleErrorResponse(new InternalServerError(), res);
};

const resourceNotFound = (req, res) => {
  const error = new ResourceNotFoundError(req.url, req.method);
  req.appLogger.error(error);
  return handleErrorResponse(error, res);
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
    return handleErrorResponse(new BadRequestError(err.message), res);
  }

  return next(err);
};

export { globalErrorHandler, resourceNotFound, invalidJSONHandler };
