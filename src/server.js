import app from "./app.js";
import Logger from "./logger.js";

const appLogger = new Logger().getLogger();

const { PORT } = process.env;

app.listen(PORT, () => {
  appLogger.info("App listening at http://localhost:%s", PORT);
});
