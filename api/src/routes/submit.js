import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { validateMatchData } from "../services/schemaValidator.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const payload = req.body;

  const { isValid, errors } = validateMatchData(payload);

  if (!isValid) {
    return res
      .status(400)
      .json({ error: "Invalid match data", details: errors });
  }

  const { error } = await supabase.from("match_data").insert(payload);

  if (error) {
    return res.status(500).json({
      error: "Database insert failed",
      details: error.message,
    });
  }

  res.status(201).json({
    message: `${payload.data.length} matches submitted successfully`,
  });
});

export default router;
