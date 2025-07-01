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

  res.status(201).json({ message: "Match data verified" });
});

export default router;
