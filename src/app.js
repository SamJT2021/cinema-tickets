import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";

import { ticketRoutes } from "./pairtest/routes/tickets.js";
import { appLogger } from "./pairtest/middleware/app-logger.js";
import { globalErrorHandler } from "./pairtest/middleware/error-handler.js";

const app = express();
app.use(appLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

ticketRoutes(app);

app.use(globalErrorHandler);

export default app;
