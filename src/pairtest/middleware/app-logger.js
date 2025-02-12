import Logger from "../../logger.js";

const appLogger = (req, res, next) => {
  req.appLogger = new Logger().getLogger();
  return next();
};

export { appLogger };
