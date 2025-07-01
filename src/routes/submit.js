import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { validateMatchData } from '../services/schemaValidator.js';

const router = express.Router();

router.post("/", async (req, res) => {
  const matchData = req.body;

  const { isValid, errors } = validateMatchData(matchData);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid match data', details: errors });
  }

  const { error } = await supabase
    .from("match_data")
    .insert({ data: matchData });
  if (error) {
    return res.status(500).json({
      error: "Database insert failed " + req.body,
      details: error.message,
    });
  }

  res.status(201).json({ message: "Match data submitted successfully" });
});

export default router;
