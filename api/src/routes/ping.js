import express from "express";
import { supabase } from "../services/supabaseClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data: rows, error } = await supabase
    .from("ping")
    .select("ping")
    .limit(1);

  if (error) {
    return res
      .status(500)
      .json({ error: "Failed to query data", details: error.message });
  }

  return res.status(200).json(rows[0].ping);
});

export default router;