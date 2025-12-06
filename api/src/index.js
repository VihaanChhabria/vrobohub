import express from "express";
import submitRoute from "./routes/submit.js";
import validateRoute from "./routes/validate.js";
import matchesRoute from "./routes/matches.js";
import eventsRoute from "./routes/events.js";
import pingRoute from "./routes/ping.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("RoboHub API");
});
app.get("/ping", pingRoute);
app.use("/submit", submitRoute);
app.use("/validate", validateRoute);
app.use("/matches", matchesRoute);
app.use("/events", eventsRoute);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
