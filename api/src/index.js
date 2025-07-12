import express from "express";
import submitRoute from "./routes/submit.js";
import validateRoute from './routes/validate.js';
import matchesRoute from "./routes/matches.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("RoboHub API");
});
app.get('/ping', (req, res) => {
  res.sendStatus(200);
});

app.use("/submit", submitRoute);
app.use('/validate', validateRoute);
app.use("/matches", matchesRoute);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
