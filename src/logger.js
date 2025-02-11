import * as winston from "winston";

const { combine, timestamp, printf, colorize, splat, json } = winston.format;

export default class Logger {
  #logLevel;
  #logFilePath;
  #outputLogsToFile;
  #logger;

  constructor() {
    const { LOG_LEVEL, LOG_PATH, OUTPUT_LOGS_TO_FILE } = process.env;

    this.#logLevel = LOG_LEVEL || "debug";
    this.#logFilePath = LOG_PATH || "logs/application-logs.log";
    this.#outputLogsToFile = OUTPUT_LOGS_TO_FILE === "true";

    this.#logger = winston.createLogger({
      level: this.#logLevel,
      transports: [
        this.#outputLogsToFile
          ? this.#addFileTransport()
          : this.#createConsoleTransport(),
      ],
    });
  }

  #createConsoleTransport() {
    return new winston.transports.Console({
      level: this.#logLevel,
      format: combine(
        splat(),
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
        printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] ${level}: ${message}`,
        ),
      ),
    });
  }

  #addFileTransport() {
    return new winston.transports.File({
      level: "error",
      filename: this.#logFilePath,
      format: combine(
        timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
        json(),
      ),
    });
  }

  getLogger() {
    return this.#logger;
  }
}
