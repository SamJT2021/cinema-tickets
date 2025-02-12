import sinon from "sinon";
import app from "../src/app.js";
import Logger from "../src/logger.js";

const sandbox = sinon.createSandbox();

describe("server", () => {
  let infoLoggerStub;
  let appListenStub;

  beforeEach(async () => {
    infoLoggerStub = sandbox.stub(Logger.prototype, "getLogger").returns({
      info: sandbox.stub(),
    });
    appListenStub = sandbox.stub(app, "listen").callsFake((port, callback) => {
      callback();
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should call listener and log app port", async () => {
    process.env.PORT = 3001;
    await import("../src/server.js");

    sinon.assert.calledWith(appListenStub, "3001", sinon.match.func);
    sinon.assert.calledWith(
      infoLoggerStub().info,
      "App listening at http://localhost:%s",
      "3001",
    );
  });
});
