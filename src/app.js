import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";

import { ticketRoutes } from "./pairtest/routes/tickets.js";
import { appLogger } from "./pairtest/middleware/app-logger.js";
import {
  globalErrorHandler,
  resourceNotFound,
  invalidJSONHandler,
} from "./pairtest/middleware/error-handler.js";

const app = express();
app.use(appLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(invalidJSONHandler);

ticketRoutes(app);

app.use(globalErrorHandler, resourceNotFound);

export default app;
