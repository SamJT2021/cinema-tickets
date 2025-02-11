import { STATUS_RESPONSES } from "../../../constants.js";

function handleErrorResponse(error, res) {
  const { code, name, message } = error;
  return res.status(code).json({
    status: STATUS_RESPONSES.FAILURE,
    code,
    name,
    message,
  });
}

export { handleErrorResponse };
