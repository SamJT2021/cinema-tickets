import app from "./app.js";

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log("App listening at http://localhost:%s", PORT);
});
