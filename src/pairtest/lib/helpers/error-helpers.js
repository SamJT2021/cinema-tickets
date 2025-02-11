function handleErrorResponse(error, res) {
  const { code, name, message } = error;
  return res.status(code).json({
    status: "Failure",
    code,
    name,
    message,
  });
}

export { handleErrorResponse };
