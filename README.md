# cinema-tickets-javascript

An [Express](https://www.npmjs.com/package/express) application for the cinema tickets coding exercise. My initial focus was on creating a functional implementation of the TicketService that adheres to the rules and objectives outlined in the task. After establishing this service, I built an Express app around it, allowing users to submit requests to the TicketService and receive responses.

Here is my [Pull Request](https://github.com/SamJT2021/cinema-tickets/pull/2) that outlines my progress throughout the exercise.

---

## Table of Contents

- [Installation](#installation)
- [Running the application](#running-the-application)
- [Usage](#usage)
- [Tests and Coverage](#tests-and-coverage)
- [Validation and Errors](#validation-and-errors)
- [Linting](#linting)

---

## Installation

### Prerequisites

- [NodeJS](https://nodejs.org/en) version 20 or higher.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/SamJT2021/cinema-tickets.git
   ```
2. Navigate to the project directory:
   ```bash
   cd cinema-tickets
   ```
3. Make an .env file, using the .env.sample
   ```bash
   cp .env.sample .env
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the application

### Prerequisites

- To run inside of a Docker container, an application like [Docker Desktop](https://www.docker.com/products/docker-desktop/) is required.

### Steps

There are a several ways to run the app. Within the project directory:

- Run with [Nodemon](https://www.npmjs.com/package/nodemon) for development:
  ```bash
  npm run dev
  ```
- Or run without Nodemon:
  ```bash
  npm run start
  ```
- Or Docker Build and Run:

  Build:
  ```bash
  npm run docker:build
  ```

  Run:
  ```bash
  npm run docker:run
  ```

- Or run with Docker compose:
  ```bash
  docker-compose up
  ```

---

## Usage

An application like [Insomnia REST](https://insomnia.rest/) can be used to send requests to the port where the cinema-tickets application is running.

### Valid request body JSON

```
{
  "accountId": 123456,
  "tickets": {
    "ADULT": 2,
    "CHILD": 1,
    "INFANT": 1
  }
}
```

```
{
  "accountId": 123456,
  "tickets": {
    "ADULT": 2
  }
}
```

### Successful response

```
{
	"status": "Success",
	"code": 200,
	"totalNoOfTickets": 4,
	"ticketsOverview": {
		"ADULT": 2,
		"CHILD": 1,
		"INFANT": 1
	},
	"totalCost": 65,
	"currency": "GBP",
	"totalSeats": 3
}
```

### Failed responses

#### InvalidPurchaseException

```
{
	"status": "Failure",
	"code": 400,
	"name": "InvalidPurchaseException",
	"message": "There must be at least 1 adult ticket per infant ticket"
}
```

#### BadRequestError

```
{
	"status": "Failure",
	"code": 400,
	"name": "BadRequestError",
	"message": "tickets are required"
}
```

#### ResourceNotFoundError

```
{
	"status": "Failure",
	"code": 404,
	"name": "ResourceNotFoundError",
	"message": "Resource Not Found",
	"method": "POST",
	"url": "/tickets/urchase"
}
```

#### InternalServerError

```
{
    "status": "Failure",
	"code": 500,
	"name": "InternalServerError",
	"message": "Internal Server Error"
}
```

---

## Tests and Coverage

Unit tests and coverage are ran using [Mocha](https://www.npmjs.com/package/mocha), [Chai](https://www.npmjs.com/package/chai), [Sinon](https://www.npmjs.com/package/sinon), [c8](https://www.npmjs.com/package/c8), and [SuperTest](https://www.npmjs.com/package/supertest).

Within the project directory,

To run unit tests:

```bash
npm run test:unit
```

To run test coverage:

```bash
npm run test:coverage
```

---

## Validation and Errors

### Error Types

| Error Type | Description |
|------------|-------------| 
| InvalidPurchaseException | For requests that fail business rule validation, such as trying to purchase more tickets than the allowed maximum per transaction.                                                                       |
| ValidationError          | Instead of a standard `TypeError`, the `ValidationError` class permits intentional error messages to be thrown and sent back to the user. Whereas a `TypeError` can occur unintentionally through a bug. |
| BadRequestError          | For requests that fail data validation, such as a field is undefined or there is an unexpected character in the request JSON.                                                                            |
| ResourceNotFoundError    | For requests to an endpoint that does not exist.                                                                                                                                                         |
| InternalServerError      | For server side errors that are no fault of the request.                                                                                                                                                 |

### Assumptions

- The accountId should be linked to the user's verified account, instead of manual entry in the request, to prevent incorrect payment requests that could affect other account holders. Therefore any accountId errors have been considered a `BadRequestError`, instead of a `InvalidPurchaseException` which would be for a user error.
- Likewise, if there are any validation errors in the request body - such as it being empty, there are no tickets, or containing unexpected characters in the JSON format - this has been considered as a `BadRequestError` as this may be no fault of a user.

### Logging

Application logging is handled using [Winston](https://www.npmjs.com/package/winston). Various optional environment variables can control the output of error logging:

| .env variable       | Type    | Description                                                                                                                                                                                |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| OUTPUT_LOGS_TO_FILE | Boolean | To output errors to a file. By default, this is set to log errors to the terminal running the application.                                                                                 |
| LOG_PATH            | String  | An alternative filepath for the logs to be output to. By default, this is set to `logs/application-logs.log`.                                                                              |
| LOG_LEVEL           | String  | Sets the severity of the error logging levels, see [Winston's Logging Levels](https://www.npmjs.com/package/winston#logging-levels) for more detail. By default, this is set to `"debug"`. |

## Linting

Linting is performed using [ESLint](https://www.npmjs.com/package/eslint) using the [@dwp/eslint-config-base](https://www.npmjs.com/package/@dwp/eslint-config-base) configuration. Additionally, a pre-commit hook using [Husky](https://www.npmjs.com/package/husky) has been included to prevent code quality errors from being pushed.

To manually run linting tests, within the project directory:

```bash
npm run test:lint
```
