import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { validateMatchData } from "../services/schemaValidator.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const payload = req.body;

  const isBatch = Array.isArray(payload);

  const matches = isBatch ? payload : [payload];

  for (const match of matches) {
    const { isValid, errors } = validateMatchData(match);
    if (!isValid) {
      return res.status(400).json({
        error: "Invalid match data",
        details: errors,
        data: match,
      });
    }
  }

  const insertData = matches.map((match) => ({ data: match }));

  const { error } = await supabase.from("match_data").insert(insertData);

  if (error) {
    return res.status(500).json({
      error: "Database insert failed",
      details: error.message,
    });
  }

  res.status(201).json({
    message: isBatch
      ? `${matches.length} matches submitted successfully`
      : "Match submitted successfully",
  });
});

export default router;
