import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { validateMatchData } from "../services/schemaValidator.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const payload = req.body;
  const apiKey = req.headers["authorization"]?.replace("Bearer ", "");

  if (!apiKey) {
    return res.status(401).json({ error: "Unauthorized: Missing API key" });
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("api_key", apiKey);

  if (error || users.length === 0) {
    return res.status(403).json({ error: "Invalid API key", message: error });
  }

  const { isValid, errors } = validateMatchData(payload);

  if (!isValid) {
    return res
      .status(400)
      .json({ error: "Invalid match data", details: errors });
  }

  const { error: insertError } = await supabase
    .from("match_data")
    .insert(payload);

  if (insertError) {
    return res.status(500).json({
      error: "Database insert failed",
      details: insertError.message,
    });
  }

  res.status(201).json({
    message: `${payload.data.length} matches submitted successfully`,
  });
});

export default router;
