import InternalServerError from "../lib/errors/InternalServerError.js";

const globalErrorHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  req.appLogger.error(err.stack);
  const { code, name, message } = new InternalServerError();
  return res.status(code).json({ status: "Failure", code, name, message });
};

export { globalErrorHandler };
