import sinon from "sinon";

const overrideAppLogger = (app) => {
  app._router.stack.find((layer) => layer.name === "appLogger").handle = (
    req,
    res,
    next,
  ) => {
    req.appLogger = { error: sinon.stub() };
    return next();
  };
};

export { overrideAppLogger };
