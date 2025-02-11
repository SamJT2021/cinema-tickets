import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";

import { ticketRoutes } from "./pairtest/routes/tickets.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

ticketRoutes(app);

export default app;
